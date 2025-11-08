# Better Auth Implementation Plan for Admin Panel

## Overview
This plan outlines the integration of Better Auth authentication system for the EducatedPlanet admin panel using Next.js 16, MongoDB, and TypeScript.

## Current State Analysis
- Admin panel has UI components but no authentication logic
- Existing user data in MongoDB with email/password fields
- Dashboard routes require protection
- Login page UI already designed at `admin/src/app/(main)/auth/login/page.tsx`
- Environment variables already configured

## Phase 1: Setup & Dependencies

### 1. Install Dependencies
```bash
# In admin folder
cd admin
pnpm add better-auth @better-auth/react

# In dataservice folder
cd dataservice
pnpm add better-auth mongodb

# In common folder
cd common
pnpm add bcryptjs @types/bcryptjs
```

## Phase 2: Password Hashing Utility (Common Folder)

### 2. Create Password Hashing Utility
**File**: `common/src/utils/password.ts`
- Implement bcrypt hash function (cost factor: 12)
- Implement bcrypt verify function
- Export as pure functions for reuse across packages
- Add TypeScript types for password operations

## Phase 3: Database & Repository Layer

### 3. Update User Repository in Dataservice
**File**: `dataservice/src/repositories/user.repository.ts`
- Add method: `findByEmail(email: string)` - Find user by email
- Add method: `createAuthUser(userData)` - Create user with hashed password
- Add method: `validateCredentials(email, password)` - Validate login
- Use existing Mongoose connection from `connections.ts`
- Maintain compatibility with existing User schema

### 4. Create Auth Service in Dataservice
**File**: `dataservice/src/services/auth.service.ts`
- Integrate with Better Auth MongoDB adapter
- Handle user session management
- Provide auth-related business logic
- Export auth utilities for admin consumption

## Phase 4: Better Auth Configuration

### 5. Create Auth Server Configuration
**File**: `admin/src/lib/auth.ts`
- Configure Better Auth with MongoDB adapter
- Use existing database connection from dataservice
- Set up email/password authentication only
- Configure secure session settings:
  - Session expiresIn: 7 days
  - CookieCache: enabled with 5-minute maxAge
  - Trusted origins: localhost:3000
- Add custom password hashing using bcrypt from common package
- Add additional user fields (username, role)

### 6. Create Auth API Routes
**File**: `admin/src/app/api/auth/[...all]/route.ts`
- Handle all Better Auth endpoints
- Use NextJS handler from Better Auth
- Configure for admin panel only

## Phase 5: Client Configuration & Components

### 7. Create Auth Client Configuration
**File**: `admin/src/lib/auth-client.ts`
- Set up Better Auth React client
- Export signIn, signUp, signOut, useSession, getSession
- Configure base URL from environment

### 8. Update Login Form Component
**File**: `admin/src/app/(main)/auth/_components/login-form.tsx`
- Replace existing form with Better Auth integration
- Add email and password input validation
- Implement form submission with signIn.email()
- Handle loading states
- Display error messages to user
- Add remember me functionality
- Redirect to dashboard on success

## Phase 6: Route Protection

### 9. Create Middleware
**File**: `admin/src/middleware.ts`
- Protect all `/dashboard/*` routes
- Protect root route `/` (redirect to dashboard if authenticated)
- Redirect unauthenticated users to `/auth/login`
- Allow access to `/auth/login` and `/auth/register` (if needed)
- Use Better Auth session validation

### 10. Create Auth Utilities
**File**: `admin/src/lib/auth-utils.ts`
- `getServerSession()` - Get session on server side
- `requireAuth()` - Protect server components
- `requireRole()` - Role-based access control
- Export session and user types from Better Auth

### 11. Update Dashboard Layout
**File**: `admin/src/app/(main)/dashboard/layout.tsx`
- Add server-side session check
- Redirect to login if not authenticated
- Pass session data to client components

## Phase 7: Integration & Updates

### 12. Update Header Component
**File**: `admin/src/app/(main)/dashboard/_components/header.tsx`
- Display logged-in user information
- Add logout button/form(logout button will be there in the UI)
- Update user avatar or initials

### 13. Protect Dashboard Pages
Update all pages in `admin/src/app/(main)/dashboard/`:
- Add `requireAuth()` at the top of each page
- Use session data for user-specific operations
- Handle loading states appropriately

### 14. Remove/Register Route Management
- Since admin users are created manually, consider removing `/auth/register`
- Or protect it with super-admin role requirement
- Update login page link to register if needed

## Key Implementation Details

### Environment Variables (Already Configured)
```
BETTER_AUTH_SECRET=a2a4e2194f2a74f802107d2ab13f19cfe0540874ca805f2b435bdb8a210ea3b3
BETTER_AUTH_URL=http://localhost:3000
```

### Authentication Flow
1. User visits `/` � Redirect to `/dashboard` � If not auth � Redirect to `/auth/login`
2. User enters email and password
3. Client validates form and calls `signIn.email()`
4. Better Auth validates credentials against MongoDB
5. On success, sets HTTP-only session cookie
6. User redirected to `/dashboard`
7. All subsequent requests include session cookie

### Security Features
- Password hashing with bcrypt (cost 12)
- HTTP-only, secure cookies
- SameSite='lax' for CSRF protection
- Session expiration with refresh logic
- Server-side session validation for protected routes

### Database Collections
Better Auth will create:
- `users` - User accounts with Better Auth fields
- `sessions` - Active sessions
- `accounts` - OAuth accounts (if added later)
- `verification_tokens` - Email verification tokens

## Files to Create/Modify

### New Files
1. `common/src/utils/password.ts` - Password hashing utilities
2. `dataservice/src/repositories/user.repository.ts` - User data access layer
3. `dataservice/src/services/auth.service.ts` - Auth business logic
4. `admin/src/lib/auth.ts` - Better Auth server config
5. `admin/src/app/api/auth/[...all]/route.ts` - Auth API endpoints
6. `admin/src/lib/auth-client.ts` - Better Auth client config
7. `admin/src/lib/auth-utils.ts` - Server-side auth helpers
8. `admin/src/middleware.ts` - Route protection middleware

### Modified Files
1. `admin/src/app/(main)/auth/_components/login-form.tsx` - Add auth integration
2. `admin/src/app/(main)/dashboard/layout.tsx` - Add session check
3. All dashboard pages - Add `requireAuth()` calls
4. `admin/src/app/(main)/dashboard/_components/header.tsx` - Add user info/logout
5. Package.json files - Add dependencies

## Testing Checklist
- [ ] Login with valid credentials
- [ ] Login with invalid credentials shows error
- [ ] Access dashboard without auth redirects to login
- [ ] After login, redirect to dashboard
- [ ] Logout clears session and redirects
- [ ] Session persists across page refreshes
- [ ] Protected API routes return 401 without auth
- [ ] Middleware correctly protects routes

## Future Enhancements
1. Role-based access control (admin vs super-admin)
2. Password reset functionality
3. Two-factor authentication
4. Session analytics and monitoring
5. OAuth providers (Google, GitHub)
6. Account lockout after failed attempts

## Notes
- No user seeding required as users already exist in MongoDB
- Better Auth will create its own collections separate from existing user data
- Ensure backward compatibility with existing user management system
- Test thoroughly in development