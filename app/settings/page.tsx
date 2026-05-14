'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings,
  Bell,
  Shield,
  Moon,
  Smartphone,
  Mail,
  Trash2,
  LogOut,
  ChevronRight
} from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { cn } from '@/lib/utils'

const settingSections = [
  {
    title: 'Notifications',
    icon: Bell,
    settings: [
      { key: 'email_notifications', label: 'Email Notifications', description: 'Get updates about deadlines and counseling rounds', enabled: true },
      { key: 'push_notifications', label: 'Push Notifications', description: 'Browser notifications for important alerts', enabled: false },
      { key: 'deadline_reminders', label: 'Deadline Reminders', description: 'Get reminded 3 days before important deadlines', enabled: true },
    ],
  },
  {
    title: 'Privacy',
    icon: Shield,
    settings: [
      { key: 'profile_visibility', label: 'Profile Visibility', description: 'Show your profile to other students', enabled: false },
      { key: 'show_rank', label: 'Show Rank', description: 'Display your JEE rank on your profile', enabled: false },
    ],
  },
  {
    title: 'Preferences',
    icon: Settings,
    settings: [
      { key: 'dark_mode', label: 'Dark Mode', description: 'Use dark theme (recommended)', enabled: true },
      { key: 'compact_view', label: 'Compact View', description: 'Show more content with less spacing', enabled: false },
    ],
  },
]

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, boolean>>({
    email_notifications: true,
    push_notifications: false,
    deadline_reminders: true,
    profile_visibility: false,
    show_rank: false,
    dark_mode: true,
    compact_view: false,
  })

  const toggleSetting = (key: string) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              <span className="gradient-text">Settings</span>
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Manage your account preferences and notifications.
            </p>
          </motion.div>

          {/* Settings Sections */}
          <div className="space-y-6">
            {settingSections.map((section, sectionIndex) => {
              const Icon = section.icon
              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
                >
                  <GlassCard variant="strong" hover={false} className="p-0 overflow-hidden">
                    <div className="p-5 border-b border-border/50">
                      <h2 className="font-semibold text-foreground flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        {section.title}
                      </h2>
                    </div>
                    <div className="divide-y divide-border/30">
                      {section.settings.map((setting) => (
                        <div
                          key={setting.key}
                          className="p-5 flex items-center justify-between gap-4"
                        >
                          <div>
                            <p className="font-medium text-foreground">{setting.label}</p>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {setting.description}
                            </p>
                          </div>
                          <button
                            onClick={() => toggleSetting(setting.key)}
                            className={cn(
                              "relative h-6 w-11 rounded-full transition-colors",
                              settings[setting.key]
                                ? "bg-primary"
                                : "bg-secondary"
                            )}
                          >
                            <span
                              className={cn(
                                "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                                settings[setting.key] && "translate-x-5"
                              )}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              )
            })}

            {/* Danger Zone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <GlassCard variant="strong" hover={false} className="p-0 overflow-hidden border-destructive/30">
                <div className="p-5 border-b border-border/50">
                  <h2 className="font-semibold text-destructive flex items-center gap-2">
                    <Trash2 className="h-5 w-5" />
                    Danger Zone
                  </h2>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-foreground">Sign Out</p>
                      <p className="text-sm text-muted-foreground">
                        Sign out of your account on this device
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                  <div className="flex items-center justify-between gap-4 pt-4 border-t border-border/30">
                    <div>
                      <p className="font-medium text-foreground">Delete Account</p>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}
