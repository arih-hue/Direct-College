'use client'

import { motion } from 'framer-motion'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  gradient?: string
  className?: string
  index?: number
}

export function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  gradient = 'from-primary to-accent',
  className,
  index = 0
}: FeatureCardProps) {
  return (
    <motion.div
      className={cn(
        'group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-all duration-300',
        'hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      {/* Icon */}
      <div className={cn(
        'inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br',
        gradient,
        'shadow-lg shadow-primary/20'
      )}>
        <Icon className="h-6 w-6 text-primary-foreground" />
      </div>

      {/* Content */}
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {/* Hover glow effect */}
      <div className={cn(
        'absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100',
        'bg-gradient-to-br pointer-events-none',
        gradient,
        'blur-3xl -z-10'
      )} 
      style={{ opacity: 0.05 }}
      />
    </motion.div>
  )
}
