-- MIDAAN: per-user API and write-operation rate limits.
-- Private counters are inaccessible to client roles; only fixed, whitelisted buckets are callable.

begin;

create schema if not exists private;

create table if not exists private.midaan_api_rate_limits (
  user_id uuid not null references auth.users(id) on delete cascade,
  bucket text not null,
  window_started_at timestamptz not null,
  request_count integer not null check (request_count >= 0),
  updated_at timestamptz not null default clock_timestamp(),
  primary key (user_id, bucket),
  check (bucket in ('api','skill-write','organization-write','machine-write'))
);

alter table private.midaan_api_rate_limits enable row level security;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;
revoke all on table private.midaan_api_rate_limits from public, anon, authenticated;

create or replace function private.consume_midaan_rate_limit(p_bucket text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_count integer;
  v_limit integer;
  v_window_seconds integer;
  v_now timestamptz := clock_timestamp();
begin
  if v_uid is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  case p_bucket
    when 'api' then v_limit := 120; v_window_seconds := 60;
    when 'skill-write' then v_limit := 10; v_window_seconds := 60;
    when 'organization-write' then v_limit := 3; v_window_seconds := 3600;
    when 'machine-write' then v_limit := 20; v_window_seconds := 60;
    else raise exception 'Unknown rate limit bucket' using errcode = '22023';
  end case;

  insert into private.midaan_api_rate_limits as current_limit
    (user_id, bucket, window_started_at, request_count, updated_at)
  values (v_uid, p_bucket, v_now, 1, v_now)
  on conflict (user_id, bucket) do update
  set
    window_started_at = case
      when current_limit.window_started_at + make_interval(secs => v_window_seconds) <= v_now
      then v_now else current_limit.window_started_at end,
    request_count = case
      when current_limit.window_started_at + make_interval(secs => v_window_seconds) <= v_now
      then 1 else current_limit.request_count + 1 end,
    updated_at = v_now
  returning request_count into v_count;

  return v_count <= v_limit;
end;
$function$;

create or replace function public.consume_midaan_rate_limit(p_bucket text)
returns boolean
language sql
security invoker
set search_path = ''
as $function$
  select private.consume_midaan_rate_limit(p_bucket);
$function$;

revoke all on function private.consume_midaan_rate_limit(text) from public, anon;
grant execute on function private.consume_midaan_rate_limit(text) to authenticated;
revoke all on function public.consume_midaan_rate_limit(text) from public, anon;
grant execute on function public.consume_midaan_rate_limit(text) to authenticated;

create or replace function public.create_organization_with_owner(p_name text)
returns jsonb
language plpgsql
set search_path to ''
as $function$
declare
  v_id uuid;
  v_name text := btrim(coalesce(p_name,''));
begin
  if (select auth.uid()) is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if length(v_name) < 2 or length(v_name) > 160 then
    raise exception 'اسم المنشأة يجب أن يكون بين حرفين و160 حرفًا' using errcode = '22023';
  end if;
  if not private.consume_midaan_rate_limit('organization-write') then
    raise exception 'Organization creation rate limit exceeded' using errcode = 'P0001';
  end if;

  insert into public.organizations(name, created_by)
  values (v_name, (select auth.uid()))
  returning id into v_id;
  insert into public.organization_members(organization_id,user_id,role,status)
  values (v_id, (select auth.uid()), 'owner', 'active');

  return jsonb_build_object('id',v_id,'name',v_name);
end;
$function$;

create or replace function public.create_skill_with_steps(
  p_organization_id uuid,
  p_title text,
  p_summary text,
  p_category_id uuid,
  p_task_type text,
  p_safety_level text,
  p_steps jsonb
)
returns jsonb
language plpgsql
set search_path to ''
as $function$
declare
  v_skill public.skills%rowtype;
  v_steps jsonb := coalesce(p_steps, '[]'::jsonb);
  v_count integer := 0;
  v_item jsonb;
  v_instruction text;
begin
  if (select auth.uid()) is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if p_organization_id is null or length(btrim(coalesce(p_title,''))) < 4 or length(p_title) > 200 then
    raise exception 'Invalid skill title or organization' using errcode = '22023';
  end if;
  if length(coalesce(p_summary,'')) > 5000 then
    raise exception 'Summary exceeds 5000 characters' using errcode = '22023';
  end if;
  if p_safety_level is null or p_safety_level not in ('normal','caution','high','critical') then
    raise exception 'Invalid safety level' using errcode = '22023';
  end if;
  if p_task_type is null or p_task_type not in ('maintenance','installation','inspection','troubleshooting','operation') then
    raise exception 'Invalid task type' using errcode = '22023';
  end if;
  if jsonb_typeof(v_steps) <> 'array' or jsonb_array_length(v_steps) > 50 then
    raise exception 'Invalid steps array (maximum 50)' using errcode = '22023';
  end if;
  if not private.consume_midaan_rate_limit('skill-write') then
    raise exception 'Skill creation rate limit exceeded' using errcode = 'P0001';
  end if;

  insert into public.skills(
    organization_id, author_id, title, summary, category_id, task_type, safety_level, status
  ) values (
    p_organization_id, (select auth.uid()), btrim(p_title),
    nullif(btrim(coalesce(p_summary,'')),''), p_category_id, p_task_type, p_safety_level, 'draft'
  )
  returning * into v_skill;

  for v_item in select value from jsonb_array_elements(v_steps)
  loop
    if jsonb_typeof(v_item) <> 'object' then
      raise exception 'Each step must be an object' using errcode = '22023';
    end if;
    v_instruction := btrim(coalesce(v_item->>'instruction',''));
    if v_instruction <> '' then
      if length(v_instruction) > 3000 then
        raise exception 'Each step must be 3000 characters or fewer' using errcode = '22023';
      end if;
      v_count := v_count + 1;
      insert into public.skill_steps(skill_id,step_number,instruction)
      values (v_skill.id,v_count,v_instruction);
    end if;
  end loop;

  return jsonb_build_object('id',v_skill.id,'title',v_skill.title,'status',v_skill.status,
    'created_at',v_skill.created_at,'steps_saved',v_count);
end;
$function$;

create or replace function private.enforce_machine_write_rate_limit()
returns trigger
language plpgsql
set search_path = ''
as $function$
begin
  if not private.consume_midaan_rate_limit('machine-write') then
    raise exception 'Machine creation rate limit exceeded' using errcode = 'P0001';
  end if;
  return new;
end;
$function$;

revoke all on function private.enforce_machine_write_rate_limit() from public, anon;
grant execute on function private.enforce_machine_write_rate_limit() to authenticated;
drop trigger if exists machines_rate_limit_before_insert on public.machines;
create trigger machines_rate_limit_before_insert
before insert on public.machines
for each row execute function private.enforce_machine_write_rate_limit();

revoke all on function public.create_organization_with_owner(text) from public, anon;
grant execute on function public.create_organization_with_owner(text) to authenticated;
revoke all on function public.create_skill_with_steps(uuid,text,text,uuid,text,text,jsonb) from public, anon;
grant execute on function public.create_skill_with_steps(uuid,text,text,uuid,text,text,jsonb) to authenticated;

commit;
