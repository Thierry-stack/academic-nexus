import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'API is working',
    timestamp: new Date().toISOString(),
    environment: {
      cloudinaryConfigured: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET),
      cloudName: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'NOT SET',
      apiKey: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
      apiSecret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET',
    }
  });
}
