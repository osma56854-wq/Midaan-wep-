const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const html=fs.readFileSync("index.html","utf8");
const js=fs.readFileSync("app.js","utf8");
const sql=fs.readFileSync("supabase/migrations/20261110200000_global_rfq_and_quotes.sql","utf8");
test("RFQ page provides factory posting, supplier quoting, filters, and quote inbox",()=>{
 for(const id of ["view-rfqs","rfqOrg","rfqTitle","rfqDescription","rfqCategory","createRfq","rfqList","rfqSearch","rfqCategoryFilter","rfqQuotePanel","quoteAmount","quoteCurrency","quoteLeadDays","quoteNotes","submitRfqQuote","myRfqQuotes"])assert.ok(html.includes('id="'+id+'"'),"missing "+id);
 assert.ok(html.includes('data-view="rfqs"'));
 assert.ok(js.includes('from("industrial_rfqs")'));
 assert.ok(js.includes('from("rfq_quotes")'));
 assert.ok(js.includes("renderRfqs"));
});
test("RFQ and quote tables enforce RLS and participant-specific access",()=>{
 assert.ok(sql.includes("alter table public.industrial_rfqs enable row level security"));
 assert.ok(sql.includes("alter table public.rfq_quotes enable row level security"));
 assert.ok(sql.includes("industrial_rfqs_select_open_or_member"));
 assert.ok(sql.includes("industrial_rfqs_insert_active_member"));
 assert.ok(sql.includes("rfq_quotes_select_participants"));
 assert.ok(sql.includes("rfq_quotes_insert_public_supplier"));
 assert.ok(sql.includes("rfq_quotes_update_participant_status"));
 assert.ok(sql.includes("rfq_quotes_one_accepted_per_rfq"));
});
test("RFQs snapshot the organization display name and suppliers must be public",()=>{
 assert.ok(sql.includes("prepare_industrial_rfq"));
 assert.ok(sql.includes("new.buyer_display_name:=v_name"));
 assert.ok(sql.includes("p.is_public=true"));
 assert.ok(sql.includes("not exists"));
});
test("RFQ UI validates quote currency, price, and lead time before writing",()=>{
 assert.ok(js.includes("^[A-Z]{3}$"));
 assert.ok(js.includes("lead_days<0||lead_days>3650"));
 assert.ok(js.includes('from("rfq_quotes").insert'));
 assert.ok(js.includes('from("industrial_rfqs").insert'));
});
