-- MIDAAN security hardening and atomic create operations
-- Applied to project lkofveroqcrfehczdlkl; this file records the reproducible SQL.

begin;

-- Remove duplicate / over-broad permissive policies.
drop policy if exists categories_select_active on public.categories;
drop policy if exists machines_insert_member on public.machines;
drop policy if exists machines_select_members on public.machines;
drop policy if exists machines_update_admin_engineer on public.machines;
drop policy if exists machines_update_creator on public.machines;
drop policy if exists machines_update_creator_or_admin on public.machines;
drop policy if exists organization_members_insert_self_as_owner on public.organization_members;
drop policy if exists organization_members_select_self on public.organization_members;
drop policy if exists organizations_insert_owner on public.organizations;
drop policy if exists organizations_select_member on public.organizations;
drop policy if exists organizations_select_creator_or_member on public.organizations;
drop policy if exists organizations_update_owner on public.organizations;
drop policy if exists profiles_insert_self on public.profiles;
drop policy if exists profiles_select_self on public.profiles;
drop policy if exists profiles_update_self on public.profiles;
drop policy if exists skill_steps_insert_author_draft on public.skill_steps;
drop policy if exists skill_steps_insert_author_or_reviewer on public.skill_steps;
drop policy if exists skill_steps_insert_author_draft_or_reviewer on public.skill_steps;
drop policy if exists skill_steps_select_members on public.skill_steps;
drop policy if exists skills_insert_members on public.skills;
drop policy if exists skills_select_members on public.skills;
drop policy if exists skills_update_author_draft on public.skills;

-- Keep organization visibility tenant-scoped without recursive RLS subqueries.
create policy organizations_select_creator_or_member
on public.organizations for select to authenticated
using (created_by = (select auth.uid()) or private.is_org_member(id));

-- Creator in the organization OR active owner/admin/engineer may update machines.
create policy machines_update_creator_or_admin
on public.machines for update to authenticated
using (
  (created_by = (select auth.uid()) and private.is_org_member(organization_id))
  or exists (
    select 1 from public.organization_members m
    where m.organization_id = machines.organization_id
      and m.user_id = (select auth.uid())
      and m.status = 'active'
      and m.role in ('owner','admin','engineer')
  )
)
with check (
  (created_by = (select auth.uid()) and private.is_org_member(organization_id))
  or exists (
    select 1 from public.organization_members m
    where m.organization_id = machines.organization_id
      and m.user_id = (select auth.uid())
      and m.status = 'active'
      and m.role in ('owner','admin','engineer')
  )
);

-- Skill author can add steps while draft; reviewers/admins may add review corrections.
create policy skill_steps_insert_author_draft_or_reviewer
on public.skill_steps for insert to authenticated
with check (
  exists (
    select 1 from public.skills s
    where s.id = skill_steps.skill_id
      and (
        (s.author_id = (select auth.uid()) and s.status = 'draft'
         and private.is_org_member(s.organization_id))
        or exists (
          select 1 from public.organization_members m
          where m.organization_id = s.organization_id
            and m.user_id = (select auth.uid())
            and m.status = 'active'
            and m.role in ('owner','admin','reviewer')
        )
      )
  )
);

-- Client roles receive only the operations used by the application.
revoke all privileges on all tables in schema public from anon, authenticated;
grant usage on schema public to anon, authenticated;

grant select on public.categories to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.organizations to authenticated;
grant select, insert on public.organization_members to authenticated;
grant select, insert, update on public.machines to authenticated;
grant select, insert, update on public.skills to authenticated;
grant select, insert, update on public.skill_steps to authenticated;
grant select on public.audit_logs to authenticated;
grant select, insert, update on public.fault_reports to authenticated;
grant select, insert on public.skill_media to authenticated;
grant select, insert on public.skill_reviews to authenticated;
grant select, insert on public.skill_versions to authenticated;

-- Prevent accidental exposure of future public-schema objects.
alter default privileges for role postgres in schema public
  revoke all on tables from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke all on sequences from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke all on functions from anon, authenticated, public;

revoke all on function public.set_updated_at() from public, anon, authenticated;

-- Atomic organization + owner creation; RLS remains active (SECURITY INVOKER).
create or replace function public.create_organization_with_owner(p_name text)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $fn$
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
  insert into public.organizations(name, created_by)
  values (v_name, (select auth.uid()))
  returning id into v_id;

  insert into public.organization_members(organization_id,user_id,role,status)
  values (v_id, (select auth.uid()), 'owner', 'active');

  return jsonb_build_object('id',v_id,'name',v_name);
end;
$fn$;

-- Atomic skill + ordered steps creation; errors roll back the whole RPC.
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
security invoker
set search_path = ''
as $fn$
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
    raise exception 'اختر منشأة واكتب عنوانًا من 4 إلى 200 حرف' using errcode = '22023';
  end if;
  if p_safety_level not in ('normal','caution','high','critical') then
    raise exception 'مستوى خطورة غير صالح' using errcode = '22023';
  end if;
  if p_task_type not in ('maintenance','installation','inspection','troubleshooting','operation') then
    raise exception 'نوع المهمة غير صالح' using errcode = '22023';
  end if;
  if jsonb_typeof(v_steps) <> 'array' or jsonb_array_length(v_steps) > 50 then
    raise exception 'عدد الخطوات غير صالح (الحد الأقصى 50)' using errcode = '22023';
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
    v_instruction := btrim(coalesce(v_item->>'instruction',''));
    if v_instruction <> '' then
      if length(v_instruction) > 3000 then
        raise exception 'الخطوة الواحدة يجب ألا تتجاوز 3000 حرف' using errcode = '22023';
      end if;
      v_count := v_count + 1;
      insert into public.skill_steps(skill_id,step_number,instruction)
      values (v_skill.id,v_count,v_instruction);
    end if;
  end loop;

  return jsonb_build_object(
    'id',v_skill.id,
    'title',v_skill.title,
    'status',v_skill.status,
    'created_at',v_skill.created_at,
    'steps_saved',v_count
  );
end;
$fn$;

revoke all on function public.create_organization_with_owner(text) from public, anon;
grant execute on function public.create_organization_with_owner(text) to authenticated;
revoke all on function public.create_skill_with_steps(uuid,text,text,uuid,text,text,jsonb) from public, anon;
grant execute on function public.create_skill_with_steps(uuid,text,text,uuid,text,text,jsonb) to authenticated;

commit;
