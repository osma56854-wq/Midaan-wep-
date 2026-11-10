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
  async function uploadWithRollback(files,uploadOne,saveMetadata,removeFiles){
    const paths=[],metadata=[];
    try{
      for(const file of files){
        const result=await uploadOne(file);
        paths.push(result.path);
        metadata.push(result.metadata);
      }
      if(metadata.length)await saveMetadata(metadata);
      return paths;
    }catch(cause){
      let cleanupError=null;
      if(paths.length){
        try{await removeFiles(paths)}catch(error){cleanupError=error}
      }
      const detail=cause&&cause.message?cause.message:"فشل غير متوقع أثناء رفع المرفقات.";
      const error=new Error(detail+(cleanupError
        ?" تعذر تنظيف كل الملفات المرفوعة تلقائيًا؛ يلزم فحص التخزين."
        :" تم تنظيف الملفات المرفوعة في هذه المحاولة."));
      error.cause=cause;
      error.cleanupFailed=!!cleanupError;
      throw error;
    }
  }
  const api={MAX_FILES,MAX_FILE_SIZE,ALLOWED_TYPES,validateFiles,uploadWithRollback};
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  if(root)root.MidaanSkillUploads=api;
})(typeof window!=="undefined"?window:null);
