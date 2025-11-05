"use client"

import React, { createContext, useContext, useRef, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AppLoadingBar, AppLoadingBarRef } from '@/components/ui/loading-bar'
import { SimpleLoadingBar } from '@/components/ui/simple-loading-bar'

interface LoadingContextType {
  startLoading: () => void
  completeLoading: () => void
  isLoading: boolean
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider')
  }
  return context
}

interface LoadingProviderProps {
  children: React.ReactNode
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const loadingBarRef = useRef<AppLoadingBarRef>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const prevPathname = useRef(pathname)

  const startLoading = () => {
    console.log('LoadingProvider: startLoading called')
    setIsLoading(true)
    loadingBarRef.current?.start()
  }

  const completeLoading = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Simulate a brief pause at 90% before completing
    setTimeout(() => {
      loadingBarRef.current?.complete()
      setIsLoading(false)
      setIsNavigating(false)
    }, 300)
  }

  // Handle route changes
  useEffect(() => {
    // Track navigation state
    const handleRouteChangeStart = (url: string) => {
      // Don't show loading bar for same-page navigation
      if (url !== pathname) {
        setIsNavigating(true)
        startLoading()
      }
    }

    const handleRouteChangeComplete = () => {
      completeLoading()
    }

    const handleRouteChangeError = () => {
      completeLoading()
    }

    // Since Next.js 13+ with App Router doesn't have route events,
    // we need to intercept navigation in a different way

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [pathname])

  // Handle browser refresh and back/forward buttons
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Show loading briefly when user refreshes
      startLoading()
    }

    const handlePageShow = (event: PageTransitionEvent) => {
      // Complete loading when page is shown
      if (event.persisted) {
        completeLoading()
      }
    }

    // Set up event listeners for browser navigation
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('pageshow', handlePageShow)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('pageshow', handlePageShow)
    }
  }, [])

  // Auto-complete loading after a timeout to prevent stuck loading
  useEffect(() => {
    if (isNavigating) {
      timeoutRef.current = setTimeout(() => {
        completeLoading()
      }, 5000) // Force complete after 5 seconds
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isNavigating])

  // Complete loading when pathname changes (navigation finished)
  useEffect(() => {
    if (pathname !== prevPathname.current) {
      
        // Small delay to ensure content starts loading
        const completeTimer = setTimeout(() => {
          completeLoading()
        }, 300) // Slightly longer delay for better UX

        return () => clearTimeout(completeTimer)
    }
    prevPathname.current = pathname
  }, [pathname])

  const contextValue: LoadingContextType = {
    startLoading,
    completeLoading,
    isLoading,
  }

  return (
    <LoadingContext.Provider value={contextValue}>
      {React.createElement(AppLoadingBar as unknown as any, { ref: loadingBarRef })}
      <SimpleLoadingBar isLoading={isLoading} />
      {children}
    </LoadingContext.Provider>
  )
}