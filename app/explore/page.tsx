'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  X,
  ChevronDown,
  ChevronUp,
  MapPin,
  IndianRupee,
  TrendingUp,
  Users,
  Building
} from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { GlassCard } from '@/components/ui/glass-card'
import { CollegeCard } from '@/components/cards/college-card'
import { getColleges } from '@/lib/api/services/colleges'
import type { College } from '@/types'

const collegeTypes = ['IIT', 'NIT', 'IIIT', 'GFTI', 'State']
const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Gujarat', 'Rajasthan', 'UP', 'MP', 'West Bengal']
const feeRanges = [
  { label: 'Under 5L', min: 0, max: 500000 },
  { label: '5L - 10L', min: 500000, max: 1000000 },
  { label: '10L - 15L', min: 1000000, max: 1500000 },
  { label: 'Above 15L', min: 1500000, max: Infinity },
]
const placementRanges = [
  { label: 'Above 90%', min: 90 },
  { label: '80% - 90%', min: 80, max: 90 },
  { label: '70% - 80%', min: 70, max: 80 },
]

export default function ExplorePage() {
  const [colleges, setColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedStates, setSelectedStates] = useState<string[]>([])
  const [selectedFeeRange, setSelectedFeeRange] = useState<string>('')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [filterSections, setFilterSections] = useState<Record<string, boolean>>({
    type: true,
    state: true,
    fees: false,
    placement: false,
  })

  useEffect(() => {
    getColleges().then((data) => {
      setColleges(data)
      setLoading(false)
    })
  }, [])

  const toggleFilterSection = (key: string) => {
    setFilterSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const toggleState = (state: string) => {
    setSelectedStates(prev => 
      prev.includes(state) ? prev.filter(s => s !== state) : [...prev, state]
    )
  }

  const filteredColleges = colleges.filter((college) => {
    if (searchQuery && !college.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (selectedTypes.length > 0 && !selectedTypes.includes(college.type ?? '')) {
      return false
    }
    if (selectedStates.length > 0 && !selectedStates.includes(college.state ?? '')) {
      return false
    }
    if (selectedFeeRange) {
      const range = feeRanges.find(r => r.label === selectedFeeRange)
      if (range && college.fees != null) {
        if (college.fees < range.min || college.fees > range.max) return false
      }
    }
    return true
  })

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedTypes([])
    setSelectedStates([])
    setSelectedFeeRange('')
  }

  const hasActiveFilters = selectedTypes.length > 0 || selectedStates.length > 0 || selectedFeeRange !== ''

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
              Explore <span className="gradient-text">Colleges</span>
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
              Discover 450+ engineering colleges with detailed insights on placements, fees, and campus life.
            </p>
          </motion.div>

          {/* Search & Mobile Filter Toggle */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search colleges by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-secondary/50 border-border/50"
              />
            </div>
            <Button
              variant="outline"
              className="lg:hidden h-12 px-4"
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {selectedTypes.length + selectedStates.length}
                </span>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <AnimatePresence>
              {(mobileFiltersOpen || true) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`lg:block ${!mobileFiltersOpen && 'hidden lg:block'}`}
                >
                  <GlassCard variant="strong" hover={false} className="p-0 lg:sticky lg:top-24 overflow-hidden">
                    {/* Filter Header */}
                    <div className="p-5 border-b border-border/50 flex items-center justify-between">
                      <h2 className="font-semibold text-foreground flex items-center gap-2">
                        <Filter className="h-5 w-5 text-primary" />
                        Filters
                      </h2>
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="text-sm text-primary hover:underline"
                        >
                          Clear all
                        </button>
                      )}
                    </div>

                    <div className="p-5 space-y-4">
                      {/* College Type */}
                      <div className="border-b border-border/50 pb-4">
                        <button
                          onClick={() => toggleFilterSection('type')}
                          className="w-full flex items-center justify-between text-sm font-medium text-foreground mb-3"
                        >
                          <span className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-primary" />
                            College Type
                          </span>
                          {filterSections.type ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                        {filterSections.type && (
                          <div className="space-y-2">
                            {collegeTypes.map((type) => (
                              <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                <Checkbox
                                  checked={selectedTypes.includes(type)}
                                  onCheckedChange={() => toggleType(type)}
                                />
                                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                  {type}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* State */}
                      <div className="border-b border-border/50 pb-4">
                        <button
                          onClick={() => toggleFilterSection('state')}
                          className="w-full flex items-center justify-between text-sm font-medium text-foreground mb-3"
                        >
                          <span className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-emerald-400" />
                            State
                          </span>
                          {filterSections.state ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                        {filterSections.state && (
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {states.map((state) => (
                              <label key={state} className="flex items-center gap-3 cursor-pointer group">
                                <Checkbox
                                  checked={selectedStates.includes(state)}
                                  onCheckedChange={() => toggleState(state)}
                                />
                                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                  {state}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Fee Range */}
                      <div className="border-b border-border/50 pb-4">
                        <button
                          onClick={() => toggleFilterSection('fees')}
                          className="w-full flex items-center justify-between text-sm font-medium text-foreground mb-3"
                        >
                          <span className="flex items-center gap-2">
                            <IndianRupee className="h-4 w-4 text-amber-400" />
                            Fee Range
                          </span>
                          {filterSections.fees ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                        {filterSections.fees && (
                          <div className="space-y-2">
                            {feeRanges.map((range) => (
                              <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
                                <Checkbox
                                  checked={selectedFeeRange === range.label}
                                  onCheckedChange={() => setSelectedFeeRange(
                                    selectedFeeRange === range.label ? '' : range.label
                                  )}
                                />
                                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                  {range.label}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Placement Rate */}
                      <div>
                        <button
                          onClick={() => toggleFilterSection('placement')}
                          className="w-full flex items-center justify-between text-sm font-medium text-foreground mb-3"
                        >
                          <span className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-blue-400" />
                            Placement Rate
                          </span>
                          {filterSections.placement ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                        {filterSections.placement && (
                          <div className="space-y-2">
                            {placementRanges.map((range) => (
                              <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
                                <Checkbox />
                                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                  {range.label}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>

            {/* College Grid */}
            <div className="lg:col-span-3">
              {/* Results Count */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  {loading
                    ? 'Loading colleges...'
                    : <>Showing <span className="text-foreground font-medium">{filteredColleges.length}</span> colleges</>
                  }
                </p>
                {hasActiveFilters && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => toggleType(type)}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-primary/10 text-primary rounded-full"
                      >
                        {type}
                        <X className="h-3 w-3" />
                      </button>
                    ))}
                    {selectedStates.map((state) => (
                      <button
                        key={state}
                        onClick={() => toggleState(state)}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-emerald-500/10 text-emerald-400 rounded-full"
                      >
                        {state}
                        <X className="h-3 w-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Loading skeleton */}
              {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-2xl border border-border/50 bg-card/50 p-5 animate-pulse">
                      <div className="h-5 w-3/4 bg-secondary rounded mb-3" />
                      <div className="h-4 w-1/2 bg-secondary rounded mb-4" />
                      <div className="space-y-2">
                        <div className="h-4 bg-secondary rounded" />
                        <div className="h-4 bg-secondary rounded" />
                        <div className="h-4 bg-secondary rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Grid */}
              {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  <AnimatePresence mode="popLayout">
                    {filteredColleges.map((college, index) => (
                      <motion.div
                        key={college.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, delay: index * 0.03 }}
                      >
                        <CollegeCard college={college} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {!loading && filteredColleges.length === 0 && (
                <div className="text-center py-16">
                  <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground">No colleges found</h3>
                  <p className="text-muted-foreground mt-2">
                    Try adjusting your filters or search query.
                  </p>
                  <Button variant="outline" className="mt-4" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}
