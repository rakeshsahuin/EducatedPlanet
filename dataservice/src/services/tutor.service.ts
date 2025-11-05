import { Types } from 'mongoose';
import {
  Tutor,
  CreateTutorInput,
  UpdateTutorInput,
  TutorSearchParams
} from '@educatedplanet/models';
import { ITutorDocument, TutorQueries, TutorModel } from '../datamodels';

/**
 * Tutor service for handling tutor-related business logic
 */
export class TutorService {
  /**
   * Transform MongoDB document to Tutor interface
   */
  private transformTutorDocument(tutorDoc: ITutorDocument): Tutor {
    return {
      id: tutorDoc._id.toString(),
      name: tutorDoc.name,
      title: tutorDoc.title,
      photo: tutorDoc.photo,
      subjects: tutorDoc.subjects,
      teachingModes: tutorDoc.teachingModes,
      location: tutorDoc.location,
      experience: tutorDoc.experience,
      price: tutorDoc.price,
      rating: tutorDoc.rating || { average: 0, count: 0 },
      isVerified: tutorDoc.verification?.isApproved || false,
      createdAt: tutorDoc.createdAt,
      updatedAt: tutorDoc.updatedAt
    };
  }
  /**
   * Create a new tutor profile
   */
  public async createTutor(tutorData: CreateTutorInput): Promise<Tutor> {
    // Validate input
    this.validateTutorData(tutorData);

    // Check if user already has a tutor profile
    if (tutorData.userId) {
      const existingTutor = await TutorQueries.findByUserId(tutorData.userId);
      if (existingTutor) {
        throw new Error('User already has a tutor profile');
      }
    }

    // Create tutor profile
    const tutorDoc = await TutorQueries.create({
      ...tutorData,
      userId: tutorData.userId ? new Types.ObjectId(tutorData.userId) : undefined,
      status: 'pending', // New profiles need approval
      isActive: true,
      verification: {
        isApproved: false
      },
      analytics: {
        profileViews: 0,
        contactViews: 0,
        connects: 0
      }
    });

    return this.transformTutorDocument(tutorDoc);
  }

  /**
   * Find tutor by ID
   */
  public async findTutorById(id: string): Promise<Tutor | null> {
    const tutorDoc = await TutorQueries.findById(id);
    return tutorDoc ? this.transformTutorDocument(tutorDoc) : null;
  }

  /**
   * Search tutors with filters
   */
  public async searchTutors(params: TutorSearchParams): Promise<{
    tutors: Tutor[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 20 } = params;
    const searchResult = await TutorQueries.search({
      ...params,
      page,
      limit
    });

    const tutors = searchResult.map(doc => this.transformTutorDocument(doc));

    return {
      tutors,
      total: searchResult.length, // This would need adjustment for actual pagination
      page,
      totalPages: Math.ceil(searchResult.length / limit)
    };
  }

  /**
   * Get approved tutors
   */
  public async getApprovedTutors(page = 1, limit = 20): Promise<Tutor[]> {
    const tutorDocs = await TutorQueries.findApproved();
    return tutorDocs.map(doc => this.transformTutorDocument(doc));
  }

  /**
   * Get featured tutors
   */
  public async getFeaturedTutors(limit = 10): Promise<Tutor[]> {
    const tutorDocs = await TutorQueries.findFeatured();
    return tutorDocs.map(doc => this.transformTutorDocument(doc));
  }

  /**
   * Find tutors by subject
   */
  public async findTutorsBySubject(subject: string, limit = 20): Promise<Tutor[]> {
    const tutorDocs = await TutorQueries.findBySubjects([subject]);
    return tutorDocs.map(doc => this.transformTutorDocument(doc));
  }

  /**
   * Find tutors by location
   */
  public async findTutorsByLocation(city: string, areas?: string[]): Promise<Tutor[]> {
    // For now, implement a simple location search by areas
    // In a real implementation, this would use geo coordinates
    const tutorDocs = areas && areas.length > 0
      ? await TutorQueries.findByAreas(areas)
      : await TutorQueries.findApproved();
    return tutorDocs.map((doc: any) => this.transformTutorDocument(doc));
  }

  /**
   * Find tutors by areas
   */
  public async findTutorsByAreas(areas: string[]): Promise<Tutor[]> {
    const tutorDocs = await TutorQueries.findByAreas(areas);
    return tutorDocs.map(doc => this.transformTutorDocument(doc));
  }

  /**
   * Get top-rated tutors
   */
  public async getTopRatedTutors(limit = 10): Promise<Tutor[]> {
    const tutorDocs = await TutorQueries.getTopRated(limit);
    return tutorDocs.map(doc => this.transformTutorDocument(doc));
  }

  /**
   * Get recently added tutors
   */
  public async getRecentTutors(limit = 10): Promise<Tutor[]> {
    const tutorDocs = await TutorQueries.getRecent(limit);
    return tutorDocs.map(doc => this.transformTutorDocument(doc));
  }

  /**
   * Update tutor by ID
   */
  public async updateTutor(id: string, updateData: UpdateTutorInput): Promise<Tutor | null> {
    // Validate update data
    if (updateData.price) {
      if (updateData.price.min && updateData.price.min < 0) {
        throw new Error('Minimum price cannot be negative');
      }
      if (updateData.price.max && updateData.price.max < 0) {
        throw new Error('Maximum price cannot be negative');
      }
      if (updateData.price.min && updateData.price.max && updateData.price.min > updateData.price.max) {
        throw new Error('Minimum price cannot be greater than maximum price');
      }
    }

    // Transform UpdateTutorInput to ITutorDocument format
    const transformedUpdateData: any = { ...updateData };

    const updatedDoc = await TutorQueries.updateById(id, transformedUpdateData);
    return updatedDoc ? this.transformTutorDocument(updatedDoc) : null;
  }

  /**
   * Approve tutor (admin function)
   */
  public async approveTutor(id: string, approvedBy: string): Promise<Tutor | null> {
    const updatedDoc = await TutorQueries.approveTutor(id, approvedBy);
    return updatedDoc ? this.transformTutorDocument(updatedDoc) : null;
  }

  /**
   * Reject tutor (admin function)
   */
  public async rejectTutor(id: string, rejectionReason: string): Promise<Tutor | null> {
    const updatedDoc = await TutorQueries.rejectTutor(id, rejectionReason);
    return updatedDoc ? this.transformTutorDocument(updatedDoc) : null;
  }

  /**
   * Get pending tutor applications (admin function)
   */
  public async getPendingApplications(page = 1, limit = 20): Promise<Tutor[]> {
    // Find tutors with pending status using direct model query
    const tutorDocs = await TutorModel.find({
      status: 'pending',
      isActive: true
    }).populate('userId');
    return tutorDocs.map((doc: any) => this.transformTutorDocument(doc));
  }

  /**
   * Increment profile views
   */
  public async incrementProfileViews(id: string): Promise<ITutorDocument | null> {
    return await TutorQueries.incrementProfileViews(id);
  }

  /**
   * Increment contact views
   */
  public async incrementContactViews(id: string): Promise<ITutorDocument | null> {
    return await TutorQueries.incrementContactViews(id);
  }

  /**
   * Increment connects (when a user contacts a tutor)
   */
  public async incrementConnects(id: string): Promise<ITutorDocument | null> {
    return await TutorQueries.incrementConnects(id);
  }

  /**
   * Update tutor rating (typically called after review updates)
   */
  public async updateTutorRating(id: string): Promise<ITutorDocument | null> {
    return await TutorQueries.updateRating(id);
  }

  /**
   * Delete tutor profile (soft delete)
   */
  public async deleteTutor(id: string): Promise<ITutorDocument | null> {
    return await TutorQueries.softDelete(id);
  }

  /**
   * Get tutor statistics (admin function)
   */
  public async getTutorStats(): Promise<Array<{
    _id: string;
    count: number;
  }>> {
    return await TutorQueries.getCountByStatus();
  }

  /**
   * Validate tutor data
   */
  private validateTutorData(tutorData: CreateTutorInput): void {
    if (!tutorData.name || tutorData.name.trim().length === 0) {
      throw new Error('Name is required');
    }

    if (tutorData.name.length > 100) {
      throw new Error('Name cannot exceed 100 characters');
    }

    if (!tutorData.title || tutorData.title.trim().length === 0) {
      throw new Error('Title is required');
    }

    if (tutorData.title.length > 200) {
      throw new Error('Title cannot exceed 200 characters');
    }

    if (!tutorData.photo || tutorData.photo.trim().length === 0) {
      throw new Error('Photo is required');
    }

    if (!tutorData.subjects || tutorData.subjects.length === 0) {
      throw new Error('At least one subject is required');
    }

    if (!tutorData.teachingModes || tutorData.teachingModes.length === 0) {
      throw new Error('At least one teaching mode is required');
    }

    if (!tutorData.experience || tutorData.experience.trim().length === 0) {
      throw new Error('Experience is required');
    }

    if (!tutorData.location) {
      throw new Error('Location is required');
    }

    if (!tutorData.location.city || tutorData.location.city.trim().length === 0) {
      throw new Error('City is required');
    }

    if (!tutorData.price) {
      throw new Error('Price information is required');
    }

    if (tutorData.price.min < 0 || tutorData.price.max < 0) {
      throw new Error('Price cannot be negative');
    }

    if (tutorData.price.min > tutorData.price.max) {
      throw new Error('Minimum price cannot be greater than maximum price');
    }
  }
}

// Export singleton instance
export const tutorService = new TutorService();