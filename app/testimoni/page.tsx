'use client'
import { useEffect, useState } from 'react'
import { supabase, type Product, type Testimonial } from '@/lib/supabase'
import StarRating from '@/components/StarRating'
import TestiCard from '@/components/TestiCard'
import Link from 'next/link'

type Tab = 'form' | 'preview'

export default function TestimoniPage() {
  const [tab, setTab]         = useState<Tab>('form')
  const [products, setProds]  = useState<Product[]>([])
  const [testis, setTestis]   = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  // Form state
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
    if (!name.trim())          return setErr('Nama wajib diisi.')
    if (rating === 0)          return setErr('Pilih rating bintang terlebih dahulu.')
    if (message.trim().length < 10) return setErr('Tuliskan pengalaman kamu (min. 10 karakter).')
    setSending(true)
    const { error } = await supabase.from('testimonials').insert({
      name: name.trim(),
      product_id: prodId || null,
      product_name: prodName || null,
      rating,
      message: message.trim(),
    })
    setSending(false)
    if (error) return setErr('Gagal mengirim, coba lagi.')
    setDone(true)
  }

  // ── Success screen
  if (done) return (
    <div style={{ minHeight: '100vh', background: '#070708', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div style={{ width: 80, height: 80, background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.2)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 className="font-display" style={{ fontSize: '3rem', color: '#F0F0F0', marginBottom: 8 }}>TERIMA KASIH!</h2>
        <p style={{ color: '#6B6B78', fontSize: '.9rem', lineHeight: 1.7, marginBottom: 32 }}>
          Testimonimu sudah kami terima dan sedang menunggu persetujuan admin.
          Biasanya muncul dalam 1×24 jam. 🙏
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ background: '#FF2D20', color: '#fff', padding: '11px 24px', borderRadius: 11, fontWeight: 600, fontSize: '.88rem', textDecoration: 'none' }}>← Beranda</Link>
          <button onClick={() => { setDone(false); setName(''); setProdId(''); setProdNm(''); setRating(0); setMessage('') }}
            style={{ background: '#0E0E10', color: '#F0F0F0', border: '1px solid #1F1F23', padding: '11px 24px', borderRadius: 11, fontWeight: 500, fontSize: '.88rem', cursor: 'pointer' }}>
            Kirim Lagi
          </button>
        </div>
      </div>
    </div>
  )

  const cats = [
    { id: 'APP_EDITING', label: 'App Editing' },
    { id: 'AI_PRO',      label: 'AI Pro' },
    { id: 'STREAM',      label: 'Stream' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#070708' }}>

      {/* Topbar */}
      <div style={{ borderBottom: '1px solid #1F1F23', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1000, margin: '0 auto' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span className="font-display" style={{ fontSize: '1.4rem', color: '#F0F0F0', letterSpacing: '.04em' }}>
            KOGRAPHH<span style={{ color: '#FF2D20' }}>.</span>
          </span>
        </Link>
        {/* Tabs */}
        <div style={{ display: 'flex', background: '#0E0E10', border: '1px solid #1F1F23', borderRadius: 12, padding: 4 }}>
          {([['form','✍️ Tulis Testi'],['preview','👁️ Lihat Testi Lain']] as [Tab,string][]).map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: tab === t ? '#FF2D20' : 'transparent',
              color: tab === t ? '#fff' : '#6B6B78',
              border: 'none', borderRadius: 9, padding: '7px 16px',
              fontSize: '.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all .2s',
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 20px' }}>

        {/* ── FORM TAB ──────────────────────────────────── */}
        {tab === 'form' && (
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <div style={{ marginBottom: 36 }}>
              <p style={{ fontSize: '.72rem', letterSpacing: '.2em', color: '#FF2D20', fontFamily: 'JetBrains Mono, monospace', marginBottom: 8 }}>— BAGIKAN PENGALAMANMU —</p>
              <h1 className="font-display" style={{ fontSize: 'clamp(2.2rem,6vw,3.8rem)', color: '#F0F0F0', marginBottom: 8 }}>BERI TESTIMONI</h1>
              <p style={{ color: '#6B6B78', fontSize: '.85rem', lineHeight: 1.7 }}>
                Testimonimu sangat berarti! Akan ditampilkan setelah disetujui admin.
              </p>
            </div>

            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Name */}
              <div>
                <label style={{ display: 'block', color: '#6B6B78', fontSize: '.7rem', letterSpacing: '.16em', fontFamily: 'JetBrains Mono, monospace', marginBottom: 8 }}>NAMA *</label>
                <input className="inp" value={name} onChange={e => setName(e.target.value)} placeholder="Nama kamu (bisa pakai inisial)" required />
              </div>

              {/* Product */}
              <div>
                <label style={{ display: 'block', color: '#6B6B78', fontSize: '.7rem', letterSpacing: '.16em', fontFamily: 'JetBrains Mono, monospace', marginBottom: 8 }}>PRODUK YANG DIBELI</label>
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
                  <svg style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B6B78" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label style={{ display: 'block', color: '#6B6B78', fontSize: '.7rem', letterSpacing: '.16em', fontFamily: 'JetBrains Mono, monospace', marginBottom: 12 }}>RATING *</label>
                <StarRating value={rating} onChange={setRating} size={36} />
              </div>

              {/* Message */}
              <div>
                <label style={{ display: 'block', color: '#6B6B78', fontSize: '.7rem', letterSpacing: '.16em', fontFamily: 'JetBrains Mono, monospace', marginBottom: 8 }}>CERITAKAN PENGALAMANMU *</label>
                <textarea className="inp" value={message} onChange={e => setMessage(e.target.value)}
                  placeholder="Produk oke, fast respon, harga terjangkau..."
                  rows={4} style={{ resize: 'none' }} required />
                <p style={{ color: '#3A3A42', fontSize: '.7rem', marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>
                  {message.length} karakter {message.length < 10 && message.length > 0 ? `(min 10)` : ''}
                </p>
              </div>

              {/* Error */}
              {err && (
                <div style={{ background: 'rgba(255,45,32,.08)', border: '1px solid rgba(255,45,32,.25)', borderRadius: 12, padding: '12px 16px' }}>
                  <p style={{ color: '#FF6B6B', fontSize: '.83rem', fontFamily: 'JetBrains Mono, monospace' }}>{err}</p>
                </div>
              )}

              {/* Submit */}
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setTab('preview')}
                  style={{ flex: 1, background: 'transparent', border: '1px solid #1F1F23', color: '#6B6B78', borderRadius: 12, padding: '13px', fontSize: '.85rem', fontWeight: 500, cursor: 'pointer', transition: 'border-color .2s, color .2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#3A3A42'; (e.currentTarget as HTMLElement).style.color = '#F0F0F0' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1F1F23'; (e.currentTarget as HTMLElement).style.color = '#6B6B78' }}
                >
                  Lihat Testi Lain
                </button>
                <button type="submit" disabled={sending}
                  style={{ flex: 1, background: 'linear-gradient(135deg, #FF2D20, #9333EA)', color: '#fff', border: 'none', borderRadius: 12, padding: '13px', fontSize: '.88rem', fontWeight: 700, cursor: sending ? 'not-allowed' : 'pointer', opacity: sending ? .7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'opacity .2s' }}>
                  {sending
                    ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin3d 1s linear infinite', display: 'inline-block' }} /> Mengirim...</>
                    : 'Kirim Testimoni ✓'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── PREVIEW TAB ──────────────────────────────── */}
        {tab === 'preview' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <p style={{ fontSize: '.72rem', letterSpacing: '.2em', color: '#9333EA', fontFamily: 'JetBrains Mono, monospace', marginBottom: 6 }}>— LIHAT —</p>
                <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#F0F0F0' }}>TESTIMONI LAINNYA</h2>
              </div>
              <button onClick={() => setTab('form')}
                style={{ background: '#FF2D20', color: '#fff', border: 'none', padding: '11px 22px', borderRadius: 11, fontSize: '.85rem', fontWeight: 600, cursor: 'pointer', transition: 'opacity .2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '.85'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
              >← Balik ke Form</button>
            </div>

            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
                {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{ height: 160, borderRadius: 16 }} />)}
              </div>
            ) : testis.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#3A3A42' }}>
                <p style={{ fontSize: '1.1rem' }}>Belum ada testimoni yang masuk.</p>
                <p style={{ marginTop: 8, fontSize: '.85rem' }}>Jadilah yang pertama!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
                {testis.map((t, i) => <TestiCard key={t.id} testi={t} index={i} />)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
