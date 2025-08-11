'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { Book } from '@/types';
import BookCard from './BookCard';
import { FiLoader, FiAlertCircle, FiBookOpen } from 'react-icons/fi';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Timeline() {
  const { data, error, isLoading } = useSWR('/api/books', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  });
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const books = data?.data as Book[] || [];

  const handleUnfollow = async (id: string) => {
    setActionLoading(id);
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        mutate('/api/books');
      } else {
        console.error('Failed to unfollow book');
      }
    } catch (error) {
      console.error('Error unfollowing book:', error);
    } finally {
      setActionLoading(null);
    }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-3">
          <FiLoader size={32} className="animate-spin text-twitter-blue" />
          <p className="text-gray-600 dark:text-dark-text-secondary">
            Loading your book timeline...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-3 text-center">
          <FiAlertCircle size={32} className="text-red-500" />
          <p className="text-gray-600 dark:text-dark-text-secondary">
            Failed to load your timeline
          </p>
          <button
            onClick={() => mutate('/api/books')}
            className="text-twitter-blue hover:text-twitter-dark-blue transition-colors duration-200"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4 text-center max-w-sm">
          <FiBookOpen size={48} className="text-gray-400 dark:text-dark-text-secondary" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
            Your timeline is empty
          </h3>
          <p className="text-gray-600 dark:text-dark-text-secondary text-sm">
            Start following books to see their &ldquo;tweets&rdquo; appear here. Search for books to get started!
          </p>
          <a
            href="/search"
            className="bg-twitter-blue hover:bg-twitter-dark-blue text-white px-6 py-2 rounded-full font-medium transition-colors duration-200"
          >
            Find Books
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-dark-border">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onUnfollow={handleUnfollow}
          onRefreshQuote={handleRefreshQuote}
          isLoading={actionLoading === book.id}
        />
      ))}
    </div>
  );
}