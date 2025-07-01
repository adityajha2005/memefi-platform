"use client"

import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CustomButton } from "@/components/ui/custom-button"
import { TrendingBadge } from "@/components/ui/trending-badge"
import { Coins, Heart, Twitter, Eye } from "lucide-react"
import type { Meme } from "@/types"

interface MemeCardProps {
  meme: Meme
  showTwitterLikes?: boolean
  showViews?: boolean
  onStake?: (memeId: number) => void
}

export function MemeCard({ meme, showTwitterLikes = false, showViews = false, onStake }: MemeCardProps) {
  return (
    <div className="meme-card p-0 overflow-hidden">
      <div className="relative">
        <Image
          src={meme.image || "/placeholder.svg"}
          alt={meme.title}
          width={400}
          height={300}
          className="w-full h-48 object-cover"
        />
        {meme.trending && (
          <div className="absolute top-3 right-3">
            <TrendingBadge />
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

        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2 bg-yellow-400 text-black px-3 py-1 border-2 border-black font-black">
            <Coins className="h-4 w-4" />
            <span>{meme.bnbStaked} BNB</span>
          </div>

          {showTwitterLikes && meme.twitterLikes && (
            <div className="flex items-center gap-2 bg-blue-400 text-white px-3 py-1 border-2 border-black font-black">
              <Twitter className="h-4 w-4" />
              <span>{meme.twitterLikes}</span>
            </div>
          )}

          {showViews && meme.views && (
            <div className="flex items-center gap-2 bg-purple-400 text-white px-3 py-1 border-2 border-black font-black">
              <Eye className="h-4 w-4" />
              <span>{meme.views}</span>
            </div>
          )}

          {meme.likes && (
            <div className="flex items-center gap-2 bg-red-400 text-white px-3 py-1 border-2 border-black font-black">
              <Heart className="h-4 w-4" />
              <span>{meme.likes}</span>
            </div>
          )}
        </div>

        <CustomButton variant="primary" className="w-full text-lg" onClick={() => onStake?.(meme.id)}>
          STAKE NOW
        </CustomButton>
      </div>
    </div>
  )
}
