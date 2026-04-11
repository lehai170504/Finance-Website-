// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Nếu CHƯA LOGIN mà đòi vào các trang nội bộ (dashboard, groups, wallets,...)
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/groups") ||
    pathname.startsWith("/wallets") ||
    pathname.startsWith("/transactions") ||
    pathname.startsWith("/profile");

  if (isProtectedRoute && !token) {
    // Đá về trang login ngay lập tức
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Nếu ĐÃ LOGIN rồi mà đòi quay lại trang login/register
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  if (isAuthRoute && token) {
    // Đẩy thẳng vào dashboard, không cho quay lại
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Chỉ định middleware chạy cho các route nào
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/groups/:path*",
    "/wallets/:path*",
    "/transactions/:path*",
    "/profile/:path*",
    "/login",
    "/register",
  ],
};
