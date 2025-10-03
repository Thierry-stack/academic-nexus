import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import User from '@/models/User';
import { verifyToken, getTokenFromHeader, getTokenFromCookies } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    let token: string;
    
    // Try to get token from Authorization header first
    try {
      token = getTokenFromHeader(request.headers.get('authorization'));
    } catch {
      // If no header token, try cookies
      token = getTokenFromCookies(request.cookies);
    }
    
    const payload = verifyToken(token);
    
    const user = await User.findById(payload.userId).select('-password');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    });
    
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }
}