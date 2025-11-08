import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';
import { hashPassword, verifyPassword } from '@educatedplanet/common';

// MongoDB connection
const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/eduplanet';
const client = new MongoClient(mongoUrl);
const db = client.db('eduplanet');

// Custom password hashing using bcrypt from common package
const customPasswordHash = {
  hash: async (password: string) => {
    return hashPassword(password);
  },
  verify: async (password: string, hash: string) => {
    return verifyPassword(password, hash);
  },
};

// Better Auth server configuration
export const authConfig = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Admin users don't need email verification
    minPasswordLength: 8,
    maxPasswordLength: 128,
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
    hash: customPasswordHash.hash,
    verify: customPasswordHash.verify,
  },
  // Add additional user fields
  user: {
    additionalFields: {
      username: {
        type: 'string',
        required: false,
      },
      role: {
        type: 'string',
        defaultValue: 'admin',
      },
    },
  },
});

// Export the handler for API routes
export const { handler } = authConfig;