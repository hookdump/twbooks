import { NextRequest, NextResponse } from 'next/server';
import { searchBooks, getCoverUrl } from '@/lib/api/openLibrary';
import { ApiResponse, SearchResult } from '@/types';

// GET /api/search - Search books using Open Library API
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<SearchResult[]>>> {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 20;

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: 'Search query is required',
        },
        { status: 400 }
      );
    }

    const results = await searchBooks(query, limit);

    // Enhance results with cover URLs
    const enhancedResults = results.map((book) => ({
      ...book,
      cover_url: book.cover_i ? getCoverUrl(book.cover_i, 'M') : undefined,
    }));

    return NextResponse.json({
      success: true,
      data: enhancedResults,
    });
  } catch (error) {
    console.error('Error searching books:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search books',
      },
      { status: 500 }
    );
  }
}