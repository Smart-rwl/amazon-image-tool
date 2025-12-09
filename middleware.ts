import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PREFIXES = ['/dashboard', '/products'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const hasAuth = req.cookies.get('admin_auth')?.value === '1';

  if (!hasAuth) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/products/:path*'],
};
