"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, Trophy, Users, Coins } from "lucide-react"

interface ContestData {
  id: number
  startTime: number
  endTime: number
  isActive: boolean
  totalMemes: number
  totalStaked: number
  participants: number
}

interface ContestBannerProps {
  contest?: ContestData
}

export function ContestBanner({ contest }: ContestBannerProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    if (!contest?.isActive) return

    const updateTimer = () => {
      const now = Date.now()
      const endTime = contest.endTime * 1000 // Convert to milliseconds
      const difference = endTime - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeRemaining({ days, hours, minutes, seconds })
      } else {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [contest])

  if (!contest) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 text-white p-4 border-4 border-black mb-6"
      >
        <div className="text-center">
          <h2 className="text-2xl font-black uppercase">⏳ NO ACTIVE CONTEST</h2>
          <p className="text-lg font-bold mt-2">NEXT CONTEST STARTING SOON...</p>
        </div>
      </motion.div>
    )
  }

  if (!contest.isActive) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-yellow-400 text-black p-4 border-4 border-black mb-6"
      >
        <div className="text-center">
          <h2 className="text-2xl font-black uppercase">🏆 CONTEST #{contest.id} ENDED</h2>
          <p className="text-lg font-bold mt-2">REWARDS BEING DISTRIBUTED - NEXT CONTEST STARTING SOON</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-green-400 to-blue-500 text-black p-6 border-4 border-black mb-6"
    >
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Contest Info */}
          <div className="text-center lg:text-left">
            <div className="flex items-center gap-2 justify-center lg:justify-start mb-2">
              <Trophy className="h-6 w-6" />
              <h2 className="text-2xl font-black uppercase">CONTEST #{contest.id} LIVE</h2>
            </div>
            <p className="text-lg font-bold">SUBMIT MEMES • STAKE ON FAVORITES • WIN BNB REWARDS</p>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <Clock className="h-6 w-6 mx-auto mb-1" />
              <p className="text-sm font-bold uppercase">TIME LEFT</p>
            </div>
            <div className="flex gap-2">
              {[
                { label: "DAYS", value: timeRemaining.days },
                { label: "HRS", value: timeRemaining.hours },
                { label: "MIN", value: timeRemaining.minutes },
                { label: "SEC", value: timeRemaining.seconds },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  className="bg-black text-green-400 p-2 border-2 border-black min-w-[60px]"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: index * 0.1 }}
                >
                  <div className="text-2xl font-black text-center">{item.value.toString().padStart(2, '0')}</div>
                  <div className="text-xs font-bold text-center">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contest Stats */}
          <div className="flex gap-4">
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <Users className="h-4 w-4" />
                <span className="font-black text-lg">{contest.totalMemes}</span>
              </div>
              <p className="text-xs font-bold uppercase">MEMES</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <Coins className="h-4 w-4" />
                <span className="font-black text-lg">{contest.totalStaked}</span>
              </div>
              <p className="text-xs font-bold uppercase">BNB STAKED</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <Trophy className="h-4 w-4" />
                <span className="font-black text-lg">{contest.participants}</span>
              </div>
              <p className="text-xs font-bold uppercase">USERS</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 