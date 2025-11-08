import { User, CreateUserInput, UpdateUserInput, LoginInput, UserSearchParams } from '@educatedplanet/models';
/**
 * User service for handling user-related business logic
 */
export declare class UserService {
    private static initialized;
    private ensureInitialized;
    /**
     * Transform MongoDB document to User interface
     */
    private transformUserDocument;
    /**
     * Create a new user
     */
    createUser(userData: CreateUserInput): Promise<User>;
    /**
     * Find user by ID
     */
    findUserById(id: string): Promise<User | null>;
    /**
     * Find user by email
     */
    findUserByEmail(email: string): Promise<User | null>;
    /**
     * Find user by phone
     */
    findUserByPhone(phone: string): Promise<User | null>;
    /**
     * Search users with filters
     */
    searchUsers(params: UserSearchParams): Promise<{
        users: User[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    /**
     * Update user by ID
     */
    updateUser(id: string, updateData: UpdateUserInput): Promise<User | null>;
    /**
     * Delete user (soft delete)
     */
    deleteUser(id: string): Promise<User | null>;
    /**
     * Verify user's email
     */
    verifyEmail(id: string): Promise<User | null>;
    /**
     * Verify user's phone with OTP
     */
    verifyPhone(id: string, otp: string): Promise<User | null>;
    /**
     * Change password
     */
    changePassword(id: string, currentPassword: string, newPassword: string): Promise<void>;
    /**
     * Authenticate user with email/phone and password
     */
    authenticateUser(credentials: LoginInput): Promise<User | null>;
    /**
     * Validate user data
     */
    private validateUserData;
    /**
     * Find user by email or phone (returns MongoDB document for internal use)
     */
    private findUserByEmailOrPhoneDocument;
}
export declare const userService: UserService;
//# sourceMappingURL=user.service.d.ts.map