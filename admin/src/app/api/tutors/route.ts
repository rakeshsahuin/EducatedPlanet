/**
 * API Route for Tutors
 * Handles CRUD operations for tutors using dataservice
 */

import { NextRequest, NextResponse } from 'next/server';
import { tutorApi } from '@/lib/api';
import { CreateTutorInput } from '@educatedplanet/models';

// GET /api/tutors - Fetch tutors with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters to match TutorSearchParams
    const params = {
      query: searchParams.get('search') || undefined,
      subjects: searchParams.get('subjects') ? searchParams.get('subjects')!.split(',') : undefined,
      areas: searchParams.get('areas') ? searchParams.get('areas')!.split(',') : undefined,
      teachingModes: searchParams.get('teachingModes') ? searchParams.get('teachingModes')!.split(',') as any : undefined,
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
      minRating: searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined,
      city: searchParams.get('city') || undefined,
      isVerified: searchParams.get('verified') === 'true' ? true : searchParams.get('verified') === 'false' ? false : undefined,
      status: searchParams.get('status') as any || undefined,
      isFeatured: searchParams.get('featured') === 'true' ? true : searchParams.get('featured') === 'false' ? false : undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10
    };

    const result = await tutorApi.getTutors(params);

    return NextResponse.json({
      success: true,
      data: result.items,
      pagination: {
        page: result.pagination?.currentPage || 1,
        limit: params.limit,
        total: result.pagination?.totalItems || 0,
        totalPages: result.pagination?.totalPages || 0
      }
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

// POST /api/tutors - Create a new tutor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Transform input to match CreateTutorInput
    const tutorData: CreateTutorInput = {
      name: body.name,
      title: body.title || 'Tutor',
      photo: body.photo || '',
      subjects: Array.isArray(body.subjects) ? body.subjects : [body.subjectCategory || 'Mathematics'],
      teachingModes: body.teachingModes || ['offline'],
      location: {
        areas: Array.isArray(body.areas) ? body.areas : [body.areas || 'Patia'],
        city: body.city || 'Bhubaneswar'
      },
      experience: body.experience || '0 years',
      price: {
        min: body.hourlyRate || 500,
        max: body.hourlyRate ? body.hourlyRate * 1.5 : 750,
        currency: 'INR'
      },
      userId: body.userId
    };

    const newTutor = await tutorApi.createTutor(tutorData);

    return NextResponse.json({
      success: true,
      data: newTutor,
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