"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileImage, Coins, Trophy, History } from "lucide-react"
import { MyMemesTab } from "@/components/dashboard/my-memes-tab"
import { MyStakesTab } from "@/components/dashboard/my-stakes-tab"
import { NFTCollectionTab } from "@/components/dashboard/nft-collection-tab"
// import { HistoryTab } from "@/components/dashboard/history-tab"
import { HistoryTab } from "@/components/dashboard/history-tab"
import { myMemes, myStakes } from "@/data/mock-data"

type TabType = "memes" | "stakes" | "nfts" | "history"

export function DashboardTabs() {
  const [activeTab, setActiveTab] = useState<TabType>("memes")

  // Mock function to handle withdrawals - would call contract in real implementation
  const handleWithdraw = async (stakeId: number) => {
    console.log(`Withdrawing stake ${stakeId}`)
    // await contract.withdrawStake(memeId)
  }

  const tabs = [
    { id: "memes" as TabType, label: "MY MEMES", icon: FileImage },
    { id: "stakes" as TabType, label: "MY STAKES", icon: Coins },
    { id: "nfts" as TabType, label: "MY NFTS", icon: Trophy },
    { id: "history" as TabType, label: "HISTORY", icon: History },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "memes":
        return <MyMemesTab memes={myMemes} />
      case "stakes":
        return (
          <MyStakesTab 
            stakes={myStakes} 
            canWithdraw={true}
            isContestActive={true}
            onWithdraw={handleWithdraw}
          />
        )
      case "nfts":
        return <NFTCollectionTab />
      case "history":
        return <HistoryTab />
      default:
        return <MyMemesTab memes={myMemes} />
    }
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-4 border-4 border-black font-black uppercase text-sm lg:text-base transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-yellow-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-black hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center gap-2">
                <Icon className="h-6 w-6" />
                <span>{tab.label}</span>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderTabContent()}
      </motion.div>
    </div>
  )
}
