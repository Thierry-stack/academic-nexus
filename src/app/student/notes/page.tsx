'use client';

import { useState, useEffect, useMemo } from 'react';

interface StudyNote {
  _id: string;
  title: string;
  subject: string;
  author: string;
  description: string;
  fileUrl?: string;
  fileSizeLabel?: string;
  createdAt?: string;
}

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<StudyNote | null>(null);
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/notes');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load');
        if (!cancelled) setNotes(data.notes || []);
      } catch (e) {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : 'Failed to load');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(q) ||
        note.subject.toLowerCase().includes(q) ||
        note.author.toLowerCase().includes(q) ||
        note.description.toLowerCase().includes(q)
    );
  }, [notes, searchQuery]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-12 bg-gray-200 rounded max-w-2xl" />
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-red-600">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredNotes.length} of {notes.length} notes
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No notes found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery
              ? `No notes match your search for "${searchQuery}"`
              : 'No study notes available yet'}
          </p>
          {searchQuery && (
            <button
              type="button"
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
              key={note._id}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setSelectedNote(note);
              }}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
              onClick={() => setSelectedNote(note)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-2xl">📄</span>
                  </div>
                  <span className="text-xs font-medium text-academic-blue bg-blue-50 px-2 py-1 rounded">
                    {note.subject}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-academic-blue transition-colors duration-200">
                  {note.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">by {note.author}</p>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{note.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{formatDate(note.createdAt)}</span>
                  <span>{note.fileSizeLabel || (note.fileUrl ? 'PDF' : '')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Note Details</h2>
                <button
                  type="button"
                  onClick={() => setSelectedNote(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
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

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Description</h4>
                  <p className="text-gray-600 leading-relaxed">{selectedNote.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Added:</span>
                    <p className="text-gray-600">{formatDate(selectedNote.createdAt)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">File size:</span>
                    <p className="text-gray-600">{selectedNote.fileSizeLabel || '—'}</p>
                  </div>
                </div>

                {selectedNote.fileUrl ? (
                  <div className="pt-4 border-t border-gray-200">
                    <a
                      href={selectedNote.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-academic-blue text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center space-x-2"
                    >
                      <span>📥</span>
                      <span>Download notes (PDF)</span>
                    </a>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center">No file attached.</p>
                )}
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button type="button" onClick={() => setSelectedNote(null)} className="btn-secondary flex-1">
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
