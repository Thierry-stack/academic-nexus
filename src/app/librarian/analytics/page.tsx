'use client';

import { useState, useEffect } from 'react';

interface PopularSearch {
  _id: string;
  count: number;
  avgResults: number;
  lastSearched: string;
}

interface LowYieldSearch {
  query: string;
  searchCount: number;
  lastSearched: string;
}

interface SearchAnalyticsPayload {
  popularSearches: PopularSearch[];
  lowYieldSearches: LowYieldSearch[];
  searchTrends: Array<{ _id: string; searches: number }>;
  totalSearches: number;
  uniqueQueryCount: number;
  searchesWithResults: number;
  searchesWithNoResults: number;
  avgResultsWhenFound: number | null;
  avgResultsWhenNotFound: number;
  period: string;
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<SearchAnalyticsPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90'>('7');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const emptyPayload = (periodLabel: string): SearchAnalyticsPayload => ({
    popularSearches: [],
    lowYieldSearches: [],
    searchTrends: [],
    totalSearches: 0,
    uniqueQueryCount: 0,
    searchesWithResults: 0,
    searchesWithNoResults: 0,
    avgResultsWhenFound: null,
    avgResultsWhenNotFound: 0,
    period: periodLabel,
  });

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics?days=${timeRange}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        setAnalytics(emptyPayload(`${timeRange} days`));
        return;
      }
      const data = await response.json();
      setAnalytics({
        popularSearches: data.popularSearches ?? [],
        lowYieldSearches: data.lowYieldSearches ?? [],
        searchTrends: data.searchTrends ?? [],
        totalSearches: data.totalSearches ?? 0,
        uniqueQueryCount: data.uniqueQueryCount ?? 0,
        searchesWithResults: data.searchesWithResults ?? 0,
        searchesWithNoResults: data.searchesWithNoResults ?? 0,
        avgResultsWhenFound:
          typeof data.avgResultsWhenFound === 'number' ? data.avgResultsWhenFound : null,
        avgResultsWhenNotFound: data.avgResultsWhenNotFound ?? 0,
        period: data.period ?? `${timeRange} days`,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalytics(emptyPayload(`${timeRange} days`));
    } finally {
      setIsLoading(false);
    }
  };

  const formatAvg = (v: number | null, digits = 1) => {
    if (v === null || Number.isNaN(v)) return '—';
    return v.toFixed(digits);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const a = analytics;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Analytics</h1>
          <p className="text-gray-600">
            Book catalog searches only — totals, distinct terms, and how often students find matches
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Time range:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '7' | '30' | '90')}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-academic-blue"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Summary: total vs unique vs found vs not found */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <span className="text-2xl">🔍</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total searches</p>
              <p className="text-2xl font-bold text-gray-900">
                {(a?.totalSearches ?? 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Every catalog search in {a?.period}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 rounded-lg mr-4">
              <span className="text-2xl">✨</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Unique search terms</p>
              <p className="text-2xl font-bold text-gray-900">
                {(a?.uniqueQueryCount ?? 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Distinct queries (case-insensitive)</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <span className="text-2xl">📚</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Searches with matches</p>
              <p className="text-2xl font-bold text-gray-900">
                {(a?.searchesWithResults ?? 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                Avg books in catalog:{' '}
                <span className="font-semibold text-gray-800">
                  {formatAvg(a?.avgResultsWhenFound ?? null)}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-amber-100 rounded-lg mr-4">
              <span className="text-2xl">∅</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Searches with no matches</p>
              <p className="text-2xl font-bold text-gray-900">
                {(a?.searchesWithNoResults ?? 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                Avg books found:{' '}
                <span className="font-semibold text-gray-800">
                  {formatAvg(a?.avgResultsWhenNotFound ?? 0)}
                </span>{' '}
                (always 0 — gap in collection)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Popular search terms</h2>
          <p className="text-sm text-gray-500 mb-4">Most repeated queries and typical catalog depth</p>
          <div className="space-y-3">
            {(a?.popularSearches?.length ?? 0) === 0 && (
              <p className="text-sm text-gray-500">No search data in this period yet.</p>
            )}
            {a?.popularSearches?.map((search, index) => (
              <div key={`${search._id}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center min-w-0">
                  <span className="text-lg font-bold text-academic-blue mr-3 shrink-0">#{index + 1}</span>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{search._id}</p>
                    <p className="text-sm text-gray-500">
                      {search.count} searches • avg {search.avgResults} matching books (catalog-wide)
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="text-sm text-gray-500">
                    Last: {new Date(search.lastSearched).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unique / low-yield terms</h2>
          <p className="text-sm text-gray-500 mb-4">
            Queries whose average result count is zero — good candidates for new titles or aliases
          </p>
          <div className="space-y-3">
            {(a?.lowYieldSearches?.length ?? 0) === 0 && (
              <p className="text-sm text-gray-500">
                No zero-result query patterns in this window, or no searches yet.
              </p>
            )}
            {a?.lowYieldSearches?.map((row) => (
              <div
                key={row.query}
                className="flex items-center justify-between p-3 bg-amber-50/80 border border-amber-100 rounded-lg"
              >
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{row.query}</p>
                  <p className="text-sm text-amber-900/80">
                    {row.searchCount} search{row.searchCount === 1 ? '' : 'es'} • 0 books on average
                  </p>
                </div>
                <p className="text-xs text-gray-500 shrink-0 ml-2">
                  {new Date(row.lastSearched).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Search volume by day</h2>
        <div className="space-y-4">
          {(a?.searchTrends?.length ?? 0) === 0 && (
            <p className="text-sm text-gray-500">No daily trends in this period yet.</p>
          )}
          {(() => {
            const trends = a?.searchTrends ?? [];
            const maxSearches = Math.max(1, ...trends.map((t) => t.searches));
            return trends.map((day) => (
              <div key={day._id} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{day._id}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-academic-blue h-2 rounded-full"
                      style={{ width: `${(day.searches / maxSearches) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">{day.searches}</span>
                </div>
              </div>
            ));
          })()}
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">How to read these numbers</h2>
        {(a?.totalSearches ?? 0) === 0 ? (
          <p className="text-sm text-gray-600">
            When students use search on the book catalog, each query is logged once with how many books
            matched the whole collection (not just the first page).
          </p>
        ) : (
          <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
            <li>
              <strong>Total searches</strong> counts every search event. <strong>Unique terms</strong> is how
              many different phrases were tried (ignoring letter case).
            </li>
            <li>
              <strong>Searches with matches</strong> and its average show demand that your catalog already
              satisfies. <strong>No matches</strong> highlights gaps — compare with the low-yield list and
              book requests.
            </li>
            <li>
              Averages use the full match count per search, so they reflect catalog coverage, not page size.
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
