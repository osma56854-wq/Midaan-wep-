const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("index.html", "utf8");
const js = fs.readFileSync("app.js", "utf8");
const migration = fs.readFileSync("supabase/migrations/20261110190000_global_industrial_marketplace.sql", "utf8");

test("marketplace page provides professional profiles, service offers, and request inboxes", () => {
  for (const id of ["view-marketplace","marketplaceList","marketProfileName","marketProfessionalType","marketHeadline","marketCountryCode","marketCity","marketPublic","saveMarketProfile","offerTitle","offerDescription","createServiceOffer","requestOrg","requestMessage","submitServiceRequest","incomingRequests","outgoingRequests"]) {
    assert.ok(html.includes('id="' + id + '"'), "missing marketplace element: " + id);
  }
  assert.ok(html.includes('data-view="marketplace"'));
  assert.ok(js.includes('from("professional_profiles")'));
  assert.ok(js.includes('from("service_offers")'));
  assert.ok(js.includes('from("service_requests")'));
  assert.ok(js.includes("renderServiceRequests"));
});

test("marketplace supports international country and currency codes without publishing private contact details", () => {
  assert.ok(migration.includes("country_code text"));
  assert.ok(migration.includes("currency_code text"));
  assert.ok(migration.includes("is_public boolean not null default false"));
  assert.ok(!migration.toLowerCase().includes("email text"));
  assert.ok(!migration.toLowerCase().includes("phone text"));
  assert.ok(js.includes("^[A-Z]{2}$"));
  assert.ok(js.includes("^[A-Z]{3}$"));
});

test("marketplace tables enforce authenticated access and row-level security", () => {
  for (const table of ["professional_profiles","service_offers","service_requests"]) {
    assert.ok(migration.includes("alter table public." + table + " enable row level security"));
  }
  assert.ok(migration.includes("revoke all on table public.professional_profiles, public.service_offers, public.service_requests from anon, authenticated"));
  assert.ok(migration.includes("grant select, insert, update(status) on table public.service_requests to authenticated"));
  assert.ok(migration.includes("professional_profiles_select_visible"));
  assert.ok(migration.includes("service_offers_select_visible"));
  assert.ok(migration.includes("service_requests_select_participants"));
  assert.ok(migration.includes("service_requests_offer_created"));
  assert.ok(migration.includes("service_requests_update_status_participant"));
});

test("service requests are checked against a published offer and the requester's active organization membership", () => {
  assert.ok(migration.includes("service_requests_insert_org_member"));
  assert.ok(migration.includes("o.status = 'published'"));
  assert.ok(migration.includes("m.status = 'active'"));
  assert.ok(migration.includes("prepare_service_request"));
  assert.ok(migration.includes("new.provider_id := v_provider_id"));
});

test("marketplace actions are connected to real Supabase queries", () => {
  assert.ok(js.includes('upsert({user_id:currentUserId'));
  assert.ok(js.includes('from("service_offers").insert'));
  assert.ok(js.includes('from("service_requests").insert'));
  assert.ok(js.includes('from("service_requests").update({status:next})'));
  assert.ok(js.includes('from("service_offers").update({status:offerButton.dataset.offerStatus})'));
});
