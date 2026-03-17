# Kographh Studio — Web Testimoni & Pricelist

Stack: **Next.js 14** · **TypeScript** · **Tailwind CSS** · **Supabase**

---

## 📁 Struktur Halaman

| URL | Fungsi |
|---|---|
| `/` | Homepage — Hero, Pricelist, Testimoni |
| `/testimoni` | Form kirim testimoni + preview testi lain |
| `/admin` | Dashboard admin (login password) |

---

## 🚀 Setup (Langkah-demi-langkah)

### 1. Buat Project Supabase
1. Pergi ke [supabase.com](https://supabase.com) → **New Project**
2. Buka **SQL Editor** → tempel isi file `supabase-schema.sql` → klik **Run**
3. Salin **Project URL** dan **anon key** dari menu **Settings → API**

### 2. Install & Konfigurasi
```bash
# Clone / extract project ini
cd kographh

# Install dependensi
npm install

# Buat file env
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_ADMIN_PASSWORD=passwordrahasiakamu
```

### 3. Jalankan Lokal
```bash
npm run dev
# Buka http://localhost:3000
```

### 4. Deploy ke Vercel (gratis)
```bash
npx vercel
# Ikuti prompt, lalu set environment variables di Vercel Dashboard
```

---

## 🔗 Link Khusus Testimoni

Bagikan link ini ke buyer:
```
https://domainmu.vercel.app/testimoni
```

User dapat:
- Menulis testimoni dengan rating bintang (1–5)
- Memilih produk yang dibeli
- Preview testimoni orang lain sebelum submit

---

## 🔐 Admin Panel

Akses: `https://domainmu.vercel.app/admin`

Password = nilai `NEXT_PUBLIC_ADMIN_PASSWORD` di `.env.local`

Fitur admin:
- ✅ Approve / unapprove testimoni
- 🗑️ Hapus testimoni
- ➕ Tambah produk baru
- ✏️ Edit harga (klik angka harga langsung)
- 🔄 Aktifkan / nonaktifkan produk

---

## 🎨 Customisasi

### Ganti nomor WhatsApp
Cari `6208895114939` di:
- `components/HeroSection.tsx`
- `components/ContactSection.tsx`

### Ganti warna kategori
Edit `components/ProductSection.tsx` → konstanta `META`

### Tambah kategori baru
1. Tambah value di `supabase-schema.sql` (alter table check constraint)
2. Tambah entry di `META` di `ProductSection.tsx`
3. Tambah di array `CATS` di `app/admin/page.tsx`

---

## 📦 Dependensi

```json
"next": "14.2.5",
"@supabase/supabase-js": "^2.44.0",
"lucide-react": "^0.400.0",
"tailwindcss": "^3.4.1"
```
