import { HeroSection } from "@/components/sections/hero-section"
import { TrendingMemesSection } from "@/components/sections/trending-memes-section"
import { LiveStatsSection } from "@/components/sections/live-stats-section"
import { FAQSection } from "@/components/faq/faq-section"
import { ContestBanner } from "@/components/contest/contest-banner"
import { ContestRules } from "@/components/contest/contest-rules"

// Mock contest data - this would come from the contract in real implementation
const mockContest = {
  id: 1,
  startTime: Math.floor(Date.now() / 1000) - 86400, // Started 1 day ago
  endTime: Math.floor(Date.now() / 1000) + 518400, // Ends in 6 days
  isActive: true,
  totalMemes: 42,
  totalStaked: 156.7,
  participants: 128
}

export default function HomePage() {
  return (
    <div className="space-y-12 pb-12">
      {/* <ContestBanner contest={mockContest} /> */}
      <HeroSection />
      <LiveStatsSection />
      <TrendingMemesSection />
      <ContestRules />
      <FAQSection />
    </div>
  )
}
