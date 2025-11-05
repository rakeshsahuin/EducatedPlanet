"use client"

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { useLoading } from '@/components/providers/global-loading-provider'

export function useNavigationLoading() {
  const router = useRouter()
  const { startLoading, completeLoading } = useLoading()

  const navigateWithLoading = useCallback((url: string) => {
    startLoading()

    // Navigate to the new route
    router.push(url)

    // The loading will be completed automatically by the LoadingProvider
    // when the route change is detected
  }, [router, startLoading])

  const navigateWithRefresh = useCallback((url: string) => {
    startLoading()

    // Navigate with a refresh effect
    window.location.href = url
  }, [startLoading])

  const refreshWithLoading = useCallback(() => {
    startLoading()

    // Refresh the current page
    window.location.reload()
  }, [startLoading])

  return {
    navigateWithLoading,
    navigateWithRefresh,
    refreshWithLoading,
  }
}