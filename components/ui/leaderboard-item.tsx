import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Crown, Medal, Coins, Twitter } from "lucide-react"
import type { Meme } from "@/types"

interface LeaderboardItemProps {
  meme: Meme & { rank: number; isWinner?: boolean }
  index: number
}

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

export function LeaderboardItem({ meme, index }: LeaderboardItemProps) {
  return (
    <div className={`meme-card p-4 ${meme.isWinner ? "winner-glow bg-yellow-50" : ""}`}>
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12">{getRankIcon(index + 1)}</div>

        <Image
          src={meme.image || "/placeholder.svg"}
          alt={meme.title}
          width={60}
          height={60}
          className="rounded-lg object-cover border-2 border-black"
        />

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-black text-lg uppercase tracking-tight">{meme.title}</h3>
            {meme.isWinner && (
              <Badge className="bg-yellow-400 text-black border-2 border-black font-black">
                <Trophy className="w-3 h-3 mr-1" />
                WINNER
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6 border-2 border-black">
              <AvatarImage src={meme.creator.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-black text-white font-bold text-xs">{meme.creator.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-bold text-gray-600 uppercase">{meme.creator.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="flex items-center gap-1 bg-yellow-400 text-black px-2 py-1 border-2 border-black font-black mb-1">
              <Coins className="h-4 w-4" />
              <span>{meme.bnbStaked}</span>
            </div>
            <span className="text-xs font-bold text-gray-500 uppercase">BNB STAKED</span>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 bg-blue-400 text-white px-2 py-1 border-2 border-black font-black mb-1">
              <Twitter className="h-4 w-4" />
              <span>{meme.twitterLikes}</span>
            </div>
            <span className="text-xs font-bold text-gray-500 uppercase">LIKES</span>
          </div>
        </div>
      </div>
    </div>
  )
}
