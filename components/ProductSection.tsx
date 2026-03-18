'use client'
import type { Product, Category } from '@/lib/supabase'

const META: Record<Category, { label: string; color: string; accent: string }> = {
  APP_EDITING: { label: 'APP EDITING', color: '#FF2D20', accent: 'rgba(255,45,32,.07)' },
  AI_PRO:      { label: 'AI PRO',      color: '#9333EA', accent: 'rgba(147,51,234,.06)' },
  STREAM:      { label: 'STREAM',      color: '#22C55E', accent: 'rgba(34,197,94,.06)'  },
}

const ICONS: Record<Category, React.ReactNode> = {
  APP_EDITING: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  ),
  AI_PRO: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/>
    </svg>
  ),
  STREAM: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
    </svg>
  ),
}

interface Props { category: Category; products: Product[] }

export default function ProductSection({ category, products }: Props) {
  const m = META[category]
  if (!products.length) return null

  return (
    <div style={{ background: m.accent, border: `1px solid ${m.color}20`, borderRadius: 20, padding: 'clamp(18px,4vw,28px)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: m.color + '20', color: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {ICONS[category]}
          </div>
          <h3 className="font-display" style={{ fontSize: 'clamp(1.5rem,4vw,2.2rem)', color: '#F0F0F0', letterSpacing: '.04em' }}>{m.label}</h3>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {[0,1,2].map(i => <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: m.color, opacity: .5 - i * .12 }} />)}
        </div>
      </div>

      <div style={{ height: 1, background: `linear-gradient(90deg,${m.color}40,transparent)`, marginBottom: 14 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {products.map((p, i) => (
          <div key={p.id} className="card-lift"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0A0A0C', border: '1px solid #1A1A1E', borderRadius: 12, padding: 'clamp(10px,2vw,13px) clamp(12px,3vw,18px)', gap: 10 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <div style={{ width: 3, height: 28, borderRadius: 99, background: m.color + '70', flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <p style={{ color: '#F0F0F0', fontWeight: 500, fontSize: 'clamp(.8rem,2vw,.9rem)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                <p style={{ color: '#6B6B78', fontSize: '.72rem', marginTop: 1, fontFamily: 'JetBrains Mono, monospace' }}>{p.duration}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <span className="prod-from" style={{ color: '#2A2A30', fontSize: '.68rem', fontFamily: 'JetBrains Mono, monospace' }}>mulai dari</span>
              <span className="font-display" style={{ fontSize: 'clamp(1.3rem,3vw,1.7rem)', color: m.color, letterSpacing: '.03em' }}>{p.price}K</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
