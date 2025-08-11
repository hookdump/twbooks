import { kv } from '@vercel/kv';
import { Book } from '@/types';
import { Database as DatabaseInterface } from './interface';
import { randomUUID } from 'crypto';

/**
 * Vercel KV Database Implementation
 * 
 * This adapter implements the Database interface using Vercel KV storage.
 * It uses Redis-style operations (SET, GET, DEL, SCAN) to store books as JSON.
 * 
 * Key patterns:
 * - book:{id} - Individual book data
 * - books:list - Ordered list of book IDs (for maintaining insertion order)
 * - books:count - Total number of books
 */
export class KVDatabase extends DatabaseInterface {
  private readonly BOOK_PREFIX = 'book:';
  private readonly BOOKS_LIST_KEY = 'books:list';
  private readonly BOOKS_COUNT_KEY = 'books:count';

  constructor() {
    super();
  }

  async init(): Promise<void> {
    try {
      // Initialize books count if it doesn't exist
      const count = await kv.get(this.BOOKS_COUNT_KEY);
      if (count === null) {
        await kv.set(this.BOOKS_COUNT_KEY, 0);
      }

      // Initialize books list if it doesn't exist
      const list = await kv.get(this.BOOKS_LIST_KEY);
      if (list === null) {
        await kv.set(this.BOOKS_LIST_KEY, []);
      }

      console.log('KV Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize KV database:', error);
      throw error;
    }
  }

  async getBooks(): Promise<Book[]> {
    try {
      // Get the ordered list of book IDs
      const bookIds = await kv.get<string[]>(this.BOOKS_LIST_KEY) || [];
      
      if (bookIds.length === 0) {
        return [];
      }

      // Get all books in parallel
      const bookPromises = bookIds.map(async (id) => {
        const book = await kv.get<Book>(`${this.BOOK_PREFIX}${id}`);
        return book;
      });

      const books = await Promise.all(bookPromises);
      
      // Filter out null results and reverse for most recent first
      return books
        .filter((book): book is Book => book !== null)
        .reverse(); // Most recent first (since we append to list)
    } catch (error) {
      console.error('Failed to get books from KV:', error);
      throw error;
    }
  }

  async addBook(book: Omit<Book, 'id' | 'followed_at'>): Promise<Book> {
    try {
      const id = randomUUID();
      const followed_at = new Date().toISOString();
      
      const newBook: Book = {
        ...book,
        id,
        followed_at
      };

      // Store the book
      await kv.set(`${this.BOOK_PREFIX}${id}`, newBook);

      // Add to books list (append to end)
      const bookIds = await kv.get<string[]>(this.BOOKS_LIST_KEY) || [];
      bookIds.push(id);
      await kv.set(this.BOOKS_LIST_KEY, bookIds);

      // Increment count
      await kv.incr(this.BOOKS_COUNT_KEY);

      console.log(`Added book to KV: ${newBook.title} by ${newBook.author}`);
      return newBook;
    } catch (error) {
      console.error('Failed to add book to KV:', error);
      throw error;
    }
  }

  async removeBook(id: string): Promise<boolean> {
    try {
      // Check if book exists
      const book = await kv.get<Book>(`${this.BOOK_PREFIX}${id}`);
      if (!book) {
        return false;
      }

      // Remove from KV
      await kv.del(`${this.BOOK_PREFIX}${id}`);

      // Remove from books list
      const bookIds = await kv.get<string[]>(this.BOOKS_LIST_KEY) || [];
      const updatedBookIds = bookIds.filter(bookId => bookId !== id);
      await kv.set(this.BOOKS_LIST_KEY, updatedBookIds);

      // Decrement count
      await kv.decr(this.BOOKS_COUNT_KEY);

      console.log(`Removed book from KV: ${id}`);
      return true;
    } catch (error) {
      console.error('Failed to remove book from KV:', error);
      throw error;
    }
  }

  async getBook(id: string): Promise<Book | null> {
    try {
      const book = await kv.get<Book>(`${this.BOOK_PREFIX}${id}`);
      return book;
    } catch (error) {
      console.error('Failed to get book from KV:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    // Vercel KV doesn't require explicit connection closing
    console.log('KV Database connection closed');
  }

  /**
   * Get the total number of books stored
   */
  async getBookCount(): Promise<number> {
    try {
      const count = await kv.get<number>(this.BOOKS_COUNT_KEY);
      return count || 0;
    } catch (error) {
      console.error('Failed to get book count from KV:', error);
      return 0;
    }
  }

  /**
   * Search books by title or author (basic implementation)
   * Note: This is a simple search implementation. For production,
   * consider using a dedicated search service like Algolia.
   */
  async searchBooks(query: string): Promise<Book[]> {
    try {
      const books = await this.getBooks();
      const lowercaseQuery = query.toLowerCase();
      
      return books.filter(book => 
        book.title.toLowerCase().includes(lowercaseQuery) ||
        book.author.toLowerCase().includes(lowercaseQuery) ||
        book.description?.toLowerCase().includes(lowercaseQuery)
      );
    } catch (error) {
      console.error('Failed to search books in KV:', error);
      throw error;
    }
  }
}

// Singleton instance
let kvDbInstance: KVDatabase | null = null;

export function getKVDatabase(): KVDatabase {
  if (!kvDbInstance) {
    kvDbInstance = new KVDatabase();
  }
  return kvDbInstance;
}