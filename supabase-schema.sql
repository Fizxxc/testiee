-- ============================================
-- KOGRAPHH STUDIO — Database Schema
-- Paste & run in Supabase SQL Editor
-- ============================================

-- 1. PRODUCTS
create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  category    text not null check (category in ('APP_EDITING','AI_PRO','STREAM')),
  name        text not null,
  duration    text not null,
  price       integer not null,          -- nilai dalam ribuan, e.g. 5 = 5K
  is_active   boolean default true,
  sort_order  integer default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- 2. TESTIMONIALS
create table if not exists testimonials (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  product_id    uuid references products(id) on delete set null,
  product_name  text,
  rating        integer not null check (rating between 1 and 5),
  message       text not null,
  is_approved   boolean default false,
  created_at    timestamptz default now()
);

-- 3. ROW LEVEL SECURITY
alter table products     enable row level security;
alter table testimonials enable row level security;

-- Products: siapapun bisa baca yang aktif
create policy "public read products"
  on products for select using (is_active = true);

-- Testimonials: siapapun baca yang approved
create policy "public read testimonials"
  on testimonials for select using (is_approved = true);

-- Siapapun bisa submit testimoni (pending review)
create policy "public insert testimonial"
  on testimonials for insert with check (true);

-- 4. SEED PRODUCTS
insert into products (category, name, duration, price, sort_order) values
  ('APP_EDITING','Capcut Pro','7 Hari',5,1),
  ('APP_EDITING','Capcut Pro','35 Hari',10,2),
  ('APP_EDITING','Alight Motion','1 Tahun',4,3),
  ('APP_EDITING','Canva Pro','30 Hari',7,4),
  ('APP_EDITING','Canva Edu','Lifetime',5,5),
  ('AI_PRO','ChatGPT Pro','30 Hari',10,1),
  ('AI_PRO','ChatGPT Plus','7 Hari',5,2),
  ('AI_PRO','Gemini Pro','3 Bulan',15,3),
  ('AI_PRO','Perplexity Pro','30 Hari',7,4),
  ('STREAM','Prime Video','30 Hari',10,1),
  ('STREAM','HBO Max Sharing','30 Hari',15,2),
  ('STREAM','VISION+ Premium','30 Hari',17,3),
  ('STREAM','Viu','3 Bulan',8,4),
  ('STREAM','Viu','6 Bulan',15,5),
  ('STREAM','YouTube Premium','30 Hari',8,6);

-- 5. SEED SAMPLE TESTIMONIALS (already approved)
insert into testimonials (name, product_name, rating, message, is_approved) values
  ('Rizky A.','Canva Pro 30 Hari',5,'Mantap banget! Langsung aktif setelah bayar, seller fast respon. Recommended!',true),
  ('Dewi S.','ChatGPT Pro 30 Hari',5,'Udah order beberapa kali, ga pernah ada masalah. Terpercaya banget!',true),
  ('Budi H.','YouTube Premium 30 Hari',4,'Harga murah kualitas terjamin. Bakal order lagi bulan depan!',true),
  ('Sari M.','Capcut Pro 35 Hari',5,'Proses cepat, langsung bisa dipake. Terima kasih kographh!',true),
  ('Andre K.','Gemini Pro 3 Bulan',5,'Worth it banget buat kerjaan. Seller ramah dan profesional.',true);
