import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { validateSession } from '@educatedplanet/dataservice';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface Session {
  user: User;
  session: {
    token: string;
    expiresAt: Date;
  };
}

/**
 * Get the current session on server side
 */
export async function getServerSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('eduplanet-admin-session')?.value;

    if (!token) {
      return null;
    }

    // Validate session using dataservice
    const session = await validateSession(token);

    return session;
  } catch (error) {
    console.error('Failed to get session:', error);
    return null;
  }
}

/**
 * Require authentication in server components
 * Redirects to login if not authenticated
 */
export async function requireAuth(): Promise<Session> {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect('/auth/login');
  }

  return session;
}

/**
 * Require specific role for access
 */
export async function requireRole(role: string): Promise<Session> {
  const session = await requireAuth();

  const userRole = session.user.role || 'user';

  if (userRole !== role) {
    redirect('/unauthorized');
  }

  return session;
}

/**
 * Check if user has specific role
 */
export async function hasRole(role: string): Promise<boolean> {
  const session = await getServerSession();

  if (!session || !session.user) {
    return false;
  }

  const userRole = session.user.role || 'user';
  return userRole === role;
}

/**
 * Get current user from session
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = await getServerSession();
  return session?.user || null;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getServerSession();
  return !!session && !!session.user;
}