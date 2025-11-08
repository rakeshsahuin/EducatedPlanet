import rateLimit from 'express-rate-limit';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Store rate limit data in memory (for production, use Redis or database)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Rate limit configuration
const RATE_LIMIT_WINDOW_MS = 2 * 60 * 1000; // 2 minutes
const RATE_LIMIT_MAX_REQUESTS = 5; // Maximum 5 login attempts per 2 minutes

/**
 * Rate limiting middleware for authentication endpoints
 */
export function rateLimitMiddleware(request: NextRequest): Response | null {
  const ip = request.headers.get('x-forwarded-for') ||
             request.headers.get('x-real-ip') ||
             request.headers.get('cf-connecting-ip') ||
             'unknown';
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  // Get or create rate limit data for this IP
  let rateLimitData = requestCounts.get(ip);

  if (!rateLimitData || rateLimitData.resetTime <= now) {
    // Initialize or reset the counter
    rateLimitData = { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };
    requestCounts.set(ip, rateLimitData);
  }

  // Increment the counter
  rateLimitData.count++;

  // Check if rate limit exceeded
  if (rateLimitData.count > RATE_LIMIT_MAX_REQUESTS) {
    const remainingTime = Math.ceil((rateLimitData.resetTime - now) / 1000);

    return new Response(
      JSON.stringify({
        error: 'Too many login attempts. Please try again later.',
        message: `Rate limit exceeded. Try again in ${remainingTime} seconds.`,
        remainingTime,
        retryAfter: remainingTime
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': remainingTime.toString(),
          'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitData.resetTime.toString()
        }
      }
    );
  }

  // Return null to let the request pass through
  return null;
}

/**
 * Clear rate limit for a specific IP (called after successful authentication)
 */
export function clearRateLimitForIP(ip: string): void {
  requestCounts.delete(ip);
}

/**
 * Progressive delay for failed attempts (increases delay with each failure)
 */
export function getProgressiveDelay(attemptCount: number): number {
  // Exponential backoff: 1s, 2s, 4s, 8s, 16s, max 30s
  return Math.min(1000 * Math.pow(2, attemptCount - 1), 30000);
}

// Export for Next.js 16 proxy compatibility
export { rateLimitMiddleware as middleware };

// Default export for compatibility
export default rateLimitMiddleware;