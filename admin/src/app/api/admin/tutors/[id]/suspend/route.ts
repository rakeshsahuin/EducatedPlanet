import { NextRequest, NextResponse } from 'next/server';
import { AdminTutorService } from '@educatedplanet/dataservice';
import { getAuthenticatedUser } from '@/lib/get-authenticated-user';

// POST /api/admin/tutors/[id]/suspend - Suspend tutor
export async function POST(
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

    const adminId = body.suspendedBy || user.id;

    if (!adminId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Admin ID is required'
        },
        { status: 400 }
      );
    }

    if (!body.reason) {
      return NextResponse.json(
        {
          success: false,
          error: 'Suspension reason is required'
        },
        { status: 400 }
      );
    }

    const tutor = await AdminTutorService.suspendTutor({
      tutorId: id,
      suspendedBy: adminId,
      reason: body.reason,
      sendNotification: body.sendNotification ?? true
    });

    // TODO: Send suspension email to tutor

    return NextResponse.json({
      success: true,
      data: tutor,
      message: 'Tutor suspended successfully'
    });
  } catch (error) {
    console.error('Error suspending tutor:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to suspend tutor'
      },
      { status: 500 }
    );
  }
}