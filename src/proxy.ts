import { NextRequest, NextResponse } from "next/server";
import { accessTokenCookie, backendUrl, refreshTokenCookie } from "@/lib/server-api";

type SessionTokens = {
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: string;
  refreshExpiresAt: string;
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

export async function proxy(request: NextRequest) {
  const authPage = ["/login", "/register"].includes(request.nextUrl.pathname);
  const publicPage = authPage || request.nextUrl.pathname === "/";
  const accessToken = request.cookies.get(accessTokenCookie)?.value;
  const refreshToken = request.cookies.get(refreshTokenCookie)?.value;
  if (publicPage && !accessToken && !refreshToken) return NextResponse.next();
  if (accessToken || refreshToken) {
    try {
      const checkSession = (token: string) =>
        fetch(backendUrl("auth/me"), {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
          signal: AbortSignal.timeout(10000),
        });
      let renewedSession: SessionTokens | null = null;
      let result = accessToken
        ? await checkSession(accessToken)
        : new Response(null, { status: 401 });
      if (result.status === 401 && refreshToken) {
        const refreshResult = await fetch(backendUrl("auth/refresh"), {
          method: "POST",
          headers: { Authorization: `Bearer ${refreshToken}` },
          cache: "no-store",
          signal: AbortSignal.timeout(10000),
        });
        if (refreshResult.ok) {
          const refreshData = (await refreshResult.json()) as { data: SessionTokens };
          renewedSession = refreshData.data;
          result = await checkSession(renewedSession.accessToken);
        }
      }
      if (result.ok) {
        const response = authPage
          ? NextResponse.redirect(new URL("/dashboard", request.url))
          : NextResponse.next();
        if (renewedSession) setSessionCookies(response, renewedSession, request);
        return response;
      }
      if (result.status !== 401) throw new Error("Authentication unavailable");
    } catch {
      if (publicPage) return NextResponse.next();
      return new NextResponse(
        "Your session could not be checked because the server is unavailable. Please reload to try again.",
        {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
        }
      );
    }
  }
  const destination = new URL("/login", request.url);
  if (!publicPage)
    destination.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
  const response = publicPage ? NextResponse.next() : NextResponse.redirect(destination);
  response.cookies.delete(accessTokenCookie);
  response.cookies.delete(refreshTokenCookie);
  return response;
}
export const config = { matcher: ["/((?!api/|_next/static|_next/image|favicon.ico).*)"] };
