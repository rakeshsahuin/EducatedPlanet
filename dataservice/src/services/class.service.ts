import {
  Class,
  CreateClassInput,
  UpdateClassInput,
  ClassSearchParams,
  PaginatedResponse,
  ClassWithSubClasses,
  AddSubClassInput,
  RemoveSubClassInput
} from '@educatedplanet/models';
import { IClassDocument, ClassQueries } from '../datamodels/models/class.model';
import { databaseConnection } from '../datamodels/connections';

export class ClassService {
  private initialized = false;

  async ensureInitialized() {
    if (!this.initialized) {
      await databaseConnection.connect();
      this.initialized = true;
    }
  }

  // Transform methods
  private transformClassDocument(doc: IClassDocument | any): Class {
    if (!doc) return null as any;
    return {
      id: doc._id?.toString() || doc.id,
      name: doc.name,
      code: doc.code,
      category: doc.category,
      subClasses: doc.subClasses || [],
      description: doc.description,
      isActive: doc.isActive,
      sortOrder: doc.sortOrder,
      metadata: doc.metadata || {},
      createdAt: doc.createdAt ? new Date(doc.createdAt) : new Date(),
      updatedAt: doc.updatedAt ? new Date(doc.updatedAt) : new Date()
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

    // Get class to check references
    const classToDelete = await ClassQueries.findById(id);
    if (!classToDelete) {
      throw new Error('Class not found');
    }

    // Check if this class is referenced as a sub-class
    const referencingClasses = await ClassQueries.findBySubClass(classToDelete.code);

    if (referencingClasses.length > 0) {
      throw new Error('Cannot delete class that is referenced as a sub-class');
    }

    await ClassQueries.deleteById(id);
  }

  async getClassById(id: string): Promise<Class | null> {
    await this.ensureInitialized();
    const doc = await ClassQueries.findById(id);
    return doc ? this.transformClassDocument(doc) : null;
  }

  async getClassByCode(code: string): Promise<Class | null> {
    await this.ensureInitialized();
    const doc = await ClassQueries.findByCode(code);
    return doc ? this.transformClassDocument(doc) : null;
  }

  async getAllClasses(filters?: any): Promise<Class[]> {
    await this.ensureInitialized();
    const docs = await ClassQueries.findAll(filters || {});
    return docs.map(doc => this.transformClassDocument(doc));
  }

  // Sub-class management
  async addSubClass(classId: string, input: AddSubClassInput): Promise<Class> {
    await this.ensureInitialized();

    // Check if sub-class exists, create if not
    let subClass = await ClassQueries.findByCode(input.subClassCode);
    if (!subClass) {
      // Create the sub-class
      const parentClass = await ClassQueries.findById(classId);
      if (!parentClass) {
        throw new Error('Parent class not found');
      }
      await this.createClass({
        name: input.subClassName,
        code: input.subClassCode,
        category: parentClass.category
      });
    }

    const updated = await ClassQueries.addSubClassToClass(classId, input.subClassCode);
    return this.transformClassDocument(updated);
  }

  async removeSubClass(classId: string, input: RemoveSubClassInput): Promise<Class> {
    await this.ensureInitialized();

    const updated = await ClassQueries.removeSubClassFromClass(classId, input.subClassCode);
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

  async findBySubClass(subClassCode: string): Promise<Class[]> {
    await this.ensureInitialized();
    const classes = await ClassQueries.findBySubClass(subClassCode);
    return classes.map(doc => this.transformClassDocument(doc));
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

  // Utility operations
  async isCodeUnique(code: string, excludeId?: string): Promise<boolean> {
    await this.ensureInitialized();
    return ClassQueries.isCodeUnique(code, excludeId);
  }

  async reorderClasses(classOrders: { id: string; sortOrder: number }[]): Promise<void> {
    await this.ensureInitialized();

    // Import getClassModel to use bulkWrite
    const { getClassModel } = await import('../datamodels/models/class.model');
    const ClassModel = getClassModel();

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
      } catch (error: any) {
        errors.push({ index: i, error: error.message });
      }
    }

    return { successful, errors };
  }

  // Batch operations for bulk updates
  async bulkUpdateClasses(updates: { id: string; data: UpdateClassInput }[]): Promise<Class[]> {
    await this.ensureInitialized();

    const results: Class[] = [];
    for (const { id, data } of updates) {
      try {
        const updated = await this.updateClass(id, data);
        results.push(updated);
      } catch (error) {
        // Log error but continue with other updates
        console.error(`Failed to update class ${id}:`, error);
      }
    }

    return results;
  }

  // Get classes by category
  async getClassesByCategory(category: string): Promise<Class[]> {
    await this.ensureInitialized();
    const docs = await ClassQueries.findAll({ category });
    return docs.map(doc => this.transformClassDocument(doc));
  }

  // Activate/deactivate class
  async toggleClassStatus(id: string, isActive: boolean): Promise<Class> {
    await this.ensureInitialized();
    return this.updateClass(id, { isActive });
  }
}

// Export singleton instance
export const classService = new ClassService();