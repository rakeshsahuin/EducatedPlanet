import { Types } from 'mongoose';
import {
  Review,
  CreateReviewInput,
  UpdateReviewInput,
  ReviewSearchParams
} from '@educatedplanet/models';
import { IReviewDocument, ReviewQueries, ReviewModel } from '../datamodels';

/**
 * Review service for handling review-related business logic
 */
export class ReviewService {
  /**
   * Transform MongoDB document to Review interface
   */
  private transformReviewDocument(reviewDoc: IReviewDocument): Review {
    return {
      id: reviewDoc._id.toString(),
      tutorId: reviewDoc.tutorId.toString(),
      userId: reviewDoc.userId.toString(),
      rating: reviewDoc.rating,
      comment: reviewDoc.comment,
      studentName: reviewDoc.studentName,
      isApproved: reviewDoc.isApproved,
      createdAt: reviewDoc.createdAt,
      updatedAt: reviewDoc.updatedAt
    };
  }
  /**
   * Create a new review
   */
  public async createReview(reviewData: CreateReviewInput): Promise<Review> {
    // Validate input
    this.validateReviewData(reviewData);

    // Check if user has already reviewed this tutor
    const existingReview = await ReviewQueries.userHasReviewedTutor(
      reviewData.userId,
      reviewData.tutorId
    );

    if (existingReview) {
      throw new Error('User has already reviewed this tutor');
    }

    // Create review
    const reviewDoc = await ReviewQueries.create({
      tutorId: new Types.ObjectId(reviewData.tutorId),
      userId: new Types.ObjectId(reviewData.userId),
      rating: reviewData.rating,
      comment: reviewData.comment,
      studentName: reviewData.studentName,
      isApproved: false, // Reviews need approval
      isPublic: reviewData.isPublic !== false,
      helpfulCount: 0,
      reportedCount: 0
    });

    return this.transformReviewDocument(reviewDoc);
  }

  /**
   * Find review by ID
   */
  public async findReviewById(id: string): Promise<Review | null> {
    const reviewDoc = await ReviewQueries.findById(id);
    return reviewDoc ? this.transformReviewDocument(reviewDoc) : null;
  }

  /**
   * Find reviews by tutor ID
   */
  public async findReviewsByTutorId(
    tutorId: string,
    options: {
      page?: number;
      limit?: number;
      rating?: number;
      isApproved?: boolean;
    } = {}
  ): Promise<Review[]> {
    const reviewDocs = await ReviewQueries.findByTutorId(tutorId, options);
    return reviewDocs.map(doc => this.transformReviewDocument(doc));
  }

  /**
   * Find approved reviews by tutor ID
   */
  public async findApprovedReviewsByTutorId(
    tutorId: string,
    page = 1,
    limit = 10
  ): Promise<IReviewDocument[]> {
    return await ReviewQueries.findApprovedByTutorId(tutorId, page, limit);
  }

  /**
   * Find reviews by user ID
   */
  public async findReviewsByUserId(userId: string): Promise<Review[]> {
    const reviewDocs = await ReviewQueries.findByUserId(userId);
    return reviewDocs.map(doc => this.transformReviewDocument(doc));
  }

  /**
   * Get pending reviews (admin function)
   */
  public async getPendingReviews(page = 1, limit = 20): Promise<Review[]> {
    // Use direct model query if findPending doesn't exist
    const reviewDocs = await ReviewModel.find({
      isApproved: false,
      isActive: true
    }).sort({ createdAt: -1 }).limit(limit);
    return reviewDocs.map(doc => this.transformReviewDocument(doc));
  }

  /**
   * Search reviews with filters
   */
  public async searchReviews(params: ReviewSearchParams): Promise<{
    reviews: IReviewDocument[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const { page = 1, limit = 10, tutorId, userId, rating, isApproved, isPublic } = params;

    // Build filter object
    const filter: any = {};
    if (tutorId) filter.tutorId = tutorId;
    if (userId) filter.userId = userId;
    if (rating) filter.rating = rating;
    if (isApproved !== undefined) filter.isApproved = isApproved;
    if (isPublic !== undefined) filter.isPublic = isPublic;

    return await ReviewQueries.getPaginatedReviews(filter, page, limit);
  }

  /**
   * Update review by ID
   */
  public async updateReview(id: string, updateData: UpdateReviewInput): Promise<Review | null> {
    // Validate update data
    if (updateData.rating !== undefined && (updateData.rating < 1 || updateData.rating > 5)) {
      throw new Error('Rating must be between 1 and 5');
    }

    if (updateData.comment && updateData.comment.trim().length === 0) {
      throw new Error('Comment cannot be empty');
    }

    const updatedDoc = await ReviewQueries.updateById(id, updateData);
    return updatedDoc ? this.transformReviewDocument(updatedDoc) : null;
  }

  /**
   * Approve review (admin function)
   */
  public async approveReview(id: string, moderatedBy?: string): Promise<Review | null> {
    const updatedDoc = await ReviewQueries.approveReview(id, moderatedBy);
    return updatedDoc ? this.transformReviewDocument(updatedDoc) : null;
  }

  /**
   * Reject review (admin function)
   */
  public async rejectReview(id: string, reason: string, moderatedBy: string): Promise<Review | null> {
    const updatedDoc = await ReviewQueries.rejectReview(id, reason, moderatedBy);
    return updatedDoc ? this.transformReviewDocument(updatedDoc) : null;
  }

  /**
   * Hide review (admin function)
   */
  public async hideReview(id: string): Promise<IReviewDocument | null> {
    return await ReviewQueries.hideReview(id);
  }

  /**
   * Report review
   */
  public async reportReview(id: string): Promise<IReviewDocument | null> {
    return await ReviewQueries.reportReview(id);
  }

  /**
   * Mark review as helpful
   */
  public async markReviewHelpful(id: string): Promise<IReviewDocument | null> {
    return await ReviewQueries.markHelpful(id);
  }

  /**
   * Add tutor response to review
   */
  public async addTutorResponse(
    id: string,
    response: { content: string; isPublic?: boolean }
  ): Promise<IReviewDocument | null> {
    if (!response.content || response.content.trim().length === 0) {
      throw new Error('Response content cannot be empty');
    }

    if (response.content.length > 1000) {
      throw new Error('Response cannot exceed 1000 characters');
    }

    return await ReviewQueries.addTutorResponse(id, response);
  }

  /**
   * Get reviews by rating for a tutor
   */
  public async findReviewsByRating(
    tutorId: string,
    rating: number,
    page = 1,
    limit = 10
  ): Promise<IReviewDocument[]> {
    return await ReviewQueries.findByRating(tutorId, rating, page, limit);
  }

  /**
   * Get review statistics for a tutor
   */
  public async getTutorReviewStats(tutorId: string): Promise<Array<{
    _id: number;
    count: number;
  }>> {
    return await ReviewQueries.getTutorStats(tutorId);
  }

  /**
   * Get average rating for a tutor
   */
  public async getTutorAverageRating(tutorId: string): Promise<{
    averageRating: number;
    totalReviews: number;
  } | null> {
    const result = await ReviewQueries.getAverageRating(tutorId);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * Get rating distribution for a tutor
   */
  public async getTutorRatingDistribution(tutorId: string): Promise<Array<{
    rating: number;
    count: number;
  }>> {
    const result = await ReviewQueries.getRatingDistribution(tutorId);
    if (result.length === 0) return [];

    const distribution = [];
    for (let i = 1; i <= 5; i++) {
      const found = result.find((item: any) => item._id === i);
      distribution.push({
        rating: i,
        count: found ? found.count : 0
      });
    }

    return distribution;
  }

  /**
   * Get review summary for a tutor
   */
  public async getTutorReviewSummary(tutorId: string): Promise<any> {
    return await ReviewQueries.getReviewSummary(tutorId);
  }

  /**
   * Delete review
   */
  public async deleteReview(id: string): Promise<Review | null> {
    const deletedDoc = await ReviewQueries.deleteById(id);
    return deletedDoc ? this.transformReviewDocument(deletedDoc) : null;
  }

  /**
   * Validate review data
   */
  private validateReviewData(reviewData: CreateReviewInput): void {
    if (!reviewData.tutorId || reviewData.tutorId.trim().length === 0) {
      throw new Error('Tutor ID is required');
    }

    if (!reviewData.userId || reviewData.userId.trim().length === 0) {
      throw new Error('User ID is required');
    }

    if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    if (!reviewData.comment || reviewData.comment.trim().length === 0) {
      throw new Error('Comment is required');
    }

    if (reviewData.comment.length > 2000) {
      throw new Error('Comment cannot exceed 2000 characters');
    }

    if (!reviewData.studentName || reviewData.studentName.trim().length === 0) {
      throw new Error('Student name is required');
    }

    if (reviewData.studentName.length > 100) {
      throw new Error('Student name cannot exceed 100 characters');
    }
  }
}

// Export singleton instance
export const reviewService = new ReviewService();