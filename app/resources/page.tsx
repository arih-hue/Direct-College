'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  BookOpen, 
  Video, 
  Download, 
  FileText,
  Star,
  Clock,
  ArrowRight,
  Filter
} from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GlassCard } from '@/components/ui/glass-card'
import { cn } from '@/lib/utils'

const categories = ['All', 'Counseling', 'Strategy', 'Preparation', 'Career']
const types = ['All Types', 'Guides', 'Videos', 'Downloads', 'Articles']

const featuredResources = [
  {
    title: 'Complete JoSAA Counseling Guide 2025',
    description: 'Everything you need to know about JoSAA counseling - from registration to final seat allotment.',
    type: 'guide',
    readTime: '15 min read',
    featured: true,
  },
  {
    title: 'Branch vs College: Data-Driven Analysis',
    description: 'Should you prioritize branch or college? We analyzed 5 years of placement data to answer this.',
    type: 'article',
    readTime: '10 min read',
    featured: true,
  },
  {
    title: 'Video: Understanding Seat Matrix',
    description: 'Learn how to read and analyze seat matrices to maximize your chances.',
    type: 'video',
    readTime: '12 min watch',
    featured: true,
  },
]

const allResources = [
  { title: 'JEE Main Cutoff Trends 2020-2024', type: 'download', category: 'Counseling' },
  { title: 'How to Fill JoSAA Choices Wisely', type: 'guide', category: 'Strategy' },
  { title: 'CSAB Special Round Explained', type: 'article', category: 'Counseling' },
  { title: 'State Counseling Options Guide', type: 'guide', category: 'Counseling' },
  { title: 'Placement Statistics Database', type: 'download', category: 'Career' },
  { title: 'Interview: IIT Bombay CSE Student', type: 'video', category: 'Career' },
  { title: 'NIT vs IIIT Comparison', type: 'article', category: 'Strategy' },
  { title: 'Fee Structure Comparison 2025', type: 'download', category: 'Counseling' },
]

const typeIcons = {
  guide: BookOpen,
  video: Video,
  download: Download,
  article: FileText,
}

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

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
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                Resources & <span className="gradient-text">Guides</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Comprehensive guides, video tutorials, and downloadable resources to help you 
                navigate JEE counseling with confidence.
              </p>

              {/* Search */}
              <div className="mt-8 max-w-xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 bg-secondary/50 border-border/50 text-lg"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Categories */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-4 py-2 text-sm rounded-full whitespace-nowrap transition-all",
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/50 text-muted-foreground hover:text-foreground"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Featured Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-400" />
              Featured Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredResources.map((resource, index) => {
                const Icon = typeIcons[resource.type as keyof typeof typeIcons]
                return (
                  <motion.div
                    key={resource.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <GlassCard variant="gradient" className="h-full flex flex-col p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 font-medium">
                          Featured
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2 flex-1">
                        {resource.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between pt-4 border-t border-border/50">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {resource.readTime}
                        </span>
                        <Button variant="ghost" size="sm" className="group">
                          Read
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </div>
                    </GlassCard>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* All Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-foreground mb-6">All Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {allResources.map((resource, index) => {
                const Icon = typeIcons[resource.type as keyof typeof typeIcons]
                return (
                  <motion.div
                    key={resource.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <GlassCard variant="strong" className="p-5 cursor-pointer group">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl shrink-0",
                          resource.type === 'guide' && "bg-emerald-500/10",
                          resource.type === 'video' && "bg-rose-500/10",
                          resource.type === 'download' && "bg-blue-500/10",
                          resource.type === 'article' && "bg-purple-500/10",
                        )}>
                          <Icon className={cn(
                            "h-5 w-5",
                            resource.type === 'guide' && "text-emerald-400",
                            resource.type === 'video' && "text-rose-400",
                            resource.type === 'download' && "text-blue-400",
                            resource.type === 'article' && "text-purple-400",
                          )} />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                            {resource.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {resource.category}
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}
