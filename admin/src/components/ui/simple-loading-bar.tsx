"use client"

import React, { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

interface SimpleLoadingBarProps {
  isLoading: boolean
}

export function SimpleLoadingBar({ isLoading }: SimpleLoadingBarProps) {
  const [progress, setProgress] = useState(0)
  const { theme } = useTheme()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isLoading) {
      setVisible(true)
      setProgress(0)

      // Animate progress
      const timer1 = setTimeout(() => setProgress(30), 100)
      const timer2 = setTimeout(() => setProgress(60), 200)
      const timer3 = setTimeout(() => setProgress(90), 300)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
      }
    } else {
      // Complete the animation
      setProgress(100)
      const timer = setTimeout(() => {
        setVisible(false)
        setProgress(0)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [isLoading])

  if (!visible) return null

  const color = theme === 'dark' ? '#f50057' : '#1b5e20'

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        zIndex: 9999,
        backgroundColor: 'transparent',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          backgroundColor: color,
          transition: 'width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          boxShadow: `0 0 10px ${color}40`,
        }}
      />
    </div>
  )
}