import mongoose from 'mongoose';
import { IUserDocument } from '../schemas/user-clean.schema';
/**
 * User model
 */
export declare const UserModel: mongoose.Model<IUserDocument, {}, {}, {}, mongoose.Document<unknown, {}, IUserDocument, {}, {}> & IUserDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export declare const UserQueries: {
    /**
     * Find user by ID
     */
    findById: (id: string) => mongoose.Query<mongoose.Document<unknown, {}, IUserDocument, {}, {}> & IUserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, mongoose.Document<unknown, {}, IUserDocument, {}, {}> & IUserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, IUserDocument, "findOne", {}>;
    /**
     * Find user by email
     */
    findByEmail: (email: string) => mongoose.Query<mongoose.Document<unknown, {}, IUserDocument, {}, {}> & IUserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, mongoose.Document<unknown, {}, IUserDocument, {}, {}> & IUserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, IUserDocument, "findOne", {}>;
    /**
     * Find user by phone
     */
    findByPhone: (phone: string) => mongoose.Query<mongoose.Document<unknown, {}, IUserDocument, {}, {}> & IUserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, mongoose.Document<unknown, {}, IUserDocument, {}, {}> & IUserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, IUserDocument, "findOne", {}>;
    /**
     * Find users by role
     */
    findByRole: (role: string) => mongoose.Query<(mongoose.Document<unknown, {}, IUserDocument, {}, {}> & IUserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[], mongoose.Document<unknown, {}, IUserDocument, {}, {}> & IUserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, IUserDocument, "find", {}>;
    /**
     * Find verified users
     */
    findVerified: () => mongoose.Query<(mongoose.Document<unknown, {}, IUserDocument, {}, {}> & IUserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[], mongoose.Document<unknown, {}, IUserDocument, {}, {}> & IUserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, IUserDocument, "find", {}>;
    /**
     * Search users by name
     */
    searchByName: (query: string) => mongoose.Query<(mongoose.Document<unknown, {}, IUserDocument, {}, {}> & IUserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[], mongoose.Document<unknown, {}, IUserDocument, {}, {}> & IUserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, IUserDocument, "find", {}>;
    /**
     * Find active users
     */
    findActive: () => mongoose.Query<(mongoose.Document<unknown, {}, IUserDocument, {}, {}> & IUserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[], mongoose.Document<unknown, {}, IUserDocument, {}, {}> & IUserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, IUserDocument, "find", {}>;
    /**
     * Count users by role
     */
    countByRole: (role: string) => mongoose.Query<number, mongoose.Document<unknown, {}, IUserDocument, {}, {}> & IUserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, IUserDocument, "countDocuments", {}>;
    /**
     * Create new user
     */
    create: (userData: Partial<IUserDocument>) => Promise<mongoose.Document<unknown, {}, IUserDocument, {}, {}> & IUserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    /**
     * Update user by ID
     */
    updateById: (id: string, updateData: Partial<IUserDocument>) => mongoose.Query<mongoose.Document<unknown, {}, IUserDocument, {}, {}> & IUserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, mongoose.Document<unknown, {}, IUserDocument, {}, {}> & IUserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, IUserDocument, "findOneAndUpdate", {}>;
    /**
     * Soft delete user
     */
    softDelete: (id: string) => mongoose.Query<mongoose.Document<unknown, {}, IUserDocument, {}, {}> & IUserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, mongoose.Document<unknown, {}, IUserDocument, {}, {}> & IUserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, IUserDocument, "findOneAndUpdate", {}>;
    /**
     * Get user stats
     */
    getStats: () => mongoose.Aggregate<any[]>;
};
export default UserModel;
//# sourceMappingURL=user.model.d.ts.map