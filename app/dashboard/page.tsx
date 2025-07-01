"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardTabs } from "@/components/dashboard-tabs"
import { useWalletContext } from "@/components/wallet/wallet-provider"

export default function DashboardPage() {
  const { isConnected } = useWalletContext()
  const router = useRouter()

  useEffect(() => {
    if (!isConnected) {
      router.push("/")
    }
  }, [isConnected, router])

  if (!isConnected) return null 

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-black text-black mb-4 uppercase tracking-tight">💼 MY DASHBOARD</h1>
        <p className="text-xl font-bold text-gray-700 uppercase tracking-wide">TRACK YOUR MEMES, STAKES, AND REWARDS</p>
      </div>
      <DashboardTabs />
    </div>
  )
}
