import { NextResponse, NextRequest } from 'next/server';
import { loginUser } from '@/lib/modules/auth/auth.service';
import { cookies } from 'next/headers';
import { errorResponse } from '@/lib/shared/response';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { identifier, password } = body;

  if (!identifier || !password) {
    return NextResponse.json(
      {
        success: false,
        message: 'Missing fields',
      },
      {
        status: 400,
      },
    );
  }

  try {
    const result = await loginUser(identifier, password);

    const response = NextResponse.json(
      {
        success: true,
        user: result.user,
      },
      {
        status: 200,
      },
    );

    response.cookies.set({
      name: 'auth_token',
      value: result.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    if (error?.message === 'Invalid credentials') {
      return errorResponse(error.message, 401);
    }
    return errorResponse(error.message, 500);
  }
}
