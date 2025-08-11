import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { getBookQuote } from '@/lib/utils/quotes';
import { ApiResponse, Quote } from '@/types';

// GET /api/books/[id]/quote - Get a fresh quote for a book
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<Quote>>> {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Book ID is required',
        },
        { status: 400 }
      );
    }

    const db = getDatabase();
    await db.init();

    const book = await db.getBook(id);

    if (!book) {
      return NextResponse.json(
        {
          success: false,
          error: 'Book not found',
        },
        { status: 404 }
      );
    }

    const quote = await getBookQuote(book.title, book.author);

    if (!quote) {
      return NextResponse.json(
        {
          success: false,
          error: 'No quote found for this book',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: quote,
    });
  } catch (error) {
    console.error('Error fetching quote:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch quote',
      },
      { status: 500 }
    );
  }
}