import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@educatedplanet/dataservice';

// Configure runtime
export const runtime = 'nodejs';
export const preferredRegion = 'local';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('Sign-in attempt:', { email });

    // Authenticate user using dataservice
    const result = await authenticateUser(email, password);

    if (!result) {
      console.log('Authentication failed');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 400 }
      );
    }

    console.log('Sign-in successful');

    const response = NextResponse.json(result);
    response.cookies.set('eduplanet-admin-session', result.session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Sign-in error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}