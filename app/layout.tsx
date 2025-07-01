import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { ParticleBackground } from "@/components/ui/particle-background"
import { FloatingActionButton } from "@/components/ui/floating-action-button"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MEMEFI - Web3 Meme Contest Platform",
  description: "Stake, create, and compete with memes on the blockchain",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ParticleBackground />
        <Header />
        <main className="min-h-screen bg-gray-50 relative z-10">{children}</main>
        <FloatingActionButton />
      </body>
    </html>
  )
}
