"use client"

import { useState } from "react"
import { Crown, Plus, List, Settings } from "lucide-react"
import { CustomButton } from "@/components/ui/custom-button"
import { MintNFTModal } from "@/components/admin/mint-nft-modal"

export function AdminNFTPanel() {
  const [isMintModalOpen, setIsMintModalOpen] = useState(false)

  return (
    <div>
      <h2 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
        <Crown className="h-5 w-5" />
        NFT MANAGEMENT
      </h2>
      
      <div className="meme-card space-y-4">
        <CustomButton 
          variant="primary" 
          className="w-full"
          onClick={() => setIsMintModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          MINT WINNER NFT
        </CustomButton>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <CustomButton variant="secondary" className="w-full">
            <List className="mr-2 h-4 w-4" />
            VIEW ALL NFTS
          </CustomButton>
          
          <CustomButton variant="secondary" className="w-full">
            <Settings className="mr-2 h-4 w-4" />
            UPDATE BASE URI
          </CustomButton>
        </div>

        {/* NFT Stats */}
        <div className="border-t-2 border-black pt-4 mt-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xl font-black">23</div>
              <div className="text-sm font-bold text-gray-300">TOTAL NFTS</div>
            </div>
            <div>
              <div className="text-xl font-black">5</div>
              <div className="text-sm font-bold text-gray-300">THIS MONTH</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mint NFT Modal */}
      <MintNFTModal
        isOpen={isMintModalOpen}
        onClose={() => setIsMintModalOpen(false)}
      />
    </div>
  )
} 