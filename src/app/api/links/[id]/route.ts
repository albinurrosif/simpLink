import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { addLink, getUserLinks, updateExistingLink, deleteExistingLink } from '@/lib/modules/link/link.service';
import { errorResponse } from '@/lib/shared/response';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();

    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return errorResponse('Unauthorized', 401);
    }

    const { id } = await params;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = Number(payload.userId);
    const linkId = Number(id);

    const data = {
      ...body,
      userId,
      linkId,
    };

    console.log('Data yang diterima API:', body);
    const updatedLink = await updateExistingLink(data);

    return NextResponse.json(
      {
        success: true,
        message: 'Link updated successfully',
        data: updatedLink,
      },
      { status: 200 },
    );
  } catch (error: any) {
    if (error.message === 'Link not found or unauthorized') {
      return errorResponse(error.message, 404);
    }
    return errorResponse(error.message, 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return errorResponse('Unauthorized', 401);
    }

    const { id } = await params;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = Number(payload.userId);
    const linkId = Number(id);

    const deletedLink = await deleteExistingLink(userId, linkId);

    return NextResponse.json(
      {
        success: true,
        message: 'Link deleted successfully',
        data: deletedLink,
      },
      { status: 200 },
    );
  } catch (error: any) {
    if (error.message === 'Link not found or unauthorized') {
      return errorResponse(error.message, 404);
    }
    return errorResponse(error.message, 500);
  }
}
