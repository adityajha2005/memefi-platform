import { LeaderboardSection } from "@/components/sections/leaderboard-section"
import { ContestBanner } from "@/components/contest/contest-banner"

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

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <ContestBanner contest={mockContest} />
      
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black mb-2 sm:mb-4 uppercase tracking-tight">
          🏆 LEADERBOARD
        </h1>
        <p className="text-lg sm:text-xl font-bold text-gray-700 uppercase tracking-wide">
          TOP PERFORMING MEMES THIS WEEK
        </p>
      </div>
      <LeaderboardSection />
    </div>
  )
}
