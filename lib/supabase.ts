import { createClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(url, anon)

export const supabaseAdmin = () =>
  createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

// ─── Types ────────────────────────────────────────────────────────────
export type Category = 'APP_EDITING' | 'AI_PRO' | 'STREAM'

export interface Product {
  id: string
  category: Category
  name: string
  duration: string
  price: number
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  name: string
  product_id: string | null
  product_name: string | null
  rating: number
  message: string
  is_approved: boolean
  created_at: string
}

export interface InviteLink {
  id: string
  slug: string
  label: string | null
  product_id: string | null
  product_name: string | null
  used_count: number
  is_active: boolean
  expires_at: string | null
  created_at: string
}
