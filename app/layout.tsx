import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import RightSidebar from '@/components/RightSidebar';

export const metadata: Metadata = {
  title: 'TWBooks - Your Book Timeline',
  description: 'Follow your favorite books and see their quotes in a Twitter-like timeline',
  keywords: ['books', 'reading', 'quotes', 'timeline', 'social'],
  authors: [{ name: 'TWBooks Team' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-black min-h-screen">
        <div className="min-h-screen">
          {/* Twitter-like 3-column layout */}
          <div className="max-w-6xl mx-auto flex">
            {/* Left Sidebar */}
            <div className="w-64 xl:w-275">
              <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0 max-w-2xl border-x border-gray-200 dark:border-gray-800">
              <main className="min-h-screen bg-white dark:bg-black">
                {children}
              </main>
            </div>

            {/* Right Sidebar - hidden on smaller screens */}
            <div className="w-80 hidden lg:block">
              <RightSidebar />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}