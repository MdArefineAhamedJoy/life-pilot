import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { readFile, mkdir, cp } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, expect } from "@playwright/test";

const frontend = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const backend = path.resolve(frontend, "../life-os-back-end");
const backendRequire = createRequire(path.join(backend, "package.json"));
const { Pool } = backendRequire("pg");
try {
  process.loadEnvFile(path.join(backend, ".env"));
} catch {
  /* Environment variables may be supplied directly. */
}
const dbUrl = process.env.DATABASE_URL
  ? new URL(process.env.DATABASE_URL)
  : new URL("postgres://localhost");
if (!process.env.DATABASE_URL) {
  dbUrl.hostname = process.env.DATABASE_HOST || "localhost";
  dbUrl.port = process.env.DATABASE_PORT || "5432";
  dbUrl.username = process.env.DATABASE_USERNAME || "postgres";
  dbUrl.password = process.env.DATABASE_PASSWORD || "";
  dbUrl.pathname = "/" + (process.env.DATABASE_NAME || "life-pilot");
}
const admin = new Pool({
  connectionString: dbUrl.toString(),
  connectionTimeoutMillis: 5000,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});
const schema = "life_pilot_e2e_" + randomBytes(8).toString("hex");
const apiPort = process.env.TEST_API_PORT || "4100";
const webPort = process.env.TEST_WEB_PORT || "3100";
const api = "http://localhost:" + apiPort + "/api";
const web = "http://localhost:" + webPort;
const children = [];
const logs = [];
let browser;
let database;
let schemaCreated = false;
let checks = 0;
const check = (condition, message) => {
  assert.ok(condition, message);
  checks++;
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function start(entry, args, cwd, env, label) {
  const log = createWriteStream(path.join(frontend, ".tmp", label + ".log"));
  logs.push(log);
  const child = spawn(process.execPath, [entry, ...args], {
    cwd,
    env: { ...process.env, ...env },
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stdout.pipe(log);
  child.stderr.pipe(log);
  children.push(child);
  return child;
}
async function waitFor(url, child) {
  for (let attempt = 0; attempt < 120; attempt++) {
    if (child.exitCode !== null)
      throw new Error("Test server exited; inspect .tmp integration logs.");
    try {
      if ((await fetch(url, { signal: AbortSignal.timeout(3000) })).ok) return;
    } catch {
      /* Wait for server startup. */
    }
    await sleep(500);
  }
  throw new Error("Test server did not start: " + url);
}
async function request(context, method, endpoint, data, status) {
  const response = await context.request.fetch(web + "/api/" + endpoint, { method, data });
  check(
    status ? response.status() === status : response.ok(),
    method + " " + endpoint + ": " + response.status() + " " + (await response.text())
  );
  return response.json();
}
try {
  await mkdir(path.join(frontend, ".tmp"), { recursive: true });
  await admin.query('CREATE SCHEMA "' + schema + '"');
  schemaCreated = true;
  dbUrl.searchParams.set("options", "-c search_path=" + schema);
  database = new Pool({ connectionString: dbUrl.toString() });
  const journal = JSON.parse(
    await readFile(path.join(backend, "drizzle/meta/_journal.json"), "utf8")
  );
  for (const migration of journal.entries) {
    const sql = (
      await readFile(path.join(backend, "drizzle", migration.tag + ".sql"), "utf8")
    ).replaceAll('"public".', '"' + schema + '".');
    await database.query(sql);
  }
  console.log("Isolated database schema prepared.");
  const apiServer = await start(
    path.join(backend, "dist/main.js"),
    [],
    backend,
    { DATABASE_URL: dbUrl.toString(), API_PORT: apiPort, CORS_ORIGIN: web },
    "integration-api"
  );
  await waitFor(api + "/health", apiServer);
  const standalone = path.join(frontend, ".next/standalone");
  await cp(path.join(frontend, ".next/static"), path.join(standalone, ".next/static"), {
    recursive: true,
  });
  const webServer = await start(
    path.join(standalone, "server.js"),
    [],
    standalone,
    { API_BASE_URL: api, PORT: webPort, HOSTNAME: "localhost", NODE_ENV: "production" },
    "integration-web"
  );
  await waitFor(web + "/login", webServer);
  browser = await chromium.launch({
    headless: true,
    channel: process.env.TEST_BROWSER_CHANNEL || undefined,
  });
  const guest = await browser.newContext({ baseURL: web });
  const a = await browser.newContext({ baseURL: web, viewport: { width: 1440, height: 1000 } });
  const b = await browser.newContext({ baseURL: web });
  const routes = [
    "/",
    "/dashboard",
    "/budget",
    "/expenses",
    "/categories",
    "/tasks",
    "/routine",
    "/timer",
    "/notes",
    "/ai",
    "/calendar",
    "/reports",
    "/shopping",
    "/health",
    "/family",
    "/goals",
    "/meal-planner",
    "/reminder",
    "/settings",
    "/profile",
    "/scan-slip",
    "/receipt-scanner",
  ];
  for (const route of routes) {
    const response = await guest.request.get(route, { maxRedirects: 0 });
    check(
      response.status() === 307 && response.headers().location.includes("/login"),
      "Guest route blocked: " + route
    );
  }
  const guarded = [
    "auth/me",
    "account/profile",
    "health/db",
    "life-os/state",
    "life-os/categories",
    "life-os/expenses",
    "life-os/tasks",
    "life-os/timer-sessions",
    "life-os/notes",
    "life-os/settings",
  ];
  for (const endpoint of guarded) {
    check((await fetch(api + "/" + endpoint)).status === 401, "Backend guard: " + endpoint);
    await request(guest, "GET", endpoint, undefined, 401);
  }
  const userA = {
    name: "Integration A",
    email: "a-" + schema + "@example.test",
    phone: "0123456789",
    password: "Integration-test-password-73!",
  };
  const userB = { ...userA, name: "Integration B", email: "b-" + schema + "@example.test" };
  const page = await a.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/register");
  await page.evaluate(() =>
    localStorage.setItem(
      "life-pilot-state-v2",
      JSON.stringify({ notes: [{ id: "stale-cache", title: "Stale private note" }] })
    )
  );
  await page.locator('[name="name"]').fill(userA.name);
  await page.locator('[name="email"]').fill(userA.email);
  await page.locator('[name="phone"]').fill(userA.phone);
  await page.locator('[name="password"]').fill(userA.password);
  await page.locator('[name="confirmPassword"]').fill(userA.password);
  await page.locator('input[type="checkbox"]').check();
  await page.getByRole("button", { name: "Create account", exact: true }).click();
  await page.waitForURL("**/dashboard", { timeout: 30000 });
  await expect(page.getByRole("heading", { name: "Welcome back", exact: true })).toBeVisible();
  const cookies = await a.cookies();
  check(
    cookies.some(
      (cookie) =>
        cookie.name === "life-pilot-session" && cookie.httpOnly && cookie.sameSite === "Lax"
    ),
    "HttpOnly session cookie"
  );
  check(
    (await page.evaluate(() => localStorage.getItem("life-pilot-auth"))) === null,
    "No token in localStorage"
  );
  const signupB = await request(b, "POST", "auth/register", userB);
  check(!("token" in signupB), "BFF does not expose bearer tokens");
  const csrf = await a.request.post(web + "/api/life-os/notes", {
    headers: { origin: "https://untrusted.example" },
    data: { title: "Blocked", body: "" },
  });
  check(csrf.status() === 403, "Cross-origin mutations are blocked");
  check(
    (await a.request.get("/login", { maxRedirects: 0 })).headers().location.endsWith("/dashboard"),
    "Authenticated login page redirects"
  );
  const empty = await request(a, "GET", "life-os/state");
  for (const key of ["categories", "expenses", "tasks", "timerSessions", "notes"])
    check(empty[key].length === 0, "New account starts empty: " + key);
  check(empty.settings.profileName === userA.name, "Profile comes from registration");
  await request(guest, "POST", "auth/login", { email: userA.email, password: "wrong" }, 401);
  console.log("Guest routes, backend guards, registration, empty state and cookie checks passed.");

  // Real UI writes: categories, expenses and tasks. Observe the endpoint used.
  const writes = [];
  page.on("request", (req) => {
    if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method())) writes.push(req.url());
  });
  await page.goto("/categories");
  await page.getByRole("button", { name: "Add Category", exact: true }).click();
  let dialog = page.getByRole("dialog");
  await dialog.locator('[name="name"]').fill("Integration groceries");
  await dialog.getByRole("button", { name: "Add Category", exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByText("Integration groceries", { exact: true }).first()).toBeVisible();
  const [category] = await request(a, "GET", "life-os/categories");
  await request(a, "PATCH", "life-os/categories/" + category.id + "/limit", { monthlyLimit: 2000 });
  await page.goto("/expenses");
  await page.getByRole("button", { name: "Add Expense", exact: true }).click();
  dialog = page.getByRole("dialog");
  await dialog.locator('[name="itemName"]').fill("Integration rice");
  await dialog.locator('[name="category"]').selectOption({ label: category.name });
  await dialog.locator('[name="amount"]').fill("120");
  await dialog.getByRole("button", { name: "Save expense", exact: true }).click();
  await expect(dialog).toBeHidden();
  const [expense] = await request(a, "GET", "life-os/expenses");
  check(
    expense.itemName === "Integration rice" && expense.amount === 120,
    "Expense form persists through CRUD"
  );
  await page.getByRole("button", { name: "Add Expense", exact: true }).click();
  dialog = page.getByRole("dialog");
  await dialog.locator('[name="itemName"]').fill("Keep this draft");
  await dialog.locator('[name="amount"]').fill("30");
  await page.route("**/api/life-os/expenses", (route) =>
    route.request().method() === "POST"
      ? route.fulfill({
          status: 503,
          contentType: "application/json",
          body: JSON.stringify({ message: "Test save failure" }),
        })
      : route.continue()
  );
  await dialog.getByRole("button", { name: "Save expense", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Test save failure");
  await expect(dialog.locator('[name="itemName"]')).toHaveValue("Keep this draft");
  await page.unroute("**/api/life-os/expenses");
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await page.goto("/tasks");
  await page.getByRole("button", { name: "Create task", exact: true }).click();
  dialog = page.getByRole("dialog");
  await dialog.locator('[name="title"]').fill("Integration task");
  await dialog.getByRole("button", { name: "Create task", exact: true }).click();
  await expect(dialog).toBeHidden();
  const [task] = await request(a, "GET", "life-os/tasks");
  check(task.title === "Integration task", "Task form persists");
  check(
    writes.some((url) => url.endsWith("/life-os/categories")) &&
      writes.some((url) => url.endsWith("/life-os/expenses")) &&
      writes.some((url) => url.endsWith("/life-os/tasks")) &&
      !writes.some((url) => url.endsWith("/life-os/state")),
    "Forms use focused CRUD, not snapshot autosave"
  );

  await request(a, "PUT", "life-os/categories/" + category.id, {
    ...category,
    name: "Renamed groceries",
    monthlyLimit: 3000,
  });
  check(
    (await request(a, "GET", "life-os/expenses"))[0].category === "Renamed groceries",
    "Category rename propagates"
  );
  await request(a, "POST", "life-os/expenses/bulk", {
    rows: [{ itemName: "Bulk item", category: "Renamed groceries", amount: 15 }],
    date: expense.date,
  });
  await request(a, "PATCH", "life-os/tasks/" + task.id, { title: "Updated task" });
  const completed = await request(a, "PATCH", "life-os/tasks/" + task.id + "/status", {
    status: "completed",
  });
  check(Boolean(completed.completedAt), "Completion timestamp set");
  const pending = await request(a, "PATCH", "life-os/tasks/" + task.id + "/status", {
    status: "pending",
  });
  check(!pending.completedAt, "Completion timestamp cleared on reset");
  await request(a, "PATCH", "life-os/tasks/reorder", { orderedTaskIds: [task.id] });
  await request(a, "POST", "life-os/timer-sessions", {
    taskId: task.id,
    title: "Integration focus",
    category: "Work",
    mode: "focus",
    durationSeconds: 60,
  });
  const note = await request(a, "POST", "life-os/notes", {
    title: "Integration note",
    body: "Saved content",
    tags: ["shopping", "health"],
  });
  await request(a, "PUT", "life-os/notes/" + note.id, {
    title: "Updated note",
    body: "Changed content",
    tags: ["shopping", "health"],
  });
  await request(a, "PATCH", "life-os/settings", { currency: "USD", quietHoursStart: "21:00" });
  await request(a, "POST", "account/profile", {
    name: "Updated profile",
    phone: "0987654321",
    bio: "Integration profile",
  });
  check(
    (await request(a, "GET", "life-os/settings")).profileName === "Updated profile",
    "Profile stays consistent with settings"
  );
  check((await request(a, "GET", "health/db")).status === "ok", "Database health connected");
  await request(a, "POST", "account/password-recovery", { email: userA.email }, 501);
  await request(
    a,
    "POST",
    "life-os/expenses",
    { itemName: "Invalid", category: "Invalid", amount: -10, date: expense.date },
    400
  );
  await request(a, "PUT", "life-os/state", { categories: "invalid" }, 400);
  const snapshot = await request(a, "GET", "life-os/state");
  await request(a, "PUT", "life-os/state", snapshot);
  check(
    (await request(a, "GET", "life-os/state")).expenses.length === 2,
    "Backup replacement persists"
  );

  for (const key of ["categories", "expenses", "tasks", "timer-sessions", "notes"])
    check((await request(b, "GET", "life-os/" + key)).length === 0, "User B isolated: " + key);
  await request(b, "PATCH", "life-os/tasks/" + task.id, { title: "Cross-account edit" }, 404);
  await request(
    b,
    "PUT",
    "life-os/notes/" + note.id,
    { title: "Cross-account edit", body: "" },
    404
  );
  await request(b, "DELETE", "life-os/expenses/" + expense.id);
  check(
    (await request(a, "GET", "life-os/expenses")).length === 2,
    "Cross-account delete cannot remove A's data"
  );
  await request(b, "POST", "life-os/notes", { title: "B private note", body: "Separate account" });
  console.log("CRUD, profile, backup, validation and two-account isolation checks passed.");

  // Load every module using real authenticated data, including the tagged note collections.
  for (const route of routes.filter((route) => route !== "/")) {
    await page.goto(route);
    await expect(page.locator("main").first()).toBeVisible({ timeout: 15000 });
    check(!page.url().includes("/login"), "Authenticated module accessible: " + route);
  }
  await page.goto("/shopping");
  await expect(page.getByText("Updated note", { exact: true })).toBeVisible();
  await page.screenshot({
    path: path.join(frontend, ".tmp/integration-desktop.png"),
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "Welcome back", exact: true })).toBeVisible();
  check(
    (await page.locator("main").innerText()).includes("$"),
    "Saved currency is reflected in dashboard amounts"
  );
  check(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    "Mobile dashboard has no horizontal overflow"
  );
  await page.screenshot({
    path: path.join(frontend, ".tmp/integration-mobile.png"),
    fullPage: true,
  });
  await request(a, "DELETE", "life-os/notes/" + note.id);
  await request(a, "DELETE", "life-os/tasks/" + task.id);
  await request(a, "DELETE", "life-os/expenses/" + expense.id);
  await request(a, "DELETE", "life-os/categories/" + category.id);
  await request(a, "POST", "life-os/reset");
  check(
    (await request(a, "GET", "life-os/state")).timerSessions.length === 0,
    "Reset clears actual data"
  );
  check(
    (await request(b, "GET", "life-os/notes"))[0].title === "B private note",
    "Reset does not affect another account"
  );
  const secondTab = await a.newPage();
  await secondTab.goto("/notes");
  await expect(secondTab.getByRole("heading", { name: "Personal life database" })).toBeVisible();
  await page.getByRole("button", { name: "Log out", exact: true }).click();
  await page.waitForURL("**/login");
  await secondTab.waitForURL("**/login");
  await request(a, "GET", "life-os/state", undefined, 401);
  await page.locator('[name="email"]').fill(userA.email);
  await page.locator('[name="password"]').fill(userA.password);
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await page.waitForURL("**/dashboard");
  check(errors.length === 0, "No browser runtime errors: " + errors.join("; "));
  console.log(
    "PASS: " + checks + " assertions plus UI form, route, failure, mobile, login and logout checks."
  );
} finally {
  await browser?.close();
  for (const child of children.reverse()) {
    if (child.exitCode === null) {
      child.kill();
      await Promise.race([once(child, "exit"), sleep(3000)]);
    }
  }
  for (const log of logs) log.end();
  await database?.end();
  if (schemaCreated && /^life_pilot_e2e_[a-f0-9]{16}$/.test(schema))
    await admin.query('DROP SCHEMA "' + schema + '" CASCADE');
  await admin.end();
}
