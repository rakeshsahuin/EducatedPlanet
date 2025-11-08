import { NextRequest, NextResponse } from 'next/server';
import { invalidateSession } from '@educatedplanet/dataservice';

// Configure runtime
export const runtime = 'nodejs';
export const preferredRegion = 'local';

export async function POST(request: NextRequest) {
  try {
    const cookie = request.cookies.get('eduplanet-admin-session');
    const token = cookie?.value;

    console.log('Sign-out request');

    if (token) {
      await invalidateSession(token);
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete('eduplanet-admin-session');

    return response;
  } catch (error) {
    console.error('Sign-out error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}