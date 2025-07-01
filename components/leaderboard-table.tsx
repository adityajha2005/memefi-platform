"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Crown, Medal, Coins, Twitter } from "lucide-react"
import Image from "next/image"

const leaderboardData = [
  {
    rank: 1,
    title: "HODL Life",
    image: "/placeholder.svg?height=60&width=60",
    creator: { name: "DiamondHands", avatar: "/placeholder.svg?height=40&width=40" },
    bnbStaked: 67.23,
    twitterLikes: 1567,
    isWinner: true,
  },
  {
    rank: 2,
    title: "Doge to the Moon",
    image: "/placeholder.svg?height=60&width=60",
    creator: { name: "CryptoMemer", avatar: "/placeholder.svg?height=40&width=40" },
    bnbStaked: 45.67,
    twitterLikes: 1234,
    isWinner: false,
  },
  {
    rank: 3,
    title: "NFT Collector Problems",
    image: "/placeholder.svg?height=60&width=60",
    creator: { name: "BlockchainBro", avatar: "/placeholder.svg?height=40&width=40" },
    bnbStaked: 32.45,
    twitterLikes: 987,
    isWinner: false,
  },
  {
    rank: 4,
    title: "When Gas Fees Hit",
    image: "/placeholder.svg?height=60&width=60",
    creator: { name: "EthereumElf", avatar: "/placeholder.svg?height=40&width=40" },
    bnbStaked: 28.91,
    twitterLikes: 756,
    isWinner: false,
  },
  {
    rank: 5,
    title: "DeFi Summer Vibes",
    image: "/placeholder.svg?height=60&width=60",
    creator: { name: "YieldFarmer", avatar: "/placeholder.svg?height=40&width=40" },
    bnbStaked: 23.45,
    twitterLikes: 543,
    isWinner: false,
  },
]

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-5 w-5 text-yellow-500" />
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />
    case 3:
      return <Medal className="h-5 w-5 text-orange-600" />
    default:
      return <span className="font-bold text-gray-600">#{rank}</span>
  }
}

export function LeaderboardTable() {
  const [sortBy, setSortBy] = useState<"staked" | "liked">("staked")

  const sortedData = [...leaderboardData].sort((a, b) => {
    if (sortBy === "staked") {
      return b.bnbStaked - a.bnbStaked
    }
    return b.twitterLikes - a.twitterLikes
  })

  return (
    <div className="space-y-6">
      <Tabs defaultValue="staked" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="staked" onClick={() => setSortBy("staked")}>
            Most Staked
          </TabsTrigger>
          <TabsTrigger value="liked" onClick={() => setSortBy("liked")}>
            Most Liked
          </TabsTrigger>
        </TabsList>

        <TabsContent value="staked" className="space-y-4">
          {sortedData.map((meme, index) => (
            <Card
              key={meme.rank}
              className={`p-4 ${
                meme.isWinner
                  ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 animate-pulse-glow"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12">{getRankIcon(index + 1)}</div>

                <Image
                  src={meme.image || "/placeholder.svg"}
                  alt={meme.title}
                  width={60}
                  height={60}
                  className="rounded-lg object-cover"
                />

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">{meme.title}</h3>
                    {meme.isWinner && (
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                        <Trophy className="w-3 h-3 mr-1" />
                        Winner
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={meme.creator.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{meme.creator.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600">{meme.creator.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-orange-600 mb-1">
                      <Coins className="h-4 w-4" />
                      <span className="font-bold">{meme.bnbStaked}</span>
                    </div>
                    <span className="text-xs text-gray-500">BNB Staked</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-blue-600 mb-1">
                      <Twitter className="h-4 w-4" />
                      <span className="font-bold">{meme.twitterLikes}</span>
                    </div>
                    <span className="text-xs text-gray-500">Likes</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="liked" className="space-y-4">
          {sortedData.map((meme, index) => (
            <Card
              key={meme.rank}
              className={`p-4 ${
                meme.isWinner
                  ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 animate-pulse-glow"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12">{getRankIcon(index + 1)}</div>

                <Image
                  src={meme.image || "/placeholder.svg"}
                  alt={meme.title}
                  width={60}
                  height={60}
                  className="rounded-lg object-cover"
                />

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">{meme.title}</h3>
                    {meme.isWinner && (
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                        <Trophy className="w-3 h-3 mr-1" />
                        Winner
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={meme.creator.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{meme.creator.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600">{meme.creator.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-orange-600 mb-1">
                      <Coins className="h-4 w-4" />
                      <span className="font-bold">{meme.bnbStaked}</span>
                    </div>
                    <span className="text-xs text-gray-500">BNB Staked</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-blue-600 mb-1">
                      <Twitter className="h-4 w-4" />
                      <span className="font-bold">{meme.twitterLikes}</span>
                    </div>
                    <span className="text-xs text-gray-500">Likes</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
