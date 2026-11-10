const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("index.html", "utf8");
const js = fs.readFileSync("app.js", "utf8");

test("all primary destinations have both navigation links and page containers", () => {
  for (const name of ["overview", "skills", "organizations", "machines"]) {
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
