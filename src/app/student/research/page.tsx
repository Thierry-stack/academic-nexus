'use client';

import { useState, useEffect, useMemo } from 'react';

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

export default function ResearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/research-papers');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load');
        if (!cancelled) setPapers(data.papers || []);
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

  const filteredPapers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return papers;
    return papers.filter(
      (paper) =>
        paper.title.toLowerCase().includes(q) ||
        paper.authors.some((a) => a.toLowerCase().includes(q)) ||
        paper.abstract.toLowerCase().includes(q) ||
        paper.keywords.some((k) => k.toLowerCase().includes(q)) ||
        (paper.doi && paper.doi.toLowerCase().includes(q))
    );
  }, [papers, searchQuery]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-12 bg-gray-200 rounded max-w-2xl" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded" />
          ))}
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Research Papers</h1>
        <p className="text-gray-600 mb-6">Explore academic research and scientific publications</p>

        <div className="max-w-2xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search research papers by title, author, or keywords..."
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
          Showing {filteredPapers.length} of {papers.length} research papers
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      </div>

      {filteredPapers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-6xl mb-4">🔬</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No research papers found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery
              ? `No papers match your search for "${searchQuery}"`
              : 'No research papers in the library yet'}
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
        <div className="space-y-6">
          {filteredPapers.map((paper) => (
            <div
              key={paper._id}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setSelectedPaper(paper);
              }}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group p-6"
              onClick={() => setSelectedPaper(paper)}
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-academic-blue transition-colors duration-200">
                    {paper.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">by {paper.authors.join(', ')}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span>{paper.publication}</span>
                    <span>•</span>
                    <span>{paper.year}</span>
                    <span>•</span>
                    <span>{paper.citations} citations</span>
                  </div>
                  <p className="text-gray-600 line-clamp-2 mb-4">{paper.abstract}</p>
                  <div className="flex flex-wrap gap-2">
                    {paper.keywords.map((keyword, index) => (
                      <span key={index} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 lg:mt-0 lg:ml-6 lg:text-right">
                  {paper.doi ? (
                    <div className="text-sm text-gray-500 mb-2">DOI: {paper.doi}</div>
                  ) : null}
                  <span className="text-academic-blue font-medium text-sm">View details →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPaper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Research Paper Details</h2>
                <button
                  type="button"
                  onClick={() => setSelectedPaper(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedPaper.title}</h3>
                  <p className="text-lg text-gray-600">{selectedPaper.authors.join(', ')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Publication:</span>
                    <p className="text-gray-600">{selectedPaper.publication}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Year:</span>
                    <p className="text-gray-600">{selectedPaper.year}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Citations:</span>
                    <p className="text-gray-600">{selectedPaper.citations}</p>
                  </div>
                </div>

                {selectedPaper.doi ? (
                  <div>
                    <span className="font-medium text-gray-700">DOI:</span>
                    <p className="text-gray-600 font-mono text-sm">{selectedPaper.doi}</p>
                  </div>
                ) : null}

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Abstract</h4>
                  <p className="text-gray-600 leading-relaxed">{selectedPaper.abstract}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPaper.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-block bg-academic-blue text-white text-sm px-3 py-1 rounded"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedPaper.documentUrl ? (
                  <div className="pt-4 border-t border-gray-200">
                    <a
                      href={selectedPaper.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-academic-blue text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center space-x-2"
                    >
                      <span>📥</span>
                      <span>Open / download PDF</span>
                    </a>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-2">No PDF attached for this entry.</p>
                )}
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button type="button" onClick={() => setSelectedPaper(null)} className="btn-secondary flex-1">
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
