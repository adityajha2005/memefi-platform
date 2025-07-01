"use client"

import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { WalletButton } from "@/components/wallet/wallet-button"
import { Zap } from "lucide-react"

export function Header() {
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

          <Navigation />

          <WalletButton />
        </div>
      </div>
    </header>
  )
}
