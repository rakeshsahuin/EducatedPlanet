# Link userid to tutor

1. Tutor document should be connected to a user with role "tutor".
2. In "Add tutor" page (http://localhost:3000/dashboard/tutors/add), add one dropdown to assosiate user to tutor.
    File: "C:\Projects\educatedplanet\admin\src\app\(main)\dashboard\tutors\_components\tutor-form.tsx"
3. Fetch users from "users" collection who are active, email or phone verified, and roles in ("user" or "tutor").
4. If any user already associated in any tutor that user will not be fetched in dropdown values.
5. The dropdown shall be searchable, the search shall happen server side.
6. The display text will be "<full name>(<email id>)" and value will be the userid.
7. Is it possible to add the dropdown just above the tabs and under the text "Fill in the details to create a new tutor profile. All fields marked with * are required."? If not then please suggest which location we can place the dropdown.
8. Field shall be required.
9. Once we select a user, on save, the user role should be changed to "tutor", if user already is tutor then no need to change in user document.
10. Add one info icon along side the dropdown, it should explain once created then we can't change the user after that.
11. In edit tutor, this dropdown shall be disabled and readonly, we are not going to change this value once created.

---

## Comprehensive Implementation Plan

### Overview
This plan outlines the implementation of a user selection dropdown in the tutor creation/editing form to link tutor profiles with existing user accounts. The feature will ensure proper user-tutor associations, handle role management, and maintain data integrity.

### Implementation Strategy

#### Phase 1: Backend API Enhancements

**1. Create User Selection API Endpoint**
- New endpoint: `GET /api/users/available`
- Query parameters: `search`, `limit`
- Response: Array of users with id, name, email
- Filter logic: Active users, verified, roles in ('user', 'tutor'), exclude already linked users

**2. Update User Service**
- Add method: `getAvailableUsersForTutor(search?: string, limit?: number)`
- Implement aggregation to match criteria, exclude linked users, search by name/email

**3. Update Tutor Creation Service**
- Modify `createTutor` to accept `userId` parameter
- Add role update logic when user role changes from 'user' to 'tutor'
- Ensure atomic transaction for user-tutor link creation

#### Phase 2: Frontend Components

**1. Create UserSearchSelect Component**
- Based on existing `LocationSearch` component pattern
- Uses Shadcn's Command component with Popover
- Features: Debounced search (300ms), loading states, keyboard navigation, server-side search

**2. Update Tutor Form Schema**
- Add `userId` field to form schema
- Make it required for new tutors
- Add validation for existing tutor check

**3. Modify Tutor Form Component**
- Add user dropdown above tabs (below descriptive text)
- Implement auto-population of user fields (name, email, phone)
- Fields remain editable as per requirement
- Add info icon with tooltip explaining permanent association
- Handle edit mode: dropdown disabled, show current user

**4. Add Role Change Confirmation Dialog**
- Show when selected user has 'user' role
- Explain role change implications
- Require admin confirmation before proceeding

#### Phase 3: UI/UX Implementation

**Layout:**
```
Fill in the details to create a new tutor profile...
[User Selection Dropdown] [Info Icon]
---------------------------
[Basic Info] [Teaching] [Pricing] [Additional]
```

**Info Icon:**
- Use Lucide's `Info` icon
- Tooltip: "Once a tutor profile is linked to a user, this association cannot be changed"

**Form Field Behavior:**
- Name, Email, Phone: Auto-populated from selected user
- Fields remain editable
- Original user data unchanged
- Edited values saved in tutor collection

#### Phase 4: Data Flow

**Form Submission:**
1. Validate userId is provided
2. If user.role === 'user' and not confirmed: Show role change dialog
3. If confirmed: Update user role to 'tutor', create tutor profile, save form data

**Edit Mode:**
1. Fetch tutor data with populated user info
2. Set userId field with tutor's userId
3. Disable user selection dropdown
4. Auto-populate name, email, phone from tutor data
5. Fields remain editable for updates

### Files to Create/Modify

**New Files:**
- `admin/src/app/api/users/available/route.ts`
- `admin/src/components/forms/UserSearchSelect.tsx`
- `admin/src/components/dialogs/RoleChangeDialog.tsx`

**Modified Files:**
- `dataservice/src/services/user.service.ts`
- `dataservice/src/services/tutor.service.ts`
- `admin/src/app/(main)/dashboard/tutors/_components/tutor-form.tsx`
- `admin/src/app/(main)/dashboard/tutors/_components/schema.ts`
- `admin/src/app/api/tutors/route.ts`

### Implementation Order

1. Backend API - Create user availability endpoint
2. Data Service - Add query method for available users
3. Frontend Component - Create UserSearchSelect component
4. Form Updates - Integrate dropdown into tutor form
5. Form Schema - Add userId validation
6. Role Management - Implement role change dialog
7. Edit Mode - Handle readonly display for existing tutors
8. Testing - Test all scenarios and edge cases

### Testing Scenarios

1. **New Tutor Creation**: Search/select user, auto-populate fields, role change confirmation
2. **Edit Existing Tutor**: Dropdown disabled, show current user, update tutor data
3. **Error Cases**: User already has tutor, user not verified, network errors
4. **Performance**: Search debouncing, large user list handling, API response times

### Technical Considerations

- Add index on `userId` in tutors collection
- Use transactions for role updates and tutor creation
- Implement pagination for user search if >1000 users
- Proper ARIA labels for accessibility
- Validate admin permissions for role changes