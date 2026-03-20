import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import StudyNote from '@/models/StudyNote';
import { getLibrarianAuth } from '@/lib/getLibrarianAuth';
import { escapeRegex } from '@/lib/escapeRegex';
import {
  isMongoUriMissing,
  MONGO_URI_MISSING_MESSAGE,
  mongoConnectFailedBody,
  isMongoConfigErrorMessage,
  isMongoConnectivityFailure,
} from '@/lib/mongoEnv';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    if (isMongoUriMissing()) {
      return NextResponse.json({ error: MONGO_URI_MISSING_MESSAGE }, { status: 503 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim() ?? '';

    const filter =
      q.length > 0
        ? (() => {
            const safe = escapeRegex(q);
            return {
              $or: [
                { title: { $regex: safe, $options: 'i' } },
                { subject: { $regex: safe, $options: 'i' } },
                { author: { $regex: safe, $options: 'i' } },
                { description: { $regex: safe, $options: 'i' } },
              ],
            };
          })()
        : {};

    const notes = await StudyNote.find(filter).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ notes });
  } catch (error) {
    console.error('Study notes GET error:', error);
    if (error instanceof Error && isMongoConfigErrorMessage(error.message)) {
      return NextResponse.json({ error: MONGO_URI_MISSING_MESSAGE }, { status: 503 });
    }
    if (isMongoConnectivityFailure(error)) {
      return NextResponse.json({ error: mongoConnectFailedBody(error) }, { status: 503 });
    }
    return NextResponse.json({ error: 'Failed to load study notes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = getLibrarianAuth(request);
  if (!auth.ok) return auth.response;

  try {
    if (isMongoUriMissing()) {
      return NextResponse.json({ error: MONGO_URI_MISSING_MESSAGE }, { status: 503 });
    }

    await connectDB();

    const body = await request.json();

    const note = await StudyNote.create({
      title: String(body.title || '').trim(),
      subject: String(body.subject || '').trim(),
      author: String(body.author || '').trim(),
      description: String(body.description || '').trim(),
      fileUrl: typeof body.fileUrl === 'string' ? body.fileUrl.trim() : '',
      fileSizeLabel: typeof body.fileSizeLabel === 'string' ? body.fileSizeLabel.trim() : '',
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error('Study note POST error:', error);
    if (error instanceof Error && isMongoConfigErrorMessage(error.message)) {
      return NextResponse.json({ error: MONGO_URI_MISSING_MESSAGE }, { status: 503 });
    }
    if (isMongoConnectivityFailure(error)) {
      return NextResponse.json({ error: mongoConnectFailedBody(error) }, { status: 503 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create study note' },
      { status: 500 }
    );
  }
}
