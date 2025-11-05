"use client"

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import React, { AnchorHTMLAttributes, forwardRef } from 'react'
import { useLoading } from '@/components/providers/global-loading-provider'

interface LoadingLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
  replace?: boolean
  scroll?: boolean
  prefetch?: boolean
  target?: string
  showLoading?: boolean
}

export const LoadingLink = forwardRef<HTMLAnchorElement, LoadingLinkProps>(
  (
    {
      href,
      children,
      replace,
      scroll,
      prefetch,
      target,
      showLoading = true,
      onClick,
      ...props
    },
    ref
  ) => {
    const router = useRouter()
    const pathname = usePathname()
    const { startLoading } = useLoading()

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Don't show loading for same page navigation
      if (href === pathname) {
        onClick?.(e)
        return
      }

      // Don't show loading for external links
      if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        onClick?.(e)
        return
      }

      // Show loading bar
      if (showLoading) {
        console.log('Starting loading bar for navigation to:', href)
        startLoading()
      }

      // Call original onClick if provided
      onClick?.(e)
    }

    // For external links, use regular Link behavior
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return (
        <Link
          href={href}
          target={target}
          ref={ref}
          onClick={onClick}
          {...props}
        >
          {children}
        </Link>
      )
    }

    return (
      <Link
        href={href}
        replace={replace}
        scroll={scroll}
        prefetch={prefetch}
        target={target}
        ref={ref}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Link>
    )
  }
)

LoadingLink.displayName = 'LoadingLink'