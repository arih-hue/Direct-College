'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { 
  Brain, 
  Target, 
  GitCompare, 
  Eye, 
  TrendingUp, 
  Users,
  LucideIcon
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { cn } from '@/lib/utils'

const features = [
  {
    icon: Brain,
    title: 'AI Rank Predictor',
    description: 'Get instant college predictions based on your JEE rank with 95% accuracy using 5 years of historical data.',
    gradient: 'from-indigo-500 to-purple-600',
  },
  {
    icon: Target,
    title: 'Counseling Strategy Engine',
    description: 'Build your personalized choice filling strategy with smart recommendations and deadline alerts.',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    icon: GitCompare,
    title: 'College Comparison',
    description: 'Compare colleges side-by-side on placements, fees, campus life, and ROI to make informed decisions.',
    gradient: 'from-blue-500 to-cyan-600',
  },
  {
    icon: Eye,
    title: 'Reality View Reviews',
    description: 'Read honest, verified reviews from current students. No sugar-coating, just real experiences.',
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    icon: TrendingUp,
    title: 'ROI Analysis',
    description: 'Calculate your return on investment with fee vs salary projections and payback estimations.',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    icon: Users,
    title: 'Mentor Connect',
    description: 'Book 1:1 sessions with current students and alumni for personalized guidance and insights.',
    gradient: 'from-violet-500 to-purple-600',
  },
]

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const headerY = useTransform(scrollYProgress, [0, 0.3], [100, 0])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])
  const smoothHeaderY = useSpring(headerY, { stiffness: 100, damping: 30 })
  const smoothHeaderOpacity = useSpring(headerOpacity, { stiffness: 100, damping: 30 })

  return (
    <section 
      ref={sectionRef}
      className="py-20 lg:py-32 relative overflow-hidden"
      style={{ perspective: '1500px' }}
    >
      {/* 3D Background grid */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, oklch(0.95 0.01 260) 1px, transparent 1px),
            linear-gradient(to bottom, oklch(0.95 0.01 260) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          transform: 'rotateX(60deg) translateY(-50%)',
          transformOrigin: 'center top',
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Header with 3D entrance */}
        <motion.div
          style={{ 
            y: smoothHeaderY, 
            opacity: smoothHeaderOpacity,
            transformStyle: 'preserve-3d',
          }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold text-foreground"
            style={{ transform: 'translateZ(30px)' }}
          >
            Everything you need for{' '}
            <span className="gradient-text">smart college decisions</span>
          </motion.h2>
          <motion.p 
            className="mt-4 text-lg text-muted-foreground"
            style={{ transform: 'translateZ(20px)' }}
          >
            From AI predictions to verified reviews, we provide all the tools and insights 
            you need to navigate JEE counseling with confidence.
          </motion.p>
        </motion.div>

        {/* Features Grid with 3D cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Feature3DCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              gradient={feature.gradient}
              index={index}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

interface Feature3DCardProps {
  icon: LucideIcon
  title: string
  description: string
  gradient: string
  index: number
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']
}

function Feature3DCard({ 
  icon: Icon, 
  title, 
  description, 
  gradient, 
  index,
  scrollYProgress 
}: Feature3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  
  // Staggered animation based on index
  const row = Math.floor(index / 3)
  const startOffset = 0.1 + row * 0.15
  
  const y = useTransform(scrollYProgress, [startOffset, startOffset + 0.2], [80, 0])
  const opacity = useTransform(scrollYProgress, [startOffset, startOffset + 0.15], [0, 1])
  const rotateX = useTransform(scrollYProgress, [startOffset, startOffset + 0.2], [25, 0])
  const scale = useTransform(scrollYProgress, [startOffset, startOffset + 0.2], [0.9, 1])
  
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 })
  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 })
  const smoothRotateX = useSpring(rotateX, { stiffness: 100, damping: 30 })
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 })

  // Mouse tracking for 3D tilt
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    mouseX.set(x / 15)
    mouseY.set(-y / 15)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const smoothMouseX = useSpring(mouseX, { stiffness: 200, damping: 25 })
  const smoothMouseY = useSpring(mouseY, { stiffness: 200, damping: 25 })

  return (
    <motion.div
      ref={cardRef}
      style={{
        y: smoothY,
        opacity: smoothOpacity,
        rotateX: smoothRotateX,
        scale: smoothScale,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group"
    >
      <motion.div
        style={{
          rotateX: smoothMouseY,
          rotateY: smoothMouseX,
          transformStyle: 'preserve-3d',
        }}
      >
        <GlassCard 
          variant="strong" 
          className="p-6 h-full relative overflow-hidden transition-all duration-300 group-hover:border-primary/30"
        >
          {/* Hover glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
          
          {/* Icon with 3D depth */}
          <div 
            className={cn(
              'h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 relative',
              gradient
            )}
            style={{ transform: 'translateZ(30px)' }}
          >
            <Icon className="h-6 w-6 text-white" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
          </div>

          {/* Title */}
          <h3 
            className="text-lg font-semibold text-foreground mb-2 relative"
            style={{ transform: 'translateZ(20px)' }}
          >
            {title}
          </h3>

          {/* Description */}
          <p 
            className="text-sm text-muted-foreground relative"
            style={{ transform: 'translateZ(10px)' }}
          >
            {description}
          </p>

          {/* Decorative corner glow */}
          <div 
            className={cn(
              'absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-20 transition-opacity blur-3xl bg-gradient-to-br',
              gradient
            )}
          />
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}
