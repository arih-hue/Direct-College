'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Target, 
  GitCompare, 
  Compass, 
  Users, 
  Calendar, 
  TrendingUp,
  GraduationCap,
  IndianRupee,
  MapPin,
  Clock,
  AlertCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { ChanceBadge } from '@/components/ui/chance-badge'
import { AnimatedCounter } from '@/components/ui/animated-counter'

// Mock user data
const userData = {
  name: 'Arjun',
  jeeRank: 8500,
  category: 'General',
  gender: 'Male',
  homeState: 'Maharashtra',
  preferredBranch: 'Computer Science',
  budget: 1500000,
}

const chanceAnalysis = {
  safe: 45,
  moderate: 32,
  dream: 18,
}

const deadlines = [
  { name: 'JoSAA Round 1 Registration', date: 'Jun 15', daysLeft: 12, type: 'JoSAA', important: true },
  { name: 'JoSAA Round 1 Choice Filling', date: 'Jun 20', daysLeft: 17, type: 'JoSAA', important: true },
  { name: 'CSAB Special Round', date: 'Jul 25', daysLeft: 52, type: 'CSAB', important: false },
]

const quickActions = [
  { icon: Target, label: 'Generate Strategy', href: '/strategy', gradient: 'from-emerald-500 to-teal-600' },
  { icon: GitCompare, label: 'Compare Colleges', href: '/compare', gradient: 'from-blue-500 to-cyan-600' },
  { icon: Compass, label: 'Explore Colleges', href: '/explore', gradient: 'from-purple-500 to-pink-600' },
  { icon: Users, label: 'Talk to a Senior', href: '/mentors', gradient: 'from-amber-500 to-orange-600' },
]

export default function DashboardPage() {
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
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  Welcome back, {userData.name}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                Your College Decision{' '}
                <span className="gradient-text">Dashboard</span>
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">
                Turn your JEE rank into a clear counseling strategy. Track deadlines, analyze chances, and make data-driven decisions.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <GlassCard variant="strong" hover={false} className="p-0 overflow-hidden">
                  <div className="p-6 border-b border-border/50">
                    <h2 className="text-lg font-semibold text-foreground">Profile Summary</h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <TrendingUp className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">JEE Rank</p>
                          <p className="text-lg font-semibold text-foreground">
                            #{userData.jeeRank.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                          <GraduationCap className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Branch</p>
                          <p className="text-lg font-semibold text-foreground">CSE</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                          <IndianRupee className="h-5 w-5 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Budget</p>
                          <p className="text-lg font-semibold text-foreground">15L</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                          <Users className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Category</p>
                          <p className="text-lg font-semibold text-foreground">{userData.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10">
                          <MapPin className="h-5 w-5 text-rose-400" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">State</p>
                          <p className="text-lg font-semibold text-foreground">MH</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Chance Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <GlassCard variant="strong" hover={false} className="p-0 overflow-hidden">
                  <div className="p-6 border-b border-border/50">
                    <h2 className="text-lg font-semibold text-foreground">Chance Analysis</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Based on your rank and preferences
                    </p>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-4">
                      {/* Safe */}
                      <div className="text-center p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <ChanceBadge type="SAFE" size="sm" className="mb-3" />
                        <div className="text-3xl font-bold text-emerald-400">
                          <AnimatedCounter value={chanceAnalysis.safe} />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">colleges</p>
                      </div>
                      {/* Moderate */}
                      <div className="text-center p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <ChanceBadge type="MODERATE" size="sm" className="mb-3" />
                        <div className="text-3xl font-bold text-amber-400">
                          <AnimatedCounter value={chanceAnalysis.moderate} />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">colleges</p>
                      </div>
                      {/* Dream */}
                      <div className="text-center p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                        <ChanceBadge type="DREAM" size="sm" className="mb-3" />
                        <div className="text-3xl font-bold text-rose-400">
                          <AnimatedCounter value={chanceAnalysis.dream} />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">colleges</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6">
                      <div className="flex h-4 rounded-full overflow-hidden bg-secondary">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-emerald-400"
                          style={{ width: `${(chanceAnalysis.safe / 95) * 100}%` }}
                        />
                        <div 
                          className="bg-gradient-to-r from-amber-500 to-amber-400"
                          style={{ width: `${(chanceAnalysis.moderate / 95) * 100}%` }}
                        />
                        <div 
                          className="bg-gradient-to-r from-rose-500 to-rose-400"
                          style={{ width: `${(chanceAnalysis.dream / 95) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>Total: {chanceAnalysis.safe + chanceAnalysis.moderate + chanceAnalysis.dream} colleges matched</span>
                        <Link href="/predictor" className="text-primary hover:underline">
                          View all predictions
                        </Link>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon
                    return (
                      <Link key={action.label} href={action.href}>
                        <motion.div
                          className="group p-4 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
                          whileHover={{ y: -4 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        >
                          <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} mb-3`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <p className="text-sm font-medium text-foreground">{action.label}</p>
                        </motion.div>
                      </Link>
                    )
                  })}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Deadlines */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <GlassCard variant="strong" hover={false} className="p-0 overflow-hidden">
                  <div className="p-5 border-b border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <h2 className="font-semibold text-foreground">Upcoming Deadlines</h2>
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    {deadlines.map((deadline, index) => (
                      <div 
                        key={deadline.name}
                        className="flex items-start gap-3 pb-4 border-b border-border/30 last:border-0 last:pb-0"
                      >
                        {/* Timeline indicator */}
                        <div className="flex flex-col items-center">
                          <div className={`h-3 w-3 rounded-full ${
                            deadline.important ? 'bg-primary animate-pulse' : 'bg-muted-foreground/50'
                          }`} />
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
                              <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
                            )}
                          </div>
                          <p className="text-sm font-medium text-foreground mt-1">
                            {deadline.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {deadline.date} • {deadline.daysLeft} days left
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-secondary/30 border-t border-border/50">
                    <Link href="/strategy">
                      <Button variant="ghost" size="sm" className="w-full group">
                        View All Deadlines
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Need Help Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="relative rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-90" />
                  <div className="relative p-6 text-center">
                    <Users className="h-10 w-10 text-white/90 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-white">Need Guidance?</h3>
                    <p className="text-sm text-white/80 mt-2">
                      Talk to a senior from your dream college and get personalized advice.
                    </p>
                    <Link href="/mentors">
                      <Button 
                        variant="secondary" 
                        className="mt-4 bg-white/20 hover:bg-white/30 text-white border-white/20"
                      >
                        Book a Session
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
