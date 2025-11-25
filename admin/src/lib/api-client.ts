/**
 * API Client for EducatedPlanet Admin Panel
 * Makes HTTP requests to API routes instead of calling dataservice directly
 */

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
  PaginationMeta
} from '@educatedplanet/models';

// Helper to build query string
const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, v.toString()));
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });
  return searchParams.toString();
};

/**
 * User API operations
 */
export const userApi = {
  // Get all users with pagination and filters
  getUsers: async (params?: UserSearchParams): Promise<PaginatedResponse<User>> => {
    const queryString = params ? buildQueryString(params) : '';
    const response = await fetch(`/api/users${queryString ? `?${queryString}` : ''}`);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch users');
    }

    return {
      items: result.data,
      pagination: result.pagination
    };
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User | null> => {
    const response = await fetch(`/api/users/${id}`);
    const result = await response.json();

    if (!result.success) {
      if (response.status === 404) return null;
      throw new Error(result.error || 'Failed to fetch user');
    }

    return result.data;
  },

  // Create new user
  createUser: async (userData: CreateUserInput): Promise<User> => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to create user');
    }

    return result.data;
  },

  // Update user
  updateUser: async (id: string, userData: UpdateUserInput): Promise<User | null> => {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (!result.success) {
      if (response.status === 404) return null;
      throw new Error(result.error || 'Failed to update user');
    }

    return result.data;
  },

  // Delete user
  deleteUser: async (id: string): Promise<boolean> => {
    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to delete user');
    }

    return true;
  },

  // Get user statistics
  getUserStats: async (): Promise<any> => {
    const response = await fetch('/api/admin/analytics/users');
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch user stats');
    }

    return result.data;
  },
};

/**
 * Tutor API operations
 */
export const tutorApi = {
  // Get all tutors with pagination and filters
  getTutors: async (params?: TutorSearchParams): Promise<PaginatedResponse<Tutor>> => {
    const queryString = params ? buildQueryString(params) : '';
    const response = await fetch(`/api/tutors${queryString ? `?${queryString}` : ''}`);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch tutors');
    }

    return {
      items: result.data,
      pagination: result.pagination
    };
  },

  // Get tutor by ID
  getTutorById: async (id: string): Promise<Tutor | null> => {
    const response = await fetch(`/api/tutors/${id}`);
    const result = await response.json();

    if (!result.success) {
      if (response.status === 404) return null;
      throw new Error(result.error || 'Failed to fetch tutor');
    }

    return result.data;
  },

  // Create new tutor
  createTutor: async (tutorData: CreateTutorInput): Promise<Tutor> => {
    const response = await fetch('/api/tutors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tutorData),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to create tutor');
    }

    return result.data;
  },

  // Update tutor
  updateTutor: async (id: string, tutorData: UpdateTutorInput): Promise<Tutor | null> => {
    const response = await fetch(`/api/tutors/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tutorData),
    });

    const result = await response.json();

    if (!result.success) {
      if (response.status === 404) return null;
      throw new Error(result.error || 'Failed to update tutor');
    }

    return result.data;
  },

  // Delete tutor
  deleteTutor: async (id: string): Promise<boolean> => {
    const response = await fetch(`/api/tutors/${id}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to delete tutor');
    }

    return true;
  },

  // Verify tutor
  verifyTutor: async (id: string, approvedBy?: string): Promise<Tutor> => {
    const response = await fetch(`/api/admin/tutors/bulk-approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-id': approvedBy || 'admin',
      },
      body: JSON.stringify({ tutorIds: [id] }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to verify tutor');
    }

    // Return the updated tutor - you might need to fetch it again
    return await tutorApi.getTutorById(id) as Tutor;
  },
};

/**
 * Review API operations
 */
export const reviewApi = {
  // Get all reviews with pagination and filters
  getReviews: async (params?: ReviewSearchParams): Promise<PaginatedResponse<Review>> => {
    const queryString = params ? buildQueryString(params) : '';
    const response = await fetch(`/api/reviews${queryString ? `?${queryString}` : ''}`);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch reviews');
    }

    return {
      items: result.data,
      pagination: result.pagination
    };
  },

  // Get review by ID
  getReviewById: async (id: string): Promise<Review | null> => {
    const response = await fetch(`/api/reviews/${id}`);
    const result = await response.json();

    if (!result.success) {
      if (response.status === 404) return null;
      throw new Error(result.error || 'Failed to fetch review');
    }

    return result.data;
  },

  // Create new review
  createReview: async (reviewData: CreateReviewInput): Promise<Review> => {
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to create review');
    }

    return result.data;
  },

  // Update review
  updateReview: async (id: string, reviewData: UpdateReviewInput): Promise<Review | null> => {
    const response = await fetch(`/api/reviews/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });

    const result = await response.json();

    if (!result.success) {
      if (response.status === 404) return null;
      throw new Error(result.error || 'Failed to update review');
    }

    return result.data;
  },

  // Delete review
  deleteReview: async (id: string): Promise<boolean> => {
    const response = await fetch(`/api/reviews/${id}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to delete review');
    }

    return true;
  },
};

/**
 * Dashboard API operations
 */
export const dashboardApi = {
  // Get overview statistics
  getOverviewStats: async (): Promise<any> => {
    const response = await fetch('/api/dashboard');
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch dashboard stats');
    }

    return result.data.overview;
  },

  // Get recent activities
  getRecentActivities: async (limit: number = 10): Promise<any[]> => {
    const response = await fetch(`/api/dashboard?includeRecent=true&recentLimit=${limit}`);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch recent activities');
    }

    return result.data.recentActivities || [];
  },
};