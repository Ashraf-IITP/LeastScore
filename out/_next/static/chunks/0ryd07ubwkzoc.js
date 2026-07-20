(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,57626,e=>{"use strict";e.i(50461);var t=e.i(91398),a=e.i(91788),n=e.i(3828),r=e.i(58678),o=e.i(6619),s=e.i(38655),i=e.i(45246),l=e.i(22545);let c={width:"100%",background:"rgba(0,0,0,0.35)",border:"1px solid rgba(255,255,255,0.08)",color:"#F0F4FF",padding:"13px 15px",borderRadius:"13px",fontSize:"15px",outline:"none",boxSizing:"border-box"};function d({value:e,onChange:n,disabled:r=!1,required:o=!1}){let[s,p]=(0,a.useState)([]),[u,x]=(0,a.useState)(!0),[m,g]=(0,a.useState)(!1),[h,f]=(0,a.useState)(""),b=(0,a.useRef)(null);(0,a.useEffect)(()=>{let e=!1;return(0,l.apiFetch)("/api/countries").then(e=>(e.ok||console.error("Failed to fetch countries, HTTP:",e.status),e.json())).then(t=>{console.log("Fetched countries payload:",t),!e&&t.countries?(console.log("Setting countries state, count:",t.countries.length),p(t.countries)):console.log("Not setting countries. cancelled:",e,"hasCountries:",!!t.countries)}).catch(e=>{console.error("Error fetching countries:",e)}).finally(()=>{e||x(!1)}),()=>{e=!0}},[]),(0,a.useEffect)(()=>{let e=e=>{b.current&&!b.current.contains(e.target)&&g(!1)};return document.addEventListener("mousedown",e),()=>document.removeEventListener("mousedown",e)},[]);let y=(0,a.useMemo)(()=>s.find(t=>String(t.id)===String(e)),[s,e]),v=(0,a.useMemo)(()=>{let e=h.trim().toLowerCase();return e?s.filter(t=>t.name.toLowerCase().includes(e)||t.phoneCode.includes(e)||t.iso2.toLowerCase().includes(e)):s},[s,h]);return(0,t.jsxs)("div",{ref:b,className:"jsx-e63188d179f41338 input-group country-select",children:[(0,t.jsxs)("label",{className:"jsx-e63188d179f41338",children:["Country",o&&(0,t.jsx)("span",{style:{color:"#FF5A5A",marginLeft:"3px"},className:"jsx-e63188d179f41338",children:"*"})]}),(0,t.jsxs)("div",{className:"jsx-e63188d179f41338 country-select-control",children:[(0,t.jsxs)("button",{type:"button",onClick:()=>!r&&!u&&g(e=>!e),disabled:r||u,style:c,className:"jsx-e63188d179f41338 country-select-trigger",children:[u?(0,t.jsx)("span",{className:"jsx-e63188d179f41338 country-select-placeholder",children:"Loading countries…"}):y?(0,t.jsxs)("span",{className:"jsx-e63188d179f41338 country-select-value",children:[(0,t.jsx)("span",{className:"jsx-e63188d179f41338 country-flag",children:y.flag}),(0,t.jsx)("span",{className:"jsx-e63188d179f41338",children:y.name}),(0,t.jsxs)("span",{className:"jsx-e63188d179f41338 country-dial",children:["+",y.phoneCode]})]}):(0,t.jsx)("span",{className:"jsx-e63188d179f41338 country-select-placeholder",children:"Select your country"}),(0,t.jsx)("span",{className:"jsx-e63188d179f41338 country-select-chevron",children:m?"▴":"▾"})]}),m&&(0,t.jsxs)("div",{className:"jsx-e63188d179f41338 country-select-menu",children:[(0,t.jsx)("input",{type:"text",placeholder:"Search country or code…",value:h,onChange:e=>f(e.target.value),autoFocus:!0,className:"jsx-e63188d179f41338 country-select-search"}),(0,t.jsx)("ul",{className:"jsx-e63188d179f41338 country-select-list",children:0===v.length?(0,t.jsx)("li",{className:"jsx-e63188d179f41338 country-select-empty",children:"No countries found"}):v.map(a=>(0,t.jsx)("li",{className:"jsx-e63188d179f41338",children:(0,t.jsxs)("button",{type:"button",onClick:()=>{n(String(a.id)),g(!1),f("")},className:`jsx-e63188d179f41338 country-select-option${String(a.id)===String(e)?" selected":""}`,children:[(0,t.jsx)("span",{className:"jsx-e63188d179f41338 country-flag",children:a.flag}),(0,t.jsx)("span",{className:"jsx-e63188d179f41338 country-name",children:a.name}),(0,t.jsxs)("span",{className:"jsx-e63188d179f41338 country-dial",children:["+",a.phoneCode]})]})},a.id))})]})]}),(0,t.jsx)(i.default,{id:"e63188d179f41338",children:".country-select-control.jsx-e63188d179f41338{position:relative}.country-select-trigger.jsx-e63188d179f41338{cursor:pointer;text-align:left;justify-content:space-between;align-items:center;gap:10px;font-family:DM Sans,sans-serif;display:flex}.country-select-trigger.jsx-e63188d179f41338:disabled{opacity:.6;cursor:not-allowed}.country-select-value.jsx-e63188d179f41338{flex:1;align-items:center;gap:8px;min-width:0;display:flex}.country-select-placeholder.jsx-e63188d179f41338{color:#3d4a5a}.country-flag.jsx-e63188d179f41338{flex-shrink:0;font-size:18px;line-height:1}.country-dial.jsx-e63188d179f41338{color:#8896a7;flex-shrink:0;margin-left:auto;font-size:13px}.country-select-chevron.jsx-e63188d179f41338{color:#8896a7;flex-shrink:0;font-size:11px}.country-select-menu.jsx-e63188d179f41338{z-index:30;background:#0c101cfa;border:1px solid #ffffff1a;border-radius:13px;position:absolute;top:calc(100% + 6px);left:0;right:0;overflow:hidden;box-shadow:0 12px 32px #00000073}.country-select-search.jsx-e63188d179f41338{box-sizing:border-box;color:#f0f4ff;background:#00000059;border:none;border-bottom:1px solid #ffffff14;outline:none;width:100%;padding:12px 14px;font-family:DM Sans,sans-serif;font-size:14px}.country-select-search.jsx-e63188d179f41338::placeholder{color:#3d4a5a}.country-select-list.jsx-e63188d179f41338{max-height:220px;margin:0;padding:6px;list-style:none;overflow-y:auto}.country-select-option.jsx-e63188d179f41338{color:#f0f4ff;cursor:pointer;text-align:left;background:0 0;border:none;border-radius:10px;align-items:center;gap:8px;width:100%;padding:10px;font-family:DM Sans,sans-serif;font-size:14px;display:flex}.country-select-option.jsx-e63188d179f41338:hover,.country-select-option.selected.jsx-e63188d179f41338{background:#ffc8571f}.country-name.jsx-e63188d179f41338{white-space:nowrap;text-overflow:ellipsis;flex:1;min-width:0;overflow:hidden}.country-select-empty.jsx-e63188d179f41338{color:#8896a7;padding:12px 10px;font-size:13px}"})]})}var p=e.i(36103),u=e.i(73773),x=e.i(41738);let m=null;window.Capacitor&&e.A(21748).then(e=>{m=e.Browser}).catch(()=>{});let g=()=>(0,t.jsxs)("svg",{width:"20",height:"20",viewBox:"0 0 48 48",children:[(0,t.jsx)("path",{fill:"#EA4335",d:"M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.7 2.3 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.8 6C12.4 13 17.8 9.5 24 9.5z"}),(0,t.jsx)("path",{fill:"#4285F4",d:"M46.6 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8C43.8 37.3 46.6 31.4 46.6 24.5z"}),(0,t.jsx)("path",{fill:"#FBBC05",d:"M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.8-6A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.7 10.7l7.8-6z"}),(0,t.jsx)("path",{fill:"#34A853",d:"M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.2 0-11.5-4.2-13.4-9.8l-7.8 6C6.6 42.6 14.6 48 24 48z"})]}),h=()=>(0,t.jsx)("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"#FFFFFF",children:(0,t.jsx)("path",{d:"M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.27h3.32l-.53 3.5h-2.79V24C19.61 23.1 24 18.1 24 12.07z"})});function f({label:e,type:a="text",value:n,onChange:r,placeholder:o,maxLength:s,autoComplete:i,required:l}){return(0,t.jsxs)("div",{className:"input-group",children:[(0,t.jsxs)("label",{children:[e,l&&(0,t.jsx)("span",{style:{color:"#FF5A5A",marginLeft:"3px"},children:"*"})]}),(0,t.jsx)("input",{type:a,value:n,onChange:e=>r(e.target.value),placeholder:o,maxLength:s,autoComplete:i})]})}function b({suit:e,style:a}){return(0,t.jsx)("div",{className:"suit-particle",style:a,children:e})}function y(e){if(!e)return"";if("string"==typeof e)return e.slice(0,10);let t=new Date(e);return Number.isNaN(t.getTime())?"":t.toISOString().slice(0,10)}e.s(["default",0,function(){let e=(0,n.useRouter)(),[i,c]=(0,a.useState)("main"),[v,j]=(0,a.useState)(!0),[w,k]=(0,a.useState)(""),[F,N]=(0,a.useState)(""),[C,S]=(0,a.useState)(""),[L,E]=(0,a.useState)(!1),[z,A]=(0,a.useState)(""),[D,B]=(0,a.useState)(""),[P,M]=(0,a.useState)(!1),[T,q]=(0,a.useState)(!1),[R,I]=(0,a.useState)(""),[Y,G]=(0,a.useState)(""),[_,O]=(0,a.useState)(""),[U,V]=(0,a.useState)(""),[X,$]=(0,a.useState)(""),[H,W]=(0,a.useState)(""),[J,K]=(0,a.useState)(""),[Q,Z]=(0,a.useState)(""),[ee,et]=(0,a.useState)(""),[ea,en]=(0,a.useState)(""),[er,eo]=(0,a.useState)(null),[es,ei]=(0,a.useState)(!1),[el,ec]=(0,a.useState)(""),[ed,ep]=(0,a.useState)(""),[eu,ex]=(0,a.useState)(!1);(0,a.useEffect)(()=>{let e=setInterval(()=>{ex(e=>!e)},3e3);return()=>clearInterval(e)},[]),(0,a.useEffect)(()=>{let e=()=>{(0,o.playBGM)(),document.removeEventListener("click",e),document.removeEventListener("keydown",e),document.removeEventListener("touchstart",e),document.removeEventListener("scroll",e),document.removeEventListener("touchmove",e),document.removeEventListener("wheel",e)},t=(0,s.loadSoundSettings)();return(0,o.setBGMVolume)((0,s.getVolumeForCategory)(t,"home")),(0,o.playBGM)(),document.addEventListener("click",e),document.addEventListener("keydown",e),document.addEventListener("touchstart",e),document.addEventListener("scroll",e),document.addEventListener("touchmove",e),document.addEventListener("wheel",e),()=>{document.removeEventListener("click",e),document.removeEventListener("keydown",e),document.removeEventListener("touchstart",e),document.removeEventListener("scroll",e),document.removeEventListener("touchmove",e),document.removeEventListener("wheel",e)}},[]),(0,a.useEffect)(()=>{(0,l.apiFetch)("/api/auth/me").then(e=>e.json()).then(t=>{let a=e.query?.upgradeGuest==="1";t.user?a&&"guest"===t.user.type?(V(t.user.nickname||""),G(t.user.nickname||""),eo(t.user.guestSessionId||null),c("main"),j(!1)):"registered"===t.user.type&&!1===t.user.profileComplete?(G(t.user.first_name||""),O(t.user.last_name||""),V(t.user.nickname||""),W(t.user.country_id?String(t.user.country_id):""),K(y(t.user.dob)),Z(t.user.gender||""),c("complete-profile"),j(!1)):e.replace("/"):j(!1)}).catch(()=>j(!1))},[e.query]),(0,a.useEffect)(()=>{let{step:t,provider:a,tempToken:n,firstName:r,lastName:o,guestName:s,guestSessionId:i,error:l}=e.query||{};l&&ec(decodeURIComponent(l)),"complete-profile"===t&&a&&n&&(c("oauth-profile"),en(a),et(decodeURIComponent(n)),r&&G(decodeURIComponent(r).slice(0,20)),o&&O(decodeURIComponent(o).slice(0,20)),i&&eo(Number(i)),j(!1))},[e.query]),(0,a.useEffect)(()=>{if(window.Capacitor){var t;t=({provider:e,tempToken:t,firstName:a,lastName:n})=>{en(e),et(t),a&&G(a.slice(0,20)),n&&O(n.slice(0,20)),c("oauth-profile"),j(!1)},u.App.addListener("appUrlOpen",async({url:a})=>{if(!a.startsWith("cc.altius.leastscore://oauth"))return;try{await x.Browser.close()}catch(e){}let n=new URLSearchParams(a.split("?")[1]||""),r=n.get("token"),o=n.get("error"),s=n.get("step");if(r){(0,p.saveToken)(r),(()=>e.replace("/"))();return}if("complete-profile"===s){let e=n.get("provider")||"",a=n.get("tempToken")||"",r=decodeURIComponent(n.get("firstName")||""),o=decodeURIComponent(n.get("lastName")||"");t({provider:e,tempToken:a,firstName:r,lastName:o});return}o?(e=>ec(e))(decodeURIComponent(o)):(e=>ec(e))("OAuth login failed. Please try again.")})}},[]),(0,a.useEffect)(()=>{let e=e=>{if(e.target.closest("button, .link-text, .logo-card-wrap")){let e=new Audio("/sound/touch%20sound.wav"),t=(0,s.loadSoundSettings)();e.volume=(0,s.getVolumeForCategory)(t,"click"),e.play().catch(()=>{})}};return document.addEventListener("click",e),()=>document.removeEventListener("click",e)},[]);let em=async(e,t)=>(await (0,l.apiFetch)(e,{method:"POST",body:JSON.stringify(t)})).json(),eg=async e=>{ei(!0),ec(""),ep("");try{await e()}catch(e){ec("An unexpected error occurred.")}finally{ei(!1)}},eh=async e=>{try{console.log("==== OAUTH DEBUG ===="),console.log("1. Provider:",e);let t=!!window.Capacitor;console.log("2. Is Mobile?",t);let a="https://13.51.162.232.nip.io";if(a.startsWith("http")||(a="https://"+a),er)return;let n=t?`${a}/api/auth/oauth/${e}?mobile=1`:`${a}/api/auth/oauth/${e}`;console.log("4. Target URL:",n),console.log("5. CapacitorBrowser Available?",!!m),t&&m?(console.log("6. Calling CapacitorBrowser.open()..."),await m.open({url:n}),console.log("7. CapacitorBrowser.open() finished!")):(console.log("6. Redirecting via window.location..."),window.location.href=n)}catch(e){console.error("❌ ERROR in handleOAuth:",e);try{window.open(url,"_system")}catch(e){ec("Unable to open browser. Please ensure a web browser (like Chrome) is installed.")}}},ef=e=>{c(e),ec(""),ep(""),E(!1),S(""),M(!1),q(!1)};return v?(0,t.jsx)("div",{className:"mobile-app-container",children:(0,t.jsx)("div",{className:"mobile-frame",style:{alignItems:"center",justifyContent:"center"},children:(0,t.jsx)("div",{className:"premium-spinner"})})}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(r.default,{children:[(0,t.jsx)("title",{children:"Login — LeastScore"}),(0,t.jsx)("link",{href:"https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap",rel:"stylesheet"})]}),(0,t.jsx)("style",{children:`
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
      `}),(0,t.jsx)("div",{className:"mobile-app-container",children:(0,t.jsxs)("div",{className:"mobile-frame",children:[(0,t.jsx)("div",{className:"bg-mesh"}),(0,t.jsx)("div",{className:"noise-overlay"}),[{suit:"♠",style:{top:"8%",left:"6%",animationDelay:"0s",animationDuration:"18s",fontSize:"22px",opacity:.12}},{suit:"♥",style:{top:"15%",right:"8%",animationDelay:"3s",animationDuration:"22s",fontSize:"16px",opacity:.09,color:"#FF6B6B"}},{suit:"♦",style:{top:"55%",left:"4%",animationDelay:"6s",animationDuration:"20s",fontSize:"18px",opacity:.1,color:"#FF6B6B"}},{suit:"♣",style:{top:"70%",right:"5%",animationDelay:"1.5s",animationDuration:"25s",fontSize:"20px",opacity:.11}},{suit:"♠",style:{top:"40%",right:"3%",animationDelay:"9s",animationDuration:"16s",fontSize:"13px",opacity:.08}},{suit:"♥",style:{top:"85%",left:"10%",animationDelay:"4.5s",animationDuration:"19s",fontSize:"14px",opacity:.07,color:"#FF6B6B"}}].map((e,a)=>(0,t.jsx)(b,{suit:e.suit,style:e.style},a)),(0,t.jsxs)("div",{className:"scroll-content",children:[(0,t.jsxs)("div",{className:"logo-section",children:[(0,t.jsx)("div",{className:"logo-card-wrap",onClick:()=>ex(e=>!e),title:"Click to flip",children:(0,t.jsxs)("div",{className:`logo-card-inner${eu?" flipped":""}`,children:[(0,t.jsx)("div",{className:"logo-card-face front",children:"🃏"}),(0,t.jsx)("div",{className:"logo-card-face back",children:"🎴"})]})}),(0,t.jsx)("h1",{className:"logo-title",children:"LeastScore"}),"oauth-username"===i?(0,t.jsxs)("p",{className:"logo-subtitle",children:["Set your username for ",ea]}):er?(0,t.jsx)("p",{className:"logo-subtitle",children:"Link your account to save stats"}):(0,t.jsx)(t.Fragment,{children:(0,t.jsxs)("div",{className:"logo-badge",children:[(0,t.jsx)("span",{children:"♠"})," The card game where less wins"]})})]}),(0,t.jsxs)("div",{className:"card-surface",children:[el&&(0,t.jsx)("div",{className:"alert-error",children:el}),ed&&(0,t.jsx)("div",{className:"alert-success",children:ed}),"main"===i&&(0,t.jsxs)("div",{className:"view-animate",children:[er&&(0,t.jsx)("div",{className:"upgrade-badge",children:"⬆ Upgrade account"}),(0,t.jsxs)("button",{className:"btn-google",onClick:()=>eh("google"),disabled:es,children:[(0,t.jsx)(g,{})," Continue with Google"]}),(0,t.jsxs)("button",{className:"btn-facebook mt-3",onClick:()=>eh("facebook"),disabled:es,children:[(0,t.jsx)(h,{})," Continue with Facebook"]}),!er&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("div",{className:"divider",children:[(0,t.jsx)("span",{className:"line"}),(0,t.jsx)("span",{className:"text",children:"OR"}),(0,t.jsx)("span",{className:"line"})]}),(0,t.jsxs)("button",{className:"btn-gold",onClick:()=>ef("guest"),disabled:es,children:[(0,t.jsx)("span",{children:"👤"})," Play as Guest"]}),(0,t.jsxs)("div",{className:"footer-links",children:[(0,t.jsx)("span",{className:"link-text",onClick:()=>ef("login"),children:"Login with email"}),(0,t.jsx)("span",{style:{color:"#8896A7",margin:"0 8px"},children:"•"}),(0,t.jsx)("span",{className:"link-text",onClick:()=>ef("signup"),children:"Sign up"})]})]})]}),"signup"===i&&(0,t.jsxs)("div",{className:"view-animate",children:[(0,t.jsx)("button",{className:"btn-back",onClick:()=>ef("main"),children:"← Back"}),(0,t.jsx)("h2",{className:"view-title",children:"Create Account"}),T?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("p",{className:"view-desc",children:"Complete your profile details."}),(0,t.jsxs)("div",{className:"input-row",children:[(0,t.jsx)("div",{style:{flex:1},children:(0,t.jsx)(f,{label:"First Name",value:Y,onChange:G,placeholder:"First Name",maxLength:20,required:!0})}),(0,t.jsx)("div",{style:{flex:1},children:(0,t.jsx)(f,{label:"Last Name",value:_,onChange:O,placeholder:"Last Name",maxLength:20})})]}),(0,t.jsx)(f,{label:"Nickname",value:U,onChange:V,placeholder:"CoolNickname",maxLength:20,required:!0}),(0,t.jsxs)("div",{className:"input-row",children:[(0,t.jsx)("div",{style:{flex:1},children:(0,t.jsx)(f,{label:"DOB",type:"date",value:J,onChange:K,required:!0})}),(0,t.jsx)("div",{style:{flex:1},children:(0,t.jsxs)("div",{className:"input-group",children:[(0,t.jsxs)("label",{children:["Gender",(0,t.jsx)("span",{style:{color:"#FF5A5A",marginLeft:"3px"},children:"*"})]}),(0,t.jsxs)("select",{value:Q,onChange:e=>Z(e.target.value),style:{width:"100%",background:"rgba(0,0,0,0.35)",border:"1px solid rgba(255,255,255,0.08)",color:"#F0F4FF",padding:"13px 15px",borderRadius:"13px",fontSize:"15px",outline:"none"},children:[(0,t.jsx)("option",{value:"",children:"Select Gender"}),(0,t.jsx)("option",{value:"male",children:"Male"}),(0,t.jsx)("option",{value:"female",children:"Female"}),(0,t.jsx)("option",{value:"other",children:"Other"})]})]})})]}),(0,t.jsx)(d,{value:H,onChange:W,required:!0}),(0,t.jsx)(f,{label:"Password",type:"password",value:R,onChange:I,placeholder:"At least 6 characters",required:!0}),(0,t.jsx)("button",{className:"btn-gold mt-4",onClick:()=>eg(async()=>{let t=await em("/api/auth/register",{email:z,otp:D,firstName:Y,lastName:_,nickname:U,dob:J,gender:Q,countryId:H,password:R,guestSessionId:er||void 0});if(t.error)return ec(t.error);t.token&&(0,p.saveToken)(t.token),e.replace("/")}),disabled:es||!Y||!U||!H||!J||!Q||R.length<6,children:es?"Creating…":"Create Account & Play 🎮"})]}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("p",{className:"view-desc",children:"Enter your email to receive a verification code."}),(0,t.jsx)(f,{label:"Email Address",type:"email",value:z,onChange:A,placeholder:"you@example.com",disabled:P,required:!0}),P&&(0,t.jsx)(f,{label:"Verification Code",value:D,onChange:B,placeholder:"123456",maxLength:6,required:!0}),P?(0,t.jsx)("button",{className:"btn-primary mt-4",onClick:()=>eg(async()=>{let e=await em("/api/auth/otp/verify",{email:z,otp:D});if(e.error)return ec(e.error);q(!0),ep("Email verified. Please complete your profile.")}),disabled:es||D.length<6,children:es?"Verifying…":"Verify Code"}):(0,t.jsx)("button",{className:"btn-primary mt-4",onClick:()=>eg(async()=>{let e=await em("/api/auth/otp/send",{email:z});if(e.error)return ec(e.error);M(!0),ep("Verification code sent to your email.")}),disabled:es||!z.includes("@"),children:es?"Sending…":"Send Code"})]})]}),"complete-profile"===i&&(0,t.jsxs)("div",{className:"view-animate",children:[(0,t.jsx)("h2",{className:"view-title",children:"Complete Profile"}),(0,t.jsx)("p",{className:"view-desc",children:"Please complete your profile details before playing."}),(0,t.jsxs)("div",{className:"input-row",children:[(0,t.jsx)("div",{style:{flex:1},children:(0,t.jsx)(f,{label:"First Name",value:Y,onChange:G,placeholder:"First Name",maxLength:20,required:!0})}),(0,t.jsx)("div",{style:{flex:1},children:(0,t.jsx)(f,{label:"Last Name",value:_,onChange:O,placeholder:"Last Name",maxLength:20})})]}),(0,t.jsx)(f,{label:"Nickname",value:U,onChange:V,placeholder:"CoolNickname",maxLength:20,required:!0}),(0,t.jsxs)("div",{className:"input-row",children:[(0,t.jsx)("div",{style:{flex:1},children:(0,t.jsx)(f,{label:"DOB",type:"date",value:J,onChange:K,required:!0})}),(0,t.jsx)("div",{style:{flex:1},children:(0,t.jsxs)("div",{className:"input-group",children:[(0,t.jsxs)("label",{children:["Gender",(0,t.jsx)("span",{style:{color:"#FF5A5A",marginLeft:"3px"},children:"*"})]}),(0,t.jsxs)("select",{value:Q,onChange:e=>Z(e.target.value),style:{width:"100%",background:"rgba(0,0,0,0.35)",border:"1px solid rgba(255,255,255,0.08)",color:"#F0F4FF",padding:"13px 15px",borderRadius:"13px",fontSize:"15px",outline:"none"},children:[(0,t.jsx)("option",{value:"",children:"Select Gender"}),(0,t.jsx)("option",{value:"male",children:"Male"}),(0,t.jsx)("option",{value:"female",children:"Female"}),(0,t.jsx)("option",{value:"other",children:"Other"})]})]})})]}),(0,t.jsx)(d,{value:H,onChange:W,required:!0}),(0,t.jsx)("button",{className:"btn-gold mt-4",onClick:()=>eg(async()=>{let t=await em("/api/auth/settings",{firstName:Y,lastName:_,nickname:U,countryId:H,dob:J,gender:Q});return t.error?ec(t.error):t.user?.profileComplete===!1?ec("Please fill all required profile fields before continuing."):void e.replace("/")}),disabled:es||!Y||!U||!H||!J||!Q,children:es?"Saving...":"Save Profile & Play"})]}),"guest"===i&&(0,t.jsxs)("div",{className:"view-animate",children:[(0,t.jsx)("button",{className:"btn-back",onClick:()=>ef("main"),children:"← Back"}),(0,t.jsx)("h2",{className:"view-title",children:"Guest Login"}),(0,t.jsx)("p",{className:"view-desc",children:"Play without an account. A random nickname will be assigned automatically."}),(0,t.jsx)("button",{className:"btn-gold mt-4",onClick:()=>eg(async()=>{let t=await em("/api/auth/guest",{});if(t.error)return ec(t.error);t.token&&(0,p.saveToken)(t.token),e.replace("/")}),disabled:es,children:es?"Joining…":"Play as Guest 🎮"})]}),"login"===i&&(0,t.jsxs)("div",{className:"view-animate",children:[(0,t.jsx)("button",{className:"btn-back",onClick:()=>ef("main"),children:"← Back"}),(0,t.jsx)("h2",{className:"view-title",children:"Account Login"}),(0,t.jsx)("p",{className:"view-desc",children:"Log in with your email and password."}),(0,t.jsx)(f,{label:"Email",value:w,onChange:k,placeholder:"you@example.com",autoComplete:"username",required:!0}),(0,t.jsx)(f,{label:"Password",type:"password",value:F,onChange:N,placeholder:"Your password",autoComplete:"current-password",required:!0}),(0,t.jsx)("button",{className:"btn-gold mt-4",onClick:()=>eg(async()=>{let t=await em("/api/auth/login",{loginId:w,password:F});if(t.error)return ec(t.error);if(t.token&&(0,p.saveToken)(t.token),t.mustResetPassword)return e.replace("/reset-password");if(t.user?.profileComplete===!1){G(t.user.first_name||""),O(t.user.last_name||""),V(t.user.nickname||""),W(t.user.country_id?String(t.user.country_id):""),K(y(t.user.dob)),Z(t.user.gender||""),c("complete-profile");return}e.replace("/")}),disabled:es||!w||!F,children:es?"Logging in…":"Log In"}),(0,t.jsx)("div",{className:"footer-links",children:(0,t.jsx)("span",{className:"link-text",onClick:()=>ef("forgot"),children:"Forgot password?"})})]}),"forgot"===i&&(0,t.jsxs)("div",{className:"view-animate",children:[(0,t.jsx)("button",{className:"btn-back",onClick:()=>ef("login"),children:"← Back"}),(0,t.jsx)("h2",{className:"view-title",children:"Reset Password"}),L?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("div",{className:"forgot-success-icon",children:"✉️"}),(0,t.jsx)("p",{className:"view-desc",style:{textAlign:"center",marginTop:0},children:"If an account with that email exists, a temporary password has been sent. Check your inbox and use it to log in."}),(0,t.jsx)("button",{className:"btn-secondary mt-4",onClick:()=>ef("login"),children:"Go to Login"})]}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("p",{className:"view-desc",children:"Enter the email linked to your account. We'll send you a temporary password."}),(0,t.jsx)(f,{label:"Email Address",type:"email",value:C,onChange:S,placeholder:"you@example.com",autoComplete:"email",required:!0}),(0,t.jsx)("button",{className:"btn-primary mt-4",onClick:()=>eg(async()=>{let e=await em("/api/auth/forgot-password",{email:C});if(e.error)return ec(e.error);E(!0)}),disabled:es||!C.includes("@"),children:es?"Sending…":"📧 Send Temporary Password"})]})]}),"oauth-profile"===i&&(0,t.jsxs)("div",{className:"view-animate",children:[(0,t.jsx)("h2",{className:"view-title",children:"Almost there!"}),(0,t.jsxs)("p",{className:"view-desc",children:["Complete your profile for ",(0,t.jsx)("strong",{style:{color:"#F0F4FF",textTransform:"capitalize"},children:ea})," sign-up."]}),(0,t.jsxs)("div",{className:"input-row",children:[(0,t.jsx)("div",{style:{flex:1},children:(0,t.jsx)(f,{label:"First Name",value:Y,onChange:G,placeholder:"First Name",maxLength:20,required:!0})}),(0,t.jsx)("div",{style:{flex:1},children:(0,t.jsx)(f,{label:"Last Name",value:_,onChange:O,placeholder:"Last Name",maxLength:20})})]}),(0,t.jsx)(f,{label:"Nickname",value:U,onChange:V,placeholder:"CoolNickname",maxLength:20,required:!0}),(0,t.jsxs)("div",{className:"input-row",children:[(0,t.jsx)("div",{style:{flex:1},children:(0,t.jsx)(f,{label:"DOB (YYYY-MM-DD)",type:"date",value:J,onChange:K,placeholder:"YYYY-MM-DD",required:!0})}),(0,t.jsx)("div",{style:{flex:1},children:(0,t.jsxs)("div",{className:"input-group",children:[(0,t.jsxs)("label",{children:["Gender",(0,t.jsx)("span",{style:{color:"#FF5A5A",marginLeft:"3px"},children:"*"})]}),(0,t.jsxs)("select",{value:Q,onChange:e=>Z(e.target.value),style:{width:"100%",background:"rgba(0,0,0,0.35)",border:"1px solid rgba(255,255,255,0.08)",color:"#F0F4FF",padding:"13px 15px",borderRadius:"13px",fontSize:"15px",outline:"none"},children:[(0,t.jsx)("option",{value:"",children:"Select Gender"}),(0,t.jsx)("option",{value:"male",children:"Male"}),(0,t.jsx)("option",{value:"female",children:"Female"}),(0,t.jsx)("option",{value:"other",children:"Other"})]})]})})]}),(0,t.jsx)(d,{value:H,onChange:W,required:!0}),(0,t.jsx)("p",{className:"field-hint",children:"Please verify your details above."}),(0,t.jsx)("button",{className:"btn-gold",onClick:()=>eg(async()=>{let t=await em("/api/auth/oauth/set-username",{tempToken:ee,firstName:Y,lastName:_,nickname:U,countryId:H,dob:J,gender:Q,guestSessionId:er||void 0});if(t.error)return ec(t.error);t.token&&(0,p.saveToken)(t.token),e.replace("/")}),disabled:es||!Y||!U||!H||!J||!Q,children:es?"Saving…":"Complete Profile & Play 🎮"})]})]})]})]})})]})}],57626)},87641,(e,t,a)=>{let n="/login";(window.__NEXT_P=window.__NEXT_P||[]).push([n,()=>e.r(57626)]),t.hot&&t.hot.dispose(function(){window.__NEXT_P.push([n])})}]);