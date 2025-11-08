import mongoose from 'mongoose';
import { IReviewDocument } from '../schemas/review-clean.schema';
/**
 * Review model bound to the database connection
 */
export declare const ReviewModel: mongoose.Model<IReviewDocument, {}, {}, {}, mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export declare const ReviewQueries: {
    /**
     * Find review by ID
     */
    findById: (id: string) => mongoose.Query<mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, IReviewDocument, "findOne", {}>;
    /**
     * Find reviews by tutor ID
     */
    findByTutorId: (tutorId: string, options?: {
        page?: number;
        limit?: number;
        rating?: number;
        isApproved?: boolean;
    }) => mongoose.Query<(mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[], mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, IReviewDocument, "find", {}>;
    /**
     * Find reviews by user ID
     */
    findByUserId: (userId: string) => mongoose.Query<(mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[], mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, IReviewDocument, "find", {}>;
    /**
     * Find approved reviews by tutor ID
     */
    findApprovedByTutorId: (tutorId: string, page?: number, limit?: number) => mongoose.Query<(mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[], mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, IReviewDocument, "find", {}>;
    /**
     * Find pending reviews
     */
    findPending: (page?: number, limit?: number) => mongoose.Query<(mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[], mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, IReviewDocument, "find", {}>;
    /**
     * Get review statistics for a tutor
     */
    getTutorStats: (tutorId: string) => mongoose.Aggregate<any[]>;
    /**
     * Get average rating for a tutor
     */
    getAverageRating: (tutorId: string) => mongoose.Aggregate<any[]>;
    /**
     * Get rating distribution
     */
    getRatingDistribution: (tutorId: string) => mongoose.Aggregate<any[]>;
    /**
     * Create new review
     */
    create: (reviewData: Partial<IReviewDocument>) => Promise<mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    /**
     * Update review by ID
     */
    updateById: (id: string, updateData: Partial<IReviewDocument>) => mongoose.Query<mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, IReviewDocument, "findOneAndUpdate", {}>;
    /**
     * Approve review
     */
    approveReview: (id: string, moderatedBy?: string) => mongoose.Query<mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, IReviewDocument, "findOneAndUpdate", {}>;
    /**
     * Reject review
     */
    rejectReview: (id: string, reason: string, moderatedBy: string) => mongoose.Query<mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, IReviewDocument, "findOneAndUpdate", {}>;
    /**
     * Hide review
     */
    hideReview: (id: string) => mongoose.Query<mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, IReviewDocument, "findOneAndUpdate", {}>;
    /**
     * Report review
     */
    reportReview: (id: string) => mongoose.Query<mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, IReviewDocument, "findOneAndUpdate", {}>;
    /**
     * Mark review as helpful
     */
    markHelpful: (id: string) => mongoose.Query<mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, IReviewDocument, "findOneAndUpdate", {}>;
    /**
     * Add tutor response
     */
    addTutorResponse: (id: string, response: {
        content: string;
        isPublic?: boolean;
    }) => mongoose.Query<mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, IReviewDocument, "findOneAndUpdate", {}>;
    /**
     * Check if user has already reviewed a tutor
     */
    userHasReviewedTutor: (userId: string, tutorId: string) => mongoose.Query<mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, IReviewDocument, "findOne", {}>;
    /**
     * Get reviews by rating
     */
    findByRating: (tutorId: string, rating: number, page?: number, limit?: number) => mongoose.Query<(mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[], mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, IReviewDocument, "find", {}>;
    /**
     * Get review summary
     */
    getReviewSummary: (tutorId: string) => mongoose.Aggregate<any[]>;
    /**
     * Delete review
     */
    deleteById: (id: string) => mongoose.Query<mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, IReviewDocument, "findOneAndDelete", {}>;
    /**
     * Get reviews with pagination
     */
    getPaginatedReviews: (filter: any, page?: number, limit?: number) => Promise<{
        reviews: (mongoose.Document<unknown, {}, IReviewDocument, {}, {}> & IReviewDocument & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
};
export default ReviewModel;
//# sourceMappingURL=review.model.d.ts.map