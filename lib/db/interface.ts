import { Book, DatabaseInterface } from '@/types';

export abstract class Database implements DatabaseInterface {
  abstract init(): Promise<void>;
  abstract getBooks(): Promise<Book[]>;
  abstract addBook(book: Omit<Book, 'id' | 'followed_at'>): Promise<Book>;
  abstract removeBook(id: string): Promise<boolean>;
  abstract getBook(id: string): Promise<Book | null>;
  abstract close(): Promise<void>;
}