"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Upload, Zap, Trophy, X } from "lucide-react"

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleUpload = () => {
    router.push("/upload")
    setIsOpen(false)
  }

  const handleStake = () => {
    console.log("Quick stake")
    setIsOpen(false)
  }

  const handleLeaderboard = () => {
    router.push("/leaderboard")
    setIsOpen(false)
  }

  const actions = [
    { icon: Upload, label: "UPLOAD", color: "bg-green-400", onClick: handleUpload },
    { icon: Zap, label: "STAKE", color: "bg-yellow-400", onClick: handleStake },
    { icon: Trophy, label: "LEADERBOARD", color: "bg-red-400", onClick: handleLeaderboard },
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action buttons */}
      <div
        className={`flex flex-col gap-3 mb-3 transition-all duration-300 ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
      >
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`${action.color} text-black p-3 border-2 border-black retro-border hover:scale-110 transition-all duration-200 group`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <action.icon className="h-5 w-5" />
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black text-white px-2 py-1 text-xs font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {action.label}
            </span>
          </button>
        ))}
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 bg-black text-green-400 border-4 border-green-400 retro-border hover:scale-110 transition-all duration-200 ${isOpen ? "rotate-45" : ""}`}
        style={{ boxShadow: "0 0 20px rgba(0, 255, 65, 0.5)" }}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </button>
    </div>
  )
}
