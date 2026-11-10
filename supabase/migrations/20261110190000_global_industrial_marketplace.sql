create table public.professional_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(btrim(display_name)) between 2 and 100),
  professional_type text not null check (professional_type in ('technician','engineer','service_company')),
  headline text not null check (char_length(btrim(headline)) between 4 and 120),
  country_code text not null default 'EG' check (country_code ~ '^[A-Z]{2}$'),
  city text check (city is null or char_length(city) <= 100),
  bio text check (bio is null or char_length(bio) <= 1500),
  years_experience integer not null default 0 check (years_experience between 0 and 60),
  languages text[] not null default array['ar']::text[] check (cardinality(languages) between 1 and 8),
  specialties text[] not null default '{}'::text[] check (cardinality(specialties) <= 12),
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.service_offers (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.professional_profiles(user_id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 4 and 140),
  description text not null check (char_length(btrim(description)) between 20 and 2500),
  category text not null check (category in ('plastic_injection','mold_maintenance','hydraulic','electrical_control','mechanical','lathe_milling','spare_parts','general_maintenance','other')),
  country_code text not null check (country_code ~ '^[A-Z]{2}$'),
  city text check (city is null or char_length(city) <= 100),
  service_mode text not null default 'on_site' check (service_mode in ('on_site','remote','both')),
  price_type text not null default 'quote' check (price_type in ('quote','fixed','hourly')),
  currency_code text check (currency_code is null or currency_code ~ '^[A-Z]{3}$'),
  price_amount numeric(12,2) check (price_amount is null or price_amount >= 0),
  status text not null default 'draft' check (status in ('draft','published','paused')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint service_offers_price_fields_check check (
    (price_type = 'quote' and price_amount is null and currency_code is null)
    or (price_type in ('fixed','hourly') and price_amount is not null and currency_code is not null)
  )
);

create table public.service_requests (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.service_offers(id) on delete restrict,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  requested_by uuid not null references auth.users(id) on delete restrict,
  provider_id uuid not null references public.professional_profiles(user_id) on delete restrict,
  organization_name text not null check (char_length(btrim(organization_name)) between 2 and 160),
  organization_country_code text not null check (organization_country_code ~ '^[A-Z]{2}$'),
  message text not null check (char_length(btrim(message)) between 10 and 2000),
  status text not null default 'new' check (status in ('new','accepted','declined','cancelled','completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index service_offers_marketplace_lookup
  on public.service_offers (status, country_code, category, created_at desc);
create index service_offers_provider_status
  on public.service_offers (provider_id, status, created_at desc);
create index service_requests_provider_status_created
  on public.service_requests (provider_id, status, created_at desc);
create index service_requests_requester_created
  on public.service_requests (requested_by, created_at desc);
create index service_requests_organization_created
  on public.service_requests (organization_id, created_at desc);

alter table public.professional_profiles enable row level security;
alter table public.service_offers enable row level security;
alter table public.service_requests enable row level security;

revoke all on table public.professional_profiles, public.service_offers, public.service_requests from anon, authenticated;
grant select, insert, update, delete on table public.professional_profiles to authenticated;
grant select, insert, update, delete on table public.service_offers to authenticated;
grant select, insert, update(status) on table public.service_requests to authenticated;

create policy professional_profiles_select_visible
  on public.professional_profiles for select to authenticated
  using (user_id = (select auth.uid()) or is_public = true);
create policy professional_profiles_insert_self
  on public.professional_profiles for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy professional_profiles_update_self
  on public.professional_profiles for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy professional_profiles_delete_self
  on public.professional_profiles for delete to authenticated
  using (user_id = (select auth.uid()));

create policy service_offers_select_visible
  on public.service_offers for select to authenticated
  using (
    provider_id = (select auth.uid())
    or (
      status = 'published'
      and exists (
        select 1 from public.professional_profiles p
        where p.user_id = service_offers.provider_id and p.is_public = true
      )
    )
  );
create policy service_offers_insert_self
  on public.service_offers for insert to authenticated
  with check (
    provider_id = (select auth.uid())
    and exists (
      select 1 from public.professional_profiles p
      where p.user_id = (select auth.uid())
    )
  );
create policy service_offers_update_self
  on public.service_offers for update to authenticated
  using (provider_id = (select auth.uid()))
  with check (
    provider_id = (select auth.uid())
    and (
      status <> 'published'
      or exists (
        select 1 from public.professional_profiles p
        where p.user_id = (select auth.uid()) and p.is_public = true
      )
    )
  );
create policy service_offers_delete_self
  on public.service_offers for delete to authenticated
  using (provider_id = (select auth.uid()));

create policy service_requests_select_participants
  on public.service_requests for select to authenticated
  using (
    requested_by = (select auth.uid())
    or provider_id = (select auth.uid())
    or exists (
      select 1 from public.organization_members m
      where m.organization_id = service_requests.organization_id
        and m.user_id = (select auth.uid())
        and m.status = 'active'
    )
  );
create policy service_requests_insert_org_member
  on public.service_requests for insert to authenticated
  with check (
    requested_by = (select auth.uid())
    and exists (
      select 1 from public.organization_members m
      where m.organization_id = service_requests.organization_id
        and m.user_id = (select auth.uid())
        and m.status = 'active'
    )
    and exists (
      select 1 from public.service_offers o
      join public.professional_profiles p on p.user_id = o.provider_id
      where o.id = service_requests.offer_id
        and o.provider_id = service_requests.provider_id
        and o.status = 'published'
        and p.is_public = true
        and o.provider_id <> (select auth.uid())
    )
  );
create policy service_requests_provider_update
  on public.service_requests for update to authenticated
  using (
    provider_id = (select auth.uid())
    and status in ('new','accepted')
  )
  with check (
    provider_id = (select auth.uid())
    and status in ('accepted','declined','completed')
  );
create policy service_requests_requester_cancel
  on public.service_requests for update to authenticated
  using (
    requested_by = (select auth.uid())
    and status = 'new'
  )
  with check (
    requested_by = (select auth.uid())
    and status = 'cancelled'
  );

create trigger professional_profiles_set_updated_at
  before update on public.professional_profiles
  for each row execute function public.set_updated_at();
create trigger service_offers_set_updated_at
  before update on public.service_offers
  for each row execute function public.set_updated_at();
create trigger service_requests_set_updated_at
  before update on public.service_requests
  for each row execute function public.set_updated_at();

create or replace function public.prepare_service_request()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
declare
  v_provider_id uuid;
  v_org_name text;
  v_country_code text;
begin
  select o.provider_id into v_provider_id
  from public.service_offers o
  where o.id = new.offer_id and o.status = 'published';

  if not found then
    raise exception 'العرض غير متاح للطلب حاليًا';
  end if;
  if v_provider_id = (select auth.uid()) then
    raise exception 'لا يمكن طلب خدمتك من حسابك نفسه';
  end if;
  if new.provider_id is not null and new.provider_id <> v_provider_id then
    raise exception 'مقدم الخدمة لا يطابق العرض المحدد';
  end if;
  new.provider_id := v_provider_id;

  select o.name, o.country_code into v_org_name, v_country_code
  from public.organizations o
  where o.id = new.organization_id;

  if not found then
    raise exception 'المنشأة غير متاحة';
  end if;
  new.organization_name := v_org_name;
  new.organization_country_code := v_country_code;
  return new;
end;
$$;

revoke all on function public.prepare_service_request() from public, anon, authenticated;
create trigger service_requests_prepare_context
  before insert on public.service_requests
  for each row execute function public.prepare_service_request();
