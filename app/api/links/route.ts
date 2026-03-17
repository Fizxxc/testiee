import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Admin-only Supabase client (bypasses RLS)
function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

function verifyAdmin(req: NextRequest) {
  const auth = req.headers.get('x-admin-token')
  return auth === process.env.ADMIN_PASSWORD
}

// Generate slug: "kgx-" + 6 random alphanumeric chars
function generateSlug() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let rand = ''
  for (let i = 0; i < 6; i++) rand += chars[Math.floor(Math.random() * chars.length)]
  return `kgx-${rand}`
}

// POST  → create new link
// GET   → list all links
// PATCH → toggle active / update label
// DELETE→ delete link

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = adminClient()
  const { data, error } = await db
    .from('invite_links')
    .select('*, products(name,duration)')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ links: data })
}

export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const db = adminClient()

  // Generate unique slug (retry up to 5x on collision)
  let slug = ''
  for (let i = 0; i < 5; i++) {
    const candidate = generateSlug()
    const { data } = await db.from('invite_links').select('id').eq('slug', candidate).single()
    if (!data) { slug = candidate; break }
  }
  if (!slug) return NextResponse.json({ error: 'Gagal generate slug unik' }, { status: 500 })

  const insert: Record<string, unknown> = {
    slug,
    label: body.label || null,
    product_id: body.product_id || null,
    product_name: body.product_name || null,
    is_active: true,
  }
  if (body.expires_at) insert.expires_at = body.expires_at

  const { data, error } = await db.from('invite_links').insert(insert).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ link: data })
}

export async function PATCH(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { id, ...updates } = body
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const db = adminClient()
  const { data, error } = await db.from('invite_links').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ link: data })
}

export async function DELETE(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const db = adminClient()
  const { error } = await db.from('invite_links').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
