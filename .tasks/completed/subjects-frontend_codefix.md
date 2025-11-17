# Technical Plan: Update Subjects API to Use DataService

## Current State Analysis
✅ **The dataservice layer for subjects is fully implemented and ready:**
- `SubjectService` is complete with all CRUD operations
- MongoDB models and queries are implemented
- All types are exported from `@educatedplanet/models`
- Service is properly exported from `dataservice/src/index.ts`

❌ **Issues to fix:**
1. Subjects API routes use `@/lib/static-api` (mock service) instead of `@educatedplanet/dataservice`
2. Missing authentication middleware (`requireRole('admin')`)
3. Inconsistent error handling compared to classes API

## Implementation Plan

### Phase 1: Update Main Subjects Route (`/api/subjects/route.ts`)
1. **Replace import**: Change from `@/lib/static-api` to `@educatedplanet/dataservice`
2. **Add authentication**: Import and use `requireRole('admin')` in GET and POST
3. **Update service calls**: Replace `subjectService.getSubjects()` with `subjectService.searchSubjects()`
4. **Fix parameter mapping**: Use proper `SubjectSearchParams` interface
5. **Add auth error handling**: Follow the same pattern as classes API
6. **Improve validation**: Add required field validation for POST

### Phase 2: Update Individual Subject Route (`/api/subjects/[id]/route.ts`)
1. **Replace import**: Change from `@/lib/static-api` to `@educatedplanet/dataservice`
2. **Add authentication**: Import and use `requireRole('admin')` in all operations
3. **Fix service method names**:
   - `getSubjectById()` → `getById()`
   - `updateSubject()` → `updateById()`
   - `deleteSubject()` → `deleteById()`
4. **Add auth error handling**: Follow the same pattern as classes API
5. **Fix import statement**: Import `UpdateSubjectInput` from `@educatedplanet/models`

### Phase 3: Verify Integration
1. **Test all CRUD operations**: Ensure proper MongoDB integration
2. **Verify authentication**: Check admin role enforcement
3. **Test error handling**: Ensure proper error responses
4. **Update any dependent components**: Ensure admin UI components work with real data

## Key Changes Summary

### Files to modify:

#### 1. `admin/src/app/api/subjects/route.ts`
**Current Issues:**
- Uses `@/lib/static-api` instead of `@educatedplanet/dataservice`
- Missing `requireRole('admin')` authentication
- Uses `subjectService.getSubjects()` instead of `searchSubjects()`
- Basic error handling without auth considerations

**Required Changes:**
```typescript
// Replace import
import { subjectService } from '@educatedplanet/dataservice';
import { CreateSubjectInput, SubjectSearchParams } from '@educatedplanet/models';
import { requireRole } from '@/lib/auth-utils';

// Add authentication in GET
export async function GET(request: NextRequest) {
  try {
    await requireRole('admin');

    // Use proper search params
    const params: SubjectSearchParams = {
      query: searchParams.get('search') || undefined,
      isAcademic: searchParams.get('isAcademic') ? searchParams.get('isAcademic') === 'true' : undefined,
      isActive: searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : undefined,
      classId: searchParams.get('classId') || undefined,
      difficulty: searchParams.get('difficulty') as 'beginner' | 'intermediate' | 'advanced' || undefined,
      popular: searchParams.get('popular') ? searchParams.get('popular') === 'true' : undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10,
      sortBy: searchParams.get('sortBy') as 'name' | 'sortOrder' | 'createdAt' | 'popular' || undefined,
      sortOrder: searchParams.get('sortOrder') as 'asc' | 'desc' || undefined
    };

    const result = await subjectService.searchSubjects(params);

    // Add auth error handling (follow classes API pattern)
  }
}

// Add authentication in POST
export async function POST(request: NextRequest) {
  try {
    await requireRole('admin');

    // Add validation for required fields
    if (!body.name || !body.code) {
      return NextResponse.json({
        success: false,
        error: 'Name and code are required'
      }, { status: 400 });
    }

    // Use proper service method
    const newSubject = await subjectService.createSubject(subjectData);

    // Add auth error handling
  }
}
```

#### 2. `admin/src/app/api/subjects/[id]/route.ts`
**Current Issues:**
- Uses `@/lib/static-api` instead of `@educatedplanet/dataservice`
- Missing `requireRole('admin')` authentication
- Incorrect method names

**Required Changes:**
```typescript
// Replace import
import { subjectService } from '@educatedplanet/dataservice';
import { UpdateSubjectInput } from '@educatedplanet/models';
import { requireRole } from '@/lib/auth-utils';

// Add authentication to all methods
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await requireRole('admin');
    const { id } = await params;

    // Fix method name
    const subject = await subjectService.getById(id);

    // Add auth error handling
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await requireRole('admin');
    const { id } = await params;

    // Fix method name
    const updatedSubject = await subjectService.updateById(id, updateData);

    // Add auth error handling
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await requireRole('admin');
    const { id } = await params;

    // Fix method name
    const deleted = await subjectService.deleteById(id);

    // Add auth error handling
  }
}
```

### Patterns to follow (from classes API):
- **Authentication**: `await requireRole('admin')` at start of each handler
- **Parameter parsing**: Proper type casting and undefined handling
- **Error handling**:
  - Auth errors (401) with redirect to `/auth/login`
  - Validation errors (400/409) with specific messages
  - Server errors (500) with generic messages
- **Response format**: Consistent success/error response structure

### Expected Outcome:
After implementation:
1. Subjects API will properly connect to MongoDB
2. All endpoints will require admin authentication
3. Error handling will be consistent with classes API
4. Admin UI will work with real data instead of static mock data
5. Full CRUD operations will be available for subjects management

## Testing Checklist:
- [ ] GET /api/subjects returns paginated results with filters
- [ ] POST /api/subjects creates new subject with validation
- [ ] GET /api/subjects/[id] returns specific subject
- [ ] PUT /api/subjects/[id] updates subject
- [ ] DELETE /api/subjects/[id] deletes subject
- [ ] All endpoints return 401 for unauthenticated requests
- [ ] All endpoints return proper error responses
- [ ] Admin UI components work with real data