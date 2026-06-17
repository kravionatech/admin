// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  console.log('=== MIDDLEWARE ===', pathname);

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  console.log('accessToken:', accessToken ? 'EXISTS' : 'MISSING');
  console.log('refreshToken:', refreshToken ? 'EXISTS' : 'MISSING');

  const isAuthPage = pathname.startsWith('/auth');
  console.log('isAuthPage:', isAuthPage);

  if (isAuthPage) {
    if (accessToken || refreshToken) {
      console.log('=== REDIRECTING TO DASHBOARD ===');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}