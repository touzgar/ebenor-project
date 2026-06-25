import { NextRequest, NextResponse } from 'next/server';
import { ContactContent } from '@/lib/models/ContactContent';
import connectDB from '@/lib/db/mongodb';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET - Get contact content (public route)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get the most recent contact content
    const contactContent = await ContactContent.findOne().sort({ updatedAt: -1 }).lean();
    
    if (!contactContent) {
      return NextResponse.json({
        success: true,
        data: null,
      });
    }
    
    return NextResponse.json({
      success: true,
      data: contactContent,
    });
  } catch (error) {
    console.error('Error fetching contact content:', error);
    return NextResponse.json({
      success: false,
      data: null,
    }, { status: 500 });
  }
}
