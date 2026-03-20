import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import BookRequest from '@/models/BookRequest';
import { getLibrarianAuth } from '@/lib/getLibrarianAuth';
import {
  isMongoUriMissing,
  MONGO_URI_MISSING_MESSAGE,
  mongoConnectFailedBody,
  isMongoConfigErrorMessage,
  isMongoConnectivityFailure,
} from '@/lib/mongoEnv';

// GET - Get all book requests (for librarians)
export async function GET(request: NextRequest) {
  const auth = getLibrarianAuth(request);
  if (!auth.ok) return auth.response;

  try {
    if (isMongoUriMissing()) {
      return NextResponse.json({ error: MONGO_URI_MISSING_MESSAGE }, { status: 503 });
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const filter = status ? { status } : {};
    
    const requests = await BookRequest.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);
    
    const total = await BookRequest.countDocuments(filter);
    
    return NextResponse.json({
      requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    });
    
  } catch (error) {
    console.error('Book Requests API Error:', error);

    if (error instanceof Error && isMongoConfigErrorMessage(error.message)) {
      return NextResponse.json({ error: MONGO_URI_MISSING_MESSAGE }, { status: 503 });
    }
    if (isMongoConnectivityFailure(error)) {
      return NextResponse.json({ error: mongoConnectFailedBody(error) }, { status: 503 });
    }

    return NextResponse.json({ error: 'Failed to fetch book requests' }, { status: 500 });
  }
}

// POST - Submit new book request (for students)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const bookRequest = await BookRequest.create({
      studentName: body.studentName,
      studentEmail: body.studentEmail,
      bookTitle: body.bookTitle,
      author: body.author,
      isbn: body.isbn,
      reason: body.reason,
    });
    
    return NextResponse.json(bookRequest, { status: 201 });
    
  } catch (error) {
    console.error('Create Book Request Error:', error);
    return NextResponse.json(
      { error: 'Failed to submit book request' },
      { status: 500 }
    );
  }
}