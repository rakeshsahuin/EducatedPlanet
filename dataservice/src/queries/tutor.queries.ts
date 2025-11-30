import mongoose from 'mongoose';
import { TutorModel } from '../datamodels';
import {
  TutorAdmin,
  TutorAdminListItem,
  TutorApprovalQueue,
  TutorAdminSearchParams,
  TutorDashboardStats,
  TutorAnalyticsFilter,
  BulkOperationRequest,
  BulkOperationResult,
  TutorStatus
} from '@educatedplanet/models';

/**
 * Tutor queries for admin operations
 */
export class TutorQueries {
  /**
   * Get pending applications queue
   */
  static async getPendingApplications(options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const { page = 1, limit = 20, sortBy = 'status.submittedAt', sortOrder = 'desc' } = options;

    const query = {
      'status.current': 'pending',
      isActive: true,
      isDeleted: { $ne: true }
    };

    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const [tutors, total] = await Promise.all([
      TutorModel.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email phone')
        .lean(),
      TutorModel.countDocuments(query)
    ]);

    return { tutors, total, page, totalPages: Math.ceil(total / limit) };
  }

  /**
   * Search tutors with advanced filters
   */
  static async searchTutors(filters: TutorAdminSearchParams) {
    const {
      query,
      status,
      city,
      subjects,
      teachingModes,
      minRating,
      maxPrice,
      isVerified,
      isFeatured,
      dateFrom,
      dateTo,
      page = 1,
      limit = 20,
      sortBy = 'rating.average',
      sortOrder = 'desc'
    } = filters;

    const searchQuery: any = {
      isActive: true,
      isDeleted: { $ne: true }
    };

    // Status filter
    if (status) {
      searchQuery['status.current'] = status;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      searchQuery.createdAt = {};
      if (dateFrom) searchQuery.createdAt.$gte = dateFrom;
      if (dateTo) searchQuery.createdAt.$lte = dateTo;
    }

    // City filter
    if (city) {
      searchQuery['approved.location.city'] = city;
    }

    // Subjects filter
    if (subjects && subjects.length > 0) {
      searchQuery['approved.subjects.subjectId'] = { $in: subjects };
    }

    // Teaching modes filter
    if (teachingModes && teachingModes.length > 0) {
      searchQuery['approved.teachingModes'] = { $in: teachingModes };
    }

    // Rating filter
    if (minRating) {
      searchQuery['rating.average'] = { $gte: minRating };
    }

    // Price filter
    if (maxPrice) {
      searchQuery['approved.pricing.oneToOne.hourlyRate'] = { $lte: maxPrice };
    }

    // Verification filter
    if (isVerified !== undefined) {
      searchQuery.isVerified = isVerified;
    }

    // Featured filter
    if (isFeatured !== undefined) {
      searchQuery.isFeatured = isFeatured;
    }

    // Text search
    if (query) {
      searchQuery.$text = { $search: query };
    }

    const sort: any = {};
    if (query) {
      sort.score = { $meta: 'textScore' };
    } else {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    const skip = (page - 1) * limit;

    const [tutors, total] = await Promise.all([
      TutorModel.find(searchQuery)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email')
        .lean(),
      TutorModel.countDocuments(searchQuery)
    ]);

    return { tutors, total, page, totalPages: Math.ceil(total / limit) };
  }

  /**
   * Get tutor by ID for admin view
   */
  static async getTutorByIdForAdmin(tutorId: string) {
    const tutor = await TutorModel.findById(tutorId)
      .populate('userId')
      .populate('approved.subjects.subjectId')
      .populate('approved.subjects.classIds')
      .lean();

    return tutor;
  }

  /**
   * Get tutor list items for admin dashboard
   */
  static async getTutorListItems(filters: TutorAdminSearchParams) {
    const result = await this.searchTutors(filters);

    const listItems: TutorAdminListItem[] = result.tutors.map(tutor => ({
      id: tutor._id?.toString() || tutor.id,
      userId: tutor.userId.toString(),
      name: `${tutor.approved.basicInfo.firstName} ${tutor.approved.basicInfo.lastName}`,
      email: tutor.approved.contactDetails.email,
      phone: tutor.approved.contactDetails.phone,
      status: tutor.status.current,
      submittedAt: tutor.status.submittedAt,
      subjects: tutor.approved.subjects.map(s => s.subjectId.toString()),
      areas: tutor.approved.location.areas,
      rating: tutor.rating,
      analytics: {
        profileViews: tutor.analytics.profileViews,
        connects: tutor.analytics.connects
      },
      isVerified: tutor.isVerified,
      isFeatured: tutor.isFeatured,
      isActive: tutor.isActive
    }));

    return {
      ...result,
      tutors: listItems
    };
  }

  /**
   * Update tutor status (approve, reject, suspend)
   */
  static async updateStatus(tutorIds: string[], updates: {
    status: TutorStatus;
    approvedBy?: string;
    rejectionReason?: string;
  }) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const result = await TutorModel.updateMany(
        {
          _id: { $in: tutorIds },
          isActive: true,
          isDeleted: { $ne: true }
        },
        {
          $set: {
            'status.current': updates.status,
            'status.reviewedAt': new Date(),
            ...(updates.approvedBy && {
              'status.lastApproved': new Date(),
              'status.lastApprovedBy': updates.approvedBy
            }),
            ...(updates.rejectionReason && {
              'status.rejectionReason': updates.rejectionReason
            }),
            // Move pending to approved if approving
            ...(updates.status === 'approved' && {
              approved: { $ifNull: ['$pending', '$approved'] },
              pending: null,
              'status.rejectionReason': undefined
            })
          }
        },
        { session }
      );

      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    }
  }

  /**
   * Toggle tutor verification
   */
  static async toggleVerification(tutorId: string) {
    const tutor = await TutorModel.findById(tutorId);
    if (!tutor) throw new Error('Tutor not found');

    return await TutorModel.findByIdAndUpdate(
      tutorId,
      { isVerified: !tutor.isVerified },
      { new: true }
    );
  }

  /**
   * Toggle tutor featured status
   */
  static async toggleFeatured(tutorId: string) {
    const tutor = await TutorModel.findById(tutorId);
    if (!tutor) throw new Error('Tutor not found');

    return await TutorModel.findByIdAndUpdate(
      tutorId,
      { isFeatured: !tutor.isFeatured },
      { new: true }
    );
  }

  /**
   * Soft delete tutor
   */
  static async softDelete(tutorId: string) {
    return await TutorModel.findByIdAndUpdate(
      tutorId,
      {
        isActive: false,
        isDeleted: true,
        deletedAt: new Date()
      },
      { new: true }
    );
  }

  /**
   * Get dashboard statistics
   */
  static async getDashboardStats(filters?: TutorAnalyticsFilter): Promise<TutorDashboardStats> {
    const matchStage: any = {
      isDeleted: { $ne: true }
    };

    if (filters) {
      if (filters.dateFrom || filters.dateTo) {
        matchStage.createdAt = {};
        if (filters.dateFrom) matchStage.createdAt.$gte = filters.dateFrom;
        if (filters.dateTo) matchStage.createdAt.$lte = filters.dateTo;
      }
      if (filters.status) matchStage['status.current'] = filters.status;
      if (filters.city) matchStage['approved.location.city'] = filters.city;
      if (filters.subject) {
        matchStage['approved.subjects.subjectId'] = new mongoose.Types.ObjectId(filters.subject);
      }
    }

    const stats = await TutorModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ['$status.current', 'pending'] }, 1, 0] }
          },
          approved: {
            $sum: { $cond: [{ $eq: ['$status.current', 'approved'] }, 1, 0] }
          },
          rejected: {
            $sum: { $cond: [{ $eq: ['$status.current', 'rejected'] }, 1, 0] }
          },
          suspended: {
            $sum: { $cond: [{ $eq: ['$status.current', 'suspended'] }, 1, 0] }
          },
          verified: {
            $sum: { $cond: ['$isVerified', 1, 0] }
          },
          featured: {
            $sum: { $cond: ['$isFeatured', 1, 0] }
          },
          totalRating: { $sum: '$rating.average' },
          ratingCount: { $sum: '$rating.count' }
        }
      }
    ]);

    const [result] = stats || [{}];

    // Get new tutors this month
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const newThisMonth = await TutorModel.countDocuments({
      ...matchStage,
      createdAt: { $gte: thisMonth }
    });

    return {
      total: result.total || 0,
      pending: result.pending || 0,
      approved: result.approved || 0,
      rejected: result.rejected || 0,
      suspended: result.suspended || 0,
      verified: result.verified || 0,
      featured: result.featured || 0,
      newThisMonth,
      averageRating: result.ratingCount > 0
        ? Math.round((result.totalRating / result.ratingCount) * 10) / 10
        : 0
    };
  }

  /**
   * Export tutors data
   */
  static async exportTutors(filters: TutorAdminSearchParams) {
    const tutors = await TutorModel.find({
      isActive: true,
      isDeleted: { $ne: true },
      ...(filters.status && { 'status.current': filters.status }),
      ...(filters.city && { 'approved.location.city': filters.city })
    })
    .populate('userId', 'name email')
    .populate('approved.subjects.subjectId')
    .lean();

    return tutors.map(tutor => ({
      ID: tutor._id?.toString() || tutor.id,
      Name: `${tutor.approved.basicInfo.firstName} ${tutor.approved.basicInfo.lastName}`,
      Email: tutor.approved.contactDetails.email,
      Phone: tutor.approved.contactDetails.phone,
      Status: tutor.status.current,
      Subjects: tutor.approved.subjects.map(s => s.subjectId).join(', '),
      City: tutor.approved.location.city,
      Areas: tutor.approved.location.areas.join(', '),
      Rating: tutor.rating.average,
      'Profile Views': tutor.analytics.profileViews,
      Connects: tutor.analytics.connects,
      'Hourly Rate': tutor.approved.pricing.oneToOne.hourlyRate,
      Verified: tutor.isVerified ? 'Yes' : 'No',
      Featured: tutor.isFeatured ? 'Yes' : 'No',
      'Created At': tutor.createdAt,
      'Submitted At': tutor.status.submittedAt,
      'Last Approved': tutor.status.lastApproved
    }));
  }
}