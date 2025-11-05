"use strict";
/**
 * Database connection exports
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = exports.closeDatabase = exports.initializeDatabase = exports.databaseConnection = exports.DatabaseConnection = void 0;
var database_1 = require("./database");
Object.defineProperty(exports, "DatabaseConnection", { enumerable: true, get: function () { return database_1.DatabaseConnection; } });
Object.defineProperty(exports, "databaseConnection", { enumerable: true, get: function () { return database_1.databaseConnection; } });
Object.defineProperty(exports, "initializeDatabase", { enumerable: true, get: function () { return database_1.initializeDatabase; } });
Object.defineProperty(exports, "closeDatabase", { enumerable: true, get: function () { return database_1.closeDatabase; } });
Object.defineProperty(exports, "defaultConfig", { enumerable: true, get: function () { return database_1.defaultConfig; } });
//# sourceMappingURL=index.js.map