import { StakeCard } from "./stake-card"
import type { Stake } from "@/types"

interface MyStakesTabProps {
  stakes: Stake[]
  canWithdraw?: boolean
  isContestActive?: boolean
  onWithdraw?: (stakeId: number) => Promise<void>
  isLoading?: boolean
}

export function MyStakesTab({ 
  stakes, 
  canWithdraw = false, 
  isContestActive = true, 
  onWithdraw,
  isLoading = false 
}: MyStakesTabProps) {
  return (
    <div className="space-y-6">
      {/* Loading indicator */}
      {isLoading && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 border-2 border-blue-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="font-bold text-blue-800 uppercase">Processing Transaction...</span>
          </div>
        </div>
      )}

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