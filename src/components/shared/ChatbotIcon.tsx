'use client';

import { useState, useEffect } from 'react';

export default function ChatbotIcon() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the chat icon after a short delay to ensure smooth page load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const openChatbot = () => {
    // Trigger the chatbot on click
    if (typeof window !== 'undefined') {
      // Method 1: Try to trigger via window object
      if ((window as any).chatling && typeof (window as any).chatling.open === 'function') {
        (window as any).chatling.open();
        return;
      }
      
      // Method 2: Temporarily show and click the hidden chatbot widget
      const chatbotWidget = document.querySelector('[data-chatling-widget], .chtl-widget, iframe[src*="chatling"]');
      if (chatbotWidget) {
        // Temporarily show the widget
        (chatbotWidget as HTMLElement).style.display = 'block';
        (chatbotWidget as HTMLElement).style.visibility = 'visible';
        
        // Click it to open
        (chatbotWidget as HTMLElement).click();
        
        // Hide it again after a short delay
        setTimeout(() => {
          (chatbotWidget as HTMLElement).style.display = 'none';
          (chatbotWidget as HTMLElement).style.visibility = 'hidden';
        }, 100);
        
        return;
      }
      
      // Method 3: Look for any Chatling elements and temporarily show them
      const chatElements = document.querySelectorAll('[class*="chatling"], [id*="chatling"]');
      for (const element of chatElements) {
        if (element.tagName === 'BUTTON' || element.getAttribute('role') === 'button') {
          // Temporarily show and click
          (element as HTMLElement).style.display = 'block';
          (element as HTMLElement).click();
          
          // Hide again
          setTimeout(() => {
            (element as HTMLElement).style.display = 'none';
          }, 100);
          
          return;
        }
      }
      
      // Method 4: Wait and try again if widget is still loading
      setTimeout(() => {
        const chatbotWidget = document.querySelector('[data-chatling-widget], .chtl-widget, iframe[src*="chatling"]');
        if (chatbotWidget) {
          (chatbotWidget as HTMLElement).style.display = 'block';
          (chatbotWidget as HTMLElement).style.visibility = 'visible';
          (chatbotWidget as HTMLElement).click();
          
          setTimeout(() => {
            (chatbotWidget as HTMLElement).style.display = 'none';
            (chatbotWidget as HTMLElement).style.visibility = 'hidden';
          }, 100);
        }
      }, 1000);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={openChatbot}
        className="group relative bg-academic-gold hover:bg-yellow-500 text-academic-navy p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-academic-gold focus:ring-opacity-50"
        aria-label="Open Chat Assistant"
        title="Need help? Chat with our assistant!"
      >
        {/* Chat Icon */}
        <svg
          className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
        </svg>

        {/* Pulse Animation */}
        <div className="absolute inset-0 bg-academic-gold rounded-full animate-ping opacity-20"></div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Need help navigating?
          <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-900"></div>
        </div>

        {/* Notification Badge (optional - can be removed if not needed) */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-bold">!</span>
        </div>
      </button>
    </div>
  );
}
