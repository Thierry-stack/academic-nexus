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

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = getLibrarianAuth(request);
  if (!auth.ok) return auth.response;

  try {
    if (isMongoUriMissing()) {
      return NextResponse.json({ error: MONGO_URI_MISSING_MESSAGE }, { status: 503 });
    }

    let body: { status?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const status = body.status;
    if (status !== 'approved' && status !== 'rejected') {
      return NextResponse.json(
        { error: 'status must be "approved" or "rejected"' },
        { status: 400 }
      );
    }

    await connectDB();

    const updated = await BookRequest.findByIdAndUpdate(
      params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update book request error:', error);

    if (error instanceof Error && isMongoConfigErrorMessage(error.message)) {
      return NextResponse.json({ error: MONGO_URI_MISSING_MESSAGE }, { status: 503 });
    }
    if (isMongoConnectivityFailure(error)) {
      return NextResponse.json({ error: mongoConnectFailedBody(error) }, { status: 503 });
    }

    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
  }
}
