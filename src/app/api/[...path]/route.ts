import { NextRequest, NextResponse } from "next/server";
import { accessTokenCookie, backendUrl, refreshTokenCookie } from "@/lib/server-api";

const publicEndpoints = new Set([
  "POST auth/login",
  "POST auth/register",
  "POST auth/refresh",
  "POST account/password-recovery",
  "GET health",
]);

function errorResponse(message: string, statusCode: number) {
  return NextResponse.json(
    { success: false, statusCode, message, data: null },
    { status: statusCode }
  );
}

type SessionTokens = {
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: string;
  refreshExpiresAt: string;
  user: unknown;
};

function setSessionCookies(response: NextResponse, session: SessionTokens, request: NextRequest) {
  const secure = process.env.NODE_ENV === "production" || request.nextUrl.protocol === "https:";
  response.cookies.set(accessTokenCookie, session.accessToken, {
    httpOnly: true,
    sameSite: "strict",
    secure,
    path: "/",
    expires: new Date(session.accessExpiresAt),
  });
  response.cookies.set(refreshTokenCookie, session.refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure,
    path: "/",
    expires: new Date(session.refreshExpiresAt),
  });
}

function clearSessionCookies(response: NextResponse) {
  response.cookies.delete(accessTokenCookie);
  response.cookies.delete(refreshTokenCookie);
}

async function forward(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await context.params;
  if (segments.some((part) => !/^[a-zA-Z0-9:_-]+$/.test(part))) {
    return errorResponse("Invalid API path.", 400);
  }
  const path = segments.join("/");
  const accessToken = request.cookies.get(accessTokenCookie)?.value;
  const refreshToken = request.cookies.get(refreshTokenCookie)?.value;
  const logout = path === "auth/logout" && request.method === "POST";
  const manualRefresh = path === "auth/refresh" && request.method === "POST";
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
  if (
    !accessToken &&
    !refreshToken &&
    !publicEndpoints.has(`${request.method} ${path}`) &&
    !logout
  ) {
    return errorResponse("Please log in to continue.", 401);
  }
  let response: NextResponse;
  try {
    const requestBody = ["GET", "HEAD"].includes(request.method) ? undefined : await request.text();
    const requestBackend = (token: string, refresh = "") =>
      fetch(backendUrl(path) + request.nextUrl.search, {
        method: request.method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(refresh ? { "X-Refresh-Token": refresh } : {}),
        },
        body: requestBody,
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      });

    const refreshSession = async () => {
      if (!refreshToken) return null;
      const refreshResponse = await fetch(backendUrl("auth/refresh"), {
        method: "POST",
        headers: { Authorization: `Bearer ${refreshToken}` },
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      });
      if (!refreshResponse.ok) return null;
      const refreshData = (await refreshResponse.json()) as { data: SessionTokens };
      return refreshData.data;
    };

    let renewedSession: SessionTokens | null = null;
    let upstream = await requestBackend(
      manualRefresh ? (refreshToken ?? "") : (accessToken ?? ""),
      logout ? refreshToken : ""
    );
    if (
      upstream.status === 401 &&
      !logout &&
      !manualRefresh &&
      !publicEndpoints.has(`${request.method} ${path}`)
    ) {
      renewedSession = await refreshSession();
      if (renewedSession) upstream = await requestBackend(renewedSession.accessToken);
    }
    const data = await upstream.json();
    if (upstream.ok && (["auth/login", "auth/register"].includes(path) || manualRefresh)) {
      const session = data.data as SessionTokens;
      response = NextResponse.json(
        {
          ...data,
          data: { user: session.user, expiresAt: session.accessExpiresAt },
        },
        { status: upstream.status }
      );
      setSessionCookies(response, session, request);
    } else {
      response = NextResponse.json(data, { status: upstream.status });
      if (renewedSession) setSessionCookies(response, renewedSession, request);
      if (upstream.status === 401 && !publicEndpoints.has(`${request.method} ${path}`))
        clearSessionCookies(response);
    }
  } catch {
    response = errorResponse("The server is unavailable. Please try again.", 503);
  }
  if (logout) {
    clearSessionCookies(response);
  }
  response.headers.set("Cache-Control", "no-store");
  return response;
}
export { forward as GET, forward as POST, forward as PUT, forward as PATCH, forward as DELETE };
