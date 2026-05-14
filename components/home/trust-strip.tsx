'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { Building, Database, MessageSquare, Users } from 'lucide-react'
import { AnimatedCounter } from '@/components/ui/animated-counter'

const stats = [
  { icon: Building, value: 450, suffix: '+', label: 'Colleges' },
  { icon: Database, value: 5, suffix: ' Years', label: 'of Data' },
  { icon: MessageSquare, value: 12000, suffix: '+', label: 'Reviews' },
  { icon: Users, value: 50000, suffix: '+', label: 'Students Trust Us' },
]

export function TrustStrip() {
  const sectionRef = useRef<HTMLElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.3], [40, 0])
  
  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 })
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 })

  return (
    <section 
      ref={sectionRef}
      className="relative py-12 border-y border-border/50 bg-secondary/30 overflow-hidden"
      style={{ perspective: '1000px' }}
    >
      {/* Subtle animated gradient line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
      
      <motion.div 
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        style={{ opacity: smoothOpacity, y: smoothY }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard3D key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </motion.div>
      
      {/* Bottom gradient line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
        animate={{ x: ['100%', '-100%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
    </section>
  )
}

interface StatCard3DProps {
  stat: typeof stats[0]
  index: number
}

function StatCard3D({ stat, index }: StatCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const Icon = stat.icon
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    mouseX.set(x / 10)
    mouseY.set(-y / 10)
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
      initial={{ opacity: 0, y: 30, rotateX: 15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="flex flex-col items-center text-center cursor-default"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <motion.div
        style={{
          rotateX: smoothMouseY,
          rotateY: smoothMouseX,
          transformStyle: 'preserve-3d',
        }}
        className="flex flex-col items-center"
      >
        <motion.div 
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 mb-3 relative"
          style={{ transform: 'translateZ(20px)' }}
          whileHover={{ scale: 1.1 }}
        >
          <Icon className="h-6 w-6 text-primary" />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent" />
        </motion.div>
        <div 
          className="text-2xl sm:text-3xl font-bold text-foreground"
          style={{ transform: 'translateZ(15px)' }}
        >
          <AnimatedCounter value={stat.value} suffix={stat.suffix} />
        </div>
        <p 
          className="text-sm text-muted-foreground mt-1"
          style={{ transform: 'translateZ(10px)' }}
        >
          {stat.label}
        </p>
      </motion.div>
    </motion.div>
  )
}
