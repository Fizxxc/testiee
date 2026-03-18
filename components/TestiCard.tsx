'use client'
import type { Testimonial } from '@/lib/supabase'
import StarRating from './StarRating'

const bgGrad = [
  ['#FF2D20','#FF8C00'],['#9333EA','#EC4899'],['#22C55E','#3B82F6'],
  ['#F59E0B','#EF4444'],['#6366F1','#9333EA'],['#14B8A6','#3B82F6'],
]

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
function relDate(d: string) {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000)
  if (days === 0) return 'Hari ini'
  if (days === 1) return 'Kemarin'
  if (days < 30)  return `${days}h lalu`
  return `${Math.floor(days/30)}bln lalu`
}

interface Props { testi: Testimonial; index: number }

export default function TestiCard({ testi, index }: Props) {
  const [c1, c2] = bgGrad[index % bgGrad.length]
  return (
    <div className="animate-fade-up pull-up"
      style={{ background: '#0E0E10', border: '1px solid #1F1F23', borderRadius: 16, padding: 'clamp(14px,3vw,20px)', animationDelay: `${index * .06}s`, animationFillMode: 'forwards', transition: 'border-color .25s, transform .25s, box-shadow .25s' }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#2A2A30'; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = '0 16px 40px rgba(0,0,0,.5)' }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#1F1F23'; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: `linear-gradient(135deg,${c1},${c2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '.82rem', color: '#fff', flexShrink: 0 }}>
            {initials(testi.name)}
          </div>
          <div>
            <p style={{ color: '#F0F0F0', fontWeight: 500, fontSize: '.85rem' }}>{testi.name}</p>
            {testi.product_name && (
              <p style={{ color: '#3A3A42', fontSize: '.68rem', marginTop: 2, fontFamily: 'JetBrains Mono, monospace', maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{testi.product_name}</p>
            )}
          </div>
        </div>
        <span style={{ color: '#2A2A30', fontSize: '.65rem', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0, marginLeft: 8 }}>{relDate(testi.created_at)}</span>
      </div>
      <div style={{ marginBottom: 10 }}>
        <StarRating value={testi.rating} readonly size={14} />
      </div>
      <p style={{ color: '#9090A0', fontSize: '.83rem', lineHeight: 1.65, fontStyle: 'italic' }}>"{testi.message}"</p>
    </div>
  )
}
