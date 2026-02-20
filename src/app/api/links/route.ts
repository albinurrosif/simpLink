import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { addLink, getUserLinks } from '@/lib/modules/link/link.service';
import { errorResponse } from '@/lib/shared/response';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return errorResponse('Unauthorized', 401);
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = Number(payload.userId);

    const body = await request.json();
    const { title, url } = body;

    const newLink = await addLink(userId, title, url);

    return NextResponse.json(
      {
        success: true,
        message: 'Link created successfully',
        data: newLink,
      },
      { status: 201 },
    );
  } catch (error: any) {
    // Jika error adalah soal token/autentikasi (dari jwtVerify)
    if (error.code === 'ERR_JWT_EXPIRED' || error.code === 'ERR_JWS_INVALID') {
      return errorResponse('Session expired', 401);
    }

    // Jika error dilempar manual dari Service (seperti 'Missing fields', 'Title is too long', dll)
    // Kita kirim status 400 (Bad Request) karena kesalahannya ada di input user
    return errorResponse(error.message || 'failed to add link', 400);
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return errorResponse('Unauthorized', 401);
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = Number(payload.userId);

    const links = await getUserLinks(userId);

    return NextResponse.json(
      {
        success: true,
        message: 'Links fetched successfully',
        data: links,
      },
      { status: 200 },
    );
  } catch (error: any) {
    if (error.message === 'No active link found') {
      return errorResponse(error.message, 404);
    }
    return errorResponse(error.message, 500);
  }
}
