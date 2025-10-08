// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import User from '@/models/User';
import { verifyToken, getTokenFromHeader, getTokenFromCookies } from '@/lib/auth';

export const dynamic = 'force-dynamic'; // <<< ensure runtime execution

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    let token: string | undefined;

    // Try Authorization header first
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      token = getTokenFromHeader(authHeader);
    } else {
      // Fallback to cookies
      token = getTokenFromCookies(request.cookies);
    }

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const payload = verifyToken(token);

    const user = await User.findById(payload.userId).select('-password');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
}
