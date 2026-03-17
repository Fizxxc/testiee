'use client'
import { useState } from 'react'

const labels = ['', 'Sangat Buruk', 'Kurang', 'Cukup', 'Bagus', 'Luar Biasa! 🔥']

interface Props {
  value: number
  onChange?: (v: number) => void
  readonly?: boolean
  size?: number
}

export default function StarRating({ value, onChange, readonly = false, size = 32 }: Props) {
  const [hov, setHov] = useState(0)
  const active = hov || value

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(s => (
          <button
            key={s}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(s)}
            onMouseEnter={() => !readonly && setHov(s)}
            onMouseLeave={() => !readonly && setHov(0)}
            style={{ width: size, height: size, padding: 0, background: 'none', border: 'none', cursor: readonly ? 'default' : 'pointer' }}
            aria-label={`${s} bintang`}
          >
            <svg viewBox="0 0 24 24" width={size} height={size} style={{ transition: 'transform .15s ease, filter .15s ease', transform: !readonly && s <= hov ? 'scale(1.25)' : 'scale(1)', filter: s <= active ? 'drop-shadow(0 0 6px rgba(245,158,11,.7))' : 'none' }}>
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill={s <= active ? '#F59E0B' : 'none'}
                stroke={s <= active ? '#F59E0B' : '#3A3A42'}
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ))}
      </div>
      {!readonly && active > 0 && (
        <span style={{ color: '#F59E0B', fontSize: '0.8rem', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em' }}>
          {labels[active]}
        </span>
      )}
    </div>
  )
}
