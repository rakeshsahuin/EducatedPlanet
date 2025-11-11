import { Schema, model } from 'mongoose';
import { NewSubject, SubjectMetadata } from '@educatedplanet/models';
import { ISubjectDocument } from '../models/subject.model';

const subjectSchemaDefinition = new Schema<ISubjectDocument>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    validate: {
      validator: function(v: string) {
        return /^[A-Z0-9-_]{2,20}$/.test(v);
      },
      message: 'Subject code must be 2-20 characters, uppercase letters, numbers, hyphens, and underscores only'
    }
  },
  classIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Class'
  }],
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  keywords: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  isActive: { type: Boolean, default: true },
  isAcademic: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  metadata: {
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced']
    },
    duration: String,
    prerequisites: [String],
    topics: [String],
    skills: [String],
    careerPaths: [String],
    examPreparation: [String],
    minAge: { type: Number, min: 1, max: 100 },
    maxAge: { type: Number, min: 1, max: 100 },
    popular: { type: Boolean, default: false },
    icon: String,
    color: String
  },

  // MongoDB fields
  isDeleted: { type: Boolean, default: false, select: false },
  deletedAt: { type: Date, select: false }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      delete ret.isDeleted;
      delete ret.deletedAt;
      return ret;
    }
  }
});

// Indexes for performance
subjectSchemaDefinition.index({ code: 1 }, { unique: true });
subjectSchemaDefinition.index({ name: 'text', description: 'text', keywords: 'text' });
subjectSchemaDefinition.index({ isActive: 1, isDeleted: 1 });
subjectSchemaDefinition.index({ isAcademic: 1 });
subjectSchemaDefinition.index({ classIds: 1 }); // For finding subjects by class
subjectSchemaDefinition.index({ 'metadata.popular': 1 });
subjectSchemaDefinition.index({ 'metadata.difficulty': 1 });
subjectSchemaDefinition.index({ sortOrder: 1 });

// Compound indexes
subjectSchemaDefinition.index({ isActive: 1, isAcademic: 1 });
subjectSchemaDefinition.index({ 'metadata.difficulty': 1, isAcademic: 1 });

// Instance methods
subjectSchemaDefinition.methods.hasClass = function(classId: string) {
  return this.classIds.some(id => id.toString() === classId);
};

subjectSchemaDefinition.methods.addClass = function(classId: string) {
  if (!this.hasClass(classId)) {
    this.classIds.push(classId);
  }
};

subjectSchemaDefinition.methods.removeClass = function(classId: string) {
  this.classIds = this.classIds.filter(id => id.toString() !== classId);
};

subjectSchemaDefinition.methods.updatePopularity = function(isPopular: boolean) {
  if (this.metadata) {
    this.metadata.popular = isPopular;
  }
};

// Virtual fields
subjectSchemaDefinition.virtual('isPopular').get(function() {
  return this.metadata?.popular || false;
});

// Pre-save middleware for auto-generating codes
subjectSchemaDefinition.pre('save', async function(next) {
  if (!this.code) {
    // Auto-generate code if not provided
    const { SubjectQueries } = await import('../models/subject.model');
    const baseCode = this.name.toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 8);

    let code = baseCode;
    let counter = 1;

    while (!(await SubjectQueries.isCodeUnique(code))) {
      code = `${baseCode}-${counter}`;
      counter++;
    }

    this.code = code;
  }

  // Validate age range
  if (this.metadata?.minAge && this.metadata?.maxAge &&
      this.metadata.minAge > this.metadata.maxAge) {
    return next(new Error('Minimum age cannot be greater than maximum age'));
  }

  next();
});

// Export the schema definition
export { subjectSchemaDefinition };
export default subjectSchemaDefinition;