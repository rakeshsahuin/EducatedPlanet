"use strict";
/**
 * Main entry point for @educatedplanet/dataservice package
 * Exports all services and database management functionality
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewService = exports.ReviewService = exports.tutorService = exports.TutorService = exports.userService = exports.UserService = exports.databaseService = exports.DatabaseService = void 0;
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
//# sourceMappingURL=index.js.map