// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Check if the user has the cookie set by your API
  const authCookie = request.cookies.get('admin_auth');
  const isAuthenticated = !!authCookie;

  // 2. Define protected routes
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');
  const isLoginPage = request.nextUrl.pathname.startsWith('/login');

  // 3. Logic:
  // If trying to go to dashboard but NOT logged in -> Redirect to Login
  if (isDashboardPage && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If trying to go to login but ALREADY logged in -> Redirect to Dashboard
  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};