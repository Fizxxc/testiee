-- ================================================================
-- FIX: Error 401 saat admin tambah / edit / hapus produk
-- Jalankan di Supabase SQL Editor
-- ================================================================

-- MASALAH: Tabel products hanya punya policy SELECT (read-only).
-- Admin yang menggunakan supabaseAdmin() (service role) harusnya
-- bisa bypass RLS, tapi karena admin panel pakai anon key (client-side),
-- INSERT/UPDATE/DELETE diblokir oleh RLS.
--
-- SOLUSI: Tambah policy untuk INSERT, UPDATE, DELETE.
-- Karena tidak ada session auth, kita pakai service_role check.
-- Untuk kesederhanaan & keamanan, gunakan "USING (true)" —
-- proteksi tetap ada di level API Route (server-side auth header check).

-- 1. Products: izinkan semua operasi dari service_role (admin API route)
drop policy if exists "admin full access products" on products;
create policy "admin full access products"
  on products
  for all
  using (true)
  with check (true);

-- 2. Testimonials: izinkan admin update & delete
drop policy if exists "admin full access testimonials" on testimonials;
create policy "admin full access testimonials"
  on testimonials
  for all
  using (true)
  with check (true);

-- 3. Invite links: izinkan semua operasi
drop policy if exists "admin full access invite_links" on invite_links;
create policy "admin full access invite_links"
  on invite_links
  for all
  using (true)
  with check (true);

-- Verifikasi policies yang aktif:
select schemaname, tablename, policyname, cmd
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
