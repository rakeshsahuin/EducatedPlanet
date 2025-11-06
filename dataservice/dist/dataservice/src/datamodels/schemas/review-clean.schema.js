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
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
/**
 * Review schema definition
 */
const reviewSchema = new mongoose_1.Schema({
    tutorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Tutor',
        required: [true, 'Tutor ID is required']
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
    },
    comment: {
        type: String,
        required: [true, 'Comment is required'],
        trim: true,
        maxlength: [2000, 'Comment cannot exceed 2000 characters']
    },
    studentName: {
        type: String,
        required: [true, 'Student name is required'],
        trim: true,
        maxlength: [100, 'Student name cannot exceed 100 characters']
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    isHidden: {
        type: Boolean,
        default: false,
        select: false
    },
    helpfulCount: {
        type: Number,
        default: 0,
        min: 0
    },
    reportedCount: {
        type: Number,
        default: 0,
        min: 0,
        select: false
    },
    moderatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        select: false
    },
    moderatedAt: {
        type: Date,
        select: false
    },
    moderationNotes: {
        type: String,
        trim: true,
        select: false
    },
    tutorResponse: {
        content: {
            type: String,
            trim: true,
            maxlength: [1000, 'Response cannot exceed 1000 characters']
        },
        respondedAt: {
            type: Date
        },
        isPublic: {
            type: Boolean,
            default: true
        }
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (_doc, ret) {
            const { __v, ...clean } = ret;
            return clean;
        }
    },
    toObject: { virtuals: true }
});
exports.reviewSchema = reviewSchema;
// Compound indexes
reviewSchema.index({ tutorId: 1, isApproved: 1 });
reviewSchema.index({ userId: 1, tutorId: 1 }, { unique: true }); // One review per user per tutor
reviewSchema.index({ tutorId: 1, rating: 1 });
reviewSchema.index({ createdAt: -1 });
// Virtual for review URL
reviewSchema.virtual('reviewUrl').get(function () {
    return `/tutors/${this.tutorId}/reviews/${this._id}`;
});
// Register the model
mongoose_1.default.model('Review', reviewSchema);
//# sourceMappingURL=review-clean.schema.js.map