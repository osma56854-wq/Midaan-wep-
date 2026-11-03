import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const ALLOWED_ORIGIN = "https://osma56854-wq.github.io";
const MAX_BODY_BYTES = 64 * 1024;
const cors = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Vary": "Origin"
};
const reply = (body: unknown, status = 200, extraHeaders: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...cors,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "no-referrer",
      ...extraHeaders
    }
  });

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  if (origin && origin !== ALLOWED_ORIGIN) return reply({ error: "Origin not allowed" }, 403);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method === "GET") return reply({ name: "midaan-api", status: "ok", version: 12 });
  if (req.method !== "POST") return reply({ error: "POST required" }, 405);
  if (!(req.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) {
    return reply({ error: "Content-Type must be application/json" }, 415);
  }

  const authorization = req.headers.get("Authorization") ?? "";
  if (!/^Bearer\s+\S+$/i.test(authorization)) {
    return reply({ error: "Authentication required" }, 401);
  }

  const url = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!url || !anonKey) return reply({ error: "Server configuration unavailable" }, 500);

  const db = createClient(url, anonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { data: authData, error: authError } = await db.auth.getUser();
  if (authError || !authData.user) return reply({ error: "Invalid session" }, 401);

  const declaredLength = Number(req.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return reply({ error: "Request body too large" }, 413);
  }

  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch {
    return reply({ error: "Unable to read request body" }, 400);
  }
  if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
    return reply({ error: "Request body too large" }, 413);
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(rawBody);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return reply({ error: "Invalid request body" }, 400);
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return reply({ error: "Invalid JSON" }, 400);
  }

  const { data: withinApiLimit, error: apiLimitError } = await db.rpc("consume_midaan_rate_limit", {
    p_bucket: "api"
  });
  if (apiLimitError) {
    console.error("API rate-limit check failed", { code: apiLimitError.code });
    return reply({ error: "الخدمة غير متاحة مؤقتًا. حاول مرة أخرى لاحقًا." }, 503);
  }
  if (withinApiLimit !== true) {
    return reply({ error: "طلبات كثيرة خلال وقت قصير. انتظر دقيقة ثم حاول مجددًا." }, 429, { "Retry-After": "60" });
  }

  if (body.action === "categories") {
    const { data, error } = await db.from("categories")
      .select("id,slug,name_ar,name_en")
      .eq("is_active", true)
      .order("sort_order");
    if (error) {
      console.error("categories query failed", { code: error.code });
      return reply({ error: "تعذر تحميل التصنيفات" }, 400);
    }
    return reply({ data });
  }

  if (body.action === "my_organizations") {
    const { data, error } = await db.from("organization_members")
      .select("organization_id,role,status,organizations(id,name,industry,country_code)")
      .eq("user_id", authData.user.id)
      .eq("status", "active");
    if (error) {
      console.error("organization query failed", { code: error.code });
      return reply({ error: "تعذر تحميل المنشآت" }, 400);
    }
    return reply({ data });
  }

  if (body.action === "create_skill") {
    const organizationId = typeof body.organization_id === "string" ? body.organization_id : "";
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const summary = typeof body.summary === "string" ? body.summary.trim() : "";
    const taskType = typeof body.task_type === "string" ? body.task_type : "maintenance";
    const categoryId = typeof body.category_id === "string" && body.category_id ? body.category_id : null;
    const safetyLevel = typeof body.safety_level === "string" ? body.safety_level : "caution";
    if (body.steps !== undefined && !Array.isArray(body.steps)) {
      return reply({ error: "قائمة الخطوات غير صالحة" }, 400);
    }
    const steps: unknown[] = Array.isArray(body.steps) ? body.steps : [];

    const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuid.test(organizationId) || (categoryId !== null && !uuid.test(categoryId))) {
      return reply({ error: "معرّف المنشأة أو التصنيف غير صالح" }, 400);
    }
    if (title.length < 4 || title.length > 200 || summary.length > 5000) {
      return reply({ error: "تحقق من طول العنوان والملخص" }, 400);
    }
    if (!["maintenance", "installation", "inspection", "troubleshooting", "operation"].includes(taskType)) {
      return reply({ error: "نوع المهمة غير صالح" }, 400);
    }
    if (!["normal", "caution", "high", "critical"].includes(safetyLevel)) {
      return reply({ error: "مستوى الخطورة غير صالح" }, 400);
    }
    if (steps.length > 50 || steps.some((step) =>
      !step || typeof step !== "object" || Array.isArray(step) ||
      typeof (step as Record<string, unknown>).instruction !== "string" ||
      ((step as Record<string, unknown>).instruction as string).length > 3000
    )) {
      return reply({ error: "بيانات الخطوات غير صالحة (حتى 50 خطوة، و3000 حرف لكل خطوة)" }, 400);
    }

    const { data, error } = await db.rpc("create_skill_with_steps", {
      p_organization_id: organizationId,
      p_title: title,
      p_summary: summary || null,
      p_category_id: categoryId,
      p_task_type: taskType,
      p_safety_level: safetyLevel,
      p_steps: steps
    });
    if (error) {
      console.error("create_skill failed", { code: error.code });
      return reply({ error: "تعذر حفظ المهارة. تحقق من صلاحياتك والبيانات المدخلة." }, 400);
    }
    return reply({ data }, 201);
  }

  return reply({ error: "Unknown action" }, 400);
});