
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('industrial-products','industrial-products',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update
set public=true,file_size_limit=5242880,allowed_mime_types=array['image/jpeg','image/png','image/webp'];

create table public.industrial_products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.professional_profiles(user_id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 4 and 160),
  description text not null check (char_length(btrim(description)) between 20 and 3000),
  category text not null check (category in ('plastic_resin','spare_parts','molds','machinery','tools','packaging','other')),
  sku text check (sku is null or char_length(sku)<=80),
  country_code char(2) not null check (country_code ~ '^[A-Z]{2}$'),
  city text check (city is null or char_length(city)<=100),
  product_condition text not null default 'new' check (product_condition in ('new','used','refurbished')),
  price_type text not null default 'quote' check (price_type in ('quote','fixed')),
  price_amount numeric(14,2) check (price_amount is null or price_amount>=0),
  currency_code char(3) check (currency_code is null or currency_code ~ '^[A-Z]{3}$'),
  min_order_qty numeric(14,3) not null default 1 check (min_order_qty>0),
  unit text not null default 'unit' check (char_length(unit) between 1 and 24),
  lead_days integer not null default 7 check (lead_days between 0 and 3650),
  image_path text,
  status text not null default 'draft' check (status in ('draft','published','paused')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint industrial_products_price_fields_check check (
    (price_type='quote' and price_amount is null and currency_code is null)
    or (price_type='fixed' and price_amount is not null and currency_code is not null)
  )
);

create index industrial_products_marketplace_lookup
  on public.industrial_products(status,category,country_code,created_at desc);
create index industrial_products_seller_status
  on public.industrial_products(seller_id,status,created_at desc);
create index industrial_products_country_category
  on public.industrial_products(country_code,category,created_at desc);

alter table public.industrial_products enable row level security;
revoke all on table public.industrial_products from anon,authenticated;
grant select,insert,update,delete on public.industrial_products to authenticated;

create policy industrial_products_select_visible
on public.industrial_products for select to authenticated
using (
 seller_id=(select auth.uid())
 or (
  status='published'
  and exists(select 1 from public.professional_profiles p
   where p.user_id=industrial_products.seller_id and p.is_public=true)
 )
);
create policy industrial_products_insert_own
on public.industrial_products for insert to authenticated
with check (
 seller_id=(select auth.uid())
 and exists(select 1 from public.professional_profiles p where p.user_id=(select auth.uid()))
 and (status<>'published' or exists(select 1 from public.professional_profiles p where p.user_id=(select auth.uid()) and p.is_public=true))
);
create policy industrial_products_update_own
on public.industrial_products for update to authenticated
using (seller_id=(select auth.uid()))
with check (
 seller_id=(select auth.uid())
 and (status<>'published' or exists(select 1 from public.professional_profiles p where p.user_id=(select auth.uid()) and p.is_public=true))
);
create policy industrial_products_delete_own
on public.industrial_products for delete to authenticated
using (seller_id=(select auth.uid()));

create trigger industrial_products_set_updated_at
before update on public.industrial_products
for each row execute function public.set_updated_at();

create policy industrial_products_image_upload
on storage.objects for insert to authenticated
with check (
 bucket_id='industrial-products'
 and (storage.foldername(name))[1]=(select auth.uid())::text
 and exists(
  select 1 from public.industrial_products p
  where p.id::text=(storage.foldername(name))[2] and p.seller_id=(select auth.uid())
 )
);
create policy industrial_products_image_delete
on storage.objects for delete to authenticated
using (
 bucket_id='industrial-products'
 and (storage.foldername(name))[1]=(select auth.uid())::text
 and exists(
  select 1 from public.industrial_products p
  where p.id::text=(storage.foldername(name))[2] and p.seller_id=(select auth.uid())
 )
);
