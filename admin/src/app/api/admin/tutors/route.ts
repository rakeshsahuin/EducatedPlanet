import { NextRequest, NextResponse } from 'next/server';
import { AdminTutorService } from '@educatedplanet/dataservice';
import { z } from 'zod';
import { getAuthenticatedUser } from '@/lib/get-authenticated-user';

const listQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
  query: z.string().optional(),
  status: z.enum(['pending', 'approved', 'rejected', 'suspended']).optional(),
  city: z.string().optional(),
  subjects: z.array(z.string()).optional(),
  teachingModes: z.array(z.enum(['online', 'offline', 'both'])).optional(),
  minRating: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  isVerified: z.coerce.boolean().optional(),
  isFeatured: z.coerce.boolean().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional()
});

// GET /api/admin/tutors - List tutors with admin filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = listQuerySchema.parse(Object.fromEntries(searchParams));

    // Transform dates
    const transformedFilters = {
      ...filters,
      dateFrom: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
      dateTo: filters.dateTo ? new Date(filters.dateTo) : undefined
    };

    const result = await AdminTutorService.getTutorListItems(transformedFilters);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching tutors:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch tutors'
      },
      { status: 500 }
    );
  }
}

const updateTutorSchema = z.object({
  isVerified: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  // Don't allow updating approved data through this route
  // Use separate endpoints for approved data updates
});

const createTutorSchema = z.object({
  userId: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  title: z.string(),
  shortDescription: z.string(),
  longDescription: z.string(),
  subjects: z.array(z.any()),
  teachingModes: z.array(z.string()),
  location: z.any(),
  pricing: z.any(),
  experience: z.array(z.any()).optional(),
  education: z.array(z.any()).optional(),
  certifications: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  availability: z.object({
    weekdays: z.boolean(),
    weekends: z.boolean(),
    preferredTimes: z.array(z.string()),
  }),
  gallery: z.array(z.any()).optional(),
  resumeLink: z.string().optional(),
  socialLinks: z.object({
    linkedin: z.string().optional(),
    youtube: z.string().optional(),
    website: z.string().optional(),
    onlineCourses: z.string().optional(),
    twitter: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    github: z.string().optional(),
  }).optional(),
  bankDetails: z.object({
    accountNumber: z.string().optional(),
    ifsc: z.string().optional(),
    accountName: z.string().optional(),
  }).optional(),
  changeUserRole: z.boolean().optional(),
  photo: z.any().optional(),
});

// POST /api/admin/tutors - Create a new tutor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized'
        },
        { status: 401 }
      );
    }

    const validatedData = createTutorSchema.parse(body);

    // Check if we need to change user role
    if (validatedData.changeUserRole && validatedData.userId) {
      try {
        // Update user role to 'tutor'
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users/${validatedData.userId}/role`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'tutor' })
        });
      } catch (roleError) {
        console.error('Error updating user role:', roleError);
        // Still proceed with tutor creation but log the error
      }
    }

    // Create tutor with all the form data
    const tutor = await AdminTutorService.createTutor(
      validatedData,
      user.id
    );

    return NextResponse.json({
      success: true,
      data: tutor,
      message: 'Tutor created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating tutor:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create tutor'
      },
      { status: 400 }
    );
  }
}

// PUT /api/admin/tutors - Update multiple tutors
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized'
        },
        { status: 401 }
      );
    }

    if (Array.isArray(body)) {
      // Bulk update
      const results = await Promise.all(
        body.map(async (item) => {
          const validatedData = updateTutorSchema.parse(item);
          return await AdminTutorService.updateTutor(
            item.tutorId,
            validatedData,
            user.id
          );
        })
      );

      return NextResponse.json({
        success: true,
        data: results,
        message: `${results.length} tutors updated successfully`
      });
    } else {
      // Single update
      const validatedData = updateTutorSchema.parse(body);
      const tutor = await AdminTutorService.updateTutor(
        body.tutorId,
        validatedData,
        user.id
      );

      return NextResponse.json({
        success: true,
        data: tutor,
        message: 'Tutor updated successfully'
      });
    }
  } catch (error) {
    console.error('Error updating tutor:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update tutor'
      },
      { status: 500 }
    );
  }
}