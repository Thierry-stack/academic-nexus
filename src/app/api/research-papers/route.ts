import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import ResearchPaper from '@/models/ResearchPaper';
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

function parseStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((s) => String(s).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

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
                { abstract: { $regex: safe, $options: 'i' } },
                { publication: { $regex: safe, $options: 'i' } },
                { doi: { $regex: safe, $options: 'i' } },
                { authors: { $regex: safe, $options: 'i' } },
                { keywords: { $regex: safe, $options: 'i' } },
              ],
            };
          })()
        : {};

    const papers = await ResearchPaper.find(filter).sort({ year: -1, createdAt: -1 }).lean();

    return NextResponse.json({ papers });
  } catch (error) {
    console.error('Research papers GET error:', error);
    if (error instanceof Error && isMongoConfigErrorMessage(error.message)) {
      return NextResponse.json({ error: MONGO_URI_MISSING_MESSAGE }, { status: 503 });
    }
    if (isMongoConnectivityFailure(error)) {
      return NextResponse.json({ error: mongoConnectFailedBody(error) }, { status: 503 });
    }
    return NextResponse.json({ error: 'Failed to load research papers' }, { status: 500 });
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
    const authors = parseStringList(body.authors);
    if (authors.length === 0) {
      return NextResponse.json({ error: 'At least one author is required' }, { status: 400 });
    }

    const year = Number(body.year);
    if (!Number.isFinite(year) || year < 1000 || year > 2100) {
      return NextResponse.json({ error: 'Valid year is required' }, { status: 400 });
    }

    const paper = await ResearchPaper.create({
      title: String(body.title || '').trim(),
      authors,
      abstract: String(body.abstract || '').trim(),
      publication: String(body.publication || '').trim(),
      year,
      doi: typeof body.doi === 'string' ? body.doi.trim() : '',
      documentUrl: typeof body.documentUrl === 'string' ? body.documentUrl.trim() : '',
      citations: Math.max(0, Number(body.citations) || 0),
      keywords: parseStringList(body.keywords),
    });

    return NextResponse.json(paper, { status: 201 });
  } catch (error) {
    console.error('Research paper POST error:', error);
    if (error instanceof Error && isMongoConfigErrorMessage(error.message)) {
      return NextResponse.json({ error: MONGO_URI_MISSING_MESSAGE }, { status: 503 });
    }
    if (isMongoConnectivityFailure(error)) {
      return NextResponse.json({ error: mongoConnectFailedBody(error) }, { status: 503 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create research paper' },
      { status: 500 }
    );
  }
}
