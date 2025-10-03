import mongoose from 'mongoose';

const BookRequestSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
  },
  studentEmail: {
    type: String,
    required: [true, 'Student email is required'],
    trim: true,
    lowercase: true,
  },
  bookTitle: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
  },
  isbn: {
    type: String,
    trim: true,
  },
  reason: {
    type: String,
    required: [true, 'Reason for request is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

export default mongoose.models.BookRequest || mongoose.model('BookRequest', BookRequestSchema);