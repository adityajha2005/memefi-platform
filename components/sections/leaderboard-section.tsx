"use client"

import { LeaderboardItem } from "@/components/ui/leaderboard-item"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import { useMemeStaking } from "@/hooks/use-meme-staking"
import { useWalletContext } from "@/components/wallet/wallet-provider"
import { Loader2 } from "lucide-react"
import type { Meme } from "@/types"

interface LeaderboardMeme extends Meme {
  rank: number
  isWinner: boolean
}

export function LeaderboardSection() {
  const [sortBy, setSortBy] = useState<"staked" | "liked">("staked")
  const [memes, setMemes] = useState<LeaderboardMeme[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { getNextMemeId, getMeme } = useMemeStaking()
  const { isConnected } = useWalletContext()

  useEffect(() => {
    const loadLeaderboardData = async () => {
      if (!isConnected) {
        setMemes([])
        setIsLoading(false)
        return
      }

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
        console.log("Raw meme results:", memeResults) // Debug log
        
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
            twitterLikes: Number(meme.engagementScore || 0), // Use engagement score from contract
            description: "Active meme",
            status: meme.rewardDistributed ? "rewards_distributed" : "active",
            engagementScore: meme.engagementScore || BigInt(0),
            tweetId: meme.tweetId
          }))

        // Add rank and winner status
        const leaderboardMemes: LeaderboardMeme[] = validMemes
          .sort((a, b) => {
            if (sortBy === "staked") {
              return b.bnbStaked - a.bnbStaked
            }
            return Number(b.engagementScore || 0) - Number(a.engagementScore || 0)
          })
          .map((meme, index) => ({
            ...meme,
            rank: index + 1,
            isWinner: index === 0,
          }))

        setMemes(leaderboardMemes)
      } catch (err: any) {
        console.error("Failed to load leaderboard data:", err)
        setError("Failed to load leaderboard data")
        setMemes([])
      } finally {
        setIsLoading(false)
      }
    }

    loadLeaderboardData()
  }, [isConnected, getNextMemeId, getMeme, sortBy])

  const sortedData = [...memes].sort((a, b) => {
    if (sortBy === "staked") {
      return b.bnbStaked - a.bnbStaked
    }
    return Number(b.engagementScore || 0) - Number(a.engagementScore || 0)
  })

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <p className="text-lg font-bold text-gray-400 mb-2">🔗 Connect Wallet Required</p>
        <p className="text-sm text-gray-500">Connect your wallet to view the leaderboard</p>
      </div>
    )
  }

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
    <div className="space-y-4 sm:space-y-6">
      <Tabs defaultValue="staked" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-sm sm:max-w-md mx-auto bg-black border-4 border-black">
          <TabsTrigger
            value="staked"
            onClick={() => setSortBy("staked")}
            className="font-black uppercase text-white data-[state=active]:bg-green-400 data-[state=active]:text-black text-xs sm:text-sm"
          >
            MOST STAKED
          </TabsTrigger>
          <TabsTrigger
            value="liked"
            onClick={() => setSortBy("liked")}
            className="font-black uppercase text-white data-[state=active]:bg-red-400 data-[state=active]:text-black text-xs sm:text-sm"
          >
            MOST LIKED
          </TabsTrigger>
        </TabsList>

        <TabsContent value="staked" className="space-y-3 sm:space-y-4">
          {sortedData.map((meme, index) => (
            <LeaderboardItem key={meme.id} meme={meme} index={index} />
          ))}
        </TabsContent>

        <TabsContent value="liked" className="space-y-3 sm:space-y-4">
          {sortedData.map((meme, index) => (
            <LeaderboardItem key={meme.id} meme={meme} index={index} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
