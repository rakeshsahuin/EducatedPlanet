/**
 * Main entry point for @educatedplanet/dataservice package
 * Exports all services and database management functionality
 */
export { DatabaseService, databaseService } from './services/database.service';
export type { DatabaseConfig } from './services/database.service';
export { UserService, userService } from './services/user.service';
export type { CreateUserInput, UpdateUserInput, LoginInput, UserSearchParams } from './services/user.service';
export { TutorService, tutorService } from './services/tutor.service';
export type { CreateTutorInput, UpdateTutorInput, TutorSearchParams } from './services/tutor.service';
export { ReviewService, reviewService } from './services/review.service';
export type { CreateReviewInput, UpdateReviewInput, ReviewSearchParams } from './services/review.service';
export type { IUserDocument, ITutorDocument, IReviewDocument } from '@educatedplanet/datamodels';
export { UserModel, UserQueries, TutorModel, TutorQueries, ReviewModel, ReviewQueries } from '@educatedplanet/datamodels';
//# sourceMappingURL=index.d.ts.map