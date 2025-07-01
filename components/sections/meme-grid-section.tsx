"use client"

import { MemeCard } from "@/components/ui/meme-card"
import { CustomButton } from "@/components/ui/custom-button"
import { useState } from "react"
import { trendingMemes } from "@/data/mock-data"

export function MemeGridSection() {
  const [visibleMemes, setVisibleMemes] = useState(6)

  const loadMore = () => {
    setVisibleMemes((prev) => prev + 6)
  }

  const handleStake = (memeId: number) => {
    console.log(`Staking on meme ${memeId}`)
    // Handle staking logic here
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trendingMemes.slice(0, visibleMemes).map((meme) => (
          <MemeCard key={meme.id} meme={meme} showTwitterLikes={true} onStake={handleStake} />
        ))}
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
