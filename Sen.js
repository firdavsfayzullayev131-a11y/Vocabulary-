var VER='v1',CORE='avm-core-'+VER,RT='avm-rt-'+VER;
var FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CORE).then(function(c){return c.addAll(FILES)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CORE&&k!==RT}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
  var r=e.request;if(r.method!=='GET')return;var u=new URL(r.url);
  if(/anthropic\.com$|googleapis\.com$/.test(u.hostname)&&/generativelanguage|api\./.test(u.hostname))return;
  if(r.mode==='navigate'){
    e.respondWith(fetch(r).then(function(x){var c=x.clone();caches.open(CORE).then(function(ch){ch.put('index.html',c)});return x}).catch(function(){return caches.match('index.html').then(function(m){return m||caches.match('./')})}));return}
  e.respondWith(caches.match(r).then(function(m){
    var f=fetch(r).then(function(x){if(x&&(x.ok||x.type==='opaque')){var c=x.clone();caches.open(RT).then(function(ch){ch.put(r,c)})}return x}).catch(function(){return m});
    return m||f}))});
