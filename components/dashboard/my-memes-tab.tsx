import { MemeCardDashboard } from "./meme-card-dashboard"
import type { Meme } from "@/types"

interface MyMemesTabProps {
  memes: Meme[]
}

export function MyMemesTab({ memes }: MyMemesTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memes.map((meme) => (
          <MemeCardDashboard key={meme.id} meme={meme} />
        ))}
      </div>
    </div>
  )
} 