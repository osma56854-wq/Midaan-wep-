const test=require("node:test");
const assert=require("node:assert/strict");
const {MAX_FILES,MAX_FILE_SIZE,validateFiles}=require("../skill-upload-utils.js");
const file=(name,type,size)=>({name,type,size});
test("accepts supported image, video and PDF MIME types",()=>{
  const files=[file("a.jpg","image/jpeg",1),file("b.png","image/png",1),file("c.webp","image/webp",1),file("d.mp4","video/mp4",1),file("e.webm","video/webm",1)];
  assert.equal(validateFiles(files).length,5);
  assert.equal(validateFiles([file("manual.pdf","application/pdf",1)]).length,1);
});
test("rejects more than five files",()=>assert.throws(()=>validateFiles(Array.from({length:MAX_FILES+1},(_,i)=>file(i+".jpg","image/jpeg",1))),/5 ملفات/));
test("rejects unsupported MIME types",()=>assert.throws(()=>validateFiles([file("script.svg","image/svg+xml",1)]),/نوع ملف غير مدعوم/));
test("accepts exactly 25 MiB and rejects larger files",()=>{
  assert.equal(validateFiles([file("limit.pdf","application/pdf",MAX_FILE_SIZE)])[0].size,MAX_FILE_SIZE);
  assert.throws(()=>validateFiles([file("large.pdf","application/pdf",MAX_FILE_SIZE+1)]),/25 ميجابايت/);
});
test("rejects empty files",()=>assert.throws(()=>validateFiles([file("empty.pdf","application/pdf",0)]),/الملف فارغ/));
