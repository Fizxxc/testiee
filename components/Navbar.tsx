'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <header
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        transition: 'background .3s ease, border-color .3s ease, backdrop-filter .3s ease',
        background: scrolled ? 'rgba(7,7,8,.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid #1F1F23' : '1px solid transparent',
      }}
    >
      <nav style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span className="font-display" style={{ fontSize: '1.6rem', letterSpacing: '.05em', color: '#F0F0F0' }}>
            KOGRAPHH<span style={{ color: '#FF2D20' }}>.</span>
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {[
            { href: '#pricelist', label: 'Pricelist' },
            { href: '#testimonials', label: 'Testimoni' },
            { href: '#contact', label: 'Kontak' },
          ].map(({ href, label }) => (
            <a key={href} href={href} style={{ color: '#6B6B78', fontSize: '.85rem', fontWeight: 500, textDecoration: 'none', padding: '6px 12px', borderRadius: 8, transition: 'color .2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#F0F0F0')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6B6B78')}
            >{label}</a>
          ))}
          <Link href="/testimoni" style={{
            background: '#FF2D20', color: '#fff', fontSize: '.82rem', fontWeight: 600,
            padding: '7px 16px', borderRadius: 10, textDecoration: 'none',
            transition: 'opacity .2s, transform .2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '.85'; (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
          >
            + Beri Testi
          </Link>
        </div>
      </nav>
    </header>
  )
}
