import mongoose from 'mongoose';
import { IUserDocument } from '../schemas/user-clean.schema';

/**
 * Get User model (lazy loaded to ensure database is initialized)
 */
export function getUserModel() {
  const { databaseConnection } = require('../connections');
  return databaseConnection.getUserModel();
}

/**
 * User model bound to the database connection (for backward compatibility)
 * Note: This will throw if database is not initialized
 */
export const UserModel = getUserModel();

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
  ]),

  /**
   * Get available users for tutor linking
   * Filters: active, verified, roles in ('user', 'tutor'), not already linked to a tutor
   */
  getAvailableUsersForTutor: async (search?: string, limit: number = 50) => {
    // Build the aggregation pipeline
    const pipeline: any[] = [
      // Stage 1: Match users based on criteria
      {
        $match: {
          isActive: true,
          isDeleted: { $ne: true },
          role: { $in: ['user', 'tutor'] },
          $or: [
            { isEmailVerified: true },
            { isPhoneVerified: true }
          ]
        }
      },
      // Stage 2: Left join with tutors to exclude already linked users
      {
        $lookup: {
          from: 'tutors',
          localField: '_id',
          foreignField: 'userId',
          as: 'tutorProfile'
        }
      },
      // Stage 3: Filter out users who already have a tutor profile
      {
        $match: {
          tutorProfile: { $size: 0 }
        }
      },
      // Stage 4: Search by name or email if search term provided
      ...(search ? [
        {
          $match: {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { email: { $regex: search, $options: 'i' } }
            ]
          }
        }
      ] : []),
      // Stage 5: Project only required fields
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          phone: 1,
          role: 1,
          isEmailVerified: 1,
          isPhoneVerified: 1,
          createdAt: 1
        }
      },
      // Stage 6: Sort by name
      {
        $sort: { name: 1 }
      },
      // Stage 7: Limit results
      {
        $limit: limit
      }
    ];

    return await UserModel.aggregate(pipeline);
  }
};

export default UserModel;