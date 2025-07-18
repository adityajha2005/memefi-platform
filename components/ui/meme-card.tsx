"use client"

import Image from "next/image"
import { useState } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CustomButton } from "@/components/ui/custom-button"
import { TrendingBadge } from "@/components/ui/trending-badge"
import { StakeModal } from "@/components/modals/stake-modal"
import { Coins, Wallet, Clock, AlertTriangle, ArrowUpRight } from "lucide-react"
import { useWalletContext } from "@/components/wallet/wallet-provider"
import { useToast } from "@/components/ui/toast-notification"
import Link from "next/link"
import type { Meme } from "@/types"

interface MemeCardProps {
  meme: Meme
  showTwitterLikes?: boolean
  showViews?: boolean
  onStake?: (memeId: number, amount: string) => Promise<void>
  stakeInfo?: {
    isStakeable: boolean
    stakeDelay: number
    userHasStaked: boolean
    userStakeAmount: number
  }
}

export function MemeCard({ 
  meme, 
  showTwitterLikes = false, 
  showViews = false, 
  onStake,
  stakeInfo = {
    isStakeable: false,
    stakeDelay: 0,
    userHasStaked: false,
    userStakeAmount: 0
  }
}: MemeCardProps) {
  const { isConnected, connectWallet } = useWalletContext()
  const { showToast } = useToast()
  const [showStakeModal, setShowStakeModal] = useState(false)
  const [stakeAmount, setStakeAmount] = useState("")
  const [isStaking, setIsStaking] = useState(false)

  const handleStakeClick = async () => {
    if (!isConnected) {
      showToast("Please connect your wallet to stake on memes!", "error")
      await connectWallet()
      return
    }

    if (!stakeInfo.isStakeable && stakeInfo.stakeDelay > 0) {
      const delayMinutes = Math.ceil(stakeInfo.stakeDelay / 60)
      showToast(`Meme too new for staking. Wait ${delayMinutes} more minute(s).`, "warning")
      return
    }
    
    setShowStakeModal(true)
  }

  const handleStake = async (memeId: number, amount: string) => {
    if (!onStake) return
    
    setIsStaking(true)
    try {
      await onStake(memeId, amount)
      setStakeAmount("")
    } finally {
      setIsStaking(false)
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

    if (!stakeInfo.isStakeable && stakeInfo.stakeDelay > 0) {
      const delayMinutes = Math.ceil(stakeInfo.stakeDelay / 60)
      return (
        <>
          <Clock className="mr-2 h-4 w-4" />
          WAIT {delayMinutes}M
        </>
      )
    }

    if (stakeInfo.userHasStaked) {
      return (
        <>
          <Coins className="mr-2 h-4 w-4" />
          ADD MORE ({stakeInfo.userStakeAmount} BNB)
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
    if (!isConnected || (!stakeInfo.isStakeable && stakeInfo.stakeDelay > 0)) return "secondary"
    if (stakeInfo.userHasStaked) return "primary"
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
          {stakeInfo.userHasStaked && (
            <div className="absolute top-3 left-3 bg-yellow-400 text-black px-2 py-1 border-2 border-black font-black text-xs uppercase">
              STAKED: {stakeInfo.userStakeAmount} BNB
            </div>
          )}
          
          {/* Unstakeable Warning */}
          {!stakeInfo.isStakeable && stakeInfo.stakeDelay > 0 && (
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

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 bg-yellow-400 text-black px-3 py-1 border-2 border-black font-black">
              <Coins className="h-4 w-4" />
              <span>{meme.bnbStaked} BNB</span>
            </div>
            <Link href={`/meme/${meme.id}`}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-yellow-400 text-black p-2 border-2 border-black hover:bg-yellow-500 transition-colors"
              >
                <ArrowUpRight className="h-4 w-4" strokeWidth={3} />
              </motion.div>
            </Link>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <CustomButton 
              variant={getStakeButtonVariant()}
              className="w-full text-lg" 
              onClick={() => handleStakeClick()}
              disabled={!isConnected && !stakeInfo.isStakeable && stakeInfo.stakeDelay > 0}
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
