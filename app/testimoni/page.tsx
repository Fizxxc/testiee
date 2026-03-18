'use client'
import { useEffect, useState } from 'react'
import { supabase, type Product, type Testimonial } from '@/lib/supabase'
import StarRating from '@/components/StarRating'
import TestiCard from '@/components/TestiCard'
import { MobileNav, DesktopNav } from '@/components/Navbar'
import Link from 'next/link'

type Tab = 'form' | 'preview'

export default function TestimoniPage() {
  const [tab, setTab]         = useState<Tab>('form')
  const [products, setProds]  = useState<Product[]>([])
  const [testis, setTestis]   = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName]       = useState('')
  const [prodId, setProdId]   = useState('')
  const [prodName, setProdNm] = useState('')
  const [rating, setRating]   = useState(0)
  const [message, setMessage] = useState('')
  const [err, setErr]         = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone]       = useState(false)

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('*').eq('is_active', true).order('category').order('sort_order'),
      supabase.from('testimonials').select('*').eq('is_approved', true).order('created_at', { ascending: false }).limit(12),
    ]).then(([{ data: ps }, { data: ts }]) => {
      if (ps) setProds(ps)
      if (ts) setTestis(ts)
      setLoading(false)
    })
  }, [])

  function selectProd(id: string) {
    setProdId(id)
    const p = products.find(x => x.id === id)
    setProdNm(p ? `${p.name} ${p.duration}` : '')
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    if (!name.trim())               return setErr('Nama wajib diisi.')
    if (rating === 0)               return setErr('Pilih rating bintang.')
    if (message.trim().length < 10) return setErr('Minimal 10 karakter.')
    setSending(true)
    const { error } = await supabase.from('testimonials').insert({
      name: name.trim(), product_id: prodId || null,
      product_name: prodName || null, rating, message: message.trim(),
    })
    setSending(false)
    if (error) return setErr('Gagal mengirim, coba lagi.')
    setDone(true)
  }

  const cats = [
    { id: 'APP_EDITING', label: 'App Editing' },
    { id: 'AI_PRO',      label: 'AI Pro' },
    { id: 'STREAM',      label: 'Stream' },
  ]

  // ── SUCCESS ─────────────────────────────────────────────────────────
  if (done) return (
    <div style={{ minHeight: '100vh', background: '#070708', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <MobileNav />
      <div style={{ textAlign: 'center', maxWidth: 380 }}>
        <div style={{ width: 80, height: 80, background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.2)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h2 className="font-display" style={{ fontSize: '3rem', color: '#F0F0F0', marginBottom: 8 }}>TERIMA KASIH!</h2>
        <p style={{ color: '#6B6B78', fontSize: '.88rem', lineHeight: 1.75, marginBottom: 28 }}>
          Testimonimu sudah kami terima dan sedang menunggu persetujuan. Biasanya muncul dalam 1×24 jam 🙏
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ background: '#FF2D20', color: '#fff', padding: '11px 22px', borderRadius: 11, fontWeight: 600, fontSize: '.88rem', textDecoration: 'none' }}>← Beranda</Link>
          <button onClick={() => { setDone(false); setName(''); setProdId(''); setProdNm(''); setRating(0); setMessage('') }}
            style={{ background: '#0E0E10', color: '#F0F0F0', border: '1px solid #1F1F23', padding: '11px 22px', borderRadius: 11, fontWeight: 500, fontSize: '.88rem', cursor: 'pointer' }}>
            Kirim Lagi
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="mobile-pad" style={{ minHeight: '100vh', background: '#070708' }}>
      <DesktopNav />
      <MobileNav />

      {/* ── Mobile header ──────────────────────────────────── */}
      <div className="mobile-only" style={{ padding: '20px 16px 0', paddingTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span className="font-display" style={{ fontSize: '1.4rem', color: '#F0F0F0' }}>KOGRAPHH<span style={{ color: '#FF2D20' }}>.</span></span>
          </Link>
          <div style={{ display: 'flex', background: '#0E0E10', border: '1px solid #1F1F23', borderRadius: 10, padding: 3 }}>
            {(['form','preview'] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                background: tab === t ? '#FF2D20' : 'transparent',
                color: tab === t ? '#fff' : '#6B6B78',
                border: 'none', borderRadius: 8, padding: '6px 14px',
                fontSize: '.72rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace',
              }}>
                {t === 'form' ? '✍️ Form' : '👁️ Testi'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Desktop topbar ─────────────────────────────────── */}
      <div className="desktop-only" style={{ borderBottom: '1px solid #1F1F23', padding: '0 20px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1000, margin: '0 auto' }}>
        <div />
        <div style={{ display: 'flex', background: '#0E0E10', border: '1px solid #1F1F23', borderRadius: 12, padding: 4 }}>
          {(['form','preview'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: tab === t ? '#FF2D20' : 'transparent',
              color: tab === t ? '#fff' : '#6B6B78',
              border: 'none', borderRadius: 9, padding: '7px 16px',
              fontSize: '.78rem', fontWeight: 600, cursor: 'pointer',
            }}>
              {t === 'form' ? '✍️ Tulis Testi' : '👁️ Lihat Testi Lain'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(16px,4vw,48px) clamp(16px,4vw,20px)' }}>

        {/* ── FORM TAB ──────────────────────────────────── */}
        {tab === 'form' && (
          <div style={{ maxWidth: 540, margin: '0 auto' }}>
            {/* Title */}
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: '.65rem', letterSpacing: '.2em', color: '#FF2D20', fontFamily: 'JetBrains Mono, monospace', marginBottom: 6 }}>— BAGIKAN PENGALAMANMU —</p>
              <h1 className="font-display" style={{ fontSize: 'clamp(2rem,6vw,3.5rem)', color: '#F0F0F0', marginBottom: 6 }}>BERI TESTIMONI</h1>
              <p style={{ color: '#6B6B78', fontSize: '.82rem', lineHeight: 1.7 }}>
                Akan ditampilkan setelah disetujui admin.
              </p>
            </div>

            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Name */}
              <div>
                <label style={lbl}>NAMA *</label>
                <input className="inp" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Nama kamu (boleh pakai inisial)" required />
              </div>

              {/* Product */}
              <div>
                <label style={lbl}>PRODUK YANG DIBELI</label>
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
              </div>

              {/* Rating */}
              <div>
                <label style={lbl}>RATING *</label>
                <StarRating value={rating} onChange={setRating} size={34} />
              </div>

              {/* Message */}
              <div>
                <label style={lbl}>PENGALAMANMU *</label>
                <textarea className="inp" value={message} onChange={e => setMessage(e.target.value)}
                  placeholder="Produk oke, fast respon, harga terjangkau..."
                  rows={4} style={{ resize: 'none' }} required />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ color: message.length < 10 && message.length > 0 ? '#FF6B6B' : '#2A2A30', fontSize: '.65rem', fontFamily: 'JetBrains Mono, monospace' }}>
                    {message.length < 10 && message.length > 0 ? `min 10 karakter` : `${message.length} karakter`}
                  </span>
                  {message.length >= 10 && <span style={{ color: '#22C55E', fontSize: '.65rem', fontFamily: 'JetBrains Mono, monospace' }}>✓</span>}
                </div>
              </div>

              {err && (
                <div style={{ background: 'rgba(255,45,32,.07)', border: '1px solid rgba(255,45,32,.2)', borderRadius: 12, padding: '11px 14px' }}>
                  <p style={{ color: '#FF8080', fontSize: '.8rem', fontFamily: 'JetBrains Mono, monospace' }}>{err}</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: 10 }}>
                {/* Show preview only on desktop */}
                <button type="button" onClick={() => setTab('preview')} className="desktop-only"
                  style={{ flex: 1, background: 'transparent', border: '1px solid #1F1F23', color: '#6B6B78', borderRadius: 12, padding: '13px', fontSize: '.83rem', cursor: 'pointer', transition: 'all .2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#3A3A42'; (e.currentTarget as HTMLElement).style.color = '#F0F0F0' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1F1F23'; (e.currentTarget as HTMLElement).style.color = '#6B6B78' }}
                >Lihat Testi Lain</button>
                <button type="submit" disabled={sending}
                  style={{ flex: 1, background: 'linear-gradient(135deg,#FF2D20,#9333EA)', color: '#fff', border: 'none', borderRadius: 12, padding: '13px', fontSize: '.88rem', fontWeight: 700, cursor: sending ? 'not-allowed' : 'pointer', opacity: sending ? .7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  {sending ? <><Spin />Mengirim...</> : 'Kirim Testimoni ✓'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── PREVIEW TAB ──────────────────────────────── */}
        {tab === 'preview' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <p style={{ fontSize: '.65rem', letterSpacing: '.2em', color: '#9333EA', fontFamily: 'JetBrains Mono, monospace', marginBottom: 6 }}>— LIHAT —</p>
                <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', color: '#F0F0F0' }}>TESTIMONI LAINNYA</h2>
              </div>
              <button onClick={() => setTab('form')} style={{ background: '#FF2D20', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 11, fontSize: '.83rem', fontWeight: 600, cursor: 'pointer' }}>
                ← Form
              </button>
            </div>

            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 12 }}>
                {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 150, borderRadius: 16 }} />)}
              </div>
            ) : testis.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#3A3A42' }}>
                <p>Belum ada testimoni. Jadilah yang pertama!</p>
              </div>
            ) : (
              <div className="testi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
                {testis.map((t, i) => <TestiCard key={t.id} testi={t} index={i} />)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const lbl: React.CSSProperties = {
  display: 'block', color: '#6B6B78', fontSize: '.65rem',
  letterSpacing: '.16em', fontFamily: 'JetBrains Mono, monospace', marginBottom: 7,
}

function Spin() {
  return <span style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin3d 1s linear infinite' }} />
}
