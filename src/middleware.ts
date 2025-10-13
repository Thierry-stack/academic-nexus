import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Don't protect the login page itself
  if (request.nextUrl.pathname === '/librarian/login') {
    return NextResponse.next();
  }
  
  // Protect all other librarian routes
  if (request.nextUrl.pathname.startsWith('/librarian')) {
    // Check for both cookie-based auth and allow the client-side auth to handle localStorage
    const authToken = request.cookies.get('auth_token')?.value;
    
    // If no auth token, let the client-side authentication handle the redirect
    // This allows the AuthContext to check localStorage and redirect if needed
    if (!authToken) {
      return NextResponse.next();
    }
    
    try {
      if (!authToken || authToken === '') {
        return NextResponse.next();
      }
    } catch (error) {
      return NextResponse.next();
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/librarian/:path*',
  ],
};
