"use client";
import Link from "next/link"
import { motion } from "framer-motion"
import { useWalletContext } from "@/components/wallet/wallet-provider"
import { Shield } from "lucide-react"

export function Navigation() {
  const walletContext = useWalletContext()

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/upload", label: "Upload" },
    { href: "/explore", label: "Explore" },
    { href: "/nfts", label: "NFTs" },
    { href: "/leaderboard", label: "Leaderboard" },
  ]

  return (
    <nav className="hidden md:flex items-center space-x-8">
      {navItems.map((item, index) => (
        <motion.div
          key={item.href}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href={item.href}
            className="text-sm font-bold hover:text-green-500 transition-colors uppercase tracking-wide"
          >
            {item.label}
          </Link>
        </motion.div>
      ))}
      {walletContext.isConnected && (
        <>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/dashboard"
              className="text-sm font-bold hover:text-green-500 transition-colors uppercase tracking-wide"
            >
              Dashboard
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* <Link
              href="/admin"
              className="text-sm font-bold hover:text-green-500 transition-colors uppercase tracking-wide flex items-center gap-1"
            >
              Admin
            </Link> */}
          </motion.div>
        </>
      )}
    </nav>
  )
} 