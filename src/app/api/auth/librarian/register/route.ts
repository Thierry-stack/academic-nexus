import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/database';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';
import {
  isMongoUriMissing,
  MONGO_URI_MISSING_MESSAGE,
  mongoConnectFailedBody,
  isMongoConfigErrorMessage,
  isMongoConnectivityFailure,
} from '@/lib/mongoEnv';

export const dynamic = 'force-dynamic';

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: number }).code === 11000
  );
}

export async function POST(request: NextRequest) {
  try {
    if (isMongoUriMissing()) {
      return NextResponse.json({ error: MONGO_URI_MISSING_MESSAGE }, { status: 503 });
    }

    let body: { email?: string; password?: string; name?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    await connectDB();

    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      name: name.trim(),
      role: 'librarian',
    });

    const response = NextResponse.json({
      message: 'Librarian account created',
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    // No session until they sign in on the login page — clear any stale cookie.
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error('Librarian registration error:', error);

    if (error instanceof mongoose.Error.ValidationError) {
      const firstKey = Object.keys(error.errors)[0];
      const msg = firstKey
        ? error.errors[firstKey].message
        : 'Invalid registration data';
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    if (isDuplicateKeyError(error)) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    if (error instanceof Error && isMongoConfigErrorMessage(error.message)) {
      return NextResponse.json({ error: MONGO_URI_MISSING_MESSAGE }, { status: 503 });
    }

    if (isMongoConnectivityFailure(error)) {
      return NextResponse.json({ error: mongoConnectFailedBody(error) }, { status: 503 });
    }

    const devHint =
      process.env.NODE_ENV === 'development' && error instanceof Error
        ? ` (${error.message})`
        : '';

    return NextResponse.json(
      { error: `Registration failed${devHint}` },
      { status: 500 }
    );
  }
}
