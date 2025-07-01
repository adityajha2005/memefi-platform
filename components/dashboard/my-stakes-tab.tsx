import { StakeCard } from "./stake-card"
import type { Stake } from "@/types"

interface MyStakesTabProps {
  stakes: Stake[]
}

export function MyStakesTab({ stakes }: MyStakesTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stakes.map((stake) => (
          <StakeCard key={stake.id} stake={stake} />
        ))}
      </div>
    </div>
  )
} 