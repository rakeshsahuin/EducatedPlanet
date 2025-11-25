"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const validator_1 = __importDefault(require("validator"));
const datamodels_1 = require("../datamodels");
/**
 * User service for handling user-related business logic
 */
class UserService {
    async ensureInitialized() {
        if (!UserService.initialized) {
            await (0, datamodels_1.initializeDatabase)();
            UserService.initialized = true;
        }
    }
    /**
     * Transform MongoDB document to User interface
     */
    transformUserDocument(userDoc) {
        return {
            id: userDoc._id.toString(),
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
    async createUser(userData) {
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
        let hashedPassword;
        if (userData.password) {
            hashedPassword = await bcryptjs_1.default.hash(userData.password, 12);
        }
        // Create user
        const userDoc = await datamodels_1.UserQueries.create({
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
    async findUserById(id) {
        await this.ensureInitialized();
        if (!validator_1.default.isMongoId(id)) {
            throw new Error('Invalid user ID');
        }
        const userDoc = await datamodels_1.UserQueries.findById(id);
        return userDoc ? this.transformUserDocument(userDoc) : null;
    }
    /**
     * Find user by email
     */
    async findUserByEmail(email) {
        if (!validator_1.default.isEmail(email)) {
            throw new Error('Invalid email format');
        }
        const userDoc = await datamodels_1.UserQueries.findByEmail(email);
        return userDoc ? this.transformUserDocument(userDoc) : null;
    }
    /**
     * Find user by phone
     */
    async findUserByPhone(phone) {
        if (!phone || phone.trim().length === 0) {
            throw new Error('Phone number is required');
        }
        const userDoc = await datamodels_1.UserQueries.findByPhone(phone);
        return userDoc ? this.transformUserDocument(userDoc) : null;
    }
    /**
     * Search users with filters
     */
    async searchUsers(params) {
        await this.ensureInitialized();
        const { page = 1, limit = 10 } = params;
        const skip = (page - 1) * limit;
        let query = {};
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
            datamodels_1.UserModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
            datamodels_1.UserModel.countDocuments(query)
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
    async updateUser(id, updateData) {
        if (!validator_1.default.isMongoId(id)) {
            throw new Error('Invalid user ID');
        }
        // Validate update data
        if (updateData.email && !validator_1.default.isEmail(updateData.email)) {
            throw new Error('Invalid email format');
        }
        // Check for duplicate email/phone if updating
        if (updateData.email || updateData.phone) {
            const existingUserDoc = await this.findUserByEmailOrPhoneDocument(updateData.email, updateData.phone);
            if (existingUserDoc && existingUserDoc._id.toString() !== id) {
                throw new Error('User with this email or phone already exists');
            }
        }
        const updatedDoc = await datamodels_1.UserQueries.updateById(id, updateData);
        return updatedDoc ? this.transformUserDocument(updatedDoc) : null;
    }
    /**
     * Delete user (soft delete)
     */
    async deleteUser(id) {
        if (!validator_1.default.isMongoId(id)) {
            throw new Error('Invalid user ID');
        }
        const deletedDoc = await datamodels_1.UserQueries.softDelete(id);
        return deletedDoc ? this.transformUserDocument(deletedDoc) : null;
    }
    /**
     * Verify user's email
     */
    async verifyEmail(id) {
        if (!validator_1.default.isMongoId(id)) {
            throw new Error('Invalid user ID');
        }
        const updatedDoc = await datamodels_1.UserQueries.updateById(id, { isEmailVerified: true });
        return updatedDoc ? this.transformUserDocument(updatedDoc) : null;
    }
    /**
     * Verify user's phone with OTP
     */
    async verifyPhone(id, otp) {
        if (!validator_1.default.isMongoId(id)) {
            throw new Error('Invalid user ID');
        }
        const user = await datamodels_1.UserQueries.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        // Check if OTP matches (you might want to add more sophisticated OTP validation)
        if (user.verificationOTP !== otp) {
            throw new Error('Invalid OTP');
        }
        const updatedDoc = await datamodels_1.UserQueries.updateById(id, {
            isPhoneVerified: true,
            verificationOTP: undefined
        });
        return updatedDoc ? this.transformUserDocument(updatedDoc) : null;
    }
    /**
     * Change password
     */
    async changePassword(id, currentPassword, newPassword) {
        if (!validator_1.default.isMongoId(id)) {
            throw new Error('Invalid user ID');
        }
        if (!newPassword || newPassword.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }
        const user = await datamodels_1.UserQueries.findById(id);
        if (!user || !user.password) {
            throw new Error('User not found or no password set');
        }
        // Verify current password
        const isCurrentPasswordValid = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new Error('Current password is incorrect');
        }
        // Hash and update new password
        const hashedNewPassword = await bcryptjs_1.default.hash(newPassword, 12);
        await datamodels_1.UserQueries.updateById(id, { password: hashedNewPassword });
    }
    /**
     * Authenticate user with email/phone and password
     */
    async authenticateUser(credentials) {
        const { email, phone, password } = credentials;
        if (!email && !phone) {
            throw new Error('Email or phone number is required');
        }
        if (!password) {
            throw new Error('Password is required');
        }
        const userDoc = email
            ? await datamodels_1.UserQueries.findByEmail(email)
            : await datamodels_1.UserQueries.findByPhone(phone);
        if (!userDoc || !userDoc.password) {
            return null;
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, userDoc.password);
        if (!isPasswordValid) {
            return null;
        }
        // Update last login
        await datamodels_1.UserQueries.updateById(userDoc._id.toString(), { lastLoginAt: new Date() });
        return this.transformUserDocument(userDoc);
    }
    /**
     * Validate user data
     */
    validateUserData(userData) {
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
    async findUserByEmailOrPhoneDocument(email, phone) {
        if (email && phone) {
            return await datamodels_1.UserModel.findOne({
                $or: [{ email }, { phone }]
            });
        }
        else if (email) {
            return await datamodels_1.UserQueries.findByEmail(email);
        }
        else if (phone) {
            return await datamodels_1.UserQueries.findByPhone(phone);
        }
        return null;
    }
}
exports.UserService = UserService;
UserService.initialized = false;
// Export singleton instance
exports.userService = new UserService();
//# sourceMappingURL=user.service.js.map