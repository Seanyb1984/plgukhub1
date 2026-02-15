import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// ============================================
// Role-based Route Protection Middleware
// ============================================
// Protects routes based on authentication and role:
//   /admin/*  → ADMIN or PRESCRIBER only
//   /dashboard/*, /treatment-journey/*, /command-centre/* → any authenticated user
//   /login, /, /api/auth/* → public

const PUBLIC_PATHS = ['/', '/login', '/api/auth'];

const ADMIN_PATHS = ['/admin'];

const ADMIN_ROLES = ['ADMIN', 'PRESCRIBER'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next();
  }

  // Allow static assets and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Get the JWT token (set by next-auth)
  const token = await getToken({ req: request });

  // Not authenticated → redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check /admin route access — ADMIN and PRESCRIBER only
  if (ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    const role = token.role as string;
    if (!ADMIN_ROLES.includes(role)) {
      // Forbidden — redirect to dashboard with error
      const dashUrl = new URL('/dashboard', request.url);
      dashUrl.searchParams.set('error', 'forbidden');
      return NextResponse.redirect(dashUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
