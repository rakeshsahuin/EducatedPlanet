/**
 * API Route for Users
 * Handles CRUD operations for users using dataservice
 */

import { NextRequest, NextResponse } from 'next/server';
import { userApi } from '@/lib/api';
import { CreateUserInput } from '@educatedplanet/models';

// GET /api/users - Fetch users with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters to match UserSearchParams
    const params = {
      query: searchParams.get('search') || undefined,
      role: searchParams.get('role') || undefined,
      isEmailVerified: searchParams.get('verificationStatus') ? searchParams.get('verificationStatus') === 'email' : undefined,
      isPhoneVerified: searchParams.get('verificationStatus') ? searchParams.get('verificationStatus') === 'phone' : undefined,
      isActive: searchParams.get('status') ? searchParams.get('status') === 'active' : undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10
    };

    const result = await userApi.getUsers(params);

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
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch users'
      },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Transform input to match CreateUserInput
    const userData: CreateUserInput = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      role: body.role || 'user',
      ...(body.password && { password: body.password })
    };

    const newUser = await userApi.createUser(userData);

    // Remove password from response if it exists
    const { password, ...userWithoutPassword } = newUser as any;

    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
      message: 'User created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create user'
      },
      { status: 400 }
    );
  }
}