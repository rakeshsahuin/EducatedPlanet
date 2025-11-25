import { NextRequest } from 'next/server';
import { validateSession } from '@educatedplanet/dataservice';

/**
 * Get the authenticated user from the session token
 * @param request - NextRequest object
 * @returns User object if authenticated, null otherwise
 */
export async function getAuthenticatedUser(request: NextRequest) {
  try {
    // Get token from cookie
    const cookie = request.cookies.get('eduplanet-admin-session');
    const token = cookie?.value;

    if (!token) {
      return null;
    }

    // Validate session using dataservice
    const result = await validateSession(token);

    if (!result || !result.user) {
      return null;
    }

    return result.user;
  } catch (error) {
    console.error('Error validating session:', error);
    return null;
  }
}