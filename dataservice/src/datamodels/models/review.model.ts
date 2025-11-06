import mongoose from 'mongoose';
import { IReviewDocument } from '../schemas/review-clean.schema';
import { databaseConnection } from '../connections';

/**
 * Review model bound to the database connection
 */
export const ReviewModel = databaseConnection.getReviewModel();

// Export frequently used query methods
export const ReviewQueries = {
  /**
   * Find review by ID
   */
  findById: (id: string) => ReviewModel.findById(id).populate('tutorId').populate('userId'),

  /**
   * Find reviews by tutor ID
   */
  findByTutorId: (
    tutorId: string,
    options: {
      page?: number;
      limit?: number;
      rating?: number;
      isApproved?: boolean;
    } = {}
  ) => {
    const { page = 1, limit = 10, rating, isApproved } = options;
    const skip = (page - 1) * limit;

    const query: any = { tutorId };
    if (rating !== undefined) query.rating = rating;
    if (isApproved !== undefined) query.isApproved = isApproved;

    return ReviewModel.find(query)
      .populate('tutorId')
      .populate('userId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  },

  /**
   * Find reviews by user ID
   */
  findByUserId: (userId: string) =>
    ReviewModel.find({ userId })
      .populate('tutorId')
      .sort({ createdAt: -1 }),

  /**
   * Find approved reviews by tutor ID
   */
  findApprovedByTutorId: (
    tutorId: string,
    page = 1,
    limit = 10
  ) => {
    const skip = (page - 1) * limit;

    return ReviewModel.find({ tutorId, isApproved: true })
      .populate('tutorId')
      .populate('userId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  },

  /**
   * Find pending reviews
   */
  findPending: (page = 1, limit = 20) => {
    const skip = (page - 1) * limit;

    return ReviewModel.find({ isApproved: false })
      .populate('tutorId')
      .populate('userId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  },

  /**
   * Get review statistics for a tutor
   */
  getTutorStats: (tutorId: string) =>
    ReviewModel.aggregate([
      { $match: { tutorId } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      }
    ]),

  /**
   * Get average rating for a tutor
   */
  getAverageRating: (tutorId: string) =>
    ReviewModel.aggregate([
      {
        $match: {
          tutorId,
          isApproved: true
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]),

  /**
   * Get rating distribution
   */
  getRatingDistribution: (tutorId: string) =>
    ReviewModel.aggregate([
      {
        $match: {
          tutorId,
          isApproved: true
        }
      },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          distribution: {
            $push: {
              k: { $toString: '$_id' },
              v: '$count'
            }
          }
        }
      }
    ]),

  /**
   * Create new review
   */
  create: (reviewData: Partial<IReviewDocument>) => ReviewModel.create(reviewData),

  /**
   * Update review by ID
   */
  updateById: (id: string, updateData: Partial<IReviewDocument>) =>
    ReviewModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }),

  /**
   * Approve review
   */
  approveReview: (id: string, moderatedBy?: string) =>
    ReviewModel.findByIdAndUpdate(
      id,
      {
        isApproved: true,
        moderatedBy,
        moderatedAt: new Date()
      },
      { new: true }
    ),

  /**
   * Reject review
   */
  rejectReview: (id: string, reason: string, moderatedBy: string) =>
    ReviewModel.findByIdAndUpdate(
      id,
      {
        isApproved: false,
        moderationNotes: reason,
        moderatedBy,
        moderatedAt: new Date()
      },
      { new: true }
    ),

  /**
   * Hide review
   */
  hideReview: (id: string) =>
    ReviewModel.findByIdAndUpdate(id, { isHidden: true }, { new: true }),

  /**
   * Report review
   */
  reportReview: (id: string) =>
    ReviewModel.findByIdAndUpdate(
      id,
      { $inc: { reportedCount: 1 } },
      { new: true }
    ),

  /**
   * Mark review as helpful
   */
  markHelpful: (id: string) =>
    ReviewModel.findByIdAndUpdate(
      id,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    ),

  /**
   * Add tutor response
   */
  addTutorResponse: (id: string, response: { content: string; isPublic?: boolean }) =>
    ReviewModel.findByIdAndUpdate(
      id,
      {
        'tutorResponse.content': response.content,
        'tutorResponse.respondedAt': new Date(),
        'tutorResponse.isPublic': response.isPublic !== false // Default to true
      },
      { new: true }
    ),

  /**
   * Check if user has already reviewed a tutor
   */
  userHasReviewedTutor: (userId: string, tutorId: string) =>
    ReviewModel.findOne({ userId, tutorId }),

  /**
   * Get reviews by rating
   */
  findByRating: (tutorId: string, rating: number, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    return ReviewModel.find({ tutorId, rating, isApproved: true })
      .populate('userId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  },

  /**
   * Get review summary
   */
  getReviewSummary: (tutorId: string) =>
    ReviewModel.aggregate([
      {
        $match: { tutorId, isApproved: true }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          recentReviews: { $push: '$$ROOT' }
        }
      },
      {
        $project: {
          _id: 0,
          averageRating: { $round: ['$averageRating', 1] },
          totalReviews: 1,
          recentReviews: { $slice: ['$recentReviews', 0, 3] }
        }
      }
    ]),

  /**
   * Delete review
   */
  deleteById: (id: string) => ReviewModel.findByIdAndDelete(id),

  /**
   * Get reviews with pagination
   */
  getPaginatedReviews: (filter: any, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    return Promise.all([
      ReviewModel.countDocuments(filter),
      ReviewModel.find(filter)
        .populate('tutorId')
        .populate('userId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
    ]).then(([total, reviews]) => ({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }));
  }
};

export default ReviewModel;