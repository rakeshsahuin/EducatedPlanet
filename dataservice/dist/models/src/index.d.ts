/**
 * Main entry point for @educatedplanet/models package
 * Exports all types and interfaces used across the EducatedPlanet platform
 */
export * from './tutor/tutor.types';
export * from './tutor/admin.types';
export * from './user/user.types';
export * from './class/types';
export * from './subject/types';
export * from './common/common.types';
export type { Tutor, TutorRating, TeachingMode, TutorLocation, TutorPrice, TutorCardVariant, ExtendedTutor, Education, Language, Availability, WeekdayAvailability, TimeSlot, Review, CreateTutorInput, UpdateTutorInput, TutorSearchParams, CreateReviewInput, UpdateReviewInput, ReviewSearchParams, } from './tutor/tutor.types';
export type { SubjectOption, ClassOption, SubjectsResponse, SubjectsClassesResponse, } from './tutor/admin.types';
export type { User, UserRole, UserRegistration, UserLogin, UserProfile, Address, UserPreferences, NotificationPreferences, PrivacySettings, ExtendedUser, UserStats, CreateUserInput, UpdateUserInput, LoginInput, UserSearchParams, } from './user/user.types';
export type { Class, ClassMetadata, CreateClassInput, UpdateClassInput, ClassSearchParams, ClassWithSubClasses, AddSubClassInput, RemoveSubClassInput, } from './class/types';
export { ClassCategory } from './class/types';
export type { Subject as NewSubject, SubjectMetadata, CreateSubjectInput, UpdateSubjectInput, SubjectSearchParams, SubjectWithClasses, AddClassToSubjectInput, RemoveClassFromSubjectInput, BulkSubjectOperation, } from './subject/types';
export type { ApiResponse, ApiError, PaginationParams, PaginationMeta, PaginatedResponse, BaseEntity, Status, VerificationStatus, Subject, ClassLevel, BhubaneswarArea, BHUBANESWAR_AREAS, SearchFilters, LoadingState, ThemeMode, Currency, FileUpload, FormErrors, ComponentProps, ColorVariant, SizeVariant, } from './common/common.types';
export { SubjectCategory } from './common/common.types';
//# sourceMappingURL=index.d.ts.map