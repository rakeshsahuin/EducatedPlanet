import mongoose, { Schema, Document } from 'mongoose';
import { Tutor } from '@educatedplanet/models';

/**
 * Tutor document interface
 */
export interface ITutorDocument extends Omit<Tutor, 'id'>, Document {
  userId?: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  isFeatured: boolean;
  verification: {
    isApproved: boolean;
    approvedBy?: mongoose.Types.ObjectId;
    approvedAt?: Date;
    rejectedAt?: Date;
    rejectionReason?: string;
  };
  analytics: {
    profileViews: number;
    contactViews: number;
    connects: number;
  };
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Tutor schema definition
 */
const tutorSchema = new Schema<ITutorDocument>({
  userId: {
    type: Schema.Types.ObjectId,
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
      type: Schema.Types.ObjectId,
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
    transform: function(_doc, ret) {
      const { __v, ...clean } = ret;
      return clean;
    }
  },
  toObject: { virtuals: true }
});

// Indexes
tutorSchema.index({ userId: 1 });
tutorSchema.index({ status: 1 });
tutorSchema.index({ 'verification.isApproved': 1 });
tutorSchema.index({ isActive: 1, isDeleted: 1 });
tutorSchema.index({ 'rating.average': -1 });
tutorSchema.index({ 'location.city': 1 });
tutorSchema.index({ subjects: 1 });

// Virtual for profile URL
tutorSchema.virtual('profileUrl').get(function() {
  return `/tutors/${this._id}`;
});

// Register the model only if it doesn't already exist
if (!mongoose.models.Tutor) {
  mongoose.model<ITutorDocument>('Tutor', tutorSchema);
}

// Export only the schema
export { tutorSchema };