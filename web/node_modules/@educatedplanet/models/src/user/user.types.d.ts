/**
 * Core user interface for EducatedPlanet platform
 */
export interface User {
    id: string;
    name: string;
    email?: string;
    phone: string;
    role: UserRole;
    avatar?: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * User roles in the platform
 */
export type UserRole = 'user' | 'tutor' | 'admin';
/**
 * User registration data
 */
export interface UserRegistration {
    name: string;
    email?: string;
    phone: string;
    role: UserRole;
    password?: string;
    agreeToTerms: boolean;
    agreeToPrivacy: boolean;
}
/**
 * User login data
 */
export interface UserLogin {
    phone: string;
    otp?: string;
    password?: string;
    rememberMe?: boolean;
}
/**
 * User profile information
 */
export interface UserProfile {
    avatar?: string;
    bio?: string;
    dateOfBirth?: Date;
    gender?: 'male' | 'female' | 'other';
    address?: Address;
    preferences: UserPreferences;
}
/**
 * Address information
 */
export interface Address {
    street?: string;
    area: string;
    city: string;
    state: string;
    pincode?: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
}
/**
 * User preferences
 */
export interface UserPreferences {
    notifications: NotificationPreferences;
    language: 'en' | 'hi' | 'or';
    timezone: string;
    privacy: PrivacySettings;
}
/**
 * Notification preferences
 */
export interface NotificationPreferences {
    email: boolean;
    sms: boolean;
    push: boolean;
    marketing: boolean;
    tutorUpdates: boolean;
}
/**
 * Privacy settings
 */
export interface PrivacySettings {
    profileVisibility: 'public' | 'private';
    showPhone: boolean;
    showEmail: boolean;
    allowDirectMessages: boolean;
}
/**
 * Extended user interface for detailed views
 */
export interface ExtendedUser extends User {
    profile: UserProfile;
    stats?: UserStats;
}
/**
 * User statistics
 */
export interface UserStats {
    totalSessions: number;
    totalHours: number;
    favoriteTutors: string[];
    reviewsGiven: number;
    lastLoginAt: Date;
}
//# sourceMappingURL=user.types.d.ts.map