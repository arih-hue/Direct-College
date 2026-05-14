'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  MapPin, 
  GraduationCap, 
  IndianRupee,
  Heart,
  Settings,
  Edit2,
  Save,
  TrendingUp,
  Target
} from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GlassCard } from '@/components/ui/glass-card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const categories = ['General', 'OBC-NCL', 'SC', 'ST', 'EWS', 'PwD']
const genders = ['Male', 'Female', 'Other']
const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Gujarat', 'Rajasthan', 'UP', 'MP', 'Other']
const branches = ['Computer Science', 'Electronics', 'Electrical', 'Mechanical', 'Civil', 'Chemical']

// Mock user data
const userData = {
  name: 'Arjun Sharma',
  email: 'arjun.sharma@email.com',
  jeeRank: 8500,
  category: 'General',
  gender: 'Male',
  homeState: 'Maharashtra',
  preferredBranches: ['Computer Science', 'Electronics'],
  budget: 1500000,
}

const savedColleges = [
  { name: 'IIT Bombay', branch: 'Electrical Engineering', chance: 'MODERATE' },
  { name: 'NIT Trichy', branch: 'Computer Science', chance: 'SAFE' },
  { name: 'IIIT Hyderabad', branch: 'Computer Science', chance: 'DREAM' },
]

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(userData)

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-8"
          >
            <div className="flex items-center justify-between">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                My <span className="gradient-text">Profile</span>
              </h1>
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={() => setIsEditing(!isEditing)}
                className={isEditing ? "bg-gradient-to-r from-primary to-accent" : ""}
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <GlassCard variant="strong" hover={false} className="p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
                  <User className="h-12 w-12 text-primary-foreground" />
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-foreground">{formData.name}</h2>
                  <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2 mt-1">
                    <Mail className="h-4 w-4" />
                    {formData.email}
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* JEE Rank */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    JEE Main Rank
                  </label>
                  <Input
                    type="number"
                    value={formData.jeeRank}
                    onChange={(e) => setFormData({ ...formData, jeeRank: parseInt(e.target.value) })}
                    disabled={!isEditing}
                    className="h-12 bg-secondary/50 border-border/50"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-400" />
                    Category
                  </label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="h-12 bg-secondary/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Gender */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <User className="h-4 w-4 text-purple-400" />
                    Gender
                  </label>
                  <Select 
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="h-12 bg-secondary/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {genders.map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Home State */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-emerald-400" />
                    Home State
                  </label>
                  <Select 
                    value={formData.homeState}
                    onValueChange={(value) => setFormData({ ...formData, homeState: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="h-12 bg-secondary/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Budget */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-amber-400" />
                    Budget (Total Fees)
                  </label>
                  <Input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) })}
                    disabled={!isEditing}
                    className="h-12 bg-secondary/50 border-border/50"
                  />
                </div>

                {/* Preferred Branch */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-rose-400" />
                    Preferred Branch
                  </label>
                  <Select disabled={!isEditing}>
                    <SelectTrigger className="h-12 bg-secondary/50 border-border/50">
                      <SelectValue placeholder="Computer Science" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Saved Colleges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GlassCard variant="strong" hover={false} className="p-0 overflow-hidden">
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Heart className="h-5 w-5 text-rose-400" />
                  Saved Colleges
                </h2>
                <Link href="/predictor">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {savedColleges.map((college, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold text-sm">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{college.name}</p>
                        <p className="text-sm text-muted-foreground">{college.branch}</p>
                      </div>
                      <span className={cn(
                        "px-3 py-1 text-xs rounded-full font-medium",
                        college.chance === 'SAFE' && "bg-emerald-500/20 text-emerald-400",
                        college.chance === 'MODERATE' && "bg-amber-500/20 text-amber-400",
                        college.chance === 'DREAM' && "bg-rose-500/20 text-rose-400",
                      )}>
                        {college.chance}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <Link href="/settings">
              <GlassCard variant="strong" className="p-5 cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                    <Settings className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                      Account Settings
                    </p>
                    <p className="text-sm text-muted-foreground">Manage notifications & privacy</p>
                  </div>
                </div>
              </GlassCard>
            </Link>
            <Link href="/strategy">
              <GlassCard variant="strong" className="p-5 cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                      My Strategy
                    </p>
                    <p className="text-sm text-muted-foreground">View counseling roadmap</p>
                  </div>
                </div>
              </GlassCard>
            </Link>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}
