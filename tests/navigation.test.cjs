const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("index.html", "utf8");
const js = fs.readFileSync("app.js", "utf8");

test("all primary destinations have both navigation links and page containers", () => {
  for (const name of ["overview", "skills", "organizations", "machines", "faults", "settings"]) {
    assert.ok(html.includes('data-view="' + name + '"'));
    assert.ok(html.includes('id="view-' + name + '"'));
  }
});

test("navigation changes active page and supports browser history", () => {
  assert.ok(js.includes('document.querySelectorAll(".view")'));
  assert.ok(js.includes("history.pushState"));
  assert.ok(js.includes('addEventListener("popstate"'));
  assert.ok(js.includes('document.querySelectorAll("[data-view]")'));
});

test("responsive workspace and accessible navigation are present", () => {
  assert.ok(html.includes('aria-label="التنقل الرئيسي"'));
  assert.ok(html.includes("@media(max-width:900px)"));
  assert.ok(html.includes("@media(max-width:560px)"));
});

test("dashboard content belongs to the overview page", () => {
  const start = html.indexOf('<section class="view active" id="view-overview">');
  const end = html.indexOf('<section class="view" id="view-skills">', start);
  assert.notEqual(start, -1, "overview container exists");
  assert.notEqual(end, -1, "next page boundary exists");
  const overview = html.slice(start, end);
  assert.ok(overview.includes("مساحة العمل الصناعية"));
  assert.ok(overview.includes("statOrgs"));
});

test("fault center and account settings expose working controls", () => {
  for (const id of ["faultOrg", "faultMachine", "faultTitle", "faultDescription", "faultSeverity", "createFaultReport", "faultList", "profileName", "saveProfile", "themeToggle", "changePassword"]) assert.ok(html.includes('id="' + id + '"'), "missing control: " + id);
  assert.ok(js.includes('from("fault_reports")'));
  assert.ok(js.includes('updateUser({data:{display_name:name}})'));
  assert.ok(js.includes('localStorage.setItem("midaan-theme"'));
});
test("saved skill procedures are rendered with their steps", () => {
  assert.ok(js.includes("skill_steps(id,step_number,instruction,expected_result)"));
  assert.ok(js.includes('class="step-list"'));
});

test("fault reports support role-aware status transitions", () => {
  assert.ok(js.includes('data-report-status'));
  assert.ok(js.includes('.update({status:button.dataset.reportStatus})'));
  assert.ok(js.includes('["owner","admin","engineer"].includes(org?.memberRole)'));
});
test("service worker refreshes the shell and does not intercept cross-origin APIs", () => {
  const sw = fs.readFileSync("sw.js", "utf8");
  assert.ok(sw.includes("midaan-shell-v2"));
  assert.ok(sw.includes("url.origin!==self.location.origin"));
  assert.ok(sw.includes("fetch(request)"));
});
