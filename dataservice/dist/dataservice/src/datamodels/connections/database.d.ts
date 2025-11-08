import mongoose, { ConnectOptions, Model } from 'mongoose';
import { IUserDocument } from '../schemas/user-clean.schema';
import { ITutorDocument } from '../schemas/tutor-clean.schema';
import { IReviewDocument } from '../schemas/review-clean.schema';
/**
 * Database connection configuration interface
 */
export interface DatabaseConfig {
    uri: string;
    options: ConnectOptions;
}
/**
 * Default database configuration
 */
export declare const defaultConfig: DatabaseConfig;
/**
 * Database connection manager singleton
 */
export declare class DatabaseConnection {
    private static instance;
    private isConnected;
    private connectionConfig;
    private constructor();
    /**
     * Get singleton instance
     */
    static getInstance(): DatabaseConnection;
    /**
     * Connect to MongoDB
     */
    connect(): Promise<void>;
    /**
     * Disconnect from MongoDB
     */
    disconnect(): Promise<void>;
    /**
     * Get connection status
     */
    getConnectionStatus(): boolean;
    /**
     * Get Mongoose instance
     */
    getMongoose(): typeof mongoose;
    /**
     * Get raw MongoDB database instance
     */
    getDb(): typeof mongoose.connection.db;
    /**
     * Get User model bound to this connection
     */
    getUserModel(): Model<IUserDocument>;
    /**
     * Get Tutor model bound to this connection
     */
    getTutorModel(): Model<ITutorDocument>;
    /**
     * Get Review model bound to this connection
     */
    getReviewModel(): Model<IReviewDocument>;
    /**
     * Health check for database connection
     */
    healthCheck(): Promise<{
        status: 'healthy' | 'unhealthy';
        message: string;
    }>;
    /**
     * Get database info
     */
    getDatabaseInfo(): Promise<{
        name: string;
        collections: string[];
    }>;
}
/**
 * Export singleton instance
 */
export declare const databaseConnection: DatabaseConnection;
/**
 * Helper function to initialize database with custom config
 */
export declare const initializeDatabase: () => Promise<void>;
/**
 * Graceful shutdown helper
 */
export declare const closeDatabase: () => Promise<void>;
//# sourceMappingURL=database.d.ts.map