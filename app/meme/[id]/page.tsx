"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useMemeStaking } from "@/hooks/use-meme-staking"
import { Loader2, Coins, Eye, Heart } from "lucide-react"
import Image from "next/image"
import { CustomButton } from "@/components/ui/custom-button"
import { useToast } from "@/components/ui/toast-notification"
import { useWalletContext } from "@/components/wallet/wallet-provider"

interface MemeDetails {
  id: number
  title: string
  image: string
  creator: string
  timestamp: number
  totalStaked: string
  ipfsHash: string
  rewardDistributed: boolean
  views: number
  likes: number
}

export default function MemePage() {
  const params = useParams()
  const { getMeme } = useMemeStaking()
  const [meme, setMeme] = useState<MemeDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { showToast } = useToast()
  const { account } = useWalletContext()

  useEffect(() => {
    const loadMeme = async () => {
      if (!params.id) return

      try {
        setIsLoading(true)
        const memeData = await getMeme(Number(params.id))
        if (!memeData) {
          throw new Error("Meme not found")
        }

        setMeme({
          id: Number(memeData.id),
          title: `Meme #${Number(memeData.id)}`,
          image: `https://gateway.pinata.cloud/ipfs/${memeData.ipfsHash}`,
          creator: memeData.creator,
          timestamp: Number(memeData.timestamp),
          totalStaked: memeData.totalStaked.toString(),
          ipfsHash: memeData.ipfsHash,
          rewardDistributed: memeData.rewardDistributed,
          views: 0, // TODO: Implement view tracking
          likes: 0, // TODO: Implement like system
        })
      } catch (error) {
        console.error("Failed to load meme:", error)
        showToast("Failed to load meme details", "error")
      } finally {
        setIsLoading(false)
      }
    }

    loadMeme()
  }, [params.id, getMeme, showToast])

  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-yellow-400" />
          <h3 className="text-xl font-black uppercase mb-2">Loading Meme</h3>
          <p className="text-gray-400 font-bold">Fetching from blockchain...</p>
        </div>
      </div>
    )
  }

  if (!meme) {
    return (
      <div className="container mx-auto py-12">
        <div className="text-center">
          <h3 className="text-xl font-black uppercase mb-2">Meme Not Found</h3>
          <p className="text-gray-400 font-bold">The requested meme could not be found.</p>
        </div>
      </div>
    )
  }

  const isOwner = account?.toLowerCase() === meme.creator.toLowerCase()

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-4xl mx-auto">
        {/* Meme Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-black uppercase">{meme.title}</h1>
          <div className={`text-black px-4 py-2 border-2 border-black font-black uppercase ${
            meme.rewardDistributed ? 'bg-yellow-400' : 'bg-green-400'
          }`}>
            {meme.rewardDistributed ? 'REWARDS DISTRIBUTED' : 'ACTIVE'}
          </div>
        </div>

        {/* Meme Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Image */}
          <div className="relative aspect-square border-4 border-black">
            <Image
              src={meme.image}
              alt={meme.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Creator Info */}
            <div>
              <h3 className="font-black uppercase mb-2">Creator</h3>
              <div className="flex items-center gap-4">
                <Image
                  src="/placeholder-user.jpg"
                  alt="Creator"
                  width={48}
                  height={48}
                  className="rounded-full border-2 border-black"
                />
                <div>
                  <p className="font-bold">{`${meme.creator.slice(0, 6)}...${meme.creator.slice(-4)}`}</p>
                  {isOwner && (
                    <span className="text-sm bg-yellow-400 px-2 py-1 font-bold uppercase">You</span>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 bg-yellow-400 text-black px-3 py-2 border-2 border-black font-black mb-1">
                  <Coins className="h-5 w-5" />
                  <span>{Number(meme.totalStaked) / 1e18}</span>
                </div>
                <span className="text-sm font-bold text-gray-500 uppercase">BNB Staked</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 bg-blue-400 text-white px-3 py-2 border-2 border-black font-black mb-1">
                  <Eye className="h-5 w-5" />
                  <span>{meme.views}</span>
                </div>
                <span className="text-sm font-bold text-gray-500 uppercase">Views</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 bg-red-400 text-white px-3 py-2 border-2 border-black font-black mb-1">
                  <Heart className="h-5 w-5" />
                  <span>{meme.likes}</span>
                </div>
                <span className="text-sm font-bold text-gray-500 uppercase">Likes</span>
              </div>
            </div>

            {/* Additional Details */}
            <div>
              <h3 className="font-black uppercase mb-2">Details</h3>
              <div className="space-y-2">
                <p className="font-bold">
                  Uploaded: {new Date(meme.timestamp * 1000).toLocaleDateString()}
                </p>
                <p className="font-bold">
                  IPFS Hash: {meme.ipfsHash}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              {/* <CustomButton variant="secondary">
                VIEW ON IPFS
              </CustomButton>
              <CustomButton variant="secondary">
                VIEW ON BSCSCAN
              </CustomButton> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 