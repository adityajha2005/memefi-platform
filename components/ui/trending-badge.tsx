import { Flame } from "lucide-react"

export function TrendingBadge() {
  return (
    <div className="trending-badge px-3 py-1 text-sm font-black uppercase">
      <Flame className="w-4 h-4 mr-1 inline" />
      HOT
    </div>
  )
}
