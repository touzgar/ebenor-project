import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import { ProjectsContent } from '@/lib/models/ProjectsContent';

export const dynamic = 'force-dynamic';

// GET - Get projects content (public endpoint)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const projectsContent = await ProjectsContent.findOne().sort({ updatedAt: -1 }).lean();
    
    if (!projectsContent) {
      return NextResponse.json({
        success: false,
        error: 'No projects content found',
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: projectsContent,
    });
  } catch (error) {
    console.error('Error fetching projects content:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch projects content',
    }, { status: 500 });
  }
}
