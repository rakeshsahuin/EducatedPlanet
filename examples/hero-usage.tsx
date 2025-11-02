// Example: Complete Hero Section Integration
// This file demonstrates different ways to use the HeroSection component

"use client"

import { HeroSection } from "@/components/hero"
import { useRouter } from "next/navigation"
import { useState } from "react"

// Example 1: Basic Usage with Navigation
export function BasicHeroExample() {
  const router = useRouter()

  const handleSearch = (subject: string, location: string) => {
    const params = new URLSearchParams()
    if (subject) params.set('subject', subject)
    if (location) params.set('location', location)

    router.push(`/tutors?${params.toString()}`)
  }

  return (
    <HeroSection onSearch={handleSearch} />
  )
}

// Example 2: With Search State Management
export function HeroWithState() {
  const [lastSearch, setLastSearch] = useState<{ subject: string; location: string } | null>(null)
  const router = useRouter()

  const handleSearch = (subject: string, location: string) => {
    // Save search state
    setLastSearch({ subject, location })

    // Navigate to results
    const params = new URLSearchParams()
    if (subject) params.set('subject', subject)
    if (location) params.set('location', location)

    router.push(`/tutors?${params.toString()}`)
  }

  return (
    <div>
      <HeroSection onSearch={handleSearch} />

      {/* Display last search (for demo purposes) */}
      {lastSearch && (
        <div className="container mx-auto px-4 py-4 text-center">
          <p className="text-sm text-muted-foreground">
            Last search: {lastSearch.subject || "All subjects"} in {lastSearch.location || "All locations"}
          </p>
        </div>
      )}
    </div>
  )
}

// Example 3: With Analytics Tracking
export function HeroWithAnalytics() {
  const router = useRouter()

  const handleSearch = (subject: string, location: string) => {
    // Track search event (example with placeholder analytics)
    console.log('Search tracked:', {
      subject,
      location,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    })

    // Navigate to results
    const params = new URLSearchParams()
    if (subject) params.set('subject', subject)
    if (location) params.set('location', location)

    router.push(`/tutors?${params.toString()}`)
  }

  return <HeroSection onSearch={handleSearch} />
}

// Example 4: With Custom Search Logic
export function HeroWithCustomLogic() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (subject: string, location: string) => {
    setIsLoading(true)

    try {
      // Custom search logic (e.g., API call to validate location)
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API call

      // Navigate to results
      const params = new URLSearchParams()
      if (subject) params.set('subject', subject)
      if (location) params.set('location', location)

      window.location.href = `/tutors?${params.toString()}`
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative">
      <HeroSection onSearch={handleSearch} />

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Searching for tutors...</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Example 5: Hero in Full Page Layout
export function FullPageExample() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header (optional) */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary">EducatedPlanet</h1>
            <div className="flex items-center gap-4">
              <button className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Login
              </button>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                Sign Up
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection
        onSearch={(subject, location) => {
          console.log('Search triggered:', { subject, location })
          // Navigate to tutors page
        }}
      />

      {/* Additional Content */}
      <main>
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
            {/* Add content here */}
          </div>
        </section>
      </main>

      {/* Footer (optional) */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 EducatedPlanet. Find your perfect tutor today.
          </p>
        </div>
      </footer>
    </div>
  )
}

// Usage in Next.js page:
/*
import { BasicHeroExample } from './examples/hero-usage'

export default function HomePage() {
  return <BasicHeroExample />
}
*/