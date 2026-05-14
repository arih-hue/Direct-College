'use client'

import { motion } from 'framer-motion'
import { Star, ThumbsUp, CheckCircle, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Review } from '@/types'

interface ReviewCardProps {
  review: Review
  className?: string
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  return (
    <motion.div
      className={cn(
        'rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 transition-all duration-300',
        'hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5',
        className
      )}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-border">
            <User className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{review.userName}</span>
              {review.verified && (
                <CheckCircle className="h-4 w-4 text-emerald-400" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {review.branch} • Batch of {review.batch}
            </p>
          </div>
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-500/10">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-semibold text-yellow-400">{review.rating}</span>
        </div>
      </div>

      {/* Title & Content */}
      <div className="mt-4">
        <h4 className="font-semibold text-foreground">{review.title}</h4>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
          {review.content}
        </p>
      </div>

      {/* Pros & Cons */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium text-emerald-400">Pros</p>
          <ul className="space-y-1">
            {review.pros.slice(0, 2).map((pro, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                <span className="text-emerald-400 mt-0.5">+</span>
                <span className="line-clamp-1">{pro}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-rose-400">Cons</p>
          <ul className="space-y-1">
            {review.cons.slice(0, 2).map((con, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                <span className="text-rose-400 mt-0.5">-</span>
                <span className="line-clamp-1">{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between pt-4 border-t border-border/50">
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ThumbsUp className="h-4 w-4" />
          <span>Helpful ({review.helpfulCount})</span>
        </button>
        <span className="text-xs text-muted-foreground">
          {new Date(review.createdAt).toLocaleDateString('en-IN', { 
            month: 'short', 
            year: 'numeric' 
          })}
        </span>
      </div>
    </motion.div>
  )
}
