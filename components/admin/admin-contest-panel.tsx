"use client"

import { useState, useEffect } from "react"
import { Clock, Trophy, Zap, Loader2 } from "lucide-react"
import { CustomButton } from "@/components/ui/custom-button"
import { useMemeStaking } from "@/hooks/use-meme-staking"
import { useToast } from "@/components/ui/toast-notification"
import { useWalletContext } from "@/components/wallet/wallet-provider"

interface ContestInfo {
  id: number
  startTime: number
  endTime: number
  memesSubmitted: number
  totalStaked: string
  isActive: boolean
}

export function AdminContestPanel() {
  const [contest, setContest] = useState<ContestInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEndingContest, setIsEndingContest] = useState(false)

  const { 
    getCurrentContest, 
    endContest,
    getContestWinner,
    isLoading: contractLoading,
    error 
  } = useMemeStaking()
  const { account, isConnected } = useWalletContext()
  const { showToast } = useToast()

  // Load current contest data
  useEffect(() => {
    const loadContest = async () => {
      if (!isConnected) {
        setIsLoading(false)
        return
      }

      try {
        const contestData = await getCurrentContest()
        
        if (contestData) {
          setContest({
            id: Number(contestData.contestId),
            startTime: Number(contestData.startTime) * 1000, // Convert to milliseconds
            endTime: Number(contestData.endTime) * 1000,
            memesSubmitted: contestData.memeIds.length,
            totalStaked: (Number(contestData.totalPrizePool) / 1e18).toFixed(3), // Convert from wei to BNB
            isActive: !contestData.ended
          })
        } else {
          // No active contest
          setContest(null)
        }
      } catch (err) {
        console.error("Failed to load contest:", err)
        showToast("Failed to load contest data", "error")
      } finally {
        setIsLoading(false)
      }
    }

    loadContest()
  }, [isConnected, getCurrentContest, showToast])

  const handleEndContest = async () => {
    if (!isConnected || !account) {
      showToast("Connect wallet to end contest", "error")
      return
    }

    if (!contest?.isActive) {
      showToast("No active contest to end", "error")
      return
    }

    const confirmed = window.confirm(
      `Are you sure you want to end Contest #${contest.id}? This action cannot be undone.`
    )

    if (!confirmed) return

    setIsEndingContest(true)
    try {
      showToast("Ending contest...", "info")
      await endContest()
      
      // Refresh contest data
      const updatedContest = await getCurrentContest()
      if (updatedContest) {
        setContest({
          id: Number(updatedContest.contestId),
          startTime: Number(updatedContest.startTime) * 1000,
          endTime: Number(updatedContest.endTime) * 1000,
          memesSubmitted: updatedContest.memeIds.length,
          totalStaked: (Number(updatedContest.totalPrizePool) / 1e18).toFixed(3),
          isActive: !updatedContest.ended
        })
      } else {
        setContest(null)
      }
      
      showToast(`Contest #${contest.id} ended successfully!`, "success")
    } catch (err: any) {
      console.error("Failed to end contest:", err)
      showToast(err.message || "Failed to end contest", "error")
    } finally {
      setIsEndingContest(false)
    }
  }

  const handleForceStartContest = async () => {
    if (!isConnected || !account) {
      showToast("Connect wallet to start contest", "error")
      return
    }

    const confirmed = window.confirm(
      "This will attempt to force-start a new contest. This should only be used if no contest is currently active. Continue?"
    )

    if (!confirmed) return

    setIsEndingContest(true)
    try {
      showToast("Attempting to start new contest...", "info")
      
      // Try to call endContest even if no contest is active
      // This might trigger the _startNewContest() internal function
      await endContest()
      
      // Wait a moment then refresh
      setTimeout(async () => {
        const updatedContest = await getCurrentContest()
        if (updatedContest) {
          setContest({
            id: Number(updatedContest.contestId),
            startTime: Number(updatedContest.startTime) * 1000,
            endTime: Number(updatedContest.endTime) * 1000,
            memesSubmitted: updatedContest.memeIds.length,
            totalStaked: (Number(updatedContest.totalPrizePool) / 1e18).toFixed(3),
            isActive: !updatedContest.ended
          })
          showToast("New contest started successfully!", "success")
        } else {
          showToast("Contest start may have failed. Check contract deployment.", "warning")
        }
      }, 2000)
      
    } catch (err: any) {
      console.error("Failed to start contest:", err)
      
      // If endContest fails because no contest exists, this might actually be expected
      if (err.message?.includes("No active contest") || err.message?.includes("Contest still active")) {
        showToast("Contract may need manual intervention. Try submitting a test meme first.", "warning")
      } else {
        showToast(err.message || "Failed to start contest", "error")
      }
    } finally {
      setIsEndingContest(false)
    }
  }

  const handleViewAnalytics = () => {
    showToast("Contest analytics feature coming soon!", "info")
  }

  const handleViewPastWinners = async () => {
    try {
      showToast("Loading past winners...", "info")
      // This would typically load multiple past contests
      const winnerMemeId = await getContestWinner(contest?.id || 0)
      if (winnerMemeId && winnerMemeId > 0) {
        showToast(`Last winning meme ID: #${winnerMemeId}`, "success")
      } else {
        showToast("No winner data available", "info")
      }
    } catch (err) {
      showToast("Failed to load winner data", "error")
    }
  }

  const formatTimeRemaining = (endTime: number) => {
    const now = Date.now()
    const diff = endTime - now
    if (diff <= 0) return "Contest Ended"
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    return `${days}d ${hours}h remaining`
  }

  if (isLoading) {
    return (
      <div>
        <h2 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          CONTEST MANAGEMENT
        </h2>
        
        <div className="meme-card p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="font-bold">Loading Contest Data...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
        <Trophy className="h-5 w-5" />
        CONTEST MANAGEMENT
      </h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border-4 border-red-400">
          <p className="font-bold text-red-800">Contract Error: {error}</p>
        </div>
      )}
      
      <div className="meme-card space-y-6">
        {/* Current Contest Status */}
        <div>
          <h3 className="text-lg font-black mb-3 text-yellow-400">CURRENT CONTEST</h3>
          {contest ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-black">#{contest.id}</div>
                <div className="text-sm font-bold text-gray-300">CONTEST ID</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black">{contest.memesSubmitted}</div>
                <div className="text-sm font-bold text-gray-300">MEMES</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black">{contest.totalStaked} BNB</div>
                <div className="text-sm font-bold text-gray-300">STAKED</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-400">
              <Clock className="h-8 w-8 mx-auto mb-2" />
              <p className="font-bold">No Active Contest</p>
              <p className="text-sm">Contest may have ended or not started yet</p>
            </div>
          )}
        </div>

        {/* Contest Status */}
        {contest && (
          <div className="text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 border-2 border-black font-black ${
              contest.isActive ? 'bg-green-400 text-black' : 'bg-gray-400 text-black'
            }`}>
              <Clock className="h-4 w-4" />
              {contest.isActive ? formatTimeRemaining(contest.endTime) : 'CONTEST ENDED'}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {contest?.isActive ? (
            <CustomButton 
              // variant="warning" 
              className="w-full"
              disabled={isEndingContest || contractLoading}
              onClick={handleEndContest}
            >
              {isEndingContest ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ENDING CONTEST...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  END CURRENT CONTEST
                </>
              )}
            </CustomButton>
          ) : (
            <CustomButton 
              variant="primary" 
              className="w-full"
              disabled={isEndingContest || contractLoading}
              onClick={handleForceStartContest}
            >
              {isEndingContest ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  STARTING CONTEST...
                </>
              ) : (
                <>
                  <Trophy className="mr-2 h-4 w-4" />
                  START NEW CONTEST
                </>
              )}
            </CustomButton>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CustomButton 
              variant="secondary" 
              className="w-full"
              onClick={handleViewAnalytics}
            >
              CONTEST ANALYTICS
            </CustomButton>
            <CustomButton 
              variant="secondary" 
              className="w-full"
              onClick={handleViewPastWinners}
            >
              PAST WINNERS
            </CustomButton>
          </div>
        </div>

        {/* Connection Warning */}
        {!isConnected && (
          <div className="bg-yellow-100 p-3 border-2 border-yellow-400 rounded">
            <p className="font-bold text-yellow-800">
              Connect your wallet to view and manage contests
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 