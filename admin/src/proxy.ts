import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@educatedplanet/dataservice';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/auth/login', '/auth/register'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // API routes
  const isApiRoute = pathname.startsWith('/api');

  // Skip middleware for public routes and API routes (except auth API)
  if (isPublicRoute || (isApiRoute && !pathname.startsWith('/api/auth'))) {
    return NextResponse.next();
  }

  // Check for session
  const cookie = request.cookies.get('eduplanet-admin-session');
  const token = cookie?.value;

  let session = null;
  if (token) {
    try {
      // Validate session using dataservice
      const sessionData = await validateSession(token);
      if (sessionData) {
        session = sessionData;
      }
    } catch (error) {
      console.error('Session validation error:', error);
    }
  }

  // If no session and not on public route, redirect to login
  if (!session) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is on root or auth page and has session, redirect to dashboard
  if ((pathname === '/' || pathname.startsWith('/auth')) && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Continue with the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};