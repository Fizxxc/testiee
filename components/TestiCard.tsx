'use client'
import type { Testimonial } from '@/lib/supabase'
import StarRating from './StarRating'

const gradients = [
  'from-[#FF2D20] to-[#FF8C00]',
  'from-[#9333EA] to-[#EC4899]',
  'from-[#22C55E] to-[#3B82F6]',
  'from-[#F59E0B] to-[#EF4444]',
  'from-[#6366F1] to-[#9333EA]',
  'from-[#14B8A6] to-[#3B82F6]',
]

const bgGrad = [
  ['#FF2D20', '#FF8C00'],
  ['#9333EA', '#EC4899'],
  ['#22C55E', '#3B82F6'],
  ['#F59E0B', '#EF4444'],
  ['#6366F1', '#9333EA'],
  ['#14B8A6', '#3B82F6'],
]

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function relDate(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Hari ini'
  if (days === 1) return 'Kemarin'
  if (days < 30) return `${days} hari lalu`
  const months = Math.floor(days / 30)
  return `${months} bulan lalu`
}

interface Props { testi: Testimonial; index: number }

export default function TestiCard({ testi, index }: Props) {
  const [c1, c2] = bgGrad[index % bgGrad.length]

  return (
    <div className="animate-fade-up" style={{
      background: '#0E0E10',
      border: '1px solid #1F1F23',
      borderRadius: 16,
      padding: '20px',
      opacity: 0,
      animationDelay: `${index * .07}s`,
      animationFillMode: 'forwards',
      transition: 'border-color .25s, transform .25s, box-shadow .25s',
    }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#2A2A30'; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = '0 16px 40px rgba(0,0,0,.5)' }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#1F1F23'; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none' }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Avatar */}
          <div style={{ width: 40, height: 40, borderRadius: 11, background: `linear-gradient(135deg, ${c1}, ${c2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '.85rem', color: '#fff', flexShrink: 0 }}>
            {initials(testi.name)}
          </div>
          <div>
            <p style={{ color: '#F0F0F0', fontWeight: 500, fontSize: '.88rem' }}>{testi.name}</p>
            {testi.product_name && (
              <p style={{ color: '#3A3A42', fontSize: '.7rem', marginTop: 2, fontFamily: 'JetBrains Mono, monospace', maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{testi.product_name}</p>
            )}
          </div>
        </div>
        <span style={{ color: '#3A3A42', fontSize: '.68rem', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0, marginLeft: 8 }}>{relDate(testi.created_at)}</span>
      </div>

      {/* Stars */}
      <div style={{ marginBottom: 12 }}>
        <StarRating value={testi.rating} readonly size={16} />
      </div>

      {/* Message */}
      <p style={{ color: '#9090A0', fontSize: '.84rem', lineHeight: 1.65, fontStyle: 'italic' }}>
        "{testi.message}"
      </p>
    </div>
  )
}
