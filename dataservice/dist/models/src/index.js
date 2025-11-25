"use strict";
/**
 * Main entry point for @educatedplanet/models package
 * Exports all types and interfaces used across the EducatedPlanet platform
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
exports.SubjectCategory = exports.ClassCategory = void 0;
// Export tutor-related types
__exportStar(require("./tutor/tutor.types"), exports);
__exportStar(require("./tutor/admin.types"), exports);
// Export user-related types
__exportStar(require("./user/user.types"), exports);
// Export class-related types
__exportStar(require("./class/types"), exports);
// Export subject-related types
__exportStar(require("./subject/types"), exports);
// Export common types
__exportStar(require("./common/common.types"), exports);
var types_1 = require("./class/types");
Object.defineProperty(exports, "ClassCategory", { enumerable: true, get: function () { return types_1.ClassCategory; } });
var common_types_1 = require("./common/common.types");
Object.defineProperty(exports, "SubjectCategory", { enumerable: true, get: function () { return common_types_1.SubjectCategory; } });
//# sourceMappingURL=index.js.map