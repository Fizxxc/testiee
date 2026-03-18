'use client'
import { useEffect, useState } from 'react'
import { supabase, type Product, type Testimonial, type Category } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import ProductSection from '@/components/ProductSection'
import TestiCard from '@/components/TestiCard'
import ContactSection from '@/components/ContactSection'
import Link from 'next/link'

type Grouped = Record<Category, Product[]>

export default function HomePage() {
  const [grouped, setGrouped] = useState<Grouped>({ APP_EDITING: [], AI_PRO: [], STREAM: [] })
  const [testis, setTestis]   = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('testimonials').select('*').eq('is_approved', true).order('created_at', { ascending: false }).limit(9),
    ]).then(([{ data: prods }, { data: ts }]) => {
      if (prods) {
        const g: Grouped = { APP_EDITING: [], AI_PRO: [], STREAM: [] }
        prods.forEach((p: Product) => { g[p.category]?.push(p) })
        setGrouped(g)
      }
      if (ts) setTestis(ts)
      setLoading(false)
    })
  }, [])

  const avg = testis.length ? (testis.reduce((s, t) => s + t.rating, 0) / testis.length).toFixed(1) : '5.0'

  return (
    <main className="mobile-pad" style={{ minHeight: '100vh', background: '#070708' }}>
      <Navbar />
      <HeroSection avgRating={avg} totalReviews={testis.length} />

      {/* ── PRICELIST ──────────────────────────────────── */}
      <section id="pricelist" className="section-pad" style={{ padding: '72px 20px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <p style={{ fontSize: '.68rem', letterSpacing: '.22em', color: '#FF2D20', fontFamily: 'JetBrains Mono, monospace', marginBottom: 8 }}>— PRODUK KAMI —</p>
          <h2 className="font-display" style={{ fontSize: 'clamp(2.4rem,7vw,5rem)', color: '#F0F0F0' }}>PRICELIST</h2>
          <div style={{ height: 3, width: 54, background: 'linear-gradient(90deg,#FF2D20,#9333EA)', borderRadius: 99, margin: '12px auto 0' }} />
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 160, borderRadius: 20 }} />)}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <ProductSection category="APP_EDITING" products={grouped.APP_EDITING} />
            <ProductSection category="AI_PRO"      products={grouped.AI_PRO} />
            <ProductSection category="STREAM"      products={grouped.STREAM} />
          </div>
        )}

        {/* Mobile: WA order CTA under pricelist */}
        <div className="mobile-only" style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <a href="https://wa.me/6208895114939" target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#25D366', color: '#fff', padding: '14px', borderRadius: 14, fontWeight: 700, fontSize: '.9rem', textDecoration: 'none', boxShadow: '0 4px 20px rgba(37,211,102,.25)' }}
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Order via WhatsApp
          </a>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────── */}
      <section id="testimonials" className="section-pad" style={{ padding: '60px 20px 72px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <p style={{ fontSize: '.68rem', letterSpacing: '.22em', color: '#9333EA', fontFamily: 'JetBrains Mono, monospace', marginBottom: 8 }}>— KATA MEREKA —</p>
          <h2 className="font-display" style={{ fontSize: 'clamp(2.4rem,7vw,5rem)', color: '#F0F0F0', marginBottom: 12 }}>TESTIMONI</h2>
          {testis.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1,2,3,4,5].map(s => (
                  <svg key={s} width="16" height="16" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#F59E0B"/>
                  </svg>
                ))}
              </div>
              <span className="font-display" style={{ fontSize: '1.4rem', color: '#F0F0F0' }}>{avg}</span>
              <span style={{ color: '#6B6B78', fontSize: '.78rem', fontFamily: 'JetBrains Mono, monospace' }}>({testis.length} ulasan)</span>
            </div>
          )}
        </div>

        {testis.length === 0 && !loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#3A3A42' }}>
            <p>Belum ada testimoni. Jadilah yang pertama!</p>
          </div>
        ) : (
          <div className="testi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 14 }}>
            {testis.map((t, i) => <TestiCard key={t.id} testi={t} index={i} />)}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, background: '#0E0E10', border: '1px solid #1F1F23', borderRadius: 16, padding: '14px 20px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ color: '#6B6B78', fontSize: '.82rem' }}>Punya pengalaman bersama kami?</span>
            <Link href="/testimoni" style={{ background: 'linear-gradient(135deg,#FF2D20,#9333EA)', color: '#fff', fontSize: '.82rem', fontWeight: 600, padding: '8px 18px', borderRadius: 10, textDecoration: 'none', transition: 'opacity .2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '.85'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
            >Beri Testimoni →</Link>
          </div>
        </div>
      </section>

      <ContactSection />

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1F1F23', padding: '28px 20px', textAlign: 'center' }}>
        <div className="font-display" style={{ fontSize: '1.4rem', color: '#F0F0F0', marginBottom: 4 }}>
          KOGRAPHH STUDIO<span style={{ color: '#FF2D20' }}>.</span>ID
        </div>
        <p style={{ color: '#3A3A42', fontSize: '.68rem', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '.1em', marginBottom: 10 }}>BY @FIZZXVERSS</p>
        <p style={{ color: '#2A2A30', fontSize: '.65rem', fontFamily: 'JetBrains Mono, monospace' }}>© 2025 Kographh Studio. All rights reserved.</p>
      </footer>
    </main>
  )
}
