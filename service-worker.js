if(!self.define){let e,i={};const n=(n,r)=>(n=new URL(n+".js",r).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(r,o)=>{const s=e||("document"in self?document.currentScript.src:"")||location.href;if(i[s])return;let c={};const t=e=>n(e,s),d={module:{uri:s},exports:c,require:t};i[s]=Promise.all(r.map((e=>d[e]||t(e)))).then((e=>(o(...e),c)))}}define(["./workbox-873c5e43"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"404.html",revision:"bf07de9313acb500b757b151d2c2d320"},{url:"751.js",revision:"89be16a9ec03be6a69e9256def4e64e8"},{url:"icons/favicon-32x32.png",revision:"80986bb228b2c208b4338b12c5db427a"},{url:"icons/favicon-32x32.svg",revision:"e4c5096b86abee1242d15363b679efda"},{url:"icons/shortcut-192x192.png",revision:"6bb7ab097f441e3653bff4deebaaa5f7"},{url:"icons/shortcut-512x512.png",revision:"5223ece5a9eb58256a802885f6188305"},{url:"images/loader.gif",revision:"69dad4bdf6e8163c136d4d7a98ac50e0"},{url:"index.html",revision:"89a755903348db0943b37fcfac142962"},{url:"main.js",revision:"2a0849fd523c15f89a5d89c9d2edce52"},{url:"manifest.webmanifest",revision:"3fbe9a098a07153f77847d7cba5d4067"}],{})}));
