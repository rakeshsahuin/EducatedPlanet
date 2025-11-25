import mongoose, { Document, Types } from 'mongoose';
/**
 * Interface for approved/pending tutor data
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
        areas: string[];
        city: string;
        state: string;
        coordinates?: {
            type: 'Point';
            coordinates: [number, number];
        };
        travelRadius?: number;
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
    teachingModes: ('online' | 'offline' | 'both')[];
    availability: {
        weekdays: 'weekdays' | 'weekends' | 'both' | 'flexible';
        flexible: boolean;
        responseTime?: number;
    };
}
/**
 * Tutor document interface
 */
export interface ITutorDocument extends Document {
    userId: Types.ObjectId;
    approved: TutorData;
    pending?: Partial<TutorData>;
    status: {
        current: 'pending' | 'approved' | 'rejected' | 'suspended';
        lastApproved?: Date;
        lastApprovedBy?: Types.ObjectId;
        submittedAt: Date;
        reviewedAt?: Date;
        rejectionReason?: string;
    };
    analytics: {
        profileViews: number;
        contactViews: number;
        connects: number;
        responseRate: number;
        lastActive?: Date;
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
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastModifiedBy?: Types.ObjectId;
}
/**
 * Tutor schema definition
 */
declare const tutorSchema: mongoose.Schema<ITutorDocument, mongoose.Model<ITutorDocument, any, any, any, mongoose.Document<unknown, any, ITutorDocument, any, {}> & ITutorDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, ITutorDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<ITutorDocument>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<ITutorDocument> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export { tutorSchema };
//# sourceMappingURL=tutor-clean.schema.d.ts.map