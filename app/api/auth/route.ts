import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  // Dibaca di SERVER — tidak perlu NEXT_PUBLIC_, aman tidak terekspos ke browser
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD belum diset di .env.local' },
      { status: 500 }
    )
  }

  if (password === adminPassword) {
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Password salah' }, { status: 401 })
}
