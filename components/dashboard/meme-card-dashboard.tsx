import { CustomButton } from "@/components/ui/custom-button"
import { Coins, Eye, Heart } from "lucide-react"
import Image from "next/image"
import type { Meme } from "@/types"

interface MemeCardDashboardProps {
  meme: Meme
}

export function MemeCardDashboard({ meme }: MemeCardDashboardProps) {
  return (
    <div className="meme-card p-4">
      <div className="flex items-start gap-4 mb-4">
        <Image
          src={meme.image || "/placeholder.svg"}
          alt={meme.title}
          width={100}
          height={100}
          className="rounded-lg object-cover border-2 border-black"
        />
        <div className="flex-1">
          <h3 className="font-black text-lg mb-2 uppercase tracking-tight">{meme.title}</h3>
          <div className="bg-green-400 text-black px-2 py-1 border-2 border-black font-black text-xs uppercase mb-2 inline-block">
            {meme.status || 'ACTIVE'}
          </div>
          <p className="text-sm font-bold text-gray-600 uppercase">
            UPLOADED {meme.uploadDate ? new Date(meme.uploadDate).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 bg-yellow-400 text-black px-2 py-1 border-2 border-black font-black mb-1">
            <Coins className="h-4 w-4" />
            <span>{meme.bnbStaked}</span>
          </div>
          <span className="text-xs font-bold text-gray-500 uppercase">BNB STAKED</span>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 bg-blue-400 text-white px-2 py-1 border-2 border-black font-black mb-1">
            <Eye className="h-4 w-4" />
            <span>{meme.views || 0}</span>
          </div>
          <span className="text-xs font-bold text-gray-500 uppercase">VIEWS</span>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 bg-red-400 text-white px-2 py-1 border-2 border-black font-black mb-1">
            <Heart className="h-4 w-4" />
            <span>{meme.likes || 0}</span>
          </div>
          <span className="text-xs font-bold text-gray-500 uppercase">LIKES</span>
        </div>
      </div>

      <CustomButton variant="secondary" className="w-full">
        VIEW DETAILS
      </CustomButton>
    </div>
  )
} 