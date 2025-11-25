import { NextRequest, NextResponse } from 'next/server';
import { AdminTutorService } from '@educatedplanet/dataservice';

// GET /api/admin/tutors/pending - Get pending applications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') || 'status.submittedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const result = await AdminTutorService.getPendingApplications({
      page,
      limit,
      sortBy,
      sortOrder: sortOrder as 'asc' | 'desc'
    });

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching pending applications:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch pending applications'
      },
      { status: 500 }
    );
  }
}