/**
 * API Route for Classes
 * Handles CRUD operations for classes using dataservice
 * Admin authentication required
 */

import { NextRequest, NextResponse } from 'next/server';
import { classService } from '@educatedplanet/dataservice';
import { CreateClassInput, ClassSearchParams } from '@educatedplanet/models';
import { requireRole } from '@/lib/auth-utils';

// GET /api/classes - Fetch classes with pagination and filters
export async function GET(request: NextRequest) {
  try {
    // Require admin role
    await requireRole('admin');

    const { searchParams } = new URL(request.url);

    // Parse query parameters to match ClassSearchParams
    const params: ClassSearchParams = {
      query: searchParams.get('search') || undefined,
      category: searchParams.get('category') as any || undefined,
      hasSubClasses: searchParams.get('hasSubClasses') === 'true' ? true :
                      searchParams.get('hasSubClasses') === 'false' ? false : undefined,
      isActive: searchParams.get('status') === 'active' ? true :
                searchParams.get('status') === 'inactive' ? false : undefined,
      subClass: searchParams.get('subClass') || undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10,
      sortBy: (searchParams.get('sortBy') as any) || 'sortOrder',
      sortOrder: (searchParams.get('sortOrder') as any) || 'asc'
    };

    const result = await classService.searchClasses(params);

    return NextResponse.json({
      success: true,
      data: result.items,
      pagination: {
        page: result.pagination?.currentPage || 1,
        limit: params.limit,
        total: result.pagination?.totalItems || 0,
        totalPages: result.pagination?.totalPages || 0
      }
    });
  } catch (error: any) {
    console.error('Error fetching classes:', error);

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
        error: error instanceof Error ? error.message : 'Failed to fetch classes'
      },
      { status: 500 }
    );
  }
}

// POST /api/classes - Create a new class
export async function POST(request: NextRequest) {
  try {
    // Require admin role
    await requireRole('admin');

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.code || !body.category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name, code, and category are required'
        },
        { status: 400 }
      );
    }

    const classData: CreateClassInput = {
      name: body.name,
      code: body.code.toUpperCase(),
      category: body.category,
      subClasses: body.subClasses || [],
      description: body.description,
      isActive: body.isActive !== undefined ? body.isActive : true,
      sortOrder: body.sortOrder || 0,
      metadata: body.metadata || {}
    };

    const newClass = await classService.createClass(classData);

    return NextResponse.json({
      success: true,
      data: newClass,
      message: 'Class created successfully'
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating class:', error);

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
        error: error instanceof Error ? error.message : 'Failed to create class'
      },
      { status: 500 }
    );
  }
}