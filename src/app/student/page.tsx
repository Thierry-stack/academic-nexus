'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function StudentDashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Library Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Digital Library
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Discover and explore our extensive collection of books and academic resources
        </p>
        
        {/* Search Bar */}
        // In the StudentDashboard component, replace the search section with:
<div className="max-w-2xl mx-auto">
  <div className="relative">
    <input
      type="text"
      placeholder="Search for books, authors, ISBN, or topics..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          window.location.href = `/student/books?search=${encodeURIComponent(searchQuery)}`;
        }
      }}
      className="w-full px-6 py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-academic-blue focus:border-transparent text-lg shadow-sm"
    />
    <button 
      onClick={() => {
        window.location.href = `/student/books?search=${encodeURIComponent(searchQuery)}`;
      }}
      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-academic-blue text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200 font-medium"
    >
      Search
    </button>
  </div>
</div>
      </div>

      {/* Quick Access Sections */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Link 
          href="/student/books" 
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 text-center group"
        >
          <div className="mb-3 group-hover:scale-110 transition-transform duration-200 flex justify-center">
            <img 
              src="/images/books collection.jpg" 
              alt="Books Collection" 
              className="h-16 w-16 object-cover rounded-lg"
            />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 text-lg">Books Collection</h3>
          <p className="text-gray-600 text-sm">Browse and search our book catalog</p>
        </Link>

        <Link 
          href="/student/notes" 
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 text-center group"
        >
          <div className="mb-3 group-hover:scale-110 transition-transform duration-200 flex justify-center">
            <img 
              src="/images/study notes.jpg" 
              alt="Study Notes" 
              className="h-16 w-16 object-cover rounded-lg"
            />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 text-lg">Study Notes</h3>
          <p className="text-gray-600 text-sm">Access shared study materials</p>
        </Link>

        <Link 
          href="/student/research" 
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 text-center group"
        >
          <div className="mb-3 group-hover:scale-110 transition-transform duration-200 flex justify-center">
            <img 
              src="/images/research papers.jpg" 
              alt="Research Papers" 
              className="h-16 w-16 object-cover rounded-lg"
            />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 text-lg">Research Papers</h3>
          <p className="text-gray-600 text-sm">Explore academic research</p>
        </Link>

        <Link 
          href="/student/qa" 
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 text-center group"
        >
          <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">❓</div>
          <h3 className="font-semibold text-gray-900 mb-2 text-lg">Q&A Forum</h3>
          <p className="text-gray-600 text-sm">Get academic questions answered</p>
        </Link>
      </div>

      {/* Quick Stats & Actions */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Request Book Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start mb-4">
            <div className="mr-4">
              <img 
                src="/images/request a new book.jpg" 
                alt="Request a New Book" 
                className="h-12 w-12 object-cover rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Request a New Book</h2>
              <p className="text-gray-600 mt-1">
                Can't find what you're looking for? Suggest new books for our library.
              </p>
            </div>
          </div>
          <Link 
            href="/student/request-book" 
            className="inline-block bg-academic-gold text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors duration-200 font-medium"
          >
            Submit Request
          </Link>
        </div>

        {/* Library Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start mb-4">
            <div className="text-2xl mr-4">🏛️</div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Library Information</h2>
              <p className="text-gray-600 mt-1">
                Open 24/7 • Digital Access • Physical books available
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            <p>📍 Location: Main Campus Library</p>
            <p>📞 Contact: library@academic.edu</p>
            <p>🕒 Support: 24/7 Online</p>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recently Added Books</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">Book catalog integration coming soon...</p>
          <p className="text-sm text-gray-400 mt-2">We're working on connecting to our book database</p>
        </div>
      </div>
    </div>
  );
}