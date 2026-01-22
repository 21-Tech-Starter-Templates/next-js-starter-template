// Protecting routes with next-auth

import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isAuthenticated = !!req.auth;
  const { pathname } = req.nextUrl;

  // Skip middleware for static files, API routes, and assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/assets') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // If authenticated and on root, redirect to dashboard
  if (isAuthenticated && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // If not authenticated and trying to access dashboard, redirect to login
  if (!isAuthenticated && pathname.startsWith('/dashboard')) {
    const url = new URL('/', req.url);
    const redirectResponse = NextResponse.redirect(url);
    // Prevent caching of this redirect
    redirectResponse.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate'
    );
    return redirectResponse;
  }

  // Allow request to proceed
  return NextResponse.next();
});

// Named export for Next.js 16 compatibility
export const proxy = auth((req) => {
  const isAuthenticated = !!req.auth;
  const { pathname } = req.nextUrl;

  // Skip middleware for static files, API routes, and assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/assets') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // If authenticated and on root, redirect to dashboard
  if (isAuthenticated && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // If not authenticated and trying to access dashboard, redirect to login
  if (!isAuthenticated && pathname.startsWith('/dashboard')) {
    const url = new URL('/', req.url);
    const redirectResponse = NextResponse.redirect(url);
    // Prevent caching of this redirect
    redirectResponse.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate'
    );
    return redirectResponse;
  }

  // Allow request to proceed
  return NextResponse.next();
});
export const config = {
  matcher: [
    '/dashboard/:path*', // protected
    '/' // public
  ]
};
