import { NextRequest, NextResponse } from 'next/server';
import { AdminTutorService } from '@educatedplanet/dataservice';
import { getAuthenticatedUser } from '@/lib/get-authenticated-user';

// POST /api/admin/tutors/[id]/feature - Toggle featured status
export async function POST(
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

    const tutor = await AdminTutorService.toggleFeatured(id, adminId);

    return NextResponse.json({
      success: true,
      data: tutor,
      message: `Tutor ${tutor.isFeatured ? 'featured' : 'unfeatured'} successfully`
    });
  } catch (error) {
    console.error('Error updating featured status:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update featured status'
      },
      { status: 500 }
    );
  }
}