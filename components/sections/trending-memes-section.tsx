"use client"

import { MemeCard } from "@/components/ui/meme-card"
import { CustomButton } from "@/components/ui/custom-button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { trendingMemes } from "@/data/mock-data"

export function TrendingMemesSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, trendingMemes.length - 2))
  }

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + Math.max(1, trendingMemes.length - 2)) % Math.max(1, trendingMemes.length - 2),
    )
  }

  const handleStake = (memeId: number) => {
    console.log(`Staking on meme ${memeId}`)
    // Handle staking logic here
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h2 className="text-5xl font-black text-black mb-4 uppercase tracking-tight">🔥 TRENDING MEMES</h2>
        <p className="text-xl font-bold text-gray-700 uppercase tracking-wide">THE HOTTEST SHIT RIGHT NOW</p>
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <CustomButton variant="secondary" onClick={prevSlide}>
            <ChevronLeft className="h-6 w-6" />
          </CustomButton>
          <CustomButton variant="secondary" onClick={nextSlide}>
            <ChevronRight className="h-6 w-6" />
          </CustomButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingMemes.slice(currentIndex, currentIndex + 3).map((meme) => (
            <MemeCard key={meme.id} meme={meme} onStake={handleStake} />
          ))}
        </div>
      </div>
    </section>
  )
}
