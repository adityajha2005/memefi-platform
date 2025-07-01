"use client"

import { StatsCard } from "@/components/ui/stats-card"
import { Users, ImageIcon, Coins } from "lucide-react"
import { useEffect, useState } from "react"
import type { Stats } from "@/types"
import { AnimatedCounter } from "@/components/ui/animated-counter"

export function LiveStatsSection() {
  const [stats, setStats] = useState<Stats>({
    totalMemes: 12847,
    bnbStaked: 2456.78,
    activeUsers: 8934,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        totalMemes: prev.totalMemes + Math.floor(Math.random() * 3),
        bnbStaked: prev.bnbStaked + Math.random() * 0.1,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5) - 2,
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="TOTAL MEMES"
          value={<AnimatedCounter end={stats.totalMemes} className="text-white" />}
          icon={<ImageIcon className="h-8 w-8" />}
          color="green"
        />
        <StatsCard
          title="BNB STAKED"
          value={<AnimatedCounter end={stats.bnbStaked} decimals={2} className="text-black" />}
          icon={<Coins className="h-8 w-8" />}
          color="yellow"
        />
        <StatsCard
          title="ACTIVE USERS"
          value={<AnimatedCounter end={stats.activeUsers} className="text-white" />}
          icon={<Users className="h-8 w-8" />}
          color="red"
        />
      </div>
    </section>
  )
}
