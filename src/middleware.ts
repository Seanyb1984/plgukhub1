import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Define public paths that don't need a login
  const isPublicPath = path === "/login" || path === "/api/auth";

  // 2. Get the token
  // We explicitly pass the secret here to fix the "MissingSecret" error
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 3. Redirect logic
  // If they are logged in and try to go to login page, send them to admin
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/admin", request.nextUrl));
  }

  // If they are NOT logged in and try to go to a protected page, send to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  return NextResponse.next();
}

// Protect all routes except static files and auth APIs
export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};