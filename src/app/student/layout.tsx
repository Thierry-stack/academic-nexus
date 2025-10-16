import Link from 'next/link';
import ChatbotIcon from '@/components/shared/ChatbotIcon';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/student" className="flex items-center space-x-2">
                <img 
                  src="/images/logo.png" 
                  alt="Academic Nexus Logo" 
                  className="h-10 w-10 object-contain"
                />
                <span className="text-xl font-bold text-academic-blue">Academic Nexus</span>
              </Link>
              <span className="text-sm text-gray-500">Student Portal</span>
            </div>
            <div className="flex space-x-4">
              <Link 
                href="/" 
                className="text-gray-600 hover:text-academic-blue transition-colors duration-200"
              >
               Home
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      {children}
      
      {/* Chatbot Icon */}
      <ChatbotIcon />
    </div>
  );
}