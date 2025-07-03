"use client"

import { useState, useEffect } from "react"
import { Coins, FileImage, Trophy, History, Loader2 } from "lucide-react"
import { MyMemesTab } from "@/components/dashboard/my-memes-tab"
import { MyStakesTab } from "@/components/dashboard/my-stakes-tab"
import { NFTCollectionTab } from "@/components/dashboard/nft-collection-tab"
import { HistoryTab } from "@/components/dashboard/history-tab"
import { useMemeStaking } from "@/hooks/use-meme-staking"
import { useToast } from "@/components/ui/toast-notification"
import { useWalletContext } from "@/components/wallet/wallet-provider"
import type { Meme, Stake } from "@/types"

type TabType = "memes" | "stakes" | "nfts" | "history"

export function DashboardTabs() {
  const [activeTab, setActiveTab] = useState<TabType>("memes")
  const [userMemes, setUserMemes] = useState<Meme[]>([])
  const [userStakes, setUserStakes] = useState<Stake[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  const { 
    withdrawStake, 
    getUserMemes,
    getUserStakedMemes,
    getMeme,
    getUserStake,
    isLoading 
  } = useMemeStaking()
  const { account, isConnected } = useWalletContext()
  const { showToast } = useToast()

  // Load user's memes and stakes
  useEffect(() => {
    const loadUserData = async () => {
      if (!isConnected || !account) {
        setUserMemes([])
        setUserStakes([])
        setIsLoadingData(false)
        return
      }

      setIsLoadingData(true)
      try {
        // Load user's memes
        const memeIds = await getUserMemes(account)
        const memePromises = memeIds.map(id => getMeme(id))
        const memeResults = await Promise.all(memePromises)
        
        const loadedMemes: Meme[] = memeResults
          .filter((meme): meme is NonNullable<typeof meme> => meme !== null)
          .map((meme) => ({
            id: Number(meme.id),
            title: `Meme #${Number(meme.id)}`,
            image: `https://gateway.pinata.cloud/ipfs/${meme.ipfsHash}`,
            creator: {
              name: `${meme.creator.slice(0, 6)}...${meme.creator.slice(-4)}`,
              avatar: "/placeholder-user.jpg"
            },
            bnbStaked: Number(meme.totalStaked) / 1e18,
            uploadDate: new Date(Number(meme.timestamp) * 1000).toLocaleDateString(),
            status: meme.rewardDistributed ? "rewards_distributed" : "active"
          }))

        setUserMemes(loadedMemes)

        // Load user's stakes
        const stakedMemeIds = await getUserStakedMemes(account)
        const stakePromises = stakedMemeIds.map(async (memeId) => {
          const [meme, stakeAmount] = await Promise.all([
            getMeme(memeId),
            getUserStake(memeId, account)
          ])
          
          if (!meme || parseFloat(stakeAmount) === 0) return null
          
          const stake: Stake = {
            id: memeId, // Using meme ID as stake ID for simplicity
            memeId,
            memeTitle: `Meme #${memeId}`,
            image: `https://gateway.pinata.cloud/ipfs/${meme.ipfsHash}`,
            creator: `${meme.creator.slice(0, 6)}...${meme.creator.slice(-4)}`,
            stakeAmount: parseFloat(stakeAmount),
            currentValue: parseFloat(stakeAmount), // For now, assuming no change
            profit: 0, // Would need to calculate based on rewards
            stakeDate: new Date(Number(meme.timestamp) * 1000).toLocaleDateString()
          }
          
          return stake
        })

        const stakeResults = await Promise.all(stakePromises)
        const loadedStakes = stakeResults.filter((stake): stake is Stake => stake !== null)
        
        setUserStakes(loadedStakes)

      } catch (err) {
        console.error("Failed to load user data:", err)
        showToast("Failed to load your data from blockchain", "error")
      } finally {
        setIsLoadingData(false)
      }
    }

    loadUserData()
  }, [account, isConnected, getUserMemes, getUserStakedMemes, getMeme, getUserStake, showToast])

  // Handle stake withdrawal with real contract interaction
  const handleWithdraw = async (stakeId: number) => {
    if (!isConnected || !account) {
      showToast("Please connect your wallet to withdraw stake!", "error")
      return
    }

    try {
      showToast("Processing withdrawal...", "info")
      
      // Find the stake to get the meme ID
      const stake = userStakes.find(s => s.id === stakeId)
      if (!stake) {
        throw new Error("Stake not found")
      }

      const txHash = await withdrawStake(stake.memeId)
      
      showToast(`Successfully withdrew ${stake.stakeAmount} BNB!`, "success")
      
      // Remove the stake from the list
      setUserStakes(prev => prev.filter(s => s.id !== stakeId))
      
    } catch (err: any) {
      console.error("Withdrawal failed:", err)
      showToast(err.message || "Failed to withdraw stake. Please try again.", "error")
    }
  }

  const tabs = [
    { id: "memes" as TabType, label: "MY MEMES", icon: FileImage },
    { id: "stakes" as TabType, label: "MY STAKES", icon: Coins },
    { id: "nfts" as TabType, label: "MY NFTS", icon: Trophy },
    { id: "history" as TabType, label: "HISTORY", icon: History },
  ]

  const renderTabContent = () => {
    if (isLoadingData) {
      return (
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-yellow-400" />
          <h3 className="text-xl font-black uppercase mb-2">Loading Your Data</h3>
          <p className="text-gray-400 font-bold">Fetching from blockchain...</p>
        </div>
      )
    }

    if (!isConnected) {
      return (
        <div className="text-center py-12">
          <h3 className="text-xl font-black uppercase mb-2">Connect Wallet</h3>
          <p className="text-gray-400 font-bold">Connect your wallet to view your dashboard</p>
        </div>
      )
    }

    switch (activeTab) {
      case "memes":
        return <MyMemesTab memes={userMemes} />
      case "stakes":
        return (
          <MyStakesTab 
            stakes={userStakes} 
            canWithdraw={true}
            isContestActive={true}
            onWithdraw={handleWithdraw}
            isLoading={isLoading}
          />
        )
      case "nfts":
        return <NFTCollectionTab />
      case "history":
        return <HistoryTab />
      default:
        return <MyMemesTab memes={userMemes} />
    }
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-black uppercase tracking-wide transition-all border-4 ${
                activeTab === tab.id
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-black hover:bg-gray-100"
              }`}
            >
              <Icon className="h-5 w-5" />
              {tab.label}
              {tab.id === "memes" && userMemes.length > 0 && (
                <span className="ml-2 bg-yellow-400 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-black">
                  {userMemes.length}
                </span>
              )}
              {tab.id === "stakes" && userStakes.length > 0 && (
                <span className="ml-2 bg-yellow-400 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-black">
                  {userStakes.length}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>
    </div>
  )
}
