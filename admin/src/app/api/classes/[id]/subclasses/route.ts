/**
 * API Route for Class Sub-classes Management
 * Handles adding and removing sub-classes from a class
 * Admin authentication required
 */

import { NextRequest, NextResponse } from 'next/server';
import { classService } from '@educatedplanet/dataservice';
import { requireRole } from '@/lib/auth-utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/classes/[id]/subclasses - Add a sub-class to a class
export async function POST(request: NextRequest, { params }: RouteParams) {
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

    if (!body.subClassCode || !body.subClassName) {
      return NextResponse.json(
        {
          success: false,
          error: 'Sub-class code and name are required'
        },
        { status: 400 }
      );
    }

    const updatedClass = await classService.addSubClass(id, {
      subClassCode: body.subClassCode.toUpperCase(),
      subClassName: body.subClassName
    });

    return NextResponse.json({
      success: true,
      data: updatedClass,
      message: 'Sub-class added successfully'
    });
  } catch (error: any) {
    console.error('Error adding sub-class:', error);

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
    if (error.message === 'Parent class not found' || error.message === 'Class not found') {
      return NextResponse.json(
        {
          success: false,
          error: 'Class not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add sub-class'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/classes/[id]/subclasses - Remove a sub-class from a class
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    if (!body.subClassCode) {
      return NextResponse.json(
        {
          success: false,
          error: 'Sub-class code is required'
        },
        { status: 400 }
      );
    }

    const updatedClass = await classService.removeSubClass(id, {
      subClassCode: body.subClassCode
    });

    return NextResponse.json({
      success: true,
      data: updatedClass,
      message: 'Sub-class removed successfully'
    });
  } catch (error: any) {
    console.error('Error removing sub-class:', error);

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
        error: error instanceof Error ? error.message : 'Failed to remove sub-class'
      },
      { status: 500 }
    );
  }
}