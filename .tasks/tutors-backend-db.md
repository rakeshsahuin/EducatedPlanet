# MongoDB Tutor Collection - Database Implementation Plan

## Overview
This plan outlines the database changes needed to implement the tutor collection in MongoDB, focusing only on the database layer (schema, indexes, and models) without backend API changes.

## 1. Database Schema Changes

### A. Tutor Collection Schema

**File**: `dataservice/src/models/tutor.model.ts`

#### Enhanced Schema Structure
```javascript
const tutorSchema = new mongoose.Schema({
  // Core Identification
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  // Nested approval structure (as per draft)
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

    subjects: [{
      subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
      },
      classIds: [{
        type: mongoose.Schema.Types.ObjectId,
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
          validator: function(ageTo) {
            return this.parent().ageFrom <= ageTo;
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
    }],

    experience: [{
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
          validator: function(yearFrom) {
            return yearFrom <= new Date();
          },
          message: 'Year from cannot be in the future'
        }
      },
      yearTo: {
        type: Date,
        default: null,
        validate: {
          validator: function(yearTo) {
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
    }],

    education: [{
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
    }],

    contactDetails: {
      phone: {
        type: String,
        required: true,
        validate: {
          validator: function(phone) {
            return /^[+]?[\d\s\-\(\)]+$/.test(phone);
          },
          message: 'Invalid phone number format'
        }
      },
      whatsapp: {
        type: String,
        validate: {
          validator: function(whatsapp) {
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
          validator: function(email) {
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
        required: true,
        trim: true,
        maxlength: [100, 'City cannot exceed 100 characters']
      },
      state: {
        type: String,
        required: true,
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
          required: true,
          validate: {
            validator: function(coordinates) {
              return coordinates.length === 2 &&
                     coordinates[0] >= -180 && coordinates[0] <= 180 &&
                     coordinates[1] >= -90 && coordinates[1] <= 90;
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

    // Pricing for 3 class types
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
    // Same structure as approved for pending changes
    // Initially empty, populated when tutor submits updates
  },

  // Status tracking
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
      type: mongoose.Schema.Types.ObjectId,
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

  // Analytics
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

  // Rating
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

  // Status flags
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false  // Soft delete
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  modifiedAt: {
    type: Date,
    default: Date.now
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true, // Automatically manages createdAt and updatedAt
  collection: 'tutors'
});
```

## 2. Database Indexes

### A. Required Indexes for Performance

```javascript
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
tutorSchema.index({ modifiedAt: -1 });

// Last active tracking for recommendations
tutorSchema.index({
  'analytics.lastActive': -1,
  'status.current': 1,
  isActive: 1
});
```

## 3. Database Validation Rules

### A. Custom Validation Methods

```javascript
// Validate at least one subject
tutorSchema.path('approved.subjects').validate(function(subjects) {
  return subjects && subjects.length > 0;
}, 'Tutor must have at least one subject');

// Validate teaching modes
tutorSchema.path('approved.teachingModes').validate(function(modes) {
  return modes && modes.length > 0;
}, 'Tutor must specify at least one teaching mode');

// Validate age range consistency
tutorSchema.pre('save', function(next) {
  if (this.approved && this.approved.subjects) {
    this.approved.subjects.forEach(subject => {
      if (subject.ageFrom > subject.ageTo) {
        return next(new Error('Age from cannot be greater than age to'));
      }
    });
  }
  next();
});

// Prevent modification of approved tutor after approval
tutorSchema.pre('save', function(next) {
  if (this.status.current === 'approved' && this.isModified('approved')) {
    // Check if there's no pending submission
    if (!this.pending || Object.keys(this.pending).length === 0) {
      return next(new Error('Cannot modify approved profile without pending submission'));
    }
  }
  next();
});
```

## 4. Database Migration Strategy

### A. Migration Script

**File**: `dataservice/src/migrations/001-create-tutor-collection.js`

```javascript
const mongoose = require('mongoose');

async function createTutorCollection() {
  try {
    // Check if collection already exists
    const collections = await mongoose.connection.db.listCollections({
      name: 'tutors'
    }).toArray();

    if (collections.length === 0) {
      // Create the tutors collection with the schema
      await mongoose.connection.db.createCollection('tutors', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['userId', 'status', 'createdAt'],
            properties: {
              userId: { bsonType: 'objectId' },
              'status.current': {
                enum: ['pending', 'approved', 'rejected', 'suspended']
              },
              isActive: { bsonType: 'bool' },
              isDeleted: { bsonType: 'bool' }
            }
          }
        }
      });
      console.log('Tutors collection created successfully');
    } else {
      console.log('Tutors collection already exists');
    }

    // Create indexes
    const db = mongoose.connection.db;
    const collection = db.collection('tutors');

    // Create all indexes defined in schema
    await collection.createIndex({ userId: 1 }, { unique: true });
    await collection.createIndex({ 'status.current': 1 });
    await collection.createIndex({ isActive: 1, isDeleted: 1 });
    await collection.createIndex({ 'approved.location.coordinates': '2dsphere' });
    await collection.createIndex({
      'approved.location.city': 1,
      'status.current': 1,
      'rating.average': -1
    });
    await collection.createIndex({
      'approved.subjects.subjectId': 1,
      'status.current': 1
    });
    await collection.createIndex({
      'rating.average': -1,
      'status.current': 1,
      isActive: 1
    });

    console.log('Tutors collection indexes created successfully');

  } catch (error) {
    console.error('Error creating tutors collection:', error);
    throw error;
  }
}

module.exports = createTutorCollection;
```

## 5. Supporting Collections Enhancement

### A. Subjects Collection

Ensure the subjects collection has proper structure:

```javascript
const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  classIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
subjectSchema.index({ name: 1 });
subjectSchema.index({ code: 1 });
subjectSchema.index({ isActive: 1 });
```

### B. Classes Collection

Ensure the classes collection has proper structure:

```javascript
const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: String,
    enum: ['Primary', 'Secondary', 'Higher Secondary', 'College', 'Professional'],
    required: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  subjectIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
classSchema.index({ name: 1 });
classSchema.index({ level: 1 });
classSchema.index({ isActive: 1 });
```

## 6. Model Export

### A. Update Model Exports

**File**: `dataservice/src/models/index.ts`

```typescript
export { default as Tutor } from './tutor.model';
export { default as Subject } from './subject.model';
export { default as Class } from './class.model';
export { default as User } from './user.model';
```

## 7. Database Performance Considerations

### A. Query Optimization Guidelines

1. **Use Projection**: Always specify required fields in queries to reduce data transfer
2. **Lean Queries**: Use `.lean()` for read-only operations for better performance
3. **Pagination**: Implement cursor-based pagination for large datasets
4. **Aggregate Pipelines**: Use aggregation for complex queries involving joins or calculations

### B. Memory Management

1. **Document Size**: Monitor document sizes to stay under 16MB MongoDB limit
2. **Array Growth**: Limit array sizes where possible (subjects, experience)
3. **Index Strategy**: Regularly review query patterns and optimize indexes
4. **Connection Pooling**: Configure appropriate connection pool size

## 8. Implementation Checklist

- [ ] Create/update tutor model with enhanced schema
- [ ] Add all required indexes
- [ ] Create migration script
- [ ] Update model exports
- [ ] Test schema validation
- [ ] Verify index creation
- [ ] Run performance benchmarks
- [ ] Document schema for team reference

## 9. Next Steps

After implementing these database changes:
1. The backend API layer can be built on top of these models
2. The web and admin applications can use the dataservice to interact with the database
3. Analytics and reporting features can leverage the structured analytics fields
4. Search functionality can utilize the geospatial and text indexes

This database schema provides a solid foundation for the tutor listing platform with features like:
- Location-based search with distance calculation
- Multi-pricing support for different class types
- Admin approval workflow with audit trail
- Analytics tracking for performance metrics
- Flexible subject and class associations
- Social media profile integration