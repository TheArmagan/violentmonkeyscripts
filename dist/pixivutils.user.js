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
// @description 2026-02-15T03:47:55.159Z
// ==/UserScript==
(()=>{var Q=Object.create;var F=Object.defineProperty;var X=Object.getOwnPropertyDescriptor;var J=Object.getOwnPropertyNames;var Z=Object.getPrototypeOf,K=Object.prototype.hasOwnProperty;var z=(c,a)=>()=>(a||c((a={exports:{}}).exports,a),a.exports);var tt=(c,a,m,f)=>{if(a&&typeof a=="object"||typeof a=="function")for(let h of J(a))!K.call(c,h)&&h!==m&&F(c,h,{get:()=>a[h],enumerable:!(f=X(a,h))||f.enumerable});return c};var et=(c,a,m)=>(m=c!=null?Q(Z(c)):{},tt(a||!c||!c.__esModule?F(m,"default",{value:c,enumerable:!0}):m,c));var B=z((Y,C)=>{(function(c,a){typeof define=="function"&&define.amd?define(a):typeof C=="object"&&C.exports?C.exports=a():c.EvEmitter=a()})(typeof window<"u"?window:Y,function(){"use strict";function c(){}var a=c.prototype;return a.on=function(m,f){if(!(!m||!f)){var h=this._events=this._events||{},d=h[m]=h[m]||[];return d.indexOf(f)==-1&&d.push(f),this}},a.once=function(m,f){if(!(!m||!f)){this.on(m,f);var h=this._onceEvents=this._onceEvents||{},d=h[m]=h[m]||{};return d[f]=!0,this}},a.off=function(m,f){var h=this._events&&this._events[m];if(!(!h||!h.length)){var d=h.indexOf(f);return d!=-1&&h.splice(d,1),this}},a.emitEvent=function(m,f){var h=this._events&&this._events[m];if(!(!h||!h.length)){h=h.slice(0),f=f||[];for(var d=this._onceEvents&&this._onceEvents[m],s=0;s<h.length;s++){var i=h[s],u=d&&d[i];u&&(this.off(m,i),delete d[i]),i.apply(this,f)}return this}},a.allOff=function(){delete this._events,delete this._onceEvents},c})});var W=z((rt,I)=>{(function(c,a){typeof define=="function"&&define.amd?define(a):typeof I=="object"&&I.exports?I.exports=a():c.getSize=a()})(window,function(){"use strict";function a(n){var x=parseFloat(n),p=n.indexOf("%")==-1&&!isNaN(x);return p&&x}function m(){}var f=typeof console>"u"?m:function(n){console.error(n)},h=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"],d=h.length;function s(){for(var n={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},x=0;x<d;x++){var p=h[x];n[p]=0}return n}function i(n){var x=getComputedStyle(n);return x||f("Style returned "+x+". Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1"),x}var u=!1,g;function l(){if(!u){u=!0;var n=document.createElement("div");n.style.width="200px",n.style.padding="1px 2px 3px 4px",n.style.borderStyle="solid",n.style.borderWidth="1px 2px 3px 4px",n.style.boxSizing="border-box";var x=document.body||document.documentElement;x.appendChild(n);var p=i(n);g=Math.round(a(p.width))==200,v.isBoxSizeOuter=g,x.removeChild(n)}}function v(n){if(l(),typeof n=="string"&&(n=document.querySelector(n)),!(!n||typeof n!="object"||!n.nodeType)){var x=i(n);if(x.display=="none")return s();var p={};p.width=n.offsetWidth,p.height=n.offsetHeight;for(var o=p.isBorderBox=x.boxSizing=="border-box",t=0;t<d;t++){var e=h[t],r=x[e],y=parseFloat(r);p[e]=isNaN(y)?0:y}var b=p.paddingLeft+p.paddingRight,_=p.paddingTop+p.paddingBottom,E=p.marginLeft+p.marginRight,w=p.marginTop+p.marginBottom,L=p.borderLeftWidth+p.borderRightWidth,k=p.borderTopWidth+p.borderBottomWidth,S=o&&g,A=a(x.width);A!==!1&&(p.width=A+(S?0:b+L));var j=a(x.height);return j!==!1&&(p.height=j+(S?0:_+k)),p.innerWidth=p.width-(b+L),p.innerHeight=p.height-(_+k),p.outerWidth=p.width+E,p.outerHeight=p.height+w,p}}return v})});var $=z((st,O)=>{(function(c,a){"use strict";typeof define=="function"&&define.amd?define(a):typeof O=="object"&&O.exports?O.exports=a():c.matchesSelector=a()})(window,function(){"use strict";var a=function(){var m=window.Element.prototype;if(m.matches)return"matches";if(m.matchesSelector)return"matchesSelector";for(var f=["webkit","moz","ms","o"],h=0;h<f.length;h++){var d=f[h],s=d+"MatchesSelector";if(m[s])return s}}();return function(f,h){return f[a](h)}})});var q=z((at,P)=>{(function(c,a){typeof define=="function"&&define.amd?define(["desandro-matches-selector/matches-selector"],function(m){return a(c,m)}):typeof P=="object"&&P.exports?P.exports=a(c,$()):c.fizzyUIUtils=a(c,c.matchesSelector)})(window,function(a,m){"use strict";var f={};f.extend=function(s,i){for(var u in i)s[u]=i[u];return s},f.modulo=function(s,i){return(s%i+i)%i};var h=Array.prototype.slice;f.makeArray=function(s){if(Array.isArray(s))return s;if(s==null)return[];var i=typeof s=="object"&&typeof s.length=="number";return i?h.call(s):[s]},f.removeFrom=function(s,i){var u=s.indexOf(i);u!=-1&&s.splice(u,1)},f.getParent=function(s,i){for(;s.parentNode&&s!=document.body;)if(s=s.parentNode,m(s,i))return s},f.getQueryElement=function(s){return typeof s=="string"?document.querySelector(s):s},f.handleEvent=function(s){var i="on"+s.type;this[i]&&this[i](s)},f.filterFindElements=function(s,i){s=f.makeArray(s);var u=[];return s.forEach(function(g){if(g instanceof HTMLElement){if(!i){u.push(g);return}m(g,i)&&u.push(g);for(var l=g.querySelectorAll(i),v=0;v<l.length;v++)u.push(l[v])}}),u},f.debounceMethod=function(s,i,u){u=u||100;var g=s.prototype[i],l=i+"Timeout";s.prototype[i]=function(){var v=this[l];clearTimeout(v);var n=arguments,x=this;this[l]=setTimeout(function(){g.apply(x,n),delete x[l]},u)}},f.docReady=function(s){var i=document.readyState;i=="complete"||i=="interactive"?setTimeout(s):document.addEventListener("DOMContentLoaded",s)},f.toDashed=function(s){return s.replace(/(.)([A-Z])/g,function(i,u,g){return u+"-"+g}).toLowerCase()};var d=a.console;return f.htmlInit=function(s,i){f.docReady(function(){var u=f.toDashed(i),g="data-"+u,l=document.querySelectorAll("["+g+"]"),v=document.querySelectorAll(".js-"+u),n=f.makeArray(l).concat(f.makeArray(v)),x=g+"-options",p=a.jQuery;n.forEach(function(o){var t=o.getAttribute(g)||o.getAttribute(x),e;try{e=t&&JSON.parse(t)}catch(y){d&&d.error("Error parsing "+g+" on "+o.className+": "+y);return}var r=new s(o,e);p&&p.data(o,i,r)})})},f})});var N=z((ht,M)=>{(function(c,a){typeof define=="function"&&define.amd?define(["ev-emitter/ev-emitter","get-size/get-size"],a):typeof M=="object"&&M.exports?M.exports=a(B(),W()):(c.Outlayer={},c.Outlayer.Item=a(c.EvEmitter,c.getSize))})(window,function(a,m){"use strict";function f(o){for(var t in o)return!1;return t=null,!0}var h=document.documentElement.style,d=typeof h.transition=="string"?"transition":"WebkitTransition",s=typeof h.transform=="string"?"transform":"WebkitTransform",i={WebkitTransition:"webkitTransitionEnd",transition:"transitionend"}[d],u={transform:s,transition:d,transitionDuration:d+"Duration",transitionProperty:d+"Property",transitionDelay:d+"Delay"};function g(o,t){o&&(this.element=o,this.layout=t,this.position={x:0,y:0},this._create())}var l=g.prototype=Object.create(a.prototype);l.constructor=g,l._create=function(){this._transn={ingProperties:{},clean:{},onEnd:{}},this.css({position:"absolute"})},l.handleEvent=function(o){var t="on"+o.type;this[t]&&this[t](o)},l.getSize=function(){this.size=m(this.element)},l.css=function(o){var t=this.element.style;for(var e in o){var r=u[e]||e;t[r]=o[e]}},l.getPosition=function(){var o=getComputedStyle(this.element),t=this.layout._getOption("originLeft"),e=this.layout._getOption("originTop"),r=o[t?"left":"right"],y=o[e?"top":"bottom"],b=parseFloat(r),_=parseFloat(y),E=this.layout.size;r.indexOf("%")!=-1&&(b=b/100*E.width),y.indexOf("%")!=-1&&(_=_/100*E.height),b=isNaN(b)?0:b,_=isNaN(_)?0:_,b-=t?E.paddingLeft:E.paddingRight,_-=e?E.paddingTop:E.paddingBottom,this.position.x=b,this.position.y=_},l.layoutPosition=function(){var o=this.layout.size,t={},e=this.layout._getOption("originLeft"),r=this.layout._getOption("originTop"),y=e?"paddingLeft":"paddingRight",b=e?"left":"right",_=e?"right":"left",E=this.position.x+o[y];t[b]=this.getXValue(E),t[_]="";var w=r?"paddingTop":"paddingBottom",L=r?"top":"bottom",k=r?"bottom":"top",S=this.position.y+o[w];t[L]=this.getYValue(S),t[k]="",this.css(t),this.emitEvent("layout",[this])},l.getXValue=function(o){var t=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&!t?o/this.layout.size.width*100+"%":o+"px"},l.getYValue=function(o){var t=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&t?o/this.layout.size.height*100+"%":o+"px"},l._transitionTo=function(o,t){this.getPosition();var e=this.position.x,r=this.position.y,y=o==this.position.x&&t==this.position.y;if(this.setPosition(o,t),y&&!this.isTransitioning){this.layoutPosition();return}var b=o-e,_=t-r,E={};E.transform=this.getTranslate(b,_),this.transition({to:E,onTransitionEnd:{transform:this.layoutPosition},isCleaning:!0})},l.getTranslate=function(o,t){var e=this.layout._getOption("originLeft"),r=this.layout._getOption("originTop");return o=e?o:-o,t=r?t:-t,"translate3d("+o+"px, "+t+"px, 0)"},l.goTo=function(o,t){this.setPosition(o,t),this.layoutPosition()},l.moveTo=l._transitionTo,l.setPosition=function(o,t){this.position.x=parseFloat(o),this.position.y=parseFloat(t)},l._nonTransition=function(o){this.css(o.to),o.isCleaning&&this._removeStyles(o.to);for(var t in o.onTransitionEnd)o.onTransitionEnd[t].call(this)},l.transition=function(o){if(!parseFloat(this.layout.options.transitionDuration)){this._nonTransition(o);return}var t=this._transn;for(var e in o.onTransitionEnd)t.onEnd[e]=o.onTransitionEnd[e];for(e in o.to)t.ingProperties[e]=!0,o.isCleaning&&(t.clean[e]=!0);if(o.from){this.css(o.from);var r=this.element.offsetHeight;r=null}this.enableTransition(o.to),this.css(o.to),this.isTransitioning=!0};function v(o){return o.replace(/([A-Z])/g,function(t){return"-"+t.toLowerCase()})}var n="opacity,"+v(s);l.enableTransition=function(){if(!this.isTransitioning){var o=this.layout.options.transitionDuration;o=typeof o=="number"?o+"ms":o,this.css({transitionProperty:n,transitionDuration:o,transitionDelay:this.staggerDelay||0}),this.element.addEventListener(i,this,!1)}},l.onwebkitTransitionEnd=function(o){this.ontransitionend(o)},l.onotransitionend=function(o){this.ontransitionend(o)};var x={"-webkit-transform":"transform"};l.ontransitionend=function(o){if(o.target===this.element){var t=this._transn,e=x[o.propertyName]||o.propertyName;if(delete t.ingProperties[e],f(t.ingProperties)&&this.disableTransition(),e in t.clean&&(this.element.style[o.propertyName]="",delete t.clean[e]),e in t.onEnd){var r=t.onEnd[e];r.call(this),delete t.onEnd[e]}this.emitEvent("transitionEnd",[this])}},l.disableTransition=function(){this.removeTransitionStyles(),this.element.removeEventListener(i,this,!1),this.isTransitioning=!1},l._removeStyles=function(o){var t={};for(var e in o)t[e]="";this.css(t)};var p={transitionProperty:"",transitionDuration:"",transitionDelay:""};return l.removeTransitionStyles=function(){this.css(p)},l.stagger=function(o){o=isNaN(o)?0:o,this.staggerDelay=o+"ms"},l.removeElem=function(){this.element.parentNode.removeChild(this.element),this.css({display:""}),this.emitEvent("remove",[this])},l.remove=function(){if(!d||!parseFloat(this.layout.options.transitionDuration)){this.removeElem();return}this.once("transitionEnd",function(){this.removeElem()}),this.hide()},l.reveal=function(){delete this.isHidden,this.css({display:""});var o=this.layout.options,t={},e=this.getHideRevealTransitionEndProperty("visibleStyle");t[e]=this.onRevealTransitionEnd,this.transition({from:o.hiddenStyle,to:o.visibleStyle,isCleaning:!0,onTransitionEnd:t})},l.onRevealTransitionEnd=function(){this.isHidden||this.emitEvent("reveal")},l.getHideRevealTransitionEndProperty=function(o){var t=this.layout.options[o];if(t.opacity)return"opacity";for(var e in t)return e},l.hide=function(){this.isHidden=!0,this.css({display:""});var o=this.layout.options,t={},e=this.getHideRevealTransitionEndProperty("hiddenStyle");t[e]=this.onHideTransitionEnd,this.transition({from:o.visibleStyle,to:o.hiddenStyle,isCleaning:!0,onTransitionEnd:t})},l.onHideTransitionEnd=function(){this.isHidden&&(this.css({display:"none"}),this.emitEvent("hide"))},l.destroy=function(){this.css({position:"",left:"",right:"",top:"",bottom:"",transition:"",transform:""})},g})});var G=z((dt,R)=>{(function(c,a){"use strict";typeof define=="function"&&define.amd?define(["ev-emitter/ev-emitter","get-size/get-size","fizzy-ui-utils/utils","./item"],function(m,f,h,d){return a(c,m,f,h,d)}):typeof R=="object"&&R.exports?R.exports=a(c,B(),W(),q(),N()):c.Outlayer=a(c,c.EvEmitter,c.getSize,c.fizzyUIUtils,c.Outlayer.Item)})(window,function(a,m,f,h,d){"use strict";var s=a.console,i=a.jQuery,u=function(){},g=0,l={};function v(t,e){var r=h.getQueryElement(t);if(!r){s&&s.error("Bad element for "+this.constructor.namespace+": "+(r||t));return}this.element=r,i&&(this.$element=i(this.element)),this.options=h.extend({},this.constructor.defaults),this.option(e);var y=++g;this.element.outlayerGUID=y,l[y]=this,this._create();var b=this._getOption("initLayout");b&&this.layout()}v.namespace="outlayer",v.Item=d,v.defaults={containerStyle:{position:"relative"},initLayout:!0,originLeft:!0,originTop:!0,resize:!0,resizeContainer:!0,transitionDuration:"0.4s",hiddenStyle:{opacity:0,transform:"scale(0.001)"},visibleStyle:{opacity:1,transform:"scale(1)"}};var n=v.prototype;h.extend(n,m.prototype),n.option=function(t){h.extend(this.options,t)},n._getOption=function(t){var e=this.constructor.compatOptions[t];return e&&this.options[e]!==void 0?this.options[e]:this.options[t]},v.compatOptions={initLayout:"isInitLayout",horizontal:"isHorizontal",layoutInstant:"isLayoutInstant",originLeft:"isOriginLeft",originTop:"isOriginTop",resize:"isResizeBound",resizeContainer:"isResizingContainer"},n._create=function(){this.reloadItems(),this.stamps=[],this.stamp(this.options.stamp),h.extend(this.element.style,this.options.containerStyle);var t=this._getOption("resize");t&&this.bindResize()},n.reloadItems=function(){this.items=this._itemize(this.element.children)},n._itemize=function(t){for(var e=this._filterFindItemElements(t),r=this.constructor.Item,y=[],b=0;b<e.length;b++){var _=e[b],E=new r(_,this);y.push(E)}return y},n._filterFindItemElements=function(t){return h.filterFindElements(t,this.options.itemSelector)},n.getItemElements=function(){return this.items.map(function(t){return t.element})},n.layout=function(){this._resetLayout(),this._manageStamps();var t=this._getOption("layoutInstant"),e=t!==void 0?t:!this._isLayoutInited;this.layoutItems(this.items,e),this._isLayoutInited=!0},n._init=n.layout,n._resetLayout=function(){this.getSize()},n.getSize=function(){this.size=f(this.element)},n._getMeasurement=function(t,e){var r=this.options[t],y;r?(typeof r=="string"?y=this.element.querySelector(r):r instanceof HTMLElement&&(y=r),this[t]=y?f(y)[e]:r):this[t]=0},n.layoutItems=function(t,e){t=this._getItemsForLayout(t),this._layoutItems(t,e),this._postLayout()},n._getItemsForLayout=function(t){return t.filter(function(e){return!e.isIgnored})},n._layoutItems=function(t,e){if(this._emitCompleteOnItems("layout",t),!(!t||!t.length)){var r=[];t.forEach(function(y){var b=this._getItemLayoutPosition(y);b.item=y,b.isInstant=e||y.isLayoutInstant,r.push(b)},this),this._processLayoutQueue(r)}},n._getItemLayoutPosition=function(){return{x:0,y:0}},n._processLayoutQueue=function(t){this.updateStagger(),t.forEach(function(e,r){this._positionItem(e.item,e.x,e.y,e.isInstant,r)},this)},n.updateStagger=function(){var t=this.options.stagger;if(t==null){this.stagger=0;return}return this.stagger=o(t),this.stagger},n._positionItem=function(t,e,r,y,b){y?t.goTo(e,r):(t.stagger(b*this.stagger),t.moveTo(e,r))},n._postLayout=function(){this.resizeContainer()},n.resizeContainer=function(){var t=this._getOption("resizeContainer");if(t){var e=this._getContainerSize();e&&(this._setContainerMeasure(e.width,!0),this._setContainerMeasure(e.height,!1))}},n._getContainerSize=u,n._setContainerMeasure=function(t,e){if(t!==void 0){var r=this.size;r.isBorderBox&&(t+=e?r.paddingLeft+r.paddingRight+r.borderLeftWidth+r.borderRightWidth:r.paddingBottom+r.paddingTop+r.borderTopWidth+r.borderBottomWidth),t=Math.max(t,0),this.element.style[e?"width":"height"]=t+"px"}},n._emitCompleteOnItems=function(t,e){var r=this;function y(){r.dispatchEvent(t+"Complete",null,[e])}var b=e.length;if(!e||!b){y();return}var _=0;function E(){_++,_==b&&y()}e.forEach(function(w){w.once(t,E)})},n.dispatchEvent=function(t,e,r){var y=e?[e].concat(r):r;if(this.emitEvent(t,y),i)if(this.$element=this.$element||i(this.element),e){var b=i.Event(e);b.type=t,this.$element.trigger(b,r)}else this.$element.trigger(t,r)},n.ignore=function(t){var e=this.getItem(t);e&&(e.isIgnored=!0)},n.unignore=function(t){var e=this.getItem(t);e&&delete e.isIgnored},n.stamp=function(t){t=this._find(t),t&&(this.stamps=this.stamps.concat(t),t.forEach(this.ignore,this))},n.unstamp=function(t){t=this._find(t),t&&t.forEach(function(e){h.removeFrom(this.stamps,e),this.unignore(e)},this)},n._find=function(t){if(t)return typeof t=="string"&&(t=this.element.querySelectorAll(t)),t=h.makeArray(t),t},n._manageStamps=function(){!this.stamps||!this.stamps.length||(this._getBoundingRect(),this.stamps.forEach(this._manageStamp,this))},n._getBoundingRect=function(){var t=this.element.getBoundingClientRect(),e=this.size;this._boundingRect={left:t.left+e.paddingLeft+e.borderLeftWidth,top:t.top+e.paddingTop+e.borderTopWidth,right:t.right-(e.paddingRight+e.borderRightWidth),bottom:t.bottom-(e.paddingBottom+e.borderBottomWidth)}},n._manageStamp=u,n._getElementOffset=function(t){var e=t.getBoundingClientRect(),r=this._boundingRect,y=f(t),b={left:e.left-r.left-y.marginLeft,top:e.top-r.top-y.marginTop,right:r.right-e.right-y.marginRight,bottom:r.bottom-e.bottom-y.marginBottom};return b},n.handleEvent=h.handleEvent,n.bindResize=function(){a.addEventListener("resize",this),this.isResizeBound=!0},n.unbindResize=function(){a.removeEventListener("resize",this),this.isResizeBound=!1},n.onresize=function(){this.resize()},h.debounceMethod(v,"onresize",100),n.resize=function(){!this.isResizeBound||!this.needsResizeLayout()||this.layout()},n.needsResizeLayout=function(){var t=f(this.element),e=this.size&&t;return e&&t.innerWidth!==this.size.innerWidth},n.addItems=function(t){var e=this._itemize(t);return e.length&&(this.items=this.items.concat(e)),e},n.appended=function(t){var e=this.addItems(t);e.length&&(this.layoutItems(e,!0),this.reveal(e))},n.prepended=function(t){var e=this._itemize(t);if(e.length){var r=this.items.slice(0);this.items=e.concat(r),this._resetLayout(),this._manageStamps(),this.layoutItems(e,!0),this.reveal(e),this.layoutItems(r)}},n.reveal=function(t){if(this._emitCompleteOnItems("reveal",t),!(!t||!t.length)){var e=this.updateStagger();t.forEach(function(r,y){r.stagger(y*e),r.reveal()})}},n.hide=function(t){if(this._emitCompleteOnItems("hide",t),!(!t||!t.length)){var e=this.updateStagger();t.forEach(function(r,y){r.stagger(y*e),r.hide()})}},n.revealItemElements=function(t){var e=this.getItems(t);this.reveal(e)},n.hideItemElements=function(t){var e=this.getItems(t);this.hide(e)},n.getItem=function(t){for(var e=0;e<this.items.length;e++){var r=this.items[e];if(r.element==t)return r}},n.getItems=function(t){t=h.makeArray(t);var e=[];return t.forEach(function(r){var y=this.getItem(r);y&&e.push(y)},this),e},n.remove=function(t){var e=this.getItems(t);this._emitCompleteOnItems("remove",e),!(!e||!e.length)&&e.forEach(function(r){r.remove(),h.removeFrom(this.items,r)},this)},n.destroy=function(){var t=this.element.style;t.height="",t.position="",t.width="",this.items.forEach(function(r){r.destroy()}),this.unbindResize();var e=this.element.outlayerGUID;delete l[e],delete this.element.outlayerGUID,i&&i.removeData(this.element,this.constructor.namespace)},v.data=function(t){t=h.getQueryElement(t);var e=t&&t.outlayerGUID;return e&&l[e]},v.create=function(t,e){var r=x(v);return r.defaults=h.extend({},v.defaults),h.extend(r.defaults,e),r.compatOptions=h.extend({},v.compatOptions),r.namespace=t,r.data=v.data,r.Item=x(d),h.htmlInit(r,t),i&&i.bridget&&i.bridget(t,r),r};function x(t){function e(){t.apply(this,arguments)}return e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e}var p={ms:1,s:1e3};function o(t){if(typeof t=="number")return t;var e=t.match(/(^\d*\.?\d*)(\w*)/),r=e&&e[1],y=e&&e[2];if(!r.length)return 0;r=parseFloat(r);var b=p[y]||1;return r*b}return v.Item=d,v})});var U=z((ut,H)=>{(function(c,a){typeof define=="function"&&define.amd?define(["outlayer/outlayer","get-size/get-size"],a):typeof H=="object"&&H.exports?H.exports=a(G(),W()):c.Masonry=a(c.Outlayer,c.getSize)})(window,function(a,m){"use strict";var f=a.create("masonry");f.compatOptions.fitWidth="isFitWidth";var h=f.prototype;return h._resetLayout=function(){this.getSize(),this._getMeasurement("columnWidth","outerWidth"),this._getMeasurement("gutter","outerWidth"),this.measureColumns(),this.colYs=[];for(var d=0;d<this.cols;d++)this.colYs.push(0);this.maxY=0,this.horizontalColIndex=0},h.measureColumns=function(){if(this.getContainerWidth(),!this.columnWidth){var d=this.items[0],s=d&&d.element;this.columnWidth=s&&m(s).outerWidth||this.containerWidth}var i=this.columnWidth+=this.gutter,u=this.containerWidth+this.gutter,g=u/i,l=i-u%i,v=l&&l<1?"round":"floor";g=Math[v](g),this.cols=Math.max(g,1)},h.getContainerWidth=function(){var d=this._getOption("fitWidth"),s=d?this.element.parentNode:this.element,i=m(s);this.containerWidth=i&&i.innerWidth},h._getItemLayoutPosition=function(d){d.getSize();var s=d.size.outerWidth%this.columnWidth,i=s&&s<1?"round":"ceil",u=Math[i](d.size.outerWidth/this.columnWidth);u=Math.min(u,this.cols);for(var g=this.options.horizontalOrder?"_getHorizontalColPosition":"_getTopColPosition",l=this[g](u,d),v={x:this.columnWidth*l.col,y:l.y},n=l.y+d.size.outerHeight,x=u+l.col,p=l.col;p<x;p++)this.colYs[p]=n;return v},h._getTopColPosition=function(d){var s=this._getTopColGroup(d),i=Math.min.apply(Math,s);return{col:s.indexOf(i),y:i}},h._getTopColGroup=function(d){if(d<2)return this.colYs;for(var s=[],i=this.cols+1-d,u=0;u<i;u++)s[u]=this._getColGroupY(u,d);return s},h._getColGroupY=function(d,s){if(s<2)return this.colYs[d];var i=this.colYs.slice(d,d+s);return Math.max.apply(Math,i)},h._getHorizontalColPosition=function(d,s){var i=this.horizontalColIndex%this.cols,u=d>1&&i+d>this.cols;i=u?0:i;var g=s.size.outerWidth&&s.size.outerHeight;return this.horizontalColIndex=g?i+d:this.horizontalColIndex,{col:i,y:this._getColGroupY(i,d)}},h._manageStamp=function(d){var s=m(d),i=this._getElementOffset(d),u=this._getOption("originLeft"),g=u?i.left:i.right,l=g+s.outerWidth,v=Math.floor(g/this.columnWidth);v=Math.max(0,v);var n=Math.floor(l/this.columnWidth);n-=l%this.columnWidth?0:1,n=Math.min(this.cols-1,n);for(var x=this._getOption("originTop"),p=(x?i.top:i.bottom)+s.outerHeight,o=v;o<=n;o++)this.colYs[o]=Math.max(p,this.colYs[o])},h._getContainerSize=function(){this.maxY=Math.max.apply(Math,this.colYs);var d={height:this.maxY};return this._getOption("fitWidth")&&(d.width=this._getContainerFitWidth()),d},h._getContainerFitWidth=function(){for(var d=0,s=this.cols;--s&&this.colYs[s]===0;)d++;return(this.cols-d)*this.columnWidth-this.gutter},h.needsResizeLayout=function(){var d=this.containerWidth;return this.getContainerWidth(),d!=this.containerWidth},f})});var V=et(U());var lt=new DOMParser;function T(c){let a=document.createElement("div");return a.innerHTML=c,a.firstElementChild}function D(c,a="vertical",m,f){m=m||0,f=f||"visible";let h=c.getBoundingClientRect();if(a=="vertical"){let d=Math.max(document.documentElement.clientHeight,window.innerHeight),s=h.bottom-m<0,i=h.top-d+m>=0;return f==="above"?s:f==="below"?i:!s&&!i}else if(a=="horizontal"){let d=Math.max(document.documentElement.clientWidth,window.innerWidth),s=h.right-m<0,i=h.left-d+m>=0;return f==="above"?s:f==="below"?i:!s&&!i}else return!1}var it=`.pu--masonry-grid {
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
}`;document.head.appendChild(document.createElement("style")).appendChild(document.createTextNode(it));async function nt(){let c=T(`
    <div class="pu--masonry-grid">
      <div class="infinite-scroll-trigger"></div>
    </div>  
  `);document.body.appendChild(c),document.querySelectorAll("body > *:not(.pu--masonry-grid)").forEach(i=>i.remove());let a=new V.default(c,{itemSelector:".grid-item",fitWidth:!0,stagger:0,transitionDuration:0});async function m(i){return(await fetch(`https://www.pixiv.net/ajax/illust/${i}/pages?lang=en`).then(g=>g.json())).body}function f(i){let u=document.createElement("div");return u.textContent=i,u.innerHTML}async function h(i,u){let g=u.classList.contains("bookmarked");u.classList.add("busy");try{if(g){let v=(await fetch(`https://www.pixiv.net/ajax/illust/${i}?lang=en`).then(n=>n.json())).body?.bookmarkData?.id;v&&await fetch("https://www.pixiv.net/ajax/illusts/bookmarks/delete",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:`bookmark_id=${v}`,credentials:"same-origin"}),u.classList.remove("bookmarked")}else await fetch("https://www.pixiv.net/ajax/illusts/bookmarks/add",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({illust_id:i,restrict:0,comment:"",tags:[]}),credentials:"same-origin"}),u.classList.add("bookmarked")}catch(l){console.error("Bookmark toggle failed",i,l)}finally{u.classList.remove("busy")}}async function d(i,u){if(i.classList.contains("expanded")){c.querySelectorAll(`.grid-item-extra[data-parent-id="${u}"]`).forEach(l=>{a.remove(l),l.remove()}),i.classList.remove("expanded"),a.layout();return}i.classList.add("expanded","loading");try{let g=await m(u),l=[],v=i;for(let n=1;n<g.length;n++){let x=T(`
          <a class="grid-item grid-item-extra" data-parent-id="${u}" href="/en/artworks/${u}">
            <span class="extra-page-label">${n+1} / ${g.length}</span>
          </a>
        `),p=new Image;l.push({elm:x,img:p,src:g[n].urls.regular})}for(let{elm:n,img:x,src:p}of l)await new Promise(o=>{x.onload=()=>{n.prepend(x),v.after(n),v=n,a.reloadItems(),a.layout(),o()},x.onerror=o,x.src=p})}catch(g){console.error("Failed to load pages for",u,g)}finally{i.classList.remove("loading")}}async function s(i){await Promise.all(i.map(u=>new Promise(async g=>{let l=u.urls["1200x1200"],v=u.pageCount||1,n=u.title||"",x=new Image,p=T(`
            <div class="grid-item${v>1?" has-multiple":""}" data-id="${u.id}">
            </div>
          `),o=document.createElement("div");o.className="grid-item-link",p.appendChild(o);let t=T(`
            <div class="grid-item-info">
              <button class="grid-item-like${u.bookmarkData?" bookmarked":""}" type="button" title="Like">
                <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              </button>
              <a class="grid-item-title" href="/en/artworks/${u.id}" target="_blank" rel="noopener">${f(n)}</a>
              ${v>1?`<span class="grid-item-badge">${v}P</span>`:""}
            </div>
          `);p.appendChild(t),t.querySelector(".grid-item-like").addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),h(u.id,e.currentTarget)}),o.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),v>1?d(p,u.id):window.open(`/en/artworks/${u.id}`,"_blank")}),x.onload=()=>{o.appendChild(x),c.appendChild(p),a.appended(p),a.layout(),g()},x.onerror=()=>{g()},x.src=l})))}switch(window.location.pathname){case"/bookmark_new_illust.php":case"/bookmark_new_illust_r18.php":{let i=0;async function u(){let l=window.location.pathname==="/bookmark_new_illust_r18.php"?"r18":"all",v=await fetch(`https://www.pixiv.net/ajax/follow_latest/illust?p=${i}&mode=${l}&lang=en`).then(n=>n.json());await s(v.body.thumbnails.illust),console.log("Loaded page",i)}let g=!1;setInterval(async()=>{D(c.children.item(c.children.length-5)||c.lastElementChild,"vertical",50)&&(g||(i++,g=!0,await u(),g=!1,console.log("Loading next page",i)))},1e3);break}case"/discovery":{async function i(){let g=new URLSearchParams(window.location.search).get("mode")||"all",l=await fetch(`https://www.pixiv.net/ajax/discovery/artworks?mode=${g}&limit=60&lang=en`).then(v=>v.json());await s(l.body.thumbnails.illust),console.log("Loaded page")}let u=!1;setInterval(async()=>{D(c.children.item(c.children.length-5)||c.lastElementChild,"vertical",50)&&(u||(u=!0,await i(),u=!1,console.log("Loading next page",lastPageNumber)))},1e3);break}}}nt();})();
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
