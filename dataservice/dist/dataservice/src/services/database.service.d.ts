import { ConnectOptions } from 'mongoose';
export interface DatabaseConfig {
    mongodbUri: string;
    dbName?: string;
    options?: ConnectOptions;
}
/**
 * Database service for managing MongoDB connections
 */
export declare class DatabaseService {
    private static instance;
    private isConnected;
    private eventHandlersSetup;
    private maxListeners;
    private constructor();
    /**
     * Get singleton instance of DatabaseService
     */
    static getInstance(): DatabaseService;
    /**
     * Connect to MongoDB using provided configuration
     */
    connect(config: DatabaseConfig): Promise<void>;
    /**
     * Disconnect from MongoDB
     */
    disconnect(): Promise<void>;
    /**
     * Check if connected to MongoDB
     */
    isConnectionActive(): boolean;
    /**
     * Get connection status
     */
    getConnectionStatus(): string;
    /**
     * Get database health information
     */
    getHealthInfo(): Promise<{
        status: string;
        database?: string;
        collections?: number;
        documents?: number;
    }>;
    /**
     * Setup event handlers for MongoDB connection
     */
    private setupEventHandlers;
    /**
     * Clean up event handlers and connection
     */
    cleanup(): Promise<void>;
}
export declare const databaseService: DatabaseService;
//# sourceMappingURL=database.service.d.ts.map