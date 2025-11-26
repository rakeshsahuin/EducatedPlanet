/**
 * API Route for Image Restore
 * Handles restoration of soft-deleted images
 * Admin authentication required
 */

import { NextRequest, NextResponse } from 'next/server';
import { imageService } from '@educatedplanet/common';
import { requireRole } from '@/lib/auth-utils';

// POST /api/upload/restore - Restore a soft-deleted image
export async function POST(request: NextRequest) {
  try {
    // Require admin role
    await requireRole('admin');

    const body = await request.json();
    const { imageId } = body;

    if (!imageId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Image ID is required',
          code: 'MISSING_IMAGE_ID'
        },
        { status: 400 }
      );
    }

    // Restore the image
    const restored = await imageService.restoreImage(imageId);

    if (!restored) {
      return NextResponse.json(
        {
          success: false,
          error: 'Image not found or not soft deleted',
          code: 'NOT_FOUND'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Image restored successfully'
    });

  } catch (error: any) {
    console.error('Error restoring image:', error);

    // Handle authentication errors
    if (error.message?.includes('unauthorized') || error.message?.includes('login')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          redirect: '/auth/login'
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to restore image',
        code: 'RESTORE_FAILED'
      },
      { status: 500 }
    );
  }
}