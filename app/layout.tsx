import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

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
      <body className={`${inter.className} bg-white dark:bg-dark-bg min-h-screen`}>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-64">
            <div className="max-w-2xl mx-auto border-x border-gray-200 dark:border-dark-border min-h-screen bg-white dark:bg-dark-bg">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}