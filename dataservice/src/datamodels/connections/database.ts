import mongoose, { ConnectOptions, Model } from 'mongoose';
import { userSchema, IUserDocument } from '../schemas/user-clean.schema';
import { tutorSchema, ITutorDocument } from '../schemas/tutor-clean.schema';
import { reviewSchema, IReviewDocument } from '../schemas/review-clean.schema';

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
export const defaultConfig: DatabaseConfig = {
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
export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected = false;
  private connectionConfig: DatabaseConfig;

  private constructor() {
    this.connectionConfig = {
      uri: defaultConfig.uri,
      options: { ...defaultConfig.options},
    };
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  /**
   * Connect to MongoDB
   */
  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('Database already connected');
      return;
    }

    try {
      console.log('Connecting to MongoDB...');
      console.log(`URI: ${this.connectionConfig.uri.replace(/\/\/.*@/, '//***:***@')}`);

      await mongoose.connect(this.connectionConfig.uri, this.connectionConfig.options);

      this.isConnected = true;
      console.log('✅ Connected to MongoDB successfully');

      // Set up connection event listeners
      mongoose.connection.on('error', (error) => {
        console.error('❌ MongoDB connection error:', error);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.log('⚠️ MongoDB disconnected');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected');
        this.isConnected = true;
      });

    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
      this.isConnected = false;
      throw error;
    }
  }

  /**
   * Disconnect from MongoDB
   */
  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      console.log('Database not connected');
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('✅ Disconnected from MongoDB');
    } catch (error) {
      console.error('❌ Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  /**
   * Get connection status
   */
  public getConnectionStatus(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  /**
   * Get Mongoose instance
   */
  public getMongoose(): typeof mongoose {
    return mongoose;
  }

  /**
   * Get User model bound to this connection
   */
  public getUserModel(): Model<IUserDocument> {
    // Check if model already exists for this connection
    if (this.getMongoose().models.User) {
      return this.getMongoose().models.User;
    }
    // Register model with this connection
    return this.getMongoose().model<IUserDocument>('User', userSchema);
  }

  /**
   * Get Tutor model bound to this connection
   */
  public getTutorModel(): Model<ITutorDocument> {
    // Check if model already exists for this connection
    if (this.getMongoose().models.Tutor) {
      return this.getMongoose().models.Tutor;
    }
    // Register model with this connection
    return this.getMongoose().model<ITutorDocument>('Tutor', tutorSchema);
  }

  /**
   * Get Review model bound to this connection
   */
  public getReviewModel(): Model<IReviewDocument> {
    // Check if model already exists for this connection
    if (this.getMongoose().models.Review) {
      return this.getMongoose().models.Review;
    }
    // Register model with this connection
    return this.getMongoose().model<IReviewDocument>('Review', reviewSchema);
  }

  /**
   * Health check for database connection
   */
  public async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; message: string }> {
    try {
      if (this.getConnectionStatus()) {
        // Test with a simple operation
        const db = mongoose.connection.db;
        if (db) {
          await db.admin().ping();
          return { status: 'healthy', message: 'Database connection is healthy' };
        } else {
          return { status: 'unhealthy', message: 'Database not available' };
        }
      } else {
        return { status: 'unhealthy', message: 'Database not connected' };
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Database health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Get database info
   */
  public async getDatabaseInfo(): Promise<{ name: string; collections: string[] }> {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database not available');
    }

    const collections = await db.listCollections().toArray();

    return {
      name: db.databaseName,
      collections: collections.map(col => col.name),
    };
  }
}

/**
 * Export singleton instance
 */
export const databaseConnection = DatabaseConnection.getInstance();

/**
 * Helper function to initialize database with custom config
 */
export const initializeDatabase = async (): Promise<void> => {
  const db = DatabaseConnection.getInstance();
  await db.connect();
};

/**
 * Graceful shutdown helper
 */
export const closeDatabase = async (): Promise<void> => {
  const db = DatabaseConnection.getInstance();
  await db.disconnect();
};