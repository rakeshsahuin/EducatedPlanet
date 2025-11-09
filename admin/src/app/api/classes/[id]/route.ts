/**
 * API Route for Individual Class Operations
 * Handles GET, PUT, DELETE operations for a specific class
 * Admin authentication required
 */

import { NextRequest, NextResponse } from 'next/server';
import { classService } from '@educatedplanet/dataservice';
import { UpdateClassInput } from '@educatedplanet/models';
import { requireRole } from '@/lib/auth-utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/classes/[id] - Fetch a specific class
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Require admin role
    await requireRole('admin');

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Class ID is required'
        },
        { status: 400 }
      );
    }

    const classItem = await classService.getClassById(id);

    if (!classItem) {
      return NextResponse.json(
        {
          success: false,
          error: 'Class not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: classItem
    });
  } catch (error: any) {
    console.error('Error fetching class:', error);

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
        error: error instanceof Error ? error.message : 'Failed to fetch class'
      },
      { status: 500 }
    );
  }
}

// PUT /api/classes/[id] - Update a class
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
          error: 'Class ID is required'
        },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: UpdateClassInput = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.code !== undefined) updateData.code = body.code.toUpperCase();
    if (body.category !== undefined) updateData.category = body.category;
    if (body.subClasses !== undefined) updateData.subClasses = body.subClasses;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.sortOrder !== undefined) updateData.sortOrder = body.sortOrder;
    if (body.metadata !== undefined) updateData.metadata = body.metadata;

    const updatedClass = await classService.updateClass(id, updateData);

    return NextResponse.json({
      success: true,
      data: updatedClass,
      message: 'Class updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating class:', error);

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
    if (error.message === 'Class not found') {
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
        error: error instanceof Error ? error.message : 'Failed to update class'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/classes/[id] - Delete a class
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Require admin role
    await requireRole('admin');

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Class ID is required'
        },
        { status: 400 }
      );
    }

    await classService.deleteClass(id);

    return NextResponse.json({
      success: true,
      message: 'Class deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting class:', error);

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
    if (error.message === 'Class not found') {
      return NextResponse.json(
        {
          success: false,
          error: error.message
        },
        { status: 404 }
      );
    }

    // Handle reference error
    if (error.message?.includes('referenced as a sub-class')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete class that is referenced as a sub-class'
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete class'
      },
      { status: 500 }
    );
  }
}