# Featured Tutors Components

A collection of beautiful, interactive components for displaying featured tutors on the EducatedPlanet platform. Built with Next.js 14+, TypeScript, Shadcn/UI, and inspired by Aceternity UI patterns.

## Components

### 1. RatingStars (`rating-stars.tsx`)
Displays 5-star rating with reviews count.

**Props:**
- `rating: number` - Average rating (0-5)
- `reviewCount: number` - Number of reviews
- `className?: string` - Additional CSS classes
- `showCount?: boolean` - Whether to show review count (default: true)
- `size?: 'sm' | 'md' | 'lg'` - Star size (default: 'md')

**Features:**
- Half-star support for precise ratings
- Smooth hover animations
- Gold/amber color scheme
- Fully responsive

### 2. TeachingModeBadge (`teaching-mode-badge.tsx`)
Displays teaching mode badges with icons.

**Props:**
- `modes: ('online' | 'offline' | 'both')[]` - Array of teaching modes
- `className?: string` - Additional CSS classes
- `size?: 'sm' | 'md' | 'lg'` - Badge size (default: 'md')

**Features:**
- Color-coded badges (blue=online, green=offline, purple=both)
- Icons for visual clarity
- Hover effects with scaling
- Multiple badges support

### 3. TutorCard (`tutor-card.tsx`)
Main tutor display card with comprehensive information.

**Props:**
- `tutor: Tutor` - Tutor data object
- `className?: string` - Additional CSS classes
- `showExperience?: boolean` - Show experience (default: true)
- `showPrice?: boolean` - Show price range (default: true)
- `variant?: 'default' | 'compact' | 'detailed'` - Card variant (default: 'default')

**Features:**
- Profile photo with verified badge
- Rating stars and review count
- Subject badges with overflow handling
- Teaching mode badges
- Location display
- Experience and pricing information
- Hover effects with shimmer and gradient overlays
- View profile button with navigation
- Fully responsive design

### 4. FeaturedTutorsSection (`featured-tutors-section.tsx`)
Complete section for displaying featured tutors.

**Props:**
- `className?: string` - Additional CSS classes
- `showAllTutors?: boolean` - Show all tutors or limited (default: false)
- `maxTutors?: number` - Maximum tutors to display (default: 8)
- `title?: string` - Section title (default: "Top Rated Tutors")
- `subtitle?: string` - Section subtitle
- `showViewAllButton?: boolean` - Show "Show More" button (default: true)

**Features:**
- Decorative header with icons
- Responsive grid layout (1-4 columns)
- Animated card appearance
- "Show More Tutors" button
- Statistics section (tutors, students, subjects, ratings)
- Gradient backgrounds
- Fade-in animations

## Usage

### Basic Usage

```tsx
import { FeaturedTutorsSection } from '@/components/featured-tutors'

export default function HomePage() {
  return (
    <div>
      {/* Your other content */}
      <FeaturedTutorsSection />
      {/* More content */}
    </div>
  )
}
```

### Customized Usage

```tsx
import { FeaturedTutorsSection } from '@/components/featured-tutors'

export default function TutorsPage() {
  return (
    <FeaturedTutorsSection
      title="All Expert Tutors"
      subtitle="Find the perfect tutor for your learning needs"
      showAllTutors={true}
      showViewAllButton={false}
    />
  )
}
```

### Individual Components

```tsx
import { TutorCard, RatingStars, TeachingModeBadge } from '@/components/featured-tutors'
import { featuredTutors } from '@/data/featured-tutors-data'

export default function SomeComponent() {
  const tutor = featuredTutors[0]

  return (
    <div>
      <TutorCard tutor={tutor} />

      <RatingStars
        rating={tutor.rating.average}
        reviewCount={tutor.rating.count}
      />

      <TeachingModeBadge modes={tutor.teachingModes} />
    </div>
  )
}
```

## Data Structure

The components expect the following Tutor interface (defined in `data/featured-tutors-data.ts`):

```typescript
interface Tutor {
  id: string;
  name: string;
  title: string;
  photo: string;
  subjects: string[];
  rating: {
    average: number;
    count: number;
  };
  teachingModes: ("online" | "offline" | "both")[];
  location: {
    areas: string[];
    city: string;
  };
  experience: string;
  isVerified: boolean;
  price: {
    min: number;
    max: number;
    currency: string;
  };
}
```

## Design Features

### Nature Theme Integration
- Green color palette for primary actions
- Professional education-focused aesthetic
- Consistent with EducatedPlanet branding

### Aceternity UI Inspiration
- Shimmer effects on hover
- Gradient overlays
- Smooth transitions and micro-interactions
- Card lift effects
- Animated appearances

### Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- WCAG 2.1 AA compliant

### Responsive Design
- Mobile-first approach
- Adaptive grid layouts
- Touch-friendly interactions
- Optimized for all screen sizes

### Performance
- Optimized images with Next.js Image
- Efficient animations using CSS transforms
- Minimal re-renders
- Lightweight components

## Customization

### Colors
The components use CSS variables for colors, making them easy to customize:

```css
:root {
  --primary: oklch(0.5234 0.1347 144.1672);
  --secondary: oklch(0.9571 0.0210 147.6360);
  /* ... more colors */
}
```

### Animations
Animation timings and effects can be customized via CSS:

```css
.tutor-card {
  transition: all 0.3s ease;
}

.tutor-card:hover {
  transform: translateY(-4px);
}
```

## Dependencies

- Next.js 14+
- React 18+
- TypeScript
- Tailwind CSS
- Lucide React (icons)
- Shadcn/UI components

## Demo

A demo page is available at `/featured-tutors-demo` to see all components in action.

## Contributing

When adding new features or making changes:

1. Follow the existing TypeScript patterns
2. Maintain accessibility standards
3. Test responsive behavior
4. Update documentation as needed
5. Follow the Nature theme guidelines