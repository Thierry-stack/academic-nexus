'use client';

import { useState, useEffect, useRef } from 'react';

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

export default function BooksManagement() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    publicationDate: '',
    shelfLocation: '',
    rowNumber: 1,
    coverImage: '',
  });

  useEffect(() => {
    fetchBooks();
  }, []);

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setNewBook({ ...newBook, coverImage: result.fileUrl });
        alert('Cover image uploaded successfully!');
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Failed to upload cover image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBook),
      });

      if (response.ok) {
        const addedBook = await response.json();
        setBooks([addedBook, ...books]);
        setNewBook({
          title: '',
          author: '',
          isbn: '',
          description: '',
          publicationDate: '',
          shelfLocation: '',
          rowNumber: 1,
          coverImage: '',
        });
        setShowAddForm(false);
        alert('Book added successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error adding book:', error);
      alert(`Failed to add book: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBooks(books.filter(book => book._id !== bookId));
        setSelectedBook(null);
        alert('Book deleted successfully!');
      } else {
        alert('Failed to delete book');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Books Management</h1>
          <p className="text-gray-600">Manage the library book catalog</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 border-2 border-blue-700"
        >
          + Add New Book
        </button>
      </div>

      {/* Add Book Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Add New Book</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleAddBook} className="space-y-4">
                {/* Cover Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Book Cover
                  </label>
                  <div className="flex items-center space-x-4">
                    {newBook.coverImage ? (
                      <div className="relative">
                        <img 
                          src={newBook.coverImage} 
                          alt="Book cover" 
                          className="w-20 h-28 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => setNewBook({...newBook, coverImage: ''})}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-28 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-2xl">📚</span>
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
                      >
                        {isUploading ? 'Uploading...' : 'Upload Cover'}
                      </button>
                      <p className="text-xs text-gray-500 mt-1">
                        JPG, PNG, max 5MB
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newBook.title}
                      onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                      className="input-field"
                      placeholder="Book title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Author *
                    </label>
                    <input
                      type="text"
                      required
                      value={newBook.author}
                      onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                      className="input-field"
                      placeholder="Author name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ISBN
                  </label>
                  <input
                    type="text"
                    value={newBook.isbn}
                    onChange={(e) => setNewBook({...newBook, isbn: e.target.value})}
                    className="input-field"
                    placeholder="ISBN number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newBook.description}
                    onChange={(e) => setNewBook({...newBook, description: e.target.value})}
                    className="input-field"
                    placeholder="Book description"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Publication Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={newBook.publicationDate}
                      onChange={(e) => setNewBook({...newBook, publicationDate: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shelf Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={newBook.shelfLocation}
                      onChange={(e) => setNewBook({...newBook, shelfLocation: e.target.value})}
                      className="input-field"
                      placeholder="e.g., A1, B2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Row Number *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newBook.rowNumber}
                      onChange={(e) => setNewBook({...newBook, rowNumber: parseInt(e.target.value)})}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Add Book
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
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
                  <p className="text-gray-600 mb-4">by {selectedBook.author}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
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
                <p className="text-gray-600">{selectedBook.description}</p>
              </div>
              
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleDeleteBook(selectedBook._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Delete Book
                </button>
                <button
                  onClick={() => setSelectedBook(null)}
                  className="btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Books Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {books.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-500 text-lg mb-4">No books in the library yet</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 border-2 border-blue-700"
            >
              + Add Your First Book
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {books.map((book) => (
              <div 
                key={book._id}
                onClick={() => setSelectedBook(book)}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer group"
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
                  <h3 className="text-sm font-medium text-gray-900 text-center line-clamp-2 group-hover:text-academic-blue transition-colors duration-200">
                    {book.title}
                  </h3>
                  
                  {/* Status Badge */}
                  <div className="mt-2 flex justify-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      book.available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {book.available ? 'Available' : 'Checked Out'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}