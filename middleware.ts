import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  if (token && pathname === '/') {
    return NextResponse.redirect(new URL('/privado/home', request.url));
  }

  if (!token && pathname.startsWith('/privado')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const validRoutes = ['/', '/cadsatro', '/privado/home', '/privado/usuario/[id]'];
  if (!validRoutes.includes(pathname) && pathname.startsWith('/privado')) {
    return NextResponse.redirect(new URL('/privado/home', request.url));
  } else if (!validRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/privado/:path*'],
};
