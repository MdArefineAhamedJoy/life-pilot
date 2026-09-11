import { NextRequest, NextResponse } from "next/server";
import { backendUrl, sessionCookie } from "@/lib/server-api";

export async function proxy(request: NextRequest) {
  const authPage = ["/login", "/register"].includes(request.nextUrl.pathname);
  const publicPage = authPage || request.nextUrl.pathname === "/";
  const token = request.cookies.get(sessionCookie)?.value;
  if (publicPage && !token) return NextResponse.next();
  if (token) {
    try {
      const result = await fetch(backendUrl("auth/me"), {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      });
      if (result.ok)
        return authPage
          ? NextResponse.redirect(new URL("/dashboard", request.url))
          : NextResponse.next();
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
  response.cookies.delete(sessionCookie);
  return response;
}
export const config = { matcher: ["/((?!api/|_next/static|_next/image|favicon.ico).*)"] };
