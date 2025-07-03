"use client"

import { useState, useEffect } from "react"
import { Settings, Clock, Coins, Target, Pause, Play, Loader2 } from "lucide-react"
import { CustomButton } from "@/components/ui/custom-button"
import { useMemeStaking } from "@/hooks/use-meme-staking"
import { useToast } from "@/components/ui/toast-notification"
import { useWalletContext } from "@/components/wallet/wallet-provider"

export function AdminSettingsPanel() {
  const [platformSettings, setPlatformSettings] = useState({
    contestDuration: 0,
    minStakeAmount: "0",
    isPaused: false
  })
  const [isLoading, setIsLoading] = useState(true)

  const { 
    getContestDuration, 
    getMinStakeAmount,
    setContestDuration,
    setMinStakeAmount,
    // Note: pause/unpause functions would need to be added to the hook
    isLoading: contractLoading,
    error 
  } = useMemeStaking()
  const { account, isConnected } = useWalletContext()
  const { showToast } = useToast()

  // Load current platform settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [duration, minStake] = await Promise.all([
          getContestDuration(),
          getMinStakeAmount()
        ])

        setPlatformSettings({
          contestDuration: duration,
          minStakeAmount: minStake,
          isPaused: false // Would need to get from contract
        })
      } catch (err) {
        console.error("Failed to load platform settings:", err)
        showToast("Failed to load platform settings", "error")
      } finally {
        setIsLoading(false)
      }
    }

    if (isConnected) {
      loadSettings()
    }
  }, [isConnected, getContestDuration, getMinStakeAmount, showToast])

  const handleUpdateContestDuration = async () => {
    if (!isConnected || !account) {
      showToast("Connect wallet to update settings", "error")
      return
    }

    const newDuration = prompt(
      `Current contest duration: ${Math.floor(platformSettings.contestDuration / 3600)} hours\nEnter new duration in hours:`,
      `${Math.floor(platformSettings.contestDuration / 3600)}`
    )

    if (!newDuration || isNaN(Number(newDuration))) return

    try {
      showToast("Updating contest duration...", "info")
      const durationInSeconds = Number(newDuration) * 3600
      await setContestDuration(durationInSeconds)
      
      setPlatformSettings(prev => ({
        ...prev,
        contestDuration: durationInSeconds
      }))
      
      showToast(`Contest duration updated to ${newDuration} hours!`, "success")
    } catch (err: any) {
      console.error("Failed to update contest duration:", err)
      showToast(err.message || "Failed to update contest duration", "error")
    }
  }

  const handleUpdateMinStake = async () => {
    if (!isConnected || !account) {
      showToast("Connect wallet to update settings", "error")
      return
    }

    const newMinStake = prompt(
      `Current minimum stake: ${platformSettings.minStakeAmount} BNB\nEnter new minimum stake amount:`,
      platformSettings.minStakeAmount
    )

    if (!newMinStake || isNaN(Number(newMinStake))) return

    try {
      showToast("Updating minimum stake amount...", "info")
      await setMinStakeAmount(newMinStake)
      
      setPlatformSettings(prev => ({
        ...prev,
        minStakeAmount: newMinStake
      }))
      
      showToast(`Minimum stake updated to ${newMinStake} BNB!`, "success")
    } catch (err: any) {
      console.error("Failed to update minimum stake:", err)
      showToast(err.message || "Failed to update minimum stake", "error")
    }
  }

  const handleTogglePause = async () => {
    showToast("Pause/unpause functionality would be implemented here", "info")
    // This would call contract pause/unpause functions
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    return `${hours} HOURS`
  }

  if (isLoading) {
    return (
      <div>
        <h2 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5" />
          PLATFORM SETTINGS
        </h2>
        
        <div className="meme-card p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="font-bold">Loading Settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
        <Settings className="h-5 w-5" />
        PLATFORM SETTINGS
      </h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border-4 border-red-400">
          <p className="font-bold text-red-800">Contract Error: {error}</p>
        </div>
      )}
      
      <div className="meme-card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <CustomButton 
            variant="secondary" 
            className="w-full h-16"
            onClick={handleUpdateContestDuration}
            disabled={contractLoading}
          >
            <div className="text-center">
              <Clock className="h-4 w-4 mx-auto mb-1" />
              <div className="text-xs font-bold">
                {contractLoading ? "UPDATING..." : "CONTEST DURATION"}
              </div>
            </div>
          </CustomButton>
          
          <CustomButton 
            variant="secondary" 
            className="w-full h-16"
            onClick={() => showToast("Platform fee updates would be implemented here", "info")}
          >
            <div className="text-center">
              <Coins className="h-4 w-4 mx-auto mb-1" />
              <div className="text-xs font-bold">PLATFORM FEES</div>
            </div>
          </CustomButton>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <CustomButton 
            variant="secondary" 
            className="w-full h-16"
            onClick={handleUpdateMinStake}
            disabled={contractLoading}
          >
            <div className="text-center">
              <Target className="h-4 w-4 mx-auto mb-1" />
              <div className="text-xs font-bold">
                {contractLoading ? "UPDATING..." : "MIN STAKE"}
              </div>
            </div>
          </CustomButton>
          
          <CustomButton 
            // variant={platformSettings.isPaused ? "primary" : "warning"} 
            className="w-full h-16"
            onClick={handleTogglePause}
          >
            <div className="text-center">
              {platformSettings.isPaused ? (
                <Play className="h-4 w-4 mx-auto mb-1" />
              ) : (
                <Pause className="h-4 w-4 mx-auto mb-1" />
              )}
              <div className="text-xs font-bold">
                {platformSettings.isPaused ? "UNPAUSE" : "PAUSE"} PLATFORM
              </div>
            </div>
          </CustomButton>
        </div>

        {/* Current Settings Display */}
        <div className="border-t-2 border-black pt-4 mt-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-sm font-black">
                {formatDuration(platformSettings.contestDuration)}
              </div>
              <div className="text-xs font-bold text-gray-300">CONTEST LENGTH</div>
            </div>
            <div>
              <div className="text-sm font-black">
                {platformSettings.minStakeAmount} BNB
              </div>
              <div className="text-xs font-bold text-gray-300">MIN STAKE</div>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        {!isConnected && (
          <div className="border-t-2 border-orange-400 pt-4 mt-4 bg-orange-100 p-3">
            <p className="text-sm font-bold text-orange-800 text-center">
              ⚠️ Connect wallet to modify platform settings
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 