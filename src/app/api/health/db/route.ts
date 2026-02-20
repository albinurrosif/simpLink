import { NextResponse } from 'next/server';
import { query } from '@/lib/shared/db/db';

export async function GET() {
  const result = await query('SELECT NOW()');
  return NextResponse.json({
    success: true,
    time: result.rows[0].now,
  });
}
