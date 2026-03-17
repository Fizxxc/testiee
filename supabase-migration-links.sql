-- ============================================================
-- MIGRATION: Tambah tabel invite_links
-- Jalankan di Supabase SQL Editor (setelah schema utama)
-- ============================================================

create table if not exists invite_links (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,            -- e.g. "kgx-f3a9b2"
  label       text,                            -- catatan admin, cth: "Rizky order 17 Mar"
  product_id  uuid references products(id) on delete set null,
  product_name text,                           -- snapshot nama produk
  used_count  integer default 0,               -- berapa kali dibuka
  is_active   boolean default true,            -- bisa dinonaktifkan
  expires_at  timestamptz,                     -- null = tidak expire
  created_at  timestamptz default now()
);

-- RLS
alter table invite_links enable row level security;

-- Siapapun bisa baca link yang aktif (untuk validasi di halaman /t/[slug])
create policy "public read active links"
  on invite_links for select
  using (is_active = true);

-- Fungsi increment used_count tanpa butuh RLS write policy publik
create or replace function increment_link_usage(link_slug text)
returns void language plpgsql security definer as $$
begin
  update invite_links
  set used_count = used_count + 1
  where slug = link_slug and is_active = true;
end;
$$;
