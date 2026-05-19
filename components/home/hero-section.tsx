'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Search, ChevronDown, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'

const categories = ['General', 'OBC-NCL', 'SC', 'ST', 'EWS', 'PwD']
const genders = ['Male', 'Female', 'Other']
const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Gujarat', 'Rajasthan', 'UP', 'MP', 'Other']
const branches = ['Computer Science', 'Electronics', 'Electrical', 'Mechanical', 'Civil', 'Chemical', 'Any']

export function HeroSection() {
  const [rank, setRank] = useState('')
  const sectionRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const [particles, setParticles] = useState<{ left: string; top: string; translateZ: string; duration: number; delay: number }[]>([])

  useEffect(() => {
    setParticles(
      [...Array(15)].map(() => ({
        left: `${10 + Math.random() * 80}%`,
        top: `${10 + Math.random() * 80}%`,
        translateZ: `translateZ(${Math.random() * 100}px)`,
        duration: 5 + Math.random() * 5,
        delay: Math.random() * 5,
      }))
    )
  }, [])
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Parallax transforms for hero elements
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 300])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9])
  const formY = useTransform(scrollYProgress, [0, 1], [0, 200])
  const formRotateX = useTransform(scrollYProgress, [0, 0.5], [0, 10])
  
  // Smooth springs
  const smoothHeroY = useSpring(heroY, { stiffness: 100, damping: 30 })
  const smoothHeroOpacity = useSpring(heroOpacity, { stiffness: 100, damping: 30 })
  const smoothHeroScale = useSpring(heroScale, { stiffness: 100, damping: 30 })
  const smoothFormY = useSpring(formY, { stiffness: 100, damping: 30 })
  const smoothFormRotateX = useSpring(formRotateX, { stiffness: 100, damping: 30 })



  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      style={{ perspective: '1200px' }}
    >
      {/* 3D Floating Elements */}
      <div className="absolute inset-0 overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
        {/* Primary orb - front layer */}
        <motion.div
          className="absolute top-1/4 left-[10%] w-64 h-64 rounded-full"
          style={{
            background: 'radial-gradient(circle, oklch(0.65 0.22 275 / 0.2), transparent 70%)',
            filter: 'blur(40px)',
            transform: 'translateZ(50px)',
          }}
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* Secondary orb - middle layer */}
        <motion.div
          className="absolute bottom-1/3 right-[15%] w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, oklch(0.55 0.2 300 / 0.15), transparent 70%)',
            filter: 'blur(50px)',
            transform: 'translateZ(30px)',
          }}
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Accent orb - back layer */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, oklch(0.5 0.15 220 / 0.08), transparent 60%)',
            filter: 'blur(80px)',
            transform: 'translateZ(-50px)',
          }}
          animate={{ 
            scale: [1, 1.15, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />

        {/* Floating particles */}
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/30"
            style={{
              left: p.left,
              top: p.top,
              transform: p.translateZ,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Hero Content with 3D transforms */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <motion.div 
          className="text-center"
          style={{ 
            y: smoothHeroY, 
            opacity: smoothHeroOpacity,
            scale: smoothHeroScale,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-8"
            style={{ transform: 'translateZ(60px)' }}
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">AI-Powered College Intelligence</span>
          </motion.div>

          {/* Headline with 3D depth */}
          <motion.h1
            initial={{ opacity: 0, y: 40, rotateX: 15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance"
            style={{ transform: 'translateZ(40px)' }}
          >
            Your JEE Rank.{' '}
            <span className="gradient-text">Your Honest</span>
            <br />
            <span className="gradient-text">College Strategy.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto text-balance"
            style={{ transform: 'translateZ(20px)' }}
          >
            AI-powered college prediction, counseling guidance, and verified student insights for JEE aspirants.
          </motion.p>

          {/* Predictor Form with 3D tilt effect */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, y: 50, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="mt-10 max-w-4xl mx-auto"
            style={{ 
              y: smoothFormY,
              rotateX: smoothFormRotateX,
              transformStyle: 'preserve-3d',
            }}

          >
            <div className="glass-strong rounded-2xl p-6 sm:p-8 relative overflow-hidden">
              {/* Glow effect on form */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
              
              <div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative"
                style={{ transform: 'translateZ(10px)' }}
              >
                {/* Rank Input */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-muted-foreground mb-2 text-left">
                    JEE Main Rank
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="Enter your rank"
                      value={rank}
                      onChange={(e) => setRank(e.target.value)}
                      className="pl-10 h-12 bg-secondary/50 border-border/50 text-lg"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2 text-left">
                    Category
                  </label>
                  <Select defaultValue="General">
                    <SelectTrigger className="h-12 bg-secondary/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2 text-left">
                    Gender
                  </label>
                  <Select defaultValue="Male">
                    <SelectTrigger className="h-12 bg-secondary/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {genders.map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Home State */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-muted-foreground mb-2 text-left">
                    Home State
                  </label>
                  <Select defaultValue="Maharashtra">
                    <SelectTrigger className="h-12 bg-secondary/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Branch */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-muted-foreground mb-2 text-left">
                    Preferred Branch
                  </label>
                  <Select defaultValue="Computer Science">
                    <SelectTrigger className="h-12 bg-secondary/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* CTA Button */}
              <Link href="/predictor" className="block mt-6" style={{ transform: 'translateZ(20px)' }}>
                <Button 
                  size="lg" 
                  className="w-full h-14 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 glow-primary relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Find My Colleges
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="mt-16"
            style={{ transform: 'translateZ(10px)' }}
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex flex-col items-center gap-2 text-muted-foreground"
            >
              <span className="text-sm">Scroll to explore</span>
              <div className="relative">
                <ChevronDown className="h-5 w-5" />
                <motion.div
                  className="absolute inset-0 bg-primary/30 blur-lg"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
