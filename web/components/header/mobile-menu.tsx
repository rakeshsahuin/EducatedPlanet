"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Logo } from "./logo"
import { Navigation } from "./navigation"

interface MobileMenuProps {
  className?: string
}

export function MobileMenu({ className }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleNavClick = () => {
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("md:hidden", className)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0" title="Mobile Navigation Menu">
        <div className="p-6">
          <Logo size="lg" showTagline={true} />
        </div>

        <Separator />

        <div className="p-6">
          <Navigation
            onItemClick={handleNavClick}
            className="flex-col space-y-1 space-x-0"
          />
        </div>

        <Separator />

        <div className="p-6">
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Looking to become a tutor?
            </div>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Join as a Tutor
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}