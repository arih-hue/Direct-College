import { supabase } from '@/lib/supabase'
import type { College } from '@/types'

export type CollegeListItem = College

export type CollegeListParams = Record<string, string | number | boolean | undefined>

/**
 * Fetch all colleges from Supabase.
 * Returns [] on error.
 */
export async function getColleges(): Promise<College[]> {
  const { data, error } = await supabase
    .from('colleges')
    .select('*')
    .order('nirf_rank', { ascending: true, nullsFirst: false })

  if (error) {
    console.error('[getColleges] Supabase error:', error.message)
    return []
  }

  return (data as College[]) ?? []
}

/**
 * Fetch a single college by its id or slug.
 * Returns null on error or not found.
 */
export async function getCollegeById(id: string): Promise<College | null> {
  // Try matching by UUID id first, then by slug
  const { data, error } = await supabase
    .from('colleges')
    .select('*')
    .or(`id.eq.${id},slug.eq.${id}`)
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('[getCollegeById] Supabase error:', error.message)
    return null
  }

  return (data as College | null) ?? null
}