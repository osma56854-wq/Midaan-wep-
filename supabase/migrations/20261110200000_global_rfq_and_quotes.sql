
create table public.industrial_rfqs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete restrict,
  buyer_display_name text not null check (char_length(btrim(buyer_display_name)) between 2 and 160),
  title text not null check (char_length(btrim(title)) between 4 and 160),
  description text not null check (char_length(btrim(description)) between 20 and 3000),
  category text not null check (category in ('plastic_injection','mold_maintenance','hydraulic','electrical_control','mechanical','lathe_milling','spare_parts','general_maintenance','other')),
  country_code char(2) not null check (country_code ~ '^[A-Z]{2}$'),
  quantity numeric(14,3) check (quantity is null or quantity > 0),
  unit text check (unit is null or char_length(unit) <= 24),
  target_date date,
  status text not null default 'open' check (status in ('open','closed','awarded','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.rfq_quotes (
  id uuid primary key default gen_random_uuid(),
  rfq_id uuid not null references public.industrial_rfqs(id) on delete cascade,
  supplier_id uuid not null references public.professional_profiles(user_id) on delete restrict,
  submitted_by uuid not null references auth.users(id) on delete restrict,
  price_amount numeric(14,2) not null check (price_amount > 0),
  currency_code char(3) not null check (currency_code ~ '^[A-Z]{3}$'),
  lead_days integer not null default 7 check (lead_days between 0 and 3650),
  notes text not null check (char_length(btrim(notes)) between 10 and 2000),
  status text not null default 'pending' check (status in ('pending','accepted','rejected','withdrawn')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (rfq_id,supplier_id)
);

create index industrial_rfqs_marketplace_lookup
  on public.industrial_rfqs(status,category,country_code,created_at desc);
create index industrial_rfqs_org_created
  on public.industrial_rfqs(organization_id,created_at desc);
create index rfq_quotes_supplier_created
  on public.rfq_quotes(supplier_id,created_at desc);
create index rfq_quotes_rfq_status
  on public.rfq_quotes(rfq_id,status,created_at desc);
create unique index rfq_quotes_one_accepted_per_rfq
  on public.rfq_quotes(rfq_id) where status='accepted';

alter table public.industrial_rfqs enable row level security;
alter table public.rfq_quotes enable row level security;
revoke all on table public.industrial_rfqs,public.rfq_quotes from anon,authenticated;
grant select,insert,update on public.industrial_rfqs to authenticated;
grant select,insert on public.rfq_quotes to authenticated;
grant update(status) on public.rfq_quotes to authenticated;

create policy industrial_rfqs_select_open_or_member
on public.industrial_rfqs for select to authenticated
using (
  status='open'
  or exists (
    select 1 from public.organization_members m
    where m.organization_id=industrial_rfqs.organization_id
      and m.user_id=(select auth.uid()) and m.status='active'
  )
);

create policy industrial_rfqs_insert_active_member
on public.industrial_rfqs for insert to authenticated
with check (
  created_by=(select auth.uid())
  and exists (
    select 1 from public.organization_members m
    where m.organization_id=industrial_rfqs.organization_id
      and m.user_id=(select auth.uid()) and m.status='active'
  )
);

create policy industrial_rfqs_update_managers
on public.industrial_rfqs for update to authenticated
using (
  exists (
    select 1 from public.organization_members m
    where m.organization_id=industrial_rfqs.organization_id
      and m.user_id=(select auth.uid()) and m.status='active'
      and m.role in ('owner','admin','engineer')
  )
)
with check (
  exists (
    select 1 from public.organization_members m
    where m.organization_id=industrial_rfqs.organization_id
      and m.user_id=(select auth.uid()) and m.status='active'
      and m.role in ('owner','admin','engineer')
  )
);

create policy rfq_quotes_select_participants
on public.rfq_quotes for select to authenticated
using (
  supplier_id=(select auth.uid())
  or exists (
    select 1 from public.industrial_rfqs r
    join public.organization_members m on m.organization_id=r.organization_id
    where r.id=rfq_quotes.rfq_id
      and m.user_id=(select auth.uid()) and m.status='active'
  )
);

create policy rfq_quotes_insert_public_supplier
on public.rfq_quotes for insert to authenticated
with check (
  supplier_id=(select auth.uid())
  and submitted_by=(select auth.uid())
  and exists (
    select 1 from public.professional_profiles p
    where p.user_id=(select auth.uid()) and p.is_public=true
  )
  and exists (
    select 1 from public.industrial_rfqs r
    where r.id=rfq_quotes.rfq_id and r.status='open'
      and not exists (
        select 1 from public.organization_members m
        where m.organization_id=r.organization_id
          and m.user_id=(select auth.uid()) and m.status='active'
      )
  )
);

create policy rfq_quotes_update_participant_status
on public.rfq_quotes for update to authenticated
using (
  (supplier_id=(select auth.uid()) and status='pending')
  or (
    status='pending' and exists (
      select 1 from public.industrial_rfqs r
      join public.organization_members m on m.organization_id=r.organization_id
      where r.id=rfq_quotes.rfq_id
        and m.user_id=(select auth.uid()) and m.status='active'
        and m.role in ('owner','admin','engineer')
    )
  )
)
with check (
  (supplier_id=(select auth.uid()) and status='withdrawn')
  or (
    status in ('accepted','rejected') and exists (
      select 1 from public.industrial_rfqs r
      join public.organization_members m on m.organization_id=r.organization_id
      where r.id=rfq_quotes.rfq_id
        and m.user_id=(select auth.uid()) and m.status='active'
        and m.role in ('owner','admin','engineer')
    )
  )
);

create or replace function public.prepare_industrial_rfq()
returns trigger
language plpgsql
set search_path=pg_catalog,public
as $$
declare v_name text; v_country text;
begin
  select o.name,o.country_code into v_name,v_country
  from public.organizations o where o.id=new.organization_id;
  if not found then raise exception 'المنشأة غير متاحة'; end if;
  new.buyer_display_name:=v_name;
  new.country_code:=upper(v_country::text);
  return new;
end;
$$;
revoke all on function public.prepare_industrial_rfq() from public,anon,authenticated;
create trigger industrial_rfqs_prepare_context
before insert on public.industrial_rfqs
for each row execute function public.prepare_industrial_rfq();

create trigger industrial_rfqs_set_updated_at
before update on public.industrial_rfqs
for each row execute function public.set_updated_at();
create trigger rfq_quotes_set_updated_at
before update on public.rfq_quotes
for each row execute function public.set_updated_at();
