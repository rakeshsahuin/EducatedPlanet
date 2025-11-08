import { serialize } from 'cookie';

// CSRF token configuration
const CSRF_SECRET = process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production';
const CSRF_TOKEN_LENGTH = 32;
const CSRF_COOKIE_NAME = 'eduplanet-csrf-token';
const CSRF_HEADER_NAME = 'x-csrf-token';

/**
 * Generate a random CSRF token
 */
export function generateCSRFToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < CSRF_TOKEN_LENGTH; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Validate CSRF token against the one in cookies
 */
export function validateCSRFToken(request: Request): boolean {
  const tokenFromHeader = request.headers.get(CSRF_HEADER_NAME);
  const tokenFromCookie = parseCookie(request.headers.get('cookie') || '', CSRF_COOKIE_NAME);

  if (!tokenFromHeader || !tokenFromCookie) {
    return false;
  }

  // Simple string comparison (for production, use timing-safe comparison)
  return tokenFromHeader === tokenFromCookie;
}

/**
 * Set CSRF token cookie
 */
export function setCSRFCookie(response: Response): void {
  const token = generateCSRFToken();

  // Set CSRF token in cookie
  const cookieValue = serialize(CSRF_COOKIE_NAME, token, {
    httpOnly: false, // Client needs to read this for AJAX requests
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/'
  });

  response.headers.append('Set-Cookie', cookieValue);
  response.headers.append('X-CSRF-Token', token); // Also include in header for convenience
}

/**
 * Parse cookie value by name
 */
function parseCookie(cookieHeader: string, name: string): string | null {
  const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName === name) {
      return cookieValue || null;
    }
  }
  return null;
}

/**
 * CSRF middleware for API routes
 */
export function csrfMiddleware(request: Request) {
  // Skip CSRF for GET, HEAD, OPTIONS requests
  const method = request.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return null;
  }

  // Validate CSRF token for state-changing requests
  if (!validateCSRFToken(request)) {
    return new Response(
      JSON.stringify({
        error: 'Invalid CSRF token',
        message: 'CSRF validation failed. Please refresh the page and try again.'
      }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  return null;
}

/**
 * Get CSRF token name for client-side usage
 */
export function getCSRFTokenName(): string {
  return CSRF_HEADER_NAME;
}

/**
 * Get CSRF cookie name for client-side usage
 */
export function getCSRFCookieName(): string {
  return CSRF_COOKIE_NAME;
}