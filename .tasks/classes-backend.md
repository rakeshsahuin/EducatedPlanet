# Class Management System Implementation Plan (Updated)

## Overview
Create a comprehensive class management system in the dataservice package that supports flat class structures with optional sub-class references using an embedded subClasses array approach. Classes can reference other classes via the subClasses array without any hierarchical constraints.

## 1. Models Package Updates (First)

### File: `models/src/class/types.ts`
```typescript
// Core class entity interface
export interface Class {
  id: string;
  name: string;
  code: string; // Unique identifier (e.g., "SCHOOL", "LKG", "CLASS-1")
  category: ClassCategory; // SCHOOL, COLLEGE, PROFESSIONAL, COMPETITIVE
  subClasses: string[]; // Array of subclass codes/names
  description?: string;
  isActive: boolean;
  sortOrder: number; // For ordering within same level
  metadata: ClassMetadata;
  createdAt: Date;
  updatedAt: Date;
}

// Nested metadata structure
export interface ClassMetadata {
  minAge?: number;
  maxAge?: number;
  duration?: string; // e.g., "1 year", "6 months"
  subjects?: string[]; // Associated subjects
  prerequisites?: string[]; // Required classes
}

// Enums
export enum ClassCategory {
  SCHOOL = 'school',
  COLLEGE = 'college',
  PROFESSIONAL = 'professional',
  COMPETITIVE = 'competitive',
  SKILL_DEVELOPMENT = 'skill_development',
  SPORTS = 'sports',
  ENTERTAINMENT = 'entertainment',
  ART = 'art',
  HEALTH = 'health'
}

// CRUD Input types
export interface CreateClassInput {
  name: string;
  code: string;
  category: ClassCategory;
  subClasses?: string[]; // Optional sub-classes
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
  metadata?: Partial<ClassMetadata>;
}

export interface UpdateClassInput {
  name?: string;
  code?: string;
  category?: ClassCategory;
  subClasses?: string[]; // Can add/remove sub-classes
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
  metadata?: Partial<ClassMetadata>;
}

// Search parameters
export interface ClassSearchParams {
  query?: string;
  category?: ClassCategory;
  hasSubClasses?: boolean; // Filter classes with/without sub-classes
  isActive?: boolean;
  subClass?: string; // Find classes containing this sub-class
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'sortOrder' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Extended interfaces
export interface ClassWithSubClasses extends Class {
  subClassDetails?: Class[]; // Populated sub-class details
}

// Operations for managing sub-classes
export interface AddSubClassInput {
  subClassCode: string;
  subClassName: string;
}

export interface RemoveSubClassInput {
  subClassCode: string;
}
```

### Update: `models/src/index.ts`
Add exports for all class-related types.

## 2. DataService Package Implementation

### A. Schema Layer: `dataservice/src/datamodels/schemas/class.schema.ts`
```typescript
const classSchema = new Schema<IClassDocument>({
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
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for performance
classSchema.index({ code: 1 });
classSchema.index({ category: 1 });
classSchema.index({ isActive: 1, isDeleted: 1 });
classSchema.index({ subClasses: 1 }); // For searching by sub-class

// Text index for search
classSchema.index({
  name: 'text',
  'subClasses': 'text',
  description: 'text'
});

// Instance methods
classSchema.methods.hasSubClass = function(subClassCode: string) {
  return this.subClasses.includes(subClassCode);
};

classSchema.methods.addSubClass = function(subClassCode: string) {
  if (!this.subClasses.includes(subClassCode)) {
    this.subClasses.push(subClassCode);
  }
};

classSchema.methods.removeSubClass = function(subClassCode: string) {
  this.subClasses = this.subClasses.filter(code => code !== subClassCode);
};
```

### B. Document Interface: `dataservice/src/datamodels/models/class.model.ts`
```typescript
export interface IClassDocument extends Omit<Class, 'id'>, Document {
  // MongoDB specific fields
  isDeleted: boolean;
  deletedAt?: Date;

  // Instance methods
  hasSubClass(subClassCode: string): boolean;
  addSubClass(subClassCode: string): void;
  removeSubClass(subClassCode: string): void;
}

// Queries object
export const ClassQueries = {
  // Basic CRUD
  findById: (id: string) => ClassModel.findById(id).where({ isDeleted: { $ne: true } }),
  findByCode: (code: string) => ClassModel.findOne({ code, isDeleted: { $ne: true } }),
  findAll: (filters: any) => ClassModel.find({ ...filters, isDeleted: { $ne: true } }),
  create: (data: Partial<IClassDocument>) => ClassModel.create(data),
  updateById: (id: string, data: Partial<IClassDocument>) =>
    ClassModel.findByIdAndUpdate(id, data, { new: true }),
  deleteById: (id: string) =>
    ClassModel.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }),

  // Sub-class queries
  findClassesWithSubClasses: () => ClassModel.find({
    subClasses: { $exists: true, $ne: [] },
    isDeleted: { $ne: true }
  }),

  findBySubClass: (subClassCode: string) => ClassModel.find({
    subClasses: subClassCode,
    isDeleted: { $ne: true }
  }),

  // Search with subClasses support
  searchClasses: async (params: ClassSearchParams) => {
    const {
      query,
      category,
      hasSubClasses,
      isActive = true,
      subClass,
      page = 1,
      limit = 20,
      sortBy = 'sortOrder',
      sortOrder = 'asc'
    } = params;

    const filter: any = { isDeleted: { $ne: true } };

    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive;
    if (hasSubClasses !== undefined) {
      filter.subClasses = hasSubClasses ? { $exists: true, $ne: [] } : { $in: [[]] };
    }
    if (subClass) filter.subClasses = subClass;

    if (query) {
      filter.$text = { $search: query };
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    const [classes, total] = await Promise.all([
      ClassModel.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      ClassModel.countDocuments(filter)
    ]);

    return {
      items: classes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    };
  },

  // Utility methods
  isCodeUnique: async (code: string, excludeId?: string) => {
    const query: any = { code, isDeleted: { $ne: true } };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await ClassModel.findOne(query);
    return !existing;
  },

  getMaxSortOrder: async (category?: string) => {
    const filter: any = { isDeleted: { $ne: true } };
    if (category) filter.category = category;

    const maxClass = await ClassModel.findOne(filter)
      .sort({ sortOrder: -1 })
      .select('sortOrder');

    return maxClass?.sortOrder || 0;
  },

  // Sub-class management
  addSubClassToClass: async (classId: string, subClassCode: string) => {
    return ClassModel.findByIdAndUpdate(
      classId,
      { $addToSet: { subClasses: subClassCode } },
      { new: true }
    );
  },

  removeSubClassFromClass: async (classId: string, subClassCode: string) => {
    return ClassModel.findByIdAndUpdate(
      classId,
      { $pull: { subClasses: subClassCode } },
      { new: true }
    );
  },

  // Validate sub-class exists
  validateSubClasses: async (subClassCodes: string[]) => {
    const existingClasses = await ClassModel.find({
      code: { $in: subClassCodes },
      isDeleted: { $ne: true }
    }).select('code');

    const existingCodes = existingClasses.map(c => c.code);
    const missingCodes = subClassCodes.filter(code => !existingCodes.includes(code));

    return {
      isValid: missingCodes.length === 0,
      missingCodes,
      existingCodes
    };
  }
};
```

### C. Service Layer: `dataservice/src/services/class.service.ts`
```typescript
export class ClassService {
  private initialized = false;

  async ensureInitialized() {
    if (!this.initialized) {
      await connectDB();
      this.initialized = true;
    }
  }

  // Transform methods
  private transformClassDocument(doc: IClassDocument): Class {
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      name: doc.name,
      code: doc.code,
      category: doc.category,
      subClasses: doc.subClasses || [],
      description: doc.description,
      isActive: doc.isActive,
      sortOrder: doc.sortOrder,
      metadata: doc.metadata || {},
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  // CRUD operations
  async createClass(classData: CreateClassInput): Promise<Class> {
    await this.ensureInitialized();

    // Validate uniqueness
    const existing = await ClassQueries.findByCode(classData.code);
    if (existing) {
      throw new Error(`Class with code ${classData.code} already exists`);
    }

    // Validate sub-classes if provided
    if (classData.subClasses && classData.subClasses.length > 0) {
      const validation = await ClassQueries.validateSubClasses(classData.subClasses);
      if (!validation.isValid) {
        throw new Error(`Invalid sub-classes: ${validation.missingCodes.join(', ')}`);
      }
    }

    // Set default sort order
    if (classData.sortOrder === undefined) {
      classData.sortOrder = await ClassQueries.getMaxSortOrder(classData.category) + 1;
    }

    const classDoc = await ClassQueries.create(classData);
    return this.transformClassDocument(classDoc);
  }

  async updateClass(id: string, updateData: UpdateClassInput): Promise<Class> {
    await this.ensureInitialized();

    // Validate sub-classes if being updated
    if (updateData.subClasses) {
      const validation = await ClassQueries.validateSubClasses(updateData.subClasses);
      if (!validation.isValid) {
        throw new Error(`Invalid sub-classes: ${validation.missingCodes.join(', ')}`);
      }
    }

    const classDoc = await ClassQueries.updateById(id, updateData);
    if (!classDoc) {
      throw new Error('Class not found');
    }

    return this.transformClassDocument(classDoc);
  }

  async deleteClass(id: string): Promise<void> {
    await this.ensureInitialized();

    // Check if this class is referenced as a sub-class
    const referencingClasses = await ClassQueries.findBySubClass(
      (await ClassQueries.findById(id)).code
    );

    if (referencingClasses.length > 0) {
      throw new Error('Cannot delete class that is referenced as a sub-class');
    }

    await ClassQueries.deleteById(id);
  }

  // Sub-class management
  async addSubClass(classId: string, subClassCode: string, subClassName: string): Promise<Class> {
    await this.ensureInitialized();

    // Check if sub-class exists, create if not
    let subClass = await ClassQueries.findByCode(subClassCode);
    if (!subClass) {
      // Create the sub-class
      const parentClass = await ClassQueries.findById(classId);
      await this.createClass({
        name: subClassName,
        code: subClassCode,
        category: parentClass.category
      });
    }

    const updated = await ClassQueries.addSubClassToClass(classId, subClassCode);
    return this.transformClassDocument(updated);
  }

  async removeSubClass(classId: string, subClassCode: string): Promise<Class> {
    await this.ensureInitialized();

    const updated = await ClassQueries.removeSubClassFromClass(classId, subClassCode);
    return this.transformClassDocument(updated);
  }

  
  async getClassesWithSubClasses(): Promise<ClassWithSubClasses[]> {
    await this.ensureInitialized();
    const classes = await ClassQueries.findClassesWithSubClasses();

    return Promise.all(
      classes.map(async (doc) => {
        const subClassDetails = await Promise.all(
          doc.subClasses.map(code => ClassQueries.findByCode(code))
        );

        return {
          ...this.transformClassDocument(doc),
          subClassDetails: subClassDetails.filter(Boolean).map(sub =>
            this.transformClassDocument(sub)
          )
        };
      })
    );
  }

  // Search operations
  async searchClasses(params: ClassSearchParams): Promise<PaginatedResponse<Class>> {
    await this.ensureInitialized();
    const result = await ClassQueries.searchClasses(params);

    return {
      ...result,
      items: result.items.map(doc => this.transformClassDocument(doc))
    };
  }

  async findBySubClass(subClassCode: string): Promise<Class[]> {
    await this.ensureInitialized();
    const classes = await ClassQueries.findBySubClass(subClassCode);
    return classes.map(doc => this.transformClassDocument(doc));
  }

  // Utility operations
  async isCodeUnique(code: string, excludeId?: string): Promise<boolean> {
    await this.ensureInitialized();
    return ClassQueries.isCodeUnique(code, excludeId);
  }

  async reorderClasses(classOrders: { id: string; sortOrder: number }[]): Promise<void> {
    await this.ensureInitialized();

    const bulkOps = classOrders.map(({ id, sortOrder }) => ({
      updateOne: {
        filter: { _id: id },
        update: { sortOrder }
      }
    }));

    await ClassModel.bulkWrite(bulkOps);
  }

  async importClasses(classes: CreateClassInput[]): Promise<{
    successful: Class[];
    errors: { index: number; error: string }[];
  }> {
    await this.ensureInitialized();

    const successful: Class[] = [];
    const errors: { index: number; error: string }[] = [];

    for (let i = 0; i < classes.length; i++) {
      try {
        const created = await this.createClass(classes[i]);
        successful.push(created);
      } catch (error) {
        errors.push({ index: i, error: error.message });
      }
    }

    return { successful, errors };
  }
}

// Export singleton instance
export const classService = new ClassService();
```

### D. Update: `dataservice/src/datamodels/index.ts`
Add exports for class model and queries.

### E. Update: `dataservice/src/index.ts`
Add export for classService.

## 3. Implementation Steps

1. **Update models package** - Define all TypeScript interfaces with subClasses array
2. **Create schema** - Define Mongoose schema with subClasses array field and validation
3. **Implement queries** - Create all database query methods for flat class structure
4. **Build service** - Implement business logic with sub-class management
5. **Update exports** - Ensure all modules are properly exported
6. **Add validation** - Implement input validation for sub-classes
7. **Write tests** - Unit tests for all service methods including sub-class operations

## 4. Key Features

- **Flat Structure**: Classes with optional sub-class references
- **Flexible Structure**: Classes can reference any number of other classes via subClasses array
- **Search Support**: Search by sub-class code/name
- **Validation**: Ensure sub-classes exist before adding
- **Auto-creation**: Option to auto-create sub-classes if they don't exist
- **Sub-class View**: Get classes with their referenced sub-classes
- **Bulk Operations**: Import, export, and reorder classes

## 5. Database Indexes

- Unique index on `code`
- Index on `category`
- Index on `subClasses` for fast lookups
- Text index on `name`, `subClasses`, `description` for search
- Index on `isActive` + `isDeleted` for filtering

## 6. Example Data Structure

```javascript
// Class with sub-classes
{
  name: "School",
  code: "SCHOOL",
  category: "school",
  subClasses: ["LKG", "UKG", "CLASS-1", "CLASS-2", "CLASS-3"],
  metadata: { minAge: 3, maxAge: 18 }
}

// Referenced sub-class
{
  name: "Class 1",
  code: "CLASS-1",
  category: "school",
  subClasses: ["MATH-1", "ENGLISH-1", "SCIENCE-1"],
  metadata: { minAge: 6, maxAge: 7 }
}

// Independent class
{
  name: "Programming Basics",
  code: "PROG-BASIC",
  category: "skill_development",
  subClasses: [],
  metadata: { minAge: 16, duration: "3 months" }
}
```

## 7. API Methods Available

```typescript
// CRUD
createClass(data: CreateClassInput): Promise<Class>
updateClass(id: string, data: UpdateClassInput): Promise<Class>
deleteClass(id: string): Promise<void>
getClassById(id: string): Promise<Class>
getClassByCode(code: string): Promise<Class>

// Sub-class management
addSubClass(classId: string, code: string, name: string): Promise<Class>
removeSubClass(classId: string, code: string): Promise<Class>

// Sub-class operations
getClassesWithSubClasses(): Promise<ClassWithSubClasses[]>
findBySubClass(subClassCode: string): Promise<Class[]>

// Search and utilities
searchClasses(params: ClassSearchParams): Promise<PaginatedResponse<Class>>
isCodeUnique(code: string, excludeId?: string): Promise<boolean>
reorderClasses(classOrders: {id: string, sortOrder: number}[]): Promise<void>
importClasses(classes: CreateClassInput[]): Promise<{successful: Class[], errors: any[]}>
```

This updated plan uses a flat structure approach where classes can reference other classes via the subClasses array without any hierarchical constraints or special category handling.