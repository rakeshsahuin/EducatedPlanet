import { NextRequest, NextResponse } from 'next/server';
import { generateCSRFToken } from '@/utils/csrf';
import { serialize } from 'cookie';

// Configure runtime
export const runtime = 'nodejs';
export const preferredRegion = 'local';

const CSRF_COOKIE_NAME = 'eduplanet-csrf-token';

export async function GET(request: NextRequest) {
  try {
    // Generate a new CSRF token
    const token = generateCSRFToken();

    // Create response with token
    const response = NextResponse.json({
      success: true,
      token: token
    });

    // Set CSRF token in cookie
    response.cookies.set(CSRF_COOKIE_NAME, token, {
      httpOnly: false, // Client needs to read this for AJAX requests
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/'
    });

    // Also include token in header for convenience
    response.headers.set('X-CSRF-Token', token);

    return response;
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
}