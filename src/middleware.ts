import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const session = req.auth;
  const path = req.nextUrl.pathname;

  const isPublicPath = path === '/login' || path.startsWith('/api/auth');

  if (isPublicPath && session) {
    return NextResponse.redirect(new URL('/admin', req.nextUrl));
  }

  if (!isPublicPath && !session) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
