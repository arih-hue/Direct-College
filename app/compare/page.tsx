'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  X, 
  Search,
  TrendingUp,
  IndianRupee,
  Users,
  MapPin,
  Award,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GlassCard } from '@/components/ui/glass-card'
import { getColleges } from '@/lib/api/services/colleges'
import { cn } from '@/lib/utils'
import type { College } from '@/types'

const comparisonFields = [
  { key: 'type', label: 'Type', icon: Award },
  { key: 'nirf_rank', label: 'NIRF Ranking', icon: Award, highlight: 'lower' },
  { key: 'city', label: 'City', icon: MapPin },
  { key: 'state', label: 'State', icon: MapPin },
  { key: 'established_year', label: 'Established', icon: null },
  { key: 'avg_package', label: 'Avg Package', icon: TrendingUp, format: 'currency', highlight: 'higher' },
  { key: 'highest_package', label: 'Highest Package', icon: TrendingUp, format: 'currency', highlight: 'higher' },
  { key: 'fees', label: 'Total Fees', icon: IndianRupee, format: 'currency', highlight: 'lower' },
  { key: 'campus_size', label: 'Campus Size', icon: null },
]

export default function ComparePage() {
  const [allColleges, setAllColleges] = useState<College[]>([])
  const [selectedColleges, setSelectedColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [searchSlot, setSearchSlot] = useState<number | null>(null)

  useEffect(() => {
    getColleges().then((data) => {
      setAllColleges(data)
      // Pre-select first two colleges if available
      if (data.length >= 2) {
        setSelectedColleges([data[0], data[1]])
      } else if (data.length === 1) {
        setSelectedColleges([data[0]])
      }
      setLoading(false)
    })
  }, [])

  const formatValue = (value: unknown, format?: string) => {
    if (value == null) return '—'
    if (format === 'currency') {
      const num = value as number
      if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`
      if (num >= 100000) return `₹${(num / 100000).toFixed(1)} L`
      return `₹${num.toLocaleString()}`
    }
    if (format === 'percent') return `${value}%`
    return String(value)
  }

  const getBestValue = (key: string, highlight?: string): number | null => {
    if (!highlight) return null
    const values = selectedColleges
      .map((c) => c[key as keyof College] as number | null)
      .filter((v): v is number => v != null)
    if (values.length === 0) return null
    if (highlight === 'higher') return Math.max(...values)
    if (highlight === 'lower') return Math.min(...values)
    return null
  }

  const addCollege = (college: College, slot: number) => {
    const newColleges = [...selectedColleges]
    newColleges[slot] = college
    setSelectedColleges(newColleges)
    setShowSearch(false)
    setSearchSlot(null)
    setSearchQuery('')
  }

  const removeCollege = (index: number) => {
    if (selectedColleges.length <= 2) return
    setSelectedColleges(selectedColleges.filter((_, i) => i !== index))
  }

  const filteredColleges = allColleges.filter(
    (c) =>
      !selectedColleges.find((sc) => sc.id === c.id) &&
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading colleges...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
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
              Compare <span className="gradient-text">Colleges</span>
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
              Compare colleges side-by-side on placements, fees, campus life, and ROI to make an informed decision.
            </p>
          </motion.div>

          {selectedColleges.length === 0 ? (
            <div className="text-center py-16">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground">No colleges to compare</h3>
              <p className="text-muted-foreground mt-2">No college data available yet.</p>
            </div>
          ) : (
            <>
              {/* Comparison Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <GlassCard variant="strong" hover={false} className="p-0 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                      {/* College Headers */}
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="p-4 text-left w-48 sticky left-0 bg-card z-10">
                            <span className="text-sm font-medium text-muted-foreground">
                              Compare up to 4 colleges
                            </span>
                          </th>
                          {selectedColleges.map((college, index) => (
                            <th key={college.id} className="p-4 text-center min-w-[200px]">
                              <div className="relative">
                                {selectedColleges.length > 2 && (
                                  <button
                                    onClick={() => removeCollege(index)}
                                    className="absolute -top-1 -right-1 p-1 rounded-full bg-destructive/20 text-destructive hover:bg-destructive/30"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                )}
                                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-border mx-auto mb-2">
                                  <span className="text-lg font-bold text-primary">{college.type}</span>
                                </div>
                                <p className="font-semibold text-foreground">{college.name}</p>
                                <p className="text-sm text-muted-foreground">{college.city}</p>
                              </div>
                            </th>
                          ))}
                          {selectedColleges.length < 4 && (
                            <th className="p-4 text-center min-w-[200px]">
                              <button
                                onClick={() => {
                                  setShowSearch(true)
                                  setSearchSlot(selectedColleges.length)
                                }}
                                className="w-full py-8 border-2 border-dashed border-border/50 rounded-xl hover:border-primary/50 transition-colors group"
                              >
                                <Plus className="h-8 w-8 text-muted-foreground group-hover:text-primary mx-auto" />
                                <span className="text-sm text-muted-foreground group-hover:text-primary mt-2 block">
                                  Add College
                                </span>
                              </button>
                            </th>
                          )}
                        </tr>
                      </thead>

                      {/* Comparison Rows */}
                      <tbody>
                        {comparisonFields.map((field, rowIndex) => {
                          const bestValue = getBestValue(field.key, field.highlight)
                          return (
                            <tr 
                              key={field.key}
                              className={cn(
                                "border-b border-border/30",
                                rowIndex % 2 === 0 ? 'bg-secondary/20' : ''
                              )}
                            >
                              <td className="p-4 sticky left-0 bg-inherit z-10">
                                <div className="flex items-center gap-2">
                                  {field.icon && (
                                    <field.icon className="h-4 w-4 text-muted-foreground" />
                                  )}
                                  <span className="text-sm font-medium text-foreground">
                                    {field.label}
                                  </span>
                                </div>
                              </td>
                              {selectedColleges.map((college) => {
                                const value = college[field.key as keyof College]
                                const isBest = bestValue !== null && value === bestValue
                                return (
                                  <td key={college.id} className="p-4 text-center">
                                    <span className={cn(
                                      "text-sm",
                                      isBest 
                                        ? "font-semibold text-emerald-400" 
                                        : "text-foreground"
                                    )}>
                                      {formatValue(value, field.format)}
                                      {isBest && (
                                        <CheckCircle className="h-4 w-4 inline ml-1" />
                                      )}
                                    </span>
                                  </td>
                                )
                              })}
                              {selectedColleges.length < 4 && (
                                <td className="p-4 text-center text-muted-foreground">—</td>
                              )}
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </GlassCard>
              </motion.div>
            </>
          )}

          {/* Search Modal */}
          {showSearch && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg"
              >
                <GlassCard variant="strong" className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Add College</h3>
                    <button
                      onClick={() => {
                        setShowSearch(false)
                        setSearchSlot(null)
                        setSearchQuery('')
                      }}
                      className="p-2 rounded-lg hover:bg-secondary"
                    >
                      <X className="h-5 w-5 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search colleges..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {filteredColleges.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No colleges found
                      </p>
                    )}
                    {filteredColleges.map((college) => (
                      <button
                        key={college.id}
                        onClick={() => searchSlot !== null && addCollege(college, searchSlot)}
                        className="w-full p-3 rounded-xl text-left hover:bg-secondary/50 transition-colors flex items-center gap-3"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <span className="text-xs font-bold text-primary">{college.type}</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{college.name}</p>
                          <p className="text-sm text-muted-foreground">{college.city}, {college.state}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </main>
  )
}
