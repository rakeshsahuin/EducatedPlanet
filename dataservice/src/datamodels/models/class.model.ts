import { Document, Model, model } from 'mongoose';
import { Class, ClassSearchParams, PaginatedResponse } from '@educatedplanet/models';
import { classSchemaDefinition } from '../schemas/class.schema';

export interface IClassDocument extends Omit<Class, 'id'>, Document {
  // MongoDB specific fields
  isDeleted: boolean;
  deletedAt?: Date;

  // Instance methods
  hasSubClass(subClassCode: string): boolean;
  addSubClass(subClassCode: string): void;
  removeSubClass(subClassCode: string): void;
}

export interface IClassModel extends Model<IClassDocument> {
  // Add any static methods here if needed
}

// Create the model using singleton pattern to prevent overwriting
let _ClassModel: IClassModel;

export function getClassModel(): IClassModel {
  if (!_ClassModel) {
    try {
      // Try to get existing model
      _ClassModel = model<IClassDocument>('Class') as IClassModel;
    } catch (error) {
      // Create new model if it doesn't exist
      _ClassModel = model<IClassDocument>('Class', classSchemaDefinition) as IClassModel;
    }
  }
  return _ClassModel;
}

// Legacy export for backward compatibility
export const ClassModel = getClassModel();


// Queries object - using model getter to prevent compilation issues
export const ClassQueries = {
  // Helper function to get model
  getModel: () => getClassModel(),

  // Basic CRUD
  findById: (id: string) => getClassModel().findById(id).where({ isDeleted: { $ne: true } }),
  findByCode: (code: string) => getClassModel().findOne({ code, isDeleted: { $ne: true } }),
  findAll: (filters: any) => getClassModel().find({ ...filters, isDeleted: { $ne: true } }),
  create: (data: Partial<IClassDocument>) => getClassModel().create(data),
  updateById: (id: string, data: Partial<IClassDocument>) =>
    getClassModel().findByIdAndUpdate(id, data, { new: true }),
  deleteById: (id: string) =>
    getClassModel().findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }),

  // Sub-class queries
  findClassesWithSubClasses: () => getClassModel().find({
    subClasses: { $exists: true, $ne: [] },
    isDeleted: { $ne: true }
  }),

  findBySubClass: (subClassCode: string) => getClassModel().find({
    subClasses: subClassCode,
    isDeleted: { $ne: true }
  }),

  // Search with subClasses support
  searchClasses: async (params: ClassSearchParams) => {
    const {
      query,
      category,
      hasSubClasses,
      isActive = undefined,
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
      getClassModel().find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      getClassModel().countDocuments(filter)
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
    const existing = await getClassModel().findOne(query);
    return !existing;
  },

  getMaxSortOrder: async (category?: string) => {
    const filter: any = { isDeleted: { $ne: true } };
    if (category) filter.category = category;

    const maxClass = await getClassModel().findOne(filter)
      .sort({ sortOrder: -1 })
      .select('sortOrder');

    return maxClass?.sortOrder || 0;
  },

  // Sub-class management
  addSubClassToClass: async (classId: string, subClassCode: string) => {
    return getClassModel().findByIdAndUpdate(
      classId,
      { $addToSet: { subClasses: subClassCode } },
      { new: true }
    );
  },

  removeSubClassFromClass: async (classId: string, subClassCode: string) => {
    return getClassModel().findByIdAndUpdate(
      classId,
      { $pull: { subClasses: subClassCode } },
      { new: true }
    );
  },

  // Validate sub-class exists
  validateSubClasses: async (subClassCodes: string[]) => {
    const existingClasses = await getClassModel().find({
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