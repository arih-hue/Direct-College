'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface FloatingElement {
  id: string
  x: number
  y: number
  depth: number
  scale: number
  rotation: number
  opacity: number
  content: React.ReactNode
  floatAmplitude?: number
  floatFrequency?: number
}

export function CinematicBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 30 })
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 30 })

  // Floating STEM elements
  const floatingElements: FloatingElement[] = [
    // Mathematical formulas
    { id: 'formula1', x: 0.08, y: 0.15, depth: 3, scale: 1, rotation: -5, opacity: 0.4, content: <span className="text-2xl font-mono text-cyan-400/60">E = mc²</span> },
    { id: 'formula2', x: 0.85, y: 0.12, depth: 4, scale: 0.9, rotation: 8, opacity: 0.35, content: <span className="text-xl font-mono text-purple-400/50">∫f(x)dx</span> },
    { id: 'formula3', x: 0.12, y: 0.75, depth: 2, scale: 1.1, rotation: -3, opacity: 0.3, content: <span className="text-lg font-mono text-blue-400/50">F = ma</span> },
    { id: 'formula4', x: 0.92, y: 0.65, depth: 5, scale: 0.8, rotation: 12, opacity: 0.4, content: <span className="text-xl font-mono text-indigo-400/60">∇×E = -∂B/∂t</span> },
    { id: 'formula5', x: 0.05, y: 0.45, depth: 6, scale: 0.7, rotation: -8, opacity: 0.35, content: <span className="text-lg font-mono text-cyan-300/50">PV = nRT</span> },
    
    // Geometric shapes
    { id: 'hex1', x: 0.15, y: 0.25, depth: 7, scale: 1, rotation: 0, opacity: 0.2, floatAmplitude: 10, floatFrequency: 0.02, content: <HexagonShape className="w-16 h-16 text-purple-500/30" /> },
    { id: 'hex2', x: 0.88, y: 0.35, depth: 4, scale: 0.8, rotation: 30, opacity: 0.25, floatAmplitude: 8, floatFrequency: 0.015, content: <HexagonShape className="w-12 h-12 text-cyan-500/25" /> },
    { id: 'circle1', x: 0.75, y: 0.8, depth: 3, scale: 1.2, rotation: 0, opacity: 0.15, floatAmplitude: 12, floatFrequency: 0.018, content: <CircleShape className="w-20 h-20 text-indigo-500/20" /> },
    { id: 'triangle1', x: 0.2, y: 0.6, depth: 5, scale: 0.9, rotation: 15, opacity: 0.2, floatAmplitude: 6, floatFrequency: 0.025, content: <TriangleShape className="w-14 h-14 text-blue-500/25" /> },
    
    // Circuit nodes
    { id: 'node1', x: 0.35, y: 0.1, depth: 8, scale: 0.6, rotation: 0, opacity: 0.5, content: <CircuitNode /> },
    { id: 'node2', x: 0.65, y: 0.85, depth: 6, scale: 0.5, rotation: 0, opacity: 0.4, content: <CircuitNode /> },
    { id: 'node3', x: 0.95, y: 0.5, depth: 4, scale: 0.7, rotation: 0, opacity: 0.45, content: <CircuitNode /> },
    
    // Atoms
    { id: 'atom1', x: 0.08, y: 0.88, depth: 5, scale: 1, rotation: 0, opacity: 0.3, floatAmplitude: 5, floatFrequency: 0.03, content: <AtomIcon className="w-10 h-10 text-cyan-400/40" /> },
    { id: 'atom2', x: 0.78, y: 0.15, depth: 7, scale: 0.8, rotation: 0, opacity: 0.25, floatAmplitude: 7, floatFrequency: 0.02, content: <AtomIcon className="w-8 h-8 text-purple-400/35" /> },

    // Data particles
    { id: 'particle1', x: 0.25, y: 0.35, depth: 9, scale: 0.4, rotation: 0, opacity: 0.6, content: <DataParticle /> },
    { id: 'particle2', x: 0.55, y: 0.2, depth: 10, scale: 0.3, rotation: 0, opacity: 0.5, content: <DataParticle /> },
    { id: 'particle3', x: 0.45, y: 0.75, depth: 8, scale: 0.5, rotation: 0, opacity: 0.55, content: <DataParticle /> },
    { id: 'particle4', x: 0.7, y: 0.55, depth: 11, scale: 0.35, rotation: 0, opacity: 0.45, content: <DataParticle /> },
  ]

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        })
        setIsMobile(window.innerWidth < 768)
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to -1 to 1
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      mouseX.set(x)
      mouseY.set(y)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {/* Main background image layer */}
      <motion.div
        className="absolute inset-0"
        style={{
          x: useSpring(useMotionValue(0), { stiffness: 30, damping: 30 }),
          y: useSpring(useMotionValue(0), { stiffness: 30, damping: 30 }),
        }}
      >
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/images/jee-background.png)',
            backgroundSize: isMobile ? 'auto 100%' : 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: isMobile ? 0.25 : 0.35,
            transform: 'scale(1.05)',
          }}
        />
      </motion.div>

      {/* Dark cinematic overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 120% 80% at 50% 50%, 
              rgba(2, 6, 23, 0.5) 0%, 
              rgba(2, 6, 23, 0.75) 100%,
              rgba(2, 6, 23, 0.9) 100%
            )
          `,
        }}
      />

      {/* Animated fog/gradient layer */}
      <motion.div
        className="absolute inset-0 opacity-60"
        animate={{
          background: [
            'radial-gradient(ellipse 80% 60% at 20% 30%, rgba(99, 102, 241, 0.08), transparent 70%)',
            'radial-gradient(ellipse 80% 60% at 80% 70%, rgba(99, 102, 241, 0.08), transparent 70%)',
            'radial-gradient(ellipse 80% 60% at 20% 30%, rgba(99, 102, 241, 0.08), transparent 70%)',
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating STEM elements with parallax */}
      {floatingElements.map((element) => (
        <FloatingObject
          key={element.id}
          element={element}
          mouseX={smoothMouseX}
          mouseY={smoothMouseY}
          dimensions={dimensions}
        />
      ))}

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(99, 102, 241, 0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 0%, rgba(2, 6, 23, 0.6) 100%)',
        }}
      />

      {/* Bottom gradient for content readability */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-96 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(2, 6, 23, 0.95) 0%, transparent 100%)',
        }}
      />
    </div>
  )
}

// Floating object component with parallax movement
function FloatingObject({ 
  element, 
  mouseX, 
  mouseY, 
  dimensions 
}: { 
  element: FloatingElement
  mouseX: ReturnType<typeof useSpring>
  mouseY: ReturnType<typeof useSpring>
  dimensions: { width: number; height: number }
}) {
  const parallaxCoeff = 15
  const floatRef = useRef(0)
  const [floatOffset, setFloatOffset] = useState(0)

  // Floating animation
  useEffect(() => {
    if (!element.floatAmplitude) return
    
    let animationId: number
    const animate = () => {
      floatRef.current += element.floatFrequency || 0.02
      setFloatOffset(Math.sin(floatRef.current) * (element.floatAmplitude || 0))
      animationId = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(animationId)
  }, [element.floatAmplitude, element.floatFrequency])

  const baseX = element.x * dimensions.width
  const baseY = element.y * dimensions.height

  return (
    <motion.div
      className="absolute"
      style={{
        left: baseX,
        top: baseY,
        x: useSpring(
          useMotionValue(-mouseX.get() * element.depth * parallaxCoeff),
          { stiffness: 50, damping: 20 }
        ),
        y: floatOffset + useSpring(
          useMotionValue(mouseY.get() * element.depth * parallaxCoeff),
          { stiffness: 50, damping: 20 }
        ).get(),
        scale: element.scale,
        rotate: element.rotation,
        opacity: element.opacity,
      }}
      animate={{
        x: -mouseX.get() * element.depth * parallaxCoeff,
        y: mouseY.get() * element.depth * parallaxCoeff + floatOffset,
      }}
      transition={{ type: 'spring', stiffness: 50, damping: 20 }}
    >
      {element.content}
    </motion.div>
  )
}

// SVG Components for floating elements
function HexagonShape({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="1">
      <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" />
    </svg>
  )
}

function CircleShape({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="50" cy="50" r="45" />
      <circle cx="50" cy="50" r="30" opacity="0.5" />
    </svg>
  )
}

function TriangleShape({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="1">
      <polygon points="50,10 90,90 10,90" />
    </svg>
  )
}

function CircuitNode() {
  return (
    <div className="relative">
      <div className="w-3 h-3 rounded-full bg-cyan-500/50 animate-pulse" />
      <div className="absolute inset-0 w-3 h-3 rounded-full bg-cyan-400/30 animate-ping" />
    </div>
  )
}

function AtomIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="50" cy="50" rx="45" ry="15" transform="rotate(0 50 50)" />
      <ellipse cx="50" cy="50" rx="45" ry="15" transform="rotate(60 50 50)" />
      <ellipse cx="50" cy="50" rx="45" ry="15" transform="rotate(-60 50 50)" />
      <circle cx="50" cy="50" r="6" fill="currentColor" />
    </svg>
  )
}

function DataParticle() {
  return (
    <motion.div
      className="w-2 h-2 rounded-full bg-indigo-400/60"
      animate={{
        opacity: [0.3, 0.8, 0.3],
        scale: [0.8, 1.2, 0.8],
      }}
      transition={{
        duration: 2 + Math.random() * 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}
