'use client'

import { cn } from '@/lib/utils'

type ChanceType = 'SAFE' | 'MODERATE' | 'DREAM'

interface ChanceBadgeProps {
  type: ChanceType
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const chanceStyles: Record<ChanceType, { bg: string; text: string; glow: string }> = {
  SAFE: {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    glow: 'shadow-emerald-500/30',
  },
  MODERATE: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    glow: 'shadow-amber-500/30',
  },
  DREAM: {
    bg: 'bg-rose-500/20',
    text: 'text-rose-400',
    glow: 'shadow-rose-500/30',
  },
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
}

export function ChanceBadge({ type, className, size = 'md' }: ChanceBadgeProps) {
  const styles = chanceStyles[type]
  
  return (
    <span 
      className={cn(
        'inline-flex items-center font-semibold rounded-full border',
        styles.bg,
        styles.text,
        `border-current/20 shadow-lg ${styles.glow}`,
        sizeStyles[size],
        className
      )}
    >
      <span className="relative flex h-2 w-2 mr-2">
        <span className={cn(
          'absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping',
          type === 'SAFE' && 'bg-emerald-400',
          type === 'MODERATE' && 'bg-amber-400',
          type === 'DREAM' && 'bg-rose-400',
        )} />
        <span className={cn(
          'relative inline-flex h-2 w-2 rounded-full',
          type === 'SAFE' && 'bg-emerald-400',
          type === 'MODERATE' && 'bg-amber-400',
          type === 'DREAM' && 'bg-rose-400',
        )} />
      </span>
      {type}
    </span>
  )
}
