import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple middleware for development - in production, use proper JWT verification
export function middleware(request: NextRequest) {
  // Protect all librarian routes
  if (request.nextUrl.pathname.startsWith('/librarian')) {
    const authToken = request.cookies.get('auth_token')?.value;
    
    // If no auth token, redirect to login
    if (!authToken) {
      return NextResponse.redirect(new URL('/librarian/login', request.url));
    }
    
    // For development, we'll allow access with any token
    // In production, you would verify the JWT token here
    try {
      // Simple check - in production, verify JWT properly
      if (!authToken || authToken === '') {
        return NextResponse.redirect(new URL('/librarian/login', request.url));
      }
    } catch (error) {
      // Redirect to login if token is invalid
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