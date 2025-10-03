import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Fallback secret for development - in production, this should be in .env.local
const JWT_SECRET = process.env.JWT_SECRET || 'academic-nexus-dev-secret-2024-fallback';

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: 'librarian' | 'student';
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AuthTokenPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
  } catch (error) {
    throw new AuthError('Invalid or expired token');
  }
}

export function getTokenFromHeader(authHeader: string | null): string {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthError('No token provided');
  }
  return authHeader.substring(7);
}

// Also get token from cookies for API routes
export function getTokenFromCookies(cookies: any): string {
  const token = cookies.get('auth_token')?.value;
  if (!token) {
    throw new AuthError('No token provided');
  }
  return token;
}