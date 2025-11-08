import { IUserDocument } from '../schemas/user-clean.schema';
/**
 * Get User model (lazy loaded to ensure database is initialized)
 */
export declare function getUserModel(): any;
/**
 * User model bound to the database connection (for backward compatibility)
 * Note: This will throw if database is not initialized
 */
export declare const UserModel: any;
export declare const UserQueries: {
    /**
     * Find user by ID
     */
    findById: (id: string) => any;
    /**
     * Find user by email
     */
    findByEmail: (email: string) => any;
    /**
     * Find user by phone
     */
    findByPhone: (phone: string) => any;
    /**
     * Find users by role
     */
    findByRole: (role: string) => any;
    /**
     * Find verified users
     */
    findVerified: () => any;
    /**
     * Search users by name
     */
    searchByName: (query: string) => any;
    /**
     * Find active users
     */
    findActive: () => any;
    /**
     * Count users by role
     */
    countByRole: (role: string) => any;
    /**
     * Create new user
     */
    create: (userData: Partial<IUserDocument>) => any;
    /**
     * Update user by ID
     */
    updateById: (id: string, updateData: Partial<IUserDocument>) => any;
    /**
     * Soft delete user
     */
    softDelete: (id: string) => any;
    /**
     * Get user stats
     */
    getStats: () => any;
};
export default UserModel;
//# sourceMappingURL=user.model.d.ts.map