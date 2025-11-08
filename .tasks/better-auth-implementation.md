# Better Auth Implementation Guide for Next.js 16 with MongoDB

## Project Requirements & Context

### Tech Stack
- **Framework**: Next.js 16 with App Router (folder routing method)
- **Database**: MongoDB with Mongoose ODM (already installed)
- **Authentication Library**: Better Auth
- **Authentication Method**: Username & Password (credentials-based)
- **Session Management**: Cookie-based with HttpOnly cookies

### Security Requirements
- Password hashing using bcrypt (cost factor 12)
- HttpOnly cookies for session management
- Secure cookie configuration (Secure, SameSite)
- CSRF protection through SameSite cookies
- Session expiration and refresh logic

## Installation & Dependencies

### Required Packages
```bash
# Core Better Auth packages
pnpm install better-auth

# MongoDB adapter for Better Auth
pnpm install better-auth/adapters/mongodb

# MongoDB client (separate from Mongoose)
pnpm install mongodb

# Password hashing
pnpm install bcryptjs

# Type definitions (if using TypeScript)
pnpm install -D @types/bcryptjs
```

### Environment Variables
Create/update `.env.local` with:
```env
# Better Auth Configuration
BETTER_AUTH_SECRET=your-generated-secret-here
BETTER_AUTH_URL=http://localhost:3000
```

Generate the secret using:
```bash
npx @better-auth/cli@latest secret
```

## Implementation Steps

### Step 1: Database Configuration

### Step 2: Better Auth Server Configuration

Create `lib/auth.ts`:
```typescript
import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import clientPromise from "./mongodb"
import bcrypt from "bcryptjs"

export const auth = betterAuth({
  // Database configuration
  database: mongodbAdapter(
    await (await clientPromise).db()
  ),
  
  // Email and password authentication
  emailAndPassword: {
    enabled: true,
    password: {
      // Custom bcrypt hashing
      hash: async (password: string) => {
        const salt = await bcrypt.genSalt(12)
        return await bcrypt.hash(password, salt)
      },
      // Custom bcrypt verification
      verify: async ({ hash, password }) => {
        return await bcrypt.compare(password, hash)
      }
    }
  },
  
  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5 // 5 minutes
    }
  },
  
  // Security configuration
  trustedOrigins: ["http://localhost:3000"],
  
  // Additional fields for user schema
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: true,
        input: true
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "admin",
        input: false
      }
    }
  }
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.User
```

### Step 3: API Route Handler

Create `app/api/auth/[...all]/route.ts`:
```typescript
import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/nextjs"

export const { GET, POST } = toNextJsHandler(auth)
```

### Step 4: Client Configuration

Create `lib/auth-client.ts`:
```typescript
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000"
})

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession
} = authClient
```

### Step 5: Authentication Components

#### Sign Up Component
Create `components/auth/signup-form.tsx`:
```typescript
"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signUp } from "@/lib/auth-client"

export default function SignUpForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await signUp.email({
        email,
        password,
        username,
      })
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      {error && <p className="text-red-500">{error}</p>}
      
      <button type="submit" disabled={loading}>
        {loading ? "Creating Account..." : "Sign Up"}
      </button>
    </form>
  )
}
```

#### Sign In Component
Create `components/auth/signin-form.tsx`:
```typescript
"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/auth-client"

export default function SignInForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await signIn.email({
        email,
        password,
      })
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      {error && <p className="text-red-500">{error}</p>}
      
      <button type="submit" disabled={loading}>
        {loading ? "Signing In..." : "Sign In"}
      </button>
    </form>
  )
}
```

### Step 6: Route Protection Implementation

#### Server-Side Session Validation
Create `lib/auth-utils.ts`:
```typescript
import { headers } from "next/headers"
import { auth } from "./auth"
import { redirect } from "next/navigation"

export async function getServerSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })
    return session
  } catch (error) {
    return null
  }
}

export async function requireAuth() {
  const session = await getServerSession()
  
  if (!session) {
    redirect("/signin")
  }
  
  return session
}

export async function requireRole(requiredRole: string) {
  const session = await requireAuth()
  
  if (session.user.role !== requiredRole) {
    redirect("/unauthorized")
  }
  
  return session
}
```

#### Protected Page Example
Create `app/dashboard/page.tsx`:
```typescript
import { requireAuth } from "@/lib/auth-utils"
import { signOut } from "@/lib/auth-client"

export default async function DashboardPage() {
  const session = await requireAuth()

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user.username}!</p>
      <p>Email: {session.user.email}</p>
      <p>Role: {session.user.role}</p>
      
      <form action={async () => {
        "use server"
        await signOut()
      }}>
        <button type="submit">Sign Out</button>
      </form>
    </div>
  )
}
```

#### Middleware for Route Protection
Create `middleware.ts` (in project root):
```typescript
import { NextRequest, NextResponse } from "next/server"
import { auth } from "./lib/auth"

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Protected routes
  const protectedPaths = ["/dashboard", "/profile", "/admin"]
  const isProtectedPath = protectedPaths.some(path => 
    pathname.startsWith(path)
  )

  if (isProtectedPath) {
    try {
      const session = await auth.api.getSession({
        headers: request.headers
      })

      if (!session) {
        return NextResponse.redirect(
          new URL("/signin", request.url)
        )
      }

      // Role-based protection for admin routes
      if (pathname.startsWith("/admin") && session.user.role !== "admin") {
        return NextResponse.redirect(
          new URL("/unauthorized", request.url)
        )
      }

    } catch (error) {
      return NextResponse.redirect(
        new URL("/signin", request.url)
      )
    }
  }

  // Redirect authenticated users away from auth pages
  const authPaths = ["/signin", "/signup"]
  if (authPaths.includes(pathname)) {
    try {
      const session = await auth.api.getSession({
        headers: request.headers
      })

      if (session) {
        return NextResponse.redirect(
          new URL("/dashboard", request.url)
        )
      }
    } catch (error) {
      // Allow access to auth pages if session check fails
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ]
}
```

### Step 7: Client-Side Session Hook

Create `components/auth/session-provider.tsx`:
```typescript
"use client"
import { useSession } from "@/lib/auth-client"

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function useAuthSession() {
  const { data: session, isPending, error } = useSession()
  
  return {
    session,
    isLoading: isPending,
    isAuthenticated: !!session,
    error
  }
}
```

### Step 8: Database Schema Generation

Better Auth will automatically create the required collections in MongoDB. No manual schema generation is needed as MongoDB is schema-less.

The following collections will be created automatically:
- `user` - User accounts and profiles
- `session` - Active user sessions
- `account` - Social auth accounts (if used later)
- `verification` - Email verification tokens

## Security Best Practices

### 1. Cookie Configuration
Better Auth automatically configures secure cookies with:
- `HttpOnly: true` (prevents JavaScript access)
- `Secure: true` (HTTPS only in production)
- `SameSite: 'lax'` (CSRF protection)

### 2. Password Security
- Uses bcrypt with cost factor 12 (configurable)
- Automatic salt generation per password
- Secure password verification

### 3. Session Management
- 7-day session expiration (configurable)
- Automatic session refresh
- Session revocation capabilities

### 4. Environment Security
- Secure secret generation
- Environment-based configuration
- Production vs development settings

## Testing & Validation

### 1. Test Authentication Flow
```typescript
// Test user registration
const testSignUp = async () => {
  try {
    await signUp.email({
      email: "test@example.com",
      password: "SecurePassword123!",
      username: "testuser"
    })
    console.log("Sign up successful")
  } catch (error) {
    console.error("Sign up failed:", error)
  }
}

// Test user login
const testSignIn = async () => {
  try {
    await signIn.email({
      email: "test@example.com",
      password: "SecurePassword123!"
    })
    console.log("Sign in successful")
  } catch (error) {
    console.error("Sign in failed:", error)
  }
}
```

### 2. Verify Database Collections
Check MongoDB to ensure collections are created:
```bash
# Connect to MongoDB
mongosh

# Switch to your database
use your-database-name

# List collections
show collections

# Verify user creation
db.user.findOne()
```

## Code Architecture Requirements

### 1. Frontend Architecture (React/Next.js)
- **Component Structure**: Create reusable authentication components following atomic design
- **State Management**: Use Better Auth's built-in reactive state management via `useSession`
- **Form Handling**: Implement proper form validation and error handling
- **Type Safety**: Ensure full TypeScript integration with Better Auth's type inference

### 2. Backend Architecture (API Routes)
- **Single Handler Pattern**: Use Better Auth's unified handler for all auth endpoints
- **Error Handling**: Implement comprehensive error handling and logging
- **Middleware Integration**: Proper middleware setup for route protection
- **Database Layer**: Maintain separation between Mongoose models and Better Auth collections

### 3. Code Reusability
- **Auth Utilities**: Create reusable utility functions for common auth operations
- **Custom Hooks**: Develop custom React hooks for auth state management
- **Type Definitions**: Export and reuse TypeScript types across components
- **Configuration**: Centralized configuration management for auth settings

## Error Handling & Debugging

### 1. Common Issues & Solutions
```typescript
// Handle MongoDB connection issues
const handleDBError = (error: Error) => {
  if (error.message.includes('ECONNREFUSED')) {
    console.error('MongoDB connection failed. Check your MONGODB_URI')
  }
}

// Handle authentication errors
const handleAuthError = (error: Error) => {
  if (error.message.includes('Invalid credentials')) {
    // Show user-friendly error
    return "Email or password is incorrect"
  }
  return "Authentication failed. Please try again."
}
```

### 2. Debugging Session Issues
```typescript
// Debug session in development
if (process.env.NODE_ENV === 'development') {
  console.log('Current session:', await getServerSession())
}
```

## Production Deployment Checklist

### 1. Environment Variables
- [ ] `BETTER_AUTH_SECRET` - Strong, unique secret
- [ ] `BETTER_AUTH_URL` - Production domain
- [ ] `MONGODB_URI` - Production MongoDB connection

### 2. Security Configuration
- [ ] HTTPS enabled for production
- [ ] Secure cookie settings verified
- [ ] CORS configuration for production domains
- [ ] Rate limiting implemented

### 3. Performance Optimization
- [ ] Database indexes created for user lookups
- [ ] Session caching configured
- [ ] Connection pooling optimized

## Additional Features (Future Implementation)

### 1. Enhanced Security
- Two-factor authentication (2FA)
- Email verification
- Password reset functionality
- Account lockout after failed attempts

### 2. Social Authentication
- Google OAuth
- GitHub OAuth
- Custom OAuth providers

### 3. Advanced Features
- Role-based access control (RBAC)
- Multi-tenant organization support
- Audit logging
- Session analytics

## Support & Resources

- Better Auth Documentation: https://www.better-auth.com/docs
- Next.js 16 Documentation: https://nextjs.org/docs
- MongoDB Node.js Driver: https://mongodb.github.io/node-mongodb-native/
- bcrypt Documentation: https://www.npmjs.com/package/bcryptjs

## Critical Implementation Notes

1. **Mongoose Compatibility**: Better Auth uses its own MongoDB adapter. Your existing Mongoose models remain separate and functional.

2. **Dual Database Connections**: You'll have two MongoDB connections - one for Better Auth and one for your existing Mongoose models. This is the recommended approach.

3. **Type Safety**: Better Auth provides excellent TypeScript support. Use the exported types for full type safety.

4. **Session Security**: Never store sensitive data in client-side state. Always validate sessions server-side for protected operations.

5. **Password Migration**: If migrating existing users, use the custom password verification function to handle different hashing algorithms.

6. **Production Readiness**: Test thoroughly in development before deploying. Monitor authentication flows and session management in production.