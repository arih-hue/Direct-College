'use client'

import { useRef, ReactNode, createContext, useContext } from 'react'
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion'

interface Scroll3DContextType {
  scrollYProgress: MotionValue<number>
  scrollY: MotionValue<number>
}

const Scroll3DContext = createContext<Scroll3DContextType | null>(null)

export function useScroll3D() {
  const context = useContext(Scroll3DContext)
  if (!context) {
    throw new Error('useScroll3D must be used within a Scroll3DProvider')
  }
  return context
}

interface Scroll3DProviderProps {
  children: ReactNode
}

export function Scroll3DProvider({ children }: Scroll3DProviderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress, scrollY } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <Scroll3DContext.Provider value={{ scrollYProgress, scrollY }}>
      <div ref={containerRef} className="relative">
        {children}
      </div>
    </Scroll3DContext.Provider>
  )
}

interface ParallaxLayerProps {
  children: ReactNode
  speed?: number
  className?: string
  direction?: 'up' | 'down'
}

export function ParallaxLayer({ 
  children, 
  speed = 0.5, 
  className = '',
  direction = 'up'
}: ParallaxLayerProps) {
  const { scrollY } = useScroll3D()
  const multiplier = direction === 'up' ? -1 : 1
  const y = useTransform(scrollY, [0, 1000], [0, 300 * speed * multiplier])
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 })

  return (
    <motion.div style={{ y: smoothY }} className={className}>
      {children}
    </motion.div>
  )
}

interface Float3DProps {
  children: ReactNode
  depth?: number
  className?: string
}

export function Float3D({ children, depth = 1, className = '' }: Float3DProps) {
  const { scrollYProgress } = useScroll3D()
  const z = useTransform(scrollYProgress, [0, 1], [0, 50 * depth])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.02 * depth, 1])
  const smoothZ = useSpring(z, { stiffness: 100, damping: 30 })
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 })

  return (
    <motion.div 
      style={{ 
        z: smoothZ,
        scale: smoothScale,
        transformStyle: 'preserve-3d',
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface ScrollReveal3DProps {
  children: ReactNode
  className?: string
  rotateX?: number
  rotateY?: number
  translateZ?: number
  delay?: number
}

export function ScrollReveal3D({ 
  children, 
  className = '',
  rotateX = 15,
  rotateY = 0,
  translateZ = 50,
  delay = 0
}: ScrollReveal3DProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const rotX = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [rotateX, 0, 0, -rotateX])
  const rotY = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [rotateY, 0, 0, -rotateY])
  const transZ = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [-translateZ, 0, 0, -translateZ])
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -100])

  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 })
  const smoothRotX = useSpring(rotX, { stiffness: 100, damping: 30 })
  const smoothRotY = useSpring(rotY, { stiffness: 100, damping: 30 })
  const smoothTransZ = useSpring(transZ, { stiffness: 100, damping: 30 })
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 })

  return (
    <motion.div
      ref={ref}
      style={{
        opacity: smoothOpacity,
        rotateX: smoothRotX,
        rotateY: smoothRotY,
        translateZ: smoothTransZ,
        y: smoothY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface TiltCardProps {
  children: ReactNode
  className?: string
  intensity?: number
}

export function TiltCard({ children, className = '', intensity = 10 }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -intensity
    const rotateY = ((x - centerX) / centerX) * intensity
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ease-out ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  )
}

interface DepthLayerProps {
  children: ReactNode
  depth: number
  className?: string
}

export function DepthLayer({ children, depth, className = '' }: DepthLayerProps) {
  return (
    <div 
      className={className}
      style={{ 
        transform: `translateZ(${depth * 20}px)`,
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  )
}

interface StickySection3DProps {
  children: ReactNode
  className?: string
  height?: string
}

export function StickySection3D({ 
  children, 
  className = '',
  height = '200vh'
}: StickySection3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <div ref={containerRef} style={{ height }} className="relative">
      <div className={`sticky top-0 h-screen overflow-hidden ${className}`}>
        {children}
      </div>
    </div>
  )
}
