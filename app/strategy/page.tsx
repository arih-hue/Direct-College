'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Target, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  ChevronRight,
  Sparkles,
  BookOpen,
  ArrowRight,
  Info,
  Lightbulb
} from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { deadlines } from '@/data/mock'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const counselingStages = [
  {
    id: 'josaa',
    name: 'JoSAA Counseling',
    description: 'Joint Seat Allocation Authority for IITs, NITs, IIITs, and GFTIs',
    rounds: 6,
    status: 'upcoming',
    tips: [
      'Fill all 6 rounds of choices - you can modify until each deadline',
      'Keep a mix of safe, moderate, and dream colleges',
      'Consider branch vs college trade-off carefully',
    ],
  },
  {
    id: 'csab',
    name: 'CSAB Special Round',
    description: 'For vacant seats in NITs, IIITs, and GFTIs after JoSAA',
    rounds: 2,
    status: 'upcoming',
    tips: [
      'Good opportunity if you missed JoSAA seats',
      'Seats are limited but competition is also lower',
      'Consider state quota seats for better chances',
    ],
  },
  {
    id: 'state',
    name: 'State Counseling',
    description: 'State-level counseling for state colleges and private institutions',
    rounds: 3,
    status: 'upcoming',
    tips: [
      'Keep state counseling as backup option',
      'Some state colleges have excellent placement records',
      'Fee structure is usually lower than private colleges',
    ],
  },
]

const strategyTips = [
  {
    icon: Target,
    title: 'Branch vs College',
    description: 'For top 10K rank, prioritize IITs with any branch. For 10K-50K, focus on branch at good NITs/IIITs.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: AlertTriangle,
    title: 'Common Mistakes',
    description: 'Not filling enough choices, ignoring home state quota, and last-minute rush are the biggest mistakes.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Sparkles,
    title: 'AI Recommendation',
    description: 'Based on your rank, we recommend focusing on NITs and top IIITs for CS/IT branches.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
]

const priorityList = [
  { college: 'IIT Bombay', branch: 'Electrical Engineering', chance: 'MODERATE' },
  { college: 'IIT Delhi', branch: 'Chemical Engineering', chance: 'MODERATE' },
  { college: 'NIT Trichy', branch: 'Computer Science', chance: 'SAFE' },
  { college: 'NIT Warangal', branch: 'Computer Science', chance: 'SAFE' },
  { college: 'IIIT Hyderabad', branch: 'Computer Science', chance: 'DREAM' },
]

export default function StrategyPage() {
  const [activeStage, setActiveStage] = useState('josaa')

  const getDaysUntil = (date: Date) => {
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-20 pb-12">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 mesh-gradient opacity-50" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                  <Target className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  Counseling Strategy
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                Build Your <span className="gradient-text">Winning Strategy</span>
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">
                Navigate JEE counseling with confidence. Track deadlines, build your priority list, and get AI-powered recommendations.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Strategy Tips */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {strategyTips.map((tip, index) => {
                    const Icon = tip.icon
                    return (
                      <GlassCard 
                        key={tip.title} 
                        variant="strong" 
                        className="p-5"
                      >
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl mb-3",
                          tip.bg
                        )}>
                          <Icon className={cn("h-5 w-5", tip.color)} />
                        </div>
                        <h3 className="font-semibold text-foreground">{tip.title}</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          {tip.description}
                        </p>
                      </GlassCard>
                    )
                  })}
                </div>
              </motion.div>

              {/* Counseling Roadmap */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <GlassCard variant="strong" hover={false} className="p-0 overflow-hidden">
                  <div className="p-6 border-b border-border/50">
                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Counseling Roadmap
                    </h2>
                  </div>
                  
                  {/* Stage Tabs */}
                  <div className="flex border-b border-border/50">
                    {counselingStages.map((stage) => (
                      <button
                        key={stage.id}
                        onClick={() => setActiveStage(stage.id)}
                        className={cn(
                          "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                          activeStage === stage.id
                            ? "text-primary border-b-2 border-primary"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {stage.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>

                  {/* Stage Content */}
                  {counselingStages.map((stage) => (
                    stage.id === activeStage && (
                      <div key={stage.id} className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">
                              {stage.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {stage.description}
                            </p>
                          </div>
                          <span className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary">
                            {stage.rounds} Rounds
                          </span>
                        </div>

                        {/* Tips */}
                        <div className="space-y-3 mt-6">
                          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-amber-400" />
                            Pro Tips
                          </h4>
                          {stage.tips.map((tip, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50">
                              <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
                              <span className="text-sm text-muted-foreground">{tip}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </GlassCard>
              </motion.div>

              {/* Priority List Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <GlassCard variant="strong" hover={false} className="p-0 overflow-hidden">
                  <div className="p-6 border-b border-border/50 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">Your Priority List</h2>
                    <Link href="/predictor">
                      <Button variant="outline" size="sm">
                        Edit List
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      {priorityList.map((item, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold text-sm">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{item.college}</p>
                            <p className="text-sm text-muted-foreground">{item.branch}</p>
                          </div>
                          <span className={cn(
                            "px-3 py-1 text-xs rounded-full font-medium",
                            item.chance === 'SAFE' && "bg-emerald-500/20 text-emerald-400",
                            item.chance === 'MODERATE' && "bg-amber-500/20 text-amber-400",
                            item.chance === 'DREAM' && "bg-rose-500/20 text-rose-400",
                          )}>
                            {item.chance}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Deadlines */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <GlassCard variant="strong" hover={false} className="p-0 overflow-hidden">
                  <div className="p-5 border-b border-border/50">
                    <h2 className="font-semibold text-foreground flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Upcoming Deadlines
                    </h2>
                  </div>
                  <div className="p-5 space-y-4">
                    {deadlines.map((deadline, index) => (
                      <div 
                        key={deadline.id}
                        className="flex items-start gap-3 pb-4 border-b border-border/30 last:border-0 last:pb-0"
                      >
                        <div className="flex flex-col items-center">
                          <div className={cn(
                            "h-3 w-3 rounded-full",
                            deadline.important ? "bg-primary animate-pulse" : "bg-muted-foreground/50"
                          )} />
                          {index < deadlines.length - 1 && (
                            <div className="w-0.5 h-12 bg-border/50 mt-1" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                              {deadline.type}
                            </span>
                            {deadline.important && (
                              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                            )}
                          </div>
                          <p className="text-sm font-medium text-foreground mt-1">
                            {deadline.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {getDaysUntil(deadline.date)} days left
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>

              {/* Help Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="relative rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-90" />
                  <div className="relative p-6 text-center">
                    <Info className="h-10 w-10 text-white/90 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-white">Need Help?</h3>
                    <p className="text-sm text-white/80 mt-2">
                      Book a 1:1 session with an expert mentor for personalized guidance.
                    </p>
                    <Link href="/mentors">
                      <Button 
                        variant="secondary" 
                        className="mt-4 bg-white/20 hover:bg-white/30 text-white border-white/20"
                      >
                        Talk to Expert
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}
