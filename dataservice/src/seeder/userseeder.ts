import bcrypt from 'bcryptjs';
import { promises as fs } from 'fs';
import * as path from 'path';
import { databaseConnection, initializeDatabase, closeDatabase, getModel } from '../datamodels/connections';

// Enhanced interface with better type safety
interface UserData {
  name: string;
  username: string;
  email: string;
  isActive: boolean;
  password: string;
  phone: string;
  role?: string; // Optional role with default
}

// Configuration constants for better maintainability
const SEEDER_CONFIG = {
  SALT_ROUNDS: 12,
  DEFAULT_ROLE: 'admin',
  DATA_FILE_NAME: 'users.json',
  DATA_DIR_NAME: 'data'
} as const;

// Custom error class for better error handling
class SeederError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'SeederError';
  }
}

/**
 * Validates user data structure
 * @param userData - User data to validate
 * @returns True if valid, throws error if invalid
 */
function validateUserData(userData: UserData): boolean {
  const requiredFields = ['name', 'username', 'email', 'isActive', 'password'];
  
  for (const field of requiredFields) {
    if (!(field in userData)) {
      throw new SeederError(`Missing required field: ${field}`);
    }
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userData.email)) {
    throw new SeederError(`Invalid email format: ${userData.email}`);
  }

  // Password strength validation
  if (userData.password.length < 8) {
    throw new SeederError(`Password too short for user ${userData.email}. Minimum 8 characters required.`);
  }

  return true;
}

/**
 * Gets the absolute path to the data file with proper error handling
 * @returns Absolute path to users.json file
 */
function getDataFilePath(): string {
  try {
    // Use process.cwd() to get the current working directory and construct the path
    const projectRoot = process.cwd();
    const dataDir = path.join(projectRoot,'..', 'dataservice', 'src', SEEDER_CONFIG.DATA_DIR_NAME);
    const dataFilePath = path.join(dataDir, SEEDER_CONFIG.DATA_FILE_NAME);
    
    return path.resolve(dataFilePath);
  } catch (error) {
    throw new SeederError('Failed to resolve data file path', error as Error);
  }
}

/**
 * Reads and parses the users data file with comprehensive error handling
 * @returns Parsed user data array
 */
async function readUsersData(): Promise<UserData[]> {
  const dataFilePath = getDataFilePath();
  
  try {
    // Check if file exists before attempting to read
    await fs.access(dataFilePath);
    
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    const parsedData = JSON.parse(fileContent) as UserData[];
    
    if (!Array.isArray(parsedData)) {
      throw new SeederError('Data file must contain an array of users');
    }
    
    if (parsedData.length === 0) {
      console.warn('Warning: Users data file is empty');
      return [];
    }
    
    // Validate each user entry
    for (const userData of parsedData) {
      validateUserData(userData);
    }
    
    return parsedData;
  } catch (error) {
    if (error instanceof SeederError) {
      throw error;
    }
    
    if (error instanceof Error && error.message.includes('ENOENT')) {
      throw new SeederError(
        `Users data file not found at: ${dataFilePath}. Please ensure the file exists.`,
        error
      );
    }
    
    if (error instanceof SyntaxError) {
      throw new SeederError(
        `Invalid JSON format in users data file at: ${dataFilePath}`,
        error
      );
    }
    
    throw new SeederError(
      `Failed to read users data file at: ${dataFilePath}`,
      error as Error
    );
  }
}

/**
 * Hashes a password using bcrypt with proper error handling
 * @param password - Plain text password to hash
 * @returns Hashed password
 */
async function hashPassword(password: string): Promise<string> {
  try {
    return await bcrypt.hash(password, SEEDER_CONFIG.SALT_ROUNDS);
  } catch (error) {
    throw new SeederError('Failed to hash password', error as Error);
  }
}

/**
 * Creates a single user in the database
 * @param userData - User data to create
 * @returns Promise that resolves when user is created
 */
async function createUser(userData: UserData): Promise<void> {
  try {
    // Debug: Log connection state before database operations
    console.log(`DEBUG: Connection state before checking user ${userData.email}:`, databaseConnection.getConnectionStatus() ? 'CONNECTED' : 'DISCONNECTED');

    // Get database info to verify we're connected to the right database
    try {
      const dbInfo = await databaseConnection.getDatabaseInfo();
      console.log(`DEBUG: Connected to database: ${dbInfo.name}, Collections: [${dbInfo.collections.join(', ')}]`);
    } catch (error) {
      console.log(`DEBUG: Could not get database info: ${error}`);
    }

    // Get connection-specific User model
    const UserModel = getModel.user();
    console.log(`DEBUG: UserModel retrieved successfully for ${userData.email}`);

    // Debug: Check the collection name and model details
    console.log(`DEBUG: Model collection name: ${UserModel.collection.name}`);
    console.log(`DEBUG: Model database name: ${(UserModel.db as any)?.databaseName || 'unknown'}`);

    // Check if user already exists with more detailed debugging
    console.log(`DEBUG: Checking if user ${userData.email} already exists...`);
    console.log(`DEBUG: Query: { email: "${userData.email}" }`);

    let existingUser;
    try {
      existingUser = await UserModel.findOne({ email: userData.email }).exec();
      console.log(`DEBUG: findOne query executed successfully`);
      console.log(`DEBUG: existingUser result:`, existingUser ? {
        _id: existingUser._id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role
      } : 'null');
    } catch (queryError) {
      console.error(`❌ DEBUG: Error executing findOne query:`, queryError);
      throw queryError;
    }

    if (existingUser) {
      console.log(`⚠️ User with email ${userData.email} already exists (ID: ${existingUser._id}), skipping`);
      return;
    }
    console.log(`DEBUG: User ${userData.email} does not exist, proceeding with creation...`);

    // Additional check: Count total documents in collection
    try {
      const totalUsers = await UserModel.countDocuments().exec();
      console.log(`DEBUG: Total users in collection: ${totalUsers}`);
    } catch (countError) {
      console.log(`DEBUG: Could not count documents: ${countError}`);
    }

    // Hash password
    console.log(`DEBUG: Hashing password for ${userData.email}...`);
    const hashedPassword = await hashPassword(userData.password);
    console.log(`DEBUG: Password hashed successfully for ${userData.email}`);

    // Create new user with proper timestamps
    console.log(`DEBUG: Creating new user document for ${userData.email}...`);
    const newUser = new UserModel({
      name: userData.name,
      username: userData.username,
      email: userData.email,
      isActive: userData.isActive,
      password: hashedPassword,
      phone: userData.phone,
      role: userData.role || SEEDER_CONFIG.DEFAULT_ROLE,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log(`DEBUG: User document created, preparing to save...`);
    console.log(`DEBUG: New user data:`, {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      isActive: newUser.isActive
    });

    // Debug: Log connection state before saving
    console.log(`DEBUG: Connection state before saving user ${userData.email}:`, databaseConnection.getConnectionStatus() ? 'CONNECTED' : 'DISCONNECTED');

    console.log(`DEBUG: Attempting to save user ${userData.email} to database...`);
    await newUser.save();
    console.log(`✅ Successfully created user: ${userData.email} (ID: ${newUser._id})`);

    // Verify the user was actually saved
    try {
      const verificationUser = await UserModel.findOne({ email: userData.email }).exec();
      if (verificationUser) {
        console.log(`✅ Verified: User ${userData.email} exists in database after creation`);
      } else {
        console.log(`❌ ERROR: User ${userData.email} was not found in database after creation!`);
      }
    } catch (verifyError) {
      console.log(`DEBUG: Could not verify user creation: ${verifyError}`);
    }

  } catch (error) {
    console.error(`❌ DEBUG: Error creating user ${userData.email}:`, error);
    console.error(`❌ Error details:`, {
      name: error?.name,
      message: error?.message,
      stack: error?.stack
    });
    throw new SeederError(
      `Failed to create user ${userData.email}`,
      error as Error
    );
  }
}

/**
 * Clear model cache to ensure fresh connection
 * This helps when models might be cached from previous connections
 */
async function clearModelCache(): Promise<void> {
  try {
    console.log('DEBUG: Clearing Mongoose model cache...');

    // Delete all models from the cache
    Object.keys(databaseConnection.getMongoose().models).forEach(modelName => {
      delete databaseConnection.getMongoose().models[modelName];
    });

    console.log('DEBUG: Model cache cleared');
  } catch (error) {
    console.log('DEBUG: Error clearing model cache:', error);
  }
}

/**
 * Main function to seed users into the database
 * Implements comprehensive error handling and logging
 */
export async function seedUsers(): Promise<void> {
  try {
    // Debug: Log connection state before connecting
    console.log('DEBUG: Connection state before connecting:', databaseConnection.getConnectionStatus() ? 'CONNECTED' : 'DISCONNECTED');

    // Clear any existing model cache to ensure fresh connection
    await clearModelCache();

    // Initialize database connection using the singleton
    await initializeDatabase();
    console.log('Connected to MongoDB for user seeding');

    // Debug: Log connection state after connecting
    console.log('DEBUG: Connection state after connecting:', databaseConnection.getConnectionStatus() ? 'CONNECTED' : 'DISCONNECTED');

    // Get database info for debugging
    try {
      const dbInfo = await databaseConnection.getDatabaseInfo();
      console.log('DEBUG: Connection database name:', dbInfo.name);
      console.log('DEBUG: Available collections:', dbInfo.collections);
    } catch (error) {
      console.log('DEBUG: Could not get database info:', error);
    }

    // Debug: Check if UserModel is properly registered
    console.log('DEBUG: UserModel exists in database connection');

    // Read and validate users data
    const usersData = await readUsersData();
    console.log(`Found ${usersData.length} users to seed`);

    if (usersData.length === 0) {
      console.log('No users to seed. Exiting...');
      return;
    }

    // Process users with individual error handling
    let successCount = 0;
    let failureCount = 0;

    for (const userData of usersData) {
      try {
        await createUser(userData);
        successCount++;
      } catch (userError) {
        console.error(`Error processing user ${userData.email}:`, userError);
        failureCount++;
        // Continue with next user even if one fails
      }
    }

    console.log(`User seeding completed. Success: ${successCount}, Failures: ${failureCount}`);

    if (failureCount > 0) {
      console.warn(`Warning: ${failureCount} users failed to seed`);
    }

  } catch (error) {
    console.error('Error during user seeding:', error);
    throw error;
  } finally {
    // Ensure database connection is always closed using the singleton
    try {
      await closeDatabase();
      console.log('Disconnected from MongoDB after user seeding');
    } catch (disconnectError) {
      console.error('Error disconnecting from MongoDB:', disconnectError);
    }
  }
}

/**
 * Utility function to reset all seeded users (for testing purposes)
 * @param confirm - Confirmation flag to prevent accidental deletion
 */
export async function resetSeededUsers(confirm: boolean = false): Promise<void> {
  if (!confirm) {
    throw new SeederError('Confirmation required to reset seeded users. Call with confirm=true');
  }

  try {
    // Debug: Log connection state before connecting
    console.log('DEBUG: Reset - Connection state before connecting:', databaseConnection.getConnectionStatus() ? 'CONNECTED' : 'DISCONNECTED');
    
    // Initialize database connection using the singleton
    await initializeDatabase();
    
    // Debug: Log connection state after connecting
    console.log('DEBUG: Reset - Connection state after connecting:', databaseConnection.getConnectionStatus() ? 'CONNECTED' : 'DISCONNECTED');
    
    // Get database info for debugging
    try {
      const dbInfo = await databaseConnection.getDatabaseInfo();
      console.log('DEBUG: Reset - Connection database name:', dbInfo.name);
    } catch (error) {
      console.log('DEBUG: Reset - Could not get database info:', error);
    }
    
    // Get connection-specific User model
    const UserModel = getModel.user();
    
    const result = await UserModel.deleteMany({ role: SEEDER_CONFIG.DEFAULT_ROLE });
    console.log(`Deleted ${result.deletedCount} seeded users`);
    
  } catch (error) {
    console.error('Error resetting seeded users:', error);
    throw error;
  } finally {
    // Ensure database connection is always closed using the singleton
    try {
      await closeDatabase();
    } catch (disconnectError) {
      console.error('Error disconnecting from MongoDB:', disconnectError);
    }
  }
}