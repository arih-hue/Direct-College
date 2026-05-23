'use client'

import { motion } from 'framer-motion'
import { 
  Star, 
  MessageSquare, 
  Calendar, 
  Users,
  Building,
  Briefcase,
  Clock,
  Video,
  Filter
} from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { cn } from '@/lib/utils'
import type { Mentor } from '@/types'

const mentors: Mentor[] = [
  {
    id: '1',
    name: 'Arpit Singhal',
    college: 'IIT Bombay',
    branch: 'Computer Science',
    company: 'Google',
    role: 'Software Engineer',
    expertise: ['Branch Selection', 'JEE Preparation', 'Software Careers'],
    sessionCount: 142,
    rating: 4.9,
    pricePerSession: 499,
    availability: ['Mon, Wed 6-8 PM', 'Sat 10 AM - 1 PM']
  },
  {
    id: '2',
    name: 'Suhani Goel',
    college: 'NIT Trichy',
    branch: 'Electronics & Communication',
    company: 'Qualcomm',
    role: 'Hardware Engineer',
    expertise: ['JoSAA Choice Filling', 'NIT Campus Life', 'Core Placements'],
    sessionCount: 98,
    rating: 4.8,
    pricePerSession: 399,
    availability: ['Tue, Thu 7-9 PM', 'Sun 2-5 PM']
  },
  {
    id: '3',
    name: 'Vikram Aditya',
    college: 'IIIT Hyderabad',
    branch: 'Computer Science',
    company: 'Uber',
    role: 'Senior Developer',
    expertise: ['IIIT Admissions', 'Coding Culture', 'Foreign Placements'],
    sessionCount: 215,
    rating: 4.9,
    pricePerSession: 599,
    availability: ['Friday 5-8 PM', 'Sat 3-6 PM']
  }
]

const categories = ['All', 'IIT Alumni', 'NIT Alumni', 'Industry Experts', 'Placement Experts']

export default function MentorsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-20 pb-12">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 mesh-gradient opacity-50" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-6">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm text-primary font-medium">Mentor Connect</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                Talk to <span className="gradient-text">Real Students & Alumni</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Get personalized guidance from seniors who have been through the same journey. 
                Book 1:1 video sessions for honest insights and strategic advice.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                className={cn(
                  "px-4 py-2 text-sm rounded-full whitespace-nowrap transition-all",
                  category === 'All'
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/50 text-muted-foreground hover:text-foreground"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Mentors Grid */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor: Mentor, index: number) => (
              <motion.div
                key={mentor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassCard variant="strong" className="p-6 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-border">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{mentor.name}</h3>
                      <p className="text-sm text-muted-foreground">{mentor.role}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm text-foreground">{mentor.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({mentor.sessionCount} sessions)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-4 space-y-3 flex-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{mentor.college}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{mentor.company}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{mentor.availability.join(', ')}</span>
                    </div>
                  </div>

                  {/* Expertise Tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {mentor.expertise.map((exp: string) => (
                      <span 
                        key={exp}
                        className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>

                  {/* Price & CTA */}
                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/50">
                    <div>
                      <span className="text-2xl font-bold text-foreground">₹{mentor.pricePerSession}</span>
                      <span className="text-sm text-muted-foreground">/session</span>
                    </div>
                    <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                      <Video className="h-4 w-4 mr-2" />
                      Book Call
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}
