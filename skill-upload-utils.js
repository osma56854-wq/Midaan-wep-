(function(root){
  "use strict";
  const MAX_FILES=5;
  const MAX_FILE_SIZE=25*1024*1024;
  const ALLOWED_TYPES=new Set(["image/jpeg","image/png","image/webp","video/mp4","video/webm","application/pdf"]);
  function validateFiles(files){
    const list=Array.from(files||[]);
    if(list.length>MAX_FILES)throw new Error("يمكن إرفاق 5 ملفات كحد أقصى.");
    for(const file of list){
      if(!ALLOWED_TYPES.has(file.type))throw new Error("نوع ملف غير مدعوم: "+(file.name||"ملف بدون اسم"));
      if(file.size>MAX_FILE_SIZE)throw new Error("حجم الملف يتجاوز 25 ميجابايت: "+(file.name||"ملف بدون اسم"));
      if(file.size<=0)throw new Error("الملف فارغ: "+(file.name||"ملف بدون اسم"));
    }
    return list;
  }
  const api={MAX_FILES,MAX_FILE_SIZE,ALLOWED_TYPES,validateFiles};
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  if(root)root.MidaanSkillUploads=api;
})(typeof window!=="undefined"?window:null);
