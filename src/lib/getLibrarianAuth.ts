import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, AuthError } from '@/lib/auth';

export type LibrarianAuthResult =
  | { ok: true; userId: string; email: string }
  | { ok: false; response: NextResponse };

export function getLibrarianAuth(request: NextRequest): LibrarianAuthResult {
  const token = request.cookies.get('auth_token')?.value;
  if (!token?.trim()) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }
  try {
    const payload = verifyToken(token);
    if (payload.role !== 'librarian') {
      return {
        ok: false,
        response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
      };
    }
    return { ok: true, userId: payload.userId, email: payload.email };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        ok: false,
        response: NextResponse.json({ error: error.message }, { status: 401 }),
      };
    }
    return {
      ok: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }
}
