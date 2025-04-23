import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isTokenExpired } from "@/lib/token";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const isAuthRoute = request.nextUrl.pathname === "/login";
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/profile");

  // Case 1: Protected route with expired token - clear cookie and redirect to login
  if (isProtectedRoute && token && isTokenExpired(token)) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.set({
      name: "auth-token",
      value: "",
      expires: new Date(0),
    });
    return response;
  }

  // Case 2: Protected route with no token - redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Case 3: Auth route with valid token - redirect to profile
  if (isAuthRoute && token && !isTokenExpired(token)) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  // Default: Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/login"],
};
