'use client';

import { useState } from 'react';
import Image from 'next/image';
import { SearchResult } from '@/types';
import { FiPlus, FiLoader, FiBook } from 'react-icons/fi';

interface SearchResultProps {
  result: SearchResult;
  onFollow: (result: SearchResult) => void;
  isFollowing?: boolean;
}

export default function SearchResultCard({ result, onFollow, isFollowing = false }: SearchResultProps) {
  const [imageError, setImageError] = useState(false);

  const author = result.author_name ? result.author_name.join(', ') : 'Unknown Author';
  const publishYear = result.first_publish_year ? ` (${result.first_publish_year})` : '';
  const isbn = result.isbn ? result.isbn[0] : undefined;

  return (
    <div className="bg-white dark:bg-dark-secondary border border-gray-200 dark:border-dark-border rounded-lg p-4 hover:shadow-lg dark:hover:shadow-xl hover-lift">
      <div className="flex space-x-4">
        {/* Book Cover */}
        <div className="flex-shrink-0">
          <div className="w-16 h-24 rounded overflow-hidden bg-gray-200 dark:bg-dark-bg">
            {result.cover_i && !imageError ? (
              <Image
                src={`https://covers.openlibrary.org/b/id/${result.cover_i}-M.jpg`}
                alt={`${result.title} cover`}
                width={64}
                height={96}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-dark-text-secondary">
                <FiBook size={24} />
              </div>
            )}
          </div>
        </div>

        {/* Book Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-dark-text text-lg line-clamp-2 mb-1">
                {result.title}{publishYear}
              </h3>
              <p className="text-gray-600 dark:text-dark-text-secondary text-sm mb-2">
                by {author}
              </p>

              {/* Additional info */}
              <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-dark-text-secondary">
                {result.publisher && result.publisher[0] && (
                  <span className="bg-gray-100 dark:bg-dark-hover px-2 py-1 rounded">
                    {result.publisher[0]}
                  </span>
                )}
                {result.language && result.language[0] && (
                  <span className="bg-gray-100 dark:bg-dark-hover px-2 py-1 rounded">
                    {result.language[0].toUpperCase()}
                  </span>
                )}
                {isbn && (
                  <span className="bg-gray-100 dark:bg-dark-hover px-2 py-1 rounded">
                    ISBN: {isbn}
                  </span>
                )}
              </div>

              {/* Subjects/Tags */}
              {result.subject && result.subject.length > 0 && (
                <div className="mt-2">
                  <div className="flex flex-wrap gap-1">
                    {result.subject.slice(0, 3).map((subject, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded"
                      >
                        {subject}
                      </span>
                    ))}
                    {result.subject.length > 3 && (
                      <span className="text-xs text-gray-500 dark:text-dark-text-secondary px-2 py-1">
                        +{result.subject.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Follow Button */}
            <button
              onClick={() => onFollow(result)}
              disabled={isFollowing}
              className="ml-4 flex items-center space-x-2 bg-twitter-blue hover:bg-twitter-dark-blue text-white px-4 py-2 rounded-full font-medium text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFollowing ? (
                <>
                  <FiLoader size={16} className="animate-spin" />
                  <span>Following...</span>
                </>
              ) : (
                <>
                  <FiPlus size={16} />
                  <span>Follow</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}