/**
 * Main entry point for @educatedplanet/datamodels package
 * Exports all schemas, models, and database connection utilities
 */
export * from './connections';
export * from './schemas';
export * from './models';
export { DatabaseConnection, databaseConnection, initializeDatabase, closeDatabase, type DatabaseConfig, } from './connections';
export { userSchema, tutorSchema, reviewSchema, classSchema, subjectSchema, type IUserDocument, type ITutorDocument, type IReviewDocument, type IClassDocument, type ISubjectDocument, } from './schemas';
export { UserModel, TutorModel, ReviewModel, UserQueries, TutorQueries, ReviewQueries, ClassQueries, SubjectQueries, } from './models';
//# sourceMappingURL=index.d.ts.map