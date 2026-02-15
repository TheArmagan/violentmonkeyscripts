// ==UserScript==
// @name        pixivutils 
// @namespace   pixivutils
// @match       https://www.pixiv.net/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @grant       GM_webRequest
// @grant       unsafeWindow
// @connect     *
// @version     0.0.1
// @author      TheArmagan
// @license     GPL-3.0-only
// @description 2026-02-15T21:17:00.250Z
// ==/UserScript==
(()=>{var Q=Object.create;var F=Object.defineProperty;var X=Object.getOwnPropertyDescriptor;var J=Object.getOwnPropertyNames;var Z=Object.getPrototypeOf,K=Object.prototype.hasOwnProperty;var z=(g,a)=>()=>(a||g((a={exports:{}}).exports,a),a.exports);var tt=(g,a,m,f)=>{if(a&&typeof a=="object"||typeof a=="function")for(let d of J(a))!K.call(g,d)&&d!==m&&F(g,d,{get:()=>a[d],enumerable:!(f=X(a,d))||f.enumerable});return g};var et=(g,a,m)=>(m=g!=null?Q(Z(g)):{},tt(a||!g||!g.__esModule?F(m,"default",{value:g,enumerable:!0}):m,g));var B=z((Y,C)=>{(function(g,a){typeof define=="function"&&define.amd?define(a):typeof C=="object"&&C.exports?C.exports=a():g.EvEmitter=a()})(typeof window<"u"?window:Y,function(){"use strict";function g(){}var a=g.prototype;return a.on=function(m,f){if(!(!m||!f)){var d=this._events=this._events||{},u=d[m]=d[m]||[];return u.indexOf(f)==-1&&u.push(f),this}},a.once=function(m,f){if(!(!m||!f)){this.on(m,f);var d=this._onceEvents=this._onceEvents||{},u=d[m]=d[m]||{};return u[f]=!0,this}},a.off=function(m,f){var d=this._events&&this._events[m];if(!(!d||!d.length)){var u=d.indexOf(f);return u!=-1&&d.splice(u,1),this}},a.emitEvent=function(m,f){var d=this._events&&this._events[m];if(!(!d||!d.length)){d=d.slice(0),f=f||[];for(var u=this._onceEvents&&this._onceEvents[m],r=0;r<d.length;r++){var s=d[r],l=u&&u[s];l&&(this.off(m,s),delete u[s]),s.apply(this,f)}return this}},a.allOff=function(){delete this._events,delete this._onceEvents},g})});var W=z((rt,I)=>{(function(g,a){typeof define=="function"&&define.amd?define(a):typeof I=="object"&&I.exports?I.exports=a():g.getSize=a()})(window,function(){"use strict";function a(i){var y=parseFloat(i),p=i.indexOf("%")==-1&&!isNaN(y);return p&&y}function m(){}var f=typeof console>"u"?m:function(i){console.error(i)},d=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"],u=d.length;function r(){for(var i={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},y=0;y<u;y++){var p=d[y];i[p]=0}return i}function s(i){var y=getComputedStyle(i);return y||f("Style returned "+y+". Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1"),y}var l=!1,c;function h(){if(!l){l=!0;var i=document.createElement("div");i.style.width="200px",i.style.padding="1px 2px 3px 4px",i.style.borderStyle="solid",i.style.borderWidth="1px 2px 3px 4px",i.style.boxSizing="border-box";var y=document.body||document.documentElement;y.appendChild(i);var p=s(i);c=Math.round(a(p.width))==200,v.isBoxSizeOuter=c,y.removeChild(i)}}function v(i){if(h(),typeof i=="string"&&(i=document.querySelector(i)),!(!i||typeof i!="object"||!i.nodeType)){var y=s(i);if(y.display=="none")return r();var p={};p.width=i.offsetWidth,p.height=i.offsetHeight;for(var n=p.isBorderBox=y.boxSizing=="border-box",t=0;t<u;t++){var e=d[t],o=y[e],x=parseFloat(o);p[e]=isNaN(x)?0:x}var b=p.paddingLeft+p.paddingRight,_=p.paddingTop+p.paddingBottom,E=p.marginLeft+p.marginRight,w=p.marginTop+p.marginBottom,k=p.borderLeftWidth+p.borderRightWidth,L=p.borderTopWidth+p.borderBottomWidth,S=n&&c,A=a(y.width);A!==!1&&(p.width=A+(S?0:b+k));var j=a(y.height);return j!==!1&&(p.height=j+(S?0:_+L)),p.innerWidth=p.width-(b+k),p.innerHeight=p.height-(_+L),p.outerWidth=p.width+E,p.outerHeight=p.height+w,p}}return v})});var $=z((st,O)=>{(function(g,a){"use strict";typeof define=="function"&&define.amd?define(a):typeof O=="object"&&O.exports?O.exports=a():g.matchesSelector=a()})(window,function(){"use strict";var a=function(){var m=window.Element.prototype;if(m.matches)return"matches";if(m.matchesSelector)return"matchesSelector";for(var f=["webkit","moz","ms","o"],d=0;d<f.length;d++){var u=f[d],r=u+"MatchesSelector";if(m[r])return r}}();return function(f,d){return f[a](d)}})});var q=z((at,P)=>{(function(g,a){typeof define=="function"&&define.amd?define(["desandro-matches-selector/matches-selector"],function(m){return a(g,m)}):typeof P=="object"&&P.exports?P.exports=a(g,$()):g.fizzyUIUtils=a(g,g.matchesSelector)})(window,function(a,m){"use strict";var f={};f.extend=function(r,s){for(var l in s)r[l]=s[l];return r},f.modulo=function(r,s){return(r%s+s)%s};var d=Array.prototype.slice;f.makeArray=function(r){if(Array.isArray(r))return r;if(r==null)return[];var s=typeof r=="object"&&typeof r.length=="number";return s?d.call(r):[r]},f.removeFrom=function(r,s){var l=r.indexOf(s);l!=-1&&r.splice(l,1)},f.getParent=function(r,s){for(;r.parentNode&&r!=document.body;)if(r=r.parentNode,m(r,s))return r},f.getQueryElement=function(r){return typeof r=="string"?document.querySelector(r):r},f.handleEvent=function(r){var s="on"+r.type;this[s]&&this[s](r)},f.filterFindElements=function(r,s){r=f.makeArray(r);var l=[];return r.forEach(function(c){if(c instanceof HTMLElement){if(!s){l.push(c);return}m(c,s)&&l.push(c);for(var h=c.querySelectorAll(s),v=0;v<h.length;v++)l.push(h[v])}}),l},f.debounceMethod=function(r,s,l){l=l||100;var c=r.prototype[s],h=s+"Timeout";r.prototype[s]=function(){var v=this[h];clearTimeout(v);var i=arguments,y=this;this[h]=setTimeout(function(){c.apply(y,i),delete y[h]},l)}},f.docReady=function(r){var s=document.readyState;s=="complete"||s=="interactive"?setTimeout(r):document.addEventListener("DOMContentLoaded",r)},f.toDashed=function(r){return r.replace(/(.)([A-Z])/g,function(s,l,c){return l+"-"+c}).toLowerCase()};var u=a.console;return f.htmlInit=function(r,s){f.docReady(function(){var l=f.toDashed(s),c="data-"+l,h=document.querySelectorAll("["+c+"]"),v=document.querySelectorAll(".js-"+l),i=f.makeArray(h).concat(f.makeArray(v)),y=c+"-options",p=a.jQuery;i.forEach(function(n){var t=n.getAttribute(c)||n.getAttribute(y),e;try{e=t&&JSON.parse(t)}catch(x){u&&u.error("Error parsing "+c+" on "+n.className+": "+x);return}var o=new r(n,e);p&&p.data(n,s,o)})})},f})});var N=z((ht,M)=>{(function(g,a){typeof define=="function"&&define.amd?define(["ev-emitter/ev-emitter","get-size/get-size"],a):typeof M=="object"&&M.exports?M.exports=a(B(),W()):(g.Outlayer={},g.Outlayer.Item=a(g.EvEmitter,g.getSize))})(window,function(a,m){"use strict";function f(n){for(var t in n)return!1;return t=null,!0}var d=document.documentElement.style,u=typeof d.transition=="string"?"transition":"WebkitTransition",r=typeof d.transform=="string"?"transform":"WebkitTransform",s={WebkitTransition:"webkitTransitionEnd",transition:"transitionend"}[u],l={transform:r,transition:u,transitionDuration:u+"Duration",transitionProperty:u+"Property",transitionDelay:u+"Delay"};function c(n,t){n&&(this.element=n,this.layout=t,this.position={x:0,y:0},this._create())}var h=c.prototype=Object.create(a.prototype);h.constructor=c,h._create=function(){this._transn={ingProperties:{},clean:{},onEnd:{}},this.css({position:"absolute"})},h.handleEvent=function(n){var t="on"+n.type;this[t]&&this[t](n)},h.getSize=function(){this.size=m(this.element)},h.css=function(n){var t=this.element.style;for(var e in n){var o=l[e]||e;t[o]=n[e]}},h.getPosition=function(){var n=getComputedStyle(this.element),t=this.layout._getOption("originLeft"),e=this.layout._getOption("originTop"),o=n[t?"left":"right"],x=n[e?"top":"bottom"],b=parseFloat(o),_=parseFloat(x),E=this.layout.size;o.indexOf("%")!=-1&&(b=b/100*E.width),x.indexOf("%")!=-1&&(_=_/100*E.height),b=isNaN(b)?0:b,_=isNaN(_)?0:_,b-=t?E.paddingLeft:E.paddingRight,_-=e?E.paddingTop:E.paddingBottom,this.position.x=b,this.position.y=_},h.layoutPosition=function(){var n=this.layout.size,t={},e=this.layout._getOption("originLeft"),o=this.layout._getOption("originTop"),x=e?"paddingLeft":"paddingRight",b=e?"left":"right",_=e?"right":"left",E=this.position.x+n[x];t[b]=this.getXValue(E),t[_]="";var w=o?"paddingTop":"paddingBottom",k=o?"top":"bottom",L=o?"bottom":"top",S=this.position.y+n[w];t[k]=this.getYValue(S),t[L]="",this.css(t),this.emitEvent("layout",[this])},h.getXValue=function(n){var t=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&!t?n/this.layout.size.width*100+"%":n+"px"},h.getYValue=function(n){var t=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&t?n/this.layout.size.height*100+"%":n+"px"},h._transitionTo=function(n,t){this.getPosition();var e=this.position.x,o=this.position.y,x=n==this.position.x&&t==this.position.y;if(this.setPosition(n,t),x&&!this.isTransitioning){this.layoutPosition();return}var b=n-e,_=t-o,E={};E.transform=this.getTranslate(b,_),this.transition({to:E,onTransitionEnd:{transform:this.layoutPosition},isCleaning:!0})},h.getTranslate=function(n,t){var e=this.layout._getOption("originLeft"),o=this.layout._getOption("originTop");return n=e?n:-n,t=o?t:-t,"translate3d("+n+"px, "+t+"px, 0)"},h.goTo=function(n,t){this.setPosition(n,t),this.layoutPosition()},h.moveTo=h._transitionTo,h.setPosition=function(n,t){this.position.x=parseFloat(n),this.position.y=parseFloat(t)},h._nonTransition=function(n){this.css(n.to),n.isCleaning&&this._removeStyles(n.to);for(var t in n.onTransitionEnd)n.onTransitionEnd[t].call(this)},h.transition=function(n){if(!parseFloat(this.layout.options.transitionDuration)){this._nonTransition(n);return}var t=this._transn;for(var e in n.onTransitionEnd)t.onEnd[e]=n.onTransitionEnd[e];for(e in n.to)t.ingProperties[e]=!0,n.isCleaning&&(t.clean[e]=!0);if(n.from){this.css(n.from);var o=this.element.offsetHeight;o=null}this.enableTransition(n.to),this.css(n.to),this.isTransitioning=!0};function v(n){return n.replace(/([A-Z])/g,function(t){return"-"+t.toLowerCase()})}var i="opacity,"+v(r);h.enableTransition=function(){if(!this.isTransitioning){var n=this.layout.options.transitionDuration;n=typeof n=="number"?n+"ms":n,this.css({transitionProperty:i,transitionDuration:n,transitionDelay:this.staggerDelay||0}),this.element.addEventListener(s,this,!1)}},h.onwebkitTransitionEnd=function(n){this.ontransitionend(n)},h.onotransitionend=function(n){this.ontransitionend(n)};var y={"-webkit-transform":"transform"};h.ontransitionend=function(n){if(n.target===this.element){var t=this._transn,e=y[n.propertyName]||n.propertyName;if(delete t.ingProperties[e],f(t.ingProperties)&&this.disableTransition(),e in t.clean&&(this.element.style[n.propertyName]="",delete t.clean[e]),e in t.onEnd){var o=t.onEnd[e];o.call(this),delete t.onEnd[e]}this.emitEvent("transitionEnd",[this])}},h.disableTransition=function(){this.removeTransitionStyles(),this.element.removeEventListener(s,this,!1),this.isTransitioning=!1},h._removeStyles=function(n){var t={};for(var e in n)t[e]="";this.css(t)};var p={transitionProperty:"",transitionDuration:"",transitionDelay:""};return h.removeTransitionStyles=function(){this.css(p)},h.stagger=function(n){n=isNaN(n)?0:n,this.staggerDelay=n+"ms"},h.removeElem=function(){this.element.parentNode.removeChild(this.element),this.css({display:""}),this.emitEvent("remove",[this])},h.remove=function(){if(!u||!parseFloat(this.layout.options.transitionDuration)){this.removeElem();return}this.once("transitionEnd",function(){this.removeElem()}),this.hide()},h.reveal=function(){delete this.isHidden,this.css({display:""});var n=this.layout.options,t={},e=this.getHideRevealTransitionEndProperty("visibleStyle");t[e]=this.onRevealTransitionEnd,this.transition({from:n.hiddenStyle,to:n.visibleStyle,isCleaning:!0,onTransitionEnd:t})},h.onRevealTransitionEnd=function(){this.isHidden||this.emitEvent("reveal")},h.getHideRevealTransitionEndProperty=function(n){var t=this.layout.options[n];if(t.opacity)return"opacity";for(var e in t)return e},h.hide=function(){this.isHidden=!0,this.css({display:""});var n=this.layout.options,t={},e=this.getHideRevealTransitionEndProperty("hiddenStyle");t[e]=this.onHideTransitionEnd,this.transition({from:n.visibleStyle,to:n.hiddenStyle,isCleaning:!0,onTransitionEnd:t})},h.onHideTransitionEnd=function(){this.isHidden&&(this.css({display:"none"}),this.emitEvent("hide"))},h.destroy=function(){this.css({position:"",left:"",right:"",top:"",bottom:"",transition:"",transform:""})},c})});var G=z((dt,R)=>{(function(g,a){"use strict";typeof define=="function"&&define.amd?define(["ev-emitter/ev-emitter","get-size/get-size","fizzy-ui-utils/utils","./item"],function(m,f,d,u){return a(g,m,f,d,u)}):typeof R=="object"&&R.exports?R.exports=a(g,B(),W(),q(),N()):g.Outlayer=a(g,g.EvEmitter,g.getSize,g.fizzyUIUtils,g.Outlayer.Item)})(window,function(a,m,f,d,u){"use strict";var r=a.console,s=a.jQuery,l=function(){},c=0,h={};function v(t,e){var o=d.getQueryElement(t);if(!o){r&&r.error("Bad element for "+this.constructor.namespace+": "+(o||t));return}this.element=o,s&&(this.$element=s(this.element)),this.options=d.extend({},this.constructor.defaults),this.option(e);var x=++c;this.element.outlayerGUID=x,h[x]=this,this._create();var b=this._getOption("initLayout");b&&this.layout()}v.namespace="outlayer",v.Item=u,v.defaults={containerStyle:{position:"relative"},initLayout:!0,originLeft:!0,originTop:!0,resize:!0,resizeContainer:!0,transitionDuration:"0.4s",hiddenStyle:{opacity:0,transform:"scale(0.001)"},visibleStyle:{opacity:1,transform:"scale(1)"}};var i=v.prototype;d.extend(i,m.prototype),i.option=function(t){d.extend(this.options,t)},i._getOption=function(t){var e=this.constructor.compatOptions[t];return e&&this.options[e]!==void 0?this.options[e]:this.options[t]},v.compatOptions={initLayout:"isInitLayout",horizontal:"isHorizontal",layoutInstant:"isLayoutInstant",originLeft:"isOriginLeft",originTop:"isOriginTop",resize:"isResizeBound",resizeContainer:"isResizingContainer"},i._create=function(){this.reloadItems(),this.stamps=[],this.stamp(this.options.stamp),d.extend(this.element.style,this.options.containerStyle);var t=this._getOption("resize");t&&this.bindResize()},i.reloadItems=function(){this.items=this._itemize(this.element.children)},i._itemize=function(t){for(var e=this._filterFindItemElements(t),o=this.constructor.Item,x=[],b=0;b<e.length;b++){var _=e[b],E=new o(_,this);x.push(E)}return x},i._filterFindItemElements=function(t){return d.filterFindElements(t,this.options.itemSelector)},i.getItemElements=function(){return this.items.map(function(t){return t.element})},i.layout=function(){this._resetLayout(),this._manageStamps();var t=this._getOption("layoutInstant"),e=t!==void 0?t:!this._isLayoutInited;this.layoutItems(this.items,e),this._isLayoutInited=!0},i._init=i.layout,i._resetLayout=function(){this.getSize()},i.getSize=function(){this.size=f(this.element)},i._getMeasurement=function(t,e){var o=this.options[t],x;o?(typeof o=="string"?x=this.element.querySelector(o):o instanceof HTMLElement&&(x=o),this[t]=x?f(x)[e]:o):this[t]=0},i.layoutItems=function(t,e){t=this._getItemsForLayout(t),this._layoutItems(t,e),this._postLayout()},i._getItemsForLayout=function(t){return t.filter(function(e){return!e.isIgnored})},i._layoutItems=function(t,e){if(this._emitCompleteOnItems("layout",t),!(!t||!t.length)){var o=[];t.forEach(function(x){var b=this._getItemLayoutPosition(x);b.item=x,b.isInstant=e||x.isLayoutInstant,o.push(b)},this),this._processLayoutQueue(o)}},i._getItemLayoutPosition=function(){return{x:0,y:0}},i._processLayoutQueue=function(t){this.updateStagger(),t.forEach(function(e,o){this._positionItem(e.item,e.x,e.y,e.isInstant,o)},this)},i.updateStagger=function(){var t=this.options.stagger;if(t==null){this.stagger=0;return}return this.stagger=n(t),this.stagger},i._positionItem=function(t,e,o,x,b){x?t.goTo(e,o):(t.stagger(b*this.stagger),t.moveTo(e,o))},i._postLayout=function(){this.resizeContainer()},i.resizeContainer=function(){var t=this._getOption("resizeContainer");if(t){var e=this._getContainerSize();e&&(this._setContainerMeasure(e.width,!0),this._setContainerMeasure(e.height,!1))}},i._getContainerSize=l,i._setContainerMeasure=function(t,e){if(t!==void 0){var o=this.size;o.isBorderBox&&(t+=e?o.paddingLeft+o.paddingRight+o.borderLeftWidth+o.borderRightWidth:o.paddingBottom+o.paddingTop+o.borderTopWidth+o.borderBottomWidth),t=Math.max(t,0),this.element.style[e?"width":"height"]=t+"px"}},i._emitCompleteOnItems=function(t,e){var o=this;function x(){o.dispatchEvent(t+"Complete",null,[e])}var b=e.length;if(!e||!b){x();return}var _=0;function E(){_++,_==b&&x()}e.forEach(function(w){w.once(t,E)})},i.dispatchEvent=function(t,e,o){var x=e?[e].concat(o):o;if(this.emitEvent(t,x),s)if(this.$element=this.$element||s(this.element),e){var b=s.Event(e);b.type=t,this.$element.trigger(b,o)}else this.$element.trigger(t,o)},i.ignore=function(t){var e=this.getItem(t);e&&(e.isIgnored=!0)},i.unignore=function(t){var e=this.getItem(t);e&&delete e.isIgnored},i.stamp=function(t){t=this._find(t),t&&(this.stamps=this.stamps.concat(t),t.forEach(this.ignore,this))},i.unstamp=function(t){t=this._find(t),t&&t.forEach(function(e){d.removeFrom(this.stamps,e),this.unignore(e)},this)},i._find=function(t){if(t)return typeof t=="string"&&(t=this.element.querySelectorAll(t)),t=d.makeArray(t),t},i._manageStamps=function(){!this.stamps||!this.stamps.length||(this._getBoundingRect(),this.stamps.forEach(this._manageStamp,this))},i._getBoundingRect=function(){var t=this.element.getBoundingClientRect(),e=this.size;this._boundingRect={left:t.left+e.paddingLeft+e.borderLeftWidth,top:t.top+e.paddingTop+e.borderTopWidth,right:t.right-(e.paddingRight+e.borderRightWidth),bottom:t.bottom-(e.paddingBottom+e.borderBottomWidth)}},i._manageStamp=l,i._getElementOffset=function(t){var e=t.getBoundingClientRect(),o=this._boundingRect,x=f(t),b={left:e.left-o.left-x.marginLeft,top:e.top-o.top-x.marginTop,right:o.right-e.right-x.marginRight,bottom:o.bottom-e.bottom-x.marginBottom};return b},i.handleEvent=d.handleEvent,i.bindResize=function(){a.addEventListener("resize",this),this.isResizeBound=!0},i.unbindResize=function(){a.removeEventListener("resize",this),this.isResizeBound=!1},i.onresize=function(){this.resize()},d.debounceMethod(v,"onresize",100),i.resize=function(){!this.isResizeBound||!this.needsResizeLayout()||this.layout()},i.needsResizeLayout=function(){var t=f(this.element),e=this.size&&t;return e&&t.innerWidth!==this.size.innerWidth},i.addItems=function(t){var e=this._itemize(t);return e.length&&(this.items=this.items.concat(e)),e},i.appended=function(t){var e=this.addItems(t);e.length&&(this.layoutItems(e,!0),this.reveal(e))},i.prepended=function(t){var e=this._itemize(t);if(e.length){var o=this.items.slice(0);this.items=e.concat(o),this._resetLayout(),this._manageStamps(),this.layoutItems(e,!0),this.reveal(e),this.layoutItems(o)}},i.reveal=function(t){if(this._emitCompleteOnItems("reveal",t),!(!t||!t.length)){var e=this.updateStagger();t.forEach(function(o,x){o.stagger(x*e),o.reveal()})}},i.hide=function(t){if(this._emitCompleteOnItems("hide",t),!(!t||!t.length)){var e=this.updateStagger();t.forEach(function(o,x){o.stagger(x*e),o.hide()})}},i.revealItemElements=function(t){var e=this.getItems(t);this.reveal(e)},i.hideItemElements=function(t){var e=this.getItems(t);this.hide(e)},i.getItem=function(t){for(var e=0;e<this.items.length;e++){var o=this.items[e];if(o.element==t)return o}},i.getItems=function(t){t=d.makeArray(t);var e=[];return t.forEach(function(o){var x=this.getItem(o);x&&e.push(x)},this),e},i.remove=function(t){var e=this.getItems(t);this._emitCompleteOnItems("remove",e),!(!e||!e.length)&&e.forEach(function(o){o.remove(),d.removeFrom(this.items,o)},this)},i.destroy=function(){var t=this.element.style;t.height="",t.position="",t.width="",this.items.forEach(function(o){o.destroy()}),this.unbindResize();var e=this.element.outlayerGUID;delete h[e],delete this.element.outlayerGUID,s&&s.removeData(this.element,this.constructor.namespace)},v.data=function(t){t=d.getQueryElement(t);var e=t&&t.outlayerGUID;return e&&h[e]},v.create=function(t,e){var o=y(v);return o.defaults=d.extend({},v.defaults),d.extend(o.defaults,e),o.compatOptions=d.extend({},v.compatOptions),o.namespace=t,o.data=v.data,o.Item=y(u),d.htmlInit(o,t),s&&s.bridget&&s.bridget(t,o),o};function y(t){function e(){t.apply(this,arguments)}return e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e}var p={ms:1,s:1e3};function n(t){if(typeof t=="number")return t;var e=t.match(/(^\d*\.?\d*)(\w*)/),o=e&&e[1],x=e&&e[2];if(!o.length)return 0;o=parseFloat(o);var b=p[x]||1;return o*b}return v.Item=u,v})});var U=z((ut,H)=>{(function(g,a){typeof define=="function"&&define.amd?define(["outlayer/outlayer","get-size/get-size"],a):typeof H=="object"&&H.exports?H.exports=a(G(),W()):g.Masonry=a(g.Outlayer,g.getSize)})(window,function(a,m){"use strict";var f=a.create("masonry");f.compatOptions.fitWidth="isFitWidth";var d=f.prototype;return d._resetLayout=function(){this.getSize(),this._getMeasurement("columnWidth","outerWidth"),this._getMeasurement("gutter","outerWidth"),this.measureColumns(),this.colYs=[];for(var u=0;u<this.cols;u++)this.colYs.push(0);this.maxY=0,this.horizontalColIndex=0},d.measureColumns=function(){if(this.getContainerWidth(),!this.columnWidth){var u=this.items[0],r=u&&u.element;this.columnWidth=r&&m(r).outerWidth||this.containerWidth}var s=this.columnWidth+=this.gutter,l=this.containerWidth+this.gutter,c=l/s,h=s-l%s,v=h&&h<1?"round":"floor";c=Math[v](c),this.cols=Math.max(c,1)},d.getContainerWidth=function(){var u=this._getOption("fitWidth"),r=u?this.element.parentNode:this.element,s=m(r);this.containerWidth=s&&s.innerWidth},d._getItemLayoutPosition=function(u){u.getSize();var r=u.size.outerWidth%this.columnWidth,s=r&&r<1?"round":"ceil",l=Math[s](u.size.outerWidth/this.columnWidth);l=Math.min(l,this.cols);for(var c=this.options.horizontalOrder?"_getHorizontalColPosition":"_getTopColPosition",h=this[c](l,u),v={x:this.columnWidth*h.col,y:h.y},i=h.y+u.size.outerHeight,y=l+h.col,p=h.col;p<y;p++)this.colYs[p]=i;return v},d._getTopColPosition=function(u){var r=this._getTopColGroup(u),s=Math.min.apply(Math,r);return{col:r.indexOf(s),y:s}},d._getTopColGroup=function(u){if(u<2)return this.colYs;for(var r=[],s=this.cols+1-u,l=0;l<s;l++)r[l]=this._getColGroupY(l,u);return r},d._getColGroupY=function(u,r){if(r<2)return this.colYs[u];var s=this.colYs.slice(u,u+r);return Math.max.apply(Math,s)},d._getHorizontalColPosition=function(u,r){var s=this.horizontalColIndex%this.cols,l=u>1&&s+u>this.cols;s=l?0:s;var c=r.size.outerWidth&&r.size.outerHeight;return this.horizontalColIndex=c?s+u:this.horizontalColIndex,{col:s,y:this._getColGroupY(s,u)}},d._manageStamp=function(u){var r=m(u),s=this._getElementOffset(u),l=this._getOption("originLeft"),c=l?s.left:s.right,h=c+r.outerWidth,v=Math.floor(c/this.columnWidth);v=Math.max(0,v);var i=Math.floor(h/this.columnWidth);i-=h%this.columnWidth?0:1,i=Math.min(this.cols-1,i);for(var y=this._getOption("originTop"),p=(y?s.top:s.bottom)+r.outerHeight,n=v;n<=i;n++)this.colYs[n]=Math.max(p,this.colYs[n])},d._getContainerSize=function(){this.maxY=Math.max.apply(Math,this.colYs);var u={height:this.maxY};return this._getOption("fitWidth")&&(u.width=this._getContainerFitWidth()),u},d._getContainerFitWidth=function(){for(var u=0,r=this.cols;--r&&this.colYs[r]===0;)u++;return(this.cols-u)*this.columnWidth-this.gutter},d.needsResizeLayout=function(){var u=this.containerWidth;return this.getContainerWidth(),u!=this.containerWidth},f})});var V=et(U());var lt=new DOMParser;function T(g){let a=document.createElement("div");return a.innerHTML=g,a.firstElementChild}function D(g,a="vertical",m,f){m=m||0,f=f||"visible";let d=g.getBoundingClientRect();if(a=="vertical"){let u=Math.max(document.documentElement.clientHeight,window.innerHeight),r=d.bottom-m<0,s=d.top-u+m>=0;return f==="above"?r:f==="below"?s:!r&&!s}else if(a=="horizontal"){let u=Math.max(document.documentElement.clientWidth,window.innerWidth),r=d.right-m<0,s=d.left-u+m>=0;return f==="above"?r:f==="below"?s:!r&&!s}else return!1}var it=`.pu--masonry-grid {
  position: fixed !important;
  z-index: 99999999 !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  overflow: auto;
  overflow-x: hidden;
  pointer-events: all;
  background: #0a0a0a;
  padding: 8px;
}
.pu--masonry-grid .grid-item {
  pointer-events: all;
  width: calc(20vw - 12px);
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: #181818;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.pu--masonry-grid .grid-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
}
.pu--masonry-grid .grid-item .grid-item-link {
  display: block;
  line-height: 0;
  cursor: pointer;
}
.pu--masonry-grid .grid-item .grid-item-link img {
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
}
.pu--masonry-grid .grid-item .grid-item-info {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  gap: 6px;
  min-height: 36px;
}
.pu--masonry-grid .grid-item .grid-item-info .grid-item-like {
  flex-shrink: 0;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  transition: background 0.15s;
}
.pu--masonry-grid .grid-item .grid-item-info .grid-item-like svg {
  fill: #555;
  transition: fill 0.15s;
}
.pu--masonry-grid .grid-item .grid-item-info .grid-item-like:hover {
  background: rgba(255, 255, 255, 0.08);
}
.pu--masonry-grid .grid-item .grid-item-info .grid-item-like:hover svg {
  fill: #e74c3c;
}
.pu--masonry-grid .grid-item .grid-item-info .grid-item-like.bookmarked svg {
  fill: #e74c3c;
}
.pu--masonry-grid .grid-item .grid-item-info .grid-item-like.busy {
  opacity: 0.4;
  pointer-events: none;
}
.pu--masonry-grid .grid-item .grid-item-info .grid-item-title {
  flex: 1;
  color: #e0e0e0;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.3;
}
.pu--masonry-grid .grid-item .grid-item-info .grid-item-title:hover {
  color: #58a6ff;
}
.pu--masonry-grid .grid-item .grid-item-info .grid-item-badge {
  flex-shrink: 0;
  background: rgba(0, 150, 250, 0.15);
  color: #58a6ff;
  border: none;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  line-height: 1.3;
}
.pu--masonry-grid .grid-item.expanded {
  outline: 2px solid #0096fa;
}
.pu--masonry-grid .grid-item.expanded .grid-item-badge {
  background: rgba(231, 76, 60, 0.15);
  color: #e74c3c;
}
.pu--masonry-grid .grid-item.loading {
  opacity: 0.7;
  pointer-events: none;
}
.pu--masonry-grid .grid-item.grid-item-extra .extra-page-label {
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  pointer-events: none;
  z-index: 1;
}
.pu--masonry-grid .grid-item.grid-item-extra img {
  width: 100%;
  height: auto;
  display: block;
}
.pu--masonry-grid .infinite-scroll-trigger {
  width: 100%;
  height: 100px;
}`;document.head.appendChild(document.createElement("style")).appendChild(document.createTextNode(it));async function nt(){if(!["/bookmark_new_illust.php","/bookmark_new_illust_r18.php","/discovery"].includes(window.location.pathname))return;let a=T(`
    <div class="pu--masonry-grid">
      <div class="infinite-scroll-trigger"></div>
    </div>  
  `);document.body.appendChild(a),document.querySelectorAll("body > *:not(.pu--masonry-grid)").forEach(l=>l.remove());let m=new V.default(a,{itemSelector:".grid-item",fitWidth:!0,stagger:0,transitionDuration:0});async function f(l){return(await fetch(`https://www.pixiv.net/ajax/illust/${l}/pages?lang=en`).then(h=>h.json())).body}function d(l){let c=document.createElement("div");return c.textContent=l,c.innerHTML}async function u(l,c){let h=c.classList.contains("bookmarked");c.classList.add("busy");try{if(h){let i=(await fetch(`https://www.pixiv.net/ajax/illust/${l}?lang=en`).then(y=>y.json())).body?.bookmarkData?.id;i&&await fetch("https://www.pixiv.net/ajax/illusts/bookmarks/delete",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:`bookmark_id=${i}`,credentials:"same-origin"}),c.classList.remove("bookmarked")}else await fetch("https://www.pixiv.net/ajax/illusts/bookmarks/add",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({illust_id:l,restrict:0,comment:"",tags:[]}),credentials:"same-origin"}),c.classList.add("bookmarked")}catch(v){console.error("Bookmark toggle failed",l,v)}finally{c.classList.remove("busy")}}async function r(l,c){if(l.classList.contains("expanded")){a.querySelectorAll(`.grid-item-extra[data-parent-id="${c}"]`).forEach(v=>{m.remove(v),v.remove()}),l.classList.remove("expanded"),m.layout();return}l.classList.add("expanded","loading");try{let h=await f(c),v=[],i=l;for(let y=1;y<h.length;y++){let p=T(`
          <a class="grid-item grid-item-extra" data-parent-id="${c}" href="/en/artworks/${c}">
            <span class="extra-page-label">${y+1} / ${h.length}</span>
          </a>
        `),n=new Image;v.push({elm:p,img:n,src:h[y].urls.regular})}for(let{elm:y,img:p,src:n}of v)await new Promise(t=>{p.onload=()=>{y.prepend(p),i.after(y),i=y,m.reloadItems(),m.layout(),t()},p.onerror=t,p.src=n})}catch(h){console.error("Failed to load pages for",c,h)}finally{l.classList.remove("loading")}}async function s(l){await Promise.all(l.map(c=>new Promise(async h=>{let v=c.urls["1200x1200"],i=c.pageCount||1,y=c.title||"",p=new Image,n=T(`
            <div class="grid-item${i>1?" has-multiple":""}" data-id="${c.id}">
            </div>
          `),t=document.createElement("div");t.className="grid-item-link",n.appendChild(t);let e=T(`
            <div class="grid-item-info">
              <button class="grid-item-like${c.bookmarkData?" bookmarked":""}" type="button" title="Like">
                <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              </button>
              <a class="grid-item-title" href="/en/artworks/${c.id}" target="_blank" rel="noopener">${d(y)}</a>
              ${i>1?`<span class="grid-item-badge">${i}P</span>`:""}
            </div>
          `);n.appendChild(e),e.querySelector(".grid-item-like").addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),u(c.id,o.currentTarget)}),t.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),i>1?r(n,c.id):window.open(`/en/artworks/${c.id}`,"_blank")}),p.onload=()=>{t.appendChild(p),a.appendChild(n),m.appended(n),m.layout(),h()},p.onerror=()=>{h()},p.src=v})))}switch(window.location.pathname){case"/bookmark_new_illust.php":case"/bookmark_new_illust_r18.php":{let l=0;async function c(){let v=window.location.pathname==="/bookmark_new_illust_r18.php"?"r18":"all",i=await fetch(`https://www.pixiv.net/ajax/follow_latest/illust?p=${l}&mode=${v}&lang=en`).then(y=>y.json());await s(i.body.thumbnails.illust),console.log("Loaded page",l)}let h=!1;setInterval(async()=>{D(a.children.item(a.children.length-5)||a.lastElementChild,"vertical",50)&&(h||(l++,h=!0,await c(),h=!1,console.log("Loading next page",l)))},1e3);break}case"/discovery":{async function l(){let h=new URLSearchParams(window.location.search).get("mode")||"all",v=await fetch(`https://www.pixiv.net/ajax/discovery/artworks?mode=${h}&limit=60&lang=en`).then(i=>i.json());await s(v.body.thumbnails.illust),console.log("Loaded page")}let c=!1;setInterval(async()=>{D(a.children.item(a.children.length-5)||a.lastElementChild,"vertical",50)&&(c||(c=!0,await l(),c=!1,console.log("Loading next page",lastPageNumber)))},1e3);break}}}nt();})();
/*! Bundled license information:

get-size/get-size.js:
  (*!
   * getSize v2.0.3
   * measure size of elements
   * MIT license
   *)

outlayer/outlayer.js:
  (*!
   * Outlayer v2.1.1
   * the brains and guts of a layout library
   * MIT license
   *)

masonry-layout/masonry.js:
  (*!
   * Masonry v4.2.2
   * Cascading grid layout library
   * https://masonry.desandro.com
   * MIT License
   * by David DeSandro
   *)
*/
