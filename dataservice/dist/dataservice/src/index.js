"use strict";
/**
 * Main entry point for @educatedplanet/dataservice package
 * Exports all services and database management functionality
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedUsers = exports.reviewSchema = exports.tutorSchema = exports.userSchema = exports.closeDatabase = exports.initializeDatabase = exports.databaseConnection = exports.DatabaseConnection = exports.ReviewQueries = exports.TutorQueries = exports.UserQueries = exports.ReviewModel = exports.TutorModel = exports.UserModel = exports.reviewService = exports.ReviewService = exports.tutorService = exports.TutorService = exports.userService = exports.UserService = exports.databaseService = exports.DatabaseService = void 0;
// Database service
var database_service_1 = require("./services/database.service");
Object.defineProperty(exports, "DatabaseService", { enumerable: true, get: function () { return database_service_1.DatabaseService; } });
Object.defineProperty(exports, "databaseService", { enumerable: true, get: function () { return database_service_1.databaseService; } });
// User service
var user_service_1 = require("./services/user.service");
Object.defineProperty(exports, "UserService", { enumerable: true, get: function () { return user_service_1.UserService; } });
Object.defineProperty(exports, "userService", { enumerable: true, get: function () { return user_service_1.userService; } });
// Tutor service
var tutor_service_1 = require("./services/tutor.service");
Object.defineProperty(exports, "TutorService", { enumerable: true, get: function () { return tutor_service_1.TutorService; } });
Object.defineProperty(exports, "tutorService", { enumerable: true, get: function () { return tutor_service_1.tutorService; } });
// Review service
var review_service_1 = require("./services/review.service");
Object.defineProperty(exports, "ReviewService", { enumerable: true, get: function () { return review_service_1.ReviewService; } });
Object.defineProperty(exports, "reviewService", { enumerable: true, get: function () { return review_service_1.reviewService; } });
// Export datamodels
var datamodels_1 = require("./datamodels");
Object.defineProperty(exports, "UserModel", { enumerable: true, get: function () { return datamodels_1.UserModel; } });
Object.defineProperty(exports, "TutorModel", { enumerable: true, get: function () { return datamodels_1.TutorModel; } });
Object.defineProperty(exports, "ReviewModel", { enumerable: true, get: function () { return datamodels_1.ReviewModel; } });
Object.defineProperty(exports, "UserQueries", { enumerable: true, get: function () { return datamodels_1.UserQueries; } });
Object.defineProperty(exports, "TutorQueries", { enumerable: true, get: function () { return datamodels_1.TutorQueries; } });
Object.defineProperty(exports, "ReviewQueries", { enumerable: true, get: function () { return datamodels_1.ReviewQueries; } });
Object.defineProperty(exports, "DatabaseConnection", { enumerable: true, get: function () { return datamodels_1.DatabaseConnection; } });
Object.defineProperty(exports, "databaseConnection", { enumerable: true, get: function () { return datamodels_1.databaseConnection; } });
Object.defineProperty(exports, "initializeDatabase", { enumerable: true, get: function () { return datamodels_1.initializeDatabase; } });
Object.defineProperty(exports, "closeDatabase", { enumerable: true, get: function () { return datamodels_1.closeDatabase; } });
Object.defineProperty(exports, "userSchema", { enumerable: true, get: function () { return datamodels_1.userSchema; } });
Object.defineProperty(exports, "tutorSchema", { enumerable: true, get: function () { return datamodels_1.tutorSchema; } });
Object.defineProperty(exports, "reviewSchema", { enumerable: true, get: function () { return datamodels_1.reviewSchema; } });
// Export seeder
var userseeder_1 = require("./seeder/userseeder");
Object.defineProperty(exports, "seedUsers", { enumerable: true, get: function () { return userseeder_1.seedUsers; } });
//# sourceMappingURL=index.js.map