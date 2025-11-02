# EducatedPlanet Header Components

A beautiful, professional header system for EducatedPlanet built with Next.js 14+, TypeScript, and Shadcn/UI with the Nature theme.

## 🎨 Features

- **Responsive Design**: Mobile-first approach with adaptive layouts
- **OTP Authentication**: Secure login with mobile verification
- **Professional Aesthetics**: Nature theme with education-focused design
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation
- **Dark Mode Support**: Automatic theme switching
- **TypeScript**: Fully typed with proper interfaces
- **Performance**: Optimized components with minimal re-renders

## 📁 Components Structure

```
components/
├── header/
│   ├── header.tsx           # Main header component
│   ├── logo.tsx             # Logo with tagline
│   ├── navigation.tsx       # Navigation menu
│   ├── mobile-menu.tsx      # Mobile slide-out menu
│   └── index.ts            # Export file
└── auth/
    ├── login-modal.tsx      # OTP login modal
    └── index.ts            # Export file
```

## 🚀 Usage

### Basic Usage

```typescript
import { Header } from "@/components/header"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
```

### Individual Components

```typescript
import { Logo, Navigation, MobileMenu } from "@/components/header"
import { LoginModal } from "@/components/auth"

// Use components individually
<Logo size="lg" showTagline={true} />
<Navigation onItemClick={handleNavClick} />
<MobileMenu />
<LoginModal isOpen={isOpen} onClose={handleClose} />
```

## 🎯 Component APIs

### Header

Main header component that combines all sub-components.

```typescript
interface HeaderProps {
  className?: string
}
```

**Features:**
- Sticky positioning with backdrop blur
- Responsive navigation (desktop + mobile)
- Integrated login modal
- Mobile navigation bar

### Logo

Clickable logo with EP icon and tagline.

```typescript
interface LogoProps {
  className?: string
  showTagline?: boolean
  size?: "sm" | "md" | "lg"
}
```

**Features:**
- Clickable home link
- EP logo icon
- Responsive sizing
- Optional tagline display

### Navigation

Responsive navigation menu with active states.

```typescript
interface NavigationProps {
  className?: string
  onItemClick?: () => void
}
```

**Features:**
- Active route highlighting
- Keyboard navigation
- Mobile-friendly layout
- Click callback support

### MobileMenu

Slide-out mobile navigation drawer.

```typescript
interface MobileMenuProps {
  className?: string
}
```

**Features:**
- Sheet-based drawer
- Full navigation included
- Join as Tutor CTA
- Smooth animations

### LoginModal

OTP-based authentication modal.

```typescript
interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}
```

**Features:**
- Two-step OTP flow
- Phone number validation
- Loading states
- Form validation

## 🎨 Design System

### Nature Theme Colors

The header uses the Nature theme with green color palette:

- **Primary**: Deep green (rgb(46, 125, 50))
- **Secondary**: Light mint (rgb(232, 245, 233))
- **Background**: Off-white (rgb(248, 245, 240))
- **Foreground**: Dark gray (rgb(62, 39, 35))

### Typography

- **Font**: Montserrat (primary), Merriweather (serif), Source Code Pro (mono)
- **Weights**: 300, 400, 500, 600, 700
- **Display**: Swap for optimal loading

### Spacing

- **Base Unit**: 0.25rem (4px)
- **Border Radius**: 0.5rem (8px)
- **Container**: Max-width with responsive padding

## 📱 Responsive Breakpoints

| Screen Size | Header Layout |
|-------------|---------------|
| Mobile (< 768px) | Hamburger menu + icon login |
| Tablet (768px+) | Full navigation + button login |
| Desktop (1024px+) | Enhanced spacing and typography |

## ♿ Accessibility Features

- **Semantic HTML**: Proper `<header>`, `<nav>`, `<main>` tags
- **ARIA Labels**: Screen reader friendly
- **Keyboard Navigation**: Tab, Enter, Escape support
- **Focus Indicators**: Visible focus states
- **Color Contrast**: WCAG AA compliant
- **Touch Targets**: Minimum 44px tap areas

## 🔄 State Management

Components use React hooks for local state:

```typescript
// Login modal state
const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

// Mobile menu state
const [isMenuOpen, setIsMenuOpen] = useState(false)

// OTP form state
const [step, setStep] = useState<"phone" | "otp">("phone")
```

## 🎭 Animations

- **Hover Effects**: Smooth color transitions
- **Modal Opening**: Backdrop blur + scale animation
- **Mobile Menu**: Slide-in from left
- **Button Presses**: Subtle scale effects

## 🧪 Testing

The header components are designed to be testable:

```typescript
// Example test structure
import { render, screen } from '@testing-library/react'
import { Header } from '@/components/header'

describe('Header', () => {
  it('renders logo and navigation', () => {
    render(<Header />)
    expect(screen.getByLabelText('EducatedPlanet - Find Your Perfect Tutor')).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})
```

## 📈 Performance

- **Server Components**: Navigation uses client components only when needed
- **Code Splitting**: Components split appropriately
- **Minimal Dependencies**: Only essential Radix UI components
- **Optimized Imports**: Tree-shakable imports

## 🔧 Customization

### Theme Colors

Update the theme in `app/globals.css`:

```css
:root {
  --primary: rgb(46, 125, 50);
  --secondary: rgb(232, 245, 233);
  /* ... other colors */
}
```

### Navigation Items

Modify navigation in `components/header/navigation.tsx`:

```typescript
const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/tutors", label: "Find Tutors" }
]
```

### Logo Customization

Update logo in `components/header/logo.tsx`:

```typescript
<div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
  <span className="text-primary-foreground font-bold text-sm">EP</span>
</div>
```

## 🚀 Best Practices

1. **Consistent Styling**: Use Tailwind classes and theme tokens
2. **Performance**: Server components by default, client when needed
3. **Accessibility**: Test with screen readers and keyboard
4. **Mobile-First**: Design for mobile first, then enhance
5. **TypeScript**: Maintain strict typing throughout

## 📄 License

This header system is part of the EducatedPlanet project.