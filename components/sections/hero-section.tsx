import { HeroHeader } from "@/components/hero/hero-header"
import { FeatureBadges } from "@/components/hero/feature-badges"
import { HeroCTAButtons } from "@/components/hero/hero-cta-buttons"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <HeroHeader />
          <FeatureBadges />
          <HeroCTAButtons />
        </div>
      </div>
    </section>
  )
}
