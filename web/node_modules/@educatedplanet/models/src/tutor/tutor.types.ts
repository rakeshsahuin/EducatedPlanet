/**
 * Core tutor interface for EducatedPlanet platform
 * Represents a tutor's complete profile information
 */
export interface Tutor {
  id: string;
  name: string;
  title: string;
  photo: string;
  subjects: string[];
  rating: TutorRating;
  teachingModes: TeachingMode[];
  location: TutorLocation;
  experience: string;
  isVerified: boolean;
  price: TutorPrice;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Tutor rating information
 */
export interface TutorRating {
  average: number;
  count: number;
}

/**
 * Teaching modes supported by tutor
 */
export type TeachingMode = 'online' | 'offline' | 'both';

/**
 * Tutor location information
 */
export interface TutorLocation {
  areas: string[];
  city: string;
}

/**
 * Tutor pricing information
 */
export interface TutorPrice {
  min: number;
  max: number;
  currency: string;
}

/**
 * Tutor search filters interface
 */
export interface TutorSearchFilters {
  subjects?: string[];
  areas?: string[];
  teachingModes?: TeachingMode[];
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  verified?: boolean;
  query?: string;
}

/**
 * Tutor card display variants
 */
export type TutorCardVariant = 'default' | 'compact' | 'detailed';

/**
 * Extended tutor interface for detailed views
 */
export interface ExtendedTutor extends Tutor {
  bio?: string;
  education?: Education[];
  languages?: Language[];
  availability?: Availability;
  reviews?: Review[];
  responseRate?: number;
  responseTime?: string; // e.g., "2 hours"
}

/**
 * Education information for tutors
 */
export interface Education {
  degree: string;
  institution: string;
  year?: number;
  field?: string;
}

/**
 * Languages spoken by tutor
 */
export interface Language {
  name: string;
  proficiency: 'Basic' | 'Intermediate' | 'Advanced' | 'Native';
}

/**
 * Tutor availability information
 */
export interface Availability {
  weekdays: WeekdayAvailability[];
  flexible: boolean;
  availableOnShortNotice: boolean;
}

/**
 * Weekly availability schedule
 */
export interface WeekdayAvailability {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  available: boolean;
  timeSlots?: TimeSlot[];
}

/**
 * Time slots for availability
 */
export interface TimeSlot {
  start: string; // HH:mm format
  end: string;   // HH:mm format
}

/**
 * Review information
 */
export interface Review {
  id: string;
  tutorId: string;
  userId: string;
  studentName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  isApproved: boolean;
}

// ===============================
// Service Layer Interfaces
// ===============================

/**
 * Input for creating a new tutor
 */
export interface CreateTutorInput {
  name: string;
  title: string;
  photo: string;
  subjects: string[];
  teachingModes: TeachingMode[];
  location: {
    areas: string[];
    city: string;
  };
  experience: string;
  price: {
    min: number;
    max: number;
    currency: string;
  };
  userId?: string;
}

/**
 * Input for updating an existing tutor
 */
export interface UpdateTutorInput {
  name?: string;
  title?: string;
  photo?: string;
  subjects?: string[];
  teachingModes?: TeachingMode[];
  location?: {
    areas?: string[];
    city?: string;
  };
  experience?: string;
  price?: {
    min?: number;
    max?: number;
    currency?: string;
  };
}

/**
 * Parameters for searching tutors
 */
export interface TutorSearchParams {
  query?: string;
  subjects?: string[];
  areas?: string[];
  teachingModes?: TeachingMode[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  city?: string;
  isVerified?: boolean;
  status?: 'pending' | 'approved' | 'rejected' | 'suspended';
  isFeatured?: boolean;
  page?: number;
  limit?: number;
}

/**
 * Review service interfaces
 */

/**
 * Input for creating a new review
 */
export interface CreateReviewInput {
  tutorId: string;
  userId: string;
  rating: number;
  comment: string;
  studentName: string;
  isPublic?: boolean;
}

/**
 * Input for updating an existing review
 */
export interface UpdateReviewInput {
  rating?: number;
  comment?: string;
  studentName?: string;
  isPublic?: boolean;
}

/**
 * Parameters for searching reviews
 */
export interface ReviewSearchParams {
  tutorId?: string;
  userId?: string;
  rating?: number;
  isApproved?: boolean;
  isPublic?: boolean;
  page?: number;
  limit?: number;
}