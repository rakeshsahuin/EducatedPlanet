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
exports.tutorSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
/**
 * Tutor schema definition
 */
const tutorSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    photo: {
        type: String,
        required: [true, 'Photo is required']
    },
    subjects: [{
            type: String,
            trim: true,
            required: true
        }],
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    teachingModes: [{
            type: String,
            enum: ['online', 'offline', 'both']
        }],
    location: {
        areas: [{
                type: String,
                trim: true
            }],
        city: {
            type: String,
            required: [true, 'City is required'],
            trim: true
        }
    },
    experience: {
        type: String,
        required: [true, 'Experience is required'],
        trim: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    price: {
        min: {
            type: Number,
            required: [true, 'Minimum price is required'],
            min: 0
        },
        max: {
            type: Number,
            required: [true, 'Maximum price is required'],
            min: 0
        },
        currency: {
            type: String,
            default: '₹'
        }
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'suspended'],
        default: 'pending'
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    verification: {
        isApproved: {
            type: Boolean,
            default: false
        },
        approvedBy: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        },
        approvedAt: {
            type: Date
        },
        rejectedAt: {
            type: Date
        },
        rejectionReason: {
            type: String,
            trim: true
        }
    },
    analytics: {
        profileViews: {
            type: Number,
            default: 0,
            min: 0
        },
        contactViews: {
            type: Number,
            default: 0,
            min: 0
        },
        connects: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
        select: false
    },
    deletedAt: {
        type: Date,
        select: false
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
exports.tutorSchema = tutorSchema;
// Indexes
tutorSchema.index({ userId: 1 });
tutorSchema.index({ status: 1 });
tutorSchema.index({ 'verification.isApproved': 1 });
tutorSchema.index({ isActive: 1, isDeleted: 1 });
tutorSchema.index({ 'rating.average': -1 });
tutorSchema.index({ 'location.city': 1 });
tutorSchema.index({ subjects: 1 });
// Virtual for profile URL
tutorSchema.virtual('profileUrl').get(function () {
    return `/tutors/${this._id}`;
});
// Register the model only if it doesn't already exist
if (!mongoose_1.default.models.Tutor) {
    mongoose_1.default.model('Tutor', tutorSchema);
}
//# sourceMappingURL=tutor-clean.schema.js.map