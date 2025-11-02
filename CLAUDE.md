# EducatedPlanet - CLAUDE.md Configuration

# 🎯 Project Context

**Project**: EducatedPlanet - Local Tutor Listing Platform
**Domain**: educatedplanet.net
**Tech Stack**: Next.js 14+, Shadcn/UI (Nature Theme), Tailwind CSS, MongoDB, TypeScript
**Description**: A comprehensive platform for local tutors to list themselves and for students to find qualified tutors in their area.

---

# 🎨 Design System

## Shadcn/UI Theme: Nature

```json
{
  "theme": "nature",
  "fonts": {
    "sans": "Montserrat, sans-serif",
    "serif": "Merriweather, serif",
    "mono": "Source Code Pro, monospace"
  },
  "colors": {
    "primary": "oklch(0.5234 0.1347 144.1672)",
    "secondary": "oklch(0.9571 0.0210 147.6360)",
    "accent": "oklch(0.8952 0.0504 146.0366)",
    "background": "oklch(0.9711 0.0074 80.7211)",
    "foreground": "oklch(0.3000 0.0358 30.2042)"
  },
  "radius": "0.5rem"
}
```

## Design Principles

- **Modern & Clean**: Education-focused aesthetics with green/blue color scheme
- **Mobile-First**: Responsive design prioritizing mobile experience
- **Accessible**: WCAG 2.1 AA compliance throughout
- **Performance**: Fast loading, optimized images, efficient rendering

---

# 📐 Architecture Guidelines

## Project Structure

```
educatedplanet/
├── app/
│   ├── (public)/            # Public routes
│   │   ├── page.tsx         # Landing page
│   │   └── tutors/
│   │       ├── page.tsx     # Tutor listing
│   │       └── [id]/
│   │           └── page.tsx # Tutor profile
│   └── api/
│       ├── auth/            # Authentication endpoints
│       ├── tutors/          # Tutor CRUD
│       └── reviews/         # Review management
├── components/
│   ├── auth/                # Auth components
│   ├── tutor/               # Tutor components
│   └── ui/                  # Shadcn components
└── lib/
    ├── mongodb.ts           # Database connection
    └── utils.ts             # Utilities
```

## Core Features

### Phase 1 - MVP (Current Focus)

1. **Landing Page**
   - Header with logo and login button
   - Hero banner with dual search (keyword + location)
   - Top tutors showcase
   - Footer with "Join as Teacher" link

2. **Tutor Listing & Search**
   - Grid/list view with filters
   - Search by subject and area (Patia, Old Town, etc.)
   - Pagination or infinite scroll

3. **Tutor Profile**
   - Detailed information display
   - Contact details (hidden for non-logged users)
   - Reviews section
   - "Connect" button for logged users

4. **Authentication**
   - OTP-based login (no passwords)
   - Mobile number + optional email
   - User profile management

---

# 🔐 Technical Requirements

## Database Schema (MongoDB)

### Users Collection
```typescript
{
  _id: ObjectId,
  name: string,
  phone: string,
  email?: string,
  role: 'user' | 'tutor' | 'admin',
  isVerified: boolean,
  createdAt: Date,
  profile: {
    favorites: ObjectId[],
    reviews: ObjectId[]
  }
}
```

### Tutors Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  basicInfo: {
    name: string,
    photo: string,
    title: string,
    shortDescription: string,
    longDescription: string
  },
  teaching: {
    subjects: string[],
    classes: string[],
    teachingModes: ('online' | 'offline' | 'both')[],
    availability: object,
    academicType: boolean,
    ageGroups?: string[]
  },
  location: {
    areas: string[],
    city: string,
    state: string
  },
  contact: {
    phone: string,
    email: string,
    preferredContact: 'phone' | 'email' | 'connect'
  },
  verification: {
    isApproved: boolean,
    approvedBy?: ObjectId,
    approvedAt?: Date
  },
  analytics: {
    profileViews: number,
    contactViews: number,
    connects: number
  },
  rating: {
    average: number,
    count: number
  },
  isPremium: boolean,
  createdAt: Date
}
```

### Reviews Collection
```typescript
{
  _id: ObjectId,
  tutorId: ObjectId,
  userId: ObjectId,
  rating: number,
  comment: string,
  isApproved: boolean,
  createdAt: Date
}
```

---

# 🎯 Development Guidelines

## Code Style

- **TypeScript**: Strict mode, explicit types
- **Components**: Server components by default, client only when needed
- **Naming**: 
  - Components: PascalCase (e.g., `TutorCard.tsx`)
  - Files: kebab-case for routes (e.g., `tutor-profile.tsx`)
  - Functions: camelCase (e.g., `getTutorById`)
- **Imports**: Absolute imports using `@/` alias

## UI Components

- **Use Shadcn/UI** exclusively for all UI elements
- **Consistent Styling**: Follow Nature theme colors and spacing
- **Responsive**: Mobile-first approach, test all breakpoints
- **Accessibility**: Proper ARIA labels, keyboard navigation, semantic HTML

## Data Fetching

- **Server Components**: Fetch data directly in components
- **Client Components**: Use React hooks (useState, useEffect)
- **Error Handling**: Proper try-catch with user-friendly messages
- **Loading States**: Show skeletons or spinners

## Authentication

- **OTP System**: Use MSG91 or TextLocal for cost efficiency
- **Session Management**: JWT tokens with httpOnly cookies
- **Protected Routes**: Middleware for route protection
- **Role-Based Access**: Admin, Tutor, User permissions

---

# 🚀 Current Sprint Focus

## Admin Panel - Dashboard Page

### Requirements
1. **Sidebar Navigation**
   - Collapsible design
   - Menu items: Dashboard, Tutors, Users, Subjects, Reviews, Analytics, Settings
   - Badge counters for pending items
   - Logout button at bottom

2. **Header**
   - Breadcrumb navigation
   - Global search bar
   - Notification bell with badge
   - Theme toggle (light/dark)
   - Admin profile dropdown

3. **Dashboard Content**
   - 4 stats cards (Total Tutors, Pending Approvals, Active Users, Total Reviews)
   - Recent tutor applications table
   - Quick action cards
   - Analytics preview section

### Success Criteria
- Fully responsive (mobile sidebar as overlay)
- Dark mode support
- All Shadcn components properly imported
- TypeScript with no errors
- Follows Nature theme styling

---

# 📝 Communication Guidelines

## When Requesting Changes
1. Be specific about which component/page
2. Reference existing patterns when applicable
3. Include acceptance criteria
4. Mention any design system constraints

## Code Reviews
- Check for TypeScript errors
- Verify Shadcn component usage
- Ensure mobile responsiveness
- Test dark mode compatibility
- Validate against Nature theme

## Documentation
- Comment complex logic
- Update README for new features
- Document API endpoints
- Maintain architecture diagrams

---

# 🎨 UI/UX Standards

## Components Should
- Use Shadcn/UI components exclusively
- Follow Nature theme colors
- Include loading and error states
- Support keyboard navigation
- Include proper ARIA labels
- Work on mobile and desktop

## Pages Should
- Load within 2 seconds
- Be fully responsive
- Support dark mode
- Have proper meta tags for SEO
- Include breadcrumb navigation

---

# 🔄 Workflow Integration

## MCP Servers Configured
- **shadcn**: For UI component management and theme application
- **filesystem**: Project file access
- **sequential-thinking**: Multi-step reasoning

## Subagents Available
- **ui-design-expert**: Specialized in Shadcn/UI and design systems
- More agents can be added as needed

---

# 📊 Success Metrics

## Performance
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Lighthouse Score > 90

## Quality
- TypeScript strict mode with 0 errors
- All components fully typed
- Test coverage > 80%

## User Experience
- Mobile-friendly design
- Accessible (WCAG 2.1 AA)
- Intuitive navigation
- Fast search results

---

# 🎯 Next Phases (Future)

## Phase 2 (Post-Launch)
- Premium listings
- Advanced search with Elasticsearch
- In-app messaging
- Payment integration

## Phase 3 (Growth)
- Mobile app (React Native)
- Video profiles
- Live chat support
- Advanced analytics

---

**Remember**: This is an education-focused platform. Keep designs clean, professional, and trustworthy. Parents and students should feel confident using the platform to find qualified tutors.