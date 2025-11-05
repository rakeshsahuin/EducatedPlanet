# Hero Section Component

## Overview

The `HeroSection` component is a comprehensive landing page hero component designed specifically for EducatedPlanet - a local tutor listing platform. It features dual search functionality, trending subjects, and trust indicators to help users quickly find qualified tutors in their area.

## Features

### 🎯 Core Functionality
- **Dual Search Interface**: Separate inputs for subject and location search
- **Interactive Badges**: Clickable trending subjects for quick selection
- **Location Dropdown**: Pre-populated with popular Bhubaneswar areas
- **Responsive Design**: Mobile-first approach with tablet and desktop optimizations
- **Trust Indicators**: Statistics showing platform credibility

### 🎨 Design Elements
- **Nature Theme**: Uses the configured green color palette
- **Montserrat Font**: Professional typography throughout
- **Accessibility**: WCAG 2.1 AA compliant with proper ARIA labels
- **Dark Mode Support**: Seamlessly adapts to theme changes
- **Smooth Transitions**: Hover effects and micro-interactions

## Component Structure

```
components/hero/
├── hero-section.tsx    # Main component
└── README.md          # This documentation
```

## Props Interface

```typescript
interface HeroSectionProps {
  onSearch?: (subject: string, location: string) => void
}
```

### Props Details

- `onSearch` (optional): Callback function that receives search parameters
  - `subject`: The subject being searched for
  - `location`: The location being searched in

## Usage Example

```typescript
import { HeroSection } from "@/components/hero/hero-section"

export default function HomePage() {
  const handleSearch = (subject: string, location: string) => {
    // Navigate to tutors page with search parameters
    router.push(`/tutors?subject=${encodeURIComponent(subject)}&location=${encodeURIComponent(location)}`)
  }

  return (
    <div>
      <HeroSection onSearch={handleSearch} />
      {/* Other page content */}
    </div>
  )
}
```

## Component Features

### 1. Search Functionality

**Subject Search Input**:
- Icon: `BookOpen` for visual clarity
- Placeholder: "Math, Science, English..."
- Auto-complete ready
- Keyboard navigation support (Enter to search)

**Location Search Options**:
- Text input with `MapPin` icon
- OR dropdown with pre-populated areas
- Popular locations: Patia, Old Town, Saheed Nagar, etc.

### 2. Trending Subjects

Interactive badges for popular subjects:
- Mathematics
- Physics
- Chemistry
- Biology
- English
- Computer Science

Clicking a badge automatically populates the subject search field.

### 3. Trust Indicators

Four statistics showing platform credibility:
- 500+ Verified Tutors
- 10,000+ Happy Students
- 50+ Subjects
- 4.8★ Average Rating

### 4. Responsive Behavior

**Mobile (< 768px)**:
- Full-width search inputs
- Single column layout
- Compact typography

**Tablet (768px - 1024px)**:
- Two-column search layout
- Medium spacing

**Desktop (> 1024px)**:
- Large headline text
- Maximum width container
- Enhanced spacing

## Accessibility Features

- **Semantic HTML**: Proper use of `<section>`, `<button>`, `<input>` elements
- **ARIA Labels**: All interactive elements have descriptive labels
- **Keyboard Navigation**: Full keyboard support with Tab, Enter, and Space keys
- **Focus Indicators**: Clear focus states for all interactive elements
- **Screen Reader Support**: Proper text alternatives for icons
- **Color Contrast**: Meets WCAG 2.1 AA standards

## Styling Guidelines

### Colors Used
- `text-primary`: Primary green for emphasis
- `text-muted-foreground`: Secondary text for less important content
- `bg-background`: Main background color
- `bg-secondary`: Subtle background variations
- `border-input`: Input field borders
- `ring-primary`: Focus ring color

### Spacing
- Container: Responsive padding using `px-4 sm:px-6 lg:px-8`
- Section spacing: `py-16 md:py-24`
- Component spacing: `space-y-4` to `space-y-8`
- Grid gaps: `gap-4` for search inputs

### Typography
- Headlines: `text-4xl md:text-5xl lg:text-6xl` with `font-bold`
- Subheadlines: `text-lg md:text-xl`
- Body text: Default base size
- Small text: `text-sm` for secondary information

## Dependencies

Required packages (already installed):
```json
{
  "@radix-ui/react-slot": "^1.0.2",
  "@radix-ui/react-select": "^2.0.0",
  "class-variance-authority": "^0.7.0",
  "lucide-react": "^0.263.1"
}
```

Required UI components:
- `@/components/ui/button`
- `@/components/ui/input`
- `@/components/ui/badge`
- `@/components/ui/select`
- `@/lib/utils` (for `cn` utility)

## Future Enhancements

### Planned Features
1. **Search Suggestions**: Real-time suggestions as users type
2. **Recent Searches**: Display user's recent search history
3. **Popular Locations**: Dynamic location suggestions based on user IP
4. **Voice Search**: Voice input for hands-free searching
5. **Saved Searches**: Allow users to save common search combinations

### Performance Optimizations
1. **Debounced Input**: Prevent excessive search calls during typing
2. **Lazy Loading**: Load trust indicator animations on scroll
3. **Image Optimization**: Optimize background gradients for better performance

## Integration Notes

### Router Integration
The `onSearch` callback should typically integrate with Next.js router:

```typescript
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  const handleSearch = (subject: string, location: string) => {
    const params = new URLSearchParams()
    if (subject) params.set('subject', subject)
    if (location) params.set('location', location)

    router.push(`/tutors?${params.toString()}`)
  }

  return <HeroSection onSearch={handleSearch} />
}
```

### Analytics Integration
Track search events for analytics:

```typescript
const handleSearch = (subject: string, location: string) => {
  // Track search event
  analytics.track('tutor_search', {
    subject,
    location,
    timestamp: new Date().toISOString()
  })

  // Navigate to results
  onSearch?.(subject, location)
}
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

All modern browsers supporting CSS Grid, Flexbox, and ES2020+ JavaScript features.

## Contributing

When modifying the hero section:

1. **Maintain Mobile-First**: Always test on mobile first
2. **Preserve Accessibility**: Don't remove ARIA labels or semantic HTML
3. **Follow Theme**: Use Nature theme colors and spacing
4. **Test Responsively**: Verify all breakpoints work correctly
5. **Keyboard Navigation**: Ensure all features work without a mouse

## Support

For issues or questions about the hero section component:
1. Check this documentation first
2. Review the component's TypeScript interfaces
3. Test with different screen sizes
4. Verify all dependencies are installed

---

**File**: `c:\Users\RakaThinkpad\Documents\Project\educatedplanet\components\hero\hero-section.tsx`
**Created**: 2025-10-31
**Author**: EducatedPlanet Development Team