import { StakeCard } from "./stake-card"
import type { Stake } from "@/types"

interface MyStakesTabProps {
  stakes: Stake[]
  canWithdraw?: boolean
  isContestActive?: boolean
  onWithdraw?: (stakeId: number) => Promise<void>
}

export function MyStakesTab({ stakes, canWithdraw = false, isContestActive = true, onWithdraw }: MyStakesTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stakes.map((stake) => (
          <StakeCard 
            key={stake.id} 
            stake={stake} 
            canWithdraw={canWithdraw}
            isContestActive={isContestActive}
            onWithdraw={onWithdraw}
          />
        ))}
      </div>
      
      {stakes.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-2xl font-black text-gray-700 mb-4 uppercase">NO STAKES YET</h3>
          <p className="text-lg font-bold text-gray-600 uppercase">
            Start staking on memes to see them here!
          </p>
        </div>
      )}
    </div>
  )
} 