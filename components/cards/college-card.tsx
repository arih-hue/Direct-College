'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, Star, TrendingUp, IndianRupee, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChanceBadge } from '@/components/ui/chance-badge'
import { cn } from '@/lib/utils'
import type { College } from '@/types'

interface CollegeCardProps {
  college: College
  chance?: 'SAFE' | 'MODERATE' | 'DREAM'
  closingRank?: number
  showCompare?: boolean
  className?: string
}

export function CollegeCard({ 
  college, 
  chance,
  closingRank,
  showCompare = true,
  className 
}: CollegeCardProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
    return `₹${amount.toLocaleString()}`
  }

  const typeColors = {
    IIT: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
    NIT: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
    IIIT: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
    GFTI: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
    State: 'from-slate-500/20 to-slate-600/10 border-slate-500/30',
  }

  return (
    <motion.div
      className={cn(
        'group relative rounded-2xl border bg-card/50 backdrop-blur-sm overflow-hidden transition-all duration-300',
        'hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30',
        className
      )}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Gradient overlay based on type */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-50',
        typeColors[college.type]
      )} />
      
      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Logo placeholder */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-border">
              <span className="text-sm font-bold text-primary">{college.type}</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground line-clamp-1">
                {college.shortName}
              </h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {college.location}
              </div>
            </div>
          </div>
          {chance && <ChanceBadge type={chance} size="sm" />}
        </div>

        {/* Stats Grid */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <div>
              <p className="text-xs text-muted-foreground">Avg Package</p>
              <p className="text-sm font-semibold text-emerald-400">
                {formatCurrency(college.avgPackage)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50">
            <Users className="h-4 w-4 text-blue-400" />
            <div>
              <p className="text-xs text-muted-foreground">Placement</p>
              <p className="text-sm font-semibold text-blue-400">{college.placementRate}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50">
            <IndianRupee className="h-4 w-4 text-amber-400" />
            <div>
              <p className="text-xs text-muted-foreground">Fees</p>
              <p className="text-sm font-semibold text-amber-400">
                {formatCurrency(college.fees)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50">
            <Star className="h-4 w-4 text-yellow-400" />
            <div>
              <p className="text-xs text-muted-foreground">Rating</p>
              <p className="text-sm font-semibold text-yellow-400">
                {college.rating} <span className="text-muted-foreground font-normal">({college.reviewCount})</span>
              </p>
            </div>
          </div>
        </div>

        {/* Closing Rank if available */}
        {closingRank && (
          <div className="mt-3 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-xs text-muted-foreground">Closing Rank (2024)</p>
            <p className="text-sm font-semibold text-primary">#{closingRank.toLocaleString()}</p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <Link href={`/college/${college.id}`} className="flex-1">
            <Button variant="secondary" className="w-full" size="sm">
              View Details
            </Button>
          </Link>
          {showCompare && (
            <Button variant="outline" size="sm" className="shrink-0">
              Compare
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
