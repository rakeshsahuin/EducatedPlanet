"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface NavigationProps {
  className?: string
  onItemClick?: () => void
}

interface NavItemProps {
  href: string
  label: string
  isActive?: boolean
  onClick?: () => void
}

function NavItem({ href, label, isActive, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-sm font-medium rounded-md transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        isActive
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "text-foreground"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
    </Link>
  )
}

export function Navigation({ className, onItemClick }: NavigationProps) {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/",
      label: "Home"
    },
    {
      href: "/about",
      label: "About"
    },
    {
      href: "/contact",
      label: "Contact"
    },
    {
      href: "/tutors",
      label: "Find Tutors"
    }
  ]

  return (
    <nav className={cn("flex items-center space-x-1", className)}>
      {navItems.map((item) => (
        <NavItem
          key={item.href}
          href={item.href}
          label={item.label}
          isActive={pathname === item.href}
          onClick={onItemClick}
        />
      ))}
    </nav>
  )
}