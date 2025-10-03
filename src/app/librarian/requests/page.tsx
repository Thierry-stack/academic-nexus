'use client';

import { useState, useEffect } from 'react';

interface BookRequest {
  _id: string;
  studentName: string;
  studentEmail: string;
  bookTitle: string;
  author: string;
  isbn?: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export default function RequestsManagement() {
  const [requests, setRequests] = useState<BookRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<BookRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedRequest, setSelectedRequest] = useState<BookRequest | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, statusFilter]);

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/requests');
      const data = await response.json();
      setRequests(data.requests || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterRequests = () => {
    if (statusFilter === 'all') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter(req => req.status === statusFilter));
    }
  };

  const updateRequestStatus = async (requestId: string, newStatus: 'approved' | 'rejected') => {
    try {
      // For now, we'll update locally. In a real app, you'd call an API
      setRequests(requests.map(req => 
        req._id === requestId ? { ...req, status: newStatus } : req
      ));
      
      setSelectedRequest(null);
      alert(`Request ${newStatus} successfully!`);
      
      // In a real app, you'd call:
      // await fetch(`/api/requests/${requestId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus })
      // });
      
    } catch (error) {
      console.error('Error updating request:', error);
      alert('Failed to update request');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Requests</h1>
          <p className="text-gray-600">Manage student book purchase requests</p>
        </div>
        
        {/* Status Filter */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-academic-blue"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <span className="text-2xl">📝</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg mr-4">
              <span className="text-2xl">⏳</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {requests.filter(req => req.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {requests.filter(req => req.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg mr-4">
              <span className="text-2xl">❌</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">
                {requests.filter(req => req.status === 'rejected').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredRequests.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-500 text-lg mb-4">No book requests found</p>
            <p className="text-gray-400 text-sm">
              {statusFilter === 'all' 
                ? 'Students haven\'t submitted any book requests yet.'
                : `No ${statusFilter} requests found.`
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book & Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {request.bookTitle}
                        </div>
                        <div className="text-sm text-gray-500">
                          by {request.author}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          {request.studentName} • {request.studentEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        <p className="line-clamp-2">{request.reason}</p>
                        {request.isbn && (
                          <p className="text-gray-500 text-xs mt-1">
                            ISBN: {request.isbn}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {request.status === 'pending' ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateRequestStatus(request._id, 'approved')}
                            className="text-green-600 hover:text-green-900 font-medium"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateRequestStatus(request._id, 'rejected')}
                            className="text-red-600 hover:text-red-900 font-medium"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="text-academic-blue hover:text-blue-700"
                        >
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Request Details</h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Book Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Book Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium text-gray-900">{selectedRequest.bookTitle}</p>
                    <p className="text-gray-600">by {selectedRequest.author}</p>
                    {selectedRequest.isbn && (
                      <p className="text-sm text-gray-500 mt-1">ISBN: {selectedRequest.isbn}</p>
                    )}
                  </div>
                </div>

                {/* Student Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Student Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium text-gray-900">{selectedRequest.studentName}</p>
                    <p className="text-gray-600">{selectedRequest.studentEmail}</p>
                  </div>
                </div>

                {/* Request Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Reason</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{selectedRequest.reason}</p>
                  </div>
                </div>

                {/* Status and Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Status</h4>
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Submitted</h4>
                    <p className="text-gray-600 text-sm">{formatDate(selectedRequest.createdAt)}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="btn-primary flex-1"
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