'use client'

import { useState, use } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  MapPin, 
  Calendar, 
  Star, 
  Users, 
  TrendingUp, 
  IndianRupee,
  Building,
  Award,
  BookOpen,
  Briefcase,
  ChevronRight,
  ExternalLink,
  Heart,
  GitCompare,
  MessageSquare,
  HelpCircle,
  CheckCircle,
  XCircle,
  Instagram,
  Disc,
  Phone,
  Send,
  Linkedin,
  Youtube,
  Globe
} from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { ReviewCard } from '@/components/cards/review-card'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { colleges, reviews } from '@/data/mock'
import { cn } from '@/lib/utils'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'

const tabs = [
  { id: 'overview', label: 'Overview', icon: Building },
  { id: 'cutoffs', label: 'Cutoffs', icon: TrendingUp },
  { id: 'placements', label: 'Placements', icon: Briefcase },
  { id: 'roi', label: 'ROI', icon: IndianRupee },
  { id: 'community', label: 'Community', icon: Users },
  { id: 'reviews', label: 'Reviews', icon: MessageSquare },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
]

const socialPlatforms = [
  { 
    key: 'instagram', 
    name: 'Instagram', 
    icon: Instagram, 
    color: 'from-pink-500 to-purple-500',
    description: 'Follow for campus life updates, events, and student stories'
  },
  { 
    key: 'discord', 
    name: 'Discord Server', 
    icon: Disc, 
    color: 'from-indigo-500 to-purple-600',
    description: 'Join 5,000+ students discussing academics, placements & more'
  },
  { 
    key: 'whatsapp', 
    name: 'WhatsApp Group', 
    icon: Phone, 
    color: 'from-green-500 to-emerald-600',
    description: 'Connect with aspirants and current students for quick help'
  },
  { 
    key: 'telegram', 
    name: 'Telegram Channel', 
    icon: Send, 
    color: 'from-blue-400 to-blue-600',
    description: 'Get instant updates on deadlines, results & announcements'
  },
  { 
    key: 'linkedin', 
    name: 'LinkedIn', 
    icon: Linkedin, 
    color: 'from-blue-600 to-blue-800',
    description: 'Network with alumni and explore career opportunities'
  },
  { 
    key: 'youtube', 
    name: 'YouTube', 
    icon: Youtube, 
    color: 'from-red-500 to-red-700',
    description: 'Watch campus tours, student experiences & placement talks'
  },
  { 
    key: 'reddit', 
    name: 'Reddit Community', 
    icon: Globe, 
    color: 'from-orange-500 to-red-500',
    description: 'Anonymous discussions, reviews & honest opinions'
  },
]

const placementData = [
  { year: '2020', avg: 15.5, median: 12, highest: 45 },
  { year: '2021', avg: 17.2, median: 14, highest: 52 },
  { year: '2022', avg: 18.5, median: 15, highest: 58 },
  { year: '2023', avg: 20.1, median: 17, highest: 65 },
  { year: '2024', avg: 21.0, median: 18, highest: 70 },
]

const recruiters = [
  'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Goldman Sachs', 
  'JP Morgan', 'Uber', 'Flipkart', 'Adobe', 'Oracle', 'Samsung'
]

const faqs = [
  {
    question: 'What is the admission process?',
    answer: 'Admission is through JEE Main/Advanced followed by JoSAA counseling. Students need to fill choices during counseling rounds and seat allotment is based on rank and availability.',
  },
  {
    question: 'What are the hostel facilities like?',
    answer: 'The college provides fully furnished hostels with AC and non-AC options. Each room has attached bathroom, study table, and high-speed WiFi.',
  },
  {
    question: 'Is there any scholarship available?',
    answer: 'Yes, merit-based and need-based scholarships are available. SC/ST students get full fee waiver as per government norms.',
  },
]

export default function CollegeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [activeTab, setActiveTab] = useState('overview')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const college = colleges.find((c) => c.id === id) || colleges[0]
  const collegeReviews = reviews.filter((r) => r.collegeId === college.id)

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `${(amount / 10000000).toFixed(1)} Cr`
    if (amount >= 100000) return `${(amount / 100000).toFixed(1)} LPA`
    return amount.toLocaleString()
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Header/Banner */}
      <section className="pt-20 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/explore" className="hover:text-foreground">Explore</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">{college.shortName}</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              {/* College Info */}
              <div className="flex items-start gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-border">
                  <span className="text-2xl font-bold text-primary">{college.type}</span>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                    {college.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {college.location}, {college.state}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Est. {college.established}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      {college.rating} ({college.reviewCount} reviews)
                    </span>
                  </div>
                  {/* Accreditations */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {college.accreditations.map((acc) => (
                      <span 
                        key={acc}
                        className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                      >
                        {acc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5 mr-2" />
                  Save
                </Button>
                <Link href="/compare">
                  <Button variant="outline" size="lg">
                    <GitCompare className="h-5 w-5 mr-2" />
                    Compare
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sticky Tabs */}
      <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-3 gap-1 no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-all',
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <GlassCard variant="strong" className="p-5 text-center">
                <TrendingUp className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  <AnimatedCounter value={college.avgPackage} prefix="₹" />
                </div>
                <p className="text-sm text-muted-foreground">Avg Package</p>
              </GlassCard>
              <GlassCard variant="strong" className="p-5 text-center">
                <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  <AnimatedCounter value={college.placementRate} suffix="%" />
                </div>
                <p className="text-sm text-muted-foreground">Placement Rate</p>
              </GlassCard>
              <GlassCard variant="strong" className="p-5 text-center">
                <IndianRupee className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  <AnimatedCounter value={college.fees} prefix="₹" />
                </div>
                <p className="text-sm text-muted-foreground">Total Fees</p>
              </GlassCard>
              <GlassCard variant="strong" className="p-5 text-center">
                <Award className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  #{college.ranking}
                </div>
                <p className="text-sm text-muted-foreground">NIRF Rank</p>
              </GlassCard>
            </div>

            {/* About */}
            <GlassCard variant="strong" className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">About {college.shortName}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {college.name} is one of the premier engineering institutions in India, 
                established in {college.established}. Located in {college.location}, {college.state}, 
                the institute is known for its excellent academic programs, world-class faculty, 
                and outstanding placement record. The college offers undergraduate, postgraduate, 
                and doctoral programs in various branches of engineering and technology.
              </p>
            </GlassCard>

            {/* Facilities */}
            <GlassCard variant="strong" className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Facilities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {college.facilities.map((facility) => (
                  <div key={facility} className="flex items-center gap-2 p-3 rounded-xl bg-secondary/50">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                    <span className="text-sm text-foreground">{facility}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Placements Tab */}
        {activeTab === 'placements' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Placement Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <GlassCard variant="strong" className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Average Package</p>
                <p className="text-3xl font-bold text-emerald-400">
                  {formatCurrency(college.avgPackage)}
                </p>
              </GlassCard>
              <GlassCard variant="strong" className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Median Package</p>
                <p className="text-3xl font-bold text-blue-400">
                  {formatCurrency(college.medianPackage)}
                </p>
              </GlassCard>
              <GlassCard variant="strong" className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Highest Package</p>
                <p className="text-3xl font-bold text-purple-400">
                  {formatCurrency(college.highestPackage)}
                </p>
              </GlassCard>
            </div>

            {/* Placement Chart */}
            <GlassCard variant="strong" className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Placement Trends (LPA)</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={placementData}>
                    <defs>
                      <linearGradient id="avgGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.65 0.22 275)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="oklch(0.65 0.22 275)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.025 260)" />
                    <XAxis dataKey="year" stroke="oklch(0.65 0.02 260)" />
                    <YAxis stroke="oklch(0.65 0.02 260)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'oklch(0.15 0.02 260)', 
                        border: '1px solid oklch(0.28 0.025 260)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="avg" 
                      stroke="oklch(0.65 0.22 275)" 
                      fill="url(#avgGradient)" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Top Recruiters */}
            <GlassCard variant="strong" className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Top Recruiters</h2>
              <div className="flex flex-wrap gap-3">
                {recruiters.map((company) => (
                  <span 
                    key={company}
                    className="px-4 py-2 rounded-xl bg-secondary/50 text-foreground text-sm border border-border/50"
                  >
                    {company}
                  </span>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                Student Reviews ({college.reviewCount})
              </h2>
              <Button>Write a Review</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </motion.div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 max-w-3xl"
          >
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Frequently Asked Questions
            </h2>
            {faqs.map((faq, index) => (
              <GlassCard 
                key={index} 
                variant="strong" 
                hover={false}
                className="p-0 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-5 flex items-center justify-between text-left"
                >
                  <span className="font-medium text-foreground">{faq.question}</span>
                  <ChevronRight className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform",
                    openFaq === index && "rotate-90"
                  )} />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5 text-muted-foreground">
                    {faq.answer}
                  </div>
                )}
              </GlassCard>
            ))}
          </motion.div>
        )}

        {/* Cutoffs Tab - Placeholder */}
        {activeTab === 'cutoffs' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">Cutoff Data</h3>
            <p className="text-muted-foreground mt-2">
              Detailed cutoff analysis for all branches and categories coming soon.
            </p>
          </motion.div>
        )}

        {/* ROI Tab - Placeholder */}
        {activeTab === 'roi' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <IndianRupee className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">ROI Analysis</h3>
            <p className="text-muted-foreground mt-2">
              Fee vs salary comparison and payback estimation coming soon.
            </p>
          </motion.div>
        )}

        {/* Community Tab */}
        {activeTab === 'community' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Connect with the {college.shortName} Community
              </h2>
              <p className="text-muted-foreground">
                Join official and student-run communities to connect with current students, 
                alumni, and fellow aspirants. Get real insights and instant help.
              </p>
            </div>

            {/* Social Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {socialPlatforms.map((platform) => {
                const socialLinks = college.socialLinks || {}
                const link = socialLinks[platform.key as keyof typeof socialLinks]
                const Icon = platform.icon
                
                if (!link) return null
                
                return (
                  <a
                    key={platform.key}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <GlassCard variant="strong" className="p-5 h-full transition-all duration-300 group-hover:border-primary/50 group-hover:scale-[1.02]">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          'h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0',
                          platform.color
                        )}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {platform.name}
                            </h3>
                            <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {platform.description}
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  </a>
                )
              })}
            </div>

            {/* No Social Links */}
            {!college.socialLinks || Object.keys(college.socialLinks).length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground">No community links available</h3>
                <p className="text-muted-foreground mt-2">
                  Community links for this college will be added soon.
                </p>
              </div>
            )}

            {/* Chat with Seniors CTA */}
            <GlassCard variant="strong" className="p-6 bg-gradient-to-br from-primary/10 to-accent/10">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Want personalized advice?
                  </h3>
                  <p className="text-muted-foreground">
                    Chat directly with current students and alumni from {college.shortName}. 
                    Get honest answers to your questions about campus life, placements, and more.
                  </p>
                </div>
                <Link href="/seniors">
                  <Button size="lg" className="shrink-0 gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Chat with Seniors
                  </Button>
                </Link>
              </div>
            </GlassCard>

            {/* Community Guidelines */}
            <GlassCard variant="strong" className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Community Guidelines</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">Be respectful and helpful to fellow aspirants and seniors</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">Verify information before making important decisions</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">Avoid sharing personal contact information publicly</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">Report any suspicious or inappropriate content</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
      
      <Footer />
    </main>
  )
}
