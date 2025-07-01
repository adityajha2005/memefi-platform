import { CustomButton } from "@/components/ui/custom-button"
import { Upload, Zap, Trophy, Coins, Flame } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
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

          <div className="mb-12 flex flex-wrap justify-center gap-6 text-lg font-bold">
            <div className="flex items-center gap-2 bg-black text-green-400 px-4 py-2 retro-border">
              <Zap className="h-5 w-5" />
              <span>INSTANT STAKES</span>
            </div>
            <div className="flex items-center gap-2 bg-black text-yellow-400 px-4 py-2 retro-border">
              <Coins className="h-5 w-5" />
              <span>BNB REWARDS</span>
            </div>
            <div className="flex items-center gap-2 bg-black text-red-400 px-4 py-2 retro-border">
              <Flame className="h-5 w-5" />
              <span>WEEKLY BATTLES</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/upload">
              <CustomButton variant="primary" className="text-xl px-8 py-4">
                <Upload className="mr-3 h-6 w-6" />
                UPLOAD MEME
              </CustomButton>
            </Link>
            <Link href="/explore">
              <CustomButton variant="secondary" className="text-xl px-8 py-4">
                EXPLORE MEMES
              </CustomButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
