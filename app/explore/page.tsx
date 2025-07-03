import { MemeGridSection } from "@/components/sections/meme-grid-section"

export default function ExplorePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4">
          EXPLORE <span className="text-yellow-400">MEMES</span>
        </h1>
        <p className="text-xl font-bold text-gray-400 max-w-2xl mx-auto">
          Discover the hottest memes, stake on your favorites, and watch them battle for the crown! 🔥
        </p>
      </div>

      <MemeGridSection />
    </div>
  )
}
