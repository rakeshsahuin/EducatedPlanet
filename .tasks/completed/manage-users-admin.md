# Manage Users Admin Page - CRUD Implementation Plan

## Current State Analysis

** What's Already Implemented:**
- Complete UI components (UsersTable, UserModal, columns)
- Full backend API with all CRUD endpoints
- User service layer with all necessary methods
- Form validation with Zod schemas
- Table structure with search and filtering
- User roles: user, tutor, admin

**L What's Missing:**
- Frontend connected to real API (currently using static data)
- Functional edit/delete operations
- Verification toggle functionality
- Real-time data refresh after operations
- Support for "sub-admin" user role

## Implementation Plan

### Phase 1: API Integration (Priority: High)

**1. Update UsersTable to use Real API**
- Replace static `usersData` with fetch calls to `/api/users`
- Add loading states and error handling
- Implement pagination with the existing table system
- Pass search and filter parameters to API
- Remove dependency on `@/lib/static-api.ts` after completion

**2. Connect UserModal to Backend**
- Update form submission to call real API endpoints:
  - Create: `POST /api/users`
  - Edit: `PUT /api/users/[id]`
- Add proper loading states and error handling
- Show success/error toast notifications
- Reset form and close modal on success

**3. Implement Edit Functionality**
- Add edit state management (similar to classes/subjects)
- Fetch user data when edit button is clicked
- Populate UserModal with fetched data
- Handle form submission for updates
- Dispatch refresh event after successful update

**4. Add Delete Operations**
- Implement delete confirmation dialog (AlertDialog)
- Connect to `DELETE /api/users/[id]` endpoint
- Show loading state during deletion
- Dispatch custom event to refresh table after deletion

**5. Implement Verification Toggle**
- Add handler for verify/unverify actions
- Connect to `PUT /api/users/[id]` with verification status
- Update UI to reflect changes immediately
- Show appropriate success messages

### Phase 2: Enhanced Features (Priority: Medium)

**1. Add Event-Driven Refresh System**
- Implement `refreshUsersTable` custom event listener
- Update table data after any CRUD operation
- Maintain current page and filters

**2. Improve Error Handling**
- Add comprehensive error messages
- Handle network failures gracefully
- Implement retry mechanisms for failed operations

**3. Bulk Operations**
- Implement bulk selection using existing checkboxes
- Add bulk delete functionality
- Support bulk verification updates

**4. Add Sub-Admin Role Support**
- Update user role enum to include: 'user' | 'tutor' | 'sub-admin' | 'admin'
- Update UserModal to include "Sub-Admin" option in role dropdown
- Update role badge styling for sub-admin (use "outline" variant)
- Update role filtering to include sub-admin option
- Ensure API endpoints handle sub-admin role correctly
- Update permissions: Sub-admins can manage users/tutors but not other admins

### Phase 3: UI/UX Improvements (Priority: Low)

**1. Add Loading Indicators**
- Skeleton loaders during data fetch
- Button loading states during operations
- Progress indicators for bulk actions

**2. Enhanced User Experience**
- Confirmation dialogs for destructive actions
- Undo functionality for deletions
- Better visual feedback for status changes

**3. Role-Based UI**
- Show/hide certain actions based on user role
- Sub-admins cannot edit/delete admin users
- Display role hierarchy in UI

## Files to Modify

1. **`users-table.tsx`**
   - Replace static data with API calls
   - Add event listeners
   - Update role filter options

2. **`columns.tsx`**
   - Implement functional handlers for edit, delete, verify actions
   - Add role-based permission checks
   - Update role variant function for sub-admin

3. **`user-modal.tsx`**
   - Connect to real API
   - Add auto-open for edit mode
   - Add sub-admin to role options

4. **`schema.ts`**
   - Ensure proper TypeScript types for API responses
   - Update role types to include sub-admin

5. **`@/lib/static-api.ts`**
   - **DELETE this file** after implementation is complete

6. **Backend Models & API**
   - Update User interface to include sub-admin role
   - Ensure all CRUD operations handle sub-admin role

## Technical Implementation Details

### Role Hierarchy & Permissions
```typescript
// Role hierarchy: admin > sub-admin > tutor > user

const ROLE_PERMISSIONS = {
  admin: ['read', 'write', 'delete', 'manage_admins'],
  'sub-admin': ['read', 'write', 'delete_users_tutors'],
  tutor: ['read', 'update_profile'],
  user: ['read', 'update_profile']
};
```

### API Integration Pattern
```typescript
// Fetch users with filters
const fetchUsers = async () => {
  const params = new URLSearchParams({
    page: currentPage.toString(),
    limit: pageSize.toString(),
    ...(searchTerm && { search: searchTerm }),
    ...(roleFilter !== "all" && { role: roleFilter }),
    ...(statusFilter !== "all" && { verificationStatus: statusFilter })
  });

  const response = await fetch(`/api/users?${params}`);
  const result = await response.json();

  if (result.success) {
    setUsers(result.data);
    setPagination(result.pagination);
  }
};
```

### Custom Event Pattern
```typescript
// After successful operation
window.dispatchEvent(new CustomEvent('refreshUsersTable'));
```

### Edit Modal Pattern
```typescript
// Handle edit click
const handleEditClick = async (userId: string) => {
  setIsLoading(true);
  try {
    const response = await fetch(`/api/users/${userId}`);
    const result = await response.json();
    if (result.success) {
      setEditingUser(result.data);
      setShowEditModal(true);
    }
  } finally {
    setIsLoading(false);
  }
};
```

### Role Variant Function Update
```typescript
const getRoleVariant = (role: string) => {
  switch (role) {
    case "admin":
      return "destructive";
    case "sub-admin":
      return "outline"; // Gray/outline for sub-admin
    case "tutor":
      return "default";
    case "user":
      return "secondary";
    default:
      return "outline";
  }
};
```

## Backend Changes Required

### User Model Updates
```typescript
// In models/src/user/user.types.ts
export type UserRole = 'user' | 'tutor' | 'sub-admin' | 'admin';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: UserRole; // Updated to include sub-admin
  avatar?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Database Migration
- Update existing users collection to support sub-admin role
- No migration needed if using flexible schema (MongoDB)

### API Updates
- All CRUD endpoints already support flexible role field
- Just need to update validation schemas to accept sub-admin

## Success Criteria

-  All CRUD operations functional (Create, Read, Update, Delete)
-  Real-time data synchronization with database
-  Verification toggle working
-  No page reloads - using custom events for refresh
-  Proper error handling and user feedback
-  Loading states for all operations
-  Responsive design maintained
-  Sub-admin role fully supported
-  Role-based permissions implemented
-  Static API file removed

## Post-Implementation Cleanup

1. **Remove static-api.ts**
   - Delete file: `admin/src/lib/static-api.ts`
   - Remove any imports referencing it
   - Verify no components are using static data

2. **Testing**
   - Test all CRUD operations with each user role
   - Verify sub-admin permissions work correctly
   - Test bulk operations
   - Verify error handling for edge cases

## Notes

- Follow the exact same patterns implemented in classes and subjects CRUD
- Maintain consistency with existing UI/UX patterns
- Use the same custom event system for table refreshes
- Ensure all TypeScript types are properly updated
- The sub-admin role sits between tutor and admin in hierarchy