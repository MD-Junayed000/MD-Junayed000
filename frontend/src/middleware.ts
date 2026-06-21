import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin dashboard routes with a basic cookie presence check.
  // NOTE: This is NOT a cryptographic security boundary. The real authorization
  // gate is the backend API which validates JWT tokens on every request.
  // This middleware provides a UX improvement by redirecting unauthenticated
  // users to the login page instead of showing an empty dashboard shell.
  if (pathname.startsWith("/admin/dashboard")) {
    const authCookie = request.cookies.get("portfolio_admin_auth");
    if (!authCookie || !authCookie.value) {
      const loginUrl = new URL("/admin", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
