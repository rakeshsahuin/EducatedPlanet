import { hashPassword, verifyPassword } from '@educatedplanet/common';
import { IUserDocument } from '../datamodels/schemas/user-clean.schema';
import { databaseConnection } from '../datamodels/connections';

/**
 * User Repository with authentication-specific methods
 */
export class UserRepository {
  /**
   * Find user by email for authentication
   */
  async findByEmail(email: string): Promise<IUserDocument | null> {
    const UserModel = databaseConnection.getUserModel();
    return UserModel.findOne({
      email: email.toLowerCase().trim(),
      isActive: true,
      isDeleted: { $ne: true }
    });
  }

  /**
   * Create user with hashed password
   */
  async createAuthUser(userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<IUserDocument> {
    const UserModel = databaseConnection.getUserModel();
    const hashedPassword = await hashPassword(userData.password);

    return UserModel.create({
      ...userData,
      email: userData.email.toLowerCase().trim(),
      password: hashedPassword,
      isActive: true,
      isVerified: true, // Admin users are verified by default
      createdAt: new Date()
    });
  }

  /**
   * Validate user credentials for login
   */
  async validateCredentials(email: string, password: string): Promise<IUserDocument | null> {
    const user = await this.findByEmail(email);

    if (!user || !user.password) {
      return null;
    }

    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return null;
    }

    return user;
  }

  /**
   * Update user password
   */
  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const UserModel = databaseConnection.getUserModel();
    const hashedPassword = await hashPassword(newPassword);
    await UserModel.findByIdAndUpdate(userId, { password: hashedPassword });
  }

  /**
   * Check if user exists by email
   */
  async existsByEmail(email: string): Promise<boolean> {
    const UserModel = databaseConnection.getUserModel();
    const user = await UserModel.findOne({
      email: email.toLowerCase().trim(),
      isActive: true,
      isDeleted: { $ne: true }
    }).select('_id');

    return !!user;
  }
}

// Export singleton instance
export const userRepository = new UserRepository();