import { NextResponse } from 'next/server';


// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET() {
  const uptime = process.uptime();
  const timestamp = new Date().toISOString();
  
  return NextResponse.json({
    status: 'OK',
    message: 'API is healthy',
    timestamp,
    uptime: Math.floor(uptime),
    environment: process.env.NODE_ENV || 'development',
  });
}
