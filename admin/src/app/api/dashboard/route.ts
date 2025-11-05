/**
 * API Route for Dashboard
 * Provides overview statistics and recent activities
 */

import { NextRequest, NextResponse } from 'next/server';
import { dashboardApi } from '@/lib/static-api';

// GET /api/dashboard - Fetch dashboard overview statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeRecent = searchParams.get('includeRecent') === 'true';
    const recentLimit = searchParams.get('recentLimit') ? parseInt(searchParams.get('recentLimit')!) : 10;

    // Fetch overview statistics
    const overviewStats = await dashboardApi.getOverviewStats();

    // Fetch recent activities if requested
    let recentActivities = [];
    if (includeRecent) {
      recentActivities = await dashboardApi.getRecentActivities(recentLimit);
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