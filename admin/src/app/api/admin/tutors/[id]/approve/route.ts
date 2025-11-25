import { NextRequest, NextResponse } from 'next/server';
import { AdminTutorService } from '@educatedplanet/dataservice';
import { getAuthenticatedUser } from '@/lib/get-authenticated-user';

// POST /api/admin/tutors/[id]/approve - Approve tutor
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

    const adminId = body.approvedBy || user.id;

    if (!adminId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Admin ID is required'
        },
        { status: 400 }
      );
    }

    const tutor = await AdminTutorService.approveTutor({
      tutorId: id,
      approvedBy: adminId,
      notes: body.notes,
      sendNotification: body.sendNotification ?? true
    });

    // TODO: Send approval email to tutor

    return NextResponse.json({
      success: true,
      data: tutor,
      message: 'Tutor approved successfully'
    });
  } catch (error) {
    console.error('Error approving tutor:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to approve tutor'
      },
      { status: 500 }
    );
  }
}