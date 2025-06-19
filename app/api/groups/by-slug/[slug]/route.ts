import { NextRequest, NextResponse } from 'next/server';
import { getGroupBySlug } from '@/lib/emoji-data';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Group slug is required' },
        { status: 400 }
      );
    }
    
    const group = getGroupBySlug(slug);
    
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
    console.error('Group by slug API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}