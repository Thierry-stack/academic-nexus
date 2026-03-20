import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicLibrarianPaths = ['/librarian/login', '/librarian/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/librarian')) {
    return NextResponse.next();
  }

  if (publicLibrarianPaths.some((p) => pathname === p)) {
    return NextResponse.next();
  }

  const authToken = request.cookies.get('auth_token')?.value;
  if (!authToken) {
    return NextResponse.redirect(new URL('/librarian/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/librarian/:path*'],
};
