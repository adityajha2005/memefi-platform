"use client"

import { useState, useCallback } from "react"
import { useWalletContext } from "@/components/wallet/wallet-provider"
import { MEME_STAKING_CONTRACT, type MemeData, type ContestData } from "@/lib/contracts"
import type { Address } from "viem"

interface UseMemeStakingReturn {
  // Contest functions
  getCurrentContest: () => Promise<ContestData | null>
  getContestWinner: (contestId: number) => Promise<number>
  endContest: () => Promise<string>
  
  // Meme functions
  submitMeme: (ipfsHash: string, tweetId: string) => Promise<string>
  getMeme: (memeId: number) => Promise<MemeData | null>
  getUserMemes: (userAddress: string) => Promise<number[]>
  isMemeStakeable: (memeId: number) => Promise<boolean>
  getMemeStakeableTime: (memeId: number) => Promise<number>
  getMemeStakers: (memeId: number) => Promise<string[]>
  
  // Staking functions
  stakeMeme: (memeId: number, amount: string) => Promise<string>
  getUserStake: (memeId: number, userAddress: string) => Promise<string>
  getUserStakedMemes: (userAddress: string) => Promise<number[]>
  withdrawStake: (memeId: number) => Promise<string>
  
  // Reward functions
  distributeRewardsBatch: (memeId: number) => Promise<string>
  
  // View functions
  hasUserSubmittedInCurrentContest: (userAddress: string) => Promise<boolean>
  hasUserSubmittedInContest: (contestId: number, userAddress: string) => Promise<boolean>
  
  // Admin functions (only for contract owner)
  updateEngagementScore: (memeId: number, score: number) => Promise<string>
  setMinStakeAmount: (amount: string) => Promise<string>
  setContestDuration: (duration: number) => Promise<string>
  
  // Platform settings
  getMinStakeAmount: () => Promise<string>
  getContestDuration: () => Promise<number>
  getCurrentContestId: () => Promise<number>
  getNextMemeId: () => Promise<number>
  
  // Loading and error states
  isLoading: boolean
  error: string | null
}

export function useMemeStaking(): UseMemeStakingReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { account, isConnected } = useWalletContext()

  const getContract = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask not available")
    }

    const { ethers } = await import("ethers")
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    
    return new ethers.Contract(
      MEME_STAKING_CONTRACT.address,
      MEME_STAKING_CONTRACT.abi,
      signer
    )
  }, [])

  const getReadOnlyContract = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask not available")
    }

    const { ethers } = await import("ethers")
    const provider = new ethers.BrowserProvider(window.ethereum)
    
    return new ethers.Contract(
      MEME_STAKING_CONTRACT.address,
      MEME_STAKING_CONTRACT.abi,
      provider
    )
  }, [])

  // Contest functions
  const getCurrentContest = useCallback(async (): Promise<ContestData | null> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const contract = await getReadOnlyContract()
      const result = await contract.getCurrentContest()
      
      return {
        contestId: BigInt(result.id.toString()),
        startTime: BigInt(result.startTime.toString()),
        endTime: BigInt(result.endTime.toString()),
        ended: result.ended,
        memeIds: result.memeIds.map((id: any) => BigInt(id.toString())),
        winningMemeId: BigInt(0), // Not available in current contest
        totalPrizePool: BigInt(0), // Would need to calculate
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch current contest")
      return null
    } finally {
      setIsLoading(false)
    }
  }, [getReadOnlyContract])

  const getContestWinner = useCallback(async (contestId: number): Promise<number> => {
    try {
      const contract = await getReadOnlyContract()
      const winnerMemeId = await contract.getContestWinner(contestId)
      return Number(winnerMemeId)
    } catch (err: any) {
      console.error("Failed to get contest winner:", err)
      return 0
    }
  }, [getReadOnlyContract])

  const endContest = useCallback(async (): Promise<string> => {
    if (!isConnected || !account) {
      throw new Error("Wallet not connected")
    }

    setIsLoading(true)
    setError(null)

    try {
      const contract = await getContract()
      const tx = await contract.endContest()
      const receipt = await tx.wait()
      return receipt.hash
    } catch (err: any) {
      setError(err.message || "Failed to end contest")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [getContract, isConnected, account])

  // Meme functions
  const submitMeme = useCallback(async (ipfsHash: string, tweetId: string): Promise<string> => {
    if (!isConnected || !account) {
      throw new Error("Wallet not connected")
    }

    setIsLoading(true)
    setError(null)

    try {
      const contract = await getContract()
      const tx = await contract.submitMeme(ipfsHash, tweetId)
      const receipt = await tx.wait()
      
      // Extract meme ID from events
      const submitEvent = receipt.logs.find((log: any) => {
        try {
          const parsedLog = contract.interface.parseLog(log)
          return parsedLog?.name === "MemeSubmitted"
        } catch {
          return false
        }
      })
      
      if (submitEvent) {
        const parsedLog = contract.interface.parseLog(submitEvent)
        return parsedLog?.args?.memeId?.toString() || receipt.hash
      }
      
      return receipt.hash
    } catch (err: any) {
      setError(err.message || "Failed to submit meme")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [getContract, isConnected, account])

  const getMeme = useCallback(async (memeId: number): Promise<MemeData | null> => {
    try {
      const contract = await getReadOnlyContract()
      const result = await contract.memes(memeId)
      
      return {
        id: BigInt(result.id.toString()),
        creator: result.creator as Address,
        totalStaked: BigInt(result.totalStaked.toString()),
        timestamp: BigInt(result.timestamp.toString()),
        ipfsHash: result.ipfsHash,
        exists: result.exists,
        rewardDistributed: result.rewardDistributed,
        engagementScore: BigInt(result.engagementScore.toString()),
        tweetId: result.tweetId,
      }
    } catch (err: any) {
      console.error("Failed to get meme:", err)
      return null
    }
  }, [getReadOnlyContract])

  const getUserMemes = useCallback(async (userAddress: string): Promise<number[]> => {
    try {
      const contract = await getReadOnlyContract()
      const memeIds = await contract.getUserMemes(userAddress)
      return memeIds.map((id: any) => Number(id))
    } catch (err: any) {
      console.error("Failed to get user memes:", err)
      return []
    }
  }, [getReadOnlyContract])

  const isMemeStakeable = useCallback(async (memeId: number): Promise<boolean> => {
    try {
      const contract = await getReadOnlyContract()
      return await contract.isMemeStakeable(memeId)
    } catch (err: any) {
      console.error("Failed to check if meme is stakeable:", err)
      return false
    }
  }, [getReadOnlyContract])

  const getMemeStakeableTime = useCallback(async (memeId: number): Promise<number> => {
    try {
      const contract = await getReadOnlyContract()
      const time = await contract.getMemeStakeableTime(memeId)
      return Number(time)
    } catch (err: any) {
      console.error("Failed to get meme stakeable time:", err)
      return 0
    }
  }, [getReadOnlyContract])

  const getMemeStakers = useCallback(async (memeId: number): Promise<string[]> => {
    try {
      const contract = await getReadOnlyContract()
      return await contract.getMemeStakers(memeId)
    } catch (err: any) {
      console.error("Failed to get meme stakers:", err)
      return []
    }
  }, [getReadOnlyContract])

  // Staking functions
  const stakeMeme = useCallback(async (memeId: number, amount: string): Promise<string> => {
    if (!isConnected || !account) {
      throw new Error("Wallet not connected")
    }

    setIsLoading(true)
    setError(null)

    try {
      const { ethers } = await import("ethers")
      const contract = await getContract()
      
      const tx = await contract.stakeMeme(memeId, {
        value: ethers.parseEther(amount)
      })
      
      const receipt = await tx.wait()
      return receipt.hash
    } catch (err: any) {
      setError(err.message || "Failed to stake on meme")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [getContract, isConnected, account])

  const getUserStake = useCallback(async (memeId: number, userAddress: string): Promise<string> => {
    try {
      const { ethers } = await import("ethers")
      const contract = await getReadOnlyContract()
      const stake = await contract.getUserStake(memeId, userAddress)
      return ethers.formatEther(stake)
    } catch (err: any) {
      console.error("Failed to get user stake:", err)
      return "0"
    }
  }, [getReadOnlyContract])

  const getUserStakedMemes = useCallback(async (userAddress: string): Promise<number[]> => {
    try {
      const contract = await getReadOnlyContract()
      const memeIds = await contract.getUserStakedMemes(userAddress)
      return memeIds.map((id: any) => Number(id))
    } catch (err: any) {
      console.error("Failed to get user staked memes:", err)
      return []
    }
  }, [getReadOnlyContract])

  const withdrawStake = useCallback(async (memeId: number): Promise<string> => {
    if (!isConnected || !account) {
      throw new Error("Wallet not connected")
    }

    setIsLoading(true)
    setError(null)

    try {
      const contract = await getContract()
      const tx = await contract.withdrawStake(memeId)
      const receipt = await tx.wait()
      return receipt.hash
    } catch (err: any) {
      setError(err.message || "Failed to withdraw stake")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [getContract, isConnected, account])

  // Reward functions
  const distributeRewardsBatch = useCallback(async (memeId: number): Promise<string> => {
    if (!isConnected || !account) {
      throw new Error("Wallet not connected")
    }

    setIsLoading(true)
    setError(null)

    try {
      const contract = await getContract()
      const tx = await contract.distributeRewardsBatch(memeId)
      const receipt = await tx.wait()
      return receipt.hash
    } catch (err: any) {
      setError(err.message || "Failed to distribute rewards")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [getContract, isConnected, account])

  // View functions
  const hasUserSubmittedInCurrentContest = useCallback(async (userAddress: string): Promise<boolean> => {
    try {
      const contract = await getReadOnlyContract()
      return await contract.hasUserSubmittedInCurrentContest(userAddress)
    } catch (err: any) {
      console.error("Failed to check user submission status:", err)
      return false
    }
  }, [getReadOnlyContract])

  const hasUserSubmittedInContest = useCallback(async (contestId: number, userAddress: string): Promise<boolean> => {
    try {
      const contract = await getReadOnlyContract()
      return await contract.hasUserSubmittedInContest(contestId, userAddress)
    } catch (err: any) {
      console.error("Failed to check user submission status for contest:", err)
      return false
    }
  }, [getReadOnlyContract])

  // Admin functions
  const updateEngagementScore = useCallback(async (memeId: number, score: number): Promise<string> => {
    if (!isConnected || !account) {
      throw new Error("Wallet not connected")
    }

    setIsLoading(true)
    setError(null)

    try {
      const contract = await getContract()
      const tx = await contract.updateEngagementScore(memeId, score)
      const receipt = await tx.wait()
      return receipt.hash
    } catch (err: any) {
      setError(err.message || "Failed to update engagement score")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [getContract, isConnected, account])

  const setMinStakeAmount = useCallback(async (amount: string): Promise<string> => {
    if (!isConnected || !account) {
      throw new Error("Wallet not connected")
    }

    setIsLoading(true)
    setError(null)

    try {
      const { ethers } = await import("ethers")
      const contract = await getContract()
      const tx = await contract.setMinStakeAmount(ethers.parseEther(amount))
      const receipt = await tx.wait()
      return receipt.hash
    } catch (err: any) {
      setError(err.message || "Failed to set minimum stake amount")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [getContract, isConnected, account])

  const setContestDuration = useCallback(async (duration: number): Promise<string> => {
    if (!isConnected || !account) {
      throw new Error("Wallet not connected")
    }

    setIsLoading(true)
    setError(null)

    try {
      const contract = await getContract()
      const tx = await contract.setContestDuration(duration)
      const receipt = await tx.wait()
      return receipt.hash
    } catch (err: any) {
      setError(err.message || "Failed to set contest duration")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [getContract, isConnected, account])

  // Platform settings
  const getMinStakeAmount = useCallback(async (): Promise<string> => {
    try {
      const { ethers } = await import("ethers")
      const contract = await getReadOnlyContract()
      const amount = await contract.minStakeAmount()
      return ethers.formatEther(amount)
    } catch (err: any) {
      console.error("Failed to get minimum stake amount:", err)
      return "0.001" // fallback
    }
  }, [getReadOnlyContract])

  const getContestDuration = useCallback(async (): Promise<number> => {
    try {
      const contract = await getReadOnlyContract()
      const duration = await contract.contestDuration()
      return Number(duration)
    } catch (err: any) {
      console.error("Failed to get contest duration:", err)
      return 86400 // fallback to 24 hours
    }
  }, [getReadOnlyContract])

  const getCurrentContestId = useCallback(async (): Promise<number> => {
    try {
      const contract = await getReadOnlyContract()
      const contestId = await contract.currentContestId()
      return Number(contestId)
    } catch (err: any) {
      console.error("Failed to get current contest ID:", err)
      return 0
    }
  }, [getReadOnlyContract])

  const getNextMemeId = useCallback(async (): Promise<number> => {
    try {
      const contract = await getReadOnlyContract()
      const memeId = await contract.nextMemeId()
      return Number(memeId)
    } catch (err: any) {
      console.error("Failed to get next meme ID:", err)
      return 0
    }
  }, [getReadOnlyContract])

  return {
    // Contest functions
    getCurrentContest,
    getContestWinner,
    endContest,
    
    // Meme functions
    submitMeme,
    getMeme,
    getUserMemes,
    isMemeStakeable,
    getMemeStakeableTime,
    getMemeStakers,
    
    // Staking functions
    stakeMeme,
    getUserStake,
    getUserStakedMemes,
    withdrawStake,
    
    // Reward functions
    distributeRewardsBatch,
    
    // View functions
    hasUserSubmittedInCurrentContest,
    hasUserSubmittedInContest,
    
    // Admin functions
    updateEngagementScore,
    setMinStakeAmount,
    setContestDuration,
    
    // Platform settings
    getMinStakeAmount,
    getContestDuration,
    getCurrentContestId,
    getNextMemeId,
    
    // Loading and error states
    isLoading,
    error,
  }
} 