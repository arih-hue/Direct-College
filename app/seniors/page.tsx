'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  Search, 
  MessageSquare, 
  Star, 
  Clock, 
  Users, 
  Filter,
  Send,
  X,
  ChevronRight,
  GraduationCap,
  Building2,
  Briefcase,
  CheckCircle,
  Circle,
  ArrowLeft
} from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GlassCard } from '@/components/ui/glass-card'
import { cn } from '@/lib/utils'
import type { Senior } from '@/types'

const seniors: Senior[] = [
  {
    id: '1',
    name: 'Aaditya Verma',
    college: 'IIT Bombay',
    collegeId: 'iit-bombay',
    branch: 'Computer Science',
    batch: '2024',
    company: 'Google',
    role: 'Software Engineer',
    bio: 'CSE graduate from IIT Bombay. Highly passionate about software development and competitive programming. Helped 300+ students with Josaa choice filling.',
    expertise: ['Branch Selection', 'Software Placements', 'Campus Life'],
    responseTime: 'Under 1 hr',
    helpedCount: 312,
    rating: 4.9,
    isOnline: true,
    lastSeen: new Date(),
  },
  {
    id: '2',
    name: 'Megha Singhal',
    college: 'NIT Trichy',
    collegeId: 'nit-trichy',
    branch: 'Electronics & Communication',
    batch: '2025',
    company: 'Texas Instruments',
    role: 'Analog Engineer',
    bio: 'Final year ECE student at NIT Trichy. Love to guide juniors regarding NIT campus life and core engineering opportunities.',
    expertise: ['Core Placements', 'NIT Campus Life', 'JoSAA Counseling'],
    responseTime: 'Under 2 hrs',
    helpedCount: 184,
    rating: 4.8,
    isOnline: false,
    lastSeen: new Date(Date.now() - 3600000 * 3), // 3 hours ago
  },
  {
    id: '3',
    name: 'Rohan Deshmukh',
    college: 'IIIT Allahabad',
    collegeId: 'iiit-allahabad',
    branch: 'Information Technology',
    batch: '2023',
    company: 'Amazon',
    role: 'SDE-1',
    bio: 'IIITA Alumnus. Working as a Software Engineer at Amazon. Can help you choose between NIT core branches vs IIIT IT/CS branches.',
    expertise: ['IIIT Admissions', 'Coding Culture', 'Placements'],
    responseTime: 'Under 4 hrs',
    helpedCount: 254,
    rating: 4.9,
    isOnline: true,
    lastSeen: new Date(),
  }
]

const collegeFilters = ['All', 'IIT', 'NIT', 'IIIT']
const expertiseFilters = ['All', 'Counseling', 'Placements', 'Campus Life', 'Branch Selection', 'Research']

export default function SeniorsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCollegeFilter, setSelectedCollegeFilter] = useState('All')
  const [selectedExpertiseFilter, setSelectedExpertiseFilter] = useState('All')
  const [selectedSenior, setSelectedSenior] = useState<Senior | null>(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<{ id: string; content: string; sender: 'user' | 'senior'; time: string }[]>([])

  const filteredSeniors = seniors.filter((senior: Senior) => {
    const matchesSearch = senior.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      senior.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      senior.branch.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCollege = selectedCollegeFilter === 'All' || 
      senior.college.includes(selectedCollegeFilter)
    
    const matchesExpertise = selectedExpertiseFilter === 'All' ||
      senior.expertise.some((e: string) => e.toLowerCase().includes(selectedExpertiseFilter.toLowerCase()))

    return matchesSearch && matchesCollege && matchesExpertise
  })

  const handleSendMessage = () => {
    if (!message.trim()) return
    
    const newMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user' as const,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    
    setMessages([...messages, newMessage])
    setMessage('')
    
    // Simulate senior response
    setTimeout(() => {
      const responses = [
        "Thanks for reaching out! I'd be happy to help you with that.",
        "That's a great question! Let me share my experience...",
        "I understand your concern. Here's what I suggest...",
        "Based on my experience at college, I would recommend..."
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        sender: 'senior',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
    }, 1500)
  }

  const openChat = (senior: Senior) => {
    setSelectedSenior(senior)
    setChatOpen(true)
    setMessages([
      {
        id: '0',
        content: `Hi! I'm ${senior.name} from ${senior.college}. Feel free to ask me anything about ${senior.expertise.slice(0, 2).join(', ')} or college life in general!`,
        sender: 'senior',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ])
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Header */}
      <section className="pt-24 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Chat with Seniors</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Get <span className="text-gradient">Real Advice</span> from Real Students
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect directly with current students and alumni from top colleges. 
              Get honest insights about campus life, placements, and more.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="py-6 border-y border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{seniors.length}+</p>
              <p className="text-sm text-muted-foreground">Active Seniors</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {seniors.reduce((acc: number, s: Senior) => acc + s.helpedCount, 0).toLocaleString()}+
              </p>
              <p className="text-sm text-muted-foreground">Students Helped</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">4.8</p>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-400">&lt; 2 hrs</p>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-6 sticky top-16 z-20 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, college, or branch..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary/50 border-border/50"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {/* College Filter */}
              <div className="flex gap-1 p-1 bg-secondary/50 rounded-full">
                {collegeFilters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedCollegeFilter(filter)}
                    className={cn(
                      'px-3 py-1.5 text-sm rounded-full transition-all',
                      selectedCollegeFilter === filter
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Expertise Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {expertiseFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedExpertiseFilter(filter)}
                className={cn(
                  'px-3 py-1.5 text-sm rounded-full border transition-all',
                  selectedExpertiseFilter === filter
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'border-border/50 text-muted-foreground hover:border-primary/50 hover:text-foreground'
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Seniors Grid */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSeniors.map((senior: Senior, index: number) => (
              <motion.div
                key={senior.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <GlassCard variant="strong" className="p-6 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                        <span className="text-xl font-bold text-foreground">
                          {senior.name.split(' ').map((n: string) => n[0]).join('')}
                        </span>
                      </div>
                      {/* Online indicator */}
                      <div className={cn(
                        'absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-card',
                        senior.isOnline ? 'bg-emerald-500' : 'bg-muted-foreground'
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{senior.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{senior.branch}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-primary font-medium">{senior.college}</span>
                        <span className="text-xs text-muted-foreground">• {senior.batch}</span>
                      </div>
                    </div>
                  </div>

                  {/* Company Badge */}
                  {senior.company && (
                    <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-secondary/50">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{senior.role}</span>
                      <span className="text-sm text-muted-foreground">@ {senior.company}</span>
                    </div>
                  )}

                  {/* Bio */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                    {senior.bio}
                  </p>

                  {/* Expertise Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {senior.expertise.slice(0, 3).map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                    {senior.expertise.length > 3 && (
                      <span className="px-2 py-1 text-xs rounded-full bg-secondary text-muted-foreground">
                        +{senior.expertise.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm mb-4 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span>{senior.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{senior.helpedCount} helped</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{senior.responseTime}</span>
                    </div>
                  </div>

                  {/* Chat Button */}
                  <Button 
                    onClick={() => openChat(senior)}
                    className="w-full gap-2"
                    variant={senior.isOnline ? 'default' : 'outline'}
                  >
                    <MessageSquare className="h-4 w-4" />
                    {senior.isOnline ? 'Chat Now' : 'Leave Message'}
                  </Button>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {filteredSeniors.length === 0 && (
            <div className="text-center py-16">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground">No seniors found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Chat Modal */}
      <AnimatePresence>
        {chatOpen && selectedSenior && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setChatOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            />
            
            {/* Chat Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-auto md:right-4 md:bottom-4 md:w-[420px] md:h-[600px] z-50 flex flex-col rounded-2xl overflow-hidden border border-border bg-card shadow-2xl"
            >
              {/* Chat Header */}
              <div className="p-4 border-b border-border bg-secondary/30 flex items-center gap-3">
                <button 
                  onClick={() => setChatOpen(false)}
                  className="md:hidden p-1 hover:bg-secondary rounded-lg"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                    <span className="text-sm font-bold text-foreground">
                      {selectedSenior.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className={cn(
                    'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card',
                    selectedSenior.isOnline ? 'bg-emerald-500' : 'bg-muted-foreground'
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{selectedSenior.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedSenior.isOnline ? 'Online' : `Last seen ${selectedSenior.lastSeen?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                  </p>
                </div>
                <button 
                  onClick={() => setChatOpen(false)}
                  className="hidden md:flex p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex',
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div className={cn(
                      'max-w-[80%] rounded-2xl px-4 py-2.5',
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-secondary text-foreground rounded-bl-md'
                    )}>
                      <p className="text-sm">{msg.content}</p>
                      <p className={cn(
                        'text-xs mt-1',
                        msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      )}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border bg-secondary/30">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 bg-background border-border/50"
                  />
                  <Button onClick={handleSendMessage} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Average response time: {selectedSenior.responseTime}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  )
}
