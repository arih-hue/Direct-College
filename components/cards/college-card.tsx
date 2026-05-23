'use client'

import Link from 'next/link'

import {
    MapPin,
    IndianRupee,
    Trophy,
} from 'lucide-react'

import { GlassCard } from '@/components/ui/glass-card'

import type { College } from '@/types'

interface CollegeCardProps {
    college: College
    chance?: 'SAFE' | 'MODERATE' | 'DREAM'
    closingRank?: number
}

export function CollegeCard({
    college,
    chance,
    closingRank,
}: CollegeCardProps) {

    return (

        <GlassCard className="p-5 h-full">

            <Link href={`/college/${college.slug}`}>

                <div className="space-y-4">

                    {/* Header */}

                    <div>

                        <div className="flex items-start justify-between gap-3">

                            <h3 className="text-lg font-bold text-foreground line-clamp-2">
                                {college.name}
                            </h3>

                            <span className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                {college.type}
                            </span>

                        </div>

                        <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">

                            <MapPin className="h-4 w-4" />

                            {college.city}, {college.state}

                        </div>

                    </div>

                    {/* Stats */}

                    <div className="space-y-2">

                        <div className="flex items-center justify-between">

                            <span className="text-sm text-muted-foreground">
                                NIRF Rank
                            </span>

                            <span className="font-semibold">
                                #{college.nirf_rank}
                            </span>

                        </div>

                        <div className="flex items-center justify-between">

                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <IndianRupee className="h-4 w-4" />
                                Avg Package
                            </span>

                            <span className="font-semibold">
                                ₹{college.avg_package}
                            </span>

                        </div>

                        <div className="flex items-center justify-between">

                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Trophy className="h-4 w-4" />
                                Highest Package
                            </span>

                            <span className="font-semibold">
                                ₹{college.highest_package}
                            </span>

                        </div>

                        <div className="flex items-center justify-between">

                            <span className="text-sm text-muted-foreground">
                                Fees
                            </span>

                            <span className="font-semibold">
                                ₹{college.fees}
                            </span>

                        </div>

                    </div>

                    {/* Predictor Section */}

                    {chance && (

                        <div className="border-t border-border pt-4">

                            <div className="flex items-center justify-between">

                                <span
                                    className={`rounded-lg px-3 py-1 text-xs font-medium ${chance === 'SAFE'
                                            ? 'bg-emerald-500/10 text-emerald-400'
                                            : chance === 'MODERATE'
                                                ? 'bg-amber-500/10 text-amber-400'
                                                : 'bg-rose-500/10 text-rose-400'
                                        }`}
                                >
                                    {chance}
                                </span>

                                {closingRank && (

                                    <span className="text-sm text-muted-foreground">
                                        Closing Rank: {closingRank}
                                    </span>

                                )}

                            </div>

                        </div>

                    )}

                </div>

            </Link>

        </GlassCard>
    )
}