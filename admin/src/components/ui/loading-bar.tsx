"use client"

import React, { useRef, useCallback } from 'react'
import { useTheme } from 'next-themes'
import LoadingBar from 'react-top-loading-bar'

interface AppLoadingBarProps {
  height?: number
  className?: string
}

export function AppLoadingBar({
  height = 3,
  className = ""
}: AppLoadingBarProps) {
  const ref = useRef<AppLoadingBarRef | null>(null)
  const { theme } = useTheme()

  // Default colors based on theme
  const barColor = (theme === 'dark' ? '#f50057' : '#525151')

  const start = useCallback(() => {
    ref.current?.start() // Remove delay for immediate feedback
  }, [])

  const complete = useCallback(() => {
    ref.current?.complete()
  }, [])

  const staticStart = useCallback((progress: number = 10) => {
    ref.current?.staticStart(progress)
  }, [])

  // Expose methods through ref for parent components
  React.useImperativeHandle(ref, () => ({
    start,
    complete,
    staticStart,
  }), [start, complete, staticStart])

  return (
    <LoadingBar
      ref={ref as any}
      color={barColor}
      height={height}
      className={`transition-all duration-300 ${className}`}
      waitingTime={0}
      shadow={false}
      containerStyle={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: 'transparent',
      }}
      containerClassName="loading-bar-container"
      style={{
        backgroundColor: barColor,
        boxShadow: 'none',
        borderRadius: 0,
        transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    />
  )
}

// Export a ref interface for TypeScript users
export interface AppLoadingBarRef {
  start: () => void
  complete: () => void
  staticStart: (progress?: number) => void
}