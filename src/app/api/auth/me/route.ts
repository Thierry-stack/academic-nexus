import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import User from '@/models/User';
import { verifyToken, AuthError } from '@/lib/auth';
import {
  isMongoUriMissing,
  MONGO_URI_MISSING_MESSAGE,
  mongoConnectFailedBody,
  isMongoConfigErrorMessage,
  isMongoConnectivityFailure,
} from '@/lib/mongoEnv';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  let token: string | undefined;
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else {
    token = request.cookies.get('auth_token')?.value;
  }

  if (!token?.trim()) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  let payload: ReturnType<typeof verifyToken>;
  try {
    payload = verifyToken(token);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    throw error;
  }

  if (isMongoUriMissing()) {
    return NextResponse.json({ error: MONGO_URI_MISSING_MESSAGE }, { status: 503 });
  }

  try {
    await connectDB();

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

    if (error instanceof Error && isMongoConfigErrorMessage(error.message)) {
      return NextResponse.json({ error: MONGO_URI_MISSING_MESSAGE }, { status: 503 });
    }

    if (isMongoConnectivityFailure(error)) {
      return NextResponse.json(
        { error: mongoConnectFailedBody(error) },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: 'Failed to load session' }, { status: 500 });
  }
}
