"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { NFTGallery } from "@/components/nft/nft-gallery"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Calendar, Coins, Award, TrendingUp, Crown } from "lucide-react"
import { useNFTContract } from "@/hooks/use-nft-contract"
import { useWalletContext } from "@/components/wallet/wallet-provider"
import type { WinnerNFT } from "@/types"

export function NFTCollectionTab() {
  const [userNFTs, setUserNFTs] = useState<WinnerNFT[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalNFTs: 0,
    totalBNBWon: 0,
    contestsWon: 0,
    averageStake: 0,
    firstWin: null as Date | null,
    latestWin: null as Date | null,
    highestStake: 0
  })

  const { getUserNFTs } = useNFTContract()
  const { account, isConnected } = useWalletContext()

  useEffect(() => {
    const loadUserNFTs = async () => {
      if (!isConnected || !account) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const nfts = await getUserNFTs(account)
        setUserNFTs(nfts)
        
        // Calculate statistics
        if (nfts.length > 0) {
          const totalBNB = nfts.reduce((sum, nft) => sum + (parseFloat(nft.totalStaked) / 1e18), 0)
          const contestIds = new Set(nfts.map(nft => nft.contestId))
          const timestamps = nfts.map(nft => new Date(nft.timestamp * 1000))
          const stakes = nfts.map(nft => parseFloat(nft.totalStaked) / 1e18)
          
          setStats({
            totalNFTs: nfts.length,
            totalBNBWon: totalBNB,
            contestsWon: contestIds.size,
            averageStake: totalBNB / nfts.length,
            firstWin: new Date(Math.min(...timestamps.map(d => d.getTime()))),
            latestWin: new Date(Math.max(...timestamps.map(d => d.getTime()))),
            highestStake: Math.max(...stakes)
          })
        }
      } catch (error) {
        console.error("Failed to load user NFTs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserNFTs()
  }, [account, isConnected, getUserNFTs])

  const getAchievementLevel = () => {
    if (stats.totalNFTs >= 10) return { level: "Legend", color: "text-purple-600", icon: Crown }
    if (stats.totalNFTs >= 5) return { level: "Master", color: "text-gold-600", icon: Award }
    if (stats.totalNFTs >= 3) return { level: "Expert", color: "text-orange-600", icon: TrendingUp }
    if (stats.totalNFTs >= 1) return { level: "Winner", color: "text-green-600", icon: Trophy }
    return { level: "Newcomer", color: "text-gray-600", icon: Trophy }
  }

  const achievement = getAchievementLevel()
  const AchievementIcon = achievement.icon

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-black uppercase mb-2">CONNECT YOUR WALLET</h3>
        <p className="text-gray-600 font-bold">Connect your wallet to view your NFT collection</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className={`inline-flex items-center gap-2 px-4 py-2 border-2 border-black font-black text-lg ${achievement.color} bg-white`}>
            <AchievementIcon className="h-5 w-5" />
            {achievement.level.toUpperCase()}
          </div>
        </motion.div>
        <h2 className="text-3xl font-black uppercase tracking-tight mb-2">
          🏆 MY NFT COLLECTION
        </h2>
        <p className="text-gray-600 font-bold">
          Your exclusive Winner NFTs and achievements
        </p>
      </div>

      {/* Stats Dashboard */}
      {!isLoading && stats.totalNFTs > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total NFTs */}
            <div className="meme-card p-4 text-center bg-yellow-400 text-black">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="h-5 w-5" />
                <span className="text-2xl font-black">{stats.totalNFTs}</span>
              </div>
              <p className="text-sm font-bold uppercase">WINNER NFTS</p>
            </div>

            {/* Total BNB Won */}
            <div className="stats-card p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Coins className="h-5 w-5" />
                <span className="text-2xl font-black">{stats.totalBNBWon.toFixed(2)}</span>
              </div>
              <p className="text-sm font-bold uppercase">BNB WON</p>
            </div>

            {/* Contests Won */}
            <div className="meme-card p-4 text-center bg-gray-300 text-black">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="h-5 w-5" />
                <span className="text-2xl font-black">{stats.contestsWon}</span>
              </div>
              <p className="text-sm font-bold uppercase">CONTESTS WON</p>
            </div>

            {/* Highest Stake */}
            <div className="meme-card p-4 text-center bg-white text-black">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-2xl font-black">{stats.highestStake.toFixed(2)}</span>
              </div>
              <p className="text-sm font-bold uppercase">HIGHEST STAKE</p>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4 border-2 border-gray-300">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-gray-600" />
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase">First Win</p>
                  <p className="text-lg font-black">
                    {stats.firstWin ? stats.firstWin.toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-2 border-gray-300">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-gray-600" />
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase">Latest Win</p>
                  <p className="text-lg font-black">
                    {stats.latestWin ? stats.latestWin.toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-2 border-gray-300">
              <div className="flex items-center gap-3">
                <Coins className="h-8 w-8 text-gray-600" />
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase">Average Stake</p>
                  <p className="text-lg font-black">
                    {stats.averageStake.toFixed(2)} BNB
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      )}

      {/* NFT Gallery */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Tabs defaultValue="grid" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto bg-black border-4 border-black">
            <TabsTrigger
              value="grid"
              className="font-black uppercase text-white data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
            >
              GRID VIEW
            </TabsTrigger>
            <TabsTrigger
              value="compact"
              className="font-black uppercase text-white data-[state=active]:bg-green-400 data-[state=active]:text-black"
            >
              COMPACT
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="mt-6">
            <NFTGallery 
              userAddress={account || undefined}
              showUserNFTs={true}
              showAllNFTs={false}
              compact={false}
            />
          </TabsContent>

          <TabsContent value="compact" className="mt-6">
            <NFTGallery 
              userAddress={account || undefined}
              showUserNFTs={true}
              showAllNFTs={false}
              compact={true}
            />
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Achievement Badges */}
      {!isLoading && stats.totalNFTs > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="border-t-4 border-black pt-6"
        >
          <h3 className="text-xl font-black uppercase mb-4 text-center">🏅 ACHIEVEMENTS</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {stats.totalNFTs >= 1 && (
              <Badge className="bg-green-400 text-black border-2 border-black font-black px-3 py-1">
                FIRST WIN
              </Badge>
            )}
            {stats.totalNFTs >= 3 && (
              <Badge className="bg-orange-400 text-black border-2 border-black font-black px-3 py-1">
                HAT TRICK
              </Badge>
            )}
            {stats.totalNFTs >= 5 && (
              <Badge className="bg-purple-400 text-white border-2 border-black font-black px-3 py-1">
                MASTER WINNER
              </Badge>
            )}
            {stats.totalNFTs >= 10 && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-2 border-black font-black px-3 py-1">
                LEGENDARY
              </Badge>
            )}
            {stats.highestStake >= 50 && (
              <Badge className="bg-blue-400 text-white border-2 border-black font-black px-3 py-1">
                HIGH ROLLER
              </Badge>
            )}
            {stats.contestsWon >= 5 && (
              <Badge className="bg-red-400 text-white border-2 border-black font-black px-3 py-1">
                CONTEST DOMINATOR
              </Badge>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
} 