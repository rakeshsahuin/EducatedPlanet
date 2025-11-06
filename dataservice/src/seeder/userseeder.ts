import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { promises as fs } from 'fs';
import * as path from 'path';
import { UserModel } from '../datamodels/models/user.model';

// Enhanced interface with better type safety
interface UserData {
  name: string;
  username: string;
  email: string;
  isActive: boolean;
  password: string;
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
    // Use CommonJS approach with __dirname
    const dataDir = path.join(__dirname, '..', SEEDER_CONFIG.DATA_DIR_NAME);
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
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: userData.email });
    if (existingUser) {
      console.log(`User with email ${userData.email} already exists, skipping`);
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password);

    // Create new user with proper timestamps
    const newUser = new UserModel({
      name: userData.name,
      username: userData.username,
      email: userData.email,
      isActive: userData.isActive,
      password: hashedPassword,
      role: userData.role || SEEDER_CONFIG.DEFAULT_ROLE,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newUser.save();
    console.log(`Successfully created user: ${userData.email}`);
  } catch (error) {
    throw new SeederError(
      `Failed to create user ${userData.email}`,
      error as Error
    );
  }
}

/**
 * Main function to seed users into the database
 * Implements comprehensive error handling and logging
 */
export async function seedUsers(): Promise<void> {
  let mongoConnection: typeof mongoose | null = null;
  
  try {
    // Validate environment variables
    const mongoConnectionString = process.env.MONGODB_URI;
    if (!mongoConnectionString) {
      throw new SeederError('MONGODB_URI environment variable is not set');
    }

    // Connect to MongoDB with connection timeout
    mongoConnection = await mongoose.connect(mongoConnectionString, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      connectTimeoutMS: 10000, // 10 second timeout
    });
    console.log('Connected to MongoDB for user seeding');

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
    // Ensure MongoDB connection is always closed
    if (mongoConnection) {
      try {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB after user seeding');
      } catch (disconnectError) {
        console.error('Error disconnecting from MongoDB:', disconnectError);
      }
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

  let mongoConnection: typeof mongoose | null = null;
  
  try {
    const mongoConnectionString = process.env.MONGODB_URI;
    if (!mongoConnectionString) {
      throw new SeederError('MONGODB_URI environment variable is not set');
    }

    mongoConnection = await mongoose.connect(mongoConnectionString);
    
    const result = await UserModel.deleteMany({ role: SEEDER_CONFIG.DEFAULT_ROLE });
    console.log(`Deleted ${result.deletedCount} seeded users`);
    
  } catch (error) {
    console.error('Error resetting seeded users:', error);
    throw error;
  } finally {
    if (mongoConnection) {
      await mongoose.disconnect();
    }
  }
}