import { Tutor, CreateTutorInput, UpdateTutorInput, TutorSearchParams } from '@educatedplanet/models';
import { ITutorDocument } from '../datamodels';
/**
 * Tutor service for handling tutor-related business logic
 */
export declare class TutorService {
    private static initialized;
    private ensureInitialized;
    /**
     * Transform MongoDB document to Tutor interface
     */
    private transformTutorDocument;
    /**
     * Create a new tutor profile
     */
    createTutor(tutorData: CreateTutorInput): Promise<Tutor>;
    /**
     * Find tutor by ID
     */
    findTutorById(id: string): Promise<Tutor | null>;
    /**
     * Search tutors with filters
     */
    searchTutors(params: TutorSearchParams): Promise<{
        tutors: Tutor[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    /**
     * Get approved tutors
     */
    getApprovedTutors(page?: number, limit?: number): Promise<Tutor[]>;
    /**
     * Get featured tutors
     */
    getFeaturedTutors(limit?: number): Promise<Tutor[]>;
    /**
     * Find tutors by subject
     */
    findTutorsBySubject(subject: string, limit?: number): Promise<Tutor[]>;
    /**
     * Find tutors by location
     */
    findTutorsByLocation(city: string, areas?: string[]): Promise<Tutor[]>;
    /**
     * Find tutors by areas
     */
    findTutorsByAreas(areas: string[]): Promise<Tutor[]>;
    /**
     * Get top-rated tutors
     */
    getTopRatedTutors(limit?: number): Promise<Tutor[]>;
    /**
     * Get recently added tutors
     */
    getRecentTutors(limit?: number): Promise<Tutor[]>;
    /**
     * Update tutor by ID
     */
    updateTutor(id: string, updateData: UpdateTutorInput): Promise<Tutor | null>;
    /**
     * Approve tutor (admin function)
     */
    approveTutor(id: string, approvedBy: string): Promise<Tutor | null>;
    /**
     * Reject tutor (admin function)
     */
    rejectTutor(id: string, rejectionReason: string): Promise<Tutor | null>;
    /**
     * Get pending tutor applications (admin function)
     */
    getPendingApplications(page?: number, limit?: number): Promise<Tutor[]>;
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