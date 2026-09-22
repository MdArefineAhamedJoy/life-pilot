import { NextResponse } from "next/server";

// Backend calls now go directly through the Guardly-style Axios client.
// This route only gives a clear response to obsolete same-origin /api URLs.
function notFound() {
  return NextResponse.json(
    { success: false, statusCode: 404, message: "API route not found.", data: null },
    { status: 404 }
  );
}

export {
  notFound as DELETE,
  notFound as GET,
  notFound as PATCH,
  notFound as POST,
  notFound as PUT,
};
