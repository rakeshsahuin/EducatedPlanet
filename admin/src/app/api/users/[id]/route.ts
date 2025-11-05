/**
 * API Route for Individual User Operations
 * Handles GET, PUT, DELETE for a specific user
 */

import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/api';
import { UpdateUserInput } from '@educatedplanet/models';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/users/[id] - Fetch a specific user by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await userService.findUserById(id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found'
        },
        { status: 404 }
      );
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user as any;

    return NextResponse.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user'
      },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update a specific user
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Transform the input to match UpdateUserInput
    const updateData: any = {};
    if (body.firstName || body.lastName) {
      updateData.name = `${body.firstName || ''} ${body.lastName || ''}`.trim();
    }
    if (body.email) updateData.email = body.email;
    if (body.phone) updateData.phone = body.phone;
    if (body.role) updateData.role = body.role;

    const updatedUser = await userService.updateUser(id, updateData);

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found'
        },
        { status: 404 }
      );
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser as any;

    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update user'
      },
      { status: 400 }
    );
  }
}

// DELETE /api/users/[id] - Delete a specific user
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const deleted = await userService.deleteUser(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete user'
      },
      { status: 500 }
    );
  }
}