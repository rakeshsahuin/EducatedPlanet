import mongoose from 'mongoose';
import { ITutorDocument } from '../schemas/tutor-clean.schema';
/**
 * Tutor model bound to the database connection
 */
export declare const TutorModel: mongoose.Model<ITutorDocument, {}, {}, {}, mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export declare const TutorQueries: {
    /**
     * Find tutor by ID
     */
    findById: (id: string) => mongoose.Query<mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, ITutorDocument, "findOne", {}>;
    /**
     * Find tutor by user ID
     */
    findByUserId: (userId: string) => mongoose.Query<mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, ITutorDocument, "findOne", {}>;
    /**
     * Find approved tutors
     */
    findApproved: () => mongoose.Query<(mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[], mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, ITutorDocument, "find", {}>;
    /**
     * Find featured tutors
     */
    findFeatured: () => mongoose.Query<(mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[], mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, ITutorDocument, "find", {}>;
    /**
     * Search tutors with filters
     */
    search: (filters: {
        subjects?: string[];
        areas?: string[];
        teachingModes?: string[];
        minPrice?: number;
        maxPrice?: number;
        minRating?: number;
        query?: string;
        page?: number;
        limit?: number;
    }) => mongoose.Query<(mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[], mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, ITutorDocument, "find", {}>;
    /**
     * Find tutors by location with geo search
     */
    findByLocation: (coordinates: [number, number], maxDistance?: number) => mongoose.Query<(mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[], mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, ITutorDocument, "find", {}>;
    /**
     * Find tutors by subjects
     */
    findBySubjects: (subjects: string[]) => mongoose.Query<(mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[], mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, ITutorDocument, "find", {}>;
    /**
     * Find tutors by areas
     */
    findByAreas: (areas: string[]) => mongoose.Query<(mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[], mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, ITutorDocument, "find", {}>;
    /**
     * Get tutor count by status
     */
    getCountByStatus: () => mongoose.Aggregate<any[]>;
    /**
     * Get top rated tutors
     */
    getTopRated: (limit?: number) => mongoose.Query<(mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[], mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, ITutorDocument, "find", {}>;
    /**
     * Get recently added tutors
     */
    getRecent: (limit?: number) => mongoose.Query<(mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[], mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, ITutorDocument, "find", {}>;
    /**
     * Create new tutor profile
     */
    create: (tutorData: Partial<ITutorDocument>) => Promise<mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    /**
     * Update tutor by ID
     */
    updateById: (id: string, updateData: Partial<ITutorDocument>) => mongoose.Query<mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, ITutorDocument, "findOneAndUpdate", {}>;
    /**
     * Update tutor rating
     */
    updateRating: (tutorId: string) => Promise<mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    /**
     * Increment profile views
     */
    incrementProfileViews: (tutorId: string) => mongoose.Query<mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, ITutorDocument, "findOneAndUpdate", {}>;
    /**
     * Increment contact views
     */
    incrementContactViews: (tutorId: string) => mongoose.Query<mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, ITutorDocument, "findOneAndUpdate", {}>;
    /**
     * Increment connects
     */
    incrementConnects: (tutorId: string) => mongoose.Query<mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, ITutorDocument, "findOneAndUpdate", {}>;
    /**
     * Approve tutor
     */
    approveTutor: (tutorId: string, approvedBy: string) => mongoose.Query<mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, ITutorDocument, "findOneAndUpdate", {}>;
    /**
     * Reject tutor
     */
    rejectTutor: (tutorId: string, rejectionReason: string) => mongoose.Query<mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, ITutorDocument, "findOneAndUpdate", {}>;
    /**
     * Soft delete tutor (deactivate)
     */
    softDelete: (tutorId: string) => mongoose.Query<mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, mongoose.Document<unknown, {}, ITutorDocument, {}, {}> & ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, ITutorDocument, "findOneAndUpdate", {}>;
};
export default TutorModel;
//# sourceMappingURL=tutor.model.d.ts.map