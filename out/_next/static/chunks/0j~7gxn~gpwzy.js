(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,20955,(e,r,t)=>{var n={229:function(e){var r,t,n,o=e.exports={};function a(){throw Error("setTimeout has not been defined")}function i(){throw Error("clearTimeout has not been defined")}try{r="function"==typeof setTimeout?setTimeout:a}catch(e){r=a}try{t="function"==typeof clearTimeout?clearTimeout:i}catch(e){t=i}function s(e){if(r===setTimeout)return setTimeout(e,0);if((r===a||!r)&&setTimeout)return r=setTimeout,setTimeout(e,0);try{return r(e,0)}catch(t){try{return r.call(null,e,0)}catch(t){return r.call(this,e,0)}}}var l=[],c=!1,d=-1;function p(){c&&n&&(c=!1,n.length?l=n.concat(l):d=-1,l.length&&u())}function u(){if(!c){var e=s(p);c=!0;for(var r=l.length;r;){for(n=l,l=[];++d<r;)n&&n[d].run();d=-1,r=l.length}n=null,c=!1,function(e){if(t===clearTimeout)return clearTimeout(e);if((t===i||!t)&&clearTimeout)return t=clearTimeout,clearTimeout(e);try{t(e)}catch(r){try{return t.call(null,e)}catch(r){return t.call(this,e)}}}(e)}}function f(e,r){this.fun=e,this.array=r}function g(){}o.nextTick=function(e){var r=Array(arguments.length-1);if(arguments.length>1)for(var t=1;t<arguments.length;t++)r[t-1]=arguments[t];l.push(new f(e,r)),1!==l.length||c||s(u)},f.prototype.run=function(){this.fun.apply(null,this.array)},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=g,o.addListener=g,o.once=g,o.off=g,o.removeListener=g,o.removeAllListeners=g,o.emit=g,o.prependListener=g,o.prependOnceListener=g,o.listeners=function(e){return[]},o.binding=function(e){throw Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(e){throw Error("process.chdir is not supported")},o.umask=function(){return 0}}},o={};function a(e){var r=o[e];if(void 0!==r)return r.exports;var t=o[e]={exports:{}},i=!0;try{n[e](t,t.exports,a),i=!1}finally{i&&delete o[e]}return t.exports}a.ab="/ROOT/node_modules/next/dist/compiled/process/",r.exports=a(229)},50461,(e,r,t)=>{"use strict";var n,o;r.exports=(null==(n=e.g.process)?void 0:n.env)&&"object"==typeof(null==(o=e.g.process)?void 0:o.env)?e.g.process:e.r(20955)},77325,(e,r,t)=>{"use strict";var n=Symbol.for("react.element"),o=Symbol.for("react.portal"),a=Symbol.for("react.fragment"),i=Symbol.for("react.strict_mode"),s=Symbol.for("react.profiler"),l=Symbol.for("react.provider"),c=Symbol.for("react.context"),d=Symbol.for("react.forward_ref"),p=Symbol.for("react.suspense"),u=Symbol.for("react.memo"),f=Symbol.for("react.lazy"),g=Symbol.iterator,b={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},x=Object.assign,m={};function h(e,r,t){this.props=e,this.context=r,this.refs=m,this.updater=t||b}function y(){}function w(e,r,t){this.props=e,this.context=r,this.refs=m,this.updater=t||b}h.prototype.isReactComponent={},h.prototype.setState=function(e,r){if("object"!=typeof e&&"function"!=typeof e&&null!=e)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,r,"setState")},h.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")},y.prototype=h.prototype;var k=w.prototype=new y;k.constructor=w,x(k,h.prototype),k.isPureReactComponent=!0;var v=Array.isArray,F=Object.prototype.hasOwnProperty,j={current:null},S={key:!0,ref:!0,__self:!0,__source:!0};function _(e,r,t){var o,a={},i=null,s=null;if(null!=r)for(o in void 0!==r.ref&&(s=r.ref),void 0!==r.key&&(i=""+r.key),r)F.call(r,o)&&!S.hasOwnProperty(o)&&(a[o]=r[o]);var l=arguments.length-2;if(1===l)a.children=t;else if(1<l){for(var c=Array(l),d=0;d<l;d++)c[d]=arguments[d+2];a.children=c}if(e&&e.defaultProps)for(o in l=e.defaultProps)void 0===a[o]&&(a[o]=l[o]);return{$$typeof:n,type:e,key:i,ref:s,props:a,_owner:j.current}}function z(e){return"object"==typeof e&&null!==e&&e.$$typeof===n}var E=/\/+/g;function C(e,r){var t,n;return"object"==typeof e&&null!==e&&null!=e.key?(t=""+e.key,n={"=":"=0",":":"=2"},"$"+t.replace(/[=:]/g,function(e){return n[e]})):r.toString(36)}function N(e,r,t){if(null==e)return e;var a=[],i=0;return!function e(r,t,a,i,s){var l,c,d,p=typeof r;("undefined"===p||"boolean"===p)&&(r=null);var u=!1;if(null===r)u=!0;else switch(p){case"string":case"number":u=!0;break;case"object":switch(r.$$typeof){case n:case o:u=!0}}if(u)return s=s(u=r),r=""===i?"."+C(u,0):i,v(s)?(a="",null!=r&&(a=r.replace(E,"$&/")+"/"),e(s,t,a,"",function(e){return e})):null!=s&&(z(s)&&(l=s,c=a+(!s.key||u&&u.key===s.key?"":(""+s.key).replace(E,"$&/")+"/")+r,s={$$typeof:n,type:l.type,key:c,ref:l.ref,props:l.props,_owner:l._owner}),t.push(s)),1;if(u=0,i=""===i?".":i+":",v(r))for(var f=0;f<r.length;f++){var b=i+C(p=r[f],f);u+=e(p,t,a,b,s)}else if("function"==typeof(b=null===(d=r)||"object"!=typeof d?null:"function"==typeof(d=g&&d[g]||d["@@iterator"])?d:null))for(r=b.call(r),f=0;!(p=r.next()).done;)b=i+C(p=p.value,f++),u+=e(p,t,a,b,s);else if("object"===p)throw Error("Objects are not valid as a React child (found: "+("[object Object]"===(t=String(r))?"object with keys {"+Object.keys(r).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return u}(e,a,"","",function(e){return r.call(t,e,i++)}),a}function D(e){if(-1===e._status){var r=e._result;(r=r()).then(function(r){(0===e._status||-1===e._status)&&(e._status=1,e._result=r)},function(r){(0===e._status||-1===e._status)&&(e._status=2,e._result=r)}),-1===e._status&&(e._status=0,e._result=r)}if(1===e._status)return e._result.default;throw e._result}var A={current:null},O={transition:null};function P(){throw Error("act(...) is not supported in production builds of React.")}t.Children={map:N,forEach:function(e,r,t){N(e,function(){r.apply(this,arguments)},t)},count:function(e){var r=0;return N(e,function(){r++}),r},toArray:function(e){return N(e,function(e){return e})||[]},only:function(e){if(!z(e))throw Error("React.Children.only expected to receive a single React element child.");return e}},t.Component=h,t.Fragment=a,t.Profiler=s,t.PureComponent=w,t.StrictMode=i,t.Suspense=p,t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED={ReactCurrentDispatcher:A,ReactCurrentBatchConfig:O,ReactCurrentOwner:j},t.act=P,t.cloneElement=function(e,r,t){if(null==e)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var o=x({},e.props),a=e.key,i=e.ref,s=e._owner;if(null!=r){if(void 0!==r.ref&&(i=r.ref,s=j.current),void 0!==r.key&&(a=""+r.key),e.type&&e.type.defaultProps)var l=e.type.defaultProps;for(c in r)F.call(r,c)&&!S.hasOwnProperty(c)&&(o[c]=void 0===r[c]&&void 0!==l?l[c]:r[c])}var c=arguments.length-2;if(1===c)o.children=t;else if(1<c){l=Array(c);for(var d=0;d<c;d++)l[d]=arguments[d+2];o.children=l}return{$$typeof:n,type:e.type,key:a,ref:i,props:o,_owner:s}},t.createContext=function(e){return(e={$$typeof:c,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null}).Provider={$$typeof:l,_context:e},e.Consumer=e},t.createElement=_,t.createFactory=function(e){var r=_.bind(null,e);return r.type=e,r},t.createRef=function(){return{current:null}},t.forwardRef=function(e){return{$$typeof:d,render:e}},t.isValidElement=z,t.lazy=function(e){return{$$typeof:f,_payload:{_status:-1,_result:e},_init:D}},t.memo=function(e,r){return{$$typeof:u,type:e,compare:void 0===r?null:r}},t.startTransition=function(e){var r=O.transition;O.transition={};try{e()}finally{O.transition=r}},t.unstable_act=P,t.useCallback=function(e,r){return A.current.useCallback(e,r)},t.useContext=function(e){return A.current.useContext(e)},t.useDebugValue=function(){},t.useDeferredValue=function(e){return A.current.useDeferredValue(e)},t.useEffect=function(e,r){return A.current.useEffect(e,r)},t.useId=function(){return A.current.useId()},t.useImperativeHandle=function(e,r,t){return A.current.useImperativeHandle(e,r,t)},t.useInsertionEffect=function(e,r){return A.current.useInsertionEffect(e,r)},t.useLayoutEffect=function(e,r){return A.current.useLayoutEffect(e,r)},t.useMemo=function(e,r){return A.current.useMemo(e,r)},t.useReducer=function(e,r,t){return A.current.useReducer(e,r,t)},t.useRef=function(e){return A.current.useRef(e)},t.useState=function(e){return A.current.useState(e)},t.useSyncExternalStore=function(e,r,t){return A.current.useSyncExternalStore(e,r,t)},t.useTransition=function(){return A.current.useTransition()},t.version="18.3.1"},91788,(e,r,t)=>{"use strict";r.exports=e.r(77325)},1884,(e,r,t)=>{"use strict";var n=e.r(91788),o=Symbol.for("react.element"),a=Symbol.for("react.fragment"),i=Object.prototype.hasOwnProperty,s=n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function c(e,r,t){var n,a={},c=null,d=null;for(n in void 0!==t&&(c=""+t),void 0!==r.key&&(c=""+r.key),void 0!==r.ref&&(d=r.ref),r)i.call(r,n)&&!l.hasOwnProperty(n)&&(a[n]=r[n]);if(e&&e.defaultProps)for(n in r=e.defaultProps)void 0===a[n]&&(a[n]=r[n]);return{$$typeof:o,type:e,key:c,ref:d,props:a,_owner:s.current}}t.Fragment=a,t.jsx=c,t.jsxs=c},91398,(e,r,t)=>{"use strict";r.exports=e.r(1884)},41705,(e,r,t)=>{"use strict";t._=function(e){return e&&e.__esModule?e:{default:e}}},13584,(e,r,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"HeadManagerContext",{enumerable:!0,get:function(){return n}});let n=e.r(41705)._(e.r(91788)).default.createContext({})},94470,(e,r,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"warnOnce",{enumerable:!0,get:function(){return n}});let n=e=>{}},52456,(e,r,t)=>{"use strict";function n(e){if("function"!=typeof WeakMap)return null;var r=new WeakMap,t=new WeakMap;return(n=function(e){return e?t:r})(e)}t._=function(e,r){if(!r&&e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var t=n(r);if(t&&t.has(e))return t.get(e);var o={__proto__:null},a=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var i in e)if("default"!==i&&Object.prototype.hasOwnProperty.call(e,i)){var s=a?Object.getOwnPropertyDescriptor(e,i):null;s&&(s.get||s.set)?Object.defineProperty(o,i,s):o[i]=e[i]}return o.default=e,t&&t.set(e,o),o}},94941,(e,r,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return s}});let n=e.r(91788),o="u"<typeof window,a=o?()=>{}:n.useLayoutEffect,i=o?()=>{}:n.useEffect;function s(e){let{headManager:r,reduceComponentsToState:t}=e;function s(){if(r&&r.mountedInstances){let e=n.Children.toArray(Array.from(r.mountedInstances).filter(Boolean));r.updateHead(t(e))}}return o&&(r?.mountedInstances?.add(e.children),s()),a(()=>(r?.mountedInstances?.add(e.children),()=>{r?.mountedInstances?.delete(e.children)})),a(()=>(r&&(r._pendingUpdate=s),()=>{r&&(r._pendingUpdate=s)})),i(()=>(r&&r._pendingUpdate&&(r._pendingUpdate(),r._pendingUpdate=null),()=>{r&&r._pendingUpdate&&(r._pendingUpdate(),r._pendingUpdate=null)})),null}},80963,(e,r,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n={default:function(){return b},defaultHead:function(){return p}};for(var o in n)Object.defineProperty(t,o,{enumerable:!0,get:n[o]});let a=e.r(41705),i=e.r(52456),s=e.r(91398),l=i._(e.r(91788)),c=a._(e.r(94941)),d=e.r(13584);function p(){return[(0,s.jsx)("meta",{charSet:"utf-8"},"charset"),(0,s.jsx)("meta",{name:"viewport",content:"width=device-width"},"viewport")]}function u(e,r){return"string"==typeof r||"number"==typeof r?e:r.type===l.default.Fragment?e.concat(l.default.Children.toArray(r.props.children).reduce((e,r)=>"string"==typeof r||"number"==typeof r?e:e.concat(r),[])):e.concat(r)}e.r(94470);let f=["name","httpEquiv","charSet","itemProp"];function g(e){let r,t,n,o;return e.reduce(u,[]).reverse().concat(p().reverse()).filter((r=new Set,t=new Set,n=new Set,o={},e=>{let a=!0,i=!1;if(e.key&&"number"!=typeof e.key&&e.key.indexOf("$")>0){i=!0;let t=e.key.slice(e.key.indexOf("$")+1);r.has(t)?a=!1:r.add(t)}switch(e.type){case"title":case"base":t.has(e.type)?a=!1:t.add(e.type);break;case"meta":for(let r=0,t=f.length;r<t;r++){let t=f[r];if(e.props.hasOwnProperty(t))if("charSet"===t)n.has(t)?a=!1:n.add(t);else{let r=e.props[t],n=o[t]||new Set;("name"!==t||!i)&&n.has(r)?a=!1:(n.add(r),o[t]=n)}}}return a})).reverse().map((e,r)=>{let t=e.key||r;return l.default.cloneElement(e,{key:t})})}let b=function({children:e}){let r=(0,l.useContext)(d.HeadManagerContext);return(0,s.jsx)(c.default,{reduceComponentsToState:g,headManager:r,children:e})};("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),r.exports=t.default)},89129,(e,r,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n={DecodeError:function(){return m},MiddlewareNotFoundError:function(){return k},MissingStaticPage:function(){return w},NormalizeError:function(){return h},PageNotFoundError:function(){return y},SP:function(){return b},ST:function(){return x},WEB_VITALS:function(){return a},execOnce:function(){return i},getDisplayName:function(){return p},getLocationOrigin:function(){return c},getURL:function(){return d},isAbsoluteUrl:function(){return l},isResSent:function(){return u},loadGetInitialProps:function(){return g},normalizeRepeatedSlashes:function(){return f},stringifyError:function(){return v}};for(var o in n)Object.defineProperty(t,o,{enumerable:!0,get:n[o]});let a=["CLS","FCP","FID","INP","LCP","TTFB"];function i(e){let r,t=!1;return(...n)=>(t||(t=!0,r=e(...n)),r)}let s=/^[a-zA-Z][a-zA-Z\d+\-.]*?:/,l=e=>s.test(e);function c(){let{protocol:e,hostname:r,port:t}=window.location;return`${e}//${r}${t?":"+t:""}`}function d(){let{href:e}=window.location,r=c();return e.substring(r.length)}function p(e){return"string"==typeof e?e:e.displayName||e.name||"Unknown"}function u(e){return e.finished||e.headersSent}function f(e){let r=e.split("?");return r[0].replace(/\\/g,"/").replace(/\/\/+/g,"/")+(r[1]?`?${r.slice(1).join("?")}`:"")}async function g(e,r){let t=r.res||r.ctx&&r.ctx.res;if(!e.getInitialProps)return r.ctx&&r.Component?{pageProps:await g(r.Component,r.ctx)}:{};let n=await e.getInitialProps(r);if(t&&u(t))return n;if(!n)throw Object.defineProperty(Error(`"${p(e)}.getInitialProps()" should resolve to an object. But found "${n}" instead.`),"__NEXT_ERROR_CODE",{value:"E1025",enumerable:!1,configurable:!0});return n}let b="u">typeof performance,x=b&&["mark","measure","getEntriesByName"].every(e=>"function"==typeof performance[e]);class m extends Error{}class h extends Error{}class y extends Error{constructor(e){super(),this.code="ENOENT",this.name="PageNotFoundError",this.message=`Cannot find module for page: ${e}`}}class w extends Error{constructor(e,r){super(),this.message=`Failed to load static file for page: ${e} ${r}`}}class k extends Error{constructor(){super(),this.code="ENOENT",this.message="Cannot find the middleware module"}}function v(e){return JSON.stringify({message:e.message,stack:e.stack})}},3828,(e,r,t)=>{r.exports=e.r(26990)},58678,(e,r,t)=>{r.exports=e.r(80963)},38655,e=>{"use strict";let r="ls-sound-settings",t={homeVolume:60,clickVolume:80,gameVolume:80};e.s(["DEFAULT_SOUND_SETTINGS",0,t,"getVolumeForCategory",0,function(e,r){let t="home"===r?e.homeVolume:"click"===r?e.clickVolume:e.gameVolume;return Math.min(1,Math.max(0,("number"==typeof t?t:0)/100))},"loadSoundSettings",0,function(){try{let e=window.localStorage.getItem(r);if(!e)return t;let n=JSON.parse(e);return{homeVolume:"number"==typeof n.homeVolume?n.homeVolume:t.homeVolume,clickVolume:"number"==typeof n.clickVolume?n.clickVolume:t.clickVolume,gameVolume:"number"==typeof n.gameVolume?n.gameVolume:t.gameVolume}}catch{return t}},"saveSoundSettings",0,function(e){let n={homeVolume:"number"==typeof e.homeVolume?e.homeVolume:t.homeVolume,clickVolume:"number"==typeof e.clickVolume?e.clickVolume:t.clickVolume,gameVolume:"number"==typeof e.gameVolume?e.gameVolume:t.gameVolume};window.localStorage.setItem(r,JSON.stringify(n))}])},94730,e=>{"use strict";var r=e.i(91398),t=e.i(91788),n=e.i(3828),o=e.i(58678),a=e.i(74163),i=e.i(83168);let s=`
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; background: #07090F; }

  /* ── Layout ── */
  .ls-container {
    min-height: 100vh;
    background: #07090F;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    overflow: hidden;
  }

  .ls-frame {
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
  .ls-frame::-webkit-scrollbar { display: none; }

  @media (min-width: 600px) {
    .ls-frame {
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

  /* Wide frame for main menu */
  @media (min-width: 900px) {
    .ls-frame-wide {
      max-width: 860px;
    }
  }

  /* ── Background mesh ── */
  .ls-bg-mesh {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background:
      radial-gradient(ellipse 70% 50% at 90% 5%, rgba(58,77,255,0.18) 0%, transparent 70%),
      radial-gradient(ellipse 50% 40% at 10% 95%, rgba(255,200,87,0.10) 0%, transparent 65%),
      radial-gradient(ellipse 40% 30% at 50% 50%, rgba(58,77,255,0.04) 0%, transparent 80%);
  }

  /* ── Noise texture overlay ── */
  .ls-noise {
    position: absolute;
    inset: 0;
    opacity: 0.025;
    pointer-events: none;
    z-index: 2;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    background-size: 200px 200px;
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
  .ls-scroll {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 10;
    padding: 24px 28px 40px;
  }

  /* ── Logo section ── */
  .ls-logo-section {
    text-align: center;
    margin: 60px 0 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* 3D card flip — mirrors login.js exactly */
  .ls-logo-card-wrap {
    perspective: 400px;
    display: inline-block;
    margin-bottom: 20px;
    cursor: pointer;
  }
  .ls-logo-card-inner {
    width: 56px;
    height: 56px;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
    margin: 0 auto;
  }
  .ls-logo-card-inner.flipped {
    transform: rotateY(180deg);
  }
  .ls-logo-card-face {
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
  .ls-logo-card-face.back {
    transform: rotateY(180deg);
  }

  .ls-logo-title {
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
  .ls-logo-title::after {
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
  .ls-logo-badge {
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
  .ls-logo-sub {
    margin: 12px auto 0;
    color: #8896A7;
    font-size: 14px;
    line-height: 1.6;
    max-width: 240px;
    font-weight: 400;
  }

  /* ── Card surface — mirrors login.js .card-surface ── */
  .ls-card {
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
  .ls-card + .ls-card { margin-top: 16px; }

  /* ── Section title / desc inside card ── */
  .ls-section-title {
    margin: 0 0 6px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    color: #F0F4FF;
    letter-spacing: 1px;
  }
  .ls-section-desc {
    margin: 0 0 22px;
    font-size: 13.5px;
    color: #8896A7;
    line-height: 1.6;
  }

  /* ── Buttons ── */
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
  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(58,77,255,0.5);
  }
  .btn-primary:active:not(:disabled) { transform: scale(0.98); }
  .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }

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
  .btn-gold:disabled { opacity: 0.45; cursor: not-allowed; }

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
  .btn-secondary:disabled { opacity: 0.45; cursor: not-allowed; }

  .btn-danger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: rgba(239,68,68,0.10);
    color: #FC8181;
    padding: 15px;
    border-radius: 16px;
    border: 1px solid rgba(239,68,68,0.2);
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
  }
  .btn-danger:hover:not(:disabled) {
    background: rgba(239,68,68,0.18);
    transform: translateY(-1px);
  }
  .btn-danger:active:not(:disabled) { transform: scale(0.98); }

  .btn-green {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: rgba(34,197,94,0.12);
    color: #4ade80;
    padding: 15px;
    border-radius: 16px;
    border: 1px solid rgba(34,197,94,0.25);
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
  }
  .btn-green:hover:not(:disabled) {
    background: rgba(34,197,94,0.2);
    transform: translateY(-1px);
  }
  .btn-green:disabled { opacity: 0.45; cursor: not-allowed; }

  /* Back button — identical to login.js .btn-back */
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

  /* Inline icon button */
  .btn-icon {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    color: #A8B4C2;
    border-radius: 10px;
    padding: 6px 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }
  .btn-icon:hover { background: rgba(255,255,255,0.08); color: #F0F4FF; }
  .btn-icon.danger { color: #FC8181; border-color: rgba(239,68,68,0.2); }
  .btn-icon.danger:hover { background: rgba(239,68,68,0.1); }
  .btn-icon.success { color: #4ade80; border-color: rgba(34,197,94,0.25); }
  .btn-icon.success:hover { background: rgba(34,197,94,0.1); }

  @keyframes btnSweep {
    0%   { left: -130%; }
    18%  { left: 150%; }
    100% { left: 150%; }
  }

  /* ── Inputs — mirrors login.js exactly ── */
  .ls-input-group { margin-bottom: 16px; }
  .ls-input-group label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    color: #8896A7;
    margin-bottom: 7px;
    text-transform: uppercase;
    letter-spacing: 0.09em;
  }
  .ls-input-group input,
  .ls-input-group select {
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
    appearance: none;
    box-sizing: border-box;
  }
  .ls-input-group input:focus,
  .ls-input-group select:focus {
    border-color: rgba(255,200,87,0.5);
    box-shadow: 0 0 0 3px rgba(255,200,87,0.1);
    background: rgba(0,0,0,0.5);
  }
  .ls-input-group input::placeholder { color: #3D4A5A; }

  /* ── Divider — mirrors login.js .divider ── */
  .ls-divider {
    display: flex;
    align-items: center;
    margin: 20px 0;
    gap: 12px;
  }
  .ls-divider .line { flex: 1; height: 1px; background: rgba(255,255,255,0.06); }
  .ls-divider .text { color: #4A5568; font-size: 11px; font-weight: 600; letter-spacing: 0.15em; }

  /* ── Footer links — mirrors login.js .footer-links ── */
  .ls-footer-links {
    margin-top: 20px;
    text-align: center;
  }
  .ls-link-text {
    color: #FFC857;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    border-bottom: 1px solid transparent;
    transition: color 0.2s, border-color 0.2s, text-shadow 0.2s;
  }
  .ls-link-text:hover {
    border-color: rgba(255,200,87,0.8);
    text-shadow: 0 0 12px rgba(255,200,87,0.8);
  }

  /* ── Alerts ── */
  .ls-alert-error {
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
  .ls-alert-success {
    background: rgba(52,211,153,0.08);
    border: 1px solid rgba(52,211,153,0.25);
    color: #6EE7B7;
    padding: 11px 15px;
    border-radius: 13px;
    font-size: 13.5px;
    margin-bottom: 18px;
    font-weight: 500;
  }
  .ls-alert-info {
    background: rgba(58,77,255,0.08);
    border: 1px solid rgba(58,77,255,0.25);
    color: #7B8FFF;
    padding: 11px 15px;
    border-radius: 13px;
    font-size: 13.5px;
    margin-bottom: 16px;
    font-weight: 500;
    line-height: 1.5;
  }

  /* ── Spinner — mirrors login.js .premium-spinner ── */
  .ls-spinner {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 2.5px solid rgba(58,77,255,0.12);
    border-top-color: #3A4DFF;
    border-right-color: #FFC857;
    animation: spin 0.85s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── View enter animation ── */
  .view-animate {
    animation: viewIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  @keyframes viewIn {
    from { opacity: 0; transform: translateX(8px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  /* ── Badges / Tags ── */
  .ls-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: rgba(255,200,87,0.08);
    border: 1px solid rgba(255,200,87,0.2);
    color: #FFC857;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 100px;
  }
  .ls-badge.blue {
    background: rgba(58,77,255,0.1);
    border-color: rgba(58,77,255,0.25);
    color: #7B8FFF;
  }
  .ls-badge.green {
    background: rgba(34,197,94,0.1);
    border-color: rgba(34,197,94,0.25);
    color: #4ade80;
  }
  .ls-badge.red {
    background: rgba(239,68,68,0.1);
    border-color: rgba(239,68,68,0.25);
    color: #FC8181;
  }

  /* ── User chip ── */
  .ls-user-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,200,87,0.08);
    border: 1px solid rgba(255,200,87,0.15);
    border-radius: 10px;
    padding: 6px 12px;
    margin-bottom: 16px;
  }
  .ls-user-chip span { color: #8896A7; font-size: 12px; }
  .ls-user-chip strong { color: #FFC857; font-size: 13px; }

  /* ── Mode cards ── */
  .ls-mode-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 18px;
    border-radius: 18px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.06);
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, transform 0.15s;
    margin-bottom: 10px;
    width: 100%;
    text-align: left;
    font-family: 'DM Sans', sans-serif;
  }
  .ls-mode-card:hover {
    background: rgba(255,255,255,0.05);
    border-color: rgba(255,255,255,0.12);
    transform: translateX(4px);
  }
  .ls-mode-card:active { transform: scale(0.99); }
  .ls-mode-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
  }
  .ls-mode-label {
    font-size: 15px;
    font-weight: 600;
    color: #F0F4FF;
    margin: 0 0 2px;
  }
  .ls-mode-desc {
    font-size: 12px;
    color: #8896A7;
    margin: 0;
  }

  /* ── Player list row ── */
  .ls-player-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-radius: 14px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.05);
    margin-bottom: 8px;
    transition: background 0.2s;
  }
  .ls-player-row:hover { background: rgba(255,255,255,0.04); }
  .ls-player-name {
    font-size: 14px;
    font-weight: 600;
    color: #F0F4FF;
  }
  .ls-player-meta {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* ── Stepper ── */
  .ls-stepper {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .ls-stepper-btn {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04);
    color: #F0F4FF;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .ls-stepper-btn:hover { background: rgba(255,255,255,0.1); }
  .ls-stepper-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .ls-stepper-val {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px;
    color: #FFC857;
    min-width: 32px;
    text-align: center;
    line-height: 1;
  }
  .ls-stepper-label {
    font-size: 12px;
    color: #8896A7;
    margin-left: 4px;
  }

  /* ── Queue dot ── */
  .ls-queue-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #4ade80;
    box-shadow: 0 0 6px rgba(74,222,128,0.6);
    display: inline-block;
    animation: dotPulse 1.5s infinite ease-in-out;
  }
  @keyframes dotPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.4); opacity: 0.7; }
  }

  /* ── Bot row ── */
  .ls-bot-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    border-radius: 14px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.05);
    margin-bottom: 8px;
  }
  .ls-bot-label {
    font-size: 13px;
    font-weight: 600;
    color: #F0F4FF;
  }
  .ls-bot-sub {
    font-size: 11px;
    color: #8896A7;
    margin-top: 1px;
  }

  /* ── Friends list ── */
  .ls-friend-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    border-radius: 14px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.05);
    margin-bottom: 8px;
  }
  .ls-friend-info { display: flex; align-items: center; gap: 10px; }
  .ls-friend-avatar {
    width: 34px; height: 34px;
    border-radius: 10px;
    background: rgba(58,77,255,0.15);
    border: 1px solid rgba(58,77,255,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }
  .ls-friend-name { font-size: 13.5px; font-weight: 600; color: #F0F4FF; }
  .ls-friend-status { font-size: 11px; color: #8896A7; }
  .ls-friend-actions { display: flex; gap: 6px; }

  /* ── Section header ── */
  .ls-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .ls-section-header h3 {
    margin: 0;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px;
    letter-spacing: 1px;
    color: #F0F4FF;
  }

  /* ── Tabs ── */
  .ls-tabs {
    display: flex;
    background: rgba(0,0,0,0.3);
    border-radius: 12px;
    padding: 4px;
    margin-bottom: 16px;
    gap: 4px;
  }
  .ls-tab {
    flex: 1;
    padding: 8px;
    border-radius: 9px;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    color: #8896A7;
    background: transparent;
  }
  .ls-tab.active {
    background: rgba(255,255,255,0.07);
    color: #F0F4FF;
  }

  /* ── Checkbox ── */
  .ls-checkbox-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    border-radius: 14px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.05);
    cursor: pointer;
    margin-bottom: 10px;
  }
  .ls-checkbox {
    width: 20px; height: 20px;
    border-radius: 6px;
    border: 1.5px solid rgba(255,255,255,0.15);
    background: rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s;
  }
  .ls-checkbox.checked {
    background: #3A4DFF;
    border-color: #3A4DFF;
  }
  .ls-checkbox-text {
    font-size: 13.5px;
    font-weight: 500;
    color: #F0F4FF;
  }
  .ls-checkbox-sub {
    font-size: 11.5px;
    color: #8896A7;
    margin-top: 1px;
  }

  /* ── Progress bar ── */
  .ls-progress-wrap {
    height: 4px;
    background: rgba(255,255,255,0.06);
    border-radius: 4px;
    overflow: hidden;
    margin: 14px 0;
  }
  .ls-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #3A4DFF, #FFC857);
    border-radius: 4px;
    transition: width 0.4s cubic-bezier(0.4,0,0.2,1);
  }

  /* ── Copy row ── */
  .ls-copy-row {
    display: flex;
    gap: 8px;
    align-items: stretch;
    margin-bottom: 12px;
  }
  .ls-copy-input {
    flex: 1;
    background: rgba(0,0,0,0.4);
    border: 1px solid rgba(255,255,255,0.08);
    color: #8896A7;
    padding: 10px 14px;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    outline: none;
  }

  /* ── Leaderboard rank rows ── */
  .ls-rank-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 18px;
    border-radius: 16px;
    margin-bottom: 8px;
    border: 1px solid rgba(255,255,255,0.06);
    transition: transform 0.15s;
  }
  .ls-rank-row:hover { transform: translateX(2px); }
  .ls-rank-row.gold { background: rgba(255,200,87,0.1); border-color: rgba(255,200,87,0.3); }
  .ls-rank-row.silver { background: rgba(192,192,192,0.07); border-color: rgba(192,192,192,0.2); }
  .ls-rank-row.bronze { background: rgba(205,127,50,0.07); border-color: rgba(205,127,50,0.2); }
  .ls-rank-row.default { background: rgba(255,255,255,0.025); }

  /* ── Round history table ── */
  .ls-round-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  .ls-round-table th {
    padding: 10px 12px;
    text-align: left;
    color: #8896A7;
    font-weight: 600;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .ls-round-table td {
    padding: 9px 12px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    color: #F0F4FF;
    text-align: center;
  }
  .ls-round-table tr:last-child td { border-bottom: none; }

  /* ── Score chip ── */
  .ls-score-chip {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 3px 8px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
  }
  .ls-score-chip.zero { background: rgba(34,197,94,0.15); color: #4ade80; border: 1px solid rgba(34,197,94,0.2); }
  .ls-score-chip.pos { background: rgba(239,68,68,0.1); color: #FC8181; border: 1px solid rgba(239,68,68,0.2); }

  /* ── Disconnect panel ── */
  .ls-disconnect-panel {
    margin-top: 14px;
    padding: 18px 20px;
    border-radius: 20px;
    background: rgba(255,200,87,0.05);
    border: 1px solid rgba(255,200,87,0.2);
    box-shadow: 0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px rgba(0,0,0,0.3);
    backdrop-filter: blur(12px);
    animation: cardEntrance 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  /* ── Overlay ── */
  .ls-overlay {
    position: absolute;
    inset: 0;
    background: rgba(7,9,15,0.95);
    z-index: 9999;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 20px 20px 40px;
    backdrop-filter: blur(8px);
    border-radius: inherit;
    overflow-y: auto;
  }

  /* ── In-game top bar ── */
  .ls-topbar {
    background: rgba(13,17,23,0.95);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding: 13px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }
  .ls-topbar-brand {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    color: #FFC857;
    letter-spacing: 2px;
  }
  .ls-topbar-badges {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .ls-topbar-exit {
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.2);
    color: #FC8181;
    border-radius: 12px;
    padding: 7px 16px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.2s, transform 0.15s;
  }
  .ls-topbar-exit:hover {
    background: rgba(239,68,68,0.18);
    transform: translateY(-1px);
  }
  .ls-topbar-exit:active { transform: scale(0.97); }

  /* ── In-game scoreboard card ── */
  .ls-scoreboard-wrap {
    padding: 16px 16px 0;
    overflow-x: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .ls-scoreboard-wrap::-webkit-scrollbar { display: none; }
  .ls-scoreboard-inner {
    display: flex;
    gap: 10px;
    min-width: max-content;
    padding-bottom: 8px;
  }
  .ls-player-card {
    padding: 12px 16px;
    border-radius: 18px;
    min-width: 128px;
    transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
    position: relative;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.025);
  }
  .ls-player-card.active-turn {
    background: rgba(255,200,87,0.06);
    border-color: rgba(255,200,87,0.5);
    box-shadow: 0 0 20px rgba(255,200,87,0.15);
    transform: translateY(-2px);
  }
  .ls-player-card.active-thinking {
    background: rgba(239,108,0,0.06);
    animation: pulseGlow 2s infinite ease-in-out;
  }
  .ls-player-card.is-me {
    border-color: rgba(58,77,255,0.4);
  }
  .ls-player-card.eliminated {
    opacity: 0.45;
  }
  .ls-player-card-turn-badge {
    position: absolute;
    top: -9px;
    left: 50%;
    transform: translateX(-50%);
    padding: 2px 9px;
    border-radius: 12px;
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    white-space: nowrap;
    font-family: 'DM Sans', sans-serif;
  }
  .ls-player-card-turn-badge.normal {
    background: #FFC857;
    color: #1A1200;
  }
  .ls-player-card-turn-badge.thinking {
    background: #ef6c00;
    color: #fff;
    animation: pulse 1.5s infinite ease-in-out;
  }
  .ls-player-card-name {
    margin: 0 0 4px;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .ls-player-card-score {
    margin: 0;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 30px;
    line-height: 1;
  }
  .ls-player-card-footer {
    display: flex;
    gap: 8px;
    margin-top: 8px;
    border-top: 1px solid rgba(255,255,255,0.05);
    padding-top: 6px;
  }
  .ls-player-card-stat {
    flex: 1;
  }
  .ls-player-card-stat-label {
    margin: 0 0 3px;
    font-size: 8px;
    color: #8896A7;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 700;
  }
  .ls-round-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
    margin-top: 6px;
    max-width: 120px;
  }

  /* ── In-game zone panels ── */
  .ls-game-area {
    padding: 16px;
  }
  .ls-zone {
    border-radius: 20px;
    padding: 16px;
    margin-bottom: 14px;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.025);
    backdrop-filter: blur(8px);
    transition: border-color 0.3s, background 0.3s;
  }
  .ls-zone.active {
    background: rgba(255,200,87,0.04);
    border-color: rgba(255,200,87,0.2);
  }
  .ls-zone-label {
    margin: 0 0 12px;
    font-size: 11px;
    color: #8896A7;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* ── Playing card ── */
  .ls-playing-card {
    cursor: pointer;
    margin: 5px;
    padding: 8px 6px 20px;
    min-width: 54px;
    min-height: 90px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.12);
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.25);
    display: inline-flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
    position: relative;
    overflow: hidden;
  }
  .ls-playing-card:hover { transform: translateY(-3px); box-shadow: 0 6px 16px rgba(0,0,0,0.35); }
  .ls-playing-card.selected-discard {
    border: 2px solid #e53935;
    background: #ffebee;
    box-shadow: 0 0 14px 4px rgba(244, 67, 54, 0.85);
    transform: translateY(-4px);
  }
  .ls-playing-card.selected-draw {
    border: 2px solid #ffb300;
    background: #fffde7;
    box-shadow: 0 0 12px 4px rgba(255, 152, 0, 0.7);
    transform: translateY(-4px);
  }
  .ls-playing-card.highlight {
    border: 2px solid #ffb300;
    background: #fffde7;
    box-shadow: 0 0 12px 4px rgba(255, 152, 0, 0.7);
  }
  .ls-playing-card.no-interact { cursor: default; }
  .ls-playing-card.no-interact:hover { transform: none; box-shadow: 0 2px 8px rgba(0,0,0,0.25); }

  /* ── Deck button ── */
  .ls-deck-btn {
    cursor: pointer;
    margin: 5px;
    padding: 8px 6px 20px;
    min-width: 64px;
    min-height: 90px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.12);
    background: #ffffff;
    color: #111;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 4px;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
  }
  .ls-deck-btn:hover { transform: translateY(-3px); }
  .ls-deck-btn.selected-draw {
    border: 2px solid #ffb300;
    background: #fffde7;
    box-shadow: 0 0 12px 4px rgba(255, 152, 0, 0.7);
    transform: translateY(-4px);
    color: #111;
  }
  .ls-deck-btn.selected-draw span {
    color: #111 !important;
  }
  .ls-deck-btn.hint-glow {
    border: 2px solid #ffb300;
    background: #fffde7;
    box-shadow: 0 0 12px 4px rgba(255, 152, 0, 0.7);
  }

  /* ── Action button row ── */
  .ls-action-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 4px;
  }
  .ls-action-btn {
    flex: 1;
    min-width: 100px;
    padding: 14px;
    border-radius: 14px;
    border: none;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  .ls-action-btn.make-turn {
    background: linear-gradient(135deg, #3A4DFF, #2D3DE6);
    color: #fff;
    box-shadow: 0 4px 16px rgba(58,77,255,0.35);
  }
  .ls-action-btn.make-turn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(58,77,255,0.5); }
  .ls-action-btn.make-turn:disabled { background: rgba(255,255,255,0.04); color: #8896A7; box-shadow: none; cursor: not-allowed; }
  .ls-action-btn.declare {
    background: linear-gradient(135deg, #FFD166, #FFC857);
    color: #1A1200;
    box-shadow: 0 4px 16px rgba(255,200,87,0.3);
    position: relative;
    overflow: hidden;
  }
  .ls-action-btn.declare::before {
    content: '';
    position: absolute;
    top: 0; left: -130%;
    width: 55%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transform: skewX(-18deg);
    animation: btnSweep 4s 1s infinite;
  }
  .ls-action-btn.declare:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,200,87,0.45); }
  .ls-action-btn.declare:disabled { background: rgba(255,255,255,0.04); color: #8896A7; box-shadow: none; cursor: not-allowed; }
  .ls-action-btn.hint-btn {
    flex: 0 0 auto;
    padding: 14px 18px;
    background: rgba(147,51,234,0.1);
    color: #c084fc;
    border: 1px solid rgba(147,51,234,0.3);
  }
  .ls-action-btn.hint-btn:hover:not(:disabled) { background: rgba(147,51,234,0.18); transform: translateY(-1px); }
  .ls-action-btn.hint-btn:disabled { background: rgba(255,255,255,0.04); color: #8896A7; border-color: rgba(255,255,255,0.06); cursor: not-allowed; }

  /* ── Blank card (pass & play hidden) ── */
  .ls-blank-card {
    width: 54px;
    height: 78px;
    margin: 5px;
    background: linear-gradient(135deg, #1A2040, #0D1117);
    border: 1px solid rgba(58,77,255,0.3);
    border-radius: 12px;
    background-image: repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.03) 5px, rgba(255,255,255,0.03) 10px);
    flex-shrink: 0;
  }

  /* ── Reasoning panel ── */
  .ls-reasoning-panel {
    margin-top: 14px;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.018);
    backdrop-filter: blur(12px);
    animation: cardEntrance 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .ls-reasoning-obs {
    padding: 14px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .ls-reasoning-dec {
    padding: 14px 18px;
    background: rgba(255,200,87,0.02);
  }
  .ls-reasoning-label {
    margin: 0 0 10px;
    font-size: 13px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .ls-reasoning-line {
    margin: 2px 0;
    font-size: 13px;
    color: #8896A7;
    line-height: 1.6;
  }

  /* ── In-game animations ── */
  @keyframes pulseGlow {
    0% { box-shadow: 0 0 5px rgba(239,108,0,0.3); border-color: rgba(239,108,0,0.5); }
    50% { box-shadow: 0 0 20px rgba(239,108,0,0.8); border-color: rgba(239,108,0,1); }
    100% { box-shadow: 0 0 5px rgba(239,108,0,0.3); border-color: rgba(239,108,0,0.5); }
  }
  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; transform: scale(1.05); }
    100% { opacity: 0.6; }
  }

  /* Spacing utils */
  .mt-2 { margin-top: 8px; }
  .mt-3 { margin-top: 12px; }
  .mt-4 { margin-top: 16px; }
`,l=[{suit:"♠",style:{top:"8%",left:"6%",animationDelay:"0s",animationDuration:"18s",fontSize:"22px",opacity:.12}},{suit:"♥",style:{top:"15%",right:"8%",animationDelay:"3s",animationDuration:"22s",fontSize:"16px",opacity:.09,color:"#FF6B6B"}},{suit:"♦",style:{top:"55%",left:"4%",animationDelay:"6s",animationDuration:"20s",fontSize:"18px",opacity:.1,color:"#FF6B6B"}},{suit:"♣",style:{top:"70%",right:"5%",animationDelay:"1.5s",animationDuration:"25s",fontSize:"20px",opacity:.11}},{suit:"♠",style:{top:"40%",right:"3%",animationDelay:"9s",animationDuration:"16s",fontSize:"13px",opacity:.08}},{suit:"♥",style:{top:"85%",left:"10%",animationDelay:"4.5s",animationDuration:"19s",fontSize:"14px",opacity:.07,color:"#FF6B6B"}}];function c({children:e,wide:t=!1,particles:n=!0}){return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(o.default,{children:[(0,r.jsx)("title",{children:"LeastScore"}),(0,r.jsx)("link",{href:"https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap",rel:"stylesheet"})]}),(0,r.jsx)("style",{suppressHydrationWarning:!0,dangerouslySetInnerHTML:{__html:s}}),(0,r.jsx)("div",{className:"ls-container",children:(0,r.jsxs)("div",{className:`ls-frame${t?" ls-frame-wide":""}`,children:[(0,r.jsx)("div",{className:"ls-bg-mesh"}),(0,r.jsx)("div",{className:"ls-noise"}),n&&l.map((e,t)=>(0,r.jsx)("div",{className:"suit-particle",style:e.style,children:e.suit},t)),(0,r.jsx)("div",{className:"ls-scroll",children:e})]})})]})}function d({subtitle:e,badge:n}){let[o,a]=(0,t.useState)(!1);return(0,t.useEffect)(()=>{let e=setInterval(()=>a(e=>!e),3e3);return()=>clearInterval(e)},[]),(0,r.jsxs)("div",{className:"ls-logo-section",children:[(0,r.jsx)("div",{className:"ls-logo-card-wrap",onClick:()=>a(e=>!e),title:"Click to flip",children:(0,r.jsxs)("div",{className:`ls-logo-card-inner${o?" flipped":""}`,children:[(0,r.jsx)("div",{className:"ls-logo-card-face front",children:"🃏"}),(0,r.jsx)("div",{className:"ls-logo-card-face back",children:"🎴"})]})}),(0,r.jsx)("h1",{className:"ls-logo-title",children:"LeastScore"}),n&&(0,r.jsxs)("div",{className:"ls-logo-badge",children:[(0,r.jsx)("span",{children:"♠"}),n]}),e&&(0,r.jsx)("p",{className:"ls-logo-sub",children:e})]})}e.s(["default",0,function(){let e=(0,n.useRouter)(),{overlay:o}=function({onNavigateHome:e}={}){let[n,o]=(0,t.useState)(""),[s,l]=(0,t.useState)(""),[c,d]=(0,t.useState)(!0),[p,u]=(0,t.useState)(null),[f,g]=(0,t.useState)({incoming:[],outgoing:[]}),[b,x]=(0,t.useState)(""),m=(0,t.useRef)(null),h=(0,t.useRef)(null),y=(0,t.useRef)(e);(0,t.useEffect)(()=>{y.current=e},[e]);let w=(0,t.useCallback)(e=>{e&&(x(e),m.current&&clearTimeout(m.current),m.current=setTimeout(()=>x(""),5e3))},[]),k=(0,t.useCallback)(async()=>{if("registered"===n)try{let e=await fetch("/api/friends/requests",{credentials:"include"});if(e.ok){let r=await e.json();g(r.requests||{incoming:[],outgoing:[]})}}catch(e){console.error("Unable to refresh friend requests",e)}},[n]);(0,t.useEffect)(()=>{fetch("/api/auth/me",{credentials:"include"}).then(e=>e.json()).then(e=>{if(e.user){o(e.user.type||"");let r=document.cookie.match(/(?:^|;\s*)auth_token=([^;]+)/);l(r?decodeURIComponent(r[1]):"")}d(!1)}).catch(()=>d(!1))},[]),(0,t.useEffect)(()=>{if(c||"registered"!==n)return;k();let e=(0,a.default)({auth:s?{token:s}:{},withCredentials:!0,transports:["polling","websocket"],extraHeaders:{"ngrok-skip-browser-warning":"true"}});return h.current=e,e.on("friendDataChanged",k),e.on("partyInviteReceived",e=>u(e)),e.on("partyInviteRevoked",()=>u(null)),e.on("partyMemberJoined",({username:e})=>{w(`${e} joined your party`)}),e.on("friendRequestAccepted",({username:e})=>{w(`Friend request accepted by ${e}`)}),e.on("info",e=>w(e)),e.on("returnHome",({expandParty:e}={})=>{u(null),y.current&&y.current({expandParty:!1!==e})}),()=>{e.close(),h.current=null}},[c,n,s,k,w]),(0,t.useEffect)(()=>()=>{m.current&&clearTimeout(m.current)},[]);let v=async(e,r)=>{try{let t=await fetch("/api/friends/respond",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({requestId:e,action:r})}),n=await t.json();if(!t.ok)throw Error(n.error||"Unable to respond to request");g(r=>({incoming:r.incoming.filter(r=>r.requestId!==e),outgoing:r.outgoing})),"accept"===r&&w(n.message),k()}catch(e){w(e.message||"Unable to respond to request")}},F=f.incoming[0]||null;return{overlay:"registered"===n?(0,r.jsx)(i.default,{incomingInvite:p,incomingFriendRequest:F,pendingFriendRequestCount:f.incoming.length,socialToast:b,onAcceptParty:()=>{h.current&&p&&(h.current.emit("acceptPartyInvite",p.creator||p.from),y.current&&y.current({expandParty:!0}))},onRejectParty:()=>u(null),onAcceptFriend:()=>F&&v(F.requestId,"accept"),onDeclineFriend:()=>F&&v(F.requestId,"reject")}):null,checkingAuth:c,userType:n}}({onNavigateHome:({expandParty:r})=>{e.push(r?"/?expandParty=1":"/")}});return(0,t.useEffect)(()=>{let e=e=>{e.target.closest("button, .ls-link-text, .ls-logo-card-wrap")&&new Audio("/sound/touch%20sound.wav").play().catch(()=>{})};return document.addEventListener("click",e),()=>document.removeEventListener("click",e)},[]),(0,t.useEffect)(()=>{try{window.history.pushState({lsRules:!0},"","")}catch(e){}let r=r=>{r.state&&r.state.lsRules||e.replace("/?mode=tutorial")};return window.addEventListener("popstate",r),()=>window.removeEventListener("popstate",r)},[]),(0,r.jsxs)(r.Fragment,{children:[o,(0,r.jsxs)(c,{children:[(0,r.jsx)(d,{subtitle:"Game Rules"}),(0,r.jsxs)("div",{className:"ls-card view-animate ls-rules-container",style:{padding:"30px"},children:[(0,r.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px"},children:[(0,r.jsx)("button",{className:"btn-back",style:{margin:0},onClick:()=>e.push("/?mode=tutorial"),children:"← Back"}),(0,r.jsx)("h2",{className:"ls-section-title",style:{margin:0,fontSize:"24px"},children:"Least Score Rules"}),(0,r.jsx)("div",{style:{width:"60px"}})]}),(0,r.jsx)("p",{className:"ls-rules-quote",style:{fontSize:"15px",fontStyle:"italic",color:"#FFC857",fontWeight:"600",marginBottom:"20px",background:"rgba(255,200,87,0.1)",padding:"12px",borderRadius:"12px",border:"1px solid rgba(255,200,87,0.2)"},children:'"The player with the lowest score wins, while other players gain points toward elimination"'}),(0,r.jsx)("p",{style:{fontSize:"15px",color:"#F0F4FF",marginBottom:"24px",lineHeight:"1.6"},children:"Your goal is to keep the lowest possible sum of cards in hand and declare when you think your score is the lowest among all players."}),(0,r.jsxs)("div",{className:"ls-divider ls-rules-divider",children:[(0,r.jsx)("span",{className:"line"}),(0,r.jsx)("span",{className:"text",children:"ON EVERY TURN"}),(0,r.jsx)("span",{className:"line"})]}),(0,r.jsxs)("div",{style:{display:"flex",gap:"20px",marginBottom:"24px",flexWrap:"wrap"},children:[(0,r.jsxs)("div",{className:"ls-rules-box",style:{flex:1,minWidth:"200px",background:"rgba(255,255,255,0.03)",padding:"20px",borderRadius:"16px",border:"1px solid rgba(255,255,255,0.06)"},children:[(0,r.jsxs)("h3",{style:{color:"#FFD166",fontSize:"16px",marginTop:0,marginBottom:"12px",display:"flex",alignItems:"center",gap:"8px"},children:[(0,r.jsx)("span",{className:"ls-rules-badge",style:{background:"rgba(255,209,102,0.2)",padding:"4px 8px",borderRadius:"8px"},children:"1"})," Discard"]}),(0,r.jsxs)("ul",{style:{color:"#A8B4C2",fontSize:"14px",margin:0,paddingLeft:"20px",lineHeight:"1.6"},children:[(0,r.jsxs)("li",{children:["Either a ",(0,r.jsx)("strong",{style:{color:"#F0F4FF"},children:"single card"}),", or"]}),(0,r.jsxs)("li",{children:["A ",(0,r.jsx)("strong",{style:{color:"#F0F4FF"},children:"valid combination"})]})]})]}),(0,r.jsxs)("div",{className:"ls-rules-box",style:{flex:1,minWidth:"200px",background:"rgba(255,255,255,0.03)",padding:"20px",borderRadius:"16px",border:"1px solid rgba(255,255,255,0.06)"},children:[(0,r.jsxs)("h3",{style:{color:"#4ade80",fontSize:"16px",marginTop:0,marginBottom:"12px",display:"flex",alignItems:"center",gap:"8px"},children:[(0,r.jsx)("span",{className:"ls-rules-badge",style:{background:"rgba(74,222,128,0.2)",padding:"4px 8px",borderRadius:"8px"},children:"2"})," Draw"]}),(0,r.jsxs)("ul",{style:{color:"#A8B4C2",fontSize:"14px",margin:0,paddingLeft:"20px",lineHeight:"1.6"},children:[(0,r.jsxs)("li",{children:["From the ",(0,r.jsx)("strong",{style:{color:"#F0F4FF"},children:"Visible Deck"})," (card discarded by the previous player), or"]}),(0,r.jsxs)("li",{children:["From the ",(0,r.jsx)("strong",{style:{color:"#F0F4FF"},children:"Hidden Deck"})]})]})]})]}),(0,r.jsxs)("div",{className:"ls-divider ls-rules-divider",children:[(0,r.jsx)("span",{className:"line"}),(0,r.jsx)("span",{className:"text",children:"VALID COMBINATIONS"}),(0,r.jsx)("span",{className:"line"})]}),(0,r.jsx)("div",{className:"ls-rules-box",style:{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:"16px",padding:"20px",marginBottom:"24px"},children:(0,r.jsxs)("ul",{style:{color:"#F0F4FF",fontSize:"14px",lineHeight:"1.8",paddingLeft:"20px",margin:0},children:[(0,r.jsxs)("li",{style:{marginBottom:"8px"},children:[(0,r.jsx)("strong",{style:{color:"#FFC857"},children:"Pair:"})," 2 cards of the same rank ",(0,r.jsx)("span",{style:{color:"#8896A7"},children:"(e.g. two 9s of different suits)"})]}),(0,r.jsxs)("li",{style:{marginBottom:"8px"},children:[(0,r.jsx)("strong",{style:{color:"#FFC857"},children:"Sequence of 3:"})," 3 consecutive cards irrespective of suit ",(0,r.jsx)("span",{style:{color:"#8896A7"},children:"(e.g. 4-5-6, A-2-3, Q-K-A)"})]}),(0,r.jsxs)("li",{style:{marginBottom:"8px"},children:[(0,r.jsx)("strong",{style:{color:"#FFC857"},children:"Four of a Kind:"})," 4 cards of the same rank"]}),(0,r.jsxs)("li",{style:{marginBottom:"8px"},children:[(0,r.jsx)("strong",{style:{color:"#FFC857"},children:"Flush of 5:"})," 5 cards of the same suit"]}),(0,r.jsxs)("li",{children:[(0,r.jsx)("strong",{style:{color:"#FFC857"},children:"Sequence of 5:"})," 5 consecutive cards"]})]})}),(0,r.jsxs)("div",{className:"ls-divider ls-rules-divider",children:[(0,r.jsx)("span",{className:"line"}),(0,r.jsx)("span",{className:"text",children:"SCORING & ELIMINATION"}),(0,r.jsx)("span",{className:"line"})]}),(0,r.jsx)("p",{style:{color:"#A8B4C2",fontSize:"14px",marginBottom:"16px",textAlign:"center"},children:"The player with the higher score loses points toward elimination."}),(0,r.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"12px",marginBottom:"24px"},children:[(0,r.jsxs)("div",{className:"ls-rules-highlight-success",style:{background:"rgba(52,211,153,0.08)",border:"1px solid rgba(52,211,153,0.25)",padding:"16px",borderRadius:"16px"},children:[(0,r.jsx)("h4",{style:{margin:"0 0 8px",color:"#6EE7B7",fontSize:"15px"},children:"Correct Declaration ✓"}),(0,r.jsx)("p",{style:{margin:"0 0 8px",color:"#F0F4FF",fontSize:"14px"},children:"If your score is the lowest among all players:"}),(0,r.jsxs)("p",{style:{margin:0,color:"#A8B4C2",fontSize:"13px"},children:["Every other player gains: ",(0,r.jsx)("strong",{style:{color:"#6EE7B7"},children:"(their score - your score)"})]})]}),(0,r.jsxs)("div",{className:"ls-rules-highlight-danger",style:{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.25)",padding:"16px",borderRadius:"16px"},children:[(0,r.jsx)("h4",{style:{margin:"0 0 8px",color:"#FC8181",fontSize:"15px"},children:"Wrong Declaration ✕"}),(0,r.jsx)("p",{style:{margin:"0 0 8px",color:"#F0F4FF",fontSize:"14px"},children:"If another player has a lower score than you:"}),(0,r.jsxs)("p",{style:{margin:0,color:"#A8B4C2",fontSize:"13px"},children:["You gain: ",(0,r.jsx)("strong",{style:{color:"#FC8181"},children:"20 + (your score - lowest player's score)"})]})]})]}),(0,r.jsx)("div",{className:"ls-alert-error",style:{textAlign:"center",fontWeight:"bold"},children:"The first player to reach 100 points is eliminated."}),(0,r.jsxs)("div",{className:"ls-alert-info",style:{marginTop:"20px",textAlign:"center"},children:[(0,r.jsx)("strong",{children:"Note:"})," Value of Ace is 1, Joker is 11, Queen is 12 and King is 13."]}),(0,r.jsx)("button",{className:"btn-gold",style:{marginTop:"24px"},onClick:()=>e.push("/?mode=tutorial"),children:"✓ Finish Reading"})]})]})]})}],94730)},72945,(e,r,t)=>{let n="/rules";(window.__NEXT_P=window.__NEXT_P||[]).push([n,()=>e.r(94730)]),r.hot&&r.hot.dispose(function(){window.__NEXT_P.push([n])})},48761,e=>{e.v(r=>Promise.all(["static/chunks/0ey~yy8oeyp~5.js"].map(r=>e.l(r))).then(()=>r(93594)))},28805,e=>{e.v(r=>Promise.all(["static/chunks/0599p99vu8fk5.js"].map(r=>e.l(r))).then(()=>r(79466)))}]);