import { LeaderboardSection } from "@/components/sections/leaderboard-section"

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-black text-black mb-4 uppercase tracking-tight">🏆 LEADERBOARD</h1>
        <p className="text-xl font-bold text-gray-700 uppercase tracking-wide">TOP PERFORMING MEMES THIS WEEK</p>
      </div>
      <LeaderboardSection />
    </div>
  )
}
