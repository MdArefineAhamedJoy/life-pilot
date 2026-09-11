import { NextRequest, NextResponse } from "next/server";
import { backendUrl, sessionCookie } from "@/lib/server-api";

const publicEndpoints = new Set([
  "POST auth/login",
  "POST auth/register",
  "POST account/password-recovery",
  "GET health",
]);

function errorResponse(message: string, statusCode: number) {
  return NextResponse.json(
    { success: false, statusCode, message, data: null },
    { status: statusCode }
  );
}

async function forward(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await context.params;
  if (segments.some((part) => !/^[a-zA-Z0-9:_-]+$/.test(part))) {
    return errorResponse("Invalid API path.", 400);
  }
  const path = segments.join("/");
  const token = request.cookies.get(sessionCookie)?.value;
  const logout = path === "auth/logout" && request.method === "POST";
  if (!["GET", "HEAD"].includes(request.method)) {
    const origin = request.headers.get("origin");
    const fetchSite = request.headers.get("sec-fetch-site");
    const acceptedFetchSites = new Set(["same-origin", "same-site", "none"]);
    if (origin && origin !== request.nextUrl.origin) {
      return errorResponse("Request origin is not allowed.", 403);
    }
    if (fetchSite && !acceptedFetchSites.has(fetchSite)) {
      return errorResponse("Request origin is not allowed.", 403);
    }
  }
  if (!token && !publicEndpoints.has(`${request.method} ${path}`) && !logout) {
    return errorResponse("Please log in to continue.", 401);
  }
  let response: NextResponse;
  try {
    const upstream = await fetch(backendUrl(path) + request.nextUrl.search, {
      method: request.method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.text(),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    const data = await upstream.json();
    if (upstream.ok && ["auth/login", "auth/register"].includes(path)) {
      const { token: newToken, ...session } = data.data;
      response = NextResponse.json({ ...data, data: session }, { status: upstream.status });
      response.cookies.set(sessionCookie, newToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production" || request.nextUrl.protocol === "https:",
        path: "/",
        expires: new Date(session.expiresAt),
      });
    } else {
      response = NextResponse.json(data, { status: upstream.status });
      if (upstream.status === 401 && !publicEndpoints.has(`${request.method} ${path}`))
        response.cookies.delete(sessionCookie);
    }
  } catch {
    response = errorResponse("The server is unavailable. Please try again.", 503);
  }
  if (logout) {
    response.cookies.delete(sessionCookie);
  }
  response.headers.set("Cache-Control", "no-store");
  return response;
}
export { forward as GET, forward as POST, forward as PUT, forward as PATCH, forward as DELETE };
