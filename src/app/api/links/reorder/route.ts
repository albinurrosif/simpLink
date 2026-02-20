import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/jwt'; // Pastikan path ini benar
import { reorderUserLinks } from '@/lib/modules/link/link.service'; // Sesuaikan path

export async function POST(req: Request) {
  try {
    const { linkIds } = await req.json();
    console.log('Link IDs yang diterima:', linkIds);
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    console.log('Token yang diterima:', token);

    // SOLUSI ERROR 1: Cek apakah token ada
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    console.log('Payload yang diterima:', payload);

    // SOLUSI ERROR 2: Type Assertion (Gunakan 'as' agar TS tahu ada userId)
    if (!payload || typeof payload === 'string') {
      return NextResponse.json({ message: 'Invalid Token' }, { status: 401 });
    }

    const userId = (payload as any).userId;
    console.log('User ID yang diterima:', userId);

    console.log('Tipe reorderUserLinks:', typeof reorderUserLinks);
    await reorderUserLinks(userId, linkIds);
    console.log('Reorder berhasil untuk userId:', userId, 'dengan linkIds:', linkIds);

    return NextResponse.json(
      {
        success: true,
        message: 'Urutan berhasil diperbarui',
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('!!! CRASH DI ROUTE !!!');
    console.error('Pesan Error:', error.message);
    console.error('Stack Trace:', error.stack);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
