import {
  NewSubject,
  CreateSubjectInput,
  UpdateSubjectInput,
  SubjectSearchParams,
  PaginatedResponse,
  SubjectWithClasses,
  AddClassToSubjectInput,
  RemoveClassFromSubjectInput,
  BulkSubjectOperation
} from '@educatedplanet/models';
import { ISubjectDocument, SubjectQueries } from '../datamodels/models/subject.model';
import { databaseConnection } from '../datamodels/connections';

export class SubjectService {
  private initialized = false;

  async ensureInitialized() {
    if (!this.initialized) {
      await databaseConnection.connect();
      this.initialized = true;
    }
  }

  // Transform methods
  private transformSubjectDocument(doc: ISubjectDocument | any): NewSubject {
    if (!doc) return null as any;
    return {
      id: doc._id?.toString() || doc.id,
      name: doc.name,
      code: doc.code,
      classIds: doc.classIds || [],
      description: doc.description,
      keywords: doc.keywords || [],
      isActive: doc.isActive,
      isAcademic: doc.isAcademic,
      sortOrder: doc.sortOrder,
      metadata: doc.metadata || {},
      createdAt: doc.createdAt ? new Date(doc.createdAt) : new Date(),
      updatedAt: doc.updatedAt ? new Date(doc.updatedAt) : new Date()
    };
  }

  // CRUD operations
  async createSubject(subjectData: CreateSubjectInput): Promise<NewSubject> {
    await this.ensureInitialized();

    // Generate code if not provided
    if (!subjectData.code) {
      subjectData.code = await SubjectQueries.generateUniqueCode(subjectData.name);
    }

    // Validate uniqueness
    const existing = await SubjectQueries.findByCode(subjectData.code);
    if (existing) {
      throw new Error(`Subject with code ${subjectData.code} already exists`);
    }

    // Validate class IDs if provided
    if (subjectData.classIds && subjectData.classIds.length > 0) {
      const validation = await SubjectQueries.validateClassIds(subjectData.classIds);
      if (!validation.isValid) {
        throw new Error(`Invalid class IDs: ${validation.missingIds.join(', ')}`);
      }
    }

    // Set default sort order
    if (subjectData.sortOrder === undefined) {
      subjectData.sortOrder = await SubjectQueries.getMaxSortOrder() + 1;
    }

    const subjectDoc = await SubjectQueries.create(subjectData);
    return this.transformSubjectDocument(subjectDoc);
  }

  async updateSubject(id: string, updateData: UpdateSubjectInput): Promise<NewSubject> {
    await this.ensureInitialized();

    // Validate class IDs if being updated
    if (updateData.classIds) {
      const validation = await SubjectQueries.validateClassIds(updateData.classIds);
      if (!validation.isValid) {
        throw new Error(`Invalid class IDs: ${validation.missingIds.join(', ')}`);
      }
    }

    // Generate new code if being updated and doesn't exist
    if (updateData.code && !updateData.code) {
      updateData.code = await SubjectQueries.generateUniqueCode(updateData.name || 'SUBJ');
    }

    const subjectDoc = await SubjectQueries.updateById(id, updateData);
    if (!subjectDoc) {
      throw new Error('Subject not found');
    }

    return this.transformSubjectDocument(subjectDoc);
  }

  async deleteSubject(id: string): Promise<void> {
    await this.ensureInitialized();

    const subjectToDelete = await SubjectQueries.findById(id);
    if (!subjectToDelete) {
      throw new Error('Subject not found');
    }

    // Check if subject is referenced by any tutors or other entities
    // This would be implemented when we have tutor-subject relationships

    await SubjectQueries.deleteById(id);
  }

  async getSubjectById(id: string): Promise<NewSubject> {
    await this.ensureInitialized();
    const doc = await SubjectQueries.findById(id);
    return doc ? this.transformSubjectDocument(doc) : null;
  }

  async getSubjectByCode(code: string): Promise<NewSubject> {
    await this.ensureInitialized();
    const doc = await SubjectQueries.findByCode(code);
    return doc ? this.transformSubjectDocument(doc) : null;
  }

  async getAllSubjects(filters?: any): Promise<NewSubject[]> {
    await this.ensureInitialized();
    const docs = await SubjectQueries.findAll(filters || {});
    return docs.map(doc => this.transformSubjectDocument(doc));
  }

  // Class association management
  async addClassToSubject(subjectId: string, input: AddClassToSubjectInput): Promise<NewSubject> {
    await this.ensureInitialized();

    // Validate class exists
    const { ClassQueries } = await import('../datamodels/models/class.model');
    const classExists = await ClassQueries.findById(input.classId);
    if (!classExists) {
      throw new Error('Class not found');
    }

    const updated = await SubjectQueries.addClassToSubject(subjectId, input.classId);
    return this.transformSubjectDocument(updated);
  }

  async removeClassFromSubject(subjectId: string, input: RemoveClassFromSubjectInput): Promise<NewSubject> {
    await this.ensureInitialized();

    const updated = await SubjectQueries.removeClassFromSubject(subjectId, input.classId);
    return this.transformSubjectDocument(updated);
  }

  async getSubjectsByClass(classId: string): Promise<NewSubject[]> {
    await this.ensureInitialized();
    const subjects = await SubjectQueries.findSubjectsByClass(classId);
    return subjects.map(doc => this.transformSubjectDocument(doc));
  }

  async getSubjectsWithClasses(): Promise<SubjectWithClasses[]> {
    await this.ensureInitialized();
    const subjects = await SubjectQueries.findSubjectsWithClasses();

    return Promise.all(
      subjects.map(async (doc) => {
        const classDetails = await Promise.all(
          doc.classIds.map(async (classId: string) => {
            const { ClassQueries } = await import('../datamodels/models/class.model');
            return ClassQueries.findById(classId);
          })
        );

        return {
          ...this.transformSubjectDocument(doc),
          classDetails: classDetails.filter(Boolean).map(classDoc => {
            // Transform the class document similar to how classes are transformed
            const classData = {
              id: classDoc._id?.toString() || classDoc.id,
              name: classDoc.name,
              code: classDoc.code,
              category: classDoc.category,
              subClasses: classDoc.subClasses || [],
              description: classDoc.description || '',
              isActive: classDoc.isActive,
              sortOrder: classDoc.sortOrder,
              metadata: classDoc.metadata || {},
              createdAt: classDoc.createdAt ? new Date(classDoc.createdAt) : new Date(),
              updatedAt: classDoc.updatedAt ? new Date(classDoc.updatedAt) : new Date()
            };
            return classData;
          })
        };
      })
    );
  }

  // Search operations
  async searchSubjects(params: SubjectSearchParams): Promise<PaginatedResponse<NewSubject>> {
    await this.ensureInitialized();
    const result = await SubjectQueries.searchSubjects(params);

    return {
      ...result,
      items: result.items.map(doc => this.transformSubjectDocument(doc))
    };
  }

  // Specialty queries
  async getPopularSubjects(limit: number = 10): Promise<NewSubject[]> {
    await this.ensureInitialized();
    const subjects = await SubjectQueries.getPopularSubjects(limit);
    return subjects.map(doc => this.transformSubjectDocument(doc));
  }

  async getAcademicSubjects(isAcademic: boolean = true): Promise<NewSubject[]> {
    await this.ensureInitialized();
    const subjects = await SubjectQueries.getSubjectsByType(isAcademic);
    return subjects.map(doc => this.transformSubjectDocument(doc));
  }

  // Utility operations
  async isCodeUnique(code: string, excludeId?: string): Promise<boolean> {
    await this.ensureInitialized();
    return SubjectQueries.isCodeUnique(code, excludeId);
  }

  async reorderSubjects(subjectOrders: { id: string; sortOrder: number }[]): Promise<void> {
    await this.ensureInitialized();

    // Transform to match expected format for bulkUpdateSubjects
    const updates = subjectOrders.map(({ id, sortOrder }) => ({
      id,
      data: { sortOrder }
    }));

    await SubjectQueries.bulkUpdateSubjects(updates);
  }

  async importSubjects(subjects: CreateSubjectInput[]): Promise<{
    successful: NewSubject[];
    errors: { index: number; error: string }[];
  }> {
    await this.ensureInitialized();

    const successful: NewSubject[] = [];
    const errors: { index: number; error: string }[] = [];

    for (let i = 0; i < subjects.length; i++) {
      try {
        const created = await this.createSubject(subjects[i]);
        successful.push(created);
      } catch (error: any) {
        errors.push({ index: i, error: error.message });
      }
    }

    return { successful, errors };
  }

  // Bulk operations
  async bulkOperation(operation: BulkSubjectOperation): Promise<{
    successful: number;
    errors: string[];
  }> {
    await this.ensureInitialized();

    const updates = operation.subjectIds.map(id => {
      let data: any = {};

      switch (operation.operation) {
        case 'activate':
          data = { isActive: true };
          break;
        case 'deactivate':
          data = { isActive: false };
          break;
        case 'updateMetadata':
          data = { metadata: operation.data };
          break;
        default:
          throw new Error(`Unsupported operation: ${operation.operation}`);
      }

      return { id, data };
    });

    try {
      const result = await SubjectQueries.bulkUpdateSubjects(updates);
      return {
        successful: result.modifiedCount,
        errors: []
      };
    } catch (error: any) {
      return {
        successful: 0,
        errors: [error.message]
      };
    }
  }

  // Toggle academic/non-academic status
  async toggleAcademicStatus(id: string, isAcademic: boolean): Promise<NewSubject> {
    await this.ensureInitialized();
    return this.updateSubject(id, { isAcademic });
  }

  // Toggle active status
  async toggleActiveStatus(id: string, isActive: boolean): Promise<NewSubject> {
    await this.ensureInitialized();
    return this.updateSubject(id, { isActive });
  }

  // Update popularity
  async updatePopularity(id: string, isPopular: boolean): Promise<NewSubject> {
    await this.ensureInitialized();
    return this.updateSubject(id, {
      metadata: { popular: isPopular }
    });
  }

  // Get subjects by class categories
  async getSubjectsByClassCategories(classCategories: string[]): Promise<NewSubject[]> {
    await this.ensureInitialized();
    const subjects = await SubjectQueries.getSubjectsByClassCategories(classCategories);
    return subjects.map(doc => this.transformSubjectDocument(doc));
  }
}

// Export singleton instance
export const subjectService = new SubjectService();