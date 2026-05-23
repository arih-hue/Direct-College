'use client'

import { useRef, useMemo } from 'react'

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

import {
  ArrowRight,
  Sparkles,
} from 'lucide-react'

export function CTASection() {

  const sectionRef =
    useRef<HTMLElement>(null)

  const particles = useMemo(
    () =>
      Array.from(
        { length: 20 },
        (_, i) => ({
          id: i,

          left:
            `${10 + ((i * 13) % 80)}%`,

          top:
            `${10 + ((i * 17) % 80)}%`,

          hue:
            260 + ((i * 11) % 40),

          opacity:
            0.3 + ((i % 5) * 0.1),

          z:
            -50 + ((i * 9) % 100),

          floatY:
            -80 - ((i * 7) % 40),

          duration:
            4 + (i % 4),

          delay:
            i * 0.2,
        })
      ),
    []
  )

  const { scrollYProgress } =
    useScroll({
      target: sectionRef,
      offset: [
        'start end',
        'end start',
      ],
    })

  const y = useTransform(
    scrollYProgress,
    [0, 0.5],
    [100, 0]
  )

  const opacity =
    useTransform(
      scrollYProgress,
      [0, 0.3],
      [0, 1]
    )

  const rotateX =
    useTransform(
      scrollYProgress,
      [0, 0.5],
      [20, 0]
    )

  const scale =
    useTransform(
      scrollYProgress,
      [0, 0.5],
      [0.9, 1]
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

  const smoothScale =
    useSpring(scale, {
      stiffness: 100,
      damping: 30,
    })

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-32 relative overflow-hidden"
      style={{
        perspective: '1500px',
      }}
    >

      {/* Background */}

      <div
        className="absolute inset-0"
        style={{
          transformStyle:
            'preserve-3d',
        }}
      >

        {/* Primary glow */}

        <motion.div
          className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, oklch(0.6 0.22 275 / 0.2), transparent 70%)',

            filter:
              'blur(80px)',

            transform:
              'translateZ(-100px)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Secondary glow */}

        <motion.div
          className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, oklch(0.55 0.2 300 / 0.15), transparent 70%)',

            filter:
              'blur(60px)',

            transform:
              'translateZ(-150px)',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Floating particles */}

        {particles.map(
          (particle) => (

            <motion.div
              key={particle.id}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                left:
                  particle.left,

                top:
                  particle.top,

                background:
                  `oklch(0.65 0.2 ${particle.hue} / ${particle.opacity})`,

                transform:
                  `translateZ(${particle.z}px)`,
              }}
              animate={{
                y: [
                  0,
                  particle.floatY,
                  0,
                ],

                opacity: [
                  0,
                  1,
                  0,
                ],

                scale: [
                  0.5,
                  1,
                  0.5,
                ],
              }}
              transition={{
                duration:
                  particle.duration,

                repeat:
                  Infinity,

                delay:
                  particle.delay,

                ease:
                  'easeInOut',
              }}
            />
          )
        )}

      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

        <motion.div
          style={{
            y: smoothY,

            opacity:
              smoothOpacity,

            rotateX:
              smoothRotateX,

            scale:
              smoothScale,

            transformStyle:
              'preserve-3d',
          }}
          className="text-center"
        >

          {/* Badge */}

          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-8 relative overflow-hidden"
            style={{
              transform:
                'translateZ(40px)',
            }}
            whileHover={{
              scale: 1.05,
            }}
          >

            <Sparkles className="h-4 w-4 text-primary" />

            <span className="text-sm text-primary font-medium">
              Start Your Journey Today
            </span>

          </motion.div>

          {/* Heading */}

          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance"
            style={{
              transform:
                'translateZ(30px)',
            }}
          >

            Ready to find your{' '}

            <span className="gradient-text">
              dream college?
            </span>

          </h2>

          {/* Description */}

          <p
            className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto"
            style={{
              transform:
                'translateZ(20px)',
            }}
          >

            Join thousands of aspirants using DirectCollege to make smarter decisions with AI-powered predictions.

          </p>

          {/* Buttons */}

          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            style={{
              transform:
                'translateZ(50px)',
            }}
          >

            <Link href="/predictor">

              <Button
                size="lg"
                className="h-14 px-8 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >

                Find My Colleges

                <ArrowRight className="ml-2 h-5 w-5" />

              </Button>

            </Link>

            <Link href="/explore">

              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 text-lg"
              >

                Explore Colleges

              </Button>

            </Link>

          </motion.div>

          {/* Footer note */}

          <p
            className="mt-8 text-sm text-muted-foreground"
            style={{
              transform:
                'translateZ(10px)',
            }}
          >

            Free to use • No signup required • Updated for JoSAA 2025

          </p>

        </motion.div>

      </div>

    </section>
  )
}