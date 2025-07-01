"use client"

interface NeonProgressBarProps {
  progress: number
  color?: "green" | "yellow" | "red" | "blue"
  showPercentage?: boolean
  animated?: boolean
}

export function NeonProgressBar({
  progress,
  color = "green",
  showPercentage = true,
  animated = true,
}: NeonProgressBarProps) {
  const colors = {
    green: "bg-green-400 shadow-green-400",
    yellow: "bg-yellow-400 shadow-yellow-400",
    red: "bg-red-400 shadow-red-400",
    blue: "bg-blue-400 shadow-blue-400",
  }

  return (
    <div className="w-full">
      <div className="bg-black border-2 border-gray-600 h-6 relative overflow-hidden">
        <div
          className={`h-full ${colors[color]} transition-all duration-500 ${animated ? "animate-pulse" : ""}`}
          style={{
            width: `${Math.min(progress, 100)}%`,
            boxShadow: `0 0 20px currentColor`,
          }}
        />
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-black text-xs uppercase">{Math.round(progress)}%</span>
          </div>
        )}
      </div>
    </div>
  )
}
