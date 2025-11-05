'use client'

import React from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingStarsProps {
  rating: number
  reviewCount: number
  className?: string
  showCount?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function RatingStars({
  rating,
  reviewCount,
  className,
  showCount = true,
  size = 'md'
}: RatingStarsProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  const emptyStars = 5 - Math.ceil(rating)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center gap-0.5">
        {/* Full Stars */}
        {Array.from({ length: fullStars }).map((_, index) => (
          <Star
            key={`full-${index}`}
            className={cn(
              sizeClasses[size],
              'fill-amber-400 text-amber-400 transition-all duration-300 hover:scale-110'
            )}
          />
        ))}

        {/* Half Star */}
        {hasHalfStar && (
          <div className="relative">
            <Star
              className={cn(
                sizeClasses[size],
                'text-gray-300 transition-all duration-300'
              )}
            />
            <div className="absolute inset-0 overflow-hidden">
              <Star
                className={cn(
                  sizeClasses[size],
                  'fill-amber-400 text-amber-400 transition-all duration-300'
                )}
                style={{ width: `${(rating % 1) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Empty Stars */}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <Star
            key={`empty-${index}`}
            className={cn(
              sizeClasses[size],
              'text-gray-300 transition-all duration-300 hover:scale-110'
            )}
          />
        ))}
      </div>

      {showCount && (
        <span className={cn(
          'font-medium text-muted-foreground',
          textSizes[size]
        )}>
          {rating} ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  )
}