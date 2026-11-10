const SUPABASE_URL="https://lkofveroqcrfehczdlkl.supabase.co";
const SUPABASE_KEY="sb_publishable_CuQEm5GvRbWb56hmRqkhUg_nvK0XObm";
const API=SUPABASE_URL+"/functions/v1/midaan-api";
const db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
const $=id=>document.getElementById(id);
let mode="login",organizations=[],allSkills=[],categories=[];
function showMessage(id,text,error){const n=$(id);n.textContent=text;n.classList.remove("hidden");n.classList.toggle("error",!!error);n.style.display="block";if(id==="globalMessage")setTimeout(()=>n.style.display="none",6000)}
function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
async function isCompromisedPassword(password){
  try{
    const digest=await crypto.subtle.digest("SHA-1",new TextEncoder().encode(password));
    const hash=Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,"0")).join("").toUpperCase();
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),8000);
    let response;
    try{
      response=await fetch("https://api.pwnedpasswords.com/range/"+hash.slice(0,5),{
        mode:"cors",
        credentials:"omit",
        cache:"no-store",
        referrerPolicy:"no-referrer",
        signal:controller.signal
      });
    }finally{clearTimeout(timeout)}
    if(!response.ok)throw new Error("تعذر فحص كلمة المرور حاليًا. حاول مرة أخرى.");
    const suffix=hash.slice(5);
    const rows=(await response.text()).split(/\r?\n/);
    return rows.some(row=>{
      const [candidate,count]=row.trim().split(":");
      return candidate?.toUpperCase()===suffix && Number(count)>0;
    });
  }catch(e){
    if(e instanceof Error && e.message.startsWith("تعذر فحص"))throw e;
    throw new Error("تعذر الاتصال بخدمة فحص كلمات المرور. حاول مرة أخرى قبل إنشاء الحساب.");
  }
}
function setMode(next){mode=next;const signup=next==="signup";$("signupName").classList.toggle("hidden",!signup);$("authTitle").textContent=signup?"إنشاء حساب جديد":"أهلاً بك في مِيدان";$("authSub").textContent=signup?"ابدأ بتسجيل حساب مهني على مِيدان.":"سجّل دخولك للوصول إلى مساحة العمل الصناعية.";$("authSubmit").textContent=signup?"إنشاء الحساب":"دخول";$("authSubmit").classList.remove("hidden");$("email").parentElement.classList.remove("hidden");$("password").parentElement.classList.remove("hidden");$("forgotPassword").classList.toggle("hidden",signup);$("recoveryPanel").classList.add("hidden");$("showLogin").classList.toggle("primary",!signup);$("showSignup").classList.toggle("primary",signup);$("authMessage").style.display="none"}
function setScreen(authed){$("authScreen").classList.toggle("hidden",authed);$("appScreen").classList.toggle("hidden",!authed)}
function statusLabel(s){return ({draft:"مسودة",submitted:"مرسلة للمراجعة",under_review:"قيد المراجعة",approved:"معتمدة",rejected:"مرفوضة",archived:"مؤرشفة"})[s]||s}
function safetyLabel(s){return ({normal:"عادي",caution:"احتياط",high:"مرتفع",critical:"حرج"})[s]||s}
function pillClass(s){return s==="approved"?"green":s==="critical"||s==="high"?"red":"gold"}
async function api(action,payload={}){const {data:{session}}=await db.auth.getSession();if(!session)throw new Error("انتهت الجلسة. سجّل الدخول مرة أخرى.");const response=await fetch(API,{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+session.access_token,"apikey":SUPABASE_KEY},body:JSON.stringify({action,...payload})});const body=await response.json().catch(()=>({error:"استجابة غير مفهومة من الخادم"}));if(!response.ok)throw new Error(body.error||"تعذر تنفيذ الطلب");return body.data}
async function loadAll(){const {data:{user}}=await db.auth.getUser();$("userEmail").textContent=user?.email||"";const orgData=await api("my_organizations");organizations=(orgData||[]).map(x=>x.organizations).filter(Boolean);const cat=await db.from("categories").select("id,slug,name_ar").eq("is_active",true).order("sort_order");if(cat.error)throw cat.error;categories=cat.data||[];renderOrganizations();renderOrgSelects();renderCategories();await loadSkills();await loadMachines()}
function renderOrganizations(){const target=$("orgList");target.innerHTML=organizations.length?organizations.map(o=>'<div class="item"><div class="item-head"><div><h3>'+escapeHtml(o.name)+'</h3><div class="tiny">'+escapeHtml(o.industry||"حقن البلاستيك")+' · '+escapeHtml(o.country_code||"EG")+'</div></div><span class="pill green">نشطة</span></div></div>').join(""):'<div class="empty">لا توجد منشآت بعد. أنشئ منشأتك الأولى من النموذج المجاور.</div>';$("statOrgs").textContent=organizations.length}
function renderOrgSelects(){["skillOrg","machineOrg"].forEach(id=>{const s=$(id),old=s.value;s.innerHTML=organizations.map(o=>'<option value="'+o.id+'">'+escapeHtml(o.name)+'</option>').join("");if(old&&organizations.some(o=>o.id===old))s.value=old})}
function renderCategories(){$("skillCategory").innerHTML='<option value="">بدون تصنيف</option>'+categories.map(c=>'<option value="'+c.id+'">'+escapeHtml(c.name_ar)+'</option>').join("")}
async function loadSkills(){const orgId=$("skillOrg").value;const list=$("skillList"),recent=$("recentSkills");if(!orgId){allSkills=[];list.innerHTML='<div class="empty">أنشئ منشأة أولًا ثم ابدأ توثيق المهارات.</div>';recent.innerHTML='<div class="empty">أضف منشأة لتبدأ.</div>';updateStats();return}const {data,error}=await db.from("skills").select("id,title,summary,status,safety_level,created_at,task_type,categories(name_ar),skill_media(id,storage_path,media_type,caption)").eq("organization_id",orgId).order("created_at",{ascending:false});if(error)throw error;allSkills=await Promise.all((data||[]).map(async s=>{const media=await Promise.all((s.skill_media||[]).map(async m=>{const {data:signed,error:signError}=await db.storage.from("skill-evidence").createSignedUrl(m.storage_path,3600);return {...m,url:signError?null:signed?.signedUrl||null}}));return {...s,media}}));renderSkillLists();updateStats()}
function skillCard(s){const media=(s.media||[]).map(m=>{if(!m.url)return '<div class="tiny">تعذر إنشاء رابط آمن لأحد المرفقات.</div>';const url=escapeHtml(m.url),caption=escapeHtml(m.caption||"مرفق داعم");if(m.media_type==="image")return '<a href="'+url+'" target="_blank" rel="noopener noreferrer"><img src="'+url+'" alt="'+caption+'" loading="lazy" style="max-width:100%;max-height:220px;border-radius:10px;margin:8px 6px 0 0"></a>';if(m.media_type==="video")return '<video controls preload="none" style="display:block;width:100%;max-height:260px;margin-top:8px;border-radius:10px"><source src="'+url+'"></video>';return '<div class="tiny"><a href="'+url+'" target="_blank" rel="noopener noreferrer">فتح ملف PDF: '+caption+'</a></div>'}).join("");return '<div class="item"><div class="item-head"><div><h3>'+escapeHtml(s.title)+'</h3><div class="tiny">'+escapeHtml(s.categories?.name_ar||"غير مصنف")+' · '+new Date(s.created_at).toLocaleDateString("ar-EG")+'</div></div><div style="display:flex;gap:5px;flex-wrap:wrap;justify-content:end"><span class="pill '+pillClass(s.status)+'">'+statusLabel(s.status)+'</span><span class="pill">'+safetyLabel(s.safety_level)+'</span></div></div><p>'+escapeHtml(s.summary||"لا يوجد ملخص.")+'</p>'+(media?'<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">'+media+'</div>':"")+'</div>'}
function renderSkillLists(){const q=$("skillSearch").value.trim().toLowerCase();const rows=allSkills.filter(s=>(s.title+" "+(s.summary||"")).toLowerCase().includes(q));$("skillList").innerHTML=rows.length?rows.map(skillCard).join(""):'<div class="empty">لا توجد نتائج مطابقة. أضف أول مهارة من النموذج.</div>';const recent=allSkills.slice(0,4);$("recentSkills").innerHTML=recent.length?recent.map(skillCard).join(""):'<div class="empty">لم تُسجّل مهارات بعد. ابدأ بتوثيق أول خبرة عملية.</div>'}
function updateStats(){$("statSkills").textContent=allSkills.length;$("statDrafts").textContent=allSkills.filter(s=>s.status==="draft").length}
async function loadMachines(){const orgId=$("machineOrg").value;if(!orgId){$("machineList").innerHTML='<div class="empty">أنشئ منشأة أولًا.</div>';return}const {data,error}=await db.from("machines").select("id,name,manufacturer,model,machine_type,created_at").eq("organization_id",orgId).order("created_at",{ascending:false});if(error)throw error;$("machineList").innerHTML=data.length?data.map(m=>'<div class="item"><div class="item-head"><div><h3>'+escapeHtml(m.name)+'</h3><div class="tiny">'+escapeHtml([m.manufacturer,m.model].filter(Boolean).join(" · ")||"بيانات إضافية غير مسجلة")+'</div></div><span class="pill">ماكينة حقن</span></div></div>').join(""):'<div class="empty">لا توجد ماكينات مسجلة لهذه المنشأة.</div>'}
function activateView(name){document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id==="view-"+name));document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active",t.dataset.view===name));}
$("showLogin").onclick=()=>setMode("login");$("showSignup").onclick=()=>setMode("signup");
function showRecoveryForm(){mode="recovery";$("authTitle").textContent="تعيين كلمة مرور جديدة";$("authSub").textContent="اكتب كلمة مرور جديدة لحسابك في مِيدان.";$("signupName").classList.add("hidden");$("email").parentElement.classList.add("hidden");$("password").parentElement.classList.add("hidden");$("authSubmit").classList.add("hidden");$("forgotPassword").classList.add("hidden");$("showLogin").classList.add("hidden");$("showSignup").classList.add("hidden");$("recoveryPanel").classList.remove("hidden");$("authMessage").style.display="none"}
$("forgotPassword").onclick=async()=>{const email=$("email").value.trim(),b=$("forgotPassword");if(!email){showMessage("authMessage","اكتب بريدك الإلكتروني أولًا.",true);return}b.disabled=true;try{const redirectTo=window.location.origin+window.location.pathname;const {error}=await db.auth.resetPasswordForEmail(email,{redirectTo});if(error)throw error;showMessage("authMessage","لو البريد مسجل في مِيدان، هتوصلك رسالة لإعادة تعيين كلمة المرور. افحص الوارد والرسائل غير المرغوب فيها.");}catch(e){showMessage("authMessage",e.message||"تعذر إرسال رسالة الاستعادة.",true)}finally{b.disabled=false}};
$("saveNewPassword").onclick=async()=>{const p=$("newPassword").value,c=$("confirmPassword").value,b=$("saveNewPassword");if(p.length<12){showMessage("authMessage","كلمة المرور الجديدة يجب ألا تقل عن 12 حرفًا.",true);return}if(p!==c){showMessage("authMessage","كلمتا المرور غير متطابقتين.",true);return}b.disabled=true;try{if(await isCompromisedPassword(p))throw new Error("كلمة المرور دي ظهرت في تسريبات معروفة. اختار كلمة مرور مختلفة.");const {error}=await db.auth.updateUser({password:p});if(error)throw error;await db.auth.signOut();$("newPassword").value="";$("confirmPassword").value="";$("showLogin").classList.remove("hidden");$("showSignup").classList.remove("hidden");setMode("login");showMessage("authMessage","تم تغيير كلمة المرور بنجاح. سجّل الدخول بكلمة المرور الجديدة.");}catch(e){showMessage("authMessage",e.message||"تعذر تغيير كلمة المرور.",true)}finally{b.disabled=false}};
db.auth.onAuthStateChange((event)=>{if(event==="PASSWORD_RECOVERY")showRecoveryForm()});
$("authSubmit").onclick=async()=>{const email=$("email").value.trim(),password=$("password").value;const b=$("authSubmit");b.disabled=true;try{if(!email||!password)throw new Error("اكتب البريد الإلكتروني وكلمة المرور.");if(mode==="signup"){if(password.length<12)throw new Error("كلمة المرور يجب ألا تقل عن 12 حرفًا.");if(await isCompromisedPassword(password))throw new Error("كلمة المرور دي ظهرت في تسريبات معروفة. اختار كلمة مرور مختلفة.");const {data,error}=await db.auth.signUp({email,password,options:{data:{display_name:$("displayName").value.trim()}}});if(error)throw error;if(!data.session){showMessage("authMessage","تم إنشاء الحساب. افتح رسالة التأكيد في بريدك الإلكتروني، ثم ارجع وسجّل الدخول.");return}}else{const {error}=await db.auth.signInWithPassword({email,password});if(error)throw error}setScreen(true);await loadAll()}catch(e){const target=$("appScreen").classList.contains("hidden")?"authMessage":"globalMessage";showMessage(target,e.message||"حدث خطأ غير متوقع.",true)}finally{b.disabled=false}};
$("signOut").onclick=async()=>{await db.auth.signOut();setScreen(false)};
$("createOrg").onclick=async()=>{const name=$("orgName").value.trim(),b=$("createOrg");if(name.length<2){showMessage("globalMessage","اكتب اسم المنشأة بشكل صحيح.",true);return}b.disabled=true;try{const {error}=await db.rpc("create_organization_with_owner",{p_name:name});if(error)throw error;$("orgName").value="";await loadAll();showMessage("globalMessage","تم إنشاء المنشأة وربط مالكها بحسابك في عملية واحدة.")}catch(e){showMessage("globalMessage",e.message||"تعذر إنشاء المنشأة.",true)}finally{b.disabled=false}};
$("saveSkill").onclick=async()=>{
  const orgId=$("skillOrg").value,title=$("skillTitle").value.trim();
  if(!orgId){showMessage("globalMessage","أنشئ منشأة أولًا قبل تسجيل المهارة.",true);return}
  if(title.length<4){showMessage("globalMessage","عنوان المهارة يجب أن يكون 4 أحرف على الأقل.",true);return}
  const steps=$("skillSteps").value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean).map(instruction=>({instruction}));
  const b=$("saveSkill");b.disabled=true;
  try{
    const files=window.MidaanSkillUploads.validateFiles(Array.from($("skillFiles").files||[]));
    const created=await api("create_skill",{organization_id:orgId,title,summary:$("skillSummary").value.trim(),category_id:$("skillCategory").value||null,task_type:$("taskType").value,safety_level:$("safety").value,steps});
    if(!created?.id)throw new Error("تم إرسال المهارة لكن لم يُرجع الخادم معرّفها؛ راجع المهارات قبل إعادة المحاولة.");
    if(files.length){
      const {data:{user}}=await db.auth.getUser();
      if(!user?.id)throw new Error("تعذر التحقق من المستخدم لرفع المرفقات. المهارة محفوظة كمسودة دون مرفقات.");
      try{
        await window.MidaanSkillUploads.uploadWithRollback(
          files,
          async file=>{
            const ext=(file.name.split(".").pop()||"bin").toLowerCase().replace(/[^a-z0-9]/g,"").slice(0,8)||"bin";
            const path=orgId+"/"+user.id+"/"+created.id+"/"+crypto.randomUUID()+"."+ext;
            const {error:uploadError}=await db.storage.from("skill-evidence").upload(path,file,{contentType:file.type,upsert:false});
            if(uploadError)throw new Error("تعذر رفع الملف "+file.name+": "+uploadError.message);
            const mediaType=file.type.startsWith("image/")?"image":file.type.startsWith("video/")?"video":"document";
            return {path,metadata:{skill_id:created.id,uploaded_by:user.id,storage_path:path,media_type:mediaType,caption:file.name}};
          },
          async rows=>{
            const {error:mediaError}=await db.from("skill_media").insert(rows);
            if(mediaError)throw new Error("تم رفع الملفات لكن تعذر حفظ بيانات المرفقات: "+mediaError.message);
          },
          async paths=>{
            const {error:removeError}=await db.storage.from("skill-evidence").remove(paths);
            if(removeError)throw removeError;
          }
        );
      }catch(uploadFailure){
        throw new Error(uploadFailure.message+" المهارة نفسها ما زالت محفوظة كمسودة دون اكتمال المرفقات.");
      }
    }
    $("skillTitle").value="";$("skillSummary").value="";$("skillSteps").value="";$("skillFiles").value="";
    await loadSkills();
    showMessage("globalMessage",files.length?"تم حفظ المهارة ورفع المرفقات كمسودة. لن تظهر كإجراء معتمد قبل المراجعة.":"تم حفظ المهارة كمسودة. لن تظهر كإجراء معتمد قبل المراجعة.");
  }catch(e){showMessage("globalMessage",e.message||"تعذر حفظ المهارة.",true)}
  finally{b.disabled=false}
};
$("createMachine").onclick=async()=>{const orgId=$("machineOrg").value,name=$("machineName").value.trim(),b=$("createMachine");if(!orgId||name.length<2){showMessage("globalMessage","اختر منشأة واكتب اسم الماكينة.",true);return}b.disabled=true;try{const {data:{user}}=await db.auth.getUser();const {error}=await db.from("machines").insert({organization_id:orgId,name,manufacturer:$("manufacturer").value.trim()||null,model:$("machineModel").value.trim()||null,created_by:user.id});if(error)throw error;$("machineName").value="";$("manufacturer").value="";$("machineModel").value="";await loadMachines();showMessage("globalMessage","تم تسجيل الماكينة.")}catch(e){showMessage("globalMessage",e.message||"تعذر حفظ الماكينة.",true)}finally{b.disabled=false}};
$("skillOrg").onchange=()=>loadSkills().catch(e=>showMessage("globalMessage",e.message,true));$("machineOrg").onchange=()=>loadMachines().catch(e=>showMessage("globalMessage",e.message,true));$("skillSearch").oninput=renderSkillLists;
document.querySelectorAll("[data-view]").forEach(t=>t.onclick=()=>activateView(t.dataset.view));document.querySelectorAll("[data-go]").forEach(t=>t.onclick=()=>activateView(t.dataset.go));
(async()=>{const {data:{session}}=await db.auth.getSession();setScreen(!!session);if(session){try{await loadAll()}catch(e){showMessage("globalMessage",e.message||"تعذر تحميل بيانات الحساب.",true)}}})();