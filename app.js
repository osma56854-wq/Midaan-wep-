const SUPABASE_URL="https://lkofveroqcrfehczdlkl.supabase.co";
const SUPABASE_KEY="sb_publishable_CuQEm5GvRbWb56hmRqkhUg_nvK0XObm";
const API=SUPABASE_URL+"/functions/v1/midaan-api";
const db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
const $=id=>document.getElementById(id);

const i18n={"شبكة المعرفة والمهارات الصناعية":"Industrial knowledge & skills network","أهلاً بك في مِيدان":"Welcome to MIDAAN","سجّل دخولك للوصول إلى مساحة العمل الصناعية.":"Sign in to access your industrial workspace.","تسجيل الدخول":"Sign in","إنشاء حساب":"Create account","الاسم الظاهر":"Display name","البريد الإلكتروني":"Email address","كلمة المرور":"Password","دخول":"Sign in","نسيت كلمة المرور؟":"Forgot password?","تعيين كلمة مرور جديدة":"Set a new password","كلمة المرور الجديدة":"New password","تأكيد كلمة المرور":"Confirm password","حفظ كلمة المرور الجديدة":"Save new password","بإنشاء الحساب، أنت توافق على استخدام مِيدان لتوثيق الخبرات المهنية. لا تُعامل المسودات كتعليمات سلامة معتمدة. عند التسجيل أو تغيير كلمة المرور، نفحصها ضد كلمات المرور المسربة بطريقة لا ترسل كلمة المرور نفسها.":"By creating an account, you agree to use MIDAAN to document professional experience. Drafts are not approved safety instructions. Passwords are checked against known breaches without sending the password itself.","المعرفة الصناعية تبدأ من أرض المصنع":"Industrial knowledge starts on the factory floor","تسجيل الخروج":"Sign out","مساحة العمل":"Workspace","الرئيسية":"Overview","مكتبة المهارات":"Skills library","المنشآت":"Organizations","الماكينات":"Machines","الصيانة الوقائية":"Preventive maintenance","بلاغات الأعطال":"Fault reports","السوق الصناعي":"Service marketplace","طلبات عروض الأسعار":"Requests for quotation","الإعدادات":"Settings","إدارة المنصة":"Platform management","تظهر هنا الخدمات المتاحة لحسابك. الأقسام غير المفعّلة لن تعرض وظائف وهمية.":"Available services appear here. Disabled sections will not show fake functionality.","مساحة العمل الصناعية · النسخة التجريبية":"Industrial workspace · Preview","حوّل الخبرة إلى":"Turn experience into","معرفة يمكن الرجوع إليها.":"Knowledge you can reuse.","وثّق المهارات والإجراءات، اربطها بالمنشأة والماكينة، واحتفظ بخبرة فريقك في مكان منظم وقابل للمراجعة.":"Document skills and procedures, link them to factories and machines, and keep your team's knowledge organized and reviewable.","مِيدان":"MIDAAN","المنشآت المرتبطة بحسابك":"Organizations linked to your account","المهارات المسجلة":"Recorded skills","مسودات قيد التطوير":"Drafts in progress","مهام صيانة متأخرة":"Overdue maintenance tasks","آخر المهارات المضافة":"Recently added skills","جاري تحميل البيانات...":"Loading data...","ابدأ من هنا":"Start here","أفضل بداية هي إنشاء منشأتك، ثم إضافة الماكينات، وبعدها توثيق المهارات خطوة بخطوة.":"Start by creating your organization, adding machines, then documenting skills step by step.","+ إضافة منشأة":"+ Add organization","+ توثيق مهارة":"+ Document a skill","مجالات البداية: صيانة القوالب، دوائر التبريد، ماكينات الحقن، فحص الجودة، وتشخيص الأعطال.":"Start with mold maintenance, cooling circuits, injection machines, quality inspection, and fault diagnosis.","خطط الصيانة القادمة وتابع المتأخر منها.":"Plan upcoming maintenance and track overdue work.","فتح جدول الصيانة":"Open maintenance schedule","بلاغات الأعطال المفتوحة":"Open fault reports","تابع البلاغات التي تحتاج إلى فحص داخل منشآتك.":"Track reports that need inspection at your facilities.","فتح مركز البلاغات":"Open fault center","مبدأ مِيدان للسلامة":"MIDAAN safety principle","المحتوى الذي يضيفه المستخدم يُحفظ كمسودة، ولا يصبح إجراءً معتمدًا بمجرد نشره. يجب مراجعة أي إجراء يؤثر على سلامة العامل أو الماكينة بواسطة شخص مختص قبل تطبيقه.":"User-submitted content is saved as a draft and is not approved simply by publishing. Any procedure affecting worker or machine safety must be reviewed by a qualified person before use.","وثّق خبرات فريقك واجعلها معرفة منظمة قابلة للمراجعة":"Document team expertise as organized, reviewable knowledge","المنشأة":"Organization","بحث في المهارات":"Search skills","لا توجد مهارات بعد.":"No skills yet.","توثيق مهارة جديدة":"Document a new skill","عنوان المهارة *":"Skill title *","التصنيف":"Category","بدون تصنيف":"Uncategorized","نوع العمل":"Work type","صيانة":"Maintenance","تركيب وفك":"Assembly & disassembly","فحص":"Inspection","تشخيص عطل":"Fault diagnosis","تشغيل / إعداد":"Operation / setup","مستوى الخطورة التقديري":"Estimated risk level","عادي":"Normal","يحتاج احتياط":"Caution required","مرتفع":"High","حرج":"Critical","ملخص الخبرة":"Experience summary","خطوات التنفيذ (كل خطوة في سطر منفصل)":"Procedure steps (one per line)","صور أو فيديو أو PDF داعم (اختياري، حتى 5 ملفات، 25 ميجابايت للملف)":"Supporting images, video or PDF (optional, up to 5 files, 25 MB each)","لا تكتب خطوات خطرة قبل مراجعتها من مسؤول السلامة أو المهندس المختص.":"Do not enter hazardous steps before review by a safety officer or qualified engineer.","حفظ كمسودة":"Save as draft","إدارة المصانع والورش المرتبطة بحسابك":"Manage factories and workshops linked to your account","منشآتي":"My organizations","لا توجد منشآت مرتبطة بالحساب.":"No organizations linked to this account.","إضافة منشأة":"Add organization","اسم المصنع أو الورشة *":"Factory or workshop name *","إنشاء المنشأة":"Create organization","ستصبح مالك المنشأة الأولى ويمكنك تنظيم مهاراتها وماكيناتها من حسابك.":"You will own your first organization and can manage its skills and machines.","سجل معدات المصنع واربطها بسياق العمل":"Register factory equipment and link it to work","الماكينات المسجلة":"Registered machines","لا توجد ماكينات مسجلة.":"No machines registered.","إضافة ماكينة":"Add machine","اسم الماكينة *":"Machine name *","الشركة المصنعة":"Manufacturer","الموديل":"Model","حفظ الماكينة":"Save machine","خطط أعمال الصيانة للماكينات وتابع المواعيد والتنفيذ داخل كل منشأة.":"Plan machine maintenance and track due dates and completion at each facility.","جدول الصيانة":"Maintenance schedule","المهام مرتبة حسب موعد الاستحقاق.":"Tasks sorted by due date.","كل الحالات":"All statuses","مجدولة":"Scheduled","قيد التنفيذ":"In progress","مكتملة":"Completed","ملغاة":"Cancelled","متأخرة":"Overdue","جاري تحميل مهام الصيانة...":"Loading maintenance tasks...","جدولة مهمة صيانة":"Schedule maintenance task","الماكينة *":"Machine *","عنوان المهمة *":"Task title *","وصف ونطاق العمل":"Work description and scope","موعد الاستحقاق *":"Due date *","تكرار المهمة بالأيام (اختياري)":"Repeat interval in days (optional)","الأولوية":"Priority","منخفضة":"Low","متوسطة":"Medium","مرتفعة":"High","حرجة":"Critical","حفظ جدول الصيانة":"Save maintenance task","سيتم إسناد المهمة إلى حسابك حاليًا. إسنادها لأعضاء آخرين يتطلب تفعيل إدارة أعضاء المنشأة أولًا.":"The task will be assigned to your account for now. Assigning it to other members requires organization member management.","هذه أداة تنظيمية ولا تستبدل تعليمات الشركة المصنعة أو إجراءات العزل والسلامة المعتمدة.":"This is an organizational tool, not a replacement for manufacturer instructions or approved isolation and safety procedures.","مركز بلاغات الأعطال":"Fault report center","سجّل الأعطال واربطها بالماكينات وتابع حالتها داخل منشآتك.":"Record faults, link them to machines, and track their status at your facilities.","سجل البلاغات":"Report log","البلاغات مرئية فقط لأعضاء المنشأة المصرح لهم.":"Reports are visible only to authorized organization members.","مفتوحة":"Open","قيد الفحص":"Under investigation","تم الحل":"Resolved","مغلقة":"Closed","جاري تحميل البلاغات...":"Loading reports...","تسجيل بلاغ جديد":"Create a new report","الماكينة (اختياري)":"Machine (optional)","بدون ماكينة محددة":"No specific machine","عنوان العطل *":"Fault title *","وصف العطل *":"Fault description *","إرسال البلاغ":"Submit report","في الحالات الحرجة، اتبع خطة الطوارئ المعتمدة بالمصنع ولا تعتمد على التطبيق كبديل للاستجابة الفورية.":"For critical incidents, follow the factory emergency plan. Do not use this app as a substitute for immediate response.","اعرض خدماتك المهنية أو ابحث عن فني ومهندس وشركة صيانة في أي دولة.":"List your professional services or find technicians, engineers, and maintenance companies worldwide.","عروض الخدمات الصناعية":"Industrial service listings","بحث":"Search","كل التخصصات":"All specialties","ماكينات حقن البلاستيك":"Plastic injection machines","صيانة القوالب":"Mold maintenance","هيدروليك":"Hydraulics","كهرباء وتحكم":"Electrical & controls","صيانة ميكانيكية":"Mechanical maintenance","خراطة وفرازة":"Turning & milling","قطع غيار":"Spare parts","صيانة عامة":"General maintenance","خدمات أخرى":"Other services","الدولة (رمز ISO)":"Country (ISO code)","جاري تحميل عروض الخدمات...":"Loading service listings...","ملفي المهني":"My professional profile","البيانات هنا مهنية فقط. لن نعرض بريدك الإلكتروني أو بيانات دخولك في السوق.":"Only professional information is shown here. Your email and sign-in details are not displayed in the marketplace.","الاسم المهني *":"Professional name *","نوع الحساب المهني":"Professional account type","فني":"Technician","مهندس":"Engineer","شركة خدمات صناعية":"Industrial service company","التخصص أو المسمى *":"Specialty or title *","رمز الدولة":"Country code","المدينة":"City","سنوات الخبرة":"Years of experience","نبذة مهنية":"Professional bio","اللغات (افصل بينها بفاصلة)":"Languages (comma separated)","التخصصات (افصل بينها بفاصلة)":"Specialties (comma separated)","إظهار ملفي المهني في السوق للمستخدمين المسجلين":"Show my professional profile to signed-in marketplace users","حفظ الملف المهني":"Save professional profile","إضافة عرض خدمة":"Add a service listing","عنوان الخدمة *":"Service title *","وصف الخدمة *":"Service description *","طريقة تقديم الخدمة":"Service delivery","في موقع العميل":"On-site","عن بُعد":"Remote","الاثنان":"Both","التسعير":"Pricing","حسب الاتفاق":"Request a quote","سعر ثابت":"Fixed price","بالساعة":"Hourly","السعر (اختياري)":"Price (optional)","العملة (ISO)":"Currency (ISO)","حالة العرض":"Listing status","نشر في السوق":"Publish","حفظ عرض الخدمة":"Save service listing","إرسال طلب خدمة":"Request a service","المنشأة التي تطلب الخدمة":"Requesting organization","تفاصيل احتياج المصنع *":"Factory requirements *","إرسال الطلب":"Send request","إلغاء":"Cancel","الطلبات الواردة إليّ":"Incoming requests","لا توجد طلبات واردة.":"No incoming requests.","الطلبات التي أرسلتها":"Requests I sent","لم ترسل طلبات بعد.":"You have not sent any requests yet.","إعدادات الحساب":"Account settings","إدارة بياناتك الأساسية وتفضيلات واجهة مِيدان.":"Manage your account details and MIDAAN preferences.","الملف المهني":"Professional profile","حفظ بيانات الملف":"Save profile","المظهر":"Appearance","اختر المظهر المريح لك. يتم حفظ اختيارك على هذا الجهاز فقط.":"Choose your preferred appearance. Your choice is saved on this device.","تفعيل الوضع الداكن":"Enable dark mode","تفعيل الوضع الفاتح":"Enable light mode","الجلسة":"Session","يمكنك إنهاء الجلسة من أي جهاز باستخدام تسجيل الخروج.":"You can end your session on this device by signing out.","تغيير كلمة المرور":"Change password","تحديث كلمة المرور":"Update password","لا تشارك كلمة المرور مع أي شخص. يجب تفعيل حماية كلمات المرور المسربة من إعدادات Auth في Supabase أيضًا؛ فالفحص داخل الواجهة طبقة مساعدة فقط.":"Never share your password. Also enable leaked-password protection in Supabase Auth; the in-app check is only an additional layer.","مِيدان MIDAAN · نسخة تجريبية قيد التطوير · لا تعتمد أي محتوى فني أو إجراء سلامة دون مراجعة واعتماد مختص.":"MIDAAN · Development preview · Do not rely on technical or safety procedures without qualified review and approval.","طلبات مفتوحة من السوق":"Open requests from the market","تصفح الاحتياجات الصناعية المنشورة وقدم عرضك المناسب.":"Browse published industrial needs and submit a suitable quote.","تحديث":"Refresh","انشر احتياج مصنعك":"Post your factory requirement","اكتب المواصفات بوضوح لتسهيل وصول عروض مناسبة. لا تضع بيانات سرية أو رسومات ملكية في وصف عام.":"Describe the specifications clearly so suppliers can respond accurately. Do not place confidential data or proprietary drawings in a public description.","عنوان الاحتياج *":"Requirement title *","المواصفات والتفاصيل *":"Specifications and details *","الكمية (اختياري)":"Quantity (optional)","وحدة القياس":"Unit of measure","موعد الاحتياج (اختياري)":"Needed by (optional)","نشر طلب عروض الأسعار":"Publish RFQ","عروضي المرسلة":"My submitted quotes","تقديم عرض سعر":"Submit a quote","السعر *":"Price *","مدة التنفيذ بالأيام":"Lead time in days","تفاصيل العرض *":"Quote details *","إرسال العرض":"Submit quote","لم تقدم عروضًا بعد.":"You have not submitted any quotes yet."};
const i18nAttrs={"اسمك أو اسمك المهني":"Your name or professional name","12 حرفًا على الأقل":"At least 12 characters","اكتبها مرة أخرى":"Type it again","التنقل الرئيسي":"Main navigation","ابحث بالعنوان أو الوصف...":"Search by title or description...","مثال: تنظيف مجاري تبريد القالب":"Example: Clean mold cooling channels","ما المشكلة أو المهمة؟ ومتى تُستخدم هذه المهارة؟":"What problem or task does this skill address, and when is it used?","مثال: مصنع النيل للبلاستيك":"Example: Nile Plastic Factory","مثال: ماكينة حقن رقم 3":"Example: Injection machine No. 3","تصفية مهام الصيانة":"Filter maintenance tasks","مثال: فحص وتنظيف دوائر تبريد القالب":"Example: Inspect and clean mold cooling circuits","اكتب نطاق الفحص أو الصيانة والملاحظات المطلوبة.":"Describe the inspection or maintenance scope and required notes.","تصفية البلاغات":"Filter fault reports","مثال: ارتفاع حرارة زيت الهيدروليك":"Example: Hydraulic oil overheating","اكتب الأعراض ووقت ظهورها وما تم ملاحظته دون تنفيذ إجراء خطر.":"Describe symptoms, timing, and observations without performing hazardous actions.","ابحث عن خدمة أو تخصص أو مدينة":"Search for a service, specialty, or city","اسمك أو اسم الشركة":"Your name or company","مثال: فني صيانة قوالب حقن البلاستيك":"Example: Plastic injection mold maintenance technician","خبراتك ومجالات العمل التي تتقنها...":"Your experience and areas of expertise...","حقن البلاستيك, صيانة القوالب":"Plastic injection, mold maintenance","مثال: صيانة قوالب حقن البلاستيك":"Example: Plastic injection mold maintenance","اشرح نطاق الخدمة وخبرتك وما الذي سيحصل عليه المصنع.":"Describe the service scope, your experience, and the factory deliverables.","اشرح المشكلة أو الخدمة المطلوبة وموعد الاحتياج...":"Describe the required service and target date...","اسمك المهني":"Your professional name","أعد كتابة كلمة المرور":"Re-enter your password","ابحث في الطلبات الصناعية":"Search industrial requests","مثال: توريد خامة PP لخط إنتاج":"Example: Supply PP resin for a production line","المواصفات الفنية، الكمية، الجودة المطلوبة، شروط التسليم...":"Technical specs, quantity, required quality, delivery terms...","قطعة / كجم / ساعة":"Piece / kg / hour","EGP / SAR / USD":"EGP / SAR / USD","نطاق العرض، الاستثناءات، الضمان، مدة صلاحية السعر...":"Scope, exclusions, warranty, quote validity..."};
Object.assign(i18n,{"فريق المنشأة":"Organization team","أضف الفنيين والمهندسين والمراجعين، ونظّم صلاحياتهم ومهامهم داخل المصنع.":"Invite technicians, engineers and reviewers, and organize their access and tasks at your facility.","أعضاء الفريق":"Team members","جاري تحميل أعضاء الفريق...":"Loading team members...","الدعوات المعلقة":"Pending invitations","لا توجد دعوات معلقة.":"No pending invitations.","دعوة عضو جديد":"Invite a new member","اكتب البريد الإلكتروني الذي سيُسجل به العضو. أنشئ رمز دعوة آمنًا ثم أرسله له بنفسك عبر قناة موثوقة. الرمز صالح لمدة 7 أيام ويُستخدم مرة واحدة.":"Enter the email address the member will use to sign in. Generate a secure invitation token and share it through a trusted channel. The token expires in 7 days and can only be used once.","البريد الإلكتروني *":"Email address *","الدور":"Role","فني":"Technician","مهندس":"Engineer","مراجع":"Reviewer","إنشاء دعوة":"Create invitation","رمز الدعوة — أرسله للعضو":"Invitation token — share with the member","نسخ رمز الدعوة":"Copy invitation token","لديك رمز دعوة؟":"Have an invitation token?","سجّل الدخول بالحساب الذي استقبل الدعوة، ثم أدخل الرمز هنا. يجب أن يطابق بريد حسابك البريد الذي أُرسلت إليه الدعوة.":"Sign in with the account that received the invitation, then enter the token. Your account email must match the invited email address.","رمز الدعوة":"Invitation token","ألصق الرمز المكوّن من 64 حرفًا":"Paste the 64-character token","قبول الدعوة والانضمام":"Accept invitation and join","إسناد المهمة إلى عضو الفريق":"Assign task to a team member","اختر عضوًا نشطًا من فريق المنشأة لتنفيذ المهمة.":"Choose an active team member to perform this task.","نسخ":"Copy","نشط":"Active","موقوف":"Suspended","مالك":"Owner","مسؤول":"Admin","تنتهي":"Expires","إلغاء الدعوة":"Revoke invitation","لا يوجد أعضاء في هذه المنشأة.":"No members in this organization.","أنت":"You"});
Object.assign(i18n,{"كتالوج المنتجات الصناعية":"Industrial product catalog","اعرض الخامات وقطع الغيار والقوالب والماكينات والأدوات أمام المصانع والمشترين.":"List raw materials, spare parts, molds, machinery and tools for factories and buyers.","المنتجات المعروضة":"Listed products","ابحث حسب المنتج أو التخصص أو الدولة.":"Search by product, category or country.","اسم المنتج أو الشركة المصنعة أو SKU":"Product name, manufacturer or SKU","الفئة":"Category","كل الفئات":"All categories","خامات البلاستيك":"Plastic resins","قطع غيار":"Spare parts","قوالب":"Molds","ماكينات":"Machinery","عدد وأدوات":"Tools","تغليف":"Packaging","جاري تحميل المنتجات...":"Loading products...","أضف منتجًا إلى الكتالوج":"Add a product to the catalog","يجب حفظ ملفك المهني أولًا. النشر العام يتطلب تفعيل إظهار الملف المهني.":"Save your professional profile first. Public listings require your profile to be public.","اسم المنتج *":"Product name *","الوصف والمواصفات *":"Description and specifications *","اكتب المواصفات الفنية، الاستخدام، الدرجة، الحالة، والقيود...":"Describe technical specs, use, grade, condition and limitations...","رقم الصنف / SKU":"SKU / Part number","الحالة":"Condition","جديد":"New","مستعمل":"Used","مجدد":"Refurbished","مدة التوريد بالأيام":"Lead time in days","الحد الأدنى للطلب":"Minimum order quantity","الوحدة":"Unit","السعر":"Price","حسب طلب عرض السعر":"Request a quote","سعر ثابت":"Fixed price","المبلغ":"Amount","العملة":"Currency","رمز الدولة":"Country code","صورة المنتج (JPG / PNG / WebP، حتى 5MB)":"Product image (JPG / PNG / WebP, up to 5 MB)","حالة العرض":"Listing status","مسودة":"Draft","نشر في الكتالوج":"Publish in catalog","حفظ المنتج":"Save product","تحديث":"Refresh","طلب عرض سعر لهذا المنتج":"Request a quote for this product","منشور":"Published","متوقف":"Paused","الحد الأدنى":"Minimum order","مدة التوريد":"Lead time"});
let currentLanguage=localStorage.getItem("midaan-language")==="en"?"en":"ar";
function translateNodeText(value){
 const trimmed=value.trim();
 if(currentLanguage==="en"&&i18n[trimmed])return value.replace(trimmed,i18n[trimmed]);
 if(currentLanguage==="ar"){
  const reverse=i18nReverse[trimmed];
  if(reverse)return value.replace(trimmed,reverse);
 }
 return value;
}
const i18nReverse=Object.fromEntries(Object.entries(i18n).map(([ar,en])=>[en,ar]));
const i18nAttrReverse=Object.fromEntries(Object.entries(i18nAttrs).map(([ar,en])=>[en,ar]));
function applyLanguage(root=document){
 document.documentElement.lang=currentLanguage;
 document.documentElement.dir=currentLanguage==="ar"?"rtl":"ltr";
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 let node;
 while((node=walker.nextNode())){
  const parent=node.parentElement;
  if(!parent||["SCRIPT","STYLE","NOSCRIPT"].includes(parent.tagName))continue;
  const translated=translateNodeText(node.nodeValue);
  if(translated!==node.nodeValue)node.nodeValue=translated;
 }
 root.querySelectorAll?.("[placeholder],[aria-label],[title]").forEach(el=>{
  for(const attr of ["placeholder","aria-label","title"]){
   const val=el.getAttribute(attr);if(!val)continue;
   const next=currentLanguage==="en"?(i18nAttrs[val]||val):(i18nAttrReverse[val]||val);
   if(next!==val)el.setAttribute(attr,next);
  }
 });
 for(const id of ["languageToggle","authLanguageToggle"]){const toggle=$(id);if(toggle){toggle.textContent=currentLanguage==="ar"?"EN":"عربي";toggle.setAttribute("aria-label",currentLanguage==="ar"?"Switch to English":"التبديل إلى العربية")}}
 const theme=$("topThemeToggle");
 if(theme){const dark=document.documentElement.classList.contains("theme-dark");theme.textContent=currentLanguage==="ar"?(dark?"الوضع الفاتح":"الوضع الداكن"):(dark?"Light mode":"Dark mode")}
 document.title=currentLanguage==="ar"?"مِيدان | MIDAAN":"MIDAAN | Industrial platform";
 const description=document.querySelector('meta[name="description"]');
 if(description)description.content=currentLanguage==="ar"?"مِيدان — منصة صناعية للمصانع والفنيين والمهندسين والموردين":"MIDAAN — Industrial platform for factories, technicians, engineers and suppliers";
}
async function setLanguage(language){
 currentLanguage=language==="en"?"en":"ar";
 localStorage.setItem("midaan-language",currentLanguage);
 applyLanguage();
 if(currentUserId){
  const {error}=await db.from("profiles").upsert({id:currentUserId,preferred_language:currentLanguage},{onConflict:"id"});
  if(error)showMessage("globalMessage",currentLanguage==="ar"?"تعذر حفظ تفضيل اللغة على الحساب.":"Could not save language preference to your account.",true);
 }
}
const languageObserver=new MutationObserver(records=>{
 if(!records.length)return;
 for(const record of records){
  if(record.type==="childList")record.addedNodes.forEach(node=>{if(node.nodeType===Node.ELEMENT_NODE)applyLanguage(node);else if(node.nodeType===Node.TEXT_NODE)node.nodeValue=translateNodeText(node.nodeValue)});
  else if(record.type==="characterData")record.target.nodeValue=translateNodeText(record.target.nodeValue);
 }
});
languageObserver.observe(document.body,{subtree:true,childList:true,characterData:true});

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
async function loadAll(){const {data:{user}}=await db.auth.getUser();currentUserId=user?.id||null;$("userEmail").textContent=user?.email||"";const orgData=await api("my_organizations");organizations=(orgData||[]).map(x=>({...x.organizations,memberRole:x.role})).filter(x=>x.id);const cat=await db.from("categories").select("id,slug,name_ar").eq("is_active",true).order("sort_order");if(cat.error)throw cat.error;categories=cat.data||[];renderOrganizations();renderOrgSelects();renderCategories();await loadSettings();await Promise.all([loadSkills(),loadMachines(),loadFaultReports()]);await loadMaintenance();await loadMarketplace();await loadRfqs();await loadTeam();await loadCatalog();applyLanguage();}
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
$("rfqSearch").oninput=renderRfqs;


let industrialRfqs=[],myRfqQuotes=[];
const rfqStatusLabels={open:"مفتوح",closed:"مغلق",awarded:"تم الترسية",cancelled:"ملغي"};
function renderRfqs(){
 const q=($("rfqSearch").value||"").trim().toLowerCase(),cat=$("rfqCategoryFilter").value;
 const rows=industrialRfqs.filter(r=>(r.status==="open"||organizations.some(o=>o.id===r.organization_id))&&(!q||[r.title,r.description,r.buyer_display_name,r.country_code].join(" ").toLowerCase().includes(q))&&(!cat||r.category===cat));
 $("rfqList").innerHTML=rows.length?rows.map(r=>{
  const own=organizations.some(o=>o.id===r.organization_id),quotes=r.rfq_quotes||[];
  const quoteHtml=own&&quotes.length?'<div class="market-request"><strong>العروض المستلمة ('+quotes.length+')</strong>'+quotes.map(q=>'<div class="item"><div class="item-head"><strong>'+escapeHtml(q.professional_profiles?.display_name||"مقدم عرض")+'</strong><span class="pill">'+escapeHtml(q.status==="pending"?"قيد المراجعة":q.status==="accepted"?"مقبول":q.status==="rejected"?"مرفوض":"منسحب")+'</span></div><div class="tiny">'+escapeHtml(Number(q.price_amount).toLocaleString()+" "+q.currency_code)+' · '+escapeHtml(q.lead_days+" يوم")+'</div><p>'+escapeHtml(q.notes)+'</p>'+(q.status==="pending"?'<div class="marketplace-actions"><button class="btn" data-quote-id="'+escapeHtml(q.id)+'" data-quote-status="accepted">قبول العرض</button><button class="btn" data-quote-id="'+escapeHtml(q.id)+'" data-quote-status="rejected">رفض</button></div>':"")+'</div>').join("")+'</div>':"";
  const action=!own&&r.status==="open"&&!quotes.some(q=>q.supplier_id===currentUserId)?'<button class="btn primary" data-rfq-quote="'+escapeHtml(r.id)+'">قدم عرض سعر</button>':"";
  const close=own&&r.status==="open"?'<button class="btn" data-rfq-close="'+escapeHtml(r.id)+'">إغلاق الطلب</button>':"";
  return '<article class="marketplace-offer"><div class="item-head"><div><h3>'+escapeHtml(r.title)+'</h3><div class="tiny">'+escapeHtml(r.buyer_display_name)+' · '+escapeHtml(r.country_code)+'</div></div><span class="pill '+(r.status==="open"?"green":"gold")+'">'+escapeHtml(rfqStatusLabels[r.status]||r.status)+'</span></div><div class="meta"><span class="pill">'+escapeHtml(marketCategoryLabels[r.category]||r.category)+'</span>'+(r.quantity?'<span class="pill">'+escapeHtml(r.quantity+" "+(r.unit||""))+'</span>':"")+(r.target_date?'<span class="pill">مطلوب قبل '+escapeHtml(new Date(r.target_date+"T00:00:00").toLocaleDateString())+'</span>':"")+'</div><p>'+escapeHtml(r.description)+'</p><div class="marketplace-actions">'+action+close+'</div>'+quoteHtml+'</article>';
 }).join(""):'<div class="empty">لا توجد طلبات عروض أسعار مطابقة.</div>';
 $("myRfqQuotes").innerHTML=myRfqQuotes.length?myRfqQuotes.map(q=>'<article class="market-request"><div class="item-head"><strong>'+escapeHtml(q.rfq_title||"طلب عروض أسعار")+'</strong><span class="pill">'+escapeHtml(q.status==="pending"?"قيد المراجعة":q.status==="accepted"?"مقبول":q.status==="rejected"?"مرفوض":"منسحب")+'</span></div><div class="tiny">'+escapeHtml(Number(q.price_amount).toLocaleString()+" "+q.currency_code)+' · '+escapeHtml(q.lead_days+" يوم")+'</div><p>'+escapeHtml(q.notes)+'</p>'+(q.status==="pending"?'<button class="btn" data-quote-id="'+escapeHtml(q.id)+'" data-quote-status="withdrawn">سحب العرض</button>':"")+'</article>').join(""):'<div class="empty">لم تقدم عروضًا بعد.</div>';
}
async function loadRfqs(){
 if(!currentUserId)return;
 const orgSelect=$("rfqOrg"),old=orgSelect.value;
 orgSelect.innerHTML=organizations.map(o=>'<option value="'+escapeHtml(o.id)+'">'+escapeHtml(o.name)+'</option>').join("");
 if(old&&organizations.some(o=>o.id===old))orgSelect.value=old;
 const {data,error}=await db.from("industrial_rfqs").select("id,organization_id,created_by,buyer_display_name,title,description,category,country_code,quantity,unit,target_date,status,created_at,rfq_quotes(id,supplier_id,price_amount,currency_code,lead_days,notes,status,professional_profiles(display_name,headline))").order("created_at",{ascending:false}).limit(100);
 if(error)throw error;industrialRfqs=data||[];
 const {data:quotes,error:quotesError}=await db.from("rfq_quotes").select("id,rfq_id,rfq_title,price_amount,currency_code,lead_days,notes,status").eq("supplier_id",currentUserId).order("created_at",{ascending:false}).limit(50);
 if(quotesError)throw quotesError;myRfqQuotes=quotes||[];
 renderRfqs();
}
$("createRfq").onclick=async()=>{
 const organization_id=$("rfqOrg").value,title=$("rfqTitle").value.trim(),description=$("rfqDescription").value.trim(),category=$("rfqCategory").value,quantityRaw=$("rfqQuantity").value,quantity=quantityRaw===""?null:Number(quantityRaw),unit=$("rfqUnit").value.trim(),target_date=$("rfqTargetDate").value||null,b=$("createRfq");
 if(!organization_id){showMessage("rfqMessage","أنشئ منشأة أولًا حتى تنشر احتياج المصنع.",true);return}
 if(title.length<4||description.length<20){showMessage("rfqMessage","اكتب عنوانًا ووصفًا فنيًا لا يقل عن 20 حرفًا.",true);return}
 if(quantity!==null&&(!Number.isFinite(quantity)||quantity<=0)){showMessage("rfqMessage","أدخل كمية أكبر من صفر.",true);return}
 if(target_date&&new Date(target_date+"T00:00:00")<new Date(new Date().toDateString())){showMessage("rfqMessage","موعد الاحتياج يجب ألا يكون في الماضي.",true);return}
 b.disabled=true;
 try{
  const {error}=await db.from("industrial_rfqs").insert({organization_id,created_by:currentUserId,title,description,category,quantity,unit:unit||null,target_date});
  if(error)throw error;
  $("rfqTitle").value="";$("rfqDescription").value="";$("rfqQuantity").value="";$("rfqUnit").value="";$("rfqTargetDate").value="";
  await loadRfqs();showMessage("rfqMessage","تم نشر طلب عروض الأسعار.");
 }catch(e){showMessage("rfqMessage",e.message||"تعذر نشر الطلب.",true)}finally{b.disabled=false}
};
$("rfqList").addEventListener("click",async event=>{
 const quoteButton=event.target.closest("[data-rfq-quote]");
 if(quoteButton){
  if(!professionalProfile?.is_public){showMessage("globalMessage","احفظ ملفك المهني وفعّل إظهاره في السوق قبل تقديم عروض الموردين.",true);return}
  const r=industrialRfqs.find(x=>x.id===quoteButton.dataset.rfqQuote);if(!r)return;
  $("quoteRfqId").value=r.id;$("rfqQuoteTitle").textContent=r.title;$("rfqQuotePanel").classList.remove("hidden");$("rfqQuotePanel").scrollIntoView({behavior:"smooth",block:"start"});return;
 }
 const closeButton=event.target.closest("[data-rfq-close]");
 if(closeButton){
  closeButton.disabled=true;
  try{const {error}=await db.from("industrial_rfqs").update({status:"closed"}).eq("id",closeButton.dataset.rfqClose);if(error)throw error;await loadRfqs();showMessage("globalMessage","تم إغلاق طلب عروض الأسعار.")}catch(e){showMessage("globalMessage",e.message||"تعذر إغلاق الطلب.",true)}finally{closeButton.disabled=false}
 }
});
$("submitRfqQuote").onclick=async()=>{
 const rfq_id=$("quoteRfqId").value,price_amount=Number($("quoteAmount").value),currency_code=$("quoteCurrency").value.trim().toUpperCase(),lead_days=Number($("quoteLeadDays").value),notes=$("quoteNotes").value.trim(),b=$("submitRfqQuote");
 if(!rfq_id||!Number.isFinite(price_amount)||price_amount<=0||!/^[A-Z]{3}$/.test(currency_code)||!Number.isInteger(lead_days)||lead_days<0||lead_days>3650||notes.length<10){showMessage("quoteMessage","راجع السعر والعملة ومدة التنفيذ والتفاصيل قبل الإرسال.",true);return}
 b.disabled=true;
 try{const {error}=await db.from("rfq_quotes").insert({rfq_id,supplier_id:currentUserId,submitted_by:currentUserId,price_amount,currency_code,lead_days,notes});if(error)throw error;$("quoteAmount").value="";$("quoteCurrency").value="";$("quoteNotes").value="";$("rfqQuotePanel").classList.add("hidden");await loadRfqs();showMessage("globalMessage","تم إرسال عرضك إلى المصنع.")}catch(e){showMessage("quoteMessage",e.message||"تعذر إرسال العرض.",true)}finally{b.disabled=false}
};
$("cancelRfqQuote").onclick=()=>{$("rfqQuotePanel").classList.add("hidden")};
async function updateRfqQuote(button){
 const status=button.dataset.quoteStatus;if(!["accepted","rejected","withdrawn"].includes(status))return;
 button.disabled=true;
 try{const {error}=await db.from("rfq_quotes").update({status}).eq("id",button.dataset.quoteId);if(error)throw error;
  if(status==="accepted"){
   const quote=industrialRfqs.flatMap(r=>r.rfq_quotes||[]).find(q=>q.id===button.dataset.quoteId);
   if(quote){const {error:awardError}=await db.from("industrial_rfqs").update({status:"awarded"}).eq("id",quote.rfq_id);if(awardError)throw awardError}
  }
  await loadRfqs();showMessage("globalMessage","تم تحديث حالة عرض السعر.")}catch(e){showMessage("globalMessage",e.message||"تعذر تحديث العرض.",true)}finally{button.disabled=false}
}
$("rfqList").addEventListener("click",event=>{const b=event.target.closest("[data-quote-id][data-quote-status]");if(b)updateRfqQuote(b)});
$("myRfqQuotes").addEventListener("click",event=>{const b=event.target.closest("[data-quote-id][data-quote-status]");if(b)updateRfqQuote(b)});
$("rfqSearch").oninput=renderRfqs;
$("rfqCategoryFilter").onchange=renderRfqs;
$("refreshRfqs").onclick=()=>loadRfqs().catch(e=>showMessage("globalMessage",e.message||"تعذر تحديث الطلبات.",true));


let teamMembersByOrg={},teamInvitations=[];
const teamRoleLabels={owner:"مالك",admin:"مسؤول",engineer:"مهندس",technician:"فني",reviewer:"مراجع"};
async function getTeamMembers(orgId,refresh=false){
 if(!refresh&&teamMembersByOrg[orgId])return teamMembersByOrg[orgId];
 const {data,error}=await db.rpc("list_organization_members",{p_org_id:orgId});
 if(error)throw error;
 teamMembersByOrg[orgId]=data||[];
 return teamMembersByOrg[orgId];
}
async function loadTeam(){
 const select=$("teamOrg"),old=select.value;
 select.innerHTML=organizations.map(o=>'<option value="'+escapeHtml(o.id)+'">'+escapeHtml(o.name)+'</option>').join("");
 if(old&&organizations.some(o=>o.id===old))select.value=old;
 if(!organizations.length){
  $("teamMembers").innerHTML='<div class="empty">أنشئ منشأة أولًا لإدارة فريقها.</div>';
  $("teamInvitations").innerHTML='<div class="empty">لا توجد منشأة محددة.</div>';
  $("teamInvitePanel").classList.add("hidden");
  return;
 }
 await renderTeam(select.value||organizations[0].id,true);
}
async function renderTeam(orgId,refresh=false){
 if(!orgId)return;
 const org=organizations.find(o=>o.id===orgId),manager=["owner","admin"].includes(org?.memberRole);
 $("teamInvitePanel").classList.toggle("hidden",!manager);
 const members=await getTeamMembers(orgId,refresh);
 $("teamMembers").innerHTML=members.length?members.map(m=>{
  const own=m.member_user_id===currentUserId;
  return '<article class="team-member"><div class="item-head"><strong>'+escapeHtml(m.display_name||"عضو فريق")+(own?" (أنت)":"")+'</strong><span class="pill '+(m.status==="active"?"green":"red")+'">'+(m.status==="active"?"نشط":"موقوف")+'</span></div><div class="meta"><span class="pill">'+escapeHtml(teamRoleLabels[m.role]||m.role)+'</span><span class="tiny">'+escapeHtml(new Date(m.joined_at).toLocaleDateString())+'</span></div></article>';
 }).join(""):'<div class="empty">لا يوجد أعضاء في هذه المنشأة.</div>';
 if(!manager){$("teamInvitations").innerHTML='<div class="empty">عرض الدعوات وإدارتها متاح لمالك المنشأة والمسؤول فقط.</div>';return}
 const {data:invites,error}=await db.rpc("list_organization_invitations",{p_org_id:orgId});
 if(error){$("teamInvitations").innerHTML='<div class="empty">تعذر تحميل الدعوات.</div>';showMessage("teamMessage",error.message,true);return}
 teamInvitations=invites||[];
 $("teamInvitations").innerHTML=teamInvitations.length?teamInvitations.map(i=>'<article class="team-invite"><div class="item-head"><strong>'+escapeHtml(i.invited_email)+'</strong><span class="pill">'+escapeHtml(teamRoleLabels[i.role]||i.role)+'</span></div><div class="tiny">تنتهي: '+escapeHtml(new Date(i.expires_at).toLocaleString())+'</div><button class="btn" data-revoke-invite="'+escapeHtml(i.invitation_id)+'">إلغاء الدعوة</button></article>').join(""):'<div class="empty">لا توجد دعوات معلقة.</div>';
}
$("teamOrg").onchange=()=>renderTeam($("teamOrg").value,true).catch(e=>showMessage("teamMessage",e.message||"تعذر تحميل الفريق.",true));
$("createTeamInvite").onclick=async()=>{
 const p_org_id=$("teamOrg").value,p_email=$("teamInviteEmail").value.trim().toLowerCase(),p_role=$("teamInviteRole").value,b=$("createTeamInvite");
 if(!p_org_id||!p_email.includes("@")){showMessage("teamMessage","اكتب بريدًا إلكترونيًا صحيحًا واختر المنشأة.",true);return}
 b.disabled=true;
 try{
  const {data,error}=await db.rpc("create_organization_invitation",{p_org_id,p_email,p_role});
  if(error)throw error;
  const invite=Array.isArray(data)?data[0]:data;
  if(!invite?.invite_token)throw new Error("تم إنشاء الدعوة لكن لم يصل رمز الدعوة.");
  $("teamInviteEmail").value="";
  $("teamInviteToken").value=invite.invite_token;
  $("teamInviteResult").classList.remove("hidden");
  await renderTeam(p_org_id,true);
  showMessage("teamMessage","تم إنشاء دعوة صالحة لمدة 7 أيام. أرسل الرمز إلى البريد المحدد.");
 }catch(e){showMessage("teamMessage",e.message||"تعذر إنشاء الدعوة.",true)}
 finally{b.disabled=false}
};
$("copyTeamInvite").onclick=async()=>{
 const token=$("teamInviteToken").value;
 try{await navigator.clipboard.writeText(token);showMessage("teamMessage","تم نسخ رمز الدعوة.")}catch(e){$("teamInviteToken").focus();$("teamInviteToken").select();showMessage("teamMessage","حدد الرمز وانسخه يدويًا.")};
};
$("teamInvitations").addEventListener("click",async event=>{
 const b=event.target.closest("[data-revoke-invite]");if(!b)return;b.disabled=true;
 try{const {error}=await db.rpc("revoke_organization_invitation",{p_invitation_id:b.dataset.revokeInvite});if(error)throw error;await renderTeam($("teamOrg").value,true);showMessage("teamMessage","تم إلغاء الدعوة.")}catch(e){showMessage("teamMessage",e.message||"تعذر إلغاء الدعوة.",true)}finally{b.disabled=false}
});
$("acceptTeamInvite").onclick=async()=>{
 const p_token=$("acceptTeamToken").value.trim(),b=$("acceptTeamInvite");
 if(!/^[0-9a-fA-F]{64}$/.test(p_token)){showMessage("acceptTeamMessage","أدخل رمز دعوة صحيحًا مكوّنًا من 64 حرفًا.",true);return}
 b.disabled=true;
 try{
  const {data,error}=await db.rpc("accept_organization_invitation",{p_token});if(error)throw error;
  const result=Array.isArray(data)?data[0]:data;
  $("acceptTeamToken").value="";
  await loadAll();activateView("team");
  showMessage("globalMessage","انضممت إلى منشأة "+(result?.organization_name||"")+" بنجاح.");
 }catch(e){showMessage("acceptTeamMessage",e.message||"تعذر قبول الدعوة.",true)}finally{b.disabled=false}
};


let catalogProducts=[];
const productCategoryLabels={plastic_resin:"خامات البلاستيك",spare_parts:"قطع غيار",molds:"قوالب",machinery:"ماكينات",tools:"عدد وأدوات",packaging:"تغليف",other:"أخرى"};
const productConditionLabels={new:"جديد",used:"مستعمل",refurbished:"مجدد"};
async function loadCatalog(){
 if(!currentUserId)return;
 const {data,error}=await db.from("industrial_products").select("id,seller_id,title,description,category,sku,country_code,city,product_condition,price_type,price_amount,currency_code,min_order_qty,unit,lead_days,image_path,status,created_at,professional_profiles(display_name,professional_type,is_public)").order("created_at",{ascending:false}).limit(150);
 if(error)throw error;catalogProducts=data||[];renderCatalog();
}
function renderCatalog(){
 const query=($("catalogSearch").value||"").trim().toLowerCase(),category=$("catalogCategoryFilter").value,country=($("catalogCountryFilter").value||"").trim().toUpperCase();
 const rows=catalogProducts.filter(p=>(p.status==="published"||p.seller_id===currentUserId)&&(!query||[p.title,p.description,p.sku,p.city,p.country_code,p.professional_profiles?.display_name].join(" ").toLowerCase().includes(query))&&(!category||p.category===category)&&(!country||p.country_code===country));
 $("catalogList").innerHTML=rows.length?rows.map(p=>{
  const mine=p.seller_id===currentUserId,profile=p.professional_profiles||{},price=p.price_type==="quote"?"السعر حسب طلب عرض السعر":Number(p.price_amount).toLocaleString()+" "+p.currency_code;
  const img=p.image_path?db.storage.from("industrial-products").getPublicUrl(p.image_path).data.publicUrl:"";
  const image=img?'<img src="'+escapeHtml(img)+'" alt="'+escapeHtml(p.title)+'" loading="lazy">':'<div class="catalog-placeholder">MIDAAN</div>';
  const action=mine?'<button class="btn" data-product-id="'+escapeHtml(p.id)+'" data-product-status="'+(p.status==="published"?"paused":"published")+'">'+(p.status==="published"?"إيقاف العرض":"نشر المنتج")+'</button>':(p.status==="published"?'<button class="btn primary" data-product-rfq="'+escapeHtml(p.id)+'">طلب عرض سعر لهذا المنتج</button>':"");
  return '<article class="catalog-product">'+image+'<div class="product-copy"><div class="item-head"><div><h3>'+escapeHtml(p.title)+'</h3><div class="tiny">'+escapeHtml(profile.display_name||"مورد صناعي")+' · '+escapeHtml(p.country_code)+(p.city?" · "+escapeHtml(p.city):"")+'</div></div><span class="pill '+(p.status==="published"?"green":"gold")+'">'+(p.status==="published"?"منشور":p.status==="paused"?"متوقف":"مسودة")+'</span></div><div class="product-meta"><span class="pill">'+escapeHtml(productCategoryLabels[p.category]||p.category)+'</span><span class="pill">'+escapeHtml(productConditionLabels[p.product_condition]||p.product_condition)+'</span><span class="pill">'+escapeHtml(price)+'</span><span class="pill">الحد الأدنى: '+escapeHtml(p.min_order_qty+" "+p.unit)+'</span><span class="pill">التوريد: '+escapeHtml(p.lead_days+" يوم")+'</span>'+(p.sku?'<span class="pill">SKU: '+escapeHtml(p.sku)+'</span>':"")+'</div><p>'+escapeHtml(p.description)+'</p><div class="marketplace-actions">'+action+'</div></div></article>';
 }).join(""):'<div class="empty">لا توجد منتجات مطابقة حاليًا. يمكنك نشر أول منتج من النموذج.</div>';
}
$("createProduct").onclick=async()=>{
 const title=$("productTitle").value.trim(),description=$("productDescription").value.trim(),category=$("productCategory").value,sku=$("productSku").value.trim(),product_condition=$("productCondition").value,lead_days=Number($("productLeadDays").value),min_order_qty=Number($("productMinOrder").value),unit=$("productUnit").value.trim(),price_type=$("productPriceType").value,amountRaw=$("productPriceAmount").value,price_amount=amountRaw===""?null:Number(amountRaw),currency_code=$("productCurrency").value.trim().toUpperCase(),country_code=$("productCountry").value.trim().toUpperCase(),city=$("productCity").value.trim(),status=$("productStatus").value,file=$("productImage").files?.[0]||null,b=$("createProduct");
 if(!professionalProfile){showMessage("catalogMessage","احفظ ملفك المهني أولًا قبل إضافة منتج.",true);return}
 if(title.length<4||description.length<20){showMessage("catalogMessage","اكتب اسم المنتج ووصفًا فنيًا لا يقل عن 20 حرفًا.",true);return}
 if(status==="published"&&!professionalProfile.is_public){showMessage("catalogMessage","فعّل إظهار ملفك المهني أولًا حتى تنشر منتجًا عامًا.",true);return}
 if(!/^[A-Z]{2}$/.test(country_code)){showMessage("catalogMessage","رمز الدولة يجب أن يكون حرفين مثل EG أو SA.",true);return}
 if(!Number.isInteger(lead_days)||lead_days<0||lead_days>3650||!Number.isFinite(min_order_qty)||min_order_qty<=0||!unit||unit.length>24){showMessage("catalogMessage","راجع مدة التوريد والحد الأدنى ووحدة القياس.",true);return}
 if(price_type==="quote"&&(price_amount!==null||currency_code)){showMessage("catalogMessage","اترك السعر والعملة فارغين عند اختيار طلب عرض السعر.",true);return}
 if(price_type==="fixed"&&(!Number.isFinite(price_amount)||price_amount<0||!/^[A-Z]{3}$/.test(currency_code))){showMessage("catalogMessage","أدخل سعرًا صحيحًا ورمز عملة من 3 أحرف.",true);return}
 if(file&&(!["image/jpeg","image/png","image/webp"].includes(file.type)||file.size>5*1024*1024)){showMessage("catalogMessage","الصورة يجب أن تكون JPG أو PNG أو WebP وأقل من 5MB.",true);return}
 b.disabled=true;
 try{
  const payload={seller_id:currentUserId,title,description,category,sku:sku||null,country_code,city:city||null,product_condition,price_type,price_amount:price_type==="quote"?null:price_amount,currency_code:price_type==="quote"?null:currency_code,min_order_qty,unit,lead_days,status};
  const {data,error}=await db.from("industrial_products").insert(payload).select("id").single();if(error)throw error;
  let imageSaved=false;
  if(file){
   const ext=file.type==="image/jpeg"?"jpg":file.type==="image/png"?"png":"webp",path=currentUserId+"/"+data.id+"/"+crypto.randomUUID()+"."+ext;
   const {error:uploadError}=await db.storage.from("industrial-products").upload(path,file,{contentType:file.type,upsert:false});
   if(!uploadError){const {error:updateError}=await db.from("industrial_products").update({image_path:path}).eq("id",data.id);if(!updateError)imageSaved=true;else await db.storage.from("industrial-products").remove([path]);}
  }
  for(const id of ["productTitle","productDescription","productSku","productPriceAmount","productCurrency","productCity"])$(id).value="";
  $("productImage").value="";await loadCatalog();
  showMessage("catalogMessage",file&&!imageSaved?"تم حفظ المنتج، لكن تعذر رفع الصورة. يمكنك إعادة إضافة المنتج لاحقًا بصورة جديدة.":"تم حفظ المنتج في الكتالوج.");
 }catch(e){showMessage("catalogMessage",e.message||"تعذر حفظ المنتج.",true)}finally{b.disabled=false}
};
$("catalogList").addEventListener("click",async event=>{
 const quote=event.target.closest("[data-product-rfq]");
 if(quote){
  const p=catalogProducts.find(x=>x.id===quote.dataset.productRfq);if(!p)return;
  if(!organizations.length){showMessage("globalMessage","أنشئ منشأة أولًا حتى ترسل طلب عرض سعر.",true);activateView("organizations");return}
  const map={plastic_resin:"other",spare_parts:"spare_parts",molds:"mold_maintenance",machinery:"mechanical",tools:"other",packaging:"other",other:"other"};
  activateView("rfqs");
  $("rfqOrg").value=organizations[0].id;
  $("rfqTitle").value="طلب عرض سعر: "+p.title;
  $("rfqDescription").value="المنتج: "+p.title+"\nالمورد: "+(p.professional_profiles?.display_name||"")+
   "\nالمواصفات: "+p.description+"\nالحد الأدنى: "+p.min_order_qty+" "+p.unit+"\nمدة التوريد: "+p.lead_days+" يوم"+
   (p.sku?"\nSKU: "+p.sku:"");
  $("rfqCategory").value=map[p.category]||"other";
  showMessage("globalMessage","تم تجهيز طلب عرض السعر من بيانات المنتج. راجع الكمية والتفاصيل ثم انشره.");
  $("rfqTitle").scrollIntoView({behavior:"smooth",block:"center"});return;
 }
 const button=event.target.closest("[data-product-id][data-product-status]");if(!button)return;
 button.disabled=true;
 try{const {error}=await db.from("industrial_products").update({status:button.dataset.productStatus}).eq("id",button.dataset.productId);if(error)throw error;await loadCatalog();showMessage("globalMessage","تم تحديث حالة المنتج.")}catch(e){showMessage("globalMessage",e.message||"تعذر تحديث المنتج.",true)}finally{button.disabled=false}
});
$("catalogSearch").oninput=renderCatalog;
$("catalogCategoryFilter").onchange=renderCatalog;
$("catalogCountryFilter").oninput=renderCatalog;
$("refreshCatalog").onclick=()=>loadCatalog().catch(e=>showMessage("globalMessage",e.message||"تعذر تحديث الكتالوج.",true));

const validViews=["overview","skills","organizations","machines","maintenance","faults","team","catalog","rfqs","marketplace","settings"];
const viewMeta={overview:["الرئيسية","نظرة سريعة على نشاطك الصناعي في مِيدان"],skills:["مكتبة المهارات","وثّق خبرات فريقك واجعلها معرفة منظمة قابلة للمراجعة"],organizations:["المنشآت","إدارة المصانع والورش المرتبطة بحسابك"],machines:["الماكينات","سجل معدات المصنع واربطها بسياق العمل"],maintenance:["الصيانة الوقائية","خطط أعمال الصيانة وتابع المواعيد والتنفيذ"],faults:["بلاغات الأعطال","سجل البلاغات الفنية وتابع الأولويات والحالات"],team:["فريق العمل","إدارة أعضاء المنشأة ودعوات الانضمام وتوزيع المهام"],catalog:["كتالوج المنتجات الصناعية","اكتشف الخامات وقطع الغيار والقوالب والماكينات من الموردين"],rfqs:["طلبات عروض الأسعار","اطلب المنتجات والخدمات الصناعية وقارن عروض الموردين"],marketplace:["السوق الصناعي","اعرض خدماتك أو اطلب خدمة صناعية من مقدم خدمة"],settings:["إعدادات الحساب","بياناتك المهنية وتفضيلات الأمان والمظهر"]};
function activateView(name,{updateUrl=true}={}){
  if(!validViews.includes(name))name="overview";
  document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id==="view-"+name));
  document.querySelectorAll("[data-view]").forEach(t=>t.classList.toggle("active",t.dataset.view===name));
  const meta=viewMeta[name],head=document.querySelector("#view-"+name+" .page-head");
  if(head&&meta){head.innerHTML="<div><h2>"+escapeHtml(meta[0])+"</h2><p>"+escapeHtml(meta[1])+"</p></div>"}
  if(typeof applyLanguage==="function")applyLanguage();
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
async function createMaintenanceTask(){const organization_id=$("maintenanceOrg").value,machine_id=$("maintenanceMachine").value,title=$("maintenanceTitle").value.trim(),description=$("maintenanceDescription").value.trim(),dueValue=$("maintenanceDue").value,intervalValue=$("maintenanceInterval").value,priority=$("maintenancePriority").value,b=$("createMaintenance");if(!organization_id)throw new Error("اختر المنشأة أولًا.");if(!machine_id||!machines.some(m=>m.id===machine_id&&m.organization_id===organization_id))throw new Error("اختر ماكينة تابعة للمنشأة المحددة.");if(title.length<4)throw new Error("عنوان المهمة يجب ألا يقل عن 4 أحرف.");if(!dueValue||Number.isNaN(new Date(dueValue).getTime()))throw new Error("حدد موعد استحقاق صحيحًا.");const interval_days=intervalValue?Number(intervalValue):null;if(interval_days!==null&&(!Number.isInteger(interval_days)||interval_days<1||interval_days>3650))throw new Error("التكرار يجب أن يكون عددًا صحيحًا من 1 إلى 3650 يومًا.");b.disabled=true;try{const {data:{user}}=await db.auth.getUser();const {error}=await db.from("maintenance_tasks").insert({organization_id,machine_id,title,description:description||null,due_at:new Date(dueValue).toISOString(),interval_days,priority,assigned_to:$("maintenanceAssignee")?.value||user.id,created_by:user.id});if(error)throw error;$("maintenanceTitle").value="";$("maintenanceDescription").value="";$("maintenanceDue").value="";$("maintenanceInterval").value="";await loadMaintenance();showMessage("globalMessage","تمت جدولة مهمة الصيانة بنجاح.");}finally{b.disabled=false}}
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
async function loadSettings(){
 const {data:{user}}=await db.auth.getUser();
 $("profileEmail").value=user?.email||"";
 $("profileName").value=user?.user_metadata?.display_name||"";
 const {data:profile}=await db.from("profiles").select("preferred_language").eq("id",user.id).maybeSingle();
 currentLanguage=profile?.preferred_language==="en"?"en":(localStorage.getItem("midaan-language")==="en"?"en":"ar");
 localStorage.setItem("midaan-language",currentLanguage);
 applyTheme(localStorage.getItem("midaan-theme")==="dark");
 applyLanguage();
}
function applyTheme(dark){
 document.documentElement.classList.toggle("theme-dark",!!dark);
 document.documentElement.style.colorScheme=dark?"dark":"light";
 const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=dark?"#0b1420":"#10243a";
 const label=currentLanguage==="ar"?(dark?"تفعيل الوضع الفاتح":"تفعيل الوضع الداكن"):(dark?"Enable light mode":"Enable dark mode");
 for(const id of ["themeToggle","topThemeToggle","authThemeToggle"]){const button=$(id);if(button){button.textContent=id==="topThemeToggle"?(currentLanguage==="ar"?(dark?"الوضع الفاتح":"الوضع الداكن"):(dark?"Light mode":"Dark mode")):label;button.setAttribute("aria-pressed",String(!!dark))}}
}
applyTheme(localStorage.getItem("midaan-theme")==="dark");
applyLanguage();

async function submitFaultReport(){const organization_id=$("faultOrg").value,title=$("faultTitle").value.trim(),description=$("faultDescription").value.trim(),severity=$("faultSeverity").value,machine_id=$("faultMachine").value||null,b=$("createFaultReport");if(!organization_id)throw new Error("أنشئ منشأة أو اختر منشأة أولًا.");if(title.length<4)throw new Error("عنوان البلاغ يجب أن يكون 4 أحرف على الأقل.");if(description.length<10)throw new Error("اكتب وصفًا واضحًا للعطل لا يقل عن 10 أحرف.");b.disabled=true;try{const {data:{user}}=await db.auth.getUser();const {error}=await db.from("fault_reports").insert({organization_id,machine_id,reported_by:user.id,title,description,severity});if(error)throw error;$("faultTitle").value="";$("faultDescription").value="";await loadFaultReports();showMessage("globalMessage","تم تسجيل البلاغ بنجاح.");}finally{b.disabled=false}}
$("faultOrg").onchange=loadFaultMachines;
$("faultFilter").onchange=renderFaultReports;
$("faultList").addEventListener("click",async event=>{const button=event.target.closest("[data-report-id][data-report-status]");if(!button)return;button.disabled=true;try{const {error}=await db.from("fault_reports").update({status:button.dataset.reportStatus}).eq("id",button.dataset.reportId);if(error)throw error;await loadFaultReports();showMessage("globalMessage","تم تحديث حالة البلاغ.");}catch(e){showMessage("globalMessage",e.message||"تعذر تحديث حالة البلاغ.",true);}finally{button.disabled=false}});
$("createFaultReport").onclick=()=>submitFaultReport().catch(e=>showMessage("globalMessage",e.message||"تعذر إرسال البلاغ.",true));
$("saveProfile").onclick=async()=>{const name=$("profileName").value.trim(),b=$("saveProfile");if(name.length<2){showMessage("profileMessage","اكتب اسمًا ظاهرًا صحيحًا.",true);return}b.disabled=true;try{const {error}=await db.auth.updateUser({data:{display_name:name}});if(error)throw error;showMessage("profileMessage","تم تحديث بيانات الملف المهني.");}catch(e){showMessage("profileMessage",e.message||"تعذر تحديث الملف.",true)}finally{b.disabled=false}};
$("changePassword").onclick=async()=>{const password=$("settingsPassword").value,confirm=$("settingsPasswordConfirm").value,b=$("changePassword");if(password.length<12){showMessage("settingsMessage","كلمة المرور يجب ألا تقل عن 12 حرفًا.",true);return}if(password!==confirm){showMessage("settingsMessage","كلمتا المرور غير متطابقتين.",true);return}b.disabled=true;try{if(await isCompromisedPassword(password))throw new Error("كلمة المرور دي ظهرت في تسريبات معروفة. اختار كلمة مختلفة.");const {error}=await db.auth.updateUser({password});if(error)throw error;$("settingsPassword").value="";$("settingsPasswordConfirm").value="";showMessage("settingsMessage","تم تحديث كلمة المرور بنجاح.");}catch(e){showMessage("settingsMessage",e.message||"تعذر تحديث كلمة المرور.",true)}finally{b.disabled=false}};
function toggleTheme(){const dark=!document.documentElement.classList.contains("theme-dark");localStorage.setItem("midaan-theme",dark?"dark":"light");applyTheme(dark)}
$("themeToggle").onclick=toggleTheme;
$("topThemeToggle").onclick=toggleTheme;
$("authThemeToggle").onclick=toggleTheme;
const changeLanguage=()=>setLanguage(currentLanguage==="ar"?"en":"ar").catch(e=>showMessage("globalMessage",e.message||"تعذر تغيير اللغة.",true));
$("languageToggle").onclick=changeLanguage;
$("authLanguageToggle").onclick=changeLanguage;
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