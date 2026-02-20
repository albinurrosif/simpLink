import { NextResponse } from 'next/server';

export const errorResponse = (message: string, status: number = 500) => {
  return NextResponse.json({ success: false, message: message || 'An unexpected error occurred' }, { status });
};
