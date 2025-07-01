"use client";
import Link from "next/link"
import { useWalletContext } from "@/components/wallet/wallet-provider"
export function Navigation() {
  const walletContext = useWalletContext()

  return (
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
      {walletContext.isConnected && (
        <Link
          href="/dashboard"
          className="text-sm font-bold hover:text-green-500 transition-colors uppercase tracking-wide"
        >
          Dashboard
        </Link>
      )}
    </nav>
  )
} 