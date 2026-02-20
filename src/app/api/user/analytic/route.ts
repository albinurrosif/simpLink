import { NextRequest, NextResponse } from 'next/server';
import { recordLinkView } from '@/lib/modules/analytics/linkView.service';

export async function POST(req: NextRequest) {
  try {
    const { linkId } = await req.json();

    // Mengambil metadata dari request headers
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const ua = req.headers.get('user-agent') || 'unknown';

    await recordLinkView(linkId, ip, ua);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
