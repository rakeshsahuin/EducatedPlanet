"use strict";
/**
 * Model exports for datamodels package
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectModel = exports.ClassModel = exports.SubjectQueries = exports.getSubjectModel = exports.ClassQueries = exports.getClassModel = exports.ReviewQueries = exports.ReviewModel = exports.TutorQueries = exports.TutorModel = exports.UserQueries = exports.UserModel = void 0;
var user_model_1 = require("./user.model");
Object.defineProperty(exports, "UserModel", { enumerable: true, get: function () { return user_model_1.UserModel; } });
Object.defineProperty(exports, "UserQueries", { enumerable: true, get: function () { return user_model_1.UserQueries; } });
var tutor_model_1 = require("./tutor.model");
Object.defineProperty(exports, "TutorModel", { enumerable: true, get: function () { return tutor_model_1.TutorModel; } });
Object.defineProperty(exports, "TutorQueries", { enumerable: true, get: function () { return tutor_model_1.TutorQueries; } });
var review_model_1 = require("./review.model");
Object.defineProperty(exports, "ReviewModel", { enumerable: true, get: function () { return review_model_1.ReviewModel; } });
Object.defineProperty(exports, "ReviewQueries", { enumerable: true, get: function () { return review_model_1.ReviewQueries; } });
var class_model_1 = require("./class.model");
Object.defineProperty(exports, "getClassModel", { enumerable: true, get: function () { return class_model_1.getClassModel; } });
Object.defineProperty(exports, "ClassQueries", { enumerable: true, get: function () { return class_model_1.ClassQueries; } });
var subject_model_1 = require("./subject.model");
Object.defineProperty(exports, "getSubjectModel", { enumerable: true, get: function () { return subject_model_1.getSubjectModel; } });
Object.defineProperty(exports, "SubjectQueries", { enumerable: true, get: function () { return subject_model_1.SubjectQueries; } });
// Legacy exports for backward compatibility
var class_model_2 = require("./class.model");
Object.defineProperty(exports, "ClassModel", { enumerable: true, get: function () { return class_model_2.ClassModel; } });
var subject_model_2 = require("./subject.model");
Object.defineProperty(exports, "SubjectModel", { enumerable: true, get: function () { return subject_model_2.SubjectModel; } });
//# sourceMappingURL=index.js.map