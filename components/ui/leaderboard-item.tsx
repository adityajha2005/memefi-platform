import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Crown, Medal, Coins, ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
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
    <div className={`relative flex items-center gap-4 p-4 bg-white border-2 ${meme.isWinner ? "border-yellow-400" : "border-black"}`}>
      {/* Rank Icon */}
      <div className="flex items-center justify-center w-12 h-12">
        {getRankIcon(index + 1)}
      </div>

      {/* Meme Image and Info */}
      <div className="flex items-center gap-4 flex-1">
        <Image
          src={meme.image || "/placeholder.svg"}
          alt={meme.title}
          width={48}
          height={48}
          className="rounded-lg object-cover border-2 border-black"
        />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-black text-lg uppercase">{meme.title}</h3>
            {meme.isWinner && (
              <Badge className="bg-yellow-400 text-black border-2 border-black font-black text-xs">
                WINNER
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6 border-2 border-black">
              <AvatarImage src={meme.creator.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-black text-white font-bold text-xs">
                {meme.creator.name[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-bold text-gray-600">{meme.creator.name}</span>
          </div>
        </div>
      </div>

      {/* BNB Amount and Arrow */}
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2 bg-yellow-400 text-black px-3 py-1 border-2 border-black font-black">
            <Coins className="h-4 w-4" />
            <span>{meme.bnbStaked}</span>
          </div>
          <div className="text-xs font-bold text-gray-500 uppercase text-center mt-1">
            BNB STAKED
          </div>
        </div>
        <Link href={`/meme/${meme.id}`}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-yellow-400 text-black p-2 border-2 border-black hover:bg-yellow-500 transition-colors"
          >
            <ArrowUpRight className="h-4 w-4" strokeWidth={3} />
          </motion.div>
        </Link>
      </div>
    </div>
  )
}
