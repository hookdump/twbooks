import { NextRequest, NextResponse } from 'next/server';
import { getBookQuote, getMultipleQuotes, validateQuote, clearQuoteCache } from '@/lib/utils/quotes';
import { ApiResponse, Quote } from '@/types';

// GET /api/quotes - Get quotes for a specific book
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<Quote[] | Quote>>> {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');
    const author = searchParams.get('author');
    const count = parseInt(searchParams.get('count') || '1');
    const multiple = searchParams.get('multiple') === 'true';

    if (!title || !author) {
      return NextResponse.json(
        {
          success: false,
          error: 'Both title and author parameters are required',
        },
        { status: 400 }
      );
    }

    if (count < 1 || count > 10) {
      return NextResponse.json(
        {
          success: false,
          error: 'Count must be between 1 and 10',
        },
        { status: 400 }
      );
    }

    try {
      if (multiple || count > 1) {
        // Get multiple quotes
        const quotes = await getMultipleQuotes(title, author, count);
        
        if (quotes.length === 0) {
          return NextResponse.json(
            {
              success: false,
              error: 'No authentic quotes found for this book. We only return real quotes from actual books.',
              message: 'Consider checking the title and author spelling, or try a different book.'
            },
            { status: 404 }
          );
        }

        // Validate all quotes
        const validQuotes = quotes.filter(quote => validateQuote(quote));
        
        return NextResponse.json({
          success: true,
          data: validQuotes,
          message: `Found ${validQuotes.length} authentic quote${validQuotes.length !== 1 ? 's' : ''} for ${title} by ${author}`
        });

      } else {
        // Get single quote
        const quote = await getBookQuote(title, author);

        if (!quote) {
          return NextResponse.json(
            {
              success: false,
              error: 'No authentic quotes found for this book. We only return real quotes from actual books.',
              message: 'Consider checking the title and author spelling, or try a different book.'
            },
            { status: 404 }
          );
        }

        // Validate the quote
        if (!validateQuote(quote)) {
          return NextResponse.json(
            {
              success: false,
              error: 'Quote validation failed',
            },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          data: quote,
          message: `Found authentic quote for ${title} by ${author}`
        });
      }

    } catch (fetchError) {
      console.error('Error fetching quotes:', fetchError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch quotes from external sources',
          message: 'Please try again later or check if the book title and author are correct.'
        },
        { status: 503 }
      );
    }

  } catch (error) {
    console.error('Error in quotes API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// POST /api/quotes/clear-cache - Clear the quote cache (useful for development/testing)
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'clear-cache') {
      clearQuoteCache();
      return NextResponse.json({
        success: true,
        data: null,
        message: 'Quote cache cleared successfully'
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid action. Use ?action=clear-cache to clear the quote cache.',
      },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in quotes cache API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to clear cache',
      },
      { status: 500 }
    );
  }
}

// OPTIONS /api/quotes - Handle CORS preflight
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}