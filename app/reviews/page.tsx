'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  MessageSquare,
  Loader2
} from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ReviewCard } from '@/components/cards/review-card'
import { cn } from '@/lib/utils'
import type { Review } from '@/types'
import { getReviews } from '@/lib/api/services/reviews'

const categories = ['All', 'IITs', 'NITs', 'IIITs', 'State']

const mockReviews: Review[] = [
  {
    id: 'mock-1',
    college_id: '2b2f5358-6839-4e06-bd78-7966d6385daa',
    user_name: 'Rahul Sharma',
    userName: 'Rahul Sharma',
    rating: 5,
    title: 'NIT Trichy: Placements and Campus Life are top-tier!',
    content: 'NIT Trichy offers an unparalleled college experience. Placements are extremely robust with almost all major tech firms recruiting here. Campus size is huge with plenty of green spaces and sports complexes.',
    body: 'NIT Trichy offers an unparalleled college experience. Placements are extremely robust with almost all major tech firms recruiting here. Campus size is huge with plenty of green spaces and sports complexes.',
    pros: ['Top placements', 'Large active campus', 'Strong alumni network'],
    cons: ['Very hot climate', 'Heavy academic load'],
    verified: true,
    branch: 'Computer Science',
    batch: '2024',
    created_at: new Date('2025-05-10T12:00:00'),
    createdAt: new Date('2025-05-10T12:00:00'),
  },
  {
    id: 'mock-2',
    college_id: '2b2f5358-6839-4e06-bd78-7966d6385daa',
    user_name: 'Ananya Iyer',
    userName: 'Ananya Iyer',
    rating: 4,
    title: 'Excellent Peer Group and Tech Culture',
    content: 'The coding culture here is outstanding. Pragyan and Festember are highlights of the year. Hostels are decent, and mess food is manageable.',
    body: 'The coding culture here is outstanding. Pragyan and Festember are highlights of the year. Hostels are decent, and mess food is manageable.',
    pros: ['Outstanding coding culture', 'Excellent college fests'],
    cons: ['Mess food could be better', 'Strict attendance rules'],
    verified: true,
    branch: 'Electronics & Communication',
    batch: '2025',
    created_at: new Date('2025-04-18T10:00:00'),
    createdAt: new Date('2025-04-18T10:00:00'),
  }
]

export default function ReviewsPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getReviews().then((data) => {
      if (data && data.length > 0) {
        setReviews(data)
      } else {
        setReviews(mockReviews)
      }
      setLoading(false)
    })
  }, [])

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
