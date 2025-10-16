import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Academic Nexus - Digital Library',
  description: 'Comprehensive digital library management system for academic institutions',
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
    shortcut: '/images/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
        
        {/* Chatbot Integration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.chtlConfig = { chatbotId: "9258445857" , display: "fullscreen", autoOpen: false }`,
          }}
        />
        <script
          async
          data-id="9258445857"
          id="chtl-script"
          data-display="fullscreen"
          data-auto-open="false"
          type="text/javascript"
          src="https://chatling.ai/js/embed.js"
        />
      </body>
    </html>
  );
}