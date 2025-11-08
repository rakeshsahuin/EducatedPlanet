/**
 * Get CSRF token from cookies
 */
export function getCSRFToken(): string | null {
  const name = 'eduplanet-csrf-token';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }

  return null;
}