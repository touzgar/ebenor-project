import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import { AboutContent } from '@/lib/models/AboutContent';

export const dynamic = 'force-dynamic';

// GET - Get about content (public endpoint)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const aboutContent = await AboutContent.findOne().sort({ updatedAt: -1 }).lean();
    
    if (!aboutContent) {
      return NextResponse.json({
        success: false,
        error: 'No about content found',
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: aboutContent,
    });
  } catch (error) {
    console.error('Error fetching about content:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch about content',
    }, { status: 500 });
  }
}
