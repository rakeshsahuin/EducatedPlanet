import { JSEncrypt } from 'jsencrypt';

// Cache the public key to avoid repeated requests
let cachedPublicKey: string | null = null;
let publicKeyPromise: Promise<string> | null = null;

/**
 * Fetch the public key from the server
 */
export async function getPublicKey(): Promise<string> {
  // Return cached key if available
  if (cachedPublicKey) {
    return cachedPublicKey;
  }

  // Return existing promise if request is in progress
  if (publicKeyPromise) {
    return publicKeyPromise;
  }

  // Create new promise to fetch the public key
  const promise = (async (): Promise<string> => {
    try {
      const response = await fetch('/api/auth/public-key');
      if (!response.ok) {
        throw new Error('Failed to fetch public key');
      }
      const data = await response.json();
      if (!data.success || !data.publicKey) {
        throw new Error('Invalid public key response');
      }
      cachedPublicKey = data.publicKey;
      return cachedPublicKey!;
    } catch (error) {
      console.error('Error fetching public key:', error);
      throw new Error('Failed to fetch encryption key');
    } finally {
      // Clear the promise after completion
      publicKeyPromise = null;
    }
  })();

  publicKeyPromise = promise;
  return promise;
}

/**
 * Encrypt password using RSA public key
 */
export async function encryptPassword(password: string): Promise<string> {
  try {
    const publicKey = await getPublicKey();
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    const encrypted = encrypt.encrypt(password);

    if (!encrypted) {
      throw new Error('Encryption failed');
    }

    return encrypted;
  } catch (error) {
    console.error('Error encrypting password:', error);
    throw new Error('Failed to encrypt password');
  }
}

/**
 * Clear cached public key (for testing or key rotation)
 */
export function clearPublicKeyCache(): void {
  cachedPublicKey = null;
  publicKeyPromise = null;
}