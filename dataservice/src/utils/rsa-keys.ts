import * as crypto from 'crypto';
import { JSEncrypt } from 'jsencrypt';

// RSA key pair instance - stored in global to persist across hot reloads
declare global {
  var __rsaPrivateKey: string | null | undefined;
  var __rsaPublicKey: string | null | undefined;
}

// Initialize from global if exists
let privateKey: string | null = (global as any).__rsaPrivateKey || null;
let publicKey: string | null = (global as any).__rsaPublicKey || null;

/**
 * Initialize RSA key pair with 2048-bit key
 */
export function initializeRSAKeys() {
  if (!privateKey || !publicKey) {
    // Generate RSA key pair with PKCS1 v1.5 padding for JSEncrypt compatibility
    const { publicKey: pubKey, privateKey: privKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      }
    });

    privateKey = privKey;
    publicKey = pubKey;

    // Store in global to persist across hot reloads
    (global as any).__rsaPrivateKey = privateKey;
    (global as any).__rsaPublicKey = publicKey;

    // For development, log the keys (remove in production!)
    if (process.env.NODE_ENV === 'development') {
      console.log('RSA Keys initialized with PKCS1 v1.5 padding');
      console.log('Public Key:', publicKey);
    }
  }
  return { privateKey, publicKey };
}

/**
 * Get the public key in PEM format
 */
export function getPublicKey(): string {
  if (!publicKey) {
    initializeRSAKeys();
  }
  return publicKey!;
}

/**
 * Get the private key (should never be exposed)
 */
export function getPrivateKey(): string {
  if (!privateKey) {
    initializeRSAKeys();
  }
  return privateKey!;
}

/**
 * Decrypt data using private key with JSEncrypt (Node.js compatible)
 */
export function decryptWithPrivateKey(encryptedData: string): string {
  if (!privateKey) {
    throw new Error('RSA keys not initialized');
  }

  try {
    // Use JSEncrypt on the server side for compatibility
    const decrypt = new JSEncrypt();
    decrypt.setPrivateKey(privateKey);
    const decrypted = decrypt.decrypt(encryptedData);

    if (!decrypted) {
      throw new Error('Decryption failed');
    }

    return decrypted;
  } catch (error) {
    console.error('RSA decryption error details:', {
      error: error,
      encryptedDataLength: encryptedData?.length,
      hasKey: !!privateKey
    });
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Encrypt data using public key (for testing purposes)
 */
export function encryptWithPublicKey(data: string): string {
  if (!publicKey) {
    initializeRSAKeys();
  }

  // Use JSEncrypt for consistency
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  const encrypted = encrypt.encrypt(data);

  if (!encrypted) {
    throw new Error('Encryption failed');
  }

  return encrypted;
}

/**
 * Generate a new RSA key pair (for key rotation)
 */
export function regenerateRSAKeys(): void {
  const { publicKey: pubKey, privateKey: privKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem'
    }
  });

  privateKey = privKey;
  publicKey = pubKey;

  (global as any).__rsaPrivateKey = privateKey;
  (global as any).__rsaPublicKey = publicKey;

  console.log('RSA Keys regenerated with PKCS1 v1.5 padding');
}