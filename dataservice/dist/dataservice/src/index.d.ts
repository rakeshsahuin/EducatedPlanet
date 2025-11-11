/**
 * Main entry point for @educatedplanet/dataservice package
 * Exports all services and database management functionality
 */
export { DatabaseService, databaseService } from './services/database.service';
export type { DatabaseConfig as ServiceDatabaseConfig } from './services/database.service';
export { UserService, userService } from './services/user.service';
export { TutorService, tutorService } from './services/tutor.service';
export { ReviewService, reviewService } from './services/review.service';
export { ClassService, classService } from './services/class.service';
export { SubjectService, subjectService } from './services/subject.service';
export { authenticateUser, validateSession, invalidateSession, userExists } from './services/auth.service';
export type { AuthSession, UserSessionResponse } from './services/auth.service';
export { UserModel, TutorModel, ReviewModel, UserQueries, TutorQueries, ReviewQueries, ClassQueries, SubjectQueries, DatabaseConnection, databaseConnection, initializeDatabase, closeDatabase, userSchema, tutorSchema, reviewSchema, classSchema, subjectSchema, type DatabaseConfig, type IUserDocument, type ITutorDocument, type IReviewDocument, type IClassDocument, type ISubjectDocument, } from './datamodels';
export { seedUsers } from './seeder/userseeder';
export { seedClasses, clearClasses, type ClassSeedData } from './seeder/classseeder';
export { seedSubjects, clearSubjects, type SubjectSeedData } from './seeder/subjectseeder';
export { initializeRSAKeys, getPublicKey, decryptWithPrivateKey, encryptWithPublicKey, regenerateRSAKeys } from './utils/rsa-keys';
export type { User, Tutor, Review, Class, CreateUserInput, UpdateUserInput, LoginInput, UserSearchParams, CreateTutorInput, UpdateTutorInput, TutorSearchParams, CreateReviewInput, UpdateReviewInput, ReviewSearchParams, CreateClassInput, UpdateClassInput, ClassSearchParams, ClassWithSubClasses, AddSubClassInput, RemoveSubClassInput, ClassMetadata, ClassCategory, Subject as NewSubject, SubjectMetadata, CreateSubjectInput, UpdateSubjectInput, SubjectSearchParams, SubjectWithClasses, AddClassToSubjectInput, RemoveClassFromSubjectInput, BulkSubjectOperation } from '@educatedplanet/models';
//# sourceMappingURL=index.d.ts.map