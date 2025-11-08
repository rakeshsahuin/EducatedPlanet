import { Review, CreateReviewInput, UpdateReviewInput, ReviewSearchParams } from '@educatedplanet/models';
import { IReviewDocument } from '../datamodels';
/**
 * Review service for handling review-related business logic
 */
export declare class ReviewService {
    private static initialized;
    private ensureInitialized;
    /**
     * Transform MongoDB document to Review interface
     */
    private transformReviewDocument;
    /**
     * Create a new review
     */
    createReview(reviewData: CreateReviewInput): Promise<Review>;
    /**
     * Find review by ID
     */
    findReviewById(id: string): Promise<Review | null>;
    /**
     * Find reviews by tutor ID
     */
    findReviewsByTutorId(tutorId: string, options?: {
        page?: number;
        limit?: number;
        rating?: number;
        isApproved?: boolean;
    }): Promise<Review[]>;
    /**
     * Find approved reviews by tutor ID
     */
    findApprovedReviewsByTutorId(tutorId: string, page?: number, limit?: number): Promise<IReviewDocument[]>;
    /**
     * Find reviews by user ID
     */
    findReviewsByUserId(userId: string): Promise<Review[]>;
    /**
     * Get pending reviews (admin function)
     */
    getPendingReviews(page?: number, limit?: number): Promise<Review[]>;
    /**
     * Search reviews with filters
     */
    searchReviews(params: ReviewSearchParams): Promise<{
        reviews: IReviewDocument[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    /**
     * Update review by ID
     */
    updateReview(id: string, updateData: UpdateReviewInput): Promise<Review | null>;
    /**
     * Approve review (admin function)
     */
    approveReview(id: string, moderatedBy?: string): Promise<Review | null>;
    /**
     * Reject review (admin function)
     */
    rejectReview(id: string, reason: string, moderatedBy: string): Promise<Review | null>;
    /**
     * Hide review (admin function)
     */
    hideReview(id: string): Promise<IReviewDocument | null>;
    /**
     * Report review
     */
    reportReview(id: string): Promise<IReviewDocument | null>;
    /**
     * Mark review as helpful
     */
    markReviewHelpful(id: string): Promise<IReviewDocument | null>;
    /**
     * Add tutor response to review
     */
    addTutorResponse(id: string, response: {
        content: string;
        isPublic?: boolean;
    }): Promise<IReviewDocument | null>;
    /**
     * Get reviews by rating for a tutor
     */
    findReviewsByRating(tutorId: string, rating: number, page?: number, limit?: number): Promise<IReviewDocument[]>;
    /**
     * Get review statistics for a tutor
     */
    getTutorReviewStats(tutorId: string): Promise<Array<{
        _id: number;
        count: number;
    }>>;
    /**
     * Get average rating for a tutor
     */
    getTutorAverageRating(tutorId: string): Promise<{
        averageRating: number;
        totalReviews: number;
    } | null>;
    /**
     * Get rating distribution for a tutor
     */
    getTutorRatingDistribution(tutorId: string): Promise<Array<{
        rating: number;
        count: number;
    }>>;
    /**
     * Get review summary for a tutor
     */
    getTutorReviewSummary(tutorId: string): Promise<any>;
    /**
     * Delete review
     */
    deleteReview(id: string): Promise<Review | null>;
    /**
     * Validate review data
     */
    private validateReviewData;
}
export declare const reviewService: ReviewService;
//# sourceMappingURL=review.service.d.ts.map