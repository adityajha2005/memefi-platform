"use client"

import { useState, useCallback } from "react"
import { useWalletContext } from "@/components/wallet/wallet-provider"
import { TWITTER_ENGAGEMENT_CONTRACT } from "@/lib/contracts"

interface UseTwitterEngagementReturn {
  // Main functions
  requestEngagementMetrics: (memeId: number, tweetId: string) => Promise<string>
  
  // View functions
  getLatestRequestId: () => Promise<string>
  getRequestMemeId: (requestId: string) => Promise<number>
  
  // Admin functions (only for contract owner)
  updateDonId: (newDonId: string) => Promise<string>
  updateSubscriptionId: (newSubscriptionId: number) => Promise<string>
  
  // Loading and error states
  isLoading: boolean
  error: string | null
}

export function useTwitterEngagement(): UseTwitterEngagementReturn {
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
      TWITTER_ENGAGEMENT_CONTRACT.address,
      TWITTER_ENGAGEMENT_CONTRACT.abi,
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
      TWITTER_ENGAGEMENT_CONTRACT.address,
      TWITTER_ENGAGEMENT_CONTRACT.abi,
      provider
    )
  }, [])

  // Request engagement metrics for a meme
  const requestEngagementMetrics = useCallback(async (memeId: number, tweetId: string): Promise<string> => {
    if (!isConnected || !account) {
      throw new Error("Wallet not connected")
    }

    setIsLoading(true)
    setError(null)

    try {
      const contract = await getContract()
      const tx = await contract.requestEngagementMetrics(memeId, tweetId)
      const receipt = await tx.wait()
      
      // Extract request ID from events
      const requestEvent = receipt.logs.find((log: any) => {
        try {
          const parsedLog = contract.interface.parseLog(log)
          return parsedLog?.name === "EngagementRequestSent"
        } catch {
          return false
        }
      })
      
      if (requestEvent) {
        const parsedLog = contract.interface.parseLog(requestEvent)
        return parsedLog?.args?.requestId || receipt.hash
      }
      
      return receipt.hash
    } catch (err: any) {
      setError(err.message || "Failed to request engagement metrics")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [getContract, isConnected, account])

  // Get latest request ID
  const getLatestRequestId = useCallback(async (): Promise<string> => {
    try {
      const contract = await getReadOnlyContract()
      const requestId = await contract.latestRequestId()
      return requestId
    } catch (err: any) {
      console.error("Failed to get latest request ID:", err)
      return "0x0"
    }
  }, [getReadOnlyContract])

  // Get meme ID associated with a request
  const getRequestMemeId = useCallback(async (requestId: string): Promise<number> => {
    try {
      const contract = await getReadOnlyContract()
      const memeId = await contract.requestIdToMemeId(requestId)
      return Number(memeId)
    } catch (err: any) {
      console.error("Failed to get request meme ID:", err)
      return 0
    }
  }, [getReadOnlyContract])

  // Admin function to update DON ID
  const updateDonId = useCallback(async (newDonId: string): Promise<string> => {
    if (!isConnected || !account) {
      throw new Error("Wallet not connected")
    }

    setIsLoading(true)
    setError(null)

    try {
      const contract = await getContract()
      const tx = await contract.updateDonId(newDonId)
      const receipt = await tx.wait()
      return receipt.hash
    } catch (err: any) {
      setError(err.message || "Failed to update DON ID")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [getContract, isConnected, account])

  // Admin function to update subscription ID
  const updateSubscriptionId = useCallback(async (newSubscriptionId: number): Promise<string> => {
    if (!isConnected || !account) {
      throw new Error("Wallet not connected")
    }

    setIsLoading(true)
    setError(null)

    try {
      const contract = await getContract()
      const tx = await contract.updateSubscriptionId(newSubscriptionId)
      const receipt = await tx.wait()
      return receipt.hash
    } catch (err: any) {
      setError(err.message || "Failed to update subscription ID")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [getContract, isConnected, account])

  return {
    // Main functions
    requestEngagementMetrics,
    
    // View functions
    getLatestRequestId,
    getRequestMemeId,
    
    // Admin functions
    updateDonId,
    updateSubscriptionId,
    
    // Loading and error states
    isLoading,
    error,
  }
} 