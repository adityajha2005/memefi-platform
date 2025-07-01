"use client"

import { useEffect, useState } from "react"
import type { ReactNode } from "react"

interface AnimatedBadgeProps {
  children: ReactNode
  variant?: "pulse" | "bounce" | "glow" | "shake"
  color?: "green" | "yellow" | "red" | "blue"
  className?: string
}

export function AnimatedBadge({ children, variant = "pulse", color = "green", className = "" }: AnimatedBadgeProps) {
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(false)
      setTimeout(() => setIsAnimating(true), 100)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const colors = {
    green: "bg-green-400 text-black border-green-600",
    yellow: "bg-yellow-400 text-black border-yellow-600",
    red: "bg-red-400 text-white border-red-600",
    blue: "bg-blue-400 text-white border-blue-600",
  }

  const animations = {
    pulse: isAnimating ? "animate-pulse" : "",
    bounce: isAnimating ? "animate-bounce" : "",
    glow: isAnimating ? "animate-pulse" : "",
    shake: isAnimating ? "animate-bounce" : "",
  }

  const glowEffect =
    variant === "glow"
      ? {
          boxShadow: `0 0 20px currentColor`,
        }
      : {}

  return (
    <span
      className={`inline-flex items-center px-3 py-1 border-2 border-black font-black text-xs uppercase ${colors[color]} ${animations[variant]} ${className}`}
      style={glowEffect}
    >
      {children}
    </span>
  )
}
