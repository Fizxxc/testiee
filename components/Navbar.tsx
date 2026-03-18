'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// ── Desktop top navbar (hidden on mobile) ─────────────────────────────
export function DesktopNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <header className="desktop-only" style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      transition: 'background .3s, border-color .3s, backdrop-filter .3s',
      background: scrolled ? 'rgba(7,7,8,.94)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid #1F1F23' : '1px solid transparent',
    }}>
      <nav style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span className="font-display" style={{ fontSize: '1.6rem', letterSpacing: '.05em', color: '#F0F0F0' }}>
            KOGRAPHH<span style={{ color: '#FF2D20' }}>.</span>
          </span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {[
            { href: '#pricelist',    label: 'Pricelist' },
            { href: '#testimonials', label: 'Testimoni' },
            { href: '#contact',      label: 'Kontak' },
          ].map(({ href, label }) => (
            <a key={href} href={href}
              style={{ color: '#6B6B78', fontSize: '.85rem', fontWeight: 500, textDecoration: 'none', padding: '6px 14px', borderRadius: 8, transition: 'color .2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#F0F0F0')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6B6B78')}
            >{label}</a>
          ))}
          <Link href="/testimoni" style={{
            background: '#FF2D20', color: '#fff', fontSize: '.82rem', fontWeight: 600,
            padding: '8px 18px', borderRadius: 10, textDecoration: 'none',
            transition: 'opacity .2s, transform .15s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '.85'; (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
          >+ Beri Testi</Link>
        </div>
      </nav>
    </header>
  )
}

// ── Mobile bottom navbar ───────────────────────────────────────────────
const NAV_ITEMS = [
  {
    href: '/#pricelist',
    label: 'Harga',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#FF2D20' : '#6B6B78'} strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
        <path d="M12 6v2m0 8v2M8.5 9.5A3.5 3.5 0 0112 8h.5c1.7 0 2.5 1 2.5 2s-.8 2-2.5 2h-1c-1.7 0-2.5 1-2.5 2s.8 2 2.5 2h.5a3.5 3.5 0 013.5-1.5"/>
      </svg>
    ),
  },
  {
    href: '/#testimonials',
    label: 'Testi',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#FF2D20' : '#6B6B78'} strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
  },
  {
    href: '/testimoni',
    label: 'Kirim',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    ),
    special: true,
  },
  {
    href: '/#contact',
    label: 'Kontak',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#FF2D20' : '#6B6B78'} strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.82a19.79 19.79 0 01-3.07-8.63A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
      </svg>
    ),
  },
  {
    href: '/',
    label: 'Home',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#FF2D20' : '#6B6B78'} strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
]

export function MobileNav() {
  const pathname = usePathname()
  const [activeHash, setActiveHash] = useState('')

  useEffect(() => {
    const fn = () => setActiveHash(window.location.hash)
    window.addEventListener('hashchange', fn)
    fn()
    return () => window.removeEventListener('hashchange', fn)
  }, [])

  function isActive(href: string) {
    if (href === '/testimoni') return pathname === '/testimoni'
    if (href === '/') return pathname === '/' && !activeHash
    const hash = href.split('#')[1]
    return hash ? activeHash === `#${hash}` : false
  }

  return (
    <nav className="bottom-nav mobile-only">
      {NAV_ITEMS.map(item => {
        const active = isActive(item.href)
        if (item.special) {
          return (
            <Link key={item.href} href={item.href} className="bottom-nav-item special">
              <span className="nav-icon">{item.icon(active)}</span>
            </Link>
          )
        }
        return (
          <a key={item.href} href={item.href}
            className={`bottom-nav-item${active ? ' active' : ''}`}
            onClick={() => item.href.includes('#') && setActiveHash('#' + item.href.split('#')[1])}
          >
            <span className="nav-icon">{item.icon(active)}</span>
            <span className="nav-label">{item.label}</span>
          </a>
        )
      })}
    </nav>
  )
}

// ── Combined export (default) ─────────────────────────────────────────
export default function Navbar() {
  return (
    <>
      <DesktopNav />
      <MobileNav />
    </>
  )
}
