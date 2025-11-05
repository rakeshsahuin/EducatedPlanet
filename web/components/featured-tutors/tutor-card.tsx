'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, GraduationCap, Award, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RatingStars } from './rating-stars'
import { TeachingModeBadge } from './teaching-mode-badge'
import { Tutor, TutorCardVariant } from '@educatedplanet/models'
import { featuredTutors } from '@/data/featured-tutors-data'
import { cn } from '@/lib/utils'

interface TutorCardProps {
  tutor: Tutor
  className?: string
  showExperience?: boolean
  showPrice?: boolean
  variant?: 'default' | 'compact' | 'detailed'
}

export function TutorCard({
  tutor,
  className,
  showExperience = true,
  showPrice = true,
  variant = 'default'
}: TutorCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleViewProfile = () => {
    // Navigate to tutor profile page
    console.log(`Navigate to tutor profile: ${tutor.id}`)
  }

  const variantStyles = {
    default: '',
    compact: 'p-4',
    detailed: 'p-6'
  }

  return (
    <Card
      className={cn(
        'group relative overflow-hidden border-0 bg-white dark:bg-gray-900 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 h-full flex flex-col',
        variantStyles[variant],
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient Overlay Effect */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br from-green-50 via-transparent to-blue-50 dark:from-green-950/20 dark:via-transparent dark:to-blue-950/20 opacity-0 transition-opacity duration-500 pointer-events-none',
          isHovered && 'opacity-100'
        )}
      />

      {/* Shimmer Effect */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-1000 pointer-events-none',
          isHovered && 'translate-x-full'
        )}
      />

      <CardHeader className={cn('pb-3', variant === 'compact' && 'pb-2')}>
        <div className="flex items-start gap-4">
          {/* Profile Photo */}
          <div className="relative">
            <div className="relative w-16 h-16 rounded-full overflow-hidden ring-4 ring-green-100 dark:ring-green-900/50 transition-all duration-300 group-hover:ring-green-200 dark:group-hover:ring-green-800 group-hover:scale-110">
              <Image
                src={tutor.photo}
                alt={tutor.name}
                fill
                className="object-cover"
                sizes="64px"
              />
              {/* Verified Badge */}
              {tutor.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                  <Award className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Name and Title */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300 truncate">
              {tutor.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {tutor.title}
            </p>

            {/* Rating */}
            <div className="mt-2">
              <RatingStars
                rating={tutor.rating.average}
                reviewCount={tutor.rating.count}
                size="sm"
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-1 flex flex-col">
        {/* Subjects */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {tutor.subjects.slice(0, variant === 'compact' ? 2 : 3).map((subject) => (
              <Badge
                key={subject}
                variant="secondary"
                className="text-xs px-2 py-1 bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50 transition-colors"
              >
                {subject}
              </Badge>
            ))}
            {tutor.subjects.length > (variant === 'compact' ? 2 : 3) && (
              <Badge
                variant="outline"
                className="text-xs px-2 py-1"
              >
                +{tutor.subjects.length - (variant === 'compact' ? 2 : 3)}
              </Badge>
            )}
          </div>
        </div>

        {/* Teaching Modes */}
        <TeachingModeBadge
          modes={tutor.teachingModes}
          size="sm"
        />

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span className="line-clamp-1">
            {tutor.location.areas.join(', ')}, {tutor.location.city}
          </span>
        </div>

        {/* Experience and Price */}
        {(showExperience || showPrice) && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
            {showExperience && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {tutor.experience}
                </span>
              </div>
            )}

            {showPrice && (
              <div className="flex items-center gap-2 text-sm">
                <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  {tutor.price.currency}{tutor.price.min}-{tutor.price.max}
                  <span className="text-xs text-muted-foreground font-normal">/hr</span>
                </span>
              </div>
            )}
          </div>
        )}

        {/* Spacer to push button to bottom */}
        <div className="flex-1" />

        {/* View Profile Button - Always at bottom */}
        <Button
          onClick={handleViewProfile}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 mt-auto"
          asChild
        >
          <Link href={`/tutors/${tutor.id}`}>
            View Profile
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}