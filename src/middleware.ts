import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Don't protect the login page itself
  if (request.nextUrl.pathname === '/librarian/login') {
    return NextResponse.next();
  }
  
  // Protect all other librarian routes
  if (request.nextUrl.pathname.startsWith('/librarian')) {
    const authToken = request.cookies.get('auth_token')?.value;
    
    // If no auth token, redirect to login
    if (!authToken) {
      return NextResponse.redirect(new URL('/librarian/login', request.url));
    }
    
    try {
      if (!authToken || authToken === '') {
        return NextResponse.redirect(new URL('/librarian/login', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/librarian/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/librarian/:path*',
  ],
};
