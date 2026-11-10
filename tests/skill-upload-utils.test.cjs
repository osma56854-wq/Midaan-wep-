const test=require("node:test");
const assert=require("node:assert/strict");
const {MAX_FILES,MAX_FILE_SIZE,validateFiles,uploadWithRollback}=require("../skill-upload-utils.js");
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
test("uploads all files and persists metadata once on success",async()=>{
  const saved=[],removed=[];
  const paths=await uploadWithRollback([1,2],async n=>({path:"p"+n,metadata:{n}}),async rows=>saved.push(...rows),async items=>removed.push(...items));
  assert.deepEqual(paths,["p1","p2"]);
  assert.deepEqual(saved,[{n:1},{n:2}]);
  assert.deepEqual(removed,[]);
});
test("removes earlier uploads when a later upload fails",async()=>{
  const removed=[];let count=0;
  await assert.rejects(uploadWithRollback([1,2,3],async n=>{
    count++;if(n===3)throw new Error("network failure");return {path:"p"+n,metadata:{n}};
  },async()=>{},async paths=>removed.push(...paths)),/تم تنظيف الملفات/);
  assert.deepEqual(removed,["p1","p2"]);
});
test("removes all uploaded objects when metadata persistence fails",async()=>{
  const removed=[];
  await assert.rejects(uploadWithRollback([1,2],async n=>({path:"p"+n,metadata:{n}}),async()=>{throw new Error("metadata failure")},async paths=>removed.push(...paths)),/metadata failure.*تم تنظيف الملفات/);
  assert.deepEqual(removed,["p1","p2"]);
});
test("reports failed cleanup instead of claiming it succeeded",async()=>{
  await assert.rejects(uploadWithRollback([1],async()=>({path:"p1",metadata:{}}),async()=>{throw new Error("db failure")},async()=>{throw new Error("storage denied")}),error=>error.cleanupFailed===true&&/تعذر تنظيف/.test(error.message));
});
test("does not call cleanup when no object was uploaded",async()=>{
  let removed=false;
  await assert.rejects(uploadWithRollback([1],async()=>{throw new Error("upload failed")},async()=>{},async()=>{removed=true}),/upload failed/);
  assert.equal(removed,false);
});
