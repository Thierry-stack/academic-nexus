/**
 * Ensures MongoDB collections exist and indexes match Mongoose models.
 * Run: npm run setup-db
 * Requires MONGODB_URI in .env.local (project root).
 */
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'librarian'], default: 'student' },
  },
  { timestamps: true, collection: 'users' }
);

const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    isbn: { type: String, unique: true, sparse: true, trim: true },
    description: { type: String, required: true },
    coverImage: { type: String, default: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg' },
    publicationDate: { type: Date, required: true },
    shelfLocation: { type: String, required: true },
    rowNumber: { type: Number, required: true, min: 1 },
    available: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'books' }
);

const BookRequestSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true, trim: true },
    studentEmail: { type: String, required: true, trim: true, lowercase: true },
    bookTitle: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    isbn: { type: String, trim: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true, collection: 'bookrequests' }
);

const SearchAnalyticsSchema = new mongoose.Schema(
  {
    query: { type: String, required: true, trim: true },
    resultsCount: { type: Number, required: true, min: 0 },
    userAgent: { type: String, default: null },
  },
  { timestamps: true, collection: 'searchanalytics' }
);

const User = mongoose.models.SetupUser || mongoose.model('SetupUser', UserSchema);
const Book = mongoose.models.SetupBook || mongoose.model('SetupBook', BookSchema);
const BookRequest = mongoose.models.SetupBookRequest || mongoose.model('SetupBookRequest', BookRequestSchema);
const SearchAnalytics =
  mongoose.models.SetupSearchAnalytics || mongoose.model('SetupSearchAnalytics', SearchAnalyticsSchema);

async function main() {
  if (!MONGODB_URI?.trim()) {
    console.error('Missing MONGODB_URI in .env.local');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 25_000 });
  console.log('Connected to MongoDB');

  for (const Model of [User, Book, BookRequest, SearchAnalytics]) {
    await Model.syncIndexes();
    console.log('Synced indexes for collection:', Model.collection.collectionName);
  }

  const cols = await mongoose.connection.db.listCollections().toArray();
  console.log(
    'Collections in database:',
    cols.map((c) => c.name).sort().join(', ') || '(none yet — created on first write)'
  );

  await mongoose.disconnect();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
