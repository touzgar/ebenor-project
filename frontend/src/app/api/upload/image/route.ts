import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route for Image Upload
 * 
 * This endpoint handles image uploads for the admin interface.
 * Images are uploaded to the backend server which handles storage
 * (either local storage or cloud service like Cloudinary).
 */

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(image.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only JPG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (image.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Get auth token from cookie or localStorage (passed in request)
    const authToken = request.cookies.get('auth_token')?.value || 
                     request.headers.get('authorization')?.replace('Bearer ', '');

    if (!authToken) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get CSRF token
    const csrfToken = request.headers.get('x-csrf-token');

    // Forward the image to the backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const backendFormData = new FormData();
    backendFormData.append('image', image);

    const headers: HeadersInit = {
      'Authorization': `Bearer ${authToken}`,
    };

    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }

    const response = await fetch(`${backendUrl}/api/admin/upload/image`, {
      method: 'POST',
      body: backendFormData,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, error: errorData.message || 'Upload failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      url: data.data?.url || data.url,
      publicId: data.data?.publicId || data.publicId,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

