"use strict";
/**
 * Database connection exports
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModel = exports.defaultConfig = exports.closeDatabase = exports.initializeDatabase = exports.databaseConnection = exports.DatabaseConnection = void 0;
const database_1 = require("./database");
var database_2 = require("./database");
Object.defineProperty(exports, "DatabaseConnection", { enumerable: true, get: function () { return database_2.DatabaseConnection; } });
Object.defineProperty(exports, "databaseConnection", { enumerable: true, get: function () { return database_2.databaseConnection; } });
Object.defineProperty(exports, "initializeDatabase", { enumerable: true, get: function () { return database_2.initializeDatabase; } });
Object.defineProperty(exports, "closeDatabase", { enumerable: true, get: function () { return database_2.closeDatabase; } });
Object.defineProperty(exports, "defaultConfig", { enumerable: true, get: function () { return database_2.defaultConfig; } });
// Re-export model getter methods for convenience
exports.getModel = {
    user: () => database_1.databaseConnection.getUserModel(),
    tutor: () => database_1.databaseConnection.getTutorModel(),
    review: () => database_1.databaseConnection.getReviewModel(),
    class: () => database_1.databaseConnection.getClassModel(),
    subject: () => database_1.databaseConnection.getSubjectModel(),
};
//# sourceMappingURL=index.js.map