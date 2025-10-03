import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Book from '@/models/Book';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const book = await Book.findByIdAndDelete(params.id);
    
    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Book deleted successfully' });
    
  } catch (error) {
    console.error('Delete book error:', error);
    return NextResponse.json(
      { error: 'Failed to delete book' },
      { status: 500 }
    );
  }
}