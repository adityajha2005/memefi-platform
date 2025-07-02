"use client"

import { useState, useEffect } from "react"
import { Trophy, Coins, Users, Crown, TrendingUp } from "lucide-react"

interface PlatformStats {
  totalMemes: number
  totalStaked: string
  totalUsers: number
  totalNFTs: number
  contestsRun: number
}

export function AdminStatsGrid() {
  const [stats, setStats] = useState<PlatformStats | null>(null)

  useEffect(() => {
    // Mock data - replace with actual contract calls
    const loadStats = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setStats({
        totalMemes: 1247,
        totalStaked: "342.7",
        totalUsers: 8934,
        totalNFTs: 23,
        contestsRun: 24
      })
    }

    loadStats()
  }, [])

  const statItems = [
    {
      icon: Trophy,
      value: stats?.totalMemes.toLocaleString() || "0",
      label: "TOTAL MEMES",
      color: "bg-yellow-400"
    },
    {
      icon: Coins,
      value: `${stats?.totalStaked || "0"} BNB`,
      label: "TOTAL STAKED",
      color: "bg-yellow-400"
    },
    {
      icon: Users,
      value: stats?.totalUsers.toLocaleString() || "0",
      label: "TOTAL USERS",
      color: "bg-yellow-400"
    },
    {
      icon: Crown,
      value: stats?.totalNFTs || "0",
      label: "WINNER NFTS",
      color: "bg-yellow-400"
    },
    {
      icon: TrendingUp,
      value: stats?.contestsRun || "0",
      label: "CONTESTS RUN",
      color: "bg-yellow-400"
    }
  ]

  return (
    <div>
      <h2 className="text-2xl font-black uppercase mb-4">PLATFORM STATS</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statItems.map((item, index) => {
          const Icon = item.icon
          return (
            <div key={index} className="stats-card">
              <div className="flex items-center gap-3">
                <div className={`${item.color} p-2 border-2 border-black`}>
                  <Icon className="h-6 w-6 text-black" />
                </div>
                <div>
                  <div className="text-xl font-black">{item.value}</div>
                  <div className="text-sm font-bold text-gray-300">{item.label}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 