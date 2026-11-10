-- Automatically create the next preventive-maintenance occurrence when a recurring task is completed.
alter table public.maintenance_tasks
  add column if not exists recurrence_parent_id uuid
  references public.maintenance_tasks(id) on delete set null;

create unique index if not exists maintenance_tasks_one_next_occurrence_per_parent
  on public.maintenance_tasks(recurrence_parent_id)
  where recurrence_parent_id is not null;

create or replace function public.schedule_next_maintenance_occurrence()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if new.status = 'completed'
     and old.status is distinct from new.status
     and new.interval_days is not null then
    insert into public.maintenance_tasks (
      organization_id, machine_id, title, description, due_at,
      interval_days, priority, status, assigned_to, created_by,
      recurrence_parent_id
    )
    values (
      new.organization_id, new.machine_id, new.title, new.description,
      clock_timestamp() + make_interval(days => new.interval_days),
      new.interval_days, new.priority, 'scheduled', new.assigned_to,
      new.created_by, new.id
    )
    on conflict (recurrence_parent_id)
      where recurrence_parent_id is not null
      do nothing;
  end if;
  return new;
end;
$$;

revoke all on function public.schedule_next_maintenance_occurrence() from public, anon;

drop trigger if exists maintenance_tasks_schedule_next_occurrence
  on public.maintenance_tasks;

create trigger maintenance_tasks_schedule_next_occurrence
after update of status on public.maintenance_tasks
for each row
execute function public.schedule_next_maintenance_occurrence();
