"use client"

import { motion } from "framer-motion"
import { StatsCard } from "@/components/ui/stats-card"
import { Users, ImageIcon, Coins, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import type { Stats } from "@/types"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { useMemeStaking } from "@/hooks/use-meme-staking"
import { useWalletContext } from "@/components/wallet/wallet-provider"

export function LiveStatsSection() {
  const [stats, setStats] = useState<Stats>({
    totalMemes: 3,
    bnbStaked: 14,
    activeUsers: 7,
  })
  const [isLoading, setIsLoading] = useState(true)

  const { 
    getNextMemeId, 
    getCurrentContestId,
    getCurrentContest,
    getMeme,
    error 
  } = useMemeStaking()
  const { isConnected } = useWalletContext()

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true)
      try {
        if (isConnected) {
          // Get real contract data
          const [nextMemeId, currentContestId] = await Promise.all([
            getNextMemeId(),
            getCurrentContestId()
          ])
          
          // Total memes = next meme ID - 1 (since IDs start from 1)
          const totalMemes = Math.max(0, nextMemeId - 1)
          
          // Calculate total BNB staked across all memes
          let totalStaked = 0
          if (totalMemes > 0) {
            try {
              // Fetch all memes to get their total staked amounts
              const memePromises = []
              for (let i = 1; i <= totalMemes; i++) {
                memePromises.push(getMeme(i))
              }
              
              const memeResults = await Promise.all(memePromises)
              
              // Sum up all the total staked amounts (including deleted memes)
              totalStaked = memeResults
                .filter((meme): meme is NonNullable<typeof meme> => meme !== null)
                .reduce((sum: number, meme) => {
                  return sum + (Number(meme.totalStaked) / 1e18)
                }, 0)
            } catch (err) {
              console.log("Failed to calculate total staked amount")
            }
          }
          
          setStats({
            totalMemes,
            bnbStaked: totalStaked,
            activeUsers: Math.floor(totalMemes * 0.8), // Estimate: ~80% unique users
          })
        } else {
          // Show zeros when not connected
          setStats({
            totalMemes: 0,
            bnbStaked: 0,
            activeUsers: 0,
          })
        }
      } catch (err) {
        console.error("Failed to load platform stats:", err)
        // Fallback to zeros on error
        setStats({
          totalMemes: 0,
          bnbStaked: 0,
          activeUsers: 0,
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()

    // Refresh stats every 30 seconds
    const interval = setInterval(loadStats, 30000)
    return () => clearInterval(interval)
  }, [isConnected, getNextMemeId, getCurrentContestId, getCurrentContest])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  }

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-yellow-400" />
          <p className="text-sm font-bold text-gray-400">Loading platform stats...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8">
      {error && (
        <div className="mb-6 text-center">
          {/* <p className="text-sm text-red-400">Unable to fetch live stats from blockchain</p> */}
        </div>
      )}
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
          <StatsCard
            title="TOTAL MEMES"
            value={<AnimatedCounter end={stats.totalMemes} className="text-white" />}
            icon={<ImageIcon className="h-8 w-8" />}
            color="green"
          />
        </motion.div>
        <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
          <StatsCard
            title="BNB STAKED"
            value={<AnimatedCounter end={stats.bnbStaked} decimals={3} className="text-white" />}
            icon={<Coins className="h-8 w-8" />}
            color="yellow"
          />
        </motion.div>
        <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
          <StatsCard
            title="ACTIVE USERS"
            value={<AnimatedCounter end={stats.activeUsers} className="text-white" />}
            icon={<Users className="h-8 w-8" />}
            color="red"
          />
        </motion.div>
      </motion.div>

      {!isConnected && (
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">Connect wallet to view live blockchain data</p>
        </div>
      )}
    </section>
  )
}
