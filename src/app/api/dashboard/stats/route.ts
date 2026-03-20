import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Book from '@/models/Book';
import BookRequest from '@/models/BookRequest';
import SearchAnalytics from '@/models/SearchAnalytics';
import ResearchPaper from '@/models/ResearchPaper';
import StudyNote from '@/models/StudyNote';
import { getLibrarianAuth } from '@/lib/getLibrarianAuth';
import {
  isMongoUriMissing,
  MONGO_URI_MISSING_MESSAGE,
  mongoConnectFailedBody,
  isMongoConfigErrorMessage,
  isMongoConnectivityFailure,
} from '@/lib/mongoEnv';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = getLibrarianAuth(request);
  if (!auth.ok) return auth.response;

  try {
    if (isMongoUriMissing()) {
      return NextResponse.json({ error: MONGO_URI_MISSING_MESSAGE }, { status: 503 });
    }

    await connectDB();

    const [totalBooks, totalRequests, pendingRequests, totalSearches, totalResearchPapers, totalNotes] =
      await Promise.all([
        Book.countDocuments(),
        BookRequest.countDocuments(),
        BookRequest.countDocuments({ status: 'pending' }),
        SearchAnalytics.countDocuments(),
        ResearchPaper.countDocuments(),
        StudyNote.countDocuments(),
      ]);

    return NextResponse.json({
      totalBooks,
      totalRequests,
      pendingRequests,
      totalSearches,
      totalResearchPapers,
      totalNotes,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);

    if (error instanceof Error && isMongoConfigErrorMessage(error.message)) {
      return NextResponse.json({ error: MONGO_URI_MISSING_MESSAGE }, { status: 503 });
    }
    if (isMongoConnectivityFailure(error)) {
      return NextResponse.json({ error: mongoConnectFailedBody(error) }, { status: 503 });
    }

    return NextResponse.json({ error: 'Failed to load dashboard stats' }, { status: 500 });
  }
}
