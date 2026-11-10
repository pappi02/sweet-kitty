// Sends visitors without a session cookie straight to the admin login.
// This is only a fast, optimistic check: every admin page, Server Action and
// upload route verifies the signed session itself (see lib/admin/auth.ts).
import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login" || request.cookies.has("sk_admin")) return NextResponse.next();
  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
