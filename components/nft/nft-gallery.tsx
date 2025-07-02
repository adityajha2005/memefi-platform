"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { NFTCard } from "./nft-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Trophy, Calendar, Coins } from "lucide-react"
import { useNFTContract } from "@/hooks/use-nft-contract"
import { useWalletContext } from "@/components/wallet/wallet-provider"
import type { WinnerNFT } from "@/types"

interface NFTGalleryProps {
  userAddress?: string
  showUserNFTs?: boolean
  showAllNFTs?: boolean
  contestId?: number
  compact?: boolean
}

type SortOption = "newest" | "oldest" | "highest-stake" | "contest-id"
type FilterOption = "all" | "my-wins" | "recent"

export function NFTGallery({ 
  userAddress, 
  showUserNFTs = true, 
  showAllNFTs = true,
  contestId,
  compact = false 
}: NFTGalleryProps) {
  const [userNFTs, setUserNFTs] = useState<WinnerNFT[]>([])
  const [filteredNFTs, setFilteredNFTs] = useState<WinnerNFT[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [filterBy, setFilterBy] = useState<FilterOption>("all")
  const [isLoading, setIsLoading] = useState(false)
  
  const { getUserNFTs, getContestNFT } = useNFTContract()
  const { account, isConnected } = useWalletContext()

  // Load NFT data
  useEffect(() => {
    const loadNFTs = async () => {
      if (!isConnected || !userAddress) return
      
      setIsLoading(true)
      try {
        if (contestId) {
          const nft = await getContestNFT(contestId)
          if (nft) {
            setFilteredNFTs([nft])
          }
        } else {
          const nfts = await getUserNFTs(userAddress)
          setUserNFTs(nfts)
          setFilteredNFTs(nfts)
        }
      } catch (error) {
        console.error("Failed to load NFTs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadNFTs()
  }, [userAddress, contestId, isConnected, getUserNFTs, getContestNFT])

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-black uppercase mb-2">CONNECT YOUR WALLET</h3>
        <p className="text-gray-600 font-bold">Connect your wallet to view Winner NFTs</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="font-bold">Loading NFTs...</p>
      </div>
    )
  }

  if (filteredNFTs.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-black uppercase mb-2">NO NFTS FOUND</h3>
        <p className="text-gray-600 font-bold">
          {contestId 
            ? "No winner NFT minted for this contest yet."
            : "No winner NFTs to display. Win a contest to earn your first NFT!"
          }
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {!contestId && (
        <div className="text-center">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-2">
            🏆 WINNER NFT COLLECTION
          </h2>
          <p className="text-gray-600 font-bold">
            Exclusive NFTs minted for contest winners
          </p>
        </div>
      )}

      <motion.div
        className={`grid gap-6 ${
          compact 
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        <AnimatePresence>
          {filteredNFTs.map((nft) => (
            <motion.div
              key={nft.tokenId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <NFTCard nft={nft} compact={compact} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
} 