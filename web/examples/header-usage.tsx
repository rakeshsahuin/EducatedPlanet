// Example: How to use the EducatedPlanet Header Components
// This file demonstrates various ways to integrate the header system

import { Header } from "@/components/header"
import { Logo } from "@/components/header"
import { Navigation } from "@/components/header"
import { MobileMenu } from "@/components/header"
import { LoginModal } from "@/components/auth"
import { Button } from "@/components/ui/button"
import { useState } from "react"

// 1. Basic Header Usage (Recommended)
export function BasicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      {/* Footer component would go here */}
    </div>
  )
}

// 2. Custom Header with Additional Content
export function CustomHeaderExample() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Logo size="md" showTagline={false} />
          </div>

          {/* Center - Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Navigation />
          </nav>

          {/* Right side - Custom Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLoginOpen(true)}
            >
              Login
            </Button>
            <Button size="sm">
              Sign Up
            </Button>
            <MobileMenu />
          </div>
        </div>
      </div>

      {/* Custom Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </header>
  )
}

// 3. Minimal Header (Landing Page)
export function MinimalHeader() {
  return (
    <header className="relative z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Logo size="lg" showTagline={true} />

          <div className="flex items-center space-x-4">
            <Navigation />
            <Button>Login</Button>
          </div>
        </div>
      </div>
    </header>
  )
}

// 4. Header with Custom Navigation Items
export function CustomNavigationHeader() {
  const customNavItems = [
    { href: "/", label: "Home" },
    { href: "/courses", label: "Courses" },
    { href: "/tutors", label: "Tutors" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" }
  ]

  return (
    <Header />
    // Note: To customize navigation items, modify the navigation.tsx component
  )
}

// 5. Full Page Layout Example
export function FullPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        {/* Page content */}
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 EducatedPlanet. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// 6. Header with Search Integration
export function HeaderWithSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  const handleSearch = (query: string) => {
    console.log("Searching for:", query)
    // Implement search logic
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Logo size="md" showTagline={false} />

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <input
              type="text"
              placeholder="Search tutors, subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Navigation />
            <Button onClick={() => setIsLoginOpen(true)}>Login</Button>
            <MobileMenu />
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </header>
  )
}

// 7. Dashboard Header (Authenticated Users)
export function DashboardHeader({ userName }: { userName: string }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Logo size="md" showTagline={false} />

          <Navigation />

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {userName}
            </span>
            <Button variant="outline" size="sm">
              Profile
            </Button>
            <Button variant="ghost" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

// Usage in app/layout.tsx
/*
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <FullPageLayout>
          {children}
        </FullPageLayout>
      </body>
    </html>
  );
}
*/