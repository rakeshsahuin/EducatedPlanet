import mongoose from 'mongoose';
import { ITutorDocument } from '../schemas/tutor-clean.schema';

/**
 * Tutor model
 */
export const TutorModel = mongoose.model<ITutorDocument>('Tutor');

// Export frequently used query methods
export const TutorQueries = {
  /**
   * Find tutor by ID
   */
  findById: (id: string) => TutorModel.findById(id).populate('userId'),

  /**
   * Find tutor by user ID
   */
  findByUserId: (userId: string) => TutorModel.findOne({ userId }),

  /**
   * Find approved tutors
   */
  findApproved: () => TutorModel.find({
    'verification.isApproved': true,
    isActive: true,
    status: 'approved'
  }).populate('userId'),

  /**
   * Find featured tutors
   */
  findFeatured: () => TutorModel.find({
    'verification.isApproved': true,
    isActive: true,
    isFeatured: true
  }).populate('userId')
    .sort({ 'rating.average': -1, 'analytics.profileViews': -1 }),

  /**
   * Search tutors with filters
   */
  search: (filters: {
    subjects?: string[];
    areas?: string[];
    teachingModes?: string[];
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    query?: string;
    page?: number;
    limit?: number;
  }) => {
    const {
      subjects = [],
      areas = [],
      teachingModes = [],
      minPrice,
      maxPrice,
      minRating,
      query,
      page = 1,
      limit = 20
    } = filters;

    const searchQuery: any = {
      'verification.isApproved': true,
      isActive: true
    };

    // Subject filter
    if (subjects.length > 0) {
      searchQuery['teaching.subjects'] = { $in: subjects };
    }

    // Area filter
    if (areas.length > 0) {
      searchQuery['location.areas'] = { $in: areas };
    }

    // Teaching mode filter
    if (teachingModes.length > 0) {
      searchQuery['teaching.teachingModes'] = { $in: teachingModes };
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      searchQuery['pricing.hourlyRate.min'] = {};
      if (minPrice !== undefined) {
        searchQuery['pricing.hourlyRate.min'].$gte = minPrice;
      }
      if (maxPrice !== undefined) {
        searchQuery['pricing.hourlyRate.min'].$lte = maxPrice;
      }
    }

    // Rating filter
    if (minRating !== undefined) {
      searchQuery['rating.average'] = { $gte: minRating };
    }

    // Text search
    if (query) {
      searchQuery.$or = [
        { 'basicInfo.title': { $regex: query, $options: 'i' } },
        { 'basicInfo.longDescription': { $regex: query, $options: 'i' } },
        { 'teaching.subjects': { $in: [new RegExp(query, 'i')] } }
      ];
    }

    const skip = (page - 1) * limit;

    return TutorModel.find(searchQuery)
      .populate('userId')
      .sort({ 'rating.average': -1, 'analytics.profileViews': -1 })
      .skip(skip)
      .limit(limit);
  },

  /**
   * Find tutors by location with geo search
   */
  findByLocation: (coordinates: [number, number], maxDistance = 10000) =>
    TutorModel.find({
      'verification.isApproved': true,
      isActive: true,
      'location.coordinates': {
        $near: {
          $geometry: { type: 'Point', coordinates },
          $maxDistance: maxDistance
        }
      }
    }).populate('userId'),

  /**
   * Find tutors by subjects
   */
  findBySubjects: (subjects: string[]) =>
    TutorModel.find({
      'teaching.subjects': { $in: subjects },
      'verification.isApproved': true,
      isActive: true
    }).populate('userId'),

  /**
   * Find tutors by areas
   */
  findByAreas: (areas: string[]) =>
    TutorModel.find({
      'location.areas': { $in: areas },
      'verification.isApproved': true,
      isActive: true
    }).populate('userId'),

  /**
   * Get tutor count by status
   */
  getCountByStatus: () => TutorModel.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]),

  /**
   * Get top rated tutors
   */
  getTopRated: (limit = 10) =>
    TutorModel.find({
      'verification.isApproved': true,
      isActive: true,
      'rating.count': { $gte: 5 } // At least 5 reviews
    })
    .populate('userId')
    .sort({ 'rating.average': -1 })
    .limit(limit),

  /**
   * Get recently added tutors
   */
  getRecent: (limit = 10) =>
    TutorModel.find({
      'verification.isApproved': true,
      isActive: true
    })
    .populate('userId')
    .sort({ createdAt: -1 })
    .limit(limit),

  /**
   * Create new tutor profile
   */
  create: (tutorData: Partial<ITutorDocument>) => TutorModel.create(tutorData),

  /**
   * Update tutor by ID
   */
  updateById: (id: string, updateData: Partial<ITutorDocument>) =>
    TutorModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }),

  /**
   * Update tutor rating
   */
  updateRating: async (tutorId: string) => {
    // This would typically be called from the service layer
    // when reviews are updated
    const Review = mongoose.model('Review');
    const ratingResult = await Review.aggregate([
      { $match: { tutorId, isApproved: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);

    if (ratingResult.length > 0) {
      const { averageRating, totalReviews, ratingDistribution } = ratingResult[0];

      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      ratingDistribution.forEach((rating: number) => {
        distribution[rating as keyof typeof distribution]++;
      });

      return TutorModel.findByIdAndUpdate(tutorId, {
        'rating.average': Math.round(averageRating * 10) / 10,
        'rating.count': totalReviews,
        'rating.distribution': distribution
      }, { new: true });
    }

    return null;
  },

  /**
   * Increment profile views
   */
  incrementProfileViews: (tutorId: string) =>
    TutorModel.findByIdAndUpdate(
      tutorId,
      { $inc: { 'analytics.profileViews': 1 } },
      { new: true }
    ),

  /**
   * Increment contact views
   */
  incrementContactViews: (tutorId: string) =>
    TutorModel.findByIdAndUpdate(
      tutorId,
      { $inc: { 'analytics.contactViews': 1 } },
      { new: true }
    ),

  /**
   * Increment connects
   */
  incrementConnects: (tutorId: string) =>
    TutorModel.findByIdAndUpdate(
      tutorId,
      { $inc: { 'analytics.connects': 1 } },
      { new: true }
    ),

  /**
   * Approve tutor
   */
  approveTutor: (tutorId: string, approvedBy: string) =>
    TutorModel.findByIdAndUpdate(tutorId, {
      status: 'approved',
      'verification.isApproved': true,
      'verification.approvedAt': new Date(),
      'verification.approvedBy': approvedBy
    }, { new: true }),

  /**
   * Reject tutor
   */
  rejectTutor: (tutorId: string, rejectionReason: string) =>
    TutorModel.findByIdAndUpdate(tutorId, {
      status: 'rejected',
      'verification.isApproved': false,
      'verification.rejectedAt': new Date(),
      'verification.rejectionReason': rejectionReason
    }, { new: true }),

  /**
   * Soft delete tutor (deactivate)
   */
  softDelete: (tutorId: string) =>
    TutorModel.findByIdAndUpdate(tutorId, {
      isActive: false,
      status: 'suspended'
    }, { new: true })
};

export default TutorModel;