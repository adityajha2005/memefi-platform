"use client"

import { useState, useEffect } from "react"
import { Clock, Trophy, Zap } from "lucide-react"
import { CustomButton } from "@/components/ui/custom-button"

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

  useEffect(() => {
    // Mock data - replace with actual contract calls
    const loadContest = async () => {
      setContest({
        id: 24,
        startTime: Date.now() - (3 * 24 * 60 * 60 * 1000),
        endTime: Date.now() + (4 * 24 * 60 * 60 * 1000),
        memesSubmitted: 67,
        totalStaked: "24.8",
        isActive: true
      })
    }

    loadContest()
  }, [])

  const formatTimeRemaining = (endTime: number) => {
    const now = Date.now()
    const diff = endTime - now
    if (diff <= 0) return "Contest Ended"
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    return `${days}d ${hours}h remaining`
  }

  return (
    <div>
      <h2 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
        <Trophy className="h-5 w-5" />
        CONTEST MANAGEMENT
      </h2>
      
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
              <p>Loading contest data...</p>
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
          <CustomButton 
            variant="warning" 
            className="w-full"
            disabled={!contest?.isActive}
          >
            <Zap className="mr-2 h-4 w-4" />
            END CURRENT CONTEST
          </CustomButton>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CustomButton variant="secondary" className="w-full">
              CONTEST ANALYTICS
            </CustomButton>
            <CustomButton variant="secondary" className="w-full">
              PAST WINNERS
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  )
} 