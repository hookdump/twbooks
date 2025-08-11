'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { Book } from '@/types';
import BookCard from './BookCard';
import { FiLoader, FiAlertCircle, FiBookOpen, FiSettings } from 'react-icons/fi';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Timeline() {
  const { data, error, isLoading } = useSWR('/api/books', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  });
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const books = data?.data as Book[] || [];

  const handleUnfollow = async (id: string) => {
    // Just refresh the data, the BookCard handles the DELETE
    mutate('/api/books');
  };

  const handleRefreshQuote = async (id: string) => {
    setActionLoading(id);
    try {
      const response = await fetch(`/api/books/${id}/quote`);
      if (response.ok) {
        // For now, we'll just refresh the timeline
        // In a real app, you might want to update the quote directly
        mutate('/api/books');
      }
    } catch (error) {
      console.error('Error refreshing quote:', error);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header - Twitter-like sticky header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-black bg-opacity-80 dark:bg-opacity-80 backdrop-blur-md border-b border-twitter-gray-100 dark:border-dark-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-twitter-black dark:text-dark-text">
              Home
            </h1>
          </div>
          <button className="twitter-icon-button">
            <FiSettings size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center space-y-4">
            <FiLoader size={32} className="animate-spin text-twitter-blue" />
            <p className="text-15 text-twitter-gray-500 dark:text-dark-text-secondary">
              Loading your book timeline...
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center space-y-4 text-center">
            <FiAlertCircle size={32} className="text-red-500" />
            <p className="text-15 text-twitter-gray-500 dark:text-dark-text-secondary">
              Failed to load your timeline
            </p>
            <button
              onClick={() => mutate('/api/books')}
              className="twitter-link"
            >
              Try again
            </button>
          </div>
        </div>
      ) : books.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center space-y-4 text-center max-w-sm px-8">
            <FiBookOpen size={48} className="text-twitter-gray-400 dark:text-dark-text-secondary" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-twitter-black dark:text-dark-text">
                Welcome to TWBooks!
              </h3>
              <p className="text-15 text-twitter-gray-500 dark:text-dark-text-secondary leading-relaxed">
                This is where you&rsquo;ll see quotes from the books you follow. Start by searching for and following some books to populate your timeline.
              </p>
            </div>
            <a
              href="/search"
              className="twitter-button-primary"
            >
              Find Books
            </a>
          </div>
        </div>
      ) : (
        /* Timeline Content - Twitter-like feed */
        <div>
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onUnfollow={handleUnfollow}
              onRefreshQuote={handleRefreshQuote}
              isLoading={actionLoading === book.id}
            />
          ))}
          
          {/* Bottom spacing */}
          <div className="h-20"></div>
        </div>
      )}
    </div>
  );
}