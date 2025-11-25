"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseService = exports.DatabaseService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Database service for managing MongoDB connections
 */
class DatabaseService {
    constructor() {
        this.isConnected = false;
        this.eventHandlersSetup = false;
        this.maxListeners = 20; // Increase from default of 10
    }
    /**
     * Get singleton instance of DatabaseService
     */
    static getInstance() {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }
    /**
     * Connect to MongoDB using provided configuration
     */
    async connect(config) {
        if (this.isConnected) {
            console.log('MongoDB already connected');
            return;
        }
        try {
            const { mongodbUri, dbName, options } = config;
            const connectionOptions = {
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
                bufferCommands: false,
                // Use database name from config or environment variable
                dbName: dbName || process.env.MONGODB_DB_NAME || 'eduplanet',
                ...options
            };
            // Increase max listeners before connecting
            mongoose_1.default.connection.setMaxListeners(this.maxListeners);
            await mongoose_1.default.connect(mongodbUri, connectionOptions);
            if (dbName) {
                // Use specific database if provided
                if (mongoose_1.default.connection.db) {
                    await mongoose_1.default.connection.db.admin().command({ listCollections: 1, limit: 1 });
                }
            }
            this.isConnected = true;
            console.log('MongoDB connected successfully');
            // Handle connection events (only once)
            this.setupEventHandlers();
        }
        catch (error) {
            console.error('MongoDB connection error:', error);
            this.isConnected = false;
            throw error;
        }
    }
    /**
     * Disconnect from MongoDB
     */
    async disconnect() {
        if (!this.isConnected) {
            return;
        }
        try {
            await mongoose_1.default.disconnect();
            this.isConnected = false;
            console.log('MongoDB disconnected successfully');
        }
        catch (error) {
            console.error('MongoDB disconnection error:', error);
            throw error;
        }
    }
    /**
     * Check if connected to MongoDB
     */
    isConnectionActive() {
        return this.isConnected && mongoose_1.default.connection.readyState === 1;
    }
    /**
     * Get connection status
     */
    getConnectionStatus() {
        const states = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };
        return states[mongoose_1.default.connection.readyState] || 'unknown';
    }
    /**
     * Get database health information
     */
    async getHealthInfo() {
        const healthInfo = {
            status: this.getConnectionStatus()
        };
        if (this.isConnectionActive() && mongoose_1.default.connection.db) {
            try {
                const db = mongoose_1.default.connection.db;
                const stats = await db.stats();
                healthInfo.database = db.databaseName;
                healthInfo.collections = stats.collections;
                healthInfo.documents = stats.objects;
            }
            catch (error) {
                console.error('Error getting database health info:', error);
            }
        }
        return healthInfo;
    }
    /**
     * Setup event handlers for MongoDB connection
     */
    setupEventHandlers() {
        // Only setup event handlers once to prevent memory leaks
        if (this.eventHandlersSetup) {
            return;
        }
        const connection = mongoose_1.default.connection;
        // Remove any existing listeners to prevent duplicates
        connection.removeAllListeners('connected');
        connection.removeAllListeners('error');
        connection.removeAllListeners('disconnected');
        connection.on('connected', () => {
            console.log('MongoDB connection established');
        });
        connection.on('error', (error) => {
            console.error('MongoDB connection error:', error);
            this.isConnected = false;
        });
        connection.on('disconnected', () => {
            console.log('MongoDB connection disconnected');
            this.isConnected = false;
        });
        // Handle process termination - only setup once
        if (!process.listeners('SIGINT').some(listener => listener.toString().includes('disconnect'))) {
            process.on('SIGINT', async () => {
                await this.disconnect();
                process.exit(0);
            });
        }
        if (!process.listeners('SIGTERM').some(listener => listener.toString().includes('disconnect'))) {
            process.on('SIGTERM', async () => {
                await this.disconnect();
                process.exit(0);
            });
        }
        // Handle development hot reload cleanup (Next.js dev)
        if (process.env.NODE_ENV === 'development') {
            // Setup cleanup for beforeExit event (common during hot reloads)
            process.once('beforeExit', async () => {
                await this.cleanup();
            });
            // Also handle SIGUSR2 which is used by nodemon
            process.once('SIGUSR2', async () => {
                await this.cleanup();
                process.kill(process.pid, 'SIGUSR2');
            });
        }
        this.eventHandlersSetup = true;
        console.log('MongoDB event handlers setup completed');
    }
    /**
     * Clean up event handlers and connection
     */
    async cleanup() {
        const connection = mongoose_1.default.connection;
        // Remove all mongoose connection listeners
        connection.removeAllListeners();
        // Remove process listeners
        process.removeAllListeners('SIGINT');
        process.removeAllListeners('SIGTERM');
        this.eventHandlersSetup = false;
        this.isConnected = false;
        console.log('MongoDB event handlers cleaned up');
    }
}
exports.DatabaseService = DatabaseService;
// Export singleton instance
exports.databaseService = DatabaseService.getInstance();
//# sourceMappingURL=database.service.js.map