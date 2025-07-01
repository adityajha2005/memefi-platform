import type { ReactNode } from "react"

interface StatsCardProps {
  title: string
  value: string | number | ReactNode
  icon: ReactNode
  color: "green" | "yellow" | "red"
}

export function StatsCard({ title, value, icon, color }: StatsCardProps) {
  const colorClasses = {
    green: "stats-card",
    yellow: "bg-black text-yellow-400 border-2 border-yellow-400",
    red: "bg-black text-red-400 border-2 border-red-400",
  }

  const iconColorClasses = {
    green: "bg-green-400 text-black",
    yellow: "bg-yellow-400 text-black",
    red: "bg-red-400 text-black",
  }

  return (
    <div className={`${colorClasses[color]} p-6 retro-border h-32 flex items-center`}>
      <div className="flex items-center justify-between w-full">
        <div className="flex-1">
          <p
            className={`text-sm font-bold uppercase tracking-wide mb-2 ${color === "green" ? "text-green-400" : color === "yellow" ? "text-yellow-400" : "text-red-400"}`}
          >
            {title}
          </p>
          <div className="text-4xl font-black">
            {typeof value === "string" || typeof value === "number"
              ? typeof value === "number"
                ? value.toLocaleString()
                : value
              : value}
          </div>
        </div>
        <div
          className={`h-16 w-16 ${iconColorClasses[color]} flex items-center justify-center retro-border flex-shrink-0 ml-4`}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}
