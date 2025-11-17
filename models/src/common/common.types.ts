/**
 * Common types used across the EducatedPlanet platform
 */

/**
 * API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  timestamp: string;
}

/**
 * API error information
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

/**
 * Generic entity with timestamps
 */
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Status types
 */
export type Status = 'active' | 'inactive' | 'pending' | 'suspended' | 'deleted';

/**
 * Verification status
 */
export type VerificationStatus = 'pending' | 'approved' | 'rejected';

/**
 * Subject categories
 */
export enum SubjectCategory {
  ACADEMICS = 'academics',
  LANGUAGES = 'languages',
  ARTS = 'arts',
  SPORTS = 'sports',
  TECHNOLOGY = 'technology',
  MUSIC = 'music',
  PROFESSIONAL_SKILLS = 'professional_skills',
  EXAM_PREPARATION = 'exam_preparation',
}

/**
 * Subject information
 */
export interface Subject {
  id: string;
  name: string;
  description?: string;
  category: SubjectCategory;
  icon?: string;
  color?: string;
  popular: boolean;
  code: string;
}

/**
 * Class/Grade levels
 */
export type ClassLevel =
  | '1' | '2' | '3' | '4' | '5'
  | '6' | '7' | '8' | '9' | '10'
  | '11' | '12'
  | 'college'
  | 'professional';

/**
 * Location areas in Bhubaneswar
 */
export const BHUBANESWAR_AREAS = [
  'Patia',
  'Old Town',
  'Saheed Nagar',
  'Nayapalli',
  'Master Canteen',
  'VSS Nagar',
  'Ashok Nagar',
  'IRC Village',
  'Bomikhal',
  'Jaydev Vihar',
  'Khandagiri',
] as const;

export type BhubaneswarArea = typeof BHUBANESWAR_AREAS[number];

/**
 * Search filters interface
 */
export interface SearchFilters {
  query?: string;
  category?: SubjectCategory;
  areas?: BhubaneswarArea[];
  classLevels?: ClassLevel[];
  teachingModes?: ('online' | 'offline' | 'both')[];
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  verified?: boolean;
  availableNow?: boolean;
}

/**
 * Loading states
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Theme modes
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Currency types
 */
export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

/**
 * File upload types
 */
export interface FileUpload {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

/**
 * Form validation errors
 */
export interface FormErrors {
  [key: string]: string | undefined;
}

/**
 * Generic component props
 */
export interface ComponentProps {
  className?: string;
  children?: any;
  testId?: string;
}

/**
 * Color variants for UI components
 */
export type ColorVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/**
 * Size variants for UI components
 */
export type SizeVariant = 'sm' | 'md' | 'lg' | 'xl';