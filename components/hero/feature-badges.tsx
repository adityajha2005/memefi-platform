import { Zap, Coins, Flame } from "lucide-react"

export function FeatureBadges() {
  return (
    <div className="mb-12 flex flex-wrap justify-center gap-6 text-lg font-bold">
      <div className="flex items-center gap-2 bg-black text-green-400 px-4 py-2 retro-border">
        <Zap className="h-5 w-5" />
        <span>INSTANT STAKES</span>
      </div>
      <div className="flex items-center gap-2 bg-black text-yellow-400 px-4 py-2 retro-border">
        <Coins className="h-5 w-5" />
        <span>BNB REWARDS</span>
      </div>
      <div className="flex items-center gap-2 bg-black text-red-400 px-4 py-2 retro-border">
        <Flame className="h-5 w-5" />
        <span>WEEKLY BATTLES</span>
      </div>
    </div>
  )
}