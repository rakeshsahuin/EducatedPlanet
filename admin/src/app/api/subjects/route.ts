/**
 * API Route for Subjects
 * Handles CRUD operations for subjects using dataservice
 */

import { NextRequest, NextResponse } from 'next/server';
import { subjectService } from '@/lib/static-api';
import { CreateSubjectInput } from '@educatedplanet/models';

// GET /api/subjects - Fetch subjects with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters to match SubjectSearchParams
    const params = {
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

    const result = await subjectService.getSubjects(params);

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
  } catch (error) {
    console.error('Error fetching subjects:', error);
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
    const body = await request.json();

    // Transform input to match CreateSubjectInput
    const subjectData: CreateSubjectInput = {
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

    const newSubject = await subjectService.createSubject(subjectData);

    return NextResponse.json({
      success: true,
      data: newSubject,
      message: 'Subject created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating subject:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create subject'
      },
      { status: 400 }
    );
  }
}