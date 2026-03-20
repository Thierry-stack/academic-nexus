import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Book from '@/models/Book';
import { getLibrarianAuth } from '@/lib/getLibrarianAuth';
import {
  isMongoUriMissing,
  MONGO_URI_MISSING_MESSAGE,
  mongoConnectFailedBody,
  isMongoConfigErrorMessage,
  isMongoConnectivityFailure,
} from '@/lib/mongoEnv';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = getLibrarianAuth(request);
  if (!auth.ok) return auth.response;

  try {
    if (isMongoUriMissing()) {
      return NextResponse.json({ error: MONGO_URI_MISSING_MESSAGE }, { status: 503 });
    }

    await connectDB();

    const book = await Book.findByIdAndDelete(params.id);

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);

    if (error instanceof Error && isMongoConfigErrorMessage(error.message)) {
      return NextResponse.json({ error: MONGO_URI_MISSING_MESSAGE }, { status: 503 });
    }
    if (isMongoConnectivityFailure(error)) {
      return NextResponse.json({ error: mongoConnectFailedBody(error) }, { status: 503 });
    }

    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
  }
}