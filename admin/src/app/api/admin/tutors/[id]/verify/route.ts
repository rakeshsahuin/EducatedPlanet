import { NextRequest, NextResponse } from 'next/server';
import { AdminTutorService } from '@educatedplanet/dataservice';
import { getAuthenticatedUser } from '@/lib/get-authenticated-user';

// POST /api/admin/tutors/[id]/verify - Toggle verification status
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

    const adminId = body.verifiedBy || user.id;

    if (!adminId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Admin ID is required'
        },
        { status: 400 }
      );
    }

    const tutor = await AdminTutorService.updateVerification({
      tutorId: id,
      isVerified: body.isVerified ?? true,
      verifiedBy: adminId,
      notes: body.notes
    });

    return NextResponse.json({
      success: true,
      data: tutor,
      message: `Tutor ${body.isVerified ? 'verified' : 'unverified'} successfully`
    });
  } catch (error) {
    console.error('Error updating verification:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update verification status'
      },
      { status: 500 }
    );
  }
}