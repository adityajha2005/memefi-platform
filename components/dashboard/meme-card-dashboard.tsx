import { CustomButton } from "@/components/ui/custom-button"
import { Coins } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Meme } from "@/types"

interface MemeCardDashboardProps {
  meme: Meme
}

export function MemeCardDashboard({ meme }: MemeCardDashboardProps) {
  return (
    <div className="bg-white p-4 border-2 border-black">
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
          <div className={`text-black px-2 py-1 border-2 border-black font-black text-xs uppercase mb-2 inline-block ${
            meme.status === 'active' ? 'bg-green-400' :
            meme.status === 'rewards_distributed' ? 'bg-yellow-400' :
            'bg-gray-400'
          }`}>
            {meme.status || 'ACTIVE'}
          </div>
          <p className="text-sm font-bold text-gray-600 uppercase">
            UPLOADED {meme.uploadDate ? new Date(meme.uploadDate).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 bg-yellow-400 text-black px-2 py-1 border-2 border-black font-black mb-1">
            <Coins className="h-4 w-4" />
            <span>{meme.bnbStaked}</span>
          </div>
          <span className="text-xs font-bold text-gray-500 uppercase">BNB STAKED</span>
        </div>
      </div>

      {/* Coming Soon Badge */}
      <div className="mb-4">
        <div className="bg-black text-white p-3">
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-black px-2 py-0.5 text-xs font-black uppercase">Coming Soon</span>
            <span>🚀</span>
          </div>
          <p className="text-gray-400 uppercase text-xs mt-1">Engagement Metrics</p>
        </div>
      </div>

      <Link href={`/meme/${meme.id}`} className="block">
        <CustomButton variant="secondary" className="w-full bg-black text-white hover:bg-gray-900">
          VIEW DETAILS
        </CustomButton>
      </Link>
    </div>
  )
} 