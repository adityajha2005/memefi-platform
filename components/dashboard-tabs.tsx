"use client"

import { useState, useEffect } from "react"
import { Coins, FileImage, Trophy, Loader2 } from "lucide-react"
import { MyMemesTab } from "@/components/dashboard/my-memes-tab"
import { MyStakesTab } from "@/components/dashboard/my-stakes-tab"
import { NFTCollectionTab } from "@/components/dashboard/nft-collection-tab"
import { useMemeStaking } from "@/hooks/use-meme-staking"
import { useToast } from "@/components/ui/toast-notification"
import { useWalletContext } from "@/components/wallet/wallet-provider"
import type { Meme, Stake } from "@/types"

type TabType = "memes" | "stakes" | "nfts"

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
    { 
      id: "memes" as TabType, 
      label: "MY MEMES", 
      icon: FileImage,
      count: userMemes.length
    },
    { 
      id: "stakes" as TabType, 
      label: "MY STAKES", 
      icon: Coins,
      count: userStakes.length
    },
    { 
      id: "nfts" as TabType, 
      label: "MY NFTS", 
      icon: Trophy,
      count: 0
    }
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
      default:
        return <MyMemesTab memes={userMemes} />
    }
  }

  return (
    <div className="space-y-8">
      {/* Coming Soon Banner */}
      <div className="bg-black text-white p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-yellow-400 text-black px-3 py-1 font-black text-sm uppercase">Coming Soon</span>
          <span>🚀</span>
        </div>
        <p className="text-gray-400 uppercase text-sm">
          Track your meme's performance with Twitter engagement metrics, earn rewards, and compete for the top spot on the leaderboard.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center gap-3 px-6 py-4 font-black text-lg uppercase tracking-wide transition-all ${
                isActive
                  ? "bg-black text-white"
                  : "bg-white text-black border-2 border-black hover:bg-gray-50"
              }`}
            >
              <Icon className="h-6 w-6" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`ml-auto rounded-full w-8 h-8 flex items-center justify-center text-sm font-black ${
                  isActive ? "bg-yellow-400 text-black" : "bg-black text-white"
                }`}>
                  {tab.count}
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
