(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,20955,(e,t,r)=>{var n={229:function(e){var t,r,n,a=e.exports={};function o(){throw Error("setTimeout has not been defined")}function i(){throw Error("clearTimeout has not been defined")}try{t="function"==typeof setTimeout?setTimeout:o}catch(e){t=o}try{r="function"==typeof clearTimeout?clearTimeout:i}catch(e){r=i}function s(e){if(t===setTimeout)return setTimeout(e,0);if((t===o||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(r){try{return t.call(null,e,0)}catch(r){return t.call(this,e,0)}}}var l=[],c=!1,u=-1;function p(){c&&n&&(c=!1,n.length?l=n.concat(l):u=-1,l.length&&d())}function d(){if(!c){var e=s(p);c=!0;for(var t=l.length;t;){for(n=l,l=[];++u<t;)n&&n[u].run();u=-1,t=l.length}n=null,c=!1,function(e){if(r===clearTimeout)return clearTimeout(e);if((r===i||!r)&&clearTimeout)return r=clearTimeout,clearTimeout(e);try{r(e)}catch(t){try{return r.call(null,e)}catch(t){return r.call(this,e)}}}(e)}}function f(e,t){this.fun=e,this.array=t}function h(){}a.nextTick=function(e){var t=Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];l.push(new f(e,t)),1!==l.length||c||s(d)},f.prototype.run=function(){this.fun.apply(null,this.array)},a.title="browser",a.browser=!0,a.env={},a.argv=[],a.version="",a.versions={},a.on=h,a.addListener=h,a.once=h,a.off=h,a.removeListener=h,a.removeAllListeners=h,a.emit=h,a.prependListener=h,a.prependOnceListener=h,a.listeners=function(e){return[]},a.binding=function(e){throw Error("process.binding is not supported")},a.cwd=function(){return"/"},a.chdir=function(e){throw Error("process.chdir is not supported")},a.umask=function(){return 0}}},a={};function o(e){var t=a[e];if(void 0!==t)return t.exports;var r=a[e]={exports:{}},i=!0;try{n[e](r,r.exports,o),i=!1}finally{i&&delete a[e]}return r.exports}o.ab="/ROOT/node_modules/next/dist/compiled/process/",t.exports=o(229)},50461,(e,t,r)=>{"use strict";var n,a;t.exports=(null==(n=e.g.process)?void 0:n.env)&&"object"==typeof(null==(a=e.g.process)?void 0:a.env)?e.g.process:e.r(20955)},77325,(e,t,r)=>{"use strict";var n=Symbol.for("react.element"),a=Symbol.for("react.portal"),o=Symbol.for("react.fragment"),i=Symbol.for("react.strict_mode"),s=Symbol.for("react.profiler"),l=Symbol.for("react.provider"),c=Symbol.for("react.context"),u=Symbol.for("react.forward_ref"),p=Symbol.for("react.suspense"),d=Symbol.for("react.memo"),f=Symbol.for("react.lazy"),h=Symbol.iterator,g={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},b=Object.assign,m={};function y(e,t,r){this.props=e,this.context=t,this.refs=m,this.updater=r||g}function x(){}function w(e,t,r){this.props=e,this.context=t,this.refs=m,this.updater=r||g}y.prototype.isReactComponent={},y.prototype.setState=function(e,t){if("object"!=typeof e&&"function"!=typeof e&&null!=e)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")},y.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")},x.prototype=y.prototype;var v=w.prototype=new x;v.constructor=w,b(v,y.prototype),v.isPureReactComponent=!0;var _=Array.isArray,k=Object.prototype.hasOwnProperty,E={current:null},j={key:!0,ref:!0,__self:!0,__source:!0};function C(e,t,r){var a,o={},i=null,s=null;if(null!=t)for(a in void 0!==t.ref&&(s=t.ref),void 0!==t.key&&(i=""+t.key),t)k.call(t,a)&&!j.hasOwnProperty(a)&&(o[a]=t[a]);var l=arguments.length-2;if(1===l)o.children=r;else if(1<l){for(var c=Array(l),u=0;u<l;u++)c[u]=arguments[u+2];o.children=c}if(e&&e.defaultProps)for(a in l=e.defaultProps)void 0===o[a]&&(o[a]=l[a]);return{$$typeof:n,type:e,key:i,ref:s,props:o,_owner:E.current}}function S(e){return"object"==typeof e&&null!==e&&e.$$typeof===n}var F=/\/+/g;function P(e,t){var r,n;return"object"==typeof e&&null!==e&&null!=e.key?(r=""+e.key,n={"=":"=0",":":"=2"},"$"+r.replace(/[=:]/g,function(e){return n[e]})):t.toString(36)}function N(e,t,r){if(null==e)return e;var o=[],i=0;return!function e(t,r,o,i,s){var l,c,u,p=typeof t;("undefined"===p||"boolean"===p)&&(t=null);var d=!1;if(null===t)d=!0;else switch(p){case"string":case"number":d=!0;break;case"object":switch(t.$$typeof){case n:case a:d=!0}}if(d)return s=s(d=t),t=""===i?"."+P(d,0):i,_(s)?(o="",null!=t&&(o=t.replace(F,"$&/")+"/"),e(s,r,o,"",function(e){return e})):null!=s&&(S(s)&&(l=s,c=o+(!s.key||d&&d.key===s.key?"":(""+s.key).replace(F,"$&/")+"/")+t,s={$$typeof:n,type:l.type,key:c,ref:l.ref,props:l.props,_owner:l._owner}),r.push(s)),1;if(d=0,i=""===i?".":i+":",_(t))for(var f=0;f<t.length;f++){var g=i+P(p=t[f],f);d+=e(p,r,o,g,s)}else if("function"==typeof(g=null===(u=t)||"object"!=typeof u?null:"function"==typeof(u=h&&u[h]||u["@@iterator"])?u:null))for(t=g.call(t),f=0;!(p=t.next()).done;)g=i+P(p=p.value,f++),d+=e(p,r,o,g,s);else if("object"===p)throw Error("Objects are not valid as a React child (found: "+("[object Object]"===(r=String(t))?"object with keys {"+Object.keys(t).join(", ")+"}":r)+"). If you meant to render a collection of children, use an array instead.");return d}(e,o,"","",function(e){return t.call(r,e,i++)}),o}function O(e){if(-1===e._status){var t=e._result;(t=t()).then(function(t){(0===e._status||-1===e._status)&&(e._status=1,e._result=t)},function(t){(0===e._status||-1===e._status)&&(e._status=2,e._result=t)}),-1===e._status&&(e._status=0,e._result=t)}if(1===e._status)return e._result.default;throw e._result}var T={current:null},A={transition:null};function D(){throw Error("act(...) is not supported in production builds of React.")}r.Children={map:N,forEach:function(e,t,r){N(e,function(){t.apply(this,arguments)},r)},count:function(e){var t=0;return N(e,function(){t++}),t},toArray:function(e){return N(e,function(e){return e})||[]},only:function(e){if(!S(e))throw Error("React.Children.only expected to receive a single React element child.");return e}},r.Component=y,r.Fragment=o,r.Profiler=s,r.PureComponent=w,r.StrictMode=i,r.Suspense=p,r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED={ReactCurrentDispatcher:T,ReactCurrentBatchConfig:A,ReactCurrentOwner:E},r.act=D,r.cloneElement=function(e,t,r){if(null==e)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var a=b({},e.props),o=e.key,i=e.ref,s=e._owner;if(null!=t){if(void 0!==t.ref&&(i=t.ref,s=E.current),void 0!==t.key&&(o=""+t.key),e.type&&e.type.defaultProps)var l=e.type.defaultProps;for(c in t)k.call(t,c)&&!j.hasOwnProperty(c)&&(a[c]=void 0===t[c]&&void 0!==l?l[c]:t[c])}var c=arguments.length-2;if(1===c)a.children=r;else if(1<c){l=Array(c);for(var u=0;u<c;u++)l[u]=arguments[u+2];a.children=l}return{$$typeof:n,type:e.type,key:o,ref:i,props:a,_owner:s}},r.createContext=function(e){return(e={$$typeof:c,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null}).Provider={$$typeof:l,_context:e},e.Consumer=e},r.createElement=C,r.createFactory=function(e){var t=C.bind(null,e);return t.type=e,t},r.createRef=function(){return{current:null}},r.forwardRef=function(e){return{$$typeof:u,render:e}},r.isValidElement=S,r.lazy=function(e){return{$$typeof:f,_payload:{_status:-1,_result:e},_init:O}},r.memo=function(e,t){return{$$typeof:d,type:e,compare:void 0===t?null:t}},r.startTransition=function(e){var t=A.transition;A.transition={};try{e()}finally{A.transition=t}},r.unstable_act=D,r.useCallback=function(e,t){return T.current.useCallback(e,t)},r.useContext=function(e){return T.current.useContext(e)},r.useDebugValue=function(){},r.useDeferredValue=function(e){return T.current.useDeferredValue(e)},r.useEffect=function(e,t){return T.current.useEffect(e,t)},r.useId=function(){return T.current.useId()},r.useImperativeHandle=function(e,t,r){return T.current.useImperativeHandle(e,t,r)},r.useInsertionEffect=function(e,t){return T.current.useInsertionEffect(e,t)},r.useLayoutEffect=function(e,t){return T.current.useLayoutEffect(e,t)},r.useMemo=function(e,t){return T.current.useMemo(e,t)},r.useReducer=function(e,t,r){return T.current.useReducer(e,t,r)},r.useRef=function(e){return T.current.useRef(e)},r.useState=function(e){return T.current.useState(e)},r.useSyncExternalStore=function(e,t,r){return T.current.useSyncExternalStore(e,t,r)},r.useTransition=function(){return T.current.useTransition()},r.version="18.3.1"},91788,(e,t,r)=>{"use strict";t.exports=e.r(77325)},1884,(e,t,r)=>{"use strict";var n=e.r(91788),a=Symbol.for("react.element"),o=Symbol.for("react.fragment"),i=Object.prototype.hasOwnProperty,s=n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function c(e,t,r){var n,o={},c=null,u=null;for(n in void 0!==r&&(c=""+r),void 0!==t.key&&(c=""+t.key),void 0!==t.ref&&(u=t.ref),t)i.call(t,n)&&!l.hasOwnProperty(n)&&(o[n]=t[n]);if(e&&e.defaultProps)for(n in t=e.defaultProps)void 0===o[n]&&(o[n]=t[n]);return{$$typeof:a,type:e,key:c,ref:u,props:o,_owner:s.current}}r.Fragment=o,r.jsx=c,r.jsxs=c},91398,(e,t,r)=>{"use strict";t.exports=e.r(1884)},41705,(e,t,r)=>{"use strict";r._=function(e){return e&&e.__esModule?e:{default:e}}},13584,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"HeadManagerContext",{enumerable:!0,get:function(){return n}});let n=e.r(41705)._(e.r(91788)).default.createContext({})},94470,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"warnOnce",{enumerable:!0,get:function(){return n}});let n=e=>{}},52456,(e,t,r)=>{"use strict";function n(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,r=new WeakMap;return(n=function(e){return e?r:t})(e)}r._=function(e,t){if(!t&&e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var r=n(t);if(r&&r.has(e))return r.get(e);var a={__proto__:null},o=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var i in e)if("default"!==i&&Object.prototype.hasOwnProperty.call(e,i)){var s=o?Object.getOwnPropertyDescriptor(e,i):null;s&&(s.get||s.set)?Object.defineProperty(a,i,s):a[i]=e[i]}return a.default=e,r&&r.set(e,a),a}},94941,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"default",{enumerable:!0,get:function(){return s}});let n=e.r(91788),a="u"<typeof window,o=a?()=>{}:n.useLayoutEffect,i=a?()=>{}:n.useEffect;function s(e){let{headManager:t,reduceComponentsToState:r}=e;function s(){if(t&&t.mountedInstances){let e=n.Children.toArray(Array.from(t.mountedInstances).filter(Boolean));t.updateHead(r(e))}}return a&&(t?.mountedInstances?.add(e.children),s()),o(()=>(t?.mountedInstances?.add(e.children),()=>{t?.mountedInstances?.delete(e.children)})),o(()=>(t&&(t._pendingUpdate=s),()=>{t&&(t._pendingUpdate=s)})),i(()=>(t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null),()=>{t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null)})),null}},80963,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={default:function(){return g},defaultHead:function(){return p}};for(var a in n)Object.defineProperty(r,a,{enumerable:!0,get:n[a]});let o=e.r(41705),i=e.r(52456),s=e.r(91398),l=i._(e.r(91788)),c=o._(e.r(94941)),u=e.r(13584);function p(){return[(0,s.jsx)("meta",{charSet:"utf-8"},"charset"),(0,s.jsx)("meta",{name:"viewport",content:"width=device-width"},"viewport")]}function d(e,t){return"string"==typeof t||"number"==typeof t?e:t.type===l.default.Fragment?e.concat(l.default.Children.toArray(t.props.children).reduce((e,t)=>"string"==typeof t||"number"==typeof t?e:e.concat(t),[])):e.concat(t)}e.r(94470);let f=["name","httpEquiv","charSet","itemProp"];function h(e){let t,r,n,a;return e.reduce(d,[]).reverse().concat(p().reverse()).filter((t=new Set,r=new Set,n=new Set,a={},e=>{let o=!0,i=!1;if(e.key&&"number"!=typeof e.key&&e.key.indexOf("$")>0){i=!0;let r=e.key.slice(e.key.indexOf("$")+1);t.has(r)?o=!1:t.add(r)}switch(e.type){case"title":case"base":r.has(e.type)?o=!1:r.add(e.type);break;case"meta":for(let t=0,r=f.length;t<r;t++){let r=f[t];if(e.props.hasOwnProperty(r))if("charSet"===r)n.has(r)?o=!1:n.add(r);else{let t=e.props[r],n=a[r]||new Set;("name"!==r||!i)&&n.has(t)?o=!1:(n.add(t),a[r]=n)}}}return o})).reverse().map((e,t)=>{let r=e.key||t;return l.default.cloneElement(e,{key:r})})}let g=function({children:e}){let t=(0,l.useContext)(u.HeadManagerContext);return(0,s.jsx)(c.default,{reduceComponentsToState:h,headManager:t,children:e})};("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},89129,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={DecodeError:function(){return m},MiddlewareNotFoundError:function(){return v},MissingStaticPage:function(){return w},NormalizeError:function(){return y},PageNotFoundError:function(){return x},SP:function(){return g},ST:function(){return b},WEB_VITALS:function(){return o},execOnce:function(){return i},getDisplayName:function(){return p},getLocationOrigin:function(){return c},getURL:function(){return u},isAbsoluteUrl:function(){return l},isResSent:function(){return d},loadGetInitialProps:function(){return h},normalizeRepeatedSlashes:function(){return f},stringifyError:function(){return _}};for(var a in n)Object.defineProperty(r,a,{enumerable:!0,get:n[a]});let o=["CLS","FCP","FID","INP","LCP","TTFB"];function i(e){let t,r=!1;return(...n)=>(r||(r=!0,t=e(...n)),t)}let s=/^[a-zA-Z][a-zA-Z\d+\-.]*?:/,l=e=>s.test(e);function c(){let{protocol:e,hostname:t,port:r}=window.location;return`${e}//${t}${r?":"+r:""}`}function u(){let{href:e}=window.location,t=c();return e.substring(t.length)}function p(e){return"string"==typeof e?e:e.displayName||e.name||"Unknown"}function d(e){return e.finished||e.headersSent}function f(e){let t=e.split("?");return t[0].replace(/\\/g,"/").replace(/\/\/+/g,"/")+(t[1]?`?${t.slice(1).join("?")}`:"")}async function h(e,t){let r=t.res||t.ctx&&t.ctx.res;if(!e.getInitialProps)return t.ctx&&t.Component?{pageProps:await h(t.Component,t.ctx)}:{};let n=await e.getInitialProps(t);if(r&&d(r))return n;if(!n)throw Object.defineProperty(Error(`"${p(e)}.getInitialProps()" should resolve to an object. But found "${n}" instead.`),"__NEXT_ERROR_CODE",{value:"E1025",enumerable:!1,configurable:!0});return n}let g="u">typeof performance,b=g&&["mark","measure","getEntriesByName"].every(e=>"function"==typeof performance[e]);class m extends Error{}class y extends Error{}class x extends Error{constructor(e){super(),this.code="ENOENT",this.name="PageNotFoundError",this.message=`Cannot find module for page: ${e}`}}class w extends Error{constructor(e,t){super(),this.message=`Failed to load static file for page: ${e} ${t}`}}class v extends Error{constructor(){super(),this.code="ENOENT",this.message="Cannot find the middleware module"}}function _(e){return JSON.stringify({message:e.message,stack:e.stack})}},3828,(e,t,r)=>{t.exports=e.r(26990)},58678,(e,t,r)=>{t.exports=e.r(80963)},36103,e=>{"use strict";e.s(["clearToken",0,function(){try{localStorage.removeItem("auth_token")}catch(e){}},"getToken",0,function(){try{return localStorage.getItem("auth_token")}catch(e){return null}},"saveToken",0,function(e){try{localStorage.setItem("auth_token",e)}catch(e){}}])},22545,e=>{"use strict";var t=e.i(36103);async function r(e,n={}){let a=(0,t.getToken)(),o={"Content-Type":"application/json",...n.headers||{}};return a&&(o.Authorization=`Bearer ${a}`),fetch(`https://13.51.162.232.nip.io${e}`,{...n,headers:o})}e.s(["apiFetch",0,r])},80097,e=>{"use strict";var t=e.i(91398),r=e.i(91788),n=e.i(3828),a=e.i(58678),o=e.i(22545),i=e.i(36103);e.s(["default",0,function(){let e=(0,n.useRouter)(),[s,l]=(0,r.useState)(!0),[c,u]=(0,r.useState)(""),[p,d]=(0,r.useState)(""),[f,h]=(0,r.useState)(""),[g,b]=(0,r.useState)(""),[m,y]=(0,r.useState)(!1),[x,w]=(0,r.useState)(!1),[v,_]=(0,r.useState)(!1),[k,E]=(0,r.useState)(!1),[j,C]=(0,r.useState)(""),[S,F]=(0,r.useState)("");(0,r.useEffect)(()=>{(0,o.apiFetch)("/api/auth/me").then(e=>e.json()).then(t=>{t.user&&"registered"===t.user.type?"local"!==t.user.auth_provider?e.replace("/settings"):(u(t.user.displayName||t.user.nickname||t.user.email||""),l(!1)):e.replace("/login")}).catch(()=>e.replace("/login"))},[]);let P=async()=>{if(C(""),F(""),!p||!f||!g)return C("All fields are required.");if(f.length<6)return C("New password must be at least 6 characters.");if(f!==g)return C("Passwords do not match.");E(!0);try{let t=await (0,o.apiFetch)("/api/auth/change-password",{method:"POST",body:JSON.stringify({currentPassword:p,newPassword:f})}),r=await t.json();r.error?C(r.error):(r.token&&(0,i.saveToken)(r.token),F("Password updated successfully!"),d(""),h(""),b(""),setTimeout(()=>e.back(),1500))}catch{C("An unexpected error occurred.")}finally{E(!1)}},N=(()=>{if(!f)return null;let e=0;return(f.length>=6&&e++,f.length>=10&&e++,/[A-Z]/.test(f)&&e++,/[0-9]/.test(f)&&e++,/[^A-Za-z0-9]/.test(f)&&e++,e<=1)?{label:"Weak",color:"#EF4444",bars:1}:e<=3?{label:"Fair",color:"#F59E0B",bars:2}:e<=4?{label:"Good",color:"#3A4DFF",bars:3}:{label:"Strong",color:"#10B981",bars:4}})();return s?(0,t.jsx)("div",{className:"rp-container",children:(0,t.jsx)("div",{className:"rp-frame",style:{alignItems:"center",justifyContent:"center"},children:(0,t.jsx)("div",{className:"rp-spinner"})})}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(a.default,{children:[(0,t.jsx)("title",{children:"Change Password — LeastScore"}),(0,t.jsx)("link",{href:"https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap",rel:"stylesheet"})]}),(0,t.jsx)("style",{children:`
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; background: #07090F; }

        .rp-container {
          min-height: 100vh; background: #07090F;
          display: flex; align-items: center; justify-content: center;
          font-family: 'DM Sans', sans-serif;
        }
        .rp-frame {
          width: 100%; min-height: 100vh; background: #0D1117;
          position: relative; display: flex; flex-direction: column;
          overflow-y: auto; overflow-x: hidden;
          -ms-overflow-style: none; scrollbar-width: none;
        }
        .rp-frame::-webkit-scrollbar { display: none; }
        @media (min-width: 600px) {
          .rp-frame {
            max-width: 420px; min-height: 820px; height: 92vh;
            border-radius: 44px;
            box-shadow: 0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04), 0 0 160px rgba(58,77,255,0.08);
          }
        }
        .rp-bg-mesh {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 70% 50% at 20% 10%, rgba(58,77,255,0.16) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 90% 90%, rgba(16,185,129,0.08) 0%, transparent 65%);
        }
        .rp-content {
          flex: 1; display: flex; flex-direction: column;
          position: relative; z-index: 10; padding: 40px 28px 48px;
          justify-content: center;
        }
        .rp-header { text-align: center; margin-bottom: 32px; }
        .rp-icon { font-size: 52px; margin-bottom: 16px; display: block; animation: iconPop 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes iconPop { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .rp-title { margin: 0 0 8px; font-family: 'Bebas Neue', sans-serif; font-size: 32px; color: #F0F4FF; letter-spacing: 2px; }
        .rp-subtitle { margin: 0; font-size: 13.5px; color: #8896A7; line-height: 1.6; }
        .rp-user-badge {
          display: inline-block; margin-top: 10px;
          background: rgba(255,200,87,0.09); border: 1px solid rgba(255,200,87,0.22);
          color: #FFC857; font-size: 12px; font-weight: 600;
          padding: 4px 12px; border-radius: 100px; letter-spacing: 0.05em;
        }
        .rp-card {
          background: rgba(255,255,255,0.028); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 28px; padding: 28px 24px;
          box-shadow: 0 24px 48px rgba(0,0,0,0.5); backdrop-filter: blur(24px);
          animation: cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes cardIn { from { opacity: 0; transform: translateY(16px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .rp-back {
          background: transparent; border: none; color: #FF5A5A;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
          padding: 0; margin-bottom: 24px; cursor: pointer;
          display: inline-flex; align-items: center; gap: 4px;
          transition: color 0.2s, transform 0.15s;
          text-shadow: 0 0 12px rgba(255,90,90,0.7);
        }
        .rp-back:hover { transform: translateX(-2px); text-shadow: 0 0 16px rgba(255,90,90,0.9); }
        .rp-input-group { margin-bottom: 18px; }
        .rp-input-group label {
          display: block; font-size: 11px; font-weight: 600; color: #8896A7;
          margin-bottom: 7px; text-transform: uppercase; letter-spacing: 0.09em;
        }
        .rp-input-wrap { position: relative; display: flex; align-items: center; }
        .rp-input-wrap input {
          width: 100%; background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.08);
          color: #F0F4FF; padding: 13px 44px 13px 15px; border-radius: 13px;
          font-family: 'DM Sans', sans-serif; font-size: 15px; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box;
        }
        .rp-input-wrap input:focus {
          border-color: rgba(58,77,255,0.5); box-shadow: 0 0 0 3px rgba(58,77,255,0.1);
          background: rgba(0,0,0,0.5);
        }
        .rp-input-wrap input::placeholder { color: #3D4A5A; }
        .rp-eye-btn {
          position: absolute; right: 12px; background: none; border: none;
          color: #8896A7; cursor: pointer; font-size: 17px; padding: 4px; line-height: 1;
          transition: color 0.2s;
        }
        .rp-eye-btn:hover { color: #F0F4FF; }
        .rp-strength { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
        .rp-strength-bars { display: flex; gap: 4px; flex: 1; }
        .rp-strength-bar { height: 4px; flex: 1; border-radius: 4px; background: rgba(255,255,255,0.07); transition: background 0.3s; }
        .rp-strength-label { font-size: 11px; font-weight: 600; }
        .rp-match { font-size: 12px; margin: 6px 0 0; font-weight: 500; min-height: 18px; }
        .rp-match.ok { color: #10B981; }
        .rp-match.err { color: #EF4444; }
        .rp-alert-error {
          background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25);
          color: #FC8181; padding: 11px 15px; border-radius: 13px;
          font-size: 13.5px; margin-bottom: 18px; font-weight: 500; line-height: 1.4;
        }
        .rp-alert-success {
          background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.25);
          color: #6EE7B7; padding: 11px 15px; border-radius: 13px;
          font-size: 13.5px; margin-bottom: 18px; font-weight: 500;
        }
        .rp-btn {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
          background: linear-gradient(135deg, #3A4DFF 0%, #2D3DE6 100%);
          color: #fff; padding: 15px; border-radius: 16px; border: none;
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
          cursor: pointer; position: relative; overflow: hidden;
          transition: transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(58,77,255,0.35); margin-top: 8px;
        }
        .rp-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(58,77,255,0.5); }
        .rp-btn:active:not(:disabled) { transform: scale(0.98); }
        .rp-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .rp-btn::before {
          content: ''; position: absolute; top: 0; left: -130%; width: 55%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: skewX(-18deg); animation: btnSweep 5s 1s infinite;
        }
        @keyframes btnSweep { 0% { left: -130%; } 18% { left: 150%; } 100% { left: 150%; } }
        .rp-spinner {
          width: 44px; height: 44px; border-radius: 50%;
          border: 2.5px solid rgba(58,77,255,0.12);
          border-top-color: #3A4DFF; border-right-color: #FFC857;
          animation: spin 0.85s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Light Theme Overrides ── */
        [data-theme="light"] body,
        [data-theme="light"] .rp-container { background: #0F2318; }
        [data-theme="light"] .rp-frame {
          background:
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cpath d='M13 18 C13 15 11 13 8.5 13 C6 13 4 15.5 4 18 C4 21 8.5 26 13 30 C17.5 26 22 21 22 18 C22 15.5 20 13 17.5 13 C15 13 13 15 13 18 Z' fill='%23000' opacity='0.13'/%3E%3Cpath d='M53 10 C53 10 44 17 44 22 C44 25 46.5 27 49.5 26.5 C48 28.5 47 30 47 30 L59 30 C59 30 58 28.5 56.5 26.5 C59.5 27 62 25 62 22 C62 17 53 10 53 10 Z' fill='%23000' opacity='0.13'/%3E%3Ccircle cx='13' cy='55' r='4.5' fill='%23000' opacity='0.13'/%3E%3Ccircle cx='18.5' cy='62' r='4.5' fill='%23000' opacity='0.13'/%3E%3Ccircle cx='7.5' cy='62' r='4.5' fill='%23000' opacity='0.13'/%3E%3Crect x='11' y='63' width='4' height='6' rx='1' fill='%23000' opacity='0.13'/%3E%3Cpath d='M53 50 L60 60 L53 70 L46 60 Z' fill='%23000' opacity='0.13'/%3E%3C/svg%3E") repeat,
            radial-gradient(ellipse 110% 55% at 50% 0%,   #2E7D4F 0%, transparent 60%),
            radial-gradient(ellipse 80%  50% at 100% 40%,  #1B5C38 0%, transparent 55%),
            radial-gradient(ellipse 70%  45% at 0%   70%,  #163E28 0%, transparent 55%),
            radial-gradient(ellipse 90%  60% at 50% 100%,  #0D2B1A 0%, transparent 70%),
            linear-gradient(175deg, #1E4D32 0%, #142D1E 40%, #0F2318 100%);
        }
        [data-theme="light"] .rp-bg-mesh {
          background:
            radial-gradient(ellipse 65% 45% at 95% 5%,  rgba(214,59,59,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 55% 40% at 5%  95%, rgba(93,201,138,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 50% 35% at 80% 85%, rgba(46,125,82,0.18)  0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 20% 20%, rgba(30,77,50,0.22)   0%, transparent 55%);
        }
        [data-theme="light"] .rp-title { color: #D8F0E0; }
        [data-theme="light"] .rp-subtitle { color: #ffc439; }
        [data-theme="light"] .rp-user-badge {
          background: linear-gradient(135deg, rgba(200,150,10,0.18), rgba(248,224,112,0.12));
          border-color: rgba(255,204,65,0.4);
          color: #ffc439;
          text-shadow: 0 1px 2px rgba(200,150,10,0.15);
        }
        [data-theme="light"] .rp-card {
          background: linear-gradient(160deg, #D8F0E0 0%, #E4F5EA 100%);
          border: 1px solid rgba(13,33,24,0.10);
          box-shadow: 0 1px 0 rgba(255,255,255,1.0) inset, 0 -1px 0 rgba(13,33,24,0.06) inset, 0 16px 40px rgba(0,0,0,0.24);
        }
        [data-theme="light"] .rp-back { color: #D8F0E0; text-shadow: none; }
        [data-theme="light"] .rp-back:hover { color: #FFFFFF; text-shadow: none; }
        [data-theme="light"] .rp-input-group label { color: #5A8C72; }
        [data-theme="light"] .rp-input-wrap input {
          background: linear-gradient(160deg, #F2FBF5, #FEFFFD);
          border: 1px solid rgba(13,33,24,0.12);
          color: #0D2118;
        }
        [data-theme="light"] .rp-input-wrap input:focus {
          border-color: rgba(58,158,104,0.70);
          box-shadow: 0 0 0 3px rgba(58,158,104,0.14);
          background: linear-gradient(160deg, #F2FBF5, #FEFFFD);
        }
        [data-theme="light"] .rp-input-wrap input::placeholder { color: #8ABEA4; }
        [data-theme="light"] .rp-eye-btn { color: #5A8C72; }
        [data-theme="light"] .rp-eye-btn:hover { color: #0D2118; }
        [data-theme="light"] .rp-btn {
          background: linear-gradient(135deg, #E0AD18 0%, #A0700A 100%);
          color: #FFFBE8;
          box-shadow: 0 4px 16px rgba(160,112,10,0.48);
          text-shadow: 0 1px 2px rgba(100,65,0,0.35);
        }
        [data-theme="light"] .rp-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #F0C832 0%, #C8960A 100%);
          box-shadow: 0 8px 24px rgba(160,112,10,0.55);
        }
        [data-theme="light"] .rp-btn:disabled {
          background: linear-gradient(160deg, #C8DED2, #B8D0C4);
          color: #8ABEA4;
          box-shadow: none;
        }
        [data-theme="light"] .rp-spinner {
          border: 2.5px solid rgba(30,77,48,0.14);
          border-top-color: #3A9E68;
          border-right-color: #E0AD18;
        }
        [data-theme="light"] .rp-strength-bar { background: rgba(13,33,24,0.08); }
        [data-theme="light"] .rp-alert-error {
          background: rgba(214,59,59,0.09);
          border: 1px solid rgba(214,59,59,0.26);
          color: #B82E2E;
        }
        [data-theme="light"] .rp-alert-success {
          background: rgba(46,125,82,0.10);
          border: 1px solid rgba(46,125,82,0.26);
          color: #1E4D32;
        }
      `}),(0,t.jsx)("div",{className:"rp-container",children:(0,t.jsxs)("div",{className:"rp-frame",children:[(0,t.jsx)("div",{className:"rp-bg-mesh"}),(0,t.jsxs)("div",{className:"rp-content",children:[(0,t.jsx)("button",{className:"rp-back",onClick:()=>e.back(),children:"← Back"}),(0,t.jsxs)("div",{className:"rp-header",children:[(0,t.jsx)("span",{className:"rp-icon",children:"🔑"}),(0,t.jsx)("h1",{className:"rp-title",children:"Change Password"}),(0,t.jsx)("p",{className:"rp-subtitle",children:"Enter your current password, then choose a new one."}),c&&(0,t.jsxs)("div",{className:"rp-user-badge",children:["👤 ",c]})]}),(0,t.jsxs)("div",{className:"rp-card",children:[j&&(0,t.jsx)("div",{className:"rp-alert-error",children:j}),S&&(0,t.jsx)("div",{className:"rp-alert-success",children:S}),(0,t.jsxs)("div",{className:"rp-input-group",children:[(0,t.jsx)("label",{children:"Current Password"}),(0,t.jsxs)("div",{className:"rp-input-wrap",children:[(0,t.jsx)("input",{type:m?"text":"password",value:p,onChange:e=>d(e.target.value),placeholder:"Your current password",autoComplete:"current-password"}),(0,t.jsx)("button",{className:"rp-eye-btn",onClick:()=>y(e=>!e),type:"button",children:m?"🙈":"👁️"})]})]}),(0,t.jsxs)("div",{className:"rp-input-group",children:[(0,t.jsx)("label",{children:"New Password"}),(0,t.jsxs)("div",{className:"rp-input-wrap",children:[(0,t.jsx)("input",{type:x?"text":"password",value:f,onChange:e=>h(e.target.value),placeholder:"At least 6 characters",autoComplete:"new-password"}),(0,t.jsx)("button",{className:"rp-eye-btn",onClick:()=>w(e=>!e),type:"button",children:x?"🙈":"👁️"})]}),N&&(0,t.jsxs)("div",{className:"rp-strength",children:[(0,t.jsx)("div",{className:"rp-strength-bars",children:[1,2,3,4].map(e=>(0,t.jsx)("div",{className:"rp-strength-bar",style:{background:e<=N.bars?N.color:"rgba(255,255,255,0.07)"}},e))}),(0,t.jsx)("span",{className:"rp-strength-label",style:{color:N.color},children:N.label})]})]}),(0,t.jsxs)("div",{className:"rp-input-group",children:[(0,t.jsx)("label",{children:"Confirm New Password"}),(0,t.jsxs)("div",{className:"rp-input-wrap",children:[(0,t.jsx)("input",{type:v?"text":"password",value:g,onChange:e=>b(e.target.value),placeholder:"Repeat your new password",autoComplete:"new-password"}),(0,t.jsx)("button",{className:"rp-eye-btn",onClick:()=>_(e=>!e),type:"button",children:v?"🙈":"👁️"})]}),g&&(0,t.jsx)("p",{className:`rp-match ${f===g?"ok":"err"}`,children:f===g?"✓ Passwords match":"✗ Passwords do not match"})]}),(0,t.jsx)("button",{className:"rp-btn",onClick:P,disabled:k||!p||f.length<6||f!==g,children:k?"Saving…":"🔒 Update Password"})]})]})]})})]})}])},67107,(e,t,r)=>{let n="/change-password";(window.__NEXT_P=window.__NEXT_P||[]).push([n,()=>e.r(80097)]),t.hot&&t.hot.dispose(function(){window.__NEXT_P.push([n])})},48761,e=>{e.v(t=>Promise.all(["static/chunks/0ey~yy8oeyp~5.js"].map(t=>e.l(t))).then(()=>t(93594)))},28805,e=>{e.v(t=>Promise.all(["static/chunks/0599p99vu8fk5.js"].map(t=>e.l(t))).then(()=>t(79466)))}]);