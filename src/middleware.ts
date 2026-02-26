import { auth } from '@/auth';
import { NextResponse } from 'next/server';

// ============================================
// Role-based Route Protection Middleware
// ============================================
// Protects routes based on authentication and role:
//   /admin/*  → ADMIN or PRESCRIBER only
//   /dashboard/*, /treatment-journey/*, /command-centre/* → any authenticated user
//   /login, /, /api/auth/* → public

const PUBLIC_PATHS = ['/', '/login', '/api/auth', '/forms'];

const ADMIN_PATHS = ['/admin'];

const ADMIN_ROLES = ['ADMIN', 'PRESCRIBER'];

export default auth((req) => {
  const { pathname } = req.nextUrl;

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

  // req.auth contains the session (Auth.js v5)
  const user = req.auth?.user;

  // Not authenticated → redirect to login
  if (!user) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check /admin route access — ADMIN and PRESCRIBER only
  if (ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    const role = (user as any)?.role as string;
    if (!ADMIN_ROLES.includes(role)) {
      // Forbidden — redirect to dashboard with error
      const dashUrl = new URL('/dashboard', req.url);
      dashUrl.searchParams.set('error', 'forbidden');
      return NextResponse.redirect(dashUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
