import { NextRequest, NextResponse } from 'next/server';
import { AdminTutorService } from '@educatedplanet/dataservice';
import { getAuthenticatedUser } from '@/lib/get-authenticated-user';

// GET /api/admin/tutors/[id] - Get tutor details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required'
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    const tutor = await AdminTutorService.getTutorById(id);

    if (!tutor) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tutor not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: tutor
    });
  } catch (error) {
    console.error('Error fetching tutor:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tutor'
      },
      { status: 500 }
    );
  }
}

// PUT /api/admin/tutors/[id] - Update tutor
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Get authenticated user
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required'
        },
        { status: 401 }
      );
    }

    const adminId = user.id;

    const tutor = await AdminTutorService.updateTutor(
      id,
      body,
      adminId
    );

    return NextResponse.json({
      success: true,
      data: tutor,
      message: 'Tutor updated successfully'
    });
  } catch (error) {
    console.error('Error updating tutor:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update tutor'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/tutors/[id] - Soft delete tutor
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get authenticated user
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required'
        },
        { status: 401 }
      );
    }

    const adminId = user.id;
    await AdminTutorService.deleteTutor(id, adminId);

    return NextResponse.json({
      success: true,
      message: 'Tutor deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting tutor:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete tutor'
      },
      { status: 500 }
    );
  }
}