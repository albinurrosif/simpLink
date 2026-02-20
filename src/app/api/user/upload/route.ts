import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import cloudinary from '@/lib/cloudinary';
import { uploadProfileImage } from '@/lib/modules/user/user.service';
import { errorResponse } from '@/lib/shared/response';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(request: NextRequest) {
  try {
    // 1. Ambil Token & Verifikasi
    const token = request.cookies.get('auth_token')?.value;
    if (!token) return errorResponse('Unauthorized', 401);

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as number;

    // 2. Ambil File dari Form Data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) return errorResponse('File tidak ditemukan', 400);

    // 3. Konversi File ke Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Upload ke Cloudinary
    const result: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'kumpulink_avatars',
            transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        )
        .end(buffer);
    });

    // 5. Simpan URL ke PostgreSQL lewat Service
    const updatedUser = await uploadProfileImage(userId, result.secure_url);

    return NextResponse.json({
      success: true,
      message: 'Upload berhasil',
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return errorResponse(error.message || 'Gagal memproses upload', 500);
  }
}
