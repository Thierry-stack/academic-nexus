import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  coverImage: {
    type: String,
    default: '/uploads/book-covers/default-cover.jpg',
  },
  publicationDate: {
    type: Date,
    required: [true, 'Publication date is required'],
  },
  shelfLocation: {
    type: String,
    required: [true, 'Shelf location is required'],
  },
  rowNumber: {
    type: Number,
    required: [true, 'Row number is required'],
    min: 1,
  },
  available: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Book || mongoose.model('Book', BookSchema);