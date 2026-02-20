import { NextRequest, NextResponse } from 'next/server';
import { recordLinkView } from '@/lib/modules/analytics/linkView.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { linkId } = body;

    // Ambil metadata dari header
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const ua = request.headers.get('user-agent') || 'unknown';

    if (!linkId) {
      return NextResponse.json({ success: false, message: 'Link ID required' }, { status: 400 });
    }

    await recordLinkView(Number(linkId), ip, ua);
    console.log('View recorded successfully');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording view:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
