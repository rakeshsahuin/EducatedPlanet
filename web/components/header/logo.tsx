import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  showTagline?: boolean
  size?: "sm" | "md" | "lg"
}

export function Logo({ className, showTagline = true, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  }

  const taglineSizeClasses = {
    sm: "text-xs",
    md: "text-xs",
    lg: "text-sm"
  }

  return (
    <Link
      href="/"
      className={cn(
        "flex flex-col items-start hover:opacity-80 transition-opacity",
        className
      )}
      aria-label="EducatedPlanet - Find Your Perfect Tutor"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">EP</span>
        </div>
        <span className={cn(
          "font-bold text-foreground",
          sizeClasses[size]
        )}>
          EducatedPlanet
        </span>
      </div>
      {showTagline && (
        <span className={cn(
          "text-muted-foreground ml-10",
          taglineSizeClasses[size]
        )}>
          Find Your Perfect Tutor
        </span>
      )}
    </Link>
  )
}