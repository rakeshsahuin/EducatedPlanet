import mongoose from 'mongoose';
import { IUserDocument } from '../schemas/user-clean.schema';

/**
 * User model
 */
export const UserModel = mongoose.model<IUserDocument>('User');

// Export frequently used query methods
export const UserQueries = {
  /**
   * Find user by ID
   */
  findById: (id: string) => UserModel.findById(id),

  /**
   * Find user by email
   */
  findByEmail: (email: string) => UserModel.findOne({ email }),

  /**
   * Find user by phone
   */
  findByPhone: (phone: string) => UserModel.findOne({ phone }),

  /**
   * Find users by role
   */
  findByRole: (role: string) => UserModel.find({ role, isActive: true, isDeleted: { $ne: true } }),

  /**
   * Find verified users
   */
  findVerified: () => UserModel.find({ isVerified: true, isActive: true, isDeleted: { $ne: true } }),

  /**
   * Search users by name
   */
  searchByName: (query: string) => UserModel.find({
    name: { $regex: query, $options: 'i' },
    isActive: true,
    isDeleted: { $ne: true }
  }),

  /**
   * Find active users
   */
  findActive: () => UserModel.find({ isActive: true, isDeleted: { $ne: true } }),

  /**
   * Count users by role
   */
  countByRole: (role: string) => UserModel.countDocuments({ role, isActive: true, isDeleted: { $ne: true } }),

  /**
   * Create new user
   */
  create: (userData: Partial<IUserDocument>) => UserModel.create(userData),

  /**
   * Update user by ID
   */
  updateById: (id: string, updateData: Partial<IUserDocument>) =>
    UserModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }),

  /**
   * Soft delete user
   */
  softDelete: (id: string) =>
    UserModel.findByIdAndUpdate(id, {
      isActive: false,
      isDeleted: true,
      deletedAt: new Date()
    }),

  /**
   * Get user stats
   */
  getStats: () => UserModel.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 }
      }
    }
  ])
};

export default UserModel;