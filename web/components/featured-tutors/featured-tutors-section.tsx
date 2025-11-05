'use client'

import React from 'react'
import Link from 'next/link'
import { Star, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TutorCard } from './tutor-card'
import { featuredTutors } from '@/data/featured-tutors-data'
import { cn } from '@/lib/utils'

interface FeaturedTutorsSectionProps {
  className?: string
  showAllTutors?: boolean
  maxTutors?: number
  title?: string
  subtitle?: string
  showViewAllButton?: boolean
}

export function FeaturedTutorsSection({
  className,
  showAllTutors = false,
  maxTutors = 8,
  title = "Top Rated Tutors",
  subtitle = "Learn from the best educators in Bhubaneswar",
  showViewAllButton = true
}: FeaturedTutorsSectionProps) {
  const displayTutors = showAllTutors
    ? featuredTutors
    : featuredTutors.slice(0, maxTutors)

  return (
    <section className={cn('py-12 lg:py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          {/* Decorative Icon */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <Star className="w-3 h-3 text-white fill-white" />
              </div>
            </div>
          </div>

          {/* Title and Subtitle */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Tutors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {displayTutors.map((tutor, index) => (
            <div
              key={tutor.id}
              className="animate-fade-in-up"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'both'
              }}
            >
              <TutorCard
                tutor={tutor}
                className="h-full"
              />
            </div>
          ))}
        </div>

        {/* View All Button */}
        {showViewAllButton && !showAllTutors && (
          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl group"
            >
              <Link href="/tutors" className="flex items-center gap-2">
                Show More Tutors
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        )}

        {/* Additional Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
              {featuredTutors.length}+
            </div>
            <div className="text-sm text-muted-foreground">Expert Tutors</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
              1000+
            </div>
            <div className="text-sm text-muted-foreground">Happy Students</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400">
              50+
            </div>
            <div className="text-sm text-muted-foreground">Subjects Covered</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-amber-600 dark:text-amber-400">
              4.8+
            </div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </section>
  )
}