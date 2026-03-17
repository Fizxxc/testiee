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
  const [grouped, setGrouped]   = useState<Grouped>({ APP_EDITING: [], AI_PRO: [], STREAM: [] })
  const [testis, setTestis]     = useState<Testimonial[]>([])
  const [loading, setLoading]   = useState(true)

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
    <main style={{ minHeight: '100vh', background: '#070708' }}>
      <Navbar />
      <HeroSection avgRating={avg} totalReviews={testis.length} />

      {/* ── PRICELIST ───────────────────────────────────────────── */}
      <section id="pricelist" style={{ padding: '80px 20px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <p style={{ fontSize: '.72rem', letterSpacing: '.22em', color: '#FF2D20', fontFamily: 'JetBrains Mono, monospace', marginBottom: 10 }}>— PRODUK KAMI —</p>
          <h2 className="font-display" style={{ fontSize: 'clamp(2.8rem,7vw,5.5rem)', color: '#F0F0F0' }}>PRICELIST</h2>
          <div style={{ height: 3, width: 60, background: 'linear-gradient(90deg,#FF2D20,#9333EA)', borderRadius: 99, margin: '14px auto 0' }} />
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 180, borderRadius: 20 }} />)}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <ProductSection category="APP_EDITING" products={grouped.APP_EDITING} />
            <ProductSection category="AI_PRO"      products={grouped.AI_PRO} />
            <ProductSection category="STREAM"      products={grouped.STREAM} />
          </div>
        )}
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────── */}
      <section id="testimonials" style={{ padding: '60px 20px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <p style={{ fontSize: '.72rem', letterSpacing: '.22em', color: '#9333EA', fontFamily: 'JetBrains Mono, monospace', marginBottom: 10 }}>— KATA MEREKA —</p>
          <h2 className="font-display" style={{ fontSize: 'clamp(2.8rem,7vw,5.5rem)', color: '#F0F0F0', marginBottom: 14 }}>TESTIMONI</h2>

          {testis.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <div style={{ display: 'flex', gap: 3 }}>
                {[1,2,3,4,5].map(s => (
                  <svg key={s} width="18" height="18" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#F59E0B" /></svg>
                ))}
              </div>
              <span className="font-display" style={{ fontSize: '1.5rem', color: '#F0F0F0' }}>{avg}</span>
              <span style={{ color: '#6B6B78', fontSize: '.8rem', fontFamily: 'JetBrains Mono, monospace' }}>({testis.length} ulasan)</span>
            </div>
          )}
        </div>

        {testis.length === 0 && !loading ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#3A3A42' }}>
            <p style={{ fontSize: '1.1rem' }}>Belum ada testimoni. Jadilah yang pertama!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {testis.map((t, i) => <TestiCard key={t.id} testi={t} index={i} />)}
          </div>
        )}

        {/* CTA to submit */}
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, background: '#0E0E10', border: '1px solid #1F1F23', borderRadius: 16, padding: '16px 24px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ color: '#6B6B78', fontSize: '.85rem' }}>Punya pengalaman bersama kami?</span>
            <Link href="/testimoni" style={{
              background: 'linear-gradient(135deg, #FF2D20, #9333EA)',
              color: '#fff', fontSize: '.85rem', fontWeight: 600,
              padding: '9px 20px', borderRadius: 10, textDecoration: 'none',
              transition: 'opacity .2s',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '.85'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
            >
              Beri Testimoni →
            </Link>
          </div>
        </div>
      </section>

      <ContactSection />

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1F1F23', padding: '32px 20px', textAlign: 'center' }}>
        <div className="font-display" style={{ fontSize: '1.5rem', color: '#F0F0F0', marginBottom: 4 }}>
          KOGRAPHH STUDIO<span style={{ color: '#FF2D20' }}>.</span>ID
        </div>
        <p style={{ color: '#3A3A42', fontSize: '.72rem', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '.1em', marginBottom: 12 }}>BY @FIZZXVERSS</p>
        <p style={{ color: '#2A2A30', fontSize: '.7rem', fontFamily: 'JetBrains Mono, monospace' }}>© 2025 Kographh Studio. All rights reserved.</p>
      </footer>
    </main>
  )
}
