"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { X, Trophy, AlertTriangle, Loader2, CheckCircle } from "lucide-react"
import { useNFTContract } from "@/hooks/use-nft-contract"
import { useWalletContext } from "@/components/wallet/wallet-provider"

interface MintNFTModalProps {
  isOpen: boolean
  onClose: () => void
  contestId?: number
  memeId?: number
  winnerAddress?: string
}

export function MintNFTModal({ 
  isOpen, 
  onClose, 
  contestId,
  memeId,
  winnerAddress 
}: MintNFTModalProps) {
  const [formData, setFormData] = useState({
    winner: winnerAddress || "",
    contestId: contestId?.toString() || "",
    memeId: memeId?.toString() || "",
    originalMemeHash: "",
    totalStaked: "",
    isEmergencyMint: false,
    emergencyReason: ""
  })
  const [isMinting, setIsMinting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [tokenId, setTokenId] = useState("")

  const { mintWinnerNFT, emergencyMint } = useNFTContract()
  const { isConnected, account } = useWalletContext()

  const validateForm = () => {
    if (!formData.winner) return "Winner address is required"
    if (!formData.contestId || isNaN(Number(formData.contestId))) return "Valid contest ID is required"
    if (!formData.memeId || isNaN(Number(formData.memeId))) return "Valid meme ID is required"
    if (!formData.originalMemeHash) return "Original meme hash is required"
    if (!formData.totalStaked || isNaN(Number(formData.totalStaked))) return "Valid total staked amount is required"
    if (formData.isEmergencyMint && !formData.emergencyReason) return "Emergency reason is required for emergency mints"
    
    try {
      if (!/^0x[a-fA-F0-9]{40}$/.test(formData.winner)) {
        return "Invalid Ethereum address format"
      }
    } catch {
      return "Invalid winner address"
    }

    return null
  }

  const handleMint = async () => {
    if (!isConnected || !account) {
      setError("Please connect your wallet")
      return
    }

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsMinting(true)
    setError("")
    setSuccess("")

    try {
      let newTokenId: string

      if (formData.isEmergencyMint) {
        newTokenId = await emergencyMint(
          formData.winner,
          Number(formData.contestId),
          Number(formData.memeId),
          formData.originalMemeHash,
          formData.totalStaked,
          formData.emergencyReason
        )
      } else {
        newTokenId = await mintWinnerNFT(
          formData.winner,
          Number(formData.contestId),
          Number(formData.memeId),
          formData.originalMemeHash,
          formData.totalStaked
        )
      }

      setTokenId(newTokenId)
      setSuccess(`Successfully minted NFT #${newTokenId}!`)
      
      setFormData({
        winner: "",
        contestId: "",
        memeId: "",
        originalMemeHash: "",
        totalStaked: "",
        isEmergencyMint: false,
        emergencyReason: ""
      })
    } catch (err: any) {
      console.error("Minting failed:", err)
      setError(err.message || "Failed to mint NFT. Please try again.")
    } finally {
      setIsMinting(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError("")
  }

  if (!isOpen) return null

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
          className="bg-white border-4 border-black max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-start p-6 border-b-4 border-black bg-yellow-400">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2 text-black">
                <Trophy className="h-6 w-6" />
                MINT WINNER NFT
              </h2>
              <p className="text-sm font-bold text-black mt-1">
                {formData.isEmergencyMint ? "Emergency mint for contest winners" : "Mint NFT for contest winner"}
              </p>
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

          <div className="p-6 space-y-6">
            {/* Emergency Mint Toggle */}
            <div className="flex items-center justify-between p-4 bg-orange-100 border-2 border-orange-300 rounded">
              <div>
                <Label className="text-sm font-bold uppercase">Emergency Mint</Label>
                <p className="text-xs text-gray-600">Use only for emergency situations</p>
              </div>
              <Switch
                checked={formData.isEmergencyMint}
                onCheckedChange={(checked) => handleInputChange("isEmergencyMint", checked)}
              />
            </div>

            {/* Winner Address */}
            <div className="space-y-2">
              <Label className="text-sm font-bold uppercase">Winner Address *</Label>
              <Input
                placeholder="0x..."
                value={formData.winner}
                onChange={(e) => handleInputChange("winner", e.target.value)}
                className="border-2 border-black font-mono"
              />
            </div>

            {/* Contest ID */}
            <div className="space-y-2">
              <Label className="text-sm font-bold uppercase">Contest ID *</Label>
              <Input
                type="number"
                placeholder="1"
                value={formData.contestId}
                onChange={(e) => handleInputChange("contestId", e.target.value)}
                className="border-2 border-black font-bold"
              />
            </div>

            {/* Meme ID */}
            <div className="space-y-2">
              <Label className="text-sm font-bold uppercase">Meme ID *</Label>
              <Input
                type="number"
                placeholder="1"
                value={formData.memeId}
                onChange={(e) => handleInputChange("memeId", e.target.value)}
                className="border-2 border-black font-bold"
              />
            </div>

            {/* Original Meme Hash */}
            <div className="space-y-2">
              <Label className="text-sm font-bold uppercase">Original Meme Hash *</Label>
              <Input
                placeholder="QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                value={formData.originalMemeHash}
                onChange={(e) => handleInputChange("originalMemeHash", e.target.value)}
                className="border-2 border-black font-mono"
              />
              <p className="text-xs text-gray-500">IPFS hash of the original meme</p>
            </div>

            {/* Total Staked */}
            <div className="space-y-2">
              <Label className="text-sm font-bold uppercase">Total Staked (BNB) *</Label>
              <Input
                type="number"
                step="0.001"
                placeholder="10.5"
                value={formData.totalStaked}
                onChange={(e) => handleInputChange("totalStaked", e.target.value)}
                className="border-2 border-black font-bold"
              />
              <p className="text-xs text-gray-500">Total amount staked on the winning meme</p>
            </div>

            {/* Emergency Reason (only show if emergency mint) */}
            {formData.isEmergencyMint && (
              <div className="space-y-2">
                <Label className="text-sm font-bold uppercase">Emergency Reason *</Label>
                <Textarea
                  placeholder="Explain the reason for emergency mint..."
                  value={formData.emergencyReason}
                  onChange={(e) => handleInputChange("emergencyReason", e.target.value)}
                  className="border-2 border-black font-bold"
                  rows={3}
                />
              </div>
            )}

            {/* Preview */}
            <div className="bg-gray-100 p-4 border-2 border-gray-300 rounded">
              <h4 className="font-black text-sm uppercase mb-2">NFT Preview</h4>
              <div className="text-xs space-y-1">
                <p><span className="font-bold">Winner:</span> {formData.winner || "Not set"}</p>
                <p><span className="font-bold">Contest:</span> #{formData.contestId || "Not set"}</p>
                <p><span className="font-bold">Meme:</span> #{formData.memeId || "Not set"}</p>
                <p><span className="font-bold">Stakes:</span> {formData.totalStaked || "0"} BNB</p>
                {formData.isEmergencyMint && (
                  <p><span className="font-bold text-orange-600">Emergency Mint:</span> Yes</p>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 p-3 border-2 border-red-400 rounded">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="font-bold text-red-800">{error}</span>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-100 p-3 border-2 border-green-400 rounded">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-bold text-green-800">{success}</span>
                </div>
                {tokenId && (
                  <p className="text-xs text-green-600 mt-1">
                    Token ID: #{tokenId}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t-4 border-black">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 border-2 border-black font-bold"
                disabled={isMinting}
              >
                CANCEL
              </Button>
              <Button
                onClick={handleMint}
                disabled={isMinting || !isConnected}
                className={`flex-1 font-bold ${
                  formData.isEmergencyMint 
                    ? "bg-orange-500 hover:bg-orange-600" 
                    : "bg-yellow-400 hover:bg-yellow-500"
                } text-black border-2 border-black`}
              >
                {isMinting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    MINTING...
                  </>
                ) : (
                  <>
                    <Trophy className="mr-2 h-4 w-4" />
                    {formData.isEmergencyMint ? "EMERGENCY MINT" : "MINT NFT"}
                  </>
                )}
              </Button>
            </div>

            {/* Warning */}
            <div className="bg-yellow-100 p-3 border-2 border-yellow-400 rounded">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-yellow-800">Warning:</span>
                  <p className="text-yellow-700">
                    This action will mint an NFT permanently on the blockchain. 
                    Make sure all details are correct before proceeding.
                    {formData.isEmergencyMint && " Emergency mints bypass normal validation checks."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 