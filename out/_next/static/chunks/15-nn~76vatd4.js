(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,98934,e=>{"use strict";var t,r,n,o,i,s,a,l;let c,u,d,p,f,h;(o=t||(t={})).Unimplemented="UNIMPLEMENTED",o.Unavailable="UNAVAILABLE";class m extends Error{constructor(e,t,r){super(e),this.message=e,this.code=t,this.data=r}}let g=(c=(s=i="u">typeof globalThis?globalThis:"u">typeof self?self:"u">typeof window?window:e.g).CapacitorCustomPlatform||null,d=(u=s.Capacitor||{}).Plugins=u.Plugins||{},p=()=>{var e,t;return null!==c?c.name:(null==s?void 0:s.androidBridge)?"android":(null==(t=null==(e=null==s?void 0:s.webkit)?void 0:e.messageHandlers)?void 0:t.bridge)?"ios":"web"},f=e=>{var t;return null==(t=u.PluginHeaders)?void 0:t.find(t=>t.name===e)},h=new Map,u.convertFileSrc||(u.convertFileSrc=e=>e),u.getPlatform=p,u.handleError=e=>s.console.error(e),u.isNativePlatform=()=>"web"!==p(),u.isPluginAvailable=e=>{let t=h.get(e);return!!((null==t?void 0:t.platforms.has(p()))||f(e))},u.registerPlugin=(e,r={})=>{let n,o=h.get(e);if(o)return console.warn(`Capacitor plugin "${e}" already registered. Cannot register plugins twice.`),o.proxy;let i=p(),s=f(e),a=async()=>(!n&&i in r?n=n="function"==typeof r[i]?await r[i]():r[i]:null!==c&&!n&&"web"in r&&(n=n="function"==typeof r.web?await r.web():r.web),n),l=r=>{let n,o=(...o)=>{let l=a().then(a=>{let l=((r,n)=>{var o,a;if(s){let t=null==s?void 0:s.methods.find(e=>n===e.name);if(t)if("promise"===t.rtype)return t=>u.nativePromise(e,n.toString(),t);else return(t,r)=>u.nativeCallback(e,n.toString(),t,r);if(r)return null==(o=r[n])?void 0:o.bind(r)}else if(r)return null==(a=r[n])?void 0:a.bind(r);else throw new m(`"${e}" plugin is not implemented on ${i}`,t.Unimplemented)})(a,r);if(l){let e=l(...o);return n=null==e?void 0:e.remove,e}throw new m(`"${e}.${r}()" is not implemented on ${i}`,t.Unimplemented)});return"addListener"===r&&(l.remove=async()=>n()),l};return o.toString=()=>`${r.toString()}() { [capacitor code] }`,Object.defineProperty(o,"name",{value:r,writable:!1,configurable:!1}),o},g=l("addListener"),y=l("removeListener"),b=(e,t)=>{let r=g({eventName:e},t),n=async()=>{y({eventName:e,callbackId:await r},t)},o=new Promise(e=>r.then(()=>e({remove:n})));return o.remove=async()=>{console.warn("Using addListener() without 'await' is deprecated."),await n()},o},x=new Proxy({},{get(e,t){switch(t){case"$$typeof":return;case"toJSON":return()=>({});case"addListener":return s?b:g;case"removeListener":return y;default:return l(t)}}});return d[e]=x,h.set(e,{name:e,proxy:x,platforms:new Set([...Object.keys(r),...s?[i]:[]])}),x},u.Exception=m,u.DEBUG=!!u.DEBUG,u.isLoggingEnabled=!!u.isLoggingEnabled,i.Capacitor=u),y=g.registerPlugin;class b{constructor(){this.listeners={},this.retainedEventArguments={},this.windowListeners={}}addListener(e,t){let r=!1;this.listeners[e]||(this.listeners[e]=[],r=!0),this.listeners[e].push(t);let n=this.windowListeners[e];return n&&!n.registered&&this.addWindowListener(n),r&&this.sendRetainedArgumentsForEvent(e),Promise.resolve({remove:async()=>this.removeListener(e,t)})}async removeAllListeners(){for(let e in this.listeners={},this.windowListeners)this.removeWindowListener(this.windowListeners[e]);this.windowListeners={}}notifyListeners(e,t,r){let n=this.listeners[e];if(!n){if(r){let r=this.retainedEventArguments[e];r||(r=[]),r.push(t),this.retainedEventArguments[e]=r}return}n.forEach(e=>e(t))}hasListeners(e){var t;return!!(null==(t=this.listeners[e])?void 0:t.length)}registerWindowListener(e,t){this.windowListeners[t]={registered:!1,windowEventName:e,pluginEventName:t,handler:e=>{this.notifyListeners(t,e)}}}unimplemented(e="not implemented"){return new g.Exception(e,t.Unimplemented)}unavailable(e="not available"){return new g.Exception(e,t.Unavailable)}async removeListener(e,t){let r=this.listeners[e];if(!r)return;let n=r.indexOf(t);this.listeners[e].splice(n,1),this.listeners[e].length||this.removeWindowListener(this.windowListeners[e])}addWindowListener(e){window.addEventListener(e.windowEventName,e.handler),e.registered=!0}removeWindowListener(e){e&&(window.removeEventListener(e.windowEventName,e.handler),e.registered=!1)}sendRetainedArgumentsForEvent(e){let t=this.retainedEventArguments[e];t&&(delete this.retainedEventArguments[e],t.forEach(t=>{this.notifyListeners(e,t)}))}}let x=e=>encodeURIComponent(e).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);class v extends b{async getCookies(){let e=document.cookie,t={};return e.split(";").forEach(e=>{if(e.length<=0)return;let[r,n]=e.replace(/=/,"CAP_COOKIE").split("CAP_COOKIE");r=r.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent).trim(),n=n.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent).trim(),t[r]=n}),t}async setCookie(e){try{let t=x(e.key),r=x(e.value),n=e.expires?`; expires=${e.expires.replace("expires=","")}`:"",o=(e.path||"/").replace("path=",""),i=null!=e.url&&e.url.length>0?`domain=${e.url}`:"";document.cookie=`${t}=${r||""}${n}; path=${o}; ${i};`}catch(e){return Promise.reject(e)}}async deleteCookie(e){try{document.cookie=`${e.key}=; Max-Age=0`}catch(e){return Promise.reject(e)}}async clearCookies(){try{for(let e of document.cookie.split(";")||[])document.cookie=e.replace(/^ +/,"").replace(/=.*/,`=;expires=${new Date().toUTCString()};path=/`)}catch(e){return Promise.reject(e)}}async clearAllCookies(){try{await this.clearCookies()}catch(e){return Promise.reject(e)}}}y("CapacitorCookies",{web:()=>new v});let w=async e=>new Promise((t,r)=>{let n=new FileReader;n.onload=()=>{let e=n.result;t(e.indexOf(",")>=0?e.split(",")[1]:e)},n.onerror=e=>r(e),n.readAsDataURL(e)});class j extends b{async request(e){let t,r,n=((e,t={})=>{let r=Object.assign({method:e.method||"GET",headers:e.headers},t),n=((e={})=>{let t=Object.keys(e);return Object.keys(e).map(e=>e.toLocaleLowerCase()).reduce((r,n,o)=>(r[n]=e[t[o]],r),{})})(e.headers)["content-type"]||"";if("string"==typeof e.data)r.body=e.data;else if(n.includes("application/x-www-form-urlencoded")){let t=new URLSearchParams;for(let[r,n]of Object.entries(e.data||{}))t.set(r,n);r.body=t.toString()}else if(n.includes("multipart/form-data")||e.data instanceof FormData){let t=new FormData;if(e.data instanceof FormData)e.data.forEach((e,r)=>{t.append(r,e)});else for(let r of Object.keys(e.data))t.append(r,e.data[r]);r.body=t;let n=new Headers(r.headers);n.delete("content-type"),r.headers=n}else(n.includes("application/json")||"object"==typeof e.data)&&(r.body=JSON.stringify(e.data));return r})(e,e.webFetchExtra),o=((e,t=!0)=>e?Object.entries(e).reduce((e,r)=>{let n,o,[i,s]=r;return Array.isArray(s)?(o="",s.forEach(e=>{n=t?encodeURIComponent(e):e,o+=`${i}=${n}&`}),o.slice(0,-1)):(n=t?encodeURIComponent(s):s,o=`${i}=${n}`),`${e}&${o}`},"").substr(1):null)(e.params,e.shouldEncodeUrlParams),i=o?`${e.url}?${o}`:e.url,s=await fetch(i,n),a=s.headers.get("content-type")||"",{responseType:l="text"}=s.ok?e:{};switch(a.includes("application/json")&&(l="json"),l){case"arraybuffer":case"blob":r=await s.blob(),t=await w(r);break;case"json":t=await s.json();break;default:t=await s.text()}let c={};return s.headers.forEach((e,t)=>{c[t]=e}),{data:t,headers:c,status:s.status,url:s.url}}async get(e){return this.request(Object.assign(Object.assign({},e),{method:"GET"}))}async post(e){return this.request(Object.assign(Object.assign({},e),{method:"POST"}))}async put(e){return this.request(Object.assign(Object.assign({},e),{method:"PUT"}))}async patch(e){return this.request(Object.assign(Object.assign({},e),{method:"PATCH"}))}async delete(e){return this.request(Object.assign(Object.assign({},e),{method:"DELETE"}))}}y("CapacitorHttp",{web:()=>new j}),(a=r||(r={})).Dark="DARK",a.Light="LIGHT",a.Default="DEFAULT",(l=n||(n={})).StatusBar="StatusBar",l.NavigationBar="NavigationBar";class S extends b{async setStyle(){this.unavailable("not available for web")}async setAnimation(){this.unavailable("not available for web")}async show(){this.unavailable("not available for web")}async hide(){this.unavailable("not available for web")}}y("SystemBars",{web:()=>new S}),e.s(["WebPlugin",0,b,"registerPlugin",0,y])},20955,(e,t,r)=>{var n={229:function(e){var t,r,n,o=e.exports={};function i(){throw Error("setTimeout has not been defined")}function s(){throw Error("clearTimeout has not been defined")}try{t="function"==typeof setTimeout?setTimeout:i}catch(e){t=i}try{r="function"==typeof clearTimeout?clearTimeout:s}catch(e){r=s}function a(e){if(t===setTimeout)return setTimeout(e,0);if((t===i||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(r){try{return t.call(null,e,0)}catch(r){return t.call(this,e,0)}}}var l=[],c=!1,u=-1;function d(){c&&n&&(c=!1,n.length?l=n.concat(l):u=-1,l.length&&p())}function p(){if(!c){var e=a(d);c=!0;for(var t=l.length;t;){for(n=l,l=[];++u<t;)n&&n[u].run();u=-1,t=l.length}n=null,c=!1,function(e){if(r===clearTimeout)return clearTimeout(e);if((r===s||!r)&&clearTimeout)return r=clearTimeout,clearTimeout(e);try{r(e)}catch(t){try{return r.call(null,e)}catch(t){return r.call(this,e)}}}(e)}}function f(e,t){this.fun=e,this.array=t}function h(){}o.nextTick=function(e){var t=Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];l.push(new f(e,t)),1!==l.length||c||a(p)},f.prototype.run=function(){this.fun.apply(null,this.array)},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=h,o.addListener=h,o.once=h,o.off=h,o.removeListener=h,o.removeAllListeners=h,o.emit=h,o.prependListener=h,o.prependOnceListener=h,o.listeners=function(e){return[]},o.binding=function(e){throw Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(e){throw Error("process.chdir is not supported")},o.umask=function(){return 0}}},o={};function i(e){var t=o[e];if(void 0!==t)return t.exports;var r=o[e]={exports:{}},s=!0;try{n[e](r,r.exports,i),s=!1}finally{s&&delete o[e]}return r.exports}i.ab="/ROOT/node_modules/next/dist/compiled/process/",t.exports=i(229)},50461,(e,t,r)=>{"use strict";var n,o;t.exports=(null==(n=e.g.process)?void 0:n.env)&&"object"==typeof(null==(o=e.g.process)?void 0:o.env)?e.g.process:e.r(20955)},77325,(e,t,r)=>{"use strict";var n=Symbol.for("react.element"),o=Symbol.for("react.portal"),i=Symbol.for("react.fragment"),s=Symbol.for("react.strict_mode"),a=Symbol.for("react.profiler"),l=Symbol.for("react.provider"),c=Symbol.for("react.context"),u=Symbol.for("react.forward_ref"),d=Symbol.for("react.suspense"),p=Symbol.for("react.memo"),f=Symbol.for("react.lazy"),h=Symbol.iterator,m={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},g=Object.assign,y={};function b(e,t,r){this.props=e,this.context=t,this.refs=y,this.updater=r||m}function x(){}function v(e,t,r){this.props=e,this.context=t,this.refs=y,this.updater=r||m}b.prototype.isReactComponent={},b.prototype.setState=function(e,t){if("object"!=typeof e&&"function"!=typeof e&&null!=e)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")},b.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")},x.prototype=b.prototype;var w=v.prototype=new x;w.constructor=v,g(w,b.prototype),w.isPureReactComponent=!0;var j=Array.isArray,S=Object.prototype.hasOwnProperty,k={current:null},_={key:!0,ref:!0,__self:!0,__source:!0};function C(e,t,r){var o,i={},s=null,a=null;if(null!=t)for(o in void 0!==t.ref&&(a=t.ref),void 0!==t.key&&(s=""+t.key),t)S.call(t,o)&&!_.hasOwnProperty(o)&&(i[o]=t[o]);var l=arguments.length-2;if(1===l)i.children=r;else if(1<l){for(var c=Array(l),u=0;u<l;u++)c[u]=arguments[u+2];i.children=c}if(e&&e.defaultProps)for(o in l=e.defaultProps)void 0===i[o]&&(i[o]=l[o]);return{$$typeof:n,type:e,key:s,ref:a,props:i,_owner:k.current}}function F(e){return"object"==typeof e&&null!==e&&e.$$typeof===n}var E=/\/+/g;function N(e,t){var r,n;return"object"==typeof e&&null!==e&&null!=e.key?(r=""+e.key,n={"=":"=0",":":"=2"},"$"+r.replace(/[=:]/g,function(e){return n[e]})):t.toString(36)}function L(e,t,r){if(null==e)return e;var i=[],s=0;return!function e(t,r,i,s,a){var l,c,u,d=typeof t;("undefined"===d||"boolean"===d)&&(t=null);var p=!1;if(null===t)p=!0;else switch(d){case"string":case"number":p=!0;break;case"object":switch(t.$$typeof){case n:case o:p=!0}}if(p)return a=a(p=t),t=""===s?"."+N(p,0):s,j(a)?(i="",null!=t&&(i=t.replace(E,"$&/")+"/"),e(a,r,i,"",function(e){return e})):null!=a&&(F(a)&&(l=a,c=i+(!a.key||p&&p.key===a.key?"":(""+a.key).replace(E,"$&/")+"/")+t,a={$$typeof:n,type:l.type,key:c,ref:l.ref,props:l.props,_owner:l._owner}),r.push(a)),1;if(p=0,s=""===s?".":s+":",j(t))for(var f=0;f<t.length;f++){var m=s+N(d=t[f],f);p+=e(d,r,i,m,a)}else if("function"==typeof(m=null===(u=t)||"object"!=typeof u?null:"function"==typeof(u=h&&u[h]||u["@@iterator"])?u:null))for(t=m.call(t),f=0;!(d=t.next()).done;)m=s+N(d=d.value,f++),p+=e(d,r,i,m,a);else if("object"===d)throw Error("Objects are not valid as a React child (found: "+("[object Object]"===(r=String(t))?"object with keys {"+Object.keys(t).join(", ")+"}":r)+"). If you meant to render a collection of children, use an array instead.");return p}(e,i,"","",function(e){return t.call(r,e,s++)}),i}function P(e){if(-1===e._status){var t=e._result;(t=t()).then(function(t){(0===e._status||-1===e._status)&&(e._status=1,e._result=t)},function(t){(0===e._status||-1===e._status)&&(e._status=2,e._result=t)}),-1===e._status&&(e._status=0,e._result=t)}if(1===e._status)return e._result.default;throw e._result}var A={current:null},O={transition:null};function R(){throw Error("act(...) is not supported in production builds of React.")}r.Children={map:L,forEach:function(e,t,r){L(e,function(){t.apply(this,arguments)},r)},count:function(e){var t=0;return L(e,function(){t++}),t},toArray:function(e){return L(e,function(e){return e})||[]},only:function(e){if(!F(e))throw Error("React.Children.only expected to receive a single React element child.");return e}},r.Component=b,r.Fragment=i,r.Profiler=a,r.PureComponent=v,r.StrictMode=s,r.Suspense=d,r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED={ReactCurrentDispatcher:A,ReactCurrentBatchConfig:O,ReactCurrentOwner:k},r.act=R,r.cloneElement=function(e,t,r){if(null==e)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var o=g({},e.props),i=e.key,s=e.ref,a=e._owner;if(null!=t){if(void 0!==t.ref&&(s=t.ref,a=k.current),void 0!==t.key&&(i=""+t.key),e.type&&e.type.defaultProps)var l=e.type.defaultProps;for(c in t)S.call(t,c)&&!_.hasOwnProperty(c)&&(o[c]=void 0===t[c]&&void 0!==l?l[c]:t[c])}var c=arguments.length-2;if(1===c)o.children=r;else if(1<c){l=Array(c);for(var u=0;u<c;u++)l[u]=arguments[u+2];o.children=l}return{$$typeof:n,type:e.type,key:i,ref:s,props:o,_owner:a}},r.createContext=function(e){return(e={$$typeof:c,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null}).Provider={$$typeof:l,_context:e},e.Consumer=e},r.createElement=C,r.createFactory=function(e){var t=C.bind(null,e);return t.type=e,t},r.createRef=function(){return{current:null}},r.forwardRef=function(e){return{$$typeof:u,render:e}},r.isValidElement=F,r.lazy=function(e){return{$$typeof:f,_payload:{_status:-1,_result:e},_init:P}},r.memo=function(e,t){return{$$typeof:p,type:e,compare:void 0===t?null:t}},r.startTransition=function(e){var t=O.transition;O.transition={};try{e()}finally{O.transition=t}},r.unstable_act=R,r.useCallback=function(e,t){return A.current.useCallback(e,t)},r.useContext=function(e){return A.current.useContext(e)},r.useDebugValue=function(){},r.useDeferredValue=function(e){return A.current.useDeferredValue(e)},r.useEffect=function(e,t){return A.current.useEffect(e,t)},r.useId=function(){return A.current.useId()},r.useImperativeHandle=function(e,t,r){return A.current.useImperativeHandle(e,t,r)},r.useInsertionEffect=function(e,t){return A.current.useInsertionEffect(e,t)},r.useLayoutEffect=function(e,t){return A.current.useLayoutEffect(e,t)},r.useMemo=function(e,t){return A.current.useMemo(e,t)},r.useReducer=function(e,t,r){return A.current.useReducer(e,t,r)},r.useRef=function(e){return A.current.useRef(e)},r.useState=function(e){return A.current.useState(e)},r.useSyncExternalStore=function(e,t,r){return A.current.useSyncExternalStore(e,t,r)},r.useTransition=function(){return A.current.useTransition()},r.version="18.3.1"},91788,(e,t,r)=>{"use strict";t.exports=e.r(77325)},1884,(e,t,r)=>{"use strict";var n=e.r(91788),o=Symbol.for("react.element"),i=Symbol.for("react.fragment"),s=Object.prototype.hasOwnProperty,a=n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function c(e,t,r){var n,i={},c=null,u=null;for(n in void 0!==r&&(c=""+r),void 0!==t.key&&(c=""+t.key),void 0!==t.ref&&(u=t.ref),t)s.call(t,n)&&!l.hasOwnProperty(n)&&(i[n]=t[n]);if(e&&e.defaultProps)for(n in t=e.defaultProps)void 0===i[n]&&(i[n]=t[n]);return{$$typeof:o,type:e,key:c,ref:u,props:i,_owner:a.current}}r.Fragment=i,r.jsx=c,r.jsxs=c},91398,(e,t,r)=>{"use strict";t.exports=e.r(1884)},41705,(e,t,r)=>{"use strict";r._=function(e){return e&&e.__esModule?e:{default:e}}},13584,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"HeadManagerContext",{enumerable:!0,get:function(){return n}});let n=e.r(41705)._(e.r(91788)).default.createContext({})},94470,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"warnOnce",{enumerable:!0,get:function(){return n}});let n=e=>{}},52456,(e,t,r)=>{"use strict";function n(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,r=new WeakMap;return(n=function(e){return e?r:t})(e)}r._=function(e,t){if(!t&&e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var r=n(t);if(r&&r.has(e))return r.get(e);var o={__proto__:null},i=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var s in e)if("default"!==s&&Object.prototype.hasOwnProperty.call(e,s)){var a=i?Object.getOwnPropertyDescriptor(e,s):null;a&&(a.get||a.set)?Object.defineProperty(o,s,a):o[s]=e[s]}return o.default=e,r&&r.set(e,o),o}},94941,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"default",{enumerable:!0,get:function(){return a}});let n=e.r(91788),o="u"<typeof window,i=o?()=>{}:n.useLayoutEffect,s=o?()=>{}:n.useEffect;function a(e){let{headManager:t,reduceComponentsToState:r}=e;function a(){if(t&&t.mountedInstances){let e=n.Children.toArray(Array.from(t.mountedInstances).filter(Boolean));t.updateHead(r(e))}}return o&&(t?.mountedInstances?.add(e.children),a()),i(()=>(t?.mountedInstances?.add(e.children),()=>{t?.mountedInstances?.delete(e.children)})),i(()=>(t&&(t._pendingUpdate=a),()=>{t&&(t._pendingUpdate=a)})),s(()=>(t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null),()=>{t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null)})),null}},80963,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={default:function(){return m},defaultHead:function(){return d}};for(var o in n)Object.defineProperty(r,o,{enumerable:!0,get:n[o]});let i=e.r(41705),s=e.r(52456),a=e.r(91398),l=s._(e.r(91788)),c=i._(e.r(94941)),u=e.r(13584);function d(){return[(0,a.jsx)("meta",{charSet:"utf-8"},"charset"),(0,a.jsx)("meta",{name:"viewport",content:"width=device-width"},"viewport")]}function p(e,t){return"string"==typeof t||"number"==typeof t?e:t.type===l.default.Fragment?e.concat(l.default.Children.toArray(t.props.children).reduce((e,t)=>"string"==typeof t||"number"==typeof t?e:e.concat(t),[])):e.concat(t)}e.r(94470);let f=["name","httpEquiv","charSet","itemProp"];function h(e){let t,r,n,o;return e.reduce(p,[]).reverse().concat(d().reverse()).filter((t=new Set,r=new Set,n=new Set,o={},e=>{let i=!0,s=!1;if(e.key&&"number"!=typeof e.key&&e.key.indexOf("$")>0){s=!0;let r=e.key.slice(e.key.indexOf("$")+1);t.has(r)?i=!1:t.add(r)}switch(e.type){case"title":case"base":r.has(e.type)?i=!1:r.add(e.type);break;case"meta":for(let t=0,r=f.length;t<r;t++){let r=f[t];if(e.props.hasOwnProperty(r))if("charSet"===r)n.has(r)?i=!1:n.add(r);else{let t=e.props[r],n=o[r]||new Set;("name"!==r||!s)&&n.has(t)?i=!1:(n.add(t),o[r]=n)}}}return i})).reverse().map((e,t)=>{let r=e.key||t;return l.default.cloneElement(e,{key:r})})}let m=function({children:e}){let t=(0,l.useContext)(u.HeadManagerContext);return(0,a.jsx)(c.default,{reduceComponentsToState:h,headManager:t,children:e})};("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},89129,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={DecodeError:function(){return y},MiddlewareNotFoundError:function(){return w},MissingStaticPage:function(){return v},NormalizeError:function(){return b},PageNotFoundError:function(){return x},SP:function(){return m},ST:function(){return g},WEB_VITALS:function(){return i},execOnce:function(){return s},getDisplayName:function(){return d},getLocationOrigin:function(){return c},getURL:function(){return u},isAbsoluteUrl:function(){return l},isResSent:function(){return p},loadGetInitialProps:function(){return h},normalizeRepeatedSlashes:function(){return f},stringifyError:function(){return j}};for(var o in n)Object.defineProperty(r,o,{enumerable:!0,get:n[o]});let i=["CLS","FCP","FID","INP","LCP","TTFB"];function s(e){let t,r=!1;return(...n)=>(r||(r=!0,t=e(...n)),t)}let a=/^[a-zA-Z][a-zA-Z\d+\-.]*?:/,l=e=>a.test(e);function c(){let{protocol:e,hostname:t,port:r}=window.location;return`${e}//${t}${r?":"+r:""}`}function u(){let{href:e}=window.location,t=c();return e.substring(t.length)}function d(e){return"string"==typeof e?e:e.displayName||e.name||"Unknown"}function p(e){return e.finished||e.headersSent}function f(e){let t=e.split("?");return t[0].replace(/\\/g,"/").replace(/\/\/+/g,"/")+(t[1]?`?${t.slice(1).join("?")}`:"")}async function h(e,t){let r=t.res||t.ctx&&t.ctx.res;if(!e.getInitialProps)return t.ctx&&t.Component?{pageProps:await h(t.Component,t.ctx)}:{};let n=await e.getInitialProps(t);if(r&&p(r))return n;if(!n)throw Object.defineProperty(Error(`"${d(e)}.getInitialProps()" should resolve to an object. But found "${n}" instead.`),"__NEXT_ERROR_CODE",{value:"E1025",enumerable:!1,configurable:!0});return n}let m="u">typeof performance,g=m&&["mark","measure","getEntriesByName"].every(e=>"function"==typeof performance[e]);class y extends Error{}class b extends Error{}class x extends Error{constructor(e){super(),this.code="ENOENT",this.name="PageNotFoundError",this.message=`Cannot find module for page: ${e}`}}class v extends Error{constructor(e,t){super(),this.message=`Failed to load static file for page: ${e} ${t}`}}class w extends Error{constructor(){super(),this.code="ENOENT",this.message="Cannot find the middleware module"}}function j(e){return JSON.stringify({message:e.message,stack:e.stack})}},3828,(e,t,r)=>{t.exports=e.r(26990)},58678,(e,t,r)=>{t.exports=e.r(80963)},36103,e=>{"use strict";e.s(["clearToken",0,function(){try{localStorage.removeItem("auth_token")}catch(e){}},"getToken",0,function(){try{return localStorage.getItem("auth_token")}catch(e){return null}},"saveToken",0,function(e){try{localStorage.setItem("auth_token",e)}catch(e){}}])},22545,e=>{"use strict";var t=e.i(36103);async function r(e,n={}){let o=(0,t.getToken)(),i={"Content-Type":"application/json",...n.headers||{}};return o&&(i.Authorization=`Bearer ${o}`),fetch(`https://13.51.162.232.nip.io${e}`,{...n,headers:i})}e.s(["apiFetch",0,r])},38655,e=>{"use strict";let t="ls-sound-settings",r={homeVolume:60,clickVolume:80,gameVolume:80};e.s(["DEFAULT_SOUND_SETTINGS",0,r,"getVolumeForCategory",0,function(e,t){let r="home"===t?e.homeVolume:"click"===t?e.clickVolume:e.gameVolume;return Math.min(1,Math.max(0,("number"==typeof r?r:0)/100))},"loadSoundSettings",0,function(){try{let e=window.localStorage.getItem(t);if(!e)return r;let n=JSON.parse(e);return{homeVolume:"number"==typeof n.homeVolume?n.homeVolume:r.homeVolume,clickVolume:"number"==typeof n.clickVolume?n.clickVolume:r.clickVolume,gameVolume:"number"==typeof n.gameVolume?n.gameVolume:r.gameVolume}}catch{return r}},"saveSoundSettings",0,function(e){let n={homeVolume:"number"==typeof e.homeVolume?e.homeVolume:r.homeVolume,clickVolume:"number"==typeof e.clickVolume?e.clickVolume:r.clickVolume,gameVolume:"number"==typeof e.gameVolume?e.gameVolume:r.gameVolume};window.localStorage.setItem(t,JSON.stringify(n))}])},6619,e=>{"use strict";function t(){return window.__bgm||(window.__bgm=new Audio("/sound/home page song.mp3"),window.__bgm.loop=!0),window.__bgm}e.s(["playBGM",0,function(){let e=t();e&&e.play().catch(()=>{})},"setBGMVolume",0,function(e){let r=t();r&&(r.volume=e)},"stopBGM",0,function(){let e=t();e&&(e.pause(),e.currentTime=0)}])},17358,(e,t,r)=>{},92237,(e,t,r)=>{var n=e.i(50461);e.r(17358);var o=e.r(91788),i=o&&"object"==typeof o&&"default"in o?o:{default:o},s=void 0!==n.default&&n.default.env&&!0,a=function(e){return"[object String]"===Object.prototype.toString.call(e)},l=function(){function e(e){var t=void 0===e?{}:e,r=t.name,n=void 0===r?"stylesheet":r,o=t.optimizeForSpeed,i=void 0===o?s:o;c(a(n),"`name` must be a string"),this._name=n,this._deletedRulePlaceholder="#"+n+"-deleted-rule____{}",c("boolean"==typeof i,"`optimizeForSpeed` must be a boolean"),this._optimizeForSpeed=i,this._serverSheet=void 0,this._tags=[],this._injected=!1,this._rulesCount=0;var l="u">typeof window&&document.querySelector('meta[property="csp-nonce"]');this._nonce=l?l.getAttribute("content"):null}var t,r=e.prototype;return r.setOptimizeForSpeed=function(e){c("boolean"==typeof e,"`setOptimizeForSpeed` accepts a boolean"),c(0===this._rulesCount,"optimizeForSpeed cannot be when rules have already been inserted"),this.flush(),this._optimizeForSpeed=e,this.inject()},r.isOptimizeForSpeed=function(){return this._optimizeForSpeed},r.inject=function(){var e=this;if(c(!this._injected,"sheet already injected"),this._injected=!0,"u">typeof window&&this._optimizeForSpeed){this._tags[0]=this.makeStyleTag(this._name),this._optimizeForSpeed="insertRule"in this.getSheet(),this._optimizeForSpeed||(s||console.warn("StyleSheet: optimizeForSpeed mode not supported falling back to standard mode."),this.flush(),this._injected=!0);return}this._serverSheet={cssRules:[],insertRule:function(t,r){return"number"==typeof r?e._serverSheet.cssRules[r]={cssText:t}:e._serverSheet.cssRules.push({cssText:t}),r},deleteRule:function(t){e._serverSheet.cssRules[t]=null}}},r.getSheetForTag=function(e){if(e.sheet)return e.sheet;for(var t=0;t<document.styleSheets.length;t++)if(document.styleSheets[t].ownerNode===e)return document.styleSheets[t]},r.getSheet=function(){return this.getSheetForTag(this._tags[this._tags.length-1])},r.insertRule=function(e,t){if(c(a(e),"`insertRule` accepts only strings"),"u"<typeof window)return"number"!=typeof t&&(t=this._serverSheet.cssRules.length),this._serverSheet.insertRule(e,t),this._rulesCount++;if(this._optimizeForSpeed){var r=this.getSheet();"number"!=typeof t&&(t=r.cssRules.length);try{r.insertRule(e,t)}catch(t){return s||console.warn("StyleSheet: illegal rule: \n\n"+e+"\n\nSee https://stackoverflow.com/q/20007992 for more info"),-1}}else{var n=this._tags[t];this._tags.push(this.makeStyleTag(this._name,e,n))}return this._rulesCount++},r.replaceRule=function(e,t){if(this._optimizeForSpeed||"u"<typeof window){var r="u">typeof window?this.getSheet():this._serverSheet;if(t.trim()||(t=this._deletedRulePlaceholder),!r.cssRules[e])return e;r.deleteRule(e);try{r.insertRule(t,e)}catch(n){s||console.warn("StyleSheet: illegal rule: \n\n"+t+"\n\nSee https://stackoverflow.com/q/20007992 for more info"),r.insertRule(this._deletedRulePlaceholder,e)}}else{var n=this._tags[e];c(n,"old rule at index `"+e+"` not found"),n.textContent=t}return e},r.deleteRule=function(e){if("u"<typeof window)return void this._serverSheet.deleteRule(e);if(this._optimizeForSpeed)this.replaceRule(e,"");else{var t=this._tags[e];c(t,"rule at index `"+e+"` not found"),t.parentNode.removeChild(t),this._tags[e]=null}},r.flush=function(){this._injected=!1,this._rulesCount=0,"u">typeof window?(this._tags.forEach(function(e){return e&&e.parentNode.removeChild(e)}),this._tags=[]):this._serverSheet.cssRules=[]},r.cssRules=function(){var e=this;return"u"<typeof window?this._serverSheet.cssRules:this._tags.reduce(function(t,r){return r?t=t.concat(Array.prototype.map.call(e.getSheetForTag(r).cssRules,function(t){return t.cssText===e._deletedRulePlaceholder?null:t})):t.push(null),t},[])},r.makeStyleTag=function(e,t,r){t&&c(a(t),"makeStyleTag accepts only strings as second parameter");var n=document.createElement("style");this._nonce&&n.setAttribute("nonce",this._nonce),n.type="text/css",n.setAttribute("data-"+e,""),t&&n.appendChild(document.createTextNode(t));var o=document.head||document.getElementsByTagName("head")[0];return r?o.insertBefore(n,r):o.appendChild(n),n},t=[{key:"length",get:function(){return this._rulesCount}}],function(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}(e.prototype,t),e}();function c(e,t){if(!e)throw Error("StyleSheet: "+t+".")}var u=function(e){for(var t=5381,r=e.length;r;)t=33*t^e.charCodeAt(--r);return t>>>0},d={};function p(e,t){if(!t)return"jsx-"+e;var r=String(t),n=e+r;return d[n]||(d[n]="jsx-"+u(e+"-"+r)),d[n]}function f(e,t){"u"<typeof window&&(t=t.replace(/\/style/gi,"\\/style"));var r=e+t;return d[r]||(d[r]=t.replace(/__jsx-style-dynamic-selector/g,e)),d[r]}var h=function(){function e(e){var t=void 0===e?{}:e,r=t.styleSheet,n=void 0===r?null:r,o=t.optimizeForSpeed,i=void 0!==o&&o;this._sheet=n||new l({name:"styled-jsx",optimizeForSpeed:i}),this._sheet.inject(),n&&"boolean"==typeof i&&(this._sheet.setOptimizeForSpeed(i),this._optimizeForSpeed=this._sheet.isOptimizeForSpeed()),this._fromServer=void 0,this._indices={},this._instancesCounts={}}var t=e.prototype;return t.add=function(e){var t=this;void 0===this._optimizeForSpeed&&(this._optimizeForSpeed=Array.isArray(e.children),this._sheet.setOptimizeForSpeed(this._optimizeForSpeed),this._optimizeForSpeed=this._sheet.isOptimizeForSpeed()),"u">typeof window&&!this._fromServer&&(this._fromServer=this.selectFromServer(),this._instancesCounts=Object.keys(this._fromServer).reduce(function(e,t){return e[t]=0,e},{}));var r=this.getIdAndRules(e),n=r.styleId,o=r.rules;if(n in this._instancesCounts){this._instancesCounts[n]+=1;return}var i=o.map(function(e){return t._sheet.insertRule(e)}).filter(function(e){return -1!==e});this._indices[n]=i,this._instancesCounts[n]=1},t.remove=function(e){var t=this,r=this.getIdAndRules(e).styleId;if(function(e,t){if(!e)throw Error("StyleSheetRegistry: "+t+".")}(r in this._instancesCounts,"styleId: `"+r+"` not found"),this._instancesCounts[r]-=1,this._instancesCounts[r]<1){var n=this._fromServer&&this._fromServer[r];n?(n.parentNode.removeChild(n),delete this._fromServer[r]):(this._indices[r].forEach(function(e){return t._sheet.deleteRule(e)}),delete this._indices[r]),delete this._instancesCounts[r]}},t.update=function(e,t){this.add(t),this.remove(e)},t.flush=function(){this._sheet.flush(),this._sheet.inject(),this._fromServer=void 0,this._indices={},this._instancesCounts={}},t.cssRules=function(){var e=this,t=this._fromServer?Object.keys(this._fromServer).map(function(t){return[t,e._fromServer[t]]}):[],r=this._sheet.cssRules();return t.concat(Object.keys(this._indices).map(function(t){return[t,e._indices[t].map(function(e){return r[e].cssText}).join(e._optimizeForSpeed?"":"\n")]}).filter(function(e){return!!e[1]}))},t.styles=function(e){var t,r;return t=this.cssRules(),void 0===(r=e)&&(r={}),t.map(function(e){var t=e[0],n=e[1];return i.default.createElement("style",{id:"__"+t,key:"__"+t,nonce:r.nonce?r.nonce:void 0,dangerouslySetInnerHTML:{__html:n}})})},t.getIdAndRules=function(e){var t=e.children,r=e.dynamic,n=e.id;if(r){var o=p(n,r);return{styleId:o,rules:Array.isArray(t)?t.map(function(e){return f(o,e)}):[f(o,t)]}}return{styleId:p(n),rules:Array.isArray(t)?t:[t]}},t.selectFromServer=function(){return Array.prototype.slice.call(document.querySelectorAll('[id^="__jsx-"]')).reduce(function(e,t){return e[t.id.slice(2)]=t,e},{})},e}(),m=o.createContext(null);function g(){return new h}function y(){return o.useContext(m)}m.displayName="StyleSheetContext";var b=i.default.useInsertionEffect||i.default.useLayoutEffect,x="u">typeof window?g():void 0;function v(e){var t=x||y();return t&&("u"<typeof window?t.add(e):b(function(){return t.add(e),function(){t.remove(e)}},[e.id,String(e.dynamic)])),null}v.dynamic=function(e){return e.map(function(e){return p(e[0],e[1])}).join(" ")},r.StyleRegistry=function(e){var t=e.registry,r=e.children,n=o.useContext(m),s=o.useState(function(){return n||t||g()})[0];return i.default.createElement(m.Provider,{value:s},r)},r.createStyleRegistry=g,r.style=v,r.useStyleRegistry=y},45246,(e,t,r)=>{t.exports=e.r(92237).style},41738,e=>{"use strict";let t=(0,e.i(98934).registerPlugin)("Browser",{web:()=>e.A(99983).then(e=>new e.BrowserWeb)});e.s(["Browser",0,t])},57626,e=>{"use strict";e.i(50461);var t=e.i(91398),r=e.i(91788),n=e.i(3828),o=e.i(58678),i=e.i(6619),s=e.i(38655),a=e.i(45246),l=e.i(22545);let c={width:"100%",background:"rgba(0,0,0,0.35)",border:"1px solid rgba(255,255,255,0.08)",color:"#F0F4FF",padding:"13px 15px",borderRadius:"13px",fontSize:"15px",outline:"none",boxSizing:"border-box"};function u({value:e,onChange:n,disabled:o=!1,required:i=!1}){let[s,d]=(0,r.useState)([]),[p,f]=(0,r.useState)(!0),[h,m]=(0,r.useState)(!1),[g,y]=(0,r.useState)(""),b=(0,r.useRef)(null);(0,r.useEffect)(()=>{let e=!1;return(0,l.apiFetch)("/api/countries").then(e=>(e.ok||console.error("Failed to fetch countries, HTTP:",e.status),e.json())).then(t=>{console.log("Fetched countries payload:",t),!e&&t.countries?(console.log("Setting countries state, count:",t.countries.length),d(t.countries)):console.log("Not setting countries. cancelled:",e,"hasCountries:",!!t.countries)}).catch(e=>{console.error("Error fetching countries:",e)}).finally(()=>{e||f(!1)}),()=>{e=!0}},[]),(0,r.useEffect)(()=>{let e=e=>{b.current&&!b.current.contains(e.target)&&m(!1)};return document.addEventListener("mousedown",e),()=>document.removeEventListener("mousedown",e)},[]);let x=(0,r.useMemo)(()=>s.find(t=>String(t.id)===String(e)),[s,e]),v=(0,r.useMemo)(()=>{let e=g.trim().toLowerCase();return e?s.filter(t=>t.name.toLowerCase().includes(e)||t.phoneCode.includes(e)||t.iso2.toLowerCase().includes(e)):s},[s,g]);return(0,t.jsxs)("div",{ref:b,className:"jsx-e63188d179f41338 input-group country-select",children:[(0,t.jsxs)("label",{className:"jsx-e63188d179f41338",children:["Country",i&&(0,t.jsx)("span",{style:{color:"#FF5A5A",marginLeft:"3px"},className:"jsx-e63188d179f41338",children:"*"})]}),(0,t.jsxs)("div",{className:"jsx-e63188d179f41338 country-select-control",children:[(0,t.jsxs)("button",{type:"button",onClick:()=>!o&&!p&&m(e=>!e),disabled:o||p,style:c,className:"jsx-e63188d179f41338 country-select-trigger",children:[p?(0,t.jsx)("span",{className:"jsx-e63188d179f41338 country-select-placeholder",children:"Loading countries…"}):x?(0,t.jsxs)("span",{className:"jsx-e63188d179f41338 country-select-value",children:[(0,t.jsx)("span",{className:"jsx-e63188d179f41338 country-flag",children:x.flag}),(0,t.jsx)("span",{className:"jsx-e63188d179f41338",children:x.name}),(0,t.jsxs)("span",{className:"jsx-e63188d179f41338 country-dial",children:["+",x.phoneCode]})]}):(0,t.jsx)("span",{className:"jsx-e63188d179f41338 country-select-placeholder",children:"Select your country"}),(0,t.jsx)("span",{className:"jsx-e63188d179f41338 country-select-chevron",children:h?"▴":"▾"})]}),h&&(0,t.jsxs)("div",{className:"jsx-e63188d179f41338 country-select-menu",children:[(0,t.jsx)("input",{type:"text",placeholder:"Search country or code…",value:g,onChange:e=>y(e.target.value),autoFocus:!0,className:"jsx-e63188d179f41338 country-select-search"}),(0,t.jsx)("ul",{className:"jsx-e63188d179f41338 country-select-list",children:0===v.length?(0,t.jsx)("li",{className:"jsx-e63188d179f41338 country-select-empty",children:"No countries found"}):v.map(r=>(0,t.jsx)("li",{className:"jsx-e63188d179f41338",children:(0,t.jsxs)("button",{type:"button",onClick:()=>{n(String(r.id)),m(!1),y("")},className:`jsx-e63188d179f41338 country-select-option${String(r.id)===String(e)?" selected":""}`,children:[(0,t.jsx)("span",{className:"jsx-e63188d179f41338 country-flag",children:r.flag}),(0,t.jsx)("span",{className:"jsx-e63188d179f41338 country-name",children:r.name}),(0,t.jsxs)("span",{className:"jsx-e63188d179f41338 country-dial",children:["+",r.phoneCode]})]})},r.id))})]})]}),(0,t.jsx)(a.default,{id:"e63188d179f41338",children:".country-select-control.jsx-e63188d179f41338{position:relative}.country-select-trigger.jsx-e63188d179f41338{cursor:pointer;text-align:left;justify-content:space-between;align-items:center;gap:10px;font-family:DM Sans,sans-serif;display:flex}.country-select-trigger.jsx-e63188d179f41338:disabled{opacity:.6;cursor:not-allowed}.country-select-value.jsx-e63188d179f41338{flex:1;align-items:center;gap:8px;min-width:0;display:flex}.country-select-placeholder.jsx-e63188d179f41338{color:#3d4a5a}.country-flag.jsx-e63188d179f41338{flex-shrink:0;font-size:18px;line-height:1}.country-dial.jsx-e63188d179f41338{color:#8896a7;flex-shrink:0;margin-left:auto;font-size:13px}.country-select-chevron.jsx-e63188d179f41338{color:#8896a7;flex-shrink:0;font-size:11px}.country-select-menu.jsx-e63188d179f41338{z-index:30;background:#0c101cfa;border:1px solid #ffffff1a;border-radius:13px;position:absolute;top:calc(100% + 6px);left:0;right:0;overflow:hidden;box-shadow:0 12px 32px #00000073}.country-select-search.jsx-e63188d179f41338{box-sizing:border-box;color:#f0f4ff;background:#00000059;border:none;border-bottom:1px solid #ffffff14;outline:none;width:100%;padding:12px 14px;font-family:DM Sans,sans-serif;font-size:14px}.country-select-search.jsx-e63188d179f41338::placeholder{color:#3d4a5a}.country-select-list.jsx-e63188d179f41338{max-height:220px;margin:0;padding:6px;list-style:none;overflow-y:auto}.country-select-option.jsx-e63188d179f41338{color:#f0f4ff;cursor:pointer;text-align:left;background:0 0;border:none;border-radius:10px;align-items:center;gap:8px;width:100%;padding:10px;font-family:DM Sans,sans-serif;font-size:14px;display:flex}.country-select-option.jsx-e63188d179f41338:hover,.country-select-option.selected.jsx-e63188d179f41338{background:#ffc8571f}.country-name.jsx-e63188d179f41338{white-space:nowrap;text-overflow:ellipsis;flex:1;min-width:0;overflow:hidden}.country-select-empty.jsx-e63188d179f41338{color:#8896a7;padding:12px 10px;font-size:13px}"})]})}var d=e.i(36103);let p=(0,e.i(98934).registerPlugin)("App",{web:()=>e.A(75484).then(e=>new e.AppWeb)});var f=e.i(41738);let h=null;window.Capacitor&&e.A(21748).then(e=>{h=e.Browser}).catch(()=>{});let m=()=>(0,t.jsxs)("svg",{width:"20",height:"20",viewBox:"0 0 48 48",children:[(0,t.jsx)("path",{fill:"#EA4335",d:"M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.7 2.3 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.8 6C12.4 13 17.8 9.5 24 9.5z"}),(0,t.jsx)("path",{fill:"#4285F4",d:"M46.6 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8C43.8 37.3 46.6 31.4 46.6 24.5z"}),(0,t.jsx)("path",{fill:"#FBBC05",d:"M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.8-6A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.7 10.7l7.8-6z"}),(0,t.jsx)("path",{fill:"#34A853",d:"M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.2 0-11.5-4.2-13.4-9.8l-7.8 6C6.6 42.6 14.6 48 24 48z"})]}),g=()=>(0,t.jsx)("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"#FFFFFF",children:(0,t.jsx)("path",{d:"M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.27h3.32l-.53 3.5h-2.79V24C19.61 23.1 24 18.1 24 12.07z"})});function y({label:e,type:r="text",value:n,onChange:o,placeholder:i,maxLength:s,autoComplete:a,required:l}){return(0,t.jsxs)("div",{className:"input-group",children:[(0,t.jsxs)("label",{children:[e,l&&(0,t.jsx)("span",{style:{color:"#FF5A5A",marginLeft:"3px"},children:"*"})]}),(0,t.jsx)("input",{type:r,value:n,onChange:e=>o(e.target.value),placeholder:i,maxLength:s,autoComplete:a})]})}function b({suit:e,style:r}){return(0,t.jsx)("div",{className:"suit-particle",style:r,children:e})}e.s(["default",0,function(){let e=(0,n.useRouter)(),[a,c]=(0,r.useState)("main"),[x,v]=(0,r.useState)(!0),[w,j]=(0,r.useState)(""),[S,k]=(0,r.useState)(""),[_,C]=(0,r.useState)(""),[F,E]=(0,r.useState)(!1),[N,L]=(0,r.useState)(""),[P,A]=(0,r.useState)(""),[O,R]=(0,r.useState)(""),[T,z]=(0,r.useState)(""),[D,I]=(0,r.useState)(""),[$,B]=(0,r.useState)(""),[U,M]=(0,r.useState)(""),[V,q]=(0,r.useState)(""),[G,Y]=(0,r.useState)(""),[W,H]=(0,r.useState)(null),[X,J]=(0,r.useState)(!1),[K,Z]=(0,r.useState)(""),[Q,ee]=(0,r.useState)(""),[et,er]=(0,r.useState)(!1);(0,r.useEffect)(()=>{let e=setInterval(()=>{er(e=>!e)},3e3);return()=>clearInterval(e)},[]),(0,r.useEffect)(()=>{let e=()=>{(0,i.playBGM)(),document.removeEventListener("click",e),document.removeEventListener("keydown",e),document.removeEventListener("touchstart",e),document.removeEventListener("scroll",e),document.removeEventListener("touchmove",e),document.removeEventListener("wheel",e)},t=(0,s.loadSoundSettings)();return(0,i.setBGMVolume)((0,s.getVolumeForCategory)(t,"home")),(0,i.playBGM)(),document.addEventListener("click",e),document.addEventListener("keydown",e),document.addEventListener("touchstart",e),document.addEventListener("scroll",e),document.addEventListener("touchmove",e),document.addEventListener("wheel",e),()=>{document.removeEventListener("click",e),document.removeEventListener("keydown",e),document.removeEventListener("touchstart",e),document.removeEventListener("scroll",e),document.removeEventListener("touchmove",e),document.removeEventListener("wheel",e)}},[]),(0,r.useEffect)(()=>{(0,l.apiFetch)("/api/auth/me").then(e=>e.json()).then(t=>{let r=e.query?.upgradeGuest==="1";t.user?r&&"guest"===t.user.type?(R(t.user.nickname||""),L(t.user.nickname||""),H(t.user.guestSessionId||null),c("main"),v(!1)):e.replace("/"):v(!1)}).catch(()=>v(!1))},[e.query]),(0,r.useEffect)(()=>{let{step:t,provider:r,tempToken:n,firstName:o,lastName:i,guestName:s,guestSessionId:a,error:l}=e.query||{};l&&Z(decodeURIComponent(l)),"complete-profile"===t&&r&&n&&(c("oauth-profile"),Y(r),q(decodeURIComponent(n)),o&&L(decodeURIComponent(o).slice(0,20)),i&&A(decodeURIComponent(i).slice(0,20)),a&&H(Number(a)),v(!1))},[e.query]),(0,r.useEffect)(()=>{if(window.Capacitor){var t;t=({provider:e,tempToken:t,firstName:r,lastName:n})=>{Y(e),q(t),r&&L(r.slice(0,20)),n&&A(n.slice(0,20)),c("oauth-profile"),v(!1)},p.addListener("appUrlOpen",async({url:r})=>{if(!r.startsWith("cc.altius.leastscore://oauth"))return;try{await f.Browser.close()}catch(e){}let n=new URLSearchParams(r.split("?")[1]||""),o=n.get("token"),i=n.get("error"),s=n.get("step");if(o){(0,d.saveToken)(o),(()=>e.replace("/"))();return}if("complete-profile"===s){let e=n.get("provider")||"",r=n.get("tempToken")||"",o=decodeURIComponent(n.get("firstName")||""),i=decodeURIComponent(n.get("lastName")||"");t({provider:e,tempToken:r,firstName:o,lastName:i});return}i?(e=>Z(e))(decodeURIComponent(i)):(e=>Z(e))("OAuth login failed. Please try again.")})}},[]),(0,r.useEffect)(()=>{let e=e=>{if(e.target.closest("button, .link-text, .logo-card-wrap")){let e=new Audio("/sound/touch%20sound.wav"),t=(0,s.loadSoundSettings)();e.volume=(0,s.getVolumeForCategory)(t,"click"),e.play().catch(()=>{})}};return document.addEventListener("click",e),()=>document.removeEventListener("click",e)},[]);let en=async(e,t)=>(await (0,l.apiFetch)(e,{method:"POST",body:JSON.stringify(t)})).json(),eo=async e=>{J(!0),Z(""),ee("");try{await e()}catch(e){Z("An unexpected error occurred.")}finally{J(!1)}},ei=async e=>{try{console.log("==== OAUTH DEBUG ===="),console.log("1. Provider:",e);let t=!!window.Capacitor;console.log("2. Is Mobile?",t);let r="https://13.51.162.232.nip.io";if(r.startsWith("http")||(r="https://"+r),W)return;let n=t?`${r}/api/auth/oauth/${e}?mobile=1`:`${r}/api/auth/oauth/${e}`;console.log("4. Target URL:",n),console.log("5. CapacitorBrowser Available?",!!h),t&&h?(console.log("6. Calling CapacitorBrowser.open()..."),await h.open({url:n}),console.log("7. CapacitorBrowser.open() finished!")):(console.log("6. Redirecting via window.location..."),window.location.href=n)}catch(e){console.error("❌ ERROR in handleOAuth:",e);try{window.open(url,"_system")}catch(e){Z("Unable to open browser. Please ensure a web browser (like Chrome) is installed.")}}},es=e=>{c(e),Z(""),ee(""),E(!1),C("")};return x?(0,t.jsx)("div",{className:"mobile-app-container",children:(0,t.jsx)("div",{className:"mobile-frame",style:{alignItems:"center",justifyContent:"center"},children:(0,t.jsx)("div",{className:"premium-spinner"})})}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(o.default,{children:[(0,t.jsx)("title",{children:"Login — LeastScore"}),(0,t.jsx)("link",{href:"https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap",rel:"stylesheet"})]}),(0,t.jsx)("style",{children:`
        *, *::before, *::after { box-sizing: border-box; }

        body {
          margin: 0;
          background: #07090F;
        }

        /* ── Layout ── */
        .mobile-app-container {
          min-height: 100vh;
          background: #07090F;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
        }

        .mobile-frame {
          width: 100%;
          min-height: 100vh;
          background: #0D1117;
          position: relative;
          overflow-y: auto;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          -webkit-overflow-scrolling: touch;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .mobile-frame::-webkit-scrollbar { display: none; }

        @media (min-width: 600px) {
          .mobile-frame {
            max-width: 420px;
            min-height: 820px;
            height: 92vh;
            border-radius: 44px;
            box-shadow:
              0 40px 100px rgba(0,0,0,0.7),
              0 0 0 1px rgba(255,255,255,0.04),
              0 0 0 2px rgba(0,0,0,0.6),
              0 0 160px rgba(58,77,255,0.08);
          }
        }

        /* ── Background mesh gradient (static, no animation = no layout cost) ── */
        .bg-mesh {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background:
            radial-gradient(ellipse 70% 50% at 90% 5%, rgba(58,77,255,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 10% 95%, rgba(255,200,87,0.10) 0%, transparent 65%),
            radial-gradient(ellipse 40% 30% at 50% 50%, rgba(58,77,255,0.04) 0%, transparent 80%);
        }

        /* ── Suit particles ── */
        .suit-particle {
          position: absolute;
          pointer-events: none;
          z-index: 1;
          color: #CBD5E1;
          font-size: 18px;
          user-select: none;
          animation: suitDrift linear infinite;
        }
        @keyframes suitDrift {
          0%   { transform: translateY(0px) rotate(0deg); }
          33%  { transform: translateY(-14px) rotate(6deg); }
          66%  { transform: translateY(8px) rotate(-4deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }

        /* ── Scroll content ── */
        .scroll-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 10;
          padding: 24px 28px 40px;
        }

        /* ── Logo ── */
        .logo-section {
          text-align: center;
          margin: 60px 0 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* 3D card flip */
        .logo-card-wrap {
          perspective: 400px;
          display: inline-block;
          margin-bottom: 20px;
          cursor: pointer;
        }
        .logo-card-inner {
          width: 56px;
          height: 56px;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          margin: 0 auto;
        }
        .logo-card-inner.flipped {
          transform: rotateY(180deg);
        }
        .logo-card-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          line-height: 1;
          filter: drop-shadow(0 0 16px rgba(255,200,87,0.3));
        }
        .logo-card-face.back {
          transform: rotateY(180deg);
        }

        .logo-title {
          margin: 0;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 44px;
          font-weight: 400;
          color: #F0F4FF;
          letter-spacing: 3px;
          line-height: 1;
          position: relative;
          display: inline-block;
        }
        /* Gold underline accent with glow */
        .logo-title::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 10%;
          width: 80%;
          height: 2.5px;
          background: linear-gradient(90deg, transparent, #FFC857, transparent);
          border-radius: 4px;
          box-shadow: 0 0 16px rgba(255,200,87,0.6);
        }

        .logo-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-top: 14px;
          background: rgba(255,200,87,0.08);
          border: 1px solid rgba(255,200,87,0.2);
          color: #FFC857;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 100px;
          width: fit-content;
          max-width: 100%;
        }

        .logo-subtitle {
          margin: 12px auto 0;
          color: #8896A7;
          font-size: 14px;
          line-height: 1.6;
          max-width: 240px;
          font-weight: 400;
        }

        /* ── Card surface ── */
        .card-surface {
          background: rgba(255,255,255,0.028);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 28px;
          padding: 28px 24px;
          box-shadow:
            0 1px 0 rgba(255,255,255,0.04) inset,
            0 24px 48px rgba(0,0,0,0.5);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          animation: cardEntrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes cardEntrance {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── Buttons ── */

        /* Google — white/light treatment for authenticity */
        .btn-google {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #F8F9FA;
          color: #1A1A2E;
          padding: 15px;
          border-radius: 16px;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.35);
        }
        .btn-google:hover:not(:disabled) {
          background: #FFFFFF;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.4);
        }
        .btn-google:active:not(:disabled) { transform: scale(0.98); }
        .btn-google:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Primary — gold accent */
        .btn-primary {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: linear-gradient(135deg, #3A4DFF 0%, #2D3DE6 100%);
          color: #FFFFFF;
          padding: 15px;
          border-radius: 16px;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(58,77,255,0.35);
        }
        .btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%);
          pointer-events: none;
        }
        /* Sweeping shimmer */
        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0; left: -130%;
          width: 55%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: skewX(-18deg);
          animation: btnSweep 5s 1.2s infinite;
        }
        @keyframes btnSweep {
          0%   { left: -130%; }
          18%  { left: 150%; }
          100% { left: 150%; }
        }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(58,77,255,0.5);
        }
        .btn-primary:active:not(:disabled) { transform: scale(0.98); }
        .btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

        /* Facebook — brand blue treatment */
        .btn-facebook {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #1877F2;
          color: #FFFFFF;
          padding: 15px;
          border-radius: 16px;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 2px 8px rgba(24,119,242,0.35);
        }
        .btn-facebook:hover:not(:disabled) {
          background: #2D88FF;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(24,119,242,0.45);
        }
        .btn-facebook:active:not(:disabled) { transform: scale(0.98); }
        .btn-facebook:disabled { opacity: 0.5; cursor: not-allowed; }

        .btn-secondary {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: rgba(255,255,255,0.04);
          color: #A8B4C2;
          padding: 15px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.06);
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, transform 0.15s, border-color 0.2s;
        }
        .btn-secondary:hover:not(:disabled) {
          background: rgba(255,255,255,0.08);
          color: #F0F4FF;
          border-color: rgba(255,255,255,0.12);
          transform: translateY(-1px);
        }
        .btn-secondary:active:not(:disabled) { transform: scale(0.98); }
        .btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Gold CTA — for the "play" action that matters most */
        .btn-gold {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: linear-gradient(135deg, #FFD166 0%, #FFC857 100%);
          color: #1A1200;
          padding: 15px;
          border-radius: 16px;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(255,200,87,0.3);
        }
        .btn-gold::before {
          content: '';
          position: absolute;
          top: 0; left: -130%;
          width: 55%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transform: skewX(-18deg);
          animation: btnSweep 4s 0.5s infinite;
        }
        .btn-gold:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(255,200,87,0.45);
        }
        .btn-gold:active:not(:disabled) { transform: scale(0.98); }
        .btn-gold:disabled { opacity: 0.55; cursor: not-allowed; }

        .btn-back {
          background: transparent;
          border: none;
          color: #FF5A5A;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          padding: 0;
          margin-bottom: 20px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: color 0.2s, text-shadow 0.2s, transform 0.15s;
          letter-spacing: 0.01em;
          text-shadow: 0 0 12px rgba(255, 90, 90, 0.7);
        }
        .btn-back:hover {
          color: #FF5A5A;
          transform: translateX(-2px);
          text-shadow: 0 0 16px rgba(255, 90, 90, 0.9);
        }

        /* ── Spacing utils ── */
        .mt-3 { margin-top: 12px; }
        .mt-4 { margin-top: 14px; }

        /* ── View typography ── */
        .view-title {
          margin: 0 0 6px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #F0F4FF;
          letter-spacing: -0.5px;
        }
        .view-desc {
          margin: 0 0 22px;
          font-size: 13.5px;
          color: #8896A7;
          line-height: 1.6;
        }

        /* ── Divider ── */
        .divider {
          display: flex;
          align-items: center;
          margin: 20px 0;
          gap: 12px;
        }
        .divider .line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.06);
        }
        .divider .text {
          color: #4A5568;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.15em;
        }

        /* ── Footer links ── */
        .footer-links {
          margin-top: 20px;
          text-align: center;
        }
        .link-text {
          color: #FFC857;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border-bottom: 1px solid transparent;
          transition: color 0.2s, border-color 0.2s, text-shadow 0.2s, transform 0.1s;
        }
        .link-text:hover, .link-text:active {
          border-color: rgba(255,200,87,0.8);
          text-shadow: 0 0 12px rgba(255,200,87,0.8);
        }
        .link-text:active {
          transform: scale(0.98);
        }

        /* ── Inputs ── */
        .input-group {
          margin-bottom: 16px;
        }
        .input-group label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: #8896A7;
          margin-bottom: 7px;
          text-transform: uppercase;
          letter-spacing: 0.09em;
        }
        .input-group input {
          width: 100%;
          background: rgba(0,0,0,0.35);
          border: 1px solid rgba(255,255,255,0.08);
          color: #F0F4FF;
          padding: 13px 15px;
          border-radius: 13px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          box-sizing: border-box;
        }
        .input-group input:focus {
          border-color: rgba(255,200,87,0.5);
          box-shadow: 0 0 0 3px rgba(255,200,87,0.1);
          background: rgba(0,0,0,0.5);
        }
        .input-group input::placeholder { color: #3D4A5A; }
        .input-row { display: flex; gap: 10px; }
        .field-hint {
          font-size: 12.5px;
          color: #A8B6CC;
          margin: -6px 0 14px;
          line-height: 1.45;
        }

        /* ── Username hint ── */
        .username-hint {
          font-size: 12.5px;
          color: #8896A7;
          margin: -8px 0 18px;
          line-height: 1.4;
        }
        .username-hint strong {
          color: #FFC857;
          font-weight: 600;
        }

        /* ── Alerts ── */
        .alert-error {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.25);
          color: #FC8181;
          padding: 11px 15px;
          border-radius: 13px;
          font-size: 13.5px;
          margin-bottom: 18px;
          font-weight: 500;
          line-height: 1.4;
        }
        .alert-success {
          background: rgba(52,211,153,0.08);
          border: 1px solid rgba(52,211,153,0.25);
          color: #6EE7B7;
          padding: 11px 15px;
          border-radius: 13px;
          font-size: 13.5px;
          margin-bottom: 18px;
          font-weight: 500;
        }

        /* ── View enter animation ── */
        .view-animate {
          animation: viewIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes viewIn {
          from { opacity: 0; transform: translateX(8px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        /* ── Spinner ── */
        .premium-spinner {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 2.5px solid rgba(58,77,255,0.12);
          border-top-color: #3A4DFF;
          border-right-color: #FFC857;
          animation: spin 0.85s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Noise texture overlay ── */
        .noise-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.025;
          pointer-events: none;
          z-index: 2;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }

        /* ── Section label for upgrade flow ── */
        .upgrade-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(58,77,255,0.12);
          border: 1px solid rgba(58,77,255,0.25);
          color: #7B8FFF;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 100px;
          margin-bottom: 18px;
        }
        /* ── Forgot password success icon ── */
        .forgot-success-icon {
          font-size: 52px;
          text-align: center;
          margin: 0 0 20px;
          animation: iconPop 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes iconPop {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }

        /* ── Light theme overrides ── */
        [data-theme="light"] .divider .text {
          color: #1E4D32;
        }
        [data-theme="light"] .divider .line {
          background: rgba(30,77,50,0.24);
        }
        [data-theme="light"] .btn-gold {
          background: linear-gradient(135deg, #E0AD18 0%, #A0700A 100%);
          color: #FFFBE8;
          box-shadow: 0 4px 16px rgba(160,112,10,0.48);
          text-shadow: 0 1px 2px rgba(100,65,0,0.35);
        }
        [data-theme="light"] .btn-gold:hover:not(:disabled) {
          background: linear-gradient(135deg, #F0C832 0%, #C8960A 100%);
          box-shadow: 0 8px 24px rgba(160,112,10,0.55);
        }
      `}),(0,t.jsx)("div",{className:"mobile-app-container",children:(0,t.jsxs)("div",{className:"mobile-frame",children:[(0,t.jsx)("div",{className:"bg-mesh"}),(0,t.jsx)("div",{className:"noise-overlay"}),[{suit:"♠",style:{top:"8%",left:"6%",animationDelay:"0s",animationDuration:"18s",fontSize:"22px",opacity:.12}},{suit:"♥",style:{top:"15%",right:"8%",animationDelay:"3s",animationDuration:"22s",fontSize:"16px",opacity:.09,color:"#FF6B6B"}},{suit:"♦",style:{top:"55%",left:"4%",animationDelay:"6s",animationDuration:"20s",fontSize:"18px",opacity:.1,color:"#FF6B6B"}},{suit:"♣",style:{top:"70%",right:"5%",animationDelay:"1.5s",animationDuration:"25s",fontSize:"20px",opacity:.11}},{suit:"♠",style:{top:"40%",right:"3%",animationDelay:"9s",animationDuration:"16s",fontSize:"13px",opacity:.08}},{suit:"♥",style:{top:"85%",left:"10%",animationDelay:"4.5s",animationDuration:"19s",fontSize:"14px",opacity:.07,color:"#FF6B6B"}}].map((e,r)=>(0,t.jsx)(b,{suit:e.suit,style:e.style},r)),(0,t.jsxs)("div",{className:"scroll-content",children:[(0,t.jsxs)("div",{className:"logo-section",children:[(0,t.jsx)("div",{className:"logo-card-wrap",onClick:()=>er(e=>!e),title:"Click to flip",children:(0,t.jsxs)("div",{className:`logo-card-inner${et?" flipped":""}`,children:[(0,t.jsx)("div",{className:"logo-card-face front",children:"🃏"}),(0,t.jsx)("div",{className:"logo-card-face back",children:"🎴"})]})}),(0,t.jsx)("h1",{className:"logo-title",children:"LeastScore"}),"oauth-username"===a?(0,t.jsxs)("p",{className:"logo-subtitle",children:["Set your username for ",G]}):W?(0,t.jsx)("p",{className:"logo-subtitle",children:"Link your account to save stats"}):(0,t.jsx)(t.Fragment,{children:(0,t.jsxs)("div",{className:"logo-badge",children:[(0,t.jsx)("span",{children:"♠"})," The card game where less wins"]})})]}),(0,t.jsxs)("div",{className:"card-surface",children:[K&&(0,t.jsx)("div",{className:"alert-error",children:K}),Q&&(0,t.jsx)("div",{className:"alert-success",children:Q}),"main"===a&&(0,t.jsxs)("div",{className:"view-animate",children:[W&&(0,t.jsx)("div",{className:"upgrade-badge",children:"⬆ Upgrade account"}),(0,t.jsxs)("button",{className:"btn-google",onClick:()=>ei("google"),disabled:X,children:[(0,t.jsx)(m,{})," Continue with Google"]}),(0,t.jsxs)("button",{className:"btn-facebook mt-3",onClick:()=>ei("facebook"),disabled:X,children:[(0,t.jsx)(g,{})," Continue with Facebook"]}),!W&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("div",{className:"divider",children:[(0,t.jsx)("span",{className:"line"}),(0,t.jsx)("span",{className:"text",children:"OR"}),(0,t.jsx)("span",{className:"line"})]}),(0,t.jsxs)("button",{className:"btn-gold",onClick:()=>es("guest"),disabled:X,children:[(0,t.jsx)("span",{children:"👤"})," Play as Guest"]}),(0,t.jsx)("div",{className:"footer-links",children:(0,t.jsx)("span",{className:"link-text",onClick:()=>es("login"),children:"Login with email & password"})})]})]}),"guest"===a&&(0,t.jsxs)("div",{className:"view-animate",children:[(0,t.jsx)("button",{className:"btn-back",onClick:()=>es("main"),children:"← Back"}),(0,t.jsx)("h2",{className:"view-title",children:"Guest Login"}),(0,t.jsx)("p",{className:"view-desc",children:"Play without an account. A random nickname will be assigned automatically."}),(0,t.jsx)("button",{className:"btn-gold mt-4",onClick:()=>eo(async()=>{let t=await en("/api/auth/guest",{});if(t.error)return Z(t.error);t.token&&(0,d.saveToken)(t.token),e.replace("/")}),disabled:X,children:X?"Joining…":"Play as Guest 🎮"})]}),"login"===a&&(0,t.jsxs)("div",{className:"view-animate",children:[(0,t.jsx)("button",{className:"btn-back",onClick:()=>es("main"),children:"← Back"}),(0,t.jsx)("h2",{className:"view-title",children:"Account Login"}),(0,t.jsx)("p",{className:"view-desc",children:"Log in with your email and password."}),(0,t.jsx)(y,{label:"Email",value:w,onChange:j,placeholder:"you@example.com",autoComplete:"username",required:!0}),(0,t.jsx)(y,{label:"Password",type:"password",value:S,onChange:k,placeholder:"Your password",autoComplete:"current-password",required:!0}),(0,t.jsx)("button",{className:"btn-gold mt-4",onClick:()=>eo(async()=>{let t=await en("/api/auth/login",{loginId:w,password:S});return t.error?Z(t.error):(t.token&&(0,d.saveToken)(t.token),t.mustResetPassword)?e.replace("/reset-password"):void e.replace("/")}),disabled:X||!w||!S,children:X?"Logging in…":"Log In"}),(0,t.jsx)("div",{className:"footer-links",children:(0,t.jsx)("span",{className:"link-text",onClick:()=>es("forgot"),children:"Forgot password?"})})]}),"forgot"===a&&(0,t.jsxs)("div",{className:"view-animate",children:[(0,t.jsx)("button",{className:"btn-back",onClick:()=>es("login"),children:"← Back"}),(0,t.jsx)("h2",{className:"view-title",children:"Reset Password"}),F?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("div",{className:"forgot-success-icon",children:"✉️"}),(0,t.jsx)("p",{className:"view-desc",style:{textAlign:"center",marginTop:0},children:"If an account with that email exists, a temporary password has been sent. Check your inbox and use it to log in."}),(0,t.jsx)("button",{className:"btn-secondary mt-4",onClick:()=>es("login"),children:"Go to Login"})]}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("p",{className:"view-desc",children:"Enter the email linked to your account. We'll send you a temporary password."}),(0,t.jsx)(y,{label:"Email Address",type:"email",value:_,onChange:C,placeholder:"you@example.com",autoComplete:"email",required:!0}),(0,t.jsx)("button",{className:"btn-primary mt-4",onClick:()=>eo(async()=>{let e=await en("/api/auth/forgot-password",{email:_});if(e.error)return Z(e.error);E(!0)}),disabled:X||!_.includes("@"),children:X?"Sending…":"📧 Send Temporary Password"})]})]}),"oauth-profile"===a&&(0,t.jsxs)("div",{className:"view-animate",children:[(0,t.jsx)("h2",{className:"view-title",children:"Almost there!"}),(0,t.jsxs)("p",{className:"view-desc",children:["Complete your profile for ",(0,t.jsx)("strong",{style:{color:"#F0F4FF",textTransform:"capitalize"},children:G})," sign-up."]}),(0,t.jsxs)("div",{className:"input-row",children:[(0,t.jsx)("div",{style:{flex:1},children:(0,t.jsx)(y,{label:"First Name",value:N,onChange:L,placeholder:"First Name",maxLength:20,required:!0})}),(0,t.jsx)("div",{style:{flex:1},children:(0,t.jsx)(y,{label:"Last Name",value:P,onChange:A,placeholder:"Last Name",maxLength:20})})]}),(0,t.jsx)(y,{label:"Nickname",value:O,onChange:R,placeholder:"CoolNickname",maxLength:20,required:!0}),(0,t.jsxs)("div",{className:"input-row",children:[(0,t.jsx)("div",{style:{flex:1},children:(0,t.jsx)(y,{label:"DOB (YYYY-MM-DD)",type:"date",value:$,onChange:B,placeholder:"YYYY-MM-DD",required:!0})}),(0,t.jsx)("div",{style:{flex:1},children:(0,t.jsxs)("div",{className:"input-group",children:[(0,t.jsx)("label",{children:"Gender"}),(0,t.jsxs)("select",{value:U,onChange:e=>M(e.target.value),style:{width:"100%",background:"rgba(0,0,0,0.35)",border:"1px solid rgba(255,255,255,0.08)",color:"#F0F4FF",padding:"13px 15px",borderRadius:"13px",fontSize:"15px",outline:"none"},children:[(0,t.jsx)("option",{value:"",children:"Select Gender"}),(0,t.jsx)("option",{value:"male",children:"Male"}),(0,t.jsx)("option",{value:"female",children:"Female"}),(0,t.jsx)("option",{value:"other",children:"Other"})]})]})})]}),(0,t.jsx)(u,{value:D,onChange:I,required:!0}),(0,t.jsx)("p",{className:"field-hint",children:"Please verify your details above."}),(0,t.jsx)("button",{className:"btn-gold",onClick:()=>eo(async()=>{let t=await en("/api/auth/oauth/set-username",{tempToken:V,firstName:N,lastName:P,nickname:O,countryId:D,dob:$,gender:U,guestSessionId:W||void 0});if(t.error)return Z(t.error);t.token&&(0,d.saveToken)(t.token),e.replace("/")}),disabled:X||!N||!O||!D||!$,children:X?"Saving…":"Complete Profile & Play 🎮"})]})]})]})]})})]})}],57626)},87641,(e,t,r)=>{let n="/login";(window.__NEXT_P=window.__NEXT_P||[]).push([n,()=>e.r(57626)]),t.hot&&t.hot.dispose(function(){window.__NEXT_P.push([n])})},48761,e=>{e.v(t=>Promise.all(["static/chunks/0ey~yy8oeyp~5.js"].map(t=>e.l(t))).then(()=>t(93594)))},28805,e=>{e.v(t=>Promise.all(["static/chunks/0599p99vu8fk5.js"].map(t=>e.l(t))).then(()=>t(79466)))},75484,e=>{e.v(t=>Promise.all(["static/chunks/0iy_amkk.ktsj.js"].map(t=>e.l(t))).then(()=>t(18730)))},99983,e=>{e.v(t=>Promise.all(["static/chunks/0t9g.--1fi1om.js"].map(t=>e.l(t))).then(()=>t(2352)))},21748,e=>{e.v(t=>Promise.all(["static/chunks/177h..7u4ftpn.js"].map(t=>e.l(t))).then(()=>t(63655)))}]);