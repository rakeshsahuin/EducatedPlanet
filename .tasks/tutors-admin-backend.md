# Backend CRUD Services for Tutor Management - Implementation Plan

## Overview
This plan outlines the backend services and API endpoints needed for comprehensive tutor management in the admin panel, building upon the newly implemented MongoDB tutor collection with nested `approved`/`pending` schema structure.

## Current State Analysis

### Completed Infrastructure
-  Enhanced tutor schema with nested `approved` and `pending` objects
-  Status tracking (pending, approved, rejected, suspended)
-  Analytics fields (profileViews, contactViews, connects)
-  Rating system with distribution
-  Location with geospatial support
-  Multi-pricing structure for different class types
-  Comprehensive database indexing

### Identified Gaps
1. **Schema Mismatch**: Current service layer doesn't match new schema structure
2. **Missing Query Layer**: No dedicated queries for new schema paths
3. **Limited Admin Endpoints**: Basic API endpoints don't leverage new schema
4. **No Bulk Operations**: Missing efficient bulk management features
5. **Missing Analytics**: No admin-specific analytics or reporting

## Implementation Plan

### Phase 1: Update Models and Service Layer

#### 1.1 Create TypeScript Types
**File**: `models/src/tutor/admin.types.ts`

```typescript
// Admin-specific tutor types
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
}

export interface TutorApprovalQueue {
  id: string;
  userId: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  submittedAt: Date;
  basicInfo: TutorBasicInfo;
  subjects: TutorSubject[];
  experience: TutorExperience[];
  education: TutorEducation[];
  pricing: TutorPricing;
  pendingChanges?: Partial<TutorData>;
}

export interface BulkOperationRequest {
  tutorIds: string[];
  operation: 'approve' | 'reject' | 'suspend' | 'delete' | 'feature' | 'unfeature';
  reason?: string;
  notifyTutors?: boolean;
}

export interface BulkOperationResult {
  success: number;
  failed: number;
  errors: Array<{
    tutorId: string;
    error: string;
  }>;
  jobId: string;
}

// Analytics types
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

export interface TutorAnalyticsFilter {
  dateFrom: Date;
  dateTo: Date;
  status?: TutorStatus;
  city?: string;
  subject?: string;
}
```

#### 1.2 Create Query Layer
**File**: `dataservice/src/queries/tutor.queries.ts`

```typescript
export class TutorQueries {
  // Admin-specific queries
  static async getPendingApplications(options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const { page = 1, limit = 20, sortBy = 'status.submittedAt', sortOrder = 'desc' } = options;

    const query = {
      'status.current': 'pending',
      isActive: true,
      isDeleted: { $ne: true }
    };

    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const [tutors, total] = await Promise.all([
      TutorModel.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email phone')
        .lean(),
      TutorModel.countDocuments(query)
    ]);

    return { tutors, total, page, totalPages: Math.ceil(total / limit) };
  }

  static async searchTutors(filters: {
    query?: string;
    status?: TutorStatus;
    city?: string;
    subjects?: string[];
    teachingModes?: string[];
    minRating?: number;
    maxPrice?: number;
    isVerified?: boolean;
    isFeatured?: boolean;
    page?: number;
    limit?: number;
  }) {
    const {
      query,
      status,
      city,
      subjects,
      teachingModes,
      minRating,
      maxPrice,
      isVerified,
      isFeatured,
      page = 1,
      limit = 20
    } = filters;

    const searchQuery: any = {
      isActive: true,
      isDeleted: { $ne: true }
    };

    // Status filter
    if (status) {
      searchQuery['status.current'] = status;
    }

    // City filter
    if (city) {
      searchQuery['approved.location.city'] = city;
    }

    // Subjects filter
    if (subjects && subjects.length > 0) {
      searchQuery['approved.subjects.subjectId'] = { $in: subjects };
    }

    // Teaching modes filter
    if (teachingModes && teachingModes.length > 0) {
      searchQuery['approved.teachingModes'] = { $in: teachingModes };
    }

    // Rating filter
    if (minRating) {
      searchQuery['rating.average'] = { $gte: minRating };
    }

    // Price filter
    if (maxPrice) {
      searchQuery['approved.pricing.oneToOne.hourlyRate'] = { $lte: maxPrice };
    }

    // Verification filter
    if (isVerified !== undefined) {
      searchQuery.isVerified = isVerified;
    }

    // Featured filter
    if (isFeatured !== undefined) {
      searchQuery.isFeatured = isFeatured;
    }

    // Text search
    if (query) {
      searchQuery.$text = { $search: query };
    }

    const sort: any = {};
    if (query) {
      sort.score = { $meta: 'textScore' };
    } else {
      sort['rating.average'] = -1;
      sort['analytics.profileViews'] = -1;
    }

    const skip = (page - 1) * limit;

    const [tutors, total] = await Promise.all([
      TutorModel.find(searchQuery)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email')
        .lean(),
      TutorModel.countDocuments(searchQuery)
    ]);

    return { tutors, total, page, totalPages: Math.ceil(total / limit) };
  }

  static async getTutorByIdForAdmin(tutorId: string) {
    return await TutorModel.findById(tutorId)
      .populate('userId')
      .populate('approved.subjects.subjectId')
      .populate('approved.subjects.classIds')
      .lean();
  }

  static async bulkUpdateStatus(tutorIds: string[], updates: {
    status: TutorStatus;
    approvedBy?: string;
    rejectionReason?: string;
  }) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const result = await TutorModel.updateMany(
        {
          _id: { $in: tutorIds },
          isActive: true,
          isDeleted: { $ne: true }
        },
        {
          $set: {
            'status.current': updates.status,
            'status.reviewedAt': new Date(),
            ...(updates.approvedBy && {
              'status.lastApproved': new Date(),
              'status.lastApprovedBy': updates.approvedBy
            }),
            ...(updates.rejectionReason && {
              'status.rejectionReason': updates.rejectionReason
            }),
            // Move pending to approved if approving
            ...(updates.status === 'approved' && {
              approved: { $ifNull: ['$pending', '$approved'] },
              pending: null,
              'status.rejectionReason': undefined
            })
          }
        },
        { session }
      );

      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    }
  }

  static async getDashboardStats(filters?: TutorAnalyticsFilter) {
    const matchStage: any = {
      isDeleted: { $ne: true }
    };

    if (filters) {
      if (filters.dateFrom || filters.dateTo) {
        matchStage.createdAt = {};
        if (filters.dateFrom) matchStage.createdAt.$gte = filters.dateFrom;
        if (filters.dateTo) matchStage.createdAt.$lte = filters.dateTo;
      }
      if (filters.status) matchStage['status.current'] = filters.status;
      if (filters.city) matchStage['approved.location.city'] = filters.city;
      if (filters.subject) {
        matchStage['approved.subjects.subjectId'] = new mongoose.Types.ObjectId(filters.subject);
      }
    }

    const stats = await TutorModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ['$status.current', 'pending'] }, 1, 0] }
          },
          approved: {
            $sum: { $cond: [{ $eq: ['$status.current', 'approved'] }, 1, 0] }
          },
          rejected: {
            $sum: { $cond: [{ $eq: ['$status.current', 'rejected'] }, 1, 0] }
          },
          suspended: {
            $sum: { $cond: [{ $eq: ['$status.current', 'suspended'] }, 1, 0] }
          },
          verified: {
            $sum: { $cond: ['$isVerified', 1, 0] }
          },
          featured: {
            $sum: { $cond: ['$isFeatured', 1, 0] }
          },
          totalRating: { $sum: '$rating.average' },
          ratingCount: { $sum: '$rating.count' }
        }
      }
    ]);

    const [result] = stats || [{}];

    // Get new tutors this month
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const newThisMonth = await TutorModel.countDocuments({
      ...matchStage,
      createdAt: { $gte: thisMonth }
    });

    return {
      total: result.total || 0,
      pending: result.pending || 0,
      approved: result.approved || 0,
      rejected: result.rejected || 0,
      suspended: result.suspended || 0,
      verified: result.verified || 0,
      featured: result.featured || 0,
      newThisMonth,
      averageRating: result.ratingCount > 0
        ? Math.round((result.totalRating / result.ratingCount) * 10) / 10
        : 0
    };
  }
}
```

#### 1.3 Update Service Layer
**File**: `dataservice/src/services/tutor.service.ts` (Update existing)

```typescript
export class TutorService {
  // Admin-specific methods
  static async getPendingApplications(options: any) {
    return await TutorQueries.getPendingApplications(options);
  }

  static async approveTutor(tutorId: string, approvedBy: string) {
    return await TutorModel.findByIdAndUpdate(
      tutorId,
      {
        'status.current': 'approved',
        'status.lastApproved': new Date(),
        'status.lastApprovedBy': approvedBy,
        'status.reviewedAt': new Date(),
        // Move pending to approved if exists
        $setOnInsert: {
          approved: { $ifNull: ['$pending', '$approved'] },
          pending: null
        },
        $unset: {
          'status.rejectionReason': 1
        }
      },
      { new: true, runValidators: true }
    );
  }

  static async rejectTutor(tutorId: string, reason: string, rejectedBy: string) {
    return await TutorModel.findByIdAndUpdate(
      tutorId,
      {
        'status.current': 'rejected',
        'status.reviewedAt': new Date(),
        'status.rejectionReason': reason,
        'status.lastApprovedBy': rejectedBy
      },
      { new: true, runValidators: true }
    );
  }

  static async suspendTutor(tutorId: string, reason: string, suspendedBy: string) {
    return await TutorModel.findByIdAndUpdate(
      tutorId,
      {
        'status.current': 'suspended',
        'status.reviewedAt': new Date(),
        'status.rejectionReason': reason,
        'status.lastApprovedBy': suspendedBy,
        isActive: false
      },
      { new: true, runValidators: true }
    );
  }

  static async reactivateTutor(tutorId: string, reactivatedBy: string) {
    return await TutorModel.findByIdAndUpdate(
      tutorId,
      {
        'status.current': 'approved',
        'status.reviewedAt': new Date(),
        'status.lastApprovedBy': reactivatedBy,
        'status.rejectionReason': undefined,
        isActive: true
      },
      { new: true, runValidators: true }
    );
  }

  static async toggleVerification(tutorId: string) {
    const tutor = await TutorModel.findById(tutorId);
    if (!tutor) throw new Error('Tutor not found');

    return await TutorModel.findByIdAndUpdate(
      tutorId,
      { isVerified: !tutor.isVerified },
      { new: true }
    );
  }

  static async toggleFeatured(tutorId: string) {
    const tutor = await TutorModel.findById(tutorId);
    if (!tutor) throw new Error('Tutor not found');

    return await TutorModel.findByIdAndUpdate(
      tutorId,
      { isFeatured: !tutor.isFeatured },
      { new: true }
    );
  }

  static async bulkOperation(data: BulkOperationRequest, adminId: string): Promise<BulkOperationResult> {
    const jobId = `bulk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Start background job
    processTutorsBulkOperation(jobId, data, adminId);

    return {
      success: 0,
      failed: 0,
      errors: [],
      jobId
    };
  }

  static async getDashboardStats(filters?: TutorAnalyticsFilter) {
    return await TutorQueries.getDashboardStats(filters);
  }

  static async exportTutors(filters: any, format: 'csv' | 'excel' = 'csv') {
    const tutors = await TutorQueries.searchTutors({
      ...filters,
      limit: 10000 // Large limit for export
    });

    // Transform data for export
    const exportData = tutors.tutors.map(tutor => ({
      ID: tutor._id,
      Name: tutor.approved?.basicInfo?.firstName + ' ' + tutor.approved?.basicInfo?.lastName,
      Email: tutor.approved?.contactDetails?.email,
      Phone: tutor.approved?.contactDetails?.phone,
      Status: tutor.status.current,
      Subjects: tutor.approved?.subjects?.map((s: any) => s.subjectId).join(', '),
      City: tutor.approved?.location?.city,
      Areas: tutor.approved?.location?.areas?.join(', '),
      Rating: tutor.rating.average,
      'Profile Views': tutor.analytics.profileViews,
      Connects: tutor.analytics.connects,
      'Hourly Rate': tutor.approved?.pricing?.oneToOne?.hourlyRate,
      Verified: tutor.isVerified ? 'Yes' : 'No',
      Featured: tutor.isFeatured ? 'Yes' : 'No',
      'Created At': tutor.createdAt
    }));

    return exportData;
  }
}
```

### Phase 2: Admin API Endpoints

#### 2.1 Core Tutor Management Routes
**File**: `admin/src/app/api/admin/tutors/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { TutorService } from '@educatedplanet/dataservice';
import { z } from 'zod';

const listQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
  query: z.string().optional(),
  status: z.enum(['pending', 'approved', 'rejected', 'suspended']).optional(),
  city: z.string().optional(),
  subjects: z.array(z.string()).optional(),
  minRating: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  isVerified: z.coerce.boolean().optional(),
  isFeatured: z.coerce.boolean().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = listQuerySchema.parse(Object.fromEntries(searchParams));

    const result = await TutorService.searchTutors(filters);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch tutors' },
      { status: 500 }
    );
  }
}

const updateTutorSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'suspended']).optional(),
  isVerified: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  approved: z.object({
    basicInfo: z.object({
      firstName: z.string(),
      lastName: z.string(),
      title: z.string(),
      shortDescription: z.string(),
      longDescription: z.string()
    }).optional()
  }).optional()
});

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { tutorId, ...updateData } = body;

    const validatedData = updateTutorSchema.parse(updateData);

    const tutor = await TutorService.updateById(tutorId, validatedData);

    return NextResponse.json({
      success: true,
      data: tutor
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update tutor' },
      { status: 500 }
    );
  }
}
```

#### 2.2 Approval Workflow Routes
**File**: `admin/src/app/api/admin/tutors/pending/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { TutorService } from '@educatedplanet/dataservice';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') || 'status.submittedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const result = await TutorService.getPendingApplications({
      page,
      limit,
      sortBy,
      sortOrder: sortOrder as 'asc' | 'desc'
    });

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pending applications' },
      { status: 500 }
    );
  }
}
```

**File**: `admin/src/app/api/admin/tutors/[id]/approve/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { TutorService } from '@educatedplanet/dataservice';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { approvedBy } = await request.json();

    const tutor = await TutorService.approveTutor(params.id, approvedBy);

    // TODO: Send approval email to tutor

    return NextResponse.json({
      success: true,
      data: tutor,
      message: 'Tutor approved successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to approve tutor' },
      { status: 500 }
    );
  }
}
```

#### 2.3 Bulk Operations Routes
**File**: `admin/src/app/api/admin/tutors/bulk-approve/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { TutorService } from '@educatedplanet/dataservice';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tutorIds, notifyTutors = true } = body;

    const result = await TutorService.bulkOperation({
      tutorIds,
      operation: 'approve',
      notifyTutors
    }, request.user.id);

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Bulk approval started'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to start bulk approval' },
      { status: 500 }
    );
  }
}
```

#### 2.4 Analytics Routes
**File**: `admin/src/app/api/admin/tutors/analytics/dashboard/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { TutorService } from '@educatedplanet/dataservice';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom')) : undefined;
    const dateTo = searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')) : undefined;
    const status = searchParams.get('status') as any;
    const city = searchParams.get('city') || undefined;
    const subject = searchParams.get('subject') || undefined;

    const stats = await TutorService.getDashboardStats({
      dateFrom,
      dateTo,
      status,
      city,
      subject
    });

    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
```

### Phase 3: Background Job System

#### 3.1 Job Queue Implementation
**File**: `dataservice/src/jobs/tutor-bulk-operations.ts`

```typescript
interface BulkJob {
  id: string;
  type: 'approve' | 'reject' | 'suspend' | 'delete' | 'feature' | 'unfeature';
  tutorIds: string[];
  adminId: string;
  reason?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: {
    total: number;
    completed: number;
    failed: number;
  };
  errors: Array<{
    tutorId: string;
    error: string;
  }>;
  createdAt: Date;
  completedAt?: Date;
}

class BulkJobQueue {
  private jobs = new Map<string, BulkJob>();

  async addJob(jobData: Omit<BulkJob, 'id' | 'status' | 'progress' | 'errors' | 'createdAt'>): Promise<string> {
    const job: BulkJob = {
      id: `bulk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...jobData,
      status: 'pending',
      progress: {
        total: jobData.tutorIds.length,
        completed: 0,
        failed: 0
      },
      errors: [],
      createdAt: new Date()
    };

    this.jobs.set(job.id, job);

    // Process job asynchronously
    this.processJob(job.id);

    return job.id;
  }

  async getJobStatus(jobId: string): Promise<BulkJob | null> {
    return this.jobs.get(jobId) || null;
  }

  private async processJob(jobId: string) {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.status = 'processing';

    for (const tutorId of job.tutorIds) {
      try {
        // Process based on job type
        switch (job.type) {
          case 'approve':
            await TutorService.approveTutor(tutorId, job.adminId);
            break;
          case 'reject':
            await TutorService.rejectTutor(tutorId, job.reason || 'Rejected', job.adminId);
            break;
          case 'suspend':
            await TutorService.suspendTutor(tutorId, job.reason || 'Suspended', job.adminId);
            break;
          // Add other cases as needed
        }

        job.progress.completed++;
      } catch (error) {
        job.progress.failed++;
        job.errors.push({
          tutorId,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Update job status
      this.jobs.set(jobId, job);
    }

    job.status = 'completed';
    job.completedAt = new Date();
    this.jobs.set(jobId, job);
  }
}

export const bulkJobQueue = new BulkJobQueue();
```

### Phase 4: Implementation Checklist

#### Files to Create:
- [ ] `models/src/tutor/admin.types.ts` - Admin-specific type definitions
- [ ] `dataservice/src/queries/tutor.queries.ts` - Query layer
- [ ] `admin/src/app/api/admin/tutors/` - API route handlers
  - [ ] `route.ts` - List/update tutors
  - [ ] `[id]/route.ts` - Get/update single tutor
  - [ ] `[id]/delete/route.ts` - Soft delete
  - [ ] `[id]/verify/route.ts` - Toggle verification
  - [ ] `[id]/feature/route.ts` - Toggle featured
  - [ ] `[id]/approve/route.ts` - Approve tutor
  - [ ] `[id]/reject/route.ts` - Reject tutor
  - [ ] `[id]/suspend/route.ts` - Suspend tutor
  - [ ] `[id]/reactivate/route.ts` - Reactivate tutor
  - [ ] `pending/route.ts` - Pending applications list
  - [ ] `pending-changes/route.ts` - View pending changes
  - [ ] `bulk-approve/route.ts` - Bulk approve
  - [ ] `bulk-reject/route.ts` - Bulk reject
  - [ ] `bulk-suspend/route.ts` - Bulk suspend
  - [ ] `bulk-delete/route.ts` - Bulk delete
  - [ ] `bulk-featured/route.ts` - Bulk feature/unfeature
  - [ ] `bulk-status/[jobId]/route.ts` - Check bulk job status
  - [ ] `analytics/dashboard/route.ts` - Dashboard stats
  - [ ] `analytics/queue/route.ts` - Approval queue metrics
  - [ ] `analytics/export/route.ts` - Export data
  - [ ] `export/route.ts` - Export tutors
- [ ] `dataservice/src/services/admin-analytics.service.ts` - Analytics service
- [ ] `dataservice/src/jobs/tutor-bulk-operations.ts` - Background job system

#### Files to Update:
- [ ] `dataservice/src/services/tutor.service.ts` - Add admin methods
- [ ] `admin/src/lib/tutor-actions.ts` - Server actions for forms
- [ ] `admin/src/components/tutors/` - Tutor management components

#### Database Operations:
- [ ] Create indexes for admin queries (already implemented)
- [ ] Add audit logging collection
- [ ] Set up job queue storage

### Phase 5: Key Query Examples

```typescript
// Get pending approval queue with pagination
const pendingTutors = await TutorModel.find({
  'status.current': 'pending',
  isActive: true,
  isDeleted: { $ne: true }
})
.sort({ 'status.submittedAt': -1 })
.skip((page - 1) * limit)
.limit(limit)
.populate('userId', 'name email phone');

// Bulk approve with transaction
const session = await mongoose.startSession();
await session.withTransaction(async () => {
  await TutorModel.updateMany(
    { _id: { $in: tutorIds } },
    {
      $set: {
        'status.current': 'approved',
        'status.lastApproved': new Date(),
        'status.lastApprovedBy': adminId,
        approved: { $ifNull: ['$pending', '$approved'] },
        pending: null
      },
      $unset: { 'status.rejectionReason': 1 }
    },
    { session }
  );
});

// Search with geospatial support
const nearbyTutors = await TutorModel.find({
  'status.current': 'approved',
  isActive: true,
  'approved.location.coordinates': {
    $near: {
      $geometry: { type: 'Point', coordinates: [longitude, latitude] },
      $maxDistance: 10000 // 10km
    }
  }
});

// Analytics aggregation pipeline
const monthlyStats = await TutorModel.aggregate([
  {
    $match: {
      isDeleted: { $ne: true },
      createdAt: { $gte: new Date(year, month, 1), $lt: new Date(year, month + 1, 1) }
    }
  },
  {
    $group: {
      _id: {
        status: '$status.current',
        day: { $dayOfMonth: '$createdAt' }
      },
      count: { $sum: 1 }
    }
  },
  {
    $group: {
      _id: '$_id.status',
      dailyCounts: {
        $push: {
          day: '$_id.day',
          count: '$count'
        }
      },
      total: { $sum: '$count' }
    }
  }
]);
```

### Security Considerations

1. **Authentication & Authorization**
   - All endpoints require admin authentication
   - Role-based access control
   - JWT token validation

2. **Input Validation**
   - Zod schemas for all inputs
   - SQL/NoSQL injection prevention
   - XSS protection

3. **Audit Logging**
   - Log all admin actions
   - Track who approved/rejected tutors
   - Store IP addresses and timestamps

4. **Rate Limiting**
   - Prevent bulk operation abuse
   - Limit export requests
   - API rate limiting

### Performance Optimizations

1. **Database Optimization**
   - Use proper indexes (already implemented)
   - Pagination for large datasets
   - Aggregation pipelines for analytics

2. **Caching Strategy**
   - Redis cache for dashboard stats
   - Cache frequently accessed data
   - CDN for exported files

3. **Background Processing**
   - Bulk operations in background
   - Email notifications async
   - Report generation jobs

This comprehensive plan provides all the backend services needed for efficient tutor management in the admin panel, fully leveraging the sophisticated MongoDB schema structure.