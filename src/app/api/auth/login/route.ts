import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import User from '@/models/User';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Only allow specific admin credentials
    if (email !== 'admin@academic.com' || password !== 'admin123') {
      return NextResponse.json(
        { error: 'Invalid credentials. Only authorized librarians can access this system.' },
        { status: 401 }
      );
    }
    
    // Create a mock user object for the admin
    const user = {
      _id: 'admin-user-id',
      email: 'admin@academic.com',
      name: 'Admin Librarian',
      role: 'librarian',
      password: 'hashed-password-placeholder' // Not used since we're checking plain text
    };
    
    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role as 'librarian',
    });
    
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    });
    
    // Set HTTP-only cookie for API compatibility
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });
    
    return response;
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}