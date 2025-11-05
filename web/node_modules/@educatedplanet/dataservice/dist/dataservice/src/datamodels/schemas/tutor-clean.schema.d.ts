import mongoose, { Document } from 'mongoose';
import { Tutor } from '@educatedplanet/models';
/**
 * Tutor document interface
 */
export interface ITutorDocument extends Omit<Tutor, 'id'>, Document {
    userId?: mongoose.Types.ObjectId;
    status: 'pending' | 'approved' | 'rejected' | 'suspended';
    isFeatured: boolean;
    verification: {
        isApproved: boolean;
        approvedBy?: mongoose.Types.ObjectId;
        approvedAt?: Date;
        rejectedAt?: Date;
        rejectionReason?: string;
    };
    analytics: {
        profileViews: number;
        contactViews: number;
        connects: number;
    };
    isActive: boolean;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
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