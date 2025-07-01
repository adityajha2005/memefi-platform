"use client"

import { motion } from "framer-motion"
import { Trophy, Clock, Coins, Users, AlertTriangle, Star } from "lucide-react"

export function ContestRules() {
  const rules = [
    {
      icon: Clock,
      title: "Contest Duration",
      description: "Each contest runs for 7 days. New contests start automatically when the previous one ends.",
      color: "bg-blue-400"
    },
    {
      icon: Users,
      title: "Submission Limit", 
      description: "Each user can submit only ONE meme per contest. Choose your best content!",
      color: "bg-green-400"
    },
    {
      icon: Coins,
      title: "Staking Rules",
      description: "Minimum stake: 0.01 BNB. Stakes are locked until contest ends. No early withdrawals.",
      color: "bg-yellow-400"
    },
    {
      icon: Trophy,
      title: "Winning Criteria",
      description: "Meme with the highest total stakes wins. Creator gets 30%, stakers share 65%, platform 5%.",
      color: "bg-red-400"
    },
    {
      icon: Star,
      title: "MEV Protection",
      description: "New memes have a 1-minute delay before staking is allowed to prevent MEV attacks.",
      color: "bg-purple-400"
    },
    {
      icon: AlertTriangle,
      title: "Important",
      description: "Stakes cannot be withdrawn during active contests. Plan your investments carefully!",
      color: "bg-orange-400"
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black text-black mb-4 uppercase tracking-tight">
          📋 CONTEST RULES
        </h2>
        <p className="text-xl font-bold text-gray-700 uppercase tracking-wide">
          UNDERSTAND HOW MEMEFI CONTESTS WORK
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rules.map((rule, index) => {
          const Icon = rule.icon
          return (
            <motion.div
              key={rule.title}
              className="meme-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start gap-4">
                <div className={`${rule.color} p-3 border-2 border-black`}>
                  <Icon className="h-6 w-6 text-black" />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-lg uppercase tracking-tight mb-2">
                    {rule.title}
                  </h3>
                  <p className="text-sm font-bold text-gray-700 leading-relaxed">
                    {rule.description}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
} 