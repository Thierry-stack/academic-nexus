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
      // For now, we'll use mock data. In a real app, you'd call the API
      const mockData: SearchAnalytics = {
        popularSearches: [
          { _id: 'programming', count: 45, avgResults: 12, lastSearched: new Date().toISOString() },
          { _id: 'machine learning', count: 32, avgResults: 8, lastSearched: new Date().toISOString() },
          { _id: 'web development', count: 28, avgResults: 15, lastSearched: new Date().toISOString() },
          { _id: 'data science', count: 24, avgResults: 10, lastSearched: new Date().toISOString() },
          { _id: 'artificial intelligence', count: 18, avgResults: 6, lastSearched: new Date().toISOString() },
        ],
        searchTrends: [
          { _id: '2024-01-01', searches: 15 },
          { _id: '2024-01-02', searches: 22 },
          { _id: '2024-01-03', searches: 18 },
          { _id: '2024-01-04', searches: 25 },
          { _id: '2024-01-05', searches: 30 },
          { _id: '2024-01-06', searches: 28 },
          { _id: '2024-01-07', searches: 35 },
        ],
        totalSearches: 3456,
        period: `${timeRange} days`
      };
      
      setAnalytics(mockData);
      
      // In a real app, you'd use:
      // const response = await fetch(`/api/analytics?days=${timeRange}`);
      // const data = await response.json();
      // setAnalytics(data);
      
    } catch (error) {
      console.error('Error fetching analytics:', error);
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
              <p className="text-2xl font-bold text-gray-900">{analytics?.totalSearches.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-gray-900">{analytics?.popularSearches.length}</p>
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
                {((analytics?.popularSearches || []).reduce((acc, curr) => acc + curr.avgResults, 0) / ((analytics?.popularSearches || []).length || 1)).toFixed(1)}
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
            {analytics?.popularSearches.map((search, index) => (
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
            {analytics?.searchTrends.map((day) => (
              <div key={day._id} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{day._id}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-academic-blue h-2 rounded-full" 
                      style={{ 
                        width: `${(day.searches / Math.max(...(analytics?.searchTrends || []).map(t => t.searches))) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">
                    {day.searches}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">📈 Trending Topics</h3>
            <p className="text-blue-700 text-sm">
              "Programming" and "Machine Learning" are the most searched topics, 
              indicating high student interest in computer science and AI fields.
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">💡 Recommendation</h3>
            <p className="text-green-700 text-sm">
              Consider adding more books on Data Science and Artificial Intelligence 
              based on search popularity and student requests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}