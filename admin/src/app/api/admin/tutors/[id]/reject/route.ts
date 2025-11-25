import { NextRequest, NextResponse } from 'next/server';
import { AdminTutorService } from '@educatedplanet/dataservice';
import { getAuthenticatedUser } from '@/lib/get-authenticated-user';

// POST /api/admin/tutors/[id]/reject - Reject tutor
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

    const adminId = body.rejectedBy || user.id;

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
          error: 'Rejection reason is required'
        },
        { status: 400 }
      );
    }

    const tutor = await AdminTutorService.rejectTutor({
      tutorId: id,
      rejectedBy: adminId,
      reason: body.reason,
      sendNotification: body.sendNotification ?? true
    });

    // TODO: Send rejection email to tutor

    return NextResponse.json({
      success: true,
      data: tutor,
      message: 'Tutor rejected successfully'
    });
  } catch (error) {
    console.error('Error rejecting tutor:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to reject tutor'
      },
      { status: 500 }
    );
  }
}