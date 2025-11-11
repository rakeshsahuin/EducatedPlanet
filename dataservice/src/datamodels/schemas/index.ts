/**
 * Schema exports for datamodels package
 */

export type { IUserDocument } from './user-clean.schema';
export { userSchema } from './user-clean.schema';
export type { ITutorDocument } from './tutor-clean.schema';
export { tutorSchema } from './tutor-clean.schema';
export type { IReviewDocument } from './review-clean.schema';
export { reviewSchema } from './review-clean.schema';

export type { IClassDocument } from '../models/class.model';
export { classSchemaDefinition as classSchema } from './class.schema';
export type { ISubjectDocument } from '../models/subject.model';
export { subjectSchemaDefinition as subjectSchema } from './subject.schema';