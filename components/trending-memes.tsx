"use client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight, Coins, Heart, Flame } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

const trendingMemes = [
  {
    id: 1,
    title: "Doge to the Moon",
    image: "/placeholder.svg?height=300&width=400",
    creator: {
      name: "CryptoMemer",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    bnbStaked: 45.67,
    likes: 1234,
    trending: true,
  },
  {
    id: 2,
    title: "NFT Collector Problems",
    image: "/placeholder.svg?height=300&width=400",
    creator: {
      name: "BlockchainBro",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    bnbStaked: 32.45,
    likes: 987,
    trending: true,
  },
  {
    id: 3,
    title: "When Gas Fees Hit",
    image: "/placeholder.svg?height=300&width=400",
    creator: {
      name: "EthereumElf",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    bnbStaked: 28.91,
    likes: 756,
    trending: false,
  },
  {
    id: 4,
    title: "HODL Life",
    image: "/placeholder.svg?height=300&width=400",
    creator: {
      name: "DiamondHands",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    bnbStaked: 67.23,
    likes: 1567,
    trending: true,
  },
]

export function TrendingMemes() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, trendingMemes.length - 2))
  }

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + Math.max(1, trendingMemes.length - 2)) % Math.max(1, trendingMemes.length - 2),
    )
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h2 className="text-5xl font-black text-black mb-4 uppercase tracking-tight">🔥 TRENDING MEMES</h2>
        <p className="text-xl font-bold text-gray-700 uppercase tracking-wide">THE HOTTEST SHIT RIGHT NOW</p>
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <Button onClick={prevSlide} className="btn-secondary rounded-none">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button onClick={nextSlide} className="btn-secondary rounded-none">
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingMemes.slice(currentIndex, currentIndex + 3).map((meme) => (
            <div key={meme.id} className="meme-card p-0 overflow-hidden">
              <div className="relative">
                <Image
                  src={meme.image || "/placeholder.svg"}
                  alt={meme.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                {meme.trending && (
                  <div className="trending-badge absolute top-3 right-3 px-3 py-1 text-sm font-black uppercase">
                    <Flame className="w-4 h-4 mr-1 inline" />
                    HOT
                  </div>
                )}
              </div>

              <div className="p-4 bg-white">
                <h3 className="font-black text-xl mb-3 uppercase tracking-tight">{meme.title}</h3>

                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-10 w-10 border-2 border-black">
                    <AvatarImage src={meme.creator.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-black text-white font-bold">{meme.creator.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-bold text-gray-700 uppercase">{meme.creator.name}</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 bg-yellow-400 text-black px-3 py-1 border-2 border-black font-black">
                    <Coins className="h-4 w-4" />
                    <span>{meme.bnbStaked} BNB</span>
                  </div>
                  <div className="flex items-center gap-2 bg-red-400 text-white px-3 py-1 border-2 border-black font-black">
                    <Heart className="h-4 w-4" />
                    <span>{meme.likes}</span>
                  </div>
                </div>

                <Button className="btn-primary w-full text-lg">STAKE NOW</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
