'use client';

import useSWR from 'swr';
import { Book } from '@/types';
import { FiBookOpen, FiTrendingUp, FiClock, FiUser } from 'react-icons/fi';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ProfilePage() {
  const { data } = useSWR('/api/books', fetcher);
  const books = data?.data as Book[] || [];

  const totalBooks = books.length;
  const totalAuthors = new Set(books.map(book => book.author)).size;
  const recentlyFollowed = books.slice(0, 5);
  
  // Calculate reading genres from available book data
  const genres = books.reduce((acc, book) => {
    // This is a simplified genre detection - in a real app you'd have proper genre data
    const title = book.title.toLowerCase();
    if (title.includes('harry potter') || title.includes('fantasy') || title.includes('magic')) {
      acc['Fantasy'] = (acc['Fantasy'] || 0) + 1;
    } else if (title.includes('science') || title.includes('mystery') || title.includes('thriller')) {
      acc['Mystery/Thriller'] = (acc['Mystery/Thriller'] || 0) + 1;
    } else if (title.includes('romance') || title.includes('love')) {
      acc['Romance'] = (acc['Romance'] || 0) + 1;
    } else {
      acc['Fiction'] = (acc['Fiction'] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topGenres = Object.entries(genres)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-border">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900 dark:text-dark-text">
            Profile
          </h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-twitter-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-2">
            Book Reader
          </h2>
          <p className="text-gray-600 dark:text-dark-text-secondary">
            @bookreader • Following books since 2024
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-dark-secondary rounded-lg p-4 border border-gray-200 dark:border-dark-border">
            <div className="flex items-center space-x-2">
              <FiBookOpen className="text-twitter-blue" size={20} />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-dark-text">
                  {totalBooks}
                </p>
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
                  Books Following
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-secondary rounded-lg p-4 border border-gray-200 dark:border-dark-border">
            <div className="flex items-center space-x-2">
              <FiUser className="text-twitter-blue" size={20} />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-dark-text">
                  {totalAuthors}
                </p>
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
                  Authors
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Genres */}
        {topGenres.length > 0 && (
          <div className="bg-white dark:bg-dark-secondary rounded-lg p-4 border border-gray-200 dark:border-dark-border">
            <h3 className="flex items-center space-x-2 font-semibold text-gray-900 dark:text-dark-text mb-4">
              <FiTrendingUp className="text-twitter-blue" size={20} />
              <span>Top Genres</span>
            </h3>
            <div className="space-y-3">
              {topGenres.map(([genre, count]) => (
                <div key={genre} className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-dark-text-secondary">
                    {genre}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 dark:bg-dark-hover rounded-full h-2">
                      <div
                        className="bg-twitter-blue h-2 rounded-full"
                        style={{
                          width: `${Math.min((count / totalBooks) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-dark-text">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recently Followed */}
        {recentlyFollowed.length > 0 && (
          <div className="bg-white dark:bg-dark-secondary rounded-lg p-4 border border-gray-200 dark:border-dark-border">
            <h3 className="flex items-center space-x-2 font-semibold text-gray-900 dark:text-dark-text mb-4">
              <FiClock className="text-twitter-blue" size={20} />
              <span>Recently Followed</span>
            </h3>
            <div className="space-y-3">
              {recentlyFollowed.map((book) => (
                <div key={book.id} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-dark-hover rounded flex items-center justify-center text-sm">
                    📚
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-dark-text truncate">
                      {book.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-dark-text-secondary truncate">
                      by {book.author}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-dark-text-secondary">
                    {new Date(book.followed_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {totalBooks === 0 && (
          <div className="text-center py-12">
            <FiBookOpen size={48} className="mx-auto text-gray-400 dark:text-dark-text-secondary mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-2">
              No books followed yet
            </h3>
            <p className="text-gray-600 dark:text-dark-text-secondary mb-4">
              Start following books to build your reading profile
            </p>
            <a
              href="/search"
              className="bg-twitter-blue hover:bg-twitter-dark-blue text-white px-6 py-2 rounded-full font-medium transition-colors duration-200 inline-block"
            >
              Discover Books
            </a>
          </div>
        )}
      </div>
    </div>
  );
}