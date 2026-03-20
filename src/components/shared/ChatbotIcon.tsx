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
      
      // Method 2: Look for the chatbot widget and click it
      const chatbotWidget = document.querySelector('[data-chatling-widget]');
      if (chatbotWidget) {
        (chatbotWidget as HTMLElement).click();
        return;
      }
      
      // Method 3: Look for any chatling elements
      const chatElements = document.querySelectorAll('[class*="chatling"], [id*="chatling"]');
      for (const element of chatElements) {
        if (element.tagName === 'BUTTON' || element.getAttribute('role') === 'button') {
          (element as HTMLElement).click();
          return;
        }
      }
      
      // Method 4: Wait a bit and try again
      setTimeout(() => {
        const chatbotWidget = document.querySelector('[data-chatling-widget]');
        if (chatbotWidget) {
          (chatbotWidget as HTMLElement).click();
        }
      }, 1000);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={openChatbot}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg ring-1 ring-black/10 transition-all duration-300 hover:bg-gray-800 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
        aria-label="Open Chat Assistant"
        title="Need help? Chat with our assistant!"
      >
        <svg
          className="h-6 w-6 transition-transform duration-300 group-hover:scale-110"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
        </svg>

        <div className="pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100">
          Need help navigating?
          <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-900" />
        </div>
      </button>
    </div>
  );
}
