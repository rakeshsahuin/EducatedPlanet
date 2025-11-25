import { NextRequest, NextResponse } from 'next/server';
import { AdminTutorService } from '@educatedplanet/dataservice';
import { getAuthenticatedUser } from '@/lib/get-authenticated-user';

// POST /api/admin/tutors/bulk-approve - Bulk approve tutors
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tutorIds, notifyTutors = true } = body;

    if (!tutorIds || !Array.isArray(tutorIds) || tutorIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tutor IDs array is required'
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
      'approved',
      adminId
    );

    // TODO: Send notification emails in background

    return NextResponse.json({
      success: true,
      data: {
        success: result.modifiedCount,
        failed: tutorIds.length - result.modifiedCount
      },
      message: `Bulk approval completed. ${result.modifiedCount} tutors approved.`
    });
  } catch (error) {
    console.error('Error in bulk approval:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to bulk approve tutors'
      },
      { status: 500 }
    );
  }
}