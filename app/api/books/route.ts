import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/sqlite';
import { getBookQuote } from '@/lib/utils/quotes';
import { generateAmazonLink } from '@/lib/utils/amazon';
import { ApiResponse, Book } from '@/types';

// GET /api/books - Get all followed books
export async function GET(): Promise<NextResponse<ApiResponse<Book[]>>> {
  try {
    const db = getDatabase();
    await db.init();
    
    const books = await db.getBooks();
    
    return NextResponse.json({
      success: true,
      data: books,
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch books',
      },
      { status: 500 }
    );
  }
}

// POST /api/books - Follow a new book
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Book>>> {
  try {
    const body = await request.json();
    const { title, author, isbn, cover_url, description, published_date, page_count } = body;

    if (!title || !author) {
      return NextResponse.json(
        {
          success: false,
          error: 'Title and author are required',
        },
        { status: 400 }
      );
    }

    const db = getDatabase();
    await db.init();

    // Generate a quote for the book
    const quote = await getBookQuote(title, author);
    
    // Generate Amazon link
    const amazon_id = generateAmazonLink(title, author, isbn);

    const bookData = {
      title,
      author,
      isbn,
      cover_url,
      quote: quote?.text,
      amazon_id,
      description,
      published_date,
      page_count,
    };

    const book = await db.addBook(bookData);

    return NextResponse.json({
      success: true,
      data: book,
      message: 'Book followed successfully',
    });
  } catch (error) {
    console.error('Error following book:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to follow book',
      },
      { status: 500 }
    );
  }
}