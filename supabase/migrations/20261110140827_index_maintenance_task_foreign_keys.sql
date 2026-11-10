-- Cover maintenance task foreign keys for efficient joins and deletes.
create index if not exists maintenance_tasks_created_by_idx
  on public.maintenance_tasks (created_by);
create index if not exists maintenance_tasks_machine_org_idx
  on public.maintenance_tasks (machine_id, organization_id);
drop index if exists public.maintenance_tasks_machine_idx;