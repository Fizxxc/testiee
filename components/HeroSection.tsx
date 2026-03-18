'use client'

interface Props { avgRating: string; totalReviews: number }

export default function HeroSection({ avgRating, totalReviews }: Props) {
  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', paddingTop: 80 }}>

      {/* Ambient blobs */}
      <div style={{ position: 'absolute', top: '15%', left: '8%', width: 420, height: 420, background: 'radial-gradient(circle,rgba(255,45,32,.13) 0%,transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '6%', width: 360, height: 360, background: 'radial-gradient(circle,rgba(147,51,234,.11) 0%,transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px)', backgroundSize: '72px 72px', pointerEvents: 'none' }} />

      {/* Watermark */}
      <div className="font-display desktop-only" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-55%)', fontSize: 'clamp(240px,35vw,500px)', color: 'rgba(255,255,255,.018)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>K</div>

      {/* Floating badges — desktop only */}
      <div className="animate-float hero-badges" style={{ position: 'absolute', top: '22%', right: '12%', background: '#0E0E10', border: '1px solid #1F1F23', borderRadius: 14, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, animationDelay: '.4s' }}>
        <span>⚡</span>
        <span style={{ fontSize: '.75rem', color: '#6B6B78', fontFamily: 'JetBrains Mono, monospace' }}>Fast Respon</span>
      </div>
      <div className="animate-float hero-badges" style={{ position: 'absolute', bottom: '28%', left: '10%', background: '#0E0E10', border: '1px solid #1F1F23', borderRadius: 14, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, animationDelay: '1.2s' }}>
        <span>🛡️</span>
        <span style={{ fontSize: '.75rem', color: '#6B6B78', fontFamily: 'JetBrains Mono, monospace' }}>Garansi Aktif</span>
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 20px', maxWidth: 860, width: '100%' }}>

        {/* Status pill */}
        <div className="animate-fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0E0E10', border: '1px solid #1F1F23', borderRadius: 999, padding: '6px 18px', marginBottom: 28 }}>
          <span style={{ width: 7, height: 7, background: '#22C55E', borderRadius: '50%', display: 'inline-block', animation: 'pulse2 2s ease-in-out infinite' }} />
          <span style={{ fontSize: '.7rem', color: '#6B6B78', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '.08em' }}>OPEN ORDER · PROSES CEPAT</span>
        </div>

        {/* Heading */}
        <div className="font-display animate-fade-up d-100" style={{ fontSize: 'clamp(52px,12vw,140px)', lineHeight: .92, letterSpacing: '-.02em', marginBottom: 8 }}>
          <span style={{ color: '#F0F0F0' }}>KOGRAPHH</span>
        </div>
        <div className="font-display animate-fade-up d-200" style={{ fontSize: 'clamp(22px,5vw,56px)', letterSpacing: '.12em', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <span style={{ height: 2, width: 30, background: 'linear-gradient(90deg,transparent,#FF2D20)', flexShrink: 0 }} />
          <span style={{ color: '#FF2D20' }}>STUDIO.ID</span>
          <span style={{ height: 2, width: 30, background: 'linear-gradient(90deg,#FF2D20,transparent)', flexShrink: 0 }} />
        </div>

        <p className="animate-fade-up d-300" style={{ fontSize: 'clamp(.85rem,1.8vw,1.05rem)', color: '#6B6B78', maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.75, padding: '0 8px' }}>
          Akun premium murah &amp; terpercaya —{' '}
          <span style={{ color: '#FF2D20' }}>App Editing</span>,{' '}
          <span style={{ color: '#9333EA' }}>AI Pro</span>, &amp;{' '}
          <span style={{ color: '#22C55E' }}>Streaming</span>.
        </p>

        {/* Stats row */}
        <div className="animate-fade-up d-400 hero-stats" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, marginBottom: 36, flexWrap: 'wrap' }}>
          {[
            { val: avgRating, sub: `${totalReviews} Ulasan`, isStars: true },
            { val: '100%', sub: 'Garansi Aktif' },
            { val: '<5m', sub: 'Avg Respon' },
          ].map(({ val, sub, isStars }, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              {isStars && (
                <div style={{ display: 'flex', gap: 2, justifyContent: 'center', marginBottom: 4 }}>
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} width="13" height="13" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#F59E0B"/>
                    </svg>
                  ))}
                </div>
              )}
              <div className="font-display" style={{ fontSize: 'clamp(1.3rem,3vw,1.7rem)', color: '#F0F0F0', letterSpacing: '.03em' }}>{val}</div>
              <div style={{ fontSize: '.68rem', color: '#6B6B78', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="animate-fade-up d-500" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          <a href="#pricelist" style={{ background: '#FF2D20', color: '#fff', padding: '12px 26px', borderRadius: 12, fontWeight: 600, fontSize: '.88rem', textDecoration: 'none', transition: 'opacity .2s, transform .2s', boxShadow: '0 0 28px rgba(255,45,32,.3)', flex: '1 1 auto', maxWidth: 220, textAlign: 'center' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '.88'; (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
          >Lihat Pricelist →</a>
          <a href="https://wa.me/6288991114939" target="_blank" rel="noreferrer"
            style={{ background: 'transparent', color: '#F0F0F0', padding: '12px 26px', borderRadius: 12, fontWeight: 500, fontSize: '.88rem', textDecoration: 'none', border: '1px solid #1F1F23', transition: 'border-color .2s, transform .2s', flex: '1 1 auto', maxWidth: 220, textAlign: 'center' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#3A3A42'; (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1F1F23'; (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
          >WhatsApp Order</a>
        </div>
      </div>

      {/* Scroll hint — desktop */}
      <div className="desktop-only" style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: .35 }}>
        <div style={{ width: 1, height: 36, background: 'linear-gradient(to bottom,transparent,#6B6B78)' }} />
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B6B78" strokeWidth="2"><path d="M7 10l5 5 5-5"/></svg>
      </div>
    </section>
  )
}
