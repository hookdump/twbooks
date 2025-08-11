import axios from 'axios';
import { SearchResult, OpenLibraryResponse } from '@/types';

const OPEN_LIBRARY_BASE_URL = 'https://openlibrary.org';

export async function searchBooks(query: string, limit: number = 20): Promise<SearchResult[]> {
  try {
    const response = await axios.get<OpenLibraryResponse>(
      `${OPEN_LIBRARY_BASE_URL}/search.json`,
      {
        params: {
          q: query,
          limit,
          fields: 'key,title,author_name,first_publish_year,isbn,cover_i,publisher,language,subject',
        },
        timeout: 10000, // 10 second timeout
      }
    );

    return response.data.docs.filter(book => 
      book.title && 
      book.author_name && 
      book.author_name.length > 0
    );
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