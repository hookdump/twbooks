'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Book } from '@/types';
import { FiMessageCircle, FiShare, FiExternalLink, FiRefreshCw, FiMoreHorizontal, FiX } from 'react-icons/fi';
import { FaAmazon, FaBookReader } from 'react-icons/fa';
import { generateAmazonLink, generateKindleLink, generateGoodreadsLink } from '@/lib/utils/amazon';

interface BookCardProps {
  book: Book;
  onUnfollow?: (id: string) => void;
  onRefreshQuote?: (id: string) => void;
  isLoading?: boolean;
}

export default function BookCard({ book, onUnfollow, onRefreshQuote, isLoading = false }: BookCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isUnfollowing, setIsUnfollowing] = useState(false);

  const handleUnfollow = async () => {
    if (!onUnfollow || isUnfollowing) return;
    
    setIsUnfollowing(true);
    try {
      const response = await fetch(`/api/books/${book.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        onUnfollow(book.id);
      } else {
        console.error('Failed to unfollow book');
      }
    } catch (error) {
      console.error('Error unfollowing book:', error);
    } finally {
      setIsUnfollowing(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const generateUsername = (author: string) => {
    return author.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15);
  };

  return (
    <article className="twitter-card px-4 py-3">
      <div className="flex space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-twitter-gray-100 dark:bg-dark-secondary">
            {book.cover_url && !imageError ? (
              <Image
                src={book.cover_url}
                alt={`${book.title} cover`}
                width={40}
                height={40}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-twitter-gray-400 dark:text-dark-text-secondary">
                📚
              </div>
            )}
          </div>
        </div>

        {/* Tweet Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center space-x-1">
            <h3 className="font-bold text-15 twitter-text hover:underline cursor-pointer truncate">
              {book.author}
            </h3>
            <span className="twitter-text-secondary text-15 truncate">
              @{generateUsername(book.author)}
            </span>
            <span className="twitter-text-secondary text-15">·</span>
            <time className="twitter-text-secondary text-15 hover:underline cursor-pointer">
              {formatTimeAgo(book.followed_at)}
            </time>
            <div className="ml-auto">
              <button className="twitter-icon-button">
                <FiMoreHorizontal size={16} />
              </button>
            </div>
          </div>

          {/* Tweet Text */}
          <div className="mt-1 space-y-2">
            <div className="tweet-content twitter-text">
              {book.quote && (
                <blockquote className="mb-3">
                  &ldquo;{book.quote}&rdquo;
                </blockquote>
              )}
              <p className="text-twitter-gray-500 dark:text-dark-text-secondary text-sm">
                From <strong>{book.title}</strong>
              </p>
            </div>

            {/* Book metadata */}
            {(book.published_date || book.page_count) && (
              <div className="text-13 twitter-text-secondary">
                {book.published_date && (
                  <span>Published {book.published_date}</span>
                )}
                {book.published_date && book.page_count && <span> • </span>}
                {book.page_count && (
                  <span>{book.page_count.toLocaleString()} pages</span>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-4">
            {/* Main Action Buttons */}
            <div className="flex items-center space-x-3">
              {/* Amazon Link */}
              <a
                href={generateAmazonLink(book.title, book.author, book.isbn)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full transition-colors duration-200"
                title="Buy on Amazon"
              >
                <FaAmazon size={14} />
                <span>Amazon</span>
              </a>
              
              {/* Kindle Link */}
              <a
                href={generateKindleLink(book.title, book.author)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-full transition-colors duration-200"
                title="Read on Kindle"
              >
                <FaBookReader size={14} />
                <span>Kindle</span>
              </a>
            </div>

            {/* Secondary Actions */}
            <div className="flex items-center space-x-2">
              {/* Refresh quote */}
              {onRefreshQuote && (
                <button
                  onClick={() => onRefreshQuote(book.id)}
                  disabled={isLoading}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
                  title="Get new quote"
                >
                  <FiRefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                </button>
              )}
              
              {/* Share */}
              <button 
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors" 
                title="Share"
              >
                <FiShare size={16} />
              </button>

              {/* Unfollow */}
              {onUnfollow && (
                <button
                  onClick={handleUnfollow}
                  disabled={isUnfollowing}
                  className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                  title="Unfollow book"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}