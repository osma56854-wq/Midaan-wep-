const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const html=fs.readFileSync("index.html","utf8");
const js=fs.readFileSync("app.js","utf8");
const sql=fs.readFileSync("supabase/migrations/20261110220000_industrial_product_catalog.sql","utf8");
test("industrial catalog exposes product listing, search, filters, images, and RFQ conversion",()=>{
 for(const id of ["view-catalog","catalogList","catalogSearch","catalogCategoryFilter","catalogCountryFilter","productTitle","productDescription","productCategory","productImage","productStatus","createProduct"])assert.ok(html.includes('id="'+id+'"'),"missing "+id);
 assert.ok(html.includes('data-view="catalog"'));
 assert.ok(js.includes('from("industrial_products")'));
 assert.ok(js.includes('from("industrial-products").upload'));
 assert.ok(js.includes("data-product-rfq"));
 assert.ok(js.includes('activateView("rfqs")'));
});
test("catalog rows enforce public profile opt-in and seller ownership",()=>{
 assert.ok(sql.includes("alter table public.industrial_products enable row level security"));
 assert.ok(sql.includes("industrial_products_select_visible"));
 assert.ok(sql.includes("industrial_products_insert_own"));
 assert.ok(sql.includes("industrial_products_update_own"));
 assert.ok(sql.includes("industrial_products_delete_own"));
 assert.ok(sql.includes("p.is_public=true"));
});
test("product image bucket is public-read but uploads and deletes are scoped to seller-owned product paths",()=>{
 assert.ok(sql.includes("values('industrial-products','industrial-products',true,5242880"));
 assert.ok(sql.includes("industrial_products_image_upload"));
 assert.ok(sql.includes("industrial_products_image_delete"));
 assert.ok(sql.includes("(storage.foldername(name))[1]=(select auth.uid())::text"));
 assert.ok(sql.includes("p.id::text=(storage.foldername(name))[2] and p.seller_id=(select auth.uid())"));
});
test("product listings validate currency, quantity, and safe image MIME types",()=>{
 assert.ok(sql.includes("industrial_products_price_fields_check"));
 assert.ok(sql.includes("min_order_qty>0"));
 assert.ok(js.includes('["image/jpeg","image/png","image/webp"]'));
 assert.ok(js.includes("file.size>5*1024*1024"));
 assert.ok(js.includes("imageFailure=\"\""));
 assert.ok(js.includes("فشل رفع الصورة: "));
 assert.ok(js.includes("تعذر ربطها بالمنتج: "));
 assert.ok(js.includes("تعذر تنظيف الملف المرفوع: "));
 assert.ok(js.includes("المنتج محفوظ بدون صورة"));
 assert.ok(js.includes("^[A-Z]{3}$"));
});
