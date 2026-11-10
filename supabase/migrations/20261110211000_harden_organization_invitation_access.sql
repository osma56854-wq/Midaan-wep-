revoke all on schema private from public,anon;
grant usage on schema private to authenticated;
revoke all on function private.create_org_invitation(uuid,text,text) from public,anon;
revoke all on function private.list_org_members(uuid) from public,anon;
revoke all on function private.list_org_invitations(uuid) from public,anon;
revoke all on function private.revoke_org_invitation(uuid) from public,anon;
revoke all on function private.accept_org_invitation(text) from public,anon;
grant execute on function private.create_org_invitation(uuid,text,text) to authenticated;
grant execute on function private.list_org_members(uuid) to authenticated;
grant execute on function private.list_org_invitations(uuid) to authenticated;
grant execute on function private.revoke_org_invitation(uuid) to authenticated;
grant execute on function private.accept_org_invitation(text) to authenticated;

create policy organization_invitations_select_managers
on public.organization_invitations for select to authenticated
using (private.is_org_owner(organization_id));

create index organization_invitations_accepted_by_idx
on public.organization_invitations(accepted_by);