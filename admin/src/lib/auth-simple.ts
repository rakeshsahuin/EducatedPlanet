import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';
import { hashPassword, verifyPassword } from '@educatedplanet/common';

// MongoDB connection
const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/eduplanet';
const client = new MongoClient(mongoUrl);
const db = client.db('eduplanet');

// Create a simple MongoDB adapter that works with existing users
const adapter = mongodbAdapter(db);

// Better Auth server configuration
export const authConfig = betterAuth({
  database: adapter,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Admin users don't need email verification
    minPasswordLength: 6, // Match existing password validation
    maxPasswordLength: 128,
    // Custom verification to work with existing user schema
    verifyPassword: async (password: string, hashedPassword: string) => {
      return verifyPassword(password, hashedPassword);
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
    cookieName: 'eduplanet-admin-session',
  },
  account: {
    accountLinking: {
      enabled: false,
    },
  },
  socialProviders: {}, // No social providers for admin
  advanced: {
    generateId: false, // Use MongoDB's default _id
    crossSubDomainCookies: {
      enabled: false,
    },
  },
  trustedOrigins: [
    'http://localhost:3000',
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ],
  // Custom password hashing
  password: {
    hash: hashPassword,
    verify: verifyPassword,
  },
  // Don't use additional fields to keep it simple
  user: {
    modelName: 'User',
    fields: {
      email: 'email',
      password: 'password',
      name: 'name',
    },
  },
});

// Export the handler for API routes
export const { handler } = authConfig;