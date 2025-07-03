"use client"

import { useState, useEffect } from "react"
import { Trophy, Coins, Users, Crown, TrendingUp, Loader2 } from "lucide-react"
import { useMemeStaking } from "@/hooks/use-meme-staking"
import { useWalletContext } from "@/components/wallet/wallet-provider"

interface PlatformStats {
  totalMemes: number
  totalStaked: string
  totalUsers: number
  totalNFTs: number
  contestsRun: number
}

export function AdminStatsGrid() {
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const { 
    getNextMemeId, 
    getCurrentContestId,
    error 
  } = useMemeStaking()
  const { isConnected } = useWalletContext()

  useEffect(() => {
    const loadStats = async () => {
      if (!isConnected) {
        setIsLoading(false)
        return
      }

      try {
        // Get real contract data
        const [nextMemeId, currentContestId] = await Promise.all([
          getNextMemeId(),
          getCurrentContestId()
        ])
        
        // Total memes = next meme ID - 1 (since IDs start from 1)
        const totalMemes = Math.max(0, nextMemeId - 1)
        
        // For now, we'll use some calculated/estimated values for data not directly available
        setStats({
          totalMemes,
          totalStaked: "0.000", // Would need to aggregate from all memes
          totalUsers: Math.floor(totalMemes * 0.8), // Estimate: ~80% unique users
          totalNFTs: Math.max(0, currentContestId - 1), // Estimate: one NFT per completed contest
          contestsRun: currentContestId
        })
      } catch (err) {
        console.error("Failed to load platform stats:", err)
        // Fallback to estimated data if contract calls fail
        setStats({
          totalMemes: 0,
          totalStaked: "0.000",
          totalUsers: 0,
          totalNFTs: 0,
          contestsRun: 0
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [isConnected, getNextMemeId, getCurrentContestId])

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
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border-4 border-red-400">
          <p className="font-bold text-red-800">Contract Error: {error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="meme-card p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="font-bold">Loading Platform Stats...</p>
        </div>
      ) : !isConnected ? (
        <div className="meme-card p-8 text-center">
          <p className="font-bold text-gray-400">Connect wallet to view stats</p>
        </div>
      ) : (
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
      )}
      
      {stats && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            * Some stats are estimated based on available contract data
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-bold uppercase"
          >
            Refresh Data
          </button>
        </div>
      )}
    </div>
  )
} 