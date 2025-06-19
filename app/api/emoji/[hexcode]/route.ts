import { NextRequest, NextResponse } from 'next/server';
import { getEmojiByUnicode, enhanceEmojiData } from '@/lib/emoji-data';

export async function GET(
  request: NextRequest,
  { params }: { params: { hexcode: string } }
) {
  try {
    const { hexcode } = params;
    
    if (!hexcode) {
      return NextResponse.json(
        { error: 'Hexcode parameter is required' },
        { status: 400 }
      );
    }
    
    // Get the specific emoji
    const emoji = getEmojiByUnicode(hexcode);
    
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
        e.hexcode !== emoji.hexcode &&
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