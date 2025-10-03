'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export default function LibrarianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Redirect to login if not authenticated and not on login/register pages
  useEffect(() => {
    if (!isLoading && !user && !pathname.includes('/librarian/login') && !pathname.includes('/librarian/register')) {
      router.push('/librarian/login');
    }
  }, [user, isLoading, pathname, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/librarian/login');
      router.refresh(); // Ensure the page updates to reflect the logged-out state
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/librarian/dashboard" className="flex items-center space-x-2">
                <img 
                  src="/images/logo.png" 
                  alt="Academic Nexus Logo" 
                  className="h-10 w-10 object-contain"
                />
                <span className="text-xl font-bold text-academic-blue">Academic Nexus</span>
              </Link>
              {user && (
                <span className="text-sm text-gray-500">Librarian Portal</span>
              )}
            </div>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/librarian/dashboard" 
                  className="text-gray-600 hover:text-academic-blue transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/librarian/books" 
                  className="text-gray-600 hover:text-academic-blue transition-colors duration-200"
                >
                  Books
                </Link>
                <Link 
                  href="/librarian/requests" 
                  className="text-gray-600 hover:text-academic-blue transition-colors duration-200"
                >
                  Requests
                </Link>
                <Link 
                  href="/librarian/analytics" 
                  className="text-gray-600 hover:text-academic-blue transition-colors duration-200"
                >
                  Analytics
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-academic-blue transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/" 
                  className="text-gray-600 hover:text-academic-blue transition-colors duration-200"
                >
                  Back to Site
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading && pathname !== '/librarian/login' && pathname !== '/librarian/register' ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-academic-blue"></div>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}