"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Coins, TrendingUp, Twitter, Loader2 } from "lucide-react"
import Image from "next/image"
import { useMemeStaking } from "@/hooks/use-meme-staking"
import type { Meme } from "@/types"
import { useRouter } from "next/navigation"
import { useWalletContext } from "@/components/wallet/wallet-provider"

export function ExploreGrid() {
  const [visibleMemes, setVisibleMemes] = useState(6)
  const [memes, setMemes] = useState<Meme[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { getNextMemeId, getMeme } = useMemeStaking()
  const { isConnected } = useWalletContext()
  const router = useRouter()

  useEffect(() => {
    const loadMemes = async () => {
      try {
        const nextId = await getNextMemeId()
        const memesData: Meme[] = []
        
        // Load memes in reverse order (newest first)
        for(let i = Number(nextId) - 1; i >= 0; i--) {
          const meme = await getMeme(i)
          if (meme && meme.exists) {
            memesData.push({
              id: Number(meme.id),
              title: "Meme #" + meme.id.toString(),
              image: `https://ipfs.io/ipfs/${meme.ipfsHash}`,
              creator: { 
                name: meme.creator.slice(0, 6) + "..." + meme.creator.slice(-4),
                avatar: "/placeholder-user.jpg" 
              },
              bnbStaked: Number(meme.totalStaked) / 1e18,
              // twitterLikes: Number(meme.engagementScore || 0),
              // trending: Number(meme.totalStaked) > 1e18, // More than 1 BNB staked
              exists: meme.exists,
              status: meme.rewardDistributed ? "rewards_distributed" : "active" as const
            })
          }
        }
        setMemes(memesData)
      } catch (err) {
        console.error("Failed to load memes:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadMemes()
  }, [getNextMemeId, getMeme])

  const loadMore = () => {
    setVisibleMemes((prev) => prev + 6)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memes.slice(0, visibleMemes).map((meme) => (
          <Card key={meme.id} className="overflow-hidden meme-card-hover border-2 border-gray-100">
            <div className="relative">
              <Image
                src={meme.image || "/placeholder.svg"}
                alt={meme.title}
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              {(
                <Badge className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Hot
                </Badge>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{meme.title}</h3>

              <div className="flex items-center gap-2 mb-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={meme.creator.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{meme.creator.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600">{meme.creator.name}</span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-orange-600">
                  <Coins className="h-4 w-4" />
                  <span className="font-semibold">{meme.bnbStaked.toFixed(2)} BNB</span>
                </div>
                <div className="flex items-center gap-1 text-blue-600 cursor-pointer"
                  onClick={() => router.push(`/meme/${meme.id}`)}>
                  {/* <span className="font-semibold">{meme.twitterLikes}</span> */}
                </div>
              </div>

              {isConnected ? (
                <Button 
                  onClick={() => router.push(`/meme/${meme.id}`)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  Stake BNB
                </Button>
              ) : (
                <Button 
                  onClick={() => router.push(`/meme/${meme.id}`)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  View Details
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {visibleMemes < memes.length && (
        <div className="text-center">
          <Button
            onClick={loadMore}
            variant="outline"
            className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 px-8 bg-transparent"
          >
            Load More Memes
          </Button>
        </div>
      )}
    </div>
  )
}
