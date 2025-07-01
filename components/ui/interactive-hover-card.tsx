"use client"

import { useState } from "react"
import type { ReactNode } from "react"

interface InteractiveHoverCardProps {
  children: ReactNode
  hoverContent: ReactNode
  className?: string
}

export function InteractiveHoverCard({ children, hoverContent, className = "" }: InteractiveHoverCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`transition-all duration-300 ${isHovered ? "scale-105 rotate-1" : ""}`}>{children}</div>

      {isHovered && (
        <div className="absolute -top-2 -left-2 -right-2 -bottom-2 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-lg opacity-20 animate-pulse pointer-events-none" />
      )}

      {isHovered && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50 animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="bg-black text-green-400 p-4 border-2 border-green-400 retro-border min-w-48">
            {hoverContent}
          </div>
        </div>
      )}
    </div>
  )
}
