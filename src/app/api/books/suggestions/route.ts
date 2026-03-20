import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Book from '@/models/Book';
import { escapeRegex } from '@/lib/escapeRegex';
import {
  isMongoUriMissing,
  MONGO_URI_MISSING_MESSAGE,
  mongoConnectFailedBody,
  isMongoConfigErrorMessage,
  isMongoConnectivityFailure,
} from '@/lib/mongoEnv';

export const dynamic = 'force-dynamic';

const MIN_LEN = 2;
const LIMIT = 8;

export async function GET(request: NextRequest) {
  try {
    if (isMongoUriMissing()) {
      return NextResponse.json({ error: MONGO_URI_MISSING_MESSAGE }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const raw = searchParams.get('q')?.trim() ?? '';
    if (raw.length < MIN_LEN) {
      return NextResponse.json({ suggestions: [] });
    }

    await connectDB();

    const safe = escapeRegex(raw);
    const filter = {
      $or: [
        { title: { $regex: safe, $options: 'i' } },
        { author: { $regex: safe, $options: 'i' } },
        { isbn: { $regex: safe, $options: 'i' } },
        { description: { $regex: safe, $options: 'i' } },
      ],
    };

    const books = await Book.find(filter)
      .select('title author isbn')
      .sort({ title: 1 })
      .limit(LIMIT)
      .lean();

    const suggestions = books.map((b) => ({
      id: String(b._id),
      title: b.title as string,
      author: b.author as string,
      isbn: typeof b.isbn === 'string' ? b.isbn : '',
    }));

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Book suggestions error:', error);

    if (error instanceof Error && isMongoConfigErrorMessage(error.message)) {
      return NextResponse.json({ error: MONGO_URI_MISSING_MESSAGE }, { status: 503 });
    }
    if (isMongoConnectivityFailure(error)) {
      return NextResponse.json({ error: mongoConnectFailedBody(error) }, { status: 503 });
    }

    return NextResponse.json({ error: 'Failed to load suggestions' }, { status: 500 });
  }
}
