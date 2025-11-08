import { verifyPassword, hashPassword } from '@educatedplanet/common';
import { IUserDocument } from '../datamodels/schemas/user-clean.schema';
import jwt from 'jsonwebtoken';
import { databaseConnection } from '../datamodels/connections';

// JWT Secret - should be passed from environment
const JWT_SECRET = process.env.BETTER_AUTH_SECRET || 'a2a4e2194f2a74f802107d2ab13f19cfe0540874ca805f2b435bdb8a210ea3b3';

// Ensure database is initialized
let dbInitialized = false;
async function ensureDbInitialized() {
  if (!dbInitialized) {
    try {
      await databaseConnection.connect();
      dbInitialized = true;
      console.log('Database initialized in auth service');
    } catch (error) {
      console.error('Failed to initialize database in auth service:', error);
      throw error;
    }
  }
}

// Session interface
export interface AuthSession {
  token: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

// User session response
export interface UserSessionResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  session: {
    token: string;
    expiresAt: Date;
  };
}

/**
 * Authenticate user with email and password
 */
export async function authenticateUser(email: string, password: string): Promise<UserSessionResponse | null> {
  try {
    // Ensure database is initialized
    await ensureDbInitialized();

    console.log('Authenticating user:', email);

    // Find user by email
    const UserModel = databaseConnection.getUserModel();
    const user = await UserModel.findOne({
      email: email.toLowerCase().trim(),
      isActive: true,
      isDeleted: { $ne: true }
    }).lean();

    if (!user || !user.password) {
      console.log('User not found or no password');
      return null;
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      console.log('Password verification failed');
      return null;
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role || 'admin',
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const sessionData = {
      token,
      userId: user._id.toString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdAt: new Date(),
    };

    // Store session in database (using the connection directly since sessions might not be in UserModel)
    const db = databaseConnection.getDb();
    await db.collection('admin_sessions').insertOne(sessionData);

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role || 'admin',
      },
      session: {
        token,
        expiresAt: sessionData.expiresAt,
      },
    };
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}

/**
 * Validate session token
 */
export async function validateSession(token: string): Promise<UserSessionResponse | null> {
  try {
    // Ensure database is initialized
    await ensureDbInitialized();

    console.log('Validating session token');

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Check if session exists in database
    const db = databaseConnection.getDb();
    const session = await db.collection('admin_sessions').findOne({
      token,
      expiresAt: { $gt: new Date() },
    });

    if (!session) {
      return null;
    }

    // Get user from database
    const UserModel = databaseConnection.getUserModel();
    const user = await UserModel.findOne({
      _id: decoded.id,
      isActive: true,
      isDeleted: { $ne: true },
    }).lean();

    if (!user) {
      return null;
    }

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role || 'admin',
      },
      session: {
        token,
        expiresAt: session.expiresAt,
      },
    };
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
}

/**
 * Invalidate session (logout)
 */
export async function invalidateSession(token: string): Promise<boolean> {
  try {
    await ensureDbInitialized();
    console.log('Invalidating session');

    const db = databaseConnection.getDb();
    const result = await db.collection('admin_sessions').deleteOne({ token });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Session invalidation error:', error);
    return false;
  }
}

/**
 * Check if user exists by email
 */
export async function userExists(email: string): Promise<boolean> {
  try {
    // Ensure database is initialized
    await ensureDbInitialized();

    const UserModel = databaseConnection.getUserModel();
    const user = await UserModel.findOne({
      email: email.toLowerCase().trim(),
      isActive: true,
      isDeleted: { $ne: true }
    }).select('_id').lean();

    return !!user;
  } catch (error) {
    console.error('User existence check error:', error);
    return false;
  }
}