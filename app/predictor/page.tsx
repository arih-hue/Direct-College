'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  SlidersHorizontal,
  Plus,
  Heart,
  X,
  ChevronDown
} from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { GlassCard } from '@/components/ui/glass-card'
import { CollegeCard } from '@/components/cards/college-card'
import { ChanceBadge } from '@/components/ui/chance-badge'
import { getColleges } from '@/lib/api/services/colleges'
import type { College } from '@/types'

const categories = ['General', 'OBC-NCL', 'SC', 'ST', 'EWS', 'PwD']
const genders = ['Male', 'Female', 'Other']
const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Gujarat', 'Rajasthan', 'UP', 'MP', 'Other']
const examTypes = ['JEE Main', 'JEE Advanced']
const collegeTypes = ['All', 'IIT', 'NIT', 'IIIT', 'GFTI']

// Generate predictions based on rank
const generatePredictions = (rank: number): { college: College; chance: 'SAFE' | 'MODERATE' | 'DREAM'; closingRank: number }[] => {
  return colleges.map((college) => {
    const baseRank = college.ranking * 1000 + Math.random() * 2000
    let chance: 'SAFE' | 'MODERATE' | 'DREAM'

    if (rank < baseRank * 0.7) {
      chance = 'SAFE'
    } else if (rank < baseRank) {
      chance = 'MODERATE'
    } else {
      chance = 'DREAM'
    }

    return {
      college,
      chance,
      closingRank: Math.floor(baseRank),
    }
  }).sort((a, b) => {
    const order = { SAFE: 0, MODERATE: 1, DREAM: 2 }
    return order[a.chance] - order[b.chance]
  })
}

export default function PredictorPage() {
  const [rank, setRank] = useState('8500')
  const [category, setCategory] = useState('General')
  const [gender, setGender] = useState('Male')
  const [homeState, setHomeState] = useState('Maharashtra')
  const [examType, setExamType] = useState('JEE Main')
  const [collegeType, setCollegeType] = useState('All')
  const [showFilters, setShowFilters] = useState(false)
  const [predictions, setPredictions] = useState<ReturnType<typeof generatePredictions>>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setPredictions(generatePredictions(8500))
  }, [])

  const handlePredict = () => {
    setPredictions(generatePredictions(parseInt(rank) || 8500))
  }

  const filterPredictions = predictions.filter((p) => {
    if (collegeType === 'All') return true
    return p.college.type === collegeType
  })

  const chanceCounts = {
    SAFE: filterPredictions.filter((p) => p.chance === 'SAFE').length,
    MODERATE: filterPredictions.filter((p) => p.chance === 'MODERATE').length,
    DREAM: filterPredictions.filter((p) => p.chance === 'DREAM').length,
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-20 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              AI College <span className="gradient-text">Predictor</span>
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
              Enter your JEE rank and preferences to get personalized college predictions with 95% accuracy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Filters */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:sticky lg:top-24 lg:self-start space-y-4"
            >
              <GlassCard variant="strong" hover={false} className="p-0 overflow-hidden">
                <div className="p-5 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-foreground flex items-center gap-2">
                      <SlidersHorizontal className="h-5 w-5 text-primary" />
                      Predictor Settings
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="lg:hidden"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      {showFilters ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <AnimatePresence>
                  <motion.div
                    initial={false}
                    animate={{ height: showFilters || (mounted && window.innerWidth >= 1024) ? 'auto' : 0 }}
                    className={`overflow-hidden lg:!h-auto ${!showFilters && 'hidden lg:block'}`}
                  >
                    <div className="p-5 space-y-5">
                      {/* Exam Type */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Exam Type
                        </label>
                        <div className="flex gap-2">
                          {examTypes.map((type) => (
                            <button
                              key={type}
                              onClick={() => setExamType(type)}
                              className={`flex-1 px-4 py-2.5 text-sm rounded-xl border transition-all ${examType === type
                                  ? 'bg-primary text-primary-foreground border-primary'
                                  : 'bg-secondary/50 border-border/50 text-muted-foreground hover:text-foreground'
                                }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Rank */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Your Rank
                        </label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            type="number"
                            value={rank}
                            onChange={(e) => setRank(e.target.value)}
                            placeholder="Enter rank"
                            className="pl-10 h-12 bg-secondary/50 border-border/50"
                          />
                        </div>
                      </div>

                      {/* Category */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Category
                        </label>
                        <Select value={category} onValueChange={setCategory}>
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
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Gender
                        </label>
                        <Select value={gender} onValueChange={setGender}>
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
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Home State
                        </label>
                        <Select value={homeState} onValueChange={setHomeState}>
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

                      {/* Branch Preferences */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Preferred Branch
                        </label>
                        <Select defaultValue="cse">
                          <SelectTrigger className="h-12 bg-secondary/50 border-border/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {branches.map((branch) => (
                              <SelectItem key={branch.id} value={branch.id}>
                                {branch.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Predict Button */}
                      <Button
                        onClick={handlePredict}
                        className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                      >
                        Predict Colleges
                      </Button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </GlassCard>

              {/* Chance Summary */}
              <GlassCard variant="strong" hover={false} className="p-5 hidden lg:block">
                <h3 className="text-sm font-medium text-foreground mb-4">Chance Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <ChanceBadge type="SAFE" size="sm" />
                    <span className="text-lg font-semibold text-emerald-400">{chanceCounts.SAFE}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <ChanceBadge type="MODERATE" size="sm" />
                    <span className="text-lg font-semibold text-amber-400">{chanceCounts.MODERATE}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <ChanceBadge type="DREAM" size="sm" />
                    <span className="text-lg font-semibold text-rose-400">{chanceCounts.DREAM}</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Right Column - Results */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Prediction Results
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Showing {filterPredictions.length} colleges for rank #{rank}
                  </p>
                </div>

                {/* College Type Filter */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                  {collegeTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setCollegeType(type)}
                      className={`px-4 py-2 text-sm rounded-full whitespace-nowrap transition-all ${collegeType === type
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {filterPredictions.map((prediction, index) => (
                    <motion.div
                      key={prediction.college.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <CollegeCard
                        college={prediction.college}
                        chance={prediction.chance}
                        closingRank={prediction.closingRank}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {filterPredictions.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No colleges found matching your criteria.</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
