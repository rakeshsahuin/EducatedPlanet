import mongoose, { Document } from 'mongoose';
import { Review } from '@educatedplanet/models';
/**
 * Review document interface
 */
export interface IReviewDocument extends Omit<Review, 'id'>, Document {
    tutorId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    isApproved: boolean;
    isPublic: boolean;
    isHidden: boolean;
    helpfulCount: number;
    reportedCount: number;
    moderatedBy?: mongoose.Types.ObjectId;
    moderatedAt?: Date;
    moderationNotes?: string;
    tutorResponse?: {
        content: string;
        respondedAt: Date;
        isPublic: boolean;
    };
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Review schema definition
 */
declare const reviewSchema: mongoose.Schema<IReviewDocument, mongoose.Model<IReviewDocument, any, any, any, mongoose.Document<unknown, any, IReviewDocument, any, {}> & IReviewDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IReviewDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<IReviewDocument>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<IReviewDocument> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export { reviewSchema };
//# sourceMappingURL=review-clean.schema.d.ts.map