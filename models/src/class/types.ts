// Core class entity interface
export interface Class {
  id: string;
  name: string;
  code: string; // Unique identifier (e.g., "SCHOOL", "LKG", "CLASS-1")
  category: ClassCategory; // SCHOOL, COLLEGE, PROFESSIONAL, COMPETITIVE
  subClasses: string[]; // Array of subclass codes/names
  description?: string;
  isActive: boolean;
  sortOrder: number; // For ordering within same level
  metadata: ClassMetadata;
  createdAt: Date;
  updatedAt: Date;
}

// Nested metadata structure
export interface ClassMetadata {
  minAge?: number;
  maxAge?: number;
  duration?: string; // e.g., "1 year", "6 months"
  subjects?: string[]; // Associated subjects
  prerequisites?: string[]; // Required classes
}

// Enums
export enum ClassCategory {
  SCHOOL = 'school',
  COLLEGE = 'college',
  PROFESSIONAL = 'professional',
  COMPETITIVE = 'competitive',
  SKILL_DEVELOPMENT = 'skill_development',
  SPORTS = 'sports',
  ENTERTAINMENT = 'entertainment',
  ART = 'art',
  HEALTH = 'health'
}

// CRUD Input types
export interface CreateClassInput {
  name: string;
  code: string;
  category: ClassCategory;
  subClasses?: string[]; // Optional sub-classes
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
  metadata?: Partial<ClassMetadata>;
}

export interface UpdateClassInput {
  name?: string;
  code?: string;
  category?: ClassCategory;
  subClasses?: string[]; // Can add/remove sub-classes
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
  metadata?: Partial<ClassMetadata>;
}

// Search parameters
export interface ClassSearchParams {
  query?: string;
  category?: ClassCategory;
  hasSubClasses?: boolean; // Filter classes with/without sub-classes
  isActive?: boolean;
  subClass?: string; // Find classes containing this sub-class
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'sortOrder' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Extended interfaces
export interface ClassWithSubClasses extends Class {
  subClassDetails?: Class[]; // Populated sub-class details
}

// Operations for managing sub-classes
export interface AddSubClassInput {
  subClassCode: string;
  subClassName: string;
}

export interface RemoveSubClassInput {
  subClassCode: string;
}

// Pagination response type
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}