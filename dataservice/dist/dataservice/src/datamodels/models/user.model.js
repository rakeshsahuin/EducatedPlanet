"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserQueries = exports.UserModel = void 0;
exports.getUserModel = getUserModel;
/**
 * Get User model (lazy loaded to ensure database is initialized)
 */
function getUserModel() {
    const { databaseConnection } = require('../connections');
    return databaseConnection.getUserModel();
}
/**
 * User model bound to the database connection (for backward compatibility)
 * Note: This will throw if database is not initialized
 */
exports.UserModel = getUserModel();
// Export frequently used query methods
exports.UserQueries = {
    /**
     * Find user by ID
     */
    findById: (id) => exports.UserModel.findById(id),
    /**
     * Find user by email
     */
    findByEmail: (email) => exports.UserModel.findOne({ email }),
    /**
     * Find user by phone
     */
    findByPhone: (phone) => exports.UserModel.findOne({ phone }),
    /**
     * Find users by role
     */
    findByRole: (role) => exports.UserModel.find({ role, isActive: true, isDeleted: { $ne: true } }),
    /**
     * Find verified users
     */
    findVerified: () => exports.UserModel.find({ isVerified: true, isActive: true, isDeleted: { $ne: true } }),
    /**
     * Search users by name
     */
    searchByName: (query) => exports.UserModel.find({
        name: { $regex: query, $options: 'i' },
        isActive: true,
        isDeleted: { $ne: true }
    }),
    /**
     * Find active users
     */
    findActive: () => exports.UserModel.find({ isActive: true, isDeleted: { $ne: true } }),
    /**
     * Count users by role
     */
    countByRole: (role) => exports.UserModel.countDocuments({ role, isActive: true, isDeleted: { $ne: true } }),
    /**
     * Create new user
     */
    create: (userData) => exports.UserModel.create(userData),
    /**
     * Update user by ID
     */
    updateById: (id, updateData) => exports.UserModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }),
    /**
     * Soft delete user
     */
    softDelete: (id) => exports.UserModel.findByIdAndUpdate(id, {
        isActive: false,
        isDeleted: true,
        deletedAt: new Date()
    }),
    /**
     * Get user stats
     */
    getStats: () => exports.UserModel.aggregate([
        {
            $group: {
                _id: '$role',
                count: { $sum: 1 }
            }
        }
    ])
};
exports.default = exports.UserModel;
//# sourceMappingURL=user.model.js.map