import { Document, Model, model } from 'mongoose';
import {
  NewSubject,
  SubjectSearchParams,
  PaginatedResponse,
  CreateSubjectInput,
  UpdateSubjectInput,
  SubjectWithClasses,
  AddClassToSubjectInput,
  RemoveClassFromSubjectInput,
  BulkSubjectOperation
} from '@educatedplanet/models';
import { subjectSchemaDefinition } from '../schemas/subject.schema';

export interface ISubjectDocument extends Omit<NewSubject, 'id'>, Document {
  // MongoDB specific fields
  isDeleted: boolean;
  deletedAt?: Date;

  // Instance methods
  hasClass(classId: string): boolean;
  addClass(classId: string): void;
  removeClass(classId: string): void;
  updatePopularity(isPopular: boolean): void;
}

export interface ISubjectModel extends Model<ISubjectDocument> {
  // Static methods can be added here if needed
}

// Singleton pattern for model
let SubjectModel: ISubjectModel;

export function getSubjectModel(): ISubjectModel {
  if (!SubjectModel) {
    try {
      SubjectModel = model<ISubjectDocument>('Subject') as ISubjectModel;
    } catch (error) {
      SubjectModel = model<ISubjectDocument>('Subject', subjectSchemaDefinition) as ISubjectModel;
    }
  }
  return SubjectModel;
}

// Queries object - following ClassQueries pattern
export const SubjectQueries = {
  // Helper function to get model
  getModel: () => getSubjectModel(),

  // Basic CRUD
  findById: (id: string) => getSubjectModel().findById(id).where({ isDeleted: { $ne: true } }),
  findByCode: (code: string) => getSubjectModel().findOne({ code, isDeleted: { $ne: true } }),
  findAll: (filters: any) => getSubjectModel().find({ ...filters, isDeleted: { $ne: true } }),
  create: (data: Partial<ISubjectDocument>) => getSubjectModel().create(data),
  updateById: (id: string, data: Partial<ISubjectDocument>) =>
    getSubjectModel().findByIdAndUpdate(id, data, { new: true }),
  deleteById: (id: string) =>
    getSubjectModel().findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }),

  // Class relationship queries
  findSubjectsByClass: (classId: string) => getSubjectModel().find({
    classIds: classId,
    isDeleted: { $ne: true }
  }),

  findSubjectsWithClasses: () => getSubjectModel().find({
    classIds: { $exists: true, $ne: [] },
    isDeleted: { $ne: true }
  }),

  // Advanced search with comprehensive filtering
  searchSubjects: async (params: SubjectSearchParams) => {
    const {
      query,
      isAcademic,
      isActive = true,
      classId,
      hasKeywords,
      difficulty,
      popular,
      page = 1,
      limit = 20,
      sortBy = 'sortOrder',
      sortOrder = 'asc'
    } = params;

    const filter: any = { isDeleted: { $ne: true } };

    if (isActive !== undefined) filter.isActive = isActive;
    if (isAcademic !== undefined) filter.isAcademic = isAcademic;
    if (classId) filter.classIds = classId;
    if (difficulty) filter['metadata.difficulty'] = difficulty;
    if (popular !== undefined) filter['metadata.popular'] = popular;

    if (hasKeywords !== undefined) {
      filter.keywords = hasKeywords ? { $exists: true, $ne: [] } : { $in: [[]] };
    }

    if (query) {
      filter.$text = { $search: query };
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    const [subjects, total] = await Promise.all([
      getSubjectModel().find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('classIds', 'name code category') // Populate class details
        .lean(),
      getSubjectModel().countDocuments(filter)
    ]);

    return {
      items: subjects,
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

  // Popular subjects
  getPopularSubjects: (limit: number = 10) => getSubjectModel().find({
    'metadata.popular': true,
    isActive: true,
    isDeleted: { $ne: true }
  })
    .sort({ sortOrder: 1, name: 1 })
    .limit(limit),

  // Academic vs non-academic
  getSubjectsByType: (isAcademic: boolean, isActive: boolean = true) =>
    getSubjectModel().find({
      isAcademic,
      isActive,
      isDeleted: { $ne: true }
    }).sort({ sortOrder: 1, name: 1 }),

  // Utility methods
  isCodeUnique: async (code: string, excludeId?: string) => {
    const query: any = { code, isDeleted: { $ne: true } };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await getSubjectModel().findOne(query);
    return !existing;
  },

  getMaxSortOrder: async () => {
    const filter: any = { isDeleted: { $ne: true } };

    const maxSubject = await getSubjectModel().findOne(filter)
      .sort({ sortOrder: -1 })
      .select('sortOrder');

    return maxSubject?.sortOrder || 0;
  },

  generateUniqueCode: async (baseName: string) => {
    const baseCode = baseName.toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 8);

    let code = baseCode;
    let counter = 1;

    while (!(await SubjectQueries.isCodeUnique(code))) {
      code = `${baseCode}-${counter}`;
      counter++;
    }

    return code;
  },

  // Class association management
  addClassToSubject: async (subjectId: string, classId: string) => {
    return getSubjectModel().findByIdAndUpdate(
      subjectId,
      { $addToSet: { classIds: classId } },
      { new: true }
    );
  },

  removeClassFromSubject: async (subjectId: string, classId: string) => {
    return getSubjectModel().findByIdAndUpdate(
      subjectId,
      { $pull: { classIds: classId } },
      { new: true }
    );
  },

  // Validate class IDs exist
  validateClassIds: async (classIds: string[]) => {
    const { ClassQueries } = await import('./class.model');
    const existingClasses = await ClassQueries.findAll({
      _id: { $in: classIds }
    }).select('_id name code');

    const existingIds = existingClasses.map(c => c._id.toString());
    const missingIds = classIds.filter(id => !existingIds.includes(id));

    return {
      isValid: missingIds.length === 0,
      missingIds,
      existingIds,
      existingClasses
    };
  },

  // Bulk operations
  bulkUpdateSubjects: async (updates: { id: string; data: any }[]) => {
    const bulkOps = updates.map(({ id, data }) => ({
      updateOne: {
        filter: { _id: id, isDeleted: { $ne: true } },
        update: data
      }
    }));

    return getSubjectModel().bulkWrite(bulkOps);
  },

  // Get subjects for specific class categories
  getSubjectsByClassCategories: async (classCategories: string[]) => {
    // Get classes in these categories
    const { ClassQueries } = await import('./class.model');
    const classes = await ClassQueries.findAll({
      category: { $in: classCategories },
      isActive: true,
      isDeleted: { $ne: true }
    }).select('_id');

    const classIds = classes.map(c => c._id);

    // Find subjects associated with these classes
    return getSubjectModel().find({
      classIds: { $in: classIds },
      isActive: true,
      isDeleted: { $ne: true }
    }).sort({ sortOrder: 1, name: 1 });
  }
};