import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { getLibrarianAuth } from '@/lib/getLibrarianAuth';

function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
      process.env.CLOUDINARY_API_KEY?.trim() &&
      process.env.CLOUDINARY_API_SECRET?.trim()
  );
}

function extensionForImageMime(mime: string): string | null {
  if (mime === 'image/jpeg' || mime === 'image/jpg') return '.jpg';
  if (mime === 'image/png') return '.png';
  if (mime === 'image/gif') return '.gif';
  if (mime === 'image/webp') return '.webp';
  return null;
}

async function saveCoverToPublicUploads(buffer: Buffer, mime: string): Promise<string> {
  const ext = extensionForImageMime(mime);
  if (!ext) {
    throw new Error('Unsupported image type for local save');
  }
  const dir = join(process.cwd(), 'public', 'uploads', 'book-covers');
  await mkdir(dir, { recursive: true });
  const filename = `${randomUUID()}${ext}`;
  await writeFile(join(dir, filename), buffer);
  return `/uploads/book-covers/${filename}`;
}

async function saveDocumentToPublicUploads(buffer: Buffer): Promise<string> {
  const dir = join(process.cwd(), 'public', 'uploads', 'documents');
  await mkdir(dir, { recursive: true });
  const filename = `${randomUUID()}.pdf`;
  await writeFile(join(dir, filename), buffer);
  return `/uploads/documents/${filename}`;
}

const CLOUDINARY_SETUP_MESSAGE =
  'File upload is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to .env.local (see .env.example), then restart the dev server.';

function formatSizeLabel(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function POST(request: NextRequest) {
  const auth = getLibrarianAuth(request);
  if (!auth.ok) return auth.response;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const purpose = String(formData.get('purpose') || 'book-cover').trim();

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const byteSize = file.size;

    if (purpose === 'document') {
      if (file.type !== 'application/pdf') {
        return NextResponse.json({ error: 'Only PDF files are allowed for documents' }, { status: 400 });
      }
      const maxDoc = 15 * 1024 * 1024;
      if (file.size > maxDoc) {
        return NextResponse.json({ error: 'PDF must be 15MB or smaller' }, { status: 400 });
      }

      if (isCloudinaryConfigured()) {
        const uploadResponse = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              folder: 'academic-nexus/documents',
              resource_type: 'raw',
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(buffer);
        });

        const result = uploadResponse as { secure_url: string; public_id: string };

        return NextResponse.json({
          message: 'Document uploaded successfully',
          fileUrl: result.secure_url,
          filename: result.public_id,
          byteSize,
          fileSizeLabel: formatSizeLabel(byteSize),
        });
      }

      if (process.env.NODE_ENV === 'development') {
        console.warn(
          '[upload] Cloudinary env not set; using public/uploads/documents (development only).'
        );
        const fileUrl = await saveDocumentToPublicUploads(buffer);
        return NextResponse.json({
          message: 'Document uploaded successfully (local dev storage)',
          fileUrl,
          filename: fileUrl.split('/').pop(),
          byteSize,
          fileSizeLabel: formatSizeLabel(byteSize),
        });
      }

      console.error('Cloudinary environment variables not configured (production)');
      return NextResponse.json({ error: CLOUDINARY_SETUP_MESSAGE }, { status: 503 });
    }

    // book-cover (default): images only
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed for book covers' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be 5MB or smaller' }, { status: 400 });
    }

    if (isCloudinaryConfigured()) {
      const uploadResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'academic-nexus/book-covers',
            resource_type: 'image',
            transformation: [{ width: 500, height: 750, crop: 'limit' }, { quality: 'auto' }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      const result = uploadResponse as { secure_url: string; public_id: string };

      return NextResponse.json({
        message: 'File uploaded successfully',
        fileUrl: result.secure_url,
        filename: result.public_id,
        byteSize,
        fileSizeLabel: formatSizeLabel(byteSize),
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[upload] Cloudinary env not set; using public/uploads/book-covers (development only).'
      );
      const fileUrl = await saveCoverToPublicUploads(buffer, file.type);
      return NextResponse.json({
        message: 'File uploaded successfully (local dev storage)',
        fileUrl,
        filename: fileUrl.split('/').pop(),
        byteSize,
        fileSizeLabel: formatSizeLabel(byteSize),
      });
    }

    console.error('Cloudinary environment variables not configured (production)');
    return NextResponse.json({ error: CLOUDINARY_SETUP_MESSAGE }, { status: 503 });
  } catch (error) {
    console.error('Upload error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      cloudinaryConfig: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'NOT SET',
        apiKey: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
        apiSecret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET',
      },
    });
    return NextResponse.json(
      { error: `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
