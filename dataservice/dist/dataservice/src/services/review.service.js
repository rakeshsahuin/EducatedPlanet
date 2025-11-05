"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewService = exports.ReviewService = void 0;
const mongoose_1 = require("mongoose");
const datamodels_1 = require("../datamodels");
/**
 * Review service for handling review-related business logic
 */
class ReviewService {
    /**
     * Transform MongoDB document to Review interface
     */
    transformReviewDocument(reviewDoc) {
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
    async createReview(reviewData) {
        // Validate input
        this.validateReviewData(reviewData);
        // Check if user has already reviewed this tutor
        const existingReview = await datamodels_1.ReviewQueries.userHasReviewedTutor(reviewData.userId, reviewData.tutorId);
        if (existingReview) {
            throw new Error('User has already reviewed this tutor');
        }
        // Create review
        const reviewDoc = await datamodels_1.ReviewQueries.create({
            tutorId: new mongoose_1.Types.ObjectId(reviewData.tutorId),
            userId: new mongoose_1.Types.ObjectId(reviewData.userId),
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
    async findReviewById(id) {
        const reviewDoc = await datamodels_1.ReviewQueries.findById(id);
        return reviewDoc ? this.transformReviewDocument(reviewDoc) : null;
    }
    /**
     * Find reviews by tutor ID
     */
    async findReviewsByTutorId(tutorId, options = {}) {
        const reviewDocs = await datamodels_1.ReviewQueries.findByTutorId(tutorId, options);
        return reviewDocs.map(doc => this.transformReviewDocument(doc));
    }
    /**
     * Find approved reviews by tutor ID
     */
    async findApprovedReviewsByTutorId(tutorId, page = 1, limit = 10) {
        return await datamodels_1.ReviewQueries.findApprovedByTutorId(tutorId, page, limit);
    }
    /**
     * Find reviews by user ID
     */
    async findReviewsByUserId(userId) {
        const reviewDocs = await datamodels_1.ReviewQueries.findByUserId(userId);
        return reviewDocs.map(doc => this.transformReviewDocument(doc));
    }
    /**
     * Get pending reviews (admin function)
     */
    async getPendingReviews(page = 1, limit = 20) {
        // Use direct model query if findPending doesn't exist
        const reviewDocs = await datamodels_1.ReviewModel.find({
            isApproved: false,
            isActive: true
        }).sort({ createdAt: -1 }).limit(limit);
        return reviewDocs.map(doc => this.transformReviewDocument(doc));
    }
    /**
     * Search reviews with filters
     */
    async searchReviews(params) {
        const { page = 1, limit = 10, tutorId, userId, rating, isApproved, isPublic } = params;
        // Build filter object
        const filter = {};
        if (tutorId)
            filter.tutorId = tutorId;
        if (userId)
            filter.userId = userId;
        if (rating)
            filter.rating = rating;
        if (isApproved !== undefined)
            filter.isApproved = isApproved;
        if (isPublic !== undefined)
            filter.isPublic = isPublic;
        return await datamodels_1.ReviewQueries.getPaginatedReviews(filter, page, limit);
    }
    /**
     * Update review by ID
     */
    async updateReview(id, updateData) {
        // Validate update data
        if (updateData.rating !== undefined && (updateData.rating < 1 || updateData.rating > 5)) {
            throw new Error('Rating must be between 1 and 5');
        }
        if (updateData.comment && updateData.comment.trim().length === 0) {
            throw new Error('Comment cannot be empty');
        }
        const updatedDoc = await datamodels_1.ReviewQueries.updateById(id, updateData);
        return updatedDoc ? this.transformReviewDocument(updatedDoc) : null;
    }
    /**
     * Approve review (admin function)
     */
    async approveReview(id, moderatedBy) {
        const updatedDoc = await datamodels_1.ReviewQueries.approveReview(id, moderatedBy);
        return updatedDoc ? this.transformReviewDocument(updatedDoc) : null;
    }
    /**
     * Reject review (admin function)
     */
    async rejectReview(id, reason, moderatedBy) {
        const updatedDoc = await datamodels_1.ReviewQueries.rejectReview(id, reason, moderatedBy);
        return updatedDoc ? this.transformReviewDocument(updatedDoc) : null;
    }
    /**
     * Hide review (admin function)
     */
    async hideReview(id) {
        return await datamodels_1.ReviewQueries.hideReview(id);
    }
    /**
     * Report review
     */
    async reportReview(id) {
        return await datamodels_1.ReviewQueries.reportReview(id);
    }
    /**
     * Mark review as helpful
     */
    async markReviewHelpful(id) {
        return await datamodels_1.ReviewQueries.markHelpful(id);
    }
    /**
     * Add tutor response to review
     */
    async addTutorResponse(id, response) {
        if (!response.content || response.content.trim().length === 0) {
            throw new Error('Response content cannot be empty');
        }
        if (response.content.length > 1000) {
            throw new Error('Response cannot exceed 1000 characters');
        }
        return await datamodels_1.ReviewQueries.addTutorResponse(id, response);
    }
    /**
     * Get reviews by rating for a tutor
     */
    async findReviewsByRating(tutorId, rating, page = 1, limit = 10) {
        return await datamodels_1.ReviewQueries.findByRating(tutorId, rating, page, limit);
    }
    /**
     * Get review statistics for a tutor
     */
    async getTutorReviewStats(tutorId) {
        return await datamodels_1.ReviewQueries.getTutorStats(tutorId);
    }
    /**
     * Get average rating for a tutor
     */
    async getTutorAverageRating(tutorId) {
        const result = await datamodels_1.ReviewQueries.getAverageRating(tutorId);
        return result.length > 0 ? result[0] : null;
    }
    /**
     * Get rating distribution for a tutor
     */
    async getTutorRatingDistribution(tutorId) {
        const result = await datamodels_1.ReviewQueries.getRatingDistribution(tutorId);
        if (result.length === 0)
            return [];
        const distribution = [];
        for (let i = 1; i <= 5; i++) {
            const found = result.find((item) => item._id === i);
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
    async getTutorReviewSummary(tutorId) {
        return await datamodels_1.ReviewQueries.getReviewSummary(tutorId);
    }
    /**
     * Delete review
     */
    async deleteReview(id) {
        const deletedDoc = await datamodels_1.ReviewQueries.deleteById(id);
        return deletedDoc ? this.transformReviewDocument(deletedDoc) : null;
    }
    /**
     * Validate review data
     */
    validateReviewData(reviewData) {
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
exports.ReviewService = ReviewService;
// Export singleton instance
exports.reviewService = new ReviewService();
//# sourceMappingURL=review.service.js.map