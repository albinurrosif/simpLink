import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { getUserProfile, updateUserProfile } from '@/lib/modules/user/user.service';
import { errorResponse } from '@/lib/shared/response';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 401 },
      );
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as number;

    const user = await getUserProfile(userId);

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.log(error);
    if (error?.message === 'User not found') {
      return errorResponse(error.message, 404);
    } else{
      return errorResponse(error.message, 500);
    }
  }
}


export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 401 },
      );
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as number;
    console.log('User ID dari token:', userId);

    const body = await request.json();
    const { username, bio, image, theme } = body;

    const updatedUser = await updateUserProfile(userId, { username, bio, image, theme });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error: any) {
    console.log(error);
    if (error?.message === 'User not found') {
      return errorResponse(error.message, 404);
    } else if (error?.message === 'Username sudah digunakan') {
      return errorResponse(error.message, 400);
    } else {
      return errorResponse(error.message, 500);
    }
  }
}

