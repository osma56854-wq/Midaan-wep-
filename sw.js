const CACHE="midaan-shell-v5";
const FILES=["./","./index.html","./app.js","./skill-upload-utils.js","./manifest.webmanifest","./midaan-icon.svg"];
const STATIC=/\/(?:index\.html|app\.js|skill-upload-utils\.js|manifest\.webmanifest|midaan-icon\.svg)$/;
const absolute=path=>new URL(path,self.registration.scope).href;
self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES.map(absolute))).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
  const request=event.request;
  if(request.method!=="GET")return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  if(request.mode==="navigate"){
    const key=absolute("./index.html");
    event.respondWith(fetch(request).then(response=>{
      if(response.ok)caches.open(CACHE).then(cache=>cache.put(key,response.clone()));
      return response;
    }).catch(()=>caches.match(key)));
    return;
  }
  if(STATIC.test(url.pathname)){
    event.respondWith(fetch(request).then(response=>{
      if(response.ok)caches.open(CACHE).then(cache=>cache.put(request,response.clone()));
      return response;
    }).catch(()=>caches.match(request)));
  }
});