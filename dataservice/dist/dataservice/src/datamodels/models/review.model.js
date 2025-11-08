"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewQueries = exports.ReviewModel = void 0;
const connections_1 = require("../connections");
/**
 * Review model bound to the database connection
 */
exports.ReviewModel = connections_1.databaseConnection.getReviewModel();
// Export frequently used query methods
exports.ReviewQueries = {
    /**
     * Find review by ID
     */
    findById: (id) => exports.ReviewModel.findById(id).populate('tutorId').populate('userId'),
    /**
     * Find reviews by tutor ID
     */
    findByTutorId: (tutorId, options = {}) => {
        const { page = 1, limit = 10, rating, isApproved } = options;
        const skip = (page - 1) * limit;
        const query = { tutorId };
        if (rating !== undefined)
            query.rating = rating;
        if (isApproved !== undefined)
            query.isApproved = isApproved;
        return exports.ReviewModel.find(query)
            .populate('tutorId')
            .populate('userId')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
    },
    /**
     * Find reviews by user ID
     */
    findByUserId: (userId) => exports.ReviewModel.find({ userId })
        .populate('tutorId')
        .sort({ createdAt: -1 }),
    /**
     * Find approved reviews by tutor ID
     */
    findApprovedByTutorId: (tutorId, page = 1, limit = 10) => {
        const skip = (page - 1) * limit;
        return exports.ReviewModel.find({ tutorId, isApproved: true })
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
        return exports.ReviewModel.find({ isApproved: false })
            .populate('tutorId')
            .populate('userId')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
    },
    /**
     * Get review statistics for a tutor
     */
    getTutorStats: (tutorId) => exports.ReviewModel.aggregate([
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
    getAverageRating: (tutorId) => exports.ReviewModel.aggregate([
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
    getRatingDistribution: (tutorId) => exports.ReviewModel.aggregate([
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
    create: (reviewData) => exports.ReviewModel.create(reviewData),
    /**
     * Update review by ID
     */
    updateById: (id, updateData) => exports.ReviewModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }),
    /**
     * Approve review
     */
    approveReview: (id, moderatedBy) => exports.ReviewModel.findByIdAndUpdate(id, {
        isApproved: true,
        moderatedBy,
        moderatedAt: new Date()
    }, { new: true }),
    /**
     * Reject review
     */
    rejectReview: (id, reason, moderatedBy) => exports.ReviewModel.findByIdAndUpdate(id, {
        isApproved: false,
        moderationNotes: reason,
        moderatedBy,
        moderatedAt: new Date()
    }, { new: true }),
    /**
     * Hide review
     */
    hideReview: (id) => exports.ReviewModel.findByIdAndUpdate(id, { isHidden: true }, { new: true }),
    /**
     * Report review
     */
    reportReview: (id) => exports.ReviewModel.findByIdAndUpdate(id, { $inc: { reportedCount: 1 } }, { new: true }),
    /**
     * Mark review as helpful
     */
    markHelpful: (id) => exports.ReviewModel.findByIdAndUpdate(id, { $inc: { helpfulCount: 1 } }, { new: true }),
    /**
     * Add tutor response
     */
    addTutorResponse: (id, response) => exports.ReviewModel.findByIdAndUpdate(id, {
        'tutorResponse.content': response.content,
        'tutorResponse.respondedAt': new Date(),
        'tutorResponse.isPublic': response.isPublic !== false // Default to true
    }, { new: true }),
    /**
     * Check if user has already reviewed a tutor
     */
    userHasReviewedTutor: (userId, tutorId) => exports.ReviewModel.findOne({ userId, tutorId }),
    /**
     * Get reviews by rating
     */
    findByRating: (tutorId, rating, page = 1, limit = 10) => {
        const skip = (page - 1) * limit;
        return exports.ReviewModel.find({ tutorId, rating, isApproved: true })
            .populate('userId')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
    },
    /**
     * Get review summary
     */
    getReviewSummary: (tutorId) => exports.ReviewModel.aggregate([
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
    deleteById: (id) => exports.ReviewModel.findByIdAndDelete(id),
    /**
     * Get reviews with pagination
     */
    getPaginatedReviews: (filter, page = 1, limit = 10) => {
        const skip = (page - 1) * limit;
        return Promise.all([
            exports.ReviewModel.countDocuments(filter),
            exports.ReviewModel.find(filter)
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
exports.default = exports.ReviewModel;
//# sourceMappingURL=review.model.js.map