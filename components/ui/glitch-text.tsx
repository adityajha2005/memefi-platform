"use client"

import { useEffect, useState } from "react"

interface GlitchTextProps {
  text: string
  className?: string
}

export function GlitchText({ text, className = "" }: GlitchTextProps) {
  const [glitching, setGlitching] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true)
      setTimeout(() => setGlitching(false), 200)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`relative ${className}`}>
      <span className={`${glitching ? "animate-pulse" : ""}`}>{text}</span>
      {glitching && (
        <>
          <span className="absolute top-0 left-0 text-red-500 opacity-70" style={{ transform: "translate(-2px, 0)" }}>
            {text}
          </span>
          <span className="absolute top-0 left-0 text-blue-500 opacity-70" style={{ transform: "translate(2px, 0)" }}>
            {text}
          </span>
        </>
      )}
    </div>
  )
}
