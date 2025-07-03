"use client"

import { MemeCard } from "@/components/ui/meme-card"
import { CustomButton } from "@/components/ui/custom-button"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/toast-notification"
import { useMemeStaking } from "@/hooks/use-meme-staking"
import { useWalletContext } from "@/components/wallet/wallet-provider"
import { Loader2, ImageOff } from "lucide-react"
import type { Meme } from "@/types"

export function MemeGridSection() {
  const [memes, setMemes] = useState<Meme[]>([])
  const [visibleMemes, setVisibleMemes] = useState(6)
  const [isLoadingMemes, setIsLoadingMemes] = useState(true)
  const [memeStakeInfo, setMemeStakeInfo] = useState<Record<number, {
    isStakeable: boolean
    stakeDelay: number
    userHasStaked: boolean
    userStakeAmount: number
  }>>({})

  const { showToast } = useToast()
  const { 
    stakeMeme, 
    isMemeStakeable, 
    getMemeStakeableTime, 
    getUserStake,
    getMeme,
    getNextMemeId,
    getCurrentContest,
    isLoading,
    error 
  } = useMemeStaking()
  const { account, isConnected } = useWalletContext()

  // Load real memes from blockchain
  useEffect(() => {
    const loadMemes = async () => {
      setIsLoadingMemes(true)
      try {
        // Get the total number of memes
        const nextMemeId = await getNextMemeId()
        const totalMemes = Math.max(0, nextMemeId - 1)

        if (totalMemes === 0) {
          setMemes([])
          return
        }

        // Load memes in reverse order (newest first)
        const memePromises = []
        for (let i = totalMemes; i >= 1; i--) {
          memePromises.push(getMeme(i))
        }

        const memeResults = await Promise.all(memePromises)
        
        // Filter out null results and convert to Meme format
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
            twitterLikes: Number(meme.engagementScore),
            uploadDate: new Date(Number(meme.timestamp) * 1000).toLocaleDateString(),
            status: meme.rewardDistributed ? "rewards_distributed" : "active"
          }))

        setMemes(loadedMemes)
      } catch (err) {
        console.error("Failed to load memes:", err)
        showToast("Failed to load memes from blockchain", "error")
        setMemes([])
      } finally {
        setIsLoadingMemes(false)
      }
    }

    loadMemes()
  }, [getNextMemeId, getMeme, showToast])

  // Load stake information for visible memes
  useEffect(() => {
    const loadStakeInfo = async () => {
      if (!account || memes.length === 0) return

      const info: Record<number, any> = {}
      
      for (const meme of memes.slice(0, visibleMemes)) {
        try {
          const [isStakeable, stakeableTime, userStake] = await Promise.all([
            isMemeStakeable(meme.id),
            getMemeStakeableTime(meme.id),
            getUserStake(meme.id, account)
          ])

          const currentTime = Math.floor(Date.now() / 1000)
          const stakeDelay = Math.max(0, stakeableTime - currentTime)
          
          info[meme.id] = {
            isStakeable: isStakeable && stakeDelay === 0,
            stakeDelay,
            userHasStaked: parseFloat(userStake) > 0,
            userStakeAmount: parseFloat(userStake)
          }
        } catch (err) {
          console.error(`Failed to load stake info for meme ${meme.id}:`, err)
          info[meme.id] = {
            isStakeable: true,
            stakeDelay: 0,
            userHasStaked: false,
            userStakeAmount: 0
          }
        }
      }

      setMemeStakeInfo(info)
    }

    if (isConnected && account && memes.length > 0) {
      loadStakeInfo()
    }
  }, [account, isConnected, visibleMemes, memes, isMemeStakeable, getMemeStakeableTime, getUserStake])

  // Add a function to refresh stake info for a specific meme
  const refreshStakeInfo = async (memeId: number) => {
    if (!account || !isConnected) return

    try {
      const [isStakeable, stakeableTime, userStake] = await Promise.all([
        isMemeStakeable(memeId),
        getMemeStakeableTime(memeId),
        getUserStake(memeId, account)
      ])

      const currentTime = Math.floor(Date.now() / 1000)
      const stakeDelay = Math.max(0, stakeableTime - currentTime)
      
      setMemeStakeInfo(prev => ({
        ...prev,
        [memeId]: {
          isStakeable: isStakeable && stakeDelay === 0,
          stakeDelay,
          userHasStaked: parseFloat(userStake) > 0,
          userStakeAmount: parseFloat(userStake)
        }
      }))
    } catch (err) {
      console.error(`Failed to refresh stake info for meme ${memeId}:`, err)
    }
  }

  const handleStake = async (memeId: number, amount: string) => {
    if (!isConnected || !account) {
      showToast("Please connect your wallet to stake!", "error")
      return
    }

    try {
      showToast("Processing stake transaction...", "info")
      
      const txHash = await stakeMeme(memeId, amount)
      
      showToast(`Successfully staked ${amount} BNB on meme!`, "success")
      
      // Refresh meme data and stake info
      try {
        const [updatedMeme] = await Promise.all([
          getMeme(memeId),
          refreshStakeInfo(memeId)  // Add this call
        ])
        
        if (updatedMeme) {
          setMemes(prev => prev.map(meme => 
            meme.id === memeId 
              ? { ...meme, bnbStaked: Number(updatedMeme.totalStaked) / 1e18 }
              : meme
          ))
        }
      } catch (refreshError) {
        console.error("Failed to refresh stake info:", refreshError)
      }
      
    } catch (err: any) {
      console.error("Staking failed:", err)
      showToast(err.message || "Failed to stake. Please try again.", "error")
    }
  }

  // Get meme stake info (real data or fallback)
  const getMemeStakeInfo = (memeId: number) => {
    if (memeStakeInfo[memeId]) {
      return memeStakeInfo[memeId]
    }
    
    return {
      isStakeable: false,
      stakeDelay: 30,
      userHasStaked: false,
      userStakeAmount: 0
    }
  }

  const loadMore = () => {
    setVisibleMemes((prev) => prev + 6)
  }

  // Loading state
  if (isLoadingMemes) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 animate-spin text-yellow-400 mb-4" />
        <p className="text-lg font-bold text-gray-600">Loading memes...</p>
      </div>
    )
  }

  // No memes state
  if (memes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ImageOff className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-2xl font-black text-gray-800 mb-2">No Memes Yet</h3>
        <p className="text-gray-600 mb-6">Be the first to upload a meme and start the competition!</p>
        <CustomButton href="/upload" variant="primary">Upload a Meme</CustomButton>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memes.slice(0, visibleMemes).map((meme) => (
          <MemeCard
            key={meme.id}
            meme={meme}
            onStake={handleStake}
            stakeInfo={getMemeStakeInfo(meme.id)}
          />
        ))}
      </div>

      {visibleMemes < memes.length && (
        <div className="flex justify-center mt-8">
          <CustomButton onClick={loadMore} variant="secondary">
            Load More Memes
          </CustomButton>
        </div>
      )}
    </div>
  )
}
