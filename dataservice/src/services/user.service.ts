import bcrypt from 'bcryptjs';
import validator from 'validator';
import { Types } from 'mongoose';
import {
  User,
  CreateUserInput,
  UpdateUserInput,
  LoginInput,
  UserSearchParams
} from '@educatedplanet/models';
import { IUserDocument, UserQueries, UserModel, initializeDatabase } from '../datamodels';

/**
 * User service for handling user-related business logic
 */
export class UserService {
  private static initialized = false;

  private async ensureInitialized(): Promise<void> {
    if (!UserService.initialized) {
      await initializeDatabase();
      UserService.initialized = true;
    }
  }
  /**
   * Transform MongoDB document to User interface
   */
  private transformUserDocument(userDoc: IUserDocument): User {
    return {
      id: (userDoc._id as Types.ObjectId).toString(),
      name: userDoc.name,
      email: userDoc.email,
      phone: userDoc.phone,
      role: userDoc.role,
      avatar: userDoc.avatar,
      isEmailVerified: userDoc.isEmailVerified || false,
      isPhoneVerified: userDoc.isPhoneVerified || false,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt
    };
  }
  /**
   * Create a new user
   */
  public async createUser(userData: CreateUserInput): Promise<User> {
    // Ensure database is connected
    await this.ensureInitialized();
    
    // Validate input
    this.validateUserData(userData);

    // Check if user already exists
    const existingUserDoc = await this.findUserByEmailOrPhoneDocument(userData.email, userData.phone);
    if (existingUserDoc) {
      throw new Error('User with this email or phone already exists');
    }

    // Hash password if provided
    let hashedPassword: string | undefined;
    if (userData.password) {
      hashedPassword = await bcrypt.hash(userData.password, 12);
    }

    // Create user
    const userDoc = await UserQueries.create({
      ...userData,
      password: hashedPassword,
      isEmailVerified: !userData.email, // Auto-verify if no email
      isPhoneVerified: false // Requires OTP verification
    });

    return this.transformUserDocument(userDoc);
  }

  /**
   * Find user by ID
   */
  public async findUserById(id: string): Promise<User | null> {
    await this.ensureInitialized();
    
    if (!validator.isMongoId(id)) {
      throw new Error('Invalid user ID');
    }

    const userDoc = await UserQueries.findById(id);
    return userDoc ? this.transformUserDocument(userDoc) : null;
  }

  /**
   * Find user by email
   */
  public async findUserByEmail(email: string): Promise<User | null> {
    if (!validator.isEmail(email)) {
      throw new Error('Invalid email format');
    }

    const userDoc = await UserQueries.findByEmail(email);
    return userDoc ? this.transformUserDocument(userDoc) : null;
  }

  /**
   * Find user by phone
   */
  public async findUserByPhone(phone: string): Promise<User | null> {
    if (!phone || phone.trim().length === 0) {
      throw new Error('Phone number is required');
    }

    const userDoc = await UserQueries.findByPhone(phone);
    return userDoc ? this.transformUserDocument(userDoc) : null;
  }

  /**
   * Search users with filters
   */
  public async searchUsers(params: UserSearchParams): Promise<{
    users: User[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    await this.ensureInitialized();
    
    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    let query: any = {};

    if (params.query) {
      query.name = { $regex: params.query, $options: 'i' };
    }

    if (params.role) {
      query.role = params.role;
    }

    if (params.isEmailVerified !== undefined) {
      query.isEmailVerified = params.isEmailVerified;
    }

    if (params.isPhoneVerified !== undefined) {
      query.isPhoneVerified = params.isPhoneVerified;
    }

    if (params.isActive !== undefined) {
      query.isActive = params.isActive;
    }

    const [userDocs, total] = await Promise.all([
      UserModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      UserModel.countDocuments(query)
    ]);

    const users = userDocs.map(doc => this.transformUserDocument(doc));

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Update user by ID
   */
  public async updateUser(id: string, updateData: UpdateUserInput): Promise<User | null> {
    if (!validator.isMongoId(id)) {
      throw new Error('Invalid user ID');
    }

    // Validate update data
    if (updateData.email && !validator.isEmail(updateData.email)) {
      throw new Error('Invalid email format');
    }

    // Check for duplicate email/phone if updating
    if (updateData.email || updateData.phone) {
      const existingUserDoc = await this.findUserByEmailOrPhoneDocument(
        updateData.email,
        updateData.phone
      );

      if (existingUserDoc && (existingUserDoc._id as Types.ObjectId).toString() !== id) {
        throw new Error('User with this email or phone already exists');
      }
    }

    const updatedDoc = await UserQueries.updateById(id, updateData);
    return updatedDoc ? this.transformUserDocument(updatedDoc) : null;
  }

  /**
   * Delete user (soft delete)
   */
  public async deleteUser(id: string): Promise<User | null> {
    if (!validator.isMongoId(id)) {
      throw new Error('Invalid user ID');
    }

    const deletedDoc = await UserQueries.softDelete(id);
    return deletedDoc ? this.transformUserDocument(deletedDoc) : null;
  }

  /**
   * Verify user's email
   */
  public async verifyEmail(id: string): Promise<User | null> {
    if (!validator.isMongoId(id)) {
      throw new Error('Invalid user ID');
    }

    const updatedDoc = await UserQueries.updateById(id, { isEmailVerified: true });
    return updatedDoc ? this.transformUserDocument(updatedDoc) : null;
  }

  /**
   * Verify user's phone with OTP
   */
  public async verifyPhone(id: string, otp: string): Promise<User | null> {
    if (!validator.isMongoId(id)) {
      throw new Error('Invalid user ID');
    }

    const user = await UserQueries.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if OTP matches (you might want to add more sophisticated OTP validation)
    if (user.verificationOTP !== otp) {
      throw new Error('Invalid OTP');
    }

    const updatedDoc = await UserQueries.updateById(id, {
      isPhoneVerified: true,
      verificationOTP: undefined
    });
    return updatedDoc ? this.transformUserDocument(updatedDoc) : null;
  }

  /**
   * Change password
   */
  public async changePassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
    if (!validator.isMongoId(id)) {
      throw new Error('Invalid user ID');
    }

    if (!newPassword || newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    const user = await UserQueries.findById(id);
    if (!user || !user.password) {
      throw new Error('User not found or no password set');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash and update new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    await UserQueries.updateById(id, { password: hashedNewPassword });
  }

  /**
   * Authenticate user with email/phone and password
   */
  public async authenticateUser(credentials: LoginInput): Promise<User | null> {
    const { email, phone, password } = credentials;

    if (!email && !phone) {
      throw new Error('Email or phone number is required');
    }

    if (!password) {
      throw new Error('Password is required');
    }

    const userDoc = email
      ? await UserQueries.findByEmail(email)
      : await UserQueries.findByPhone(phone!);

    if (!userDoc || !userDoc.password) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, userDoc.password);
    if (!isPasswordValid) {
      return null;
    }

    // Update last login
    await UserQueries.updateById((userDoc._id as Types.ObjectId).toString(), { lastLoginAt: new Date() });

    return this.transformUserDocument(userDoc);
  }

  /**
   * Validate user data
   */
  private validateUserData(userData: CreateUserInput): void {
    if (!userData.name || userData.name.trim().length === 0) {
      throw new Error('Name is required');
    }

    if (userData.name.length > 100) {
      throw new Error('Name cannot exceed 100 characters');
    }

    if (!userData.phone || userData.phone.trim().length === 0) {
      throw new Error('Phone number is required');
    }

    if (userData.password && userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
  }

  /**
   * Find user by email or phone (returns MongoDB document for internal use)
   */
  private async findUserByEmailOrPhoneDocument(email?: string, phone?: string): Promise<IUserDocument | null> {
    if (email && phone) {
      return await UserModel.findOne({
        $or: [{ email }, { phone }]
      });
    } else if (email) {
      return await UserQueries.findByEmail(email);
    } else if (phone) {
      return await UserQueries.findByPhone(phone);
    }

    return null;
  }
}

// Export singleton instance
export const userService = new UserService();