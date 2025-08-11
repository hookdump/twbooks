import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/sqlite';
import { ApiResponse } from '@/types';

// DELETE /api/books/[id] - Unfollow a book
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<null>>> {
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

    const success = await db.removeBook(id);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Book not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Book unfollowed successfully',
    });
  } catch (error) {
    console.error('Error unfollowing book:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to unfollow book',
      },
      { status: 500 }
    );
  }
}