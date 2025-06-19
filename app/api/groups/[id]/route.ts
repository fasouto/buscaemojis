import { NextRequest, NextResponse } from 'next/server';
import { getEmojiGroups } from '@/lib/emoji-data';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Group ID is required' },
        { status: 400 }
      );
    }
    
    const groups = getEmojiGroups();
    const group = groups.find(g => g.id.toString() === id);
    
    if (!group) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      group
    });
    
  } catch (error) {
    console.error('Group API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}