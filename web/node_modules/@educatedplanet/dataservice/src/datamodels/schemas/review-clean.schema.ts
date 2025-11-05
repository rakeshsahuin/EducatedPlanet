import mongoose, { Schema, Document } from 'mongoose';
import { Review } from '@educatedplanet/models';

/**
 * Review document interface
 */
export interface IReviewDocument extends Omit<Review, 'id' | 'tutorId' | 'userId'>, Document {
  tutorId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  isApproved: boolean;
  isPublic: boolean;
  isHidden: boolean;
  helpfulCount: number;
  reportedCount: number;
  moderatedBy?: mongoose.Types.ObjectId;
  moderatedAt?: Date;
  moderationNotes?: string;
  tutorResponse?: {
    content: string;
    respondedAt: Date;
    isPublic: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Review schema definition
 */
const reviewSchema = new Schema<IReviewDocument>({
  tutorId: {
    type: Schema.Types.ObjectId,
    ref: 'Tutor',
    required: [true, 'Tutor ID is required'],
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
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
    default: false,
    index: true
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
    type: Schema.Types.ObjectId,
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
    transform: function(_doc, ret) {
      const { __v, ...clean } = ret;
      return clean;
    }
  },
  toObject: { virtuals: true }
});

// Compound indexes
reviewSchema.index({ tutorId: 1, isApproved: 1 });
reviewSchema.index({ userId: 1, tutorId: 1 }, { unique: true }); // One review per user per tutor
reviewSchema.index({ tutorId: 1, rating: 1 });
reviewSchema.index({ createdAt: -1 });

// Virtual for review URL
reviewSchema.virtual('reviewUrl').get(function() {
  return `/tutors/${this.tutorId}/reviews/${this._id}`;
});

// Register the model
mongoose.model<IReviewDocument>('Review', reviewSchema);

// Export only the schema
export { reviewSchema };