"use client"
import { Users, ImageIcon, Coins } from "lucide-react"
import { useEffect, useState } from "react"

export function LiveStats() {
  const [stats, setStats] = useState({
    totalMemes: 12847,
    bnbStaked: 2456.78,
    activeUsers: 8934,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        totalMemes: prev.totalMemes + Math.floor(Math.random() * 3),
        bnbStaked: prev.bnbStaked + Math.random() * 0.1,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5) - 2,
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stats-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-sm font-bold uppercase tracking-wide">TOTAL MEMES</p>
              <p className="text-4xl font-black neon-text">{stats.totalMemes.toLocaleString()}</p>
            </div>
            <div className="h-16 w-16 bg-green-400 text-black flex items-center justify-center retro-border">
              <ImageIcon className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="bg-black text-yellow-400 border-2 border-yellow-400 p-6 retro-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-400 text-sm font-bold uppercase tracking-wide">BNB STAKED</p>
              <p className="text-4xl font-black" style={{ color: "#ffff00", textShadow: "0 0 10px #ffff00" }}>
                {stats.bnbStaked.toFixed(2)}
              </p>
            </div>
            <div className="h-16 w-16 bg-yellow-400 text-black flex items-center justify-center retro-border">
              <Coins className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="bg-black text-red-400 border-2 border-red-400 p-6 retro-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-400 text-sm font-bold uppercase tracking-wide">ACTIVE USERS</p>
              <p className="text-4xl font-black" style={{ color: "#ff0080", textShadow: "0 0 10px #ff0080" }}>
                {stats.activeUsers.toLocaleString()}
              </p>
            </div>
            <div className="h-16 w-16 bg-red-400 text-black flex items-center justify-center retro-border">
              <Users className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
