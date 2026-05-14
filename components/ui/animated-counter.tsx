'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useSpring, useTransform } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}

export function AnimatedCounter({ 
  value, 
  suffix = '', 
  prefix = '',
  duration = 2,
  className 
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [hasAnimated, setHasAnimated] = useState(false)
  
  const springValue = useSpring(0, { 
    duration: duration * 1000,
    bounce: 0,
  })
  
  const displayValue = useTransform(springValue, (latest) => {
    if (value >= 1000000) {
      return `${(latest / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `${(latest / 1000).toFixed(value >= 10000 ? 0 : 1)}K`
    }
    return Math.floor(latest).toLocaleString()
  })

  useEffect(() => {
    if (isInView && !hasAnimated) {
      springValue.set(value)
      setHasAnimated(true)
    }
  }, [isInView, value, springValue, hasAnimated])

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </span>
  )
}
