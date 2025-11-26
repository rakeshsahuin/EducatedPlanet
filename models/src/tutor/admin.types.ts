import { TutorSearchParams, TeachingMode } from './tutor.types';
import { Types } from 'mongoose';

/**
 * Tutor status enum
 */
export type TutorStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

/**
 * Extended tutor interface for admin panel
 */
export interface TutorAdmin {
  id: string;
  userId: Types.ObjectId;
  status: {
    current: TutorStatus;
    lastApproved?: Date;
    lastApprovedBy?: Types.ObjectId;
    submittedAt: Date;
    reviewedAt?: Date;
    rejectionReason?: string;
  };
  approved: TutorData;
  pending?: Partial<TutorData>;
  analytics: {
    profileViews: number;
    contactViews: number;
    connects: number;
    responseRate: number;
    lastActive: Date;
  };
  rating: {
    average: number;
    count: number;
    distribution: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
  };
  isVerified: boolean;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Tutor data structure for approved/pending
 */
export interface TutorData {
  basicInfo: {
    firstName: string;
    lastName: string;
    title: string;
    shortDescription: string;
    longDescription: string;
    photo?: string;
    experienceYears?: number;
  };
  subjects: Array<{
    subjectId: Types.ObjectId;
    classIds: Types.ObjectId[];
    ageFrom: number;
    ageTo: number;
    isAcademic: boolean;
    proficiency: 'beginner' | 'intermediate' | 'advanced';
  }>;
  experience: Array<{
    title: string;
    institution: string;
    yearFrom: Date;
    yearTo?: Date;
    isPresent: boolean;
    description?: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: number;
    field: string;
  }>;
  contactDetails: {
    phone: string;
    whatsapp?: string;
    email: string;
    preferredContact: 'phone' | 'email' | 'whatsapp';
  };
  socialMediaLinks: {
    facebook?: string;
    linkedin?: string;
    instagram?: string;
    personalWebsite?: string;
  };
  location: {
    // Existing fields for backward compatibility
    areas?: string[];
    city?: string;
    state?: string;

    // New structured address
    address: {
      maplink?: string;
      address1?: string;
      locality: string;
      city: string;
      state: string;
      country?: string;
      zip?: string;
      digipin?: string;
      coordinates: {
        lat: number;
        lng: number;
      };
    };

    // New availability range
    availabilityRange: {
      value: number;
      unit: 'km' | 'miles';
    };

    // Keep existing for geospatial queries
    coordinates?: {
      type: 'Point';
      coordinates: [number, number];
    };
  };
  pricing: {
    oneToOne: {
      hourlyRate: number;
      currency: string;
    };
    groupSession: {
      hourlyRate: number;
      maxStudents: number;
      ratePerStudent: number;
    };
    onlineClass: {
      hourlyRate: number;
      platformFee?: number;
    };
    trialClass: {
      enabled: boolean;
      duration?: number;
      price?: number;
    };
  };
  teachingModes: TeachingMode[];
  availability: {
    weekdays: 'weekdays' | 'weekends' | 'both' | 'flexible';
    flexible: boolean;
    responseTime?: number;
  };
}

/**
 * Simplified tutor for admin list view
 */
export interface TutorAdminListItem {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  status: TutorStatus;
  submittedAt: Date;
  subjects: string[];
  areas: string[];
  rating: {
    average: number;
    count: number;
  };
  analytics: {
    profileViews: number;
    connects: number;
  };
  isVerified: boolean;
  isFeatured: boolean;
  isActive: boolean;
}

/**
 * Tutor in approval queue
 */
export interface TutorApprovalQueue {
  id: string;
  userId: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  submittedAt: Date;
  basicInfo: TutorData['basicInfo'];
  subjects: TutorData['subjects'];
  experience: TutorData['experience'];
  education: TutorData['education'];
  pricing: TutorData['pricing'];
  pendingChanges?: Partial<TutorData>;
}

/**
 * Bulk operation request
 */
export interface BulkOperationRequest {
  tutorIds: string[];
  operation: 'approve' | 'reject' | 'suspend' | 'delete' | 'feature' | 'unfeature';
  reason?: string;
  notifyTutors?: boolean;
}

/**
 * Bulk operation result
 */
export interface BulkOperationResult {
  success: number;
  failed: number;
  errors: Array<{
    tutorId: string;
    error: string;
  }>;
  jobId: string;
}

/**
 * Dashboard statistics
 */
export interface TutorDashboardStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  suspended: number;
  verified: number;
  featured: number;
  newThisMonth: number;
  averageRating: number;
}

/**
 * Analytics filter
 */
export interface TutorAnalyticsFilter {
  dateFrom?: Date;
  dateTo?: Date;
  status?: TutorStatus;
  city?: string;
  subject?: string;
}

/**
 * Admin search parameters extended
 */
export interface TutorAdminSearchParams extends Omit<TutorSearchParams, 'status'> {
  status?: TutorStatus;
  minRating?: number;
  maxPrice?: number;
  isVerified?: boolean;
  isFeatured?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Tutor verification status update
 */
export interface TutorVerificationUpdate {
  tutorId: string;
  isVerified: boolean;
  verifiedBy: string;
  notes?: string;
}

/**
 * Tutor approval update
 */
export interface TutorApprovalUpdate {
  tutorId: string;
  approvedBy: string;
  notes?: string;
  sendNotification?: boolean;
}

/**
 * Tutor rejection update
 */
export interface TutorRejectionUpdate {
  tutorId: string;
  rejectedBy: string;
  reason: string;
  sendNotification?: boolean;
}

/**
 * Tutor suspension update
 */
export interface TutorSuspensionUpdate {
  tutorId: string;
  suspendedBy: string;
  reason: string;
  sendNotification?: boolean;
}

/**
 * Types for dynamic subject/class selection in tutor form
 */
export interface TutorSubject {
  subjectId: string;
  subjectName: string;
  isAcademic: boolean;
  classes?: ClassOption[];    // For non-academic subjects - using ClassOption model
  ageFrom?: number;          // For academic subjects
  ageTo?: number;            // For academic subjects
  proficiency?: 'beginner' | 'intermediate' | 'advanced';
}

export interface SubjectOption {
  id: string;
  name: string;
  code: string;
  isAcademic: boolean;
  isActive: boolean;
  description?: string;
  classIds?: ClassOption[];
}

export interface ClassOption {
  _id: string;
  name: string;
  code: string;
  category: string;
  isActive: boolean;
  description?: string;
}

export interface SubjectsResponse {
  subjects: SubjectOption[];
  loading: boolean;
  error?: string;
}

export interface SubjectsClassesResponse {
  subjects: SubjectOption[];
  classes: ClassOption[];
  loading: boolean;
  error?: string;
}