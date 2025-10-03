'use client';

import { useState } from 'react';

interface Note {
  id: string;
  title: string;
  subject: string;
  author: string;
  description: string;
  downloadUrl: string;
  uploadDate: string;
  fileSize: string;
}

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // Mock data - in a real app, this would come from an API
  const notes: Note[] = [
    {
      id: '1',
      title: 'Introduction to Algorithms',
      subject: 'Computer Science',
      author: 'Prof. Smith',
      description: 'Comprehensive notes covering basic algorithms, data structures, and complexity analysis. Includes examples and practice problems.',
      downloadUrl: '#',
      uploadDate: '2024-01-15',
      fileSize: '2.4 MB'
    },
    {
      id: '2',
      title: 'Linear Algebra Fundamentals',
      subject: 'Mathematics',
      author: 'Dr. Johnson',
      description: 'Detailed notes on vectors, matrices, linear transformations, and eigenvalues with practical applications.',
      downloadUrl: '#',
      uploadDate: '2024-01-10',
      fileSize: '1.8 MB'
    },
    {
      id: '3',
      title: 'Organic Chemistry Reactions',
      subject: 'Chemistry',
      author: 'Dr. Brown',
      description: 'Complete guide to organic chemistry reactions, mechanisms, and synthesis pathways.',
      downloadUrl: '#',
      uploadDate: '2024-01-08',
      fileSize: '3.1 MB'
    },
    {
      id: '4',
      title: 'Microeconomic Theory',
      subject: 'Economics',
      author: 'Prof. Davis',
      description: 'Notes covering consumer behavior, market structures, production theory, and welfare economics.',
      downloadUrl: '#',
      uploadDate: '2024-01-12',
      fileSize: '2.2 MB'
    },
    {
      id: '5',
      title: 'Classical Mechanics',
      subject: 'Physics',
      author: 'Dr. Wilson',
      description: 'Comprehensive notes on Newtonian mechanics, Lagrangian dynamics, and Hamiltonian mechanics.',
      downloadUrl: '#',
      uploadDate: '2024-01-05',
      fileSize: '2.7 MB'
    },
    {
      id: '6',
      title: 'Cell Biology Structures',
      subject: 'Biology',
      author: 'Prof. Miller',
      description: 'Detailed notes on cellular structures, organelles, and biological processes with diagrams.',
      downloadUrl: '#',
      uploadDate: '2024-01-18',
      fileSize: '1.9 MB'
    }
  ];

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header and Search */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Notes</h1>
        <p className="text-gray-600 mb-6">Access shared study materials and lecture notes</p>
        
        <div className="max-w-2xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search notes by title, subject, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-academic-blue focus:border-transparent shadow-sm"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredNotes.length} of {notes.length} notes
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No notes found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery 
              ? `No notes match your search for "${searchQuery}"`
              : 'No study notes available yet'
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div 
              key={note.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
              onClick={() => setSelectedNote(note)}
            >
              <div className="p-6">
                {/* Note Icon and Subject */}
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-2xl">📄</span>
                  </div>
                  <span className="text-xs font-medium text-academic-blue bg-blue-50 px-2 py-1 rounded">
                    {note.subject}
                  </span>
                </div>
                
                {/* Note Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-academic-blue transition-colors duration-200">
                  {note.title}
                </h3>
                
                {/* Author */}
                <p className="text-sm text-gray-600 mb-3">
                  by {note.author}
                </p>
                
                {/* Description */}
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                  {note.description}
                </p>
                
                {/* Metadata */}
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{formatDate(note.uploadDate)}</span>
                  <span>{note.fileSize}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Note Details Modal */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Note Details</h2>
                <button
                  onClick={() => setSelectedNote(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Note Header */}
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <span className="text-3xl">📄</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedNote.title}</h3>
                    <p className="text-gray-600">by {selectedNote.author}</p>
                    <span className="inline-block mt-2 text-sm font-medium text-academic-blue bg-blue-50 px-3 py-1 rounded">
                      {selectedNote.subject}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Description</h4>
                  <p className="text-gray-600 leading-relaxed">{selectedNote.description}</p>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Upload Date:</span>
                    <p className="text-gray-600">{formatDate(selectedNote.uploadDate)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">File Size:</span>
                    <p className="text-gray-600">{selectedNote.fileSize}</p>
                  </div>
                </div>

                {/* Download Button */}
                <div className="pt-4 border-t border-gray-200">
                  <button className="w-full bg-academic-blue text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center space-x-2">
                    <span>📥</span>
                    <span>Download Notes</span>
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    PDF format • Compatible with all devices
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setSelectedNote(null)}
                  className="btn-secondary flex-1"
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