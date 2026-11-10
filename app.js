const SUPABASE_URL="https://lkofveroqcrfehczdlkl.supabase.co";
const SUPABASE_KEY="sb_publishable_CuQEm5GvRbWb56hmRqkhUg_nvK0XObm";
const API=SUPABASE_URL+"/functions/v1/midaan-api";
const db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
const $=id=>document.getElementById(id);
let mode="login",organizations=[],allSkills=[],categories=[],faultReports=[],machines=[],maintenanceTasks=[],currentUserId=null;
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
async function loadAll(){const {data:{user}}=await db.auth.getUser();currentUserId=user?.id||null;$("userEmail").textContent=user?.email||"";const orgData=await api("my_organizations");organizations=(orgData||[]).map(x=>({...x.organizations,memberRole:x.role})).filter(x=>x.id);const cat=await db.from("categories").select("id,slug,name_ar").eq("is_active",true).order("sort_order");if(cat.error)throw cat.error;categories=cat.data||[];renderOrganizations();renderOrgSelects();renderCategories();await loadSettings();await Promise.all([loadSkills(),loadMachines(),loadFaultReports()]);await loadMaintenance();await loadMarketplace();}
function renderOrganizations(){const target=$("orgList");target.innerHTML=organizations.length?organizations.map(o=>'<div class="item"><div class="item-head"><div><h3>'+escapeHtml(o.name)+'</h3><div class="tiny">'+escapeHtml(o.industry||"حقن البلاستيك")+' · '+escapeHtml(o.country_code||"EG")+'</div></div><span class="pill green">نشطة</span></div></div>').join(""):'<div class="empty">لا توجد منشآت بعد. أنشئ منشأتك الأولى من النموذج المجاور.</div>';$("statOrgs").textContent=organizations.length}
function renderOrgSelects(){["skillOrg","machineOrg","faultOrg","maintenanceOrg","maintenanceListOrg"].forEach(id=>{const s=$(id);if(!s)return;const old=s.value;s.innerHTML=organizations.map(o=>'<option value="'+o.id+'">'+escapeHtml(o.name)+'</option>').join("");if(old&&organizations.some(o=>o.id===old))s.value=old});if($("faultOrg")&&organizations.length)loadFaultMachines().catch(e=>showMessage("globalMessage",e.message,true))}
function renderCategories(){$("skillCategory").innerHTML='<option value="">بدون تصنيف</option>'+categories.map(c=>'<option value="'+c.id+'">'+escapeHtml(c.name_ar)+'</option>').join("")}
async function loadSkills(){const orgId=$("skillOrg").value;const list=$("skillList"),recent=$("recentSkills");if(!orgId){allSkills=[];list.innerHTML='<div class="empty">أنشئ منشأة أولًا ثم ابدأ توثيق المهارات.</div>';recent.innerHTML='<div class="empty">أضف منشأة لتبدأ.</div>';updateStats();return}const {data,error}=await db.from("skills").select("id,title,summary,status,safety_level,created_at,task_type,categories(name_ar),skill_media(id,storage_path,media_type,caption),skill_steps(id,step_number,instruction,expected_result)").eq("organization_id",orgId).order("created_at",{ascending:false});if(error)throw error;allSkills=await Promise.all((data||[]).map(async s=>{const media=await Promise.all((s.skill_media||[]).map(async m=>{const {data:signed,error:signError}=await db.storage.from("skill-evidence").createSignedUrl(m.storage_path,3600);return {...m,url:signError?null:signed?.signedUrl||null}}));return {...s,media}}));renderSkillLists();updateStats()}
function skillCard(s){const steps=(s.skill_steps||[]).slice().sort((a,b)=>a.step_number-b.step_number);const stepsHtml=steps.length?'<ol class="step-list">'+steps.map(step=>'<li>'+escapeHtml(step.instruction)+(step.expected_result?'<div class="tiny">النتيجة المتوقعة: '+escapeHtml(step.expected_result)+'</div>':'')+'</li>').join("")+'</ol>':"";const media=(s.media||[]).map(m=>{if(!m.url)return '<div class="tiny">تعذر إنشاء رابط آمن لأحد المرفقات.</div>';const url=escapeHtml(m.url),caption=escapeHtml(m.caption||"مرفق داعم");if(m.media_type==="image")return '<a href="'+url+'" target="_blank" rel="noopener noreferrer"><img src="'+url+'" alt="'+caption+'" loading="lazy" style="max-width:100%;max-height:220px;border-radius:10px;margin:8px 6px 0 0"></a>';if(m.media_type==="video")return '<video controls preload="none" style="display:block;width:100%;max-height:260px;margin-top:8px;border-radius:10px"><source src="'+url+'"></video>';return '<div class="tiny"><a href="'+url+'" target="_blank" rel="noopener noreferrer">فتح ملف PDF: '+caption+'</a></div>'}).join("");return '<div class="item"><div class="item-head"><div><h3>'+escapeHtml(s.title)+'</h3><div class="tiny">'+escapeHtml(s.categories?.name_ar||"غير مصنف")+' · '+new Date(s.created_at).toLocaleDateString("ar-EG")+'</div></div><div style="display:flex;gap:5px;flex-wrap:wrap;justify-content:end"><span class="pill '+pillClass(s.status)+'">'+statusLabel(s.status)+'</span><span class="pill">'+safetyLabel(s.safety_level)+'</span></div></div><p>'+escapeHtml(s.summary||"لا يوجد ملخص.")+'</p>'+stepsHtml+(media?'<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">'+media+'</div>':"")+'</div>'}
function renderSkillLists(){const q=$("skillSearch").value.trim().toLowerCase();const rows=allSkills.filter(s=>(s.title+" "+(s.summary||"")).toLowerCase().includes(q));$("skillList").innerHTML=rows.length?rows.map(skillCard).join(""):'<div class="empty">لا توجد نتائج مطابقة. أضف أول مهارة من النموذج.</div>';const recent=allSkills.slice(0,4);$("recentSkills").innerHTML=recent.length?recent.map(skillCard).join(""):'<div class="empty">لم تُسجّل مهارات بعد. ابدأ بتوثيق أول خبرة عملية.</div>'}
function updateStats(){$("statSkills").textContent=allSkills.length;$("statDrafts").textContent=allSkills.filter(s=>s.status==="draft").length;$("statFaults").textContent=faultReports.filter(r=>r.status==="open"||r.status==="investigating").length;$("statMaintenanceDue").textContent=maintenanceTasks.filter(t=>["scheduled","in_progress"].includes(t.status)&&new Date(t.due_at)<new Date()).length}
async function loadMachines(){const orgIds=organizations.map(o=>o.id);if(!orgIds.length){machines=[];$("machineList").innerHTML='<div class="empty">أنشئ منشأة أولًا.</div>';return}const {data,error}=await db.from("machines").select("id,organization_id,name,manufacturer,model,machine_type,created_at").in("organization_id",orgIds).order("created_at",{ascending:false});if(error)throw error;machines=data||[];const orgId=$("machineOrg").value;const rows=machines.filter(m=>m.organization_id===orgId);$("machineList").innerHTML=rows.length?rows.map(m=>'<div class="item"><div class="item-head"><div><h3>'+escapeHtml(m.name)+'</h3><div class="tiny">'+escapeHtml([m.manufacturer,m.model].filter(Boolean).join(" · ")||"بيانات إضافية غير مسجلة")+'</div></div><span class="pill">ماكينة حقن</span></div></div>').join(""):'<div class="empty">لا توجد ماكينات مسجلة لهذه المنشأة.</div>';if($("faultOrg"))await loadFaultMachines()}

let professionalProfile=null,marketOffers=[],incomingServiceRequests=[],outgoingServiceRequests=[];
const marketCategoryLabels={plastic_injection:"ماكينات حقن البلاستيك",mold_maintenance:"صيانة القوالب",hydraulic:"هيدروليك",electrical_control:"كهرباء وتحكم",mechanical:"صيانة ميكانيكية",lathe_milling:"خراطة وفرازة",spare_parts:"قطع غيار",general_maintenance:"صيانة عامة",other:"خدمات أخرى"};
const professionalTypeLabels={technician:"فني",engineer:"مهندس",service_company:"شركة خدمات صناعية"};
const requestStatusLabels={new:"جديد",accepted:"تم القبول",declined:"مرفوض",cancelled:"ملغي",completed:"مكتمل"};
function splitMarketValues(value,maxItems,maxLength){return String(value||"").split(",").map(x=>x.trim()).filter(Boolean).slice(0,maxItems).map(x=>x.slice(0,maxLength))}
function marketPriceLabel(offer){if(offer.price_type==="quote")return "السعر حسب الاتفاق";const amount=Number(offer.price_amount).toLocaleString(undefined,{maximumFractionDigits:2});return amount+" "+offer.currency_code+(offer.price_type==="hourly"?" / ساعة":"")}
function marketLocation(country,city){return [city,country].filter(Boolean).join(" · ")||"الموقع غير محدد"}
async function loadMarketplace(){
  if(!currentUserId)return;
  const {data:{user}}=await db.auth.getUser();
  const {data:profile,error:profileError}=await db.from("professional_profiles").select("user_id,display_name,professional_type,headline,country_code,city,bio,years_experience,languages,specialties,is_public").eq("user_id",currentUserId).maybeSingle();
  if(profileError)throw profileError;
  professionalProfile=profile||null;
  $("marketProfileName").value=profile?.display_name||user?.user_metadata?.display_name||"";
  $("marketProfessionalType").value=profile?.professional_type||"technician";
  $("marketHeadline").value=profile?.headline||"";
  $("marketCountryCode").value=profile?.country_code||organizations[0]?.country_code||"EG";
  $("marketCity").value=profile?.city||"";
  $("marketExperience").value=String(profile?.years_experience??0);
  $("marketBio").value=profile?.bio||"";
  $("marketLanguages").value=(profile?.languages||["ar"]).join(", ");
  $("marketSpecialties").value=(profile?.specialties||[]).join(", ");
  $("marketPublic").checked=!!profile?.is_public;
  const orgSelect=$("requestOrg"),oldOrg=orgSelect.value;
  orgSelect.innerHTML=organizations.map(o=>'<option value="'+escapeHtml(o.id)+'">'+escapeHtml(o.name)+'</option>').join("");
  if(oldOrg&&organizations.some(o=>o.id===oldOrg))orgSelect.value=oldOrg;
  const {data:offers,error:offersError}=await db.from("service_offers").select("id,provider_id,title,description,category,country_code,city,service_mode,price_type,currency_code,price_amount,status,created_at,professional_profiles(display_name,professional_type,headline,is_public)").order("created_at",{ascending:false}).limit(100);
  if(offersError)throw offersError;
  marketOffers=offers||[];
  const {data:incoming,error:incomingError}=await db.from("service_requests").select("id,offer_id,organization_id,requested_by,provider_id,organization_name,organization_country_code,message,status,created_at,service_offers(title)").eq("provider_id",currentUserId).order("created_at",{ascending:false}).limit(50);
  if(incomingError)throw incomingError;
  incomingServiceRequests=incoming||[];
  const {data:outgoing,error:outgoingError}=await db.from("service_requests").select("id,offer_id,organization_id,requested_by,provider_id,organization_name,organization_country_code,message,status,created_at,service_offers(title)").eq("requested_by",currentUserId).order("created_at",{ascending:false}).limit(50);
  if(outgoingError)throw outgoingError;
  outgoingServiceRequests=outgoing||[];
  renderMarketplace();
  renderServiceRequests();
}
function renderMarketplace(){
  const query=($("marketSearch").value||"").trim().toLowerCase();
  const category=$("marketCategoryFilter").value;
  const country=($("marketCountryFilter").value||"").trim().toUpperCase();
  const rows=marketOffers.filter(o=>{
    const p=o.professional_profiles||{};
    const searchable=[o.title,o.description,o.city,o.country_code,marketCategoryLabels[o.category],p.display_name,p.headline].join(" ").toLowerCase();
    return (o.status==="published"||o.provider_id===currentUserId)
      &&(!query||searchable.includes(query))
      &&(!category||o.category===category)
      &&(!country||o.country_code===country);
  });
  $("marketplaceList").innerHTML=rows.length?rows.map(o=>{
    const p=o.professional_profiles||{},mine=o.provider_id===currentUserId;
    const status=o.status==="published"?"منشور":o.status==="paused"?"متوقف مؤقتًا":"مسودة";
    const action=mine?'<button class="btn" data-offer-id="'+escapeHtml(o.id)+'" data-offer-status="'+(o.status==="published"?"paused":"published")+'">'+(o.status==="published"?"إيقاف العرض":"نشر العرض")+'</button>':(o.status==="published"?'<button class="btn primary" data-request-offer="'+escapeHtml(o.id)+'">طلب الخدمة</button>':"");
    return '<article class="marketplace-offer"><div class="item-head"><div><h3>'+escapeHtml(o.title)+'</h3><div class="tiny">'+escapeHtml(p.display_name||"مقدم خدمة")+' · '+escapeHtml(professionalTypeLabels[p.professional_type]||"مقدم خدمة")+'</div></div><span class="pill '+(o.status==="published"?"green":"gold")+'">'+status+'</span></div><div class="meta"><span class="pill">'+escapeHtml(marketCategoryLabels[o.category]||o.category)+'</span><span class="pill">'+escapeHtml(marketLocation(o.country_code,o.city))+'</span><span class="pill">'+(o.service_mode==="remote"?"عن بُعد":o.service_mode==="both"?"عن بُعد أو بالموقع":"في موقع العميل")+'</span><span class="pill">'+escapeHtml(marketPriceLabel(o))+'</span></div><p>'+escapeHtml(o.description)+'</p><div class="marketplace-actions">'+action+'</div></article>';
  }).join(""):'<div class="empty">لا توجد عروض مطابقة حاليًا. يمكنك تعديل البحث أو نشر أول عرض خدمة.</div>';
}
function renderServiceRequests(){
  $("incomingRequests").innerHTML=incomingServiceRequests.length?incomingServiceRequests.map(r=>{
    const action=r.status==="new"?'<button class="btn" data-request-id="'+escapeHtml(r.id)+'" data-request-status="accepted">قبول</button><button class="btn" data-request-id="'+escapeHtml(r.id)+'" data-request-status="declined">رفض</button>':r.status==="accepted"?'<button class="btn" data-request-id="'+escapeHtml(r.id)+'" data-request-status="completed">تأكيد الإكمال</button>':"";
    return '<article class="market-request"><div class="item-head"><strong>'+escapeHtml(r.organization_name||"منشأة")+'</strong><span class="pill">'+escapeHtml(requestStatusLabels[r.status]||r.status)+'</span></div><div class="tiny">'+escapeHtml(r.service_offers?.title||"خدمة صناعية")+' · '+escapeHtml(r.organization_country_code||"")+'</div><p>'+escapeHtml(r.message)+'</p><div class="marketplace-actions">'+action+'</div></article>';
  }).join(""):'<div class="empty">لا توجد طلبات واردة إلى عروضك.</div>';
  $("outgoingRequests").innerHTML=outgoingServiceRequests.length?outgoingServiceRequests.map(r=>{
    const action=r.status==="new"?'<button class="btn" data-request-id="'+escapeHtml(r.id)+'" data-request-status="cancelled">إلغاء الطلب</button>':"";
    return '<article class="market-request"><div class="item-head"><strong>'+escapeHtml(r.service_offers?.title||"خدمة صناعية")+'</strong><span class="pill">'+escapeHtml(requestStatusLabels[r.status]||r.status)+'</span></div><div class="tiny">'+new Date(r.created_at).toLocaleDateString()+'</div><p>'+escapeHtml(r.message)+'</p><div class="marketplace-actions">'+action+'</div></article>';
  }).join(""):'<div class="empty">لم ترسل طلبات خدمات بعد.</div>';
}
$("saveMarketProfile").onclick=async()=>{
  const display_name=$("marketProfileName").value.trim(),professional_type=$("marketProfessionalType").value,headline=$("marketHeadline").value.trim(),country_code=$("marketCountryCode").value.trim().toUpperCase(),city=$("marketCity").value.trim(),bio=$("marketBio").value.trim(),years_experience=Number($("marketExperience").value),languages=splitMarketValues($("marketLanguages").value,8,20),specialties=splitMarketValues($("marketSpecialties").value,12,80),is_public=$("marketPublic").checked,b=$("saveMarketProfile");
  if(display_name.length<2||headline.length<4){showMessage("marketProfileMessage","اكتب الاسم المهني والتخصص بشكل صحيح.",true);return;}
  if(!/^[A-Z]{2}$/.test(country_code)){showMessage("marketProfileMessage","رمز الدولة يجب أن يكون حرفين كبيرين مثل EG أو SA.",true);return;}
  if(!Number.isInteger(years_experience)||years_experience<0||years_experience>60){showMessage("marketProfileMessage","سنوات الخبرة يجب أن تكون من 0 إلى 60.",true);return;}
  if(!languages.length){showMessage("marketProfileMessage","أضف لغة واحدة على الأقل.",true);return;}
  b.disabled=true;
  try{
    const {error}=await db.from("professional_profiles").upsert({user_id:currentUserId,display_name,professional_type,headline,country_code,city:city||null,bio:bio||null,years_experience,languages,specialties,is_public},{onConflict:"user_id"});
    if(error)throw error;
    await loadMarketplace();
    showMessage("marketProfileMessage","تم حفظ الملف المهني.");
  }catch(e){showMessage("marketProfileMessage",e.message||"تعذر حفظ الملف المهني.",true)}
  finally{b.disabled=false}
};
$("createServiceOffer").onclick=async()=>{
  const title=$("offerTitle").value.trim(),description=$("offerDescription").value.trim(),category=$("offerCategory").value,service_mode=$("offerServiceMode").value,price_type=$("offerPriceType").value,status=$("offerStatus").value,currency_code=$("offerCurrencyCode").value.trim().toUpperCase(),priceRaw=$("offerPriceAmount").value,price_amount=priceRaw===""?null:Number(priceRaw),b=$("createServiceOffer");
  if(!professionalProfile){showMessage("offerMessage","احفظ ملفك المهني أولًا قبل إضافة عرض خدمة.",true);return;}
  if(title.length<4||description.length<20){showMessage("offerMessage","اكتب عنوانًا ووصفًا واضحًا للخدمة (20 حرفًا على الأقل).",true);return;}
  if(status==="published"&&!professionalProfile.is_public){showMessage("offerMessage","فعّل إظهار ملفك المهني أولًا حتى تتمكن من نشر العرض.",true);return;}
  if(price_type==="quote"&&(price_amount!==null||currency_code)){showMessage("offerMessage","اترك السعر والعملة فارغين عند اختيار حسب الاتفاق.",true);return;}
  if(price_type!=="quote"&&(!Number.isFinite(price_amount)||price_amount<0||!/^[A-Z]{3}$/.test(currency_code))){showMessage("offerMessage","أدخل سعرًا صحيحًا ورمز عملة من 3 أحرف مثل EGP أو SAR أو USD.",true);return;}
  b.disabled=true;
  try{
    const {error}=await db.from("service_offers").insert({provider_id:currentUserId,title,description,category,country_code:professionalProfile.country_code,city:professionalProfile.city,service_mode,price_type,currency_code:price_type==="quote"?null:currency_code,price_amount:price_type==="quote"?null:price_amount,status});
    if(error)throw error;
    $("offerTitle").value="";$("offerDescription").value="";$("offerPriceAmount").value="";$("offerCurrencyCode").value="";
    await loadMarketplace();
    showMessage("offerMessage","تم حفظ عرض الخدمة.");
  }catch(e){showMessage("offerMessage",e.message||"تعذر حفظ عرض الخدمة.",true)}
  finally{b.disabled=false}
};
$("marketplaceList").addEventListener("click",async event=>{
  const requestButton=event.target.closest("[data-request-offer]");
  if(requestButton){
    const offer=marketOffers.find(o=>o.id===requestButton.dataset.requestOffer);
    if(!offer)return;
    if(!organizations.length){showMessage("globalMessage","أنشئ منشأة أولًا حتى تتمكن من طلب خدمة باسمها.",true);return}
    $("requestOfferId").value=offer.id;
    $("requestOfferTitle").textContent="الخدمة: "+offer.title;
    $("requestOrg").value=organizations[0].id;
    $("serviceRequestPanel").classList.remove("hidden");
    $("serviceRequestPanel").scrollIntoView({behavior:"smooth",block:"start"});
    return;
  }
  const offerButton=event.target.closest("[data-offer-id][data-offer-status]");
  if(offerButton){
    offerButton.disabled=true;
    try{
      const {error}=await db.from("service_offers").update({status:offerButton.dataset.offerStatus}).eq("id",offerButton.dataset.offerId);
      if(error)throw error;
      await loadMarketplace();
      showMessage("globalMessage","تم تحديث حالة العرض.");
    }catch(e){showMessage("globalMessage",e.message||"تعذر تحديث العرض.",true)}
    finally{offerButton.disabled=false}
  }
});
$("submitServiceRequest").onclick=async()=>{
  const offer=marketOffers.find(o=>o.id===$("requestOfferId").value),organization_id=$("requestOrg").value,message=$("requestMessage").value.trim(),b=$("submitServiceRequest");
  if(!offer||!organization_id){showMessage("requestMessageStatus","اختر عرض الخدمة والمنشأة.",true);return;}
  if(message.length<10){showMessage("requestMessageStatus","اكتب تفاصيل الطلب في 10 أحرف على الأقل.",true);return;}
  b.disabled=true;
  try{
    const {error}=await db.from("service_requests").insert({offer_id:offer.id,organization_id,requested_by:currentUserId,provider_id:offer.provider_id,message});
    if(error)throw error;
    $("requestMessage").value="";$("serviceRequestPanel").classList.add("hidden");
    await loadMarketplace();
    showMessage("globalMessage","تم إرسال طلب الخدمة إلى مقدمها.");
  }catch(e){showMessage("requestMessageStatus",e.message||"تعذر إرسال الطلب.",true)}
  finally{b.disabled=false}
};
$("cancelServiceRequest").onclick=()=>{$("serviceRequestPanel").classList.add("hidden");$("requestMessage").value="";};
async function updateServiceRequestStatus(button){
  const next=button.dataset.requestStatus;
  if(!["accepted","declined","cancelled","completed"].includes(next))return;
  button.disabled=true;
  try{
    const {error}=await db.from("service_requests").update({status:next}).eq("id",button.dataset.requestId);
    if(error)throw error;
    await loadMarketplace();
    showMessage("globalMessage","تم تحديث حالة طلب الخدمة.");
  }catch(e){showMessage("globalMessage",e.message||"تعذر تحديث الطلب.",true)}
  finally{button.disabled=false}
}
$("incomingRequests").addEventListener("click",event=>{const b=event.target.closest("[data-request-id][data-request-status]");if(b)updateServiceRequestStatus(b)});
$("outgoingRequests").addEventListener("click",event=>{const b=event.target.closest("[data-request-id][data-request-status]");if(b)updateServiceRequestStatus(b)});
$("marketSearch").oninput=renderMarketplace;
$("marketCategoryFilter").onchange=renderMarketplace;
$("marketCountryFilter").oninput=renderMarketplace;

const validViews=["overview","skills","organizations","machines","maintenance","faults","marketplace","settings"];
const viewMeta={overview:["الرئيسية","نظرة سريعة على نشاطك الصناعي في مِيدان"],skills:["مكتبة المهارات","وثّق خبرات فريقك واجعلها معرفة منظمة قابلة للمراجعة"],organizations:["المنشآت","إدارة المصانع والورش المرتبطة بحسابك"],machines:["الماكينات","سجل معدات المصنع واربطها بسياق العمل"],maintenance:["الصيانة الوقائية","خطط أعمال الصيانة وتابع المواعيد والتنفيذ"],faults:["بلاغات الأعطال","سجل البلاغات الفنية وتابع الأولويات والحالات"],marketplace:["السوق الصناعي","اعرض خدماتك أو اطلب خدمة صناعية من مقدم موثوق"],settings:["إعدادات الحساب","بياناتك المهنية وتفضيلات الأمان والمظهر"]};
function activateView(name,{updateUrl=true}={}){
  if(!validViews.includes(name))name="overview";
  document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id==="view-"+name));
  document.querySelectorAll("[data-view]").forEach(t=>t.classList.toggle("active",t.dataset.view===name));
  const meta=viewMeta[name],head=document.querySelector("#view-"+name+" .page-head");
  if(head&&meta){head.innerHTML="<div><h2>"+escapeHtml(meta[0])+"</h2><p>"+escapeHtml(meta[1])+"</p></div>"}
  if(updateUrl&&location.hash!=="#"+name)history.pushState({view:name},"","#"+name);
  window.scrollTo({top:0,behavior:"smooth"});
}
window.addEventListener("popstate",()=>activateView(location.hash.slice(1),{updateUrl:false}));


function maintenanceStatusLabel(status){return ({scheduled:"مجدولة",in_progress:"قيد التنفيذ",completed:"مكتملة",cancelled:"ملغاة"})[status]||status}
function maintenancePriorityLabel(priority){return ({low:"منخفضة",medium:"متوسطة",high:"مرتفعة",critical:"حرجة"})[priority]||priority}
function maintenanceDate(value){const date=new Date(value);return Number.isNaN(date.getTime())?"موعد غير صالح":date.toLocaleString("ar-EG",{dateStyle:"medium",timeStyle:"short"})}
async function loadMaintenanceMachines(){const orgId=$("maintenanceOrg")?.value;const select=$("maintenanceMachine");if(!select)return;const rows=machines.filter(m=>m.organization_id===orgId);select.innerHTML=rows.length?rows.map(m=>'<option value="'+m.id+'">'+escapeHtml(m.name)+'</option>').join(""):'<option value="">لا توجد ماكينات بهذه المنشأة</option>';if($("maintenanceListOrg"))$("maintenanceListOrg").value=orgId||"";const role=organizations.find(o=>o.id===orgId)?.memberRole,allowed=["owner","admin","engineer"].includes(role);$("createMaintenance").disabled=!allowed;$("maintenanceCreateHint").textContent=allowed?"سيتم إسناد المهمة إلى حسابك حاليًا. إسنادها لأعضاء آخرين يتطلب تفعيل إدارة أعضاء المنشأة أولًا.":"إنشاء مهام الصيانة متاح لمالك المنشأة أو المسؤول أو المهندس فقط."}
async function loadMaintenance(){const ids=organizations.map(o=>o.id);if(!ids.length){maintenanceTasks=[];$("maintenanceList").innerHTML='<div class="empty">أنشئ منشأة وسجّل ماكينة أولًا لجدولة الصيانة.</div>';updateStats();return}const {data,error}=await db.from("maintenance_tasks").select("id,organization_id,machine_id,title,description,due_at,interval_days,recurrence_parent_id,priority,status,assigned_to,created_by,completed_at,created_at,updated_at,machines(name),organizations(name)").in("organization_id",ids).order("due_at",{ascending:true}).limit(200);if(error)throw error;maintenanceTasks=data||[];await loadMaintenanceMachines();renderMaintenance();updateStats()}
function renderMaintenance(){const filter=$("maintenanceFilter")?.value||"all",orgId=$("maintenanceListOrg")?.value||$("maintenanceOrg")?.value;const now=new Date();const rows=maintenanceTasks.filter(t=>(!orgId||t.organization_id===orgId)&&(filter==="all"||filter==="overdue"?filter==="all"||(["scheduled","in_progress"].includes(t.status)&&new Date(t.due_at)<now):t.status===filter));$("maintenanceList").innerHTML=rows.length?rows.map(t=>{const org=organizations.find(o=>o.id===t.organization_id);const manager=["owner","admin","engineer"].includes(org?.memberRole);const overdue=["scheduled","in_progress"].includes(t.status)&&new Date(t.due_at)<now;const next=t.status==="scheduled"?"in_progress":t.status==="in_progress"?"completed":null;const canUpdate=manager||t.assigned_to===currentUserId;const action=canUpdate&&next?'<button class="btn" data-maintenance-id="'+escapeHtml(t.id)+'" data-maintenance-status="'+next+'">'+(next==="in_progress"?"بدء التنفيذ":"تسجيل الإكمال")+'</button>':"";const cancel=manager&&["scheduled","in_progress"].includes(t.status)?'<button class="btn" data-maintenance-id="'+escapeHtml(t.id)+'" data-maintenance-status="cancelled">إلغاء المهمة</button>':"";return '<article class="maintenance-card '+(overdue?"overdue":"")+'"><div class="item-head"><div><h3>'+escapeHtml(t.title)+'</h3><div class="tiny">'+escapeHtml(t.organizations?.name||"منشأة")+' · '+escapeHtml(t.machines?.name||"ماكينة")+'</div></div><div class="maintenance-meta"><span class="pill '+(overdue?"red":t.status==="completed"?"green":"gold")+'">'+(overdue?"متأخرة":maintenanceStatusLabel(t.status))+'</span><span class="pill '+(t.priority==="critical"||t.priority==="high"?"red":"")+'">أولوية '+maintenancePriorityLabel(t.priority)+'</span></div></div><p>'+escapeHtml(t.description||"لا يوجد وصف إضافي.")+'</p><div class="tiny">الاستحقاق: '+maintenanceDate(t.due_at)+(t.interval_days?" · تتكرر كل "+t.interval_days+" يوم (يُنشأ الموعد التالي عند الإكمال)":"")+(t.recurrence_parent_id?" · موعد دوري متجدد":"")+'</div>'+(t.completed_at?'<div class="tiny">تاريخ الإكمال: '+maintenanceDate(t.completed_at)+'</div>':"")+(action||cancel?'<div class="form-actions" style="margin-top:10px">'+action+cancel+'</div>':"")+'</article>'}).join(""):'<div class="empty">لا توجد مهام مطابقة لهذا الاختيار.</div>'}
async function createMaintenanceTask(){const organization_id=$("maintenanceOrg").value,machine_id=$("maintenanceMachine").value,title=$("maintenanceTitle").value.trim(),description=$("maintenanceDescription").value.trim(),dueValue=$("maintenanceDue").value,intervalValue=$("maintenanceInterval").value,priority=$("maintenancePriority").value,b=$("createMaintenance");if(!organization_id)throw new Error("اختر المنشأة أولًا.");if(!machine_id||!machines.some(m=>m.id===machine_id&&m.organization_id===organization_id))throw new Error("اختر ماكينة تابعة للمنشأة المحددة.");if(title.length<4)throw new Error("عنوان المهمة يجب ألا يقل عن 4 أحرف.");if(!dueValue||Number.isNaN(new Date(dueValue).getTime()))throw new Error("حدد موعد استحقاق صحيحًا.");const interval_days=intervalValue?Number(intervalValue):null;if(interval_days!==null&&(!Number.isInteger(interval_days)||interval_days<1||interval_days>3650))throw new Error("التكرار يجب أن يكون عددًا صحيحًا من 1 إلى 3650 يومًا.");b.disabled=true;try{const {data:{user}}=await db.auth.getUser();const {error}=await db.from("maintenance_tasks").insert({organization_id,machine_id,title,description:description||null,due_at:new Date(dueValue).toISOString(),interval_days,priority,assigned_to:user.id,created_by:user.id});if(error)throw error;$("maintenanceTitle").value="";$("maintenanceDescription").value="";$("maintenanceDue").value="";$("maintenanceInterval").value="";await loadMaintenance();showMessage("globalMessage","تمت جدولة مهمة الصيانة بنجاح.");}finally{b.disabled=false}}
async function updateMaintenanceTask(id,status,button){const task=maintenanceTasks.find(t=>t.id===id);if(!task)return;const allowed=["scheduled","in_progress"].includes(task.status)&&["in_progress","completed","cancelled"].includes(status);if(!allowed)throw new Error("انتقال حالة المهمة غير مسموح.");const org=organizations.find(o=>o.id===task.organization_id),manager=["owner","admin","engineer"].includes(org?.memberRole);if(!manager&&task.assigned_to!==currentUserId)throw new Error("ليس لديك صلاحية تحديث هذه المهمة.");button.disabled=true;try{const now=new Date().toISOString();const patch={status,updated_at:now,completed_at:status==="completed"?now:null};const {error}=await db.from("maintenance_tasks").update(patch).eq("id",id);if(error)throw error;await loadMaintenance();showMessage("globalMessage",status==="completed"&&task.interval_days?"تم إكمال المهمة وإنشاء موعد الصيانة الدوري التالي تلقائيًا.":"تم تحديث حالة مهمة الصيانة.");}finally{button.disabled=false}}
$("maintenanceOrg").onchange=async()=>{await loadMaintenanceMachines();$("maintenanceListOrg").value=$("maintenanceOrg").value;renderMaintenance()};
$("maintenanceListOrg").onchange=renderMaintenance;
$("maintenanceFilter").onchange=renderMaintenance;
$("createMaintenance").onclick=()=>createMaintenanceTask().catch(e=>showMessage("globalMessage",e.message||"تعذر جدولة الصيانة.",true));
$("maintenanceList").addEventListener("click",event=>{const button=event.target.closest("[data-maintenance-id][data-maintenance-status]");if(button)updateMaintenanceTask(button.dataset.maintenanceId,button.dataset.maintenanceStatus,button).catch(e=>showMessage("globalMessage",e.message||"تعذر تحديث المهمة.",true))});

function reportStatusLabel(status){return ({open:"مفتوح",investigating:"قيد الفحص",resolved:"تم الحل",closed:"مغلق"})[status]||status}
function reportSeverityLabel(severity){return ({low:"منخفضة",medium:"متوسطة",high:"مرتفعة",critical:"حرجة"})[severity]||severity}
async function loadFaultMachines(){const orgId=$("faultOrg")?.value;const select=$("faultMachine");if(!select)return;const rows=machines.filter(m=>m.organization_id===orgId);select.innerHTML='<option value="">بدون ماكينة محددة</option>'+rows.map(m=>'<option value="'+m.id+'">'+escapeHtml(m.name)+'</option>').join("")}
async function loadFaultReports(){const ids=organizations.map(o=>o.id);const list=$("faultList");if(!ids.length){faultReports=[];list.innerHTML='<div class="empty">أنشئ منشأة أولًا لتسجيل ومتابعة الأعطال.</div>';updateStats();return}const {data,error}=await db.from("fault_reports").select("id,organization_id,machine_id,reported_by,title,description,severity,status,created_at,organizations(name),machines(name)").in("organization_id",ids).order("created_at",{ascending:false}).limit(100);if(error)throw error;faultReports=data||[];renderFaultReports();updateStats()}
function renderFaultReports(){const filter=$("faultFilter")?.value||"all";const rows=faultReports.filter(r=>filter==="all"||r.status===filter);$("faultList").innerHTML=rows.length?rows.map(r=>{const org=organizations.find(o=>o.id===r.organization_id);const canManage=r.reported_by===currentUserId||["owner","admin","engineer"].includes(org?.memberRole);const nextStatus=r.status==="open"?"investigating":r.status==="investigating"?"resolved":null;const action=canManage&&nextStatus?'<button class="btn" data-report-id="'+escapeHtml(r.id)+'" data-report-status="'+nextStatus+'">'+(nextStatus==="investigating"?"بدء الفحص":"تأكيد الحل")+'</button>':"";return '<article class="report-card"><div class="item-head"><div><h3>'+escapeHtml(r.title)+'</h3><div class="tiny">'+escapeHtml(r.organizations?.name||"منشأة")+' · '+escapeHtml(r.machines?.name||"بدون ماكينة محددة")+' · '+new Date(r.created_at).toLocaleString("ar-EG")+'</div></div><div class="report-meta"><span class="pill '+(r.severity==="critical"||r.severity==="high"?"red":"gold")+'">'+reportSeverityLabel(r.severity)+'</span><span class="pill '+(r.status==="resolved"||r.status==="closed"?"green":"gold")+'">'+reportStatusLabel(r.status)+'</span></div></div><p>'+escapeHtml(r.description)+'</p>'+(action?'<div class="form-actions">'+action+'</div>':"")+'</article>'}).join(""):'<div class="empty">لا توجد بلاغات في هذا التصنيف.</div>'}
async function loadSettings(){const {data:{user}}=await db.auth.getUser();$("profileEmail").value=user?.email||"";$("profileName").value=user?.user_metadata?.display_name||"";applyTheme(localStorage.getItem("midaan-theme")==="dark")}
function applyTheme(dark){document.documentElement.classList.toggle("theme-dark",!!dark);const button=$("themeToggle");if(button){button.textContent=dark?"تفعيل الوضع الفاتح":"تفعيل الوضع الداكن";button.setAttribute("aria-pressed",String(!!dark))}}
async function submitFaultReport(){const organization_id=$("faultOrg").value,title=$("faultTitle").value.trim(),description=$("faultDescription").value.trim(),severity=$("faultSeverity").value,machine_id=$("faultMachine").value||null,b=$("createFaultReport");if(!organization_id)throw new Error("أنشئ منشأة أو اختر منشأة أولًا.");if(title.length<4)throw new Error("عنوان البلاغ يجب أن يكون 4 أحرف على الأقل.");if(description.length<10)throw new Error("اكتب وصفًا واضحًا للعطل لا يقل عن 10 أحرف.");b.disabled=true;try{const {data:{user}}=await db.auth.getUser();const {error}=await db.from("fault_reports").insert({organization_id,machine_id,reported_by:user.id,title,description,severity});if(error)throw error;$("faultTitle").value="";$("faultDescription").value="";await loadFaultReports();showMessage("globalMessage","تم تسجيل البلاغ بنجاح.");}finally{b.disabled=false}}
$("faultOrg").onchange=loadFaultMachines;
$("faultFilter").onchange=renderFaultReports;
$("faultList").addEventListener("click",async event=>{const button=event.target.closest("[data-report-id][data-report-status]");if(!button)return;button.disabled=true;try{const {error}=await db.from("fault_reports").update({status:button.dataset.reportStatus}).eq("id",button.dataset.reportId);if(error)throw error;await loadFaultReports();showMessage("globalMessage","تم تحديث حالة البلاغ.");}catch(e){showMessage("globalMessage",e.message||"تعذر تحديث حالة البلاغ.",true);}finally{button.disabled=false}});
$("createFaultReport").onclick=()=>submitFaultReport().catch(e=>showMessage("globalMessage",e.message||"تعذر إرسال البلاغ.",true));
$("saveProfile").onclick=async()=>{const name=$("profileName").value.trim(),b=$("saveProfile");if(name.length<2){showMessage("profileMessage","اكتب اسمًا ظاهرًا صحيحًا.",true);return}b.disabled=true;try{const {error}=await db.auth.updateUser({data:{display_name:name}});if(error)throw error;showMessage("profileMessage","تم تحديث بيانات الملف المهني.");}catch(e){showMessage("profileMessage",e.message||"تعذر تحديث الملف.",true)}finally{b.disabled=false}};
$("changePassword").onclick=async()=>{const password=$("settingsPassword").value,confirm=$("settingsPasswordConfirm").value,b=$("changePassword");if(password.length<12){showMessage("settingsMessage","كلمة المرور يجب ألا تقل عن 12 حرفًا.",true);return}if(password!==confirm){showMessage("settingsMessage","كلمتا المرور غير متطابقتين.",true);return}b.disabled=true;try{if(await isCompromisedPassword(password))throw new Error("كلمة المرور دي ظهرت في تسريبات معروفة. اختار كلمة مختلفة.");const {error}=await db.auth.updateUser({password});if(error)throw error;$("settingsPassword").value="";$("settingsPasswordConfirm").value="";showMessage("settingsMessage","تم تحديث كلمة المرور بنجاح.");}catch(e){showMessage("settingsMessage",e.message||"تعذر تحديث كلمة المرور.",true)}finally{b.disabled=false}};
$("themeToggle").onclick=()=>{const dark=!document.documentElement.classList.contains("theme-dark");localStorage.setItem("midaan-theme",dark?"dark":"light");applyTheme(dark)};
$("settingsSignOut").onclick=()=>$("signOut").click();
if("serviceWorker" in navigator && location.protocol==="https:"){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}))}

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
(async()=>{const {data:{session}}=await db.auth.getSession();setScreen(!!session);if(session){try{await loadAll();activateView(location.hash.slice(1)||"overview",{updateUrl:false})}catch(e){showMessage("globalMessage",e.message||"تعذر تحميل بيانات الحساب.",true)}}})();