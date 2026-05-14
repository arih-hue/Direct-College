'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  MessageSquare,
  Star,
  TrendingUp,
  Building
} from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ReviewCard } from '@/components/cards/review-card'
import { reviews, colleges } from '@/data/mock'
import { cn } from '@/lib/utils'

const categories = ['All', 'IITs', 'NITs', 'IIITs', 'State']
const sortOptions = ['Most Recent', 'Most Helpful', 'Highest Rated', 'Lowest Rated']

export default function ReviewsPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Generate more reviews for display
  const allReviews = [...reviews, ...reviews, ...reviews].map((r, i) => ({
    ...r,
    id: `${r.id}-${i}`,
  }))

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
                <MessageSquare className="h-4 w-4 text-primary" />
                <span className="text-sm text-primary font-medium">Reality View</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                Honest <span className="gradient-text">Student Reviews</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Read verified reviews from current students and alumni. 
                No sugar-coating, just real experiences about placements, campus life, and academics.
              </p>

              {/* Search */}
              <div className="mt-8 max-w-xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search reviews by college..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 bg-secondary/50 border-border/50 text-lg"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl bg-secondary/30">
              <div className="text-2xl font-bold text-foreground">12,000+</div>
              <div className="text-sm text-muted-foreground">Total Reviews</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-secondary/30">
              <div className="text-2xl font-bold text-foreground">450+</div>
              <div className="text-sm text-muted-foreground">Colleges Covered</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-secondary/30">
              <div className="text-2xl font-bold text-foreground">95%</div>
              <div className="text-sm text-muted-foreground">Verified Reviews</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 overflow-x-auto">
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
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Sort: Most Recent
            </Button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ReviewCard review={review} />
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg">
              Load More Reviews
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}
