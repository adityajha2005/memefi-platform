import { useState } from "react"
import { CustomButton } from "@/components/ui/custom-button"
import { ArrowUpRight, ArrowDown, AlertTriangle, Clock, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Stake } from "@/types"

interface StakeCardProps {
  stake: Stake
  canWithdraw?: boolean
  isContestActive?: boolean
  onWithdraw?: (stakeId: number) => Promise<void>
}

export function StakeCard({ stake, canWithdraw = false, isContestActive = true, onWithdraw }: StakeCardProps) {
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false)

  const handleWithdraw = async () => {
    if (!onWithdraw) return
    
    setIsWithdrawing(true)
    try {
      await onWithdraw(stake.id)
      setShowWithdrawConfirm(false)
    } catch (error) {
      console.error("Withdrawal failed:", error)
    } finally {
      setIsWithdrawing(false)
    }
  }

  const getStatusColor = () => {
    if (!isContestActive) return "bg-yellow-400 text-black"
    if (stake.profit > 0) return "bg-green-400 text-black"
    if (stake.profit < 0) return "bg-red-400 text-white"
    return "bg-blue-400 text-white"
  }

  const getStatusText = () => {
    if (!isContestActive) return "CONTEST ENDED"
    if (stake.profit > 0) return "WINNING"
    if (stake.profit < 0) return "LOSING"
    return "ACTIVE"
  }

  return (
    <div className="meme-card p-4">
      <div className="flex items-start gap-4 mb-4">
        <Link href={`/meme/${stake.memeId}`}>
          <Image
            src={stake.image || "/placeholder.svg"}
            alt={stake.memeTitle}
            width={80}
            height={80}
            className="rounded-lg object-cover border-2 border-black hover:border-yellow-400 transition-colors"
          />
        </Link>
        <div className="flex-1">
          <Link href={`/meme/${stake.memeId}`} className="hover:text-yellow-600 transition-colors">
            <h3 className="font-black text-lg mb-1 uppercase tracking-tight">{stake.memeTitle}</h3>
          </Link>
          <p className="text-sm font-bold text-gray-600 mb-2 uppercase">BY {stake.creator}</p>
          <div className="flex items-center gap-2 mb-2">
            <div className={`px-2 py-1 border-2 border-black font-black text-xs uppercase ${getStatusColor()}`}>
              {getStatusText()}
            </div>
            {!canWithdraw && isContestActive && (
              <div className="flex items-center gap-1 text-orange-600">
                <Clock className="h-3 w-3" />
                <span className="text-xs font-bold uppercase">LOCKED</span>
              </div>
            )}
          </div>
          <p className="text-xs font-bold text-gray-500 uppercase">
            STAKED {new Date(stake.stakeDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-gray-600 uppercase">INITIAL STAKE</span>
          <span className="font-black text-lg">{stake.stakeAmount} BNB</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-gray-600 uppercase">CURRENT VALUE</span>
          <span className="font-black text-lg">{stake.currentValue} BNB</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-gray-600 uppercase">PROFIT/LOSS</span>
          <span
            className={`font-black text-lg flex items-center gap-1 ${
              stake.profit > 0 ? "text-green-600" : stake.profit < 0 ? "text-red-600" : "text-gray-600"
            }`}
          >
            <ArrowUpRight className={`h-4 w-4 ${stake.profit < 0 ? "rotate-180" : ""}`} />
            {stake.profit > 0 ? "+" : ""}{stake.profit} BNB
            {stake.profit !== 0 && (
              <span className="text-sm">
                ({((stake.profit / stake.stakeAmount) * 100).toFixed(1)}%)
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 space-y-2">
        {!showWithdrawConfirm ? (
          <div className="flex gap-2">
            <Link href={`/meme/${stake.memeId}`} className="flex-1">
              <CustomButton variant="secondary" className="w-full text-sm py-2">
                VIEW MEME
              </CustomButton>
            </Link>
            
            {canWithdraw && isContestActive ? (
              <CustomButton 
                variant="primary" 
                className="flex-1 text-sm py-2 bg-red-500 hover:bg-red-600"
                onClick={() => setShowWithdrawConfirm(true)}
              >
                <ArrowDown className="mr-1 h-4 w-4" />
                WITHDRAW
              </CustomButton>
            ) : !isContestActive ? (
              <CustomButton variant="primary" className="flex-1 text-sm py-2 bg-yellow-500 hover:bg-yellow-600">
                CLAIM REWARDS
              </CustomButton>
            ) : (
              <CustomButton variant="secondary" className="flex-1 text-sm py-2" disabled>
                <Clock className="mr-1 h-4 w-4" />
                LOCKED
              </CustomButton>
            )}
          </div>
        ) : (
          /* Withdrawal Confirmation */
          <div className="space-y-3">
            <div className="bg-red-100 p-3 border-2 border-red-400 rounded">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="font-black text-red-800 uppercase text-sm">Confirm Withdrawal</span>
              </div>
              <p className="text-xs font-bold text-red-700">
                You will receive {stake.stakeAmount} BNB back. You cannot re-stake on this meme during this contest.
              </p>
            </div>
            
            <div className="flex gap-2">
              <CustomButton 
                variant="secondary" 
                className="flex-1 text-sm py-2"
                onClick={() => setShowWithdrawConfirm(false)}
                disabled={isWithdrawing}
              >
                CANCEL
              </CustomButton>
              <CustomButton 
                variant="primary" 
                className="flex-1 text-sm py-2 bg-red-500 hover:bg-red-600"
                onClick={handleWithdraw}
                disabled={isWithdrawing}
              >
                {isWithdrawing ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    WITHDRAWING...
                  </>
                ) : (
                  <>
                    <ArrowDown className="mr-1 h-4 w-4" />
                    CONFIRM WITHDRAW
                  </>
                )}
              </CustomButton>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 