"use client"

import { LeaderboardItem } from "@/components/ui/leaderboard-item"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { trendingMemes } from "@/data/mock-data"

const leaderboardData = trendingMemes.map((meme, index) => ({
  ...meme,
  rank: index + 1,
  isWinner: index === 0,
}))

export function LeaderboardSection() {
  const [sortBy, setSortBy] = useState<"staked" | "liked">("staked")

  const sortedData = [...leaderboardData].sort((a, b) => {
    if (sortBy === "staked") {
      return b.bnbStaked - a.bnbStaked
    }
    return (b.twitterLikes || 0) - (a.twitterLikes || 0)
  })

  return (
    <div className="space-y-6">
      <Tabs defaultValue="staked" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-black border-4 border-black">
          <TabsTrigger
            value="staked"
            onClick={() => setSortBy("staked")}
            className="font-black uppercase text-white data-[state=active]:bg-green-400 data-[state=active]:text-black"
          >
            MOST STAKED
          </TabsTrigger>
          <TabsTrigger
            value="liked"
            onClick={() => setSortBy("liked")}
            className="font-black uppercase text-white data-[state=active]:bg-red-400 data-[state=active]:text-black"
          >
            MOST LIKED
          </TabsTrigger>
        </TabsList>

        <TabsContent value="staked" className="space-y-4">
          {sortedData.map((meme, index) => (
            <LeaderboardItem key={meme.id} meme={meme} index={index} />
          ))}
        </TabsContent>

        <TabsContent value="liked" className="space-y-4">
          {sortedData.map((meme, index) => (
            <LeaderboardItem key={meme.id} meme={meme} index={index} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
