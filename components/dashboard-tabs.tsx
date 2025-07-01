"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MyMemesTab } from "@/components/dashboard/my-memes-tab"
import { MyStakesTab } from "@/components/dashboard/my-stakes-tab"
import { TransactionHistoryTab } from "@/components/dashboard/transaction-history-tab"
import { ContestBanner } from "@/components/contest/contest-banner"
import { myMemes, myStakes, transactions } from "@/data/mock-data"

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

export function DashboardTabs() {
  // Mock function to handle withdrawals - would call contract in real implementation
  const handleWithdraw = async (stakeId: number) => {
    console.log(`Withdrawing stake ${stakeId}`)
    // await contract.withdrawStake(memeId)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <ContestBanner contest={mockContest} />
      
      <Tabs defaultValue="memes" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8 bg-black border-4 border-black">
          <TabsTrigger
            value="memes"
            className="font-black uppercase text-white data-[state=active]:bg-green-400 data-[state=active]:text-black"
          >
            MY MEMES
          </TabsTrigger>
          <TabsTrigger
            value="stakes"
            className="font-black uppercase text-white data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
          >
            MY STAKES
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="font-black uppercase text-white data-[state=active]:bg-red-400 data-[state=active]:text-black"
          >
            HISTORY
          </TabsTrigger>
        </TabsList>

        <TabsContent value="memes">
          <MyMemesTab memes={myMemes} />
        </TabsContent>

        <TabsContent value="stakes">
          <MyStakesTab 
            stakes={myStakes} 
            canWithdraw={true} // This would be determined by contest status and timing
            isContestActive={mockContest.isActive}
            onWithdraw={handleWithdraw}
          />
        </TabsContent>

        <TabsContent value="history">
          <TransactionHistoryTab transactions={transactions.filter(tx => tx.type === "stake" || tx.type === "reward")} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
