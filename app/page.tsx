import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/home/hero-section'
import { TrustStrip } from '@/components/home/trust-strip'
import { FeaturesSection } from '@/components/home/features-section'
import { CollegeShowcase } from '@/components/home/college-showcase'
import { ReviewsPreview } from '@/components/home/reviews-preview'
import { CTASection } from '@/components/home/cta-section'
import { CinematicBackground } from '@/components/home/cinematic-background'

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      {/* Cinematic parallax background */}
      <CinematicBackground />
      
      {/* Content layer */}
      <div className="relative z-10">
        <Navbar />
        <main>
          <HeroSection />
          <TrustStrip />
          <FeaturesSection />
          <CollegeShowcase />
          <ReviewsPreview />
          <CTASection />
        </main>
        <Footer />
      </div>
    </div>
  )
}
