/**
 * API Route for Subjects
 * Handles CRUD operations for subjects using dataservice
 * Admin authentication required
 */

import { NextRequest, NextResponse } from 'next/server';
import { subjectService } from '@educatedplanet/dataservice';
import { CreateSubjectInput, SubjectSearchParams } from '@educatedplanet/models';
import { requireRole } from '@/lib/auth-utils';

// GET /api/subjects - Fetch subjects with pagination and filters
export async function GET(request: NextRequest) {
  try {
    // Require admin role
    await requireRole('admin');

    const { searchParams } = new URL(request.url);

    // Parse query parameters to match SubjectSearchParams
    const params: SubjectSearchParams = {
      query: searchParams.get('search') || undefined,
      isAcademic: searchParams.get('isAcademic') ? searchParams.get('isAcademic') === 'true' : undefined,
      isActive: searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : undefined,
      classId: searchParams.get('classId') || undefined,
      difficulty: searchParams.get('difficulty') as 'beginner' | 'intermediate' | 'advanced' || undefined,
      popular: searchParams.get('popular') ? searchParams.get('popular') === 'true' : undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10,
      sortBy: searchParams.get('sortBy') as 'name' | 'sortOrder' | 'createdAt' | 'popular' || undefined,
      sortOrder: searchParams.get('sortOrder') as 'asc' | 'desc' || undefined
    };

    const result = await subjectService.searchSubjects(params);

    return NextResponse.json({
      success: true,
      data: result.items,
      pagination: {
        page: result.pagination?.currentPage || 1,
        limit: params.limit,
        total: result.pagination?.totalItems || 0,
        totalPages: result.pagination?.totalPages || 0,
        hasNextPage: result.pagination?.hasNextPage || false,
        hasPrevPage: result.pagination?.hasPrevPage || false
      }
    });
  } catch (error: any) {
    console.error('Error fetching subjects:', error);

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
        error: error instanceof Error ? error.message : 'Failed to fetch subjects'
      },
      { status: 500 }
    );
  }
}

// POST /api/subjects - Create a new subject
export async function POST(request: NextRequest) {
  try {
    // Require admin role
    await requireRole('admin');

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.code) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name and code are required'
        },
        { status: 400 }
      );
    }

    // Transform input to match CreateSubjectInput
    const subjectData: CreateSubjectInput = {
      name: body.name,
      code: body.code.toUpperCase(),
      classIds: body.classIds || [],
      description: body.description,
      keywords: body.keywords || [],
      isActive: body.isActive !== undefined ? body.isActive : true,
      isAcademic: body.isAcademic !== undefined ? body.isAcademic : true,
      sortOrder: body.sortOrder || 0,
      metadata: body.metadata || {}
    };

    const newSubject = await subjectService.createSubject(subjectData);

    return NextResponse.json({
      success: true,
      data: newSubject,
      message: 'Subject created successfully'
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating subject:', error);

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

    // Handle validation errors
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
        error: error instanceof Error ? error.message : 'Failed to create subject'
      },
      { status: 500 }
    );
  }
}