'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { ReviewCard } from '@/components/cards/review-card'
import { reviews } from '@/data/mock'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, MessageSquare } from 'lucide-react'

export function ReviewsPreview() {
  const sectionRef = useRef<HTMLElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const headerY = useTransform(scrollYProgress, [0, 0.3], [60, 0])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])
  const headerRotateX = useTransform(scrollYProgress, [0, 0.3], [12, 0])
  
  const smoothHeaderY = useSpring(headerY, { stiffness: 100, damping: 30 })
  const smoothHeaderOpacity = useSpring(headerOpacity, { stiffness: 100, damping: 30 })
  const smoothHeaderRotateX = useSpring(headerRotateX, { stiffness: 100, damping: 30 })

  return (
    <section 
      ref={sectionRef}
      className="py-20 lg:py-32 relative overflow-hidden"
      style={{ perspective: '1500px' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <motion.div
            style={{ 
              y: smoothHeaderY, 
              opacity: smoothHeaderOpacity,
              rotateX: smoothHeaderRotateX,
              transformStyle: 'preserve-3d',
            }}
            className="max-w-2xl"
          >
            <div 
              className="flex items-center gap-2 mb-4"
              style={{ transform: 'translateZ(30px)' }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary">Reality View Reviews</span>
            </div>
            <h2 
              className="text-3xl sm:text-4xl font-bold text-foreground"
              style={{ transform: 'translateZ(20px)' }}
            >
              Hear from <span className="gradient-text">real students</span>
            </h2>
            <p 
              className="mt-4 text-lg text-muted-foreground"
              style={{ transform: 'translateZ(10px)' }}
            >
              No sugar-coating. Read honest reviews about placements, campus life, and academics 
              from verified students.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link href="/reviews">
              <Button variant="outline" className="group">
                View All Reviews
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Reviews Grid with 3D cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review, index) => (
            <ReviewCard3DWrapper 
              key={review.id} 
              review={review} 
              index={index}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

interface ReviewCard3DWrapperProps {
  review: typeof reviews[0]
  index: number
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']
}

function ReviewCard3DWrapper({ review, index, scrollYProgress }: ReviewCard3DWrapperProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  
  const col = index % 2
  const row = Math.floor(index / 2)
  const delay = col * 0.1 + row * 0.1
  const startOffset = 0.15 + delay
  
  const y = useTransform(scrollYProgress, [startOffset, startOffset + 0.2], [80, 0])
  const opacity = useTransform(scrollYProgress, [startOffset, startOffset + 0.15], [0, 1])
  const rotateX = useTransform(scrollYProgress, [startOffset, startOffset + 0.2], [18, 0])
  const rotateY = useTransform(scrollYProgress, [startOffset, startOffset + 0.2], [(col === 0 ? -8 : 8), 0])
  const scale = useTransform(scrollYProgress, [startOffset, startOffset + 0.2], [0.9, 1])
  
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 })
  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 })
  const smoothRotateX = useSpring(rotateX, { stiffness: 100, damping: 30 })
  const smoothRotateY = useSpring(rotateY, { stiffness: 100, damping: 30 })
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 })

  // Mouse tracking for 3D tilt
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    mouseX.set(x / 20)
    mouseY.set(-y / 20)
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
        rotateY: smoothRotateY,
        scale: smoothScale,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX: smoothMouseY,
          rotateY: smoothMouseX,
          transformStyle: 'preserve-3d',
        }}
      >
        <ReviewCard review={review} />
      </motion.div>
    </motion.div>
  )
}
