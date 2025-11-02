"use client"

import { useState } from "react"
import { LogIn, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Logo } from "./logo"
import { Navigation } from "./navigation"
import { MobileMenu } from "./mobile-menu"
import { LoginModal } from "@/components/auth/login-modal"

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  return (
    <>
      <header className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}>
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center">
              <Logo size="md" showTagline={false} />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Navigation />
            </nav>

            {/* Right Section - Login & Mobile Menu */}
            <div className="flex items-center space-x-2">
              {/* Desktop Login Button */}
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsLoginModalOpen(true)}
                className="hidden sm:flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Button>

              {/* Mobile Login Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLoginModalOpen(true)}
                className="sm:hidden"
                aria-label="Login"
              >
                <User className="h-4 w-4" />
              </Button>

              {/* Mobile Menu */}
              <MobileMenu />
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center py-2">
              <Navigation className="text-sm" />
            </div>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  )
}