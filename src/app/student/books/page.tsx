'use client';

import { useState, useEffect } from 'react';

interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  description: string;
  coverImage?: string;
  publicationDate: string;
  shelfLocation: string;
  rowNumber: number;
  available: boolean;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'date'>('title');

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterAndSortBooks();
  }, [books, searchQuery, sortBy]);

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books');
      const data = await response.json();
      setBooks(data.books || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortBooks = () => {
    let filtered = books;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.isbn.toLowerCase().includes(query) ||
        book.description.toLowerCase().includes(query)
      );
    }

    // Sort books
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        case 'date':
          return new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime();
        default:
          return 0;
      }
    });

    setFilteredBooks(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-80"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header and Search */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Collection</h1>
        <p className="text-gray-600 mb-6">Browse and search our library collection</p>
        
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by title, author, ISBN, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-academic-blue focus:border-transparent shadow-sm"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'title' | 'author' | 'date')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-academic-blue"
            >
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="date">Newest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredBooks.length} of {books.length} books
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No books found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery 
              ? `No books match your search for "${searchQuery}"`
              : 'No books available in the library'
            }
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-academic-blue hover:text-blue-700 font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredBooks.map((book) => (
            <div 
              key={book._id}
              onClick={() => setSelectedBook(book)}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className="p-4">
                {/* Book Cover */}
                <div className="mb-3 flex justify-center">
                  {book.coverImage ? (
                    <img 
                      src={book.coverImage} 
                      alt={book.title}
                      className="w-24 h-32 object-cover rounded border border-gray-200 group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-24 h-32 bg-gray-100 rounded border border-gray-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                      <span className="text-gray-400 text-3xl">📚</span>
                    </div>
                  )}
                </div>
                
                {/* Book Title */}
                <h3 className="text-sm font-medium text-gray-900 text-center line-clamp-2 group-hover:text-academic-blue transition-colors duration-200 mb-1">
                  {book.title}
                </h3>
                
                {/* Author */}
                <p className="text-xs text-gray-600 text-center line-clamp-1 mb-2">
                  by {book.author}
                </p>
                
                {/* Status and Location */}
                <div className="flex flex-col items-center space-y-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    book.available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {book.available ? 'Available' : 'Checked Out'}
                  </span>
                  <span className="text-xs text-gray-500 text-center">
                    {book.shelfLocation} • Row {book.rowNumber}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Book Details Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Book Details</h2>
                <button
                  onClick={() => setSelectedBook(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="flex-shrink-0">
                  {selectedBook.coverImage ? (
                    <img 
                      src={selectedBook.coverImage} 
                      alt={selectedBook.title}
                      className="w-32 h-48 object-cover rounded-lg border border-gray-200"
                    />
                  ) : (
                    <div className="w-32 h-48 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-4xl">📚</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedBook.title}</h3>
                  <p className="text-lg text-gray-600 mb-4">by {selectedBook.author}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="font-medium text-gray-700">ISBN:</span>
                      <p className="text-gray-600">{selectedBook.isbn || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Published:</span>
                      <p className="text-gray-600">{formatDate(selectedBook.publicationDate)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Location:</span>
                      <p className="text-gray-600">{selectedBook.shelfLocation} - Row {selectedBook.rowNumber}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedBook.available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedBook.available ? 'Available' : 'Checked Out'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">Description</h4>
                <p className="text-gray-600 leading-relaxed">{selectedBook.description}</p>
              </div>
              
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedBook(null)}
                  className="btn-primary flex-1"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}