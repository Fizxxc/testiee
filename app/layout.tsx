import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kographh Studio · Premium Digital Products',
  description: 'Akun premium App Editing, AI Pro & Streaming. Murah, cepat, terpercaya — by @fizzxverss',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
