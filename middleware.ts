// middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth?.token;
    
    // If logged in and trying to access auth pages, redirect to dashboard
    if (token && pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/dashboard/tests', req.url));
    }
    
    // If not logged in and trying to access dashboard, redirect to login
    if (!token && pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    
    // If logged in and on home page, redirect to dashboard
    if (token && pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard/tests', req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // Let middleware handle the logic
    },
  }
);

export const config = {
  matcher: ['/auth/:path*', '/dashboard/:path*', '/'],
};