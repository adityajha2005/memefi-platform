import { HeroSection } from "@/components/sections/hero-section"
import { TrendingMemesSection } from "@/components/sections/trending-memes-section"
import { LiveStatsSection } from "@/components/sections/live-stats-section"

export default function HomePage() {
  return (
    <div className="space-y-12 pb-12">
      <HeroSection />
      <LiveStatsSection />
      <TrendingMemesSection />
    </div>
  )
}
