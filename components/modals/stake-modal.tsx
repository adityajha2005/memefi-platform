"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Coins, AlertTriangle, Loader2 } from "lucide-react"
import { useWalletContext } from "@/components/wallet/wallet-provider"
import type { Meme } from "@/types"

interface StakeModalProps {
  isOpen: boolean
  onClose: () => void
  meme: Meme | null
  onStake: (memeId: number, amount: string) => Promise<void>
}

export function StakeModal({ isOpen, onClose, meme, onStake }: StakeModalProps) {
  const [stakeAmount, setStakeAmount] = useState("")
  const [isStaking, setIsStaking] = useState(false)
  const [error, setError] = useState("")
  const { isConnected } = useWalletContext()

  const minStakeAmount = 0.01 // From contract: minStakeAmount
  const maxStakeAmount = 100 // Reasonable max for UI

  const handleStake = async () => {
    if (!meme || !isConnected) return

    const amount = parseFloat(stakeAmount)
    
    // Validation
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid stake amount")
      return
    }
    
    if (amount < minStakeAmount) {
      setError(`Minimum stake amount is ${minStakeAmount} BNB`)
      return
    }
    
    if (amount > maxStakeAmount) {
      setError(`Maximum stake amount is ${maxStakeAmount} BNB`)
      return
    }

    setError("")
    setIsStaking(true)

    try {
      await onStake(meme.id, stakeAmount)
      onClose()
      setStakeAmount("")
    } catch (error: any) {
      setError(error.message || "Failed to stake. Please try again.")
    } finally {
      setIsStaking(false)
    }
  }

  const calculatePotentialReward = () => {
    if (!stakeAmount || !meme) return 0
    const amount = parseFloat(stakeAmount)
    if (isNaN(amount)) return 0
    
    // Simple calculation: assume 30% creator reward, 5% platform fee, 65% to stakers
    // User gets proportional share based on their stake vs total stakes
    const estimatedShare = amount / (meme.bnbStaked + amount)
    const stakerPool = (meme.bnbStaked + amount) * 0.65
    return stakerPool * estimatedShare
  }

  if (!isOpen || !meme) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white border-4 border-black max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">STAKE ON MEME</h2>
              <p className="text-lg font-bold text-gray-600 mt-1">"{meme.title}"</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="border-2 border-black hover:bg-red-400"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Meme Info */}
          <div className="bg-gray-100 p-4 border-2 border-black mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-gray-600 uppercase">CURRENT STAKES</span>
              <div className="flex items-center gap-1">
                <Coins className="h-4 w-4" />
                <span className="font-black">{meme.bnbStaked} BNB</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-600 uppercase">BY</span>
              <span className="font-bold">{meme.creator.name}</span>
            </div>
          </div>

          {/* Stake Input */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="stakeAmount" className="text-lg font-black uppercase">
                STAKE AMOUNT (BNB)
              </Label>
              <Input
                id="stakeAmount"
                type="number"
                step="0.01"
                min={minStakeAmount}
                max={maxStakeAmount}
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder={`Min: ${minStakeAmount} BNB`}
                className="text-lg font-bold border-4 border-black mt-2"
                disabled={isStaking}
              />
              <p className="text-sm font-bold text-gray-500 mt-1">
                Minimum: {minStakeAmount} BNB • Maximum: {maxStakeAmount} BNB
              </p>
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[0.01, 0.1, 0.5, 1.0].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setStakeAmount(amount.toString())}
                  className="border-2 border-black font-bold"
                  disabled={isStaking}
                >
                  {amount} BNB
                </Button>
              ))}
            </div>

            {/* Potential Reward Estimate */}
            {stakeAmount && !isNaN(parseFloat(stakeAmount)) && (
              <div className="bg-green-100 p-3 border-2 border-green-400">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-green-600" />
                  <span className="font-black text-green-800 uppercase">Estimated Reward</span>
                </div>
                <p className="text-2xl font-black text-green-800">
                  {calculatePotentialReward().toFixed(3)} BNB
                </p>
                <p className="text-xs font-bold text-green-600 mt-1">
                  *If this meme wins the contest. Actual rewards depend on final stakes.
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 p-3 border-2 border-red-400">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="font-bold text-red-800">{error}</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-2 border-black font-bold"
              disabled={isStaking}
            >
              CANCEL
            </Button>
            <Button
              onClick={handleStake}
              disabled={!stakeAmount || isStaking || !isConnected}
              className="flex-1 btn-primary"
            >
              {isStaking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  STAKING...
                </>
              ) : (
                <>
                  <Coins className="mr-2 h-4 w-4" />
                  STAKE NOW
                </>
              )}
            </Button>
          </div>

          {/* Disclaimer */}
          <p className="text-xs font-bold text-gray-500 text-center mt-4">
            Stakes are locked until contest ends. Choose wisely!
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 