/**
 * API Client for EducatedPlanet Admin Panel
 * Integrates with dataservice package for backend operations
 */

import {
  UserService,
  TutorService,
  ReviewService
} from '@educatedplanet/dataservice';
import {
  User,
  Tutor,
  Review,
  CreateUserInput,
  UpdateUserInput,
  CreateTutorInput,
  UpdateTutorInput,
  CreateReviewInput,
  UpdateReviewInput,
  UserSearchParams,
  TutorSearchParams,
  ReviewSearchParams,
  ApiResponse,
  PaginatedResponse,
  PaginationMeta
} from '@educatedplanet/models';

// Initialize services (they handle their own database connections)
const userService = new UserService();
const tutorService = new TutorService();
const reviewService = new ReviewService();

// Transform search results to match PaginatedResponse format
const transformUserSearchResult = (result: any): PaginatedResponse<User> => {
  const pagination: PaginationMeta = {
    currentPage: result.page || 1,
    totalPages: result.totalPages || 0,
    totalItems: result.total || 0,
    itemsPerPage: 10,
    hasNextPage: (result.page || 1) < (result.totalPages || 0),
    hasPrevPage: (result.page || 1) > 1
  };

  return {
    items: result.users || [],
    pagination
  };
};

const transformTutorSearchResult = (result: any): PaginatedResponse<Tutor> => {
  const pagination: PaginationMeta = {
    currentPage: result.page || 1,
    totalPages: result.totalPages || 0,
    totalItems: result.total || 0,
    itemsPerPage: 10,
    hasNextPage: (result.page || 1) < (result.totalPages || 0),
    hasPrevPage: (result.page || 1) > 1
  };

  return {
    items: result.tutors || [],
    pagination
  };
};

const transformReviewSearchResult = (result: any): PaginatedResponse<Review> => {
  const pagination: PaginationMeta = {
    currentPage: result.pagination?.page || 1,
    totalPages: result.pagination?.pages || 0,
    totalItems: result.pagination?.total || 0,
    itemsPerPage: result.pagination?.limit || 10,
    hasNextPage: (result.pagination?.page || 1) < (result.pagination?.pages || 0),
    hasPrevPage: (result.pagination?.page || 1) > 1
  };

  return {
    items: result.reviews || [],
    pagination
  };
};

/**
 * User API operations
 */
export const userApi = {
  // Get all users with pagination and filters
  getUsers: async (params?: UserSearchParams): Promise<PaginatedResponse<User>> => {
    try {
      const searchParams = {
        query: params?.query,
        role: params?.role,
        isEmailVerified: params?.isEmailVerified,
        isPhoneVerified: params?.isPhoneVerified,
        isActive: params?.isActive,
        page: params?.page || 1,
        limit: params?.limit || 10
      };
      const result = await userService.searchUsers(searchParams);
      return transformUserSearchResult(result);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User | null> => {
    try {
      return await userService.findUserById(id);
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Create new user
  createUser: async (userData: CreateUserInput): Promise<User> => {
    try {
      return await userService.createUser(userData);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user
  updateUser: async (id: string, userData: UpdateUserInput): Promise<User | null> => {
    try {
      return await userService.updateUser(id, userData);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (id: string): Promise<boolean> => {
    try {
      const result = await userService.deleteUser(id);
      return result !== null;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Get user statistics
  getUserStats: async (): Promise<any> => {
    try {
      // Mock implementation - would need to be added to UserService
      const result = await userService.searchUsers({ page: 1, limit: 1 });
      return {
        total: result.total || 0,
        active: 0, // Would need aggregation in service
        verified: 0, // Would need aggregation in service
        newThisMonth: 0 // Would need aggregation in service
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }
};

/**
 * Tutor API operations
 */
export const tutorApi = {
  // Get all tutors with pagination and filters
  getTutors: async (params?: TutorSearchParams): Promise<PaginatedResponse<Tutor>> => {
    try {
      const result = await tutorService.searchTutors(params || {});
      return transformTutorSearchResult(result);
    } catch (error) {
      console.error('Error fetching tutors:', error);
      throw error;
    }
  },

  // Get tutor by ID
  getTutorById: async (id: string): Promise<Tutor | null> => {
    try {
      return await tutorService.findTutorById(id);
    } catch (error) {
      console.error('Error fetching tutor:', error);
      throw error;
    }
  },

  // Create new tutor
  createTutor: async (tutorData: CreateTutorInput): Promise<Tutor> => {
    try {
      return await tutorService.createTutor(tutorData);
    } catch (error) {
      console.error('Error creating tutor:', error);
      throw error;
    }
  },

  // Update tutor
  updateTutor: async (id: string, tutorData: UpdateTutorInput): Promise<Tutor | null> => {
    try {
      return await tutorService.updateTutor(id, tutorData);
    } catch (error) {
      console.error('Error updating tutor:', error);
      throw error;
    }
  },

  // Delete tutor
  deleteTutor: async (id: string): Promise<boolean> => {
    try {
      const result = await tutorService.deleteTutor(id);
      return result !== null;
    } catch (error) {
      console.error('Error deleting tutor:', error);
      throw error;
    }
  },

  // Get tutor statistics
  getTutorStats: async (): Promise<any> => {
    try {
      const result = await tutorService.getTutorStats();
      // Transform array to object
      const stats: any = {
        total: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
        averageRating: 0
      };

      result.forEach(stat => {
        stats[stat._id] = stat.count;
        if (stat._id !== 'total') {
          stats.total += stat.count;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error fetching tutor stats:', error);
      throw error;
    }
  },

  // Verify tutor (approve)
  verifyTutor: async (id: string): Promise<Tutor | null> => {
    try {
      return await tutorService.approveTutor(id, 'admin');
    } catch (error) {
      console.error('Error verifying tutor:', error);
      throw error;
    }
  }
};

/**
 * Review API operations
 */
export const reviewApi = {
  // Get all reviews with pagination and filters
  getReviews: async (params?: ReviewSearchParams): Promise<PaginatedResponse<Review>> => {
    try {
      const searchParams = {
        tutorId: params?.tutorId,
        userId: params?.userId,
        rating: params?.rating,
        isApproved: params?.isApproved,
        isPublic: params?.isPublic,
        page: params?.page || 1,
        limit: params?.limit || 10
      };
      const result = await reviewService.searchReviews(searchParams);
      return transformReviewSearchResult(result);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  // Get review by ID
  getReviewById: async (id: string): Promise<Review | null> => {
    try {
      return await reviewService.findReviewById(id);
    } catch (error) {
      console.error('Error fetching review:', error);
      throw error;
    }
  },

  // Create new review
  createReview: async (reviewData: CreateReviewInput): Promise<Review> => {
    try {
      return await reviewService.createReview(reviewData);
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  // Update review
  updateReview: async (id: string, reviewData: UpdateReviewInput): Promise<Review | null> => {
    try {
      return await reviewService.updateReview(id, reviewData);
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },

  // Delete review
  deleteReview: async (id: string): Promise<boolean> => {
    try {
      const result = await reviewService.deleteReview(id);
      return result !== null;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },

  // Get review statistics
  getReviewStats: async (): Promise<any> => {
    try {
      // Mock implementation - would need aggregation in service
      const result = await reviewService.searchReviews({ page: 1, limit: 1 });
      return {
        total: result.pagination?.total || 0,
        averageRating: 4.5, // Would need actual aggregation
        pending: 0,
        approved: result.pagination?.total || 0
      };
    } catch (error) {
      console.error('Error fetching review stats:', error);
      throw error;
    }
  }
};

/**
 * Dashboard API operations
 */
export const dashboardApi = {
  // Get overview statistics
  getOverviewStats: async (): Promise<any> => {
    try {
      const [userStats, tutorStats, reviewStats] = await Promise.all([
        userApi.getUserStats(),
        tutorApi.getTutorStats(),
        reviewApi.getReviewStats()
      ]);

      return {
        users: userStats,
        tutors: tutorStats,
        reviews: reviewStats,
        totalUsers: userStats.total,
        totalTutors: tutorStats.total,
        totalReviews: reviewStats.total,
        averageRating: reviewStats.averageRating
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get recent activities
  getRecentActivities: async (limit: number = 10): Promise<any[]> => {
    try {
      // This would be implemented in the dataservice
      // For now, return empty array
      return [];
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  }
};

// Export all APIs
export const api = {
  users: userApi,
  tutors: tutorApi,
  reviews: reviewApi,
  dashboard: dashboardApi
};

// Export services for direct usage if needed
export {
  userService,
  tutorService,
  reviewService
};