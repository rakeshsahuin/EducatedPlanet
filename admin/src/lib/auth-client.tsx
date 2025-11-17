"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { encryptPassword } from '@/utils/encryption';
import { getCSRFToken } from '@/utils/get-csrf-token';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface Session {
  user: User;
  session: {
    token: string;
    expiresAt: Date;
  };
}

// API Response Types
interface SignInResponse {
  success: boolean;
  user?: User;
  session?: Session;
  error?: string;
  message?: string;
}

interface SessionResponse {
  user?: User;
  session?: Session;
  error?: string;
}

// Auth context
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    checkSession();
    // Initialize CSRF token
    initializeCSRFToken();
  }, []);

  const initializeCSRFToken = async () => {
    try {
      const response = await fetch('/api/auth/csrf', {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        console.warn('Failed to initialize CSRF token');
      }
    } catch (error) {
      console.error('CSRF token initialization error:', error);
    }
  };

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/get-session', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();

      console.log('Auth checkSession response:', data);

      // Check if data exists and has user property
      if (data && data.user) {
        console.log('Setting user from session:', data.user);
        setUser(data.user);
        setSession(data);
      } else {
        // Clear session if no valid data
        console.log('No user in session data');
        setUser(null);
        setSession(null);
      }
    } catch (error) {
      console.error('Failed to check session:', error);
      setUser(null);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Encrypt password before sending
      const encryptedPassword = await encryptPassword(password);

      // Get CSRF token
      const csrfToken = getCSRFToken();

      const response = await fetch('/api/auth/sign-in/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken && { 'X-CSRF-Token': csrfToken }),
        },
        credentials: 'include',
        body: JSON.stringify({ email, encryptedPassword }),
      });

      const data = await response.json();

      // Handle rate limit errors specifically
      if (response.status === 429) {
        return {
          success: false,
          error: data.message || 'Too many login attempts. Please try again later.'
        };
      }

      if (response.ok && data && data.user) {
        setUser(data.user);
        setSession(data);
        return { success: true };
      } else {
        return { success: false, error: (data && data.error) || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const signOut = async () => {
    try {
      await fetch('/api/auth/sign-out', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Legacy exports for compatibility
export const signIn = async (email: string, password: string) => {
  // Encrypt password before sending
  const encryptedPassword = await encryptPassword(password);

  // Get CSRF token
  const csrfToken = getCSRFToken();

  const response = await fetch('/api/auth/sign-in/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(csrfToken && { 'X-CSRF-Token': csrfToken }),
    },
    credentials: 'include',
    body: JSON.stringify({ email, encryptedPassword }),
  });

  // Handle rate limit errors specifically
  if (response.status === 429) {
    const data = await response.json() as SignInResponse;
    throw new Error(data.message || 'Too many login attempts. Please try again later.');
  }

  const data = await response.json() as SignInResponse;
  if (!response.ok) {
    throw new Error(data.error ?? data.message ?? 'Login failed');
  }
  return data;
};

export const signOut = async () => {
  await fetch('/api/auth/sign-out', {
    method: 'POST',
    credentials: 'include',
  });
};

export const getSession = async () => {
  const response = await fetch('/api/auth/get-session', {
    credentials: 'include',
  });
  return response.json();
};