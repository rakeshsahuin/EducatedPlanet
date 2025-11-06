/**
 * Main entry point for @educatedplanet/dataservice package
 * Exports all services and database management functionality
 */
export { DatabaseService, databaseService } from './services/database.service';
export type { DatabaseConfig as ServiceDatabaseConfig } from './services/database.service';
export { UserService, userService } from './services/user.service';
export { TutorService, tutorService } from './services/tutor.service';
export { ReviewService, reviewService } from './services/review.service';
export { UserModel, TutorModel, ReviewModel, UserQueries, TutorQueries, ReviewQueries, DatabaseConnection, databaseConnection, initializeDatabase, closeDatabase, userSchema, tutorSchema, reviewSchema, type DatabaseConfig, type IUserDocument, type ITutorDocument, type IReviewDocument, } from './datamodels';
export { seedUsers } from './seeder/userseeder';
export type { User, Tutor, Review, CreateUserInput, UpdateUserInput, LoginInput, UserSearchParams, CreateTutorInput, UpdateTutorInput, TutorSearchParams, CreateReviewInput, UpdateReviewInput, ReviewSearchParams } from '@educatedplanet/models';
//# sourceMappingURL=index.d.ts.map