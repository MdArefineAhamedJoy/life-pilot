import { NextRequest, NextResponse } from "next/server";
import { backendUrl, sessionCookie } from "@/lib/server-api";

const publicEndpoints = new Set(["POST auth/login", "POST auth/register", "POST account/password-recovery", "GET health"]);

function requestOrigin(request: NextRequest) {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host) return request.nextUrl.origin;

  const protocol = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(/:$/, "");
  return `${protocol}://${host}`;
}

async function forward(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await context.params;
  if (segments.some((part) => !/^[a-zA-Z0-9:_-]+$/.test(part))) {
    return NextResponse.json({ message: "Invalid API path." }, { status: 400 });
  }
  const path = segments.join("/");
  const token = request.cookies.get(sessionCookie)?.value;
  const logout = path === "auth/logout" && request.method === "POST";
  if (!["GET", "HEAD"].includes(request.method)) {
    const origin = request.headers.get("origin");
    if ((origin && origin !== requestOrigin(request)) || request.headers.get("sec-fetch-site") === "cross-site") {
      return NextResponse.json({ message: "Request origin is not allowed." }, { status: 403 });
    }
  }
  if (!token && !publicEndpoints.has(`${request.method} ${path}`) && !logout) {
    return NextResponse.json({ message: "Please log in to continue." }, { status: 401 });
  }
  let response: NextResponse;
  try {
    const upstream = await fetch(backendUrl(path) + request.nextUrl.search, {
      method: request.method,
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.text(),
      cache: "no-store", signal: AbortSignal.timeout(15000),
    });
    const data = await upstream.json();
    if (upstream.ok && ["auth/login", "auth/register"].includes(path)) {
      const { token: newToken, ...session } = data;
      response = NextResponse.json(session, { status: upstream.status });
      response.cookies.set(sessionCookie, newToken, {
        httpOnly: true, sameSite: "lax", secure: request.nextUrl.protocol === "https:",
        path: "/", expires: new Date(session.expiresAt),
      });
    } else {
      response = NextResponse.json(data, { status: upstream.status });
      if (upstream.status === 401 && !publicEndpoints.has(`${request.method} ${path}`)) response.cookies.delete(sessionCookie);
    }
  } catch {
    response = NextResponse.json({ message: "The server is unavailable. Please try again." }, { status: 503 });
  }
  if (logout) {
    response = NextResponse.json({ ok: true });
    response.cookies.delete(sessionCookie);
  }
  response.headers.set("Cache-Control", "no-store");
  return response;
}
export { forward as GET, forward as POST, forward as PUT, forward as PATCH, forward as DELETE };
