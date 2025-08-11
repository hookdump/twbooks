import Database from 'better-sqlite3';
import { Book } from '@/types';
import { Database as DatabaseInterface } from './interface';
import path from 'path';
import { randomUUID } from 'crypto';

export class SQLiteDatabase extends DatabaseInterface {
  private db: Database.Database | null = null;
  private dbPath: string;

  constructor() {
    super();
    // Store database in project root/data directory
    this.dbPath = path.join(process.cwd(), 'data', 'twbooks.db');
  }

  async init(): Promise<void> {
    try {
      // Ensure data directory exists
      const fs = require('fs');
      const dataDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      this.db = new Database(this.dbPath);
      
      // Create books table
      const createTable = `
        CREATE TABLE IF NOT EXISTS books (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          author TEXT NOT NULL,
          isbn TEXT,
          cover_url TEXT,
          quote TEXT,
          amazon_id TEXT,
          followed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          description TEXT,
          published_date TEXT,
          page_count INTEGER,
          goodreads_id TEXT
        )
      `;
      
      this.db.exec(createTable);

      // Create index for faster queries
      this.db.exec('CREATE INDEX IF NOT EXISTS idx_books_followed_at ON books(followed_at DESC)');
      this.db.exec('CREATE INDEX IF NOT EXISTS idx_books_author ON books(author)');
      this.db.exec('CREATE INDEX IF NOT EXISTS idx_books_title ON books(title)');
      
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  async getBooks(): Promise<Book[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const stmt = this.db.prepare('SELECT * FROM books ORDER BY followed_at DESC');
    const rows = stmt.all();
    
    return rows.map((row: any) => ({
      ...row,
      followed_at: new Date(row.followed_at).toISOString()
    })) as Book[];
  }

  async addBook(book: Omit<Book, 'id' | 'followed_at'>): Promise<Book> {
    if (!this.db) throw new Error('Database not initialized');
    
    const id = randomUUID();
    const followed_at = new Date().toISOString();
    
    const stmt = this.db.prepare(`
      INSERT INTO books (
        id, title, author, isbn, cover_url, quote, amazon_id, 
        followed_at, description, published_date, page_count, goodreads_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      book.title,
      book.author,
      book.isbn || null,
      book.cover_url || null,
      book.quote || null,
      book.amazon_id || null,
      followed_at,
      book.description || null,
      book.published_date || null,
      book.page_count || null,
      book.goodreads_id || null
    );
    
    return {
      ...book,
      id,
      followed_at
    };
  }

  async removeBook(id: string): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');
    
    const stmt = this.db.prepare('DELETE FROM books WHERE id = ?');
    const result = stmt.run(id);
    
    return result.changes > 0;
  }

  async getBook(id: string): Promise<Book | null> {
    if (!this.db) throw new Error('Database not initialized');
    
    const stmt = this.db.prepare('SELECT * FROM books WHERE id = ?');
    const row = stmt.get(id) as any;
    
    if (!row) return null;
    
    return {
      ...row,
      followed_at: new Date((row as any).followed_at).toISOString()
    };
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// Singleton instance
let dbInstance: SQLiteDatabase | null = null;

export function getDatabase(): SQLiteDatabase {
  if (!dbInstance) {
    dbInstance = new SQLiteDatabase();
  }
  return dbInstance;
}