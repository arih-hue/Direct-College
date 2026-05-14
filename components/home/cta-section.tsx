'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 0.5], [100, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [20, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1])
  
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 })
  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 })
  const smoothRotateX = useSpring(rotateX, { stiffness: 100, damping: 30 })
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 })

  return (
    <section 
      ref={sectionRef}
      className="py-20 lg:py-32 relative overflow-hidden"
      style={{ perspective: '1500px' }}
    >
      {/* 3D Background Effects */}
      <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
        {/* Primary glow */}
        <motion.div
          className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, oklch(0.6 0.22 275 / 0.2), transparent 70%)',
            filter: 'blur(80px)',
            transform: 'translateZ(-100px)',
          }}
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* Secondary glow */}
        <motion.div
          className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, oklch(0.55 0.2 300 / 0.15), transparent 70%)',
            filter: 'blur(60px)',
            transform: 'translateZ(-150px)',
          }}
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              background: `oklch(0.65 0.2 ${260 + Math.random() * 40} / ${0.3 + Math.random() * 0.3})`,
              transform: `translateZ(${-50 + Math.random() * 100}px)`,
            }}
            animate={{
              y: [0, -80 - Math.random() * 40, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          style={{ 
            y: smoothY, 
            opacity: smoothOpacity,
            rotateX: smoothRotateX,
            scale: smoothScale,
            transformStyle: 'preserve-3d',
          }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-8 relative overflow-hidden"
            style={{ transform: 'translateZ(40px)' }}
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">Start Your Journey Today</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 hover:opacity-100 transition-opacity"
            />
          </motion.div>

          {/* Headline with 3D depth */}
          <h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance"
            style={{ transform: 'translateZ(30px)' }}
          >
            Ready to find your{' '}
            <span className="gradient-text">dream college?</span>
          </h2>

          {/* Description */}
          <p 
            className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto"
            style={{ transform: 'translateZ(20px)' }}
          >
            Join 50,000+ JEE aspirants who made smarter college decisions with DirectCollege. 
            Get AI-powered predictions, build your strategy, and secure your future.
          </p>

          {/* CTA Buttons with 3D effect */}
          <motion.div 
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            style={{ transform: 'translateZ(50px)' }}
          >
            <Link href="/predictor">
              <motion.div
                whileHover={{ scale: 1.05, translateZ: 10 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  size="lg" 
                  className="h-14 px-8 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 glow-primary relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center">
                    Find My Colleges
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-accent to-primary"
                    initial={{ x: '100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Button>
              </motion.div>
            </Link>
            <Link href="/explore">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-14 px-8 text-lg relative overflow-hidden group"
                >
                  <span className="relative z-10">Explore Colleges</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Trust Note */}
          <p 
            className="mt-8 text-sm text-muted-foreground"
            style={{ transform: 'translateZ(10px)' }}
          >
            Free to use • No signup required • Updated for JoSAA 2025
          </p>
        </motion.div>
      </div>
    </section>
  )
}
