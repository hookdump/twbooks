import axios from 'axios';
import { SearchResult, OpenLibraryResponse } from '@/types';

const OPEN_LIBRARY_BASE_URL = 'https://openlibrary.org';

// Helper function to detect if query is likely an author name
function isLikelyAuthorName(query: string): boolean {
  // Simple heuristic: 2-4 words, each starting with capital letter, no special chars except spaces/hyphens
  const trimmed = query.trim();
  const words = trimmed.split(/\s+/);
  
  if (words.length < 2 || words.length > 4) return false;
  
  // Check if it matches common name patterns
  const namePattern = /^[A-Za-z][a-z]*(\s+[A-Za-z][a-z]*){1,3}$/;
  return namePattern.test(trimmed);
}

export async function searchBooks(query: string, limit: number = 20): Promise<SearchResult[]> {
  try {
    let searchQuery: string;
    let searchParams: any = {
      limit: limit * 2, // Request more to filter out non-English
      fields: 'key,title,author_name,first_publish_year,isbn,cover_i,publisher,language,subject',
    };
    
    // Check if the query is likely an author name
    if (isLikelyAuthorName(query)) {
      // Search by author field specifically
      searchQuery = `author:"${query}" language:eng`;
      searchParams.q = searchQuery;
    } else {
      // Regular search with language filter
      searchQuery = `${query} language:eng`;
      searchParams.q = searchQuery;
    }
    
    const response = await axios.get<OpenLibraryResponse>(
      `${OPEN_LIBRARY_BASE_URL}/search.json`,
      {
        params: searchParams,
        timeout: 10000, // 10 second timeout
      }
    );

    return response.data.docs.filter(book => {
      // Filter for English books only
      const hasEnglish = !book.language || 
                         book.language.length === 0 || 
                         book.language.some(lang => 
                           lang && (lang.toLowerCase() === 'eng' || 
                                   lang.toLowerCase() === 'en' || 
                                   lang.toLowerCase() === 'english'));
      
      return book.title && 
             book.author_name && 
             book.author_name.length > 0 &&
             hasEnglish;
    }).slice(0, limit); // Limit results after filtering
  } catch (error) {
    console.error('Error searching books:', error);
    return [];
  }
}

// New function to search specifically by author
export async function searchBooksByAuthor(authorName: string, limit: number = 20): Promise<SearchResult[]> {
  try {
    const response = await axios.get<OpenLibraryResponse>(
      `${OPEN_LIBRARY_BASE_URL}/search.json`,
      {
        params: {
          author: authorName,
          q: `language:eng`,
          limit: limit * 2,
          fields: 'key,title,author_name,first_publish_year,isbn,cover_i,publisher,language,subject',
          sort: 'rating desc',
        },
        timeout: 10000,
      }
    );

    return response.data.docs.filter(book => {
      const hasEnglish = !book.language || 
                         book.language.length === 0 || 
                         book.language.some(lang => 
                           lang && (lang.toLowerCase() === 'eng' || 
                                   lang.toLowerCase() === 'en' || 
                                   lang.toLowerCase() === 'english'));
      
      // Check if the author matches (case insensitive)
      const authorMatches = book.author_name?.some(author => 
        author.toLowerCase().includes(authorName.toLowerCase()) ||
        authorName.toLowerCase().includes(author.toLowerCase())
      );
      
      return book.title && 
             book.author_name && 
             book.author_name.length > 0 &&
             hasEnglish &&
             authorMatches;
    }).slice(0, limit);
  } catch (error) {
    console.error('Error searching books by author:', error);
    return [];
  }
}

export function getCoverUrl(coverId: number, size: 'S' | 'M' | 'L' = 'M'): string {
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}

export function getBookUrl(key: string): string {
  return `${OPEN_LIBRARY_BASE_URL}${key}`;
}

export async function getBookDetails(key: string) {
  try {
    const response = await axios.get(`${OPEN_LIBRARY_BASE_URL}${key}.json`, {
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching book details:', error);
    return null;
  }
}