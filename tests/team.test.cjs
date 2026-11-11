const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const html=fs.readFileSync("index.html","utf8");
const js=fs.readFileSync("app.js","utf8");
const sql=fs.readFileSync("supabase/migrations/20261110210000_organization_invitations_and_team_roles.sql","utf8");
const hardening=fs.readFileSync("supabase/migrations/20261110211000_harden_organization_invitation_access.sql","utf8");
test("team workspace exposes member directory, invitation controls, and task assignment",()=>{
 for(const id of ["view-team","teamOrg","teamMembers","teamInvitations","teamInvitePanel","teamInviteEmail","teamInviteRole","createTeamInvite","teamInviteToken","copyTeamInvite","acceptTeamToken","acceptTeamInvite","maintenanceAssignee"])assert.ok(html.includes('id="'+id+'"'),"missing "+id);
 assert.ok(html.includes('data-view="team"'));
 assert.ok(js.includes('rpc("list_organization_members"'));
 assert.ok(js.includes('rpc("create_organization_invitation"'));
 assert.ok(js.includes('rpc("accept_organization_invitation"'));
 assert.ok(js.includes('assigned_to:$("maintenanceAssignee")?.value||user.id'));
});
test("invitation records are protected and tokens are stored as hashes",()=>{
 assert.ok(sql.includes("alter table public.organization_invitations enable row level security"));
 assert.ok(sql.includes("revoke all on table public.organization_invitations from anon,authenticated"));
 assert.ok(sql.includes("token_hash bytea not null unique"));
 assert.ok(sql.includes("extensions.digest(v_token,'sha256')"));
 assert.ok(sql.includes("extensions.gen_random_bytes(32)"));
});
test("only owners and admins can create or revoke invitations",()=>{
 assert.ok(sql.includes("private.is_org_owner(p_org_id)"));
 assert.ok(sql.includes("private.is_org_owner(v_org)"));
 assert.ok(sql.includes("Only organization owners or admins"));
});
test("invitation links carry a one-time token and prefill the accept form",()=>{
 assert.ok(html.includes('id="teamInviteLink"'));
 assert.ok(html.includes('id="copyTeamInviteLink"'));
 assert.match(js,/window\.location\.pathname\+"#invite="/);
 assert.match(js,/function applyInviteFromUrl\(\)/);
 assert.match(js,/acceptTeamToken"\)\.value=match\[1\]/);
 assert.match(js,/history\.replaceState\(null,"",location\.pathname\+"#team"\)/);
});
test("invitation acceptance requires the invited account email and a valid single-use token",()=>{
 assert.ok(sql.includes("v_invitation.invited_email<>v_email"));
 assert.ok(sql.includes("v_invitation.accepted_at is not null"));
 assert.ok(sql.includes("v_invitation.revoked_at is not null"));
 assert.ok(sql.includes("v_invitation.expires_at<=now()"));
 assert.ok(sql.includes("organization.invitation_accepted"));
});
test("team RPC wrappers are invoker functions and private implementation functions are explicitly granted",()=>{
 assert.ok(sql.includes("language sql security invoker"));
 assert.ok(sql.includes("grant execute on function private.accept_org_invitation(text) to authenticated"));
 assert.ok(sql.includes("grant execute on function public.accept_organization_invitation(text) to authenticated"));
 assert.ok(hardening.includes("revoke all on schema private from public,anon"));
 assert.ok(hardening.includes("revoke all on function private.accept_org_invitation(text) from public,anon"));
 assert.ok(hardening.includes("organization_invitations_select_managers"));
});
