export interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  description: string;
  coverImage?: string;
  publicationDate: Date;
  shelfLocation: string;
  rowNumber: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'student' | 'librarian';
  createdAt: Date;
}

export interface BookRequest {
  _id: string;
  studentName: string;
  studentEmail: string;
  bookTitle: string;
  author: string;
  isbn?: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchAnalytics {
  _id: string;
  query: string;
  resultsCount: number;
  timestamp: Date;
  userAgent?: string;
}