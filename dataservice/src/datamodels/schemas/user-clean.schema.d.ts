import mongoose, { Document } from 'mongoose';
import { User } from '@educatedplanet/models';
/**
 * User document interface
 */
export interface IUserDocument extends Omit<User, 'id'>, Document {
    password?: string;
    verificationOTP?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
    lastLoginAt?: Date;
    loginAttempts?: number;
    lockUntil?: Date;
    isActive: boolean;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * User schema definition
 */
declare const userSchema: mongoose.Schema<IUserDocument, mongoose.Model<IUserDocument, any, any, any, mongoose.Document<unknown, any, IUserDocument, any, {}> & IUserDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IUserDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<IUserDocument>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<IUserDocument> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export { userSchema };
//# sourceMappingURL=user-clean.schema.d.ts.map