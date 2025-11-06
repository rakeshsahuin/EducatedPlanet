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
};
//# sourceMappingURL=index.d.ts.map