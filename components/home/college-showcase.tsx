'use client'

import {
  useState,
  useRef,
  useEffect,
} from 'react'

import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion'

import Link from 'next/link'

import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { CollegeCard } from '@/components/cards/college-card'

import { cn } from '@/lib/utils'

import { getColleges } from '@/lib/api/services/colleges'

import type { College } from '@/types'

const categories = [
  'All',
  'IITs',
  'NITs',
  'IIITs',
  'GFTIs',
]

export function CollegeShowcase() {

  const [activeCategory, setActiveCategory] =
    useState('All')

  const [colleges, setColleges] =
    useState<College[]>([])

  const [loading, setLoading] =
    useState(true)

  const [mounted, setMounted] =
    useState(false)

  const sectionRef =
    useRef<HTMLElement>(null)

  useEffect(() => {

    setMounted(true)

  }, [])

  useEffect(() => {

    async function fetchColleges() {

      setLoading(true)

      const data =
        await getColleges()

      setColleges(data || [])

      setLoading(false)
    }

    fetchColleges()

  }, [])

  const { scrollYProgress } =
    useScroll({
      target: sectionRef,
      offset: [
        'start end',
        'end start',
      ],
    })

  const headerY = useTransform(
    scrollYProgress,
    [0, 0.3],
    [80, 0]
  )

  const headerOpacity =
    useTransform(
      scrollYProgress,
      [0, 0.2],
      [0, 1]
    )

  const headerRotateX =
    useTransform(
      scrollYProgress,
      [0, 0.3],
      [15, 0]
    )

  const smoothHeaderY =
    useSpring(headerY, {
      stiffness: 100,
      damping: 30,
    })

  const smoothHeaderOpacity =
    useSpring(headerOpacity, {
      stiffness: 100,
      damping: 30,
    })

  const smoothHeaderRotateX =
    useSpring(headerRotateX, {
      stiffness: 100,
      damping: 30,
    })

  const filteredColleges =
    colleges.filter((college) => {

      if (
        activeCategory === 'All'
      ) {
        return true
      }

      if (
        activeCategory === 'IITs'
      ) {
        return (
          college.type === 'IIT'
        )
      }

      if (
        activeCategory === 'NITs'
      ) {
        return (
          college.type === 'NIT'
        )
      }

      if (
        activeCategory === 'IIITs'
      ) {
        return (
          college.type === 'IIIT'
        )
      }

      if (
        activeCategory === 'GFTIs'
      ) {
        return (
          college.type === 'GFTI'
        )
      }

      return true
    })

  if (!mounted || loading) {

    return (
      <section
        ref={sectionRef}
        className="py-20 text-center"
      >

        <p className="text-muted-foreground">
          {!mounted ? '' : 'Loading colleges...'}
        </p>

      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-32 bg-secondary/20 relative overflow-hidden"
      style={{
        perspective: '1500px',
      }}
    >

      <motion.div
        className="absolute top-0 left-[20%] w-96 h-96 rounded-full"
        style={{
          background:
            'radial-gradient(circle, oklch(0.6 0.22 275 / 0.08), transparent 70%)',

          filter: 'blur(80px)',

          transform:
            'translateZ(-100px)',
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">

        <motion.div
          style={{
            y: smoothHeaderY,
            opacity:
              smoothHeaderOpacity,
            rotateX:
              smoothHeaderRotateX,
            transformStyle:
              'preserve-3d',
          }}
          className="text-center max-w-3xl mx-auto mb-12"
        >

          <h2
            className="text-3xl sm:text-4xl font-bold text-foreground"
            style={{
              transform:
                'translateZ(20px)',
            }}
          >

            Explore{' '}

            <span className="gradient-text">
              Top Colleges
            </span>

          </h2>

          <p
            className="mt-4 text-lg text-muted-foreground"
            style={{
              transform:
                'translateZ(10px)',
            }}
          >

            Discover the best engineering colleges in India.

          </p>

        </motion.div>

        <motion.div
          className="flex justify-center mb-10"
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
            delay: 0.2,
          }}
        >

          <div className="inline-flex items-center gap-2 p-1.5 rounded-full bg-secondary/50 border border-border/50 relative overflow-hidden">

            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 opacity-50"
              animate={{
                x: [
                  '-100%',
                  '100%',
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            {categories.map(
              (category) => (

                <button
                  key={category}
                  onClick={() =>
                    setActiveCategory(
                      category
                    )
                  }
                  className={cn(
                    'px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 relative z-10',

                    activeCategory ===
                      category
                      ? 'bg-primary text-primary-foreground shadow-lg glow-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  )}
                >

                  {category}

                </button>
              )
            )}

          </div>

        </motion.div>

        <AnimatePresence mode="wait">

          <motion.div
            key={activeCategory}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.3,
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >

            {filteredColleges
              .slice(0, 6)
              .map(
                (
                  college,
                  index
                ) => (

                  <CollegeCard3DWrapper
                    key={college.id}
                    college={college}
                    index={index}
                    scrollYProgress={
                      scrollYProgress
                    }
                  />
                )
              )}

          </motion.div>

        </AnimatePresence>

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
            delay: 0.5,
          }}
          className="mt-12 text-center"
        >

          <Link href="/explore">

            <Button
              variant="outline"
              size="lg"
              className="group relative overflow-hidden"
            >

              <span className="relative z-10 flex items-center">

                View All Colleges

                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />

              </span>

            </Button>

          </Link>

        </motion.div>

      </div>

    </section>
  )
}

interface CollegeCard3DWrapperProps {

  college: College

  index: number

  scrollYProgress:
  ReturnType<
    typeof useScroll
  >['scrollYProgress']
}

function CollegeCard3DWrapper({
  college,
  index,
  scrollYProgress,
}: CollegeCard3DWrapperProps) {

  const cardRef =
    useRef<HTMLDivElement>(null)

  const col = index % 3

  const row =
    Math.floor(index / 3)

  const delay =
    col * 0.1 +
    row * 0.15

  const startOffset =
    0.15 + delay

  const y = useTransform(
    scrollYProgress,
    [
      startOffset,
      startOffset + 0.2,
    ],
    [100, 0]
  )

  const opacity =
    useTransform(
      scrollYProgress,
      [
        startOffset,
        startOffset + 0.15,
      ],
      [0, 1]
    )

  const rotateX =
    useTransform(
      scrollYProgress,
      [
        startOffset,
        startOffset + 0.2,
      ],
      [20, 0]
    )

  const rotateY =
    useTransform(
      scrollYProgress,
      [
        startOffset,
        startOffset + 0.2,
      ],
      [
        (col - 1) * 10,
        0,
      ]
    )

  const scale =
    useTransform(
      scrollYProgress,
      [
        startOffset,
        startOffset + 0.2,
      ],
      [0.85, 1]
    )

  const smoothY =
    useSpring(y, {
      stiffness: 100,
      damping: 30,
    })

  const smoothOpacity =
    useSpring(opacity, {
      stiffness: 100,
      damping: 30,
    })

  const smoothRotateX =
    useSpring(rotateX, {
      stiffness: 100,
      damping: 30,
    })

  const smoothRotateY =
    useSpring(rotateY, {
      stiffness: 100,
      damping: 30,
    })

  const smoothScale =
    useSpring(scale, {
      stiffness: 100,
      damping: 30,
    })

  return (
    <motion.div
      ref={cardRef}
      style={{
        y: smoothY,
        opacity:
          smoothOpacity,
        rotateX:
          smoothRotateX,
        rotateY:
          smoothRotateY,
        scale:
          smoothScale,
        transformStyle:
          'preserve-3d',
        transformOrigin:
          'center center',
      }}
    >

      <CollegeCard
        college={college}
      />

    </motion.div>
  )
}