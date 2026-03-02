// ==UserScript==
// @name        rule34utils 
// @namespace   rule34utils
// @match       https://rule34.xxx/index.php*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @grant       GM_webRequest
// @grant       unsafeWindow
// @connect     *
// @version     0.0.1
// @author      TheArmagan
// @license     GPL-3.0-only
// @description 2026-03-02T02:26:05.562Z
// ==/UserScript==
(()=>{var Ug=Object.create;var wa=Object.defineProperty;var Fg=Object.getOwnPropertyDescriptor;var Wg=Object.getOwnPropertyNames;var Mg=Object.getPrototypeOf,qg=Object.prototype.hasOwnProperty;var kg=(u,v)=>()=>(v||u((v={exports:{}}).exports,v),v.exports);var Bg=(u,v,m,k)=>{if(v&&typeof v=="object"||typeof v=="function")for(let x of Wg(v))!qg.call(u,x)&&x!==m&&wa(u,x,{get:()=>v[x],enumerable:!(k=Fg(v,x))||k.enumerable});return u};var sr=(u,v,m)=>(m=u!=null?Ug(Mg(u)):{},Bg(v||!u||!u.__esModule?wa(m,"default",{value:u,enumerable:!0}):m,u));var ht=kg(($n,pt)=>{(function(){var u,v="4.17.21",m=200,k="Unsupported core-js use. Try https://npms.io/search?q=ponyfill.",x="Expected a function",T="Invalid `variable` option passed into `_.template`",j="__lodash_hash_undefined__",ye=500,G="__lodash_placeholder__",re=1,E=2,M=4,q=1,D=2,$=1,_e=2,he=4,ie=8,ke=16,Se=32,le=64,Z=128,Hn=256,vr=512,qa=30,ka="...",Ba=800,Na=16,Di=1,Da=2,$a=3,_n=1/0,on=9007199254740991,Ha=17976931348623157e292,gt=NaN,Ge=4294967295,za=Ge-1,Ga=Ge>>>1,Ka=[["ary",Z],["bind",$],["bindKey",_e],["curry",ie],["curryRight",ke],["flip",vr],["partial",Se],["partialRight",le],["rearg",Hn]],Cn="[object Arguments]",vt="[object Array]",Ya="[object AsyncFunction]",zn="[object Boolean]",Gn="[object Date]",Za="[object DOMException]",_t="[object Error]",mt="[object Function]",$i="[object GeneratorFunction]",Be="[object Map]",Kn="[object Number]",Xa="[object Null]",Xe="[object Object]",Hi="[object Promise]",Ja="[object Proxy]",Yn="[object RegExp]",Ne="[object Set]",Zn="[object String]",xt="[object Symbol]",Qa="[object Undefined]",Xn="[object WeakMap]",Va="[object WeakSet]",Jn="[object ArrayBuffer]",Rn="[object DataView]",_r="[object Float32Array]",mr="[object Float64Array]",xr="[object Int8Array]",wr="[object Int16Array]",br="[object Int32Array]",yr="[object Uint8Array]",Sr="[object Uint8ClampedArray]",Lr="[object Uint16Array]",Ar="[object Uint32Array]",ja=/\b__p \+= '';/g,es=/\b(__p \+=) '' \+/g,ns=/(__e\(.*?\)|\b__t\)) \+\n'';/g,zi=/&(?:amp|lt|gt|quot|#39);/g,Gi=/[&<>"']/g,ts=RegExp(zi.source),rs=RegExp(Gi.source),is=/<%-([\s\S]+?)%>/g,us=/<%([\s\S]+?)%>/g,Ki=/<%=([\s\S]+?)%>/g,os=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,as=/^\w*$/,ss=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,Er=/[\\^$.*+?()[\]{}|]/g,ls=RegExp(Er.source),Cr=/^\s+/,cs=/\s/,fs=/\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,ps=/\{\n\/\* \[wrapped with (.+)\] \*/,hs=/,? & /,ds=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,gs=/[()=,{}\[\]\/\s]/,vs=/\\(\\)?/g,_s=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,Yi=/\w*$/,ms=/^[-+]0x[0-9a-f]+$/i,xs=/^0b[01]+$/i,ws=/^\[object .+?Constructor\]$/,bs=/^0o[0-7]+$/i,ys=/^(?:0|[1-9]\d*)$/,Ss=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,wt=/($^)/,Ls=/['\n\r\u2028\u2029\\]/g,bt="\\ud800-\\udfff",As="\\u0300-\\u036f",Es="\\ufe20-\\ufe2f",Cs="\\u20d0-\\u20ff",Zi=As+Es+Cs,Xi="\\u2700-\\u27bf",Ji="a-z\\xdf-\\xf6\\xf8-\\xff",Rs="\\xac\\xb1\\xd7\\xf7",Ts="\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf",Is="\\u2000-\\u206f",Ps=" \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",Qi="A-Z\\xc0-\\xd6\\xd8-\\xde",Vi="\\ufe0e\\ufe0f",ji=Rs+Ts+Is+Ps,Rr="['\u2019]",Os="["+bt+"]",eu="["+ji+"]",yt="["+Zi+"]",nu="\\d+",Us="["+Xi+"]",tu="["+Ji+"]",ru="[^"+bt+ji+nu+Xi+Ji+Qi+"]",Tr="\\ud83c[\\udffb-\\udfff]",Fs="(?:"+yt+"|"+Tr+")",iu="[^"+bt+"]",Ir="(?:\\ud83c[\\udde6-\\uddff]){2}",Pr="[\\ud800-\\udbff][\\udc00-\\udfff]",Tn="["+Qi+"]",uu="\\u200d",ou="(?:"+tu+"|"+ru+")",Ws="(?:"+Tn+"|"+ru+")",au="(?:"+Rr+"(?:d|ll|m|re|s|t|ve))?",su="(?:"+Rr+"(?:D|LL|M|RE|S|T|VE))?",lu=Fs+"?",cu="["+Vi+"]?",Ms="(?:"+uu+"(?:"+[iu,Ir,Pr].join("|")+")"+cu+lu+")*",qs="\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])",ks="\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])",fu=cu+lu+Ms,Bs="(?:"+[Us,Ir,Pr].join("|")+")"+fu,Ns="(?:"+[iu+yt+"?",yt,Ir,Pr,Os].join("|")+")",Ds=RegExp(Rr,"g"),$s=RegExp(yt,"g"),Or=RegExp(Tr+"(?="+Tr+")|"+Ns+fu,"g"),Hs=RegExp([Tn+"?"+tu+"+"+au+"(?="+[eu,Tn,"$"].join("|")+")",Ws+"+"+su+"(?="+[eu,Tn+ou,"$"].join("|")+")",Tn+"?"+ou+"+"+au,Tn+"+"+su,ks,qs,nu,Bs].join("|"),"g"),zs=RegExp("["+uu+bt+Zi+Vi+"]"),Gs=/[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,Ks=["Array","Buffer","DataView","Date","Error","Float32Array","Float64Array","Function","Int8Array","Int16Array","Int32Array","Map","Math","Object","Promise","RegExp","Set","String","Symbol","TypeError","Uint8Array","Uint8ClampedArray","Uint16Array","Uint32Array","WeakMap","_","clearTimeout","isFinite","parseInt","setTimeout"],Ys=-1,Y={};Y[_r]=Y[mr]=Y[xr]=Y[wr]=Y[br]=Y[yr]=Y[Sr]=Y[Lr]=Y[Ar]=!0,Y[Cn]=Y[vt]=Y[Jn]=Y[zn]=Y[Rn]=Y[Gn]=Y[_t]=Y[mt]=Y[Be]=Y[Kn]=Y[Xe]=Y[Yn]=Y[Ne]=Y[Zn]=Y[Xn]=!1;var K={};K[Cn]=K[vt]=K[Jn]=K[Rn]=K[zn]=K[Gn]=K[_r]=K[mr]=K[xr]=K[wr]=K[br]=K[Be]=K[Kn]=K[Xe]=K[Yn]=K[Ne]=K[Zn]=K[xt]=K[yr]=K[Sr]=K[Lr]=K[Ar]=!0,K[_t]=K[mt]=K[Xn]=!1;var Zs={\u00C0:"A",\u00C1:"A",\u00C2:"A",\u00C3:"A",\u00C4:"A",\u00C5:"A",\u00E0:"a",\u00E1:"a",\u00E2:"a",\u00E3:"a",\u00E4:"a",\u00E5:"a",\u00C7:"C",\u00E7:"c",\u00D0:"D",\u00F0:"d",\u00C8:"E",\u00C9:"E",\u00CA:"E",\u00CB:"E",\u00E8:"e",\u00E9:"e",\u00EA:"e",\u00EB:"e",\u00CC:"I",\u00CD:"I",\u00CE:"I",\u00CF:"I",\u00EC:"i",\u00ED:"i",\u00EE:"i",\u00EF:"i",\u00D1:"N",\u00F1:"n",\u00D2:"O",\u00D3:"O",\u00D4:"O",\u00D5:"O",\u00D6:"O",\u00D8:"O",\u00F2:"o",\u00F3:"o",\u00F4:"o",\u00F5:"o",\u00F6:"o",\u00F8:"o",\u00D9:"U",\u00DA:"U",\u00DB:"U",\u00DC:"U",\u00F9:"u",\u00FA:"u",\u00FB:"u",\u00FC:"u",\u00DD:"Y",\u00FD:"y",\u00FF:"y",\u00C6:"Ae",\u00E6:"ae",\u00DE:"Th",\u00FE:"th",\u00DF:"ss",\u0100:"A",\u0102:"A",\u0104:"A",\u0101:"a",\u0103:"a",\u0105:"a",\u0106:"C",\u0108:"C",\u010A:"C",\u010C:"C",\u0107:"c",\u0109:"c",\u010B:"c",\u010D:"c",\u010E:"D",\u0110:"D",\u010F:"d",\u0111:"d",\u0112:"E",\u0114:"E",\u0116:"E",\u0118:"E",\u011A:"E",\u0113:"e",\u0115:"e",\u0117:"e",\u0119:"e",\u011B:"e",\u011C:"G",\u011E:"G",\u0120:"G",\u0122:"G",\u011D:"g",\u011F:"g",\u0121:"g",\u0123:"g",\u0124:"H",\u0126:"H",\u0125:"h",\u0127:"h",\u0128:"I",\u012A:"I",\u012C:"I",\u012E:"I",\u0130:"I",\u0129:"i",\u012B:"i",\u012D:"i",\u012F:"i",\u0131:"i",\u0134:"J",\u0135:"j",\u0136:"K",\u0137:"k",\u0138:"k",\u0139:"L",\u013B:"L",\u013D:"L",\u013F:"L",\u0141:"L",\u013A:"l",\u013C:"l",\u013E:"l",\u0140:"l",\u0142:"l",\u0143:"N",\u0145:"N",\u0147:"N",\u014A:"N",\u0144:"n",\u0146:"n",\u0148:"n",\u014B:"n",\u014C:"O",\u014E:"O",\u0150:"O",\u014D:"o",\u014F:"o",\u0151:"o",\u0154:"R",\u0156:"R",\u0158:"R",\u0155:"r",\u0157:"r",\u0159:"r",\u015A:"S",\u015C:"S",\u015E:"S",\u0160:"S",\u015B:"s",\u015D:"s",\u015F:"s",\u0161:"s",\u0162:"T",\u0164:"T",\u0166:"T",\u0163:"t",\u0165:"t",\u0167:"t",\u0168:"U",\u016A:"U",\u016C:"U",\u016E:"U",\u0170:"U",\u0172:"U",\u0169:"u",\u016B:"u",\u016D:"u",\u016F:"u",\u0171:"u",\u0173:"u",\u0174:"W",\u0175:"w",\u0176:"Y",\u0177:"y",\u0178:"Y",\u0179:"Z",\u017B:"Z",\u017D:"Z",\u017A:"z",\u017C:"z",\u017E:"z",\u0132:"IJ",\u0133:"ij",\u0152:"Oe",\u0153:"oe",\u0149:"'n",\u017F:"s"},Xs={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Js={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'"},Qs={"\\":"\\","'":"'","\n":"n","\r":"r","\u2028":"u2028","\u2029":"u2029"},Vs=parseFloat,js=parseInt,pu=typeof global=="object"&&global&&global.Object===Object&&global,el=typeof self=="object"&&self&&self.Object===Object&&self,ae=pu||el||Function("return this")(),Ur=typeof $n=="object"&&$n&&!$n.nodeType&&$n,mn=Ur&&typeof pt=="object"&&pt&&!pt.nodeType&&pt,hu=mn&&mn.exports===Ur,Fr=hu&&pu.process,Ie=function(){try{var c=mn&&mn.require&&mn.require("util").types;return c||Fr&&Fr.binding&&Fr.binding("util")}catch{}}(),du=Ie&&Ie.isArrayBuffer,gu=Ie&&Ie.isDate,vu=Ie&&Ie.isMap,_u=Ie&&Ie.isRegExp,mu=Ie&&Ie.isSet,xu=Ie&&Ie.isTypedArray;function Le(c,h,p){switch(p.length){case 0:return c.call(h);case 1:return c.call(h,p[0]);case 2:return c.call(h,p[0],p[1]);case 3:return c.call(h,p[0],p[1],p[2])}return c.apply(h,p)}function nl(c,h,p,b){for(var C=-1,B=c==null?0:c.length;++C<B;){var ue=c[C];h(b,ue,p(ue),c)}return b}function Pe(c,h){for(var p=-1,b=c==null?0:c.length;++p<b&&h(c[p],p,c)!==!1;);return c}function tl(c,h){for(var p=c==null?0:c.length;p--&&h(c[p],p,c)!==!1;);return c}function wu(c,h){for(var p=-1,b=c==null?0:c.length;++p<b;)if(!h(c[p],p,c))return!1;return!0}function an(c,h){for(var p=-1,b=c==null?0:c.length,C=0,B=[];++p<b;){var ue=c[p];h(ue,p,c)&&(B[C++]=ue)}return B}function St(c,h){var p=c==null?0:c.length;return!!p&&In(c,h,0)>-1}function Wr(c,h,p){for(var b=-1,C=c==null?0:c.length;++b<C;)if(p(h,c[b]))return!0;return!1}function X(c,h){for(var p=-1,b=c==null?0:c.length,C=Array(b);++p<b;)C[p]=h(c[p],p,c);return C}function sn(c,h){for(var p=-1,b=h.length,C=c.length;++p<b;)c[C+p]=h[p];return c}function Mr(c,h,p,b){var C=-1,B=c==null?0:c.length;for(b&&B&&(p=c[++C]);++C<B;)p=h(p,c[C],C,c);return p}function rl(c,h,p,b){var C=c==null?0:c.length;for(b&&C&&(p=c[--C]);C--;)p=h(p,c[C],C,c);return p}function qr(c,h){for(var p=-1,b=c==null?0:c.length;++p<b;)if(h(c[p],p,c))return!0;return!1}var il=kr("length");function ul(c){return c.split("")}function ol(c){return c.match(ds)||[]}function bu(c,h,p){var b;return p(c,function(C,B,ue){if(h(C,B,ue))return b=B,!1}),b}function Lt(c,h,p,b){for(var C=c.length,B=p+(b?1:-1);b?B--:++B<C;)if(h(c[B],B,c))return B;return-1}function In(c,h,p){return h===h?ml(c,h,p):Lt(c,yu,p)}function al(c,h,p,b){for(var C=p-1,B=c.length;++C<B;)if(b(c[C],h))return C;return-1}function yu(c){return c!==c}function Su(c,h){var p=c==null?0:c.length;return p?Nr(c,h)/p:gt}function kr(c){return function(h){return h==null?u:h[c]}}function Br(c){return function(h){return c==null?u:c[h]}}function Lu(c,h,p,b,C){return C(c,function(B,ue,z){p=b?(b=!1,B):h(p,B,ue,z)}),p}function sl(c,h){var p=c.length;for(c.sort(h);p--;)c[p]=c[p].value;return c}function Nr(c,h){for(var p,b=-1,C=c.length;++b<C;){var B=h(c[b]);B!==u&&(p=p===u?B:p+B)}return p}function Dr(c,h){for(var p=-1,b=Array(c);++p<c;)b[p]=h(p);return b}function ll(c,h){return X(h,function(p){return[p,c[p]]})}function Au(c){return c&&c.slice(0,Tu(c)+1).replace(Cr,"")}function Ae(c){return function(h){return c(h)}}function $r(c,h){return X(h,function(p){return c[p]})}function Qn(c,h){return c.has(h)}function Eu(c,h){for(var p=-1,b=c.length;++p<b&&In(h,c[p],0)>-1;);return p}function Cu(c,h){for(var p=c.length;p--&&In(h,c[p],0)>-1;);return p}function cl(c,h){for(var p=c.length,b=0;p--;)c[p]===h&&++b;return b}var fl=Br(Zs),pl=Br(Xs);function hl(c){return"\\"+Qs[c]}function dl(c,h){return c==null?u:c[h]}function Pn(c){return zs.test(c)}function gl(c){return Gs.test(c)}function vl(c){for(var h,p=[];!(h=c.next()).done;)p.push(h.value);return p}function Hr(c){var h=-1,p=Array(c.size);return c.forEach(function(b,C){p[++h]=[C,b]}),p}function Ru(c,h){return function(p){return c(h(p))}}function ln(c,h){for(var p=-1,b=c.length,C=0,B=[];++p<b;){var ue=c[p];(ue===h||ue===G)&&(c[p]=G,B[C++]=p)}return B}function At(c){var h=-1,p=Array(c.size);return c.forEach(function(b){p[++h]=b}),p}function _l(c){var h=-1,p=Array(c.size);return c.forEach(function(b){p[++h]=[b,b]}),p}function ml(c,h,p){for(var b=p-1,C=c.length;++b<C;)if(c[b]===h)return b;return-1}function xl(c,h,p){for(var b=p+1;b--;)if(c[b]===h)return b;return b}function On(c){return Pn(c)?bl(c):il(c)}function De(c){return Pn(c)?yl(c):ul(c)}function Tu(c){for(var h=c.length;h--&&cs.test(c.charAt(h)););return h}var wl=Br(Js);function bl(c){for(var h=Or.lastIndex=0;Or.test(c);)++h;return h}function yl(c){return c.match(Or)||[]}function Sl(c){return c.match(Hs)||[]}var Ll=function c(h){h=h==null?ae:cn.defaults(ae.Object(),h,cn.pick(ae,Ks));var p=h.Array,b=h.Date,C=h.Error,B=h.Function,ue=h.Math,z=h.Object,zr=h.RegExp,Al=h.String,Oe=h.TypeError,Et=p.prototype,El=B.prototype,Un=z.prototype,Ct=h["__core-js_shared__"],Rt=El.toString,H=Un.hasOwnProperty,Cl=0,Iu=function(){var e=/[^.]+$/.exec(Ct&&Ct.keys&&Ct.keys.IE_PROTO||"");return e?"Symbol(src)_1."+e:""}(),Tt=Un.toString,Rl=Rt.call(z),Tl=ae._,Il=zr("^"+Rt.call(H).replace(Er,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),It=hu?h.Buffer:u,fn=h.Symbol,Pt=h.Uint8Array,Pu=It?It.allocUnsafe:u,Ot=Ru(z.getPrototypeOf,z),Ou=z.create,Uu=Un.propertyIsEnumerable,Ut=Et.splice,Fu=fn?fn.isConcatSpreadable:u,Vn=fn?fn.iterator:u,xn=fn?fn.toStringTag:u,Ft=function(){try{var e=Ln(z,"defineProperty");return e({},"",{}),e}catch{}}(),Pl=h.clearTimeout!==ae.clearTimeout&&h.clearTimeout,Ol=b&&b.now!==ae.Date.now&&b.now,Ul=h.setTimeout!==ae.setTimeout&&h.setTimeout,Wt=ue.ceil,Mt=ue.floor,Gr=z.getOwnPropertySymbols,Fl=It?It.isBuffer:u,Wu=h.isFinite,Wl=Et.join,Ml=Ru(z.keys,z),oe=ue.max,fe=ue.min,ql=b.now,kl=h.parseInt,Mu=ue.random,Bl=Et.reverse,Kr=Ln(h,"DataView"),jn=Ln(h,"Map"),Yr=Ln(h,"Promise"),Fn=Ln(h,"Set"),et=Ln(h,"WeakMap"),nt=Ln(z,"create"),qt=et&&new et,Wn={},Nl=An(Kr),Dl=An(jn),$l=An(Yr),Hl=An(Fn),zl=An(et),kt=fn?fn.prototype:u,tt=kt?kt.valueOf:u,qu=kt?kt.toString:u;function o(e){if(V(e)&&!R(e)&&!(e instanceof F)){if(e instanceof Ue)return e;if(H.call(e,"__wrapped__"))return Bo(e)}return new Ue(e)}var Mn=function(){function e(){}return function(n){if(!J(n))return{};if(Ou)return Ou(n);e.prototype=n;var t=new e;return e.prototype=u,t}}();function Bt(){}function Ue(e,n){this.__wrapped__=e,this.__actions__=[],this.__chain__=!!n,this.__index__=0,this.__values__=u}o.templateSettings={escape:is,evaluate:us,interpolate:Ki,variable:"",imports:{_:o}},o.prototype=Bt.prototype,o.prototype.constructor=o,Ue.prototype=Mn(Bt.prototype),Ue.prototype.constructor=Ue;function F(e){this.__wrapped__=e,this.__actions__=[],this.__dir__=1,this.__filtered__=!1,this.__iteratees__=[],this.__takeCount__=Ge,this.__views__=[]}function Gl(){var e=new F(this.__wrapped__);return e.__actions__=me(this.__actions__),e.__dir__=this.__dir__,e.__filtered__=this.__filtered__,e.__iteratees__=me(this.__iteratees__),e.__takeCount__=this.__takeCount__,e.__views__=me(this.__views__),e}function Kl(){if(this.__filtered__){var e=new F(this);e.__dir__=-1,e.__filtered__=!0}else e=this.clone(),e.__dir__*=-1;return e}function Yl(){var e=this.__wrapped__.value(),n=this.__dir__,t=R(e),r=n<0,i=t?e.length:0,a=of(0,i,this.__views__),s=a.start,l=a.end,f=l-s,d=r?l:s-1,g=this.__iteratees__,_=g.length,w=0,y=fe(f,this.__takeCount__);if(!t||!r&&i==f&&y==f)return ao(e,this.__actions__);var L=[];e:for(;f--&&w<y;){d+=n;for(var P=-1,A=e[d];++P<_;){var U=g[P],W=U.iteratee,Re=U.type,ve=W(A);if(Re==Da)A=ve;else if(!ve){if(Re==Di)continue e;break e}}L[w++]=A}return L}F.prototype=Mn(Bt.prototype),F.prototype.constructor=F;function wn(e){var n=-1,t=e==null?0:e.length;for(this.clear();++n<t;){var r=e[n];this.set(r[0],r[1])}}function Zl(){this.__data__=nt?nt(null):{},this.size=0}function Xl(e){var n=this.has(e)&&delete this.__data__[e];return this.size-=n?1:0,n}function Jl(e){var n=this.__data__;if(nt){var t=n[e];return t===j?u:t}return H.call(n,e)?n[e]:u}function Ql(e){var n=this.__data__;return nt?n[e]!==u:H.call(n,e)}function Vl(e,n){var t=this.__data__;return this.size+=this.has(e)?0:1,t[e]=nt&&n===u?j:n,this}wn.prototype.clear=Zl,wn.prototype.delete=Xl,wn.prototype.get=Jl,wn.prototype.has=Ql,wn.prototype.set=Vl;function Je(e){var n=-1,t=e==null?0:e.length;for(this.clear();++n<t;){var r=e[n];this.set(r[0],r[1])}}function jl(){this.__data__=[],this.size=0}function ec(e){var n=this.__data__,t=Nt(n,e);if(t<0)return!1;var r=n.length-1;return t==r?n.pop():Ut.call(n,t,1),--this.size,!0}function nc(e){var n=this.__data__,t=Nt(n,e);return t<0?u:n[t][1]}function tc(e){return Nt(this.__data__,e)>-1}function rc(e,n){var t=this.__data__,r=Nt(t,e);return r<0?(++this.size,t.push([e,n])):t[r][1]=n,this}Je.prototype.clear=jl,Je.prototype.delete=ec,Je.prototype.get=nc,Je.prototype.has=tc,Je.prototype.set=rc;function Qe(e){var n=-1,t=e==null?0:e.length;for(this.clear();++n<t;){var r=e[n];this.set(r[0],r[1])}}function ic(){this.size=0,this.__data__={hash:new wn,map:new(jn||Je),string:new wn}}function uc(e){var n=Vt(this,e).delete(e);return this.size-=n?1:0,n}function oc(e){return Vt(this,e).get(e)}function ac(e){return Vt(this,e).has(e)}function sc(e,n){var t=Vt(this,e),r=t.size;return t.set(e,n),this.size+=t.size==r?0:1,this}Qe.prototype.clear=ic,Qe.prototype.delete=uc,Qe.prototype.get=oc,Qe.prototype.has=ac,Qe.prototype.set=sc;function bn(e){var n=-1,t=e==null?0:e.length;for(this.__data__=new Qe;++n<t;)this.add(e[n])}function lc(e){return this.__data__.set(e,j),this}function cc(e){return this.__data__.has(e)}bn.prototype.add=bn.prototype.push=lc,bn.prototype.has=cc;function $e(e){var n=this.__data__=new Je(e);this.size=n.size}function fc(){this.__data__=new Je,this.size=0}function pc(e){var n=this.__data__,t=n.delete(e);return this.size=n.size,t}function hc(e){return this.__data__.get(e)}function dc(e){return this.__data__.has(e)}function gc(e,n){var t=this.__data__;if(t instanceof Je){var r=t.__data__;if(!jn||r.length<m-1)return r.push([e,n]),this.size=++t.size,this;t=this.__data__=new Qe(r)}return t.set(e,n),this.size=t.size,this}$e.prototype.clear=fc,$e.prototype.delete=pc,$e.prototype.get=hc,$e.prototype.has=dc,$e.prototype.set=gc;function ku(e,n){var t=R(e),r=!t&&En(e),i=!t&&!r&&vn(e),a=!t&&!r&&!i&&Nn(e),s=t||r||i||a,l=s?Dr(e.length,Al):[],f=l.length;for(var d in e)(n||H.call(e,d))&&!(s&&(d=="length"||i&&(d=="offset"||d=="parent")||a&&(d=="buffer"||d=="byteLength"||d=="byteOffset")||nn(d,f)))&&l.push(d);return l}function Bu(e){var n=e.length;return n?e[ii(0,n-1)]:u}function vc(e,n){return jt(me(e),yn(n,0,e.length))}function _c(e){return jt(me(e))}function Zr(e,n,t){(t!==u&&!He(e[n],t)||t===u&&!(n in e))&&Ve(e,n,t)}function rt(e,n,t){var r=e[n];(!(H.call(e,n)&&He(r,t))||t===u&&!(n in e))&&Ve(e,n,t)}function Nt(e,n){for(var t=e.length;t--;)if(He(e[t][0],n))return t;return-1}function mc(e,n,t,r){return pn(e,function(i,a,s){n(r,i,t(i),s)}),r}function Nu(e,n){return e&&Ye(n,se(n),e)}function xc(e,n){return e&&Ye(n,we(n),e)}function Ve(e,n,t){n=="__proto__"&&Ft?Ft(e,n,{configurable:!0,enumerable:!0,value:t,writable:!0}):e[n]=t}function Xr(e,n){for(var t=-1,r=n.length,i=p(r),a=e==null;++t<r;)i[t]=a?u:Ti(e,n[t]);return i}function yn(e,n,t){return e===e&&(t!==u&&(e=e<=t?e:t),n!==u&&(e=e>=n?e:n)),e}function Fe(e,n,t,r,i,a){var s,l=n&re,f=n&E,d=n&M;if(t&&(s=i?t(e,r,i,a):t(e)),s!==u)return s;if(!J(e))return e;var g=R(e);if(g){if(s=sf(e),!l)return me(e,s)}else{var _=pe(e),w=_==mt||_==$i;if(vn(e))return co(e,l);if(_==Xe||_==Cn||w&&!i){if(s=f||w?{}:Io(e),!l)return f?Jc(e,xc(s,e)):Xc(e,Nu(s,e))}else{if(!K[_])return i?e:{};s=lf(e,_,l)}}a||(a=new $e);var y=a.get(e);if(y)return y;a.set(e,s),ua(e)?e.forEach(function(A){s.add(Fe(A,n,t,A,e,a))}):ra(e)&&e.forEach(function(A,U){s.set(U,Fe(A,n,t,U,e,a))});var L=d?f?gi:di:f?we:se,P=g?u:L(e);return Pe(P||e,function(A,U){P&&(U=A,A=e[U]),rt(s,U,Fe(A,n,t,U,e,a))}),s}function wc(e){var n=se(e);return function(t){return Du(t,e,n)}}function Du(e,n,t){var r=t.length;if(e==null)return!r;for(e=z(e);r--;){var i=t[r],a=n[i],s=e[i];if(s===u&&!(i in e)||!a(s))return!1}return!0}function $u(e,n,t){if(typeof e!="function")throw new Oe(x);return ct(function(){e.apply(u,t)},n)}function it(e,n,t,r){var i=-1,a=St,s=!0,l=e.length,f=[],d=n.length;if(!l)return f;t&&(n=X(n,Ae(t))),r?(a=Wr,s=!1):n.length>=m&&(a=Qn,s=!1,n=new bn(n));e:for(;++i<l;){var g=e[i],_=t==null?g:t(g);if(g=r||g!==0?g:0,s&&_===_){for(var w=d;w--;)if(n[w]===_)continue e;f.push(g)}else a(n,_,r)||f.push(g)}return f}var pn=vo(Ke),Hu=vo(Qr,!0);function bc(e,n){var t=!0;return pn(e,function(r,i,a){return t=!!n(r,i,a),t}),t}function Dt(e,n,t){for(var r=-1,i=e.length;++r<i;){var a=e[r],s=n(a);if(s!=null&&(l===u?s===s&&!Ce(s):t(s,l)))var l=s,f=a}return f}function yc(e,n,t,r){var i=e.length;for(t=I(t),t<0&&(t=-t>i?0:i+t),r=r===u||r>i?i:I(r),r<0&&(r+=i),r=t>r?0:aa(r);t<r;)e[t++]=n;return e}function zu(e,n){var t=[];return pn(e,function(r,i,a){n(r,i,a)&&t.push(r)}),t}function ce(e,n,t,r,i){var a=-1,s=e.length;for(t||(t=ff),i||(i=[]);++a<s;){var l=e[a];n>0&&t(l)?n>1?ce(l,n-1,t,r,i):sn(i,l):r||(i[i.length]=l)}return i}var Jr=_o(),Gu=_o(!0);function Ke(e,n){return e&&Jr(e,n,se)}function Qr(e,n){return e&&Gu(e,n,se)}function $t(e,n){return an(n,function(t){return tn(e[t])})}function Sn(e,n){n=dn(n,e);for(var t=0,r=n.length;e!=null&&t<r;)e=e[Ze(n[t++])];return t&&t==r?e:u}function Ku(e,n,t){var r=n(e);return R(e)?r:sn(r,t(e))}function de(e){return e==null?e===u?Qa:Xa:xn&&xn in z(e)?uf(e):mf(e)}function Vr(e,n){return e>n}function Sc(e,n){return e!=null&&H.call(e,n)}function Lc(e,n){return e!=null&&n in z(e)}function Ac(e,n,t){return e>=fe(n,t)&&e<oe(n,t)}function jr(e,n,t){for(var r=t?Wr:St,i=e[0].length,a=e.length,s=a,l=p(a),f=1/0,d=[];s--;){var g=e[s];s&&n&&(g=X(g,Ae(n))),f=fe(g.length,f),l[s]=!t&&(n||i>=120&&g.length>=120)?new bn(s&&g):u}g=e[0];var _=-1,w=l[0];e:for(;++_<i&&d.length<f;){var y=g[_],L=n?n(y):y;if(y=t||y!==0?y:0,!(w?Qn(w,L):r(d,L,t))){for(s=a;--s;){var P=l[s];if(!(P?Qn(P,L):r(e[s],L,t)))continue e}w&&w.push(L),d.push(y)}}return d}function Ec(e,n,t,r){return Ke(e,function(i,a,s){n(r,t(i),a,s)}),r}function ut(e,n,t){n=dn(n,e),e=Fo(e,n);var r=e==null?e:e[Ze(Me(n))];return r==null?u:Le(r,e,t)}function Yu(e){return V(e)&&de(e)==Cn}function Cc(e){return V(e)&&de(e)==Jn}function Rc(e){return V(e)&&de(e)==Gn}function ot(e,n,t,r,i){return e===n?!0:e==null||n==null||!V(e)&&!V(n)?e!==e&&n!==n:Tc(e,n,t,r,ot,i)}function Tc(e,n,t,r,i,a){var s=R(e),l=R(n),f=s?vt:pe(e),d=l?vt:pe(n);f=f==Cn?Xe:f,d=d==Cn?Xe:d;var g=f==Xe,_=d==Xe,w=f==d;if(w&&vn(e)){if(!vn(n))return!1;s=!0,g=!1}if(w&&!g)return a||(a=new $e),s||Nn(e)?Co(e,n,t,r,i,a):tf(e,n,f,t,r,i,a);if(!(t&q)){var y=g&&H.call(e,"__wrapped__"),L=_&&H.call(n,"__wrapped__");if(y||L){var P=y?e.value():e,A=L?n.value():n;return a||(a=new $e),i(P,A,t,r,a)}}return w?(a||(a=new $e),rf(e,n,t,r,i,a)):!1}function Ic(e){return V(e)&&pe(e)==Be}function ei(e,n,t,r){var i=t.length,a=i,s=!r;if(e==null)return!a;for(e=z(e);i--;){var l=t[i];if(s&&l[2]?l[1]!==e[l[0]]:!(l[0]in e))return!1}for(;++i<a;){l=t[i];var f=l[0],d=e[f],g=l[1];if(s&&l[2]){if(d===u&&!(f in e))return!1}else{var _=new $e;if(r)var w=r(d,g,f,e,n,_);if(!(w===u?ot(g,d,q|D,r,_):w))return!1}}return!0}function Zu(e){if(!J(e)||hf(e))return!1;var n=tn(e)?Il:ws;return n.test(An(e))}function Pc(e){return V(e)&&de(e)==Yn}function Oc(e){return V(e)&&pe(e)==Ne}function Uc(e){return V(e)&&ur(e.length)&&!!Y[de(e)]}function Xu(e){return typeof e=="function"?e:e==null?be:typeof e=="object"?R(e)?Vu(e[0],e[1]):Qu(e):ma(e)}function ni(e){if(!lt(e))return Ml(e);var n=[];for(var t in z(e))H.call(e,t)&&t!="constructor"&&n.push(t);return n}function Fc(e){if(!J(e))return _f(e);var n=lt(e),t=[];for(var r in e)r=="constructor"&&(n||!H.call(e,r))||t.push(r);return t}function ti(e,n){return e<n}function Ju(e,n){var t=-1,r=xe(e)?p(e.length):[];return pn(e,function(i,a,s){r[++t]=n(i,a,s)}),r}function Qu(e){var n=_i(e);return n.length==1&&n[0][2]?Oo(n[0][0],n[0][1]):function(t){return t===e||ei(t,e,n)}}function Vu(e,n){return xi(e)&&Po(n)?Oo(Ze(e),n):function(t){var r=Ti(t,e);return r===u&&r===n?Ii(t,e):ot(n,r,q|D)}}function Ht(e,n,t,r,i){e!==n&&Jr(n,function(a,s){if(i||(i=new $e),J(a))Wc(e,n,s,t,Ht,r,i);else{var l=r?r(bi(e,s),a,s+"",e,n,i):u;l===u&&(l=a),Zr(e,s,l)}},we)}function Wc(e,n,t,r,i,a,s){var l=bi(e,t),f=bi(n,t),d=s.get(f);if(d){Zr(e,t,d);return}var g=a?a(l,f,t+"",e,n,s):u,_=g===u;if(_){var w=R(f),y=!w&&vn(f),L=!w&&!y&&Nn(f);g=f,w||y||L?R(l)?g=l:ee(l)?g=me(l):y?(_=!1,g=co(f,!0)):L?(_=!1,g=fo(f,!0)):g=[]:ft(f)||En(f)?(g=l,En(l)?g=sa(l):(!J(l)||tn(l))&&(g=Io(f))):_=!1}_&&(s.set(f,g),i(g,f,r,a,s),s.delete(f)),Zr(e,t,g)}function ju(e,n){var t=e.length;if(t)return n+=n<0?t:0,nn(n,t)?e[n]:u}function eo(e,n,t){n.length?n=X(n,function(a){return R(a)?function(s){return Sn(s,a.length===1?a[0]:a)}:a}):n=[be];var r=-1;n=X(n,Ae(S()));var i=Ju(e,function(a,s,l){var f=X(n,function(d){return d(a)});return{criteria:f,index:++r,value:a}});return sl(i,function(a,s){return Zc(a,s,t)})}function Mc(e,n){return no(e,n,function(t,r){return Ii(e,r)})}function no(e,n,t){for(var r=-1,i=n.length,a={};++r<i;){var s=n[r],l=Sn(e,s);t(l,s)&&at(a,dn(s,e),l)}return a}function qc(e){return function(n){return Sn(n,e)}}function ri(e,n,t,r){var i=r?al:In,a=-1,s=n.length,l=e;for(e===n&&(n=me(n)),t&&(l=X(e,Ae(t)));++a<s;)for(var f=0,d=n[a],g=t?t(d):d;(f=i(l,g,f,r))>-1;)l!==e&&Ut.call(l,f,1),Ut.call(e,f,1);return e}function to(e,n){for(var t=e?n.length:0,r=t-1;t--;){var i=n[t];if(t==r||i!==a){var a=i;nn(i)?Ut.call(e,i,1):ai(e,i)}}return e}function ii(e,n){return e+Mt(Mu()*(n-e+1))}function kc(e,n,t,r){for(var i=-1,a=oe(Wt((n-e)/(t||1)),0),s=p(a);a--;)s[r?a:++i]=e,e+=t;return s}function ui(e,n){var t="";if(!e||n<1||n>on)return t;do n%2&&(t+=e),n=Mt(n/2),n&&(e+=e);while(n);return t}function O(e,n){return yi(Uo(e,n,be),e+"")}function Bc(e){return Bu(Dn(e))}function Nc(e,n){var t=Dn(e);return jt(t,yn(n,0,t.length))}function at(e,n,t,r){if(!J(e))return e;n=dn(n,e);for(var i=-1,a=n.length,s=a-1,l=e;l!=null&&++i<a;){var f=Ze(n[i]),d=t;if(f==="__proto__"||f==="constructor"||f==="prototype")return e;if(i!=s){var g=l[f];d=r?r(g,f,l):u,d===u&&(d=J(g)?g:nn(n[i+1])?[]:{})}rt(l,f,d),l=l[f]}return e}var ro=qt?function(e,n){return qt.set(e,n),e}:be,Dc=Ft?function(e,n){return Ft(e,"toString",{configurable:!0,enumerable:!1,value:Oi(n),writable:!0})}:be;function $c(e){return jt(Dn(e))}function We(e,n,t){var r=-1,i=e.length;n<0&&(n=-n>i?0:i+n),t=t>i?i:t,t<0&&(t+=i),i=n>t?0:t-n>>>0,n>>>=0;for(var a=p(i);++r<i;)a[r]=e[r+n];return a}function Hc(e,n){var t;return pn(e,function(r,i,a){return t=n(r,i,a),!t}),!!t}function zt(e,n,t){var r=0,i=e==null?r:e.length;if(typeof n=="number"&&n===n&&i<=Ga){for(;r<i;){var a=r+i>>>1,s=e[a];s!==null&&!Ce(s)&&(t?s<=n:s<n)?r=a+1:i=a}return i}return oi(e,n,be,t)}function oi(e,n,t,r){var i=0,a=e==null?0:e.length;if(a===0)return 0;n=t(n);for(var s=n!==n,l=n===null,f=Ce(n),d=n===u;i<a;){var g=Mt((i+a)/2),_=t(e[g]),w=_!==u,y=_===null,L=_===_,P=Ce(_);if(s)var A=r||L;else d?A=L&&(r||w):l?A=L&&w&&(r||!y):f?A=L&&w&&!y&&(r||!P):y||P?A=!1:A=r?_<=n:_<n;A?i=g+1:a=g}return fe(a,za)}function io(e,n){for(var t=-1,r=e.length,i=0,a=[];++t<r;){var s=e[t],l=n?n(s):s;if(!t||!He(l,f)){var f=l;a[i++]=s===0?0:s}}return a}function uo(e){return typeof e=="number"?e:Ce(e)?gt:+e}function Ee(e){if(typeof e=="string")return e;if(R(e))return X(e,Ee)+"";if(Ce(e))return qu?qu.call(e):"";var n=e+"";return n=="0"&&1/e==-_n?"-0":n}function hn(e,n,t){var r=-1,i=St,a=e.length,s=!0,l=[],f=l;if(t)s=!1,i=Wr;else if(a>=m){var d=n?null:ef(e);if(d)return At(d);s=!1,i=Qn,f=new bn}else f=n?[]:l;e:for(;++r<a;){var g=e[r],_=n?n(g):g;if(g=t||g!==0?g:0,s&&_===_){for(var w=f.length;w--;)if(f[w]===_)continue e;n&&f.push(_),l.push(g)}else i(f,_,t)||(f!==l&&f.push(_),l.push(g))}return l}function ai(e,n){return n=dn(n,e),e=Fo(e,n),e==null||delete e[Ze(Me(n))]}function oo(e,n,t,r){return at(e,n,t(Sn(e,n)),r)}function Gt(e,n,t,r){for(var i=e.length,a=r?i:-1;(r?a--:++a<i)&&n(e[a],a,e););return t?We(e,r?0:a,r?a+1:i):We(e,r?a+1:0,r?i:a)}function ao(e,n){var t=e;return t instanceof F&&(t=t.value()),Mr(n,function(r,i){return i.func.apply(i.thisArg,sn([r],i.args))},t)}function si(e,n,t){var r=e.length;if(r<2)return r?hn(e[0]):[];for(var i=-1,a=p(r);++i<r;)for(var s=e[i],l=-1;++l<r;)l!=i&&(a[i]=it(a[i]||s,e[l],n,t));return hn(ce(a,1),n,t)}function so(e,n,t){for(var r=-1,i=e.length,a=n.length,s={};++r<i;){var l=r<a?n[r]:u;t(s,e[r],l)}return s}function li(e){return ee(e)?e:[]}function ci(e){return typeof e=="function"?e:be}function dn(e,n){return R(e)?e:xi(e,n)?[e]:ko(N(e))}var zc=O;function gn(e,n,t){var r=e.length;return t=t===u?r:t,!n&&t>=r?e:We(e,n,t)}var lo=Pl||function(e){return ae.clearTimeout(e)};function co(e,n){if(n)return e.slice();var t=e.length,r=Pu?Pu(t):new e.constructor(t);return e.copy(r),r}function fi(e){var n=new e.constructor(e.byteLength);return new Pt(n).set(new Pt(e)),n}function Gc(e,n){var t=n?fi(e.buffer):e.buffer;return new e.constructor(t,e.byteOffset,e.byteLength)}function Kc(e){var n=new e.constructor(e.source,Yi.exec(e));return n.lastIndex=e.lastIndex,n}function Yc(e){return tt?z(tt.call(e)):{}}function fo(e,n){var t=n?fi(e.buffer):e.buffer;return new e.constructor(t,e.byteOffset,e.length)}function po(e,n){if(e!==n){var t=e!==u,r=e===null,i=e===e,a=Ce(e),s=n!==u,l=n===null,f=n===n,d=Ce(n);if(!l&&!d&&!a&&e>n||a&&s&&f&&!l&&!d||r&&s&&f||!t&&f||!i)return 1;if(!r&&!a&&!d&&e<n||d&&t&&i&&!r&&!a||l&&t&&i||!s&&i||!f)return-1}return 0}function Zc(e,n,t){for(var r=-1,i=e.criteria,a=n.criteria,s=i.length,l=t.length;++r<s;){var f=po(i[r],a[r]);if(f){if(r>=l)return f;var d=t[r];return f*(d=="desc"?-1:1)}}return e.index-n.index}function ho(e,n,t,r){for(var i=-1,a=e.length,s=t.length,l=-1,f=n.length,d=oe(a-s,0),g=p(f+d),_=!r;++l<f;)g[l]=n[l];for(;++i<s;)(_||i<a)&&(g[t[i]]=e[i]);for(;d--;)g[l++]=e[i++];return g}function go(e,n,t,r){for(var i=-1,a=e.length,s=-1,l=t.length,f=-1,d=n.length,g=oe(a-l,0),_=p(g+d),w=!r;++i<g;)_[i]=e[i];for(var y=i;++f<d;)_[y+f]=n[f];for(;++s<l;)(w||i<a)&&(_[y+t[s]]=e[i++]);return _}function me(e,n){var t=-1,r=e.length;for(n||(n=p(r));++t<r;)n[t]=e[t];return n}function Ye(e,n,t,r){var i=!t;t||(t={});for(var a=-1,s=n.length;++a<s;){var l=n[a],f=r?r(t[l],e[l],l,t,e):u;f===u&&(f=e[l]),i?Ve(t,l,f):rt(t,l,f)}return t}function Xc(e,n){return Ye(e,mi(e),n)}function Jc(e,n){return Ye(e,Ro(e),n)}function Kt(e,n){return function(t,r){var i=R(t)?nl:mc,a=n?n():{};return i(t,e,S(r,2),a)}}function qn(e){return O(function(n,t){var r=-1,i=t.length,a=i>1?t[i-1]:u,s=i>2?t[2]:u;for(a=e.length>3&&typeof a=="function"?(i--,a):u,s&&ge(t[0],t[1],s)&&(a=i<3?u:a,i=1),n=z(n);++r<i;){var l=t[r];l&&e(n,l,r,a)}return n})}function vo(e,n){return function(t,r){if(t==null)return t;if(!xe(t))return e(t,r);for(var i=t.length,a=n?i:-1,s=z(t);(n?a--:++a<i)&&r(s[a],a,s)!==!1;);return t}}function _o(e){return function(n,t,r){for(var i=-1,a=z(n),s=r(n),l=s.length;l--;){var f=s[e?l:++i];if(t(a[f],f,a)===!1)break}return n}}function Qc(e,n,t){var r=n&$,i=st(e);function a(){var s=this&&this!==ae&&this instanceof a?i:e;return s.apply(r?t:this,arguments)}return a}function mo(e){return function(n){n=N(n);var t=Pn(n)?De(n):u,r=t?t[0]:n.charAt(0),i=t?gn(t,1).join(""):n.slice(1);return r[e]()+i}}function kn(e){return function(n){return Mr(va(ga(n).replace(Ds,"")),e,"")}}function st(e){return function(){var n=arguments;switch(n.length){case 0:return new e;case 1:return new e(n[0]);case 2:return new e(n[0],n[1]);case 3:return new e(n[0],n[1],n[2]);case 4:return new e(n[0],n[1],n[2],n[3]);case 5:return new e(n[0],n[1],n[2],n[3],n[4]);case 6:return new e(n[0],n[1],n[2],n[3],n[4],n[5]);case 7:return new e(n[0],n[1],n[2],n[3],n[4],n[5],n[6])}var t=Mn(e.prototype),r=e.apply(t,n);return J(r)?r:t}}function Vc(e,n,t){var r=st(e);function i(){for(var a=arguments.length,s=p(a),l=a,f=Bn(i);l--;)s[l]=arguments[l];var d=a<3&&s[0]!==f&&s[a-1]!==f?[]:ln(s,f);if(a-=d.length,a<t)return So(e,n,Yt,i.placeholder,u,s,d,u,u,t-a);var g=this&&this!==ae&&this instanceof i?r:e;return Le(g,this,s)}return i}function xo(e){return function(n,t,r){var i=z(n);if(!xe(n)){var a=S(t,3);n=se(n),t=function(l){return a(i[l],l,i)}}var s=e(n,t,r);return s>-1?i[a?n[s]:s]:u}}function wo(e){return en(function(n){var t=n.length,r=t,i=Ue.prototype.thru;for(e&&n.reverse();r--;){var a=n[r];if(typeof a!="function")throw new Oe(x);if(i&&!s&&Qt(a)=="wrapper")var s=new Ue([],!0)}for(r=s?r:t;++r<t;){a=n[r];var l=Qt(a),f=l=="wrapper"?vi(a):u;f&&wi(f[0])&&f[1]==(Z|ie|Se|Hn)&&!f[4].length&&f[9]==1?s=s[Qt(f[0])].apply(s,f[3]):s=a.length==1&&wi(a)?s[l]():s.thru(a)}return function(){var d=arguments,g=d[0];if(s&&d.length==1&&R(g))return s.plant(g).value();for(var _=0,w=t?n[_].apply(this,d):g;++_<t;)w=n[_].call(this,w);return w}})}function Yt(e,n,t,r,i,a,s,l,f,d){var g=n&Z,_=n&$,w=n&_e,y=n&(ie|ke),L=n&vr,P=w?u:st(e);function A(){for(var U=arguments.length,W=p(U),Re=U;Re--;)W[Re]=arguments[Re];if(y)var ve=Bn(A),Te=cl(W,ve);if(r&&(W=ho(W,r,i,y)),a&&(W=go(W,a,s,y)),U-=Te,y&&U<d){var ne=ln(W,ve);return So(e,n,Yt,A.placeholder,t,W,ne,l,f,d-U)}var ze=_?t:this,un=w?ze[e]:e;return U=W.length,l?W=xf(W,l):L&&U>1&&W.reverse(),g&&f<U&&(W.length=f),this&&this!==ae&&this instanceof A&&(un=P||st(un)),un.apply(ze,W)}return A}function bo(e,n){return function(t,r){return Ec(t,e,n(r),{})}}function Zt(e,n){return function(t,r){var i;if(t===u&&r===u)return n;if(t!==u&&(i=t),r!==u){if(i===u)return r;typeof t=="string"||typeof r=="string"?(t=Ee(t),r=Ee(r)):(t=uo(t),r=uo(r)),i=e(t,r)}return i}}function pi(e){return en(function(n){return n=X(n,Ae(S())),O(function(t){var r=this;return e(n,function(i){return Le(i,r,t)})})})}function Xt(e,n){n=n===u?" ":Ee(n);var t=n.length;if(t<2)return t?ui(n,e):n;var r=ui(n,Wt(e/On(n)));return Pn(n)?gn(De(r),0,e).join(""):r.slice(0,e)}function jc(e,n,t,r){var i=n&$,a=st(e);function s(){for(var l=-1,f=arguments.length,d=-1,g=r.length,_=p(g+f),w=this&&this!==ae&&this instanceof s?a:e;++d<g;)_[d]=r[d];for(;f--;)_[d++]=arguments[++l];return Le(w,i?t:this,_)}return s}function yo(e){return function(n,t,r){return r&&typeof r!="number"&&ge(n,t,r)&&(t=r=u),n=rn(n),t===u?(t=n,n=0):t=rn(t),r=r===u?n<t?1:-1:rn(r),kc(n,t,r,e)}}function Jt(e){return function(n,t){return typeof n=="string"&&typeof t=="string"||(n=qe(n),t=qe(t)),e(n,t)}}function So(e,n,t,r,i,a,s,l,f,d){var g=n&ie,_=g?s:u,w=g?u:s,y=g?a:u,L=g?u:a;n|=g?Se:le,n&=~(g?le:Se),n&he||(n&=~($|_e));var P=[e,n,i,y,_,L,w,l,f,d],A=t.apply(u,P);return wi(e)&&Wo(A,P),A.placeholder=r,Mo(A,e,n)}function hi(e){var n=ue[e];return function(t,r){if(t=qe(t),r=r==null?0:fe(I(r),292),r&&Wu(t)){var i=(N(t)+"e").split("e"),a=n(i[0]+"e"+(+i[1]+r));return i=(N(a)+"e").split("e"),+(i[0]+"e"+(+i[1]-r))}return n(t)}}var ef=Fn&&1/At(new Fn([,-0]))[1]==_n?function(e){return new Fn(e)}:Wi;function Lo(e){return function(n){var t=pe(n);return t==Be?Hr(n):t==Ne?_l(n):ll(n,e(n))}}function je(e,n,t,r,i,a,s,l){var f=n&_e;if(!f&&typeof e!="function")throw new Oe(x);var d=r?r.length:0;if(d||(n&=~(Se|le),r=i=u),s=s===u?s:oe(I(s),0),l=l===u?l:I(l),d-=i?i.length:0,n&le){var g=r,_=i;r=i=u}var w=f?u:vi(e),y=[e,n,t,r,i,g,_,a,s,l];if(w&&vf(y,w),e=y[0],n=y[1],t=y[2],r=y[3],i=y[4],l=y[9]=y[9]===u?f?0:e.length:oe(y[9]-d,0),!l&&n&(ie|ke)&&(n&=~(ie|ke)),!n||n==$)var L=Qc(e,n,t);else n==ie||n==ke?L=Vc(e,n,l):(n==Se||n==($|Se))&&!i.length?L=jc(e,n,t,r):L=Yt.apply(u,y);var P=w?ro:Wo;return Mo(P(L,y),e,n)}function Ao(e,n,t,r){return e===u||He(e,Un[t])&&!H.call(r,t)?n:e}function Eo(e,n,t,r,i,a){return J(e)&&J(n)&&(a.set(n,e),Ht(e,n,u,Eo,a),a.delete(n)),e}function nf(e){return ft(e)?u:e}function Co(e,n,t,r,i,a){var s=t&q,l=e.length,f=n.length;if(l!=f&&!(s&&f>l))return!1;var d=a.get(e),g=a.get(n);if(d&&g)return d==n&&g==e;var _=-1,w=!0,y=t&D?new bn:u;for(a.set(e,n),a.set(n,e);++_<l;){var L=e[_],P=n[_];if(r)var A=s?r(P,L,_,n,e,a):r(L,P,_,e,n,a);if(A!==u){if(A)continue;w=!1;break}if(y){if(!qr(n,function(U,W){if(!Qn(y,W)&&(L===U||i(L,U,t,r,a)))return y.push(W)})){w=!1;break}}else if(!(L===P||i(L,P,t,r,a))){w=!1;break}}return a.delete(e),a.delete(n),w}function tf(e,n,t,r,i,a,s){switch(t){case Rn:if(e.byteLength!=n.byteLength||e.byteOffset!=n.byteOffset)return!1;e=e.buffer,n=n.buffer;case Jn:return!(e.byteLength!=n.byteLength||!a(new Pt(e),new Pt(n)));case zn:case Gn:case Kn:return He(+e,+n);case _t:return e.name==n.name&&e.message==n.message;case Yn:case Zn:return e==n+"";case Be:var l=Hr;case Ne:var f=r&q;if(l||(l=At),e.size!=n.size&&!f)return!1;var d=s.get(e);if(d)return d==n;r|=D,s.set(e,n);var g=Co(l(e),l(n),r,i,a,s);return s.delete(e),g;case xt:if(tt)return tt.call(e)==tt.call(n)}return!1}function rf(e,n,t,r,i,a){var s=t&q,l=di(e),f=l.length,d=di(n),g=d.length;if(f!=g&&!s)return!1;for(var _=f;_--;){var w=l[_];if(!(s?w in n:H.call(n,w)))return!1}var y=a.get(e),L=a.get(n);if(y&&L)return y==n&&L==e;var P=!0;a.set(e,n),a.set(n,e);for(var A=s;++_<f;){w=l[_];var U=e[w],W=n[w];if(r)var Re=s?r(W,U,w,n,e,a):r(U,W,w,e,n,a);if(!(Re===u?U===W||i(U,W,t,r,a):Re)){P=!1;break}A||(A=w=="constructor")}if(P&&!A){var ve=e.constructor,Te=n.constructor;ve!=Te&&"constructor"in e&&"constructor"in n&&!(typeof ve=="function"&&ve instanceof ve&&typeof Te=="function"&&Te instanceof Te)&&(P=!1)}return a.delete(e),a.delete(n),P}function en(e){return yi(Uo(e,u,$o),e+"")}function di(e){return Ku(e,se,mi)}function gi(e){return Ku(e,we,Ro)}var vi=qt?function(e){return qt.get(e)}:Wi;function Qt(e){for(var n=e.name+"",t=Wn[n],r=H.call(Wn,n)?t.length:0;r--;){var i=t[r],a=i.func;if(a==null||a==e)return i.name}return n}function Bn(e){var n=H.call(o,"placeholder")?o:e;return n.placeholder}function S(){var e=o.iteratee||Ui;return e=e===Ui?Xu:e,arguments.length?e(arguments[0],arguments[1]):e}function Vt(e,n){var t=e.__data__;return pf(n)?t[typeof n=="string"?"string":"hash"]:t.map}function _i(e){for(var n=se(e),t=n.length;t--;){var r=n[t],i=e[r];n[t]=[r,i,Po(i)]}return n}function Ln(e,n){var t=dl(e,n);return Zu(t)?t:u}function uf(e){var n=H.call(e,xn),t=e[xn];try{e[xn]=u;var r=!0}catch{}var i=Tt.call(e);return r&&(n?e[xn]=t:delete e[xn]),i}var mi=Gr?function(e){return e==null?[]:(e=z(e),an(Gr(e),function(n){return Uu.call(e,n)}))}:Mi,Ro=Gr?function(e){for(var n=[];e;)sn(n,mi(e)),e=Ot(e);return n}:Mi,pe=de;(Kr&&pe(new Kr(new ArrayBuffer(1)))!=Rn||jn&&pe(new jn)!=Be||Yr&&pe(Yr.resolve())!=Hi||Fn&&pe(new Fn)!=Ne||et&&pe(new et)!=Xn)&&(pe=function(e){var n=de(e),t=n==Xe?e.constructor:u,r=t?An(t):"";if(r)switch(r){case Nl:return Rn;case Dl:return Be;case $l:return Hi;case Hl:return Ne;case zl:return Xn}return n});function of(e,n,t){for(var r=-1,i=t.length;++r<i;){var a=t[r],s=a.size;switch(a.type){case"drop":e+=s;break;case"dropRight":n-=s;break;case"take":n=fe(n,e+s);break;case"takeRight":e=oe(e,n-s);break}}return{start:e,end:n}}function af(e){var n=e.match(ps);return n?n[1].split(hs):[]}function To(e,n,t){n=dn(n,e);for(var r=-1,i=n.length,a=!1;++r<i;){var s=Ze(n[r]);if(!(a=e!=null&&t(e,s)))break;e=e[s]}return a||++r!=i?a:(i=e==null?0:e.length,!!i&&ur(i)&&nn(s,i)&&(R(e)||En(e)))}function sf(e){var n=e.length,t=new e.constructor(n);return n&&typeof e[0]=="string"&&H.call(e,"index")&&(t.index=e.index,t.input=e.input),t}function Io(e){return typeof e.constructor=="function"&&!lt(e)?Mn(Ot(e)):{}}function lf(e,n,t){var r=e.constructor;switch(n){case Jn:return fi(e);case zn:case Gn:return new r(+e);case Rn:return Gc(e,t);case _r:case mr:case xr:case wr:case br:case yr:case Sr:case Lr:case Ar:return fo(e,t);case Be:return new r;case Kn:case Zn:return new r(e);case Yn:return Kc(e);case Ne:return new r;case xt:return Yc(e)}}function cf(e,n){var t=n.length;if(!t)return e;var r=t-1;return n[r]=(t>1?"& ":"")+n[r],n=n.join(t>2?", ":" "),e.replace(fs,`{
/* [wrapped with `+n+`] */
`)}function ff(e){return R(e)||En(e)||!!(Fu&&e&&e[Fu])}function nn(e,n){var t=typeof e;return n=n??on,!!n&&(t=="number"||t!="symbol"&&ys.test(e))&&e>-1&&e%1==0&&e<n}function ge(e,n,t){if(!J(t))return!1;var r=typeof n;return(r=="number"?xe(t)&&nn(n,t.length):r=="string"&&n in t)?He(t[n],e):!1}function xi(e,n){if(R(e))return!1;var t=typeof e;return t=="number"||t=="symbol"||t=="boolean"||e==null||Ce(e)?!0:as.test(e)||!os.test(e)||n!=null&&e in z(n)}function pf(e){var n=typeof e;return n=="string"||n=="number"||n=="symbol"||n=="boolean"?e!=="__proto__":e===null}function wi(e){var n=Qt(e),t=o[n];if(typeof t!="function"||!(n in F.prototype))return!1;if(e===t)return!0;var r=vi(t);return!!r&&e===r[0]}function hf(e){return!!Iu&&Iu in e}var df=Ct?tn:qi;function lt(e){var n=e&&e.constructor,t=typeof n=="function"&&n.prototype||Un;return e===t}function Po(e){return e===e&&!J(e)}function Oo(e,n){return function(t){return t==null?!1:t[e]===n&&(n!==u||e in z(t))}}function gf(e){var n=rr(e,function(r){return t.size===ye&&t.clear(),r}),t=n.cache;return n}function vf(e,n){var t=e[1],r=n[1],i=t|r,a=i<($|_e|Z),s=r==Z&&t==ie||r==Z&&t==Hn&&e[7].length<=n[8]||r==(Z|Hn)&&n[7].length<=n[8]&&t==ie;if(!(a||s))return e;r&$&&(e[2]=n[2],i|=t&$?0:he);var l=n[3];if(l){var f=e[3];e[3]=f?ho(f,l,n[4]):l,e[4]=f?ln(e[3],G):n[4]}return l=n[5],l&&(f=e[5],e[5]=f?go(f,l,n[6]):l,e[6]=f?ln(e[5],G):n[6]),l=n[7],l&&(e[7]=l),r&Z&&(e[8]=e[8]==null?n[8]:fe(e[8],n[8])),e[9]==null&&(e[9]=n[9]),e[0]=n[0],e[1]=i,e}function _f(e){var n=[];if(e!=null)for(var t in z(e))n.push(t);return n}function mf(e){return Tt.call(e)}function Uo(e,n,t){return n=oe(n===u?e.length-1:n,0),function(){for(var r=arguments,i=-1,a=oe(r.length-n,0),s=p(a);++i<a;)s[i]=r[n+i];i=-1;for(var l=p(n+1);++i<n;)l[i]=r[i];return l[n]=t(s),Le(e,this,l)}}function Fo(e,n){return n.length<2?e:Sn(e,We(n,0,-1))}function xf(e,n){for(var t=e.length,r=fe(n.length,t),i=me(e);r--;){var a=n[r];e[r]=nn(a,t)?i[a]:u}return e}function bi(e,n){if(!(n==="constructor"&&typeof e[n]=="function")&&n!="__proto__")return e[n]}var Wo=qo(ro),ct=Ul||function(e,n){return ae.setTimeout(e,n)},yi=qo(Dc);function Mo(e,n,t){var r=n+"";return yi(e,cf(r,wf(af(r),t)))}function qo(e){var n=0,t=0;return function(){var r=ql(),i=Na-(r-t);if(t=r,i>0){if(++n>=Ba)return arguments[0]}else n=0;return e.apply(u,arguments)}}function jt(e,n){var t=-1,r=e.length,i=r-1;for(n=n===u?r:n;++t<n;){var a=ii(t,i),s=e[a];e[a]=e[t],e[t]=s}return e.length=n,e}var ko=gf(function(e){var n=[];return e.charCodeAt(0)===46&&n.push(""),e.replace(ss,function(t,r,i,a){n.push(i?a.replace(vs,"$1"):r||t)}),n});function Ze(e){if(typeof e=="string"||Ce(e))return e;var n=e+"";return n=="0"&&1/e==-_n?"-0":n}function An(e){if(e!=null){try{return Rt.call(e)}catch{}try{return e+""}catch{}}return""}function wf(e,n){return Pe(Ka,function(t){var r="_."+t[0];n&t[1]&&!St(e,r)&&e.push(r)}),e.sort()}function Bo(e){if(e instanceof F)return e.clone();var n=new Ue(e.__wrapped__,e.__chain__);return n.__actions__=me(e.__actions__),n.__index__=e.__index__,n.__values__=e.__values__,n}function bf(e,n,t){(t?ge(e,n,t):n===u)?n=1:n=oe(I(n),0);var r=e==null?0:e.length;if(!r||n<1)return[];for(var i=0,a=0,s=p(Wt(r/n));i<r;)s[a++]=We(e,i,i+=n);return s}function yf(e){for(var n=-1,t=e==null?0:e.length,r=0,i=[];++n<t;){var a=e[n];a&&(i[r++]=a)}return i}function Sf(){var e=arguments.length;if(!e)return[];for(var n=p(e-1),t=arguments[0],r=e;r--;)n[r-1]=arguments[r];return sn(R(t)?me(t):[t],ce(n,1))}var Lf=O(function(e,n){return ee(e)?it(e,ce(n,1,ee,!0)):[]}),Af=O(function(e,n){var t=Me(n);return ee(t)&&(t=u),ee(e)?it(e,ce(n,1,ee,!0),S(t,2)):[]}),Ef=O(function(e,n){var t=Me(n);return ee(t)&&(t=u),ee(e)?it(e,ce(n,1,ee,!0),u,t):[]});function Cf(e,n,t){var r=e==null?0:e.length;return r?(n=t||n===u?1:I(n),We(e,n<0?0:n,r)):[]}function Rf(e,n,t){var r=e==null?0:e.length;return r?(n=t||n===u?1:I(n),n=r-n,We(e,0,n<0?0:n)):[]}function Tf(e,n){return e&&e.length?Gt(e,S(n,3),!0,!0):[]}function If(e,n){return e&&e.length?Gt(e,S(n,3),!0):[]}function Pf(e,n,t,r){var i=e==null?0:e.length;return i?(t&&typeof t!="number"&&ge(e,n,t)&&(t=0,r=i),yc(e,n,t,r)):[]}function No(e,n,t){var r=e==null?0:e.length;if(!r)return-1;var i=t==null?0:I(t);return i<0&&(i=oe(r+i,0)),Lt(e,S(n,3),i)}function Do(e,n,t){var r=e==null?0:e.length;if(!r)return-1;var i=r-1;return t!==u&&(i=I(t),i=t<0?oe(r+i,0):fe(i,r-1)),Lt(e,S(n,3),i,!0)}function $o(e){var n=e==null?0:e.length;return n?ce(e,1):[]}function Of(e){var n=e==null?0:e.length;return n?ce(e,_n):[]}function Uf(e,n){var t=e==null?0:e.length;return t?(n=n===u?1:I(n),ce(e,n)):[]}function Ff(e){for(var n=-1,t=e==null?0:e.length,r={};++n<t;){var i=e[n];r[i[0]]=i[1]}return r}function Ho(e){return e&&e.length?e[0]:u}function Wf(e,n,t){var r=e==null?0:e.length;if(!r)return-1;var i=t==null?0:I(t);return i<0&&(i=oe(r+i,0)),In(e,n,i)}function Mf(e){var n=e==null?0:e.length;return n?We(e,0,-1):[]}var qf=O(function(e){var n=X(e,li);return n.length&&n[0]===e[0]?jr(n):[]}),kf=O(function(e){var n=Me(e),t=X(e,li);return n===Me(t)?n=u:t.pop(),t.length&&t[0]===e[0]?jr(t,S(n,2)):[]}),Bf=O(function(e){var n=Me(e),t=X(e,li);return n=typeof n=="function"?n:u,n&&t.pop(),t.length&&t[0]===e[0]?jr(t,u,n):[]});function Nf(e,n){return e==null?"":Wl.call(e,n)}function Me(e){var n=e==null?0:e.length;return n?e[n-1]:u}function Df(e,n,t){var r=e==null?0:e.length;if(!r)return-1;var i=r;return t!==u&&(i=I(t),i=i<0?oe(r+i,0):fe(i,r-1)),n===n?xl(e,n,i):Lt(e,yu,i,!0)}function $f(e,n){return e&&e.length?ju(e,I(n)):u}var Hf=O(zo);function zo(e,n){return e&&e.length&&n&&n.length?ri(e,n):e}function zf(e,n,t){return e&&e.length&&n&&n.length?ri(e,n,S(t,2)):e}function Gf(e,n,t){return e&&e.length&&n&&n.length?ri(e,n,u,t):e}var Kf=en(function(e,n){var t=e==null?0:e.length,r=Xr(e,n);return to(e,X(n,function(i){return nn(i,t)?+i:i}).sort(po)),r});function Yf(e,n){var t=[];if(!(e&&e.length))return t;var r=-1,i=[],a=e.length;for(n=S(n,3);++r<a;){var s=e[r];n(s,r,e)&&(t.push(s),i.push(r))}return to(e,i),t}function Si(e){return e==null?e:Bl.call(e)}function Zf(e,n,t){var r=e==null?0:e.length;return r?(t&&typeof t!="number"&&ge(e,n,t)?(n=0,t=r):(n=n==null?0:I(n),t=t===u?r:I(t)),We(e,n,t)):[]}function Xf(e,n){return zt(e,n)}function Jf(e,n,t){return oi(e,n,S(t,2))}function Qf(e,n){var t=e==null?0:e.length;if(t){var r=zt(e,n);if(r<t&&He(e[r],n))return r}return-1}function Vf(e,n){return zt(e,n,!0)}function jf(e,n,t){return oi(e,n,S(t,2),!0)}function ep(e,n){var t=e==null?0:e.length;if(t){var r=zt(e,n,!0)-1;if(He(e[r],n))return r}return-1}function np(e){return e&&e.length?io(e):[]}function tp(e,n){return e&&e.length?io(e,S(n,2)):[]}function rp(e){var n=e==null?0:e.length;return n?We(e,1,n):[]}function ip(e,n,t){return e&&e.length?(n=t||n===u?1:I(n),We(e,0,n<0?0:n)):[]}function up(e,n,t){var r=e==null?0:e.length;return r?(n=t||n===u?1:I(n),n=r-n,We(e,n<0?0:n,r)):[]}function op(e,n){return e&&e.length?Gt(e,S(n,3),!1,!0):[]}function ap(e,n){return e&&e.length?Gt(e,S(n,3)):[]}var sp=O(function(e){return hn(ce(e,1,ee,!0))}),lp=O(function(e){var n=Me(e);return ee(n)&&(n=u),hn(ce(e,1,ee,!0),S(n,2))}),cp=O(function(e){var n=Me(e);return n=typeof n=="function"?n:u,hn(ce(e,1,ee,!0),u,n)});function fp(e){return e&&e.length?hn(e):[]}function pp(e,n){return e&&e.length?hn(e,S(n,2)):[]}function hp(e,n){return n=typeof n=="function"?n:u,e&&e.length?hn(e,u,n):[]}function Li(e){if(!(e&&e.length))return[];var n=0;return e=an(e,function(t){if(ee(t))return n=oe(t.length,n),!0}),Dr(n,function(t){return X(e,kr(t))})}function Go(e,n){if(!(e&&e.length))return[];var t=Li(e);return n==null?t:X(t,function(r){return Le(n,u,r)})}var dp=O(function(e,n){return ee(e)?it(e,n):[]}),gp=O(function(e){return si(an(e,ee))}),vp=O(function(e){var n=Me(e);return ee(n)&&(n=u),si(an(e,ee),S(n,2))}),_p=O(function(e){var n=Me(e);return n=typeof n=="function"?n:u,si(an(e,ee),u,n)}),mp=O(Li);function xp(e,n){return so(e||[],n||[],rt)}function wp(e,n){return so(e||[],n||[],at)}var bp=O(function(e){var n=e.length,t=n>1?e[n-1]:u;return t=typeof t=="function"?(e.pop(),t):u,Go(e,t)});function Ko(e){var n=o(e);return n.__chain__=!0,n}function yp(e,n){return n(e),e}function er(e,n){return n(e)}var Sp=en(function(e){var n=e.length,t=n?e[0]:0,r=this.__wrapped__,i=function(a){return Xr(a,e)};return n>1||this.__actions__.length||!(r instanceof F)||!nn(t)?this.thru(i):(r=r.slice(t,+t+(n?1:0)),r.__actions__.push({func:er,args:[i],thisArg:u}),new Ue(r,this.__chain__).thru(function(a){return n&&!a.length&&a.push(u),a}))});function Lp(){return Ko(this)}function Ap(){return new Ue(this.value(),this.__chain__)}function Ep(){this.__values__===u&&(this.__values__=oa(this.value()));var e=this.__index__>=this.__values__.length,n=e?u:this.__values__[this.__index__++];return{done:e,value:n}}function Cp(){return this}function Rp(e){for(var n,t=this;t instanceof Bt;){var r=Bo(t);r.__index__=0,r.__values__=u,n?i.__wrapped__=r:n=r;var i=r;t=t.__wrapped__}return i.__wrapped__=e,n}function Tp(){var e=this.__wrapped__;if(e instanceof F){var n=e;return this.__actions__.length&&(n=new F(this)),n=n.reverse(),n.__actions__.push({func:er,args:[Si],thisArg:u}),new Ue(n,this.__chain__)}return this.thru(Si)}function Ip(){return ao(this.__wrapped__,this.__actions__)}var Pp=Kt(function(e,n,t){H.call(e,t)?++e[t]:Ve(e,t,1)});function Op(e,n,t){var r=R(e)?wu:bc;return t&&ge(e,n,t)&&(n=u),r(e,S(n,3))}function Up(e,n){var t=R(e)?an:zu;return t(e,S(n,3))}var Fp=xo(No),Wp=xo(Do);function Mp(e,n){return ce(nr(e,n),1)}function qp(e,n){return ce(nr(e,n),_n)}function kp(e,n,t){return t=t===u?1:I(t),ce(nr(e,n),t)}function Yo(e,n){var t=R(e)?Pe:pn;return t(e,S(n,3))}function Zo(e,n){var t=R(e)?tl:Hu;return t(e,S(n,3))}var Bp=Kt(function(e,n,t){H.call(e,t)?e[t].push(n):Ve(e,t,[n])});function Np(e,n,t,r){e=xe(e)?e:Dn(e),t=t&&!r?I(t):0;var i=e.length;return t<0&&(t=oe(i+t,0)),or(e)?t<=i&&e.indexOf(n,t)>-1:!!i&&In(e,n,t)>-1}var Dp=O(function(e,n,t){var r=-1,i=typeof n=="function",a=xe(e)?p(e.length):[];return pn(e,function(s){a[++r]=i?Le(n,s,t):ut(s,n,t)}),a}),$p=Kt(function(e,n,t){Ve(e,t,n)});function nr(e,n){var t=R(e)?X:Ju;return t(e,S(n,3))}function Hp(e,n,t,r){return e==null?[]:(R(n)||(n=n==null?[]:[n]),t=r?u:t,R(t)||(t=t==null?[]:[t]),eo(e,n,t))}var zp=Kt(function(e,n,t){e[t?0:1].push(n)},function(){return[[],[]]});function Gp(e,n,t){var r=R(e)?Mr:Lu,i=arguments.length<3;return r(e,S(n,4),t,i,pn)}function Kp(e,n,t){var r=R(e)?rl:Lu,i=arguments.length<3;return r(e,S(n,4),t,i,Hu)}function Yp(e,n){var t=R(e)?an:zu;return t(e,ir(S(n,3)))}function Zp(e){var n=R(e)?Bu:Bc;return n(e)}function Xp(e,n,t){(t?ge(e,n,t):n===u)?n=1:n=I(n);var r=R(e)?vc:Nc;return r(e,n)}function Jp(e){var n=R(e)?_c:$c;return n(e)}function Qp(e){if(e==null)return 0;if(xe(e))return or(e)?On(e):e.length;var n=pe(e);return n==Be||n==Ne?e.size:ni(e).length}function Vp(e,n,t){var r=R(e)?qr:Hc;return t&&ge(e,n,t)&&(n=u),r(e,S(n,3))}var jp=O(function(e,n){if(e==null)return[];var t=n.length;return t>1&&ge(e,n[0],n[1])?n=[]:t>2&&ge(n[0],n[1],n[2])&&(n=[n[0]]),eo(e,ce(n,1),[])}),tr=Ol||function(){return ae.Date.now()};function eh(e,n){if(typeof n!="function")throw new Oe(x);return e=I(e),function(){if(--e<1)return n.apply(this,arguments)}}function Xo(e,n,t){return n=t?u:n,n=e&&n==null?e.length:n,je(e,Z,u,u,u,u,n)}function Jo(e,n){var t;if(typeof n!="function")throw new Oe(x);return e=I(e),function(){return--e>0&&(t=n.apply(this,arguments)),e<=1&&(n=u),t}}var Ai=O(function(e,n,t){var r=$;if(t.length){var i=ln(t,Bn(Ai));r|=Se}return je(e,r,n,t,i)}),Qo=O(function(e,n,t){var r=$|_e;if(t.length){var i=ln(t,Bn(Qo));r|=Se}return je(n,r,e,t,i)});function Vo(e,n,t){n=t?u:n;var r=je(e,ie,u,u,u,u,u,n);return r.placeholder=Vo.placeholder,r}function jo(e,n,t){n=t?u:n;var r=je(e,ke,u,u,u,u,u,n);return r.placeholder=jo.placeholder,r}function ea(e,n,t){var r,i,a,s,l,f,d=0,g=!1,_=!1,w=!0;if(typeof e!="function")throw new Oe(x);n=qe(n)||0,J(t)&&(g=!!t.leading,_="maxWait"in t,a=_?oe(qe(t.maxWait)||0,n):a,w="trailing"in t?!!t.trailing:w);function y(ne){var ze=r,un=i;return r=i=u,d=ne,s=e.apply(un,ze),s}function L(ne){return d=ne,l=ct(U,n),g?y(ne):s}function P(ne){var ze=ne-f,un=ne-d,xa=n-ze;return _?fe(xa,a-un):xa}function A(ne){var ze=ne-f,un=ne-d;return f===u||ze>=n||ze<0||_&&un>=a}function U(){var ne=tr();if(A(ne))return W(ne);l=ct(U,P(ne))}function W(ne){return l=u,w&&r?y(ne):(r=i=u,s)}function Re(){l!==u&&lo(l),d=0,r=f=i=l=u}function ve(){return l===u?s:W(tr())}function Te(){var ne=tr(),ze=A(ne);if(r=arguments,i=this,f=ne,ze){if(l===u)return L(f);if(_)return lo(l),l=ct(U,n),y(f)}return l===u&&(l=ct(U,n)),s}return Te.cancel=Re,Te.flush=ve,Te}var nh=O(function(e,n){return $u(e,1,n)}),th=O(function(e,n,t){return $u(e,qe(n)||0,t)});function rh(e){return je(e,vr)}function rr(e,n){if(typeof e!="function"||n!=null&&typeof n!="function")throw new Oe(x);var t=function(){var r=arguments,i=n?n.apply(this,r):r[0],a=t.cache;if(a.has(i))return a.get(i);var s=e.apply(this,r);return t.cache=a.set(i,s)||a,s};return t.cache=new(rr.Cache||Qe),t}rr.Cache=Qe;function ir(e){if(typeof e!="function")throw new Oe(x);return function(){var n=arguments;switch(n.length){case 0:return!e.call(this);case 1:return!e.call(this,n[0]);case 2:return!e.call(this,n[0],n[1]);case 3:return!e.call(this,n[0],n[1],n[2])}return!e.apply(this,n)}}function ih(e){return Jo(2,e)}var uh=zc(function(e,n){n=n.length==1&&R(n[0])?X(n[0],Ae(S())):X(ce(n,1),Ae(S()));var t=n.length;return O(function(r){for(var i=-1,a=fe(r.length,t);++i<a;)r[i]=n[i].call(this,r[i]);return Le(e,this,r)})}),Ei=O(function(e,n){var t=ln(n,Bn(Ei));return je(e,Se,u,n,t)}),na=O(function(e,n){var t=ln(n,Bn(na));return je(e,le,u,n,t)}),oh=en(function(e,n){return je(e,Hn,u,u,u,n)});function ah(e,n){if(typeof e!="function")throw new Oe(x);return n=n===u?n:I(n),O(e,n)}function sh(e,n){if(typeof e!="function")throw new Oe(x);return n=n==null?0:oe(I(n),0),O(function(t){var r=t[n],i=gn(t,0,n);return r&&sn(i,r),Le(e,this,i)})}function lh(e,n,t){var r=!0,i=!0;if(typeof e!="function")throw new Oe(x);return J(t)&&(r="leading"in t?!!t.leading:r,i="trailing"in t?!!t.trailing:i),ea(e,n,{leading:r,maxWait:n,trailing:i})}function ch(e){return Xo(e,1)}function fh(e,n){return Ei(ci(n),e)}function ph(){if(!arguments.length)return[];var e=arguments[0];return R(e)?e:[e]}function hh(e){return Fe(e,M)}function dh(e,n){return n=typeof n=="function"?n:u,Fe(e,M,n)}function gh(e){return Fe(e,re|M)}function vh(e,n){return n=typeof n=="function"?n:u,Fe(e,re|M,n)}function _h(e,n){return n==null||Du(e,n,se(n))}function He(e,n){return e===n||e!==e&&n!==n}var mh=Jt(Vr),xh=Jt(function(e,n){return e>=n}),En=Yu(function(){return arguments}())?Yu:function(e){return V(e)&&H.call(e,"callee")&&!Uu.call(e,"callee")},R=p.isArray,wh=du?Ae(du):Cc;function xe(e){return e!=null&&ur(e.length)&&!tn(e)}function ee(e){return V(e)&&xe(e)}function bh(e){return e===!0||e===!1||V(e)&&de(e)==zn}var vn=Fl||qi,yh=gu?Ae(gu):Rc;function Sh(e){return V(e)&&e.nodeType===1&&!ft(e)}function Lh(e){if(e==null)return!0;if(xe(e)&&(R(e)||typeof e=="string"||typeof e.splice=="function"||vn(e)||Nn(e)||En(e)))return!e.length;var n=pe(e);if(n==Be||n==Ne)return!e.size;if(lt(e))return!ni(e).length;for(var t in e)if(H.call(e,t))return!1;return!0}function Ah(e,n){return ot(e,n)}function Eh(e,n,t){t=typeof t=="function"?t:u;var r=t?t(e,n):u;return r===u?ot(e,n,u,t):!!r}function Ci(e){if(!V(e))return!1;var n=de(e);return n==_t||n==Za||typeof e.message=="string"&&typeof e.name=="string"&&!ft(e)}function Ch(e){return typeof e=="number"&&Wu(e)}function tn(e){if(!J(e))return!1;var n=de(e);return n==mt||n==$i||n==Ya||n==Ja}function ta(e){return typeof e=="number"&&e==I(e)}function ur(e){return typeof e=="number"&&e>-1&&e%1==0&&e<=on}function J(e){var n=typeof e;return e!=null&&(n=="object"||n=="function")}function V(e){return e!=null&&typeof e=="object"}var ra=vu?Ae(vu):Ic;function Rh(e,n){return e===n||ei(e,n,_i(n))}function Th(e,n,t){return t=typeof t=="function"?t:u,ei(e,n,_i(n),t)}function Ih(e){return ia(e)&&e!=+e}function Ph(e){if(df(e))throw new C(k);return Zu(e)}function Oh(e){return e===null}function Uh(e){return e==null}function ia(e){return typeof e=="number"||V(e)&&de(e)==Kn}function ft(e){if(!V(e)||de(e)!=Xe)return!1;var n=Ot(e);if(n===null)return!0;var t=H.call(n,"constructor")&&n.constructor;return typeof t=="function"&&t instanceof t&&Rt.call(t)==Rl}var Ri=_u?Ae(_u):Pc;function Fh(e){return ta(e)&&e>=-on&&e<=on}var ua=mu?Ae(mu):Oc;function or(e){return typeof e=="string"||!R(e)&&V(e)&&de(e)==Zn}function Ce(e){return typeof e=="symbol"||V(e)&&de(e)==xt}var Nn=xu?Ae(xu):Uc;function Wh(e){return e===u}function Mh(e){return V(e)&&pe(e)==Xn}function qh(e){return V(e)&&de(e)==Va}var kh=Jt(ti),Bh=Jt(function(e,n){return e<=n});function oa(e){if(!e)return[];if(xe(e))return or(e)?De(e):me(e);if(Vn&&e[Vn])return vl(e[Vn]());var n=pe(e),t=n==Be?Hr:n==Ne?At:Dn;return t(e)}function rn(e){if(!e)return e===0?e:0;if(e=qe(e),e===_n||e===-_n){var n=e<0?-1:1;return n*Ha}return e===e?e:0}function I(e){var n=rn(e),t=n%1;return n===n?t?n-t:n:0}function aa(e){return e?yn(I(e),0,Ge):0}function qe(e){if(typeof e=="number")return e;if(Ce(e))return gt;if(J(e)){var n=typeof e.valueOf=="function"?e.valueOf():e;e=J(n)?n+"":n}if(typeof e!="string")return e===0?e:+e;e=Au(e);var t=xs.test(e);return t||bs.test(e)?js(e.slice(2),t?2:8):ms.test(e)?gt:+e}function sa(e){return Ye(e,we(e))}function Nh(e){return e?yn(I(e),-on,on):e===0?e:0}function N(e){return e==null?"":Ee(e)}var Dh=qn(function(e,n){if(lt(n)||xe(n)){Ye(n,se(n),e);return}for(var t in n)H.call(n,t)&&rt(e,t,n[t])}),la=qn(function(e,n){Ye(n,we(n),e)}),ar=qn(function(e,n,t,r){Ye(n,we(n),e,r)}),$h=qn(function(e,n,t,r){Ye(n,se(n),e,r)}),Hh=en(Xr);function zh(e,n){var t=Mn(e);return n==null?t:Nu(t,n)}var Gh=O(function(e,n){e=z(e);var t=-1,r=n.length,i=r>2?n[2]:u;for(i&&ge(n[0],n[1],i)&&(r=1);++t<r;)for(var a=n[t],s=we(a),l=-1,f=s.length;++l<f;){var d=s[l],g=e[d];(g===u||He(g,Un[d])&&!H.call(e,d))&&(e[d]=a[d])}return e}),Kh=O(function(e){return e.push(u,Eo),Le(ca,u,e)});function Yh(e,n){return bu(e,S(n,3),Ke)}function Zh(e,n){return bu(e,S(n,3),Qr)}function Xh(e,n){return e==null?e:Jr(e,S(n,3),we)}function Jh(e,n){return e==null?e:Gu(e,S(n,3),we)}function Qh(e,n){return e&&Ke(e,S(n,3))}function Vh(e,n){return e&&Qr(e,S(n,3))}function jh(e){return e==null?[]:$t(e,se(e))}function ed(e){return e==null?[]:$t(e,we(e))}function Ti(e,n,t){var r=e==null?u:Sn(e,n);return r===u?t:r}function nd(e,n){return e!=null&&To(e,n,Sc)}function Ii(e,n){return e!=null&&To(e,n,Lc)}var td=bo(function(e,n,t){n!=null&&typeof n.toString!="function"&&(n=Tt.call(n)),e[n]=t},Oi(be)),rd=bo(function(e,n,t){n!=null&&typeof n.toString!="function"&&(n=Tt.call(n)),H.call(e,n)?e[n].push(t):e[n]=[t]},S),id=O(ut);function se(e){return xe(e)?ku(e):ni(e)}function we(e){return xe(e)?ku(e,!0):Fc(e)}function ud(e,n){var t={};return n=S(n,3),Ke(e,function(r,i,a){Ve(t,n(r,i,a),r)}),t}function od(e,n){var t={};return n=S(n,3),Ke(e,function(r,i,a){Ve(t,i,n(r,i,a))}),t}var ad=qn(function(e,n,t){Ht(e,n,t)}),ca=qn(function(e,n,t,r){Ht(e,n,t,r)}),sd=en(function(e,n){var t={};if(e==null)return t;var r=!1;n=X(n,function(a){return a=dn(a,e),r||(r=a.length>1),a}),Ye(e,gi(e),t),r&&(t=Fe(t,re|E|M,nf));for(var i=n.length;i--;)ai(t,n[i]);return t});function ld(e,n){return fa(e,ir(S(n)))}var cd=en(function(e,n){return e==null?{}:Mc(e,n)});function fa(e,n){if(e==null)return{};var t=X(gi(e),function(r){return[r]});return n=S(n),no(e,t,function(r,i){return n(r,i[0])})}function fd(e,n,t){n=dn(n,e);var r=-1,i=n.length;for(i||(i=1,e=u);++r<i;){var a=e==null?u:e[Ze(n[r])];a===u&&(r=i,a=t),e=tn(a)?a.call(e):a}return e}function pd(e,n,t){return e==null?e:at(e,n,t)}function hd(e,n,t,r){return r=typeof r=="function"?r:u,e==null?e:at(e,n,t,r)}var pa=Lo(se),ha=Lo(we);function dd(e,n,t){var r=R(e),i=r||vn(e)||Nn(e);if(n=S(n,4),t==null){var a=e&&e.constructor;i?t=r?new a:[]:J(e)?t=tn(a)?Mn(Ot(e)):{}:t={}}return(i?Pe:Ke)(e,function(s,l,f){return n(t,s,l,f)}),t}function gd(e,n){return e==null?!0:ai(e,n)}function vd(e,n,t){return e==null?e:oo(e,n,ci(t))}function _d(e,n,t,r){return r=typeof r=="function"?r:u,e==null?e:oo(e,n,ci(t),r)}function Dn(e){return e==null?[]:$r(e,se(e))}function md(e){return e==null?[]:$r(e,we(e))}function xd(e,n,t){return t===u&&(t=n,n=u),t!==u&&(t=qe(t),t=t===t?t:0),n!==u&&(n=qe(n),n=n===n?n:0),yn(qe(e),n,t)}function wd(e,n,t){return n=rn(n),t===u?(t=n,n=0):t=rn(t),e=qe(e),Ac(e,n,t)}function bd(e,n,t){if(t&&typeof t!="boolean"&&ge(e,n,t)&&(n=t=u),t===u&&(typeof n=="boolean"?(t=n,n=u):typeof e=="boolean"&&(t=e,e=u)),e===u&&n===u?(e=0,n=1):(e=rn(e),n===u?(n=e,e=0):n=rn(n)),e>n){var r=e;e=n,n=r}if(t||e%1||n%1){var i=Mu();return fe(e+i*(n-e+Vs("1e-"+((i+"").length-1))),n)}return ii(e,n)}var yd=kn(function(e,n,t){return n=n.toLowerCase(),e+(t?da(n):n)});function da(e){return Pi(N(e).toLowerCase())}function ga(e){return e=N(e),e&&e.replace(Ss,fl).replace($s,"")}function Sd(e,n,t){e=N(e),n=Ee(n);var r=e.length;t=t===u?r:yn(I(t),0,r);var i=t;return t-=n.length,t>=0&&e.slice(t,i)==n}function Ld(e){return e=N(e),e&&rs.test(e)?e.replace(Gi,pl):e}function Ad(e){return e=N(e),e&&ls.test(e)?e.replace(Er,"\\$&"):e}var Ed=kn(function(e,n,t){return e+(t?"-":"")+n.toLowerCase()}),Cd=kn(function(e,n,t){return e+(t?" ":"")+n.toLowerCase()}),Rd=mo("toLowerCase");function Td(e,n,t){e=N(e),n=I(n);var r=n?On(e):0;if(!n||r>=n)return e;var i=(n-r)/2;return Xt(Mt(i),t)+e+Xt(Wt(i),t)}function Id(e,n,t){e=N(e),n=I(n);var r=n?On(e):0;return n&&r<n?e+Xt(n-r,t):e}function Pd(e,n,t){e=N(e),n=I(n);var r=n?On(e):0;return n&&r<n?Xt(n-r,t)+e:e}function Od(e,n,t){return t||n==null?n=0:n&&(n=+n),kl(N(e).replace(Cr,""),n||0)}function Ud(e,n,t){return(t?ge(e,n,t):n===u)?n=1:n=I(n),ui(N(e),n)}function Fd(){var e=arguments,n=N(e[0]);return e.length<3?n:n.replace(e[1],e[2])}var Wd=kn(function(e,n,t){return e+(t?"_":"")+n.toLowerCase()});function Md(e,n,t){return t&&typeof t!="number"&&ge(e,n,t)&&(n=t=u),t=t===u?Ge:t>>>0,t?(e=N(e),e&&(typeof n=="string"||n!=null&&!Ri(n))&&(n=Ee(n),!n&&Pn(e))?gn(De(e),0,t):e.split(n,t)):[]}var qd=kn(function(e,n,t){return e+(t?" ":"")+Pi(n)});function kd(e,n,t){return e=N(e),t=t==null?0:yn(I(t),0,e.length),n=Ee(n),e.slice(t,t+n.length)==n}function Bd(e,n,t){var r=o.templateSettings;t&&ge(e,n,t)&&(n=u),e=N(e),n=ar({},n,r,Ao);var i=ar({},n.imports,r.imports,Ao),a=se(i),s=$r(i,a),l,f,d=0,g=n.interpolate||wt,_="__p += '",w=zr((n.escape||wt).source+"|"+g.source+"|"+(g===Ki?_s:wt).source+"|"+(n.evaluate||wt).source+"|$","g"),y="//# sourceURL="+(H.call(n,"sourceURL")?(n.sourceURL+"").replace(/\s/g," "):"lodash.templateSources["+ ++Ys+"]")+`
`;e.replace(w,function(A,U,W,Re,ve,Te){return W||(W=Re),_+=e.slice(d,Te).replace(Ls,hl),U&&(l=!0,_+=`' +
__e(`+U+`) +
'`),ve&&(f=!0,_+=`';
`+ve+`;
__p += '`),W&&(_+=`' +
((__t = (`+W+`)) == null ? '' : __t) +
'`),d=Te+A.length,A}),_+=`';
`;var L=H.call(n,"variable")&&n.variable;if(!L)_=`with (obj) {
`+_+`
}
`;else if(gs.test(L))throw new C(T);_=(f?_.replace(ja,""):_).replace(es,"$1").replace(ns,"$1;"),_="function("+(L||"obj")+`) {
`+(L?"":`obj || (obj = {});
`)+"var __t, __p = ''"+(l?", __e = _.escape":"")+(f?`, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
`:`;
`)+_+`return __p
}`;var P=_a(function(){return B(a,y+"return "+_).apply(u,s)});if(P.source=_,Ci(P))throw P;return P}function Nd(e){return N(e).toLowerCase()}function Dd(e){return N(e).toUpperCase()}function $d(e,n,t){if(e=N(e),e&&(t||n===u))return Au(e);if(!e||!(n=Ee(n)))return e;var r=De(e),i=De(n),a=Eu(r,i),s=Cu(r,i)+1;return gn(r,a,s).join("")}function Hd(e,n,t){if(e=N(e),e&&(t||n===u))return e.slice(0,Tu(e)+1);if(!e||!(n=Ee(n)))return e;var r=De(e),i=Cu(r,De(n))+1;return gn(r,0,i).join("")}function zd(e,n,t){if(e=N(e),e&&(t||n===u))return e.replace(Cr,"");if(!e||!(n=Ee(n)))return e;var r=De(e),i=Eu(r,De(n));return gn(r,i).join("")}function Gd(e,n){var t=qa,r=ka;if(J(n)){var i="separator"in n?n.separator:i;t="length"in n?I(n.length):t,r="omission"in n?Ee(n.omission):r}e=N(e);var a=e.length;if(Pn(e)){var s=De(e);a=s.length}if(t>=a)return e;var l=t-On(r);if(l<1)return r;var f=s?gn(s,0,l).join(""):e.slice(0,l);if(i===u)return f+r;if(s&&(l+=f.length-l),Ri(i)){if(e.slice(l).search(i)){var d,g=f;for(i.global||(i=zr(i.source,N(Yi.exec(i))+"g")),i.lastIndex=0;d=i.exec(g);)var _=d.index;f=f.slice(0,_===u?l:_)}}else if(e.indexOf(Ee(i),l)!=l){var w=f.lastIndexOf(i);w>-1&&(f=f.slice(0,w))}return f+r}function Kd(e){return e=N(e),e&&ts.test(e)?e.replace(zi,wl):e}var Yd=kn(function(e,n,t){return e+(t?" ":"")+n.toUpperCase()}),Pi=mo("toUpperCase");function va(e,n,t){return e=N(e),n=t?u:n,n===u?gl(e)?Sl(e):ol(e):e.match(n)||[]}var _a=O(function(e,n){try{return Le(e,u,n)}catch(t){return Ci(t)?t:new C(t)}}),Zd=en(function(e,n){return Pe(n,function(t){t=Ze(t),Ve(e,t,Ai(e[t],e))}),e});function Xd(e){var n=e==null?0:e.length,t=S();return e=n?X(e,function(r){if(typeof r[1]!="function")throw new Oe(x);return[t(r[0]),r[1]]}):[],O(function(r){for(var i=-1;++i<n;){var a=e[i];if(Le(a[0],this,r))return Le(a[1],this,r)}})}function Jd(e){return wc(Fe(e,re))}function Oi(e){return function(){return e}}function Qd(e,n){return e==null||e!==e?n:e}var Vd=wo(),jd=wo(!0);function be(e){return e}function Ui(e){return Xu(typeof e=="function"?e:Fe(e,re))}function eg(e){return Qu(Fe(e,re))}function ng(e,n){return Vu(e,Fe(n,re))}var tg=O(function(e,n){return function(t){return ut(t,e,n)}}),rg=O(function(e,n){return function(t){return ut(e,t,n)}});function Fi(e,n,t){var r=se(n),i=$t(n,r);t==null&&!(J(n)&&(i.length||!r.length))&&(t=n,n=e,e=this,i=$t(n,se(n)));var a=!(J(t)&&"chain"in t)||!!t.chain,s=tn(e);return Pe(i,function(l){var f=n[l];e[l]=f,s&&(e.prototype[l]=function(){var d=this.__chain__;if(a||d){var g=e(this.__wrapped__),_=g.__actions__=me(this.__actions__);return _.push({func:f,args:arguments,thisArg:e}),g.__chain__=d,g}return f.apply(e,sn([this.value()],arguments))})}),e}function ig(){return ae._===this&&(ae._=Tl),this}function Wi(){}function ug(e){return e=I(e),O(function(n){return ju(n,e)})}var og=pi(X),ag=pi(wu),sg=pi(qr);function ma(e){return xi(e)?kr(Ze(e)):qc(e)}function lg(e){return function(n){return e==null?u:Sn(e,n)}}var cg=yo(),fg=yo(!0);function Mi(){return[]}function qi(){return!1}function pg(){return{}}function hg(){return""}function dg(){return!0}function gg(e,n){if(e=I(e),e<1||e>on)return[];var t=Ge,r=fe(e,Ge);n=S(n),e-=Ge;for(var i=Dr(r,n);++t<e;)n(t);return i}function vg(e){return R(e)?X(e,Ze):Ce(e)?[e]:me(ko(N(e)))}function _g(e){var n=++Cl;return N(e)+n}var mg=Zt(function(e,n){return e+n},0),xg=hi("ceil"),wg=Zt(function(e,n){return e/n},1),bg=hi("floor");function yg(e){return e&&e.length?Dt(e,be,Vr):u}function Sg(e,n){return e&&e.length?Dt(e,S(n,2),Vr):u}function Lg(e){return Su(e,be)}function Ag(e,n){return Su(e,S(n,2))}function Eg(e){return e&&e.length?Dt(e,be,ti):u}function Cg(e,n){return e&&e.length?Dt(e,S(n,2),ti):u}var Rg=Zt(function(e,n){return e*n},1),Tg=hi("round"),Ig=Zt(function(e,n){return e-n},0);function Pg(e){return e&&e.length?Nr(e,be):0}function Og(e,n){return e&&e.length?Nr(e,S(n,2)):0}return o.after=eh,o.ary=Xo,o.assign=Dh,o.assignIn=la,o.assignInWith=ar,o.assignWith=$h,o.at=Hh,o.before=Jo,o.bind=Ai,o.bindAll=Zd,o.bindKey=Qo,o.castArray=ph,o.chain=Ko,o.chunk=bf,o.compact=yf,o.concat=Sf,o.cond=Xd,o.conforms=Jd,o.constant=Oi,o.countBy=Pp,o.create=zh,o.curry=Vo,o.curryRight=jo,o.debounce=ea,o.defaults=Gh,o.defaultsDeep=Kh,o.defer=nh,o.delay=th,o.difference=Lf,o.differenceBy=Af,o.differenceWith=Ef,o.drop=Cf,o.dropRight=Rf,o.dropRightWhile=Tf,o.dropWhile=If,o.fill=Pf,o.filter=Up,o.flatMap=Mp,o.flatMapDeep=qp,o.flatMapDepth=kp,o.flatten=$o,o.flattenDeep=Of,o.flattenDepth=Uf,o.flip=rh,o.flow=Vd,o.flowRight=jd,o.fromPairs=Ff,o.functions=jh,o.functionsIn=ed,o.groupBy=Bp,o.initial=Mf,o.intersection=qf,o.intersectionBy=kf,o.intersectionWith=Bf,o.invert=td,o.invertBy=rd,o.invokeMap=Dp,o.iteratee=Ui,o.keyBy=$p,o.keys=se,o.keysIn=we,o.map=nr,o.mapKeys=ud,o.mapValues=od,o.matches=eg,o.matchesProperty=ng,o.memoize=rr,o.merge=ad,o.mergeWith=ca,o.method=tg,o.methodOf=rg,o.mixin=Fi,o.negate=ir,o.nthArg=ug,o.omit=sd,o.omitBy=ld,o.once=ih,o.orderBy=Hp,o.over=og,o.overArgs=uh,o.overEvery=ag,o.overSome=sg,o.partial=Ei,o.partialRight=na,o.partition=zp,o.pick=cd,o.pickBy=fa,o.property=ma,o.propertyOf=lg,o.pull=Hf,o.pullAll=zo,o.pullAllBy=zf,o.pullAllWith=Gf,o.pullAt=Kf,o.range=cg,o.rangeRight=fg,o.rearg=oh,o.reject=Yp,o.remove=Yf,o.rest=ah,o.reverse=Si,o.sampleSize=Xp,o.set=pd,o.setWith=hd,o.shuffle=Jp,o.slice=Zf,o.sortBy=jp,o.sortedUniq=np,o.sortedUniqBy=tp,o.split=Md,o.spread=sh,o.tail=rp,o.take=ip,o.takeRight=up,o.takeRightWhile=op,o.takeWhile=ap,o.tap=yp,o.throttle=lh,o.thru=er,o.toArray=oa,o.toPairs=pa,o.toPairsIn=ha,o.toPath=vg,o.toPlainObject=sa,o.transform=dd,o.unary=ch,o.union=sp,o.unionBy=lp,o.unionWith=cp,o.uniq=fp,o.uniqBy=pp,o.uniqWith=hp,o.unset=gd,o.unzip=Li,o.unzipWith=Go,o.update=vd,o.updateWith=_d,o.values=Dn,o.valuesIn=md,o.without=dp,o.words=va,o.wrap=fh,o.xor=gp,o.xorBy=vp,o.xorWith=_p,o.zip=mp,o.zipObject=xp,o.zipObjectDeep=wp,o.zipWith=bp,o.entries=pa,o.entriesIn=ha,o.extend=la,o.extendWith=ar,Fi(o,o),o.add=mg,o.attempt=_a,o.camelCase=yd,o.capitalize=da,o.ceil=xg,o.clamp=xd,o.clone=hh,o.cloneDeep=gh,o.cloneDeepWith=vh,o.cloneWith=dh,o.conformsTo=_h,o.deburr=ga,o.defaultTo=Qd,o.divide=wg,o.endsWith=Sd,o.eq=He,o.escape=Ld,o.escapeRegExp=Ad,o.every=Op,o.find=Fp,o.findIndex=No,o.findKey=Yh,o.findLast=Wp,o.findLastIndex=Do,o.findLastKey=Zh,o.floor=bg,o.forEach=Yo,o.forEachRight=Zo,o.forIn=Xh,o.forInRight=Jh,o.forOwn=Qh,o.forOwnRight=Vh,o.get=Ti,o.gt=mh,o.gte=xh,o.has=nd,o.hasIn=Ii,o.head=Ho,o.identity=be,o.includes=Np,o.indexOf=Wf,o.inRange=wd,o.invoke=id,o.isArguments=En,o.isArray=R,o.isArrayBuffer=wh,o.isArrayLike=xe,o.isArrayLikeObject=ee,o.isBoolean=bh,o.isBuffer=vn,o.isDate=yh,o.isElement=Sh,o.isEmpty=Lh,o.isEqual=Ah,o.isEqualWith=Eh,o.isError=Ci,o.isFinite=Ch,o.isFunction=tn,o.isInteger=ta,o.isLength=ur,o.isMap=ra,o.isMatch=Rh,o.isMatchWith=Th,o.isNaN=Ih,o.isNative=Ph,o.isNil=Uh,o.isNull=Oh,o.isNumber=ia,o.isObject=J,o.isObjectLike=V,o.isPlainObject=ft,o.isRegExp=Ri,o.isSafeInteger=Fh,o.isSet=ua,o.isString=or,o.isSymbol=Ce,o.isTypedArray=Nn,o.isUndefined=Wh,o.isWeakMap=Mh,o.isWeakSet=qh,o.join=Nf,o.kebabCase=Ed,o.last=Me,o.lastIndexOf=Df,o.lowerCase=Cd,o.lowerFirst=Rd,o.lt=kh,o.lte=Bh,o.max=yg,o.maxBy=Sg,o.mean=Lg,o.meanBy=Ag,o.min=Eg,o.minBy=Cg,o.stubArray=Mi,o.stubFalse=qi,o.stubObject=pg,o.stubString=hg,o.stubTrue=dg,o.multiply=Rg,o.nth=$f,o.noConflict=ig,o.noop=Wi,o.now=tr,o.pad=Td,o.padEnd=Id,o.padStart=Pd,o.parseInt=Od,o.random=bd,o.reduce=Gp,o.reduceRight=Kp,o.repeat=Ud,o.replace=Fd,o.result=fd,o.round=Tg,o.runInContext=c,o.sample=Zp,o.size=Qp,o.snakeCase=Wd,o.some=Vp,o.sortedIndex=Xf,o.sortedIndexBy=Jf,o.sortedIndexOf=Qf,o.sortedLastIndex=Vf,o.sortedLastIndexBy=jf,o.sortedLastIndexOf=ep,o.startCase=qd,o.startsWith=kd,o.subtract=Ig,o.sum=Pg,o.sumBy=Og,o.template=Bd,o.times=gg,o.toFinite=rn,o.toInteger=I,o.toLength=aa,o.toLower=Nd,o.toNumber=qe,o.toSafeInteger=Nh,o.toString=N,o.toUpper=Dd,o.trim=$d,o.trimEnd=Hd,o.trimStart=zd,o.truncate=Gd,o.unescape=Kd,o.uniqueId=_g,o.upperCase=Yd,o.upperFirst=Pi,o.each=Yo,o.eachRight=Zo,o.first=Ho,Fi(o,function(){var e={};return Ke(o,function(n,t){H.call(o.prototype,t)||(e[t]=n)}),e}(),{chain:!1}),o.VERSION=v,Pe(["bind","bindKey","curry","curryRight","partial","partialRight"],function(e){o[e].placeholder=o}),Pe(["drop","take"],function(e,n){F.prototype[e]=function(t){t=t===u?1:oe(I(t),0);var r=this.__filtered__&&!n?new F(this):this.clone();return r.__filtered__?r.__takeCount__=fe(t,r.__takeCount__):r.__views__.push({size:fe(t,Ge),type:e+(r.__dir__<0?"Right":"")}),r},F.prototype[e+"Right"]=function(t){return this.reverse()[e](t).reverse()}}),Pe(["filter","map","takeWhile"],function(e,n){var t=n+1,r=t==Di||t==$a;F.prototype[e]=function(i){var a=this.clone();return a.__iteratees__.push({iteratee:S(i,3),type:t}),a.__filtered__=a.__filtered__||r,a}}),Pe(["head","last"],function(e,n){var t="take"+(n?"Right":"");F.prototype[e]=function(){return this[t](1).value()[0]}}),Pe(["initial","tail"],function(e,n){var t="drop"+(n?"":"Right");F.prototype[e]=function(){return this.__filtered__?new F(this):this[t](1)}}),F.prototype.compact=function(){return this.filter(be)},F.prototype.find=function(e){return this.filter(e).head()},F.prototype.findLast=function(e){return this.reverse().find(e)},F.prototype.invokeMap=O(function(e,n){return typeof e=="function"?new F(this):this.map(function(t){return ut(t,e,n)})}),F.prototype.reject=function(e){return this.filter(ir(S(e)))},F.prototype.slice=function(e,n){e=I(e);var t=this;return t.__filtered__&&(e>0||n<0)?new F(t):(e<0?t=t.takeRight(-e):e&&(t=t.drop(e)),n!==u&&(n=I(n),t=n<0?t.dropRight(-n):t.take(n-e)),t)},F.prototype.takeRightWhile=function(e){return this.reverse().takeWhile(e).reverse()},F.prototype.toArray=function(){return this.take(Ge)},Ke(F.prototype,function(e,n){var t=/^(?:filter|find|map|reject)|While$/.test(n),r=/^(?:head|last)$/.test(n),i=o[r?"take"+(n=="last"?"Right":""):n],a=r||/^find/.test(n);i&&(o.prototype[n]=function(){var s=this.__wrapped__,l=r?[1]:arguments,f=s instanceof F,d=l[0],g=f||R(s),_=function(U){var W=i.apply(o,sn([U],l));return r&&w?W[0]:W};g&&t&&typeof d=="function"&&d.length!=1&&(f=g=!1);var w=this.__chain__,y=!!this.__actions__.length,L=a&&!w,P=f&&!y;if(!a&&g){s=P?s:new F(this);var A=e.apply(s,l);return A.__actions__.push({func:er,args:[_],thisArg:u}),new Ue(A,w)}return L&&P?e.apply(this,l):(A=this.thru(_),L?r?A.value()[0]:A.value():A)})}),Pe(["pop","push","shift","sort","splice","unshift"],function(e){var n=Et[e],t=/^(?:push|sort|unshift)$/.test(e)?"tap":"thru",r=/^(?:pop|shift)$/.test(e);o.prototype[e]=function(){var i=arguments;if(r&&!this.__chain__){var a=this.value();return n.apply(R(a)?a:[],i)}return this[t](function(s){return n.apply(R(s)?s:[],i)})}}),Ke(F.prototype,function(e,n){var t=o[n];if(t){var r=t.name+"";H.call(Wn,r)||(Wn[r]=[]),Wn[r].push({name:n,func:t})}}),Wn[Yt(u,_e).name]=[{name:"wrapper",func:u}],F.prototype.clone=Gl,F.prototype.reverse=Kl,F.prototype.value=Yl,o.prototype.at=Sp,o.prototype.chain=Lp,o.prototype.commit=Ap,o.prototype.next=Ep,o.prototype.plant=Rp,o.prototype.reverse=Tp,o.prototype.toJSON=o.prototype.valueOf=o.prototype.value=Ip,o.prototype.first=o.prototype.head,Vn&&(o.prototype[Vn]=Cp),o},cn=Ll();typeof define=="function"&&typeof define.amd=="object"&&define.amd?(ae._=cn,define(function(){return cn})):mn?((mn.exports=cn)._=cn,Ur._=cn):ae._=cn}).call($n)});var B0=sr(ht());var Ca=sr(ht());var Ng=`.r34u--post-list-content {
  display: flex;
  gap: 8px;
  padding: 0 8px;
  padding-bottom: 8px;
  width: 100%;
}
.r34u--post-list-content .r34u--post-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 8px;
  border-radius: 4px;
  width: 100%;
}
.r34u--post-list-content .r34u--post-list > .posts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 8px;
}
.r34u--post-list-content .r34u--post-list > .posts .post-item {
  display: flex;
  flex-direction: column;
  padding: 8px;
  gap: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  width: fit-content;
}
.r34u--post-list-content .r34u--post-list > .posts .post-item > .preview-container {
  background-color: rgba(255, 255, 255, 0.1);
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  contain: content;
  border-radius: 4px;
}
.r34u--post-list-content .r34u--post-list > .posts .post-item > .preview-container > .hover-countdown {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.25);
  color: whitesmoke;
  font-size: 12px;
  font-weight: bold;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 10;
}
.r34u--post-list-content .r34u--post-list > .posts .post-item > .preview-container > .video-indicator {
  display: flex;
  position: absolute;
  top: 8px;
  left: 8px;
  font-size: 24px;
  color: whitesmoke;
}
.r34u--post-list-content .r34u--post-list > .posts .post-item > .preview-container img,
.r34u--post-list-content .r34u--post-list > .posts .post-item > .preview-container video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.r34u--post-list-content .r34u--post-list > .posts .post-item > .tags {
  display: flex;
  flex-wrap: wrap;
  padding: 8px;
  gap: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  width: 200px;
  contain: content;
  overflow-y: auto;
  overflow-x: hidden;
  height: 56px;
}
.r34u--post-list-content .r34u--post-list > .posts .post-item > .tags .tag {
  text-decoration: none;
  color: whitesmoke;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.r34u--post-list-content .r34u--post-list > .posts .post-item > .tags .tag .count {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
}
.r34u--post-list-content .r34u--post-list > .posts .post-item > .tags .tag:hover {
  background-color: rgba(255, 255, 255, 0.5);
}

.r34u--fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
}
.r34u--fullscreen-overlay .r34u--fullscreen-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: rgba(0, 0, 0, 0.6);
  border: none;
  color: whitesmoke;
  font-size: 28px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
  transition: background-color 0.15s;
}
.r34u--fullscreen-overlay .r34u--fullscreen-close:hover {
  background-color: rgba(255, 255, 255, 0.25);
}
.r34u--fullscreen-overlay img,
.r34u--fullscreen-overlay video {
  max-width: 100vw;
  max-height: 100vh;
  object-fit: contain;
}
.r34u--fullscreen-overlay .r34u--fullscreen-loading {
  font-size: 48px;
  color: whitesmoke;
  display: flex;
  align-items: center;
  justify-content: center;
}`;document.head.appendChild(document.createElement("style")).appendChild(document.createTextNode(Ng));var Dg=new DOMParser;function ki(u){return Dg.parseFromString(u,"text/html")}function Q(u){let v=document.createElement("div");return v.innerHTML=u,v.firstElementChild}function lr(u){return new Option(u).innerHTML}function cr(u){return u.replace(/(?:^|\s)\S/g,v=>v.toUpperCase())}function fr(u){return cr(u.replace(/_/g," "))}async function ba(u){return(await fetch(`https://ac.rule34.xxx/autocomplete.php?q=${encodeURIComponent(u.trim().toLowerCase())}`).then(m=>m.json())).map(m=>({name:m.value,count:parseInt(m.label.split(" ")[1].slice(1,-1)),type:m.type}))}function Bi(u,v){return u.replace(new RegExp(`(${v.split(" ").map(m=>m.replace(/^-/,"")).join("|")})`,"gi"),"<mark>$1</mark>")}function dt(u){return u<1e3?u:u<1e6?`${(u/1e3).toFixed(2)}k`:u<1e9?`${(u/1e6).toFixed(2)}m`:`${(u/1e9).toFixed(2)}b`}var te=new URL(location.href);function ya(u,v){let m=new URLSearchParams(location.hash.slice(1));v?m.set(u,v):m.delete(u),location.hash=m.toString(),te.hash=location.hash,history.replaceState(null,"",te.href)}function Sa(u){return new URLSearchParams(location.hash.slice(1)).get(u)}var pr=u=>{if(u)return parseInt(new URL(u).searchParams.get("pid"))};function hr(u){return[...u.querySelectorAll('[class*="tag-type-"]')].map($g)}function $g(u){return{type:u.className.split(" ")[0].slice(9),count:parseInt(u.querySelector(".tag-count").textContent),name:u.querySelector('a[href^="index.php?page=post"]').textContent.trim().replace(/ /g,"_")}}function Hg(u,v=[]){let m=u.querySelector("img"),k=u.querySelector("a").href,x=m.alt.trim().split(" "),T=`${m.alt} `,j=T.includes("video "),ye=T.includes("animated "),G=null,re=null;return{id:parseInt(u.id.slice(1)),url:k,thumbnail_img:m.src,is_video:j,is_animation:ye,tags:x.map(E=>v.find(M=>M.name===E)||{type:"general",count:0,name:E}),async fetchVideoURL(){if(!j||G==="NotFound")return null;if(G)return G;let E=await fetch(k).then(q=>q.text()),M=ki(E);return M.querySelector("#content source")?G=M.querySelector("#content source").src:G="NotFound",G==="NotFound"?null:G},async fetchFullImageURL(){if(re==="NotFound")return null;let E=await fetch(k).then(D=>D.text());return re=[...ki(E).querySelectorAll("a")].find(D=>D.textContent.trim()==="Original image")?.href||"NotFound",re==="NotFound"?null:re}}}function La(u){let v=u.querySelector("#tag-sidebar")?hr(u.querySelector("#tag-sidebar")):[];return{tags:v,posts:[...u.querySelectorAll(".thumb")].map(m=>Hg(m,v)),pagination:zg(u.querySelector("#paginator"))}}function zg(u){if(!document.querySelector('a[href^="?page="]'))return null;let v=parseInt(u.querySelector("b")?.textContent||1),m=u.querySelector('a[alt="next"]');return{current_page:{number:v,pid:te.searchParams.get("pid")?parseInt(te.searchParams.get("pid")):0},next_page:m?{number:v+1,pid:m?pr(m.href):0}:null}}var Aa=sr(ht());var Gg=`.r34u--sidebar {
  width: 200px;
  min-width: 200px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.r34u--sidebar > .search-container {
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 4px;
}
.r34u--sidebar > .search-container > .search-bar {
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 4px 8px;
}
.r34u--sidebar > .search-container > .search-bar i {
  color: whitesmoke;
  font-size: 18px;
}
.r34u--sidebar > .search-container > .search-bar input {
  background-color: transparent;
  border: none;
  color: whitesmoke;
  font-size: 16px;
  width: 100%;
}
.r34u--sidebar > .search-container > .buttons {
  display: flex;
  gap: 4px;
}
.r34u--sidebar > .search-container > .buttons > .button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 14px;
  color: whitesmoke;
}
.r34u--sidebar > .search-container > .buttons > .button:hover {
  background-color: rgba(255, 255, 255, 0.5);
}
.r34u--sidebar > .search-container > .filter-sections {
  width: 100%;
  flex-direction: column;
  gap: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 8px;
  border-radius: 4px;
  display: none;
}
.r34u--sidebar > .search-container > .filter-sections.visible {
  display: flex;
}
.r34u--sidebar > .search-container > .filter-sections .filter-section {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.r34u--sidebar > .search-container > .filter-sections .filter-section > .header {
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
}
.r34u--sidebar > .search-container > .filter-sections .filter-section > .filters {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.r34u--sidebar > .search-container > .filter-sections .filter-section > .filters .filter {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 2px;
}
.r34u--sidebar > .search-container > .search-results {
  position: absolute;
  top: calc(100% + 8px);
  width: 100%;
  background-color: #23232f;
  border-radius: 4px;
  padding: 8px;
  display: none;
  flex-direction: column;
  gap: 4px;
}
.r34u--sidebar > .search-container > .search-results.visible {
  display: flex;
}
.r34u--sidebar > .search-container > .search-results .search-result {
  text-decoration: none;
  color: whitesmoke;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 2px;
  flex-wrap: wrap;
  font-size: 14px;
}
.r34u--sidebar > .search-container > .search-results .search-result .name {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}
.r34u--sidebar > .search-container > .search-results .search-result mark {
  background-color: rgba(255, 255, 255, 0.5);
  color: black;
}
.r34u--sidebar > .search-container > .search-results .search-result .count {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
}
.r34u--sidebar > .search-container > .search-results .search-result:hover {
  background-color: rgba(255, 255, 255, 0.5);
}
.r34u--sidebar > .tag-sections {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.r34u--sidebar > .tag-sections .tag-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.r34u--sidebar > .tag-sections .tag-section > .header {
  font-size: 18px;
  font-weight: 600;
}
.r34u--sidebar > .tag-sections .tag-section > .tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.r34u--sidebar > .tag-sections .tag-section > .tags .tag {
  text-decoration: none;
  color: whitesmoke;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.r34u--sidebar > .tag-sections .tag-section > .tags .tag .count {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
}
.r34u--sidebar > .tag-sections .tag-section > .tags .tag:hover {
  background-color: rgba(255, 255, 255, 0.5);
}

.r34u--pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 8px;
  border-radius: 4px;
}
.r34u--pagination .icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
.r34u--pagination .icon.disabled {
  pointer-events: none;
  opacity: 0.5;
}
.r34u--pagination .icon i {
  font-size: 24px;
  color: whitesmoke;
}
.r34u--pagination .icon:hover {
  background-color: rgba(255, 255, 255, 0.5);
}
.r34u--pagination input[type=number] {
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  color: whitesmoke;
  font-size: 16px;
  width: 64px;
  text-align: center;
  border-radius: 4px;
  height: 32px;
}

div[style="text-align: center; font-size: smaller;"] {
  display: none;
}
div[style="text-align: center; font-size: smaller;"] ~ br {
  display: none;
}`;document.head.appendChild(document.createElement("style")).appendChild(document.createTextNode(Gg));function Ni(u){return v=>{v.preventDefault();let m=new URL("https://rule34.xxx/index.php?page=post&s=list");m.searchParams.set("pid",0);let k=(te.searchParams.get("tags")||localStorage.getItem("r34u--last-search-tags")||"").split(" ").filter(x=>x!==u.name&&x!==`-${u.name}`);v.ctrlKey?m.searchParams.set("tags",`${k.join(" ")} ${u.name}`):v.shiftKey?m.searchParams.set("tags",`${k.join(" ")} -${u.name}`):m.searchParams.set("tags",u.name),location.href=m.href}}function dr(u){let v=Q(`
    <div class="r34u--sidebar">
      <div class="search-container">
        <div class="search-bar">
          <i class="ri-search-2-line"></i>
          <input type="text" placeholder="Search tags..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
        </div>
        <div class="buttons">
          <div class="filters-button button">
            <i class="ri-filter-3-line"></i>
            Filters
          </div>
          <div class="search-button button">
            <i class="ri-search-2-line"></i>
            Search
          </div>
        </div>
        <div class="filter-sections">
          <div class="filter-section" data-key="rating" data-allow-multiple-values="false">
            <div class="header">Rating</div>
            <div class="filters">
              <div class="filter" data-value="safe" data-type="+-_">
                <i class="ri-checkbox-blank-line"></i>
                <span>Safe</span>
              </div>
              <div class="filter" data-value="questionable" data-type="+-_">
                <i class="ri-checkbox-blank-line"></i>
                <span>Questionable</span>
              </div>
              <div class="filter" data-value="explicit" data-type="+-_">
                <i class="ri-checkbox-blank-line"></i>
                <span>Explicit</span>
              </div>
              <div class="filter" data-value="[none]" data-type="+-_">
                <i class="ri-checkbox-blank-line"></i>
                <span>All</span>
              </div>
            </div>
          </div>
          <div class="filter-section" data-key="sort" data-allow-multiple-values="false">
            <div class="header">Storting</div>
            <div class="filters">
              <div class="filter" data-value="score" data-type="+-">
                <i class="ri-checkbox-blank-line"></i>
                <span>Score</span>
              </div>
              <div class="filter" data-value="updated" data-type="+-">
                <i class="ri-checkbox-blank-line"></i>
                <span>Updated</span>
              </div>
              <div class="filter" data-value="[none]" data-type="+-">
                <i class="ri-checkbox-blank-line"></i>
                <span>Unsorted</span>
              </div>
            </div>
          </div>
          <div class="filter-section" data-key="[none]" data-allow-multiple-values="true">
            <div class="header">Tags</div>
            <div class="filters">
              <div class="filter" data-value="ai_generated" data-type="+-_">
                <i class="ri-checkbox-blank-line"></i>
                <span>AI Generated</span>
              </div>
              <div class="filter" data-value="video" data-type="+-_">
                <i class="ri-checkbox-blank-line"></i>
                <span>Video</span>
              </div>
              <div class="filter" data-value="animated" data-type="+-_">
                <i class="ri-checkbox-blank-line"></i>
                <span>Animated</span>
              </div>
            </div>
          </div>
        </div>
        <div class="search-results"></div>
      </div>
      <div class="tag-sections"></div>
    </div>
  `);return Kg(v.querySelector(".search-container")),Yg(v.querySelector(".tag-sections"),u),v}function Kg(u){let v=u.querySelector("input"),m=u.querySelector(".search-results"),k=u.querySelector(".search-button"),x=u.querySelector(".filters-button"),T=[],j=[...u.querySelectorAll('.filter-section[data-key="[none]"] .filter')].map(E=>E.dataset.value).filter(E=>E!=="[none]");v.value=(te.searchParams.get("tags")||localStorage.getItem("r34u--last-search-tags")||"").replace(/(-?)(\w+):(\w+)/g,"").split(" ").filter(E=>!j.includes(E.replace(/^-/,""))).join(" ").trim(),v.value==="all"&&(v.value="");let ye=u.querySelector(".filter-sections");localStorage.getItem("r34u--show-filters")==="true"&&ye.classList.add("visible"),x.addEventListener("click",()=>{ye.classList.toggle("visible"),localStorage.setItem("r34u--show-filters",ye.classList.contains("visible"))}),(()=>{let E=te.searchParams.get("tags")||"";[...E.matchAll(/(-?)(\w+):(\w+)/g)].forEach(([,q,D,$])=>{T.push({key:D,value:$,negate:!!q})}),E.split(" ").forEach(q=>{let D=q.startsWith("-"),$=D?q.slice(1):q;j.includes($)&&T.push({key:"[none]",value:$,negate:D})}),[...u.querySelectorAll(".filter-section")].forEach(q=>{let D=q.dataset.key,$=q.dataset.allowMultipleValues==="true",_e=[...q.querySelectorAll(".filter")];_e.forEach(he=>{let ie=he.dataset.value,ke=he.dataset.type,Se=T.find(le=>le.key===D&&le.value===ie);Se&&(he.querySelector("i").className=Se.negate?"ri-checkbox-indeterminate-line":"ri-add-box-line"),he.addEventListener("click",()=>{let le=T.find(Z=>Z.key===D&&Z.value===ie);if($||(T=T.filter(Z=>Z.key!==D),_e.forEach(Z=>Z.querySelector("i").className="ri-checkbox-blank-line")),ie==="[none]"){T=T.filter(Z=>Z.key!==D),_e.forEach(Z=>Z.querySelector("i").className="ri-checkbox-blank-line"),he.querySelector("i").className="ri-add-box-line";return}switch(ke){case"+-_":{if(!le){T.push({key:D,value:ie,negate:!1}),he.querySelector("i").className="ri-add-box-line";break}if(le?.negate===!1){$?le.negate=!0:T.push({key:D,value:ie,negate:!0}),he.querySelector("i").className="ri-checkbox-indeterminate-line";break}if(le){T=T.filter(Z=>Z!==le),he.querySelector("i").className="ri-checkbox-blank-line";break}break}case"+-":{le?(T=T.filter(Z=>Z!==le),he.querySelector("i").className="ri-checkbox-blank-line"):(T.push({key:D,value:ie,negate:!1}),he.querySelector("i").className="ri-add-box-line");break}}})})})})();function G(){let E=new URL("https://rule34.xxx/index.php?page=post&s=list");E.searchParams.set("tags",`${v.value!=="all"?v.value:""} ${T.filter(M=>M.value!=="[none]").map(M=>`${M.negate?"-":""}${M.key==="[none]"?"":`${M.key}:`}${M.value}`).join(" ")}`.trim()),E.searchParams.set("pid",0),location.href=E.href}let re=Aa.default.debounce(async()=>{let E=v.value.replaceAll("-","").trim();E==="all"&&(E="");let M=E.indexOf(" ",v.selectionStart),q=E.slice(v.selectionStart||0,M===-1?E.length:M+1).trim();q||(q=E.split(" ").pop());let D=await ba(q);m.replaceChildren(...D.map($=>{let _e=Q(`
        <button class="search-result" title="${cr($.type)}: ${$.name} (${$.count.toLocaleString()})">
          <span class="name">${Bi($.name,q)}</span>
          <span class="count">${dt($.count)}</span>
        </button>
      `);return _e.addEventListener("click",he=>{let ie=v.value.split(" ").slice(0,-1).filter(ke=>ke!==$.name&&ke!==`-${$.name}`);v.value=`${ie.join(" ")} ${he.shiftKey?"-":""}${$.name}`.trim()}),_e})),acceptTab=!0},500);document.body.addEventListener("click",E=>{u.contains(E.target)||m.classList.remove("visible")}),k.addEventListener("click",G),v.addEventListener("focus",()=>{m.classList.add("visible")}),v.addEventListener("keydown",E=>{let M=v.value;if(m.querySelectorAll(".search-result .name").forEach(q=>{q.innerHTML=Bi(q.textContent,M)}),E.key!=="Shift"){if(E.key==="Enter"){G();return}re()}}),v.addEventListener("mouseup",()=>{re()}),re()}function Yg(u,v){Object.entries(Object.groupBy(v,m=>m.type)).forEach(([m,k])=>{let x=Q(`
      <div class="tag-section">
        <div class="header">${cr(m)}</div>
        <div class="tags"></div>
      </div>  
    `);x.querySelector(".tags").replaceChildren(...k.map(j=>{let ye=Q(`
        <a class="tag" title="Click to set tag, ctrl+click to add tag or shift+click to exclude tag." href="https://rule34.xxx/index.php?page=post&s=list&tags=${j.name}">
          <span class="name">${fr(j.name)}</span>
          ${j.count?`<span class="count">${dt(j.count)}</span>`:""}
        </a>  
      `);return ye.addEventListener("click",Ni(j)),ye})),u.appendChild(x)})}function gr(u,v={}){let m=Q(`
    <div class="r34u--pagination">
      <div class="icon prev ${u.current_page.number<=1?"disabled":""}">
        <i class="ri-arrow-left-s-line"></i>
      </div>
      <input type="number" value="${u.current_page.number}" min="1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
      <div class="icon next ${u.next_page?"":"disabled"}">
        <i class="ri-arrow-right-s-line"></i>
      </div>
    </div>
  `),k=m.querySelector(".prev"),x=m.querySelector(".next"),T=m.querySelector("input");return T.addEventListener("keydown",j=>{j.key==="Enter"&&v.input(Math.max(T.value,0))}),k.addEventListener("click",()=>{v.prev()}),x.addEventListener("click",()=>{v.next()}),m}document.cookie="filter_ai=0;";var Zg=Ca.default.debounce(async(u,v)=>{if(v.classList.contains("preview-patched"))return;v.classList.add("preview-patched");let m=v.querySelector(".video-indicator");if(m.classList.add("loading-rotate"),m.innerHTML='<i class="ri-loader-4-line"></i>',u.is_video){let k=await u.fetchVideoURL();if(!k){m.remove();return}m.classList.remove("loading-rotate"),m.innerHTML='<i class="ri-play-fill"></i>';let x=Q(`<video src="${k}" loop muted></video>`),T=v.querySelector("img");x.addEventListener("mouseleave",()=>{x.replaceWith(T),x.pause()}),T.addEventListener("mouseenter",()=>{T.replaceWith(x),x.play()}),x.addEventListener("loadeddata",()=>{x.play(),T.replaceWith(x)})}else if(u.is_animation){let k=await u.fetchFullImageURL();if(!k){m.remove();return}m.classList.remove("loading-rotate"),m.innerHTML='<i class="ri-play-fill"></i>';let x=Q(`<img src="${k}" />`),T=v.querySelector("img");x.addEventListener("mouseleave",()=>{x.replaceWith(T)}),T.addEventListener("mouseenter",()=>{T.replaceWith(x)}),x.addEventListener("load",()=>{T.replaceWith(x)})}},500);function Ra(){if(!(te.searchParams.get("page")==="post"&&te.searchParams.get("s")==="list"))return;localStorage.setItem("r34u--last-search-tags",te.searchParams.get("tags")||"");let u=La(document.querySelector("#content"));console.log("Post List Page",u),document.querySelector("#content").remove();let v=Q(`
    <div class="r34u--post-list-content">
      <div class="r34u--post-list">
        <div class="posts ${u.posts.length===0?"hidden":""}"></div>
      </div>
    </div>
  `);v.prepend(dr(u.tags)),Xg(v.querySelector(".r34u--post-list"),u),document.body.appendChild(v)}function Xg(u,v){Jg(u.querySelector(".posts"),v),v.pagination&&(u.prepend(Ea(v.pagination)),u.appendChild(Ea(v.pagination)))}function Ea(u){return gr(u,{input(v){let m=new URL(location.href);m.searchParams.set("pid",Math.max(v-1,0)*42),location.href=m.href},prev(){let v=new URL(location.href);v.searchParams.set("pid",Math.max(u.current_page.pid-42,0)),location.href=v.href},next(){let v=new URL(location.href);v.searchParams.set("pid",u.current_page.pid+42),location.href=v.href}})}function Jg(u,v){v.posts.forEach(m=>{let k=Q(`
      <a class="post-item" href="${m.url}">
        <div class="preview-container">
          ${m.is_video||m.is_animation?'<div class="video-indicator"><i class="ri-play-fill"></i></div>':""}
        </div>
        <div class="tags"></div>
      </a>
    `),x=k.querySelector(".preview-container"),T=Q(`<img src="${m.thumbnail_img}" />`);x.appendChild(T),(m.is_video||m.is_animation)&&x.addEventListener("mouseenter",()=>Zg(m,x));let j=null,ye=null,G=null;k.addEventListener("mouseenter",()=>{let E=3;G=Q(`<div class="hover-countdown">${E}</div>`),x.appendChild(G),j=setInterval(()=>{E--,G&&(G.textContent=E)},1e3),ye=setTimeout(async()=>{clearInterval(j),G&&(G.remove(),G=null);let M=Q('<div class="r34u--fullscreen-overlay"><button class="r34u--fullscreen-close"><i class="ri-close-line"></i></button><div class="r34u--fullscreen-loading"><i class="ri-loader-4-line loading-rotate"></i></div></div>');M.querySelector(".r34u--fullscreen-close").addEventListener("click",()=>M.remove()),document.body.appendChild(M);let q;if(m.is_video){let D=await m.fetchVideoURL();D&&(q=Q(`<video src="${D}" controls autoplay loop muted></video>`))}else{let D=await m.fetchFullImageURL();D&&(q=Q(`<img src="${D}" />`))}q||(q=Q(`<img src="${m.thumbnail_img}" />`)),M.querySelector(".r34u--fullscreen-loading").replaceWith(q)},3e3)}),k.addEventListener("mouseleave",()=>{clearInterval(j),clearTimeout(ye),G&&(G.remove(),G=null)});let re=k.querySelector(".tags");m.tags.forEach(E=>{let M=Q(`
        <a class="tag" title="Click to set tag, ctrl+click to add tag or shift+click to exclude tag." href="https://rule34.xxx/index.php?page=post&s=list&tags=${E.name}">
          <span class="name">${fr(E.name)}</span>
          ${E.count?`<span class="count">${dt(E.count)}</span>`:""}
        </a>
      `);M.addEventListener("click",Ni(E)),re.appendChild(M)}),u.appendChild(k)})}var Ta=sr(ht());function Ia(){window.addEventListener("scroll",Ta.default.debounce(()=>{ya("scrollY",window.scrollY)},100))}function Pa(){setTimeout(()=>{let u=Sa("scrollY");u&&window.scrollTo(0,parseInt(u))},100)}function Oa(u){let v=hr(u.querySelector("#tag-sidebar"));return{tags:v,content:Qg(u,v),comments:Vg(u.querySelector("#post-comments"))}}function Qg(u,v){return{id:parseInt(te.searchParams.get("id")),is_video:v.some(m=>m.name==="video"),is_animation:v.some(m=>m.name==="animated"),url:u.querySelector("source")?.src??document.querySelector('a[onclick^="Post.highres();"]')?.href?.split("?")?.[0]??u.querySelector("#fit-to-screen img[alt]")?.src}}function Vg(u){let v=u.querySelector("#comment-list");return{total_count:parseInt(v.childNodes[2].textContent.split(" ")[0].trim())||0,items:[...v.querySelectorAll("& > div[id]")].map(m=>({id:parseInt(m.id.slice(1)),author:m.querySelector(".col1 > a").textContent,date:new Date(m.querySelector('.col1 a[id^="sc"]').parentElement.textContent.replace(/ +/," ").split(" ").slice(3,5).join(" ")),score:parseInt(m.querySelector('.col1 a[id^="sc"]').textContent),content:m.querySelector(".col2").textContent.trim()})),pagination:jg(u.querySelector("#paginator"))}}function jg(u){let v=parseInt(u.querySelector("b")?.textContent||1),m=u.querySelector('a[alt="next"]');return{current_page:{number:v,pid:te.searchParams.get("pid")?parseInt(te.searchParams.get("pid")):0},next_page:m?{number:v+1,pid:m?pr(m.href):0}:null}}var e0=`.r34u--post-view-content {
  display: flex;
  gap: 8px;
  padding: 0 8px;
  padding-bottom: 8px;
  width: 100%;
}
.r34u--post-view-content .r34u--post-view {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 8px;
  border-radius: 4px;
  width: 100%;
}
.r34u--post-view-content .r34u--post-view > .media {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80vh;
  max-height: 80vh;
  background-color: rgba(255, 255, 255, 0.1);
  contain: content;
  border-radius: 4px;
}
.r34u--post-view-content .r34u--post-view > .media img,
.r34u--post-view-content .r34u--post-view > .media video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.r34u--post-view-content .r34u--post-view > .comments-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 8px;
  border-radius: 4px;
  width: 100%;
}
.r34u--post-view-content .r34u--post-view > .comments-container > .header {
  display: flex;
  flex-direction: column;
}
.r34u--post-view-content .r34u--post-view > .comments-container > .header > .title {
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
}
.r34u--post-view-content .r34u--post-view > .comments-container > .header > .subtext {
  font-size: 12px;
  font-weight: 400;
  line-height: 1;
  opacity: 0.75;
}
.r34u--post-view-content .r34u--post-view > .comments-container > .comments {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 8px;
  border-radius: 4px;
  width: 100%;
}
.r34u--post-view-content .r34u--post-view > .comments-container > .comments .comment {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 8px;
  border-radius: 4px;
  width: 100%;
  position: relative;
}
.r34u--post-view-content .r34u--post-view > .comments-container > .comments .comment > .date {
  font-size: 12px;
  font-weight: 400;
  line-height: 1;
  opacity: 0.75;
  position: absolute;
  top: 8px;
  right: 8px;
}
.r34u--post-view-content .r34u--post-view > .comments-container > .comments .comment > .about {
  display: flex;
  gap: 8px;
  align-items: center;
}
.r34u--post-view-content .r34u--post-view > .comments-container > .comments .comment > .about > .author {
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  color: whitesmoke !important;
  text-decoration: none;
}
.r34u--post-view-content .r34u--post-view > .comments-container > .comments .comment > .about > .author:hover {
  text-decoration: underline;
}
.r34u--post-view-content .r34u--post-view > .comments-container > .comments .comment > .about > .score {
  display: flex;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  align-items: center;
  gap: 4px;
  line-height: 1;
  padding: 4px;
}
.r34u--post-view-content .r34u--post-view > .comments-container > .comments .comment > .about > .score > .icon {
  font-size: 14px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}
.r34u--post-view-content .r34u--post-view > .comments-container > .comments .comment > .about > .score > .value {
  font-size: 12px;
  font-weight: 400;
  line-height: 1;
}`;document.head.appendChild(document.createElement("style")).appendChild(document.createTextNode(e0));function Ua(){if(!(te.searchParams.get("page")==="post"&&te.searchParams.get("s")==="view"))return;let u=Oa(document.querySelector("#content"));console.log("Post View Page",u),(()=>{let x=document.querySelector("#gelcomVideoContainer");x&&(x.remove(),x.setAttribute("style","display: none;"),document.body.append(x))})(),document.querySelector("#content").remove();let v=Q(`
    <div class="r34u--post-view-content">
      <div class="r34u--post-view">
        <div class="media"></div>

        <div class="comments-container">
          <div class="header">
            <div class="title">Comments</div>
            <div class="subtext">Total ${u.comments.total_count} comments</div>
          </div>
          <div class="comments"></div>
        </div>
      </div>
    </div>
  `);v.prepend(dr(u.tags));let m=v.querySelector(".media");if(u.content.is_video){let x=Q("<video controls loop playsinline></video>");x.src=u.content.url,x.volume=parseFloat(localStorage.getItem("r34u--video-volume")||"0.25"),x.addEventListener("volumechange",()=>{localStorage.setItem("r34u--video-volume",x.volume.toFixed(2))}),m.appendChild(x)}else{let x=Q("<img />");x.src=u.content.url,m.appendChild(x)}let k=v.querySelector(".comments-container");k.appendChild(gr(u.comments.pagination,{input(x){let T=new URL(location.href);T.searchParams.set("pid",Math.max(x-1,0)*10),location.href=T.href},prev(){let x=new URL(location.href);x.searchParams.set("pid",Math.max(u.comments.pagination.current_page.pid-10,0)),location.href=x.href},next(){let x=new URL(location.href);x.searchParams.set("pid",u.comments.pagination.current_page.pid+10),location.href=x.href}})),k.querySelector(".comments").replaceChildren(...u.comments.items.map(x=>Q(`
        <div class="comment">
          <div class="date">${x.date.toLocaleString()}</div>
          <div class="about">
            <a class="author" href="/index.php?page=account&s=profile&uname=${lr(x.author)}">${lr(x.author)}</a>
            <div class="score">
              <div class="icon">
                <i class="ri-arrow-up-s-line"></i>
              </div>
              <div class="value">${x.score}</div>
            </div>
          </div>
          <div class="content">
            ${lr(x.content)}
          </div>
        </div>
      `))),document.body.appendChild(v),Pa()}function Fa(){Ra(),Ua()}function Wa(){Fa()}var n0=`@import url("https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css");
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap");
@keyframes rotate360 {
  from {
    rotate: 0deg;
  }
  to {
    rotate: 360deg;
  }
}
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif !important;
  outline: none;
  user-select: none;
}

html,
body {
  width: 100%;
  height: 100%;
  background-image: linear-gradient(111.4deg, rgb(7, 7, 9) 6.5%, rgb(27, 24, 113) 93.2%);
  background-attachment: fixed;
  color: whitesmoke;
}

.hidden {
  display: none !important;
}

.loading-rotate {
  animation: rotate360 1s linear infinite;
}

#subnavbar {
  background-color: rgba(255, 255, 255, 0.25) !important;
}

a {
  color: rgb(230, 230, 255) !important;
}
a:hover {
  color: rgb(255, 255, 255) !important;
}

.current-page {
  background-color: rgba(255, 255, 255, 0.25) !important;
  background-image: none !important;
  border-radius: 8px;
  padding: 8px;
}

::-webkit-scrollbar {
  width: 11px;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 11px 11px rgba(0, 0, 0, 0.05);
  box-shadow: inset 0 0 11px 11px rgba(0, 0, 0, 0.05);
  border: solid 2px transparent;
  border-radius: 11px;
}

::-webkit-scrollbar-thumb {
  -webkit-box-shadow: inset 0 0 11px 11px rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 0 11px 11px rgba(0, 0, 0, 0.1);
  border: solid 2px transparent;
  border-radius: 11px;
}

::-webkit-scrollbar-thumb:hover {
  -webkit-box-shadow: inset 0 0 11px 11px rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 0 11px 11px rgba(0, 0, 0, 0.2);
}

::-webkit-scrollbar-button {
  display: none;
}`;document.head.appendChild(document.createElement("style")).appendChild(document.createTextNode(n0));function Ma(){Ia()}setTimeout(()=>{console.log("Loading rule34utils..."),Ma(),Wa()},0);})();
/*! Bundled license information:

lodash/lodash.js:
  (**
   * @license
   * Lodash <https://lodash.com/>
   * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   *)
*/
