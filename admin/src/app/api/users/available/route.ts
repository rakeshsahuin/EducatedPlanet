import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@educatedplanet/models';
import { UserQueries } from '@educatedplanet/dataservice';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get users who are available for tutor linking
    const users = await UserQueries.getAvailableUsersForTutor(search, limit);

    // Transform the response to include only necessary fields
    const transformedUsers = users.map((user: any) => ({
      id: user._id?.toString() || user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified
    }));

    return NextResponse.json({
      success: true,
      data: transformedUsers,
      count: transformedUsers.length
    });
  } catch (error) {
    console.error('Error fetching available users:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch available users'
      },
      { status: 500 }
    );
  }
}