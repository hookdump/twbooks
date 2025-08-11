export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  cover_url?: string;
  quote?: string;
  amazon_id?: string;
  followed_at: string;
  description?: string;
  published_date?: string;
  page_count?: number;
  goodreads_id?: string;
}

export interface SearchResult {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  isbn?: string[];
  cover_i?: number;
  publisher?: string[];
  language?: string[];
  subject?: string[];
}

export interface OpenLibraryResponse {
  docs: SearchResult[];
  numFound: number;
  start: number;
}

export interface Quote {
  text: string;
  author: string;
  book: string;
  source?: string;
  page_number?: number;
  chapter?: string;
  verified?: boolean;
  fetch_source?: 'goodreads' | 'wikiquote' | 'open_library' | 'project_gutenberg' | 'local' | 'fallback';
  scraped_at?: string;
}

export interface DatabaseInterface {
  init(): Promise<void>;
  getBooks(): Promise<Book[]>;
  addBook(book: Omit<Book, 'id' | 'followed_at'>): Promise<Book>;
  removeBook(id: string): Promise<boolean>;
  getBook(id: string): Promise<Book | null>;
  close(): Promise<void>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}