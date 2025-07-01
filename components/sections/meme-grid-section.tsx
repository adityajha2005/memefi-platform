"use client"

import { MemeCard } from "@/components/ui/meme-card"
import { CustomButton } from "@/components/ui/custom-button"
import { useState } from "react"
import { trendingMemes } from "@/data/mock-data"
import { useToast } from "@/components/ui/toast-notification"

export function MemeGridSection() {
  const [visibleMemes, setVisibleMemes] = useState(6)
  const { showToast } = useToast()

  const loadMore = () => {
    setVisibleMemes((prev) => prev + 6)
  }

  const handleStake = async (memeId: number, amount: string) => {
    console.log(`Staking ${amount} BNB on meme ${memeId}`)
    
    // Simulate contract call delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // In real implementation:
    // await contract.stakeMeme(memeId, { value: ethers.utils.parseEther(amount) })
    
    // This would be handled by the MemeCard component's success callback
  }

  // Mock function to determine if meme is stakeable (would check contract state)
  const getMemeStakeInfo = (memeId: number) => {
    // Simulate: newer memes have staking delay
    const isNew = memeId > 4
    return {
      isStakeable: !isNew,
      stakeDelay: isNew ? 45 : 0, // 45 seconds remaining
      userHasStaked: memeId === 1, // User has staked on first meme
      userStakeAmount: memeId === 1 ? 0.5 : 0
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trendingMemes.slice(0, visibleMemes).map((meme) => {
          const stakeInfo = getMemeStakeInfo(meme.id)
          
          return (
            <MemeCard 
              key={meme.id} 
              meme={meme} 
              showTwitterLikes={true} 
              onStake={handleStake}
              isStakeable={stakeInfo.isStakeable}
              stakeDelay={stakeInfo.stakeDelay}
              userHasStaked={stakeInfo.userHasStaked}
              userStakeAmount={stakeInfo.userStakeAmount}
            />
          )
        })}
      </div>

      {visibleMemes < trendingMemes.length && (
        <div className="text-center">
          <CustomButton variant="secondary" onClick={loadMore} className="px-8">
            LOAD MORE MEMES
          </CustomButton>
        </div>
      )}
    </div>
  )
}
