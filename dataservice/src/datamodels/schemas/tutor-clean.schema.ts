import mongoose, { Schema, Document, Types } from 'mongoose';

/**
 * Interface for approved/pending tutor data
 */
export interface TutorData {
  basicInfo: {
    firstName: string;
    lastName: string;
    title: string;
    shortDescription: string;
    longDescription: string;
    photo?: string;
    experienceYears?: number;
  };
  subjects: Array<{
    subjectId: Types.ObjectId;
    classIds: Types.ObjectId[];
    ageFrom: number;
    ageTo: number;
    isAcademic: boolean;
    proficiency: 'beginner' | 'intermediate' | 'advanced';
  }>;
  experience: Array<{
    title: string;
    institution: string;
    yearFrom: Date;
    yearTo?: Date;
    isPresent: boolean;
    description?: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: number;
    field: string;
  }>;
  contactDetails: {
    phone: string;
    whatsapp?: string;
    email: string;
    preferredContact: 'phone' | 'email' | 'whatsapp';
  };
  socialMediaLinks: {
    facebook?: string;
    linkedin?: string;
    instagram?: string;
    personalWebsite?: string;
  };
  location: {
    areas: string[];
    city: string;
    state: string;
    coordinates?: {
      type: 'Point';
      coordinates: [number, number]; // [longitude, latitude]
    };
    travelRadius?: number; // km
  };
  pricing: {
    oneToOne: {
      hourlyRate: number;
      currency: string;
    };
    groupSession: {
      hourlyRate: number;
      maxStudents: number;
      ratePerStudent: number;
    };
    onlineClass: {
      hourlyRate: number;
      platformFee?: number;
    };
    trialClass: {
      enabled: boolean;
      duration?: number; // minutes
      price?: number;
    };
  };
  teachingModes: ('online' | 'offline' | 'both')[];
  availability: {
    weekdays: 'weekdays' | 'weekends' | 'both' | 'flexible';
    flexible: boolean;
    responseTime?: number; // hours
  };
}

/**
 * Tutor document interface
 */
export interface ITutorDocument extends Document {
  userId: Types.ObjectId;
  approved: TutorData;
  pending?: Partial<TutorData>;
  status: {
    current: 'pending' | 'approved' | 'rejected' | 'suspended';
    lastApproved?: Date;
    lastApprovedBy?: Types.ObjectId;
    submittedAt: Date;
    reviewedAt?: Date;
    rejectionReason?: string;
  };
  analytics: {
    profileViews: number;
    contactViews: number;
    connects: number;
    responseRate: number;
    lastActive?: Date;
  };
  rating: {
    average: number;
    count: number;
    distribution: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
  };
  isVerified: boolean;
  isFeatured: boolean;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastModifiedBy?: Types.ObjectId;
}

/**
 * Subject schema for nested array
 */
const subjectSchema = new Schema({
  subjectId: {
    type: Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  classIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Class'
  }],
  ageFrom: {
    type: Number,
    required: true,
    min: [1, 'Age from must be at least 1'],
    max: [100, 'Age from cannot exceed 100']
  },
  ageTo: {
    type: Number,
    required: true,
    min: [1, 'Age to must be at least 1'],
    max: [100, 'Age to cannot exceed 100'],
    validate: {
      validator: function(this: any, ageTo: number) {
        return this.ageFrom <= ageTo;
      },
      message: 'Age to must be greater than or equal to age from'
    }
  },
  isAcademic: {
    type: Boolean,
    default: true
  },
  proficiency: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  }
});

/**
 * Experience schema for nested array
 */
const experienceSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  institution: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, 'Institution cannot exceed 200 characters']
  },
  yearFrom: {
    type: Date,
    required: true,
    validate: {
      validator: function(yearFrom: Date) {
        return yearFrom <= new Date();
      },
      message: 'Year from cannot be in the future'
    }
  },
  yearTo: {
    type: Date,
    default: null,
    validate: {
      validator: function(this: any, yearTo: Date) {
        if (this.isPresent) {
          return true;
        }
        return yearTo && this.yearFrom <= yearTo;
      },
      message: 'Year to must be after year from'
    }
  },
  isPresent: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  }
});

/**
 * Education schema for nested array
 */
const educationSchema = new Schema({
  degree: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, 'Degree cannot exceed 200 characters']
  },
  institution: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, 'Institution cannot exceed 200 characters']
  },
  year: {
    type: Number,
    required: true,
    min: [1950, 'Year must be after 1950'],
    max: [new Date().getFullYear(), 'Year cannot be in the future']
  },
  field: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, 'Field cannot exceed 200 characters']
  }
});

/**
 * Tutor schema definition
 */
const tutorSchema = new Schema<ITutorDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true
  },

  approved: {
    basicInfo: {
      firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minlength: [2, 'First name must be at least 2 characters'],
        maxlength: [50, 'First name cannot exceed 50 characters']
      },
      lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        minlength: [2, 'Last name must be at least 2 characters'],
        maxlength: [50, 'Last name cannot exceed 50 characters']
      },
      title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
      },
      shortDescription: {
        type: String,
        required: [true, 'Short description is required'],
        maxlength: [500, 'Short description cannot exceed 500 characters']
      },
      longDescription: {
        type: String,
        required: [true, 'Long description is required'],
        maxlength: [5000, 'Long description cannot exceed 5000 characters']
      },
      photo: {
        type: String,
        default: null
      },
      experienceYears: {
        type: Number,
        min: [0, 'Experience cannot be negative'],
        max: [50, 'Experience cannot exceed 50 years']
      }
    },

    subjects: [subjectSchema],

    experience: [experienceSchema],

    education: [educationSchema],

    contactDetails: {
      phone: {
        type: String,
        required: true,
        validate: {
          validator: function(phone: string) {
            return /^[+]?[\d\s\-\(\)]+$/.test(phone);
          },
          message: 'Invalid phone number format'
        }
      },
      whatsapp: {
        type: String,
        validate: {
          validator: function(whatsapp: string) {
            if (!whatsapp) return true;
            return /^[+]?[\d\s\-\(\)]+$/.test(whatsapp);
          },
          message: 'Invalid WhatsApp number format'
        }
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        validate: {
          validator: function(email: string) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
          },
          message: 'Invalid email format'
        }
      },
      preferredContact: {
        type: String,
        enum: ['phone', 'email', 'whatsapp'],
        default: 'phone'
      }
    },

    socialMediaLinks: {
      facebook: {
        type: String,
        default: null
      },
      linkedin: {
        type: String,
        default: null
      },
      instagram: {
        type: String,
        default: null
      },
      personalWebsite: {
        type: String,
        default: null
      }
    },

    location: {
      areas: [{
        type: String,
        trim: true,
        maxlength: [100, 'Area name cannot exceed 100 characters']
      }],
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
        maxlength: [100, 'City cannot exceed 100 characters']
      },
      state: {
        type: String,
        required: [true, 'State is required'],
        trim: true,
        maxlength: [100, 'State cannot exceed 100 characters']
      },
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: {
          type: [Number],
          validate: {
            validator: function(coordinates: number[]) {
              if (!coordinates || coordinates.length !== 2) return false;
              const [longitude, latitude] = coordinates;
              return longitude >= -180 && longitude <= 180 &&
                     latitude >= -90 && latitude <= 90;
            },
            message: 'Invalid coordinates [longitude, latitude]'
          }
        }
      },
      travelRadius: {
        type: Number,
        min: [0, 'Travel radius cannot be negative'],
        max: [100, 'Travel radius cannot exceed 100 km'],
        default: 10
      }
    },

    pricing: {
      oneToOne: {
        hourlyRate: {
          type: Number,
          required: true,
          min: [0, 'Rate cannot be negative']
        },
        currency: {
          type: String,
          enum: ['INR', 'USD', 'EUR'],
          default: 'INR'
        }
      },
      groupSession: {
        hourlyRate: {
          type: Number,
          required: true,
          min: [0, 'Rate cannot be negative']
        },
        maxStudents: {
          type: Number,
          required: true,
          min: [2, 'Group must have at least 2 students'],
          max: [50, 'Group cannot exceed 50 students']
        },
        ratePerStudent: {
          type: Number,
          required: true,
          min: [0, 'Rate cannot be negative']
        }
      },
      onlineClass: {
        hourlyRate: {
          type: Number,
          required: true,
          min: [0, 'Rate cannot be negative']
        },
        platformFee: {
          type: Number,
          min: [0, 'Platform fee cannot be negative'],
          default: 0
        }
      },
      trialClass: {
        enabled: {
          type: Boolean,
          default: false
        },
        duration: {
          type: Number,
          min: [15, 'Trial class must be at least 15 minutes'],
          max: [60, 'Trial class cannot exceed 60 minutes'],
          default: 30
        },
        price: {
          type: Number,
          min: [0, 'Trial price cannot be negative'],
          default: 0
        }
      }
    },

    teachingModes: [{
      type: String,
      enum: ['online', 'offline', 'both'],
      required: true
    }],

    availability: {
      weekdays: {
        type: String,
        enum: ['weekdays', 'weekends', 'both', 'flexible'],
        default: 'both'
      },
      flexible: {
        type: Boolean,
        default: true
      },
      responseTime: {
        type: Number,
        min: [0, 'Response time cannot be negative'],
        max: [72, 'Response time cannot exceed 72 hours'],
        default: 24
      }
    }
  },

  pending: {
    type: Schema.Types.Mixed,
    default: null
  },

  status: {
    current: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending'
    },
    lastApproved: {
      type: Date,
      default: null
    },
    lastApprovedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    reviewedAt: {
      type: Date,
      default: null
    },
    rejectionReason: {
      type: String,
      maxlength: [1000, 'Rejection reason cannot exceed 1000 characters']
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
    },
    responseRate: {
      type: Number,
      default: 0,
      min: [0, 'Response rate cannot be negative'],
      max: [100, 'Response rate cannot exceed 100']
    },
    lastActive: {
      type: Date,
      default: Date.now
    }
  },

  rating: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot exceed 5']
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    },
    distribution: {
      1: { type: Number, default: 0, min: 0 },
      2: { type: Number, default: 0, min: 0 },
      3: { type: Number, default: 0, min: 0 },
      4: { type: Number, default: 0, min: 0 },
      5: { type: Number, default: 0, min: 0 }
    }
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  isFeatured: {
    type: Boolean,
    default: false
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

  lastModifiedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true,
  collection: 'tutors',
  toJSON: {
    virtuals: true,
    transform: function(_doc, ret) {
      const { __v, _id, ...clean } = ret;
      return { id: _id, ...clean };
    }
  },
  toObject: { virtuals: true }
});

// Single field indexes
tutorSchema.index({ userId: 1 }, { unique: true });
tutorSchema.index({ 'status.current': 1 });
tutorSchema.index({ isActive: 1 });
tutorSchema.index({ isDeleted: 1 });
tutorSchema.index({ isVerified: 1 });
tutorSchema.index({ isFeatured: 1 });

// Geospatial index for location search
tutorSchema.index({ 'approved.location.coordinates': '2dsphere' });

// City-based location index
tutorSchema.index({ 'approved.location.city': 1 });

// Subject search indexes
tutorSchema.index({
  'approved.subjects.subjectId': 1,
  'status.current': 1
});

// Teaching mode indexes
tutorSchema.index({
  'approved.teachingModes': 1,
  'status.current': 1
});

// Rating-based indexes for sorting
tutorSchema.index({
  'rating.average': -1,
  'status.current': 1,
  isActive: 1
});

// Analytics indexes
tutorSchema.index({
  'analytics.connects': -1,
  'status.current': 1
});

// Pricing search indexes
tutorSchema.index({
  'approved.pricing.oneToOne.hourlyRate': 1,
  'status.current': 1
});

// Compound indexes for common queries
tutorSchema.index({
  'status.current': 1,
  isActive: 1,
  isVerified: 1,
  'rating.average': -1
});

tutorSchema.index({
  'approved.location.city': 1,
  'approved.subjects.subjectId': 1,
  'status.current': 1,
  'rating.average': -1
});

tutorSchema.index({
  'status.current': 1,
  isFeatured: 1,
  'rating.average': -1
});

// Admin approval workflow indexes
tutorSchema.index({
  'status.current': 1,
  'status.submittedAt': -1,
  isActive: 1
});

// Text search index for searching by name, title, description
tutorSchema.index({
  'approved.basicInfo.firstName': 'text',
  'approved.basicInfo.lastName': 'text',
  'approved.basicInfo.title': 'text',
  'approved.basicInfo.shortDescription': 'text',
  'approved.basicInfo.longDescription': 'text'
}, {
  weights: {
    'approved.basicInfo.title': 10,
    'approved.basicInfo.firstName': 8,
    'approved.basicInfo.lastName': 8,
    'approved.basicInfo.shortDescription': 5,
    'approved.basicInfo.longDescription': 3
  }
});

// Update tracking index
tutorSchema.index({ updatedAt: -1 });

// Last active tracking for recommendations
tutorSchema.index({
  'analytics.lastActive': -1,
  'status.current': 1,
  isActive: 1
});

// Virtual for profile URL
tutorSchema.virtual('profileUrl').get(function() {
  return `/tutors/${this._id}`;
});

// Virtual for full name
tutorSchema.virtual('fullName').get(function() {
  if (this.approved && this.approved.basicInfo) {
    return `${this.approved.basicInfo.firstName} ${this.approved.basicInfo.lastName}`;
  }
  return '';
});

// Pre-save middleware
tutorSchema.pre('save', function(next) {
  // Update last modified timestamp
  this.updatedAt = new Date();

  // Validate at least one subject
  if (this.approved && this.approved.subjects) {
    if (this.approved.subjects.length === 0) {
      return next(new Error('Tutor must have at least one subject'));
    }
  }

  // Validate teaching modes
  if (this.approved && this.approved.teachingModes) {
    if (this.approved.teachingModes.length === 0) {
      return next(new Error('Tutor must specify at least one teaching mode'));
    }
  }

  next();
});

// Pre-update middleware
tutorSchema.pre(['updateOne', 'updateMany', 'findOneAndUpdate'], function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

// Static methods
tutorSchema.statics.findByStatus = function(status: string) {
  return this.find({ 'status.current': status, isActive: true });
};

tutorSchema.statics.findByLocation = function(coordinates: [number, number], maxDistance = 10000) {
  return this.find({
    'status.current': 'approved',
    isActive: true,
    'approved.location.coordinates': {
      $near: {
        $geometry: { type: 'Point', coordinates },
        $maxDistance: maxDistance
      }
    }
  });
};

// Instance methods
tutorSchema.methods.incrementProfileViews = function() {
  return this.updateOne({ $inc: { 'analytics.profileViews': 1 } });
};

tutorSchema.methods.incrementContactViews = function() {
  return this.updateOne({ $inc: { 'analytics.contactViews': 1 } });
};

tutorSchema.methods.incrementConnects = function() {
  return this.updateOne({ $inc: { 'analytics.connects': 1 } });
};

tutorSchema.methods.updateRating = function(averageRating: number, totalReviews: number, distribution: any) {
  this.rating.average = averageRating;
  this.rating.count = totalReviews;
  this.rating.distribution = distribution;
  return this.save();
};

// Export the schema
export { tutorSchema };