"use client"

import { ReactNode } from 'react'
import { LoadingProvider } from './global-loading-provider'

interface ProvidersWrapperProps {
  children: ReactNode
}

export function ProvidersWrapper({ children }: ProvidersWrapperProps) {
  return (
    <LoadingProvider>
      {children}
    </LoadingProvider>
  )
}