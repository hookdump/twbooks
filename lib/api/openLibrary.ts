import axios from 'axios';
import { SearchResult, OpenLibraryResponse } from '@/types';

const OPEN_LIBRARY_BASE_URL = 'https://openlibrary.org';

export async function searchBooks(query: string, limit: number = 20): Promise<SearchResult[]> {
  try {
    // Add language filter to query to get primarily English results
    const englishQuery = `${query} language:eng`;
    
    const response = await axios.get<OpenLibraryResponse>(
      `${OPEN_LIBRARY_BASE_URL}/search.json`,
      {
        params: {
          q: englishQuery,
          limit: limit * 2, // Request more to filter out non-English
          fields: 'key,title,author_name,first_publish_year,isbn,cover_i,publisher,language,subject',
        },
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