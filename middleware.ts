// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // 🚀 RULE 1: If on login/register and has token, go to dashboard
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 🚀 RULE 2: If trying to access dashboard WITHOUT token, go to login
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// 🚀 CRITICAL: Exclude static files and the login page from the matcher if needed
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
