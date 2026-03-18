export default function ContactSection() {
  return (
    <section id="contact" style={{ padding: 'clamp(40px,8vw,80px) clamp(16px,4vw,20px)', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(255,45,32,.07) 0%,rgba(147,51,234,.07) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(255,45,32,.18)', borderRadius: 24, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '-40%', right: '-10%', width: 280, height: 280, background: 'radial-gradient(circle,rgba(255,45,32,.1) 0%,transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-40%', left: '-10%', width: 240, height: 240, background: 'radial-gradient(circle,rgba(147,51,234,.09) 0%,transparent 70%)', borderRadius: '50%' }} />

        <div style={{ position: 'relative', padding: 'clamp(32px,6vw,64px)', textAlign: 'center' }}>
          <p style={{ fontSize: '.68rem', letterSpacing: '.22em', color: '#FF2D20', fontFamily: 'JetBrains Mono, monospace', marginBottom: 10 }}>— HUBUNGI KAMI —</p>
          <h2 className="font-display" style={{ fontSize: 'clamp(2rem,6vw,3.8rem)', color: '#F0F0F0', marginBottom: 10 }}>ORDER SEKARANG</h2>
          <p style={{ color: '#6B6B78', fontSize: '.88rem', maxWidth: 380, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Fast respon via WhatsApp. Proses instan, aman, dan terjamin aktif.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <a href="https://wa.me/6208895114939" target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#25D366', color: '#fff', padding: '12px 24px', borderRadius: 12, fontWeight: 600, fontSize: '.88rem', textDecoration: 'none', transition: 'opacity .2s, transform .2s', boxShadow: '0 0 24px rgba(37,211,102,.25)', flex: '1 1 auto', justifyContent: 'center', maxWidth: 240 }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '.88'; (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Chat WhatsApp
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#0E0E10', border: '1px solid #1F1F23', padding: '12px 20px', borderRadius: 12, flex: '1 1 auto', justifyContent: 'center', maxWidth: 220 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B6B78" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.82a19.79 19.79 0 01-3.07-8.63A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              <span style={{ color: '#6B6B78', fontSize: '.8rem', fontFamily: 'JetBrains Mono, monospace' }}>0889-9114-4939</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24 }}>
            <span style={{ fontSize: '.65rem', color: '#2A2A30', fontFamily: 'JetBrains Mono, monospace' }}>Payment:</span>
            {['QRIS','SeaBank'].map(m => (
              <span key={m} style={{ background: '#0E0E10', border: '1px solid #1F1F23', color: '#6B6B78', fontSize: '.65rem', padding: '3px 10px', borderRadius: 7, fontFamily: 'JetBrains Mono, monospace' }}>{m}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
