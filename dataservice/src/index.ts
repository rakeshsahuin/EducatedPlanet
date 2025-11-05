/**
 * Main entry point for @educatedplanet/dataservice package
 * Exports all services and database management functionality
 */

// Database service
export { DatabaseService, databaseService } from './services/database.service';
export type { DatabaseConfig } from './services/database.service';

// User service
export { UserService, userService } from './services/user.service';

// Tutor service
export { TutorService, tutorService } from './services/tutor.service';

// Review service
export { ReviewService, reviewService } from './services/review.service';

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