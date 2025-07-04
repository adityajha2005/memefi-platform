"use client"

import { LeaderboardItem } from "@/components/ui/leaderboard-item"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect, useMemo } from "react"
import { useMemeStaking } from "@/hooks/use-meme-staking"
import { Loader2 } from "lucide-react"
import type { Meme } from "@/types"

interface LeaderboardMeme extends Meme {
  rank: number
  isWinner: boolean
}

export function LeaderboardSection() {
  const [memes, setMemes] = useState<LeaderboardMeme[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { getNextMemeId, getMeme } = useMemeStaking()

  useEffect(() => {
    const loadLeaderboardData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Get total number of memes
        const nextMemeId = await getNextMemeId()
        const totalMemes = nextMemeId - 1

        if (totalMemes <= 0) {
          setMemes([])
          setIsLoading(false)
          return
        }

        // Fetch all memes
        const memePromises = []
        for (let i = 1; i <= totalMemes; i++) {
          memePromises.push(getMeme(i))
        }

        const memeResults = await Promise.all(memePromises)
        
        // Convert to Meme format and filter out nulls
        const validMemes: Meme[] = memeResults
          .filter((meme): meme is NonNullable<typeof meme> => meme !== null)
          .map((meme) => ({
            id: Number(meme.id),
            title: `Meme #${meme.id}`,
            image: `https://gateway.pinata.cloud/ipfs/${meme.ipfsHash}`,
            creator: {
              name: `${meme.creator.slice(0, 6)}...${meme.creator.slice(-4)}`,
              avatar: "/placeholder-user.jpg"
            },
            bnbStaked: Number(meme.totalStaked) / 1e18,
            description: "Active meme",
            status: meme.rewardDistributed ? "rewards_distributed" : "active"
          }))

        // Sort by BNB staked and add rank
        const sortedMemes = validMemes
          .sort((a, b) => b.bnbStaked - a.bnbStaked)
          .map((meme, index) => ({
            ...meme,
            rank: index + 1,
            isWinner: index === 0
          }))

        setMemes(sortedMemes)
      } catch (err: any) {
        console.error("Failed to load leaderboard data:", err)
        setError("Failed to load leaderboard data")
        setMemes([])
      } finally {
        setIsLoading(false)
      }
    }

    loadLeaderboardData()
  }, [getNextMemeId, getMeme])

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-yellow-400" />
        <p className="text-sm font-bold text-gray-400">Loading leaderboard from blockchain...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-lg font-bold text-red-400 mb-2">❌ Error Loading Data</p>
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    )
  }

  if (memes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg font-bold text-gray-400 mb-2">📭 No Memes Yet</p>
        <p className="text-sm text-gray-500">Be the first to submit a meme!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Coming Soon Banner */}
      <div className="bg-black text-white p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-yellow-400 text-black px-3 py-1 font-black text-sm uppercase">Coming Soon</span>
          <span>🚀</span>
        </div>
        <p className="text-gray-400 uppercase text-sm">
          Twitter engagement metrics and social leaderboard
        </p>
      </div>

      {/* Leaderboard Content */}
      <div className="space-y-4">
        <div className="bg-black text-white py-3 font-black uppercase text-center">
          MOST STAKED
        </div>
        <div className="space-y-3">
          {memes.map((meme, index) => (
            <LeaderboardItem key={meme.id} meme={meme} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
