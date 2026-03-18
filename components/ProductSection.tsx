'use client'
import type { Product, Category } from '@/lib/supabase'

const META: Record<Category, { label: string; color: string; accent: string; icon: string }> = {
  APP_EDITING: { label: 'APP EDITING', color: '#FF2D20', accent: 'rgba(255,45,32,.08)', icon: '✦' },
  AI_PRO:      { label: 'AI PRO',      color: '#9333EA', accent: 'rgba(147,51,234,.07)', icon: '✦' },
  STREAM:      { label: 'STREAM',      color: '#22C55E', accent: 'rgba(34,197,94,.07)',  icon: '✦' },
}

interface Props { category: Category; products: Product[] }

export default function ProductSection({ category, products }: Props) {
  const m = META[category]
  if (!products.length) return null

  return (
    <div style={{
      background: m.accent,
      border: `1px solid ${m.color}22`,
      borderRadius: 20,
      padding: '28px 28px 24px',
      marginBottom: 0,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: m.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: m.color, fontSize: '1.1rem' }}>{m.icon}</span>
          </div>
          <h3 className="font-display" style={{ fontSize: 'clamp(1.8rem,3.5vw,2.4rem)', color: '#F0F0F0', letterSpacing: '.04em' }}>{m.label}</h3>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {[0,1,2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: m.color, opacity: .5 - i * .15 }} />)}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: `linear-gradient(90deg, ${m.color}40, transparent)`, marginBottom: 16 }} />

      {/* Product rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {products.map((p, i) => (
          <div key={p.id} className="card-lift"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: '#0A0A0C', border: '1px solid #1A1A1E', borderRadius: 12,
              padding: '13px 18px', animationDelay: `${i * .07}s`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 3, height: 32, borderRadius: 99, background: m.color + '70', flexShrink: 0 }} />
              <div>
                <p style={{ color: '#F0F0F0', fontWeight: 500, fontSize: '.9rem' }}>{p.name}</p>
                <p style={{ color: '#6B6B78', fontSize: '.75rem', marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>{p.duration}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="hide-mobile" style={{ color: '#3A3A42', fontSize: '.7rem', fontFamily: 'JetBrains Mono, monospace' }}>mulai dari</span>
              <span className="font-display" style={{ fontSize: 'clamp(1.4rem,2.5vw,1.8rem)', color: m.color, letterSpacing: '.03em' }}>{p.price}K</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
