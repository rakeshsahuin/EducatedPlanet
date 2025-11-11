/**
 * API Route for Individual Subject Operations
 * Handles GET, PUT, DELETE for a specific subject
 * Admin authentication required
 */

import { NextRequest, NextResponse } from 'next/server';
import { subjectService } from '@educatedplanet/dataservice';
import { UpdateSubjectInput } from '@educatedplanet/models';
import { requireRole } from '@/lib/auth-utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/subjects/[id] - Fetch a specific subject by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Require admin role
    await requireRole('admin');

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Subject ID is required'
        },
        { status: 400 }
      );
    }

    const subject = await subjectService.getSubjectById(id);

    if (!subject) {
      return NextResponse.json(
        {
          success: false,
          error: 'Subject not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: subject
    });
  } catch (error: any) {
    console.error('Error fetching subject:', error);

    // Handle auth errors
    if (error.message?.includes('unauthorized') || error.message?.includes('login')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          redirect: '/auth/login'
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch subject'
      },
      { status: 500 }
    );
  }
}

// PUT /api/subjects/[id] - Update a specific subject
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Require admin role
    await requireRole('admin');

    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Subject ID is required'
        },
        { status: 400 }
      );
    }

    // Prepare update data with only defined fields
    const updateData: UpdateSubjectInput = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.code !== undefined) updateData.code = body.code.toUpperCase();
    if (body.classIds !== undefined) updateData.classIds = body.classIds;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.keywords !== undefined) updateData.keywords = body.keywords;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.isAcademic !== undefined) updateData.isAcademic = body.isAcademic;
    if (body.sortOrder !== undefined) updateData.sortOrder = body.sortOrder;
    if (body.metadata !== undefined) updateData.metadata = body.metadata;

    const updatedSubject = await subjectService.updateSubject(id, updateData);

    return NextResponse.json({
      success: true,
      data: updatedSubject,
      message: 'Subject updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating subject:', error);

    // Handle auth errors
    if (error.message?.includes('unauthorized') || error.message?.includes('login')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          redirect: '/auth/login'
        },
        { status: 401 }
      );
    }

    // Handle not found error
    if (error.message === 'Subject not found') {
      return NextResponse.json(
        {
          success: false,
          error: error.message
        },
        { status: 404 }
      );
    }

    // Handle duplicate code error
    if (error.message?.includes('already exists')) {
      return NextResponse.json(
        {
          success: false,
          error: error.message
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update subject'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/subjects/[id] - Delete a specific subject
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Require admin role
    await requireRole('admin');

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Subject ID is required'
        },
        { status: 400 }
      );
    }

    await subjectService.deleteSubject(id);

    return NextResponse.json({
      success: true,
      message: 'Subject deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting subject:', error);

    // Handle auth errors
    if (error.message?.includes('unauthorized') || error.message?.includes('login')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          redirect: '/auth/login'
        },
        { status: 401 }
      );
    }

    // Handle not found error
    if (error.message === 'Subject not found') {
      return NextResponse.json(
        {
          success: false,
          error: error.message
        },
        { status: 404 }
      );
    }

    // Handle reference error
    if (error.message?.includes('referenced by')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete subject that is referenced by other records'
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete subject'
      },
      { status: 500 }
    );
  }
}