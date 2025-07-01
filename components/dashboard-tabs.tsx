"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MyMemesTab } from "@/components/dashboard/my-memes-tab"
import { MyStakesTab } from "@/components/dashboard/my-stakes-tab"
import { TransactionHistoryTab } from "@/components/dashboard/transaction-history-tab"
import { myMemes, myStakes, transactions } from "@/data/mock-data"

export function DashboardTabs() {
  return (
    <div className="max-w-6xl mx-auto">
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
          <MyStakesTab stakes={myStakes} />
        </TabsContent>

        <TabsContent value="history">
          <TransactionHistoryTab transactions={transactions.filter(tx => tx.type === "stake" || tx.type === "reward")} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
