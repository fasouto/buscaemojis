import { NextRequest, NextResponse } from 'next/server';
import { getEmojiBySlug, enhanceEmojiData } from '@/lib/emoji-data';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }
    
    // Get the specific emoji by slug
    const emoji = getEmojiBySlug(slug);
    
    if (!emoji) {
      return NextResponse.json(
        { error: 'Emoji not found' },
        { status: 404 }
      );
    }
    
    // Get similar emojis
    const allEmojis = enhanceEmojiData();
    const similarEmojis = allEmojis
      .filter(e => 
        e.group === emoji.group && 
        e.slug !== emoji.slug &&
        e.subgroup === emoji.subgroup
      )
      .slice(0, 8);
    
    return NextResponse.json({
      emoji,
      similarEmojis
    });
    
  } catch (error) {
    console.error('Emoji API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}