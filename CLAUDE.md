# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EducatedPlanet is a local tutor listing platform built as a monorepo using Next.js 16+, TypeScript, MongoDB, and pnpm workspaces. The platform connects students with qualified local tutors in their area.

## Development Commands

1. Always use context7 when I need code generation, setup or configuration steps, or
library/API documentation. This means you should automatically use the Context7 MCP
tools to resolve library id and get library docs without me having to explicitly ask.

### Package Manager
- **pnpm 10.20.0** is used for workspace management
- Run commands from root directory to affect all packages

### Common Commands
```bash
# Development
pnpm dev              # Start all packages (web on 3000, admin on 3001)
pnpm dev:web          # Start only web application
pnpm dev:admin        # Start only admin application

# Building
pnpm build            # Build all packages in dependency order
pnpm build:web        # Build only web application
pnpm build:admin      # Build only admin application
pnpm build:models     # Build only models package

# Quality Assurance
pnpm lint             # Lint all packages
pnpm type-check       # Type check across all packages
pnpm test             # Run tests across all packages
pnpm clean            # Clean build artifacts

# Package-specific operations
pnpm --filter <package> <command>     # Run command in specific package
pnpm --filter web dev                 # Example: run web in dev mode
pnpm --filter models build            # Example: build models package
```

## Architecture

### Monorepo Structure
```
educatedplanet/
├── web/              # Next.js 16 public-facing application (port 3000)
├── admin/            # Admin panel application (port 3001)
├── models/           # Shared TypeScript interfaces (@educatedplanet/models)
├── dataservice/      # MongoDB models & services (@educatedplanet/dataservice)
└── common/           # Shared utilities (@educatedplanet/common)
```

### Package Dependencies
- **models**: Pure TypeScript types, no runtime dependencies
- **common**: Utilities, uses models
- **dataservice**: MongoDB layer, uses models & common
- **web**: Public app, uses all shared packages
- **admin**: Admin panel, uses all shared packages

### Key Technologies
- **Framework**: Next.js 16.0.1 with App Router
- **Language**: TypeScript 5+ (strict mode)
- **Database**: MongoDB with Mongoose ODM
- **UI**: Shadcn/UI components with Nature theme
- **Styling**: Tailwind CSS v4
- **Auth**: OTP-based with RSA encryption (jsencrypt, bcryptjs)
- **Validation**: Zod schemas

### Authentication System
- RSA key pair encryption for secure login - for admin panel
- OTP-based authentication (no passwords) - For web portal only
- Role-based access control (user, tutor, admin)
- JWT tokens for session management

## Development Patterns

### Import Conventions
```typescript
// Internal packages (use @educatedplanet scope)
import { User, Tutor } from '@educatedplanet/models';
import { tutorService } from '@educatedplanet/dataservice';
import { formatPhone } from '@educatedplanet/common';

// Local imports
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
```

### Component Architecture
- **Server Components** by default for data fetching
- **Client Components** only when interactivity needed
- All components use TypeScript interfaces from models package
- Follow Shadcn/UI patterns with Nature theme

### Data Access Pattern
```typescript
// Service layer handles all database operations
import { tutorService } from '@educatedplanet/dataservice';

// In server components
const tutors = await tutorService.getAll();

// In client components (via API)
const response = await fetch('/api/tutors');
```

## Important Implementation Details

### RSA Encryption
- Public key stored in environment (`NEXT_PUBLIC_RSA_PUBLIC_KEY`)
- Private key server-side only (`RSA_PRIVATE_KEY`)
- Client-side encryption before sending to server

### MongoDB Connection
- Connection string in `MONGODB_URI` environment variable
- Models defined in dataservice/package
- Service layer provides business logic abstraction

### Build System
- Turbo orchestrates builds with dependency management
- TypeScript project references configured
- Shared packages build first, then applications

### Package Scripts
Each package has standardized scripts:
- `dev`: Development mode with watch
- `build`: Production build
- `lint`: ESLint checking
- `type-check`: TypeScript validation
- `test`: Unit/integration tests

## Environment Variables

### Required for all applications
- `NEXTAUTH_SECRET`: NextAuth.js secret
- `NEXTAUTH_URL`: Application URL

### Required for web/admin
- `NEXT_PUBLIC_RSA_PUBLIC_KEY`: RSA public key for encryption
- `MONGODB_URI`: MongoDB connection string

### Required for dataservice
- `RSA_PRIVATE_KEY`: RSA private key for decryption
- `MONGODB_URI`: MongoDB connection string

## Code Style Guidelines

### Naming Conventions
- Components: PascalCase (e.g., `TutorCard.tsx`)
- Functions: camelCase (e.g., `getTutorById`)
- Files: kebab-case for routes (e.g., `tutor-profile.tsx`)
- Packages: kebab-case with @educatedplanet scope

### TypeScript Rules
- Strict mode enabled across all packages
- Explicit typing for all function parameters and returns
- Interface definitions in models package
- Zod schemas for runtime validation

### Component Guidelines
- Use Shadcn/UI components exclusively
- Follow Nature theme (green/blue color scheme)
- Mobile-first responsive design
- Include loading and error states
- Proper ARIA labels for accessibility