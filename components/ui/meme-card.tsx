"use client"

import Image from "next/image"
import { useState } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CustomButton } from "@/components/ui/custom-button"
import { TrendingBadge } from "@/components/ui/trending-badge"
import { StakeModal } from "@/components/modals/stake-modal"
import { Coins, Heart, Twitter, Eye, Wallet, Clock, AlertTriangle } from "lucide-react"
import { useWalletContext } from "@/components/wallet/wallet-provider"
import { useToast } from "@/components/ui/toast-notification"
import type { Meme } from "@/types"

interface MemeCardProps {
  meme: Meme
  showTwitterLikes?: boolean
  showViews?: boolean
  isStakeable?: boolean
  stakeDelay?: number // seconds until stakeable
  userHasStaked?: boolean
  userStakeAmount?: number
  onStake?: (memeId: number, amount: string) => Promise<void>
}

export function MemeCard({ 
  meme, 
  showTwitterLikes = false, 
  showViews = false, 
  isStakeable = true,
  stakeDelay = 0,
  userHasStaked = false,
  userStakeAmount = 0,
  onStake 
}: MemeCardProps) {
  const { isConnected, connectWallet } = useWalletContext()
  const { showToast } = useToast()
  const [showStakeModal, setShowStakeModal] = useState(false)

  const handleStakeClick = async () => {
    if (!isConnected) {
      showToast("Please connect your wallet to stake on memes!", "error")
      await connectWallet()
      return
    }

    if (!isStakeable && stakeDelay > 0) {
      const delayMinutes = Math.ceil(stakeDelay / 60)
      showToast(`Meme too new for staking. Wait ${delayMinutes} more minute(s).`, "warning")
      return
    }
    
    setShowStakeModal(true)
  }

  const handleStake = async (memeId: number, amount: string) => {
    if (onStake) {
      await onStake(memeId, amount)
      showToast(`Successfully staked ${amount} BNB on "${meme.title}"!`, "success")
    }
  }

  const getStakeButtonContent = () => {
    if (!isConnected) {
      return (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          CONNECT TO STAKE
        </>
      )
    }

    if (!isStakeable && stakeDelay > 0) {
      const delayMinutes = Math.ceil(stakeDelay / 60)
      return (
        <>
          <Clock className="mr-2 h-4 w-4" />
          WAIT {delayMinutes}M
        </>
      )
    }

    if (userHasStaked) {
      return (
        <>
          <Coins className="mr-2 h-4 w-4" />
          ADD MORE ({userStakeAmount} BNB)
        </>
      )
    }

    return (
      <>
        <Coins className="mr-2 h-4 w-4" />
        STAKE NOW
      </>
    )
  }

  const getStakeButtonVariant = () => {
    if (!isConnected || (!isStakeable && stakeDelay > 0)) return "secondary"
    if (userHasStaked) return "warning"
    return "primary"
  }

  return (
    <>
      <motion.div
        className="meme-card p-0 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ 
          y: -8,
          transition: { duration: 0.2 }
        }}
      >
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={meme.image || "/placeholder.svg"}
            alt={meme.title}
            width={400}
            height={300}
            className="w-full h-48 object-cover"
          />
          {meme.trending && (
            <motion.div 
              className="absolute top-3 right-3"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <TrendingBadge />
            </motion.div>
          )}
          
          {/* Stake Status Indicator */}
          {userHasStaked && (
            <div className="absolute top-3 left-3 bg-yellow-400 text-black px-2 py-1 border-2 border-black font-black text-xs uppercase">
              STAKED: {userStakeAmount} BNB
            </div>
          )}
          
          {/* Unstakeable Warning */}
          {!isStakeable && stakeDelay > 0 && (
            <div className="absolute bottom-3 left-3 bg-orange-400 text-black px-2 py-1 border-2 border-black font-black text-xs uppercase flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              NEW MEME
            </div>
          )}
        </motion.div>

        <motion.div 
          className="p-4 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <motion.h3 
            className="font-black text-xl mb-3 uppercase tracking-tight"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {meme.title}
          </motion.h3>

          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10 border-2 border-black">
              <AvatarImage src={meme.creator.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-black text-white font-bold">{meme.creator.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-bold text-gray-700 uppercase">{meme.creator.name}</span>
          </div>

          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2 bg-yellow-400 text-black px-3 py-1 border-2 border-black font-black">
              <Coins className="h-4 w-4" />
              <span>{meme.bnbStaked} BNB</span>
            </div>

            {showTwitterLikes && meme.twitterLikes && (
              <div className="flex items-center gap-2 bg-blue-400 text-white px-3 py-1 border-2 border-black font-black">
                <Twitter className="h-4 w-4" />
                <span>{meme.twitterLikes}</span>
              </div>
            )}

            {showViews && meme.views && (
              <div className="flex items-center gap-2 bg-purple-400 text-white px-3 py-1 border-2 border-black font-black">
                <Eye className="h-4 w-4" />
                <span>{meme.views}</span>
              </div>
            )}

            {meme.likes && (
              <div className="flex items-center gap-2 bg-red-400 text-white px-3 py-1 border-2 border-black font-black">
                <Heart className="h-4 w-4" />
                <span>{meme.likes}</span>
              </div>
            )}
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <CustomButton 
              variant={getStakeButtonVariant()}
              className="w-full text-lg" 
              onClick={handleStakeClick}
              disabled={!isConnected && !isStakeable && stakeDelay > 0}
            >
              {getStakeButtonContent()}
            </CustomButton>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Stake Modal */}
      <StakeModal
        isOpen={showStakeModal}
        onClose={() => setShowStakeModal(false)}
        meme={meme}
        onStake={handleStake}
      />
    </>
  )
}
