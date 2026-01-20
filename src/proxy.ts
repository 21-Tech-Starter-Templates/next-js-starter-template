import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/api/auth/signin',
  '/api/auth/callback',
  '/api/auth/signout',
  '/api/auth/session',
  '/api/auth/providers',
  '/api/auth/csrf'
];

// Define protected routes that require authentication
const protectedRoutes = ['/dashboard'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip proxy for static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/assets') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|css|js|woff2?)$/)
  ) {
    return NextResponse.next();
  }

  // Get the token to check authentication status
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  const isAuthenticated = !!token;
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route)
  );
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Log authentication status for debugging
  console.log(`[Proxy] ${pathname} - Authenticated: ${isAuthenticated}`);

  // Allow access to public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users trying to access protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const signInUrl = new URL('/', request.url);
    signInUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Check token expiry if authenticated
  if (isAuthenticated && token) {
    const now = Math.floor(Date.now() / 1000);
    const tokenExpiry = token.tokenExpiry as number;

    if (tokenExpiry && tokenExpiry <= now) {
      // Token expired, redirect to sign in
      const signInUrl = new URL('/', request.url);
      signInUrl.searchParams.set('callbackUrl', request.url);
      signInUrl.searchParams.set('error', 'SessionExpired');
      return NextResponse.redirect(signInUrl);
    }
  }

  // Allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
  ]
};
