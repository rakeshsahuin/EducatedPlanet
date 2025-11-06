/**
 * Main entry point for @educatedplanet/dataservice package
 * Exports all services and database management functionality
 */

// Database service
export { DatabaseService, databaseService } from './services/database.service';
export type { DatabaseConfig as ServiceDatabaseConfig } from './services/database.service';

// User service
export { UserService, userService } from './services/user.service';

// Tutor service
export { TutorService, tutorService } from './services/tutor.service';

// Review service
export { ReviewService, reviewService } from './services/review.service';

// Export datamodels
export {
  UserModel,
  TutorModel,
  ReviewModel,
  UserQueries,
  TutorQueries,
  ReviewQueries,
  DatabaseConnection,
  databaseConnection,
  initializeDatabase,
  closeDatabase,
  userSchema,
  tutorSchema,
  reviewSchema,
  type DatabaseConfig,
  type IUserDocument,
  type ITutorDocument,
  type IReviewDocument,
} from './datamodels';

// Export seeder
export { seedUsers } from './seeder/userseeder';

// Export all interfaces from models package
export type {
  User,
  Tutor,
  Review,
  CreateUserInput,
  UpdateUserInput,
  LoginInput,
  UserSearchParams,
  CreateTutorInput,
  UpdateTutorInput,
  TutorSearchParams,
  CreateReviewInput,
  UpdateReviewInput,
  ReviewSearchParams
} from '@educatedplanet/models';