import { NextResponse } from 'next/server';
import { getEmojiGroups } from '@/lib/emoji-data';

export async function GET() {
  try {
    const groups = getEmojiGroups();
    
    return NextResponse.json({
      groups
    });
    
  } catch (error) {
    console.error('Groups API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}