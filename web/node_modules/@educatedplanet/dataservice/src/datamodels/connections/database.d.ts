import mongoose, { ConnectOptions } from 'mongoose';
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
    static getInstance(config?: Partial<DatabaseConfig>): DatabaseConnection;
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
export declare const initializeDatabase: (config?: Partial<DatabaseConfig>) => Promise<void>;
/**
 * Graceful shutdown helper
 */
export declare const closeDatabase: () => Promise<void>;
//# sourceMappingURL=database.d.ts.map