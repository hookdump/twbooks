'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Book } from '@/types';
import { FiHeart, FiExternalLink, FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import { generateAmazonLink, generateKindleLink, generateGoodreadsLink } from '@/lib/utils/amazon';

interface BookCardProps {
  book: Book;
  onUnfollow?: (id: string) => void;
  onRefreshQuote?: (id: string) => void;
  isLoading?: boolean;
}

export default function BookCard({ book, onUnfollow, onRefreshQuote, isLoading = false }: BookCardProps) {
  const [imageError, setImageError] = useState(false);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white dark:bg-dark-secondary border-b border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors duration-200 px-4 py-3">
      <div className="flex space-x-3">
        {/* Book Cover (Avatar) */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-dark-bg">
            {book.cover_url && !imageError ? (
              <Image
                src={book.cover_url}
                alt={`${book.title} cover`}
                width={48}
                height={48}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-dark-text-secondary text-xs font-bold">
                📚
              </div>
            )}
          </div>
        </div>

        {/* Book Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <h3 className="font-semibold text-gray-900 dark:text-dark-text text-sm truncate">
                {book.author}
              </h3>
              <span className="text-gray-500 dark:text-dark-text-secondary text-sm">
                @{book.author.toLowerCase().replace(/\s+/g, '')}
              </span>
              <span className="text-gray-500 dark:text-dark-text-secondary text-sm">·</span>
              <span className="text-gray-500 dark:text-dark-text-secondary text-sm">
                {formatTimeAgo(book.followed_at)}
              </span>
            </div>
          </div>

          {/* Book Title */}
          <div className="mt-1">
            <p className="text-gray-900 dark:text-dark-text text-sm font-medium mb-1">
              📖 {book.title}
            </p>
          </div>

          {/* Quote */}
          {book.quote && (
            <div className="mt-2">
              <p className="text-gray-900 dark:text-dark-text text-sm leading-relaxed">
                &ldquo;{book.quote}&rdquo;
              </p>
            </div>
          )}

          {/* Book Metadata */}
          {(book.published_date || book.page_count) && (
            <div className="mt-2 text-xs text-gray-500 dark:text-dark-text-secondary">
              {book.published_date && (
                <span>Published: {book.published_date}</span>
              )}
              {book.published_date && book.page_count && <span> • </span>}
              {book.page_count && (
                <span>{book.page_count} pages</span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-6">
              {/* Links */}
              <div className="flex items-center space-x-2">
                <a
                  href={generateAmazonLink(book.title, book.author, book.isbn)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 dark:text-dark-text-secondary hover:text-twitter-blue dark:hover:text-twitter-blue transition-colors duration-200"
                  title="View on Amazon"
                >
                  <FiExternalLink size={16} />
                </a>
                <a
                  href={generateKindleLink(book.title, book.author)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 dark:text-dark-text-secondary hover:text-twitter-blue dark:hover:text-twitter-blue transition-colors duration-200"
                  title="View on Kindle"
                >
                  📱
                </a>
                <a
                  href={generateGoodreadsLink(book.title, book.author)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 dark:text-dark-text-secondary hover:text-twitter-blue dark:hover:text-twitter-blue transition-colors duration-200"
                  title="View on Goodreads"
                >
                  📖
                </a>
              </div>

              {/* Heart (Followed indicator) */}
              <button
                className="flex items-center space-x-1 text-red-500 hover:text-red-600 transition-colors duration-200"
                title="Following this book"
              >
                <FiHeart size={16} fill="currentColor" />
                <span className="text-xs">Following</span>
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-2">
              {onRefreshQuote && (
                <button
                  onClick={() => onRefreshQuote(book.id)}
                  disabled={isLoading}
                  className="text-gray-500 dark:text-dark-text-secondary hover:text-twitter-blue dark:hover:text-twitter-blue transition-colors duration-200 disabled:opacity-50"
                  title="Refresh quote"
                >
                  <FiRefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                </button>
              )}
              {onUnfollow && (
                <button
                  onClick={() => onUnfollow(book.id)}
                  className="text-gray-500 dark:text-dark-text-secondary hover:text-red-500 dark:hover:text-red-500 transition-colors duration-200"
                  title="Unfollow book"
                >
                  <FiTrash2 size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}