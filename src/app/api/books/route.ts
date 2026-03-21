import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Book from '@/models/Book';
import SearchAnalytics from '@/models/SearchAnalytics';
import { escapeRegex } from '@/lib/escapeRegex';
import { getLibrarianAuth } from '@/lib/getLibrarianAuth';
import {
  isMongoUriMissing,
  MONGO_URI_MISSING_MESSAGE,
  mongoConnectFailedBody,
  isMongoConfigErrorMessage,
  isMongoConnectivityFailure,
} from '@/lib/mongoEnv';

// GET - Search books
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const trimmedQuery = query.trim();
    const metaOnly = searchParams.get('meta') === '1';

    // Build search filter (escape regex so special characters in q are safe)
    const filter = trimmedQuery
      ? {
          $or: [
            { title: { $regex: escapeRegex(trimmedQuery), $options: 'i' } },
            { author: { $regex: escapeRegex(trimmedQuery), $options: 'i' } },
            { isbn: { $regex: escapeRegex(trimmedQuery), $options: 'i' } },
            { description: { $regex: escapeRegex(trimmedQuery), $options: 'i' } },
          ],
        }
      : {};

    const total = await Book.countDocuments(filter);

    // Lightweight path for student UI: log search + total matches without returning rows
    if (metaOnly) {
      if (trimmedQuery) {
        await SearchAnalytics.create({
          query: trimmedQuery,
          resultsCount: total,
          userAgent: request.headers.get('user-agent') || undefined,
        });
      }
      return NextResponse.json({
        books: [],
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit) || 0,
        },
        logged: Boolean(trimmedQuery),
      });
    }

    const books = await Book.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    // Log when the API is used as the catalog search (e.g. ?q= with full response)
    if (trimmedQuery) {
      await SearchAnalytics.create({
        query: trimmedQuery,
        resultsCount: total,
        userAgent: request.headers.get('user-agent') || undefined,
      });
    }

    return NextResponse.json({
      books,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
    
  } catch (error) {
    console.error('Books API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

// POST - Add new book (Librarian only)
export async function POST(request: NextRequest) {
  const auth = getLibrarianAuth(request);
  if (!auth.ok) return auth.response;

  try {
    if (isMongoUriMissing()) {
      return NextResponse.json({ error: MONGO_URI_MISSING_MESSAGE }, { status: 503 });
    }

    await connectDB();

    const body = await request.json();
    const isbn =
      typeof body.isbn === 'string' && body.isbn.trim() ? body.isbn.trim() : undefined;

    const book = await Book.create({
      title: body.title,
      author: body.author,
      ...(isbn ? { isbn } : {}),
      description: body.description,
      publicationDate: new Date(body.publicationDate),
      shelfLocation: body.shelfLocation,
      rowNumber: body.rowNumber,
      coverImage: body.coverImage || undefined,
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error: unknown) {
    console.error('Create Book Error:', error);

    if (error instanceof Error && isMongoConfigErrorMessage(error.message)) {
      return NextResponse.json({ error: MONGO_URI_MISSING_MESSAGE }, { status: 503 });
    }
    if (isMongoConnectivityFailure(error)) {
      return NextResponse.json({ error: mongoConnectFailedBody(error) }, { status: 503 });
    }

    const err = error as { code?: number; message?: string };
    if (err.code === 11000) {
      return NextResponse.json(
        { error: 'A book with this ISBN already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: `Failed to create book: ${err.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}