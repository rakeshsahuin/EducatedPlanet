import mongoose, { Schema, Document } from 'mongoose';
import validator from 'validator';
import { User } from '@educatedplanet/models';

/**
 * Profile document interface
 */
export interface IUserProfileDocument {
  avatar?: string;
  bio?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  address?: {
    street?: string;
    area: string;
    city: string;
    state: string;
    pincode?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      marketing: boolean;
      tutorUpdates: boolean;
    };
    language: 'en' | 'hi' | 'or';
    timezone: string;
    privacy: {
      profileVisibility: 'public' | 'private';
      showPhone: boolean;
      showEmail: boolean;
      allowDirectMessages: boolean;
    };
  };
}

/**
 * User document interface
 */
export interface IUserDocument extends Omit<User, 'id'>, Document {
  password?: string;
  verificationOTP?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLoginAt?: Date;
  loginAttempts?: number;
  lockUntil?: Date;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  profile?: IUserProfileDocument;
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
    enum: ['user', 'tutor', 'sub-admin', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: ''
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
  },
  profile: {
    avatar: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    dateOfBirth: {
      type: Date
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: false
    },
    address: {
      street: {
        type: String,
        trim: true
      },
      area: {
        type: String,
        trim: true
      },
      city: {
        type: String,
        trim: true
      },
      state: {
        type: String,
        trim: true
      },
      pincode: {
        type: String,
        trim: true
      },
      coordinates: {
        latitude: {
          type: Number,
          min: -90,
          max: 90
        },
        longitude: {
          type: Number,
          min: -180,
          max: 180
        }
      }
    },
    preferences: {
      notifications: {
        email: {
          type: Boolean,
          default: true
        },
        sms: {
          type: Boolean,
          default: true
        },
        push: {
          type: Boolean,
          default: true
        },
        marketing: {
          type: Boolean,
          default: false
        },
        tutorUpdates: {
          type: Boolean,
          default: true
        }
      },
      language: {
        type: String,
        enum: ['en', 'hi', 'or'],
        default: 'en'
      },
      timezone: {
        type: String,
        default: 'Asia/Kolkata'
      },
      privacy: {
        profileVisibility: {
          type: String,
          enum: ['public', 'private'],
          default: 'public'
        },
        showPhone: {
          type: Boolean,
          default: false
        },
        showEmail: {
          type: Boolean,
          default: false
        },
        allowDirectMessages: {
          type: Boolean,
          default: true
        }
      }
    }
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
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1, isDeleted: 1 });

// Virtual for profile URL
userSchema.virtual('profileUrl').get(function() {
  return `/users/${this._id}`;
});

// Register the model only if it doesn't already exist
if (!mongoose.models.users) {
  mongoose.model<IUserDocument>('users', userSchema);
}

// Export only the schema
export { userSchema };