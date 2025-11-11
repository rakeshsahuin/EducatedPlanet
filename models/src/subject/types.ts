// Subject-related types for the EducatedPlanet platform

import type { Class } from '../class/types';

// Core subject entity interface
export interface Subject {
  id: string;
  name: string;
  code: string; // Unique identifier (e.g., "MATH", "PHYS", "CHEM")
  classIds: string[]; // Array of class IDs this subject belongs to
  description: string;
  keywords: string[]; // Search keywords for better discoverability
  isActive: boolean;
  isAcademic: boolean; // Academic vs non-academic subjects
  sortOrder: number; // For ordering within same category
  metadata: SubjectMetadata;
  createdAt: Date;
  updatedAt: Date;
}

// Comprehensive metadata structure
export interface SubjectMetadata {
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  duration?: string; // e.g., "6 months", "1 year"
  prerequisites?: string[]; // Required subjects
  topics?: string[]; // Main topics covered
  skills?: string[]; // Skills gained
  careerPaths?: string[]; // Related career paths
  examPreparation?: string[]; // Related exams
  minAge?: number;
  maxAge?: number;
  popular?: boolean; // Track popularity
  icon?: string;
  color?: string;
}

// CRUD Input types
export interface CreateSubjectInput {
  name: string;
  code?: string; // Optional - will auto-generate if not provided
  classIds?: string[]; // Optional classes association
  description: string;
  keywords?: string[];
  isActive?: boolean;
  isAcademic?: boolean;
  sortOrder?: number;
  metadata?: Partial<SubjectMetadata>;
}

export interface UpdateSubjectInput {
  name?: string;
  code?: string;
  classIds?: string[]; // Can add/remove class associations
  description?: string;
  keywords?: string[];
  isActive?: boolean;
  isAcademic?: boolean;
  sortOrder?: number;
  metadata?: Partial<SubjectMetadata>;
}

// Advanced search parameters
export interface SubjectSearchParams {
  query?: string;
  isAcademic?: boolean;
  isActive?: boolean;
  classId?: string; // Find subjects for specific class
  hasKeywords?: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  popular?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'sortOrder' | 'createdAt' | 'popular';
  sortOrder?: 'asc' | 'desc';
}

// Extended interfaces for class relationships
export interface SubjectWithClasses extends Subject {
  classDetails?: Class[]; // Populated class details
}

// Operations for managing class associations
export interface AddClassToSubjectInput {
  classId: string;
  className?: string; // For validation/logging
}

export interface RemoveClassFromSubjectInput {
  classId: string;
}

// Bulk operations
export interface BulkSubjectOperation {
  subjectIds: string[];
  operation: 'activate' | 'deactivate' | 'delete' | 'updateMetadata';
  data?: any;
}