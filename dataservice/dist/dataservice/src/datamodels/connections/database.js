"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDatabase = exports.initializeDatabase = exports.databaseConnection = exports.DatabaseConnection = exports.defaultConfig = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_clean_schema_1 = require("../schemas/user-clean.schema");
const tutor_clean_schema_1 = require("../schemas/tutor-clean.schema");
const review_clean_schema_1 = require("../schemas/review-clean.schema");
const class_schema_1 = require("../schemas/class.schema");
const subject_schema_1 = require("../schemas/subject.schema");
/**
 * Default database configuration
 */
exports.defaultConfig = {
    uri: process.env.MONGODB_URI,
    options: {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        // Additional options for better connection handling
        connectTimeoutMS: 10000,
        heartbeatFrequencyMS: 10000,
        retryWrites: true,
        w: 'majority',
        // Explicitly set the database name from environment variable
        dbName: process.env.MONGODB_DB_NAME
    },
};
/**
 * Database connection manager singleton
 */
class DatabaseConnection {
    constructor() {
        this.isConnected = false;
        this.eventHandlersSetup = false;
        this.maxListeners = 20; // Increase from default of 10
        this.connectionConfig = {
            uri: exports.defaultConfig.uri,
            options: { ...exports.defaultConfig.options },
        };
    }
    /**
     * Get singleton instance
     */
    static getInstance() {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }
    /**
     * Connect to MongoDB
     */
    async connect() {
        if (this.isConnected) {
            console.log('Database already connected');
            return;
        }
        try {
            console.log('Connecting to MongoDB...');
            console.log(`URI: ${this.connectionConfig.uri.replace(/\/\/.*@/, '//***:***@')}`);
            // Increase max listeners before connecting
            mongoose_1.default.connection.setMaxListeners(this.maxListeners);
            await mongoose_1.default.connect(this.connectionConfig.uri, this.connectionConfig.options);
            this.isConnected = true;
            console.log('✅ Connected to MongoDB successfully');
            // Set up connection event listeners (only once)
            this.setupEventHandlers();
        }
        catch (error) {
            console.error('❌ Failed to connect to MongoDB:', error);
            this.isConnected = false;
            throw error;
        }
    }
    /**
     * Disconnect from MongoDB
     */
    async disconnect() {
        if (!this.isConnected) {
            console.log('Database not connected');
            return;
        }
        try {
            await mongoose_1.default.disconnect();
            this.isConnected = false;
            console.log('✅ Disconnected from MongoDB');
        }
        catch (error) {
            console.error('❌ Error disconnecting from MongoDB:', error);
            throw error;
        }
    }
    /**
     * Get connection status
     */
    getConnectionStatus() {
        return this.isConnected && mongoose_1.default.connection.readyState === 1;
    }
    /**
     * Get Mongoose instance
     */
    getMongoose() {
        return mongoose_1.default;
    }
    /**
     * Get raw MongoDB database instance
     */
    getDb() {
        if (!this.isConnected) {
            throw new Error('Database not connected');
        }
        return mongoose_1.default.connection.db;
    }
    /**
     * Get User model bound to this connection
     */
    getUserModel() {
        // Check if model already exists for this connection
        if (this.getMongoose().models.User) {
            return this.getMongoose().models.User;
        }
        // Register model with this connection
        return this.getMongoose().model('User', user_clean_schema_1.userSchema);
    }
    /**
     * Get Tutor model bound to this connection
     */
    getTutorModel() {
        // Check if model already exists for this connection
        if (this.getMongoose().models.Tutor) {
            return this.getMongoose().models.Tutor;
        }
        // Register model with this connection
        return this.getMongoose().model('Tutor', tutor_clean_schema_1.tutorSchema);
    }
    /**
     * Get Review model bound to this connection
     */
    getReviewModel() {
        // Check if model already exists for this connection
        if (this.getMongoose().models.Review) {
            return this.getMongoose().models.Review;
        }
        // Register model with this connection
        return this.getMongoose().model('Review', review_clean_schema_1.reviewSchema);
    }
    /**
     * Get Class model bound to this connection
     */
    getClassModel() {
        // Check if model already exists for this connection
        if (this.getMongoose().models.Class) {
            return this.getMongoose().models.Class;
        }
        // Register model with this connection
        return this.getMongoose().model('Class', class_schema_1.classSchemaDefinition);
    }
    /**
     * Get Subject model bound to this connection
     */
    getSubjectModel() {
        // Check if model already exists for this connection
        if (this.getMongoose().models.Subject) {
            return this.getMongoose().models.Subject;
        }
        // Register model with this connection
        return this.getMongoose().model('Subject', subject_schema_1.subjectSchemaDefinition);
    }
    /**
     * Health check for database connection
     */
    async healthCheck() {
        try {
            if (this.getConnectionStatus()) {
                // Test with a simple operation
                const db = mongoose_1.default.connection.db;
                if (db) {
                    await db.admin().ping();
                    return { status: 'healthy', message: 'Database connection is healthy' };
                }
                else {
                    return { status: 'unhealthy', message: 'Database not available' };
                }
            }
            else {
                return { status: 'unhealthy', message: 'Database not connected' };
            }
        }
        catch (error) {
            return {
                status: 'unhealthy',
                message: `Database health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
    /**
     * Get database info
     */
    async getDatabaseInfo() {
        if (!this.isConnected) {
            throw new Error('Database not connected');
        }
        const db = mongoose_1.default.connection.db;
        if (!db) {
            throw new Error('Database not available');
        }
        const collections = await db.listCollections().toArray();
        return {
            name: db.databaseName,
            collections: collections.map(col => col.name),
        };
    }
    /**
     * Setup event handlers for MongoDB connection (only once)
     */
    setupEventHandlers() {
        // Only setup event handlers once to prevent memory leaks
        if (this.eventHandlersSetup) {
            return;
        }
        const connection = mongoose_1.default.connection;
        // Remove any existing listeners to prevent duplicates
        connection.removeAllListeners('error');
        connection.removeAllListeners('disconnected');
        connection.removeAllListeners('reconnected');
        connection.on('error', (error) => {
            console.error('❌ MongoDB connection error:', error);
            this.isConnected = false;
        });
        connection.on('disconnected', () => {
            console.log('⚠️ MongoDB disconnected');
            this.isConnected = false;
        });
        connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconnected');
            this.isConnected = true;
        });
        // Handle development hot reload cleanup
        if (process.env.NODE_ENV === 'development') {
            process.once('beforeExit', async () => {
                await this.cleanup();
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
        this.eventHandlersSetup = false;
        this.isConnected = false;
        console.log('MongoDB event handlers cleaned up');
    }
}
exports.DatabaseConnection = DatabaseConnection;
/**
 * Export singleton instance
 */
exports.databaseConnection = DatabaseConnection.getInstance();
/**
 * Helper function to initialize database with custom config
 */
const initializeDatabase = async () => {
    const db = DatabaseConnection.getInstance();
    await db.connect();
};
exports.initializeDatabase = initializeDatabase;
/**
 * Graceful shutdown helper
 */
const closeDatabase = async () => {
    const db = DatabaseConnection.getInstance();
    await db.disconnect();
};
exports.closeDatabase = closeDatabase;
//# sourceMappingURL=database.js.map