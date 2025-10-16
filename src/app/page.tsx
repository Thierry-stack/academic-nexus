import Link from 'next/link';
import ChatbotIcon from '@/components/shared/ChatbotIcon';

export default function Home() {
  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url(/images/homebackground.png)' }}>
      <div className="min-h-screen bg-black bg-opacity-70">
        {/* Navigation */}
        <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <img 
                  src="/images/logo.png" 
                  alt="Academic Nexus Logo" 
                  className="h-10 w-10 object-contain"
                />
                <h1 className="text-2xl font-bold text-white">Academic Nexus</h1>
              </div>
            <div className="flex space-x-4">
              <Link 
                href="/student" 
                className="text-white hover:text-academic-gold transition-colors duration-200"
              >
                Student Portal
              </Link>
              <Link 
                href="/librarian/login" 
                className="bg-academic-gold text-academic-navy px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors duration-200"
              >
                Librarian Login
              </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Welcome to{' '}
            <span className="text-academic-gold">Academic Nexus</span>
          </h1>
          <p className="text-xl text-gray-200 mb-12 max-w-3xl mx-auto">
            A comprehensive digital library management system designed for modern academic institutions. 
            Discover books, access research materials, and manage library resources efficiently.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/student"
              className="bg-academic-gold text-academic-navy px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-500 transition-colors duration-200 transform hover:scale-105"
            >
              Explore Library as Student
            </Link>
            <Link 
              href="/librarian/login"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-academic-navy transition-all duration-200"
            >
              Librarian Access
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
            <h3 className="text-xl font-bold mb-3">Book Discovery</h3>
            <p className="text-gray-200">Advanced search with real-time suggestions and comprehensive browsing capabilities.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
            <h3 className="text-xl font-bold mb-3">Research Materials</h3>
            <p className="text-gray-200">Access books, notes, research papers, and Q&A sections in one platform.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
            <h3 className="text-xl font-bold mb-3">Purchase Requests</h3>
            <p className="text-gray-200">Request new books for the library with detailed submission forms.</p>
          </div>
        </div>
      </main>
      </div>
      
      {/* Chatbot Icon */}
      <ChatbotIcon />
    </div>
  );
}
