"use client"

import { useState, useEffect } from "react"
import { Activity, Trophy, Crown, Coins } from "lucide-react"

interface ActivityItem {
  id: string
  type: 'contest_ended' | 'nft_minted' | 'large_stake' | 'new_user'
  description: string
  timestamp: number
  details: string
}

export function AdminRecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])

  useEffect(() => {
    // Mock data - replace with actual contract events
    setActivities([
      {
        id: '1',
        type: 'contest_ended',
        description: 'Contest #23 ended',
        timestamp: Date.now() - (2 * 60 * 60 * 1000),
        details: 'Winner: 0x742d...0a2F | Prize: 18.5 BNB'
      },
      {
        id: '2',
        type: 'nft_minted',
        description: 'Winner NFT minted',
        timestamp: Date.now() - (4 * 60 * 60 * 1000),
        details: 'Token #23 for Contest #23'
      },
      {
        id: '3',
        type: 'large_stake',
        description: 'Large stake detected',
        timestamp: Date.now() - (6 * 60 * 60 * 1000),
        details: '5.2 BNB staked on Meme #1234'
      },
      {
        id: '4',
        type: 'new_user',
        description: 'New user registered',
        timestamp: Date.now() - (8 * 60 * 60 * 1000),
        details: '0x8ba1...5.5 submitted first meme'
      }
    ])
  }, [])

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'contest_ended':
        return <Trophy className="h-4 w-4" />
      case 'nft_minted':
        return <Crown className="h-4 w-4" />
      case 'large_stake':
        return <Coins className="h-4 w-4" />
      case 'new_user':
        return <Activity className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'contest_ended':
        return 'bg-yellow-400 text-black'
      case 'nft_minted':
        return 'bg-green-400 text-black'
      case 'large_stake':
        return 'bg-blue-400 text-black'
      case 'new_user':
        return 'bg-purple-400 text-black'
      default:
        return 'bg-gray-400 text-black'
    }
  }

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours}h ago`
    } else {
      return `${minutes}m ago`
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-black uppercase mb-4 flex items-center gap-2">
        <Activity className="h-6 w-6" />
        RECENT ACTIVITY
      </h2>
      
      <div className="meme-card">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-bold">NO RECENT ACTIVITY</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-800 border-2 border-black">
                <div className="flex items-center gap-4">
                  <div className={`p-2 border-2 border-black ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <div className="font-black">{activity.description}</div>
                    <div className="text-sm text-gray-400">{activity.details}</div>
                  </div>
                </div>
                <div className="text-sm font-bold text-gray-300">
                  {formatTimeAgo(activity.timestamp)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 