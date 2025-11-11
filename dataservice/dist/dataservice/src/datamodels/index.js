"use strict";
/**
 * Main entry point for @educatedplanet/datamodels package
 * Exports all schemas, models, and database connection utilities
 */
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectQueries = exports.ClassQueries = exports.ReviewQueries = exports.TutorQueries = exports.UserQueries = exports.ReviewModel = exports.TutorModel = exports.UserModel = exports.subjectSchema = exports.classSchema = exports.reviewSchema = exports.tutorSchema = exports.userSchema = exports.closeDatabase = exports.initializeDatabase = exports.databaseConnection = exports.DatabaseConnection = void 0;
// Export database connection utilities
__exportStar(require("./connections"), exports);
// Export schemas
__exportStar(require("./schemas"), exports);
// Export models
__exportStar(require("./models"), exports);
// Re-export commonly used items for convenience
var connections_1 = require("./connections");
Object.defineProperty(exports, "DatabaseConnection", { enumerable: true, get: function () { return connections_1.DatabaseConnection; } });
Object.defineProperty(exports, "databaseConnection", { enumerable: true, get: function () { return connections_1.databaseConnection; } });
Object.defineProperty(exports, "initializeDatabase", { enumerable: true, get: function () { return connections_1.initializeDatabase; } });
Object.defineProperty(exports, "closeDatabase", { enumerable: true, get: function () { return connections_1.closeDatabase; } });
var schemas_1 = require("./schemas");
Object.defineProperty(exports, "userSchema", { enumerable: true, get: function () { return schemas_1.userSchema; } });
Object.defineProperty(exports, "tutorSchema", { enumerable: true, get: function () { return schemas_1.tutorSchema; } });
Object.defineProperty(exports, "reviewSchema", { enumerable: true, get: function () { return schemas_1.reviewSchema; } });
Object.defineProperty(exports, "classSchema", { enumerable: true, get: function () { return schemas_1.classSchema; } });
Object.defineProperty(exports, "subjectSchema", { enumerable: true, get: function () { return schemas_1.subjectSchema; } });
var models_1 = require("./models");
Object.defineProperty(exports, "UserModel", { enumerable: true, get: function () { return models_1.UserModel; } });
Object.defineProperty(exports, "TutorModel", { enumerable: true, get: function () { return models_1.TutorModel; } });
Object.defineProperty(exports, "ReviewModel", { enumerable: true, get: function () { return models_1.ReviewModel; } });
Object.defineProperty(exports, "UserQueries", { enumerable: true, get: function () { return models_1.UserQueries; } });
Object.defineProperty(exports, "TutorQueries", { enumerable: true, get: function () { return models_1.TutorQueries; } });
Object.defineProperty(exports, "ReviewQueries", { enumerable: true, get: function () { return models_1.ReviewQueries; } });
Object.defineProperty(exports, "ClassQueries", { enumerable: true, get: function () { return models_1.ClassQueries; } });
Object.defineProperty(exports, "SubjectQueries", { enumerable: true, get: function () { return models_1.SubjectQueries; } });
//# sourceMappingURL=index.js.map