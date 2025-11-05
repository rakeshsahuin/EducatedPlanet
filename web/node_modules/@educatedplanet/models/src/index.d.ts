/**
 * Main entry point for @educatedplanet/models package
 * Exports all types and interfaces used across the EducatedPlanet platform
 */
export * from './tutor/tutor.types';
export * from './user/user.types';
export * from './common/common.types';
export type { Tutor, TutorRating, TeachingMode, TutorLocation, TutorPrice, TutorCardVariant, ExtendedTutor, Education, Language, Availability, WeekdayAvailability, TimeSlot, Review, } from './tutor/tutor.types';
export type { User, UserRole, UserRegistration, UserLogin, UserProfile, Address, UserPreferences, NotificationPreferences, PrivacySettings, ExtendedUser, UserStats, } from './user/user.types';
export type { ApiResponse, ApiError, PaginationParams, PaginationMeta, PaginatedResponse, BaseEntity, Status, VerificationStatus, SubjectCategory, Subject, ClassLevel, BhubaneswarArea, BHUBANESWAR_AREAS, SearchFilters, LoadingState, ThemeMode, Currency, FileUpload, FormErrors, ComponentProps, ColorVariant, SizeVariant, } from './common/common.types';
//# sourceMappingURL=index.d.ts.map