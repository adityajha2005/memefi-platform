"use client"

import { Settings, Clock, Coins, Target, Pause } from "lucide-react"
import { CustomButton } from "@/components/ui/custom-button"

export function AdminSettingsPanel() {
  return (
    <div>
      <h2 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
        <Settings className="h-5 w-5" />
        PLATFORM SETTINGS
      </h2>
      
      <div className="meme-card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <CustomButton variant="secondary" className="w-full h-16">
            <div className="text-center">
              <Clock className="h-4 w-4 mx-auto mb-1" />
              <div className="text-xs font-bold">CONTEST DURATION</div>
            </div>
          </CustomButton>
          
          <CustomButton variant="secondary" className="w-full h-16">
            <div className="text-center">
              <Coins className="h-4 w-4 mx-auto mb-1" />
              <div className="text-xs font-bold">PLATFORM FEES</div>
            </div>
          </CustomButton>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <CustomButton variant="secondary" className="w-full h-16">
            <div className="text-center">
              <Target className="h-4 w-4 mx-auto mb-1" />
              <div className="text-xs font-bold">MIN STAKE</div>
            </div>
          </CustomButton>
          
          <CustomButton variant="warning" className="w-full h-16">
            <div className="text-center">
              <Pause className="h-4 w-4 mx-auto mb-1" />
              <div className="text-xs font-bold">PAUSE PLATFORM</div>
            </div>
          </CustomButton>
        </div>

        {/* Current Settings Display */}
        <div className="border-t-2 border-black pt-4 mt-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-sm font-black">7 DAYS</div>
              <div className="text-xs font-bold text-gray-300">CONTEST LENGTH</div>
            </div>
            <div>
              <div className="text-sm font-black">5%</div>
              <div className="text-xs font-bold text-gray-300">PLATFORM FEE</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 