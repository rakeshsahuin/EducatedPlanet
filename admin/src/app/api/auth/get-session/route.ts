import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@educatedplanet/dataservice';

// Configure runtime
export const runtime = 'nodejs';
export const preferredRegion = 'local';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const cookie = request.cookies.get('eduplanet-admin-session');
    const token = cookie?.value;

    // Log all cookies for debugging
    console.log('All cookies:', request.cookies.getAll());
    console.log('Session cookie:', cookie);
    console.log('Token value:', token ? 'Present' : 'Missing');

    if (!token) {
      console.log('No session token found');
      return NextResponse.json(null);
    }

    // Validate session using dataservice
    console.log('Calling validateSession...');
    const result = await validateSession(token);
    console.log('validateSession result:', result);

    if (!result) {
      console.log('Session invalid or expired');
      return NextResponse.json(null);
    }

    console.log('Session valid for user:', result.user.email);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Get session error:', error);
    return NextResponse.json(null);
  }
}