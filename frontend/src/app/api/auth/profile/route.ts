import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/helpers';
import { handleApiError } from '@/lib/errors';
import { AdminUser } from '@/lib/models/AdminUser';
import connectDB from '@/lib/db/mongodb';


// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);

    await connectDB();
    const user = await AdminUser.findById(authUser.id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Utilisateur non trouvÃ©',
          code: 'NOT_FOUND',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user.toPublicJSON(),
    });
  } catch (error) {
    const errorResponse = handleApiError(error);
    const statusCode = (error as any).statusCode || 500;
    return NextResponse.json(errorResponse, { status: statusCode });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);
    const body = await request.json();

    await connectDB();
    const user = await AdminUser.findById(authUser.id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Utilisateur non trouvÃ©',
          code: 'NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Update allowed fields
    if (body.firstName) user.firstName = body.firstName;
    if (body.lastName) user.lastName = body.lastName;
    if (body.avatar) user.avatar = body.avatar;

    await user.save();

    return NextResponse.json({
      success: true,
      data: user.toPublicJSON(),
      message: 'Profil mis Ã  jour',
    });
  } catch (error) {
    const errorResponse = handleApiError(error);
    const statusCode = (error as any).statusCode || 500;
    return NextResponse.json(errorResponse, { status: statusCode });
  }
}
