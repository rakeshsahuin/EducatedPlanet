import { IUserDocument } from '@educatedplanet/datamodels';
export interface CreateUserInput {
    name: string;
    email?: string;
    phone: string;
    role?: 'user' | 'tutor' | 'admin';
    password?: string;
}
export interface UpdateUserInput {
    name?: string;
    email?: string;
    phone?: string;
    role?: 'user' | 'tutor' | 'admin';
}
export interface LoginInput {
    phone?: string;
    email?: string;
    password?: string;
    otp?: string;
}
export interface UserSearchParams {
    query?: string;
    role?: string;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
    isActive?: boolean;
    page?: number;
    limit?: number;
}
/**
 * User service for handling user-related business logic
 */
export declare class UserService {
    /**
     * Create a new user
     */
    createUser(userData: CreateUserInput): Promise<IUserDocument>;
    /**
     * Find user by ID
     */
    findUserById(id: string): Promise<IUserDocument | null>;
    /**
     * Find user by email
     */
    findUserByEmail(email: string): Promise<IUserDocument | null>;
    /**
     * Find user by phone
     */
    findUserByPhone(phone: string): Promise<IUserDocument | null>;
    /**
     * Search users with filters
     */
    searchUsers(params: UserSearchParams): Promise<{
        users: IUserDocument[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    /**
     * Update user by ID
     */
    updateUser(id: string, updateData: UpdateUserInput): Promise<IUserDocument | null>;
    /**
     * Delete user (soft delete)
     */
    deleteUser(id: string): Promise<IUserDocument | null>;
    /**
     * Verify user's email
     */
    verifyEmail(id: string): Promise<IUserDocument | null>;
    /**
     * Verify user's phone with OTP
     */
    verifyPhone(id: string, otp: string): Promise<IUserDocument | null>;
    /**
     * Change password
     */
    changePassword(id: string, currentPassword: string, newPassword: string): Promise<void>;
    /**
     * Authenticate user with email/phone and password
     */
    authenticateUser(credentials: LoginInput): Promise<IUserDocument | null>;
    /**
     * Validate user data
     */
    private validateUserData;
    /**
     * Find user by email or phone
     */
    private findUserByEmailOrPhone;
}
export declare const userService: UserService;
//# sourceMappingURL=user.service.d.ts.map