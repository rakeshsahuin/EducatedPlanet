"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedUsers = seedUsers;
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const user_model_1 = require("../datamodels/models/user.model");
async function seedUsers() {
    try {
        // Get MongoDB connection string from environment
        const mongoConnectionString = process.env.MONGODB_URI;
        if (!mongoConnectionString) {
            throw new Error('MONGODB_URI environment variable is not set');
        }
        // Connect to MongoDB
        await mongoose_1.default.connect(mongoConnectionString);
        console.log('Connected to MongoDB for user seeding');
        // Read users.json file
        const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');
        const usersData = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
        console.log(`Found ${usersData.length} users to seed`);
        // Process each user
        for (const userData of usersData) {
            try {
                // Check if user already exists by email
                const existingUser = await user_model_1.UserModel.findOne({ email: userData.email });
                if (existingUser) {
                    console.log(`User with email ${userData.email} already exists, skipping`);
                    continue;
                }
                // Hash password with bcrypt (salt rounds of 12 for security)
                const saltRounds = 12;
                const hashedPassword = await bcryptjs_1.default.hash(userData.password, saltRounds);
                // Create new user
                const newUser = new user_model_1.UserModel({
                    name: userData.name,
                    username: userData.username,
                    email: userData.email,
                    isActive: userData.isActive,
                    password: hashedPassword,
                    role: 'admin', // Default role for seeded users
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                await newUser.save();
                console.log(`Successfully created user: ${userData.email}`);
            }
            catch (userError) {
                console.error(`Error processing user ${userData.email}:`, userError);
                // Continue with next user even if one fails
            }
        }
        console.log('User seeding completed successfully');
    }
    catch (error) {
        console.error('Error during user seeding:', error);
        throw error;
    }
    finally {
        // Close MongoDB connection
        await mongoose_1.default.disconnect();
        console.log('Disconnected from MongoDB after user seeding');
    }
}
//# sourceMappingURL=userseeder.js.map