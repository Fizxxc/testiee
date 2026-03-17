'use client'
import { useEffect, useState, useCallback } from 'react'
import { supabase, type Product, type Testimonial, type Category, type InviteLink } from '@/lib/supabase'
import StarRating from '@/components/StarRating'
import Link from 'next/link'

type Tab = 'links' | 'testimonials' | 'products'

const CATS: { id: Category; label: string; color: string }[] = [
  { id: 'APP_EDITING', label: 'App Editing', color: '#FF2D20' },
  { id: 'AI_PRO',      label: 'AI Pro',      color: '#9333EA' },
  { id: 'STREAM',      label: 'Stream',      color: '#22C55E' },
]

export default function AdminPage() {
  const [authed, setAuthed]         = useState(false)
  const [adminToken, setAdminToken] = useState('')
  const [pwd, setPwd]               = useState('')
  const [pwdErr, setPwdErr]         = useState(false)
  const [pwdErrMsg, setPwdErrMsg]   = useState('Password salah!')
  const [tab, setTab]               = useState<Tab>('links')
  const [testis, setTestis]         = useState<Testimonial[]>([])
  const [products, setProducts]     = useState<Product[]>([])
  const [links, setLinks]           = useState<InviteLink[]>([])
  const [loading, setLoading]       = useState(false)
  const [busy, setBusy]             = useState('')

  // product form
  const [showAdd, setShowAdd]   = useState(false)
  const [nCat, setNCat]         = useState<Category>('APP_EDITING')
  const [nName, setNName]       = useState('')
  const [nDur, setNDur]         = useState('')
  const [nPrice, setNPrice]     = useState('')
  const [adding, setAdding]     = useState(false)
  const [editId, setEditId]     = useState('')
  const [editVal, setEditVal]   = useState('')

  // link form
  const [showLinkForm, setShowLinkForm] = useState(false)
  const [lLabel, setLLabel]             = useState('')
  const [lProdId, setLProdId]           = useState('')
  const [lProdName, setLProdName]       = useState('')
  const [lExpires, setLExpires]         = useState('')
  const [addingLink, setAddingLink]     = useState(false)
  const [copiedId, setCopiedId]         = useState('')
  const [origin, setOrigin]             = useState('')

  useEffect(() => { setOrigin(window.location.origin) }, [])

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setPwdErr(false)
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd }),
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        setAuthed(true)
        setAdminToken(pwd)
        loadAll(pwd)
      } else {
        setPwdErrMsg(data.error || 'Password salah!')
        setPwdErr(true)
        setTimeout(() => setPwdErr(false), 2500)
      }
    } catch {
      setPwdErrMsg('Gagal terhubung ke server.')
      setPwdErr(true)
      setTimeout(() => setPwdErr(false), 2500)
    }
  }

  const apiHeaders = useCallback((token: string) => ({
    'Content-Type': 'application/json',
    'x-admin-token': token,
  }), [])

  async function loadAll(token: string) {
    setLoading(true)
    const [{ data: t }, { data: p }, linksRes] = await Promise.all([
      supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
      supabase.from('products').select('*').order('category').order('sort_order'),
      fetch('/api/links', { headers: apiHeaders(token) }),
    ])
    if (t) setTestis(t)
    if (p) setProducts(p)
    const linksData = await linksRes.json()
    if (linksData.links) setLinks(linksData.links)
    setLoading(false)
  }

  async function approve(id: string, val: boolean) {
    setBusy(id)
    await supabase.from('testimonials').update({ is_approved: val }).eq('id', id)
    setTestis(prev => prev.map(t => t.id === id ? { ...t, is_approved: val } : t))
    setBusy('')
  }

  async function deleteTesti(id: string) {
    if (!confirm('Hapus testimoni ini?')) return
    setBusy(id)
    await supabase.from('testimonials').delete().eq('id', id)
    setTestis(prev => prev.filter(t => t.id !== id))
    setBusy('')
  }

  async function toggleProd(id: string, val: boolean) {
    setBusy(id)
    await supabase.from('products').update({ is_active: val }).eq('id', id)
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: val } : p))
    setBusy('')
  }

  async function deleteProd(id: string) {
    if (!confirm('Hapus produk ini?')) return
    setBusy(id)
    await supabase.from('products').delete().eq('id', id)
    setProducts(prev => prev.filter(p => p.id !== id))
    setBusy('')
  }

  async function savePrice(id: string) {
    const price = parseInt(editVal)
    if (isNaN(price) || price <= 0) return
    setBusy(id)
    await supabase.from('products').update({ price, updated_at: new Date().toISOString() }).eq('id', id)
    setProducts(prev => prev.map(p => p.id === id ? { ...p, price } : p))
    setEditId(''); setBusy('')
  }

  async function addProduct(e: React.FormEvent) {
    e.preventDefault()
    if (!nName.trim() || !nDur.trim() || !nPrice) return
    setAdding(true)
    const { data, error } = await supabase.from('products').insert({
      category: nCat, name: nName.trim(), duration: nDur.trim(),
      price: parseInt(nPrice), is_active: true,
      sort_order: products.filter(p => p.category === nCat).length + 1,
    }).select().single()
    if (!error && data) {
      setProducts(prev => [...prev, data])
      setNName(''); setNDur(''); setNPrice(''); setShowAdd(false)
    }
    setAdding(false)
  }

  function selectLinkProd(id: string) {
    setLProdId(id)
    const p = products.find(x => x.id === id)
    setLProdName(p ? `${p.name} ${p.duration}` : '')
  }

  async function generateLink(e: React.FormEvent) {
    e.preventDefault()
    setAddingLink(true)
    const body: Record<string, string> = {}
    if (lLabel)   body.label = lLabel
    if (lProdId)  body.product_id = lProdId
    if (lProdName) body.product_name = lProdName
    if (lExpires) body.expires_at = new Date(lExpires).toISOString()
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: apiHeaders(adminToken),
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (data.link) {
      setLinks(prev => [data.link, ...prev])
      setLLabel(''); setLProdId(''); setLProdName(''); setLExpires('')
      setShowLinkForm(false)
    }
    setAddingLink(false)
  }

  async function toggleLink(id: string, val: boolean) {
    setBusy(id)
    const res = await fetch('/api/links', {
      method: 'PATCH',
      headers: apiHeaders(adminToken),
      body: JSON.stringify({ id, is_active: val }),
    })
    const data = await res.json()
    if (data.link) setLinks(prev => prev.map(l => l.id === id ? data.link : l))
    setBusy('')
  }

  async function deleteLink(id: string) {
    if (!confirm('Hapus link ini?')) return
    setBusy(id)
    await fetch('/api/links', {
      method: 'DELETE',
      headers: apiHeaders(adminToken),
      body: JSON.stringify({ id }),
    })
    setLinks(prev => prev.filter(l => l.id !== id))
    setBusy('')
  }

  function copyLink(slug: string, id: string) {
    const url = `${origin}/t/${slug}`
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId(''), 2000)
    })
  }

  // ── LOGIN ────────────────────────────────────────────────────────────
  if (!authed) return (
    <div style={{ minHeight: '100vh', background: '#070708', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span className="font-display" style={{ fontSize: '2rem', color: '#F0F0F0' }}>KOGRAPHH<span style={{ color: '#FF2D20' }}>.</span></span>
          </Link>
          <p style={{ color: '#3A3A42', fontSize: '.75rem', marginTop: 6, fontFamily: 'JetBrains Mono, monospace' }}>ADMIN PANEL</p>
        </div>
        <form onSubmit={login} style={{
          background: '#0E0E10', border: `1px solid ${pwdErr ? 'rgba(255,45,32,.5)' : '#1F1F23'}`,
          borderRadius: 20, padding: 28, display: 'flex', flexDirection: 'column', gap: 16,
          transition: 'border-color .3s, box-shadow .3s',
          boxShadow: pwdErr ? '0 0 0 3px rgba(255,45,32,.12)' : 'none',
        }}>
          <label style={{ color: '#6B6B78', fontSize: '.7rem', letterSpacing: '.16em', fontFamily: 'JetBrains Mono, monospace' }}>PASSWORD</label>
          <input className="inp" type="password" value={pwd} onChange={e => setPwd(e.target.value)}
            placeholder="••••••••" autoFocus
            style={{ borderColor: pwdErr ? 'rgba(255,45,32,.5)' : undefined }}
          />
          {pwdErr && <p style={{ color: '#FF6B6B', fontSize: '.78rem', fontFamily: 'JetBrains Mono, monospace', marginTop: -8 }}>{pwdErrMsg}</p>}
          <button type="submit" style={{
            background: '#FF2D20', color: '#fff', border: 'none', borderRadius: 12,
            padding: '13px', fontWeight: 700, fontSize: '.9rem', cursor: 'pointer', transition: 'opacity .2s',
          }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '.85'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
          >Masuk →</button>
        </form>
      </div>
    </div>
  )

  const pending  = testis.filter(t => !t.is_approved)
  const approved = testis.filter(t =>  t.is_approved)
  const activeLinks   = links.filter(l => l.is_active)
  const inactiveLinks = links.filter(l => !l.is_active)

  // ── DASHBOARD ────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#070708' }}>

      {/* Sticky header */}
      <div style={{ borderBottom: '1px solid #1F1F23', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'rgba(7,7,8,.96)', backdropFilter: 'blur(16px)', zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span className="font-display" style={{ fontSize: '1.4rem', color: '#F0F0F0' }}>KOGRAPHH<span style={{ color: '#FF2D20' }}>.</span></span>
          </Link>
          <span style={{ color: '#1F1F23' }}>/</span>
          <span style={{ color: '#3A3A42', fontSize: '.72rem', fontFamily: 'JetBrains Mono, monospace' }}>ADMIN</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/" target="_blank" style={{ color: '#3A3A42', fontSize: '.75rem', textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', transition: 'color .2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#888'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#3A3A42'}
          >Website ↗</Link>
          <button onClick={() => setAuthed(false)} style={{ background: 'transparent', border: '1px solid #1F1F23', color: '#6B6B78', borderRadius: 8, padding: '5px 14px', fontSize: '.75rem', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', transition: 'all .2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#3A3A42'; (e.currentTarget as HTMLElement).style.color = '#F0F0F0' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1F1F23'; (e.currentTarget as HTMLElement).style.color = '#6B6B78' }}
          >Keluar</button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 10, marginBottom: 28 }}>
          {[
            { label: 'Link Aktif',      val: activeLinks.length,  color: '#FF2D20' },
            { label: 'Total Klik',      val: links.reduce((s,l) => s + l.used_count, 0), color: '#F59E0B' },
            { label: 'Testi Pending',   val: pending.length,      color: '#9333EA' },
            { label: 'Testi Approved',  val: approved.length,     color: '#22C55E' },
            { label: 'Produk Aktif',    val: products.filter(p => p.is_active).length, color: '#3B82F6' },
          ].map(s => (
            <div key={s.label} style={{ background: '#0E0E10', border: '1px solid #1F1F23', borderRadius: 14, padding: '16px 18px' }}>
              <p style={{ color: '#3A3A42', fontSize: '.65rem', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '.1em', marginBottom: 6 }}>{s.label.toUpperCase()}</p>
              <p className="font-display" style={{ fontSize: '2rem', color: s.color, lineHeight: 1 }}>{s.val}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 3, background: '#0E0E10', border: '1px solid #1F1F23', borderRadius: 14, padding: 4, width: 'fit-content', marginBottom: 28 }}>
          {([
            ['links',        '🔗 Link Testi'],
            ['testimonials', '💬 Testimoni'],
            ['products',     '📦 Produk'],
          ] as [Tab, string][]).map(([t, lbl]) => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: tab === t ? '#FF2D20' : 'transparent',
              color: tab === t ? '#fff' : '#6B6B78',
              border: 'none', borderRadius: 10, padding: '8px 18px',
              fontSize: '.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all .2s',
              display: 'flex', alignItems: 'center', gap: 7,
            }}>
              {lbl}
              {t === 'testimonials' && pending.length > 0 && (
                <span style={{ background: '#F59E0B', color: '#000', fontSize: '.6rem', fontWeight: 800, borderRadius: 99, padding: '1px 6px', fontFamily: 'JetBrains Mono, monospace' }}>{pending.length}</span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <div style={{ width: 36, height: 36, border: '3px solid #1F1F23', borderTopColor: '#FF2D20', borderRadius: '50%', animation: 'spin3d 1s linear infinite' }} />
          </div>
        ) : (
          <>
            {/* ── LINKS TAB ─────────────────────────────────────────── */}
            {tab === 'links' && (
              <div>
                {/* Generate button */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                  <p style={{ color: '#6B6B78', fontSize: '.8rem', fontFamily: 'JetBrains Mono, monospace' }}>
                    Generate link unik untuk dikirim ke buyer → mereka buka link → isi testimoni
                  </p>
                  <button onClick={() => setShowLinkForm(!showLinkForm)} style={{
                    background: showLinkForm ? '#1F1F23' : 'linear-gradient(135deg,#FF2D20,#9333EA)',
                    color: '#fff', border: 'none', borderRadius: 12,
                    padding: '10px 22px', fontSize: '.85rem', fontWeight: 700, cursor: 'pointer', transition: 'opacity .2s',
                  }}>
                    {showLinkForm ? '✕ Batal' : '+ Generate Link Baru'}
                  </button>
                </div>

                {/* Generate form */}
                {showLinkForm && (
                  <form onSubmit={generateLink} style={{ background: '#0E0E10', border: '1px solid rgba(255,45,32,.2)', borderRadius: 18, padding: '24px', marginBottom: 24 }}>
                    <h4 style={{ color: '#F0F0F0', fontWeight: 600, marginBottom: 6, fontSize: '.9rem' }}>Generate Link Testimoni</h4>
                    <p style={{ color: '#3A3A42', fontSize: '.75rem', fontFamily: 'JetBrains Mono, monospace', marginBottom: 20 }}>
                      Semua field opsional. Slug akan di-generate otomatis (contoh: <span style={{ color: '#FF2D20' }}>/t/kgx-f3a9b2</span>)
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginBottom: 18 }}>
                      <div>
                        <label style={labelStyle}>CATATAN / NAMA BUYER</label>
                        <input className="inp" value={lLabel} onChange={e => setLLabel(e.target.value)}
                          placeholder="cth: Rizky order 17 Mar" />
                      </div>
                      <div>
                        <label style={labelStyle}>LOCK KE PRODUK (opsional)</label>
                        <div style={{ position: 'relative' }}>
                          <select className="inp" value={lProdId} onChange={e => selectLinkProd(e.target.value)} style={{ paddingRight: 36 }}>
                            <option value="">— Bebas pilih sendiri —</option>
                            {CATS.map(cat => (
                              <optgroup key={cat.id} label={`✦ ${cat.label}`}>
                                {products.filter(p => p.category === cat.id && p.is_active).map(p => (
                                  <option key={p.id} value={p.id}>{p.name} — {p.duration} ({p.price}K)</option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                          <svg style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B6B78" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                        </div>
                      </div>
                      <div>
                        <label style={labelStyle}>EXPIRE (opsional)</label>
                        <input className="inp" type="datetime-local" value={lExpires} onChange={e => setLExpires(e.target.value)} />
                      </div>
                    </div>
                    <button type="submit" disabled={addingLink} style={{
                      background: 'linear-gradient(135deg,#FF2D20,#9333EA)', color: '#fff', border: 'none',
                      borderRadius: 11, padding: '11px 26px', fontWeight: 700, fontSize: '.85rem',
                      cursor: addingLink ? 'not-allowed' : 'pointer', opacity: addingLink ? .7 : 1,
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                      {addingLink ? <><Spinner />Generating...</> : '⚡ Generate Link'}
                    </button>
                  </form>
                )}

                {/* Active links */}
                <div style={{ marginBottom: 24 }}>
                  <SectionLabel color="#22C55E" dot animated>LINK AKTIF ({activeLinks.length})</SectionLabel>
                  {activeLinks.length === 0
                    ? <EmptyMsg>Belum ada link. Klik "+ Generate Link Baru" untuk membuat.</EmptyMsg>
                    : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {activeLinks.map(l => (
                          <LinkRow key={l.id} link={l} origin={origin} busy={busy} copiedId={copiedId}
                            onCopy={copyLink} onToggle={toggleLink} onDelete={deleteLink} />
                        ))}
                      </div>
                    )
                  }
                </div>

                {/* Inactive links */}
                {inactiveLinks.length > 0 && (
                  <div>
                    <SectionLabel color="#3A3A42">LINK NONAKTIF ({inactiveLinks.length})</SectionLabel>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {inactiveLinks.map(l => (
                        <LinkRow key={l.id} link={l} origin={origin} busy={busy} copiedId={copiedId}
                          onCopy={copyLink} onToggle={toggleLink} onDelete={deleteLink} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── TESTIMONIALS TAB ──────────────────────────────────── */}
            {tab === 'testimonials' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                {pending.length > 0 && (
                  <div>
                    <SectionLabel color="#F59E0B" dot animated>MENUNGGU PERSETUJUAN ({pending.length})</SectionLabel>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {pending.map(t => <TestiRow key={t.id} t={t} busy={busy} onApprove={approve} onDelete={deleteTesti} />)}
                    </div>
                  </div>
                )}
                <div>
                  <SectionLabel color="#22C55E" dot>SUDAH DISETUJUI ({approved.length})</SectionLabel>
                  {approved.length === 0
                    ? <EmptyMsg>Belum ada testimoni disetujui.</EmptyMsg>
                    : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{approved.map(t => <TestiRow key={t.id} t={t} busy={busy} onApprove={approve} onDelete={deleteTesti} />)}</div>
                  }
                </div>
              </div>
            )}

            {/* ── PRODUCTS TAB ──────────────────────────────────────── */}
            {tab === 'products' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
                  <button onClick={() => setShowAdd(!showAdd)} style={{
                    background: showAdd ? '#1F1F23' : '#FF2D20', color: '#fff', border: 'none',
                    borderRadius: 12, padding: '10px 22px', fontSize: '.85rem', fontWeight: 600, cursor: 'pointer',
                  }}>
                    {showAdd ? '✕ Batal' : '+ Tambah Produk'}
                  </button>
                </div>

                {showAdd && (
                  <form onSubmit={addProduct} style={{ background: '#0E0E10', border: '1px solid rgba(255,45,32,.25)', borderRadius: 18, padding: 24, marginBottom: 24 }}>
                    <h4 style={{ color: '#F0F0F0', fontWeight: 600, marginBottom: 18, fontSize: '.9rem' }}>Tambah Produk Baru</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 18 }}>
                      {[
                        { label: 'KATEGORI', content: (
                          <div style={{ position: 'relative' }}>
                            <select className="inp" value={nCat} onChange={e => setNCat(e.target.value as Category)} style={{ paddingRight: 36 }}>
                              {CATS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                            </select>
                            <svg style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B6B78" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                          </div>
                        )},
                        { label: 'NAMA PRODUK', content: <input className="inp" value={nName} onChange={e => setNName(e.target.value)} placeholder="cth: Canva Pro" required /> },
                        { label: 'DURASI', content: <input className="inp" value={nDur} onChange={e => setNDur(e.target.value)} placeholder="cth: 30 Hari" required /> },
                        { label: 'HARGA (K)', content: <input className="inp" type="number" min="1" value={nPrice} onChange={e => setNPrice(e.target.value)} placeholder="cth: 7" required /> },
                      ].map(({ label, content }) => (
                        <div key={label}>
                          <label style={labelStyle}>{label}</label>
                          {content}
                        </div>
                      ))}
                    </div>
                    <button type="submit" disabled={adding} style={{ background: 'linear-gradient(135deg,#FF2D20,#9333EA)', color: '#fff', border: 'none', borderRadius: 11, padding: '11px 26px', fontWeight: 700, fontSize: '.85rem', cursor: adding ? 'not-allowed' : 'pointer', opacity: adding ? .7 : 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {adding ? <><Spinner />Menyimpan...</> : 'Simpan Produk'}
                    </button>
                  </form>
                )}

                {CATS.map(cat => {
                  const catProds = products.filter(p => p.category === cat.id)
                  return (
                    <div key={cat.id} style={{ marginBottom: 28 }}>
                      <SectionLabel color={cat.color} dot>{cat.label.toUpperCase()} ({catProds.length})</SectionLabel>
                      {catProds.length === 0
                        ? <EmptyMsg>Tidak ada produk di kategori ini.</EmptyMsg>
                        : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                            {catProds.map(p => (
                              <div key={p.id} style={{ background: '#0E0E10', border: `1px solid ${p.is_active ? '#1F1F23' : '#141416'}`, borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, opacity: p.is_active ? 1 : .5, transition: 'opacity .2s' }}>
                                <div style={{ width: 3, height: 30, borderRadius: 99, background: cat.color + '80', flexShrink: 0 }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <p style={{ color: '#F0F0F0', fontWeight: 500, fontSize: '.85rem' }}>{p.name}</p>
                                  <p style={{ color: '#3A3A42', fontSize: '.72rem', fontFamily: 'JetBrains Mono, monospace' }}>{p.duration}</p>
                                </div>
                                {editId === p.id ? (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <input type="number" min="1" value={editVal} onChange={e => setEditVal(e.target.value)}
                                      style={{ width: 58, background: '#141416', border: '1px solid #FF2D20', borderRadius: 8, padding: '5px 8px', color: '#F0F0F0', fontSize: '.85rem', outline: 'none', fontFamily: 'JetBrains Mono, monospace', textAlign: 'center' }}
                                      autoFocus onKeyDown={e => { if (e.key === 'Enter') savePrice(p.id); if (e.key === 'Escape') setEditId('') }} />
                                    <span style={{ color: '#6B6B78', fontSize: '.75rem', fontFamily: 'JetBrains Mono, monospace' }}>K</span>
                                    <button onClick={() => savePrice(p.id)} style={{ background: '#22C55E', color: '#fff', border: 'none', borderRadius: 7, padding: '5px 10px', fontSize: '.72rem', fontWeight: 700, cursor: 'pointer' }}>✓</button>
                                    <button onClick={() => setEditId('')} style={{ background: '#3A3A42', color: '#F0F0F0', border: 'none', borderRadius: 7, padding: '5px 10px', fontSize: '.72rem', cursor: 'pointer' }}>✕</button>
                                  </div>
                                ) : (
                                  <button onClick={() => { setEditId(p.id); setEditVal(String(p.price)) }}
                                    className="font-display" style={{ fontSize: '1.4rem', color: cat.color, background: 'none', border: 'none', cursor: 'pointer', transition: 'opacity .2s', padding: '0 4px' }}
                                    title="Klik untuk edit harga"
                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '.5'}
                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                                  >{p.price}K</button>
                                )}
                                <button onClick={() => toggleProd(p.id, !p.is_active)} disabled={busy === p.id}
                                  style={{ background: p.is_active ? 'rgba(34,197,94,.12)' : '#141416', color: p.is_active ? '#22C55E' : '#3A3A42', border: `1px solid ${p.is_active ? 'rgba(34,197,94,.25)' : '#1F1F23'}`, borderRadius: 8, padding: '5px 12px', fontSize: '.72rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', transition: 'all .2s', minWidth: 72, textAlign: 'center' }}>
                                  {busy === p.id ? '...' : p.is_active ? 'Aktif' : 'Nonaktif'}
                                </button>
                                <button onClick={() => deleteProd(p.id)} disabled={busy === p.id}
                                  style={{ background: 'rgba(255,45,32,.08)', color: '#FF6B6B', border: '1px solid rgba(255,45,32,.15)', borderRadius: 8, padding: '5px 10px', fontSize: '.75rem', cursor: 'pointer', transition: 'all .2s' }}
                                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,45,32,.18)'}
                                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,45,32,.08)'}
                                >✕</button>
                              </div>
                            ))}
                          </div>
                        )
                      }
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: 'block', color: '#6B6B78', fontSize: '.65rem',
  letterSpacing: '.14em', fontFamily: 'JetBrains Mono, monospace', marginBottom: 6,
}

function Spinner() {
  return <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin3d 1s linear infinite' }} />
}

function SectionLabel({ children, color, dot, animated }: { children: React.ReactNode; color: string; dot?: boolean; animated?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
      {dot && <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block', animation: animated ? 'pulse2 2s ease-in-out infinite' : 'none' }} />}
      <span style={{ color, fontSize: '.68rem', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '.14em' }}>{children}</span>
    </div>
  )
}

function EmptyMsg({ children }: { children: React.ReactNode }) {
  return <p style={{ color: '#3A3A42', fontSize: '.82rem', fontFamily: 'JetBrains Mono, monospace', paddingLeft: dot ? 16 : 0 }}>{children}</p>
}
const dot = false // dummy

function LinkRow({ link, origin, busy, copiedId, onCopy, onToggle, onDelete }: {
  link: InviteLink; origin: string; busy: string; copiedId: string
  onCopy: (slug: string, id: string) => void
  onToggle: (id: string, val: boolean) => void
  onDelete: (id: string) => void
}) {
  const url = `${origin}/t/${link.slug}`
  const isCopied = copiedId === link.id
  const isExpired = link.expires_at ? new Date(link.expires_at) < new Date() : false

  return (
    <div style={{
      background: '#0E0E10',
      border: `1px solid ${!link.is_active ? '#141416' : isExpired ? 'rgba(245,158,11,.2)' : '#1F1F23'}`,
      borderRadius: 14, padding: '14px 18px',
      opacity: !link.is_active ? .55 : 1,
      transition: 'opacity .2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>

        {/* Left info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Label + badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            {link.label && (
              <span style={{ color: '#F0F0F0', fontWeight: 600, fontSize: '.88rem' }}>{link.label}</span>
            )}
            {link.product_name && (
              <span style={{ background: '#141416', color: '#6B6B78', fontSize: '.67rem', padding: '2px 10px', borderRadius: 99, fontFamily: 'JetBrains Mono, monospace', border: '1px solid #1F1F23' }}>
                {link.product_name}
              </span>
            )}
            {isExpired && (
              <span style={{ background: 'rgba(245,158,11,.1)', color: '#F59E0B', fontSize: '.67rem', padding: '2px 10px', borderRadius: 99, fontFamily: 'JetBrains Mono, monospace', border: '1px solid rgba(245,158,11,.2)' }}>
                ⏰ Expired
              </span>
            )}
          </div>

          {/* URL */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#070708', border: '1px solid #1A1A1E', borderRadius: 8, padding: '8px 12px', marginBottom: 8 }}>
            <span style={{ color: '#3A3A42', fontSize: '.7rem', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>🔗</span>
            <span style={{ color: '#FF2D20', fontSize: '.75rem', fontFamily: 'JetBrains Mono, monospace', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url}</span>
            <button onClick={() => onCopy(link.slug, link.id)} style={{
              background: isCopied ? 'rgba(34,197,94,.15)' : '#141416',
              color: isCopied ? '#22C55E' : '#6B6B78',
              border: `1px solid ${isCopied ? 'rgba(34,197,94,.3)' : '#1F1F23'}`,
              borderRadius: 7, padding: '4px 10px', fontSize: '.68rem',
              cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace',
              transition: 'all .2s', whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              {isCopied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>

          {/* Meta */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ color: '#2A2A30', fontSize: '.67rem', fontFamily: 'JetBrains Mono, monospace' }}>
              👁 {link.used_count}× dibuka
            </span>
            <span style={{ color: '#2A2A30', fontSize: '.67rem', fontFamily: 'JetBrains Mono, monospace' }}>
              📅 {new Date(link.created_at).toLocaleDateString('id-ID')}
            </span>
            {link.expires_at && (
              <span style={{ color: isExpired ? '#F59E0B' : '#2A2A30', fontSize: '.67rem', fontFamily: 'JetBrains Mono, monospace' }}>
                ⏰ exp: {new Date(link.expires_at).toLocaleDateString('id-ID')}
              </span>
            )}
          </div>
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
          <button onClick={() => onToggle(link.id, !link.is_active)} disabled={busy === link.id}
            style={{ background: link.is_active ? 'rgba(34,197,94,.1)' : '#141416', color: link.is_active ? '#22C55E' : '#3A3A42', border: `1px solid ${link.is_active ? 'rgba(34,197,94,.2)' : '#1F1F23'}`, borderRadius: 8, padding: '6px 14px', fontSize: '.72rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', transition: 'all .2s', minWidth: 80, textAlign: 'center' }}>
            {busy === link.id ? '...' : link.is_active ? 'Aktif' : 'Nonaktif'}
          </button>
          <button onClick={() => onDelete(link.id)} disabled={busy === link.id}
            style={{ background: 'rgba(255,45,32,.08)', color: '#FF6B6B', border: '1px solid rgba(255,45,32,.15)', borderRadius: 8, padding: '6px 12px', fontSize: '.75rem', cursor: 'pointer', transition: 'all .2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,45,32,.2)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,45,32,.08)'}
          >✕</button>
        </div>
      </div>
    </div>
  )
}

function TestiRow({ t, busy, onApprove, onDelete }: {
  t: Testimonial; busy: string
  onApprove: (id: string, v: boolean) => void
  onDelete: (id: string) => void
}) {
  return (
    <div style={{ background: '#0E0E10', border: `1px solid ${t.is_approved ? '#1F1F23' : 'rgba(245,158,11,.2)'}`, borderRadius: 14, padding: '14px 18px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
          <span style={{ color: '#F0F0F0', fontWeight: 600, fontSize: '.88rem' }}>{t.name}</span>
          {t.product_name && <span style={{ background: '#141416', color: '#6B6B78', fontSize: '.67rem', padding: '2px 10px', borderRadius: 99, fontFamily: 'JetBrains Mono, monospace' }}>{t.product_name}</span>}
          <StarRating value={t.rating} readonly size={14} />
        </div>
        <p style={{ color: '#6B6B78', fontSize: '.82rem', lineHeight: 1.6, fontStyle: 'italic' }}>"{t.message}"</p>
        <p style={{ color: '#2A2A30', fontSize: '.67rem', marginTop: 6, fontFamily: 'JetBrains Mono, monospace' }}>{new Date(t.created_at).toLocaleString('id-ID')}</p>
      </div>
      <div style={{ display: 'flex', gap: 6, flexShrink: 0, flexDirection: 'column' }}>
        {!t.is_approved
          ? <button onClick={() => onApprove(t.id, true)} disabled={busy === t.id} style={{ background: 'rgba(34,197,94,.12)', color: '#22C55E', border: '1px solid rgba(34,197,94,.25)', borderRadius: 8, padding: '6px 14px', fontSize: '.75rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>{busy === t.id ? '...' : '✓ Approve'}</button>
          : <button onClick={() => onApprove(t.id, false)} disabled={busy === t.id} style={{ background: 'rgba(245,158,11,.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,.2)', borderRadius: 8, padding: '6px 14px', fontSize: '.75rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>{busy === t.id ? '...' : 'Unapprove'}</button>
        }
        <button onClick={() => onDelete(t.id)} disabled={busy === t.id} style={{ background: 'rgba(255,45,32,.08)', color: '#FF6B6B', border: '1px solid rgba(255,45,32,.15)', borderRadius: 8, padding: '6px 14px', fontSize: '.75rem', cursor: 'pointer' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,45,32,.2)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,45,32,.08)'}
        >Hapus</button>
      </div>
    </div>
  )
}
