/**
 * API Route for Individual Subject Operations
 * Handles GET, PUT, DELETE for a specific subject
 */

import { NextRequest, NextResponse } from 'next/server';
import { subjectService } from '@/lib/static-api';
import { UpdateSubjectInput } from '@educatedplanet/models';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/subjects/[id] - Fetch a specific subject by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
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
  } catch (error) {
    console.error('Error fetching subject:', error);
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
    const { id } = await params;
    const body = await request.json();

    // Transform the input to match UpdateSubjectInput
    const updateData: UpdateSubjectInput = {
      name: body.name,
      code: body.code,
      classIds: body.classIds,
      description: body.description,
      keywords: body.keywords,
      isActive: body.isActive,
      isAcademic: body.isAcademic,
      sortOrder: body.sortOrder,
      metadata: body.metadata
    };

    const updatedSubject = await subjectService.updateSubject(id, updateData);

    if (!updatedSubject) {
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
      data: updatedSubject,
      message: 'Subject updated successfully'
    });
  } catch (error) {
    console.error('Error updating subject:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update subject'
      },
      { status: 400 }
    );
  }
}

// DELETE /api/subjects/[id] - Delete a specific subject
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const deleted = await subjectService.deleteSubject(id);

    if (!deleted) {
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
      message: 'Subject deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting subject:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete subject'
      },
      { status: 500 }
    );
  }
}