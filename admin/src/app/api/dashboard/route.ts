/**
 * API Route for Dashboard
 * Provides overview statistics and recent activities
 */

import { NextRequest, NextResponse } from 'next/server';
import { databaseConnection } from '@educatedplanet/dataservice';

// Define types for dashboard activities
interface DashboardActivity {
  id: string;
  type: 'user_registered' | 'tutor_created' | 'review_posted' | string;
  title: string;
  description: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

// GET /api/dashboard - Fetch dashboard overview statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeRecent = searchParams.get('includeRecent') === 'true';
    const recentLimit = searchParams.get('recentLimit') ? parseInt(searchParams.get('recentLimit')!) : 10;

    // Initialize database connection
    await databaseConnection.connect();

    // Get database models
    const UserModel = databaseConnection.getUserModel();
    const TutorModel = databaseConnection.getTutorModel();
    const ReviewModel = databaseConnection.getReviewModel();

    // Fetch overview statistics
    const [
      totalUsers,
      totalTutors,
      totalReviews,
      recentUsers,
      pendingTutors
    ] = await Promise.all([
      UserModel.countDocuments({ isActive: true }),
      TutorModel.countDocuments(),
      ReviewModel.countDocuments({ isApproved: true }),
      UserModel.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email role createdAt')
        .lean(),
      TutorModel.countDocuments({ 'verification.isApproved': false })
    ]);

    const overviewStats = {
      totalUsers,
      totalTutors,
      totalReviews,
      pendingTutors,
      averageRating: 4.5 // TODO: Calculate from actual reviews
    };

    // Fetch recent activities if requested
    let recentActivities: DashboardActivity[] = [];
    if (includeRecent) {
      // Get recent registrations
      const recentRegistrations = await UserModel.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(recentLimit)
        .select('name email role createdAt')
        .lean();

      recentActivities = recentRegistrations.map((user: any): DashboardActivity => ({
        id: user._id.toString(),
        type: 'user_registered',
        title: `New user registered: ${user.name}`,
        description: `Role: ${user.role}`,
        timestamp: user.createdAt,
        metadata: {
          userId: user._id.toString(),
          email: user.email,
          role: user.role
        }
      }));
    }

    return NextResponse.json({
      success: true,
      data: {
        overview: overviewStats,
        recentActivities: includeRecent ? recentActivities : undefined
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard data'
      },
      { status: 500 }
    );
  }
}