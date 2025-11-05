/**
 * Static API Client for EducatedPlanet Admin Panel
 * Uses static data instead of dataservice package
 */

import { users } from '@/data/users';
import { tutors, reviews } from '@/data/tutors';
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
  PaginatedResponse,
  PaginationMeta,
  UserRole
} from '@educatedplanet/models';

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
 * User API operations using static data
 */
export const userApi = {
  // Get all users with pagination and filters
  getUsers: async (params?: UserSearchParams): Promise<PaginatedResponse<User>> => {
    try {
      let filteredUsers = [...users];
      
      // Apply filters
      if (params?.query) {
        filteredUsers = filteredUsers.filter(user => 
          user.name.toLowerCase().includes(params.query!.toLowerCase()) ||
          user.email.toLowerCase().includes(params.query!.toLowerCase())
        );
      }
      
      if (params?.role) {
        filteredUsers = filteredUsers.filter(user => user.role === params.role);
      }

      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

      return {
        items: paginatedUsers,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(filteredUsers.length / limit),
          totalItems: filteredUsers.length,
          itemsPerPage: limit,
          hasNextPage: page < Math.ceil(filteredUsers.length / limit),
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User | null> => {
    try {
      return users.find(user => user.id === id) || null;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Create new user
  createUser: async (userData: CreateUserInput): Promise<User> => {
    try {
      const newUser: any = {
        id: (users.length + 1).toString(),
        name: userData.name,
        email: userData.email || '',
        phone: userData.phone,
        role: userData.role || 'user' as UserRole,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      users.push(newUser);
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user
  updateUser: async (id: string, userData: UpdateUserInput): Promise<User | null> => {
    try {
      const userIndex = users.findIndex(user => user.id === id);
      if (userIndex === -1) return null;
      
      const updatedUser: any = { ...users[userIndex], ...userData, updatedAt: new Date() };
      users[userIndex] = updatedUser;
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (id: string): Promise<boolean> => {
    try {
      const userIndex = users.findIndex(user => user.id === id);
      if (userIndex === -1) return false;
      
      users.splice(userIndex, 1);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Get user statistics
  getUserStats: async (): Promise<any> => {
    try {
      return {
        total: users.length,
        active: users.filter(u => u.role === 'admin').length,
        verified: users.filter(u => u.isVerified).length,
        newThisMonth: 2 // Mock data
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }
};

/**
 * Tutor API operations using static data
 */
export const tutorApi = {
  // Get all tutors with pagination and filters
  getTutors: async (params?: TutorSearchParams): Promise<PaginatedResponse<Tutor>> => {
    try {
      let filteredTutors = [...tutors];
      
      // Apply filters
      if (params?.query) {
        filteredTutors = filteredTutors.filter(tutor => 
          tutor.name.toLowerCase().includes(params.query!.toLowerCase()) ||
          tutor.title.toLowerCase().includes(params.query!.toLowerCase())
        );
      }
      
      if (params?.subjects) {
        filteredTutors = filteredTutors.filter(tutor => 
          params.subjects!.some(subject => tutor.subjects.includes(subject))
        );
      }

      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedTutors = filteredTutors.slice(startIndex, endIndex);

      return {
        items: paginatedTutors,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(filteredTutors.length / limit),
          totalItems: filteredTutors.length,
          itemsPerPage: limit,
          hasNextPage: page < Math.ceil(filteredTutors.length / limit),
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      console.error('Error fetching tutors:', error);
      throw error;
    }
  },

  // Get tutor by ID
  getTutorById: async (id: string): Promise<Tutor | null> => {
    try {
      return tutors.find(tutor => tutor.id === id) || null;
    } catch (error) {
      console.error('Error fetching tutor:', error);
      throw error;
    }
  },

  // Create new tutor
  createTutor: async (tutorData: CreateTutorInput): Promise<Tutor> => {
    try {
      const newTutor: any = {
        id: (tutors.length + 1).toString(),
        name: tutorData.name,
        title: tutorData.title,
        photo: tutorData.photo || '',
        subjects: tutorData.subjects,
        teachingModes: tutorData.teachingModes,
        location: tutorData.location,
        experience: tutorData.experience || '0 years',
        price: tutorData.price,
        rating: { average: 0, count: 0 },
        isVerified: false,
        status: 'pending',
        userId: tutorData.userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      tutors.push(newTutor);
      return newTutor;
    } catch (error) {
      console.error('Error creating tutor:', error);
      throw error;
    }
  },

  // Update tutor
  updateTutor: async (id: string, tutorData: UpdateTutorInput): Promise<Tutor | null> => {
    try {
      const tutorIndex = tutors.findIndex(tutor => tutor.id === id);
      if (tutorIndex === -1) return null;
      
      const updatedTutor: any = { ...tutors[tutorIndex], ...tutorData, updatedAt: new Date() };
      tutors[tutorIndex] = updatedTutor;
      return updatedTutor;
    } catch (error) {
      console.error('Error updating tutor:', error);
      throw error;
    }
  },

  // Delete tutor
  deleteTutor: async (id: string): Promise<boolean> => {
    try {
      const tutorIndex = tutors.findIndex(tutor => tutor.id === id);
      if (tutorIndex === -1) return false;
      
      tutors.splice(tutorIndex, 1);
      return true;
    } catch (error) {
      console.error('Error deleting tutor:', error);
      throw error;
    }
  },

  // Get tutor statistics
  getTutorStats: async (): Promise<any> => {
    try {
      const total = tutors.length;
      const approved = tutors.filter((t: any) => t.status === 'approved').length;
      const pending = tutors.filter((t: any) => t.status === 'pending').length;
      const rejected = tutors.filter((t: any) => t.status === 'rejected').length;
      const averageRating = tutors.reduce((sum, t) => sum + t.rating.average, 0) / tutors.length;

      return [
        { _id: 'total', count: total },
        { _id: 'approved', count: approved },
        { _id: 'pending', count: pending },
        { _id: 'rejected', count: rejected },
        { _id: 'averageRating', count: averageRating }
      ];
    } catch (error) {
      console.error('Error fetching tutor stats:', error);
      throw error;
    }
  },

  // Verify tutor (approve)
  verifyTutor: async (id: string, approvedBy: string): Promise<Tutor | null> => {
    try {
      const tutorIndex = tutors.findIndex(tutor => tutor.id === id);
      if (tutorIndex === -1) return null;
      
      const verifiedTutor: any = {
        ...tutors[tutorIndex],
        isVerified: true,
        status: 'approved',
        updatedAt: new Date()
      };
      tutors[tutorIndex] = verifiedTutor;
      return verifiedTutor;
    } catch (error) {
      console.error('Error verifying tutor:', error);
      throw error;
    }
  }
};

/**
 * Review API operations using static data
 */
export const reviewApi = {
  // Get all reviews with pagination and filters
  getReviews: async (params?: ReviewSearchParams): Promise<PaginatedResponse<Review>> => {
    try {
      let filteredReviews = [...reviews];
      
      // Apply filters
      if (params?.tutorId) {
        filteredReviews = filteredReviews.filter(review => review.tutorId === params.tutorId);
      }
      
      if (params?.rating) {
        filteredReviews = filteredReviews.filter(review => review.rating === params.rating);
      }

      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedReviews = filteredReviews.slice(startIndex, endIndex);

      return {
        items: paginatedReviews,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(filteredReviews.length / limit),
          totalItems: filteredReviews.length,
          itemsPerPage: limit,
          hasNextPage: page < Math.ceil(filteredReviews.length / limit),
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  // Get review by ID
  getReviewById: async (id: string): Promise<Review | null> => {
    try {
      return reviews.find(review => review.id === id) || null;
    } catch (error) {
      console.error('Error fetching review:', error);
      throw error;
    }
  },

  // Create new review
  createReview: async (reviewData: CreateReviewInput): Promise<Review> => {
    try {
      const newReview: Review = {
        id: (reviews.length + 1).toString(),
        tutorId: reviewData.tutorId,
        userId: reviewData.userId,
        rating: reviewData.rating,
        comment: reviewData.comment,
        studentName: reviewData.studentName,
        isApproved: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      reviews.push(newReview);
      return newReview;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  // Update review
  updateReview: async (id: string, reviewData: UpdateReviewInput): Promise<Review | null> => {
    try {
      const reviewIndex = reviews.findIndex(review => review.id === id);
      if (reviewIndex === -1) return null;
      
      const updatedReview: any = { ...reviews[reviewIndex], ...reviewData, updatedAt: new Date() };
      reviews[reviewIndex] = updatedReview;
      return updatedReview;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },

  // Delete review
  deleteReview: async (id: string): Promise<boolean> => {
    try {
      const reviewIndex = reviews.findIndex(review => review.id === id);
      if (reviewIndex === -1) return false;
      
      reviews.splice(reviewIndex, 1);
      return true;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },

  // Get review statistics
  getReviewStats: async (): Promise<any> => {
    try {
      const total = reviews.length;
      const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      const pending = reviews.filter(r => !r.isApproved).length;
      const approved = reviews.filter(r => r.isApproved).length;

      return {
        total,
        averageRating,
        pending,
        approved
      };
    } catch (error) {
      console.error('Error fetching review stats:', error);
      throw error;
    }
  }
};

/**
 * Dashboard API operations using static data
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
        totalTutors: (tutorStats as any[]).find((s: any) => s._id === 'total')?.count || 0,
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
      // Mock recent activities
      return [
        {
          id: '1',
          type: 'user_created',
          message: 'New user registered',
          timestamp: new Date(),
          userId: '1'
        },
        {
          id: '2',
          type: 'tutor_approved',
          message: 'Tutor application approved',
          timestamp: new Date(Date.now() - 3600000),
          tutorId: '1'
        }
      ].slice(0, limit);
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
export const userService = userApi;
export const tutorService = tutorApi;
export const reviewService = reviewApi;