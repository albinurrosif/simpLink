import { NextResponse } from 'next/server';
import { getPublicProfile } from '@/lib/modules/public/public.service';
import { errorResponse } from '@/lib/shared/response';


export async function GET(request: Request, { params }: { params: { username: string } }) {
  try {
    const user = await getPublicProfile(params.username);
    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: any) {
    if (error.message === 'User not found') {
      return errorResponse(error.message, 404);
    }
    return errorResponse(error.message, 500);
  }
}
