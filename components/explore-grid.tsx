"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Coins, TrendingUp, Twitter } from "lucide-react"
import Image from "next/image"

const memes = [
  {
    id: 1,
    title: "Doge to the Moon",
    image: "/placeholder.svg?height=300&width=400",
    creator: { name: "CryptoMemer", avatar: "/placeholder.svg?height=40&width=40" },
    bnbStaked: 45.67,
    twitterLikes: 1234,
    trending: true,
  },
  {
    id: 2,
    title: "NFT Collector Problems",
    image: "/placeholder.svg?height=300&width=400",
    creator: { name: "BlockchainBro", avatar: "/placeholder.svg?height=40&width=40" },
    bnbStaked: 32.45,
    twitterLikes: 987,
    trending: false,
  },
  {
    id: 3,
    title: "When Gas Fees Hit",
    image: "/placeholder.svg?height=300&width=400",
    creator: { name: "EthereumElf", avatar: "/placeholder.svg?height=40&width=40" },
    bnbStaked: 28.91,
    twitterLikes: 756,
    trending: false,
  },
  {
    id: 4,
    title: "HODL Life",
    image: "/placeholder.svg?height=300&width=400",
    creator: { name: "DiamondHands", avatar: "/placeholder.svg?height=40&width=40" },
    bnbStaked: 67.23,
    twitterLikes: 1567,
    trending: true,
  },
  {
    id: 5,
    title: "DeFi Summer Vibes",
    image: "/placeholder.svg?height=300&width=400",
    creator: { name: "YieldFarmer", avatar: "/placeholder.svg?height=40&width=40" },
    bnbStaked: 23.45,
    twitterLikes: 543,
    trending: false,
  },
  {
    id: 6,
    title: "Rug Pull Survivor",
    image: "/placeholder.svg?height=300&width=400",
    creator: { name: "SafeMoonSailor", avatar: "/placeholder.svg?height=40&width=40" },
    bnbStaked: 19.87,
    twitterLikes: 432,
    trending: false,
  },
]

export function ExploreGrid() {
  const [visibleMemes, setVisibleMemes] = useState(6)

  const loadMore = () => {
    setVisibleMemes((prev) => prev + 6)
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
              {meme.trending && (
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
                  <span className="font-semibold">{meme.bnbStaked} BNB</span>
                </div>
                <div className="flex items-center gap-1 text-blue-600">
                  <Twitter className="h-4 w-4" />
                  <span className="font-semibold">{meme.twitterLikes}</span>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                Stake BNB
              </Button>
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
