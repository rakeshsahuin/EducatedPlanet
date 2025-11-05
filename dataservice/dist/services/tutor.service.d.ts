import { ITutorDocument } from '@educatedplanet/datamodels';
export interface CreateTutorInput {
    name: string;
    title: string;
    photo: string;
    subjects: string[];
    teachingModes: ('online' | 'offline' | 'both')[];
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
export interface UpdateTutorInput {
    name?: string;
    title?: string;
    photo?: string;
    subjects?: string[];
    teachingModes?: ('online' | 'offline' | 'both')[];
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
export interface TutorSearchParams {
    query?: string;
    subjects?: string[];
    areas?: string[];
    teachingModes?: ('online' | 'offline' | 'both')[];
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
 * Tutor service for handling tutor-related business logic
 */
export declare class TutorService {
    /**
     * Create a new tutor profile
     */
    createTutor(tutorData: CreateTutorInput): Promise<ITutorDocument>;
    /**
     * Find tutor by ID
     */
    findTutorById(id: string): Promise<ITutorDocument | null>;
    /**
     * Search tutors with filters
     */
    searchTutors(params: TutorSearchParams): Promise<{
        tutors: ITutorDocument[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    /**
     * Get approved tutors
     */
    getApprovedTutors(page?: number, limit?: number): Promise<ITutorDocument[]>;
    /**
     * Get featured tutors
     */
    getFeaturedTutors(limit?: number): Promise<ITutorDocument[]>;
    /**
     * Find tutors by subject
     */
    findTutorsBySubject(subject: string, limit?: number): Promise<ITutorDocument[]>;
    /**
     * Find tutors by location
     */
    findTutorsByLocation(city: string, areas?: string[]): Promise<ITutorDocument[]>;
    /**
     * Find tutors by areas
     */
    findTutorsByAreas(areas: string[]): Promise<ITutorDocument[]>;
    /**
     * Get top-rated tutors
     */
    getTopRatedTutors(limit?: number): Promise<ITutorDocument[]>;
    /**
     * Get recently added tutors
     */
    getRecentTutors(limit?: number): Promise<ITutorDocument[]>;
    /**
     * Update tutor by ID
     */
    updateTutor(id: string, updateData: UpdateTutorInput): Promise<ITutorDocument | null>;
    /**
     * Approve tutor (admin function)
     */
    approveTutor(id: string, approvedBy: string): Promise<ITutorDocument | null>;
    /**
     * Reject tutor (admin function)
     */
    rejectTutor(id: string, rejectionReason: string): Promise<ITutorDocument | null>;
    /**
     * Get pending tutor applications (admin function)
     */
    getPendingApplications(page?: number, limit?: number): Promise<ITutorDocument[]>;
    /**
     * Increment profile views
     */
    incrementProfileViews(id: string): Promise<ITutorDocument | null>;
    /**
     * Increment contact views
     */
    incrementContactViews(id: string): Promise<ITutorDocument | null>;
    /**
     * Increment connects (when a user contacts a tutor)
     */
    incrementConnects(id: string): Promise<ITutorDocument | null>;
    /**
     * Update tutor rating (typically called after review updates)
     */
    updateTutorRating(id: string): Promise<ITutorDocument | null>;
    /**
     * Delete tutor profile (soft delete)
     */
    deleteTutor(id: string): Promise<ITutorDocument | null>;
    /**
     * Get tutor statistics (admin function)
     */
    getTutorStats(): Promise<Array<{
        _id: string;
        count: number;
    }>>;
    /**
     * Validate tutor data
     */
    private validateTutorData;
}
export declare const tutorService: TutorService;
//# sourceMappingURL=tutor.service.d.ts.map