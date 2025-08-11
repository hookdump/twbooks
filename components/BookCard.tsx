'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Book } from '@/types';
import { FiMessageCircle, FiRepeat, FiHeart, FiShare, FiExternalLink, FiRefreshCw, FiMoreHorizontal } from 'react-icons/fi';
import { generateAmazonLink, generateKindleLink, generateGoodreadsLink } from '@/lib/utils/amazon';

interface BookCardProps {
  book: Book;
  onUnfollow?: (id: string) => void;
  onRefreshQuote?: (id: string) => void;
  isLoading?: boolean;
}

export default function BookCard({ book, onUnfollow, onRefreshQuote, isLoading = false }: BookCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isRetweeted, setIsRetweeted] = useState(false);

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
              <p className="mb-2">
                📖 Currently reading: <strong>{book.title}</strong>
              </p>
              {book.quote && (
                <blockquote className="italic">
                  &ldquo;{book.quote}&rdquo;
                </blockquote>
              )}
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

          {/* Action Buttons - Twitter style */}
          <div className="flex items-center justify-between mt-3 max-w-md">
            {/* Reply */}
            <button className="twitter-icon-button reply group">
              <div className="flex items-center space-x-2">
                <FiMessageCircle size={18} />
                <span className="text-13 group-hover:text-twitter-blue">0</span>
              </div>
            </button>

            {/* Retweet */}
            <button 
              className={`twitter-icon-button retweet group ${isRetweeted ? 'text-green-600' : ''}`}
              onClick={() => setIsRetweeted(!isRetweeted)}
            >
              <div className="flex items-center space-x-2">
                <FiRepeat size={18} />
                <span className="text-13 group-hover:text-green-600">{isRetweeted ? 1 : 0}</span>
              </div>
            </button>

            {/* Like */}
            <button 
              className={`twitter-icon-button like group ${isLiked ? 'text-red-600' : ''}`}
              onClick={() => setIsLiked(!isLiked)}
            >
              <div className="flex items-center space-x-2">
                <FiHeart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                <span className="text-13 group-hover:text-red-600">{isLiked ? 1 : 0}</span>
              </div>
            </button>

            {/* Share/More Actions */}
            <div className="flex items-center space-x-1">
              {/* External links */}
              <a
                href={generateAmazonLink(book.title, book.author, book.isbn)}
                target="_blank"
                rel="noopener noreferrer"
                className="twitter-icon-button"
                title="View on Amazon"
              >
                <FiExternalLink size={16} />
              </a>
              
              {/* Refresh quote */}
              {onRefreshQuote && (
                <button
                  onClick={() => onRefreshQuote(book.id)}
                  disabled={isLoading}
                  className="twitter-icon-button disabled:opacity-50"
                  title="Get new quote"
                >
                  <FiRefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                </button>
              )}
              
              {/* Share */}
              <button className="twitter-icon-button" title="Share">
                <FiShare size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}