const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("index.html", "utf8");
const js = fs.readFileSync("app.js", "utf8");

test("all primary destinations have both navigation links and page containers", () => {
  for (const name of ["overview", "skills", "organizations", "machines"]) {
    assert.match(html, new RegExp('data-view="' + name + '"'));
    assert.match(html, new RegExp('id="view-' + name + '"'));
  }
});

test("navigation changes active page and supports browser history", () => {
  assert.match(js, /document\.querySelectorAll\("\.view"\)/);
  assert.match(js, /history\.pushState/);
  assert.match(js, /addEventListener\("popstate"/);
  assert.match(js, /document\.querySelectorAll\("\[data-view\]"\)/);
});

test("responsive workspace and accessible navigation are present", () => {
  assert.match(html, /aria-label="التنقل الرئيسي"/);
  assert.match(html, /@media\(max-width:900px\)/);
  assert.match(html, /@media\(max-width:560px\)/);
});

test("dashboard content belongs to the overview page", () => {
  const overview = html.match(/<section class="view active" id="view-overview">([\s\S]*?)<\/section>/);
  assert.ok(overview, "overview container exists");
  assert.match(overview[1], /مساحة العمل الصناعية/);
  assert.match(overview[1], /statOrgs/);
});
