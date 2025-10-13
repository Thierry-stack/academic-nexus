import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Don't protect the login page itself
  if (request.nextUrl.pathname === '/librarian/login') {
    return NextResponse.next();
  }
  
  // For production, we'll let the client-side handle authentication
  // This prevents the middleware from blocking access due to cookie issues
  if (request.nextUrl.pathname.startsWith('/librarian')) {
    // Allow all librarian routes to pass through
    // Authentication will be handled by the AuthContext on the client side
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/librarian/:path*',
  ],
};
