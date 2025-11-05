"use client"

import { HeroSection } from "@/components/hero/hero-section"
import { FeaturedTutorsSection } from "@/components/featured-tutors"

export default function Home() {
  const handleSearch = (subject: string, location: string) => {
    console.log("Searching for:", { subject, location })
    // TODO: Navigate to tutors page with search parameters
    // router.push(`/tutors?subject=${encodeURIComponent(subject)}&location=${encodeURIComponent(location)}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <HeroSection onSearch={handleSearch} />

      {/* Featured Tutors Section */}
      <FeaturedTutorsSection />
    </div>
  )
}
