'use client'

import React from 'react'
import { Monitor, MapPin, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface TeachingModeBadgeProps {
  modes: ('online' | 'offline' | 'both')[]
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function TeachingModeBadge({
  modes,
  className,
  size = 'md'
}: TeachingModeBadgeProps) {
  const getBadgeInfo = (mode: 'online' | 'offline' | 'both') => {
    switch (mode) {
      case 'online':
        return {
          variant: 'default' as const,
          bgColor: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
          icon: Monitor,
          label: 'Online'
        }
      case 'offline':
        return {
          variant: 'secondary' as const,
          bgColor: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
          icon: MapPin,
          label: 'Offline'
        }
      case 'both':
        return {
          variant: 'outline' as const,
          bgColor: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
          icon: Users,
          label: 'Both'
        }
    }
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3 py-1.5 gap-2'
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  if (modes.length === 0) return null

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      {modes.map((mode) => {
        const badgeInfo = getBadgeInfo(mode)
        const Icon = badgeInfo.icon

        return (
          <Badge
            key={mode}
            className={cn(
              sizeClasses[size],
              badgeInfo.bgColor,
              'transition-all duration-200 hover:scale-105 hover:shadow-md border font-medium'
            )}
          >
            <Icon className={cn(iconSizes[size])} />
            {badgeInfo.label}
          </Badge>
        )
      })}
    </div>
  )
}