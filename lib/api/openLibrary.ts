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
      // AGGRESSIVE English-only filtering
      // 1. Must have title and author
      if (!book.title || !book.author_name || book.author_name.length === 0) {
        return false;
      }

      // 2. Check language field - must contain English
      let hasEnglishLanguage = false;
      if (!book.language || book.language.length === 0) {
        // No language specified - assume English for older/legacy entries
        hasEnglishLanguage = true;
      } else {
        // Language specified - must contain English and primarily be English
        const englishCount = book.language.filter(lang => {
          if (!lang) return false;
          const langLower = lang.toLowerCase().trim();
          return langLower === 'eng' || 
                 langLower === 'en' || 
                 langLower === 'english' ||
                 langLower === 'en-us' ||
                 langLower === 'en-gb' ||
                 langLower === 'en-ca' ||
                 langLower === 'en-au';
        }).length;
        
        // Must have English
        hasEnglishLanguage = englishCount > 0;
      }

      if (!hasEnglishLanguage) {
        return false;
      }

      // 3. Filter out books with CJK characters (Chinese, Japanese, Korean)
      const titleHasCJK = /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(book.title);
      if (titleHasCJK) {
        return false;
      }

      // 4. Check author names for CJK characters
      const authorHasCJK = book.author_name.some(author => 
        /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(author)
      );
      if (authorHasCJK) {
        return false;
      }

      // 5. Check subjects for non-English indicators
      if (book.subject && book.subject.length > 0) {
        const nonEnglishSubjects = book.subject.some(subject => {
          if (!subject) return false;
          const subjectLower = subject.toLowerCase();
          return subjectLower.includes('chinese') ||
                 subjectLower.includes('spanish') ||
                 subjectLower.includes('french') ||
                 subjectLower.includes('german') ||
                 subjectLower.includes('japanese') ||
                 subjectLower.includes('korean') ||
                 subjectLower.includes('arabic') ||
                 subjectLower.includes('russian') ||
                 subjectLower.includes('portuguese') ||
                 subjectLower.includes('italian') ||
                 subjectLower.includes('dutch') ||
                 subjectLower.includes('hindi') ||
                 subjectLower.includes('bengali') ||
                 subjectLower.includes('urdu') ||
                 subjectLower.includes('persian') ||
                 subjectLower.includes('turkish') ||
                 subjectLower.includes('hebrew') ||
                 subjectLower.includes('polish') ||
                 subjectLower.includes('czech') ||
                 subjectLower.includes('hungarian') ||
                 subjectLower.includes('swedish') ||
                 subjectLower.includes('norwegian') ||
                 subjectLower.includes('danish') ||
                 subjectLower.includes('finnish') ||
                 subjectLower.includes('greek') ||
                 subjectLower.includes('vietnamese') ||
                 subjectLower.includes('thai') ||
                 subjectLower.includes('indonesian') ||
                 subjectLower.includes('malay') ||
                 subjectLower.includes('filipino') ||
                 subjectLower.includes('tagalog');
        });
        
        if (nonEnglishSubjects) {
          return false;
        }
      }

      return true;
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
      // AGGRESSIVE English-only filtering (same as main search)
      // 1. Must have title and author
      if (!book.title || !book.author_name || book.author_name.length === 0) {
        return false;
      }

      // 2. Check if the author matches (case insensitive)
      const authorMatches = book.author_name?.some(author => 
        author.toLowerCase().includes(authorName.toLowerCase()) ||
        authorName.toLowerCase().includes(author.toLowerCase())
      );
      
      if (!authorMatches) {
        return false;
      }

      // 3. Check language field - must contain English
      let hasEnglishLanguage = false;
      if (!book.language || book.language.length === 0) {
        // No language specified - assume English for older/legacy entries
        hasEnglishLanguage = true;
      } else {
        // Language specified - must contain English and primarily be English
        const englishCount = book.language.filter(lang => {
          if (!lang) return false;
          const langLower = lang.toLowerCase().trim();
          return langLower === 'eng' || 
                 langLower === 'en' || 
                 langLower === 'english' ||
                 langLower === 'en-us' ||
                 langLower === 'en-gb' ||
                 langLower === 'en-ca' ||
                 langLower === 'en-au';
        }).length;
        
        // Must have English
        hasEnglishLanguage = englishCount > 0;
      }

      if (!hasEnglishLanguage) {
        return false;
      }

      // 4. Filter out books with CJK characters (Chinese, Japanese, Korean)
      const titleHasCJK = /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(book.title);
      if (titleHasCJK) {
        return false;
      }

      // 5. Check author names for CJK characters
      const authorHasCJK = book.author_name.some(author => 
        /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(author)
      );
      if (authorHasCJK) {
        return false;
      }

      // 6. Check subjects for non-English indicators
      if (book.subject && book.subject.length > 0) {
        const nonEnglishSubjects = book.subject.some(subject => {
          if (!subject) return false;
          const subjectLower = subject.toLowerCase();
          return subjectLower.includes('chinese') ||
                 subjectLower.includes('spanish') ||
                 subjectLower.includes('french') ||
                 subjectLower.includes('german') ||
                 subjectLower.includes('japanese') ||
                 subjectLower.includes('korean') ||
                 subjectLower.includes('arabic') ||
                 subjectLower.includes('russian') ||
                 subjectLower.includes('portuguese') ||
                 subjectLower.includes('italian') ||
                 subjectLower.includes('dutch') ||
                 subjectLower.includes('hindi') ||
                 subjectLower.includes('bengali') ||
                 subjectLower.includes('urdu') ||
                 subjectLower.includes('persian') ||
                 subjectLower.includes('turkish') ||
                 subjectLower.includes('hebrew') ||
                 subjectLower.includes('polish') ||
                 subjectLower.includes('czech') ||
                 subjectLower.includes('hungarian') ||
                 subjectLower.includes('swedish') ||
                 subjectLower.includes('norwegian') ||
                 subjectLower.includes('danish') ||
                 subjectLower.includes('finnish') ||
                 subjectLower.includes('greek') ||
                 subjectLower.includes('vietnamese') ||
                 subjectLower.includes('thai') ||
                 subjectLower.includes('indonesian') ||
                 subjectLower.includes('malay') ||
                 subjectLower.includes('filipino') ||
                 subjectLower.includes('tagalog');
        });
        
        if (nonEnglishSubjects) {
          return false;
        }
      }

      return true;
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