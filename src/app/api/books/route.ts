import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Book from '@/models/Book';
import SearchAnalytics from '@/models/SearchAnalytics';

// GET - Search books
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Log search for analytics (only if there's a query)
    if (query.trim()) {
      await SearchAnalytics.create({
        query: query.trim(),
        resultsCount: 0, // We'll update this after we get results
        userAgent: request.headers.get('user-agent') || undefined,
      });
    }
    
    // Build search filter
    const filter = query ? {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        { isbn: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ]
    } : {};
    
    const books = await Book.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);
    
    const total = await Book.countDocuments(filter);
    
    // Update analytics with actual results count
    if (query.trim()) {
      await SearchAnalytics.findOneAndUpdate(
        { query: query.trim() },
        { resultsCount: books.length }
      );
    }
    
    return NextResponse.json({
      books,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
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
  try {
    await connectDB();
    
    const body = await request.json();
    
    const book = await Book.create({
      title: body.title,
      author: body.author,
      isbn: body.isbn,
      description: body.description,
      publicationDate: new Date(body.publicationDate),
      shelfLocation: body.shelfLocation,
      rowNumber: body.rowNumber,
      coverImage: body.coverImage || null,
    });
    
    return NextResponse.json(book, { status: 201 });
    
  } catch (error: any) {
    console.error('Create Book Error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'A book with this ISBN already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create book' },
      { status: 500 }
    );
  }
}