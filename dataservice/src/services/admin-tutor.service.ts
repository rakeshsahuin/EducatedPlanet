import { Types } from 'mongoose';
import {
  TutorAdmin,
  TutorAdminListItem,
  TutorApprovalQueue,
  TutorAdminSearchParams,
  TutorDashboardStats,
  TutorAnalyticsFilter,
  TutorVerificationUpdate,
  TutorApprovalUpdate,
  TutorRejectionUpdate,
  TutorSuspensionUpdate,
  TutorStatus
} from '@educatedplanet/models';
import { TutorModel } from '../datamodels';
import { TutorQueries } from '../queries/tutor.queries';

/**
 * Admin tutor service for handling tutor management operations
 */
export class AdminTutorService {
  /**
   * Get pending applications queue
   */
  static async getPendingApplications(options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    return await TutorQueries.getPendingApplications(options);
  }

  /**
   * Search tutors with admin filters
   */
  static async searchTutors(filters: TutorAdminSearchParams) {
    return await TutorQueries.searchTutors(filters);
  }

  /**
   * Get tutor list items for dashboard
   */
  static async getTutorListItems(filters: TutorAdminSearchParams) {
    return await TutorQueries.getTutorListItems(filters);
  }

  /**
   * Get tutor by ID with all details
   */
  static async getTutorById(tutorId: string): Promise<TutorAdmin | null> {
    return await TutorQueries.getTutorByIdForAdmin(tutorId);
  }

  /**
   * Approve tutor application
   */
  static async approveTutor(data: TutorApprovalUpdate): Promise<TutorAdmin> {
    const tutor = await TutorModel.findByIdAndUpdate(
      data.tutorId,
      {
        'status.current': 'approved',
        'status.lastApproved': new Date(),
        'status.lastApprovedBy': data.approvedBy,
        'status.reviewedAt': new Date(),
        // Move pending to approved if exists
        $setOnInsert: {
          approved: { $ifNull: ['$pending', '$approved'] },
          pending: null
        },
        $unset: {
          'status.rejectionReason': 1
        }
      },
      { new: true, runValidators: true }
    )
      .populate('userId')
      .lean();

    if (!tutor) {
      throw new Error('Tutor not found');
    }

    return tutor as TutorAdmin;
  }

  /**
   * Reject tutor application
   */
  static async rejectTutor(data: TutorRejectionUpdate): Promise<TutorAdmin> {
    const tutor = await TutorModel.findByIdAndUpdate(
      data.tutorId,
      {
        'status.current': 'rejected',
        'status.reviewedAt': new Date(),
        'status.lastApprovedBy': data.rejectedBy,
        'status.rejectionReason': data.reason
      },
      { new: true, runValidators: true }
    )
      .populate('userId')
      .lean();

    if (!tutor) {
      throw new Error('Tutor not found');
    }

    return tutor as TutorAdmin;
  }

  /**
   * Suspend tutor
   */
  static async suspendTutor(data: TutorSuspensionUpdate): Promise<TutorAdmin> {
    const tutor = await TutorModel.findByIdAndUpdate(
      data.tutorId,
      {
        'status.current': 'suspended',
        'status.reviewedAt': new Date(),
        'status.lastApprovedBy': data.suspendedBy,
        'status.rejectionReason': data.reason,
        isActive: false
      },
      { new: true, runValidators: true }
    )
      .populate('userId')
      .lean();

    if (!tutor) {
      throw new Error('Tutor not found');
    }

    return tutor as TutorAdmin;
  }

  /**
   * Reactivate tutor
   */
  static async reactivateTutor(tutorId: string, adminId: string): Promise<TutorAdmin> {
    const tutor = await TutorModel.findByIdAndUpdate(
      tutorId,
      {
        'status.current': 'approved',
        'status.reviewedAt': new Date(),
        'status.lastApprovedBy': adminId,
        'status.rejectionReason': undefined,
        isActive: true
      },
      { new: true, runValidators: true }
    )
      .populate('userId')
      .lean();

    if (!tutor) {
      throw new Error('Tutor not found');
    }

    return tutor as TutorAdmin;
  }

  /**
   * Update tutor verification status
   */
  static async updateVerification(data: TutorVerificationUpdate): Promise<TutorAdmin> {
    const tutor = await TutorModel.findByIdAndUpdate(
      data.tutorId,
      {
        isVerified: data.isVerified,
        lastModifiedBy: data.verifiedBy
      },
      { new: true, runValidators: true }
    )
      .populate('userId')
      .lean();

    if (!tutor) {
      throw new Error('Tutor not found');
    }

    return tutor as TutorAdmin;
  }

  /**
   * Toggle tutor featured status
   */
  static async toggleFeatured(tutorId: string, adminId: string): Promise<TutorAdmin> {
    const tutor = await TutorQueries.toggleFeatured(tutorId);
    return await TutorQueries.getTutorByIdForAdmin(tutorId) as Promise<TutorAdmin>;
  }

  /**
   * Soft delete tutor
   */
  static async deleteTutor(tutorId: string, adminId: string): Promise<void> {
    await TutorQueries.softDelete(tutorId);
  }

  /**
   * Bulk status update
   */
  static async bulkUpdateStatus(
    tutorIds: string[],
    status: TutorStatus,
    adminId: string,
    reason?: string
  ) {
    return await TutorQueries.updateStatus(tutorIds, {
      status,
      approvedBy: adminId,
      rejectionReason: reason
    });
  }

  /**
   * Update tutor profile
   */
  static async updateTutor(
    tutorId: string,
    updateData: Partial<TutorAdmin>,
    adminId: string
  ): Promise<TutorAdmin> {
    // If updating approved data, move current to pending first
    if (updateData.approved) {
      await TutorModel.findByIdAndUpdate(
        tutorId,
        {
          pending: updateData.approved,
          'status.current': 'pending',
          'status.submittedAt': new Date(),
          lastModifiedBy: adminId
        }
      );
    }

    // Update top-level fields
    const updated = await TutorModel.findByIdAndUpdate(
      tutorId,
      {
        ...updateData,
        lastModifiedBy: adminId,
        ...(updateData.approved && { pending: updateData.approved })
      },
      { new: true, runValidators: true }
    )
      .populate('userId')
      .lean();

    if (!updated) {
      throw new Error('Tutor not found');
    }

    return updated as TutorAdmin;
  }

  /**
   * Get dashboard statistics
   */
  static async getDashboardStats(filters?: TutorAnalyticsFilter): Promise<TutorDashboardStats> {
    return await TutorQueries.getDashboardStats(filters);
  }

  /**
   * Export tutors data
   */
  static async exportTutors(filters: TutorAdminSearchParams) {
    return await TutorQueries.exportTutors(filters);
  }

  /**
   * Increment analytics
   */
  static async incrementProfileViews(tutorId: string): Promise<void> {
    await TutorModel.findByIdAndUpdate(
      tutorId,
      { $inc: { 'analytics.profileViews': 1 } }
    );
  }

  static async incrementContactViews(tutorId: string): Promise<void> {
    await TutorModel.findByIdAndUpdate(
      tutorId,
      { $inc: { 'analytics.contactViews': 1 } }
    );
  }

  static async incrementConnects(tutorId: string): Promise<void> {
    await TutorModel.findByIdAndUpdate(
      tutorId,
      {
        $inc: { 'analytics.connects': 1 },
        $set: { 'analytics.lastActive': new Date() }
      }
    );
  }

  /**
   * Update tutor rating
   */
  static async updateRating(
    tutorId: string,
    averageRating: number,
    totalReviews: number,
    distribution: { 1: number; 2: number; 3: number; 4: number; 5: number }
  ): Promise<void> {
    await TutorModel.findByIdAndUpdate(tutorId, {
      'rating.average': Math.round(averageRating * 10) / 10,
      'rating.count': totalReviews,
      'rating.distribution': distribution
    });
  }

  /**
   * Get tutors by location with distance
   */
  static async findTutorsNearLocation(
    coordinates: [number, number],
    maxDistance = 10000,
    limit = 20
  ) {
    return await TutorModel.find({
      'status.current': 'approved',
      isActive: true,
      'approved.location.coordinates': {
        $near: {
          $geometry: { type: 'Point', coordinates },
          $maxDistance: maxDistance
        }
      }
    })
      .limit(limit)
      .populate('userId', 'name email')
      .lean<TutorAdmin[]>();
  }

  /**
   * Get analytics for specific time period
   */
  static async getAnalytics(filters: TutorAnalyticsFilter) {
    const matchStage: any = {
      isDeleted: { $ne: true }
    };

    if (filters.dateFrom || filters.dateTo) {
      matchStage.createdAt = {};
      if (filters.dateFrom) matchStage.createdAt.$gte = filters.dateFrom;
      if (filters.dateTo) matchStage.createdAt.$lte = filters.dateTo;
    }
    if (filters.status) matchStage['status.current'] = filters.status;

    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: {
            status: '$status.current',
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.status',
          monthlyData: {
            $push: {
              month: '$_id.month',
              year: '$_id.year',
              count: '$count'
            }
          },
          total: { $sum: '$count' }
        }
      },
      { $sort: { '_id': 1 } }
    ];

    return await TutorModel.aggregate(pipeline);
  }
}