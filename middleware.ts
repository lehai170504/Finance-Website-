// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const isWaiting2FA = request.cookies.get("temp_2fa_valid")?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/groups") ||
    pathname.startsWith("/wallets") ||
    pathname.startsWith("/transactions") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/reports");

  const isAuthRoute = pathname === "/login" || pathname === "/register";

  if (token) {
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (isWaiting2FA) {
    if (pathname === "/login") return NextResponse.next();

    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/groups/:path*",
    "/wallets/:path*",
    "/transactions/:path*",
    "/profile/:path*",
    "/reports/:path*",
    "/login",
    "/register",
  ],
};
