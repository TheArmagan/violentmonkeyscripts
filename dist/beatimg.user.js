// ==UserScript==
// @name        beatimg 
// @namespace   beatimg
// @match       *://*/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @grant       GM_webRequest
// @grant       unsafeWindow
// @connect     *
// @version     0.0.1
// @author      TheArmagan
// @license     GPL-3.0-only
// @description 2026-08-16T00:33:33.444Z
// ==/UserScript==
(()=>{var Ot=`@charset "UTF-8";
/* BeatImg aray\xFCz stilleri.
 * G\xF6rsel efektlerin tamam\u0131 canvas'ta \xE7izilir; burada yaln\u0131zca panel,
 * tetik butonu ve tuvalin yerle\u015Fimi tan\u0131ml\u0131d\u0131r.
 */
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");
/* ------------------------------------------------------------------ */
/* Canvas sahnesi                                                      */
/* ------------------------------------------------------------------ */
.beatimg-stage {
  position: fixed !important;
  inset: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  pointer-events: none !important; /* sayfa her zaman kullan\u0131labilir kal\u0131r */
  opacity: 0;
  transition: opacity 0.25s ease !important;
  contain: layout style paint;
}
.beatimg-stage.visible {
  opacity: 1;
}

/* ------------------------------------------------------------------ */
/* Tetik butonu                                                        */
/* ------------------------------------------------------------------ */
.beatimg-toggle {
  position: fixed !important;
  top: 16px !important;
  right: 16px !important;
  width: 44px !important;
  height: 44px !important;
  border-radius: 50% !important;
  /* backdrop-filter bilerek kullan\u0131lm\u0131yor: alt\u0131nda tam ekran animasyonlu bir
     canvas varken taray\u0131c\u0131 her karede arka plan\u0131 yeniden bulan\u0131kla\u015Ft\u0131r\u0131r ve
     bu tek ba\u015F\u0131na belirgin kare d\xFC\u015Fmesine yol a\xE7ar. */
  background: rgb(14, 14, 26) !important;
  border: 1.5px solid rgba(108, 99, 255, 0.25) !important;
  color: #c0c0e0 !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 !important;
  margin: 0 !important;
  box-sizing: border-box !important;
  transition: border-color 0.2s, background 0.2s, color 0.2s !important;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5) !important;
}
.beatimg-toggle:hover {
  border-color: rgba(108, 99, 255, 0.7) !important;
  color: #ffffff !important;
  background: rgb(22, 20, 42) !important;
}
.beatimg-toggle.active {
  border-color: #6c63ff !important;
  background: rgba(108, 99, 255, 0.18) !important;
  color: #ffffff !important;
}
.beatimg-toggle svg {
  display: block !important;
  flex-shrink: 0 !important;
}
.beatimg-toggle.pulse-bass {
  animation: beatimg-pulse-bass 0.5s ease-out !important;
}
.beatimg-toggle.pulse-mid {
  animation: beatimg-pulse-mid 0.45s ease-out !important;
}
.beatimg-toggle.pulse-high {
  animation: beatimg-pulse-high 0.35s ease-out !important;
}

@keyframes beatimg-pulse-bass {
  from {
    box-shadow: 0 0 0 0 rgba(255, 59, 107, 0.85);
  }
  to {
    box-shadow: 0 0 0 22px rgba(255, 59, 107, 0);
  }
}
@keyframes beatimg-pulse-mid {
  from {
    box-shadow: 0 0 0 0 rgba(255, 148, 48, 0.85);
  }
  to {
    box-shadow: 0 0 0 22px rgba(255, 148, 48, 0);
  }
}
@keyframes beatimg-pulse-high {
  from {
    box-shadow: 0 0 0 0 rgba(124, 111, 255, 0.85);
  }
  to {
    box-shadow: 0 0 0 22px rgba(124, 111, 255, 0);
  }
}
/* ------------------------------------------------------------------ */
/* Panel                                                               */
/* ------------------------------------------------------------------ */
.beatimg-panel {
  position: fixed !important;
  top: 68px !important;
  right: 16px !important;
  width: 288px !important;
  background: rgb(10, 10, 18) !important;
  border: 1px solid rgba(255, 255, 255, 0.07) !important;
  border-radius: 18px !important;
  font-family: "Poppins", system-ui, -apple-system, sans-serif !important;
  font-size: 13px !important;
  line-height: 1.4 !important;
  color: #e4e4f0 !important;
  display: none !important;
  flex-direction: column !important;
  box-shadow: 0 32px 64px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.06) !important;
  max-height: calc(100vh - 92px) !important;
  overflow-y: auto !important;
  overscroll-behavior: contain !important;
}
.beatimg-panel.open {
  display: flex !important;
}
.beatimg-panel * {
  box-sizing: border-box !important;
  font-family: "Poppins", system-ui, -apple-system, sans-serif !important;
}

.beatimg-header {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 14px 16px 12px !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07) !important;
}

.beatimg-title {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  color: #e4e4f0 !important;
}

.beatimg-title-icon {
  font-size: 15px !important;
  line-height: 1 !important;
}

.beatimg-close-btn {
  background: none !important;
  border: none !important;
  color: #7878a0 !important;
  cursor: pointer !important;
  font-size: 14px !important;
  padding: 4px 7px !important;
  border-radius: 6px !important;
  line-height: 1 !important;
}
.beatimg-close-btn:hover {
  color: #e4e4f0 !important;
  background: rgba(255, 255, 255, 0.07) !important;
}

/* Durum \xE7ubu\u011Fu */
.beatimg-status-bar {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  padding: 10px 16px !important;
}

.beatimg-dot {
  width: 8px !important;
  height: 8px !important;
  border-radius: 50% !important;
  flex-shrink: 0 !important;
}
.beatimg-dot.idle {
  background: #7878a0 !important;
}
.beatimg-dot.connecting {
  background: #ffb800 !important;
  animation: beatimg-blink 0.7s infinite !important;
}
.beatimg-dot.active {
  background: #2bff9a !important;
  animation: beatimg-blink 1.4s infinite !important;
}
.beatimg-dot.error {
  background: #ff3b3b !important;
}

@keyframes beatimg-blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.25;
  }
}
.beatimg-status-text {
  flex: 1 !important;
  font-size: 12px !important;
  color: #7878a0 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.beatimg-badge {
  font-size: 11px !important;
  font-weight: 600 !important;
  color: #6c63ff !important;
  background: rgba(108, 99, 255, 0.12) !important;
  padding: 2px 9px !important;
  border-radius: 100px !important;
  white-space: nowrap !important;
}

.beatimg-visualizer {
  display: block !important;
  width: 100% !important;
  height: 54px !important;
  background: rgba(0, 0, 0, 0.35) !important;
  border-top: 1px solid rgba(255, 255, 255, 0.07) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07) !important;
}

/* Kaynak sekmeleri */
.beatimg-source-tabs {
  display: flex !important;
  gap: 4px !important;
  padding: 12px 16px 0 !important;
}

.beatimg-tab {
  flex: 1 !important;
  padding: 6px 8px !important;
  border-radius: 8px !important;
  border: 1px solid rgba(255, 255, 255, 0.07) !important;
  background: transparent !important;
  color: #7878a0 !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  transition: background 0.15s, color 0.15s, border-color 0.15s !important;
}
.beatimg-tab.active {
  background: rgba(108, 99, 255, 0.15) !important;
  color: #6c63ff !important;
  border-color: rgba(108, 99, 255, 0.4) !important;
}
.beatimg-tab:hover:not(.active) {
  background: rgba(255, 255, 255, 0.05) !important;
  color: #e4e4f0 !important;
}

/* Dosya alan\u0131 */
.beatimg-file-zone {
  padding: 10px 16px 0 !important;
  display: none;
}
.beatimg-file-zone.dragover .beatimg-drop-label {
  border-color: #6c63ff !important;
  background: rgba(108, 99, 255, 0.14) !important;
}

.beatimg-drop-label {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  gap: 5px !important;
  padding: 14px 10px !important;
  border: 1.5px dashed rgba(108, 99, 255, 0.35) !important;
  border-radius: 10px !important;
  background: rgba(108, 99, 255, 0.05) !important;
  cursor: pointer !important;
}
.beatimg-drop-label:hover {
  border-color: rgba(108, 99, 255, 0.65) !important;
  background: rgba(108, 99, 255, 0.1) !important;
}

.beatimg-drop-icon {
  font-size: 20px !important;
  line-height: 1 !important;
}

.beatimg-drop-text {
  font-size: 11px !important;
  color: #7878a0 !important;
  text-align: center !important;
}

.beatimg-audio-name {
  margin-top: 7px !important;
  min-height: 16px !important;
  font-size: 11px !important;
  font-weight: 500 !important;
  color: #2bff9a !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.beatimg-audio {
  display: block !important;
  width: 100% !important;
  height: 30px !important;
  margin-top: 8px !important;
  border-radius: 6px !important;
  outline: none !important;
  accent-color: #6c63ff !important;
  filter: invert(0.85) hue-rotate(220deg) !important;
}

/* Kayd\u0131r\u0131c\u0131lar */
.beatimg-controls {
  padding: 12px 16px 4px !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 9px !important;
}

.beatimg-control-row {
  display: flex !important;
  flex-direction: column !important;
  gap: 5px !important;
}
.beatimg-control-row label {
  font-size: 10px !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.08em !important;
  color: #7878a0 !important;
}

.beatimg-quality-row {
  padding: 6px 16px 2px !important;
}
.beatimg-quality-row select {
  background: rgba(255, 255, 255, 0.06) !important;
  color: #e4e4f0 !important;
  border: 1px solid rgba(255, 255, 255, 0.07) !important;
  border-radius: 8px !important;
  padding: 5px 8px !important;
  font-size: 11px !important;
  cursor: pointer !important;
  outline: none !important;
}

.beatimg-slider-row {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
}
.beatimg-slider-row input[type=range] {
  flex: 1 !important;
  height: 4px !important;
  -webkit-appearance: none !important;
  appearance: none !important;
  background: rgba(255, 255, 255, 0.1) !important;
  border-radius: 2px !important;
  outline: none !important;
  border: none !important;
  cursor: pointer !important;
}
.beatimg-slider-row input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none !important;
  width: 14px !important;
  height: 14px !important;
  border-radius: 50% !important;
  background: #6c63ff !important;
  box-shadow: 0 0 8px rgba(108, 99, 255, 0.6) !important;
  cursor: pointer !important;
}
.beatimg-slider-row input[type=range]::-moz-range-thumb {
  width: 14px !important;
  height: 14px !important;
  border-radius: 50% !important;
  background: #6c63ff !important;
  border: none !important;
  cursor: pointer !important;
}
.beatimg-slider-row .beatimg-sval {
  font-size: 11px !important;
  font-weight: 600 !important;
  color: #6c63ff !important;
  min-width: 44px !important;
  text-align: right !important;
}

/* Anahtarlar */
.beatimg-toggles {
  display: grid !important;
  grid-template-columns: 1fr 1fr !important;
  gap: 4px 10px !important;
  padding: 10px 16px 2px !important;
}

.beatimg-toggle-row {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 6px !important;
  font-size: 11px !important;
  color: #7878a0 !important;
  cursor: pointer !important;
}
.beatimg-toggle-row:hover {
  color: #e4e4f0 !important;
}
.beatimg-toggle-row input {
  accent-color: #6c63ff !important;
  cursor: pointer !important;
  margin: 0 !important;
}

/* Butonlar */
.beatimg-btn-row {
  display: flex !important;
  gap: 8px !important;
  padding: 12px 16px 0 !important;
}
.beatimg-btn-row button {
  flex: 1 !important;
  padding: 9px 0 !important;
  border-radius: 10px !important;
  border: none !important;
  cursor: pointer !important;
  font-size: 12px !important;
  font-weight: 700 !important;
  transition: opacity 0.15s, transform 0.1s, box-shadow 0.2s !important;
}
.beatimg-btn-row button:active:not(:disabled) {
  transform: scale(0.96) !important;
}
.beatimg-btn-row button:disabled {
  opacity: 0.3 !important;
  cursor: not-allowed !important;
}

.beatimg-start-btn {
  background: #6c63ff !important;
  color: #fff !important;
  box-shadow: 0 4px 16px rgba(108, 99, 255, 0.35) !important;
}
.beatimg-start-btn:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(108, 99, 255, 0.55) !important;
}

.beatimg-stop-btn {
  background: rgba(255, 59, 59, 0.12) !important;
  color: #ff3b3b !important;
  border: 1px solid rgba(255, 59, 59, 0.2) !important;
}
.beatimg-stop-btn:hover:not(:disabled) {
  background: rgba(255, 59, 59, 0.22) !important;
}

.beatimg-clear-btn {
  background: rgba(120, 120, 160, 0.1) !important;
  color: #7878a0 !important;
  border: 1px solid rgba(120, 120, 160, 0.18) !important;
  font-size: 11px !important;
  font-weight: 600 !important;
}
.beatimg-clear-btn:hover {
  background: rgba(255, 59, 59, 0.12) !important;
  color: #ff3b3b !important;
  border-color: rgba(255, 59, 59, 0.25) !important;
}

/* Alt bilgi */
.beatimg-stats {
  display: flex !important;
  justify-content: space-between !important;
  gap: 6px !important;
  padding: 12px 16px 0 !important;
  font-size: 10px !important;
  font-weight: 600 !important;
  letter-spacing: 0.04em !important;
  color: #7878a0 !important;
  font-variant-numeric: tabular-nums !important;
}

.beatimg-hint {
  padding: 8px 16px 14px !important;
  font-size: 10px !important;
  color: rgba(120, 120, 160, 0.65) !important;
  text-align: center !important;
}`;document.head.appendChild(document.createElement("style")).appendChild(document.createTextNode(Ot));var p="beatimg-",F={stage:2147483642,panel:2147483644,toggle:2147483645},q={sourceMode:"mic",sensitivity:1.45,cooldown:150,intensity:1,sceneImages:4,scrollRows:3,particles:!0,flash:!0,shake:!0,scroll:!0,quality:"auto"},G=[{key:"sub",lo:20,hi:60},{key:"bass",lo:60,hi:180},{key:"lowMid",lo:180,hi:600},{key:"mid",lo:600,hi:2e3},{key:"high",lo:2e3,hi:7e3},{key:"air",lo:7e3,hi:16e3}],wt={bass:3,mid:2,high:1},U={bass:{hex:"#ff3b6b",rgb:[255,59,107]},mid:{hex:"#ff9430",rgb:[255,148,48]},high:{hex:"#7c6fff",rgb:[124,111,255]}},C={minNatural:100,minRendered:80,maxImages:400,scanDebounce:800,scanMinGap:4e3,bgScanUntil:60,bgScanGap:2e4,bgScanChunk:250,bgScanMax:3e3},A={maxDecoded:60,storeMax:2048,maxConcurrent:6,tintMaxDim:512,maxTintEntries:16,thumbStep:256,thumbMax:2048,maxThumbs:48},rt={maxDpr:1.5,qualityHoldMs:2500};var j="beatimg:settings:v2";function Pt(){try{if(typeof GM_getValue=="function"){let i=GM_getValue(j,null);if(i!=null)return i}}catch{}try{return localStorage.getItem(j)}catch{}return null}function Lt(i){try{if(typeof GM_setValue=="function"){GM_setValue(j,i);return}}catch{}try{localStorage.setItem(j,i)}catch{}}function Dt(){let i=Pt();if(!i)return{...q};try{let t=typeof i=="string"?JSON.parse(i):i,e={...q};for(let s of Object.keys(q))t&&typeof t[s]==typeof q[s]&&(e[s]=t[s]);return e}catch{return{...q}}}var k=Dt(),xt=null;function vt(i,t){i in q&&(k[i]=t,clearTimeout(xt),xt=setTimeout(()=>Lt(JSON.stringify(k)),250))}var d=(i,t,e)=>i<t?t:i>e?e:i,g=(i,t,e)=>i+(t-i)*e;function M(i=1,t){return t===void 0?Math.random()*i:i+Math.random()*(t-i)}function H(i,t){return Math.floor(M(i,t+1))}function O(i){return i[Math.random()*i.length|0]}function _t(i){let t=[...i];for(let e=t.length-1;e>0;e--){let s=Math.random()*(e+1)|0,n=t[e];t[e]=t[s],t[s]=n}return t}function lt(i){let t=i>>>0;return function(){t=t+1831565813>>>0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function ht(i,t,e,s){if(e<=0)return t;let n=1-Math.pow(.5,s/e);return i+(t-i)*n}function kt(i){if(!i.length)return 0;let t=[...i].sort((s,n)=>s-n),e=t.length>>1;return t.length%2?t[e]:(t[e-1]+t[e])/2}var w={linear:i=>i,outCubic:i=>1-Math.pow(1-i,3),outQuint:i=>1-Math.pow(1-i,5),outExpo:i=>i>=1?1:1-Math.pow(2,-10*i),inCubic:i=>i*i*i,inOutCubic:i=>i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2,outBack:(i,t=1.9)=>1+(t+1)*Math.pow(i-1,3)+t*Math.pow(i-1,2),outElastic:i=>i<=0||i>=1?i:Math.pow(2,-9*i)*Math.sin((i*10-.75)*(2*Math.PI/3))+1,steps:i=>t=>Math.min(1,Math.floor(t*i)/(i-1||1))};function P(i,t,e){let s=document.createElement(i);return t&&(s.className=t),e!=null&&(s.innerHTML=e),s}function x(i,t,e,s){return i.addEventListener(t,e,s),()=>i.removeEventListener(t,e,s)}function W(i,t=1e3){return typeof requestIdleCallback=="function"?requestIdleCallback(i,{timeout:t}):setTimeout(i,1)}function Mt(i){if(!i)return null;try{return new URL(i,location.href).href}catch{return null}}var X=class{constructor(){this.entries=new Map,this._queue=[],this._active=0,this._tintOwners=[],this._thumbs=[],this.thumbBudget=2}entry(t){let e=this.entries.get(t);return e||(e={src:t,img:null,state:"idle",w:0,h:0,used:0,tints:new Map,thumbs:new Map},this.entries.set(t,e)),e}ready(t){let e=this.entry(t);return e.state==="ready"?(e.used=performance.now(),e):(e.state==="idle"&&this.load(t),null)}load(t){let e=this.entry(t);e.state==="ready"||e.state==="loading"||e.state!=="error"&&(e.state="loading",this._queue.push(e),this._drain())}preload(t){for(let e of t){let s=this.entries.get(e);(!s||s.state==="idle")&&this.load(e)}}_drain(){for(;this._active<A.maxConcurrent&&this._queue.length;){let t=this._queue.shift();this._active++,this._fetch(t).finally(()=>{this._active--,this._drain()})}}async _fetch(t){let e=new Image;e.decoding="async",e.referrerPolicy="no-referrer-when-downgrade";let s=new Promise(l=>{e.onload=()=>l(!0),e.onerror=()=>l(!1)});e.src=t.src;let n=await s;if(n&&typeof e.decode=="function")try{await e.decode()}catch{}let a=e.naturalWidth||0,r=e.naturalHeight||0;if(!n||!a||!r){t.state="error",t.img=null;return}let o=Math.max(a,r);if(o>A.storeMax){let l=A.storeMax/o,h=Math.max(1,Math.round(a*l)),c=Math.max(1,Math.round(r*l)),u=document.createElement("canvas");u.width=h,u.height=c;let m=u.getContext("2d");if(m){m.imageSmoothingQuality="high",m.drawImage(e,0,0,h,c),t.img=u,t.w=h,t.h=c,t.state="ready",t.used=performance.now(),this._prune();return}}t.img=e,t.w=a,t.h=r,t.state="ready",t.used=performance.now(),this._prune()}_prune(){let t=[];for(let s of this.entries.values())s.state==="ready"&&t.push(s);if(t.length<=A.maxDecoded)return;t.sort((s,n)=>s.used-n.used);let e=t.length-A.maxDecoded;for(let s=0;s<e;s++){let n=t[s];n.img=null,n.state="idle",n.tints.clear(),n.thumbs.clear()}this._thumbs=this._thumbs.filter(s=>s.entry.state==="ready")}source(t,e,s){if(t.state!=="ready"||!t.img)return null;let n=Math.max(t.w,t.h),a=Math.max(e,s)*1.35;if(n<=a*1.2)return{img:t.img,w:t.w,h:t.h};let r=A.thumbStep,o=Math.min(A.thumbMax,n,Math.max(r,Math.ceil(a/r)*r)),l=t.thumbs.get(o);if(l)return t.used=performance.now(),l;if(this.thumbBudget<=0)return{img:t.img,w:t.w,h:t.h};this.thumbBudget--;let h=o/n,c=Math.max(1,Math.round(t.w*h)),u=Math.max(1,Math.round(t.h*h)),m=document.createElement("canvas");m.width=c,m.height=u;let f=m.getContext("2d");if(!f)return{img:t.img,w:t.w,h:t.h};f.imageSmoothingQuality="medium",f.drawImage(t.img,0,0,c,u);let b={img:m,w:c,h:u};for(t.thumbs.set(o,b),this._thumbs.push({entry:t,key:o});this._thumbs.length>A.maxThumbs;){let y=this._thumbs.shift();y.entry.thumbs.delete(y.key)}return b}tinted(t,e){if(t.state!=="ready"||!t.img)return null;let s=t.tints.get(e);if(s)return s;let n=Math.min(1,A.tintMaxDim/Math.max(t.w,t.h)),a=Math.max(1,Math.round(t.w*n)),r=Math.max(1,Math.round(t.h*n)),o=document.createElement("canvas");o.width=a,o.height=r;let l=o.getContext("2d");if(!l)return null;let h=t.thumbs.get([...t.thumbs.keys()][0])||{img:t.img,w:t.w,h:t.h};if(l.drawImage(h.img,0,0,a,r),l.globalCompositeOperation="multiply",l.fillStyle=e,l.fillRect(0,0,a,r),l.globalCompositeOperation="destination-in",l.drawImage(h.img,0,0,a,r),t.tints.set(e,o),!this._tintOwners.includes(t))for(this._tintOwners.push(t);this._tintOwners.length>A.maxTintEntries;)this._tintOwners.shift().tints.clear();return o}clear(){this.entries.clear(),this._queue.length=0,this._tintOwners.length=0,this._thumbs.length=0}};var Q=`.${p}stage, .${p}panel, .${p}toggle`,Nt=/url\(\s*(['"]?)([^'")]+)\1\s*\)/,V=class{constructor(t){this.cache=t,this.seen=new Set,this.list=[],this.onChange=null,this._queue=[],this._scrollQueue=[],this._lastFullScan=0,this._lastBgScan=0,this._sweeping=!1,this._io=null,this._mo=null,this._destroyed=!1}get size(){return this.list.length}start(){this._setupIntersection(),this._setupMutation(),this.scan(!0)}destroy(){this._destroyed=!0,this._io?.disconnect(),this._mo?.disconnect(),this._io=null,this._mo=null}_setupIntersection(){this._io=new IntersectionObserver(t=>{let e=!1;for(let s of t)s.isIntersecting&&this._addImgEl(s.target,s.boundingClientRect)&&(e=!0,this._io.unobserve(s.target));e&&this._notify()},{threshold:.01,rootMargin:"200px"}),this._observeAll(document)}_setupMutation(){this._mo=new MutationObserver(t=>{for(let e of t)for(let s of e.addedNodes)s.nodeType===1&&(s.closest?.(Q)||(s.tagName==="IMG"?this._observe(s):s.childElementCount&&s.querySelectorAll("img").forEach(n=>this._observe(n))))}),this._mo.observe(document.documentElement,{childList:!0,subtree:!0})}_observeAll(t){t.querySelectorAll?.("img").forEach(e=>this._observe(e))}_observe(t){if(!(!this._io||t.closest(Q)))try{this._io.observe(t)}catch{}}scan(t=!1){if(this._destroyed)return;let e=performance.now();!t&&e-this._lastFullScan<C.scanMinGap||(this._lastFullScan=e,W(()=>{if(this._destroyed)return;let s=!1;for(let n of document.querySelectorAll("img"))this._observe(n),this._addImgEl(n)&&(s=!0);s&&this._notify(),this.list.length<C.bgScanUntil&&e-this._lastBgScan>C.bgScanGap&&(this._lastBgScan=e,this._sweepBackgrounds())},1200))}_sweepBackgrounds(){if(this._sweeping||!document.body)return;this._sweeping=!0;let t=document.body.querySelectorAll("*"),e=Math.min(t.length,C.bgScanMax),s=0,n=()=>{if(this._destroyed){this._sweeping=!1;return}let a=Math.min(e,s+C.bgScanChunk),r=!1;for(;s<a;s++){let o=t[s];if(o.offsetWidth<C.minRendered||o.offsetHeight<C.minRendered)continue;let l=getComputedStyle(o).backgroundImage;if(!l||l==="none"||l.indexOf("url(")===-1||o.closest(Q))continue;let h=Nt.exec(l);h&&this._add(h[2])&&(r=!0)}r&&this._notify(),s<e?W(n,800):this._sweeping=!1};W(n,800)}_addImgEl(t,e){let s=t.currentSrc||t.src;if(!s||t.naturalWidth&&(t.naturalWidth<C.minNatural||t.naturalHeight<C.minNatural))return!1;let n=e?e.width:t.offsetWidth,a=e?e.height:t.offsetHeight;return n<C.minRendered||a<C.minRendered||t.closest(Q)?!1:this._add(s)}_add(t){if(this.list.length>=C.maxImages)return!1;let e=Mt(t);return!e||e.startsWith("data:image/svg")||e.startsWith("blob:null")||this.seen.has(e)?!1:(this.seen.add(e),this.list.push(e),!0)}_drop(t){if(!this.seen.delete(t))return;let e=this.list.indexOf(t);e>=0&&this.list.splice(e,1),this.onChange?.(this.list.length)}_notify(){this.cache.preload(this.list.slice(-24)),this.onChange?.(this.list.length)}clear(){this.seen.clear(),this.list.length=0,this._queue.length=0,this._scrollQueue.length=0,this.onChange?.(0),this.scan(!0)}_dequeue(t,e){let s=[],n=this[t];if(!this.list.length)return s;let a=0;for(;s.length<e&&a++<e*4;){n.length||n.push(..._t(this.list));let r=n.shift();this.seen.has(r)&&s.push(r)}return s}takeReady(t){if(!this.list.length)return[];let e=[],s=[],n=Math.min(t,this.list.length),a=this._dequeue("_queue",Math.max(n*3,n+6));for(let r of a){if(this.cache.entries.get(r)?.state==="error"){this._drop(r);continue}let o=this.cache.ready(r);if(o?e.length<n&&e.push(o):s.length<n&&s.push(r),e.length>=n)break}return this.cache.preload(s),e}nextScrollSrc(){let[t]=this._dequeue("_scrollQueue",1);return t||null}};var L=null,St=new WeakMap;function ct(){if(!L){let i=window.AudioContext||window.webkitAudioContext;if(!i)throw new Error("Web Audio API is not supported in this browser");L=new i}return L}async function Y(){let i=ct();if(i.state==="suspended")try{await i.resume()}catch{}return i.state==="running"}var Z=class{constructor({fftSize:t=2048,smoothing:e=.62}={}){this.fftSize=t,this.smoothing=e,this.analyser=null,this.stream=null,this.source=null,this.mode=null,this.element=null}get sampleRate(){return L?L.sampleRate:44100}_makeAnalyser(t){let e=t.createAnalyser();return e.fftSize=this.fftSize,e.smoothingTimeConstant=this.smoothing,e.minDecibels=-100,e.maxDecibels=-12,e}async startMic(){if(!navigator.mediaDevices?.getUserMedia)throw new Error("Microphone API unavailable (needs HTTPS)");let t=ct();return await Y(),this.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1,channelCount:1},video:!1}),this.analyser=this._makeAnalyser(t),this.source=t.createMediaStreamSource(this.stream),this.source.connect(this.analyser),this.mode="mic",!0}async startElement(t){let e=ct();await Y();let s=St.get(t);return s||(s=e.createMediaElementSource(t),s.connect(e.destination),St.set(t,s)),this.analyser=this._makeAnalyser(e),s.connect(this.analyser),this.source=s,this.element=t,this.mode="element",!0}stop(){if(this.source&&this.analyser)try{this.source.disconnect(this.analyser)}catch{}if(this.mode==="mic"){try{this.source?.disconnect()}catch{}this.stream?.getTracks().forEach(t=>t.stop())}this.stream=null,this.source=null,this.analyser=null,this.element=null,this.mode=null}};var Gt=48,pt=class{constructor(t){this.buf=new Float32Array(t),this.n=t,this.i=0,this.count=0}push(t){this.buf[this.i]=t,this.i=(this.i+1)%this.n,this.count<this.n&&this.count++}stats(){let t=this.count;if(!t)return{mean:0,std:0};let e=0;for(let a=0;a<t;a++)e+=this.buf[a];let s=e/t,n=0;for(let a=0;a<t;a++){let r=this.buf[a]-s;n+=r*r}return{mean:s,std:Math.sqrt(n/t)}}reset(){this.buf.fill(0),this.i=0,this.count=0}},Ut=[{type:"bass",bands:["sub","bass"],cdScale:1,senScale:1,floor:.004},{type:"mid",bands:["lowMid","mid"],cdScale:.72,senScale:1.12,floor:.0018},{type:"high",bands:["high","air"],cdScale:.5,senScale:1.25,floor:6e-4}],Ct=.03,K=class{constructor({sensitivity:t=1.45,cooldown:e=150}={}){this.sensitivity=t,this.cooldown=e,this.graph=null,this.running=!1,this.onBeat=null,this.onFrame=null,this._freq=null,this._bytes=null,this._prevMag=null,this._ranges=null,this._flux=new Map,this._prevFlux=new Map,this._levels={},this._lastBeat={bass:0,mid:0,high:0},this._intervals=[],this.bpm=0,this.bpmConfidence=0,this._lastFrameTime=0,this.level=0,this.peak=0,this.wantSpectrum=!1}attach(t){this.graph=t;let e=t.analyser;if(!e)throw new Error("AudioGraph has no analyser");let s=e.frequencyBinCount;this._freq=new Float32Array(s),this._bytes=new Uint8Array(s),this._prevMag=new Float32Array(s);let n=t.sampleRate/2;this._ranges={};for(let a of G){let r=d(Math.floor(a.lo/n*s),0,s-1),o=d(Math.ceil(a.hi/n*s),r+1,s-1);this._ranges[a.key]=[r,o],this._flux.set(a.key,new pt(Gt)),this._prevFlux.set(a.key,0),this._levels[a.key]=0}this.reset(),this.running=!0}reset(){for(let t of this._flux.values())t.reset();for(let t of this._prevFlux.keys())this._prevFlux.set(t,0);for(let t of Object.keys(this._levels))this._levels[t]=0;this._prevMag?.fill(0),this._lastBeat={bass:0,mid:0,high:0},this._intervals.length=0,this._lastIntervalTime=0,this.bpm=0,this.bpmConfidence=0,this.level=0,this.peak=0,this._lastFrameTime=0}detach(){this.running=!1,this.graph=null}setSensitivity(t){this.sensitivity=d(parseFloat(t)||1.45,.4,4)}setCooldown(t){this.cooldown=d(parseInt(t,10)||150,20,1500)}tick(t){let e=this.graph?.analyser;if(!this.running||!e)return;let s=this._lastFrameTime?d((t-this._lastFrameTime)/1e3,.001,.1):.016;this._lastFrameTime=t,e.getFloatFrequencyData(this._freq),this.wantSpectrum&&e.getByteFrequencyData(this._bytes);let n=this._freq,a=this._prevMag,r={},o={},l=0;for(let h of G){let[c,u]=this._ranges[h.key],m=0,f=0;for(let y=c;y<=u;y++){let S=n[y],_=S<=-100||!isFinite(S)?0:Math.pow(10,S/20);m+=_;let E=_-a[y];E>0&&(f+=E),a[y]=_}let b=u-c+1;m/=b,f/=Math.sqrt(b),r[h.key]=m,o[h.key]=f,this._levels[h.key]=ht(this._levels[h.key],d(m*14,0,1),.08,s),l+=m}this.level=ht(this.level,d(l/G.length*12,0,1),.1,s),this.peak=Math.max(this.peak*.94,this.level),this.onFrame?.({levels:this._levels,bands:r,spectrum:this._bytes,level:this.level,peak:this.peak,bpm:this.bpm,bpmConfidence:this.bpmConfidence,dt:s}),this._detect(t,r,o)}_detect(t,e,s){let n=this.level<Ct;for(let o of Ut){if(n)continue;let l=0,h=0,c=0,u=0;for(let _ of o.bands){let E=s[_];l+=E,h+=e[_];let z=this._flux.get(_),{mean:B,std:T}=z.stats();c+=B+T*1.2,u+=T,z.push(E)}l/=o.bands.length,h/=o.bands.length,c/=o.bands.length,u/=o.bands.length;let m=this.sensitivity*o.senScale,f=c*m+1e-5,b=this._prevFlux.get(o.type)||0;this._prevFlux.set(o.type,l);let y=this.cooldown*o.cdScale;if(t-this._lastBeat[o.type]<y||h<o.floor||l<=f||l<b)continue;this._lastBeat[o.type]=t,o.type==="bass"&&this._registerInterval(t);let S=d((l-f)/(f+u+1e-5),0,1);this.onBeat?.({type:o.type,strength:.35+S*.65,energy:h,flux:l,level:this.level,bpm:this.bpm})}let a=Math.max(this._lastBeat.bass,this._lastBeat.mid,this._lastBeat.high),r=this.bpm>0?d(6e4/this.bpm,250,1200):800;if(this.level>Ct*2&&t-a>r*1.6){let o=e.bass>=e.mid&&e.bass>=e.high?"bass":e.mid>=e.high?"mid":"high";this._lastBeat[o]=t,this.onBeat?.({type:o,strength:d(.3+this.level,0,1),energy:e[o]??this.level,flux:0,level:this.level,bpm:this.bpm,synthetic:!0})}}_registerInterval(t){let e=this._lastIntervalTime||0;if(this._lastIntervalTime=t,!e)return;let s=t-e;if(s<200||s>2e3||(this._intervals.push(s),this._intervals.length>16&&this._intervals.shift(),this._intervals.length<4))return;let n=kt(this._intervals),a=this._intervals.filter(l=>Math.abs(l-n)<n*.22);if(a.length<3){this.bpmConfidence=Math.max(0,this.bpmConfidence-.1);return}let o=6e4/(a.reduce((l,h)=>l+h,0)/a.length);for(;o<70;)o*=2;for(;o>190;)o/=2;this.bpm=Math.round(o),this.bpmConfidence=d(a.length/this._intervals.length,0,1)}};function mt(i,t,e,s){let n=Math.max(e/i,s/t),a=e/n,r=s/n;return{sx:(i-a)/2,sy:(t-r)/2,sw:a,sh:r}}function R(i,t,e,s,n,a,r,o,l="cover"){if(!(!e||!s||r<=0||o<=0))if(l==="contain"){let h=Math.min(r/e,o/s),c=e*h,u=s*h;i.drawImage(t,n+(r-c)/2,a+(o-u)/2,c,u)}else{let{sx:h,sy:c,sw:u,sh:m}=mt(e,s,r,o);i.drawImage(t,h,c,u,m,n,a,r,o)}}var jt=[["#ff0000",-1],["#00ff00",0],["#0000ff",1]],J=class{constructor(t){this.cache=t,this.scratch=document.createElement("canvas"),this.sctx=this.scratch.getContext("2d"),this.quality=2}paint(t,e,s,n){if(!e.img)return;let a=this.cache.source(e,s.w,s.h);if(!a)return;let{x:r,y:o,w:l,h,fit:c}=s;if(n.wipe&&(t.save(),this._clipWipe(t,n.wipe,r,o,l,h)),n.echo>0&&this.quality>0&&this._echo(t,a,s,n),n.blocks&&this.quality>0?this._blocks(t,a,s,n.blocks):n.slices&&this.quality>0?this._slices(t,a,s,n.slices):n.roll?this._roll(t,a,s,n.roll):n.pixel>1.5&&this.quality>0?this._pixel(t,a,s,n.pixel):n.rgbSplit>.5&&this.quality>1?this._rgb(t,e,a,s,n.rgbSplit):R(t,a.img,a.w,a.h,r,o,l,h,c),n.glow>.01){let u=t.globalCompositeOperation,m=t.globalAlpha;t.globalCompositeOperation="lighter",t.globalAlpha=m*d(n.glow,0,1),R(t,a.img,a.w,a.h,r,o,l,h,c),t.globalCompositeOperation=u,t.globalAlpha=m}if(n.tint&&n.tintAlpha>.01){let u=t.globalCompositeOperation,m=t.globalAlpha;t.globalCompositeOperation=n.tintMode||"overlay",t.globalAlpha=m*d(n.tintAlpha,0,1),t.fillStyle=n.tint,t.fillRect(r,o,l,h),t.globalCompositeOperation=u,t.globalAlpha=m}n.wipe&&t.restore()}_echo(t,e,s,n){let a=Math.min(4,Math.round(n.echo)),r=t.globalAlpha,o=t.globalCompositeOperation;t.globalCompositeOperation="lighter";for(let l=a;l>=1;l--){let h=l/(a+1),c=1+h*(n.echoScale??.16),u=s.w*c,m=s.h*c;t.globalAlpha=r*.24*(1-h),R(t,e.img,e.w,e.h,s.x-(u-s.w)/2+(n.echoDx||0)*h,s.y-(m-s.h)/2+(n.echoDy||0)*h,u,m,s.fit)}t.globalAlpha=r,t.globalCompositeOperation=o}_rgb(t,e,s,n,a){let{x:r,y:o,w:l,h,fit:c}=n,u=t.globalCompositeOperation;t.globalCompositeOperation="lighter";let m=!1;for(let[f,b]of jt){let y=this.cache.tinted(e,f);y&&(m=!0,R(t,y,y.width,y.height,r+b*a,o+b*a*.35,l,h,c))}t.globalCompositeOperation=u,m||R(t,s.img,s.w,s.h,r,o,l,h,c)}_pixel(t,e,s,n){let{x:a,y:r,w:o,h:l,fit:h}=s,c=d(n,2,64),u=Math.max(2,Math.round(o/c)),m=Math.max(2,Math.round(l/c)),f=this.scratch;(f.width<u||f.height<m)&&(f.width=Math.max(f.width,u,64),f.height=Math.max(f.height,m,64));let b=this.sctx;b.clearRect(0,0,u,m),b.imageSmoothingEnabled=!0,R(b,e.img,e.w,e.h,0,0,u,m,h);let y=t.imageSmoothingEnabled;t.imageSmoothingEnabled=!1,t.drawImage(f,0,0,u,m,a,r,o,l),t.imageSmoothingEnabled=y}_slices(t,e,s,n){let{x:a,y:r,w:o,h:l,fit:h}=s,c=!!n.vertical,u=d(Math.round(n.n||8),2,16),m=n.amp||0,f=lt(s.seed),b=h==="contain"?null:mt(e.w,e.h,o,l),y=b?b.sx:0,S=b?b.sy:0,_=b?b.sw:e.w,E=b?b.sh:e.h;for(let z=0;z<u;z++){let B=z/u,T=(f()*2-1)*m;c?t.drawImage(e.img,y+_*B,S,_/u,E,a+o*B,r+T,o/u+.6,l):t.drawImage(e.img,y,S+E*B,_,E/u,a+T,r+l*B,o,l/u+.6)}}_blocks(t,e,s,n){let{x:a,y:r,w:o,h:l}=s,h=d(Math.round(n.cols||6),2,10),c=d(Math.round(n.rows||5),2,8),u=n.amp||0,m=lt(s.seed+(n.frame||0)),f=mt(e.w,e.h,o,l);for(let b=0;b<c;b++)for(let y=0;y<h;y++){let S=m(),_=S<.45?(m()*2-1)*u:0,E=S>.85?(m()*2-1)*u*.35:0;t.drawImage(e.img,f.sx+f.sw*y/h,f.sy+f.sh*b/c,f.sw/h,f.sh/c,a+o*y/h+_,r+l*b/c+E,o/h+.6,l/c+.6)}}_roll(t,e,s,n){let{x:a,y:r,w:o,h:l,fit:h}=s,c=(n%1+1)%1;t.save(),t.beginPath(),t.rect(a,r,o,l),t.clip(),R(t,e.img,e.w,e.h,a,r+l*c,o,l,h),R(t,e.img,e.w,e.h,a,r+l*c-l,o,l,h),t.restore()}_clipWipe(t,e,s,n,a,r){let o=d(e.p,0,1);switch(t.beginPath(),e.dir){case"left":t.rect(s,n,a*o,r);break;case"right":t.rect(s+a*(1-o),n,a*o,r);break;case"up":t.rect(s,n,a,r*o);break;default:t.rect(s,n+r*(1-o),a,r*o);break}t.clip()}};var v=(i,t,e,s)=>({x:i,y:t,w:e,h:s});function ut(i,t){let e=Math.ceil(i/t),s=[];for(let n=0;n<i;n++){let a=n%t,r=n/t|0,l=1/Math.min(t,i-r*t);s.push(v(a*l,r/e,l,1/e))}return s}function Ht(i){return Array.from({length:i},(t,e)=>v(0,e/i,1,1/i))}function Wt(i){return Array.from({length:i},(t,e)=>v(e/i,0,1/i,1))}function Et(i,t="left"){if(i<2)return null;let e=i<=3?.64:.58,s=i-1,n=[],a=t==="left"?0:1-e,r=t==="left"?e:0;n.push(v(a,0,e,1));for(let o=0;o<s;o++)n.push(v(r,o/s,1-e,1/s));return n}function Xt(i){if(i<5)return null;let t=[v(.22,.2,.56,.6)],e=[v(0,0,.22,.5),v(.78,0,.22,.5),v(0,.5,.22,.5),v(.78,.5,.22,.5),v(.22,0,.56,.2),v(.22,.8,.56,.2)];for(let s=0;s<i-1&&s<e.length;s++)t.push(e[s]);return t.length===i?t:null}function dt(i){let t=[v(0,0,1,1)];for(;t.length<i;){let e=0;for(let a=1;a<t.length;a++)t[a].w*t[a].h>t[e].w*t[e].h&&(e=a);let s=t.splice(e,1)[0],n=M(.36,.64);s.w>=s.h?t.push(v(s.x,s.y,s.w*n,s.h),v(s.x+s.w*n,s.y,s.w*(1-n),s.h)):t.push(v(s.x,s.y,s.w,s.h*n),v(s.x,s.y+s.h*n,s.w,s.h*(1-n)))}return t}var Qt=[i=>i===1?[v(0,0,1,1)]:null,i=>i>=2&&i<=6?Ht(i):null,i=>i>=2&&i<=5?Wt(i):null,i=>i>=2?Et(i,"left"):null,i=>i>=2?Et(i,"right"):null,i=>i>=4?ut(i,2):null,i=>i>=5?ut(i,3):null,i=>i>=7?ut(i,4):null,i=>Xt(i),i=>i>=2?dt(i):null,i=>i>=3?dt(i):null];function At(i,t){let e=Math.max(1,i),s=Qt.map(h=>h(e)).filter(Boolean),n=s.length?O(s):dt(e),a=t.gap??6,r=t.pad??4,o=t.w-r*2,l=t.h-r*2;return n.slice(0,e).map(h=>({x:r+h.x*o+a/2,y:r+h.y*l+a/2,w:Math.max(24,h.w*o-a),h:Math.max(24,h.h*l-a)}))}function $t(i,t,e){let n=({bass:3,mid:4,high:5}[i]??3)+H(-1,1)+(t>.75?1:0);return Math.max(1,Math.min(e,n))}var $=i=>i%2===0?1:-1,Rt=[{name:"slam",bands:["bass"],stagger:.03,transform:(i,t,e)=>{let s=w.outBack(Math.min(1,i*3.2),2.4);return{sx:g(.55,1,s),sy:g(.55,1,s),rot:$(t.i)*.1*(1-s)*e.intensity,glow:.35*(1-Math.min(1,i*4))}}},{name:"zoomCrush",bands:["bass"],stagger:.05,transform:(i,t,e)=>{let s=w.outExpo(Math.min(1,i*2.4)),n=g(2.4*e.intensity,1,s);return{sx:n,sy:n,alpha:Math.min(1,i*6),rgbSplit:14*(1-s)*e.intensity}}},{name:"dropIn",bands:["bass"],stagger:.05,transform:(i,t)=>{let e=w.outBack(Math.min(1,i*2.6),2);return{dy:g(-t.view.h*.9,0,e),rot:$(t.i)*.06*(1-e)}}},{name:"vortex",bands:["bass"],stagger:.045,transform:(i,t,e)=>{let s=w.outBack(Math.min(1,i*2.2),1.6);return{rot:$(t.i)*2.6*(1-s)*e.intensity,sx:g(.15,1,s),sy:g(.15,1,s)}}},{name:"earthquake",bands:["bass"],stagger:.01,transform:(i,t,e)=>{let s=Math.max(0,1-i*2.6),n=16*s*e.intensity,a=i*90;return{dx:Math.sin(a*1.7+t.seed)*n,dy:Math.cos(a*2.3+t.seed)*n*.5,rot:Math.sin(a*1.1)*.035*s,sx:1+s*.05,sy:1+s*.05}}},{name:"rgbSlam",bands:["bass"],stagger:.03,transform:(i,t,e)=>{let s=w.outExpo(Math.min(1,i*3));return{sx:g(1.25,1,s),sy:g(1.25,1,s),rgbSplit:26*(1-s)*e.intensity,glow:.25*(1-s)}}},{name:"echoPunch",bands:["bass"],stagger:.02,transform:(i,t,e)=>{let s=w.outCubic(Math.min(1,i*2.2));return{sx:g(.82,1,s),sy:g(.82,1,s),echo:4*(1-s)*e.intensity,echoScale:.3,echoDy:-30*(1-s)}}},{name:"burnIn",bands:["bass"],stagger:.04,transform:(i,t,e)=>{let s=w.outCubic(Math.min(1,i*2.6));return{sx:g(.75,1,s),sy:g(.75,1,s),glow:.9*(1-s)*e.intensity,tint:"#ffd0a0",tintMode:"overlay",tintAlpha:.5*(1-s)}}},{name:"shatterSlam",bands:["bass"],stagger:.03,transform:(i,t,e)=>{let s=Math.min(1,i*2.4);return{slices:{n:10,amp:46*(1-w.outQuint(s))*e.intensity,vertical:!1},sx:g(1.12,1,w.outCubic(s)),sy:g(1.12,1,w.outCubic(s))}}},{name:"squashPop",bands:["bass"],stagger:.035,transform:i=>{let t=w.outElastic(Math.min(1,i*1.6));return{sx:g(1.35,1,t),sy:g(.68,1,t)}}},{name:"slideSplit",bands:["mid"],stagger:.03,transform:(i,t)=>{let e=w.outExpo(Math.min(1,i*2.8));return{dx:$(t.i)*t.view.w*(1-e),skewX:$(t.i)*.35*(1-e)}}},{name:"diagonalSlice",bands:["mid"],stagger:.035,transform:(i,t,e)=>{let s=w.outExpo(Math.min(1,i*3)),n=$(t.i),a=(t.i>>1)%2===0?1:-1;return{dx:n*t.view.w*.28*(1-s),dy:a*t.view.h*.2*(1-s),skewX:n*.28*(1-s)*e.intensity}}},{name:"zipIn",bands:["mid"],stagger:.025,transform:(i,t)=>{let e=w.outExpo(Math.min(1,i*3.4)),s=t.i%4,n=s===0?-1:s===1?1:0,a=s===2?-1:s===3?1:0;return{dx:n*t.view.w*(1-e),dy:a*t.view.h*(1-e)}}},{name:"glitchBlocks",bands:["mid"],stagger:.02,transform:(i,t,e)=>{let s=Math.max(0,1-i*2.2);return{blocks:{cols:7,rows:5,amp:34*s*e.intensity,frame:Math.floor(i*26)},rgbSplit:10*s*e.intensity}}},{name:"dataCorrupt",bands:["mid"],stagger:.03,transform:(i,t,e)=>{let s=Math.max(0,1-i*2);return{slices:{n:14,amp:30*s*e.intensity,vertical:!1},skewX:Math.sin(i*30)*.14*s,tint:"#30ffd0",tintMode:"screen",tintAlpha:.3*s}}},{name:"wipeReveal",bands:["mid"],stagger:.04,transform:(i,t)=>{let e=w.outQuint(Math.min(1,i*2.4)),s=["left","right","up","down"][t.i%4];return{wipe:{dir:s,p:e},dx:(s==="left"?-1:s==="right"?1:0)*40*(1-e)}}},{name:"flipIn",bands:["mid"],stagger:.04,transform:(i,t)=>{let e=w.outCubic(Math.min(1,i*2.4)),s=Math.abs(g(-1,1,e));return{sx:Math.max(.02,s),sy:1,glow:.3*(1-e)}}},{name:"rollIn",bands:["mid"],stagger:.035,transform:(i,t)=>{let e=w.outQuint(Math.min(1,i*2.6)),s=$(t.i);return{dx:s*t.view.w*.45*(1-e),rot:s*.9*(1-e)}}},{name:"barSweep",bands:["mid"],stagger:.03,transform:(i,t,e)=>{let s=Math.max(0,1-i*2.4);return{slices:{n:6,amp:22*s*e.intensity,vertical:!0},dy:$(t.i)*18*s}}},{name:"scatterPop",bands:["high"],stagger:.03,transform:(i,t,e)=>{let s=w.outBack(Math.min(1,i*3.6),2.8);return{sx:g(.5,1,s),sy:g(.5,1,s),rot:t.rnd*.5*(1-s)*e.intensity}}},{name:"strobePop",bands:["high"],stagger:.015,transform:(i,t)=>({alpha:i<.24?Math.floor(i*40+t.seed)%2?1:.14:1,sx:g(1.18,1,w.outExpo(Math.min(1,i*4))),sy:g(1.18,1,w.outExpo(Math.min(1,i*4)))})},{name:"pixelBurst",bands:["high"],stagger:.025,transform:(i,t,e)=>{let s=w.outCubic(Math.min(1,i*2.6));return{pixel:g(38*e.intensity,1,s),sx:g(1.1,1,s),sy:g(1.1,1,s)}}},{name:"chromaFlick",bands:["high"],stagger:.02,transform:(i,t,e)=>{let s=Math.max(0,1-i*3);return{rgbSplit:(8+Math.sin(i*60+t.seed)*8)*s*e.intensity,tint:"#7c6fff",tintMode:"screen",tintAlpha:.28*s}}},{name:"tileShatter",bands:["high"],stagger:.025,transform:(i,t,e)=>{let s=w.outExpo(Math.min(1,i*3.2)),n=$(t.i);return{sx:g(1.3,1,s),sy:g(.7,1,s),skewX:n*.26*(1-s)*e.intensity,glow:.4*(1-s)}}},{name:"vhsRoll",bands:["high"],stagger:.02,transform:(i,t,e)=>{let s=Math.max(0,1-i*2);return{roll:(i*1.8+t.seed*.1)%1*s,rgbSplit:6*s*e.intensity,slices:null}}},{name:"jitterPop",bands:["high"],stagger:.012,transform:(i,t,e)=>{let s=Math.max(0,1-i*3.4),a=(Math.floor(i*24)*9301+t.seed*49297)%233280/233280-.5;return{dx:a*40*s*e.intensity,dy:-a*26*s,sx:1+s*.12,sy:1+s*.12}}},{name:"blinkGrid",bands:["high"],stagger:.05,transform:(i,t)=>{let e=Math.floor(i*14+t.i)%2===0;return{alpha:i>.42||e?1:.05,sx:1.02,sy:1.02}}},{name:"sparkZoom",bands:["high","mid"],stagger:.03,transform:(i,t,e)=>{let s=w.outExpo(Math.min(1,i*3));return{sx:g(.86,1,s),sy:g(.86,1,s),echo:3*(1-s),echoScale:-.22*e.intensity,glow:.5*(1-s)}}}],gt={bass:[],mid:[],high:[]};for(let i of Rt)for(let t of i.bands)gt[t]?.push(i);function qt(i){let t=gt[i]?.length?gt[i]:Rt;return O(t)}var ft=[{name:"none",apply:()=>({})},{name:"kick",apply:(i,t)=>({zoom:1+.06*t.intensity*Math.max(0,1-i*3)})},{name:"shake",apply:(i,t,e)=>{let s=Math.max(0,1-i*3);return{dx:Math.sin(i*120+e.seed)*14*s*t.intensity,dy:Math.cos(i*97+e.seed)*8*s*t.intensity}}},{name:"tilt",apply:(i,t,e)=>({rot:(e.seed%2?1:-1)*.03*t.intensity*Math.max(0,1-i*2.5)})},{name:"invertFlash",apply:i=>({invert:i<.06})},{name:"scanlines",apply:(i,t)=>({scanlines:.35*t.intensity*Math.max(0,1-i*1.6)})},{name:"rays",apply:(i,t)=>({rays:Math.max(0,1-i*2)*t.intensity})},{name:"punchOut",apply:(i,t)=>({zoom:g(1.14,1,w.outExpo(Math.min(1,i*2.4)))*(.98+.02*t.intensity)})}];function It(i,t){if(t<.35)return ft[0];let s=O(i==="bass"?["kick","shake","punchOut","rays","invertFlash","tilt"]:i==="mid"?["tilt","scanlines","punchOut","none","shake"]:["none","scanlines","invertFlash","tilt"]);return ft.find(n=>n.name===s)||ft[0]}function zt(i,t,e){let s=e>0?6e4/e:500,n=i==="high"?s*.55:i==="mid"?s*.9:s*1.35;return d(Math.max(n,t*1.6),220,2400)}var Vt=170,bt=class{constructor(t,e,{type:s,strength:n,cooldown:a,bpm:r,intensity:o}){this.type=s,this.strength=n,this.born=performance.now(),this.hold=zt(s,a,r),this.animMs=d(this.hold*.7,220,720),this.seed=H(1,99999),this.effect=qt(s),this.sceneEffect=It(s,n),this.alpha=1,this.dead=!1;let l=At(t.length,{w:e.w,h:e.h,gap:t.length>1?10:0,pad:8});this.sprites=t.map((h,c)=>({entry:h,x:l[c].x,y:l[c].y,w:l[c].w,h:l[c].h,fit:t.length===1?"contain":"cover",i:c,count:t.length,seed:this.seed+c*977,rnd:M(-1,1),delay:c*this.effect.stagger*1e3*(1/d(o,.5,2)),view:e}))}get age(){return performance.now()-this.born}retire(t=performance.now()){this.retiredAt||(this.retiredAt=t)}update(t){let e=t-this.born;!this.retiredAt&&e>=this.hold&&(this.retiredAt=this.born+this.hold),this.retiredAt&&(this.alpha=1-d((t-this.retiredAt)/Vt,0,1),this.alpha<=0&&(this.dead=!0))}draw(t,e,s){if(this.dead)return null;let a=s.now-this.born,r=d(a/380,0,1),o=this.sceneEffect.apply(r,s,this)||{};s.shake===!1&&(o.dx=0,o.dy=0,o.rot=0),t.save(),t.globalAlpha=this.alpha;let l=s.w/2,h=s.h/2;(o.dx||o.dy||o.rot||o.zoom)&&(t.translate(l+(o.dx||0),h+(o.dy||0)),o.rot&&t.rotate(o.rot),o.zoom&&t.scale(o.zoom,o.zoom),t.translate(-l,-h));for(let c of this.sprites){let u=d((a-c.delay)/this.animMs,0,1);if(u<=0)continue;let m=this.effect.transform(u,c,s)||{},f=(m.alpha??1)*this.alpha;if(f<=.012)continue;t.save(),t.globalAlpha=f,t.translate(c.x+c.w/2+(m.dx||0),c.y+c.h/2+(m.dy||0)),m.rot&&t.rotate(m.rot),(m.skewX||m.skewY)&&t.transform(1,m.skewY||0,m.skewX||0,1,0,0);let b=m.sx??1,y=m.sy??1;(b!==1||y!==1)&&t.scale(b,y),e.paint(t,c.entry,{x:-c.w/2,y:-c.h/2,w:c.w,h:c.h,fit:c.fit,seed:c.seed},m),e.quality>0&&c.count>1&&(t.globalAlpha=f*.5,t.strokeStyle="rgba(255,255,255,0.14)",t.lineWidth=1,t.strokeRect(-c.w/2,-c.h/2,c.w,c.h)),t.restore()}return t.restore(),o}},D=class{constructor(t){this.painter=t,this.scenes=[],this.priority=0,this.lastPost={}}get active(){return this.scenes.length>0}spawn(t,e,s){if(!t.length)return!1;let n=new bt(t,e,s);for(let a of this.scenes)a.retire();for(this.scenes.push(n);this.scenes.length>2;)this.scenes.shift();return!0}clear(){this.scenes.length=0,this.priority=0}update(t){for(let e of this.scenes)e.update(t);this.scenes=this.scenes.filter(e=>!e.dead),this.scenes.length||(this.priority=0)}draw(t,e){let s={};for(let n of this.scenes){let a=n.draw(t,this.painter,e);a&&n===this.scenes[this.scenes.length-1]&&(s=a)}return this.lastPost=s,s}static countFor(t,e,s){return $t(t,e,s)}};var yt=8,Yt=90,tt=class{constructor(t,e){this.pool=t,this.cache=e,this.rows=[],this.w=0,this.h=0,this.enabled=!0,this.pulse=0,this.speedScale=1}configure(t){let e=[{dir:-1,speedMul:1},{dir:1,speedMul:.72},{dir:-1,speedMul:1.35},{dir:1,speedMul:.55}],s=d(t|0,0,e.length);this.rows=e.slice(0,s).map(n=>({...n,items:[],y:0,h:0})),this._layout()}resize(t,e){this.w=t,this.h=e,this._layout()}_layout(){let t=this.rows.length;if(!t||!this.h)return;let e=this.h/t;this.rows.forEach((s,n)=>{s.y=n*e+4,s.h=e-8,s.items.length=0})}reset(){for(let t of this.rows)t.items.length=0;this.pulse=0}onBeat(t){this.pulse=Math.min(1,this.pulse+t*.6)}update(t,e){if(!(!this.enabled||!this.rows.length||!this.w)){this.speedScale=g(this.speedScale,e,d(t*6,0,1)),this.pulse=Math.max(0,this.pulse-t*2.2);for(let s of this.rows){this._fill(s);let n=Yt*this.speedScale*s.speedMul*s.dir*t;for(let a of s.items)a.x+=n;this._recycle(s)}}}_newItem(t,e){let s=this.pool.nextScrollSrc();if(!s)return null;let n=t.h*M(1.05,1.6);return{src:s,x:e,w:n,entry:null,tries:0}}_fill(t){if(!this.pool.size)return;let e=0;if(!t.items.length){let r=0;for(;r<this.w+t.h*2&&e++<64;){let o=this._newItem(t,r);if(!o)break;t.items.push(o),r+=o.w+yt}return}let s=t.items[t.items.length-1],n=s.x+s.w;for(;n<this.w+t.h&&e++<32;){let r=this._newItem(t,n+yt);if(!r)break;t.items.push(r),n=r.x+r.w}let a=t.items[0].x;for(;a>-t.h&&e++<64;){let r=this._newItem(t,0);if(!r)break;r.x=a-yt-r.w,t.items.unshift(r),a=r.x}}_recycle(t){for(;t.items.length&&t.items[0].x+t.items[0].w<-t.h;)t.items.shift();for(;t.items.length&&t.items[t.items.length-1].x>this.w+t.h;)t.items.pop()}draw(t,e){if(!this.enabled||!this.rows.length)return;let s=.55+this.pulse*.35;t.save(),t.globalAlpha=d(s,0,1);for(let n of this.rows)for(let a of n.items){if(a.x+a.w<0||a.x>this.w)continue;if(!a.entry&&(a.entry=this.cache.ready(a.src),!a.entry)){if(this.cache.entries.get(a.src)?.state==="error"){let u=this.pool.nextScrollSrc();u&&(a.src=u)}continue}let r=a.entry;if(!r.img){a.entry=null;continue}let o=this.cache.source(r,a.w,n.h);if(!o)continue;let l=Math.max(a.w/o.w,n.h/o.h),h=a.w/l,c=n.h/l;t.drawImage(o.img,(o.w-h)/2,(o.h-c)/2,h,c,a.x,n.y,a.w,n.h)}t.restore(),this.pulse>.02&&e.quality>0&&(t.save(),t.globalCompositeOperation="lighter",t.globalAlpha=this.pulse*.12,t.fillStyle=e.beatColor||"#ffffff",t.fillRect(0,0,this.w,this.h),t.restore())}};var N=320,et=class{constructor(){this.items=new Array(N).fill(null).map(()=>({alive:!1,x:0,y:0,vx:0,vy:0,life:0,max:1,size:1,r:255,g:255,b:255,drag:.9})),this.cursor=0,this.rings=[],this.enabled=!0}_spawn(){for(let t=0;t<N;t++){let e=this.items[(this.cursor+t)%N];if(!e.alive)return this.cursor=(this.cursor+t+1)%N,e}return this.items[this.cursor=(this.cursor+1)%N]}burst(t,e,s,n,a=2){if(!this.enabled)return;let r=Math.round(d(n,.2,1)*(a>1?46:18));for(let o=0;o<r;o++){let l=this._spawn(),h=M(0,Math.PI*2),c=M(140,620)*(.55+n);l.alive=!0,l.x=t,l.y=e,l.vx=Math.cos(h)*c,l.vy=Math.sin(h)*c,l.max=M(.35,.85),l.life=l.max,l.size=M(1.2,3.4),l.drag=M(.86,.94),l.r=s[0],l.g=s[1],l.b=s[2]}this.rings.push({x:t,y:e,r:10,vr:900*(.5+n),life:.45,max:.45,rgb:s}),this.rings.length>6&&this.rings.shift()}update(t){for(let e of this.items){if(!e.alive)continue;if(e.life-=t,e.life<=0){e.alive=!1;continue}let s=Math.pow(e.drag,t*60);e.vx*=s,e.vy*=s,e.vy+=260*t,e.x+=e.vx*t,e.y+=e.vy*t}for(let e of this.rings)e.life-=t,e.r+=e.vr*t,e.vr*=Math.pow(.9,t*60);this.rings=this.rings.filter(e=>e.life>0)}draw(t){if(this.enabled){t.save(),t.globalCompositeOperation="lighter";for(let e of this.rings){let s=d(e.life/e.max,0,1);t.strokeStyle=`rgba(${e.rgb[0]},${e.rgb[1]},${e.rgb[2]},${s*.5})`,t.lineWidth=2+s*6,t.beginPath(),t.arc(e.x,e.y,e.r,0,Math.PI*2),t.stroke()}for(let e of this.items){if(!e.alive)continue;let s=d(e.life/e.max,0,1);t.fillStyle=`rgba(${e.r},${e.g},${e.b},${s})`;let n=e.size*(.4+s);t.fillRect(e.x-n/2,e.y-n/2,n,n)}t.restore()}}clear(){for(let t of this.items)t.alive=!1;this.rings.length=0}};var Bt=.62,st=class{constructor({cache:t,pool:e,settings:s}){this.cache=t,this.pool=e,this.settings=s,this.canvas=document.createElement("canvas"),this.canvas.className=`${p}stage`,this.canvas.style.zIndex=String(F.stage),this.ctx=this.canvas.getContext("2d",{alpha:!0,desynchronized:!0}),this.painter=new J(t),this.scroll=new tt(e,t),this.scenes=new D(this.painter),this.particles=new et,this.w=0,this.h=0,this.dpr=1,this.running=!1,this.dim=0,this.flash={a:0,color:"#ffffff"},this.beatColor=U.bass.hex,this.quality=2,this.emaFrame=16,this.fps=0,this._rafId=null,this.onTick=null,this._lastTs=0,this._fpsAcc=0,this._fpsCount=0,this._vignette=null,this._speedScale=1,this._onResize=()=>this.resize()}mount(){document.documentElement.appendChild(this.canvas),window.addEventListener("resize",this._onResize,{passive:!0}),window.addEventListener("orientationchange",this._onResize,{passive:!0}),this.resize()}destroy(){this.stop(),window.removeEventListener("resize",this._onResize),window.removeEventListener("orientationchange",this._onResize),this.canvas.remove()}resize(){let t=window.innerWidth,e=window.innerHeight,s=this.quality>1?Math.min(window.devicePixelRatio||1,rt.maxDpr):1;t===this.w&&e===this.h&&s===this.dpr||(this.w=t,this.h=e,this.dpr=s,this.canvas.width=Math.max(1,Math.round(t*s)),this.canvas.height=Math.max(1,Math.round(e*s)),this.canvas.style.width=t+"px",this.canvas.style.height=e+"px",this.scroll.resize(t,e),this._buildVignette())}_buildVignette(){let t=this.ctx.createRadialGradient(this.w/2,this.h/2,Math.min(this.w,this.h)*.28,this.w/2,this.h/2,Math.max(this.w,this.h)*.75);t.addColorStop(0,"rgba(0,0,0,0)"),t.addColorStop(1,"rgba(0,0,0,0.55)"),this._vignette=t}start(){this.running||(this.running=!0,this.canvas.classList.add("visible"),this.scroll.configure(this.settings.scroll?this.settings.scrollRows:0),this.scroll.reset(),this.particles.enabled=this.settings.particles,this._lastTs=0,this.wake())}stop(){this.running=!1,this.scenes.clear(),this.particles.clear(),this.scroll.reset()}setScrollRows(t){this.scroll.configure(this.settings.scroll?t:0)}spawnScene(t,e,s,n){let a=D.countFor(t,e,this.settings.sceneImages),r=this.pool.takeReady(a);return r.length?this.scenes.spawn(r,{w:this.w,h:this.h},{type:t,strength:e,cooldown:s,bpm:n,intensity:this.settings.intensity}):!1}beat({type:t,strength:e}){let s=U[t]||U.bass;this.beatColor=s.hex,this.settings.flash&&(this.flash.color=t==="bass"?"#ffffff":s.hex,this.flash.a=Math.max(this.flash.a,d(.12+e*.4,0,.6))),this.scroll.onBeat(e),this.settings.particles&&this.quality>0&&this.particles.burst(this.w/2,this.h/2,s.rgb,e,this.quality)}setSpeedScale(t){this._speedScale=d(t,.15,5)}_tick(t){this._rafId=requestAnimationFrame(o=>this._tick(o));let e=this._lastTs||t,s=t-e;this._lastTs=t;let n=d(s/1e3,.001,.08);this._measure(s),this.onTick?.(t,n);let a=this.running?Bt:0;this.dim=g(this.dim,a,d(n*6,0,1)),this.scenes.update(t),this.scroll.update(n,this._speedScale),this.particles.update(n),this.flash.a=Math.max(0,this.flash.a-n*2.6);let r=!this.running&&this.dim<.01&&!this.scenes.active&&!this.particles.rings.length;document.hidden||(this._render(t,n),r&&(this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.canvas.classList.remove("visible"),cancelAnimationFrame(this._rafId),this._rafId=null))}_measure(t){t>0&&t<500&&(this.emaFrame=this.emaFrame*.92+t*.08,this._fpsAcc+=t,this._fpsCount++,this._fpsAcc>500&&(this.fps=Math.round(1e3/(this._fpsAcc/this._fpsCount)),this._fpsAcc=0,this._fpsCount=0));let e;if(this.settings.quality==="high")e=2;else if(this.settings.quality==="low")e=0;else{let n=this.emaFrame>26?1:0,a=this.emaFrame<15?1:0;e=d(this.quality-n+a,0,2)}if(e===this.quality)return;let s=performance.now();s-(this._qualityAt||0)<rt.qualityHoldMs||(this._qualityAt=s,this.quality=e,this.painter.quality=e,this.particles.enabled=this.settings.particles&&e>0,this.resize())}_render(t,e){let s=this.ctx,n={now:t,dt:e,w:this.w,h:this.h,quality:this.quality,intensity:this.settings.intensity,beatColor:this.beatColor,shake:this.settings.shake};this.cache.thumbBudget=2,s.setTransform(this.dpr,0,0,this.dpr,0,0),s.clearRect(0,0,this.w,this.h),s.globalCompositeOperation="source-over",s.globalAlpha=1,this.dim>.001&&(s.fillStyle=`rgba(4,4,10,${this.dim})`,s.fillRect(0,0,this.w,this.h)),this.scroll.draw(s,n);let a=this.scenes.draw(s,n);this.particles.draw(s),a.rays>.01&&this.quality>0&&this._drawRays(s,a.rays),a.scanlines>.01&&this._drawScanlines(s,a.scanlines),a.invert&&(s.save(),s.globalCompositeOperation="difference",s.fillStyle="#ffffff",s.fillRect(0,0,this.w,this.h),s.restore()),this.flash.a>.002&&(s.save(),s.globalAlpha=this.flash.a,s.fillStyle=this.flash.color,s.fillRect(0,0,this.w,this.h),s.restore()),this.dim>.02&&this._vignette&&this.quality>0&&(s.save(),s.globalAlpha=d(this.dim/Bt,0,1),s.fillStyle=this._vignette,s.fillRect(0,0,this.w,this.h),s.restore())}_drawRays(t,e){let s=this.w/2,n=this.h/2,a=Math.hypot(this.w,this.h);t.save(),t.globalCompositeOperation="lighter",t.globalAlpha=.1*e,t.fillStyle=this.beatColor;for(let r=0;r<12;r++){let o=r/12*Math.PI*2+e*.6;t.beginPath(),t.moveTo(s,n),t.arc(s,n,a,o,o+.09),t.closePath(),t.fill()}t.restore()}_drawScanlines(t,e){if(!this._scanPattern){let s=document.createElement("canvas");s.width=1,s.height=4;let n=s.getContext("2d");n.fillStyle="#000000",n.fillRect(0,0,1,1.4),this._scanPattern=t.createPattern(s,"repeat")}t.save(),t.globalAlpha=d(e,0,.5),t.fillStyle=this._scanPattern,t.fillRect(0,0,this.w,this.h),t.restore()}wake(){this._rafId||this._tick(performance.now())}};var I=48,it=class{constructor(t){this.canvas=t,this.ctx=t.getContext("2d"),this.values=new Float32Array(I),this.peaks=new Float32Array(I),this.enabled=!1,this._sized=!1}_size(){let t=Math.min(window.devicePixelRatio||1,2),e=this.canvas.clientWidth||240,s=this.canvas.clientHeight||54,n=Math.round(e*t),a=Math.round(s*t);(this.canvas.width!==n||this.canvas.height!==a)&&(this.canvas.width=n,this.canvas.height=a),this.ctx.setTransform(t,0,0,t,0,0),this.w=e,this.h=s,this._sized=!0}clear(){this._sized||this._size(),this.ctx.clearRect(0,0,this.w,this.h),this.values.fill(0),this.peaks.fill(0)}draw(t,e){if(!this.enabled||!t)return;(!this._sized||this.canvas.clientWidth!==this.w)&&this._size();let{ctx:s,w:n,h:a}=this;s.clearRect(0,0,n,a);let r=t.length,o=n/I,l=d(e*6,0,1);for(let h=0;h<I;h++){let c=Math.floor(Math.pow(h/I,1.9)*r),u=Math.max(c+1,Math.floor(Math.pow((h+1)/I,1.9)*r)),m=0;for(let _=c;_<u;_++)m+=t[_];let f=m/(u-c)/255;this.values[h]=Math.max(f,this.values[h]-l*.9),this.peaks[h]=Math.max(this.values[h],this.peaks[h]-l*.35);let b=Math.max(1,this.values[h]*a),y=265-h/I*190;s.fillStyle=`hsl(${y}, 88%, ${48+this.values[h]*22}%)`,s.fillRect(h*o+.5,a-b,o-1.2,b);let S=this.peaks[h]*a;s.fillStyle=`hsla(${y}, 95%, 78%, 0.85)`,s.fillRect(h*o+.5,a-S-1.5,o-1.2,1.5)}}};var Zt=[["sensitivity","Sensitivity",.6,3,.05,i=>i.toFixed(2)],["cooldown","Cooldown",40,800,10,i=>i+"ms"],["intensity","Intensity",.2,2,.05,i=>"\xD7"+i.toFixed(2)],["sceneImages","Images / beat",1,8,1,i=>String(i)],["scrollRows","Scroll rows",0,4,1,i=>String(i)]],Kt=[["scroll","Scrolling strips"],["flash","Beat flash"],["shake","Screen shake"],["particles","Particles"]],nt=class{constructor({settings:t,onSetting:e,onStart:s,onStop:n,onClear:a,onFile:r,onTab:o}){this.settings=t,this.onSetting=e,this.onStart=s,this.onStop=n,this.onClear=a,this.onFile=r,this.onTab=o,this.isOpen=!1,this._offs=[]}mount(){this._buildToggle(),this._buildPanel(),this._offs.push(x(window,"keydown",t=>{t.altKey&&(t.key==="b"||t.key==="B")&&(t.preventDefault(),this.toggle())}))}destroy(){this._offs.forEach(t=>t()),this._offs.length=0,this.toggleBtn?.remove(),this.root?.remove()}_buildToggle(){this.toggleBtn=P("button",`${p}toggle`,`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
         <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
       </svg>`),this.toggleBtn.title="BeatImg (Alt+B)",this.toggleBtn.style.zIndex=String(F.toggle),this._offs.push(x(this.toggleBtn,"click",()=>this.toggle())),document.documentElement.appendChild(this.toggleBtn)}_buildPanel(){let t=this.settings;this.root=P("div",`${p}panel`),this.root.style.zIndex=String(F.panel),this.root.innerHTML=`
      <div class="${p}header">
        <div class="${p}title"><span class="${p}title-icon">\u{1F3B5}</span><span>BeatImg</span></div>
        <button class="${p}close-btn" title="Close (Esc)">\u2715</button>
      </div>

      <div class="${p}status-bar">
        <div class="${p}dot idle"></div>
        <span class="${p}status-text">Ready</span>
        <span class="${p}badge ${p}bpm">\u2013 BPM</span>
      </div>

      <canvas class="${p}visualizer"></canvas>

      <div class="${p}source-tabs">
        <button class="${p}tab${t.sourceMode==="mic"?" active":""}" data-tab="mic">\u{1F3A4} Microphone</button>
        <button class="${p}tab${t.sourceMode==="file"?" active":""}" data-tab="file">\u{1F4C1} Audio file</button>
      </div>

      <div class="${p}file-zone"${t.sourceMode==="file"?' style="display:block"':""}>
        <label class="${p}drop-label">
          <input type="file" accept="audio/*" class="${p}file-input" hidden>
          <span class="${p}drop-icon">\u{1F4C2}</span>
          <span class="${p}drop-text">Select or drop an audio file</span>
        </label>
        <div class="${p}audio-name"></div>
        <audio class="${p}audio" controls preload="metadata"></audio>
      </div>

      <div class="${p}controls"></div>

      <div class="${p}toggles"></div>

      <div class="${p}control-row ${p}quality-row">
        <label>Quality</label>
        <select class="${p}quality">
          <option value="auto">Auto</option>
          <option value="high">High</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div class="${p}btn-row">
        <button class="${p}start-btn">\u25B6 Start</button>
        <button class="${p}stop-btn" disabled>\u25A0 Stop</button>
      </div>

      <div class="${p}btn-row">
        <button class="${p}clear-btn">\u{1F5D1} Clear images (<span class="${p}img-count">0</span>)</button>
      </div>

      <div class="${p}stats">
        <span class="${p}stat" data-k="fps">\u2013 fps</span>
        <span class="${p}stat" data-k="beats">0 beats</span>
        <span class="${p}stat" data-k="quality">auto</span>
      </div>
      <div class="${p}hint">Alt+B toggles this panel \xB7 Esc stops</div>
    `,document.documentElement.appendChild(this.root);let e=s=>this.root.querySelector(s);this.statusDot=e(`.${p}dot`),this.statusText=e(`.${p}status-text`),this.bpmEl=e(`.${p}bpm`),this.startBtn=e(`.${p}start-btn`),this.stopBtn=e(`.${p}stop-btn`),this.imgCountEl=e(`.${p}img-count`),this.audioEl=e(`.${p}audio`),this.fileZone=e(`.${p}file-zone`),this.audioNameEl=e(`.${p}audio-name`),this.qualitySel=e(`.${p}quality`),this.statEls={},this.root.querySelectorAll(`.${p}stat`).forEach(s=>this.statEls[s.dataset.k]=s),this.visualizer=new it(e(`.${p}visualizer`)),this.qualitySel.value=this.settings.quality,this._buildSliders(e(`.${p}controls`)),this._buildToggles(e(`.${p}toggles`)),this._wire(e)}_buildSliders(t){this.sliderLabels={};for(let[e,s,n,a,r,o]of Zt){let l=P("div",`${p}control-row`);l.innerHTML=`
        <label>${s}</label>
        <div class="${p}slider-row">
          <input type="range" min="${n}" max="${a}" step="${r}" value="${this.settings[e]}">
          <span class="${p}sval">${o(this.settings[e])}</span>
        </div>`;let h=l.querySelector("input"),c=l.querySelector(`.${p}sval`);this.sliderLabels[e]=c,this._offs.push(x(h,"input",()=>{let u=r<1?parseFloat(h.value):parseInt(h.value,10);c.textContent=o(u),this.onSetting?.(e,u)})),t.appendChild(l)}}_buildToggles(t){for(let[e,s]of Kt){let n=P("label",`${p}toggle-row`);n.innerHTML=`<span>${s}</span><input type="checkbox"${this.settings[e]?" checked":""}>`;let a=n.querySelector("input");this._offs.push(x(a,"change",()=>this.onSetting?.(e,a.checked))),t.appendChild(n)}}_wire(t){this._offs.push(x(t(`.${p}close-btn`),"click",()=>this.close()),x(this.startBtn,"click",()=>this.onStart?.()),x(this.stopBtn,"click",()=>this.onStop?.()),x(t(`.${p}clear-btn`),"click",()=>this.onClear?.()),x(this.qualitySel,"change",()=>this.onSetting?.("quality",this.qualitySel.value)),x(t(`.${p}file-input`),"change",s=>{let n=s.target.files?.[0];n&&this.onFile?.(n)})),this.root.querySelectorAll(`.${p}tab`).forEach(s=>{this._offs.push(x(s,"click",()=>{let n=s.dataset.tab;this.root.querySelectorAll(`.${p}tab`).forEach(a=>a.classList.toggle("active",a===s)),this.fileZone.style.display=n==="file"?"block":"none",this.onSetting?.("sourceMode",n),this.onTab?.(n)}))});let e=this.fileZone;this._offs.push(x(e,"dragover",s=>{s.preventDefault(),e.classList.add("dragover")}),x(e,"dragleave",()=>e.classList.remove("dragover")),x(e,"drop",s=>{s.preventDefault(),e.classList.remove("dragover");let n=s.dataTransfer?.files?.[0];n&&n.type.startsWith("audio/")&&this.onFile?.(n)}))}toggle(){this.isOpen?this.close():this.open()}open(){this.isOpen=!0,this.root.classList.add("open"),this.toggleBtn.classList.add("active"),this.visualizer.enabled=!0}close(){this.isOpen=!1,this.root.classList.remove("open"),this.toggleBtn.classList.remove("active"),this.visualizer.enabled=!1,this.visualizer.clear()}setStatus(t,e){this._status!==t+e&&(this._status=t+e,this.statusDot.className=`${p}dot ${t}`,this.statusText.textContent=e)}setRunning(t){this.startBtn.disabled=t,this.stopBtn.disabled=!t}setImageCount(t){this.imgCountEl.textContent=String(t)}setBpm(t,e){this.bpmEl.textContent=t>0?`${t} BPM`:"\u2013 BPM",this.bpmEl.style.opacity=t>0?String(.55+(e||0)*.45):"0.5"}setStats({fps:t,beats:e,quality:s}){t!=null&&(this.statEls.fps.textContent=`${t} fps`),e!=null&&(this.statEls.beats.textContent=`${e} beats`),s!=null&&(this.statEls.quality.textContent=s)}setAudioName(t){this.audioNameEl.textContent=t||""}pulse(t){this.toggleBtn&&(this.toggleBtn.classList.remove("pulse-bass","pulse-mid","pulse-high"),this.toggleBtn.offsetWidth,this.toggleBtn.classList.add(`pulse-${t}`))}};var at=class{constructor(){this.cache=new X,this.pool=new V(this.cache),this.stage=new st({cache:this.cache,pool:this.pool,settings:k}),this.detector=new K({sensitivity:k.sensitivity,cooldown:k.cooldown}),this.graph=null,this.running=!1,this.beats=0,this.objectUrl=null,this._scenePriority=0,this._sceneAt=0,this._speed=1,this._statsAt=0,this._offs=[],this.panel=new nt({settings:k,onSetting:(t,e)=>this._applySetting(t,e),onStart:()=>this.start(),onStop:()=>this.stop(),onClear:()=>this.pool.clear(),onFile:t=>this._loadFile(t),onTab:()=>{}})}init(){this.panel.mount(),this.stage.mount(),this.pool.onChange=t=>this.panel.setImageCount(t),this.pool.start(),this.detector.onBeat=t=>this._onBeat(t),this.detector.onFrame=t=>this._onFrame(t),this.stage.onTick=(t,e)=>this._onTick(t,e),this._offs.push(x(window,"keydown",t=>{t.key==="Escape"&&this.running&&this.stop()}),x(document,"visibilitychange",()=>{document.hidden||this.stage.wake()})),this.panel.setImageCount(this.pool.size),this.panel.setStatus("idle","Ready")}destroy(){this.stop(),this._offs.forEach(t=>t()),this.pool.destroy(),this.stage.destroy(),this.panel.destroy(),this.cache.clear()}_applySetting(t,e){switch(vt(t,e),t){case"sensitivity":this.detector.setSensitivity(e);break;case"cooldown":this.detector.setCooldown(e);break;case"scrollRows":case"scroll":this.stage.setScrollRows(k.scrollRows);break;case"particles":this.stage.particles.enabled=e&&this.stage.quality>0,e||this.stage.particles.clear();break;case"quality":this.stage.emaFrame=16;break}}async start(){if(this.running)return;this.panel.setRunning(!0);let t=k.sourceMode;if(t==="file"&&!this.panel.audioEl?.src){this.panel.setStatus("error","Select an audio file first"),this.panel.setRunning(!1);return}this.panel.setStatus("connecting",t==="file"?"Connecting audio\u2026":"Requesting microphone\u2026");let e=new Z;try{if(t==="file"){await e.startElement(this.panel.audioEl);try{await this.panel.audioEl.play()}catch{this.panel.setStatus("error","Press play on the audio player")}}else await e.startMic()}catch(s){e.stop(),this.panel.setStatus("error",this._errorText(s,t)),this.panel.setRunning(!1);return}this.graph=e,this.detector.setSensitivity(k.sensitivity),this.detector.setCooldown(k.cooldown),this.detector.attach(e),this.running=!0,this.beats=0,this._scenePriority=0,this.pool.scan(!0),this.stage.start(),this.stage.wake(),this.panel.setRunning(!0),this.panel.setStatus("active",t==="file"?"Analyzing track\u2026":"Listening\u2026")}stop(){if(!this.running){this.panel.setRunning(!1);return}this.running=!1,this.detector.detach(),this.graph?.stop(),this.graph=null,this.stage.stop(),this.stage.wake(),this.panel.setRunning(!1),this.panel.setStatus("idle","Stopped"),this.panel.setBpm(0,0),this.panel.visualizer.clear()}_errorText(t,e){let s=t?.name||"";return s==="NotAllowedError"?"Microphone permission denied":s==="NotFoundError"?"No microphone found":s==="InvalidStateError"?"Audio element already in use \u2014 reload the page":e==="file"?"Could not connect the audio source":t?.message?String(t.message).slice(0,60):"Audio start failed"}_loadFile(t){let e=this.panel.audioEl;e&&(this.objectUrl&&URL.revokeObjectURL(this.objectUrl),this.objectUrl=URL.createObjectURL(t),e.src=this.objectUrl,e.load(),this.panel.setAudioName(t.name),k.sourceMode!=="file"&&this._applySetting("sourceMode","file"))}_onTick(t,e){this.running&&(this.detector.wantSpectrum=this.panel.isOpen,Jt(this.graph),this.detector.tick(t)),t-this._statsAt>400&&(this._statsAt=t,this.panel.setStats({fps:this.stage.fps,beats:this.beats,quality:k.quality==="auto"?`auto\xB7${["low","mid","high"][this.stage.quality]}`:k.quality}))}_onFrame(t){let e=t.bpm>0?d(t.bpm/120,.5,1.9):1,s=d(.45+t.level*2.6,.35,3.2);this._speed=g(this._speed,e*s,.15),this.stage.setSpeedScale(this._speed),this.panel.isOpen&&(this.panel.visualizer.draw(t.spectrum,t.dt),this.panel.setBpm(t.bpm,t.bpmConfidence))}_onBeat(t){let e=performance.now(),s=wt[t.type]||1;s<this._scenePriority&&e-this._sceneAt<220||(this.beats++,this.panel.pulse(t.type),this.stage.beat(t),this.stage.spawnScene(t.type,t.strength,k.cooldown,this.detector.bpm)?(this._scenePriority=s,this._sceneAt=e,this.panel.setStatus("active",k.sourceMode==="file"?"Analyzing track\u2026":"Listening\u2026")):this.pool.size||(this.panel.setStatus("active","No images found on this page yet"),this.pool.scan()))}},Tt=0;function Jt(i){if(!i)return;let t=performance.now();t-Tt<2e3||(Tt=t,Y())}var ot=null;function Ft(){if(!ot&&window.top===window.self&&document.body)try{ot=new at,ot.init(),window.__beatimg=ot}catch(i){console.error("[BeatImg] failed to start:",i)}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>setTimeout(Ft,400),{once:!0}):setTimeout(Ft,400);})();
