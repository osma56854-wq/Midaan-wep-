-- MIDAAN preventive maintenance tasks: organization-scoped, machine-bound, RLS protected.
create unique index if not exists machines_id_organization_id_key
  on public.machines (id, organization_id);

create table if not exists public.maintenance_tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  machine_id uuid not null,
  title text not null check (char_length(btrim(title)) between 4 and 180),
  description text,
  due_at timestamptz not null,
  interval_days integer check (interval_days is null or interval_days between 1 and 3650),
  priority text not null default 'medium'
    check (priority in ('low','medium','high','critical')),
  status text not null default 'scheduled'
    check (status in ('scheduled','in_progress','completed','cancelled')),
  assigned_to uuid references auth.users(id) on delete set null,
  created_by uuid not null references auth.users(id) on delete restrict,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint maintenance_tasks_machine_same_org_fk
    foreign key (machine_id, organization_id)
    references public.machines (id, organization_id),
  constraint maintenance_tasks_completed_at_consistency
    check ((status = 'completed' and completed_at is not null) or (status <> 'completed' and completed_at is null))
);

create index if not exists maintenance_tasks_org_due_idx
  on public.maintenance_tasks (organization_id, due_at);
create index if not exists maintenance_tasks_assigned_status_idx
  on public.maintenance_tasks (assigned_to, status);
create index if not exists maintenance_tasks_machine_idx
  on public.maintenance_tasks (machine_id);

alter table public.maintenance_tasks enable row level security;

revoke all on table public.maintenance_tasks from anon, authenticated;
grant select, insert, update, delete on table public.maintenance_tasks to authenticated;

create policy "maintenance_tasks_select_active_members"
  on public.maintenance_tasks for select to authenticated
  using (exists (
    select 1 from public.organization_members m
    where m.organization_id = maintenance_tasks.organization_id
      and m.user_id = (select auth.uid()) and m.status = 'active'
  ));

create policy "maintenance_tasks_insert_engineers"
  on public.maintenance_tasks for insert to authenticated
  with check (
    created_by = (select auth.uid())
    and exists (
      select 1 from public.organization_members m
      where m.organization_id = maintenance_tasks.organization_id
        and m.user_id = (select auth.uid())
        and m.status = 'active' and m.role in ('owner','admin','engineer')
    )
    and (assigned_to is null or exists (
      select 1 from public.organization_members assignee
      where assignee.organization_id = maintenance_tasks.organization_id
        and assignee.user_id = maintenance_tasks.assigned_to
        and assignee.status = 'active'
    ))
  );

create policy "maintenance_tasks_update_managers_or_assignee"
  on public.maintenance_tasks for update to authenticated
  using (exists (
    select 1 from public.organization_members m
    where m.organization_id = maintenance_tasks.organization_id
      and m.user_id = (select auth.uid()) and m.status = 'active'
      and (m.role in ('owner','admin','engineer') or maintenance_tasks.assigned_to = (select auth.uid()))
  ))
  with check (
    exists (
      select 1 from public.organization_members m
      where m.organization_id = maintenance_tasks.organization_id
        and m.user_id = (select auth.uid()) and m.status = 'active'
        and (m.role in ('owner','admin','engineer') or assigned_to = (select auth.uid()))
    )
    and (assigned_to is null or exists (
      select 1 from public.organization_members assignee
      where assignee.organization_id = maintenance_tasks.organization_id
        and assignee.user_id = maintenance_tasks.assigned_to
        and assignee.status = 'active'
    ))
  );

create policy "maintenance_tasks_delete_org_admins"
  on public.maintenance_tasks for delete to authenticated
  using (exists (
    select 1 from public.organization_members m
    where m.organization_id = maintenance_tasks.organization_id
      and m.user_id = (select auth.uid())
      and m.status = 'active' and m.role in ('owner','admin')
  ));
