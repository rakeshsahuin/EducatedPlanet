/**
 * Database connection exports
 */
export { DatabaseConnection, databaseConnection, initializeDatabase, closeDatabase, defaultConfig, type DatabaseConfig, } from './database';
export declare const getModel: {
    user: () => import("mongoose").Model<import("..").IUserDocument, {}, {}, {}, import("mongoose").Document<unknown, {}, import("..").IUserDocument, {}, {}> & import("..").IUserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, any>;
    tutor: () => import("mongoose").Model<import("..").ITutorDocument, {}, {}, {}, import("mongoose").Document<unknown, {}, import("..").ITutorDocument, {}, {}> & import("..").ITutorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, any>;
    review: () => import("mongoose").Model<import("..").IReviewDocument, {}, {}, {}, import("mongoose").Document<unknown, {}, import("..").IReviewDocument, {}, {}> & import("..").IReviewDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, any>;
    class: () => import("mongoose").Model<import("..").IClassDocument, {}, {}, {}, import("mongoose").Document<unknown, {}, import("..").IClassDocument, {}, {}> & import("..").IClassDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, any>;
    subject: () => import("mongoose").Model<import("..").ISubjectDocument, {}, {}, {}, import("mongoose").Document<unknown, {}, import("..").ISubjectDocument, {}, {}> & import("..").ISubjectDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, any>;
};
//# sourceMappingURL=index.d.ts.map