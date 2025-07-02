"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Calendar, Coins, Hash, ExternalLink, Eye } from "lucide-react"
import { useNFTContract } from "@/hooks/use-nft-contract"
import type { WinnerNFT, NFTMetadata } from "@/types"

interface NFTCardProps {
  nft: WinnerNFT
  showActions?: boolean
  compact?: boolean
}

export function NFTCard({ nft, showActions = true, compact = false }: NFTCardProps) {
  const [metadata, setMetadata] = useState<NFTMetadata | null>(null)
  const [imageError, setImageError] = useState(false)
  const { getNFTMetadata } = useNFTContract()

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const meta = await getNFTMetadata(Number(nft.tokenId))
        setMetadata(meta)
      } catch (error) {
        console.error("Failed to load NFT metadata:", error)
      }
    }

    loadMetadata()
  }, [nft.tokenId, getNFTMetadata])

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString()
  }

  const formatStakeAmount = (amount: string) => {
    try {
      const value = parseFloat(amount) / 1e18 
      return `${value.toFixed(3)} BNB`
    } catch {
      return "0 BNB"
    }
  }

  const handleViewOnExplorer = () => {
    const explorerUrl = `https://bscscan.com/token/${process.env.NEXT_PUBLIC_MEME_NFT_CONTRACT}?a=${nft.tokenId}`
    window.open(explorerUrl, "_blank")
  }

  const cardContent = (
    <>
              <div className={`relative ${compact ? "h-40" : "h-60"} bg-white`}>
        {metadata?.image && !imageError ? (
          <Image
            src={metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")}
            alt={metadata.name || `Winner NFT #${nft.tokenId}`}
            fill
            className="object-cover rounded-t-lg"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Trophy className="h-12 w-12 text-yellow-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-600">WINNER NFT</p>
              <p className="text-xs text-gray-500">#{nft.tokenId}</p>
            </div>
          </div>
        )}
        
        {/* Winner Badge */}
                 <div className="absolute top-3 left-3">
           <Badge className="bg-yellow-400 text-black border-2 border-black font-black">
             <Trophy className="w-3 h-3 mr-1" />
             WINNER
           </Badge>
         </div>

         {/* Contest Badge */}
         <div className="absolute top-3 right-3">
           <Badge variant="secondary" className="bg-gray-300 text-black border-2 border-black font-bold">
             CONTEST #{nft.contestId}
           </Badge>
         </div>
      </div>

      {/* NFT Details */}
      <div className={`p-4 bg-white ${compact ? "space-y-2" : "space-y-4"}`}>
        {/* Title */}
        <div>
          <h3 className={`font-black uppercase tracking-tight ${compact ? "text-lg" : "text-xl"}`}>
            {metadata?.name || nft.memeTitle || `Winner NFT #${nft.tokenId}`}
          </h3>
          {metadata?.description && !compact && (
            <p className="text-sm text-gray-600 mt-1">{metadata.description}</p>
          )}
        </div>

        {/* Winner Info */}
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border-2 border-black">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback className="bg-black text-white font-bold text-xs">W</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">WINNER</p>
            <p className="text-sm font-bold">{formatAddress(nft.winner)}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={`grid ${compact ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-3"} gap-3`}>
          <div className="text-center bg-yellow-400 text-black p-2 border-2 border-black">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Coins className="h-3 w-3" />
              <span className="text-xs font-black">{formatStakeAmount(nft.totalStaked)}</span>
            </div>
            <span className="text-xs font-bold uppercase">TOTAL STAKED</span>
          </div>

          <div className="text-center bg-gray-300 text-black p-2 border-2 border-black">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Calendar className="h-3 w-3" />
              <span className="text-xs font-black">{formatDate(nft.timestamp)}</span>
            </div>
            <span className="text-xs font-bold uppercase">MINTED</span>
          </div>

          {!compact && (
            <div className="text-center bg-green-100 text-black p-2 border-2 border-black lg:col-span-1 col-span-2">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Hash className="h-3 w-3" />
                <span className="text-xs font-black">#{nft.memeId}</span>
              </div>
              <span className="text-xs font-bold uppercase">MEME ID</span>
            </div>
          )}
        </div>

        {/* Attributes */}
        {metadata?.attributes && !compact && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase">ATTRIBUTES</p>
            <div className="flex flex-wrap gap-2">
              {metadata.attributes.slice(0, 4).map((attr, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {attr.trait_type}: {attr.value}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className={`flex gap-2 ${compact ? "pt-2" : "pt-4"}`}>
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewOnExplorer}
              className="btn-primary flex-1 text-sm"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              VIEW ON EXPLORER
            </Button>
            {metadata?.image && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/"), "_blank")}
                className="btn-secondary text-sm"
              >
                <Eye className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="cursor-pointer"
    >
      <div className="meme-card overflow-hidden">
        {cardContent}
      </div>
    </motion.div>
  )
} 