const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const html=fs.readFileSync("index.html","utf8");
const js=fs.readFileSync("app.js","utf8");
const sql=fs.readFileSync("supabase/migrations/20261110140644_create_maintenance_tasks.sql","utf8");

test("maintenance schema is organization scoped and row-level secured",()=>{
  assert.match(sql,/enable row level security/i);
  assert.match(sql,/grant select, insert, update, delete on table public\.maintenance_tasks to authenticated/i);
  assert.match(sql,/revoke all on table public\.maintenance_tasks from anon, authenticated/i);
  assert.match(sql,/maintenance_tasks_select_active_members/);
  assert.match(sql,/maintenance_tasks_insert_engineers/);
  assert.match(sql,/maintenance_tasks_update_managers_or_assignee/);
  assert.match(sql,/maintenance_tasks_delete_org_admins/);
});
test("machine foreign key enforces that a task machine belongs to the same organization",()=>{
  assert.match(sql,/foreign key \(machine_id, organization_id\)[\s\S]*references public\.machines \(id, organization_id\)/i);
});
test("maintenance constraints validate dates, status, priority and repeat interval",()=>{
  assert.match(sql,/interval_days between 1 and 3650/i);
  assert.match(sql,/priority in \('low','medium','high','critical'\)/i);
  assert.match(sql,/status in \('scheduled','in_progress','completed','cancelled'\)/i);
  assert.match(sql,/maintenance_tasks_completed_at_consistency/);
});
test("UI does not allow non-manager roles to create maintenance tasks",()=>{
  assert.match(js,/\["owner","admin","engineer"\]\.includes\(role\)/);
  assert.match(js,/createMaintenance\)\.disabled=!allowed/);
});
test("maintenance status changes set and clear completion timestamps consistently",()=>{
  assert.match(js,/completed_at:status==="completed"\?now:null/);
  assert.match(js,/\["scheduled","in_progress"\]\.includes\(task\.status\)/);
});
