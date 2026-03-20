'use client';

import { useState, useEffect } from 'react';

interface SearchAnalytics {
  popularSearches: Array<{
    _id: string;
    count: number;
    avgResults: number;
    lastSearched: string;
  }>;
  searchTrends: Array<{
    _id: string;
    searches: number;
  }>;
  totalSearches: number;
  period: string;
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<SearchAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90'>('7');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics?days=${timeRange}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        setAnalytics({
          popularSearches: [],
          searchTrends: [],
          totalSearches: 0,
          period: `${timeRange} days`,
        });
        return;
      }
      const data = await response.json();
      setAnalytics({
        popularSearches: data.popularSearches ?? [],
        searchTrends: data.searchTrends ?? [],
        totalSearches: data.totalSearches ?? 0,
        period: data.period ?? `${timeRange} days`,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalytics({
        popularSearches: [],
        searchTrends: [],
        totalSearches: 0,
        period: `${timeRange} days`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Analytics</h1>
          <p className="text-gray-600">Monitor search patterns and popular content</p>
        </div>
        
        {/* Time Range Filter */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Time Range:</span>
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

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <span className="text-2xl">🔍</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Searches</p>
              <p className="text-2xl font-bold text-gray-900">
                {(analytics?.totalSearches ?? 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Last {timeRange} days</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <span className="text-2xl">📈</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Unique Search Terms</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics?.popularSearches?.length ?? 0}
              </p>
              <p className="text-xs text-gray-500">Different queries</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <span className="text-2xl">📚</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Results per Search</p>
              <p className="text-2xl font-bold text-gray-900">
                {(() => {
                  const list = analytics?.popularSearches ?? [];
                  if (!list.length) return '0.0';
                  const sum = list.reduce((acc, curr) => acc + (curr.avgResults ?? 0), 0);
                  return (sum / list.length).toFixed(1);
                })()}
              </p>
              <p className="text-xs text-gray-500">Books found per search</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Searches */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Popular Search Terms</h2>
          <div className="space-y-3">
            {(analytics?.popularSearches?.length ?? 0) === 0 && (
              <p className="text-sm text-gray-500">No search data in this period yet.</p>
            )}
            {analytics?.popularSearches?.map((search, index) => (
              <div key={search._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-lg font-bold text-academic-blue mr-3">#{index + 1}</span>
                  <div>
                    <p className="font-medium text-gray-900">{search._id}</p>
                    <p className="text-sm text-gray-500">
                      {search.count} searches • {search.avgResults} avg results
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Last: {new Date(search.lastSearched).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search Trends */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Trends</h2>
          <div className="space-y-4">
            {(analytics?.searchTrends?.length ?? 0) === 0 && (
              <p className="text-sm text-gray-500">No daily trends in this period yet.</p>
            )}
            {(() => {
              const trends = analytics?.searchTrends ?? [];
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
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">
                      {day.searches}
                    </span>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Insights</h2>
        {(analytics?.totalSearches ?? 0) === 0 ? (
          <p className="text-sm text-gray-600">
            As students search the catalog, popular terms and trends will appear here.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">📈 Popular terms</h3>
              <p className="text-blue-700 text-sm">
                Use the list above to see which subjects students look for most often in this
                period.
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">💡 Collection planning</h3>
              <p className="text-green-700 text-sm">
                Cross-check top searches with book requests to decide what to acquire next.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}