"use client"

import { Users, TrendingUp, Wallet, UserCheck } from "lucide-react"
import { CustomButton } from "@/components/ui/custom-button"

export function AdminUserPanel() {
  return (
    <div>
      <h2 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
        <Users className="h-5 w-5" />
        USER MANAGEMENT
      </h2>
      
      <div className="meme-card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <CustomButton variant="secondary" className="w-full">
            <Users className="mr-2 h-4 w-4" />
            ALL USERS
          </CustomButton>
          
          <CustomButton variant="secondary" className="w-full">
            <TrendingUp className="mr-2 h-4 w-4" />
            TOP CREATORS
          </CustomButton>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <CustomButton variant="secondary" className="w-full">
            <Wallet className="mr-2 h-4 w-4" />
            TOP STAKERS
          </CustomButton>
          
          <CustomButton variant="secondary" className="w-full">
            <UserCheck className="mr-2 h-4 w-4" />
            NFT HOLDERS
          </CustomButton>
        </div>

        {/* User Stats */}
        <div className="border-t-2 border-black pt-4 mt-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-black">8,934</div>
              <div className="text-xs font-bold text-gray-300">TOTAL USERS</div>
            </div>
            <div>
              <div className="text-lg font-black">234</div>
              <div className="text-xs font-bold text-gray-300">ACTIVE TODAY</div>
            </div>
            <div>
              <div className="text-lg font-black">1,247</div>
              <div className="text-xs font-bold text-gray-300">CREATORS</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 