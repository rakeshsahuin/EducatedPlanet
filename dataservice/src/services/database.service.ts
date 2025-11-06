import mongoose, { ConnectOptions } from 'mongoose';

export interface DatabaseConfig {
  mongodbUri: string;
  dbName?: string;
  options?: ConnectOptions;
}

/**
 * Database service for managing MongoDB connections
 */
export class DatabaseService {
  private static instance: DatabaseService;
  private isConnected = false;

  private constructor() {}

  /**
   * Get singleton instance of DatabaseService
   */
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * Connect to MongoDB using provided configuration
   */
  public async connect(config: DatabaseConfig): Promise<void> {
    if (this.isConnected) {
      console.log('MongoDB already connected');
      return;
    }

    try {
      const { mongodbUri, dbName, options } = config;

      const connectionOptions: ConnectOptions = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
        // Use database name from config or environment variable
        dbName: dbName || process.env.MONGODB_DB_NAME || 'eduplanet',
        ...options
      };

      await mongoose.connect(mongodbUri, connectionOptions);

      if (dbName) {
        // Use specific database if provided
        if (mongoose.connection.db) {
          await mongoose.connection.db.admin().command({ listCollections: 1, limit: 1 });
        }
      }

      this.isConnected = true;
      console.log('MongoDB connected successfully');

      // Handle connection events
      this.setupEventHandlers();
    } catch (error) {
      console.error('MongoDB connection error:', error);
      this.isConnected = false;
      throw error;
    }
  }

  /**
   * Disconnect from MongoDB
   */
  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('MongoDB disconnected successfully');
    } catch (error) {
      console.error('MongoDB disconnection error:', error);
      throw error;
    }
  }

  /**
   * Check if connected to MongoDB
   */
  public isConnectionActive(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  /**
   * Get connection status
   */
  public getConnectionStatus(): string {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    return states[mongoose.connection.readyState as keyof typeof states] || 'unknown';
  }

  /**
   * Get database health information
   */
  public async getHealthInfo(): Promise<{
    status: string;
    database?: string;
    collections?: number;
    documents?: number;
  }> {
    const healthInfo: any = {
      status: this.getConnectionStatus()
    };

    if (this.isConnectionActive() && mongoose.connection.db) {
      try {
        const db = mongoose.connection.db;
        const stats = await db.stats();

        healthInfo.database = db.databaseName;
        healthInfo.collections = stats.collections;
        healthInfo.documents = stats.objects;
      } catch (error) {
        console.error('Error getting database health info:', error);
      }
    }

    return healthInfo;
  }

  /**
   * Setup event handlers for MongoDB connection
   */
  private setupEventHandlers(): void {
    const connection = mongoose.connection;

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

    // Handle process termination
    process.on('SIGINT', async () => {
      await this.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await this.disconnect();
      process.exit(0);
    });
  }
}

// Export singleton instance
export const databaseService = DatabaseService.getInstance();