import { NextRequest, NextResponse } from "next/server";

const sessionCookie = "life-pilot-session";
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

type SessionPayload = {
  accessToken?: string;
  refreshToken?: string;
  rememberMe?: boolean;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SessionPayload;
    if (!body.accessToken) {
      return NextResponse.json(
        { success: false, message: "Session access token is required." },
        { status: 400 }
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(
      sessionCookie,
      JSON.stringify({ accessToken: body.accessToken, refreshToken: body.refreshToken }),
      body.rememberMe ? { ...cookieOptions, maxAge: 60 * 60 * 24 * 30 } : cookieOptions
    );
    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid session payload." },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get(sessionCookie);
  if (!cookie) return new NextResponse(null, { status: 204 });

  try {
    const data = JSON.parse(cookie.value) as SessionPayload;
    if (!data.accessToken) return new NextResponse(null, { status: 204 });
    return NextResponse.json({ success: true, data });
  } catch {
    return new NextResponse(null, { status: 204 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(sessionCookie, "", { ...cookieOptions, maxAge: 0 });
  return response;
}
