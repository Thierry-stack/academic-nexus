'use client';

import { useState, useEffect, useRef } from 'react';

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

const emptyForm = {
  title: '',
  subject: '',
  author: '',
  description: '',
};

export default function LibrarianNotesPage() {
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [selected, setSelected] = useState<StudyNote | null>(null);
  const [form, setForm] = useState(emptyForm);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes');
      const data = await res.json();
      setNotes(data.notes || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadPdf = async (file: File): Promise<{ fileUrl: string; fileSizeLabel: string }> => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('purpose', 'document');
    const res = await fetch('/api/upload', { method: 'POST', credentials: 'include', body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return { fileUrl: data.fileUrl, fileSizeLabel: data.fileSizeLabel || '' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let fileUrl = '';
      let fileSizeLabel = '';
      const file = fileRef.current?.files?.[0];
      if (file) {
        setIsUploadingPdf(true);
        const up = await uploadPdf(file);
        fileUrl = up.fileUrl;
        fileSizeLabel = up.fileSizeLabel;
        setIsUploadingPdf(false);
      }

      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...form,
          fileUrl: fileUrl || undefined,
          fileSizeLabel: fileSizeLabel || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add note');

      setNotes([data, ...notes]);
      setForm(emptyForm);
      if (fileRef.current) fileRef.current.value = '';
      setShowAddForm(false);
      alert('Study note added.');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error');
    } finally {
      setIsSaving(false);
      setIsUploadingPdf(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this note?')) return;
    try {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Delete failed');
      }
      setNotes(notes.filter((n) => n._id !== id));
      setSelected(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error');
    }
  };

  const formatDate = (d?: string) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse h-8 bg-gray-200 rounded w-1/3 mb-6" />
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Study notes</h1>
          <p className="text-gray-600 mt-1">Share notes and materials with students</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg"
        >
          + Add study note
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Add study note</h2>
              <button type="button" className="text-gray-400" onClick={() => setShowAddForm(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  className="input-field w-full"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                <input
                  className="input-field w-full"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author / contributor *</label>
                <input
                  className="input-field w-full"
                  required
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  className="input-field w-full"
                  rows={4}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PDF (optional, max 15MB)</label>
                <input ref={fileRef} type="file" accept="application/pdf" className="block w-full text-sm" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isSaving || isUploadingPdf} className="btn-primary">
                  {isUploadingPdf ? 'Uploading…' : isSaving ? 'Saving…' : 'Add note'}
                </button>
                <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">{selected.title}</h2>
              <button type="button" className="text-gray-400" onClick={() => setSelected(null)}>
                ✕
              </button>
            </div>
            <p className="text-sm text-academic-blue font-medium mb-1">{selected.subject}</p>
            <p className="text-gray-600 mb-4">by {selected.author}</p>
            <p className="text-gray-700 mb-6 whitespace-pre-wrap">{selected.description}</p>
            <p className="text-xs text-gray-500 mb-4">
              Added {formatDate(selected.createdAt)}
              {selected.fileSizeLabel ? ` • ${selected.fileSizeLabel}` : ''}
            </p>
            <div className="flex gap-3 flex-wrap">
              {selected.fileUrl ? (
                <a
                  href={selected.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-block text-center"
                >
                  Download PDF
                </a>
              ) : null}
              <button type="button" className="bg-red-600 text-white px-4 py-2 rounded-lg" onClick={() => handleDelete(selected._id)}>
                Delete
              </button>
              <button type="button" className="btn-secondary" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 py-12 bg-white rounded-lg border">No notes yet.</p>
        ) : (
          notes.map((n) => (
            <button
              key={n._id}
              type="button"
              onClick={() => setSelected(n)}
              className="text-left bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <span className="text-xs font-medium text-academic-blue bg-blue-50 px-2 py-1 rounded">{n.subject}</span>
              <h3 className="font-semibold text-gray-900 mt-3 line-clamp-2">{n.title}</h3>
              <p className="text-sm text-gray-600 mt-2">by {n.author}</p>
              <p className="text-xs text-gray-400 mt-4">{formatDate(n.createdAt)}</p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
