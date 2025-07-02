"use client"

import { useState, useCallback } from "react"
import { useWalletContext } from "@/components/wallet/wallet-provider"
import type { WinnerNFT, NFTMetadata } from "@/types"

const MEME_NFT_ABI = [
  "function mintWinnerNFT(address winner, uint64 contestId, uint64 memeId, string calldata originalMemeHash, uint256 totalStaked) external returns (uint256)",
  "function getWinnerInfo(uint256 tokenId) external view returns (tuple(address winner, uint96 totalStaked, uint64 contestId, uint64 memeId, uint64 timestamp, string originalMemeHash))",
  "function balanceOf(address owner) external view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)",
  "function tokenURI(uint256 tokenId) external view returns (string)",
  "function totalSupply() external view returns (uint256)",
  "function nextTokenId() external view returns (uint256)",
  "function hasNFT(uint64 memeId) external view returns (bool)",
  "function getTokenForContest(uint64 contestId) external view returns (uint256)",
  "function emergencyMint(address winner, uint64 contestId, uint64 memeId, string calldata originalMemeHash, uint256 totalStaked, string calldata reason) external returns (uint256)"
]

const MEME_NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MEME_NFT_CONTRACT || "0x..."

interface UseNFTContractReturn {
  getUserNFTs: (userAddress: string) => Promise<WinnerNFT[]>
  getNFTMetadata: (tokenId: number) => Promise<NFTMetadata | null>
  getContestNFT: (contestId: number) => Promise<WinnerNFT | null>
  getMemeNFTStatus: (memeId: number) => Promise<boolean>
  getTotalSupply: () => Promise<number>
  
  //(admin only)
  mintWinnerNFT: (winner: string, contestId: number, memeId: number, originalMemeHash: string, totalStaked: string) => Promise<string>
  emergencyMint: (winner: string, contestId: number, memeId: number, originalMemeHash: string, totalStaked: string, reason: string) => Promise<string>
  
  isLoading: boolean
  error: string | null
}

export function useNFTContract(): UseNFTContractReturn {
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
    
    return new ethers.Contract(MEME_NFT_CONTRACT_ADDRESS, MEME_NFT_ABI, signer)
  }, [])

  // Get all NFTs owned by a user
  const getUserNFTs = useCallback(async (userAddress: string): Promise<WinnerNFT[]> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const contract = await getContract()
      const balance = await contract.balanceOf(userAddress)
      const nfts: WinnerNFT[] = []

      for (let i = 0; i < balance; i++) {
        try {
          const tokenId = await contract.tokenOfOwnerByIndex(userAddress, i)
          const winnerInfo = await contract.getWinnerInfo(tokenId)
          
          nfts.push({
            tokenId: tokenId.toString(),
            winner: winnerInfo.winner,
            totalStaked: winnerInfo.totalStaked.toString(),
            contestId: Number(winnerInfo.contestId),
            memeId: Number(winnerInfo.memeId),
            timestamp: Number(winnerInfo.timestamp),
            originalMemeHash: winnerInfo.originalMemeHash
          })
        } catch (err) {
          console.warn(`Failed to get NFT at index ${i}:`, err)
        }
      }

      return nfts
    } catch (err: any) {
      setError(err.message || "Failed to fetch user NFTs")
      return []
    } finally {
      setIsLoading(false)
    }
  }, [getContract])

  const getNFTMetadata = useCallback(async (tokenId: number): Promise<NFTMetadata | null> => {
    try {
      const contract = await getContract()
      const tokenURI = await contract.tokenURI(tokenId)
      
      if (tokenURI.startsWith("ipfs://")) {
        const ipfsHash = tokenURI.replace("ipfs://", "")
        const httpUrl = `https://ipfs.io/ipfs/${ipfsHash}`
        
        const response = await fetch(httpUrl)
        if (response.ok) {
          return await response.json()
        }
      } else if (tokenURI.startsWith("http")) {
        const response = await fetch(tokenURI)
        if (response.ok) {
          return await response.json()
        }
      }
      
      return null
    } catch (err: any) {
      console.error("Failed to fetch NFT metadata:", err)
      return null
    }
  }, [getContract])

  const getContestNFT = useCallback(async (contestId: number): Promise<WinnerNFT | null> => {
    try {
      const contract = await getContract()
      const tokenId = await contract.getTokenForContest(contestId)
      
      if (tokenId.toString() === "0") {
        return null 
      }
      
      const winnerInfo = await contract.getWinnerInfo(tokenId)
      
      return {
        tokenId: tokenId.toString(),
        winner: winnerInfo.winner,
        totalStaked: winnerInfo.totalStaked.toString(),
        contestId: Number(winnerInfo.contestId),
        memeId: Number(winnerInfo.memeId),
        timestamp: Number(winnerInfo.timestamp),
        originalMemeHash: winnerInfo.originalMemeHash
      }
    } catch (err: any) {
      console.error("Failed to fetch contest NFT:", err)
      return null
    }
  }, [getContract])

  const getMemeNFTStatus = useCallback(async (memeId: number): Promise<boolean> => {
    try {
      const contract = await getContract()
      return await contract.hasNFT(memeId)
    } catch (err: any) {
      console.error("Failed to check meme NFT status:", err)
      return false
    }
  }, [getContract])

  const getTotalSupply = useCallback(async (): Promise<number> => {
    try {
      const contract = await getContract()
      const supply = await contract.totalSupply()
      return Number(supply)
    } catch (err: any) {
      console.error("Failed to get total supply:", err)
      return 0
    }
  }, [getContract])

  const mintWinnerNFT = useCallback(async (
    winner: string,
    contestId: number,
    memeId: number,
    originalMemeHash: string,
    totalStaked: string
  ): Promise<string> => {
    if (!isConnected || !account) {
      throw new Error("Wallet not connected")
    }

    setIsLoading(true)
    setError(null)

    try {
      const contract = await getContract()
      const { ethers } = await import("ethers")
      
      const tx = await contract.mintWinnerNFT(
        winner,
        contestId,
        memeId,
        originalMemeHash,
        ethers.parseEther(totalStaked)
      )
      
      const receipt = await tx.wait()
      
      const mintEvent = receipt.logs.find((log: any) => 
        log.topics[0] === ethers.id("WinnerNFTMinted(uint256,uint64,uint64,address,uint256)")
      )
      
      if (mintEvent) {
        const tokenId = ethers.getNumber(mintEvent.topics[1])
        return tokenId.toString()
      }
      
      throw new Error("Failed to extract token ID from transaction")
    } catch (err: any) {
      setError(err.message || "Failed to mint winner NFT")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [getContract, isConnected, account])

  const emergencyMint = useCallback(async (
    winner: string,
    contestId: number,
    memeId: number,
    originalMemeHash: string,
    totalStaked: string,
    reason: string
  ): Promise<string> => {
    if (!isConnected || !account) {
      throw new Error("Wallet not connected")
    }

    setIsLoading(true)
    setError(null)

    try {
      const contract = await getContract()
      const { ethers } = await import("ethers")
      
      const tx = await contract.emergencyMint(
        winner,
        contestId,
        memeId,
        originalMemeHash,
        ethers.parseEther(totalStaked),
        reason
      )
      
      const receipt = await tx.wait()
      
      const mintEvent = receipt.logs.find((log: any) => 
        log.topics[0] === ethers.id("EmergencyMint(uint256,address,string)")
      )
      
      if (mintEvent) {
        const tokenId = ethers.getNumber(mintEvent.topics[1])
        return tokenId.toString()
      }
      
      throw new Error("Failed to extract token ID from transaction")
    } catch (err: any) {
      setError(err.message || "Failed to emergency mint NFT")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [getContract, isConnected, account])

  return {
    getUserNFTs,
    getNFTMetadata,
    getContestNFT,
    getMemeNFTStatus,
    getTotalSupply,
    mintWinnerNFT,
    emergencyMint,
    isLoading,
    error
  }
} 