
create table public.organization_invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  invited_email text not null check (invited_email=lower(btrim(invited_email)) and char_length(invited_email) between 6 and 254),
  role text not null check (role in ('engineer','technician','reviewer')),
  token_hash bytea not null unique,
  invited_by uuid not null references auth.users(id) on delete restrict,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  accepted_by uuid references auth.users(id) on delete set null,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  constraint organization_invitations_expiry_check check (expires_at > created_at),
  constraint organization_invitations_acceptance_check check (
    (accepted_at is null and accepted_by is null) or (accepted_at is not null and accepted_by is not null)
  )
);

create index organization_invitations_org_created_idx
  on public.organization_invitations(organization_id,created_at desc);
create index organization_invitations_email_created_idx
  on public.organization_invitations(invited_email,created_at desc);
create index organization_invitations_invited_by_idx
  on public.organization_invitations(invited_by);

alter table public.organization_invitations enable row level security;
revoke all on table public.organization_invitations from anon,authenticated;

create or replace function private.create_org_invitation(p_org_id uuid,p_email text,p_role text)
returns table(invitation_id uuid,invite_token text,expires_at timestamptz)
language plpgsql
security definer
set search_path=pg_catalog,public,private,extensions
as $$
declare
  v_actor uuid := (select auth.uid());
  v_email text := lower(btrim(coalesce(p_email,'')));
  v_token text := encode(extensions.gen_random_bytes(32),'hex');
  v_invitation_id uuid;
  v_expires timestamptz := now()+interval '7 days';
begin
  if v_actor is null then raise exception 'Authentication required'; end if;
  if not private.is_org_owner(p_org_id) then raise exception 'Only organization owners or admins can invite members'; end if;
  if v_email !~ '^[^@[:space:]]+@[^@[:space:]]+[.][^@[:space:]]+$' then raise exception 'Enter a valid email address'; end if;
  if p_role not in ('engineer','technician','reviewer') then raise exception 'Invalid invitation role'; end if;
  if exists(select 1 from public.organization_members m join auth.users u on u.id=m.user_id
    where m.organization_id=p_org_id and m.status='active' and lower(u.email)=v_email) then
    raise exception 'This email already belongs to an active organization member';
  end if;
  if exists(select 1 from public.organization_invitations i
    where i.organization_id=p_org_id and i.invited_email=v_email
      and i.accepted_at is null and i.revoked_at is null and i.expires_at>now()) then
    raise exception 'A pending invitation already exists for this email';
  end if;
  insert into public.organization_invitations(organization_id,invited_email,role,token_hash,invited_by,expires_at)
  values(p_org_id,v_email,p_role,extensions.digest(v_token,'sha256'),v_actor,v_expires)
  returning id into v_invitation_id;
  insert into public.audit_logs(organization_id,actor_id,action,entity_type,entity_id,metadata)
  values(p_org_id,v_actor,'organization.invitation_created','organization_invitation',v_invitation_id,jsonb_build_object('role',p_role));
  return query select v_invitation_id,v_token,v_expires;
end;
$$;

create or replace function private.list_org_members(p_org_id uuid)
returns table(member_user_id uuid,display_name text,role text,status text,joined_at timestamptz)
language plpgsql
stable
security definer
set search_path=pg_catalog,public,private
as $$
begin
  if (select auth.uid()) is null or not private.is_org_member(p_org_id) then
    raise exception 'Not authorized to view this organization';
  end if;
  return query
  select m.user_id,
    coalesce(nullif(btrim(u.raw_user_meta_data->>'display_name'),''),split_part(coalesce(u.email,''),'@',1),'Member'),
    m.role,m.status,m.joined_at
  from public.organization_members m
  left join auth.users u on u.id=m.user_id
  where m.organization_id=p_org_id
  order by case m.role when 'owner' then 1 when 'admin' then 2 when 'engineer' then 3 else 4 end,m.joined_at;
end;
$$;

create or replace function private.list_org_invitations(p_org_id uuid)
returns table(invitation_id uuid,invited_email text,role text,expires_at timestamptz,created_at timestamptz)
language plpgsql
stable
security definer
set search_path=pg_catalog,public,private
as $$
begin
  if (select auth.uid()) is null or not private.is_org_owner(p_org_id) then
    raise exception 'Only organization owners or admins can view invitations';
  end if;
  return query
  select i.id,i.invited_email,i.role,i.expires_at,i.created_at
  from public.organization_invitations i
  where i.organization_id=p_org_id and i.accepted_at is null and i.revoked_at is null
  order by i.created_at desc;
end;
$$;

create or replace function private.revoke_org_invitation(p_invitation_id uuid)
returns void
language plpgsql
security definer
set search_path=pg_catalog,public,private
as $$
declare v_org uuid;
begin
  if (select auth.uid()) is null then raise exception 'Authentication required'; end if;
  select organization_id into v_org from public.organization_invitations where id=p_invitation_id and accepted_at is null and revoked_at is null;
  if not found then raise exception 'Invitation is no longer pending'; end if;
  if not private.is_org_owner(v_org) then raise exception 'Only organization owners or admins can revoke invitations'; end if;
  update public.organization_invitations set revoked_at=now() where id=p_invitation_id;
  insert into public.audit_logs(organization_id,actor_id,action,entity_type,entity_id,metadata)
  values(v_org,(select auth.uid()),'organization.invitation_revoked','organization_invitation',p_invitation_id,'{}'::jsonb);
end;
$$;

create or replace function private.accept_org_invitation(p_token text)
returns table(organization_id uuid,organization_name text,role text)
language plpgsql
security definer
set search_path=pg_catalog,public,private,extensions
as $$
declare
  v_actor uuid := (select auth.uid());
  v_email text;
  v_invitation public.organization_invitations%rowtype;
  v_org_name text;
  v_display_name text;
begin
  if v_actor is null then raise exception 'Authentication required'; end if;
  if p_token is null or p_token !~ '^[0-9a-fA-F]{64}$' then raise exception 'Invalid invitation token'; end if;
  select lower(email),coalesce(nullif(btrim(raw_user_meta_data->>'display_name'),''),split_part(coalesce(email,''),'@',1),'Member')
    into v_email,v_display_name from auth.users where id=v_actor;
  if v_email is null then raise exception 'Your account email is unavailable'; end if;
  select * into v_invitation
  from public.organization_invitations i
  where i.token_hash=extensions.digest(lower(p_token),'sha256')
  for update;
  if not found or v_invitation.accepted_at is not null or v_invitation.revoked_at is not null or v_invitation.expires_at<=now() then
    raise exception 'Invitation is invalid, expired, or already used';
  end if;
  if v_invitation.invited_email<>v_email then raise exception 'Sign in with the email address that received this invitation'; end if;
  if exists(select 1 from public.organization_members m where m.organization_id=v_invitation.organization_id and m.user_id=v_actor and m.status='active') then
    raise exception 'You are already an active member of this organization';
  end if;
  select name into v_org_name from public.organizations where id=v_invitation.organization_id;
  insert into public.organization_members(organization_id,user_id,role,status,joined_at)
  values(v_invitation.organization_id,v_actor,v_invitation.role,'active',now())
  on conflict(organization_id,user_id) do update
    set role=excluded.role,status='active',joined_at=now();
  update public.organization_invitations set accepted_at=now(),accepted_by=v_actor where id=v_invitation.id;
  insert into public.audit_logs(organization_id,actor_id,action,entity_type,entity_id,metadata)
  values(v_invitation.organization_id,v_actor,'organization.invitation_accepted','organization_member',v_actor,jsonb_build_object('role',v_invitation.role));
  return query select v_invitation.organization_id,v_org_name,v_invitation.role;
end;
$$;

grant usage on schema private to authenticated;
grant execute on function private.create_org_invitation(uuid,text,text) to authenticated;
grant execute on function private.list_org_members(uuid) to authenticated;
grant execute on function private.list_org_invitations(uuid) to authenticated;
grant execute on function private.revoke_org_invitation(uuid) to authenticated;
grant execute on function private.accept_org_invitation(text) to authenticated;

create or replace function public.create_organization_invitation(p_org_id uuid,p_email text,p_role text default 'technician')
returns table(invitation_id uuid,invite_token text,expires_at timestamptz)
language sql security invoker
set search_path=pg_catalog,public
as $$ select * from private.create_org_invitation(p_org_id,p_email,p_role); $$;

create or replace function public.list_organization_members(p_org_id uuid)
returns table(member_user_id uuid,display_name text,role text,status text,joined_at timestamptz)
language sql stable security invoker
set search_path=pg_catalog,public
as $$ select * from private.list_org_members(p_org_id); $$;

create or replace function public.list_organization_invitations(p_org_id uuid)
returns table(invitation_id uuid,invited_email text,role text,expires_at timestamptz,created_at timestamptz)
language sql stable security invoker
set search_path=pg_catalog,public
as $$ select * from private.list_org_invitations(p_org_id); $$;

create or replace function public.revoke_organization_invitation(p_invitation_id uuid)
returns void
language sql security invoker
set search_path=pg_catalog,public
as $$ select private.revoke_org_invitation(p_invitation_id); $$;

create or replace function public.accept_organization_invitation(p_token text)
returns table(organization_id uuid,organization_name text,role text)
language sql security invoker
set search_path=pg_catalog,public
as $$ select * from private.accept_org_invitation(p_token); $$;

revoke all on function public.create_organization_invitation(uuid,text,text) from public,anon;
revoke all on function public.list_organization_members(uuid) from public,anon;
revoke all on function public.list_organization_invitations(uuid) from public,anon;
revoke all on function public.revoke_organization_invitation(uuid) from public,anon;
revoke all on function public.accept_organization_invitation(text) from public,anon;
grant execute on function public.create_organization_invitation(uuid,text,text) to authenticated;
grant execute on function public.list_organization_members(uuid) to authenticated;
grant execute on function public.list_organization_invitations(uuid) to authenticated;
grant execute on function public.revoke_organization_invitation(uuid) to authenticated;
grant execute on function public.accept_organization_invitation(text) to authenticated;
