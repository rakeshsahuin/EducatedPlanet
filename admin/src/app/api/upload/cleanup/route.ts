/**
 * API Route for Image Cleanup Job
 * Handles cleanup of soft-deleted images
 * Admin authentication required
 */

import { NextRequest, NextResponse } from 'next/server';
import { imageService } from '@educatedplanet/common';
import { requireRole } from '@/lib/auth-utils';

// POST /api/upload/cleanup - Run cleanup job for soft-deleted images
export async function POST(request: NextRequest) {
  try {
    // Require admin role
    await requireRole('admin');

    // Run cleanup job
    const deletedCount = await imageService.runCleanupJob();

    return NextResponse.json({
      success: true,
      data: {
        deletedCount,
        message: `Permanently deleted ${deletedCount} images`
      }
    });

  } catch (error: any) {
    console.error('Error running cleanup job:', error);

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
        error: 'Failed to run cleanup job',
        code: 'CLEANUP_FAILED'
      },
      { status: 500 }
    );
  }
}

// GET /api/upload/cleanup - Get soft delete statistics
export async function GET(request: NextRequest) {
  try {
    // Require admin role
    await requireRole('admin');

    // Get soft delete statistics
    const stats = imageService.getSoftDeleteStats();

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error: any) {
    console.error('Error getting cleanup stats:', error);

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
        error: 'Failed to get cleanup statistics',
        code: 'FETCH_FAILED'
      },
      { status: 500 }
    );
  }
}