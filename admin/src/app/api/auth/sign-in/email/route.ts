import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, initializeRSAKeys, decryptWithPrivateKey } from '@educatedplanet/dataservice';
import { rateLimitMiddleware, getProgressiveDelay, clearRateLimitForIP } from '@/proxy';
import { csrfMiddleware } from '@/utils/csrf';

// Configure runtime
export const runtime = 'nodejs';
export const preferredRegion = 'local';

// Initialize RSA keys on module load
initializeRSAKeys();

// Track failed attempts by IP for progressive delays
const failedAttempts = new Map<string, number>();

export async function POST(request: NextRequest) {
  try {
    // Apply CSRF protection
    const csrfResponse = csrfMiddleware(request);
    if (csrfResponse) {
      return csrfResponse;
    }

    // Apply rate limiting
    const rateLimitResponse = rateLimitMiddleware(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const body = await request.json();
    const { email, encryptedPassword } = body;

    // Get IP for progressive delay tracking
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               request.headers.get('cf-connecting-ip') ||
               'unknown';
    const currentAttempts = failedAttempts.get(ip) || 0;

    console.log('Sign-in attempt:', { email });

    // Decrypt the password using RSA private key
    let password: string;
    try {
      if (!encryptedPassword) {
        throw new Error('Encrypted password is required');
      }
      password = decryptWithPrivateKey(encryptedPassword);
    } catch (decryptError) {
      console.error('Password decryption failed:', decryptError);
      return NextResponse.json(
        { error: 'Invalid encrypted password' },
        { status: 400 }
      );
    }

    // Authenticate user using dataservice with decrypted password
    const result = await authenticateUser(email, password);

    if (!result) {
      console.log('Authentication failed');

      // Track failed attempt for progressive delay
      failedAttempts.set(ip, currentAttempts + 1);

      // Apply progressive delay before responding
      const delay = getProgressiveDelay(currentAttempts + 1);
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 400 }
      );
    }

    console.log('Sign-in successful');

    // Clear failed attempts on successful authentication
    failedAttempts.delete(ip);

    // Clear rate limit for this IP on successful authentication
    clearRateLimitForIP(ip);

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