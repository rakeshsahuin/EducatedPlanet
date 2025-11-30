import { Schema, model } from 'mongoose';
import { Class, ClassCategory } from '@educatedplanet/models';
import { IClassDocument } from '../models/class.model';

const classSchemaDefinition = new Schema<IClassDocument>({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, uppercase: true },
  category: {
    type: String,
    enum: Object.values(ClassCategory),
    required: true
  },
  subClasses: [{
    type: String,
    trim: true,
    validate: {
      validator: function(v: string[]) {
        // Optional: Validate sub-class codes format
        return v.every(code => code.length > 0);
      },
      message: 'Sub-class codes cannot be empty'
    }
  }],
  description: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  metadata: {
    minAge: Number,
    maxAge: Number,
    duration: String,
    subjects: [String],
    prerequisites: [String]
  },

  // MongoDB fields
  isDeleted: { type: Boolean, default: false, select: false },
  deletedAt: { type: Date, select: false }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      const { __v, ...clean } = ret;
      return clean;
    }
  }
});

// Indexes for performance
classSchemaDefinition.index({ code: 1 });
classSchemaDefinition.index({ category: 1 });
classSchemaDefinition.index({ isActive: 1, isDeleted: 1 });
classSchemaDefinition.index({ subClasses: 1 }); // For searching by sub-class

// Text index for search
classSchemaDefinition.index({
  name: 'text',
  'subClasses': 'text',
  description: 'text'
});

// Instance methods
classSchemaDefinition.methods.hasSubClass = function(subClassCode: string) {
  return this.subClasses.includes(subClassCode);
};

classSchemaDefinition.methods.addSubClass = function(subClassCode: string) {
  if (!this.subClasses.includes(subClassCode)) {
    this.subClasses.push(subClassCode);
  }
};

classSchemaDefinition.methods.removeSubClass = function(subClassCode: string) {
  this.subClasses = this.subClasses.filter((code: any) => code !== subClassCode);
};

// Export the schema definition, not the model
export { classSchemaDefinition };
export default classSchemaDefinition;