import mongoose, { Schema, Document } from 'mongoose';
import validator from 'validator';
import { User } from '@educatedplanet/models';

/**
 * User document interface
 */
export interface IUserDocument extends Omit<User, 'id'>, Document {
  password?: string;
  verificationOTP?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  lastLoginAt?: Date;
  loginAttempts?: number;
  lockUntil?: Date;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User schema definition
 */
const userSchema = new Schema<IUserDocument>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v: string) {
        return !v || validator.isEmail(v);
      },
      message: 'Invalid email format'
    }
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v: string) {
        return validator.isMobilePhone(v, 'any', { strictMode: false });
      },
      message: 'Invalid phone number format'
    }
  },
  role: {
    type: String,
    enum: ['user', 'tutor', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters long']
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  verificationOTP: {
    type: String,
    select: false
  },
  resetPasswordToken: {
    type: String,
    select: false
  },
  resetPasswordExpires: {
    type: Date,
    select: false
  },
  lastLoginAt: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0,
    select: false
  },
  lockUntil: {
    type: Date,
    select: false
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
      // Remove sensitive fields
      const { password, verificationOTP, resetPasswordToken, loginAttempts, lockUntil, __v, ...clean } = ret;
      return clean;
    }
  },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1, isDeleted: 1 });

// Virtual for profile URL
userSchema.virtual('profileUrl').get(function() {
  return `/users/${this._id}`;
});

// Register the model
mongoose.model<IUserDocument>('User', userSchema);

// Export only the schema
export { userSchema };