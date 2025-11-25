import { NextRequest, NextResponse } from 'next/server';
import { AdminTutorService } from '@educatedplanet/dataservice';
import { getAuthenticatedUser } from '@/lib/get-authenticated-user';

// POST /api/admin/tutors/bulk-reject - Bulk reject tutors
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tutorIds, reason, notifyTutors = true } = body;

    if (!tutorIds || !Array.isArray(tutorIds) || tutorIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tutor IDs array is required'
        },
        { status: 400 }
      );
    }

    if (!reason) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rejection reason is required'
        },
        { status: 400 }
      );
    }

    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized'
        },
        { status: 401 }
      );
    }
    const adminId = user.id;
    const result = await AdminTutorService.bulkUpdateStatus(
      tutorIds,
      'rejected',
      adminId,
      reason
    );

    // TODO: Send notification emails in background

    return NextResponse.json({
      success: true,
      data: {
        success: result.modifiedCount,
        failed: tutorIds.length - result.modifiedCount
      },
      message: `Bulk rejection completed. ${result.modifiedCount} tutors rejected.`
    });
  } catch (error) {
    console.error('Error in bulk rejection:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to bulk reject tutors'
      },
      { status: 500 }
    );
  }
}