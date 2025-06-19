import { NextRequest, NextResponse } from 'next/server';
import { searchEmojis, getPopularEmojis } from '@/lib/search';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    
    if (!query || query.trim() === '') {
      // Return popular emojis when no query
      const popularEmojis = getPopularEmojis();
      return NextResponse.json({
        results: popularEmojis,
        query: '',
        total: popularEmojis.length
      });
    }
    
    // Perform search
    const searchResults = searchEmojis(query.trim());
    const emojis = searchResults.map(result => result.emoji);
    
    return NextResponse.json({
      results: emojis,
      query: query.trim(),
      total: emojis.length
    });
    
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}