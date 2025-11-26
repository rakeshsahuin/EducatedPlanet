/**
 * API Route for Image Upload
 * Handles image uploads using Cloudflare Images service
 * Admin authentication required
 */

import { NextRequest, NextResponse } from 'next/server';
import { imageService, CloudflareImageResponse } from '@educatedplanet/common';
import { requireRole } from '@/lib/auth-utils';

// POST /api/upload/image - Upload an image
export async function POST(request: NextRequest) {
  try {
    // Require admin role
    await requireRole('admin');

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const category = formData.get('category') as string;
    const tutorId = formData.get('tutorId') as string;
    const classId = formData.get('classId') as string;
    const requireSignedURLs = formData.get('requireSignedURLs') === 'true';

    // Validate required fields
    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'No image file provided',
          code: 'MISSING_FILE'
        },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category is required',
          code: 'MISSING_CATEGORY'
        },
        { status: 400 }
      );
    }

    // Prepare metadata
    const metadata: Record<string, any> = {
      uploadedBy: 'admin',
      uploadedAt: new Date().toISOString()
    };

    if (tutorId) metadata.tutorId = tutorId;
    if (classId) metadata.classId = classId;

    // Upload image
    const result: CloudflareImageResponse = await imageService.uploadImage({
      file,
      category,
      metadata,
      requireSignedURLs
    });

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        id: result.id,
        filename: result.filename,
        uploaded: result.uploaded,
        requireSignedURLs: result.requireSignedURLs,
        variants: result.variants,
        metadata: result.metadata
      },
      message: 'Image uploaded successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error uploading image:', error);

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

    // Handle validation errors
    if (error.message?.includes('not found') || error.message?.includes('available categories')) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: 'INVALID_CATEGORY'
        },
        { status: 400 }
      );
    }

    // Handle file validation errors
    if (error.message?.includes('file size') || error.message?.includes('File type')) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }

    // Handle API errors
    if (error.message?.includes('Cloudflare')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Image upload service unavailable. Please try again.',
          code: 'SERVICE_ERROR'
        },
        { status: 503 }
      );
    }

    // Generic error
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload image',
        code: 'UPLOAD_FAILED'
      },
      { status: 500 }
    );
  }
}

// GET /api/upload/image - Get available categories and service info
export async function GET(request: NextRequest) {
  try {
    // Require admin role
    await requireRole('admin');

    // Get available categories
    const categories = imageService.getAvailableCategories();

    // Get service configuration (without sensitive data)
    const config = imageService.getConfig();

    return NextResponse.json({
      success: true,
      data: {
        categories: categories.map(cat => ({
          name: cat.name,
          maxFileSize: cat.maxFileSize,
          allowedTypes: cat.allowedTypes,
          variants: cat.variants
        })),
        softDeleteRetentionHours: config?.softDeleteRetentionHours
      }
    });

  } catch (error: any) {
    console.error('Error getting upload info:', error);

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
        error: 'Failed to get upload information',
        code: 'FETCH_FAILED'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/upload/image - Soft delete an image
export async function DELETE(request: NextRequest) {
  try {
    // Require admin role
    await requireRole('admin');

    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('imageId');
    const reason = searchParams.get('reason');

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

    // Soft delete the image
    await imageService.softDeleteImage(imageId, 'admin', reason || undefined);

    return NextResponse.json({
      success: true,
      message: 'Image marked for deletion successfully'
    });

  } catch (error: any) {
    console.error('Error deleting image:', error);

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

    // Handle not found errors
    if (error.message?.includes('not found')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Image not found',
          code: 'IMAGE_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete image',
        code: 'DELETE_FAILED'
      },
      { status: 500 }
    );
  }
}