import { Trophy } from "lucide-react"

export function HeroHeader() {
  return (
    <>
      <div className="mb-8 flex justify-center">
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center bg-black border-4 border-black retro-border">
            <Trophy className="h-12 w-12 text-yellow-400" />
          </div>
        </div>
      </div>

      <h1 className="mb-6 text-6xl font-black tracking-tight sm:text-8xl text-black">MEMEFI</h1>

      <p className="mb-8 text-2xl font-bold text-gray-800 sm:text-3xl uppercase tracking-wide">
        STAKE • MEME • WIN • REPEAT
      </p>
    </>
  )
} 