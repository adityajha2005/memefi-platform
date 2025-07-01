"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Wallet, Zap } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [isConnected, setIsConnected] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full header-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center bg-black border-2 border-black">
              <Zap className="h-6 w-6 text-yellow-400" />
            </div>
            <span className="text-3xl font-black text-black tracking-tight">MEMEFI</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-bold hover:text-green-500 transition-colors uppercase tracking-wide">
              Home
            </Link>
            <Link
              href="/upload"
              className="text-sm font-bold hover:text-green-500 transition-colors uppercase tracking-wide"
            >
              Upload
            </Link>
            <Link
              href="/explore"
              className="text-sm font-bold hover:text-green-500 transition-colors uppercase tracking-wide"
            >
              Explore
            </Link>
            <Link
              href="/leaderboard"
              className="text-sm font-bold hover:text-green-500 transition-colors uppercase tracking-wide"
            >
              Leaderboard
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-bold hover:text-green-500 transition-colors uppercase tracking-wide"
            >
              Dashboard
            </Link>
          </nav>

          <Button
            onClick={() => setIsConnected(!isConnected)}
            className={`${isConnected ? "btn-warning" : "btn-primary"}`}
          >
            <Wallet className="mr-2 h-4 w-4" />
            {isConnected ? "0x1234...5678" : "Connect Wallet"}
          </Button>
        </div>
      </div>
    </header>
  )
}
