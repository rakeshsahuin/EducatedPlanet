import { NextRequest, NextResponse } from 'next/server';
import { getPublicKey, initializeRSAKeys } from '@educatedplanet/dataservice';

// Initialize RSA keys on first request
let keysInitialized = false;

export async function GET(request: NextRequest) {
  try {
    // Initialize RSA keys if not already done
    if (!keysInitialized) {
      initializeRSAKeys();
      keysInitialized = true;
    }

    // Get the public key
    const publicKey = getPublicKey();

    // Return the public key
    return NextResponse.json({
      success: true,
      publicKey: publicKey,
      keyType: 'RSA',
      keySize: 2048
    });
  } catch (error) {
    console.error('Error fetching public key:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch public key' },
      { status: 500 }
    );
  }
}