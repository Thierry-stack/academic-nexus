'use client';

import { useState, useEffect } from 'react';

interface DashboardStats {
  totalBooks: number;
  totalRequests: number;
  pendingRequests: number;
  totalSearches: number;
}

export default function LibrarianDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // For now, we'll use mock data since we don't have real data yet
      const mockStats: DashboardStats = {
        totalBooks: 1247,
        totalRequests: 89,
        pendingRequests: 23,
        totalSearches: 3456,
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Librarian Dashboard</h1>
      <p className="text-gray-600 mb-8">Overview of library operations and statistics</p>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <span className="text-2xl">📚</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Books</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalBooks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <span className="text-2xl">📝</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Book Requests</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg mr-4">
              <span className="text-2xl">⏳</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.pendingRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <span className="text-2xl">🔍</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Searches</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalSearches}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Manage Books</h3>
          <p className="text-gray-600 mb-4">Add, edit, or remove books from the library catalog</p>
          <button className="w-full bg-academic-blue text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Go to Books Management
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Process Requests</h3>
          <p className="text-gray-600 mb-4">Review and manage book purchase requests from students</p>
          <button className="w-full bg-academic-gold text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors duration-200">
            View Requests
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">View Analytics</h3>
          <p className="text-gray-600 mb-4">See search patterns and popular books in the library</p>
          <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200">
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
}