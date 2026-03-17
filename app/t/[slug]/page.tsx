'use client'

import { useEffect, useState } from 'react'
import { supabase, type Product, type InviteLink } from '@/lib/supabase'
import StarRating from '@/components/StarRating'
import Link from 'next/link'
import { use } from 'react'

type Status = 'loading' | 'valid' | 'invalid' | 'expired' | 'submitting' | 'success' | 'error'

export default function InvitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)

  const [status, setStatus]       = useState<Status>('loading')
  const [link, setLink]           = useState<InviteLink | null>(null)
  const [products, setProducts]   = useState<Product[]>([])

  // Form
  const [name, setName]           = useState('')
  const [prodId, setProdId]       = useState('')
  const [prodName, setProdName]   = useState('')
  const [rating, setRating]       = useState(0)
  const [message, setMessage]     = useState('')
  const [err, setErr]             = useState('')

  useEffect(() => {
    async function validate() {
      // 1. Fetch the invite link
      const { data: linkData, error } = await supabase
        .from('invite_links')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (error || !linkData) {
        setStatus('invalid')
        return
      }

      // 2. Check expiry
      if (linkData.expires_at && new Date(linkData.expires_at) < new Date()) {
        setStatus('expired')
        return
      }

      setLink(linkData)

      // Pre-fill product if link has one
      if (linkData.product_id) {
        setProdId(linkData.product_id)
        setProdName(linkData.product_name || '')
      }

      // 3. Increment usage counter (fire and forget via RPC)
      await supabase.rpc('increment_link_usage', { link_slug: slug })

      // 4. Load products list
      const { data: ps } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('category')
        .order('sort_order')
      if (ps) setProducts(ps)

      setStatus('valid')
    }
    validate()
  }, [slug])

  function selectProd(id: string) {
    setProdId(id)
    const p = products.find(x => x.id === id)
    setProdName(p ? `${p.name} ${p.duration}` : '')
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    if (!name.trim())               return setErr('Nama wajib diisi.')
    if (rating === 0)               return setErr('Pilih rating bintang.')
    if (message.trim().length < 10) return setErr('Minimal 10 karakter.')
    setStatus('submitting')

    const { error } = await supabase.from('testimonials').insert({
      name: name.trim(),
      product_id: prodId || null,
      product_name: prodName || null,
      rating,
      message: message.trim(),
    })

    setStatus(error ? 'error' : 'success')
    if (error) setErr('Gagal mengirim, coba lagi.')
  }

  // ── LOADING ──────────────────────────────────────────────────────────
  if (status === 'loading') return (
    <Screen>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 40, height: 40, border: '3px solid #1F1F23', borderTopColor: '#FF2D20', borderRadius: '50%', animation: 'spin3d 1s linear infinite' }} />
        <p style={{ color: '#3A3A42', fontSize: '.82rem', fontFamily: 'JetBrains Mono, monospace' }}>Memvalidasi link...</p>
      </div>
    </Screen>
  )

  // ── INVALID ──────────────────────────────────────────────────────────
  if (status === 'invalid') return (
    <Screen>
      <StatusCard
        icon="🔗"
        iconBg="rgba(255,45,32,.1)"
        iconBorder="rgba(255,45,32,.2)"
        title="LINK TIDAK VALID"
        titleColor="#FF2D20"
        desc="Link ini tidak ditemukan atau sudah dihapus oleh admin."
      />
    </Screen>
  )

  // ── EXPIRED ──────────────────────────────────────────────────────────
  if (status === 'expired') return (
    <Screen>
      <StatusCard
        icon="⏰"
        iconBg="rgba(245,158,11,.1)"
        iconBorder="rgba(245,158,11,.2)"
        title="LINK KEDALUWARSA"
        titleColor="#F59E0B"
        desc="Link ini sudah melewati tanggal berlaku. Hubungi seller untuk link baru."
      />
    </Screen>
  )

  // ── SUCCESS ──────────────────────────────────────────────────────────
  if (status === 'success') return (
    <Screen>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        {/* Animated checkmark */}
        <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 24px' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(34,197,94,.08)', border: '1px solid rgba(34,197,94,.2)', animation: 'pulse2 2s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', inset: 4, borderRadius: '50%', background: 'rgba(34,197,94,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
        <h2 className="font-display" style={{ fontSize: '2.8rem', color: '#F0F0F0', marginBottom: 10, letterSpacing: '.04em' }}>TERIMA KASIH!</h2>
        <p style={{ color: '#6B6B78', fontSize: '.9rem', lineHeight: 1.75, marginBottom: 8 }}>
          Testimonimu sudah masuk dan sedang menunggu persetujuan.
        </p>
        <p style={{ color: '#3A3A42', fontSize: '.78rem', fontFamily: 'JetBrains Mono, monospace', marginBottom: 32 }}>
          Biasanya tampil dalam 1×24 jam 🙏
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ background: '#FF2D20', color: '#fff', padding: '11px 22px', borderRadius: 11, fontWeight: 600, fontSize: '.85rem', textDecoration: 'none', transition: 'opacity .2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '.85'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
          >Lihat Pricelist</Link>
          <a href="https://wa.me/6208895114939" target="_blank" rel="noreferrer"
            style={{ background: '#141416', color: '#888', border: '1px solid #1F1F23', padding: '11px 22px', borderRadius: 11, fontWeight: 500, fontSize: '.85rem', textDecoration: 'none' }}
          >WhatsApp Order Lagi</a>
        </div>
      </div>
    </Screen>
  )

  // ── FORM ─────────────────────────────────────────────────────────────
  const cats = [
    { id: 'APP_EDITING', label: 'App Editing' },
    { id: 'AI_PRO',      label: 'AI Pro' },
    { id: 'STREAM',      label: 'Stream' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#070708' }}>
      {/* Ambient blobs */}
      <div style={{ position: 'fixed', top: '20%', left: '5%', width: 300, height: 300, background: 'radial-gradient(circle,rgba(255,45,32,.07) 0%,transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '15%', right: '5%', width: 260, height: 260, background: 'radial-gradient(circle,rgba(147,51,234,.06) 0%,transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Top bar */}
      <div style={{ borderBottom: '1px solid #1F1F23', padding: '0 20px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'rgba(7,7,8,.9)', backdropFilter: 'blur(16px)', zIndex: 50 }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span className="font-display" style={{ fontSize: '1.3rem', color: '#F0F0F0', letterSpacing: '.04em' }}>
            KOGRAPHH<span style={{ color: '#FF2D20' }}>.</span>
          </span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0E0E10', border: '1px solid #1F1F23', borderRadius: 99, padding: '5px 12px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', display: 'inline-block', animation: 'pulse2 2s ease-in-out infinite' }} />
          <span style={{ color: '#3A3A42', fontSize: '.68rem', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '.1em' }}>LINK VALID</span>
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '48px 20px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          {/* Personalized badge */}
          {link?.label && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0E0E10', border: '1px solid rgba(255,45,32,.2)', borderRadius: 99, padding: '6px 14px', marginBottom: 20 }}>
              <span style={{ fontSize: '.7rem' }}>🎯</span>
              <span style={{ color: '#FF2D20', fontSize: '.72rem', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '.08em' }}>{link.label}</span>
            </div>
          )}

          <p style={{ fontSize: '.68rem', letterSpacing: '.22em', color: '#FF2D20', fontFamily: 'JetBrains Mono, monospace', marginBottom: 8, textTransform: 'uppercase' }}>— Kamu Diundang —</p>
          <h1 className="font-display" style={{ fontSize: 'clamp(2.4rem,6vw,3.6rem)', color: '#F0F0F0', lineHeight: 1, marginBottom: 10, letterSpacing: '.04em' }}>
            BERI TESTIMONI
          </h1>

          {/* Pre-filled product hint */}
          {link?.product_name ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0E0E10', border: '1px solid #1F1F23', borderRadius: 10, padding: '8px 14px', marginTop: 10 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B6B78" strokeWidth="2"><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><circle cx="12" cy="12" r="2"/></svg>
              <span style={{ color: '#6B6B78', fontSize: '.75rem', fontFamily: 'JetBrains Mono, monospace' }}>Produk: </span>
              <span style={{ color: '#F0F0F0', fontSize: '.75rem', fontWeight: 600 }}>{link.product_name}</span>
            </div>
          ) : (
            <p style={{ color: '#6B6B78', fontSize: '.85rem', lineHeight: 1.7, marginTop: 8 }}>
              Pengalamanmu sangat berarti bagi kami dan pembeli lainnya.
            </p>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(90deg,rgba(255,45,32,.3),rgba(147,51,234,.3),transparent)', marginBottom: 32 }} />

        {/* Form */}
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

          {/* Name */}
          <Field label="NAMA *">
            <input className="inp" value={name} onChange={e => setName(e.target.value)}
              placeholder="Nama kamu (boleh pakai inisial)" required />
          </Field>

          {/* Product - pre-filled jika link punya produk */}
          <Field label="PRODUK YANG DIBELI">
            {link?.product_id ? (
              // Locked to the product pre-set by admin
              <div style={{ background: '#0E0E10', border: '1px solid #1F1F23', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2"><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><circle cx="12" cy="12" r="2"/></svg>
                <span style={{ color: '#F0F0F0', fontSize: '.85rem', flex: 1 }}>{link.product_name}</span>
                <span style={{ color: '#22C55E', fontSize: '.68rem', fontFamily: 'JetBrains Mono, monospace', background: 'rgba(34,197,94,.1)', padding: '2px 8px', borderRadius: 99 }}>auto-set</span>
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                <select className="inp" value={prodId} onChange={e => selectProd(e.target.value)} style={{ paddingRight: 40 }}>
                  <option value="">Pilih produk (opsional)</option>
                  {cats.map(cat => (
                    <optgroup key={cat.id} label={`✦ ${cat.label}`}>
                      {products.filter(p => p.category === cat.id).map(p => (
                        <option key={p.id} value={p.id}>{p.name} — {p.duration} ({p.price}K)</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <svg style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B6B78" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
              </div>
            )}
          </Field>

          {/* Rating */}
          <Field label="RATING *">
            <div style={{ padding: '4px 0' }}>
              <StarRating value={rating} onChange={setRating} size={38} />
            </div>
          </Field>

          {/* Message */}
          <Field label="CERITAKAN PENGALAMANMU *">
            <textarea className="inp" value={message} onChange={e => setMessage(e.target.value)}
              placeholder="Produk oke, fast respon, harga terjangkau, langsung aktif..."
              rows={4} style={{ resize: 'none' }} required />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
              <span style={{ color: message.length < 10 && message.length > 0 ? '#FF6B6B' : '#2A2A30', fontSize: '.68rem', fontFamily: 'JetBrains Mono, monospace' }}>
                {message.length < 10 && message.length > 0 ? `min 10 karakter` : `${message.length} karakter`}
              </span>
              {message.length >= 10 && (
                <span style={{ color: '#22C55E', fontSize: '.68rem', fontFamily: 'JetBrains Mono, monospace' }}>✓ ok</span>
              )}
            </div>
          </Field>

          {/* Error */}
          {err && (
            <div style={{ background: 'rgba(255,45,32,.07)', border: '1px solid rgba(255,45,32,.2)', borderRadius: 12, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ color: '#FF2D20', fontSize: '1rem', lineHeight: 1, flexShrink: 0 }}>!</span>
              <p style={{ color: '#FF8080', fontSize: '.82rem', fontFamily: 'JetBrains Mono, monospace' }}>{err}</p>
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={status === 'submitting'} style={{
            background: 'linear-gradient(135deg, #FF2D20 0%, #9333EA 100%)',
            color: '#fff', border: 'none', borderRadius: 14,
            padding: '15px', fontSize: '.92rem', fontWeight: 700,
            cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
            opacity: status === 'submitting' ? .75 : 1,
            transition: 'opacity .2s, transform .15s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: '0 4px 24px rgba(255,45,32,.2)',
          }}
            onMouseEnter={e => { if (status !== 'submitting') (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)' }}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
          >
            {status === 'submitting'
              ? <><Spin /> Mengirim...</>
              : <>Kirim Testimoni <span style={{ fontSize: '1.1rem' }}>✓</span></>
            }
          </button>

          {/* Slug watermark */}
          <p style={{ textAlign: 'center', color: '#2A2A30', fontSize: '.65rem', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '.08em' }}>
            link: /{slug}
          </p>
        </form>
      </div>
    </div>
  )
}

// ── Micro helpers ─────────────────────────────────────────────────────

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#070708', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center' }}>{children}</div>
    </div>
  )
}

function StatusCard({ icon, iconBg, iconBorder, title, titleColor, desc }: {
  icon: string; iconBg: string; iconBorder: string; title: string; titleColor: string; desc: string
}) {
  return (
    <div style={{ maxWidth: 380 }}>
      <div style={{ width: 72, height: 72, background: iconBg, border: `1px solid ${iconBorder}`, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '2rem' }}>{icon}</div>
      <h2 className="font-display" style={{ fontSize: '2.2rem', color: titleColor, marginBottom: 10, letterSpacing: '.04em' }}>{title}</h2>
      <p style={{ color: '#6B6B78', fontSize: '.88rem', lineHeight: 1.7, marginBottom: 24 }}>{desc}</p>
      <Link href="/" style={{ display: 'inline-block', background: '#0E0E10', border: '1px solid #1F1F23', color: '#888', padding: '10px 22px', borderRadius: 11, fontSize: '.82rem', textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace' }}>← Beranda</Link>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', color: '#6B6B78', fontSize: '.68rem', letterSpacing: '.16em', fontFamily: 'JetBrains Mono, monospace', marginBottom: 8 }}>{label}</label>
      {children}
    </div>
  )
}

function Spin() {
  return <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin3d 0.8s linear infinite' }} />
}
