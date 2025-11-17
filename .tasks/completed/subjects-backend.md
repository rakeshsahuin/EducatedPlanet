# Subjects Backend Implementation Plan

## Overview
Create a comprehensive subjects management system that follows the same patterns as the classes implementation, with subjects able to belong to multiple classes through a `classIds` array.

## Phase 1: Models Package

### 1.1 Create `models/src/subject/types.ts`
- Core Subject interface with fields: id, name, code, classIds[], description, keywords[], isActive, isAcademic, sortOrder, metadata
- SubjectMetadata interface with basic fields: difficulty, duration, prerequisites, topics (extendable)
- CRUD interfaces: CreateSubjectInput, UpdateSubjectInput, SubjectSearchParams
- Class association interfaces: AddClassToSubjectInput, RemoveClassFromSubjectInput

### 1.2 Update `models/src/index.ts`
- Export all subject-related types

## Phase 2: DataService Package

### 2.1 Schema Layer: `dataservice/src/datamodels/schemas/subject.schema.ts`
- Mongoose schema with validation
- Auto-generate codes if not provided (e.g., "Mathematics" � "MATH")
- Indexes for performance (code, text search on name/description/keywords, classIds, isActive)
- Pre-save middleware for code generation and validation
- Instance methods: hasClass(), addClass(), removeClass()

### 2.2 Model Layer: `dataservice/src/datamodels/models/subject.model.ts`
- ISubjectDocument interface
- Singleton pattern for SubjectModel (following ClassModel pattern)
- SubjectQueries object with:
  - Basic CRUD operations
  - Class relationship queries (findByClass, findSubjectsByClass)
  - Advanced search with filters (isAcademic, keywords, classId)
  - Utility methods (isCodeUnique, getMaxSortOrder, validateClassIds)

### 2.3 Service Layer: `dataservice/src/services/subject.service.ts`
- SubjectService class with:
  - CRUD operations with validation
  - Class association management (addClassToSubject, removeClassFromSubject)
  - Search capabilities with comprehensive filtering
  - Bulk operations (importSubjects, bulkOperation)
  - Transform methods for data conversion

## Phase 3: Admin API Implementation

### 3.1 API Routes
- `/api/subjects` - GET (list/search) and POST (create)
- `/api/subjects/[id]` - GET, PUT, DELETE for individual subjects
- Admin authentication using `requireRole('admin')`
- Proper error handling and validation

## Key Features

### Core Functionality
- **Multi-class association**: Subjects can belong to multiple classes via classIds array
- **Hybrid code generation**: Manual codes with auto-generation fallback
- **Academic vs Non-academic**: Distinction with isAcademic flag
- **Keyword-based search**: Enhanced discoverability
- **Soft delete pattern**: Following classes implementation

### Database Design
- **Embed-based relationship**: classIds array in Subject document
- **Strategic indexing**: For performance optimization
- **Referential validation**: Ensure classIds exist
- **Progressive metadata**: Start basic, extend later

## Implementation Order
1. Update models package with types
2. Create schema with validation and auto-generation
3. Implement queries with singleton pattern
4. Build service layer with business logic
5. Implement admin API routes
6. Update all exports and index files

This plan provides a solid foundation for subject management that integrates seamlessly with the existing classes system and prepares for future tutor-subject relationships.