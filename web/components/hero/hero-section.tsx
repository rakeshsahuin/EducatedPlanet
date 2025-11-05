"use client"

import * as React from "react"
import { Search, MapPin, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface HeroSectionProps {
  onSearch?: (subject: string, location: string) => void
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  const [subject, setSubject] = React.useState("")
  const [location, setLocation] = React.useState("")

  const trendingSubjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "Computer Science"
  ]

  const popularLocations = [
    "Patia, Bhubaneswar",
    "Old Town, Bhubaneswar",
    "Saheed Nagar, Bhubaneswar",
    "Nayapalli, Bhubaneswar",
    "Master Canteen, Bhubaneswar",
    "VSS Nagar, Bhubaneswar"
  ]

  const handleSearch = () => {
    if (subject.trim() || location.trim()) {
      onSearch?.(subject.trim(), location.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleSubjectBadgeClick = (subjectName: string) => {
    setSubject(subjectName)
  }

  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation)
  }

  return (
    <section className="relative w-full py-16 md:py-24 bg-linear-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              Find the Perfect
              <span className="text-primary"> Tutor</span>
              <br />
              Near You
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Connect with qualified local tutors for personalized learning.
              From Mathematics to Music, find expert guidance for every subject
              in your neighborhood.
            </p>
          </div>

          {/* Search Section */}
          <div className="w-full max-w-2xl mx-auto space-y-6">
            {/* Dual Search Inputs */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Subject Search */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  <BookOpen className="h-5 w-5" />
                </div>
                <Input
                  type="text"
                  placeholder="Math, Science, English..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-10 h-12 text-base bg-background border-input focus:ring-2 focus:ring-primary focus:border-primary"
                  aria-label="Search for subjects"
                />
              </div>

              {/* Location Search */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                </div>
                <Input
                  type="text"
                  placeholder="Patia, Bhubaneswar..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-10 h-12 text-base bg-background border-input focus:ring-2 focus:ring-primary focus:border-primary"
                  aria-label="Search for location"
                />
              </div>
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              size="lg"
              className="w-full md:w-auto h-12 px-8 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 shadow-lg hover:shadow-xl"
              aria-label="Find tutors"
            >
              <Search className="h-5 w-5 mr-2" />
              Find Tutors
            </Button>
          </div>

          {/* Trending Subjects */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Trending Subjects
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {trendingSubjects.map((subjectName) => (
                <Badge
                  key={subjectName}
                  variant={subject === subjectName ? "default" : "secondary"}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors duration-200 px-3 py-1 text-sm font-medium"
                  onClick={() => handleSubjectBadgeClick(subjectName)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      handleSubjectBadgeClick(subjectName)
                    }
                  }}
                  aria-label={`Search for ${subjectName} tutors`}
                >
                  {subjectName}
                </Badge>
              ))}
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-border">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Verified Tutors</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">10,000+</div>
              <div className="text-sm text-muted-foreground">Happy Students</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Subjects</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">4.8★</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}