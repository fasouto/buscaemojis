import { NextRequest, NextResponse } from 'next/server';
import { enhanceEmojiData } from '@/lib/emoji-data';

export async function GET(request: NextRequest) {
  try {
    // Return a subset of emoji data optimized for suggestions
    // Only include the fields needed for suggestions
    const allEmojis = enhanceEmojiData();
    
    const suggestionsData = allEmojis.map(emoji => ({
      emoji: emoji.emoji,
      hexcode: emoji.hexcode,
      slug: emoji.slug,
      spanishTitle: emoji.spanishTitle,
      spanishTags: emoji.spanishTags,
      aliases: emoji.aliases,
    }));
    
    return NextResponse.json({
      emojis: suggestionsData
    });
    
  } catch (error) {
    console.error('Suggestions API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}