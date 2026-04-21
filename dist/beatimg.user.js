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
// @description 2026-04-21T04:11:49.388Z
// ==/UserScript==
(()=>{var Lr=`@charset "UTF-8";
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");
/* ------------------------------------------------------------------ */
/* De\u011Fi\u015Fkenler                                                         */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* Toggle Butonu                                                       */
/* ------------------------------------------------------------------ */
.beatimg-toggle {
  position: fixed !important;
  top: 16px !important;
  right: 16px !important;
  z-index: 2147483645 !important;
  width: 44px !important;
  height: 44px !important;
  border-radius: 50% !important;
  background: rgba(12, 12, 22, 0.92) !important;
  backdrop-filter: blur(16px) !important;
  -webkit-backdrop-filter: blur(16px) !important;
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
  background: rgba(20, 18, 40, 0.96) !important;
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

/* ------------------------------------------------------------------ */
/* Panel                                                              */
/* ------------------------------------------------------------------ */
.beatimg-panel {
  position: fixed !important;
  top: 68px !important;
  right: 16px !important;
  z-index: 2147483644 !important;
  width: 276px !important;
  background: rgba(10, 10, 18, 0.94) !important;
  backdrop-filter: blur(28px) !important;
  -webkit-backdrop-filter: blur(28px) !important;
  border: 1px solid rgba(255, 255, 255, 0.07) !important;
  border-radius: 18px !important;
  font-family: "Poppins", system-ui, -apple-system, sans-serif !important;
  font-size: 13px !important;
  color: #e4e4f0 !important;
  display: none !important;
  flex-direction: column !important;
  overflow: hidden !important;
  box-shadow: 0 32px 64px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.06) !important;
  max-height: calc(100vh - 90px) !important;
  overflow-y: auto !important;
}
.beatimg-panel.open {
  display: flex !important;
}
.beatimg-panel * {
  box-sizing: border-box !important;
  font-family: "Poppins", system-ui, -apple-system, sans-serif !important;
}

/* Header */
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
  letter-spacing: 0.02em !important;
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
  transition: color 0.15s, background 0.15s !important;
}
.beatimg-close-btn:hover {
  color: #e4e4f0 !important;
  background: rgba(255, 255, 255, 0.07) !important;
}

/* Status Bar */
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
  transition: background 0.3s !important;
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
}

.beatimg-beat-count {
  font-size: 11px !important;
  font-weight: 600 !important;
  color: #6c63ff !important;
  background: rgba(108, 99, 255, 0.12) !important;
  padding: 2px 9px !important;
  border-radius: 100px !important;
  white-space: nowrap !important;
}

/* Visualizer Canvas */
.beatimg-visualizer {
  display: block !important;
  width: 100% !important;
  height: 50px !important;
  background: rgba(0, 0, 0, 0.35) !important;
  border-top: 1px solid rgba(255, 255, 255, 0.07) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07) !important;
}

/* Energy Bar */
.beatimg-energy-wrap {
  height: 3px !important;
  background: rgba(255, 255, 255, 0.04) !important;
}

.beatimg-energy-fill {
  height: 100% !important;
  width: 0% !important;
  background: linear-gradient(90deg, #6c63ff, #ff3b6b) !important;
  border-radius: 0 2px 2px 0 !important;
  transition: width 0.05s linear !important;
}

/* Controls */
.beatimg-controls {
  padding: 12px 16px 4px !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 10px !important;
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
  transition: transform 0.1s !important;
}
.beatimg-slider-row input[type=range]::-webkit-slider-thumb:active {
  transform: scale(1.2) !important;
}
.beatimg-slider-row input[type=range]::-moz-range-thumb {
  width: 14px !important;
  height: 14px !important;
  border-radius: 50% !important;
  background: #6c63ff !important;
  cursor: pointer !important;
  border: none !important;
}
.beatimg-slider-row .beatimg-sval {
  font-size: 11px !important;
  font-weight: 600 !important;
  color: #6c63ff !important;
  min-width: 38px !important;
  text-align: right !important;
}

/* Buttons */
.beatimg-btn-row {
  display: flex !important;
  gap: 8px !important;
  padding: 12px 16px 16px !important;
}
.beatimg-btn-row button {
  flex: 1 !important;
  padding: 9px 0 !important;
  border-radius: 10px !important;
  border: none !important;
  cursor: pointer !important;
  font-size: 12px !important;
  font-weight: 700 !important;
  font-family: "Poppins", system-ui, -apple-system, sans-serif !important;
  letter-spacing: 0.03em !important;
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

/* Beat Ring (indicator pulse inside panel) */
.beatimg-beat-ring {
  position: absolute !important;
  bottom: 16px !important;
  right: 16px !important;
  width: 10px !important;
  height: 10px !important;
  border-radius: 50% !important;
  pointer-events: none !important;
  opacity: 0 !important;
  transform-origin: center !important;
}

/* ------------------------------------------------------------------ */
/* Overlay                                                            */
/* ------------------------------------------------------------------ */
.beatimg-overlay {
  position: fixed !important;
  inset: 0 !important;
  z-index: 2147483646 !important;
  display: none;
  align-items: center !important;
  justify-content: center !important;
  background: rgba(0, 0, 0, 0.72) !important;
  backdrop-filter: blur(3px) !important;
  -webkit-backdrop-filter: blur(3px) !important;
  cursor: pointer !important;
  overflow: hidden !important;
}
.beatimg-overlay.visible {
  display: flex !important;
}

.beatimg-overlay-img {
  max-width: 78vw !important;
  max-height: 78vh !important;
  object-fit: contain !important;
  border-radius: 10px !important;
  display: block !important;
  pointer-events: none !important;
  will-change: transform, opacity, filter !important;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08), 0 0 60px rgba(108, 99, 255, 0.25), 0 48px 80px rgba(0, 0, 0, 0.85) !important;
}

/* Ekran fla\u015F tabakas\u0131 (beat an\u0131nda) */
.beatimg-flash {
  position: absolute !important;
  inset: 0 !important;
  background: #ffffff; /* JS taraf\u0131ndan de\u011Fi\u015Ftirilir \u2014 !important yok */
  opacity: 0; /* GSAP animate eder \u2014 !important yok */
  pointer-events: none !important;
  z-index: 2 !important;
}

/* Sahnedeki her bir sahne div'i \u2014 div kullan\u0131l\u0131r ki page CSS img stillerini bozmas\u0131n */
.beatimg-scene-img {
  position: absolute !important;
  display: block !important;
  pointer-events: none !important;
  will-change: transform, opacity, filter !important;
  background-size: contain !important;
  background-position: center center !important;
  background-repeat: no-repeat !important;
  box-sizing: border-box !important;
}

/* ------------------------------------------------------------------ */
/* Kaynak Sekmeleri                                                    */
/* ------------------------------------------------------------------ */
.beatimg-source-tabs {
  display: flex !important;
  gap: 4px !important;
  padding: 10px 16px 0 !important;
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
  font-family: "Poppins", system-ui, -apple-system, sans-serif !important;
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

/* ------------------------------------------------------------------ */
/* Dosya Y\xFCkleme Alan\u0131                                                 */
/* ------------------------------------------------------------------ */
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
  justify-content: center !important;
  gap: 5px !important;
  padding: 14px 10px !important;
  border: 1.5px dashed rgba(108, 99, 255, 0.35) !important;
  border-radius: 10px !important;
  background: rgba(108, 99, 255, 0.05) !important;
  cursor: pointer !important;
  transition: border-color 0.15s, background 0.15s !important;
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

.beatimg-audio-info {
  margin-top: 7px !important;
  min-height: 16px !important;
  overflow: hidden !important;
}

.beatimg-audio-name {
  display: block !important;
  font-size: 11px !important;
  font-weight: 500 !important;
  color: #2bff9a !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  max-width: 100% !important;
}

.beatimg-audio {
  display: block !important;
  width: 100% !important;
  height: 28px !important;
  margin-top: 8px !important;
  border-radius: 6px !important;
  outline: none !important;
  accent-color: #6c63ff !important;
  filter: invert(0.85) hue-rotate(220deg) !important;
}`;document.head.appendChild(document.createElement("style")).appendChild(document.createTextNode(Lr));function vt(h){if(h===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return h}function Ii(h,t){h.prototype=Object.create(t.prototype),h.prototype.constructor=h,h.__proto__=t}var rt={autoSleep:120,force3D:"auto",nullTargetWarn:1,units:{lineHeight:""}},le={duration:.5,overwrite:!1,delay:0},Je,W,z,ft=1e8,D=1/ft,Ue=Math.PI*2,Ir=Ue/4,$r=0,$i=Math.sqrt,Nr=Math.cos,qr=Math.sin,X=function(t){return typeof t=="string"},N=function(t){return typeof t=="function"},yt=function(t){return typeof t=="number"},Pe=function(t){return typeof t>"u"},_t=function(t){return typeof t=="object"},it=function(t){return t!==!1},ti=function(){return typeof window<"u"},ge=function(t){return N(t)||X(t)},Ni=typeof ArrayBuffer=="function"&&ArrayBuffer.isView||function(){},Z=Array.isArray,Vr=/random\([^)]+\)/g,Ur=/,\s*/g,Oi=/(?:-?\.?\d|\.)+/gi,ei=/[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,Lt=/[-+=.]*\d+[.e-]*\d*[a-z%]*/g,Be=/[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,ii=/[+-]=-?[.\d]+/,Yr=/[^,'"\[\]\s]+/gi,Xr=/^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,L,dt,Ye,ri,at={},xe={},qi,Vi=function(t){return(xe=Ht(t,at))&&j},Ce=function(t,e){return console.warn("Invalid property",t,"set to",e,"Missing plugin? gsap.registerPlugin()")},he=function(t,e){return!e&&console.warn(t)},Ui=function(t,e){return t&&(at[t]=e)&&xe&&(xe[t]=e)||at},ue=function(){return 0},Hr={suppressEvents:!0,isStart:!0,kill:!1},ve={suppressEvents:!0,kill:!1},Wr={suppressEvents:!0},ni={},St=[],Xe={},Yi,tt={},Le={},Ai=30,be=[],si="",ai=function(t){var e=t[0],i,r;if(_t(e)||N(e)||(t=[t]),!(i=(e._gsap||{}).harness)){for(r=be.length;r--&&!be[r].targetTest(e););i=be[r]}for(r=t.length;r--;)t[r]&&(t[r]._gsap||(t[r]._gsap=new ui(t[r],i)))||t.splice(r,1);return t},kt=function(t){return t._gsap||ai(ct(t))[0]._gsap},oi=function(t,e,i){return(i=t[e])&&N(i)?t[e]():Pe(i)&&t.getAttribute&&t.getAttribute(e)||i},K=function(t,e){return(t=t.split(",")).forEach(e)||t},q=function(t){return Math.round(t*1e5)/1e5||0},B=function(t){return Math.round(t*1e7)/1e7||0},It=function(t,e){var i=e.charAt(0),r=parseFloat(e.substr(2));return t=parseFloat(t),i==="+"?t+r:i==="-"?t-r:i==="*"?t*r:t/r},Gr=function(t,e){for(var i=e.length,r=0;t.indexOf(e[r])<0&&++r<i;);return r<i},we=function(){var t=St.length,e=St.slice(0),i,r;for(Xe={},St.length=0,i=0;i<t;i++)r=e[i],r&&r._lazy&&(r.render(r._lazy[0],r._lazy[1],!0)._lazy=0)},li=function(t){return!!(t._initted||t._startAt||t.add)},Xi=function(t,e,i,r){St.length&&!W&&we(),t.render(e,i,r||!!(W&&e<0&&li(t))),St.length&&!W&&we()},Hi=function(t){var e=parseFloat(t);return(e||e===0)&&(t+"").match(Yr).length<2?e:X(t)?t.trim():t},Wi=function(t){return t},ot=function(t,e){for(var i in e)i in t||(t[i]=e[i]);return t},Qr=function(t){return function(e,i){for(var r in i)r in e||r==="duration"&&t||r==="ease"||(e[r]=i[r])}},Ht=function(t,e){for(var i in e)t[i]=e[i];return t},Ri=function h(t,e){for(var i in e)i!=="__proto__"&&i!=="constructor"&&i!=="prototype"&&(t[i]=_t(e[i])?h(t[i]||(t[i]={}),e[i]):e[i]);return t},Te=function(t,e){var i={},r;for(r in t)r in e||(i[r]=t[r]);return i},se=function(t){var e=t.parent||L,i=t.keyframes?Qr(Z(t.keyframes)):ot;if(it(t.inherit))for(;e;)i(t,e.vars.defaults),e=e.parent||e._dp;return t},Zr=function(t,e){for(var i=t.length,r=i===e.length;r&&i--&&t[i]===e[i];);return i<0},Gi=function(t,e,i,r,n){i===void 0&&(i="_first"),r===void 0&&(r="_last");var s=t[r],a;if(n)for(a=e[n];s&&s[n]>a;)s=s._prev;return s?(e._next=s._next,s._next=e):(e._next=t[i],t[i]=e),e._next?e._next._prev=e:t[r]=e,e._prev=s,e.parent=e._dp=t,e},Me=function(t,e,i,r){i===void 0&&(i="_first"),r===void 0&&(r="_last");var n=e._prev,s=e._next;n?n._next=s:t[i]===e&&(t[i]=s),s?s._prev=n:t[r]===e&&(t[r]=n),e._next=e._prev=e.parent=null},Pt=function(t,e){t.parent&&(!e||t.parent.autoRemoveChildren)&&t.parent.remove&&t.parent.remove(t),t._act=0},Ft=function(t,e){if(t&&(!e||e._end>t._dur||e._start<0))for(var i=t;i;)i._dirty=1,i=i.parent;return t},jr=function(t){for(var e=t.parent;e&&e.parent;)e._dirty=1,e.totalDuration(),e=e.parent;return t},He=function(t,e,i,r){return t._startAt&&(W?t._startAt.revert(ve):t.vars.immediateRender&&!t.vars.autoRevert||t._startAt.render(e,!0,r))},Kr=function h(t){return!t||t._ts&&h(t.parent)},Di=function(t){return t._repeat?Wt(t._tTime,t=t.duration()+t._rDelay)*t:0},Wt=function(t,e){var i=Math.floor(t=B(t/e));return t&&i===t?i-1:i},Se=function(t,e){return(t-e._start)*e._ts+(e._ts>=0?0:e._dirty?e.totalDuration():e._tDur)},Ee=function(t){return t._end=B(t._start+(t._tDur/Math.abs(t._ts||t._rts||D)||0))},Oe=function(t,e){var i=t._dp;return i&&i.smoothChildTiming&&t._ts&&(t._start=B(i._time-(t._ts>0?e/t._ts:((t._dirty?t.totalDuration():t._tDur)-e)/-t._ts)),Ee(t),i._dirty||Ft(i,t)),t},Qi=function(t,e){var i;if((e._time||!e._dur&&e._initted||e._start<t._time&&(e._dur||!e.add))&&(i=Se(t.rawTime(),e),(!e._dur||de(0,e.totalDuration(),i)-e._tTime>D)&&e.render(i,!0)),Ft(t,e)._dp&&t._initted&&t._time>=t._dur&&t._ts){if(t._dur<t.duration())for(i=t;i._dp;)i.rawTime()>=0&&i.totalTime(i._tTime),i=i._dp;t._zTime=-D}},pt=function(t,e,i,r){return e.parent&&Pt(e),e._start=B((yt(i)?i:i||t!==L?ut(t,i,e):t._time)+e._delay),e._end=B(e._start+(e.totalDuration()/Math.abs(e.timeScale())||0)),Gi(t,e,"_first","_last",t._sort?"_start":0),We(e)||(t._recent=e),r||Qi(t,e),t._ts<0&&Oe(t,t._tTime),t},Zi=function(t,e){return(at.ScrollTrigger||Ce("scrollTrigger",e))&&at.ScrollTrigger.create(e,t)},ji=function(t,e,i,r,n){if(di(t,e,n),!t._initted)return 1;if(!i&&t._pt&&!W&&(t._dur&&t.vars.lazy!==!1||!t._dur&&t.vars.lazy)&&Yi!==et.frame)return St.push(t),t._lazy=[n,r],1},Jr=function h(t){var e=t.parent;return e&&e._ts&&e._initted&&!e._lock&&(e.rawTime()<0||h(e))},We=function(t){var e=t.data;return e==="isFromStart"||e==="isStart"},tn=function(t,e,i,r){var n=t.ratio,s=e<0||!e&&(!t._start&&Jr(t)&&!(!t._initted&&We(t))||(t._ts<0||t._dp._ts<0)&&!We(t))?0:1,a=t._rDelay,o=0,l,u,c;if(a&&t._repeat&&(o=de(0,t._tDur,e),u=Wt(o,a),t._yoyo&&u&1&&(s=1-s),u!==Wt(t._tTime,a)&&(n=1-s,t.vars.repeatRefresh&&t._initted&&t.invalidate())),s!==n||W||r||t._zTime===D||!e&&t._zTime){if(!t._initted&&ji(t,e,r,i,o))return;for(c=t._zTime,t._zTime=e||(i?D:0),i||(i=e&&!c),t.ratio=s,t._from&&(s=1-s),t._time=0,t._tTime=o,l=t._pt;l;)l.r(s,l.d),l=l._next;e<0&&He(t,e,i,!0),t._onUpdate&&!i&&st(t,"onUpdate"),o&&t._repeat&&!i&&t.parent&&st(t,"onRepeat"),(e>=t._tDur||e<0)&&t.ratio===s&&(s&&Pt(t,1),!i&&!W&&(st(t,s?"onComplete":"onReverseComplete",!0),t._prom&&t._prom()))}else t._zTime||(t._zTime=e)},en=function(t,e,i){var r;if(i>e)for(r=t._first;r&&r._start<=i;){if(r.data==="isPause"&&r._start>e)return r;r=r._next}else for(r=t._last;r&&r._start>=i;){if(r.data==="isPause"&&r._start<e)return r;r=r._prev}},Gt=function(t,e,i,r){var n=t._repeat,s=B(e)||0,a=t._tTime/t._tDur;return a&&!r&&(t._time*=s/t._dur),t._dur=s,t._tDur=n?n<0?1e10:B(s*(n+1)+t._rDelay*n):s,a>0&&!r&&Oe(t,t._tTime=t._tDur*a),t.parent&&Ee(t),i||Ft(t.parent,t),t},Fi=function(t){return t instanceof Q?Ft(t):Gt(t,t._dur)},rn={_start:0,endTime:ue,totalDuration:ue},ut=function h(t,e,i){var r=t.labels,n=t._recent||rn,s=t.duration()>=ft?n.endTime(!1):t._dur,a,o,l;return X(e)&&(isNaN(e)||e in r)?(o=e.charAt(0),l=e.substr(-1)==="%",a=e.indexOf("="),o==="<"||o===">"?(a>=0&&(e=e.replace(/=/,"")),(o==="<"?n._start:n.endTime(n._repeat>=0))+(parseFloat(e.substr(1))||0)*(l?(a<0?n:i).totalDuration()/100:1)):a<0?(e in r||(r[e]=s),r[e]):(o=parseFloat(e.charAt(a-1)+e.substr(a+1)),l&&i&&(o=o/100*(Z(i)?i[0]:i).totalDuration()),a>1?h(t,e.substr(0,a-1),i)+o:s+o)):e==null?s:+e},ae=function(t,e,i){var r=yt(e[1]),n=(r?2:1)+(t<2?0:1),s=e[n],a,o;if(r&&(s.duration=e[1]),s.parent=i,t){for(a=s,o=i;o&&!("immediateRender"in a);)a=o.vars.defaults||{},o=it(o.vars.inherit)&&o.parent;s.immediateRender=it(a.immediateRender),t<2?s.runBackwards=1:s.startAt=e[n-1]}return new U(e[0],s,e[n+1])},Ct=function(t,e){return t||t===0?e(t):e},de=function(t,e,i){return i<t?t:i>e?e:i},G=function(t,e){return!X(t)||!(e=Xr.exec(t))?"":e[1]},nn=function(t,e,i){return Ct(i,function(r){return de(t,e,r)})},Ge=[].slice,Ki=function(t,e){return t&&_t(t)&&"length"in t&&(!e&&!t.length||t.length-1 in t&&_t(t[0]))&&!t.nodeType&&t!==dt},sn=function(t,e,i){return i===void 0&&(i=[]),t.forEach(function(r){var n;return X(r)&&!e||Ki(r,1)?(n=i).push.apply(n,ct(r)):i.push(r)})||i},ct=function(t,e,i){return z&&!e&&z.selector?z.selector(t):X(t)&&!i&&(Ye||!Qt())?Ge.call((e||ri).querySelectorAll(t),0):Z(t)?sn(t,i):Ki(t)?Ge.call(t,0):t?[t]:[]},Qe=function(t){return t=ct(t)[0]||he("Invalid scope")||{},function(e){var i=t.current||t.nativeElement||t;return ct(e,i.querySelectorAll?i:i===t?he("Invalid scope")||ri.createElement("div"):t)}},Ji=function(t){return t.sort(function(){return .5-Math.random()})},tr=function(t){if(N(t))return t;var e=_t(t)?t:{each:t},i=zt(e.ease),r=e.from||0,n=parseFloat(e.base)||0,s={},a=r>0&&r<1,o=isNaN(r)||a,l=e.axis,u=r,c=r;return X(r)?u=c={center:.5,edges:.5,end:1}[r]||0:!a&&o&&(u=r[0],c=r[1]),function(d,p,_){var f=(_||e).length,m=s[f],b,v,y,x,g,k,w,S,T;if(!m){if(T=e.grid==="auto"?0:(e.grid||[1,ft])[1],!T){for(w=-ft;w<(w=_[T++].getBoundingClientRect().left)&&T<f;);T<f&&T--}for(m=s[f]=[],b=o?Math.min(T,f)*u-.5:r%T,v=T===ft?0:o?f*c/T-.5:r/T|0,w=0,S=ft,k=0;k<f;k++)y=k%T-b,x=v-(k/T|0),m[k]=g=l?Math.abs(l==="y"?x:y):$i(y*y+x*x),g>w&&(w=g),g<S&&(S=g);r==="random"&&Ji(m),m.max=w-S,m.min=S,m.v=f=(parseFloat(e.amount)||parseFloat(e.each)*(T>f?f-1:l?l==="y"?f/T:T:Math.max(T,f/T))||0)*(r==="edges"?-1:1),m.b=f<0?n-f:n,m.u=G(e.amount||e.each)||0,i=i&&f<0?vn(i):i}return f=(m[d]-m.min)/m.max||0,B(m.b+(i?i(f):f)*m.v)+m.u}},Ze=function(t){var e=Math.pow(10,((t+"").split(".")[1]||"").length);return function(i){var r=B(Math.round(parseFloat(i)/t)*t*e);return(r-r%1)/e+(yt(i)?0:G(i))}},er=function(t,e){var i=Z(t),r,n;return!i&&_t(t)&&(r=i=t.radius||ft,t.values?(t=ct(t.values),(n=!yt(t[0]))&&(r*=r)):t=Ze(t.increment)),Ct(e,i?N(t)?function(s){return n=t(s),Math.abs(n-s)<=r?n:s}:function(s){for(var a=parseFloat(n?s.x:s),o=parseFloat(n?s.y:0),l=ft,u=0,c=t.length,d,p;c--;)n?(d=t[c].x-a,p=t[c].y-o,d=d*d+p*p):d=Math.abs(t[c]-a),d<l&&(l=d,u=c);return u=!r||l<=r?t[u]:s,n||u===s||yt(s)?u:u+G(s)}:Ze(t))},ir=function(t,e,i,r){return Ct(Z(t)?!e:i===!0?!!(i=0):!r,function(){return Z(t)?t[~~(Math.random()*t.length)]:(i=i||1e-5)&&(r=i<1?Math.pow(10,(i+"").length-2):1)&&Math.floor(Math.round((t-i/2+Math.random()*(e-t+i*.99))/i)*i*r)/r})},an=function(){for(var t=arguments.length,e=new Array(t),i=0;i<t;i++)e[i]=arguments[i];return function(r){return e.reduce(function(n,s){return s(n)},r)}},on=function(t,e){return function(i){return t(parseFloat(i))+(e||G(i))}},ln=function(t,e,i){return nr(t,e,0,1,i)},rr=function(t,e,i){return Ct(i,function(r){return t[~~e(r)]})},hn=function h(t,e,i){var r=e-t;return Z(t)?rr(t,h(0,t.length),e):Ct(i,function(n){return(r+(n-t)%r)%r+t})},un=function h(t,e,i){var r=e-t,n=r*2;return Z(t)?rr(t,h(0,t.length-1),e):Ct(i,function(s){return s=(n+(s-t)%n)%n||0,t+(s>r?n-s:s)})},Zt=function(t){return t.replace(Vr,function(e){var i=e.indexOf("[")+1,r=e.substring(i||7,i?e.indexOf("]"):e.length-1).split(Ur);return ir(i?r:+r[0],i?0:+r[1],+r[2]||1e-5)})},nr=function(t,e,i,r,n){var s=e-t,a=r-i;return Ct(n,function(o){return i+((o-t)/s*a||0)})},fn=function h(t,e,i,r){var n=isNaN(t+e)?0:function(p){return(1-p)*t+p*e};if(!n){var s=X(t),a={},o,l,u,c,d;if(i===!0&&(r=1)&&(i=null),s)t={p:t},e={p:e};else if(Z(t)&&!Z(e)){for(u=[],c=t.length,d=c-2,l=1;l<c;l++)u.push(h(t[l-1],t[l]));c--,n=function(_){_*=c;var f=Math.min(d,~~_);return u[f](_-f)},i=e}else r||(t=Ht(Z(t)?[]:{},t));if(!u){for(o in e)fi.call(a,t,o,"get",e[o]);n=function(_){return mi(_,a)||(s?t.p:t)}}}return Ct(i,n)},zi=function(t,e,i){var r=t.labels,n=ft,s,a,o;for(s in r)a=r[s]-e,a<0==!!i&&a&&n>(a=Math.abs(a))&&(o=s,n=a);return o},st=function(t,e,i){var r=t.vars,n=r[e],s=z,a=t._ctx,o,l,u;if(n)return o=r[e+"Params"],l=r.callbackScope||t,i&&St.length&&we(),a&&(z=a),u=o?n.apply(l,o):n.call(l),z=s,u},re=function(t){return Pt(t),t.scrollTrigger&&t.scrollTrigger.kill(!!W),t.progress()<1&&st(t,"onInterrupt"),t},Xt,sr=[],ar=function(t){if(t)if(t=!t.name&&t.default||t,ti()||t.headless){var e=t.name,i=N(t),r=e&&!i&&t.init?function(){this._props=[]}:t,n={init:ue,render:mi,add:fi,kill:Mn,modifier:Cn,rawVars:0},s={targetTest:0,get:0,getSetter:Ae,aliases:{},register:0};if(Qt(),t!==r){if(tt[e])return;ot(r,ot(Te(t,n),s)),Ht(r.prototype,Ht(n,Te(t,s))),tt[r.prop=e]=r,t.targetTest&&(be.push(r),ni[e]=1),e=(e==="css"?"CSS":e.charAt(0).toUpperCase()+e.substr(1))+"Plugin"}Ui(e,r),t.register&&t.register(j,r,J)}else sr.push(t)},R=255,ne={aqua:[0,R,R],lime:[0,R,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,R],navy:[0,0,128],white:[R,R,R],olive:[128,128,0],yellow:[R,R,0],orange:[R,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[R,0,0],pink:[R,192,203],cyan:[0,R,R],transparent:[R,R,R,0]},Ie=function(t,e,i){return t+=t<0?1:t>1?-1:0,(t*6<1?e+(i-e)*t*6:t<.5?i:t*3<2?e+(i-e)*(2/3-t)*6:e)*R+.5|0},or=function(t,e,i){var r=t?yt(t)?[t>>16,t>>8&R,t&R]:0:ne.black,n,s,a,o,l,u,c,d,p,_;if(!r){if(t.substr(-1)===","&&(t=t.substr(0,t.length-1)),ne[t])r=ne[t];else if(t.charAt(0)==="#"){if(t.length<6&&(n=t.charAt(1),s=t.charAt(2),a=t.charAt(3),t="#"+n+n+s+s+a+a+(t.length===5?t.charAt(4)+t.charAt(4):"")),t.length===9)return r=parseInt(t.substr(1,6),16),[r>>16,r>>8&R,r&R,parseInt(t.substr(7),16)/255];t=parseInt(t.substr(1),16),r=[t>>16,t>>8&R,t&R]}else if(t.substr(0,3)==="hsl"){if(r=_=t.match(Oi),!e)o=+r[0]%360/360,l=+r[1]/100,u=+r[2]/100,s=u<=.5?u*(l+1):u+l-u*l,n=u*2-s,r.length>3&&(r[3]*=1),r[0]=Ie(o+1/3,n,s),r[1]=Ie(o,n,s),r[2]=Ie(o-1/3,n,s);else if(~t.indexOf("="))return r=t.match(ei),i&&r.length<4&&(r[3]=1),r}else r=t.match(Oi)||ne.transparent;r=r.map(Number)}return e&&!_&&(n=r[0]/R,s=r[1]/R,a=r[2]/R,c=Math.max(n,s,a),d=Math.min(n,s,a),u=(c+d)/2,c===d?o=l=0:(p=c-d,l=u>.5?p/(2-c-d):p/(c+d),o=c===n?(s-a)/p+(s<a?6:0):c===s?(a-n)/p+2:(n-s)/p+4,o*=60),r[0]=~~(o+.5),r[1]=~~(l*100+.5),r[2]=~~(u*100+.5)),i&&r.length<4&&(r[3]=1),r},lr=function(t){var e=[],i=[],r=-1;return t.split(bt).forEach(function(n){var s=n.match(Lt)||[];e.push.apply(e,s),i.push(r+=s.length+1)}),e.c=i,e},Bi=function(t,e,i){var r="",n=(t+r).match(bt),s=e?"hsla(":"rgba(",a=0,o,l,u,c;if(!n)return t;if(n=n.map(function(d){return(d=or(d,e,1))&&s+(e?d[0]+","+d[1]+"%,"+d[2]+"%,"+d[3]:d.join(","))+")"}),i&&(u=lr(t),o=i.c,o.join(r)!==u.c.join(r)))for(l=t.replace(bt,"1").split(Lt),c=l.length-1;a<c;a++)r+=l[a]+(~o.indexOf(a)?n.shift()||s+"0,0,0,0)":(u.length?u:n.length?n:i).shift());if(!l)for(l=t.split(bt),c=l.length-1;a<c;a++)r+=l[a]+n[a];return r+l[c]},bt=function(){var h="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",t;for(t in ne)h+="|"+t+"\\b";return new RegExp(h+")","gi")}(),cn=/hsl[a]?\(/,hi=function(t){var e=t.join(" "),i;if(bt.lastIndex=0,bt.test(e))return i=cn.test(e),t[1]=Bi(t[1],i),t[0]=Bi(t[0],i,lr(t[1])),!0},fe,et=function(){var h=Date.now,t=500,e=33,i=h(),r=i,n=1e3/240,s=n,a=[],o,l,u,c,d,p,_=function f(m){var b=h()-r,v=m===!0,y,x,g,k;if((b>t||b<0)&&(i+=b-e),r+=b,g=r-i,y=g-s,(y>0||v)&&(k=++c.frame,d=g-c.time*1e3,c.time=g=g/1e3,s+=y+(y>=n?4:n-y),x=1),v||(o=l(f)),x)for(p=0;p<a.length;p++)a[p](g,d,k,m)};return c={time:0,frame:0,tick:function(){_(!0)},deltaRatio:function(m){return d/(1e3/(m||60))},wake:function(){qi&&(!Ye&&ti()&&(dt=Ye=window,ri=dt.document||{},at.gsap=j,(dt.gsapVersions||(dt.gsapVersions=[])).push(j.version),Vi(xe||dt.GreenSockGlobals||!dt.gsap&&dt||{}),sr.forEach(ar)),u=typeof requestAnimationFrame<"u"&&requestAnimationFrame,o&&c.sleep(),l=u||function(m){return setTimeout(m,s-c.time*1e3+1|0)},fe=1,_(2))},sleep:function(){(u?cancelAnimationFrame:clearTimeout)(o),fe=0,l=ue},lagSmoothing:function(m,b){t=m||1/0,e=Math.min(b||33,t)},fps:function(m){n=1e3/(m||240),s=c.time*1e3+n},add:function(m,b,v){var y=b?function(x,g,k,w){m(x,g,k,w),c.remove(y)}:m;return c.remove(m),a[v?"unshift":"push"](y),Qt(),y},remove:function(m,b){~(b=a.indexOf(m))&&a.splice(b,1)&&p>=b&&p--},_listeners:a},c}(),Qt=function(){return!fe&&et.wake()},M={},dn=/^[\d.\-M][\d.\-,\s]/,pn=/["']/g,_n=function(t){for(var e={},i=t.substr(1,t.length-3).split(":"),r=i[0],n=1,s=i.length,a,o,l;n<s;n++)o=i[n],a=n!==s-1?o.lastIndexOf(","):o.length,l=o.substr(0,a),e[r]=isNaN(l)?l.replace(pn,"").trim():+l,r=o.substr(a+1).trim();return e},mn=function(t){var e=t.indexOf("(")+1,i=t.indexOf(")"),r=t.indexOf("(",e);return t.substring(e,~r&&r<i?t.indexOf(")",i+1):i)},gn=function(t){var e=(t+"").split("("),i=M[e[0]];return i&&e.length>1&&i.config?i.config.apply(null,~t.indexOf("{")?[_n(e[1])]:mn(t).split(",").map(Hi)):M._CE&&dn.test(t)?M._CE("",t):i},vn=function(t){return function(e){return 1-t(1-e)}},zt=function(t,e){return t&&(N(t)?t:M[t]||gn(t))||e},$t=function(t,e,i,r){i===void 0&&(i=function(o){return 1-e(1-o)}),r===void 0&&(r=function(o){return o<.5?e(o*2)/2:1-e((1-o)*2)/2});var n={easeIn:e,easeOut:i,easeInOut:r},s;return K(t,function(a){M[a]=at[a]=n,M[s=a.toLowerCase()]=i;for(var o in n)M[s+(o==="easeIn"?".in":o==="easeOut"?".out":".inOut")]=M[a+"."+o]=n[o]}),n},hr=function(t){return function(e){return e<.5?(1-t(1-e*2))/2:.5+t((e-.5)*2)/2}},$e=function h(t,e,i){var r=e>=1?e:1,n=(i||(t?.3:.45))/(e<1?e:1),s=n/Ue*(Math.asin(1/r)||0),a=function(u){return u===1?1:r*Math.pow(2,-10*u)*qr((u-s)*n)+1},o=t==="out"?a:t==="in"?function(l){return 1-a(1-l)}:hr(a);return n=Ue/n,o.config=function(l,u){return h(t,l,u)},o},Ne=function h(t,e){e===void 0&&(e=1.70158);var i=function(s){return s?--s*s*((e+1)*s+e)+1:0},r=t==="out"?i:t==="in"?function(n){return 1-i(1-n)}:hr(i);return r.config=function(n){return h(t,n)},r};K("Linear,Quad,Cubic,Quart,Quint,Strong",function(h,t){var e=t<5?t+1:t;$t(h+",Power"+(e-1),t?function(i){return Math.pow(i,e)}:function(i){return i},function(i){return 1-Math.pow(1-i,e)},function(i){return i<.5?Math.pow(i*2,e)/2:1-Math.pow((1-i)*2,e)/2})});M.Linear.easeNone=M.none=M.Linear.easeIn;$t("Elastic",$e("in"),$e("out"),$e());(function(h,t){var e=1/t,i=2*e,r=2.5*e,n=function(a){return a<e?h*a*a:a<i?h*Math.pow(a-1.5/t,2)+.75:a<r?h*(a-=2.25/t)*a+.9375:h*Math.pow(a-2.625/t,2)+.984375};$t("Bounce",function(s){return 1-n(1-s)},n)})(7.5625,2.75);$t("Expo",function(h){return Math.pow(2,10*(h-1))*h+h*h*h*h*h*h*(1-h)});$t("Circ",function(h){return-($i(1-h*h)-1)});$t("Sine",function(h){return h===1?1:-Nr(h*Ir)+1});$t("Back",Ne("in"),Ne("out"),Ne());M.SteppedEase=M.steps=at.SteppedEase={config:function(t,e){t===void 0&&(t=1);var i=1/t,r=t+(e?0:1),n=e?1:0,s=1-D;return function(a){return((r*de(0,s,a)|0)+n)*i}}};le.ease=M["quad.out"];K("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",function(h){return si+=h+","+h+"Params,"});var ui=function(t,e){this.id=$r++,t._gsap=this,this.target=t,this.harness=e,this.get=e?e.get:oi,this.set=e?e.getSetter:Ae},ce=function(){function h(e){this.vars=e,this._delay=+e.delay||0,(this._repeat=e.repeat===1/0?-2:e.repeat||0)&&(this._rDelay=e.repeatDelay||0,this._yoyo=!!e.yoyo||!!e.yoyoEase),this._ts=1,Gt(this,+e.duration,1,1),this.data=e.data,z&&(this._ctx=z,z.data.push(this)),fe||et.wake()}var t=h.prototype;return t.delay=function(i){return i||i===0?(this.parent&&this.parent.smoothChildTiming&&this.startTime(this._start+i-this._delay),this._delay=i,this):this._delay},t.duration=function(i){return arguments.length?this.totalDuration(this._repeat>0?i+(i+this._rDelay)*this._repeat:i):this.totalDuration()&&this._dur},t.totalDuration=function(i){return arguments.length?(this._dirty=0,Gt(this,this._repeat<0?i:(i-this._repeat*this._rDelay)/(this._repeat+1))):this._tDur},t.totalTime=function(i,r){if(Qt(),!arguments.length)return this._tTime;var n=this._dp;if(n&&n.smoothChildTiming&&this._ts){for(Oe(this,i),!n._dp||n.parent||Qi(n,this);n&&n.parent;)n.parent._time!==n._start+(n._ts>=0?n._tTime/n._ts:(n.totalDuration()-n._tTime)/-n._ts)&&n.totalTime(n._tTime,!0),n=n.parent;!this.parent&&this._dp.autoRemoveChildren&&(this._ts>0&&i<this._tDur||this._ts<0&&i>0||!this._tDur&&!i)&&pt(this._dp,this,this._start-this._delay)}return(this._tTime!==i||!this._dur&&!r||this._initted&&Math.abs(this._zTime)===D||!this._initted&&this._dur&&i||!i&&!this._initted&&(this.add||this._ptLookup))&&(this._ts||(this._pTime=i),Xi(this,i,r)),this},t.time=function(i,r){return arguments.length?this.totalTime(Math.min(this.totalDuration(),i+Di(this))%(this._dur+this._rDelay)||(i?this._dur:0),r):this._time},t.totalProgress=function(i,r){return arguments.length?this.totalTime(this.totalDuration()*i,r):this.totalDuration()?Math.min(1,this._tTime/this._tDur):this.rawTime()>=0&&this._initted?1:0},t.progress=function(i,r){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&!(this.iteration()&1)?1-i:i)+Di(this),r):this.duration()?Math.min(1,this._time/this._dur):this.rawTime()>0?1:0},t.iteration=function(i,r){var n=this.duration()+this._rDelay;return arguments.length?this.totalTime(this._time+(i-1)*n,r):this._repeat?Wt(this._tTime,n)+1:1},t.timeScale=function(i,r){if(!arguments.length)return this._rts===-D?0:this._rts;if(this._rts===i)return this;var n=this.parent&&this._ts?Se(this.parent._time,this):this._tTime;return this._rts=+i||0,this._ts=this._ps||i===-D?0:this._rts,this.totalTime(de(-Math.abs(this._delay),this.totalDuration(),n),r!==!1),Ee(this),jr(this)},t.paused=function(i){return arguments.length?(this._ps!==i&&(this._ps=i,i?(this._pTime=this._tTime||Math.max(-this._delay,this.rawTime()),this._ts=this._act=0):(Qt(),this._ts=this._rts,this.totalTime(this.parent&&!this.parent.smoothChildTiming?this.rawTime():this._tTime||this._pTime,this.progress()===1&&Math.abs(this._zTime)!==D&&(this._tTime-=D)))),this):this._ps},t.startTime=function(i){if(arguments.length){this._start=B(i);var r=this.parent||this._dp;return r&&(r._sort||!this.parent)&&pt(r,this,this._start-this._delay),this}return this._start},t.endTime=function(i){return this._start+(it(i)?this.totalDuration():this.duration())/Math.abs(this._ts||1)},t.rawTime=function(i){var r=this.parent||this._dp;return r?i&&(!this._ts||this._repeat&&this._time&&this.totalProgress()<1)?this._tTime%(this._dur+this._rDelay):this._ts?Se(r.rawTime(i),this):this._tTime:this._tTime},t.revert=function(i){i===void 0&&(i=Wr);var r=W;return W=i,li(this)&&(this.timeline&&this.timeline.revert(i),this.totalTime(-.01,i.suppressEvents)),this.data!=="nested"&&i.kill!==!1&&this.kill(),W=r,this},t.globalTime=function(i){for(var r=this,n=arguments.length?i:r.rawTime();r;)n=r._start+n/(Math.abs(r._ts)||1),r=r._dp;return!this.parent&&this._sat?this._sat.globalTime(i):n},t.repeat=function(i){return arguments.length?(this._repeat=i===1/0?-2:i,Fi(this)):this._repeat===-2?1/0:this._repeat},t.repeatDelay=function(i){if(arguments.length){var r=this._time;return this._rDelay=i,Fi(this),r?this.time(r):this}return this._rDelay},t.yoyo=function(i){return arguments.length?(this._yoyo=i,this):this._yoyo},t.seek=function(i,r){return this.totalTime(ut(this,i),it(r))},t.restart=function(i,r){return this.play().totalTime(i?-this._delay:0,it(r)),this._dur||(this._zTime=-D),this},t.play=function(i,r){return i!=null&&this.seek(i,r),this.reversed(!1).paused(!1)},t.reverse=function(i,r){return i!=null&&this.seek(i||this.totalDuration(),r),this.reversed(!0).paused(!1)},t.pause=function(i,r){return i!=null&&this.seek(i,r),this.paused(!0)},t.resume=function(){return this.paused(!1)},t.reversed=function(i){return arguments.length?(!!i!==this.reversed()&&this.timeScale(-this._rts||(i?-D:0)),this):this._rts<0},t.invalidate=function(){return this._initted=this._act=0,this._zTime=-D,this},t.isActive=function(){var i=this.parent||this._dp,r=this._start,n;return!!(!i||this._ts&&this._initted&&i.isActive()&&(n=i.rawTime(!0))>=r&&n<this.endTime(!0)-D)},t.eventCallback=function(i,r,n){var s=this.vars;return arguments.length>1?(r?(s[i]=r,n&&(s[i+"Params"]=n),i==="onUpdate"&&(this._onUpdate=r)):delete s[i],this):s[i]},t.then=function(i){var r=this,n=r._prom;return new Promise(function(s){var a=N(i)?i:Wi,o=function(){var u=r.then;r.then=null,n&&n(),N(a)&&(a=a(r))&&(a.then||a===r)&&(r.then=u),s(a),r.then=u};r._initted&&r.totalProgress()===1&&r._ts>=0||!r._tTime&&r._ts<0?o():r._prom=o})},t.kill=function(){re(this)},h}();ot(ce.prototype,{_time:0,_start:0,_end:0,_tTime:0,_tDur:0,_dirty:0,_repeat:0,_yoyo:!1,parent:null,_initted:!1,_rDelay:0,_ts:1,_dp:0,ratio:0,_zTime:-D,_prom:0,_ps:!1,_rts:1});var Q=function(h){Ii(t,h);function t(i,r){var n;return i===void 0&&(i={}),n=h.call(this,i)||this,n.labels={},n.smoothChildTiming=!!i.smoothChildTiming,n.autoRemoveChildren=!!i.autoRemoveChildren,n._sort=it(i.sortChildren),L&&pt(i.parent||L,vt(n),r),i.reversed&&n.reverse(),i.paused&&n.paused(!0),i.scrollTrigger&&Zi(vt(n),i.scrollTrigger),n}var e=t.prototype;return e.to=function(r,n,s){return ae(0,arguments,this),this},e.from=function(r,n,s){return ae(1,arguments,this),this},e.fromTo=function(r,n,s,a){return ae(2,arguments,this),this},e.set=function(r,n,s){return n.duration=0,n.parent=this,se(n).repeatDelay||(n.repeat=0),n.immediateRender=!!n.immediateRender,new U(r,n,ut(this,s),1),this},e.call=function(r,n,s){return pt(this,U.delayedCall(0,r,n),s)},e.staggerTo=function(r,n,s,a,o,l,u){return s.duration=n,s.stagger=s.stagger||a,s.onComplete=l,s.onCompleteParams=u,s.parent=this,new U(r,s,ut(this,o)),this},e.staggerFrom=function(r,n,s,a,o,l,u){return s.runBackwards=1,se(s).immediateRender=it(s.immediateRender),this.staggerTo(r,n,s,a,o,l,u)},e.staggerFromTo=function(r,n,s,a,o,l,u,c){return a.startAt=s,se(a).immediateRender=it(a.immediateRender),this.staggerTo(r,n,a,o,l,u,c)},e.render=function(r,n,s){var a=this._time,o=this._dirty?this.totalDuration():this._tDur,l=this._dur,u=r<=0?0:B(r),c=this._zTime<0!=r<0&&(this._initted||!l),d,p,_,f,m,b,v,y,x,g,k,w;if(this!==L&&u>o&&r>=0&&(u=o),u!==this._tTime||s||c){if(a!==this._time&&l&&(u+=this._time-a,r+=this._time-a),d=u,x=this._start,y=this._ts,b=!y,c&&(l||(a=this._zTime),(r||!n)&&(this._zTime=r)),this._repeat){if(k=this._yoyo,m=l+this._rDelay,this._repeat<-1&&r<0)return this.totalTime(m*100+r,n,s);if(d=B(u%m),u===o?(f=this._repeat,d=l):(g=B(u/m),f=~~g,f&&f===g&&(d=l,f--),d>l&&(d=l)),g=Wt(this._tTime,m),!a&&this._tTime&&g!==f&&this._tTime-g*m-this._dur<=0&&(g=f),k&&f&1&&(d=l-d,w=1),f!==g&&!this._lock){var S=k&&g&1,T=S===(k&&f&1);if(f<g&&(S=!S),a=S?0:u%l?l:u,this._lock=1,this.render(a||(w?0:B(f*m)),n,!l)._lock=0,this._tTime=u,!n&&this.parent&&st(this,"onRepeat"),this.vars.repeatRefresh&&!w&&(this.invalidate()._lock=1,g=f),a&&a!==this._time||b!==!this._ts||this.vars.onRepeat&&!this.parent&&!this._act)return this;if(l=this._dur,o=this._tDur,T&&(this._lock=2,a=S?l:-1e-4,this.render(a,!0),this.vars.repeatRefresh&&!w&&this.invalidate()),this._lock=0,!this._ts&&!b)return this}}if(this._hasPause&&!this._forcing&&this._lock<2&&(v=en(this,B(a),B(d)),v&&(u-=d-(d=v._start))),this._tTime=u,this._time=d,this._act=!!y,this._initted||(this._onUpdate=this.vars.onUpdate,this._initted=1,this._zTime=r,a=0),!a&&u&&l&&!n&&!g&&(st(this,"onStart"),this._tTime!==u))return this;if(d>=a&&r>=0)for(p=this._first;p;){if(_=p._next,(p._act||d>=p._start)&&p._ts&&v!==p){if(p.parent!==this)return this.render(r,n,s);if(p.render(p._ts>0?(d-p._start)*p._ts:(p._dirty?p.totalDuration():p._tDur)+(d-p._start)*p._ts,n,s),d!==this._time||!this._ts&&!b){v=0,_&&(u+=this._zTime=-D);break}}p=_}else{p=this._last;for(var C=r<0?r:d;p;){if(_=p._prev,(p._act||C<=p._end)&&p._ts&&v!==p){if(p.parent!==this)return this.render(r,n,s);if(p.render(p._ts>0?(C-p._start)*p._ts:(p._dirty?p.totalDuration():p._tDur)+(C-p._start)*p._ts,n,s||W&&li(p)),d!==this._time||!this._ts&&!b){v=0,_&&(u+=this._zTime=C?-D:D);break}}p=_}}if(v&&!n&&(this.pause(),v.render(d>=a?0:-D)._zTime=d>=a?1:-1,this._ts))return this._start=x,Ee(this),this.render(r,n,s);this._onUpdate&&!n&&st(this,"onUpdate",!0),(u===o&&this._tTime>=this.totalDuration()||!u&&a)&&(x===this._start||Math.abs(y)!==Math.abs(this._ts))&&(this._lock||((r||!l)&&(u===o&&this._ts>0||!u&&this._ts<0)&&Pt(this,1),!n&&!(r<0&&!a)&&(u||a||!o)&&(st(this,u===o&&r>=0?"onComplete":"onReverseComplete",!0),this._prom&&!(u<o&&this.timeScale()>0)&&this._prom())))}return this},e.add=function(r,n){var s=this;if(yt(n)||(n=ut(this,n,r)),!(r instanceof ce)){if(Z(r))return r.forEach(function(a){return s.add(a,n)}),this;if(X(r))return this.addLabel(r,n);if(N(r))r=U.delayedCall(0,r);else return this}return this!==r?pt(this,r,n):this},e.getChildren=function(r,n,s,a){r===void 0&&(r=!0),n===void 0&&(n=!0),s===void 0&&(s=!0),a===void 0&&(a=-ft);for(var o=[],l=this._first;l;)l._start>=a&&(l instanceof U?n&&o.push(l):(s&&o.push(l),r&&o.push.apply(o,l.getChildren(!0,n,s)))),l=l._next;return o},e.getById=function(r){for(var n=this.getChildren(1,1,1),s=n.length;s--;)if(n[s].vars.id===r)return n[s]},e.remove=function(r){return X(r)?this.removeLabel(r):N(r)?this.killTweensOf(r):(r.parent===this&&Me(this,r),r===this._recent&&(this._recent=this._last),Ft(this))},e.totalTime=function(r,n){return arguments.length?(this._forcing=1,!this._dp&&this._ts&&(this._start=B(et.time-(this._ts>0?r/this._ts:(this.totalDuration()-r)/-this._ts))),h.prototype.totalTime.call(this,r,n),this._forcing=0,this):this._tTime},e.addLabel=function(r,n){return this.labels[r]=ut(this,n),this},e.removeLabel=function(r){return delete this.labels[r],this},e.addPause=function(r,n,s){var a=U.delayedCall(0,n||ue,s);return a.data="isPause",this._hasPause=1,pt(this,a,ut(this,r))},e.removePause=function(r){var n=this._first;for(r=ut(this,r);n;)n._start===r&&n.data==="isPause"&&Pt(n),n=n._next},e.killTweensOf=function(r,n,s){for(var a=this.getTweensOf(r,s),o=a.length;o--;)Tt!==a[o]&&a[o].kill(r,n);return this},e.getTweensOf=function(r,n){for(var s=[],a=ct(r),o=this._first,l=yt(n),u;o;)o instanceof U?Gr(o._targets,a)&&(l?(!Tt||o._initted&&o._ts)&&o.globalTime(0)<=n&&o.globalTime(o.totalDuration())>n:!n||o.isActive())&&s.push(o):(u=o.getTweensOf(a,n)).length&&s.push.apply(s,u),o=o._next;return s},e.tweenTo=function(r,n){n=n||{};var s=this,a=ut(s,r),o=n,l=o.startAt,u=o.onStart,c=o.onStartParams,d=o.immediateRender,p,_=U.to(s,ot({ease:n.ease||"none",lazy:!1,immediateRender:!1,time:a,overwrite:"auto",duration:n.duration||Math.abs((a-(l&&"time"in l?l.time:s._time))/s.timeScale())||D,onStart:function(){if(s.pause(),!p){var m=n.duration||Math.abs((a-(l&&"time"in l?l.time:s._time))/s.timeScale());_._dur!==m&&Gt(_,m,0,1).render(_._time,!0,!0),p=1}u&&u.apply(_,c||[])}},n));return d?_.render(0):_},e.tweenFromTo=function(r,n,s){return this.tweenTo(n,ot({startAt:{time:ut(this,r)}},s))},e.recent=function(){return this._recent},e.nextLabel=function(r){return r===void 0&&(r=this._time),zi(this,ut(this,r))},e.previousLabel=function(r){return r===void 0&&(r=this._time),zi(this,ut(this,r),1)},e.currentLabel=function(r){return arguments.length?this.seek(r,!0):this.previousLabel(this._time+D)},e.shiftChildren=function(r,n,s){s===void 0&&(s=0);var a=this._first,o=this.labels,l;for(r=B(r);a;)a._start>=s&&(a._start+=r,a._end+=r),a=a._next;if(n)for(l in o)o[l]>=s&&(o[l]+=r);return Ft(this)},e.invalidate=function(r){var n=this._first;for(this._lock=0;n;)n.invalidate(r),n=n._next;return h.prototype.invalidate.call(this,r)},e.clear=function(r){r===void 0&&(r=!0);for(var n=this._first,s;n;)s=n._next,this.remove(n),n=s;return this._dp&&(this._time=this._tTime=this._pTime=0),r&&(this.labels={}),Ft(this)},e.totalDuration=function(r){var n=0,s=this,a=s._last,o=ft,l,u,c;if(arguments.length)return s.timeScale((s._repeat<0?s.duration():s.totalDuration())/(s.reversed()?-r:r));if(s._dirty){for(c=s.parent;a;)l=a._prev,a._dirty&&a.totalDuration(),u=a._start,u>o&&s._sort&&a._ts&&!s._lock?(s._lock=1,pt(s,a,u-a._delay,1)._lock=0):o=u,u<0&&a._ts&&(n-=u,(!c&&!s._dp||c&&c.smoothChildTiming)&&(s._start+=B(u/s._ts),s._time-=u,s._tTime-=u),s.shiftChildren(-u,!1,-1/0),o=0),a._end>n&&a._ts&&(n=a._end),a=l;Gt(s,s===L&&s._time>n?s._time:n,1,1),s._dirty=0}return s._tDur},t.updateRoot=function(r){if(L._ts&&(Xi(L,Se(r,L)),Yi=et.frame),et.frame>=Ai){Ai+=rt.autoSleep||120;var n=L._first;if((!n||!n._ts)&&rt.autoSleep&&et._listeners.length<2){for(;n&&!n._ts;)n=n._next;n||et.sleep()}}},t}(ce);ot(Q.prototype,{_lock:0,_hasPause:0,_forcing:0});var bn=function(t,e,i,r,n,s,a){var o=new J(this._pt,t,e,0,1,_i,null,n),l=0,u=0,c,d,p,_,f,m,b,v;for(o.b=i,o.e=r,i+="",r+="",(b=~r.indexOf("random("))&&(r=Zt(r)),s&&(v=[i,r],s(v,t,e),i=v[0],r=v[1]),d=i.match(Be)||[];c=Be.exec(r);)_=c[0],f=r.substring(l,c.index),p?p=(p+1)%5:f.substr(-5)==="rgba("&&(p=1),_!==d[u++]&&(m=parseFloat(d[u-1])||0,o._pt={_next:o._pt,p:f||u===1?f:",",s:m,c:_.charAt(1)==="="?It(m,_)-m:parseFloat(_)-m,m:p&&p<4?Math.round:0},l=Be.lastIndex);return o.c=l<r.length?r.substring(l,r.length):"",o.fp=a,(ii.test(r)||b)&&(o.e=0),this._pt=o,o},fi=function(t,e,i,r,n,s,a,o,l,u){N(r)&&(r=r(n||0,t,s));var c=t[e],d=i!=="get"?i:N(c)?l?t[e.indexOf("set")||!N(t["get"+e.substr(3)])?e:"get"+e.substr(3)](l):t[e]():c,p=N(c)?l?Sn:cr:pi,_;if(X(r)&&(~r.indexOf("random(")&&(r=Zt(r)),r.charAt(1)==="="&&(_=It(d,r)+(G(d)||0),(_||_===0)&&(r=_))),!u||d!==r||je)return!isNaN(d*r)&&r!==""?(_=new J(this._pt,t,e,+d||0,r-(d||0),typeof c=="boolean"?Pn:dr,0,p),l&&(_.fp=l),a&&_.modifier(a,this,t),this._pt=_):(!c&&!(e in t)&&Ce(e,r),bn.call(this,t,e,d,r,p,o||rt.stringFilter,l))},yn=function(t,e,i,r,n){if(N(t)&&(t=oe(t,n,e,i,r)),!_t(t)||t.style&&t.nodeType||Z(t)||Ni(t))return X(t)?oe(t,n,e,i,r):t;var s={},a;for(a in t)s[a]=oe(t[a],n,e,i,r);return s},ci=function(t,e,i,r,n,s){var a,o,l,u;if(tt[t]&&(a=new tt[t]).init(n,a.rawVars?e[t]:yn(e[t],r,n,s,i),i,r,s)!==!1&&(i._pt=o=new J(i._pt,n,t,0,1,a.render,a,0,a.priority),i!==Xt))for(l=i._ptLookup[i._targets.indexOf(n)],u=a._props.length;u--;)l[a._props[u]]=o;return a},Tt,je,di=function h(t,e,i){var r=t.vars,n=r.ease,s=r.startAt,a=r.immediateRender,o=r.lazy,l=r.onUpdate,u=r.runBackwards,c=r.yoyoEase,d=r.keyframes,p=r.autoRevert,_=t._dur,f=t._startAt,m=t._targets,b=t.parent,v=b&&b.data==="nested"?b.vars.targets:m,y=t._overwrite==="auto"&&!Je,x=t.timeline,g=r.easeReverse||c,k,w,S,T,C,E,O,F,$,H,Y,V,ht;if(x&&(!d||!n)&&(n="none"),t._ease=zt(n,le.ease),t._rEase=g&&(zt(g)||t._ease),t._from=!x&&!!r.runBackwards,t._from&&(t.ratio=1),!x||d&&!r.stagger){if(F=m[0]?kt(m[0]).harness:0,V=F&&r[F.prop],k=Te(r,ni),f&&(f._zTime<0&&f.progress(1),e<0&&u&&a&&!p?f.render(-1,!0):f.revert(u&&_?ve:Hr),f._lazy=0),s){if(Pt(t._startAt=U.set(m,ot({data:"isStart",overwrite:!1,parent:b,immediateRender:!0,lazy:!f&&it(o),startAt:null,delay:0,onUpdate:l&&function(){return st(t,"onUpdate")},stagger:0},s))),t._startAt._dp=0,t._startAt._sat=t,e<0&&(W||!a&&!p)&&t._startAt.revert(ve),a&&_&&e<=0&&i<=0){e&&(t._zTime=e);return}}else if(u&&_&&!f){if(e&&(a=!1),S=ot({overwrite:!1,data:"isFromStart",lazy:a&&!f&&it(o),immediateRender:a,stagger:0,parent:b},k),V&&(S[F.prop]=V),Pt(t._startAt=U.set(m,S)),t._startAt._dp=0,t._startAt._sat=t,e<0&&(W?t._startAt.revert(ve):t._startAt.render(-1,!0)),t._zTime=e,!a)h(t._startAt,D,D);else if(!e)return}for(t._pt=t._ptCache=0,o=_&&it(o)||o&&!_,w=0;w<m.length;w++){if(C=m[w],O=C._gsap||ai(m)[w]._gsap,t._ptLookup[w]=H={},Xe[O.id]&&St.length&&we(),Y=v===m?w:v.indexOf(C),F&&($=new F).init(C,V||k,t,Y,v)!==!1&&(t._pt=T=new J(t._pt,C,$.name,0,1,$.render,$,0,$.priority),$._props.forEach(function(Yt){H[Yt]=T}),$.priority&&(E=1)),!F||V)for(S in k)tt[S]&&($=ci(S,k,t,Y,C,v))?$.priority&&(E=1):H[S]=T=fi.call(t,C,S,"get",k[S],Y,v,0,r.stringFilter);t._op&&t._op[w]&&t.kill(C,t._op[w]),y&&t._pt&&(Tt=t,L.killTweensOf(C,H,t.globalTime(e)),ht=!t.parent,Tt=0),t._pt&&o&&(Xe[O.id]=1)}E&&gi(t),t._onInit&&t._onInit(t)}t._onUpdate=l,t._initted=(!t._op||t._pt)&&!ht,d&&e<=0&&x.render(ft,!0,!0)},xn=function(t,e,i,r,n,s,a,o){var l=(t._pt&&t._ptCache||(t._ptCache={}))[e],u,c,d,p;if(!l)for(l=t._ptCache[e]=[],d=t._ptLookup,p=t._targets.length;p--;){if(u=d[p][e],u&&u.d&&u.d._pt)for(u=u.d._pt;u&&u.p!==e&&u.fp!==e;)u=u._next;if(!u)return je=1,t.vars[e]="+=0",di(t,a),je=0,o?he(e+" not eligible for reset. Try splitting into individual properties"):1;l.push(u)}for(p=l.length;p--;)c=l[p],u=c._pt||c,u.s=(r||r===0)&&!n?r:u.s+(r||0)+s*u.c,u.c=i-u.s,c.e&&(c.e=q(i)+G(c.e)),c.b&&(c.b=u.s+G(c.b))},wn=function(t,e){var i=t[0]?kt(t[0]).harness:0,r=i&&i.aliases,n,s,a,o;if(!r)return e;n=Ht({},e);for(s in r)if(s in n)for(o=r[s].split(","),a=o.length;a--;)n[o[a]]=n[s];return n},Tn=function(t,e,i,r){var n=e.ease||r||"power1.inOut",s,a;if(Z(e))a=i[t]||(i[t]=[]),e.forEach(function(o,l){return a.push({t:l/(e.length-1)*100,v:o,e:n})});else for(s in e)a=i[s]||(i[s]=[]),s==="ease"||a.push({t:parseFloat(t),v:e[s],e:n})},oe=function(t,e,i,r,n){return N(t)?t.call(e,i,r,n):X(t)&&~t.indexOf("random(")?Zt(t):t},ur=si+"repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert",fr={};K(ur+",id,stagger,delay,duration,paused,scrollTrigger",function(h){return fr[h]=1});var U=function(h){Ii(t,h);function t(i,r,n,s){var a;typeof r=="number"&&(n.duration=r,r=n,n=null),a=h.call(this,s?r:se(r))||this;var o=a.vars,l=o.duration,u=o.delay,c=o.immediateRender,d=o.stagger,p=o.overwrite,_=o.keyframes,f=o.defaults,m=o.scrollTrigger,b=r.parent||L,v=(Z(i)||Ni(i)?yt(i[0]):"length"in r)?[i]:ct(i),y,x,g,k,w,S,T,C;if(a._targets=v.length?ai(v):he("GSAP target "+i+" not found. https://gsap.com",!rt.nullTargetWarn)||[],a._ptLookup=[],a._overwrite=p,_||d||ge(l)||ge(u)){r=a.vars;var E=r.easeReverse||r.yoyoEase;if(y=a.timeline=new Q({data:"nested",defaults:f||{},targets:b&&b.data==="nested"?b.vars.targets:v}),y.kill(),y.parent=y._dp=vt(a),y._start=0,d||ge(l)||ge(u)){if(k=v.length,T=d&&tr(d),_t(d))for(w in d)~ur.indexOf(w)&&(C||(C={}),C[w]=d[w]);for(x=0;x<k;x++)g=Te(r,fr),g.stagger=0,E&&(g.easeReverse=E),C&&Ht(g,C),S=v[x],g.duration=+oe(l,vt(a),x,S,v),g.delay=(+oe(u,vt(a),x,S,v)||0)-a._delay,!d&&k===1&&g.delay&&(a._delay=u=g.delay,a._start+=u,g.delay=0),y.to(S,g,T?T(x,S,v):0),y._ease=M.none;y.duration()?l=u=0:a.timeline=0}else if(_){se(ot(y.vars.defaults,{ease:"none"})),y._ease=zt(_.ease||r.ease||"none");var O=0,F,$,H;if(Z(_))_.forEach(function(Y){return y.to(v,Y,">")}),y.duration();else{g={};for(w in _)w==="ease"||w==="easeEach"||Tn(w,_[w],g,_.easeEach);for(w in g)for(F=g[w].sort(function(Y,V){return Y.t-V.t}),O=0,x=0;x<F.length;x++)$=F[x],H={ease:$.e,duration:($.t-(x?F[x-1].t:0))/100*l},H[w]=$.v,y.to(v,H,O),O+=H.duration;y.duration()<l&&y.to({},{duration:l-y.duration()})}}l||a.duration(l=y.duration())}else a.timeline=0;return p===!0&&!Je&&(Tt=vt(a),L.killTweensOf(v),Tt=0),pt(b,vt(a),n),r.reversed&&a.reverse(),r.paused&&a.paused(!0),(c||!l&&!_&&a._start===B(b._time)&&it(c)&&Kr(vt(a))&&b.data!=="nested")&&(a._tTime=-D,a.render(Math.max(0,-u)||0)),m&&Zi(vt(a),m),a}var e=t.prototype;return e.render=function(r,n,s){var a=this._time,o=this._tDur,l=this._dur,u=r<0,c=r>o-D&&!u?o:r<D?0:r,d,p,_,f,m,b,v,y;if(!l)tn(this,r,n,s);else if(c!==this._tTime||!r||s||!this._initted&&this._tTime||this._startAt&&this._zTime<0!==u||this._lazy){if(d=c,y=this.timeline,this._repeat){if(f=l+this._rDelay,this._repeat<-1&&u)return this.totalTime(f*100+r,n,s);if(d=B(c%f),c===o?(_=this._repeat,d=l):(m=B(c/f),_=~~m,_&&_===m?(d=l,_--):d>l&&(d=l)),b=this._yoyo&&_&1,b&&(d=l-d),m=Wt(this._tTime,f),d===a&&!s&&this._initted&&_===m)return this._tTime=c,this;_!==m&&this.vars.repeatRefresh&&!b&&!this._lock&&d!==f&&this._initted&&(this._lock=s=1,this.render(B(f*_),!0).invalidate()._lock=0)}if(!this._initted){if(ji(this,u?r:d,s,n,c))return this._tTime=0,this;if(a!==this._time&&!(s&&this.vars.repeatRefresh&&_!==m))return this;if(l!==this._dur)return this.render(r,n,s)}if(this._rEase){var x=d<a;if(x!==this._inv){var g=x?a:l-a;this._inv=x,this._from&&(this.ratio=1-this.ratio),this._invRatio=this.ratio,this._invTime=a,this._invRecip=g?(x?-1:1)/g:0,this._invScale=x?-this.ratio:1-this.ratio,this._invEase=x?this._rEase:this._ease}this.ratio=v=this._invRatio+this._invScale*this._invEase((d-this._invTime)*this._invRecip)}else this.ratio=v=this._ease(d/l);if(this._from&&(this.ratio=v=1-v),this._tTime=c,this._time=d,!this._act&&this._ts&&(this._act=1,this._lazy=0),!a&&c&&!n&&!m&&(st(this,"onStart"),this._tTime!==c))return this;for(p=this._pt;p;)p.r(v,p.d),p=p._next;y&&y.render(r<0?r:y._dur*y._ease(d/this._dur),n,s)||this._startAt&&(this._zTime=r),this._onUpdate&&!n&&(u&&He(this,r,n,s),st(this,"onUpdate")),this._repeat&&_!==m&&this.vars.onRepeat&&!n&&this.parent&&st(this,"onRepeat"),(c===this._tDur||!c)&&this._tTime===c&&(u&&!this._onUpdate&&He(this,r,!0,!0),(r||!l)&&(c===this._tDur&&this._ts>0||!c&&this._ts<0)&&Pt(this,1),!n&&!(u&&!a)&&(c||a||b)&&(st(this,c===o?"onComplete":"onReverseComplete",!0),this._prom&&!(c<o&&this.timeScale()>0)&&this._prom()))}return this},e.targets=function(){return this._targets},e.invalidate=function(r){return(!r||!this.vars.runBackwards)&&(this._startAt=0),this._pt=this._op=this._onUpdate=this._lazy=this.ratio=0,this._ptLookup=[],this.timeline&&this.timeline.invalidate(r),h.prototype.invalidate.call(this,r)},e.resetTo=function(r,n,s,a,o){fe||et.wake(),this._ts||this.play();var l=Math.min(this._dur,(this._dp._time-this._start)*this._ts),u;return this._initted||di(this,l),u=this._ease(l/this._dur),xn(this,r,n,s,a,u,l,o)?this.resetTo(r,n,s,a,1):(Oe(this,0),this.parent||Gi(this._dp,this,"_first","_last",this._dp._sort?"_start":0),this.render(0))},e.kill=function(r,n){if(n===void 0&&(n="all"),!r&&(!n||n==="all"))return this._lazy=this._pt=0,this.parent?re(this):this.scrollTrigger&&this.scrollTrigger.kill(!!W),this;if(this.timeline){var s=this.timeline.totalDuration();return this.timeline.killTweensOf(r,n,Tt&&Tt.vars.overwrite!==!0)._first||re(this),this.parent&&s!==this.timeline.totalDuration()&&Gt(this,this._dur*this.timeline._tDur/s,0,1),this}var a=this._targets,o=r?ct(r):a,l=this._ptLookup,u=this._pt,c,d,p,_,f,m,b;if((!n||n==="all")&&Zr(a,o))return n==="all"&&(this._pt=0),re(this);for(c=this._op=this._op||[],n!=="all"&&(X(n)&&(f={},K(n,function(v){return f[v]=1}),n=f),n=wn(a,n)),b=a.length;b--;)if(~o.indexOf(a[b])){d=l[b],n==="all"?(c[b]=n,_=d,p={}):(p=c[b]=c[b]||{},_=n);for(f in _)m=d&&d[f],m&&((!("kill"in m.d)||m.d.kill(f)===!0)&&Me(this,m,"_pt"),delete d[f]),p!=="all"&&(p[f]=1)}return this._initted&&!this._pt&&u&&re(this),this},t.to=function(r,n){return new t(r,n,arguments[2])},t.from=function(r,n){return ae(1,arguments)},t.delayedCall=function(r,n,s,a){return new t(n,0,{immediateRender:!1,lazy:!1,overwrite:!1,delay:r,onComplete:n,onReverseComplete:n,onCompleteParams:s,onReverseCompleteParams:s,callbackScope:a})},t.fromTo=function(r,n,s){return ae(2,arguments)},t.set=function(r,n){return n.duration=0,n.repeatDelay||(n.repeat=0),new t(r,n)},t.killTweensOf=function(r,n,s){return L.killTweensOf(r,n,s)},t}(ce);ot(U.prototype,{_targets:[],_lazy:0,_startAt:0,_op:0,_onInit:0});K("staggerTo,staggerFrom,staggerFromTo",function(h){U[h]=function(){var t=new Q,e=Ge.call(arguments,0);return e.splice(h==="staggerFromTo"?5:4,0,0),t[h].apply(t,e)}});var pi=function(t,e,i){return t[e]=i},cr=function(t,e,i){return t[e](i)},Sn=function(t,e,i,r){return t[e](r.fp,i)},kn=function(t,e,i){return t.setAttribute(e,i)},Ae=function(t,e){return N(t[e])?cr:Pe(t[e])&&t.setAttribute?kn:pi},dr=function(t,e){return e.set(e.t,e.p,Math.round((e.s+e.c*t)*1e6)/1e6,e)},Pn=function(t,e){return e.set(e.t,e.p,!!(e.s+e.c*t),e)},_i=function(t,e){var i=e._pt,r="";if(!t&&e.b)r=e.b;else if(t===1&&e.e)r=e.e;else{for(;i;)r=i.p+(i.m?i.m(i.s+i.c*t):Math.round((i.s+i.c*t)*1e4)/1e4)+r,i=i._next;r+=e.c}e.set(e.t,e.p,r,e)},mi=function(t,e){for(var i=e._pt;i;)i.r(t,i.d),i=i._next},Cn=function(t,e,i,r){for(var n=this._pt,s;n;)s=n._next,n.p===r&&n.modifier(t,e,i),n=s},Mn=function(t){for(var e=this._pt,i,r;e;)r=e._next,e.p===t&&!e.op||e.op===t?Me(this,e,"_pt"):e.dep||(i=1),e=r;return!i},En=function(t,e,i,r){r.mSet(t,e,r.m.call(r.tween,i,r.mt),r)},gi=function(t){for(var e=t._pt,i,r,n,s;e;){for(i=e._next,r=n;r&&r.pr>e.pr;)r=r._next;(e._prev=r?r._prev:s)?e._prev._next=e:n=e,(e._next=r)?r._prev=e:s=e,e=i}t._pt=n},J=function(){function h(e,i,r,n,s,a,o,l,u){this.t=i,this.s=n,this.c=s,this.p=r,this.r=a||dr,this.d=o||this,this.set=l||pi,this.pr=u||0,this._next=e,e&&(e._prev=this)}var t=h.prototype;return t.modifier=function(i,r,n){this.mSet=this.mSet||this.set,this.set=En,this.m=i,this.mt=n,this.tween=r},h}();K(si+"parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse",function(h){return ni[h]=1});at.TweenMax=at.TweenLite=U;at.TimelineLite=at.TimelineMax=Q;L=new Q({sortChildren:!1,defaults:le,autoRemoveChildren:!0,id:"root",smoothChildTiming:!0});rt.stringFilter=hi;var Bt=[],ye={},On=[],Li=0,An=0,qe=function(t){return(ye[t]||On).map(function(e){return e()})},Ke=function(){var t=Date.now(),e=[];t-Li>2&&(qe("matchMediaInit"),Bt.forEach(function(i){var r=i.queries,n=i.conditions,s,a,o,l;for(a in r)s=dt.matchMedia(r[a]).matches,s&&(o=1),s!==n[a]&&(n[a]=s,l=1);l&&(i.revert(),o&&e.push(i))}),qe("matchMediaRevert"),e.forEach(function(i){return i.onMatch(i,function(r){return i.add(null,r)})}),Li=t,qe("matchMedia"))},pr=function(){function h(e,i){this.selector=i&&Qe(i),this.data=[],this._r=[],this.isReverted=!1,this.id=An++,e&&this.add(e)}var t=h.prototype;return t.add=function(i,r,n){N(i)&&(n=r,r=i,i=N);var s=this,a=function(){var l=z,u=s.selector,c;return l&&l!==s&&l.data.push(s),n&&(s.selector=Qe(n)),z=s,c=r.apply(s,arguments),N(c)&&s._r.push(c),z=l,s.selector=u,s.isReverted=!1,c};return s.last=a,i===N?a(s,function(o){return s.add(null,o)}):i?s[i]=a:a},t.ignore=function(i){var r=z;z=null,i(this),z=r},t.getTweens=function(){var i=[];return this.data.forEach(function(r){return r instanceof h?i.push.apply(i,r.getTweens()):r instanceof U&&!(r.parent&&r.parent.data==="nested")&&i.push(r)}),i},t.clear=function(){this._r.length=this.data.length=0},t.kill=function(i,r){var n=this;if(i?function(){for(var a=n.getTweens(),o=n.data.length,l;o--;)l=n.data[o],l.data==="isFlip"&&(l.revert(),l.getChildren(!0,!0,!1).forEach(function(u){return a.splice(a.indexOf(u),1)}));for(a.map(function(u){return{g:u._dur||u._delay||u._sat&&!u._sat.vars.immediateRender?u.globalTime(0):-1/0,t:u}}).sort(function(u,c){return c.g-u.g||-1/0}).forEach(function(u){return u.t.revert(i)}),o=n.data.length;o--;)l=n.data[o],l instanceof Q?l.data!=="nested"&&(l.scrollTrigger&&l.scrollTrigger.revert(),l.kill()):!(l instanceof U)&&l.revert&&l.revert(i);n._r.forEach(function(u){return u(i,n)}),n.isReverted=!0}():this.data.forEach(function(a){return a.kill&&a.kill()}),this.clear(),r)for(var s=Bt.length;s--;)Bt[s].id===this.id&&Bt.splice(s,1)},t.revert=function(i){this.kill(i||{})},h}(),Rn=function(){function h(e){this.contexts=[],this.scope=e,z&&z.data.push(this)}var t=h.prototype;return t.add=function(i,r,n){_t(i)||(i={matches:i});var s=new pr(0,n||this.scope),a=s.conditions={},o,l,u;z&&!s.selector&&(s.selector=z.selector),this.contexts.push(s),r=s.add("onMatch",r),s.queries=i;for(l in i)l==="all"?u=1:(o=dt.matchMedia(i[l]),o&&(Bt.indexOf(s)<0&&Bt.push(s),(a[l]=o.matches)&&(u=1),o.addListener?o.addListener(Ke):o.addEventListener("change",Ke)));return u&&r(s,function(c){return s.add(null,c)}),this},t.revert=function(i){this.kill(i||{})},t.kill=function(i){this.contexts.forEach(function(r){return r.kill(i,!0)})},h}(),ke={registerPlugin:function(){for(var t=arguments.length,e=new Array(t),i=0;i<t;i++)e[i]=arguments[i];e.forEach(function(r){return ar(r)})},timeline:function(t){return new Q(t)},getTweensOf:function(t,e){return L.getTweensOf(t,e)},getProperty:function(t,e,i,r){X(t)&&(t=ct(t)[0]);var n=kt(t||{}).get,s=i?Wi:Hi;return i==="native"&&(i=""),t&&(e?s((tt[e]&&tt[e].get||n)(t,e,i,r)):function(a,o,l){return s((tt[a]&&tt[a].get||n)(t,a,o,l))})},quickSetter:function(t,e,i){if(t=ct(t),t.length>1){var r=t.map(function(u){return j.quickSetter(u,e,i)}),n=r.length;return function(u){for(var c=n;c--;)r[c](u)}}t=t[0]||{};var s=tt[e],a=kt(t),o=a.harness&&(a.harness.aliases||{})[e]||e,l=s?function(u){var c=new s;Xt._pt=0,c.init(t,i?u+i:u,Xt,0,[t]),c.render(1,c),Xt._pt&&mi(1,Xt)}:a.set(t,o);return s?l:function(u){return l(t,o,i?u+i:u,a,1)}},quickTo:function(t,e,i){var r,n=j.to(t,ot((r={},r[e]="+=0.1",r.paused=!0,r.stagger=0,r),i||{})),s=function(o,l,u){return n.resetTo(e,o,l,u)};return s.tween=n,s},isTweening:function(t){return L.getTweensOf(t,!0).length>0},defaults:function(t){return t&&t.ease&&(t.ease=zt(t.ease,le.ease)),Ri(le,t||{})},config:function(t){return Ri(rt,t||{})},registerEffect:function(t){var e=t.name,i=t.effect,r=t.plugins,n=t.defaults,s=t.extendTimeline;(r||"").split(",").forEach(function(a){return a&&!tt[a]&&!at[a]&&he(e+" effect requires "+a+" plugin.")}),Le[e]=function(a,o,l){return i(ct(a),ot(o||{},n),l)},s&&(Q.prototype[e]=function(a,o,l){return this.add(Le[e](a,_t(o)?o:(l=o)&&{},this),l)})},registerEase:function(t,e){M[t]=zt(e)},parseEase:function(t,e){return arguments.length?zt(t,e):M},getById:function(t){return L.getById(t)},exportRoot:function(t,e){t===void 0&&(t={});var i=new Q(t),r,n;for(i.smoothChildTiming=it(t.smoothChildTiming),L.remove(i),i._dp=0,i._time=i._tTime=L._time,r=L._first;r;)n=r._next,(e||!(!r._dur&&r instanceof U&&r.vars.onComplete===r._targets[0]))&&pt(i,r,r._start-r._delay),r=n;return pt(L,i,0),i},context:function(t,e){return t?new pr(t,e):z},matchMedia:function(t){return new Rn(t)},matchMediaRefresh:function(){return Bt.forEach(function(t){var e=t.conditions,i,r;for(r in e)e[r]&&(e[r]=!1,i=1);i&&t.revert()})||Ke()},addEventListener:function(t,e){var i=ye[t]||(ye[t]=[]);~i.indexOf(e)||i.push(e)},removeEventListener:function(t,e){var i=ye[t],r=i&&i.indexOf(e);r>=0&&i.splice(r,1)},utils:{wrap:hn,wrapYoyo:un,distribute:tr,random:ir,snap:er,normalize:ln,getUnit:G,clamp:nn,splitColor:or,toArray:ct,selector:Qe,mapRange:nr,pipe:an,unitize:on,interpolate:fn,shuffle:Ji},install:Vi,effects:Le,ticker:et,updateRoot:Q.updateRoot,plugins:tt,globalTimeline:L,core:{PropTween:J,globals:Ui,Tween:U,Timeline:Q,Animation:ce,getCache:kt,_removeLinkedListItem:Me,reverting:function(){return W},context:function(t){return t&&z&&(z.data.push(t),t._ctx=z),z},suppressOverwrites:function(t){return Je=t}}};K("to,from,fromTo,delayedCall,set,killTweensOf",function(h){return ke[h]=U[h]});et.add(Q.updateRoot);Xt=ke.to({},{duration:0});var Dn=function(t,e){for(var i=t._pt;i&&i.p!==e&&i.op!==e&&i.fp!==e;)i=i._next;return i},Fn=function(t,e){var i=t._targets,r,n,s;for(r in e)for(n=i.length;n--;)s=t._ptLookup[n][r],s&&(s=s.d)&&(s._pt&&(s=Dn(s,r)),s&&s.modifier&&s.modifier(e[r],t,i[n],r))},Ve=function(t,e){return{name:t,headless:1,rawVars:1,init:function(r,n,s){s._onInit=function(a){var o,l;if(X(n)&&(o={},K(n,function(u){return o[u]=1}),n=o),e){o={};for(l in n)o[l]=e(n[l]);n=o}Fn(a,n)}}}},j=ke.registerPlugin({name:"attr",init:function(t,e,i,r,n){var s,a,o;this.tween=i;for(s in e)o=t.getAttribute(s)||"",a=this.add(t,"setAttribute",(o||0)+"",e[s],r,n,0,0,s),a.op=s,a.b=o,this._props.push(s)},render:function(t,e){for(var i=e._pt;i;)W?i.set(i.t,i.p,i.b,i):i.r(t,i.d),i=i._next}},{name:"endArray",headless:1,init:function(t,e){for(var i=e.length;i--;)this.add(t,i,t[i]||0,e[i],0,0,0,0,0,1)}},Ve("roundProps",Ze),Ve("modifiers"),Ve("snap",er))||ke;U.version=Q.version=j.version="3.15.0";qi=1;ti()&&Qt();var zn=M.Power0,Bn=M.Power1,Ln=M.Power2,In=M.Power3,$n=M.Power4,Nn=M.Linear,qn=M.Quad,Vn=M.Cubic,Un=M.Quart,Yn=M.Quint,Xn=M.Strong,Hn=M.Elastic,Wn=M.Back,Gn=M.SteppedEase,Qn=M.Bounce,Zn=M.Sine,jn=M.Expo,Kn=M.Circ;var _r,Mt,Kt,Ti,Ut,Jn,mr,Si,ts=function(){return typeof window<"u"},wt={},Vt=180/Math.PI,Jt=Math.PI/180,jt=Math.atan2,gr=1e8,ki=/([A-Z])/g,es=/(left|right|width|margin|padding|x)/i,is=/[\s,\(]\S/,mt={autoAlpha:"opacity,visibility",scale:"scaleX,scaleY",alpha:"opacity"},bi=function(t,e){return e.set(e.t,e.p,Math.round((e.s+e.c*t)*1e4)/1e4+e.u,e)},rs=function(t,e){return e.set(e.t,e.p,t===1?e.e:Math.round((e.s+e.c*t)*1e4)/1e4+e.u,e)},ns=function(t,e){return e.set(e.t,e.p,t?Math.round((e.s+e.c*t)*1e4)/1e4+e.u:e.b,e)},ss=function(t,e){return e.set(e.t,e.p,t===1?e.e:t?Math.round((e.s+e.c*t)*1e4)/1e4+e.u:e.b,e)},as=function(t,e){var i=e.s+e.c*t;e.set(e.t,e.p,~~(i+(i<0?-.5:.5))+e.u,e)},kr=function(t,e){return e.set(e.t,e.p,t?e.e:e.b,e)},Pr=function(t,e){return e.set(e.t,e.p,t!==1?e.b:e.e,e)},os=function(t,e,i){return t.style[e]=i},ls=function(t,e,i){return t.style.setProperty(e,i)},hs=function(t,e,i){return t._gsap[e]=i},us=function(t,e,i){return t._gsap.scaleX=t._gsap.scaleY=i},fs=function(t,e,i,r,n){var s=t._gsap;s.scaleX=s.scaleY=i,s.renderTransform(n,s)},cs=function(t,e,i,r,n){var s=t._gsap;s[e]=i,s.renderTransform(n,s)},I="transform",nt=I+"Origin",ds=function h(t,e){var i=this,r=this.target,n=r.style,s=r._gsap;if(t in wt&&n){if(this.tfm=this.tfm||{},t!=="transform")t=mt[t]||t,~t.indexOf(",")?t.split(",").forEach(function(a){return i.tfm[a]=xt(r,a)}):this.tfm[t]=s.x?s[t]:xt(r,t),t===nt&&(this.tfm.zOrigin=s.zOrigin);else return mt.transform.split(",").forEach(function(a){return h.call(i,a,e)});if(this.props.indexOf(I)>=0)return;s.svg&&(this.svgo=r.getAttribute("data-svg-origin"),this.props.push(nt,e,"")),t=I}(n||e)&&this.props.push(t,e,n[t])},Cr=function(t){t.translate&&(t.removeProperty("translate"),t.removeProperty("scale"),t.removeProperty("rotate"))},ps=function(){var t=this.props,e=this.target,i=e.style,r=e._gsap,n,s;for(n=0;n<t.length;n+=3)t[n+1]?t[n+1]===2?e[t[n]](t[n+2]):e[t[n]]=t[n+2]:t[n+2]?i[t[n]]=t[n+2]:i.removeProperty(t[n].substr(0,2)==="--"?t[n]:t[n].replace(ki,"-$1").toLowerCase());if(this.tfm){for(s in this.tfm)r[s]=this.tfm[s];r.svg&&(r.renderTransform(),e.setAttribute("data-svg-origin",this.svgo||"")),n=Si(),(!n||!n.isStart)&&!i[I]&&(Cr(i),r.zOrigin&&i[nt]&&(i[nt]+=" "+r.zOrigin+"px",r.zOrigin=0,r.renderTransform()),r.uncache=1)}},Mr=function(t,e){var i={target:t,props:[],revert:ps,save:ds};return t._gsap||j.core.getCache(t),e&&t.style&&t.nodeType&&e.split(",").forEach(function(r){return i.save(r)}),i},Er,yi=function(t,e){var i=Mt.createElementNS?Mt.createElementNS((e||"http://www.w3.org/1999/xhtml").replace(/^https/,"http"),t):Mt.createElement(t);return i&&i.style?i:Mt.createElement(t)},lt=function h(t,e,i){var r=getComputedStyle(t);return r[e]||r.getPropertyValue(e.replace(ki,"-$1").toLowerCase())||r.getPropertyValue(e)||!i&&h(t,te(e)||e,1)||""},vr="O,Moz,ms,Ms,Webkit".split(","),te=function(t,e,i){var r=e||Ut,n=r.style,s=5;if(t in n&&!i)return t;for(t=t.charAt(0).toUpperCase()+t.substr(1);s--&&!(vr[s]+t in n););return s<0?null:(s===3?"ms":s>=0?vr[s]:"")+t},xi=function(){ts()&&window.document&&(_r=window,Mt=_r.document,Kt=Mt.documentElement,Ut=yi("div")||{style:{}},Jn=yi("div"),I=te(I),nt=I+"Origin",Ut.style.cssText="border-width:0;line-height:0;position:absolute;padding:0",Er=!!te("perspective"),Si=j.core.reverting,Ti=1)},br=function(t){var e=t.ownerSVGElement,i=yi("svg",e&&e.getAttribute("xmlns")||"http://www.w3.org/2000/svg"),r=t.cloneNode(!0),n;r.style.display="block",i.appendChild(r),Kt.appendChild(i);try{n=r.getBBox()}catch{}return i.removeChild(r),Kt.removeChild(i),n},yr=function(t,e){for(var i=e.length;i--;)if(t.hasAttribute(e[i]))return t.getAttribute(e[i])},Or=function(t){var e,i;try{e=t.getBBox()}catch{e=br(t),i=1}return e&&(e.width||e.height)||i||(e=br(t)),e&&!e.width&&!e.x&&!e.y?{x:+yr(t,["x","cx","x1"])||0,y:+yr(t,["y","cy","y1"])||0,width:0,height:0}:e},Ar=function(t){return!!(t.getCTM&&(!t.parentNode||t.ownerSVGElement)&&Or(t))},Ot=function(t,e){if(e){var i=t.style,r;e in wt&&e!==nt&&(e=I),i.removeProperty?(r=e.substr(0,2),(r==="ms"||e.substr(0,6)==="webkit")&&(e="-"+e),i.removeProperty(r==="--"?e:e.replace(ki,"-$1").toLowerCase())):i.removeAttribute(e)}},Et=function(t,e,i,r,n,s){var a=new J(t._pt,e,i,0,1,s?Pr:kr);return t._pt=a,a.b=r,a.e=n,t._props.push(i),a},xr={deg:1,rad:1,turn:1},_s={grid:1,flex:1},At=function h(t,e,i,r){var n=parseFloat(i)||0,s=(i+"").trim().substr((n+"").length)||"px",a=Ut.style,o=es.test(e),l=t.tagName.toLowerCase()==="svg",u=(l?"client":"offset")+(o?"Width":"Height"),c=100,d=r==="px",p=r==="%",_,f,m,b;if(r===s||!n||xr[r]||xr[s])return n;if(s!=="px"&&!d&&(n=h(t,e,i,"px")),b=t.getCTM&&Ar(t),(p||s==="%")&&(wt[e]||~e.indexOf("adius")))return _=b?t.getBBox()[o?"width":"height"]:t[u],q(p?n/_*c:n/100*_);if(a[o?"width":"height"]=c+(d?s:r),f=r!=="rem"&&~e.indexOf("adius")||r==="em"&&t.appendChild&&!l?t:t.parentNode,b&&(f=(t.ownerSVGElement||{}).parentNode),(!f||f===Mt||!f.appendChild)&&(f=Mt.body),m=f._gsap,m&&p&&m.width&&o&&m.time===et.time&&!m.uncache)return q(n/m.width*c);if(p&&(e==="height"||e==="width")){var v=t.style[e];t.style[e]=c+r,_=t[u],v?t.style[e]=v:Ot(t,e)}else(p||s==="%")&&!_s[lt(f,"display")]&&(a.position=lt(t,"position")),f===t&&(a.position="static"),f.appendChild(Ut),_=Ut[u],f.removeChild(Ut),a.position="absolute";return o&&p&&(m=kt(f),m.time=et.time,m.width=f[u]),q(d?_*n/c:_&&n?c/_*n:0)},xt=function(t,e,i,r){var n;return Ti||xi(),e in mt&&e!=="transform"&&(e=mt[e],~e.indexOf(",")&&(e=e.split(",")[0])),wt[e]&&e!=="transform"?(n=me(t,r),n=e!=="transformOrigin"?n[e]:n.svg?n.origin:De(lt(t,nt))+" "+n.zOrigin+"px"):(n=t.style[e],(!n||n==="auto"||r||~(n+"").indexOf("calc("))&&(n=Re[e]&&Re[e](t,e,i)||lt(t,e)||oi(t,e)||(e==="opacity"?1:0))),i&&!~(n+"").trim().indexOf(" ")?At(t,e,n,i)+i:n},ms=function(t,e,i,r){if(!i||i==="none"){var n=te(e,t,1),s=n&&lt(t,n,1);s&&s!==i?(e=n,i=s):e==="borderColor"&&(i=lt(t,"borderTopColor"))}var a=new J(this._pt,t.style,e,0,1,_i),o=0,l=0,u,c,d,p,_,f,m,b,v,y,x,g;if(a.b=i,a.e=r,i+="",r+="",r.substring(0,6)==="var(--"&&(r=lt(t,r.substring(4,r.indexOf(")")))),r==="auto"&&(f=t.style[e],t.style[e]=r,r=lt(t,e)||r,f?t.style[e]=f:Ot(t,e)),u=[i,r],hi(u),i=u[0],r=u[1],d=i.match(Lt)||[],g=r.match(Lt)||[],g.length){for(;c=Lt.exec(r);)m=c[0],v=r.substring(o,c.index),_?_=(_+1)%5:(v.substr(-5)==="rgba("||v.substr(-5)==="hsla(")&&(_=1),m!==(f=d[l++]||"")&&(p=parseFloat(f)||0,x=f.substr((p+"").length),m.charAt(1)==="="&&(m=It(p,m)+x),b=parseFloat(m),y=m.substr((b+"").length),o=Lt.lastIndex-y.length,y||(y=y||rt.units[e]||x,o===r.length&&(r+=y,a.e+=y)),x!==y&&(p=At(t,e,f,y)||0),a._pt={_next:a._pt,p:v||l===1?v:",",s:p,c:b-p,m:_&&_<4||e==="zIndex"?Math.round:0});a.c=o<r.length?r.substring(o,r.length):""}else a.r=e==="display"&&r==="none"?Pr:kr;return ii.test(r)&&(a.e=0),this._pt=a,a},wr={top:"0%",bottom:"100%",left:"0%",right:"100%",center:"50%"},gs=function(t){var e=t.split(" "),i=e[0],r=e[1]||"50%";return(i==="top"||i==="bottom"||r==="left"||r==="right")&&(t=i,i=r,r=t),e[0]=wr[i]||i,e[1]=wr[r]||r,e.join(" ")},vs=function(t,e){if(e.tween&&e.tween._time===e.tween._dur){var i=e.t,r=i.style,n=e.u,s=i._gsap,a,o,l;if(n==="all"||n===!0)r.cssText="",o=1;else for(n=n.split(","),l=n.length;--l>-1;)a=n[l],wt[a]&&(o=1,a=a==="transformOrigin"?nt:I),Ot(i,a);o&&(Ot(i,I),s&&(s.svg&&i.removeAttribute("transform"),r.scale=r.rotate=r.translate="none",me(i,1),s.uncache=1,Cr(r)))}},Re={clearProps:function(t,e,i,r,n){if(n.data!=="isFromStart"){var s=t._pt=new J(t._pt,e,i,0,0,vs);return s.u=r,s.pr=-10,s.tween=n,t._props.push(i),1}}},_e=[1,0,0,1,0,0],Rr={},Dr=function(t){return t==="matrix(1, 0, 0, 1, 0, 0)"||t==="none"||!t},Tr=function(t){var e=lt(t,I);return Dr(e)?_e:e.substr(7).match(ei).map(q)},Pi=function(t,e){var i=t._gsap||kt(t),r=t.style,n=Tr(t),s,a,o,l;return i.svg&&t.getAttribute("transform")?(o=t.transform.baseVal.consolidate().matrix,n=[o.a,o.b,o.c,o.d,o.e,o.f],n.join(",")==="1,0,0,1,0,0"?_e:n):(n===_e&&!t.offsetParent&&t!==Kt&&!i.svg&&(o=r.display,r.display="block",s=t.parentNode,(!s||!t.offsetParent&&!t.getBoundingClientRect().width)&&(l=1,a=t.nextElementSibling,Kt.appendChild(t)),n=Tr(t),o?r.display=o:Ot(t,"display"),l&&(a?s.insertBefore(t,a):s?s.appendChild(t):Kt.removeChild(t))),e&&n.length>6?[n[0],n[1],n[4],n[5],n[12],n[13]]:n)},wi=function(t,e,i,r,n,s){var a=t._gsap,o=n||Pi(t,!0),l=a.xOrigin||0,u=a.yOrigin||0,c=a.xOffset||0,d=a.yOffset||0,p=o[0],_=o[1],f=o[2],m=o[3],b=o[4],v=o[5],y=e.split(" "),x=parseFloat(y[0])||0,g=parseFloat(y[1])||0,k,w,S,T;i?o!==_e&&(w=p*m-_*f)&&(S=x*(m/w)+g*(-f/w)+(f*v-m*b)/w,T=x*(-_/w)+g*(p/w)-(p*v-_*b)/w,x=S,g=T):(k=Or(t),x=k.x+(~y[0].indexOf("%")?x/100*k.width:x),g=k.y+(~(y[1]||y[0]).indexOf("%")?g/100*k.height:g)),r||r!==!1&&a.smooth?(b=x-l,v=g-u,a.xOffset=c+(b*p+v*f)-b,a.yOffset=d+(b*_+v*m)-v):a.xOffset=a.yOffset=0,a.xOrigin=x,a.yOrigin=g,a.smooth=!!r,a.origin=e,a.originIsAbsolute=!!i,t.style[nt]="0px 0px",s&&(Et(s,a,"xOrigin",l,x),Et(s,a,"yOrigin",u,g),Et(s,a,"xOffset",c,a.xOffset),Et(s,a,"yOffset",d,a.yOffset)),t.setAttribute("data-svg-origin",x+" "+g)},me=function(t,e){var i=t._gsap||new ui(t);if("x"in i&&!e&&!i.uncache)return i;var r=t.style,n=i.scaleX<0,s="px",a="deg",o=getComputedStyle(t),l=lt(t,nt)||"0",u,c,d,p,_,f,m,b,v,y,x,g,k,w,S,T,C,E,O,F,$,H,Y,V,ht,Yt,ee,ie,Rt,Ei,gt,Dt;return u=c=d=f=m=b=v=y=x=0,p=_=1,i.svg=!!(t.getCTM&&Ar(t)),o.translate&&((o.translate!=="none"||o.scale!=="none"||o.rotate!=="none")&&(r[I]=(o.translate!=="none"?"translate3d("+(o.translate+" 0 0").split(" ").slice(0,3).join(", ")+") ":"")+(o.rotate!=="none"?"rotate("+o.rotate+") ":"")+(o.scale!=="none"?"scale("+o.scale.split(" ").join(",")+") ":"")+(o[I]!=="none"?o[I]:"")),r.scale=r.rotate=r.translate="none"),w=Pi(t,i.svg),i.svg&&(i.uncache?(ht=t.getBBox(),l=i.xOrigin-ht.x+"px "+(i.yOrigin-ht.y)+"px",V=""):V=!e&&t.getAttribute("data-svg-origin"),wi(t,V||l,!!V||i.originIsAbsolute,i.smooth!==!1,w)),g=i.xOrigin||0,k=i.yOrigin||0,w!==_e&&(E=w[0],O=w[1],F=w[2],$=w[3],u=H=w[4],c=Y=w[5],w.length===6?(p=Math.sqrt(E*E+O*O),_=Math.sqrt($*$+F*F),f=E||O?jt(O,E)*Vt:0,v=F||$?jt(F,$)*Vt+f:0,v&&(_*=Math.abs(Math.cos(v*Jt))),i.svg&&(u-=g-(g*E+k*F),c-=k-(g*O+k*$))):(Dt=w[6],Ei=w[7],ee=w[8],ie=w[9],Rt=w[10],gt=w[11],u=w[12],c=w[13],d=w[14],S=jt(Dt,Rt),m=S*Vt,S&&(T=Math.cos(-S),C=Math.sin(-S),V=H*T+ee*C,ht=Y*T+ie*C,Yt=Dt*T+Rt*C,ee=H*-C+ee*T,ie=Y*-C+ie*T,Rt=Dt*-C+Rt*T,gt=Ei*-C+gt*T,H=V,Y=ht,Dt=Yt),S=jt(-F,Rt),b=S*Vt,S&&(T=Math.cos(-S),C=Math.sin(-S),V=E*T-ee*C,ht=O*T-ie*C,Yt=F*T-Rt*C,gt=$*C+gt*T,E=V,O=ht,F=Yt),S=jt(O,E),f=S*Vt,S&&(T=Math.cos(S),C=Math.sin(S),V=E*T+O*C,ht=H*T+Y*C,O=O*T-E*C,Y=Y*T-H*C,E=V,H=ht),m&&Math.abs(m)+Math.abs(f)>359.9&&(m=f=0,b=180-b),p=q(Math.sqrt(E*E+O*O+F*F)),_=q(Math.sqrt(Y*Y+Dt*Dt)),S=jt(H,Y),v=Math.abs(S)>2e-4?S*Vt:0,x=gt?1/(gt<0?-gt:gt):0),i.svg&&(V=t.getAttribute("transform"),i.forceCSS=t.setAttribute("transform","")||!Dr(lt(t,I)),V&&t.setAttribute("transform",V))),Math.abs(v)>90&&Math.abs(v)<270&&(n?(p*=-1,v+=f<=0?180:-180,f+=f<=0?180:-180):(_*=-1,v+=v<=0?180:-180)),e=e||i.uncache,i.x=u-((i.xPercent=u&&(!e&&i.xPercent||(Math.round(t.offsetWidth/2)===Math.round(-u)?-50:0)))?t.offsetWidth*i.xPercent/100:0)+s,i.y=c-((i.yPercent=c&&(!e&&i.yPercent||(Math.round(t.offsetHeight/2)===Math.round(-c)?-50:0)))?t.offsetHeight*i.yPercent/100:0)+s,i.z=d+s,i.scaleX=q(p),i.scaleY=q(_),i.rotation=q(f)+a,i.rotationX=q(m)+a,i.rotationY=q(b)+a,i.skewX=v+a,i.skewY=y+a,i.transformPerspective=x+s,(i.zOrigin=parseFloat(l.split(" ")[2])||!e&&i.zOrigin||0)&&(r[nt]=De(l)),i.xOffset=i.yOffset=0,i.force3D=rt.force3D,i.renderTransform=i.svg?ys:Er?Fr:bs,i.uncache=0,i},De=function(t){return(t=t.split(" "))[0]+" "+t[1]},vi=function(t,e,i){var r=G(e);return q(parseFloat(e)+parseFloat(At(t,"x",i+"px",r)))+r},bs=function(t,e){e.z="0px",e.rotationY=e.rotationX="0deg",e.force3D=0,Fr(t,e)},Nt="0deg",pe="0px",qt=") ",Fr=function(t,e){var i=e||this,r=i.xPercent,n=i.yPercent,s=i.x,a=i.y,o=i.z,l=i.rotation,u=i.rotationY,c=i.rotationX,d=i.skewX,p=i.skewY,_=i.scaleX,f=i.scaleY,m=i.transformPerspective,b=i.force3D,v=i.target,y=i.zOrigin,x="",g=b==="auto"&&t&&t!==1||b===!0;if(y&&(c!==Nt||u!==Nt)){var k=parseFloat(u)*Jt,w=Math.sin(k),S=Math.cos(k),T;k=parseFloat(c)*Jt,T=Math.cos(k),s=vi(v,s,w*T*-y),a=vi(v,a,-Math.sin(k)*-y),o=vi(v,o,S*T*-y+y)}m!==pe&&(x+="perspective("+m+qt),(r||n)&&(x+="translate("+r+"%, "+n+"%) "),(g||s!==pe||a!==pe||o!==pe)&&(x+=o!==pe||g?"translate3d("+s+", "+a+", "+o+") ":"translate("+s+", "+a+qt),l!==Nt&&(x+="rotate("+l+qt),u!==Nt&&(x+="rotateY("+u+qt),c!==Nt&&(x+="rotateX("+c+qt),(d!==Nt||p!==Nt)&&(x+="skew("+d+", "+p+qt),(_!==1||f!==1)&&(x+="scale("+_+", "+f+qt),v.style[I]=x||"translate(0, 0)"},ys=function(t,e){var i=e||this,r=i.xPercent,n=i.yPercent,s=i.x,a=i.y,o=i.rotation,l=i.skewX,u=i.skewY,c=i.scaleX,d=i.scaleY,p=i.target,_=i.xOrigin,f=i.yOrigin,m=i.xOffset,b=i.yOffset,v=i.forceCSS,y=parseFloat(s),x=parseFloat(a),g,k,w,S,T;o=parseFloat(o),l=parseFloat(l),u=parseFloat(u),u&&(u=parseFloat(u),l+=u,o+=u),o||l?(o*=Jt,l*=Jt,g=Math.cos(o)*c,k=Math.sin(o)*c,w=Math.sin(o-l)*-d,S=Math.cos(o-l)*d,l&&(u*=Jt,T=Math.tan(l-u),T=Math.sqrt(1+T*T),w*=T,S*=T,u&&(T=Math.tan(u),T=Math.sqrt(1+T*T),g*=T,k*=T)),g=q(g),k=q(k),w=q(w),S=q(S)):(g=c,S=d,k=w=0),(y&&!~(s+"").indexOf("px")||x&&!~(a+"").indexOf("px"))&&(y=At(p,"x",s,"px"),x=At(p,"y",a,"px")),(_||f||m||b)&&(y=q(y+_-(_*g+f*w)+m),x=q(x+f-(_*k+f*S)+b)),(r||n)&&(T=p.getBBox(),y=q(y+r/100*T.width),x=q(x+n/100*T.height)),T="matrix("+g+","+k+","+w+","+S+","+y+","+x+")",p.setAttribute("transform",T),v&&(p.style[I]=T)},xs=function(t,e,i,r,n){var s=360,a=X(n),o=parseFloat(n)*(a&&~n.indexOf("rad")?Vt:1),l=o-r,u=r+l+"deg",c,d;return a&&(c=n.split("_")[1],c==="short"&&(l%=s,l!==l%(s/2)&&(l+=l<0?s:-s)),c==="cw"&&l<0?l=(l+s*gr)%s-~~(l/s)*s:c==="ccw"&&l>0&&(l=(l-s*gr)%s-~~(l/s)*s)),t._pt=d=new J(t._pt,e,i,r,l,rs),d.e=u,d.u="deg",t._props.push(i),d},Sr=function(t,e){for(var i in e)t[i]=e[i];return t},ws=function(t,e,i){var r=Sr({},i._gsap),n="perspective,force3D,transformOrigin,svgOrigin",s=i.style,a,o,l,u,c,d,p,_;r.svg?(l=i.getAttribute("transform"),i.setAttribute("transform",""),s[I]=e,a=me(i,1),Ot(i,I),i.setAttribute("transform",l)):(l=getComputedStyle(i)[I],s[I]=e,a=me(i,1),s[I]=l);for(o in wt)l=r[o],u=a[o],l!==u&&n.indexOf(o)<0&&(p=G(l),_=G(u),c=p!==_?At(i,o,l,_):parseFloat(l),d=parseFloat(u),t._pt=new J(t._pt,a,o,c,d-c,bi),t._pt.u=_||0,t._props.push(o));Sr(a,r)};K("padding,margin,Width,Radius",function(h,t){var e="Top",i="Right",r="Bottom",n="Left",s=(t<3?[e,i,r,n]:[e+n,e+i,r+i,r+n]).map(function(a){return t<2?h+a:"border"+a+h});Re[t>1?"border"+h:h]=function(a,o,l,u,c){var d,p;if(arguments.length<4)return d=s.map(function(_){return xt(a,_,l)}),p=d.join(" "),p.split(d[0]).length===5?d[0]:p;d=(u+"").split(" "),p={},s.forEach(function(_,f){return p[_]=d[f]=d[f]||d[(f-1)/2|0]}),a.init(o,p,c)}});var Ci={name:"css",register:xi,targetTest:function(t){return t.style&&t.nodeType},init:function(t,e,i,r,n){var s=this._props,a=t.style,o=i.vars.startAt,l,u,c,d,p,_,f,m,b,v,y,x,g,k,w,S,T;Ti||xi(),this.styles=this.styles||Mr(t),S=this.styles.props,this.tween=i;for(f in e)if(f!=="autoRound"&&(u=e[f],!(tt[f]&&ci(f,e,i,r,t,n)))){if(p=typeof u,_=Re[f],p==="function"&&(u=u.call(i,r,t,n),p=typeof u),p==="string"&&~u.indexOf("random(")&&(u=Zt(u)),_)_(this,t,f,u,i)&&(w=1);else if(f.substr(0,2)==="--")l=(getComputedStyle(t).getPropertyValue(f)+"").trim(),u+="",bt.lastIndex=0,bt.test(l)||(m=G(l),b=G(u),b?m!==b&&(l=At(t,f,l,b)+b):m&&(u+=m)),this.add(a,"setProperty",l,u,r,n,0,0,f),s.push(f),S.push(f,0,a[f]);else if(p!=="undefined"){if(o&&f in o?(l=typeof o[f]=="function"?o[f].call(i,r,t,n):o[f],X(l)&&~l.indexOf("random(")&&(l=Zt(l)),G(l+"")||l==="auto"||(l+=rt.units[f]||G(xt(t,f))||""),(l+"").charAt(1)==="="&&(l=xt(t,f))):l=xt(t,f),d=parseFloat(l),v=p==="string"&&u.charAt(1)==="="&&u.substr(0,2),v&&(u=u.substr(2)),c=parseFloat(u),f in mt&&(f==="autoAlpha"&&(d===1&&xt(t,"visibility")==="hidden"&&c&&(d=0),S.push("visibility",0,a.visibility),Et(this,a,"visibility",d?"inherit":"hidden",c?"inherit":"hidden",!c)),f!=="scale"&&f!=="transform"&&(f=mt[f],~f.indexOf(",")&&(f=f.split(",")[0]))),y=f in wt,y){if(this.styles.save(f),T=u,p==="string"&&u.substring(0,6)==="var(--"){if(u=lt(t,u.substring(4,u.indexOf(")"))),u.substring(0,5)==="calc("){var C=t.style.perspective;t.style.perspective=u,u=lt(t,"perspective"),C?t.style.perspective=C:Ot(t,"perspective")}c=parseFloat(u)}if(x||(g=t._gsap,g.renderTransform&&!e.parseTransform||me(t,e.parseTransform),k=e.smoothOrigin!==!1&&g.smooth,x=this._pt=new J(this._pt,a,I,0,1,g.renderTransform,g,0,-1),x.dep=1),f==="scale")this._pt=new J(this._pt,g,"scaleY",g.scaleY,(v?It(g.scaleY,v+c):c)-g.scaleY||0,bi),this._pt.u=0,s.push("scaleY",f),f+="X";else if(f==="transformOrigin"){S.push(nt,0,a[nt]),u=gs(u),g.svg?wi(t,u,0,k,0,this):(b=parseFloat(u.split(" ")[2])||0,b!==g.zOrigin&&Et(this,g,"zOrigin",g.zOrigin,b),Et(this,a,f,De(l),De(u)));continue}else if(f==="svgOrigin"){wi(t,u,1,k,0,this);continue}else if(f in Rr){xs(this,g,f,d,v?It(d,v+u):u);continue}else if(f==="smoothOrigin"){Et(this,g,"smooth",g.smooth,u);continue}else if(f==="force3D"){g[f]=u;continue}else if(f==="transform"){ws(this,u,t);continue}}else f in a||(f=te(f)||f);if(y||(c||c===0)&&(d||d===0)&&!is.test(u)&&f in a)m=(l+"").substr((d+"").length),c||(c=0),b=G(u)||(f in rt.units?rt.units[f]:m),m!==b&&(d=At(t,f,l,b)),this._pt=new J(this._pt,y?g:a,f,d,(v?It(d,v+c):c)-d,!y&&(b==="px"||f==="zIndex")&&e.autoRound!==!1?as:bi),this._pt.u=b||0,y&&T!==u?(this._pt.b=l,this._pt.e=T,this._pt.r=ss):m!==b&&b!=="%"&&(this._pt.b=l,this._pt.r=ns);else if(f in a)ms.call(this,t,f,l,v?v+u:u);else if(f in t)this.add(t,f,l||t[f],v?v+u:u,r,n);else if(f!=="parseTransform"){Ce(f,u);continue}y||(f in a?S.push(f,0,a[f]):typeof t[f]=="function"?S.push(f,2,t[f]()):S.push(f,1,l||t[f])),s.push(f)}}w&&gi(this)},render:function(t,e){if(e.tween._time||!Si())for(var i=e._pt;i;)i.r(t,i.d),i=i._next;else e.styles.revert()},get:xt,aliases:mt,getSetter:function(t,e,i){var r=mt[e];return r&&r.indexOf(",")<0&&(e=r),e in wt&&e!==nt&&(t._gsap.x||xt(t,"x"))?i&&mr===i?e==="scale"?us:hs:(mr=i||{})&&(e==="scale"?fs:cs):t.style&&!Pe(t.style[e])?os:~e.indexOf("-")?ls:Ae(t,e)},core:{_removeProperty:Ot,_getMatrix:Pi}};j.utils.checkPrefix=te;j.core.getStyleSaver=Mr;(function(h,t,e,i){var r=K(h+","+t+","+e,function(n){wt[n]=1});K(t,function(n){rt.units[n]="deg",Rr[n]=1}),mt[r[13]]=h+","+t,K(i,function(n){var s=n.split(":");mt[s[1]]=r[s[0]]})})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent","rotation,rotationX,rotationY,skewX,skewY","transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective","0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");K("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",function(h){rt.units[h]="px"});j.registerPlugin(Ci);var A=j.registerPlugin(Ci)||j,As=A.core.Tween;var Fe=class{constructor(t={}){this.options={sensitivity:1.35,cooldown:200,bassLow:60,bassHigh:200,kickLow:200,kickHigh:500,historySize:52,fftSize:2048,smoothing:.82,...t},this.audioContext=null,this.analyser=null,this.source=null,this.stream=null,this.isRunning=!1,this.lastBassTime=0,this.lastMidTime=0,this.lastHighTime=0;let e=this.options.historySize;this._bassHist=new Float32Array(e),this._bassIdx=0,this._bassFull=!1,this._midHist=new Float32Array(e),this._midIdx=0,this._midFull=!1,this._highHist=new Float32Array(e),this._highIdx=0,this._highFull=!1,this._dataArray=null,this._rafId=null,this.onBeat=null,this.onEnergy=null,this.onError=null}async start(){if(this.isRunning)return!0;try{return this.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1},video:!1}),this.audioContext=new(window.AudioContext||window.webkitAudioContext),this.audioContext.state==="suspended"&&await this.audioContext.resume(),this.analyser=this.audioContext.createAnalyser(),this.analyser.fftSize=this.options.fftSize,this.analyser.smoothingTimeConstant=this.options.smoothing,this.source=this.audioContext.createMediaStreamSource(this.stream),this.source.connect(this.analyser),this._dataArray=new Uint8Array(this.analyser.frequencyBinCount),this._resetHistory(),this.isRunning=!0,this._loop(),!0}catch(t){return this.onError&&this.onError(t),!1}}stop(){if(this.isRunning=!1,this._rafId&&(cancelAnimationFrame(this._rafId),this._rafId=null),this.source){try{this.source.disconnect()}catch{}this.source=null}this.stream&&(this.stream.getTracks().forEach(t=>t.stop()),this.stream=null),this.audioContext&&(this.audioContext.close().catch(()=>{}),this.audioContext=null),this.analyser=null,this._dataArray=null,this._resetHistory()}_resetHistory(){this._bassHist.fill(0),this._bassIdx=0,this._bassFull=!1,this._midHist.fill(0),this._midIdx=0,this._midFull=!1,this._highHist.fill(0),this._highIdx=0,this._highFull=!1,this.lastBassTime=0,this.lastMidTime=0,this.lastHighTime=0}_binFor(t){let e=this.audioContext.sampleRate/2;return Math.min(this._dataArray.length-1,Math.round(t/e*(this.analyser.fftSize/2)))}_bandEnergy(t,e){let i=Math.max(0,this._binFor(t)),r=Math.min(this._dataArray.length-1,this._binFor(e));if(r<=i)return 0;let n=0;for(let s=i;s<=r;s++)n+=this._dataArray[s]**2;return Math.sqrt(n/(r-i+1))}_loop(){if(!this.isRunning)return;this.analyser.getByteFrequencyData(this._dataArray);let t=this._bandEnergy(this.options.bassLow,this.options.bassHigh),e=this._bandEnergy(200,1500),i=this._bandEnergy(1500,8e3),r=this.options.historySize,n=(T,C,E,O)=>{T[E[0]]=C,E[0]=(E[0]+1)%r,E[0]===0&&(O[0]=!0)},s=[this._bassIdx],a=[this._bassFull],o=[this._midIdx],l=[this._midFull],u=[this._highIdx],c=[this._highFull];n(this._bassHist,t,s,a),this._bassIdx=s[0],this._bassFull=a[0],n(this._midHist,e,o,l),this._midIdx=o[0],this._midFull=l[0],n(this._highHist,i,u,c),this._highIdx=u[0],this._highFull=c[0];let d=(T,C)=>{let E=0;for(let O=0;O<C;O++)E+=T[O];return E/C},p=this._bassFull?r:Math.max(1,this._bassIdx),_=this._midFull?r:Math.max(1,this._midIdx),f=this._highFull?r:Math.max(1,this._highIdx),m=d(this._bassHist,p),b=d(this._midHist,_),v=d(this._highHist,f),y=t/(m||1),x=e/(b||1),g=i/(v||1);this.onEnergy&&this.onEnergy({bass:t,avg:m,ratio:y,spectrum:this._dataArray,mid:e,high:i,midRatio:x,highRatio:g});let k=performance.now(),w=this.options.cooldown,S=this.options.sensitivity;y>=S&&t>8&&k-this.lastBassTime>=w&&(this.lastBassTime=k,this.onBeat&&this.onBeat({energy:t,ratio:y,instant:k,type:"bass"})),x>=S*1.15&&e>6&&k-this.lastMidTime>=w*.6&&(this.lastMidTime=k,this.onBeat&&this.onBeat({energy:e,ratio:x,instant:k,type:"mid"})),g>=S*1.28&&i>4&&k-this.lastHighTime>=w*.38&&(this.lastHighTime=k,this.onBeat&&this.onBeat({energy:i,ratio:g,instant:k,type:"high"})),this._rafId=requestAnimationFrame(()=>this._loop())}async startFromAudio(t){if(this.isRunning)return!0;try{return this.audioContext=new(window.AudioContext||window.webkitAudioContext),this.audioContext.state==="suspended"&&await this.audioContext.resume(),this.analyser=this.audioContext.createAnalyser(),this.analyser.fftSize=this.options.fftSize,this.analyser.smoothingTimeConstant=this.options.smoothing,this.source=this.audioContext.createMediaElementSource(t),this.source.connect(this.analyser),this.source.connect(this.audioContext.destination),this._dataArray=new Uint8Array(this.analyser.frequencyBinCount),this._resetHistory(),this.isRunning=!0,this._loop(),!0}catch(e){return this.onError&&this.onError(e),!1}}setSensitivity(t){this.options.sensitivity=parseFloat(t)}setCooldown(t){this.options.cooldown=parseInt(t)}};var P="beatimg-";function ze(h,t,e=""){let i=document.createElement(h);return t&&(i.className=t),e&&(i.innerHTML=e),i}var Mi=class{constructor(){this.detector=null,this.isActive=!1,this.isPanelOpen=!1,this.imagePool=[],this.beatCount=0,this.toggleBtn=null,this.panel=null,this.overlay=null,this.overlayImg=null,this.overlayFlash=null,this.statusDot=null,this.statusText=null,this.beatCountEl=null,this.sensitivitySlider=null,this.sensitivityVal=null,this.cooldownSlider=null,this.cooldownVal=null,this.startBtn=null,this.stopBtn=null,this.energyFill=null,this.beatRing=null,this.canvas=null,this.ctx=null,this._poolTimer=null,this._dismissTimer=null,this._sceneGen=0,this._scenePriority=0,this._preloadCache=new Set,this._shuffleQueue=[],this._observer=null,this.sourceMode="mic",this.audioEl=null,this.fileInputEl=null,this.fileZoneEl=null,this.audioNameEl=null,this._beatAnimations={bass:[this._animBassSlam.bind(this),this._animZoomCrush.bind(this),this._animFilmBurn.bind(this),this._animStampDrop.bind(this)],mid:[this._animSplitReveal.bind(this),this._animDiagonalSlice.bind(this),this._animSideSlide.bind(this),this._animGlitch.bind(this)],high:[this._animScatterBurst.bind(this),this._animStrobe.bind(this),this._animChromatic.bind(this),this._animVHSNoise.bind(this)]},this._init()}_init(){this._buildToggleBtn(),this._buildPanel(),this._buildOverlay(),this._refreshPool(),this._observer=new MutationObserver(()=>{clearTimeout(this._poolTimer),this._poolTimer=setTimeout(()=>this._refreshPool(),900)}),this._observer.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["src","style"]})}_buildToggleBtn(){this.toggleBtn=ze("button",`${P}toggle`,`<svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2.2"
            stroke-linecap="round" stroke-linejoin="round">
         <path d="M9 18V5l12-2v13"/>
         <circle cx="6" cy="18" r="3"/>
         <circle cx="18" cy="16" r="3"/>
       </svg>`),this.toggleBtn.title="BeatImg",this.toggleBtn.addEventListener("click",()=>this._togglePanel()),document.body.appendChild(this.toggleBtn)}_buildPanel(){this.panel=ze("div",`${P}panel`),this.panel.innerHTML=`
      <div class="${P}header">
        <div class="${P}title">
          <span class="${P}title-icon">\u{1F3B5}</span>
          <span>BeatImg</span>
        </div>
        <button class="${P}close-btn" title="Close">\u2715</button>
      </div>

      <div class="${P}status-bar">
        <div class="${P}dot idle"></div>
        <span class="${P}status-text">Ready</span>
        <span class="${P}beat-count">0 beat</span>
      </div>

      <canvas class="${P}visualizer" width="240" height="50"></canvas>

      <div class="${P}energy-wrap">
        <div class="${P}energy-fill"></div>
      </div>

      <div class="${P}source-tabs">
        <button class="${P}tab active" data-tab="mic">\u{1F3A4} Microphone</button>
        <button class="${P}tab" data-tab="file">\u{1F4C1} MP3</button>
      </div>

      <div class="${P}file-zone">
        <label class="${P}drop-label">
          <input type="file" accept="audio/*" class="${P}file-input" style="display:none">
          <span class="${P}drop-icon">\u{1F4C2}</span>
          <span class="${P}drop-text">Select or drop a file</span>
        </label>
        <div class="${P}audio-info">
          <span class="${P}audio-name"></span>
        </div>
        <audio class="${P}audio" controls></audio>
      </div>

      <div class="${P}controls">
        <div class="${P}control-row">
          <label>Sensitivity</label>
          <div class="${P}slider-row">
            <input type="range" class="${P}sensitivity" min="1.1" max="3.0" step="0.05" value="1.35">
            <span class="${P}sval">1.35</span>
          </div>
        </div>
        <div class="${P}control-row">
          <label>Cooldown (ms)</label>
          <div class="${P}slider-row">
            <input type="range" class="${P}cooldown" min="20" max="1000" step="10" value="180">
            <span class="${P}sval">180ms</span>
          </div>
        </div>
      </div>

      <div class="${P}btn-row">
        <button class="${P}start-btn">\u25B6 Start</button>
        <button class="${P}stop-btn" disabled>\u25A0 Stop</button>
      </div>

      <div class="${P}beat-ring"></div>
    `,document.body.appendChild(this.panel),this.statusDot=this.panel.querySelector(`.${P}dot`),this.statusText=this.panel.querySelector(`.${P}status-text`),this.beatCountEl=this.panel.querySelector(`.${P}beat-count`),this.sensitivitySlider=this.panel.querySelector(`.${P}sensitivity`),this.cooldownSlider=this.panel.querySelector(`.${P}cooldown`);let t=this.panel.querySelectorAll(`.${P}sval`);this.sensitivityVal=t[0],this.cooldownVal=t[1],this.startBtn=this.panel.querySelector(`.${P}start-btn`),this.stopBtn=this.panel.querySelector(`.${P}stop-btn`),this.energyFill=this.panel.querySelector(`.${P}energy-fill`),this.beatRing=this.panel.querySelector(`.${P}beat-ring`),this.canvas=this.panel.querySelector(`.${P}visualizer`),this.ctx=this.canvas.getContext("2d"),this.fileZoneEl=this.panel.querySelector(`.${P}file-zone`),this.fileInputEl=this.panel.querySelector(`.${P}file-input`),this.audioNameEl=this.panel.querySelector(`.${P}audio-name`),this.audioEl=this.panel.querySelector(`.${P}audio`),this.panel.querySelector(`.${P}close-btn`).addEventListener("click",()=>this._closePanel()),this.startBtn.addEventListener("click",()=>this._start()),this.stopBtn.addEventListener("click",()=>this._stop()),this.panel.querySelectorAll(`.${P}tab`).forEach(e=>{e.addEventListener("click",()=>{let i=e.dataset.tab;this.sourceMode=i,this.panel.querySelectorAll(`.${P}tab`).forEach(r=>r.classList.remove("active")),e.classList.add("active"),this.fileZoneEl.style.display=i==="file"?"block":"none"})}),this.fileInputEl.addEventListener("change",e=>this._loadAudioFile(e.target.files[0])),this.fileZoneEl.addEventListener("dragover",e=>{e.preventDefault(),this.fileZoneEl.classList.add("dragover")}),this.fileZoneEl.addEventListener("dragleave",()=>this.fileZoneEl.classList.remove("dragover")),this.fileZoneEl.addEventListener("drop",e=>{e.preventDefault(),this.fileZoneEl.classList.remove("dragover");let i=e.dataTransfer.files[0];i&&i.type.startsWith("audio/")&&this._loadAudioFile(i)}),this.sensitivitySlider.addEventListener("input",e=>{this.sensitivityVal.textContent=parseFloat(e.target.value).toFixed(2),this.detector&&this.detector.setSensitivity(e.target.value)}),this.cooldownSlider.addEventListener("input",e=>{this.cooldownVal.textContent=e.target.value+"ms",this.detector&&this.detector.setCooldown(e.target.value)})}_buildOverlay(){this.overlay=ze("div",`${P}overlay`),this.overlayFlash=ze("div",`${P}flash`),this.overlay.appendChild(this.overlayFlash),this.overlay.addEventListener("click",()=>this._clearScene(!0)),document.body.appendChild(this.overlay)}_togglePanel(){this.isPanelOpen?this._closePanel():this._openPanel()}_openPanel(){this.isPanelOpen=!0,this.panel.classList.add("open"),A.fromTo(this.panel,{opacity:0,scale:.88,y:-8,transformOrigin:"top right"},{opacity:1,scale:1,y:0,duration:.28,ease:"back.out(1.7)"}),this.toggleBtn.classList.add("active")}_closePanel(){this.isPanelOpen=!1,A.to(this.panel,{opacity:0,scale:.9,y:-6,duration:.18,ease:"power2.in",onComplete:()=>this.panel.classList.remove("open")}),this.toggleBtn.classList.remove("active")}_setStatus(t,e){this.statusDot.className=`${P}dot ${t}`,this.statusText.textContent=e}_refreshPool(){let t=new Set;document.querySelectorAll("img").forEach(i=>{if(!i.src||i.src.startsWith("data:image/svg")||i.naturalWidth<120||i.naturalHeight<120)return;let r=i.getBoundingClientRect();r.width<100||r.height<100||i.closest(`.${P}overlay, .${P}panel, .${P}toggle`)||t.add(i.src)}),document.querySelectorAll("*").forEach(i=>{if(i.closest(`.${P}overlay, .${P}panel, .${P}toggle`))return;let r=getComputedStyle(i).backgroundImage;if(!r||r==="none")return;let n=r.match(/url\(["']?([^"')]+)["']?\)/);if(!n||!n[1])return;let s=n[1];if(s.startsWith("data:image/svg"))return;let a=i.getBoundingClientRect();a.width<100||a.height<100||t.add(s)}),this.imagePool=[...t];let e=new Set(this.imagePool);this._shuffleQueue=this._shuffleQueue.filter(i=>e.has(i)),this._preloadImages()}_preloadImages(){this.imagePool.forEach(t=>{if(this._preloadCache.has(t))return;this._preloadCache.add(t);let e=new Image;e.src=t})}_randomImage(){return this.imagePool.length?this.imagePool[Math.floor(Math.random()*this.imagePool.length)]:null}_pickImages(t){if(!this.imagePool.length)return[];let e=[...this.imagePool].sort(()=>Math.random()-.5);return e.slice(0,Math.min(t,e.length))}_dequeueImages(t){if(!this.imagePool.length)return[];let e=Math.min(t,this.imagePool.length),i=[];for(;i.length<e;)this._shuffleQueue.length||(this._shuffleQueue=[...this.imagePool].sort(()=>Math.random()-.5)),i.push(this._shuffleQueue.shift());return i}async _start(){if(this.isActive)return;if(this.startBtn.disabled=!0,this.sourceMode==="file"){if(!this.audioEl||!this.audioEl.src){this._setStatus("error","Please select an audio file first"),this.startBtn.disabled=!1;return}this._setStatus("connecting","Starting audio analysis...")}else this._setStatus("connecting","Waiting for microphone permission...");this.detector=new Fe({sensitivity:parseFloat(this.sensitivitySlider.value),cooldown:parseInt(this.cooldownSlider.value)}),this.detector.onBeat=e=>this._onBeat(e),this.detector.onEnergy=e=>this._onEnergy(e),this.detector.onError=e=>{this._setStatus("error","Error: "+e.message),this.startBtn.disabled=!1};let t;this.sourceMode==="file"?t=await this.detector.startFromAudio(this.audioEl):t=await this.detector.start(),t?(this.isActive=!0,this._setStatus("active",this.sourceMode==="file"?"Analyzing file...":"Listening..."),this.stopBtn.disabled=!1):(this._setStatus("error",this.sourceMode==="file"?"Could not connect audio source":"Microphone access failed"),this.startBtn.disabled=!1)}_stop(){this.isActive&&(this.detector&&(this.detector.stop(),this.detector=null),this.isActive=!1,this._setStatus("idle","Stopped"),this.startBtn.disabled=!1,this.stopBtn.disabled=!0,this.energyFill.style.width="0%",this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height))}_loadAudioFile(t){if(!t)return;let e=this.audioEl.src;e&&e.startsWith("blob:")&&URL.revokeObjectURL(e),this.audioEl.src=URL.createObjectURL(t),this.audioNameEl.textContent=t.name,this.audioEl.load()}_onBeat({energy:t,ratio:e,type:i="bass"}){let n={bass:3,mid:2,high:1}[i]||1;if(n<this._scenePriority)return;this.beatCount++,this.beatCountEl.textContent=`${this.beatCount} beat`,this._refreshPool();let s={bass:2,mid:3,high:4},a=this._dequeueImages(s[i]||1);if(a.length){let c=this._beatAnimations[i]||this._beatAnimations.bass,d=c[Math.floor(Math.random()*c.length)];this._scenePriority=n,this._showBeatScene(a,d,t,i)}let o={bass:["#ff3b6b","rgba(255,59,107,"],mid:["#ff8800","rgba(255,136,0,"],high:["#7c6fff","rgba(124,111,255,"]},[l,u]=o[i]||o.bass;A.killTweensOf(this.beatRing),A.fromTo(this.beatRing,{scale:.4,opacity:.95,backgroundColor:l},{scale:3.5,opacity:0,backgroundColor:l,duration:.55,ease:"power2.out"}),A.killTweensOf(this.toggleBtn,"boxShadow"),A.fromTo(this.toggleBtn,{boxShadow:`0 0 0 0 ${u}0.9)`},{boxShadow:`0 0 0 22px ${u}0)`,duration:.55,ease:"power2.out"})}_onEnergy({ratio:t,spectrum:e}){let i=Math.min(100,Math.max(0,(t-1)*130));this.energyFill.style.width=i+"%",this._drawSpectrum(e)}_drawSpectrum(t){let{width:e,height:i}=this.canvas;this.ctx.clearRect(0,0,e,i);let r=40,n=e/r,s=Math.floor(t.length/r);for(let a=0;a<r;a++){let o=0;for(let c=0;c<s;c++)o+=t[a*s+c];o/=s;let l=o/255*i,u=260-o/255*160;this.ctx.shadowColor=`hsl(${u}, 90%, 65%)`,this.ctx.shadowBlur=4,this.ctx.fillStyle=`hsl(${u}, 85%, 60%)`,this.ctx.fillRect(a*n+1,i-l,n-2,l)}this.ctx.shadowBlur=0}_showBeatScene(t,e,i,r){if(clearTimeout(this._dismissTimer),this._screenFlash(i,r),this._clearScene(!1),++this._sceneGen!==this._sceneGen)return;let s=t.map(a=>{let o=document.createElement("div");return o.className=`${P}scene-img`,o.style.backgroundImage=`url("${a.replace(/"/g,"%22")}")`,o});s.length&&this._renderScene(s,e,i,r)}_renderScene(t,e,i,r){this._applyLayout(t),t.forEach(a=>this.overlay.appendChild(a)),this.overlay.classList.add("visible"),e(t,i,r),this._addShake(t,r);let n=this.detector?.options.cooldown??400,s=r==="high"?Math.max(500,n*1.2):Math.max(800,n*1.8);this._dismissTimer=setTimeout(()=>this._clearScene(!1),s)}_applyLayout(t){let e=Math.min(t.length,4),r={1:[[{l:"5vw",t:"5vh",w:"90vw",h:"90vh"}],[{l:"8vw",t:"8vh",w:"84vw",h:"84vh"}]],2:[[{l:"1vw",t:"6vh",w:"49vw",h:"88vh"},{l:"51vw",t:"6vh",w:"48vw",h:"88vh"}],[{l:"2vw",t:"5vh",w:"63vw",h:"90vh"},{l:"67vw",t:"18vh",w:"30vw",h:"64vh"}],[{l:"35vw",t:"5vh",w:"63vw",h:"90vh"},{l:"2vw",t:"18vh",w:"30vw",h:"64vh"}],[{l:"5vw",t:"2vh",w:"90vw",h:"60vh"},{l:"20vw",t:"65vh",w:"60vw",h:"30vh"}]],3:[[{l:"1vw",t:"5vh",w:"62vw",h:"90vh"},{l:"65vw",t:"5vh",w:"33vw",h:"43vh"},{l:"65vw",t:"52vh",w:"33vw",h:"43vh"}],[{l:"35vw",t:"5vh",w:"63vw",h:"90vh"},{l:"1vw",t:"5vh",w:"32vw",h:"43vh"},{l:"1vw",t:"52vh",w:"32vw",h:"43vh"}],[{l:"5vw",t:"2vh",w:"90vw",h:"57vh"},{l:"1vw",t:"62vh",w:"48vw",h:"35vh"},{l:"51vw",t:"62vh",w:"48vw",h:"35vh"}],[{l:"1vw",t:"2vh",w:"98vw",h:"30vh"},{l:"1vw",t:"35vh",w:"98vw",h:"30vh"},{l:"1vw",t:"68vh",w:"98vw",h:"28vh"}]],4:[[{l:"1vw",t:"2vh",w:"48vw",h:"47vh"},{l:"51vw",t:"2vh",w:"48vw",h:"47vh"},{l:"1vw",t:"51vh",w:"48vw",h:"47vh"},{l:"51vw",t:"51vh",w:"48vw",h:"47vh"}],[{l:"1vw",t:"5vh",w:"62vw",h:"90vh"},{l:"65vw",t:"2vh",w:"33vw",h:"28vh"},{l:"65vw",t:"34vh",w:"33vw",h:"28vh"},{l:"65vw",t:"66vh",w:"33vw",h:"28vh"}],[{l:"36vw",t:"5vh",w:"62vw",h:"90vh"},{l:"1vw",t:"2vh",w:"33vw",h:"28vh"},{l:"1vw",t:"34vh",w:"33vw",h:"28vh"},{l:"1vw",t:"66vh",w:"33vw",h:"28vh"}]]}[e],n=r[Math.floor(Math.random()*r.length)];t.forEach((s,a)=>{let o=n[a]||n[n.length-1];Object.assign(s.style,{left:o.l,top:o.t,width:o.w,height:o.h})})}_clearScene(t=!0){let e=this._sceneGen,i=[...this.overlay.querySelectorAll(`.${P}scene-img`)];if(!i.length){this.overlay.classList.remove("visible"),this._scenePriority=0;return}if(t){i.forEach(n=>{A.killTweensOf(n),n.remove()}),this.overlay.classList.remove("visible"),this._scenePriority=0;return}let r=0;i.forEach(n=>{A.killTweensOf(n),A.to(n,{opacity:0,duration:.16,ease:"power2.in",onComplete:()=>{n.remove(),++r===i.length&&e===this._sceneGen&&(this.overlay.classList.remove("visible"),this._scenePriority=0)}})})}_screenFlash(t,e="bass"){let i=Math.min(.7,(t-1)*.28+.15),r={bass:"#ffffff",mid:"#ff7030",high:"#8070ff"};this.overlayFlash.style.background=r[e]||"#ffffff",this.overlayFlash.style.opacity=i,A.killTweensOf(this.overlayFlash),A.to(this.overlayFlash,{opacity:0,duration:.32,ease:"power3.out"})}_addShake(t,e){let i=e==="high"?7:e==="mid"?3:0;if(!i)return;let r=e==="high"?1.5:.6;t.forEach(n=>{A.to(n,{x:`random(-${i}, ${i})`,y:`random(-${Math.ceil(i/2)}, ${Math.ceil(i/2)})`,rotate:`random(-${r}, ${r})`,duration:.055,repeat:-1,ease:"none",repeatRefresh:!0})})}_animBassSlam(t){t.forEach((e,i)=>{A.from(e,{scale:.06,rotate:i%2===0?-5:5,duration:.28,ease:"back.out(3)",delay:i*.04})}),A.fromTo(this.overlay,{x:-10},{x:10,duration:.03,repeat:7,yoyo:!0,ease:"none",onComplete:()=>A.set(this.overlay,{x:0})})}_animZoomCrush(t){t.forEach((e,i)=>{A.from(e,{scale:2.6,duration:.36,ease:"expo.out",delay:i*.05})})}_animFilmBurn(t){t.forEach((e,i)=>{A.from(e,{scale:.3,rotate:i%2===0?160:-160,duration:.32,ease:"power3.out",delay:i*.05})})}_animStampDrop(t){t.forEach((e,i)=>{A.from(e,{y:-window.innerHeight,rotate:i%2===0?-3:3,duration:.26,ease:"back.out(2)",delay:i*.05})})}_animSplitReveal(t){t.forEach((e,i)=>{let r=i%2===0?-window.innerWidth:window.innerWidth;A.from(e,{x:r,duration:.28,ease:"expo.out",delay:i*.03})})}_animDiagonalSlice(t){t.forEach((e,i)=>{A.from(e,{clipPath:"polygon(0 0, 0 0, 0 100%, 0 100%)",duration:.26,ease:"power4.out",delay:i*.04})})}_animSideSlide(t){t.forEach((e,i)=>{let r=i%2===0?1:-1;A.from(e,{x:r*window.innerWidth,rotate:r*10,duration:.26,ease:"expo.out",delay:i*.04})})}_animGlitch(t){t.forEach((e,i)=>{A.timeline({delay:i*.04}).from(e,{skewX:22,skewY:4,scale:1.1,duration:.1,ease:"steps(4)"}).to(e,{x:-10,skewX:-6,duration:.04}).to(e,{x:7,skewX:4,duration:.04}).to(e,{x:0,skewX:0,duration:.04})})}_animScatterBurst(t){t.forEach((e,i)=>{A.from(e,{scale:.06,rotate:(Math.random()-.5)*60,duration:.24,ease:"back.out(2.5)",delay:i*.04})})}_animStrobe(t){t.forEach((e,i)=>{A.timeline({delay:i*.04}).from(e,{scale:1.5,duration:.06,ease:"power3.out"}).to(e,{scale:.94,duration:.05}).to(e,{scale:1,duration:.07,ease:"back.out(2)"})})}_animChromatic(t){t.forEach((e,i)=>{let r=i%2===0?window.innerHeight*.35:-window.innerHeight*.35;A.from(e,{y:r,scale:.88,duration:.3,ease:"expo.out",delay:i*.04})})}_animVHSNoise(t){t.forEach((e,i)=>{A.timeline({delay:i*.04}).from(e,{scaleY:1.1,skewX:10,duration:.1,ease:"steps(4)"}).to(e,{x:-7,skewX:-4,duration:.04}).to(e,{x:5,skewX:3,duration:.04}).to(e,{x:0,skewX:0,duration:.04})})}},zr=null;function Br(){zr||(zr=new Mi)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>setTimeout(Br,600)):setTimeout(Br,600);})();
/*! Bundled license information:

gsap/gsap-core.js:
  (*!
   * GSAP 3.15.0
   * https://gsap.com
   *
   * @license Copyright 2008-2026, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license
   * @author: Jack Doyle, jack@greensock.com
  *)

gsap/CSSPlugin.js:
  (*!
   * CSSPlugin 3.15.0
   * https://gsap.com
   *
   * Copyright 2008-2026, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license
   * @author: Jack Doyle, jack@greensock.com
  *)
*/
