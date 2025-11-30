import { NextRequest, NextResponse } from 'next/server';
import { UserQueries } from '@educatedplanet/dataservice';

// PATCH /api/users/[id]/role - Update user role
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { role } = body;

    if (!role || !['user', 'tutor', 'admin', 'sub-admin'].includes(role)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid role provided'
        },
        { status: 400 }
      );
    }

    // Update user role
    const updatedUser = await UserQueries.updateById(id, { role });

    if (!updatedUser) {
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
      data: {
        id: updatedUser._id?.toString(),
        role: updatedUser.role
      },
      message: 'User role updated successfully'
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update user role'
      },
      { status: 500 }
    );
  }
}