'use client';

import { useState, useEffect, useRef } from 'react';

interface ResearchPaper {
  _id: string;
  title: string;
  authors: string[];
  abstract: string;
  publication: string;
  year: number;
  doi?: string;
  documentUrl?: string;
  citations: number;
  keywords: string[];
}

const emptyForm = {
  title: '',
  authors: '',
  abstract: '',
  publication: '',
  year: new Date().getFullYear(),
  doi: '',
  citations: 0,
  keywords: '',
};

export default function LibrarianResearchPage() {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [selected, setSelected] = useState<ResearchPaper | null>(null);
  const [form, setForm] = useState(emptyForm);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      const res = await fetch('/api/research-papers');
      const data = await res.json();
      setPapers(data.papers || []);
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
    return {
      fileUrl: data.fileUrl,
      fileSizeLabel: data.fileSizeLabel || '',
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let documentUrl = '';
      const file = fileRef.current?.files?.[0];
      if (file) {
        setIsUploadingPdf(true);
        const up = await uploadPdf(file);
        documentUrl = up.fileUrl;
        setIsUploadingPdf(false);
      }

      const res = await fetch('/api/research-papers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: form.title,
          authors: form.authors,
          abstract: form.abstract,
          publication: form.publication,
          year: form.year,
          doi: form.doi || undefined,
          citations: form.citations,
          keywords: form.keywords,
          documentUrl: documentUrl || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add paper');

      setPapers([data, ...papers]);
      setForm(emptyForm);
      if (fileRef.current) fileRef.current.value = '';
      setShowAddForm(false);
      alert('Research paper added.');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error');
    } finally {
      setIsSaving(false);
      setIsUploadingPdf(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this research paper?')) return;
    try {
      const res = await fetch(`/api/research-papers/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Delete failed');
      }
      setPapers(papers.filter((p) => p._id !== id));
      setSelected(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse h-8 bg-gray-200 rounded w-1/3 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Research papers</h1>
          <p className="text-gray-600 mt-1">Add papers for students (same idea as books)</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg"
        >
          + Add research paper
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Add research paper</h2>
              <button type="button" className="text-gray-400 hover:text-gray-600" onClick={() => setShowAddForm(false)}>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Authors * (comma-separated)</label>
                <input
                  className="input-field w-full"
                  required
                  placeholder="Dr. Jane Doe, Prof. John Smith"
                  value={form.authors}
                  onChange={(e) => setForm({ ...form, authors: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Abstract *</label>
                <textarea
                  className="input-field w-full"
                  rows={4}
                  required
                  value={form.abstract}
                  onChange={(e) => setForm({ ...form, abstract: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Publication / journal *</label>
                  <input
                    className="input-field w-full"
                    required
                    value={form.publication}
                    onChange={(e) => setForm({ ...form, publication: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                  <input
                    type="number"
                    className="input-field w-full"
                    required
                    min={1000}
                    max={2100}
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: parseInt(e.target.value, 10) || form.year })}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">DOI (optional)</label>
                  <input
                    className="input-field w-full"
                    value={form.doi}
                    onChange={(e) => setForm({ ...form, doi: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Citations</label>
                  <input
                    type="number"
                    min={0}
                    className="input-field w-full"
                    value={form.citations}
                    onChange={(e) => setForm({ ...form, citations: parseInt(e.target.value, 10) || 0 })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keywords (comma-separated)</label>
                <input
                  className="input-field w-full"
                  placeholder="Machine Learning, NLP"
                  value={form.keywords}
                  onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PDF (optional, max 15MB)</label>
                <input ref={fileRef} type="file" accept="application/pdf" className="block w-full text-sm text-gray-600" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isSaving || isUploadingPdf} className="btn-primary">
                  {isUploadingPdf ? 'Uploading PDF…' : isSaving ? 'Saving…' : 'Add paper'}
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
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold pr-4">{selected.title}</h2>
              <button type="button" className="text-gray-400 shrink-0" onClick={() => setSelected(null)}>
                ✕
              </button>
            </div>
            <p className="text-gray-600 mb-2">{selected.authors.join(', ')}</p>
            <p className="text-sm text-gray-500 mb-4">
              {selected.publication} • {selected.year} • {selected.citations} citations
            </p>
            {selected.doi ? <p className="text-sm font-mono mb-4">DOI: {selected.doi}</p> : null}
            <p className="text-gray-700 mb-6 whitespace-pre-wrap">{selected.abstract}</p>
            <div className="flex gap-3">
              {selected.documentUrl ? (
                <a
                  href={selected.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-block text-center"
                >
                  Open PDF
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

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {papers.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No research papers yet. Add one to get started.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {papers.map((p) => (
              <li key={p._id}>
                <button
                  type="button"
                  className="w-full text-left py-4 hover:bg-gray-50 px-2 rounded transition-colors"
                  onClick={() => setSelected(p)}
                >
                  <span className="font-medium text-gray-900">{p.title}</span>
                  <span className="text-gray-500 text-sm block mt-1">
                    {p.authors.join(', ')} • {p.year}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
