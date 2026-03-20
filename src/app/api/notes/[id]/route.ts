import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import StudyNote from '@/models/StudyNote';
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

    const note = await StudyNote.findByIdAndDelete(params.id);
    if (!note) {
      return NextResponse.json({ error: 'Study note not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Study note deleted successfully' });
  } catch (error) {
    console.error('Delete study note error:', error);
    if (error instanceof Error && isMongoConfigErrorMessage(error.message)) {
      return NextResponse.json({ error: MONGO_URI_MISSING_MESSAGE }, { status: 503 });
    }
    if (isMongoConnectivityFailure(error)) {
      return NextResponse.json({ error: mongoConnectFailedBody(error) }, { status: 503 });
    }
    return NextResponse.json({ error: 'Failed to delete study note' }, { status: 500 });
  }
}
