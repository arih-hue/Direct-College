import { supabase } from '@/lib/supabase'
import type { Review } from '@/types'

/**
 * Fetch reviews from Supabase.
 * Optionally filter by college_id.
 * Returns [] on error.
 */
export async function getReviews(collegeId?: string): Promise<Review[]> {
  let query = supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })

  if (collegeId) {
    query = query.eq('college_id', collegeId)
  }

  const { data, error } = await query

  if (error) {
    console.error('[getReviews] Supabase error:', error.message)
    return []
  }

  return (data as Review[]) ?? []
}
