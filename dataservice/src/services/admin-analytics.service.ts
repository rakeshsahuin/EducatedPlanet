import mongoose from 'mongoose';
import { TutorModel } from '../datamodels';
import { TutorStatus } from '@educatedplanet/models';

/**
 * Admin analytics service for generating reports and insights
 */
export class AdminAnalyticsService {
  /**
   * Get monthly tutor registration trends
   */
  static async getMonthlyRegistrations(year?: number) {
    const targetYear = year || new Date().getFullYear();

    const pipeline = [
      {
        $match: {
          isDeleted: { $ne: true },
          $expr: {
            $eq: [{ $year: '$createdAt' }, targetYear]
          }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
          approved: {
            $sum: {
              $cond: [{ $eq: ['$status.current', 'approved'] }, 1, 0]
            }
          },
          pending: {
            $sum: {
              $cond: [{ $eq: ['$status.current', 'pending'] }, 1, 0]
            }
          }
        }
      },
      { $sort: { '_id': 1 } }
    ];

    const results = await TutorModel.aggregate(pipeline);

    // Fill missing months with zeros
    const monthlyData = [];
    for (let month = 1; month <= 12; month++) {
      const found = results.find(r => r._id === month);
      monthlyData.push({
        month,
        monthName: new Date(targetYear, month - 1).toLocaleString('default', { month: 'short' }),
        total: found?.count || 0,
        approved: found?.approved || 0,
        pending: found?.pending || 0
      });
    }

    return monthlyData;
  }

  /**
   * Get tutor distribution by city
   */
  static async getTutorsByCity(limit = 10) {
    const pipeline = [
      {
        $match: {
          'status.current': 'approved',
          isActive: true,
          isDeleted: { $ne: true }
        }
      },
      {
        $group: {
          _id: '$approved.location.city',
          count: { $sum: 1 },
          averageRating: { $avg: '$rating.average' },
          verified: {
            $sum: { $cond: ['$isVerified', 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } },
      { $limit: limit }
    ];

    return await TutorModel.aggregate(pipeline);
  }

  /**
   * Get popular subjects
   */
  static async getPopularSubjects(limit = 10) {
    const pipeline = [
      {
        $match: {
          'status.current': 'approved',
          isActive: true,
          isDeleted: { $ne: true }
        }
      },
      { $unwind: '$approved.subjects' },
      {
        $group: {
          _id: '$approved.subjects.subjectId',
          count: { $sum: 1 },
          averageRate: { $avg: '$approved.pricing.oneToOne.hourlyRate' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'subjects',
          localField: '_id',
          foreignField: '_id',
          as: 'subject'
        }
      },
      { $unwind: '$subject' }
    ];

    return await TutorModel.aggregate(pipeline);
  }

  /**
   * Get tutor performance metrics
   */
  static async getPerformanceMetrics() {
    const pipeline = [
      {
        $match: {
          'status.current': 'approved',
          isActive: true,
          isDeleted: { $ne: true }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          averageRating: { $avg: '$rating.average' },
          averageProfileViews: { $avg: '$analytics.profileViews' },
          averageConnects: { $avg: '$analytics.connects' },
          totalConnects: { $sum: '$analytics.connects' },
          verified: {
            $sum: { $cond: ['$isVerified', 1, 0] }
          },
          featured: {
            $sum: { $cond: ['$isFeatured', 1, 0] }
          },
          ratingDistribution: {
            $push: '$rating.distribution'
          }
        }
      }
    ];

    const [result] = await TutorModel.aggregate(pipeline);

    if (!result) {
      return {
        total: 0,
        averageRating: 0,
        averageProfileViews: 0,
        averageConnects: 0,
        totalConnects: 0,
        verificationRate: 0,
        featuredRate: 0,
        connectionRate: 0
      };
    }

    // Aggregate rating distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    result.ratingDistribution.forEach((dist: any) => {
      Object.keys(dist).forEach(key => {
        distribution[key as keyof typeof distribution] += dist[key];
      });
    });

    return {
      total: result.total,
      averageRating: Math.round(result.averageRating * 10) / 10,
      averageProfileViews: Math.round(result.averageProfileViews),
      averageConnects: Math.round(result.averageConnects),
      totalConnects: result.totalConnects,
      verificationRate: Math.round((result.verified / result.total) * 100),
      featuredRate: Math.round((result.featured / result.total) * 100),
      connectionRate: result.total > 0
        ? Math.round((result.totalConnects / result.total) * 100)
        : 0,
      ratingDistribution: distribution
    };
  }

  /**
   * Get approval queue metrics
   */
  static async getApprovalQueueMetrics() {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const pipeline = [
      {
        $match: {
          'status.current': 'pending',
          isDeleted: { $ne: true }
        }
      },
      {
        $group: {
          _id: null,
          totalPending: { $sum: 1 },
          olderThanWeek: {
            $sum: {
              $cond: [
                { $lt: ['$status.submittedAt', oneWeekAgo] },
                1,
                0
              ]
            }
          },
          olderThanMonth: {
            $sum: {
              $cond: [
                { $lt: ['$status.submittedAt', oneMonthAgo] },
                1,
                0
              ]
            }
          },
          oldestSubmission: { $min: '$status.submittedAt' },
          newestSubmission: { $max: '$status.submittedAt' }
        }
      }
    ];

    const [result] = await TutorModel.aggregate(pipeline);

    return {
      totalPending: result?.totalPending || 0,
      olderThanWeek: result?.olderThanWeek || 0,
      olderThanMonth: result?.olderThanMonth || 0,
      oldestSubmission: result?.oldestSubmission,
      newestSubmission: result?.newestSubmission,
      averageWaitTime: result?.totalPending > 0
        ? Math.round((now.getTime() - (result?.newestSubmission?.getTime() || 0)) / (result.totalPending * 24 * 60 * 60 * 1000))
        : 0
    };
  }

  /**
   * Generate comprehensive report
   */
  static async generateReport(filters: {
    dateFrom?: Date;
    dateTo?: Date;
    status?: TutorStatus;
  } = {}) {
    const { monthlyRegistrations, tutorsByCity, popularSubjects, performanceMetrics, approvalQueue } =
      await Promise.all([
        this.getMonthlyRegistrations(),
        this.getTutorsByCity(),
        this.getPopularSubjects(),
        this.getPerformanceMetrics(),
        this.getApprovalQueueMetrics()
      ]);

    return {
      generatedAt: new Date(),
      filters,
      summary: {
        monthlyRegistrations,
        topCities: tutorsByCity,
        popularSubjects,
        performance: performanceMetrics,
        approvalQueue
      }
    };
  }
}