import { CustomButton } from "@/components/ui/custom-button"
import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import type { Stake } from "@/types"

interface StakeCardProps {
  stake: Stake
}

export function StakeCard({ stake }: StakeCardProps) {
  return (
    <div className="meme-card p-4">
      <div className="flex items-start gap-4 mb-4">
        <Image
          src={stake.image || "/placeholder.svg"}
          alt={stake.memeTitle}
          width={80}
          height={80}
          className="rounded-lg object-cover border-2 border-black"
        />
        <div className="flex-1">
          <h3 className="font-black text-lg mb-1 uppercase tracking-tight">{stake.memeTitle}</h3>
          <p className="text-sm font-bold text-gray-600 mb-2 uppercase">BY {stake.creator}</p>
          <p className="text-xs font-bold text-gray-500 uppercase">
            STAKED {new Date(stake.stakeDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-gray-600 uppercase">INITIAL STAKE</span>
          <span className="font-black text-lg">{stake.stakeAmount} BNB</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-gray-600 uppercase">CURRENT VALUE</span>
          <span className="font-black text-lg">{stake.currentValue} BNB</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-gray-600 uppercase">PROFIT/LOSS</span>
          <span
            className={`font-black text-lg flex items-center gap-1 ${
              stake.profit > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            <ArrowUpRight className="h-4 w-4" />+{stake.profit} BNB
          </span>
        </div>
      </div>

      <CustomButton variant="primary" className="w-full mt-4">
        MANAGE STAKE
      </CustomButton>
    </div>
  )
} 