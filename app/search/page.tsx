'use client';

import { useState } from 'react';
import { FiSearch, FiLoader } from 'react-icons/fi';
import SearchResultCard from '@/components/SearchResult';
import { SearchResult } from '@/types';
import { mutate } from 'swr';
import { getCoverUrl } from '@/lib/api/openLibrary';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}&limit=20`);
      const data = await response.json();
      
      if (data.success) {
        setResults(data.data);
      } else {
        console.error('Search failed:', data.error);
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFollow = async (result: SearchResult) => {
    const key = result.key;
    setFollowingIds(prev => new Set(Array.from(prev).concat([key])));

    try {
      const author = result.author_name ? result.author_name.join(', ') : 'Unknown Author';
      const isbn = result.isbn ? result.isbn[0] : undefined;
      const cover_url = result.cover_i ? getCoverUrl(result.cover_i, 'M') : undefined;

      const bookData = {
        title: result.title,
        author,
        isbn,
        cover_url,
        published_date: result.first_publish_year ? result.first_publish_year.toString() : undefined,
      };

      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      if (response.ok) {
        // Refresh the timeline data
        mutate('/api/books');
        
        // Remove the book from search results
        setResults(prev => prev.filter(book => book.key !== key));
      } else {
        const error = await response.json();
        console.error('Failed to follow book:', error);
      }
    } catch (error) {
      console.error('Error following book:', error);
    } finally {
      setFollowingIds(prev => {
        const newSet = new Set(Array.from(prev));
        newSet.delete(key);
        return newSet;
      });
    }
  };

  return (
    <div>
      {/* Header with Search */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-border">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900 dark:text-dark-text mb-4">
            Explore Books
          </h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dark-text-secondary" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for books, authors, or topics..."
                className="w-full pl-11 pr-4 py-3 bg-gray-100 dark:bg-dark-secondary border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-twitter-blue focus:bg-white dark:focus:bg-dark-hover text-gray-900 dark:text-dark-text placeholder-gray-500 dark:placeholder-dark-text-secondary"
              />
              {isSearching && (
                <FiLoader className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin text-twitter-blue" size={20} />
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Search Results */}
      <div className="p-4">
        {results.length === 0 && query && !isSearching && (
          <div className="text-center py-12">
            <FiSearch size={48} className="mx-auto text-gray-400 dark:text-dark-text-secondary mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-2">
              No books found
            </h3>
            <p className="text-gray-600 dark:text-dark-text-secondary">
              Try searching for a different book, author, or topic
            </p>
          </div>
        )}

        {results.length === 0 && !query && (
          <div className="text-center py-12">
            <FiSearch size={48} className="mx-auto text-gray-400 dark:text-dark-text-secondary mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-2">
              Discover new books
            </h3>
            <p className="text-gray-600 dark:text-dark-text-secondary">
              Search for books, authors, or topics to find your next great read
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((result) => (
              <SearchResultCard
                key={result.key}
                result={result}
                onFollow={handleFollow}
                isFollowing={followingIds.has(result.key)}
              />
            ))}
          </div>
        )}

        {isSearching && (
          <div className="flex justify-center py-8">
            <FiLoader size={32} className="animate-spin text-twitter-blue" />
          </div>
        )}
      </div>
    </div>
  );
}