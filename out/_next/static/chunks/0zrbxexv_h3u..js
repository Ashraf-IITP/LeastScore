(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,83221,(e,r,a)=>{let t=["2","3","4","5","6","7","8","9","10","J","Q","K","A"],n=t.reduce((e,r,a)=>({...e,[r]:a}),{});r.exports={SUITS:["hearts","diamonds","clubs","spades"],RANKS:t,RANK_VALUES:{2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,10:10,J:10,Q:10,K:10,A:1},RANK_ORDER:n}},83322,(e,r,a)=>{let{RANK_VALUES:t,RANK_ORDER:n}=e.r(83221);function s(e){var r;if(e.length<3)return!1;let a=[...new Set(e.map(e=>n[e.rank]))];return a.length===e.length&&(i(a)||!!(r=e).some(e=>"A"===e.rank)&&i(r.map(e=>"A"===e.rank?-1:n[e.rank])))}function i(e){let r=[...e].sort((e,r)=>e-r),a=r[0];return r[r.length-1]-a==r.length-1}r.exports={calculateSum:function(e){return e.reduce((e,r)=>e+t[r.rank],0)},isSequence:s,isValidDiscard:function(e,r){if(!r.every(r=>e.some(e=>e.suit===r.suit&&e.rank===r.rank)))return!1;let a=r.length;return 1===a||(2===a?r.every(e=>e.rank===r[0].rank):3===a?s(r):4===a?r.every(e=>e.rank===r[0].rank):5===a&&(s(r)||r.every(e=>e.suit===r[0].suit)))},removeCards:function(e,r){return e.filter(e=>!r.some(r=>r.suit===e.suit&&r.rank===e.rank))}}},55915,(e,r,a)=>{let{SUITS:t,RANKS:n,RANK_VALUES:s,RANK_ORDER:i}=e.r(83221),{calculateSum:o,isSequence:l}=e.r(83322),d={riskThreshold:.2,memoryAccuracy:1,aggressionLevel:.6,endGameDeckSize:10,variancePenaltyWeight:.3};function c(){return{seenCards:[],discardHistory:[],perOpponent:{},turnCount:0,deckExhausted:!1,reshuffleSeenSnapshot:[],pendingObservations:[]}}function p(e,r){for(let a of r)e.seenCards.some(e=>e.suit===a.suit&&e.rank===a.rank)||e.seenCards.push({...a})}function x(e,r){return e.perOpponent[r]||(e.perOpponent[r]={pickups:[],discards:[],deckDraws:0,exactHandSize:5}),e.perOpponent[r]}function g(e,r,a){let t=x(e,a);t.pickups.push({...r}),t.exactHandSize=Math.max(1,t.exactHandSize+1),p(e,[r])}function b(e,r,a){let t=x(e,a);for(let e of r)t.discards.push({...e});t.exactHandSize=Math.max(1,t.exactHandSize-r.length),p(e,r)}function u(e,r){let a=x(e,r);a.deckDraws++,a.exactHandSize=Math.max(1,a.exactHandSize+1)}function m(e,r){let a=[];for(let e of t)for(let r of n)a.push({suit:e,rank:r});if(e.deckExhausted&&e.reshuffleSeenSnapshot.length>0){let a=new Set(r.map(e=>`${e.rank}|${e.suit}`)),t=e.reshuffleSeenSnapshot.filter(e=>!a.has(`${e.rank}|${e.suit}`)),n=new Set(e.reshuffleSeenSnapshot.map(e=>`${e.rank}|${e.suit}`)),s=new Set(e.seenCards.filter(e=>!n.has(`${e.rank}|${e.suit}`)).map(e=>`${e.rank}|${e.suit}`));return t.filter(e=>!s.has(`${e.rank}|${e.suit}`))}let s=[...e.seenCards];for(let e of r)s.some(r=>r.suit===e.suit&&r.rank===e.rank)||s.push(e);return a.filter(e=>!s.some(r=>r.suit===e.suit&&r.rank===e.rank))}function f(e){let r=[];for(let a=0;a<e.length;a++)r.push([e[a]]);for(let a=0;a<e.length;a++)for(let t=a+1;t<e.length;t++)e[a].rank===e[t].rank&&r.push([e[a],e[t]]);for(let a=0;a<e.length;a++)for(let t=a+1;t<e.length;t++)for(let n=t+1;n<e.length;n++){let s=[e[a],e[t],e[n]];l(s)&&r.push(s)}for(let a=0;a<e.length;a++)for(let t=a+1;t<e.length;t++)for(let n=t+1;n<e.length;n++)for(let s=n+1;s<e.length;s++){let i=[e[a],e[t],e[n],e[s]];i.every(e=>e.rank===i[0].rank)&&r.push(i)}if(e.length>=5)for(let a=0;a<e.length;a++)for(let t=a+1;t<e.length;t++)for(let n=t+1;n<e.length;n++)for(let s=n+1;s<e.length;s++)for(let i=s+1;i<e.length;i++){let o=[e[a],e[t],e[n],e[s],e[i]];(l(o)||o.every(e=>e.suit===o[0].suit))&&r.push(o)}return r}function h(e){if(0===e.length)return 0;let r=e.map(e=>s[e.rank]),a=r.reduce((e,r)=>e+r,0)/r.length;return r.reduce((e,r)=>e+(r-a)**2,0)/r.length}function y(e){let r=0;for(let a=0;a<e.length;a++)for(let t=a+1;t<e.length;t++){let n=Math.abs(i[e[a].rank]-i[e[t].rank]);1===n||12===n?r-=1.5:2===n&&(r-=.5)}return r}function w(e,r,a){let t=f(e);if(0===t.length)return null;let n=null,i=1/0,l=0;for(let r of t){let t=e.filter(e=>!r.some(r=>r.suit===e.suit&&r.rank===e.rank)),c=o(t),p=y(t),x=h(t)*d.variancePenaltyWeight,g=0;if(a)for(let e of r)j(e,a)&&(g+=.2*s[e.rank]);let b=c+p+x+g;b<i&&(i=b,n=r,l=g)}return{discard:n,remainingScore:i-l,opponentPenalty:l}}function k(e,r){let a=x(e,r),t={playerIndex:r,discardedRanks:{},discardedSuits:{},pickedUpCards:[...a.pickups],preferredSuits:[],avoidedSuits:[],deckDraws:a.deckDraws,estimatedScoreRange:[5,50],looksCloseToDeclaration:!1,estimatedHandSize:a.exactHandSize,observationConfidence:0};for(let e of a.discards)t.discardedRanks[e.rank]=(t.discardedRanks[e.rank]||0)+1,t.discardedSuits[e.suit]=(t.discardedSuits[e.suit]||0)+1;let n={};for(let e of a.pickups)n[e.suit]=(n[e.suit]||0)+1;let i={};for(let e of a.discards)i[e.suit]=(i[e.suit]||0)+1;let o=Object.entries(i).sort((e,r)=>r[1]-e[1]);o.length>0&&(t.avoidedSuits=o.slice(0,2).map(e=>e[0]));let l=Object.entries(n).sort((e,r)=>r[1]-e[1]);l.length>0&&(t.preferredSuits=l.map(e=>e[0])),t.estimatedScoreRange=function(e,r){let a=e.discards,t=e.pickups,n=e.exactHandSize,i=25,o=20;if(0===a.length+t.length)return[Math.max(0,Math.round(i-o)),Math.round(i+o)];a.length>0&&(i=Math.max(2,i-(a.reduce((e,r)=>e+s[r.rank],0)/a.length-7)*1.5*Math.min(1,a.length/4)),o*=Math.max(.4,1-.08*a.length)),t.length>0&&(t.reduce((e,r)=>e+s[r.rank],0)/t.length<=4?(i=Math.max(2,i-3*Math.min(1,t.length/3)),o*=.85):o*=1.05,t.length/Math.max(1,e.deckDraws+t.length)>.5&&(o*=.8));let l=13*n,d=Math.max(n,Math.round((i=Math.min(i,.7*l))-o));return[d,Math.max(d,Math.min(l,Math.round(i+o)))]}(a,e.turnCount),t.observationConfidence=Math.min(1,(a.discards.length+a.pickups.length)/6);let d=a.discards.length>0?a.discards.reduce((e,r)=>e+s[r.rank],0)/a.discards.length:7,c=e.turnCount;return c>=3&&d>=8&&a.pickups.length>=2&&(t.looksCloseToDeclaration=!0),c>=5&&d>=7&&(t.looksCloseToDeclaration=!0),t.observationConfidence>=.7&&t.estimatedScoreRange[1]<=12&&(t.looksCloseToDeclaration=!0),t}function v(e,r,a){let t=[];for(let n=0;n<r.players.length;n++)n!==a&&(r.players[n].eliminated||t.push(k(e,n)));return t}function j(e,r){if(r.estimatedHandSize>=5&&r.preferredSuits.includes(e.suit)||r.pickedUpCards.some(r=>r.rank===e.rank)||s[e.rank]<=3)return!0;let a=r.pickedUpCards;if(a.length>=2){let r=i[e.rank];for(let e=0;e<a.length;e++)for(let t=e+1;t<a.length;t++){let n=i[a[e].rank],s=i[a[t].rank],o=Math.abs(n-s);if(1===o){let e=Math.min(n,s),a=Math.max(n,s);if(r===e-1||r===a+1)return!0}else if(12===o&&1===r)return!0}}return!1}function F(e,r,a){let t=f(e).filter(e=>e.length>1);if(0===t.length)return null;let n=null,i=1/0;for(let r of t){let t=e.filter(e=>!r.some(r=>r.suit===e.suit&&r.rank===e.rank)),l=o(t),c=y(t),p=h(t)*d.variancePenaltyWeight,x=0;if(a)for(let e of r)j(e,a)&&(x+=.2*s[e.rank]);let g=l+c+p+x;g<i&&(i=g,n={combo:r,scoreAfter:l,adjustedScore:g})}return n}function S(e,r,a,t){let n=f(e),s=o(e),i=m(a,e),l=i.length<=d.endGameDeckSize,c=l||i.length<=30?i:[...i].sort(()=>Math.random()-.5).slice(0,30),p=c.length,x=-1/0,g=null,b=0,u=!1,h=-1/0,y=null;for(let i of n){let n=e.filter(e=>!i.some(r=>r.suit===e.suit&&r.rank===e.rank)),l=o(n),d=s-l;if(r&&r.length>0)for(let e=0;e<r.length;e++){let s=r[e],o=w([...n,s],a,t);if(o&&o.discard){let r=d+(l-o.remainingScore),a=o.discard.length>1&&o.discard.some(e=>e.suit===s.suit&&e.rank===s.rank);(r>x||r===x&&a&&!u)&&(x=r,g=i,b=e,a&&(u=!0))}}if(p>0){let e=0;for(let r of c){let s=[...n,r],i=w(s,a,t);e+=i&&i.discard?i.remainingScore:o(s)}let r=d+(l-(e/=p));r>h&&(h=r,y=i)}}return{bestVisibleGain:x,bestVisibleD:g,bestVisibleIndex:b,visibleCreatesCombo:u,bestDeckGain:h,bestDeckD:y,sampleSize:p,isEndGame:l}}let N={hearts:"Hearts",diamonds:"Diamonds",clubs:"Clubs",spades:"Spades"},z={hearts:"♥",diamonds:"♦",clubs:"♣",spades:"♠"};function C(e){return`${e.rank}${z[e.suit]||e.suit[0].toUpperCase()}`}function A(e){return e.map(C).join(", ")}r.exports={createBotState:c,makeBotDecision:function(e,r){let a=e.players[r],t=[...a.hand],n=e.visibleCard||[];a.botState||(a.botState=c(),p(a.botState,n),p(a.botState,t));let s=a.botState;s.turnCount++;let l=v(s,e,r),x=o(t),g=m(s,t),b=[];for(let r of(b.push(`It's my turn #${s.turnCount}. My hand is [${A(t)}] with a total value of ${x}.`),b.push(`I've tracked ${s.seenCards.length} cards so far — ${g.length} cards remain unseen in the deck${g.length<=d.endGameDeckSize?" (END GAME — exhaustive mode)":""}.`),l)){let a=e.players[r.playerIndex]?.username||`Player ${r.playerIndex+1}`,t=`I estimate ${a}'s score is between ${r.estimatedScoreRange[0]} and ${r.estimatedScoreRange[1]} (~${r.estimatedHandSize} cards, confidence: ${(100*r.observationConfidence).toFixed(0)}%)`;r.looksCloseToDeclaration&&(t+=" ⚠️ (looks close to declaring!)"),r.estimatedHandSize<5&&r.preferredSuits.length>0&&(t+=". With <5 cards, same-suit combos are impossible."),b.push(t+".")}let u=function(e,r,a,t){let n,s=[],i=o(e);s.push(`Bot hand sum: ${i}, cumulative score: ${r}`);let l=m(t,e),c=l.length<=d.endGameDeckSize,p=1/0,x=0,g=!1,b=0;for(let e of a){let[r,a]=e.estimatedScoreRange;r<p&&(p=r),a>x&&(x=a),e.looksCloseToDeclaration&&(g=!0),b+=e.observationConfidence}p===1/0&&(p=5,x=50);let u=a.length>0?b/a.length:0;s.push(`Opponent estimated range: [${p}, ${x}], confidence: ${(100*u).toFixed(0)}%`),n=x<=p?+(i>p):Math.max(0,Math.min(1,(i-p)/(x-p)))*u+.5*(1-u),s.push(`P(any opponent < ${i}) ≈ ${(100*n).toFixed(1)}% (confidence-adjusted)`);let f=n,h=d.riskThreshold,y=0;i<=5?y=.1:i<=10&&(y=.05);let w=0;g&&i<=15&&(w=.15,s.push("⚠️ An opponent looks close to declaring — defensive urgency applied."));let k=0;c&&(k=.08*(1-l.length/d.endGameDeckSize),s.push(`🔚 End-game: only ${l.length} cards left in deck — urgency boost +${(100*k).toFixed(1)}%`));let v=h+y+w+k+.05*d.aggressionLevel;s.push(`Risk: ${(100*f).toFixed(1)}%, threshold: ${(100*v).toFixed(1)}%`);let j=f<v&&(i<=10||"negligible"==(i>5?"some":"negligible"));return j?s.push(`✅ DECLARING — risk ${(100*f).toFixed(1)}% < threshold ${(100*v).toFixed(1)}%, hand sum ${i}`):s.push("❌ Not declaring — risk too high or improvement still possible"),{shouldDeclare:j,reasoning:s,risk:f,handSum:i}}(t,a.score,l,s),f=(100*u.risk).toFixed(1);if(u.shouldDeclare)return b.push(`My hand sum is only ${u.handSum}. There's just a ${f}% chance an opponent beats me. I'm declaring!`),{action:"declare",decisionReasoning:b};b.push(`I considered declaring (hand sum = ${u.handSum}), but the risk is ${f}% — too risky. I'll keep playing.`);let h=-1;for(let a=1;a<e.players.length;a++){let t=(r+a)%e.players.length;if(!e.players[t].eliminated){h=t;break}}let y=h>=0?k(s,h):null,w=h>=0?e.players[h]?.username||`Player ${h+1}`:null;if(y&&w){b.push(`The next player is ${w} — I'll avoid discards that help them.`);let e=y.pickedUpCards;if(e.length>=2)for(let r=0;r<e.length;r++)for(let a=r+1;a<e.length;a++){let t=Math.abs(i[e[r].rank]-i[e[a].rank]);if(1===t||12===t){b.push(`⚠️ ${w} picked up ${C(e[r])} and ${C(e[a])} — adjacent ranks! Avoiding sequence completers.`),r=e.length;break}}}let j=F(t,s,y);if(j){let e=j.combo.length,r=x-j.scoreAfter;b.push(`#3 Pre-detection: I already hold a ${e}-card combo [${A(j.combo)}] worth ${r} points — using as floor.`)}let N=S(t,n,s,y),z="deck",D=0,I=N.bestDeckD||[t[0]];if(j){let e=x-j.scoreAfter;if(e>N.bestVisibleGain&&e>N.bestDeckGain)return I=j.combo,z="deck",b.push(`Immediate combo [${A(I)}] gains ${e.toFixed(1)} — beats all draw options (visible: ${N.bestVisibleGain.toFixed(1)}, deck: ${N.bestDeckGain.toFixed(1)}). Playing it now and drawing from deck.`),p(s,n),{action:"turn",drawFrom:"deck",discardCards:I,decisionReasoning:b}}return n.length>0?N.visibleCreatesCombo&&N.bestVisibleGain>=N.bestDeckGain-1?(z="visible",D=N.bestVisibleIndex,I=N.bestVisibleD||I,b.push(`Picking up ${C(n[D])} creates a combination (total gain ${N.bestVisibleGain.toFixed(1)}). Drawing it and discarding [${A(I)}].`)):N.bestVisibleGain>N.bestDeckGain&&N.bestVisibleGain>0?(z="visible",D=N.bestVisibleIndex,I=N.bestVisibleD||I,b.push(`Discarding [${A(I)}] and taking ${C(n[D])} — total gain ${N.bestVisibleGain.toFixed(1)} vs deck ${N.bestDeckGain.toFixed(1)}.`)):b.push(`Visible card not worth taking (deck gain ${N.bestDeckGain.toFixed(1)} ≥ visible ${N.bestVisibleGain.toFixed(1)}). Discarding [${A(I)}] and drawing blindly${N.isEndGame?" (exhaustive mode)":""}.`):b.push(`No visible cards. Discarding [${A(I)}] and drawing from deck${N.isEndGame?" (exhaustive mode)":""}.`),"visible"===z&&p(s,[n[D]]),{action:"turn",drawFrom:z,visibleIndex:"visible"===z?D:void 0,discardCards:I,decisionReasoning:b}},makePlayAlongHint:function(e,r,a){let t=[...e.players[r].hand],n=e.visibleCard||[];a||(a=c()),p(a,n),p(a,t);let s=o(t),l=m(a,t),x=[];x.push(`Your hand is [${A(t)}] with total value ${s}.`),x.push(`${a.seenCards.length} seen cards — ~${l.length} cards may still be in the hidden deck${l.length<=d.endGameDeckSize?" (END GAME)":""}.`);let g=-1;for(let a=1;a<e.players.length;a++){let t=(r+a)%e.players.length;if(!e.players[t].eliminated){g=t;break}}let b=g>=0?k(a,g):null,u=g>=0?e.players[g]?.username||`Player ${g+1}`:null;if(b&&u){x.push(`Next turn goes to ${u} — avoid discards that help them.`);let r=g>=0?e.players[g]:null,a=r?.lastDrawnCard,t=r?.lastDrawnFrom;if("visible"===t&&a&&!a.hidden){let e=b.pickedUpCards.filter(e=>e.suit!==a.suit||e.rank!==a.rank),r=e.length>0?e[e.length-1]:null;if(r){let e=Math.abs(i[a.rank]-i[r.rank]);(1===e||12===e)&&x.push(`⚠️ ${u} recently took ${C(a)} after ${C(r)} — adjacent ranks. Avoid completing their sequence.`)}}else("deck"===t||a?.hidden)&&x.push(`${u}'s last draw was from the hidden deck.`)}let f=F(t,a,b);if(f){let e=s-f.scoreAfter;x.push(`You already have a ${f.combo.length}-card combo [${A(f.combo)}] worth ${e} points immediately — consider playing it now.`)}let h=S(t,n,a,b),y="deck",w=0,v=h.bestDeckD||[t[0]];if(f){let e=s-f.scoreAfter;if(e>h.bestVisibleGain&&e>h.bestDeckGain)return v=f.combo,y="deck",x.push(`Best play: discard the ${f.combo.length}-card combo [${A(v)}] now (gain ${e.toFixed(1)}) and draw from the hidden deck.`),x.push(`Sampled ${h.sampleSize} possible hidden cards${h.isEndGame?" (exhaustive)":""}.`),{drawFrom:y,discardCards:v,reasoning:x,hintState:a}}return n.length>0?h.visibleCreatesCombo&&h.bestVisibleGain>=h.bestDeckGain-1?(y="visible",w=h.bestVisibleIndex,v=h.bestVisibleD||v,x.push(`Taking ${C(n[w])} completes a combination after discarding [${A(v)}] (total gain ${h.bestVisibleGain.toFixed(1)}).`)):h.bestVisibleGain>h.bestDeckGain&&h.bestVisibleGain>0?(y="visible",w=h.bestVisibleIndex,v=h.bestVisibleD||v,x.push(`Discard [${A(v)}] and draw ${C(n[w])} — gain ${h.bestVisibleGain.toFixed(1)} vs deck ${h.bestDeckGain.toFixed(1)}.`)):x.push(`Visible cards not worth taking (deck gain ${h.bestDeckGain.toFixed(1)}). Discard [${A(v)}] and draw from deck${h.isEndGame?" (exhaustive)":""}.`):x.push(`No visible cards. Discard [${A(v)}] and draw from deck${h.isEndGame?" (exhaustive)":""}.`),"visible"===y&&p(a,[n[w]]),x.push(`Sampled ${h.sampleSize} possible hidden cards${h.isEndGame?" (exhaustive)":""}.`),{drawFrom:y,visibleIndex:"visible"===y?w:void 0,discardCards:v,reasoning:x,hintState:a}},observeHintState:function(e,r,a,t,n){if(!e||a===n)return;let s=r.visibleCard||[],i=r.players[a];p(e,s),s.length>0&&b(e,s,a);let o=i?.lastDrawnFrom,l=i?.lastDrawnCard;if("deck"===o||l?.hidden===!0)return void u(e,a);if("visible"===o&&l&&!l.hidden)return void g(e,{suit:l.suit,rank:l.rank},a);let d=null;if(t&&t.length>0)for(let e of t){let a=s.some(r=>r.suit===e.suit&&r.rank===e.rank),t=(r.exposedCards||[]).some(r=>r.suit===e.suit&&r.rank===e.rank);if(!a&&!t){d||(d=e);break}}d?g(e,d,a):u(e,a)},observePlayerMove:function(e,r,a){let t=e.visibleCard||[],n=e.players[r].username;for(let o=0;o<e.players.length;o++){if(o===r)continue;let l=e.players[o];if(!l||!l.isBot||"hard"!==l.difficulty)continue;l.botState||(l.botState=c(),p(l.botState,t),p(l.botState,l.hand));let d=l.botState,m=[];t.length>0&&(b(d,t,r),m.push(`${n} discarded [${A(t)}] onto the visible pile.`));let f=null;if(a&&a.length>0)for(let n of a){let a=t.some(e=>e.suit===n.suit&&e.rank===n.rank),s=(e.exposedCards||[]).some(e=>e.suit===n.suit&&e.rank===n.rank);a||s||(g(d,n,r),f=n)}if(f){m.push(`${n} picked up ${C(f)} — they specifically chose that card.`),m.push(`They likely need ${f.rank}s or ${N[f.suit]} cards.`);let e=x(d,r);if(e.pickups.length>=2){let r=i[f.rank];for(let a of e.pickups){if(a.suit===f.suit&&a.rank===f.rank)continue;let e=Math.abs(r-i[a.rank]);if(1===e||12===e){m.push(`⚠️ ${n} picked up ${C(a)} and ${C(f)} — adjacent ranks! They may be building a sequence.`);break}}}}else u(d,r),m.push(`${n} drew from the deck (blind draw).`);for(let r of v(d,e,o)){let a=x(d,r.playerIndex),t=a.discards.length;if(t>0){let n=(a.discards.reduce((e,r)=>e+s[r.rank],0)/t).toFixed(1),i=e.players[r.playerIndex]?.username||`Player ${r.playerIndex+1}`,o=`(confidence: ${(100*r.observationConfidence).toFixed(0)}%)`;parseFloat(n)>=8?m.push(`${i} discarding high-value cards — est. score: ${r.estimatedScoreRange[0]}–${r.estimatedScoreRange[1]} ${o}.`):4>=parseFloat(n)&&m.push(`${i} discarding low-value cards — may hold high cards for sequences. Score: ${r.estimatedScoreRange[0]}–${r.estimatedScoreRange[1]} ${o}.`)}r.avoidedSuits.length>0&&m.push(`They seem to avoid ${r.avoidedSuits.map(e=>N[e]).join(" and ")}.`),r.preferredSuits.length>0&&(r.estimatedHandSize>=5?m.push(`They prefer ${r.preferredSuits.map(e=>N[e]).join(" and ")} — avoid discarding those suits (5-card combo risk).`):m.push(`They prefer ${r.preferredSuits.map(e=>N[e]).join(" and ")}, but ~${r.estimatedHandSize} cards means same-suit combo is impossible.`))}p(d,t),d.pendingObservations.push(...m)}},recordSeenCards:p,recordDiscard:function(e,r,a){for(let t of r)e.discardHistory.push({card:{...t},byPlayer:a});p(e,r)},recordReshuffle:function(e){e.deckExhausted=!0,e.reshuffleSeenSnapshot=e.discardHistory.map(e=>({...e.card}))},BOT_CONFIG:d}},9982,(e,r,a)=>{let{SUITS:t,RANKS:n}=e.r(83221);r.exports={createDeck:function(){return t.flatMap(e=>n.map(r=>({suit:e,rank:r})))},shuffle:function(e){for(let r=e.length-1;r>0;r--){let a=Math.floor(Math.random()*(r+1));[e[r],e[a]]=[e[a],e[r]]}return e},draw:function(e){return e.pop()}}},93615,(e,r,a)=>{let{createDeck:t,shuffle:n}=e.r(9982);r.exports={initializeGame:function(e=2){let r=Math.max(2,Math.min(8,Number(e)||2)),a=n(t()),s=Array.from({length:r},(e,r)=>({id:r,hand:[],score:0,eliminated:!1}));for(let e=0;e<5;e++)s.forEach(e=>{e.hand.push(a.pop())});let i=[a.pop()];return{players:s,currentPlayer:0,roundStartPlayer:0,deck:a,visibleCard:i,exposedCards:[],gameOver:!1,winner:null,roundHistory:[],turnsPlayedInRound:0}}}},7630,(e,r,a)=>{let{draw:t,shuffle:n}=e.r(9982),{isValidDiscard:s,removeCards:i}=e.r(83322);r.exports={processTurn:function(e,r,a,o,l){let d;function c(r){let a=e.players.length;for(let t=0;t<a;t++){let n=(r+t)%a,s=e.players[n];if(s&&!s.eliminated)return n}return -1}if(e.players[e.currentPlayer]&&e.players[e.currentPlayer].eliminated){let r=c(e.currentPlayer);if(-1===r)return{error:"No active players"};e.currentPlayer=r}if(e.currentPlayer!==r)return{error:"Not your turn"};if(e.gameOver)return{error:"Game over"};let p=e.players[r];if("visible"===a){if(0===e.visibleCard.length)return{error:"No visible card"};if("number"!=typeof o||o<0||o>=e.visibleCard.length)return{error:"Select a valid visible card to draw"};d=e.visibleCard.splice(o,1)[0]}else{if("deck"!==a)return{error:"Invalid draw source"};if(0===e.deck.length){if(0===e.exposedCards.length)return{error:"No cards left"};e.deck=n([...e.exposedCards]),e.exposedCards=[]}d=t(e.deck),0===e.deck.length&&e.exposedCards.length>0&&(e.deck=n([...e.exposedCards]),e.exposedCards=[])}if(p.hand.push(d),!s(p.hand,l))return p.hand.pop(),"visible"===a?e.visibleCard.splice(o,0,d):e.deck.push(d),{error:"Invalid discard"};p.hand=i(p.hand,l),p.lastDrawnCard=d,p.lastDrawnFrom=a,p.lastDiscard=[...l],e.exposedCards.push(...e.visibleCard),e.visibleCard=[...l];let x=c(e.currentPlayer+1);return -1===x||(e.currentPlayer=x),e.turnsPlayedInRound=(e.turnsPlayedInRound||0)+1,{success:!0,gameState:e}}}},31367,(e,r,a)=>{let{calculateSum:t}=e.r(83322),{createDeck:n,shuffle:s}=e.r(9982);function i(e,r){if(!e.length)return -1;for(let a=1;a<=e.length;a++){let t=(r+a)%e.length;if(!e[t].eliminated)return t}return -1}r.exports={declare:function(e,r){if(e.gameOver)return{error:"Game over"};let a=e.players.filter(e=>!e.eliminated).length;if((e.turnsPlayedInRound||0)<a)return{error:"Cannot declare until everyone has played at least one turn"};if(!e.players[r])return{error:"Invalid player"};let o=e.players.map(e=>e.eliminated?1/0:t(e.hand)),l=o[r],d=Math.min(...o),c=o.some((e,a)=>a!==r&&e===l),p=c||l===d,x=e.players.map((e,a)=>e.eliminated?null:a===r?p?0:20+(l-d):p?Math.max(0,o[a]-l):0),g=x[r];e.roundHistory||(e.roundHistory=[]),e.roundHistory.push({declarerId:r,won:p,scores:x}),e.players.forEach((e,r)=>{null!==x[r]&&(e.score+=x[r])});let b={players:e.players.map((e,r)=>({username:e.username,hand:[...e.hand],sum:e.eliminated?1/0:t(e.hand)})),declarerId:r,minSum:d,declarerSum:l,declarerMatchedAnother:c,declaredWon:c||l===d},u=[];e.players.forEach((e,r)=>{!e.eliminated&&e.score>=100&&(e.eliminated=!0,u.push(r))});let m=e.players.filter(e=>!e.eliminated).length;if(m<=1)if(e.gameOver=!0,1===m)e.winner=e.players.findIndex(e=>!e.eliminated);else{let r=e.players.map((e,r)=>({idx:r,score:e.score})).sort((e,r)=>e.score-r.score);e.winner=r.length?r[0].idx:null}else{let r=Number.isInteger(e.roundStartPlayer)?e.roundStartPlayer:e.currentPlayer,a=s(n());e.players.forEach(e=>{if(e.hand=[],e.lastDiscard=null,e.lastDrawnCard=null,e.lastDrawnFrom=null,e.isThinking=!1,e.isBot&&(e.botState=null),!e.eliminated)for(let r=0;r<5;r++)e.hand.push(a.pop())}),e.visibleCard=[a.pop()],e.exposedCards=[],e.deck=a;let t=i(e.players,r);e.roundStartPlayer=t,e.currentPlayer=t,e.turnsPlayedInRound=0}return{success:!0,gameState:e,score:g,newlyEliminated:u,roundSummary:b}},findNextActivePlayer:i}},54698,(e,r,a)=>{let{SUITS:t,RANKS:n,RANK_VALUES:s}=e.r(83221),{calculateSum:i,isSequence:o}=e.r(83322),l={hearts:"♥",diamonds:"♦",clubs:"♣",spades:"♠"};function d(e){return`${e.rank}${l[e.suit]||e.suit[0].toUpperCase()}`}function c(e){return e.map(d).join(", ")}function p(e){let r=[];for(let a=0;a<e.length;a++)r.push([e[a]]);for(let a=0;a<e.length;a++)for(let t=a+1;t<e.length;t++)e[a].rank===e[t].rank&&r.push([e[a],e[t]]);for(let a=0;a<e.length;a++)for(let t=a+1;t<e.length;t++)for(let n=t+1;n<e.length;n++){let s=[e[a],e[t],e[n]];o(s)&&r.push(s)}for(let a=0;a<e.length;a++)for(let t=a+1;t<e.length;t++)for(let n=t+1;n<e.length;n++)for(let s=n+1;s<e.length;s++){let i=[e[a],e[t],e[n],e[s]];i.every(e=>e.rank===i[0].rank)&&r.push(i)}if(e.length>=5)for(let a=0;a<e.length;a++)for(let t=a+1;t<e.length;t++)for(let n=t+1;n<e.length;n++)for(let s=n+1;s<e.length;s++)for(let i=s+1;i<e.length;i++){let l=[e[a],e[t],e[n],e[s],e[i]];(o(l)||l.every(e=>e.suit===l[0].suit))&&r.push(l)}return r}function x(e){let r=p(e),a=[e[0]],t=1/0;for(let n of r){let r=i(e.filter(e=>!n.some(r=>r.suit===e.suit&&r.rank===e.rank)));r<t?(t=r,a=n):r===t&&n.length>a.length&&(a=n)}return{discard:a,remainingScore:t}}function g(){return{recentDiscards:[],selfPickedCards:[],opponentPickups:[],turnCount:0,pendingObservations:[]}}r.exports={createEasyBotState:g,makeEasyBotDecision:function(e,r){let a=e.players[r],o=[...a.hand],l=e.visibleCard||[];a.botState||(a.botState=g());let b=a.botState;b.turnCount++;let u=i(o),m=[];if(m.push(`Turn #${b.turnCount}. Hand: [${c(o)}], Score: ${u}.`),u<7)return m.push(`My score is ${u}, which is less than 7. I'm confident enough to declare!`),{action:"declare",decisionReasoning:m};m.push(`Score is ${u}, not low enough to declare yet. I'll keep playing to improve my hand.`);let f=p(o),h=function(e,r){let a=[];for(let e of t)for(let r of n)a.push({suit:e,rank:r});let s=[...r,...e.recentDiscards];return a.filter(e=>!s.some(r=>r.suit===e.suit&&r.rank===e.rank))}(b,o),y=Math.min(h.length,5),w=[...h].sort(()=>Math.random()-.5).slice(0,y),k=-1/0,v=null,j=0,F=!1,S=-1/0,N=null;for(let e of f){let r=o.filter(r=>!e.some(e=>e.suit===r.suit&&e.rank===r.rank));if(l.length>0)for(let a=0;a<l.length;a++){let t=l[a],n=x([...r,t]),s=u-n.remainingScore,i=n.discard.length>1&&n.discard.some(e=>e.suit===t.suit&&e.rank===t.rank);(s>k||s===k&&i&&!F)&&(k=s,v=e,j=a,i&&(F=!0))}let a=0;for(let e of w)a+=x([...r,e]).remainingScore;y>0&&(a/=y);let t=u-a;t>S&&(S=t,N=e)}let z="deck",C=0,A=null,D=N||[o[0]];if("deck"===z&&1===D.length){let e=s[D[0].rank];if(e<=2&&S<=0){let r=o[0];for(let e of o)s[e.rank]>s[r.rank]&&(r=e);s[r.rank]>e&&(m.push(`I was going to discard ${d(D[0])} (value ${e}), but that's too valuable to throw away for no benefit. I'll discard ${d(r)} (value ${s[r.rank]}) instead.`),D=[r])}}return l.length>0?F?(z="visible",C=j,D=v||D,A=l[C],m.push(`I see that picking up ${d(A)} creates a combination. I will discard [${c(D)}] from my current hand and draw it!`)):k>S&&k>0?(z="visible",C=j,D=v||D,A=l[C],m.push(`By discarding [${c(D)}] and taking the visible ${d(A)}, my expected gain is ${k.toFixed(1)}, better than my estimated deck gain of ${S.toFixed(1)}.`)):m.push(`Visible card is not helpful enough. I'll discard [${c(D)}] and draw from the hidden deck (expected gain: ${S.toFixed(1)}).`):m.push(`No visible cards available. I'll discard [${c(D)}] and draw from the hidden deck.`),"visible"===z&&b.selfPickedCards.push(A),{action:"turn",drawFrom:z,visibleIndex:"visible"===z?C:void 0,discardCards:D,decisionReasoning:m}},observeEasyBotMove:function(e,r,a){let t=e.visibleCard||[],n=a&&a.length>0?a[a.length-1]:null,s=t.length>0?t[t.length-1]:null,i=e.players[r].username;for(let o=0;o<e.players.length;o++){if(o===r)continue;let l=e.players[o];if(!l||!l.isBot||"easy"!==l.difficulty)continue;l.botState||(l.botState=g());let c=l.botState;n&&(!s||n.rank!==s.rank||n.suit!==s.suit)&&t.length<(a?.length||0)&&(c.opponentPickups.push({...n}),c.opponentPickups.length>5&&c.opponentPickups.shift(),c.pendingObservations.push(`I saw ${i} pick up the ${d(n)}.`)),s&&(c.recentDiscards.push({...s}),c.pendingObservations.push(`I noticed ${i} discarded ${d(s)}.`))}}}},81854,(e,r,a)=>{let{initializeGame:t}=e.r(93615),{processTurn:n}=e.r(7630),{declare:s}=e.r(31367),{calculateSum:i}=e.r(83322),{RANK_VALUES:o}=e.r(83221),{makeBotDecision:l,observePlayerMove:d}=e.r(55915),{makeEasyBotDecision:c,observeEasyBotMove:p}=e.r(54698);function x(e,r,a,t){let s=e.players[r].hand,i=s[0];for(let e of s)o[e.rank]>o[i.rank]&&(i=e);let l=n(e,r,"deck",void 0,[i]);if(l.error){let t=JSON.parse(JSON.stringify(e));return t.currentPlayer=function(e,r){let a=e.length;for(let t=1;t<=a;t++){let n=(r+t)%a;if(!e[n].eliminated)return n}return r}(t.players,r),{gameState:t,action:"turn",reasoning:a,botPlayerIndex:r}}return g(l.gameState,r,t),{gameState:l.gameState,action:"turn",reasoning:a,botPlayerIndex:r}}function g(e,r,a){try{d(e,r,a)}catch(e){}try{p(e,r,a)}catch(e){}}r.exports={startOfflineGame:function(e,r={}){if("ai"===e){let{playerName:e="You",easyBotCount:a=1,hardBotCount:n=0}=r,s=(a||0)+(n||0);if(s<1||s>7)throw Error("AI matches require 1–7 bots.");let i=t(s+1);i.players[0].username=e,i.players[0].isBot=!1;let o=1;for(let e=0;e<a;e++,o++)i.players[o].username=1===a?"Easy Bot":`Easy Bot ${e+1}`,i.players[o].isBot=!0,i.players[o].difficulty="easy";for(let e=0;e<n;e++,o++)i.players[o].username=1===n?"Hard Bot":`Hard Bot ${e+1}`,i.players[o].isBot=!0,i.players[o].difficulty="hard";return i.mode="ai",i}if("pass_and_play"===e){let{playerCount:e=2,playerNames:a=[]}=r,n=t(Math.max(2,Math.min(8,Number(e)||2)));return n.players.forEach((e,r)=>{e.username=a[r]||`Player ${r+1}`,e.isBot=!1}),n.mode="pass_and_play",n}throw Error(`Unknown offline mode: "${e}"`)},processOfflineAction:function(e,r){let a=JSON.parse(JSON.stringify(e));if("turn"===r.type){let{playerId:t,drawFrom:s,visibleIndex:i,discardCards:o}=r,l=n(a,t,s,i,o);return l.error?{success:!1,error:l.error,gameState:e}:{success:!0,gameState:l.gameState}}if("declare"===r.type){let{playerId:t}=r,n=s(a,t);return n.error?{success:!1,error:n.error,gameState:e}:{success:!0,gameState:n.gameState,roundSummary:n.roundSummary,newlyEliminated:n.newlyEliminated,score:n.score}}return{success:!1,error:`Unknown action type: ${r.type}`,gameState:e}},getBotMove:function(e){let r,a=JSON.parse(JSON.stringify(e)),t=a.currentPlayer,i=a.players[t];if(!i||!i.isBot)return{gameState:a,action:null,reasoning:[],botPlayerIndex:t};let o=[...a.visibleCard||[]],d=(r="easy"===i.difficulty?c(a,t):l(a,t)).decisionReasoning||[];if("declare"===r.action){let e=s(a,t);return e.error?x(a,t,d,o):(g(e.gameState,t,o),{gameState:e.gameState,action:"declare",roundSummary:e.roundSummary,newlyEliminated:e.newlyEliminated,score:e.score,reasoning:d,botPlayerIndex:t})}let{drawFrom:p,visibleIndex:b,discardCards:u}=r,m=u&&u.length>0?u:[a.players[t].hand[0]],f=n(a,t,p,b??0,m);return f.error?x(a,t,d,o):(g(f.gameState,t,o),{gameState:f.gameState,action:"turn",reasoning:d,botPlayerIndex:t})}}},10477,e=>{"use strict";e.i(50461);var r=e.i(91398),a=e.i(91788),t=e.i(3828),n=e.i(58678),s=e.i(74163);let i=`
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

  [data-theme="light"] .ls-zone-label {
    color: #0D2118;
  }

  [data-theme="light"] .ls-bot-label-name {
    color: #0D2118 !important;
  }

  [data-theme="light"] .ls-tutorial-summary-text {
    color: #225239 !important;
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
`,o=[{suit:"♠",style:{top:"8%",left:"6%",animationDelay:"0s",animationDuration:"18s",fontSize:"22px",opacity:.12}},{suit:"♥",style:{top:"15%",right:"8%",animationDelay:"3s",animationDuration:"22s",fontSize:"16px",opacity:.09,color:"#FF6B6B"}},{suit:"♦",style:{top:"55%",left:"4%",animationDelay:"6s",animationDuration:"20s",fontSize:"18px",opacity:.1,color:"#FF6B6B"}},{suit:"♣",style:{top:"70%",right:"5%",animationDelay:"1.5s",animationDuration:"25s",fontSize:"20px",opacity:.11}},{suit:"♠",style:{top:"40%",right:"3%",animationDelay:"9s",animationDuration:"16s",fontSize:"13px",opacity:.08}},{suit:"♥",style:{top:"85%",left:"10%",animationDelay:"4.5s",animationDuration:"19s",fontSize:"14px",opacity:.07,color:"#FF6B6B"}}];function l({children:e,wide:a=!1,particles:t=!0}){return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(n.default,{children:[(0,r.jsx)("title",{children:"LeastScore"}),(0,r.jsx)("link",{href:"https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap",rel:"stylesheet"})]}),(0,r.jsx)("style",{suppressHydrationWarning:!0,dangerouslySetInnerHTML:{__html:i}}),(0,r.jsx)("div",{className:"ls-container",children:(0,r.jsxs)("div",{className:`ls-frame${a?" ls-frame-wide":""}`,children:[(0,r.jsx)("div",{className:"ls-bg-mesh"}),(0,r.jsx)("div",{className:"ls-noise"}),t&&o.map((e,a)=>(0,r.jsx)("div",{className:"suit-particle",style:e.style,children:e.suit},a)),(0,r.jsx)("div",{className:"ls-scroll",children:e})]})})]})}function d({subtitle:e,badge:t}){let[n,s]=(0,a.useState)(!1);return(0,a.useEffect)(()=>{let e=setInterval(()=>s(e=>!e),3e3);return()=>clearInterval(e)},[]),(0,r.jsxs)("div",{className:"ls-logo-section",children:[(0,r.jsx)("div",{className:"ls-logo-card-wrap",onClick:()=>s(e=>!e),title:"Click to flip",children:(0,r.jsxs)("div",{className:`ls-logo-card-inner${n?" flipped":""}`,children:[(0,r.jsx)("div",{className:"ls-logo-card-face front",children:"🃏"}),(0,r.jsx)("div",{className:"ls-logo-card-face back",children:"🎴"})]})}),(0,r.jsx)("h1",{className:"ls-logo-title",children:"LeastScore"}),t&&(0,r.jsxs)("div",{className:"ls-logo-badge",children:[(0,r.jsx)("span",{children:"♠"}),t]}),e&&(0,r.jsx)("p",{className:"ls-logo-sub",children:e})]})}let c={hearts:"♥",diamonds:"♦",clubs:"♣",spades:"♠"},p=[24,31,18,42,27,15,38,22,11,5],x=[{kind:"intro",caseId:0,p:[{r:"4",s:"spades"},{r:"5",s:"diamonds"},{r:"6",s:"clubs"},{r:"9",s:"hearts"},{r:"2",s:"diamonds"},{r:"8",s:"clubs"},{r:"K",s:"spades"}],v:{r:"J",s:"diamonds"},prompt:"Your turn is one move: discard, draw. We will cover each legal discard type, then declaration scoring.",playerScore:0},{kind:"turn",caseId:1,discardType:"Single card",p:[{r:"4",s:"spades"},{r:"5",s:"diamonds"},{r:"6",s:"clubs"},{r:"9",s:"hearts"},{r:"2",s:"diamonds"},{r:"8",s:"clubs"},{r:"K",s:"spades"}],v:{r:"J",s:"diamonds"},discardGlow:[6],drawGlow:"hidden",prompt:"In this case — single card discard\n\nThe best card to discard is K♠ (red). You can always discard one card; dropping a King removes 13 points from your hand.\n\nNow choose where to draw from: J♦ on the visible pile is still a poor pick (11 points, no combo), so draw from the Hidden deck (gold).",playerScore:0},{kind:"turn",caseId:2,discardType:"Pair",p:[{r:"4",s:"spades"},{r:"5",s:"diamonds"},{r:"6",s:"clubs"},{r:"9",s:"hearts"},{r:"9",s:"clubs"},{r:"2",s:"diamonds"},{r:"8",s:"clubs"}],v:{r:"Q",s:"spades"},discardGlow:[3,4],drawGlow:"hidden",prompt:"In this case — pair (two cards, same rank)\n\nThe best cards to discard are 9♥ and 9♣ (red) — a pair clears 18 points at once.\n\nNow choose where to draw from: Q♠ does not help this hand, so take the Hidden deck (gold).",playerScore:0},{kind:"turn",caseId:3,discardType:"Sequence of 3",p:[{r:"8",s:"spades"},{r:"9",s:"diamonds"},{r:"10",s:"clubs"},{r:"4",s:"hearts"},{r:"5",s:"clubs"},{r:"2",s:"hearts"},{r:"A",s:"clubs"}],v:{r:"7",s:"hearts"},discardGlow:[0,1,2],drawGlow:"hidden",prompt:"In this case — sequence of 3\n\nThe best cards to discard are 8♠ 9♦ 10♣ (red) — three consecutive ranks; suits can differ.\n\nNow choose where to draw from: 7♥ does not fit what is left, so draw from the Hidden deck (gold).",playerScore:0},{kind:"turn",caseId:4,discardType:"Four of a kind",p:[{r:"Q",s:"hearts"},{r:"Q",s:"diamonds"},{r:"Q",s:"clubs"},{r:"Q",s:"spades"},{r:"5",s:"diamonds"},{r:"6",s:"clubs"},{r:"2",s:"hearts"}],v:{r:"4",s:"clubs"},discardGlow:[0,1,2,3],drawGlow:"visible",prompt:"In this case — four of a kind (quadruple)\n\nThe best cards to discard are all four Queens (red) — four cards of the same rank.\n\nNow choose where to draw from: 4♣ on the visible pile is low and also forms a combo of 4♣ - 5♦ - 6♣ instead of gambling for a card blindly from the hidden deck.",playerScore:0},{kind:"turn",caseId:5,discardType:"Sequence of 5",p:[{r:"5",s:"clubs"},{r:"6",s:"diamonds"},{r:"7",s:"hearts"},{r:"8",s:"spades"},{r:"9",s:"clubs"},{r:"2",s:"diamonds"},{r:"A",s:"hearts"}],v:{r:"K",s:"spades"},discardGlow:[0,1,2,3,4],drawGlow:"hidden",prompt:"In this case — sequence of 5\n\nThe best cards to discard are 5♣ 6♦ 7♥ 8♠ 9♣ (red) — five consecutive ranks (mixed suits are fine).\n\nNow choose where to draw from: K♠ is 13 points and useless here, so draw from the Hidden deck (gold).",playerScore:0},{kind:"turn",caseId:6,discardType:"Flush",p:[{r:"2",s:"diamonds"},{r:"4",s:"diamonds"},{r:"6",s:"diamonds"},{r:"7",s:"diamonds"},{r:"9",s:"diamonds"}],v:{r:"8",s:"hearts"},discardGlow:[0,1,2,3,4],drawGlow:"hidden",prompt:"In this case — flush (five cards, same suit)\n\nThe best cards to discard are all five diamonds (red) — 2♦ 4♦ 6♦ 7♦ 9♦.\n\nNow choose where to draw from: 8♥ is okay but does not form a combo and drawing from the Hidden deck could get us an even a smaller card (gold).",playerScore:0},{kind:"info",caseId:7,discardType:"Correct declaration",p:[{r:"3",s:"spades"},{r:"A",s:"clubs"}],v:{r:"5",s:"clubs"},prompt:"In this case — correct declaration\n\nYour hand score is 4 (3♠ + A♣). Opponent Bot's hand totals 11 in this case.\n\nYou declare correctly. Opponent gains 11 − 4 = 7 points toward elimination (first to 100 is out).",playerScore:7,opponentHandScore:11},{kind:"info",caseId:8,discardType:"Wrong declaration",p:[{r:"4",s:"spades"},{r:"4",s:"clubs"}],v:{r:"5",s:"clubs"},prompt:"In this case — wrong declaration\n\nYour hand score is 8 (4♠ + 4♣). Opponent Bot's hand totals 5 in this case — lower than yours.\n\nWrong declare penalty: 20 + (8 − 5) = 23 points added to your score.",playerScore:23,opponentHandScore:5},{kind:"end",caseId:9,p:[],v:null,prompt:"Tutorial summary:\n\n✔ Each case is separate — each turn = discard then draw\n✔ Single → Pair → Sequence of 3 → Four of a kind → Sequence of 5 → Flush\n✔ Pick visible cards only when they help; otherwise use the hidden deck\n✔ Wrong declare: 20 + (your hand − lowest hand)\n\nGood luck!",playerScore:0}];function g({onExit:e}){let[t,n]=(0,a.useState)(0),s=x[t],i=s.p,o=x.filter(e=>"end"!==e.kind).length,b=null!=s.opponentHandScore?s.opponentHandScore:p[s.caseId??0]??20,u=()=>n(0),m=e=>({rank:e.r,suit:e.s}),f=(e,a,{discardGlow:t=!1,drawnGlow:n=!1}={})=>{let s="ls-playing-card no-interact";t&&(s+=" selected-discard"),n&&(s+=" selected-draw");let i="hearts"===a.suit||"diamonds"===a.suit;return(0,r.jsxs)("button",{className:s,style:{color:i?"#c11":"#111"},children:[(0,r.jsx)("span",{style:{alignSelf:"flex-start",fontSize:"12px"},children:a.rank}),(0,r.jsx)("span",{style:{fontSize:"24px",lineHeight:1},children:c[a.suit]}),(0,r.jsx)("span",{style:{alignSelf:"flex-end",fontSize:"12px"},children:a.rank})]},e)},h=(0,r.jsxs)("div",{style:{marginTop:"24px",display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"12px"},children:[(0,r.jsx)("button",{className:"btn-secondary",onClick:()=>{t>0&&n(t-1)},disabled:0===t,style:{flex:1,minWidth:"100px"},children:"Back"}),(0,r.jsx)("button",{className:"btn-gold",onClick:()=>{t<x.length-1?n(t+1):e()},style:{flex:2,minWidth:"120px"},children:t===x.length-2?"Finish":"Next"}),(0,r.jsx)("button",{className:"btn-primary",onClick:u,style:{flex:1,minWidth:"100px"},children:"Restart"})]});if("end"===s.kind)return(0,r.jsxs)(l,{children:[(0,r.jsx)(d,{subtitle:"Tutorial Complete"}),(0,r.jsxs)("div",{className:"ls-card view-animate",style:{textAlign:"center"},children:[(0,r.jsx)("button",{className:"btn-back",onClick:e,style:{position:"absolute",top:"24px",left:"24px"},children:"← Exit"}),(0,r.jsxs)("div",{style:{margin:"20px 0 30px"},children:[(0,r.jsx)("h2",{className:"ls-section-title",children:"Tutorial Summary"}),(0,r.jsx)("div",{className:"ls-tutorial-summary-text",style:{textAlign:"left",fontSize:"14px",lineHeight:"1.8",color:"#A8B4C2",background:"rgba(255,255,255,0.03)",padding:"20px",borderRadius:"16px",border:"1px solid rgba(255,255,255,0.06)",whiteSpace:"pre-wrap"},children:s.prompt})]}),(0,r.jsx)("button",{className:"btn-gold",onClick:e,children:"✓ Back to Tutorial"}),t>0&&(0,r.jsx)("button",{className:"btn-secondary mt-3",onClick:u,children:"Start Over"})]})]});let y=i.reduce((e,r)=>{var a;return e+("A"===(a=r.r)?1:"J"===a?11:"Q"===a?12:"K"===a?13:parseInt(a,10)||0)},0),w="turn"===s.kind;return(0,r.jsxs)(l,{children:[(0,r.jsx)(d,{subtitle:"Observe a Game"}),(0,r.jsxs)("div",{className:"ls-card view-animate",children:[(0,r.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"},children:[(0,r.jsx)("button",{className:"btn-back",onClick:e,style:{margin:0},children:"← Exit"}),(0,r.jsxs)("span",{className:"ls-badge blue",children:["Step ",t+1," / ",o]})]}),(0,r.jsx)("p",{className:"ls-section-title",style:{fontSize:"18px"},children:s.discardType?`Scenario: ${s.discardType}`:"Introduction"}),(0,r.jsx)("div",{style:{display:"flex",gap:"12px",marginBottom:"20px"},children:[{name:"You",gameScore:s.playerScore??0,active:!0,handScore:y},{name:"Bot",gameScore:0,active:!1,handScore:b}].map(e=>(0,r.jsxs)("div",{style:{flex:1,padding:"12px",borderRadius:"16px",background:e.active?"rgba(34,197,94,0.1)":"rgba(255,255,255,0.03)",border:`1px solid ${e.active?"rgba(34,197,94,0.3)":"rgba(255,255,255,0.06)"}`,textAlign:"center"},children:[e.active&&(0,r.jsx)("div",{style:{fontSize:"10px",color:"#4ade80",fontWeight:"bold",textTransform:"uppercase",marginBottom:"4px"},children:"Active Turn"}),(0,r.jsx)("div",{style:{fontSize:"13px",fontWeight:"600",color:"#F0F4FF",marginBottom:"4px"},className:"Bot"===e.name?"ls-bot-label-name":void 0,children:e.name}),(0,r.jsx)("div",{style:{fontSize:"24px",fontWeight:"bold",color:e.active?"#4ade80":"#FFC857"},children:e.gameScore}),(0,r.jsxs)("div",{style:{fontSize:"11px",color:"#8896A7",marginTop:"4px"},children:["Hand: ",e.handScore," pts"]})]},e.name))}),(0,r.jsx)("div",{className:"ls-alert-info",style:{whiteSpace:"pre-wrap",lineHeight:"1.6"},children:s.prompt}),w&&(0,r.jsx)("p",{style:{margin:"0 0 12px 0",fontSize:"12px",color:"#8896A7",fontStyle:"italic",textAlign:"center"},children:"One turn: discard (red) → then draw (gold)"}),(0,r.jsxs)("div",{className:"ls-zone",children:[(0,r.jsx)("p",{className:"ls-zone-label",children:"Table"}),(0,r.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",gap:"12px"},children:[s.v?f("visible",m(s.v),{drawnGlow:"visible"===s.drawGlow}):(0,r.jsx)("div",{className:"ls-blank-card",style:{opacity:.5}}),(0,r.jsxs)("div",{className:`ls-deck-btn ${"hidden"===s.drawGlow?"selected-draw":""}`,children:[(0,r.jsx)("span",{style:{fontSize:"24px",lineHeight:"1.2"},children:"🂠"}),(0,r.jsx)("span",{style:{fontSize:"12px",fontWeight:"bold"},children:"Deck"})]})]})]}),(0,r.jsxs)("div",{className:"ls-zone active",children:[(0,r.jsxs)("p",{className:"ls-zone-label",children:["Your Hand (",i.length,")"]}),(0,r.jsx)("div",{style:{display:"flex",flexWrap:"wrap",justifyContent:"center"},children:i.map((e,r)=>f(`hand-${r}`,m(e),{discardGlow:s.discardGlow?.includes(r),drawnGlow:s.drawnGlow===r}))})]}),h]})]})}var b=e.i(22545);let u={hearts:"♥",diamonds:"♦",clubs:"♣",spades:"♠"};function m(e){return"hearts"===e||"diamonds"===e}function f({card:e}){return!e||e.hidden?null:(0,r.jsxs)("span",{className:`ls-minicard ${m(e.suit)?"ls-minicard-red":"ls-minicard-black"}`,style:{fontSize:"11px",padding:"2px 5px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"4px",fontWeight:600,color:m(e.suit)?"#FC8181":"#F0F4FF",display:"inline-block"},children:[e.rank,u[e.suit]||""]})}function h(){return(0,r.jsx)("span",{style:{fontSize:"11px",padding:"2px 6px",background:"rgba(255,200,87,0.15)",border:"1px solid rgba(255,200,87,0.3)",borderRadius:"4px",fontWeight:700,color:"#FFC857",display:"inline-block"},children:"🂠 Deck"})}function y({count:e}){return(0,r.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"8px",flexWrap:"wrap"},children:[(0,r.jsx)(h,{}),"number"==typeof e&&(0,r.jsxs)("span",{style:{fontSize:"10px",color:"#8896A7",fontWeight:600},children:[e," ",1===e?"card":"cards"," left"]})]})}function w({cards:e,emptyLabel:a="—"}){return e?.length?(0,r.jsx)("span",{style:{display:"inline-flex",gap:"3px",flexWrap:"wrap"},children:e.map((e,a)=>!e||e.hidden?(0,r.jsx)(h,{},`hidden-${a}`):(0,r.jsx)(f,{card:e},`${e.rank}-${e.suit}-${a}`))}):(0,r.jsx)("span",{style:{fontSize:"9px",color:"#cbd5e1",fontStyle:"italic"},children:a})}function k({card:e,fromDeck:a}){return e?e.hidden||a?(0,r.jsx)(h,{}):(0,r.jsx)(f,{card:e}):(0,r.jsx)("span",{style:{fontSize:"9px",color:"#cbd5e1",fontStyle:"italic"},children:"—"})}function v({cards:e}){return e?.length?(0,r.jsx)("span",{style:{display:"inline-flex",gap:"3px",flexWrap:"wrap",justifyContent:"center"},children:e.map((e,a)=>(0,r.jsx)(f,{card:e},`${e.rank}-${e.suit}-${a}`))}):(0,r.jsx)("span",{style:{fontSize:"9px",color:"#cbd5e1",fontStyle:"italic"},children:"—"})}let j=`
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

  /* ── Match History List ── */
  .ls-match-box {
    width: 100%;
    text-align: left;
    padding: 16px 20px;
    border-radius: 16px;
    cursor: pointer;
    transition: transform 0.15s, background 0.2s, border-color 0.2s;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .ls-match-box:hover {
    transform: translateY(-2px);
  }
  .ls-match-box.loss {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
  }
  .ls-match-box.loss:hover {
    background: rgba(255,255,255,0.05);
  }
  .ls-match-box.win {
    background: rgba(255,200,87,0.05);
    border: 1px solid rgba(255,200,87,0.3);
  }
  .ls-match-box.win:hover {
    background: rgba(255,200,87,0.1);
  }
  .ls-match-mode {
    color: #F0F4FF;
    font-size: 15px;
  }
  .ls-match-meta {
    font-size: 13px;
    color: #8896A7;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .ls-match-placement {
    color: #8896A7;
    font-weight: 400;
  }
  .ls-match-placement.win {
    color: #FFC857;
    font-weight: 700;
  }
  .ls-match-score {
    color: #A8B4C2;
  }
  .ls-match-score.win {
    color: #FFC857;
  }
  .ls-match-players-box {
    font-size: 12px;
    color: #A8B4C2;
    background: rgba(255,255,255,0.02);
    padding: 6px 10px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.04);
    margin-top: 4px;
  }
  .ls-match-players-label {
    opacity: 0.7;
  }
  .ls-match-players-list {
    color: #F0F4FF;
  }

  /* ── Match Details View ── */
  .ls-match-details-leaderboard-title, .ls-match-details-moves-title { color: #F0F4FF; }
  .ls-match-details-date-time { color: #8896A7; }
  .ls-match-details-player-name { color: #F0F4FF; margin: 0; font-size: 15px; font-weight: 600; }
  .ls-match-details-player-score-default { color: #F0F4FF; }
  .ls-match-details-player-score-gold { color: #FFC857; }
  .ls-match-details-player-score-silver { color: #cbd5e1; }
  .ls-match-details-player-score-bronze { color: #d97706; }
  .ls-match-details-player-row-default { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); }
  .ls-match-details-player-row-gold { background: rgba(255,200,87,0.1); border: 1px solid rgba(255,200,87,0.3); }
  .ls-match-details-player-row-silver { background: rgba(203,213,225,0.1); border: 1px solid rgba(203,213,225,0.3); }
  .ls-match-details-player-row-bronze { background: rgba(217,119,6,0.1); border: 1px solid rgba(217,119,6,0.3); }
  .ls-match-details-move-text-primary { color: #F0F4FF; }
  .ls-match-details-move-text-secondary { color: #A8B4C2; }
  .ls-match-details-move-text-muted { color: #8896A7; }
  .ls-match-details-move-default { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); }
  .ls-match-details-move-expanded { background: rgba(58,77,255,0.08); border: 1px solid rgba(255,255,255,0.06); }
  .ls-match-details-move-num-default { color: #A8B4C2; }
  .ls-match-details-move-num-expanded { color: #7B8FFF; }

  /* Spacing utils */
  .mt-2 { margin-top: 8px; }
  .mt-3 { margin-top: 12px; }
  .mt-4 { margin-top: 16px; }
`,F=[{suit:"♠",style:{top:"8%",left:"6%",animationDelay:"0s",animationDuration:"18s",fontSize:"22px",opacity:.12}},{suit:"♥",style:{top:"15%",right:"8%",animationDelay:"3s",animationDuration:"22s",fontSize:"16px",opacity:.09,color:"#FF6B6B"}},{suit:"♦",style:{top:"55%",left:"4%",animationDelay:"6s",animationDuration:"20s",fontSize:"18px",opacity:.1,color:"#FF6B6B"}},{suit:"♣",style:{top:"70%",right:"5%",animationDelay:"1.5s",animationDuration:"25s",fontSize:"20px",opacity:.11}},{suit:"♠",style:{top:"40%",right:"3%",animationDelay:"9s",animationDuration:"16s",fontSize:"13px",opacity:.08}},{suit:"♥",style:{top:"85%",left:"10%",animationDelay:"4.5s",animationDuration:"19s",fontSize:"14px",opacity:.07,color:"#FF6B6B"}}];function S({children:e,wide:a=!1,particles:t=!0}){return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(n.default,{children:[(0,r.jsx)("title",{children:"LeastScore"}),(0,r.jsx)("link",{href:"https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap",rel:"stylesheet"})]}),(0,r.jsx)("style",{suppressHydrationWarning:!0,dangerouslySetInnerHTML:{__html:j}}),(0,r.jsx)("div",{className:"ls-container",children:(0,r.jsxs)("div",{className:`ls-frame${a?" ls-frame-wide":""}`,children:[(0,r.jsx)("div",{className:"ls-bg-mesh"}),(0,r.jsx)("div",{className:"ls-noise"}),t&&F.map((e,a)=>(0,r.jsx)("div",{className:"suit-particle",style:e.style,children:e.suit},a)),(0,r.jsx)("div",{className:"ls-scroll",children:e})]})})]})}function N({subtitle:e,badge:t}){let[n,s]=(0,a.useState)(!1);return(0,a.useEffect)(()=>{let e=setInterval(()=>s(e=>!e),3e3);return()=>clearInterval(e)},[]),(0,r.jsxs)("div",{className:"ls-logo-section",children:[(0,r.jsx)("div",{className:"ls-logo-card-wrap",onClick:()=>s(e=>!e),title:"Click to flip",children:(0,r.jsxs)("div",{className:`ls-logo-card-inner${n?" flipped":""}`,children:[(0,r.jsx)("div",{className:"ls-logo-card-face front",children:"🃏"}),(0,r.jsx)("div",{className:"ls-logo-card-face back",children:"🎴"})]})}),(0,r.jsx)("h1",{className:"ls-logo-title",children:"LeastScore"}),t&&(0,r.jsxs)("div",{className:"ls-logo-badge",children:[(0,r.jsx)("span",{children:"♠"}),t]}),e&&(0,r.jsx)("p",{className:"ls-logo-sub",children:e})]})}let z={online:"Online Match",friends:"Play with Friends",ai:"Play with AI",play_along:"Play Along"};function C(e){return e?new Date(e).toLocaleString():"—"}function A(e,r){let a=e.find(e=>e.seatIndex===r);return a?a.username:`Player ${r+1}`}function D({move:e,participants:a}){switch(e.eventType){case"deal":return(0,r.jsx)("span",{className:"ls-match-details-move-text-primary",children:e.payload?.label||"New deal"});case"turn":{let t=A(a,e.actingPlayer),n=e.payload?.drawFrom==="deck",s=e.payload?.drawnCard,i=e.payload?.discardCards||[];return(0,r.jsxs)("span",{className:"ls-match-details-move-text-secondary",style:{display:"inline-flex",flexWrap:"wrap",alignItems:"center",gap:"6px"},children:[(0,r.jsx)("strong",{style:{color:"#FFC857"},children:t}),(0,r.jsxs)("span",{children:["drew from ",n?"deck":"visible"]}),n?(0,r.jsx)(h,{}):s?(0,r.jsx)(f,{card:s}):null,(0,r.jsx)("span",{children:"· discarded"}),i.length>0?(0,r.jsx)("span",{style:{display:"inline-flex",gap:"3px"},children:i.map((e,a)=>(0,r.jsx)(f,{card:e},a))}):(0,r.jsx)("span",{children:"—"})]})}case"declare":{let t=A(a,e.actingPlayer),n=e.payload?.declaredWon?"successful":"failed";return(0,r.jsxs)("span",{style:{color:e.payload?.declaredWon?"#4ade80":"#FC8181"},children:[(0,r.jsx)("strong",{style:{color:"#FFC857"},children:t})," declared (",n,")"]})}case"eliminate":return(0,r.jsxs)("span",{style:{color:"#FC8181"},children:[(0,r.jsx)("strong",{style:{color:"#FFC857"},children:A(a,e.actingPlayer)})," eliminated (",e.payload?.reason||"unknown",")"]});case"disconnect":return(0,r.jsxs)("span",{className:"ls-match-details-move-text-muted",children:[(0,r.jsx)("strong",{style:{color:"#FFC857"},children:A(a,e.actingPlayer)})," disconnected"]});case"poll_start":return(0,r.jsxs)("span",{className:"ls-match-details-move-text-primary",children:["Elimination vote started for ",(0,r.jsx)("strong",{style:{color:"#FFC857"},children:A(a,e.actingPlayer)})]});case"bots_only_end":return(0,r.jsx)("span",{className:"ls-match-details-move-text-muted",children:e.payload?.message||"Match ended — only bots remained"});case"game_end":{let t=e.payload?.winner;if("number"==typeof t)return(0,r.jsxs)("span",{style:{color:"#4ade80"},children:["Match ended — winner: ",(0,r.jsx)("strong",{style:{color:"#FFC857"},children:A(a,t)})]});return(0,r.jsx)("span",{className:"ls-match-details-move-text-secondary",children:"Match ended"})}default:return(0,r.jsx)("span",{className:"ls-match-details-move-text-primary",children:e.eventType})}}function I({label:e,children:a,bordered:t=!1}){return(0,r.jsxs)("div",{className:t?"ls-match-details-expanded-divider-left":"",style:{flex:1,textAlign:"center",...t?{borderLeft:"1px solid rgba(255,255,255,0.1)"}:{}},children:[(0,r.jsx)("div",{className:"ls-match-details-expanded-text",style:{fontSize:"9px",color:"#8896A7",textTransform:"uppercase",marginBottom:"4px",fontWeight:"bold"},children:e}),(0,r.jsx)("div",{style:{display:"flex",justifyContent:"center"},children:a})]})}function $({state:e}){return e?.players?(0,r.jsxs)("div",{style:{marginTop:"12px"},children:[e.players.map(a=>(0,r.jsxs)("div",{className:"ls-match-details-expanded-section ls-match-details-expanded-border",style:{marginBottom:"12px",padding:"12px",background:"rgba(255,255,255,0.03)",borderRadius:"12px",border:"1px solid rgba(255,255,255,0.06)"},children:[(0,r.jsxs)("strong",{className:"ls-match-details-expanded-player-name",style:{color:"#F0F4FF"},children:[a.username,a.isBot?" (Bot)":"",a.eliminated?" — eliminated":""]}),(0,r.jsxs)("div",{className:"ls-match-details-expanded-text",style:{fontSize:"13px",color:"#8896A7",marginTop:"4px"},children:["Score: ",(0,r.jsx)("strong",{style:{color:"#FFC857"},children:a.score}),"number"!=typeof e.currentPlayer||e.currentPlayer!==a.seatIndex||a.eliminated?"":" · Current turn",a.eliminatedReason?` \xb7 ${a.eliminatedReason}`:""]}),(0,r.jsxs)("div",{className:"ls-match-details-expanded-divider-top",style:{marginTop:"10px",paddingTop:"8px",borderTop:"1px solid rgba(255,255,255,0.08)",display:"flex",gap:"8px"},children:[(0,r.jsx)(I,{label:"Last Draw",children:(0,r.jsx)(k,{card:a.lastDrawnCard,fromDeck:"deck"===a.lastDrawnFrom})}),(0,r.jsx)(I,{label:"Last Discard",bordered:!0,children:(0,r.jsx)(v,{cards:a.lastDiscard})})]}),(0,r.jsxs)("div",{style:{marginTop:"12px"},children:[(0,r.jsx)("div",{className:"ls-match-details-expanded-text",style:{fontSize:"9px",color:"#8896A7",textTransform:"uppercase",marginBottom:"6px",fontWeight:"bold"},children:"Hand"}),(0,r.jsx)(w,{cards:a.hand,emptyLabel:"(empty)"})]})]},a.seatIndex)),(0,r.jsxs)("div",{className:"ls-match-details-expanded-section ls-match-details-expanded-border",style:{marginTop:"8px",padding:"12px",background:"rgba(255,255,255,0.03)",borderRadius:"12px",border:"1px solid rgba(255,255,255,0.06)"},children:[(0,r.jsx)("div",{className:"ls-match-details-expanded-text",style:{fontSize:"9px",color:"#8896A7",textTransform:"uppercase",marginBottom:"6px",fontWeight:"bold"},children:"Visible pile"}),(0,r.jsx)(w,{cards:e.visibleCard,emptyLabel:"—"}),(0,r.jsxs)("div",{className:"ls-match-details-expanded-divider-top",style:{marginTop:"12px",paddingTop:"10px",borderTop:"1px solid rgba(255,255,255,0.08)"},children:[(0,r.jsx)("div",{className:"ls-match-details-expanded-text",style:{fontSize:"9px",color:"#8896A7",textTransform:"uppercase",marginBottom:"6px",fontWeight:"bold"},children:"Hidden deck"}),(0,r.jsx)(y,{count:e.deckCount??0})]})]})]}):null}function B({summary:e}){return e?.players?(0,r.jsxs)("div",{className:"ls-match-details-expanded-section ls-match-details-expanded-border",style:{marginTop:"16px",padding:"12px",background:"rgba(255,200,87,0.05)",borderRadius:"12px",border:"1px solid rgba(255,200,87,0.2)"},children:[(0,r.jsx)("strong",{style:{color:"#FFC857"},children:"Round summary"}),(0,r.jsx)("div",{style:{marginTop:"10px",display:"flex",flexDirection:"column",gap:"12px"},children:e.players.map((e,a)=>(0,r.jsxs)("div",{children:[(0,r.jsxs)("div",{className:"ls-match-details-expanded-text",style:{fontSize:"13px",fontWeight:600,marginBottom:"6px",color:"#F0F4FF"},children:[e.username,Number.isFinite(e.sum)?` \xb7 hand sum ${e.sum===1/0?"—":e.sum}`:""]}),(0,r.jsx)(w,{cards:e.hand,emptyLabel:"(no hand)"})]},a))})]}):null}function P({onBack:e}){let[t,n]=(0,a.useState)([]),[s,i]=(0,a.useState)(!0),[o,l]=(0,a.useState)(""),[d,c]=(0,a.useState)(null),[p,x]=(0,a.useState)(null),[g,u]=(0,a.useState)(!1),[m,f]=(0,a.useState)(null),[h,y]=(0,a.useState)(!0),w=(0,a.useRef)(!1);if((0,a.useEffect)(()=>{let e=!1;return(async()=>{i(!0),l("");try{let r=await (0,b.apiFetch)("/api/matches"),a=await r.json();if(!r.ok)throw Error(a.error||"Failed to load matches");e||n(a.matches||[])}catch(r){e||l(r.message)}finally{e||i(!1)}})(),()=>{e=!0}},[]),(0,a.useEffect)(()=>{if(!d)return void x(null);let e=!1;return(async()=>{u(!0),l("");try{let r=await (0,b.apiFetch)(`/api/matches/${d}`),a=await r.json();if(!r.ok)throw Error(a.error||"Failed to load match");e||(x(a.match),f(null))}catch(r){e||l(r.message)}finally{e||u(!1)}})(),()=>{e=!0}},[d]),(0,a.useEffect)(()=>{let r=r=>{if(r.state&&r.state.matchHistoryDetail){w.current=!0,c(r.state.matchHistoryDetail);return}if(d){w.current=!0,c(null);return}e()};return window.addEventListener("popstate",r),d&&!w.current&&window.history.pushState({matchHistoryDetail:d},"",""),()=>window.removeEventListener("popstate",r)},[d,e]),d&&p){let e=[...p.participants].sort((e,r)=>e.placement&&r.placement?e.placement-r.placement:null!=e.finalScore&&null!=r.finalScore?e.finalScore-r.finalScore:0);return(0,r.jsxs)(S,{children:[(0,r.jsx)(N,{subtitle:"Match Details"}),(0,r.jsxs)("div",{className:"ls-card view-animate",children:[(0,r.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"},children:[(0,r.jsx)("button",{type:"button",onClick:()=>c(null),className:"btn-back",style:{margin:0},children:"← Back"}),(0,r.jsxs)("span",{className:"ls-badge blue",children:["Match #",p.id]})]}),(0,r.jsx)("h2",{className:"ls-section-title",style:{fontSize:"20px",marginBottom:"4px"},children:z[p.mode]||p.mode}),(0,r.jsxs)("p",{className:"ls-match-details-date-time",style:{fontSize:"13px",marginBottom:"24px"},children:[C(p.startedAt),p.endedAt?` → ${C(p.endedAt)}`:" (in progress)",p.endReason?` \xb7 End: ${p.endReason}`:""]}),(0,r.jsxs)("div",{style:{marginBottom:"24px"},children:[(0,r.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"},children:[(0,r.jsx)("strong",{className:"ls-match-details-leaderboard-title",style:{fontSize:"16px"},children:"Leaderboard"}),(0,r.jsx)("button",{type:"button",onClick:()=>y(!h),className:"btn-icon",children:h?"Hide":"Show"})]}),h&&(0,r.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:"8px"},children:e.map((a,t)=>{let n=e.length,s=0===t?"gold":n>3&&1===t?"silver":n>3&&2===t?"bronze":"default",i="ls-match-details-player-score-default",o="ls-match-details-player-row-default";return"gold"===s?(o="ls-match-details-player-row-gold",i="ls-match-details-player-score-gold"):"silver"===s?(o="ls-match-details-player-row-silver",i="ls-match-details-player-score-silver"):"bronze"===s&&(o="ls-match-details-player-row-bronze",i="ls-match-details-player-score-bronze"),(0,r.jsxs)("div",{className:o,style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",borderRadius:"16px"},children:[(0,r.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[(0,r.jsx)("span",{style:{fontSize:"22px",minWidth:"28px",textShadow:"0 2px 4px rgba(0,0,0,0.3)"},children:0===t?"🥇":n>3&&1===t?"🥈":n>3&&2===t?"🥉":""}),(0,r.jsxs)("div",{children:[(0,r.jsx)("p",{className:"ls-match-details-player-name",children:a.username}),(0,r.jsxs)("div",{style:{display:"flex",gap:"6px",marginTop:"3px",flexWrap:"wrap"},children:[a.isBot&&(0,r.jsx)("span",{className:"ls-badge",style:{background:"rgba(255,255,255,0.1)",color:"#A8B4C2",border:"1px solid rgba(255,255,255,0.15)"},children:"Bot"}),a.placement&&(0,r.jsxs)("span",{className:"ls-badge blue",children:["Placement: #",a.placement]})]})]})]}),(0,r.jsx)("span",{className:i,style:{fontFamily:"'Bebas Neue', sans-serif",fontSize:"26px",letterSpacing:"1px"},children:null!=a.finalScore?a.finalScore:""})]},t)})})]}),(0,r.jsxs)("strong",{className:"ls-match-details-moves-title",style:{fontSize:"16px",display:"block",marginBottom:"12px"},children:["Moves (",p.moves.length,")"]}),(0,r.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:"8px"},children:p.moves.map(e=>(0,r.jsxs)("div",{className:m===e.moveNumber?"ls-match-details-move-expanded":"ls-match-details-move-default",style:{borderRadius:"12px",overflow:"hidden",transition:"background 0.2s, border-color 0.2s"},children:[(0,r.jsx)("button",{type:"button",onClick:()=>f(m===e.moveNumber?null:e.moveNumber),style:{width:"100%",textAlign:"left",padding:"12px 16px",background:"transparent",border:"none",cursor:"pointer",fontSize:"14px",color:"#F0F4FF"},children:(0,r.jsxs)("div",{style:{display:"flex",flexWrap:"wrap",alignItems:"center",gap:"8px"},children:[(0,r.jsxs)("strong",{className:m===e.moveNumber?"ls-match-details-move-num-expanded":"ls-match-details-move-num-default",children:["#",e.moveNumber]}),(0,r.jsx)(D,{move:e,participants:p.participants})]})}),m===e.moveNumber&&e.payload?.state&&(0,r.jsxs)("div",{className:"ls-match-details-expanded-divider-top",style:{padding:"16px",borderTop:"1px solid rgba(255,255,255,0.06)"},children:[(0,r.jsx)($,{state:e.payload.state}),(0,r.jsx)(B,{summary:e.payload.roundSummary})]})]},e.moveNumber))})]})]})}return(0,r.jsxs)(S,{children:[(0,r.jsx)(N,{subtitle:"Your Past Games"}),(0,r.jsxs)("div",{className:"ls-card view-animate",children:[(0,r.jsx)("button",{type:"button",onClick:e,className:"btn-back",children:"← Main menu"}),(0,r.jsx)("h2",{className:"ls-section-title",children:"Match History"}),(0,r.jsx)("p",{className:"ls-section-desc ls-match-history-desc",children:"Review every move from your online, friends, and AI matches. Pass and Play, Play Along, and Tutorial games are not recorded."}),s&&(0,r.jsx)("div",{style:{padding:"40px 0",display:"flex",justifyContent:"center"},children:(0,r.jsx)("div",{className:"ls-spinner"})}),o&&(0,r.jsx)("div",{className:"ls-alert-error",children:o}),!s&&!o&&0===t.length&&(0,r.jsx)("div",{className:"ls-alert-info",style:{textAlign:"center",padding:"20px"},children:"No recorded matches yet. Play a match with at least one registered player to build history."}),!s&&t.length>0&&(0,r.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:t.map(e=>{let a=!1;return e.myPlacement&&(a=e.playerCount>3&&e.myPlacement<=3||e.playerCount<=3&&1===e.myPlacement),(0,r.jsxs)("button",{type:"button",onClick:()=>c(e.id),className:`ls-match-box ${a?"win":"loss"}`,children:[(0,r.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[(0,r.jsx)("strong",{className:"ls-match-mode",children:z[e.mode]||e.mode}),(0,r.jsxs)("span",{className:"ls-badge blue",children:[e.playerCount," Players"]})]}),(0,r.jsxs)("div",{className:"ls-match-meta",children:[(0,r.jsx)("span",{children:C(e.startedAt)}),e.myPlacement&&(0,r.jsxs)("span",{className:`ls-match-placement ${a?"win":""}`,children:["· Placement: #",e.myPlacement," ",a?"🏆 Win":""]}),null!=e.myScore&&(0,r.jsxs)("span",{className:`ls-match-score ${a?"win":""}`,children:["· Score: ",e.myScore]}),"bots_only"===e.endReason&&(0,r.jsx)("span",{children:"· Ended (bots only)"})]}),(0,r.jsxs)("div",{className:"ls-match-players-box",children:[(0,r.jsx)("span",{className:"ls-match-players-label",children:"Players:"})," ",(0,r.jsx)("span",{className:"ls-match-players-list",children:e.participants.map(e=>e.username).join(", ")})]})]},e.id)})}),d&&g&&(0,r.jsx)("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100},children:(0,r.jsx)("div",{className:"ls-spinner"})})]})]})}var E=e.i(83168),M=e.i(55915),T=e.i(83322);function R(e){return e&&0!==e.length?(0,T.calculateSum)(e):0}function O(e,r){let a=R(e);a<10?r():window.confirm(`Your hand sum is ${a} (not below 10). Are you sure you want to declare?

In a real match you cannot see opponents' hands. Someone may have a lower sum and you could lose the round.`)&&r()}function L(){return(0,r.jsxs)("div",{style:{margin:"12px 0 16px",padding:"12px 16px",background:"#e3f2fd",border:"1px solid #90caf9",borderRadius:"10px",color:"#0d47a1",fontSize:"14px",lineHeight:1.5,textAlign:"left"},children:[(0,r.jsx)("strong",{children:"Declaration tip:"})," ","You may declare whenever your score is less than your opponent's, but we suggest bringing your hand sum below 10 before declaring. In a real match you cannot see opponents' cards, so a higher hand sum is risky."]})}function Y({reasoning:e,onDismiss:a}){return e&&0!==e.length?(0,r.jsx)("div",{style:{marginTop:"16px",borderRadius:"12px",overflow:"hidden",border:"1px solid #5c6bc0"},children:(0,r.jsxs)("div",{style:{padding:"14px 18px",background:"linear-gradient(135deg, #1a237e, #283593)"},children:[(0,r.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"},children:[(0,r.jsx)("h4",{style:{margin:0,color:"#c5cae9",fontSize:"15px"},children:"💡 Hint — why this move?"}),a&&(0,r.jsx)("button",{type:"button",onClick:a,style:{padding:"4px 10px",fontSize:"12px",cursor:"pointer",background:"transparent",color:"#c5cae9",border:"1px solid #7986cb",borderRadius:"6px"},children:"Hide"})]}),e.map((e,a)=>(0,r.jsx)("div",{style:{padding:"3px 0",color:"#e8eaf6",fontSize:"14px",lineHeight:1.6},children:e},`hint-line-${a}`)),(0,r.jsx)("p",{style:{margin:"10px 0 0",fontSize:"12px",color:"#9fa8da"},children:"Red glow = suggested discard. Gold glow = suggested draw (hidden deck or visible card)."})]})}):null}var H=e.i(38655),G=e.i(6619),W=e.i(58030);let _={src:e.i(85239).default,width:381,height:614,blurWidth:5,blurHeight:8,blurDataURL:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAICAYAAAAx8TU7AAAAnklEQVR42hXIWwvBYACA4e8XEI0YFiJNjg0jpxXWzLYbDVPWVpJD+f93r7l4bh7xftyIowufV0gU+jzvV0Rw9hiOdRzHZKCNCHwH4dkGk4nGwVoz0ga41grh7Gac3AXf2OK4n2FvdIQx7WEu+wTulO28y0rvIIbtOoqcp90oU5Fz9NUqotOsIGXTKEUJKZNCrZf+qdCqyaiJhlJIsswPhxlCmcces5wAAAAASUVORK5CYII="};var V=e.i(36103),q=e.i(81854);let U=`
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; background: #07090F; }

  :root {
    --card-w: min(22vw, 90px);
    --card-h: calc(var(--card-w) * 1.6);
    --card-overlap: calc(var(--card-w) * -0.62);
    --card-font: calc(var(--card-w) * 0.25);
    --card-padding-x: calc(var(--card-w) * 0.08);
    --card-padding-y: calc(var(--card-w) * 0.1);
    --card-padding-bottom: calc(var(--card-w) * 0.25);
  }

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
    padding: 10px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }
  .ls-user-actions .ls-user-chip {
    padding: 10px 14px;
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
    background: linear-gradient(135deg, rgba(200,150,10,0.18), rgba(248,224,112,0.12));
    border: 1px solid rgba(255,204,65,0.4);
    border-radius: 10px;
    padding: 6px 12px;
    margin-bottom: 16px;
    color: #ffc439 !important;
    text-shadow: 0 1px 2px rgba(200,150,10,0.15) !important;
  }
  .ls-user-chip span { color: #ffc439 !important; font-size: 12px; }
  .ls-user-chip strong { color: #ffc439 !important; font-size: 13px; }

  /* ── Mode cards (image-backed 21:9) ── */
   .ls-mode-card {
     position: relative;
     display: flex;
     flex-direction: column;
     justify-content: flex-end;
     aspect-ratio: 21 / 9;
     border-radius: 20px;
     overflow: hidden;
     cursor: pointer;
     transition: transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s, border-color 0.2s;
     margin-bottom: 12px;
     width: 100%;
     text-align: left;
     font-family: 'DM Sans', sans-serif;
     border: 1px solid rgba(255,255,255,0.08);
     background: #0D1117;
     box-shadow: 0 4px 24px rgba(0,0,0,0.4);
   }
   .ls-mode-card:hover {
     transform: translateY(-4px) scale(1.01);
     box-shadow: 0 12px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.1);
     border-color: rgba(255,255,255,0.15);
   }
   .ls-mode-card:active { transform: scale(0.985); }

   .ls-mode-card-img {
     position: absolute;
     inset: 0;
     width: 100%;
     height: 100%;
     object-fit: cover;
     z-index: 0;
     transition: transform 0.4s cubic-bezier(0.4,0,0.2,1), filter 0.3s;
     filter: brightness(0.85);
   }
   .ls-mode-card:hover .ls-mode-card-img {
     transform: scale(1.05);
     filter: brightness(0.95);
   }

   /* Gradient overlay for text readability */
   .ls-mode-card-overlay {
     position: absolute;
     inset: 0;
     z-index: 1;
     background: linear-gradient(
       to top,
       rgba(7, 9, 15, 0.92) 0%,
       rgba(7, 9, 15, 0.55) 40%,
       rgba(7, 9, 15, 0.10) 70%,
       transparent 100%
     );
     pointer-events: none;
   }

   /* Text content on top of overlay */
   .ls-mode-card-content {
     position: relative;
     z-index: 2;
     padding: 16px 20px;
     display: flex;
     align-items: flex-end;
     justify-content: space-between;
     gap: 10px;
   }
   .ls-mode-label {
     font-size: 17px;
     font-weight: 700;
     color: #F0F4FF;
     margin: 0 0 3px;
     text-shadow: 0 2px 8px rgba(0,0,0,0.6);
     letter-spacing: 0.02em;
   }
   .ls-mode-desc {
     font-size: 12.5px;
     color: rgba(240,244,255,0.7);
     margin: 0;
     text-shadow: 0 1px 4px rgba(0,0,0,0.5);
     line-height: 1.4;
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
  .ls-friends-card {
    padding: 22px;
    border-radius: 24px;
  }
  .ls-friends-panel-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
  }
  .ls-friends-panel-copy {
    flex: 1;
    min-width: 0;
  }
  .ls-friends-panel-title {
    margin: 0 0 4px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 24px;
    color: #F0F4FF;
    letter-spacing: 1px;
    line-height: 1;
  }
  .ls-friends-panel-sub {
    margin: 0;
    color: #8896A7;
    font-size: 12.5px;
    line-height: 1.45;
  }
  .ls-friends-counts {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-top: 9px;
  }
  .ls-friends-dropdown-toggle {
    width: 34px;
    height: 34px;
    flex: 0 0 34px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    border: 1px solid rgba(255,200,87,0.24);
    background: rgba(255,200,87,0.08);
    color: #FFC857;
    font-size: 0;
    line-height: 0;
    cursor: pointer;
    transition: background 0.18s, border-color 0.18s, color 0.18s, transform 0.18s, box-shadow 0.18s;
  }
  .ls-friends-dropdown-toggle:hover {
    background: rgba(255,200,87,0.14);
    border-color: rgba(255,200,87,0.42);
    color: #FFD166;
    box-shadow: 0 0 16px rgba(255,200,87,0.12);
  }
  .ls-friends-dropdown-toggle:active { transform: scale(0.96); }
  .ls-friends-dropdown-toggle:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255,200,87,0.16);
  }
  .ls-friends-chevron {
    width: 18px;
    height: 18px;
    display: block;
    transform: rotate(0deg);
    transition: transform 0.2s ease;
  }
  .ls-friends-dropdown-toggle[aria-expanded="true"] .ls-friends-chevron {
    transform: rotate(180deg);
  }
  .ls-friends-notice {
    margin-bottom: 12px;
    padding: 14px;
    border-radius: 18px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.035);
  }
  .ls-friends-notice.party {
    border-color: rgba(58,77,255,0.28);
    background: rgba(58,77,255,0.07);
  }
  .ls-friends-notice.friend {
    border-color: rgba(74,222,128,0.25);
    background: rgba(74,222,128,0.06);
  }
  .ls-friends-notice-kicker {
    margin: 0 0 5px;
    color: #8896A7;
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.11em;
    text-transform: uppercase;
  }
  .ls-friends-notice-title {
    margin: 0;
    color: #F0F4FF;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.4;
  }
  .ls-friends-notice-name { color: #FFC857; }
  .ls-friends-notice-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-top: 12px;
  }
  .ls-friends-notice-more {
    margin: 10px 0 0;
    color: #8896A7;
    font-size: 12px;
    text-align: center;
  }
  .ls-global-social-overlay {
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10050;
    width: min(420px, calc(100vw - 32px));
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
  }
  .ls-global-social-overlay > * {
    pointer-events: auto;
  }
  .ls-global-social-toast {
    padding: 14px 16px;
    border-radius: 18px;
    border: 1px solid rgba(74,222,128,0.25);
    background: rgba(74,222,128,0.1);
    color: #F0F4FF;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    box-shadow: 0 16px 40px rgba(0,0,0,0.35);
    animation: viewIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .ls-friend-search-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 8px;
    margin-bottom: 14px;
  }
  .ls-friend-search-row .ls-copy-input { min-width: 0; }
  .ls-friend-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 11px 12px;
    border-radius: 16px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.05);
    margin-bottom: 8px;
    transition: background 0.2s, border-color 0.2s;
  }
  .ls-friend-row:hover {
    background: rgba(255,255,255,0.045);
    border-color: rgba(255,255,255,0.09);
  }
  .ls-friend-info {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }
  .ls-friend-avatar {
    width: 34px; height: 34px;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(58,77,255,0.28), rgba(255,200,87,0.12));
    border: 1px solid rgba(255,255,255,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #F0F4FF;
    font-size: 15px;
    font-weight: 800;
    flex-shrink: 0;
  }
  .ls-friend-copy { min-width: 0; }
  .ls-friend-name {
    margin: 0;
    font-size: 13.5px;
    font-weight: 700;
    color: #F0F4FF;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 150px;
  }
  .ls-friend-status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin: 3px 0 0;
    font-size: 11px;
    color: #8896A7;
  }
  .ls-status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #64748B;
    flex-shrink: 0;
  }
  .ls-status-dot.online {
    background: #4ade80;
    box-shadow: 0 0 9px rgba(74,222,128,0.55);
  }
  .ls-friend-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }
  .ls-empty-state {
    padding: 24px 12px;
    border: 1px dashed rgba(255,255,255,0.1);
    border-radius: 18px;
    background: rgba(0,0,0,0.12);
    text-align: center;
  }
  .ls-empty-state-title {
    margin: 0 0 5px;
    color: #F0F4FF;
    font-size: 13.5px;
    font-weight: 700;
  }
  .ls-empty-state-copy {
    margin: 0;
    color: #8896A7;
    font-size: 12.5px;
    line-height: 1.5;
  }
  .ls-party-summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
    padding: 10px 12px;
    border-radius: 16px;
    background: rgba(0,0,0,0.18);
    border: 1px solid rgba(255,255,255,0.06);
  }
  .ls-party-summary-label {
    margin: 0 0 2px;
    color: #F0F4FF;
    font-size: 13px;
    font-weight: 700;
  }
  .ls-party-summary-copy {
    margin: 0;
    color: #8896A7;
    font-size: 12px;
  }
  .ls-party-list {
    display: grid;
    gap: 8px;
  }
  .ls-friends-locked {
    text-align: center;
    padding: 22px 0 18px;
  }
  .ls-friends-locked-mark {
    width: 42px;
    height: 42px;
    margin: 0 auto 14px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,200,87,0.08);
    border: 1px solid rgba(255,200,87,0.18);
    color: #FFC857;
    font-size: 22px;
    font-weight: 800;
  }

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
    background: rgba(0,0,0,0.28);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 14px;
    padding: 4px;
    margin-bottom: 16px;
    gap: 4px;
  }
  .ls-tab {
    flex: 1;
    min-width: 0;
    padding: 9px 8px;
    border-radius: 11px;
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
    background: rgba(255,255,255,0.085);
    color: #F0F4FF;
    box-shadow: 0 1px 0 rgba(255,255,255,0.05) inset;
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

  /* ── Match Details View (for Final Leaderboard) ── */
  .ls-match-details-leaderboard-title, .ls-match-details-moves-title { color: #F0F4FF; }
  .ls-match-details-date-time { color: #8896A7; }
  .ls-match-details-player-name { color: #F0F4FF; margin: 0; font-size: 15px; font-weight: 600; }
  .ls-match-details-player-score-default { color: #F0F4FF; }
  .ls-match-details-player-score-gold { color: #FFC857; }
  .ls-match-details-player-score-silver { color: #cbd5e1; }
  .ls-match-details-player-score-bronze { color: #d97706; }
  .ls-match-details-player-row-default { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); }
  .ls-match-details-player-row-gold { background: rgba(255,200,87,0.1); border: 1px solid rgba(255,200,87,0.3); }
  .ls-match-details-player-row-silver { background: rgba(203,213,225,0.1); border: 1px solid rgba(203,213,225,0.3); }
  .ls-match-details-player-row-bronze { background: rgba(217,119,6,0.1); border: 1px solid rgba(217,119,6,0.3); }

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
    gap: 4px;
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
  .ls-draw-zone {
    container-type: inline-size;
    padding: 10px 6px;
    --card-w: calc((100cqi - 24px) / 6);
    --card-h: calc(var(--card-w) * 1.6);
    --card-overlap: calc(var(--card-w) * -0.62);
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
    gap: 4px;
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
  .ls-draw-zone {
    container-type: inline-size;
    padding: 10px 6px;
    --card-w: calc((100cqi - 24px) / 6);
    --card-h: calc(var(--card-w) * 1.6);
    --card-overlap: calc(var(--card-w) * -0.62);
    --card-font: calc(var(--card-w) * 0.25);
    --card-padding-x: calc(var(--card-w) * 0.08);
    --card-padding-y: calc(var(--card-w) * 0.1);
    --card-padding-bottom: calc(var(--card-w) * 0.25);
  }
  .ls-draw-zone .ls-playing-card,
  .ls-draw-zone .ls-deck-btn {
    margin: 2px;
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
    padding: var(--card-padding-y) var(--card-padding-x) var(--card-padding-bottom);
    width: var(--card-w);
    height: var(--card-h);
    min-width: var(--card-w);
    min-height: var(--card-h);
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.12);
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.25);
    display: inline-flex;
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
    gap: 4px;
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
  .ls-draw-zone {
    container-type: inline-size;
    padding: 10px 6px;
    --card-w: calc((100cqi - 24px) / 6);
    --card-h: calc(var(--card-w) * 1.6);
    --card-overlap: calc(var(--card-w) * -0.62);
    --card-font: calc(var(--card-w) * 0.25);
    --card-padding-x: calc(var(--card-w) * 0.08);
    --card-padding-y: calc(var(--card-w) * 0.1);
    --card-padding-bottom: calc(var(--card-w) * 0.25);
  }
  .ls-draw-zone .ls-playing-card,
  .ls-draw-zone .ls-deck-btn {
    margin: 2px;
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
    padding: var(--card-padding-y) var(--card-padding-x) var(--card-padding-bottom);
    width: var(--card-w);
    height: var(--card-h);
    min-width: var(--card-w);
    min-height: var(--card-h);
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.12);
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.25);
    display: inline-flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    font-size: var(--card-font);
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
    position: relative;
    overflow: visible;
  }
  .ls-playing-card:hover { transform: translateY(-3px); box-shadow: 0 6px 16px rgba(0,0,0,0.35); }
  .ls-playing-card.selected-discard {
    border: 2px solid #e53935;
    background: #ffebee;
    box-shadow: 0 0 14px 4px rgba(244, 67, 54, 0.85);
    transform: translateY(-12px);
  }
  .ls-playing-card.selected-draw {
    border: 2px solid #ffb300;
    background: #fffde7;
    box-shadow: 0 0 12px 4px rgba(255, 152, 0, 0.7);
    transform: translateY(-12px);
  }
  .ls-playing-card.selected-discard:hover,
  .ls-playing-card.selected-draw:hover {
    transform: translateY(-12px);
  }
  .ls-playing-card.highlight {
    border: 2px solid #ffb300;
    background: #fffde7;
    box-shadow: 0 0 12px 4px rgba(255, 152, 0, 0.7);
  }
  .ls-playing-card.no-interact { cursor: default; }
  .ls-playing-card.no-interact:hover { transform: none; box-shadow: 0 2px 8px rgba(0,0,0,0.25); }

  /* ── Deck stack wrapper ── */
  .ls-deck-stack {
    position: relative;
    width: var(--card-w);
    height: var(--card-h);
    flex-shrink: 0;
  }

  /* Stack layer behind the top card (absolute, no layout impact) */
  .ls-deck-stack-layer {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    border: 1px solid rgba(255, 200, 87, 0.4);
    overflow: hidden;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
  .ls-deck-stack-layer img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
    filter: brightness(0.7);
  }

  /* ── Deck button (top card) ── */
  .ls-deck-btn {
    cursor: pointer;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    min-width: var(--card-w);
    min-height: var(--card-h);
    border-radius: 12px;
    border: 1px solid rgba(255, 200, 87, 0.4);
    background: #ffffff;
    color: #111;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-family: 'DM Sans', sans-serif;
    transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
    overflow: hidden;
    position: relative;
    z-index: 10;
  }
  .ls-deck-card-back {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }
  .ls-deck-btn:hover { transform: translateY(-3px); }
  .ls-deck-btn.selected-draw {
    border: 2px solid #ffb300;
    background: #fffde7;
    box-shadow: 0 0 12px 4px rgba(255, 152, 0, 0.7);
    transform: translateY(-12px);
    color: #111;
  }
  .ls-deck-btn.selected-draw:hover {
    transform: translateY(-12px);
  }
  .ls-deck-btn.selected-draw span {
    color: #111 !important;
  }
  .ls-deck-btn.hint-glow {
    border: 2px solid #ffb300;
    background: #fffde7;
    box-shadow: 0 0 12px 4px rgba(255, 152, 0, 0.7);
  }
  .ls-deck-btn.selected-draw:hover {
    transform: translateY(-12px);
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
    position: relative;
    overflow: hidden;
  }
  .ls-action-btn.olute;
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
    width: var(--card-w);
    height: var(--card-h);
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

  /* Main menu responsive layout */
  .ls-main-menu-grid {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }
  .ls-main-menu-game-col,
  .ls-menu-friends-col {
    flex: 1 1 280px;
    min-width: 260px;
  }
  .ls-menu-logo-wrap {
    margin-bottom: 5px;
    position: relative;
  }

  /* ── Top toolbar — settings & logout ── */
  .ls-top-toolbar {
    display: flex;
    align-items: center;
    gap: 10px;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 20;
  }

  .ls-toolbar-btn {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    color: #A8B4C2;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: visible;
  }
  .ls-toolbar-btn.settings {
    color: #FFC857;
    border-color: rgba(255,200,87,0.15);
  }
  .ls-toolbar-btn.logout {
    color: #FC8181;
    border-color: rgba(239,68,68,0.15);
  }
  .ls-toolbar-btn svg {
    width: 18px;
    height: 18px;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s;
  }
  .ls-toolbar-btn:hover {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,200,87,0.3);
    color: #FFC857;
    box-shadow: 0 0 20px rgba(255,200,87,0.15), 0 4px 12px rgba(0,0,0,0.3);
    transform: translateY(-1px);
  }
  .ls-toolbar-btn.settings:hover {
    background: rgba(255,200,87,0.14);
    border-color: rgba(255,200,87,0.30);
    color: #FFC857;
    box-shadow: 0 0 20px rgba(255,200,87,0.15), 0 4px 12px rgba(0,0,0,0.3);
  }
  .ls-toolbar-btn:active {
    transform: scale(0.92);
  }
  .ls-toolbar-btn.settings:hover svg {
    transform: rotate(90deg);
  }
  .ls-toolbar-btn.logout {
    border-color: rgba(239,68,68,0.15);
  }
  .ls-toolbar-btn.logout:hover {
    background: rgba(239,68,68,0.1);
    border-color: rgba(239,68,68,0.35);
    color: #FC8181;
    box-shadow: 0 0 20px rgba(239,68,68,0.12), 0 4px 12px rgba(0,0,0,0.3);
  }

  /* Tooltip for toolbar buttons */
  .ls-toolbar-btn::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%) translateY(4px);
    background: rgba(13,17,23,0.95);
    color: #A8B4C2;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 6px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s, transform 0.2s;
    border: 1px solid rgba(255,255,255,0.06);
  }
  .ls-toolbar-btn:hover::after {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  /* ── User identity badge ── */
  .ls-user-identity {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-top: 12px;
    width: 100%;
  }
  .ls-user-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-top: 16px;
    width: 100%;
  }

  /* ── Friends panel collapsible (mobile only) ── */
  /* The header is always visible; only the body collapses */
  .ls-friends-panel-header {
    cursor: default;
  }
  .ls-friends-collapsible-body {
    display: none;
  }
  .ls-friends-collapsible-body.expanded {
    display: block;
    animation: viewIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  @media (min-width: 600px) {
    .ls-friends-collapsible-body {
      display: block;
    }
  }

  @media (max-width: 599px) {
    .ls-main-menu-grid {
      flex-direction: column;
      gap: 12px;
    }
    .ls-main-menu-game-col {
      display: contents;
      min-width: 0;
    }
    .ls-menu-logo-wrap {
      order: 0;
      width: 100%;
    }
    .ls-menu-friends-col {
      order: 1;
      flex: none;
      min-width: 0;
      width: 100%;
    }
    .ls-menu-game-card {
      order: 2;
      width: 100%;
      margin-top: 0;
    }

    .ls-menu-logo-wrap {
      order: 0;
      width: 100%;
      margin-bottom: 0;
    }

    .ls-friends-panel-header {
      border-radius: 12px;
      margin: -4px;
      padding: 4px;
    }
    .ls-friends-collapsible-body {
      display: none;
    }
    .ls-friends-collapsible-body.expanded {
      display: block;
      animation: viewIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .ls-friends-card {
      padding: 18px;
      border-radius: 20px;
    }
    .ls-friend-row {
      align-items: flex-start;
      flex-direction: column;
    }
    .ls-friend-actions {
      width: 100%;
      justify-content: flex-end;
    }
    .ls-friend-name {
      max-width: 220px;
    }
    .ls-party-summary {
      align-items: flex-start;
      flex-direction: column;
    }
    .ls-logo-section {
      margin: 36px 0 24px;
    }
  }

  /* Spacing utils */
  .mt-2 { margin-top: 8px; }
  .mt-3 { margin-top: 12px; }
  .mt-4 { margin-top: 16px; }
`,X=[{suit:"♠",style:{top:"8%",left:"6%",animationDelay:"0s",animationDuration:"18s",fontSize:"22px",opacity:.12}},{suit:"♥",style:{top:"15%",right:"8%",animationDelay:"3s",animationDuration:"22s",fontSize:"16px",opacity:.09,color:"#FF6B6B"}},{suit:"♦",style:{top:"55%",left:"4%",animationDelay:"6s",animationDuration:"20s",fontSize:"18px",opacity:.1,color:"#FF6B6B"}},{suit:"♣",style:{top:"70%",right:"5%",animationDelay:"1.5s",animationDuration:"25s",fontSize:"20px",opacity:.11}},{suit:"♠",style:{top:"40%",right:"3%",animationDelay:"9s",animationDuration:"16s",fontSize:"13px",opacity:.08}},{suit:"♥",style:{top:"85%",left:"10%",animationDelay:"4.5s",animationDuration:"19s",fontSize:"14px",opacity:.07,color:"#FF6B6B"}}];function J({children:e,wide:a=!1,particles:t=!0}){return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(n.default,{children:[(0,r.jsx)("title",{children:"LeastScore"}),(0,r.jsx)("link",{href:"https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap",rel:"stylesheet"})]}),(0,r.jsx)("style",{suppressHydrationWarning:!0,dangerouslySetInnerHTML:{__html:U}}),(0,r.jsx)("div",{className:"ls-container",children:(0,r.jsxs)("div",{className:`ls-frame${a?" ls-frame-wide":""}`,children:[(0,r.jsx)("div",{className:"ls-bg-mesh"}),(0,r.jsx)("div",{className:"ls-noise"}),t&&X.map((e,a)=>(0,r.jsx)("div",{className:"suit-particle",style:e.style,children:e.suit},a)),(0,r.jsx)("div",{className:"ls-scroll",children:e})]})})]})}function K({subtitle:e,badge:t}){let[n,s]=(0,a.useState)(!1);return(0,a.useEffect)(()=>{let e=setInterval(()=>s(e=>!e),3e3);return()=>clearInterval(e)},[]),(0,r.jsxs)("div",{className:"ls-logo-section",children:[(0,r.jsx)("div",{className:"ls-logo-card-wrap",onClick:()=>s(e=>!e),title:"Click to flip",children:(0,r.jsxs)("div",{className:`ls-logo-card-inner${n?" flipped":""}`,children:[(0,r.jsx)("div",{className:"ls-logo-card-face front",children:"🃏"}),(0,r.jsx)("div",{className:"ls-logo-card-face back",children:"🎴"})]})}),(0,r.jsx)("h1",{className:"ls-logo-title",children:"LeastScore"}),t&&(0,r.jsxs)("div",{className:"ls-logo-badge",children:[(0,r.jsx)("span",{children:"♠"}),t]}),e&&(0,r.jsx)("p",{className:"ls-logo-sub",children:e})]})}function Q({username:e}){return(0,r.jsxs)("div",{className:"ls-user-chip",children:[(0,r.jsx)("span",{children:"👤"}),(0,r.jsx)("strong",{children:e})]})}function Z({value:e,onChange:a,min:t=2,max:n=8,label:s}){return(0,r.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"14px"},children:[(0,r.jsx)("button",{className:"ls-stepper-btn",onClick:()=>a(Math.max(t,e-1)),disabled:e<=t,children:"−"}),(0,r.jsx)("span",{className:"ls-stepper-val",children:e}),(0,r.jsx)("button",{className:"ls-stepper-btn",onClick:()=>a(Math.min(n,e+1)),disabled:e>=n,children:"+"}),s&&(0,r.jsx)("span",{className:"ls-stepper-label",children:s})]})}function ee(){return(0,r.jsx)("svg",{className:"ls-friends-chevron",viewBox:"0 0 256 256","aria-hidden":"true",focusable:"false",children:(0,r.jsx)("path",{fill:"currentColor",d:"M128 168c-3.1 0-6.1-1.2-8.5-3.5l-64-64a12 12 0 0 1 17-17L128 139l55.5-55.5a12 12 0 0 1 17 17l-64 64A12 12 0 0 1 128 168Z"})})}e.s(["default",0,function(){var i;let o,l,d,c,p,x=(0,t.useRouter)(),[u,m]=(0,a.useState)(null),[f,h]=(0,a.useState)(""),[y,w]=(0,a.useState)(""),[k,v]=(0,a.useState)(""),[j,F]=(0,a.useState)(null),[S,N]=(0,a.useState)(""),[z,C]=(0,a.useState)(""),[A,D]=(0,a.useState)(!0),[I,$]=(0,a.useState)(!1),[B,T]=(0,a.useState)(null),[X,er]=(0,a.useState)(null),[ea,et]=(0,a.useState)([]),[en,es]=(0,a.useState)(null),[ei,eo]=(0,a.useState)(null),[el,ed]=(0,a.useState)(null),[ec,ep]=(0,a.useState)(!1),[ex,eg]=(0,a.useState)(null),[eb,eu]=(0,a.useState)(1),[em,ef]=(0,a.useState)(0),[eh,ey]=(0,a.useState)(null),[ew,ek]=(0,a.useState)(!1),ev=(0,a.useRef)(-1),[ej,eF]=(0,a.useState)(!1),eS=(0,a.useRef)(ea),eN=(0,a.useRef)(en),ez=(0,a.useRef)(ei),[eC,eA]=(0,a.useState)(null),[eD,eI]=(0,a.useState)(!1),[e$,eB]=(0,a.useState)([]),[eP,eE]=(0,a.useState)(0),[eM,eT]=(0,a.useState)(!1),[eR,eO]=(0,a.useState)(!1),[eL,eY]=(0,a.useState)(!1),[eH,eG]=(0,a.useState)(2),[eW,e_]=(0,a.useState)(1),[eV,eq]=(0,a.useState)([]),[eU,eX]=(0,a.useState)(!1),[eJ,eK]=(0,a.useState)(!1),[eQ,eZ]=(0,a.useState)(!1),[e0,e1]=(0,a.useState)(0),[e5,e2]=(0,a.useState)(0),[e8,e6]=(0,a.useState)(!1),[e4,e3]=(0,a.useState)([]),[e7,e9]=(0,a.useState)({incoming:[],outgoing:[]}),[re,rr]=(0,a.useState)(""),[ra,rt]=(0,a.useState)(""),[rn,rs]=(0,a.useState)([]),[ri,ro]=(0,a.useState)(null),[rl,rd]=(0,a.useState)(null),[rc,rp]=(0,a.useState)(null),[rx,rg]=(0,a.useState)(""),rb=(0,a.useRef)(null),[ru,rm]=(0,a.useState)(null),[rf,rh]=(0,a.useState)({}),[ry,rw]=(0,a.useState)(null),rk=(0,a.useRef)({}),[rv,rj]=(0,a.useState)({}),[rF,rS]=(0,a.useState)({}),[rN,rz]=(0,a.useState)(null),[rC,rA]=(0,a.useState)(!1),[rD,rI]=(0,a.useState)(!1),[r$,rB]=(0,a.useState)(!1),[rP,rE]=(0,a.useState)(null),[rM,rT]=(0,a.useState)(0),rR=(0,a.useRef)(null),[rO,rL]=(0,a.useState)(()=>(0,H.loadSoundSettings)()),[rY,rH]=(0,a.useState)(!1),[rG,rW]=(0,a.useState)("system"),r_=(0,a.useRef)(rO);(0,a.useEffect)(()=>{r_.current=rO},[rO]),(0,a.useEffect)(()=>{rL((0,H.loadSoundSettings)())},[]),(0,a.useEffect)(()=>{rW((0,W.loadTheme)())},[]);let rV=(0,a.useCallback)(e=>(0,H.getVolumeForCategory)(r_.current,e),[]),rq=(0,a.useCallback)((e,r)=>{let a=new Audio(e);return a.volume=rV(r),a.play().catch(()=>{}),a},[rV]),rU=(0,a.useRef)(el);(0,a.useEffect)(()=>{rU.current=el},[el]);let rX=(0,a.useRef)(X);(0,a.useEffect)(()=>{rX.current=X},[X]),(0,a.useEffect)(()=>{eS.current=ea},[ea]),(0,a.useEffect)(()=>{eN.current=en},[en]),(0,a.useEffect)(()=>{ez.current=ei},[ei]);let rJ=(0,a.useRef)(f);(0,a.useEffect)(()=>{rJ.current=f},[f]);let rK=(0,a.useRef)(!1),rQ=(0,a.useRef)(!1),rZ=(i="play_along"===el,o=(0,a.useRef)(null),l=(0,a.useRef)(null),(0,a.useEffect)(()=>{if(!i){o.current=null,l.current=null;return}if(!X||null==B)return;o.current||(o.current=(0,M.createBotState)(),(0,M.recordSeenCards)(o.current,X.visibleCard||[]),(0,M.recordSeenCards)(o.current,X.players[B]?.hand||[]));let e=l.current;e&&e.currentPlayer!==X.currentPlayer&&(0,M.observeHintState)(o.current,X,e.currentPlayer,e.visibleCard||[],B),l.current=X},[X,B,i]),o),[r0,r1]=(0,a.useState)("friends"),[r5,r2]=(0,a.useState)(!1),r8=(0,a.useRef)(null),r6=(0,a.useRef)(!1),r4=(0,a.useRef)(u);(0,a.useEffect)(()=>{r4.current=u},[u]);let r3=(0,a.useRef)(I);(0,a.useEffect)(()=>{r3.current=I},[I]);let r7=(0,a.useRef)(ec);(0,a.useEffect)(()=>{r7.current=ec},[ec]);let r9=(0,a.useRef)(rY);(0,a.useEffect)(()=>{r9.current=rY},[rY]);let ae=(0,a.useRef)(eD);(0,a.useEffect)(()=>{ae.current=eD},[eD]);let ar=(0,a.useRef)(eL);(0,a.useEffect)(()=>{ar.current=eL},[eL]);let aa=(0,a.useRef)(eU);(0,a.useEffect)(()=>{aa.current=eU},[eU]);let at=(0,a.useRef)(y);(0,a.useEffect)(()=>{at.current=y},[y]);let an=(0,a.useRef)(!1),as=(0,a.useRef)(!1),ai=(0,a.useCallback)(()=>({internal:!0,connected:I,gameMode:el,lobbyAction:eC,lobbyId:y,joinViaUrl:e8,showMatchHistory:ec,showSettingsModal:rY,inQueue:eD,inLobby:eL}),[I,el,eC,y,e8,ec,rY,eD,eL]),ao=(0,a.useCallback)(()=>{window.history.state&&window.history.state.internal?window.history.back():(eD&&r4.current&&r4.current.emit("leaveQueue"),ar.current&&r4.current&&at.current&&(aa.current&&alert("Lobby cancelled. You have been removed from the lobby."),r4.current.emit("leaveLobby",at.current)),rH(!1),$(!1),ed(null),ep(!1),eI(!1),eY(!1),eA(null),w(""),e6(!1))},[eD]);(0,a.useEffect)(()=>{if(as.current){as.current=!1;return}let e=ai(),r=window.history.state,a=!r||!r.internal||JSON.stringify(r)!==JSON.stringify(e);e.internal&&a&&(window.history.pushState(e,"",""),an.current=!0)},[ai]);let al=(0,a.useRef)(null);(0,a.useEffect)(()=>{let r=r=>{let a=r.state;if(r9.current){as.current=!0,rH(!1);return}if(rX.current&&rX.current.gameOver){as.current=!0,al.current&&al.current();return}if(rX.current){as.current=!0;try{rq("/sound/touch sound.wav","click")}catch(e){}let e="pass_and_play"===rU.current||"ai"===rU.current||"play_along"===rU.current,r=e?"Do you want to end this game?":"Are you sure you want to exit? This will count as a declaration and your opponent will win.";setTimeout(()=>{if(window.confirm(r))if(e){let e=rX.current;if(!e)return;let r=JSON.parse(JSON.stringify(e));r.gameOver=!0;let a=null!==ac.current?ac.current:r.currentPlayer;if(null!==a&&r.players[a]){r.players[a].eliminated=!0,r.players[a].eliminatedReason="exit";let e=r.players.map((e,r)=>({idx:r,score:e.score,eliminated:e.eliminated})).filter(e=>!e.eliminated);1===e.length?r.winner=e[0].idx:e.length>1?r.winner=[...e].sort((e,r)=>e.score-r.score)[0].idx:r.winner=null}ey(null),eF(!1),rI(!1),rA(!1),eo(null),er(r)}else r4.current&&null!==ac.current&&r4.current.emit("exitGame",rJ.current||f,{playerId:ac.current})},50);return}if(a&&a.internal){as.current=!0,ae.current&&r4.current&&r4.current.emit("leaveQueue"),ar.current&&r4.current&&at.current&&(aa.current&&alert("Lobby cancelled. You have been removed from the lobby."),r4.current.emit("leaveLobby",at.current));let e="tutorial_observe"===a.gameMode?"tutorial":a.gameMode;$(a.connected),ed(e),eA(a.lobbyAction),w(a.lobbyId||""),e6(a.joinViaUrl),ep(a.showMatchHistory),rH(a.showSettingsModal),eI(a.inQueue),eY(a.inLobby);return}r9.current||r3.current||null!==rU.current||r7.current?(as.current=!0,ae.current&&r4.current&&r4.current.emit("leaveQueue"),ar.current&&r4.current&&at.current&&(aa.current&&alert("Lobby cancelled. You have been removed from the lobby."),r4.current.emit("leaveLobby",at.current)),rH(!1),$(!1),ed(null),ep(!1),eI(!1),eY(!1),eA(null),w(""),e6(!1),r4.current&&r4.current.disconnect()):window.Capacitor&&window.Capacitor.isNativePlatform()&&e.A(83542).then(({App:e})=>{e.minimizeApp()}).catch(()=>{})};return window.addEventListener("popstate",r),()=>window.removeEventListener("popstate",r)},[]);let ad=(0,a.useCallback)(()=>{r1("party"),r2(!0),r6.current=!0},[]);(0,a.useEffect)(()=>{let e=!!X||"tutorial_observe"===el,r=()=>{e||(0,G.playBGM)(),document.removeEventListener("click",r),document.removeEventListener("keydown",r),document.removeEventListener("touchstart",r),document.removeEventListener("scroll",r),document.removeEventListener("touchmove",r),document.removeEventListener("wheel",r)};if(e)(0,G.stopBGM)();else{let e=(0,H.loadSoundSettings)();(0,G.setBGMVolume)((0,H.getVolumeForCategory)(e,"home")),(0,G.playBGM)(),document.addEventListener("click",r),document.addEventListener("keydown",r),document.addEventListener("touchstart",r),document.addEventListener("scroll",r),document.addEventListener("touchmove",r),document.addEventListener("wheel",r)}return()=>{document.removeEventListener("click",r),document.removeEventListener("keydown",r),document.removeEventListener("touchstart",r),document.removeEventListener("scroll",r),document.removeEventListener("touchmove",r),document.removeEventListener("wheel",r)}},[!!X,"tutorial_observe"===el]),(0,a.useEffect)(()=>{X&&void 0!==X.currentPlayer&&"pass_and_play"!==el&&rq("/sound/turn sound.mp3","game")},[X?.currentPlayer,el]),(0,a.useEffect)(()=>{x.isReady&&("tutorial"===x.query.mode&&(ed("tutorial"),x.replace("/",void 0,{shallow:!0})),"1"===x.query.expandParty&&(ad(),x.replace("/",void 0,{shallow:!0})))},[x.isReady,x.query.mode,x.query.expandParty,ad]),(0,a.useEffect)(()=>{if(!u||!k)return;let e="tutorial_observe"===el||"play_along"===el;u.emit("tutorialPresence",{username:k,inTutorial:e,mode:e?el:null})},[u,k,el]),(0,a.useEffect)(()=>{if(!r6.current||I||el||ec)return;r6.current=!1;let e=setTimeout(()=>{r8.current?.scrollIntoView({behavior:"smooth",block:"start"})},150);return()=>clearTimeout(e)},[I,el,ec,rn]);let ac=(0,a.useRef)(B);(0,a.useEffect)(()=>{ac.current=B},[B]);let ap=(0,a.useRef)(k);(0,a.useEffect)(()=>{ap.current=k},[k]);let ax=(0,a.useRef)(j);(0,a.useEffect)(()=>{ax.current=j},[j]);let ag=(0,a.useCallback)(e=>{if(!e||!e.players)return -1;let r=ac.current;if("number"==typeof r&&r>=0&&e.players[r])return r;let a=ax.current;if(a){let r=e.players.findIndex(e=>e.userId===a);if(-1!==r)return r}let t=ap.current;return t?e.players.findIndex(e=>e.username===t):-1},[]),ab=(0,a.useCallback)(()=>{et([]),eo(null),es(null)},[]),au=(0,a.useCallback)((e,r)=>{let a=ag(e),t=rX.current,n=t?.currentPlayer,s=e?.currentPlayer;if(r&&"object"==typeof r&&r.roundSummary||-1!==a&&n===a&&s!==a)return void ab();if("visible"===eN.current&&(eo(null),es(null)),-1!==a&&e?.players?.[a]?.hand){let r=e.players[a].hand;et(e=>e.filter(e=>r.some(r=>r.suit===e.suit&&r.rank===e.rank)))}},[ab,ag]);(0,a.useEffect)(()=>{if(X&&null!==B){let e=X.players[B];e&&e.eliminated&&!rQ.current?(rQ.current=!0,rq("/sound/round lost.mp3","game")):e&&!e.eliminated&&(rQ.current=!1)}},[X,B]),(0,a.useEffect)(()=>{let e=e=>{let r="pass_and_play"!==el&&null!==B&&X&&X.players[B]&&X.players[B].eliminated,a=X&&!X.gameOver&&!r;if(e.target.closest("button, .ls-link-text, .link-text, .ls-logo-card-wrap, .logo-card-wrap, .ls-mode-card, .ls-checkbox-row, .ls-tab")){if(!a)return void rq("/sound/touch%20sound.wav","click");(e.target.closest(".ls-toolbar-btn.settings")||e.target.closest(".ls-overlay"))&&rq("/sound/touch%20sound.wav","click")}};return document.addEventListener("click",e),()=>document.removeEventListener("click",e)},[X,B,el]),(0,a.useEffect)(()=>{if(X){let e=X.roundHistory?X.roundHistory.length:0,r="play_along"===el||X.isPlayAlong;e!==ev.current&&(r?ek(!0):ek(!1),ev.current=e)}},[X?.roundHistory,el,X?.isPlayAlong]),(0,a.useEffect)(()=>{(0,b.apiFetch)("/api/auth/me").then(e=>e.json()).then(e=>{e.user?e.user.mustResetPassword?x.replace("/reset-password"):(v(e.user.displayName||e.user.nickname||e.user.first_name||""),F(e.user.userId||e.user.id||null),C(e.user.type||""),D(!1)):x.replace("/login")}).catch(()=>{v("Player"),C("offline"),D(!1)})},[]);let am=async()=>{if("registered"===z)try{let[e,r]=await Promise.all([(0,b.apiFetch)("/api/friends/list"),(0,b.apiFetch)("/api/friends/requests")]);if(e.ok){let r=await e.json();e3(r.friends||[])}if(r.ok){let e=await r.json();e9(e.requests||{incoming:[],outgoing:[]})}}catch(e){console.error("Unable to refresh friend data",e)}};(0,a.useEffect)(()=>{A||"registered"!==z||am()},[A,z]);let af=(0,a.useCallback)(e=>{e&&(rg(e),rb.current&&clearTimeout(rb.current),rb.current=setTimeout(()=>rg(""),5e3))},[]);(0,a.useEffect)(()=>()=>{rb.current&&clearTimeout(rb.current)},[]),(0,a.useEffect)(()=>{eG(e=>Math.max(e,rn.length||1))},[rn]),(0,a.useEffect)(()=>{if(!eQ)return;let e=Math.max(0,eH-eW),r=Math.max(0,Math.min(e0,e)),a=e-r;if(r!==e0){e1(r),e2(a);return}e5!==a&&e2(a)},[eQ,eH,eW,e0,e5]);let ah=async()=>{if(re.trim()){if("guest"===z){window.confirm("Friend features are available only for registered users. Click OK to upgrade now.")&&(u&&u.emit("guestUpgradeIntent"),(0,b.apiFetch)("/api/auth/guest/upgrade-intent",{method:"POST"}).catch(()=>null).finally(()=>x.push("/login?upgradeGuest=1")));return}try{let e=await (0,b.apiFetch)("/api/friends/request",{method:"POST",body:JSON.stringify({email:re.trim()})}),r=await e.json();if(!e.ok)throw Error(r.error||"Unable to send request");rr(""),am(),af(r.message)}catch(e){af(e.message||"Unable to send request")}}},ay=async(e,r)=>{try{let a=await (0,b.apiFetch)("/api/friends/respond",{method:"POST",body:JSON.stringify({requestId:e,action:r})}),t=await a.json();if(!a.ok)throw Error(t.error||"Unable to respond to request");e9(r=>({incoming:r.incoming.filter(r=>r.requestId!==e),outgoing:r.outgoing})),"accept"===r?af(t.message):rt(t.message),am()}catch(e){rt(e.message||"Unable to respond to request")}},aw=async e=>{if(window.confirm("Are you sure you want to remove this friend?"))try{let r=await (0,b.apiFetch)("/api/friends/unfriend",{method:"POST",body:JSON.stringify({friendId:e})}),a=await r.json();r.ok?(rt(a.message),setTimeout(()=>rt(""),3e3),am()):alert(a.error||"Unable to unfriend")}catch(e){alert("Network error while unfriending")}},ak=e7.incoming[0]||null,av=e4.filter(e=>e.online).length,aj=rn.length,aF=Math.max(1,aj),aS=(e,r)=>{rn.length>1?alert(`You can only solo queue in ${e} mode. Please leave your party first.`):r()},aN=()=>{rl&&rl!==j?alert("Only the party leader can start a 'Play with Friends' lobby for the entire party."):ed("friends")},az=async()=>{if(window.confirm("Are you sure you want to log out?"))try{(await (0,b.apiFetch)("/api/auth/logout",{method:"POST"})).ok&&((0,V.clearToken)(),u&&u.disconnect(),x.replace("/login"))}catch(e){console.error("Logout failed",e)}};(0,a.useEffect)(()=>{let e=Math.max(2,rn.length);eH<e&&eG(e)},[rn.length,eH]),(0,a.useEffect)(()=>{if(A||!k||"offline"===z)return;let e=(0,s.default)("https://13.51.162.232.nip.io",{auth:{token:S,username:k},withCredentials:!0,transports:["polling","websocket"],extraHeaders:{"ngrok-skip-browser-warning":"true"}});m(e);{let e=new URLSearchParams(window.location.search),r=e.get("room");r&&(w(r),ed("friends"),e6(!0)),"1"===e.get("setupParty")&&(ed("friends"),eA("create"),window.history.replaceState({},"",window.location.pathname))}return e.on("joined",e=>{$(!0),T(e),eI(!1),eY(!0)}),e.on("botReasoning",e=>{ey(e&&(e.observation||e.decision)?e:null)}),e.on("friendStatusUpdate",({userId:e,online:r})=>{e3(a=>a.map(a=>a.userId===e?{...a,online:r}:a))}),e.on("friendDataChanged",()=>{am()}),e.on("partyInviteReceived",e=>rp(e)),e.on("partyUpdate",({creatorUserId:e,creator:r,members:a})=>{rd(e||null),ro(r||null),rs(a||[]),e&&rp(null)}),e.on("partyInviteRevoked",()=>rp(null)),e.on("partyMemberJoined",({username:e})=>{af(`${e} joined your party`)}),e.on("returnHome",({expandParty:e}={})=>{ep(!1),ed(null),er(null),eg(null),eA(null),$(!1),eI(!1),eT(!1),eY(!1),h(""),w(""),e6(!1),T(null),et([]),es(null),eo(null),e_(1),eG(2),eq([]),eX(!1),eK(!1),eZ(!1),e1(0),e2(0),rw(null),ey(null),eO(!1),eB([]),eE(0),!1!==e&&ad()}),e.on("queueLeft",()=>{eI(!1),eT(!1)}),e.on("friendRequestAccepted",({username:e})=>{af(`Friend request accepted by ${e}`)}),e.on("info",e=>{af(e)}),e.on("gameStart",(e,r,a)=>{if(rK.current=!1,$(!0),er(e),T(r),ey(null),eg(null),"pass_and_play"===rU.current&&(T(e.currentPlayer),rA(!0)),a&&h(a),eO(!1),eY(!1),e6(!1),eA(null),eq([]),eK(!1),eX(!1),rm(null),e_(e.players.length),Object.keys(rk.current).length>0){for(let e of Object.keys(rk.current))clearInterval(rk.current[e]);rk.current={}}let t={},n={},s=Date.now();e&&e.players&&e.players.forEach((e,a)=>{if(a!==r&&e.disconnectExpiresAt&&e.disconnectExpiresAt>s){let r=Math.ceil((e.disconnectExpiresAt-s)/1e3);t[a]=r,n[a]={disconnectedPlayerIndex:a,isGuestDisconnect:!1}}}),Object.keys(t).forEach(e=>{let r=Number(e);rk.current[r]=setInterval(()=>{rS(e=>{let a=e[r];if(null==a||a<=1){clearInterval(rk.current[r]),delete rk.current[r];let{[r]:a,...t}=e;return t}return{...e,[r]:a-1}})},1e3)}),rS(t),rh(n),rw(null),rz(null),rR.current&&(clearInterval(rR.current),rR.current=null),rE(null),et([]),eo(null),es(null)}),e.on("gameUpdate",(e,r)=>{if("friends"!==rU.current||!rK.current){if(au(e,r),er(e),"pass_and_play"===rU.current&&(e.gameOver||e.currentPlayer===ac.current?T(e.currentPlayer):rI(!0)),void 0!==r){if(r&&"object"==typeof r&&r.roundSummary){rB(!0),rE(r.roundSummary),rT(10);let a=ac.current;if(e.roundHistory&&e.roundHistory.length>0&&null!==a){let r=e.roundHistory[e.roundHistory.length-1].scores[a],t=e.players[a]?.eliminated;null===r||t||(r>0?rq("/sound/round lost.mp3","game"):rq("/sound/round won.mp3","game"))}rR.current&&clearInterval(rR.current),rR.current=setInterval(()=>{rT(e=>e<=1?(clearInterval(rR.current),rR.current=null,rE(null),0):e-1)},1e3)}else if(r&&"object"==typeof r&&void 0!==r.declaredPlayerIndex){let a=e.players[r.declaredPlayerIndex],t=a?a.username:`Player ${r.declaredPlayerIndex+1}`,n=!!r.declaredWon;alert(`${t} declared and ${n?"won":"lost"}.`)}}eg(null)}}),e.on("gameEnded",(e,r)=>{if("friends"===rU.current&&rK.current)return;let a=ag(e);if("friends"===rU.current&&-1!==a&&e.players[a]?.eliminated&&(rK.current=!0),$(!0),er(e),rm(r),T(r=>{if(null!==r||!k)return r;let a=e.players.findIndex(e=>e.username===k);return -1!==a?a:r}),et([]),eo(null),Object.keys(rk.current).length>0){for(let e of Object.keys(rk.current))clearInterval(rk.current[e]);rk.current={}}rh({}),rj({}),rS({}),rz(null)}),e.on("guestDisconnected",(e,r)=>{if(rq("/sound/disconnected.mp3","game"),er(e),rm(r),et([]),eo(null),Object.keys(rk.current).length>0){for(let e of Object.keys(rk.current))clearInterval(rk.current[e]);rk.current={}}rh({}),setTimeout(()=>{alert("Your opponent (guest player) has been disconnected for too long and their temporary account has been deleted. You are declared the winner as they were unable to reconnect. Guest accounts are temporary and expire if inactive for 60 seconds.")},100)}),e.on("playerDisconnected",(e,r,a)=>{rq("/sound/disconnected.mp3","game");let t=a?Math.max(0,Math.ceil((a-Date.now())/1e3)):60;rS(r=>({...r,[e]:t})),rh(a=>({...a,[e]:{disconnectedPlayerIndex:e,isGuestDisconnect:!0===r}}));let n=rk.current;n[e]&&clearInterval(n[e]),n[e]=setInterval(()=>{rS(r=>{let a=r[e];if(null==a)return clearInterval(n[e]),delete n[e],r;if(a<=1){clearInterval(n[e]),delete n[e];let{[e]:a,...t}=r;return t}return{...r,[e]:a-1}})},1e3)}),e.on("startEliminationPoll",(e,r)=>{let a=rk.current;a[r]&&(clearInterval(a[r]),delete a[r]),rS(e=>{let{[r]:a,...t}=e;return t}),rh(e=>({...e,[r]:{disconnectedPlayerIndex:r}})),rj(a=>({...a,[r]:{targetIndex:r,counts:{eliminate:0,wait:0,total:0,phase:"waiting"},myVote:"wait",gameState:e}}))}),e.on("eliminationVoteUpdate",(e,r,a)=>{rj(t=>t[r]?{...t,[r]:{...t[r],counts:{...t[r].counts,...a},gameState:e}}:t)}),e.on("eliminationPollCancelled",e=>{let r=rk.current;r[e]&&(clearInterval(r[e]),delete r[e]),rS(r=>{let{[e]:a,...t}=r;return t}),rh(r=>{let{[e]:a,...t}=r;return t}),rj(r=>{let{[e]:a,...t}=r;return t}),setTimeout(()=>{alert(`Player ${e+1} reconnected — poll cancelled.`)},100)}),e.on("opponentReconnected",(e,r)=>{if(rq("/sound/disconnected.mp3","game"),"number"==typeof r){let e=rk.current;e[r]&&(clearInterval(e[r]),delete e[r]),rh(e=>{let{[r]:a,...t}=e;return t}),rS(e=>{let{[r]:a,...t}=e;return t}),rj(e=>{let{[r]:a,...t}=e;return t})}else{for(let e of Object.keys(rk.current))clearInterval(rk.current[e]);rk.current={},rh({}),rS({}),rj({})}setTimeout(()=>{alert("guest"===e?"Your opponent (guest player) has reconnected.":"Your opponent (registered player) has reconnected.")},100)}),e.on("opponentReconnectedAndExited",e=>{for(let e of(rq("/sound/disconnected.mp3","game"),Object.keys(rk.current)))clearInterval(rk.current[e]);rk.current={},rh({}),rS({}),rj({}),setTimeout(()=>{alert("guest"===e?"Your opponent (guest player) reconnected, then chose to exit the game. You win this match.":"Your opponent (registered player) reconnected, then chose to exit the game. You win this match.")},100)}),e.on("activeMatchFound",({roomId:e,opponentUsername:r})=>{rw({roomId:e,opponentUsername:r||"Opponent"})}),e.on("lastMatchExited",()=>{rw(null),alert("You exited your previous active match. Showing final leaderboard.")}),e.on("error",e=>{alert(e),eI(!1)}),e.on("playerEliminated",(e,r,a)=>{let t=ag(e);"friends"===rU.current&&-1!==t&&t===r&&(rK.current=!0),er(e),a&&"exit"===a.reason&&rm(r),et([]),eo(null),rj(e=>{if(!e[r])return e;let{[r]:a,...t}=e;return t}),rh(e=>{if(!e[r])return e;let{[r]:a,...t}=e;return t}),rS(e=>{if(!e[r])return e;let{[r]:a,...t}=e;return t});let n=e.players[r],s=n?n.username:`Player ${r+1}`;if(-1!==t&&t===r)setTimeout(()=>alert("You have been eliminated. Redirecting to leaderboard."),50);else{rq("/sound/someone else eliminated.mp3","game");let e=a&&"exit"===a.reason?"exited and is therefore eliminated":"has been eliminated";setTimeout(()=>alert(`${s} ${e}.`),50)}}),e.on("roomFull",()=>alert("Room is full")),e.on("queueJoined",()=>{eI(!0),eT(!1)}),e.on("onlineLobbyUpdate",(e,r)=>{eB(e),eE(r)}),e.on("lobbyCreated",(e,r,a,t)=>{w(e),eO(!0),eY(!0),$(!0),e_(r||1),eG(a||2),eq(t||[]),eX(!0),eK(!1),eZ(!1),e1(0),e2(0)}),e.on("partyLobbyJoined",({roomId:e,currentPlayers:r,targetPlayers:a,playerUsernames:t})=>{ed("friends"),eA("create"),w(e),$(!0),eY(!0),eO(!1),e_(r||1),eG(a||2),eq(t||[]),eX(!1),eK(r===a),eZ(!1),e1(0),e2(0)}),e.on("lobbyUpdate",(e,r,a)=>{eY(!0),e_(e||1),eG(r||2),eq(a||[]),eK(!1)}),e.on("lobbyReady",(e,r,a)=>{e_(e||1),eG(r||2),eq(a||[]),eK(!0)}),e.on("playerLeftMultiplayer",e=>{rq("/sound/disconnected.mp3","game"),setTimeout(()=>{alert(`Player ${e+1} disconnected from the multiplayer game.`)},100)}),e.on("lobbyCancelled",()=>{alert("The lobby was cancelled by the creator."),$(!1),ed(null),eA(null),w(""),eO(!1),eY(!1),eq([]),eX(!1),eK(!1)}),e.on("disconnect",()=>{if($(!1),eI(!1),eO(!1),eY(!1),eq([]),eX(!1),eK(!1),Object.keys(rk.current).length>0){for(let e of Object.keys(rk.current))clearInterval(rk.current[e]);rk.current={}}rh({}),rS({}),rj({}),rz(null)}),e.on("reconnectRejected",({message:e,finalState:r,playerIndex:a})=>{rz({message:e||"Your opponents chose to eliminate you while you were disconnected."}),rw(null),rj({}),rS({}),rh({}),"friends"===rU.current&&r&&(rK.current=!0),$(!0),r&&er(r),"number"==typeof a&&T(a)}),()=>{if(Object.keys(rk.current).length>0){for(let e of Object.keys(rk.current))clearInterval(rk.current[e]);rk.current={}}rR.current&&clearInterval(rR.current),e.close()}},[A,S,af,ad,au,ag]);let aC=()=>(u&&u.emit("guestUpgradeIntent"),(0,b.apiFetch)("/api/auth/guest/upgrade-intent",{method:"POST"}).catch(()=>null)),aA=()=>{if("guest"===z){window.confirm("Online mode is available only for registered users.\n\nClick OK to register now, or Cancel to go back.")&&aC().finally(()=>x.push("/login?upgradeGuest=1"));return}ed("online")},aD=(e=!1)=>{if(u&&y){let r={allowPartialStart:e};if(eQ){let e=Math.max(0,eH-eW),a=Number(e0)||0,t=Number(e5)||0;if(a<0||t<0||a+t!==e)return void alert(`Please set Easy + Hard bots to exactly ${e}.`);r.includeBots=!0,r.easyBotCount=a,r.hardBotCount=t}u.emit("startLobbyGame",y,r)}},aI=()=>{u&&f&&u.emit("leaveRoom",f),er(null),ed(null),eg(null),eA(null),$(!1),eY(!1),h(""),w(""),T(null),et([]),es(null),eo(null),e_(1),eG(2),eq([]),eX(!1),eK(!1),eZ(!1),e1(0),e2(0),rw(null),ey(null)};(0,a.useEffect)(()=>{al.current=aI});let a$=e=>{let r=e.players[e.currentPlayer];r&&r.isBot&&!e.gameOver&&(eF(!0),setTimeout(()=>{try{let r=(0,q.getBotMove)(e);eF(!1),r.reasoning&&r.reasoning.length>0&&ey({decision:r.reasoning}),"declare"===r.action?(er(r.gameState),ab(),r.roundSummary&&(rE(r.roundSummary),rB(!0),rT(10),rR.current&&clearInterval(rR.current),rR.current=setInterval(()=>{rT(e=>e<=1?(clearInterval(rR.current),rR.current=null,rE(null),0):e-1)},1e3))):(er(r.gameState),ab()),r.gameState.gameOver||setTimeout(()=>a$(r.gameState),800)}catch(e){console.error("Bot move error:",e),eF(!1)}},900))},aB=()=>{if(X&&null!==B){if(eg(null),"ai"===el||"pass_and_play"===el||"play_along"===el&&X&&!X.roomId){let e=(0,q.processOfflineAction)(X,{type:"declare",playerId:B});return e.success?(ab(),er(e.gameState),e.roundSummary&&(rE(e.roundSummary),rB(!0),rT(10),rR.current&&clearInterval(rR.current),rR.current=setInterval(()=>{rT(e=>e<=1?(clearInterval(rR.current),rR.current=null,rE(null),0):e-1)},1e3)),void("pass_and_play"!==el||e.gameState.gameOver?"ai"!==el&&("play_along"!==el||X.roomId)||e.gameState.gameOver||setTimeout(()=>a$(e.gameState),600):T(e.gameState.currentPlayer))):void alert(e.error||"Cannot declare yet.")}u&&u.emit("declare",f,{playerId:B})}},aP=(e,r)=>{if(!u||!f)return;let a=rv[e];if(!a)return;let t=a.myVote;(!t||t===r||window.confirm("Do you really want to change your decision?"))&&(u.emit("castEliminationVote",f,e,r),rj(a=>a[e]?{...a,[e]:{...a[e],myVote:r}}:a))};(0,a.useEffect)(()=>{if(null!==rP||!("ai"===el||"play_along"===el&&X&&!X.roomId)||!X||X.gameOver)return;let e=X.players[X.currentPlayer];if(e&&e.isBot){let e=setTimeout(()=>a$(X),400);return()=>clearTimeout(e)}},[rP]);let aE=e=>{if("u">typeof navigator&&navigator.clipboard)navigator.clipboard.writeText(e).then(()=>alert("Link copied to clipboard!")).catch(()=>{let r=document.createElement("textarea");r.value=e,document.body.appendChild(r),r.select(),document.execCommand("copy"),document.body.removeChild(r),alert("Link copied to clipboard!")});else{let r=document.createElement("textarea");r.value=e,document.body.appendChild(r),r.select(),document.execCommand("copy"),document.body.removeChild(r),alert("Link copied to clipboard!")}},aM={hearts:"♥",diamonds:"♦",clubs:"♣",spades:"♠"},aT=(e,a,t,n=!1,s=!1,i=null,o={})=>{let l="hearts"===a.suit||"diamonds"===a.suit,d=("play_along"===el||X&&X.isPlayAlong)&&ex&&i,c="ls-playing-card";"discard"===n||!0===n?c+=" selected-discard":"draw"===n?c+=" selected-draw":s&&(c+=" highlight"),t||(c+=" no-interact");let p={color:l?"#c11":"#111",...o};if(d){let e=function({discardGlow:e=!1,drawnGlow:r=!1,selected:a=!1,highlight:t=!1}={}){let n,s,i;"discard"===a||!0===a||e?(i="2px solid #e53935",s="#ffebee",n="0 0 14px 4px rgba(244, 67, 54, 0.85)"):("draw"===a||r||t)&&(i="2px solid #ffb300",s="#fffde7",n="0 0 12px 4px rgba(255, 152, 0, 0.7)");let o={};return i&&(o.border=i),s&&(o.background=s),n&&(o.boxShadow=n),o}({discardGlow:i.discardGlow,drawnGlow:i.drawnGlow,selected:n,highlight:s});p={...p,...e}}return(0,r.jsxs)("button",{onClick:t||(()=>{}),className:c,style:p,children:[(0,r.jsxs)("div",{style:{alignSelf:"flex-start",display:"flex",flexDirection:"column",alignItems:"center",lineHeight:.9},children:[(0,r.jsx)("span",{style:{fontSize:"calc(var(--card-w) * 0.25)",fontWeight:900},children:a.rank}),(0,r.jsx)("span",{style:{fontSize:"calc(var(--card-w) * 0.2)"},children:aM[a.suit]})]}),(0,r.jsx)("span",{style:{fontSize:"calc(var(--card-w) * 0.55)",lineHeight:1},children:aM[a.suit]}),(0,r.jsxs)("div",{style:{alignSelf:"flex-end",display:"flex",flexDirection:"column",alignItems:"center",lineHeight:.9,transform:"rotate(180deg)"},children:[(0,r.jsx)("span",{style:{fontSize:"calc(var(--card-w) * 0.25)",fontWeight:900},children:a.rank}),(0,r.jsx)("span",{style:{fontSize:"calc(var(--card-w) * 0.2)"},children:aM[a.suit]})]})]},e)},aR="registered"!==z||X&&!X.gameOver?null:(0,r.jsx)(E.default,{incomingInvite:rc,incomingFriendRequest:ak,pendingFriendRequestCount:e7.incoming.length,socialToast:rx,onAcceptParty:()=>{u&&rc&&u.emit("acceptPartyInvite",rc.creatorUserId)},onRejectParty:()=>rp(null),onAcceptFriend:()=>{ak&&ay(ak.requestId,"accept")},onDeclineFriend:()=>{ak&&ay(ak.requestId,"reject")}}),aO=e=>(0,r.jsxs)(r.Fragment,{children:[e,aR]});if(A)return aO((0,r.jsx)(J,{children:(0,r.jsx)("div",{style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center"},children:(0,r.jsx)("div",{className:"ls-spinner"})})}));if(!I&&ry)return aO((0,r.jsxs)(J,{children:[(0,r.jsx)(K,{subtitle:"You have an unfinished match"}),(0,r.jsxs)("div",{className:"ls-card view-animate",children:[(0,r.jsxs)("div",{style:{textAlign:"center",marginBottom:"24px"},children:[(0,r.jsx)("div",{style:{fontSize:"44px",marginBottom:"14px",filter:"drop-shadow(0 0 16px rgba(255,200,87,0.3))"},children:"⚔️"}),(0,r.jsx)("p",{className:"ls-section-title",style:{textAlign:"center",fontSize:"26px"},children:"Resume Match"}),(0,r.jsxs)("p",{style:{color:"#8896A7",fontSize:"14px",margin:"8px 0 0",lineHeight:1.6},children:["Active match against ",(0,r.jsx)("strong",{style:{color:"#FFC857"},children:ry.opponentUsername})]})]}),(0,r.jsx)("button",{className:"btn-green",onClick:()=>{u&&ry?.roomId&&u.emit("resumeLastMatch",ry.roomId)},style:{marginBottom:"10px"},children:"▶ Continue Match"}),(0,r.jsx)("button",{className:"btn-danger",onClick:()=>{u&&ry?.roomId&&window.confirm("Exit your last active match? Your opponent will be declared the winner.")&&u.emit("exitLastMatch",ry.roomId)},children:"✕ Exit & Forfeit"})]})]}));if(!I&&ec)return aO((0,r.jsx)(P,{onBack:ao}));if(!I&&!el){let e=[{label:"Online Match",desc:"Play against others worldwide",img:"/images/menu/online-match.png",action:()=>aS("Online Match",aA),guestBlocked:!0,requiresOnline:!0},{label:"Play with Friends",desc:"Create or join a private lobby",img:"/images/menu/play-with-friends.png",action:aN,descClass:"ls-mode-desc--green",requiresOnline:!0},{label:"Pass and Play",desc:"Local multiplayer on one device",img:"/images/menu/pass-and-play.png",action:()=>aS("Pass and Play",()=>ed("pass_and_play")),descClass:"ls-mode-desc--green"},{label:"Play with AI",desc:"Practice vs smart bots",img:"/images/menu/play-with-ai.png",action:()=>aS("Play with AI",()=>ed("ai"))},{label:"Tutorial",desc:"Learn how to play",img:"/images/menu/tutorial.png",action:()=>ed("tutorial")}],a="offline"===z?e.filter(e=>!e.requiresOnline):e;return aO((0,r.jsxs)(J,{wide:!0,children:[(0,r.jsx)(n.default,{children:(0,r.jsx)("title",{children:"LeastScore — Home"})}),(0,r.jsxs)("div",{className:"ls-main-menu-grid",children:[(0,r.jsxs)("div",{className:"ls-main-menu-game-col",children:[(0,r.jsxs)("div",{className:"ls-menu-logo-wrap",children:[(0,r.jsxs)("div",{className:"ls-top-toolbar",children:[(0,r.jsx)("button",{className:"ls-toolbar-btn settings",onClick:()=>x.push("/settings"),"data-tooltip":"Settings","aria-label":"Settings",children:(0,r.jsxs)("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,r.jsx)("circle",{cx:"12",cy:"12",r:"3"}),(0,r.jsx)("path",{d:"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"})]})}),"offline"!==z&&(0,r.jsx)("button",{className:"ls-toolbar-btn logout",onClick:az,"data-tooltip":"Logout","aria-label":"Logout",children:(0,r.jsxs)("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,r.jsx)("path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"}),(0,r.jsx)("polyline",{points:"16 17 21 12 16 7"}),(0,r.jsx)("line",{x1:"21",y1:"12",x2:"9",y2:"12"})]})})]}),(0,r.jsx)(K,{badge:"The card game where less is more"}),(0,r.jsxs)("div",{className:"ls-user-identity",children:[(0,r.jsxs)("div",{className:"ls-user-chip",style:{margin:0},children:[(0,r.jsx)("span",{children:"👤"}),(0,r.jsx)("strong",{children:k})]}),"offline"===z&&(0,r.jsxs)("div",{className:"ls-alert-info",style:{marginTop:"10px",marginBottom:0,fontSize:"12px",padding:"8px 12px",display:"flex",alignItems:"center",gap:"6px"},children:[(0,r.jsx)("span",{children:"📵"})," Offline mode — online features unavailable"]})]})]}),(0,r.jsxs)("div",{className:"ls-card ls-menu-game-card",children:[(0,r.jsx)("div",{className:"ls-section-header",style:{marginBottom:"16px"},children:(0,r.jsx)("h3",{children:"Game Modes"})}),a.map((e,a)=>(0,r.jsxs)("button",{className:"ls-mode-card",onClick:e.action,style:{animationDelay:`${.07*a}s`},children:[(0,r.jsx)("img",{src:e.img,alt:e.label,className:"ls-mode-card-img",loading:"lazy"}),(0,r.jsx)("div",{className:"ls-mode-card-overlay"}),(0,r.jsxs)("div",{className:"ls-mode-card-content",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("p",{className:"ls-mode-label",children:e.label}),(0,r.jsx)("p",{className:`ls-mode-desc ${e.descClass||""}`,children:e.desc})]}),e.guestBlocked&&"guest"===z&&(0,r.jsx)("span",{className:"ls-badge",style:{flexShrink:0},children:"Register"})]})]},a)),"registered"===z&&(0,r.jsxs)("button",{className:"ls-mode-card",onClick:()=>ep(!0),style:{aspectRatio:"auto",minHeight:"64px"},children:[(0,r.jsx)("div",{className:"ls-mode-card-overlay",style:{background:"linear-gradient(135deg, rgba(100,116,139,0.15), rgba(13,17,23,0.95))"}}),(0,r.jsx)("div",{className:"ls-mode-card-content",children:(0,r.jsxs)("div",{children:[(0,r.jsx)("p",{className:"ls-mode-label",children:"📊 Match History"}),(0,r.jsx)("p",{className:"ls-mode-desc",children:"Review your past games"})]})})]})]})]}),"registered"===z&&(0,r.jsxs)("div",{className:"ls-menu-friends-col",ref:r8,children:[ra&&(0,r.jsx)("div",{className:"ls-alert-success",style:{marginBottom:"12px"},children:ra}),(0,r.jsxs)("div",{className:"ls-card ls-friends-card",children:[(0,r.jsxs)("div",{className:"ls-friends-panel-header",children:[(0,r.jsxs)("div",{className:"ls-friends-panel-copy",children:[(0,r.jsx)("p",{className:"ls-friends-panel-title",children:"Friends & Party"}),(0,r.jsx)("p",{className:"ls-friends-panel-sub",children:"Invite online friends and create a Party"}),(0,r.jsxs)("div",{className:"ls-friends-counts",children:[(0,r.jsxs)("span",{className:"ls-badge green",children:[av," Online"]}),(0,r.jsxs)("span",{className:"ls-badge",children:[aj," Party"]})]})]}),(0,r.jsxs)("button",{type:"button",className:"ls-friends-dropdown-toggle",onClick:()=>r2(e=>!e),"aria-expanded":r5,"aria-label":r5?"Collapse friends and party menu":"Expand friends and party menu",children:[r5?"▲":"▼",(0,r.jsx)(ee,{})]})]}),(0,r.jsxs)("div",{className:`ls-friends-collapsible-body${r5?" expanded":""}`,children:[(0,r.jsx)("div",{className:"ls-tabs",children:[{key:"friends",label:"Friends"},{key:"party",label:"Party"}].map(e=>(0,r.jsx)("button",{className:`ls-tab${r0===e.key?" active":""}`,onClick:()=>r1(e.key),children:e.label},e.key))}),"friends"===r0&&(0,r.jsxs)("div",{className:"view-animate",children:[(0,r.jsxs)("div",{className:"ls-friend-search-row",children:[(0,r.jsx)("input",{className:"ls-copy-input",placeholder:"Enter Email ID",value:re,onChange:e=>rr(e.target.value),onKeyDown:e=>"Enter"===e.key&&ah()}),(0,r.jsx)("button",{className:"btn-icon success",onClick:ah,children:"Add"})]}),0===e4.length&&(0,r.jsxs)("div",{className:"ls-empty-state",children:[(0,r.jsx)("p",{className:"ls-empty-state-title",children:"No friends yet"}),(0,r.jsx)("p",{className:"ls-empty-state-copy",children:"Send a request using their Email ID."})]}),e4.map(e=>(0,r.jsxs)("div",{className:"ls-friend-row",children:[(0,r.jsxs)("div",{className:"ls-friend-info",children:[(0,r.jsx)("div",{className:"ls-friend-avatar",children:e.username[0].toUpperCase()}),(0,r.jsxs)("div",{className:"ls-friend-copy",children:[(0,r.jsx)("p",{className:"ls-friend-name",children:e.username}),(0,r.jsx)("p",{className:"ls-friend-status",style:{color:"#8896A7",fontSize:"12px"},children:e.email}),(0,r.jsxs)("p",{className:"ls-friend-status",style:{color:e.online?"#4ade80":"#8896A7"},children:[(0,r.jsx)("span",{className:`ls-status-dot${e.online?" online":""}`}),e.online?"Online":"Offline"]})]})]}),(0,r.jsxs)("div",{className:"ls-friend-actions",children:[e.online&&(rn.some(r=>r.userId===e.userId)?(0,r.jsx)("span",{className:"ls-badge green",children:"In Party"}):(0,r.jsx)("button",{className:"btn-icon",onClick:()=>{u&&u.emit("sendPartyInvite",e.userId)},children:"+ Party"})),(0,r.jsx)("button",{className:"btn-icon danger",onClick:()=>aw(e.userId),children:"✕"})]})]},e.userId))]}),"party"===r0&&(0,r.jsxs)("div",{className:"view-animate",children:[(0,r.jsxs)("div",{className:"ls-party-summary",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("p",{className:"ls-party-summary-label",children:"Party Lobby"}),(0,r.jsxs)("p",{className:"ls-party-summary-copy ls-lobby-note",children:["Lobby needs at least ",aF," slots."]}),(0,r.jsx)("p",{className:"ls-party-summary-copy",style:{color:"#FFC857"},children:"Note: You can only queue in 'Play with Friends' in a party"})]}),ri&&rn.length>1&&(0,r.jsx)("button",{className:"btn-icon danger",onClick:()=>{u&&u.emit("leaveParty")},children:"Leave"})]}),0===rn.length&&(0,r.jsxs)("div",{className:"ls-empty-state",children:[(0,r.jsx)("p",{className:"ls-empty-state-title",children:"No party yet"}),(0,r.jsx)("p",{className:"ls-empty-state-copy",children:"Invite an online friend from your friends list."})]}),(0,r.jsx)("div",{className:"ls-party-list",children:rn.map(e=>(0,r.jsxs)("div",{className:"ls-player-row",children:[(0,r.jsxs)("div",{className:"ls-player-meta",children:[rl===e.userId&&(0,r.jsx)("span",{className:"ls-badge",children:"Leader"}),(0,r.jsx)("span",{className:"ls-player-name",children:e.username}),e.userId===j&&(0,r.jsx)("span",{style:{color:"#8896A7",fontSize:"12px"},children:"(You)"})]}),rl===j&&e.userId!==j&&(0,r.jsx)("button",{className:"btn-icon danger",onClick:()=>{var r;return r=e.userId,void(u&&u.emit("kickPartyMember",r))},children:"Kick"})]},e.userId||e.username))}),rn.length>1&&(0,r.jsx)("button",{className:"btn-gold",style:{marginBottom:"12px"},onClick:aN,children:"🏠 Create a Lobby"})]})]})]})]}),"offline"!==z&&"registered"!==z&&(0,r.jsx)("div",{className:"ls-menu-friends-col",children:(0,r.jsxs)("div",{className:"ls-card ls-friends-card",children:[(0,r.jsxs)("div",{className:"ls-friends-panel-header",children:[(0,r.jsxs)("div",{className:"ls-friends-panel-copy",children:[(0,r.jsx)("p",{className:"ls-friends-panel-title",children:"Friends & Party"}),(0,r.jsx)("p",{className:"ls-friends-panel-sub",children:"Register to invite friends, build a party, and track online status."}),(0,r.jsx)("div",{className:"ls-friends-counts",children:(0,r.jsxs)("span",{className:"ls-badge",children:[av," Online"]})})]}),(0,r.jsxs)("button",{type:"button",className:"ls-friends-dropdown-toggle",onClick:()=>r2(e=>!e),"aria-expanded":r5,"aria-label":r5?"Collapse friends and party menu":"Expand friends and party menu",children:[r5?"▲":"▼",(0,r.jsx)(ee,{})]})]}),(0,r.jsx)("div",{className:`ls-friends-collapsible-body${r5?" expanded":""}`,children:(0,r.jsxs)("div",{className:"ls-friends-locked",style:{paddingTop:"8px"},children:[(0,r.jsx)("div",{className:"ls-friends-locked-mark",children:"!"}),(0,r.jsx)("p",{className:"ls-section-title",style:{textAlign:"center"},children:"Register to Unlock"}),(0,r.jsx)("p",{style:{color:"#8896A7",fontSize:"13px",marginTop:"6px",lineHeight:1.6},children:"Create an account to add friends, form a party, and play together."}),(0,r.jsx)("button",{className:"btn-primary mt-4",onClick:()=>aC().finally(()=>x.push("/login?upgradeGuest=1")),children:"Register Now"})]})})]})})]})]}))}if(!I&&"tutorial_observe"===el)return aO((0,r.jsx)(g,{onExit:()=>ed("tutorial")}));if(!I&&"tutorial"===el)return aO((0,r.jsxs)(J,{children:[(0,r.jsx)(K,{subtitle:"Learn how to play"}),(0,r.jsxs)("div",{className:"ls-card view-animate",children:[(0,r.jsx)("button",{className:"btn-back",onClick:ao,children:"← Back"}),(0,r.jsx)("p",{className:"ls-section-title",children:"Tutorial"}),(0,r.jsx)("p",{className:"ls-section-desc ls-friends-panel-note",children:"Pick how you'd like to learn the game."}),(0,r.jsx)("button",{className:"btn-secondary",style:{marginBottom:"10px"},onClick:()=>{u&&k&&u.emit("tutorialPresence",{username:k,inTutorial:!0,mode:"rules"}),x.push("/rules")},children:"📜 Read the Rules"}),(0,r.jsx)("button",{className:"btn-secondary",style:{marginBottom:"10px"},onClick:()=>{ed("tutorial_observe")},children:"👁 Observe a Game"}),(0,r.jsxs)("div",{className:"ls-divider",children:[(0,r.jsx)("span",{className:"line ls-friends-panel-note"}),(0,r.jsx)("span",{className:"text ls-friends-panel-note",children:"OR"}),(0,r.jsx)("span",{className:"line ls-friends-panel-note"})]}),(0,r.jsx)("button",{className:"btn-gold",onClick:()=>{if("offline"===z)try{let e=(0,q.startOfflineGame)("ai",{playerName:k,easyBotCount:1,hardBotCount:0});e.isPlayAlong=!0,er(e),T(0),ed("play_along"),$(!0),ey(null),eg(null),eF(!1),e.players[e.currentPlayer]?.isBot&&a$(e)}catch(e){alert(e.message||"Failed to start offline Play Along game.")}else u?u&&(u.emit("createAIGame",{username:k,targetPlayers:2,difficulty:"both",easyBotCount:1,hardBotCount:0,mode:"play_along"}),ed("play_along"),$(!0),eg(null)):alert("Please wait — connecting to the server.")},children:"🎮 Play Along with Hints"})]})]}));if(!I&&"online"===el){let e=Math.floor(e$.length/2)+1;return aO((0,r.jsxs)(J,{children:[(0,r.jsx)(K,{subtitle:"Matchmaking"}),(0,r.jsxs)("div",{className:"ls-card view-animate",children:[(0,r.jsx)("button",{className:"btn-back",onClick:()=>{eD&&u&&u.emit("leaveQueue"),ao()},children:"← Back"}),(0,r.jsxs)("div",{className:"ls-section-header",children:[(0,r.jsx)("p",{className:"ls-section-title",children:"Online Lobby"}),(0,r.jsx)(Q,{username:k})]}),eD?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)("div",{className:"ls-alert-info",style:{display:"flex",alignItems:"center",gap:"10px"},children:[(0,r.jsx)("span",{className:"ls-queue-dot"}),(0,r.jsx)("span",{children:"Searching for players…"})]}),(0,r.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"12px"},children:[(0,r.jsx)("p",{style:{margin:0,fontSize:"12px",color:"#8896A7",textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600},children:"Players in Lobby"}),(0,r.jsxs)("span",{className:"ls-badge",children:[e$.length," / 8"]})]}),(0,r.jsx)("div",{className:"ls-progress-wrap",children:(0,r.jsx)("div",{className:"ls-progress-bar",style:{width:`${e$.length/8*100}%`}})}),e$.map((e,a)=>(0,r.jsxs)("div",{className:"ls-player-row",children:[(0,r.jsx)("span",{className:"ls-player-name",children:e}),e===k&&(0,r.jsx)("span",{className:"ls-badge",children:"You"})]},a)),e$.length>1&&(0,r.jsxs)("div",{style:{marginTop:"16px",padding:"18px 20px",background:"rgba(58,77,255,0.06)",borderRadius:"20px",border:"1px solid rgba(58,77,255,0.15)",backdropFilter:"blur(8px)"},children:[(0,r.jsx)("p",{className:"ls-lobby-note ls-lobby-start-early",style:{margin:"0 0 4px",fontSize:"13px",fontWeight:600},children:"Start Early?"}),(0,r.jsxs)("p",{style:{margin:"0 0 12px",fontSize:"12px",color:"#8896A7"},children:["Voted to start early: ",eP," ",(0,r.jsx)("br",{}),"Votes required to start: ",e]}),eM?(0,r.jsx)("button",{className:"btn-danger",style:{padding:"10px"},onClick:()=>{eT(!1),u.emit("voteStartOnlineLobby",!1)},children:"Change to Wait"}):(0,r.jsx)("button",{className:"btn-green",style:{padding:"10px"},onClick:()=>{eT(!0),u.emit("voteStartOnlineLobby",!0)},children:"Vote to Start Now"})]})]}):(0,r.jsx)("button",{className:"btn-gold",onClick:()=>{u&&u.emit("joinQueue")},children:"Join Queue ♠"})]})]}))}if(!I&&"ai"===el&&!X)return aO((0,r.jsxs)(J,{children:[(0,r.jsx)(K,{subtitle:"Configure your match"}),(0,r.jsxs)("div",{className:"ls-card view-animate",children:[(0,r.jsx)("button",{className:"btn-back",onClick:ao,children:"← Back"}),(0,r.jsx)("p",{className:"ls-section-title",children:"Play with AI"}),(0,r.jsx)("p",{className:"ls-section-desc ls-friends-panel-note",children:"Bot cards are visible for training. Bot explains its reasoning after each turn."}),(0,r.jsxs)("div",{className:"ls-divider",children:[(0,r.jsx)("span",{className:"line ls-friends-panel-note"}),(0,r.jsx)("span",{className:"text ls-friends-panel-note",children:"Bot Mix"}),(0,r.jsx)("span",{className:"line ls-friends-panel-note"})]}),(0,r.jsxs)("div",{className:"ls-bot-row",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("p",{className:"ls-bot-label",children:"🟢 Easy Bots"}),(0,r.jsx)("p",{className:"ls-bot-sub ls-friends-panel-note",children:"Makes mistakes, simpler strategy"})]}),(0,r.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[(0,r.jsx)("button",{className:"ls-stepper-btn",onClick:()=>eu(Math.max(0,eb-1)),disabled:eb<=0||1===eb&&0===em,children:"−"}),(0,r.jsx)("span",{className:"ls-stepper-val",style:{fontSize:"22px"},children:eb}),(0,r.jsx)("button",{className:"ls-stepper-btn",onClick:()=>eu(eb+1),disabled:eb+em>=7,children:"+"})]})]}),(0,r.jsxs)("div",{className:"ls-bot-row",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("p",{className:"ls-bot-label",children:"🔴 Hard Bots"}),(0,r.jsx)("p",{className:"ls-bot-sub ls-friends-panel-note",children:"Optimal play, full reasoning"})]}),(0,r.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[(0,r.jsx)("button",{className:"ls-stepper-btn",onClick:()=>ef(Math.max(0,em-1)),disabled:em<=0||1===em&&0===eb,children:"−"}),(0,r.jsx)("span",{className:"ls-stepper-val",style:{fontSize:"22px"},children:em}),(0,r.jsx)("button",{className:"ls-stepper-btn",onClick:()=>ef(em+1),disabled:eb+em>=7,children:"+"})]})]}),(0,r.jsx)("button",{className:"btn-gold mt-4",onClick:()=>{let e=Number(eb)||0,r=Number(em)||0,a=e+r;if(a<1||a>7)return void alert("AI matches support between 1 and 7 bots (max 8 total players).");try{let a=(0,q.startOfflineGame)("ai",{playerName:k,easyBotCount:e,hardBotCount:r});er(a),T(0),ed("ai"),$(!0),ey(null),eg(null),eF(!1),a.players[a.currentPlayer]?.isBot&&a$(a)}catch(e){alert(e.message||"Failed to start offline AI game.")}},disabled:eb+em===0,children:"🤖 Start vs Bots"}),(0,r.jsx)("div",{className:"ls-footer-links",children:(0,r.jsx)("span",{className:"ls-link-text",onClick:()=>ed("tutorial"),children:"New to the game? Try the tutorial →"})})]})]}));if(!I&&"pass_and_play"===el&&!X)return aO((0,r.jsxs)(J,{children:[(0,r.jsx)(K,{subtitle:"Local multiplayer"}),(0,r.jsxs)("div",{className:"ls-card view-animate",children:[(0,r.jsx)("button",{className:"btn-back",onClick:ao,children:"← Back"}),(0,r.jsx)("p",{className:"ls-section-title",children:"Pass and Play"}),(0,r.jsx)("p",{className:"ls-section-desc ls-friends-panel-note",children:"Share the device — each player takes turns on the same screen."}),(0,r.jsxs)("div",{className:"ls-input-group",children:[(0,r.jsx)("label",{children:"Number of Players"}),(0,r.jsx)("div",{style:{marginTop:"8px"},children:(0,r.jsx)(Z,{value:eH,onChange:eG,min:2,max:8,label:(0,r.jsx)("span",{className:"ls-friends-panel-note",children:`player${eH>1?"s":""}`})})})]}),(0,r.jsxs)("div",{className:"ls-divider",children:[(0,r.jsx)("span",{className:"line ls-friends-panel-note"}),(0,r.jsx)("span",{className:"text ls-friends-panel-note",children:"Ready?"}),(0,r.jsx)("span",{className:"line ls-friends-panel-note"})]}),(0,r.jsx)("button",{className:"btn-gold",onClick:()=>(e=>{try{let r=(0,q.startOfflineGame)("pass_and_play",{playerCount:e});er(r),T(r.currentPlayer),ed("pass_and_play"),$(!0),rA(!0),ey(null),eF(!1)}catch(e){alert(e.message||"Failed to start offline game.")}})(eH),children:"🎮 Start Game"})]})]}));if(!I&&"friends"===el&&e8)return aO((0,r.jsxs)(J,{children:[(0,r.jsx)(K,{subtitle:"You've been invited!"}),(0,r.jsxs)("div",{className:"ls-card view-animate",children:[(0,r.jsxs)("div",{style:{textAlign:"center",marginBottom:"24px"},children:[(0,r.jsx)("div",{style:{fontSize:"44px",marginBottom:"12px",filter:"drop-shadow(0 0 12px rgba(255,200,87,0.25))"},children:"🎟️"}),(0,r.jsx)("p",{className:"ls-section-title",style:{textAlign:"center",fontSize:"26px"},children:"Lobby Invite"}),(0,r.jsx)("p",{style:{color:"#8896A7",fontSize:"14px",margin:"8px 0 0",lineHeight:1.6},children:"You were invited to join a private lobby."})]}),(0,r.jsx)(Q,{username:k}),(0,r.jsx)("button",{className:"btn-gold",style:{marginBottom:"10px"},onClick:()=>{e6(!1),eA("join")},children:"🔗 Join Lobby"}),(0,r.jsx)("button",{className:"btn-secondary",onClick:()=>{e6(!1),w(""),ao()},children:"← Back to Menu"})]})]}));if(!I&&"friends"===el&&!eC)return aO((0,r.jsxs)(J,{children:[(0,r.jsx)(K,{subtitle:"Private matches"}),(0,r.jsxs)("div",{className:"ls-card view-animate",children:[(0,r.jsx)("button",{className:"btn-back",onClick:ao,children:"← Back"}),(0,r.jsx)("p",{className:"ls-section-title",children:"Play with Friends"}),(0,r.jsx)("p",{className:"ls-section-desc ls-friends-panel-note",children:"Create a private lobby and share the link, or join an existing one."}),(0,r.jsx)(Q,{username:k}),(0,r.jsx)("button",{className:"btn-gold",style:{marginBottom:"10px"},onClick:()=>eA("create"),children:"🏠 Create Lobby"}),(0,r.jsxs)("div",{className:"ls-divider",children:[(0,r.jsx)("span",{className:"line ls-friends-panel-note"}),(0,r.jsx)("span",{className:"text ls-friends-panel-note",children:"OR"}),(0,r.jsx)("span",{className:"line ls-friends-panel-note"})]}),(0,r.jsx)("button",{className:"btn-secondary",onClick:()=>{rn.length>1?alert("Your party cannot join a lobby. Create a lobby to play with your party."):eA("join")},children:"🔗 Join with Code"})]})]}));if(!I&&"friends"===el&&"create"===eC)return aO((0,r.jsxs)(J,{children:[(0,r.jsx)(K,{subtitle:"Set up your game"}),(0,r.jsxs)("div",{className:"ls-card view-animate",children:[(0,r.jsx)("button",{className:"btn-back",onClick:ao,children:"← Back"}),(0,r.jsx)("p",{className:"ls-section-title",children:"Create Lobby"}),(0,r.jsx)("p",{className:"ls-section-desc ls-lobby-note",children:"Choose how many slots to open, then share the link with your friends."}),(0,r.jsx)(Q,{username:k}),(0,r.jsxs)("div",{className:"ls-input-group",children:[(0,r.jsx)("label",{children:"Player Slots"}),(0,r.jsx)("div",{style:{marginTop:"8px"},children:(0,r.jsx)(Z,{value:eH,onChange:eG,min:Math.max(2,rn.length),max:8,label:(0,r.jsx)("span",{className:"ls-lobby-note",children:`slot${1!==eH?"s":""}`})})})]}),rn.length>0&&(0,r.jsxs)("div",{className:"ls-alert-info",children:[(0,r.jsx)("strong",{children:"Party invite:"})," ",rn.map(e=>e.username).join(", ")," will be auto-invited."]}),(0,r.jsx)("button",{className:"btn-gold mt-3",onClick:()=>{if(u&&k){let e=Math.max(eH,rn.length||1);e!==eH&&eG(e);let r={targetPlayers:e};rn.length>0&&(r.partyMemberIds=rn.map(e=>e.userId).filter(e=>e&&e!==j)),u.emit("createLobby",r)}},children:"🏠 Create Lobby"})]})]}));if(!I&&"friends"===el&&"join"===eC)return aO((0,r.jsxs)(J,{children:[(0,r.jsx)(K,{subtitle:"Enter lobby code"}),(0,r.jsxs)("div",{className:"ls-card view-animate",children:[(0,r.jsx)("button",{className:"btn-back",onClick:ao,children:"← Back"}),(0,r.jsx)("p",{className:"ls-section-title",children:"Join Lobby"}),(0,r.jsx)("p",{className:"ls-section-desc ls-lobby-note",children:"Paste the lobby code your friend shared with you."}),(0,r.jsx)(Q,{username:k}),(0,r.jsxs)("div",{className:"ls-input-group",children:[(0,r.jsx)("label",{children:"Lobby Code"}),(0,r.jsx)("input",{placeholder:"Paste lobby code here…",value:y,onChange:e=>w(e.target.value)})]}),(0,r.jsx)("button",{className:"btn-gold mt-3",onClick:()=>{u&&y&&(eX(!1),u.emit("joinLobby",y))},disabled:!y,children:"🔗 Join Lobby"})]})]}));if(I&&eL&&!X){let e=`${window.location.origin}?room=${y}`,a=Math.round(eW/eH*100),t=Math.max(0,eH-eW);return aO((0,r.jsxs)(J,{children:[(0,r.jsx)(K,{subtitle:"Waiting for players"}),(0,r.jsxs)("div",{className:"ls-card view-animate",children:[(0,r.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"6px"},children:[(0,r.jsx)("p",{className:"ls-section-title",children:"Lobby"}),eU&&(0,r.jsx)("span",{className:"ls-badge",children:"Host"})]}),(0,r.jsxs)("p",{style:{margin:"0 0 2px",fontSize:"13px",color:"#8896A7"},children:[eW," of ",eH," players joined"]}),(0,r.jsx)("div",{className:"ls-progress-wrap",children:(0,r.jsx)("div",{className:"ls-progress-bar",style:{width:`${a}%`}})}),eV.map((e,a)=>(0,r.jsxs)("div",{className:"ls-player-row",children:[(0,r.jsxs)("div",{className:"ls-player-meta",children:[0===a&&(0,r.jsx)("span",{className:"ls-badge",children:"Host"}),(0,r.jsx)("span",{className:"ls-player-name",children:e})]}),e===k&&(0,r.jsx)("span",{style:{color:"#8896A7",fontSize:"12px"},children:"You"})]},`${e}-${a}`)),!eJ&&(0,r.jsx)("p",{style:{color:"#8896A7",fontSize:"13px",textAlign:"center",padding:"12px 0 4px"},children:t>0?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("span",{className:"ls-queue-dot",style:{marginRight:"6px"}}),"Waiting for ",t," more player",1!==t?"s":"","…"]}):"All players joined!"}),eU&&eW>=2&&!eJ&&(0,r.jsxs)("div",{style:{marginTop:"16px"},children:[(0,r.jsxs)("div",{className:"ls-checkbox-row",onClick:()=>{let e=!eQ;eZ(e),e?(e1(0),e2(t)):(e1(0),e2(0))},children:[(0,r.jsx)("div",{className:`ls-checkbox${eQ?" checked":""}`,children:eQ&&(0,r.jsx)("span",{style:{color:"white",fontSize:"12px"},children:"✓"})}),(0,r.jsxs)("div",{children:[(0,r.jsx)("p",{className:"ls-checkbox-text",children:"Fill remaining slots with bots"}),(0,r.jsxs)("p",{className:"ls-checkbox-sub ls-lobby-note",children:[t," slot",1!==t?"s":""," vacant"]})]})]}),eQ&&(0,r.jsxs)("div",{style:{marginBottom:"12px"},children:[(0,r.jsxs)("div",{className:"ls-bot-row",style:{marginBottom:"8px"},children:[(0,r.jsx)("div",{children:(0,r.jsx)("p",{className:"ls-bot-label",children:"🟢 Easy"})}),(0,r.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[(0,r.jsx)("button",{className:"ls-stepper-btn",style:{width:"28px",height:"28px",fontSize:"14px"},onClick:()=>{let e=Math.max(0,e0-1);e1(e),e2(t-e)},children:"−"}),(0,r.jsx)("span",{className:"ls-stepper-val",style:{fontSize:"18px"},children:e0}),(0,r.jsx)("button",{className:"ls-stepper-btn",style:{width:"28px",height:"28px",fontSize:"14px"},onClick:()=>{let e=Math.min(t,e0+1);e1(e),e2(t-e)},children:"+"})]})]}),(0,r.jsxs)("div",{className:"ls-bot-row",children:[(0,r.jsx)("div",{children:(0,r.jsx)("p",{className:"ls-bot-label",children:"🔴 Hard"})}),(0,r.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[(0,r.jsx)("button",{className:"ls-stepper-btn",style:{width:"28px",height:"28px",fontSize:"14px"},onClick:()=>{let e=Math.max(0,e5-1);e2(e),e1(t-e)},children:"−"}),(0,r.jsx)("span",{className:"ls-stepper-val",style:{fontSize:"18px"},children:e5}),(0,r.jsx)("button",{className:"ls-stepper-btn",style:{width:"28px",height:"28px",fontSize:"14px"},onClick:()=>{let e=Math.min(t,e5+1);e2(e),e1(t-e)},children:"+"})]})]})]}),(0,r.jsx)("button",{className:"btn-green friends-start",onClick:()=>aD(!eQ),children:eQ?`▶ Start with ${eW}P + ${t} Bot${1!==t?"s":""}`:`▶ Start with ${eW} Players`})]}),eJ&&eU&&(0,r.jsx)("button",{className:"btn-gold mt-3",onClick:()=>aD(!1),children:"▶ Start Match"}),eJ&&!eU&&(0,r.jsx)("div",{className:"ls-alert-info mt-3",children:"All players joined! Waiting for the host to start."})]}),eU&&(0,r.jsxs)("div",{className:"ls-card",children:[(0,r.jsx)("p",{className:"ls-section-title",children:"Invite Friends"}),(0,r.jsx)("p",{className:"ls-section-desc ls-lobby-note",children:"Share the link or lobby code."}),(0,r.jsxs)("div",{className:"ls-copy-row",children:[(0,r.jsx)("input",{className:"ls-copy-input",value:e,readOnly:!0}),(0,r.jsx)("button",{className:"btn-icon success",onClick:()=>aE(e),children:"Copy Link"})]}),(0,r.jsxs)("div",{className:"ls-copy-row",children:[(0,r.jsx)("input",{className:"ls-copy-input",value:y,readOnly:!0}),(0,r.jsx)("button",{className:"btn-icon",onClick:()=>aE(y),children:"Copy Code"})]})]}),(0,r.jsx)("div",{style:{marginTop:"14px"},children:(0,r.jsx)("button",{className:"btn-danger friends-declare",onClick:eU?()=>{u&&y&&u.emit("leaveLobby",y),window.location.href=window.location.origin+"?setupParty=1"}:()=>{u&&y&&u.emit("leaveLobby",y),$(!1),eY(!1),eO(!1),ed("friends"),eA("join"),w(""),e_(1),eG(2),eq([]),eX(!1),eK(!1),eZ(!1),e1(0),e2(0)},children:eU?"✕ Cancel Lobby":"← Leave Lobby"})})]}))}if(I&&!X)return aO((0,r.jsx)(J,{children:(0,r.jsxs)("div",{style:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"16px"},children:[(0,r.jsx)("div",{className:"ls-spinner"}),(0,r.jsx)("p",{style:{color:"#8896A7",fontSize:"14px"},children:"Starting game…"})]})}));let aL=X&&X.players[B],aY=X&&X.currentPlayer===B,aH="pass_and_play"!==el&&null!==B&&X&&X.players[B]&&X.players[B].eliminated;if(X&&(X.gameOver||aH)){let e=X.winner,a=[...X.players].sort((r,a)=>{let t=X.players.indexOf(r),n=X.players.indexOf(a);if(X.gameOver){if(t===e)return -1;if(n===e)return 1}let s=!!r.eliminated,i=!!a.eliminated;if(s!==i)return s?1:-1;let o="number"==typeof r.eliminatedOrder?r.eliminatedOrder:0,l="number"==typeof a.eliminatedOrder?a.eliminatedOrder:0;return s&&i&&o!==l?l-o:r.score-a.score});return aO((0,r.jsxs)(J,{children:[(0,r.jsx)(n.default,{children:(0,r.jsx)("title",{children:"LeastScore — Game Over"})}),(0,r.jsx)(K,{}),(0,r.jsxs)("div",{className:"ls-card view-animate",style:{marginBottom:"16px"},children:[(0,r.jsxs)("div",{style:{textAlign:"center",marginBottom:"24px"},children:[(0,r.jsx)("div",{style:{fontSize:"44px",marginBottom:"10px",filter:"drop-shadow(0 0 20px rgba(255,200,87,0.4))"},children:"🏆"}),(0,r.jsx)("p",{className:"ls-match-details-leaderboard-title",style:{margin:0,fontFamily:"'Bebas Neue', sans-serif",fontSize:"32px",letterSpacing:"2px"},children:"Game Over"}),(0,r.jsx)("p",{className:"ls-match-details-date-time",style:{margin:"6px 0 0",fontSize:"14px"},children:"Final Leaderboard"})]}),a.map((e,t)=>{let n=a.length,s=0===t?"gold":n>3&&1===t?"silver":n>3&&2===t?"bronze":"default",i=e.eliminated,o=e.eliminatedReason,l="exit"===o,d=i&&["disconnect-eliminated","poll-eliminate","disconnect-claimed","guest-expire"].includes(o),c="ls-match-details-player-score-default",p="ls-match-details-player-row-default";return"gold"===s?(p="ls-match-details-player-row-gold",c="ls-match-details-player-score-gold"):"silver"===s?(p="ls-match-details-player-row-silver",c="ls-match-details-player-score-silver"):"bronze"===s&&(p="ls-match-details-player-row-bronze",c="ls-match-details-player-score-bronze"),(0,r.jsxs)("div",{className:p,style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",borderRadius:"16px",marginBottom:"8px"},children:[(0,r.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[(0,r.jsx)("span",{style:{fontSize:"22px",minWidth:"28px",textShadow:"0 2px 4px rgba(0,0,0,0.3)"},children:0===t?"🥇":n>3&&1===t?"🥈":n>3&&2===t?"🥉":""}),(0,r.jsxs)("div",{children:[(0,r.jsx)("p",{className:"ls-match-details-player-name",children:e.username}),(0,r.jsxs)("div",{style:{display:"flex",gap:"6px",marginTop:"3px",flexWrap:"wrap"},children:[i&&(0,r.jsx)("span",{className:"ls-badge red",children:"Eliminated"}),d&&(0,r.jsx)("span",{className:"ls-badge blue",children:"Disconnected"}),l&&(0,r.jsx)("span",{className:"ls-badge red",children:"Exited"})]})]})]}),(0,r.jsx)("span",{className:c,style:{fontFamily:"'Bebas Neue', sans-serif",fontSize:"26px",letterSpacing:"1px"},children:e.score})]},t)})]}),X.roundHistory&&X.roundHistory.length>0&&(0,r.jsxs)("div",{className:"ls-card view-animate",style:{marginBottom:"16px",overflowX:"auto"},children:[(0,r.jsx)("p",{className:"ls-section-title",style:{marginBottom:"12px"},children:"Round History"}),(0,r.jsxs)("table",{className:"ls-round-table",children:[(0,r.jsx)("thead",{children:(0,r.jsxs)("tr",{children:[(0,r.jsx)("th",{style:{textAlign:"left"},children:"Round"}),X.players.map((e,a)=>(0,r.jsx)("th",{children:e.username},a))]})}),(0,r.jsxs)("tbody",{children:[X.roundHistory.map((e,a)=>(0,r.jsxs)("tr",{children:[(0,r.jsxs)("td",{className:"ls-match-details-date-time",style:{textAlign:"left"},children:["#",a+1]}),e.scores.map((a,t)=>{if(null===a)return(0,r.jsx)("td",{},t);let n=e.declarerId===t;return(0,r.jsx)("td",{children:(0,r.jsxs)("span",{className:`ls-score-chip ${0===a?"zero":"pos"}`,children:[a,(0,r.jsx)("span",{title:n?"Declarer":void 0,style:{visibility:n?"visible":"hidden",marginLeft:"4px",color:n?e.won?"#4ade80":"#FC8181":"inherit"},children:"★"})]})},t)})]},a)),(0,r.jsxs)("tr",{className:"ls-round-table-final-row",style:{borderTop:"1px solid rgba(255,255,255,0.08)"},children:[(0,r.jsx)("td",{className:"ls-match-details-leaderboard-title",style:{textAlign:"left",fontWeight:700},children:"Final"}),X.players.map((e,a)=>(0,r.jsx)("td",{style:{fontWeight:700,color:"#FFC857"},children:e.score},a))]})]})]}),(0,r.jsxs)("p",{style:{marginTop:"10px",fontSize:"12px",color:"#8896A7",textAlign:"center"},children:[(0,r.jsx)("span",{style:{color:"#4ade80"},children:"✓"})," Won Declare · ",(0,r.jsx)("span",{style:{color:"#FC8181"},children:"✗"})," Lost Declare"]})]}),(0,r.jsx)("button",{className:"btn-gold",onClick:aI,children:"← Back to Home"})]}))}if(!X)return aO(null);let aG="play_along"===el||X.isPlayAlong,aW="ai"===el||X.isAIGame;return(0,r.jsxs)(r.Fragment,{children:[aR,(0,r.jsx)(n.default,{children:(0,r.jsx)("title",{children:"LeastScore — In Game"})}),(0,r.jsx)("style",{suppressHydrationWarning:!0,dangerouslySetInnerHTML:{__html:U}}),(0,r.jsx)("div",{className:"ls-container",children:(0,r.jsxs)("div",{className:"ls-frame",style:{color:"#F0F4FF"},children:[(0,r.jsx)("div",{className:"ls-bg-mesh"}),(0,r.jsx)("div",{className:"ls-noise"}),(0,r.jsxs)("div",{className:"ls-topbar",style:{position:"sticky",top:0,zIndex:100},children:[(0,r.jsxs)("div",{className:"ls-topbar-badges",children:[(0,r.jsx)("span",{className:"ls-topbar-brand",children:"LEASTSCORE"}),aG&&(0,r.jsx)("span",{className:"ls-badge hand-sum",children:"Play Along"}),aW&&(0,r.jsx)("span",{className:"ls-badge hand-sum",children:"vs AI"}),"pass_and_play"===el&&(0,r.jsx)("span",{className:"ls-badge hand-sum",children:"Pass & Play"})]}),(0,r.jsxs)("div",{style:{display:"flex",gap:"8px",alignItems:"center"},children:[(0,r.jsx)("button",{className:"ls-toolbar-btn settings",onClick:()=>rH(!0),"data-tooltip":"Settings","aria-label":"Settings",children:(0,r.jsxs)("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,r.jsx)("circle",{cx:"12",cy:"12",r:"3"}),(0,r.jsx)("path",{d:"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"})]})}),(0,r.jsx)("button",{className:"ls-topbar-exit",onClick:()=>{rq("/sound/touch sound.wav","click");let e="pass_and_play"===el||"ai"===el||"play_along"===el,r=e?"Do you want to end this game?":"Are you sure you want to exit? This will count as a declaration and your opponent will win.";setTimeout(()=>{if(window.confirm(r))if(e){let e=JSON.parse(JSON.stringify(X));e.gameOver=!0;let r=null!==B?B:e.currentPlayer;if(null!==r&&e.players[r]){e.players[r].eliminated=!0,e.players[r].eliminatedReason="exit";let a=e.players.map((e,r)=>({idx:r,score:e.score,eliminated:e.eliminated})).filter(e=>!e.eliminated);1===a.length?e.winner=a[0].idx:a.length>1?e.winner=a.sort((e,r)=>e.score-r.score)[0].idx:e.winner=null}ey(null),eF(!1),rI(!1),rA(!1),eo(null),er(e)}else u&&X&&null!==B&&u.emit("exitGame",f,{playerId:B})},50)},children:"Exit"})]})]}),rY&&(0,r.jsx)("div",{className:"ls-overlay",style:{zIndex:1e3},children:(0,r.jsx)("div",{style:{maxWidth:"420px",width:"100%",padding:"24px"},children:(0,r.jsxs)("div",{style:{background:"rgba(255,255,255,0.028)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"28px",padding:"28px 24px",backdropFilter:"blur(24px)",boxShadow:"0 1px 0 rgba(255,255,255,0.04) inset, 0 24px 48px rgba(0,0,0,0.5)",animation:"cardEntrance 0.5s cubic-bezier(0.16, 1, 0.3, 1) both"},children:[(0,r.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px"},children:[(0,r.jsx)("p",{style:{margin:0,fontFamily:"'Bebas Neue', sans-serif",fontSize:"28px",color:"#F0F4FF",letterSpacing:"1px"},children:"Settings"}),(0,r.jsx)("button",{className:"btn-icon danger",onClick:ao,children:"✕"})]}),(0,r.jsxs)("div",{style:{textAlign:"left"},children:[(0,r.jsx)("p",{style:{margin:"0 0 16px",color:"#F0F4FF",fontSize:"14px",letterSpacing:"0.12em",textTransform:"uppercase",fontWeight:700},children:"Sound Levels"}),(0,r.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px",marginBottom:"10px",color:"#F0F4FF",fontSize:"14px",fontWeight:600},children:[(0,r.jsx)("label",{children:"Home screen song"}),(0,r.jsxs)("span",{children:[rO.homeVolume,"%"]})]}),(0,r.jsx)("input",{type:"range",min:"0",max:"100",value:rO.homeVolume,style:{width:"100%",accentColor:"#FFC857",marginBottom:"10px"},onChange:e=>{let r={...rO,homeVolume:Number(e.target.value)};rL(r),(0,H.saveSoundSettings)(r),(0,G.setBGMVolume)(r.homeVolume/100)}}),(0,r.jsx)("p",{style:{margin:"0 0 18px",color:"#8896A7",fontSize:"12.5px",lineHeight:1.45},children:"Controls the music volume on the home screen and menu areas."}),(0,r.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px",marginBottom:"10px",color:"#F0F4FF",fontSize:"14px",fontWeight:600},children:[(0,r.jsx)("label",{children:"Click & notification sound"}),(0,r.jsxs)("span",{children:[rO.clickVolume,"%"]})]}),(0,r.jsx)("input",{type:"range",min:"0",max:"100",value:rO.clickVolume,style:{width:"100%",accentColor:"#FFC857",marginBottom:"10px"},onChange:e=>{let r={...rO,clickVolume:Number(e.target.value)};rL(r),(0,H.saveSoundSettings)(r)}}),(0,r.jsx)("p",{style:{margin:"0 0 18px",color:"#8896A7",fontSize:"12.5px",lineHeight:1.45},children:"Controls button clicks, menu taps, and friend/party notification sounds."}),(0,r.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px",marginBottom:"10px",color:"#F0F4FF",fontSize:"14px",fontWeight:600},children:[(0,r.jsx)("label",{children:"In-game sound"}),(0,r.jsxs)("span",{children:[rO.gameVolume,"%"]})]}),(0,r.jsx)("input",{type:"range",min:"0",max:"100",value:rO.gameVolume,style:{width:"100%",accentColor:"#FFC857",marginBottom:"10px"},onChange:e=>{let r={...rO,gameVolume:Number(e.target.value)};rL(r),(0,H.saveSoundSettings)(r)}}),(0,r.jsx)("p",{style:{margin:"0 0 18px",color:"#8896A7",fontSize:"12.5px",lineHeight:1.45},children:"Controls round win/loss, elimination, disconnected, and other gameplay audio."}),(0,r.jsx)("p",{style:{margin:"18px 0 12px",color:"#F0F4FF",fontSize:"14px",letterSpacing:"0.12em",textTransform:"uppercase",fontWeight:700},children:"Appearance"}),(0,r.jsx)("div",{style:{display:"flex",gap:"6px",background:"rgba(0,0,0,0.18)",padding:"4px",borderRadius:"14px",border:"1px solid rgba(255,255,255,0.06)",marginBottom:"8px"},children:[["system","☀︎/🌑 Auto"],["light","☀︎ Light"],["dark","🌑 Dark"]].map(([e,a])=>(0,r.jsx)("button",{onClick:()=>{rW(e),(0,W.saveTheme)(e),(0,W.applyTheme)(e)},style:{flex:1,padding:"9px 6px",borderRadius:"11px",border:"none",fontFamily:"'DM Sans', sans-serif",fontSize:"12px",fontWeight:600,cursor:"pointer",transition:"all 0.2s",background:rG===e?"rgba(255,255,255,0.10)":"transparent",color:rG===e?"#FFFFFF":"#8896A7",boxShadow:rG===e?"0 1px 0 rgba(255,255,255,0.06) inset":"none",whiteSpace:"nowrap"},children:a},e))}),(0,r.jsx)("p",{style:{margin:"0 0 4px",color:"#8896A7",fontSize:"12.5px",lineHeight:1.45},children:"Controls the colour theme across the entire app."})]}),(0,r.jsx)("button",{className:"btn-gold",style:{width:"100%",marginTop:"20px"},onClick:ao,children:"Done"})]})})}),aG&&(0,r.jsx)(L,{}),(0,r.jsxs)("div",{className:"ls-game-area",style:{position:"relative",zIndex:1},children:[(0,r.jsxs)("div",{className:"ls-zone ls-draw-zone",children:[(0,r.jsxs)("p",{className:"ls-zone-label",children:[(0,r.jsx)("span",{className:"ls-draw-zone-title",children:"Draw From"}),"visible"===en&&X.visibleCard.length>1&&null==ei&&(0,r.jsx)("span",{style:{fontSize:"11px",color:"#FC8181",fontWeight:600,textTransform:"none",letterSpacing:0},children:"Select one visible card"})]}),(0,r.jsxs)("div",{style:{display:"flex",flexWrap:"nowrap",alignItems:"flex-start",justifyContent:"space-between",width:"100%"},children:[(0,r.jsx)("div",{style:{display:"flex",flexWrap:"nowrap",minWidth:0},children:X.visibleCard.map((e,r)=>aT(`visible-${e.rank}${e.suit}-${r}`,e,()=>{es("visible"),eo(r)},"visible"===en&&ei===r&&"draw",!1,aG&&ex&&ex?.drawFrom==="visible"&&ex.visibleIndex===r?{drawnGlow:!0}:null))}),(0,r.jsxs)("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",gap:"6px",flexShrink:0},children:[(c=(d=Array.isArray(X.deck)?X.deck.length:X.deckCount||0)<=1?0:d<=5?1:d<=15?2:d<=25?3:d<=35?4:5,p=(_&&"object"==typeof _?_.src:_)||"/images/Back of a Card.png",(0,r.jsxs)("div",{className:"ls-deck-stack",style:{margin:"2px"},children:[Array.from({length:c}).map((e,a)=>{let t=c-a;return(0,r.jsx)("div",{className:"ls-deck-stack-layer",style:{top:`${1.5*t}px`,left:`${1.5*t*.3}px`,zIndex:a},children:(0,r.jsx)("img",{src:p,alt:"",draggable:!1})},`stack-${a}`)}),(0,r.jsx)("button",{onClick:()=>{es("deck"),eo(null)},className:`ls-deck-btn${"deck"===en?" selected-draw":""}${aG&&ex&&ex?.drawFrom==="deck"?" hint-glow":""}`,children:(0,r.jsx)("img",{src:p,alt:"Hidden deck",className:"ls-deck-card-back"})})]})),(0,r.jsxs)("span",{style:{width:"var(--card-w)",fontSize:"clamp(8px, calc(var(--card-w) * 0.13), 12px)",color:"#475569",background:"#f1f5f9",borderRadius:"999px",padding:"4px 3px",fontWeight:700,whiteSpace:"nowrap",textAlign:"center",overflow:"hidden"},children:[Array.isArray(X.deck)?X.deck.length:X.deckCount||0," Cards"]})]})]})]}),(0,r.jsxs)("div",{className:`ls-zone your-hand-zone${aY?" active":""}`,children:[(0,r.jsxs)("p",{className:"ls-zone-label",children:[(0,r.jsx)("span",{children:rC?`Pass to ${aL.username}`:rD&&r$?"Next Round":`Your Hand (${aL.hand.length} cards)`}),!rC&&!(rD&&r$)&&(0,r.jsxs)("span",{className:"ls-badge hand-sum",children:["Sum: ",R(aL.hand)]})]}),(0,r.jsx)("div",{style:{display:"flex",justifyContent:"center",minHeight:"calc(var(--card-h) * 1.15)",marginTop:"4px",overflow:"visible",alignItems:"flex-end",paddingBottom:"12px",transform:"translateY(-8px)"},children:rC||rD&&r$?Array.from({length:aL.hand.length}).map((e,a)=>{let t=a-(aL.hand.length-1)/2,n=4*Math.abs(t),s=(_&&"object"==typeof _?_.src:_)||"/images/Back of a Card.png";return(0,r.jsx)("img",{src:s,alt:"Hidden card",draggable:!1,style:{width:"var(--card-w)",height:"var(--card-h)",objectFit:"cover",borderRadius:"12px",flexShrink:0,transform:`rotate(${5*t}deg) translateY(${n}px)`,marginLeft:0===a?"0":"var(--card-overlap)",zIndex:a,position:"relative",filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.5))"}},`blank-${a}`)}):aL.hand.map((e,a)=>{let t=a-(aL.hand.length-1)/2,n=4*Math.abs(t);return(0,r.jsx)("div",{style:{transform:`rotate(${5*t}deg) translateY(${n}px)`,marginLeft:0===a?"0":"var(--card-overlap)",zIndex:a,position:"relative",transition:"transform 0.2s"},children:aT(`hand-${e.rank}${e.suit}-${a}`,e,()=>{et(r=>r.some(r=>r.suit===e.suit&&r.rank===e.rank)?r.filter(r=>r.suit!==e.suit||r.rank!==e.rank):[...r,e])},!!ea.some(r=>r.suit===e.suit&&r.rank===e.rank)&&"discard",!aY&&aL.lastDrawnCard&&aL.lastDrawnCard.rank===e.rank&&aL.lastDrawnCard.suit===e.suit,aG&&ex&&ex?.discardCards&&ex.discardCards.some(r=>r.suit===e.suit&&r.rank===e.rank)?{discardGlow:!0}:null)},`hand-wrap-${a}`)})})]}),rD?(0,r.jsxs)("button",{className:"btn-gold",onClick:()=>{rq("/sound/turn sound.mp3","game");try{let e=window.AudioContext||window.webkitAudioContext;if(e){let r=new e,a=r.createOscillator(),t=r.createGain();a.connect(t),t.connect(r.destination),a.frequency.value=440,a.type="triangle",t.gain.setValueAtTime(.1,r.currentTime),t.gain.exponentialRampToValueAtTime(.001,r.currentTime+.15),a.start(),a.stop(r.currentTime+.15)}}catch(e){}rI(!1),rA(!0),T(X.currentPlayer),et([]),rB(!1)},children:["🔄 Pass Device to ",X.players[X.currentPlayer]?.username]}):rC?(0,r.jsx)("button",{className:"btn-gold ls-action-btn make-turn","aria-label":"Show My Cards",onClick:()=>{rq("/sound/turn sound.mp3","game");try{let e=window.AudioContext||window.webkitAudioContext;if(e){let r=new e,a=r.createOscillator(),t=r.createGain();a.connect(t),t.connect(r.destination),a.frequency.value=880,a.type="sine",t.gain.setValueAtTime(.1,r.currentTime),t.gain.exponentialRampToValueAtTime(.001,r.currentTime+.1),a.start(),a.stop(r.currentTime+.1)}}catch(e){}rA(!1)},children:"🃏 Show My Cards"}):(0,r.jsxs)("div",{className:"ls-action-row",children:[aG?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("button",{className:"ls-action-btn hint-btn",onClick:()=>{let e,r;if(!X||null===B||X.currentPlayer!==B)return;let a=(e=rZ.current||(0,M.createBotState)(),rZ.current=(r=(0,M.makePlayAlongHint)(X,B,e)).hintState,r);eg(a),function(e,{setSelectedCards:r,setDrawFrom:a,setVisibleIndex:t}){e&&(r(e.discardCards||[]),a(e.drawFrom||null),t("visible"===e.drawFrom?e.visibleIndex??null:null))}(a,{setSelectedCards:et,setDrawFrom:es,setVisibleIndex:eo})},disabled:!aY,children:"💡 Hint"}),(0,r.jsx)("button",{className:`ls-action-btn declare${aY?" turn-shine":""}`,onClick:()=>{aG?O(aL.hand,aB):aB()},disabled:!aY,children:"♛ Declare"})]}):(0,r.jsx)("button",{className:`ls-action-btn declare${aY?" turn-shine":""}`,onClick:()=>{aG?O(aL.hand,aB):aB()},disabled:!aY,children:"♛ Declare"}),(0,r.jsx)("button",{className:`ls-action-btn make-turn${aY?" turn-shine":""}`,"aria-label":"Make Turn",onClick:()=>{if(!X||null===B)return;if(!en)return void alert("Please select a card source to draw from (Hidden Deck or a Visible Card).");if("visible"===en&&null==ei)return void alert("Choose one visible card to draw.");if(ey(null),eg(null),"ai"===el||"pass_and_play"===el||"play_along"===el&&X&&!X.roomId){let e=(0,q.processOfflineAction)(X,{type:"turn",playerId:B,drawFrom:en,visibleIndex:"visible"===en?ei:void 0,discardCards:ea});return e.success?(ab(),er(e.gameState),void("pass_and_play"===el?e.gameState.gameOver||e.gameState.currentPlayer===B?T(e.gameState.currentPlayer):rI(!0):"ai"!==el&&("play_along"!==el||X.roomId)||e.gameState.gameOver||setTimeout(()=>a$(e.gameState),300))):void alert(e.error||"Invalid move.")}if(!u)return;let e={playerId:B,drawFrom:en,discardCards:ea};"visible"===en&&(e.visibleIndex=ei),u.emit("makeTurn",f,e)},disabled:!aY,children:"▶ Make Turn"})]}),Object.keys(rf).length>0&&Object.values(rf).map(e=>{let a=e.disconnectedPlayerIndex,t=!0===e.isGuestDisconnect,n=rF[a],s=rv[a],i=X?.players[a]?.username||"Player "+(a+1);return(0,r.jsxs)("div",{className:"ls-disconnect-panel",style:{marginTop:"16px"},children:[(0,r.jsxs)("p",{style:{margin:"0 0 8px",fontWeight:700,color:"#FFC857",fontSize:"14px",display:"flex",alignItems:"center",gap:"6px"},children:[(0,r.jsx)("span",{children:"⚠"})," ",i," disconnected"]}),null!=n?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("p",{style:{margin:"0 0 4px",fontSize:"13px",color:"#8896A7"},children:t?`Guest session expires in ${n}s`:`Poll opens in ${n}s`}),!t&&(0,r.jsx)("p",{style:{margin:0,fontSize:"12px",color:"#8896A7"},children:"All remaining players will vote to eliminate or wait."})]}):s?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)("p",{style:{margin:"0 0 10px",fontSize:"13px",color:"#8896A7"},children:["Eliminate: ",(0,r.jsx)("strong",{style:{color:"#FC8181"},children:s.counts.eliminate})," · Wait: ",(0,r.jsx)("strong",{style:{color:"#4ade80"},children:s.counts.wait})]}),(0,r.jsxs)("div",{style:{display:"flex",gap:"8px"},children:[(0,r.jsx)("button",{className:"btn-green",style:{flex:1,padding:"10px",fontSize:"13px"},onClick:()=>aP(a,"wait"),disabled:"wait"===s.myVote,children:"wait"===s.myVote?"✓ Voted Wait":"Wait"}),(0,r.jsx)("button",{className:"btn-danger",style:{flex:1,padding:"10px",fontSize:"13px"},onClick:()=>aP(a,"eliminate"),disabled:"eliminate"===s.myVote,children:"eliminate"===s.myVote?"✓ Voted Eliminate":"Eliminate"})]})]}):(0,r.jsx)("p",{style:{margin:0,fontSize:"13px",color:"#8896A7"},children:"Waiting for poll…"})]},a)}),(0,r.jsx)("div",{className:"ls-scoreboard-wrap",style:{position:"relative",zIndex:1,marginTop:"16px",padding:"20px 0 0",overflowX:"auto"},children:(0,r.jsxs)("div",{className:"ls-scoreboard-inner",style:{display:"inline-flex",flexDirection:"column",minWidth:"100%",paddingBottom:0},children:[(0,r.jsxs)("div",{style:{display:"flex",flexDirection:"row",padding:"0 8px 4px 8px",borderBottom:"1px solid var(--ls-scoreboard-divider, rgba(255,255,255,0.07))",marginBottom:"4px"},children:[(0,r.jsx)("div",{style:{width:"140px",minWidth:"90px",marginRight:"8px"}}),(0,r.jsx)("div",{style:{width:"35px",minWidth:"35px",marginRight:"8px",fontSize:"10px",color:"var(--ls-scoreboard-header-color, #8896A7)",textTransform:"uppercase",letterSpacing:"0.5px"},children:"Draw"}),(0,r.jsx)("div",{style:{width:"160px",minWidth:"160px",marginRight:"8px",fontSize:"10px",color:"var(--ls-scoreboard-header-color, #8896A7)",textTransform:"uppercase",letterSpacing:"0.5px"},children:"Discard"}),(0,r.jsx)("div",{style:{width:"40px",minWidth:"40px",marginRight:"8px",fontSize:"10px",color:"var(--ls-scoreboard-header-color, #8896A7)",textTransform:"uppercase",letterSpacing:"0.5px"},children:"Total"}),(0,r.jsx)("div",{style:{flex:"1 0 auto",fontSize:"10px",color:"var(--ls-scoreboard-header-color, #8896A7)",textTransform:"uppercase",letterSpacing:"0.5px"},children:"Roundwise"})]}),X.players.map((e,a)=>{let t=null!=B&&-1!==B?(B+a)%X.players.length:a,n=X.players[t],s=X.currentPlayer===t,i=t===B,o=!!n.eliminated,l=s&&ej&&"ai"===el&&!!n.isBot,d=n.isThinking||l,c="ls-player-card";return s?c+=d?" active-thinking":" active-turn":i&&(c+=" is-me"),o&&(c+=" eliminated"),(0,r.jsxs)("div",{className:c,style:{display:"flex",flexDirection:"row",alignItems:"center",marginBottom:"4px",padding:"8px"},children:[(0,r.jsxs)("div",{style:{width:"140px",minWidth:"90px",borderRight:"1px solid var(--ls-scoreboard-divider, rgba(255,255,255,0.07))",paddingRight:"8px",marginRight:"8px",display:"flex",flexDirection:"column",justifyContent:"center",position:"relative",flexShrink:0},children:[s&&(0,r.jsx)("div",{className:`ls-player-card-turn-badge ${d?"thinking":"normal"}`,style:{top:"-18px"},children:d?"🤖 Thinking…":"Active Turn"}),(0,r.jsxs)("p",{className:"ls-player-card-name",style:{color:i?"var(--ls-scoreboard-me-color, #FFC857)":"var(--ls-scoreboard-name-color, #F0F4FF)",margin:0,fontSize:"13px"},children:[i&&"👤 ",n.username,o&&(0,r.jsx)("span",{style:{fontSize:"10px",color:"#FC8181",display:"block",marginTop:"2px"},children:"(Out)"})]})]}),(0,r.jsx)("div",{style:{width:"35px",minWidth:"35px",marginRight:"8px",display:"flex",alignItems:"center",flexShrink:0},children:n.lastDrawnCard?n.lastDrawnCard.hidden||t!==B&&"deck"===n.lastDrawnFrom?(0,r.jsx)("span",{style:{fontSize:"18px",color:"var(--ls-scoreboard-muted-color, #8896A7)",whiteSpace:"nowrap"},children:"🂠"}):(0,r.jsxs)("span",{style:{fontSize:"18px",fontWeight:700,color:"hearts"===n.lastDrawnCard.suit||"diamonds"===n.lastDrawnCard.suit?"var(--ls-scoreboard-red-color, #FC8181)":"var(--ls-scoreboard-text-color, #F0F4FF)",whiteSpace:"nowrap"},children:[n.lastDrawnCard.rank,aM[n.lastDrawnCard.suit]]}):(0,r.jsx)("span",{style:{fontSize:"18px",color:"var(--ls-scoreboard-muted-color, #4A5568)"},children:"—"})}),(0,r.jsx)("div",{style:{width:"160px",minWidth:"160px",marginRight:"8px",display:"flex",flexWrap:"wrap",gap:"6px",alignItems:"center",flexShrink:0},children:n.lastDiscard&&n.lastDiscard.length>0?n.lastDiscard.map((e,a)=>(0,r.jsxs)("span",{style:{fontSize:"18px",fontWeight:700,color:"hearts"===e.suit||"diamonds"===e.suit?"var(--ls-scoreboard-red-color, #FC8181)":"var(--ls-scoreboard-text-color, #F0F4FF)",whiteSpace:"nowrap"},children:[e.rank,aM[e.suit]]},a)):(0,r.jsx)("span",{style:{fontSize:"18px",color:"var(--ls-scoreboard-muted-color, #4A5568)"},children:"—"})}),(0,r.jsx)("div",{style:{width:"40px",minWidth:"40px",marginRight:"8px",display:"flex",alignItems:"center",flexShrink:0},children:(0,r.jsx)("p",{style:{color:s?"var(--ls-scoreboard-active-total-color, #FFC857)":"var(--ls-scoreboard-total-color, #F0F4FF)",margin:0,fontWeight:"bold",fontSize:"16px"},children:n.score})}),(0,r.jsx)("div",{style:{flex:"1 0 auto",display:"flex",gap:"4px",alignItems:"center",whiteSpace:"nowrap",paddingRight:"8px"},children:X.roundHistory&&X.roundHistory.length>0&&X.roundHistory.map((e,a)=>{let n=e.scores[t];if(null===n)return null;let s=e.declarerId===t;return(0,r.jsxs)("span",{className:`ls-score-chip ${0===n?"zero":"pos"}`,style:{fontSize:"11px",padding:"2px 4px",minWidth:"32px",boxSizing:"border-box",textAlign:"center",whiteSpace:"nowrap",flexShrink:0,display:"inline-block"},children:[n,(0,r.jsx)("span",{style:{visibility:s?"visible":"hidden",color:s?e.won?"#4ade80":"#FC8181":"inherit",marginLeft:"2px"},children:"★"})]},a)})})]},`scoreboard-${t}`)})]})}),aG&&ex&&(0,r.jsx)(Y,{reasoning:ex.reasoning,onDismiss:()=>eg(null)}),(aW||aG)&&(0,r.jsxs)("div",{style:{marginTop:"16px"},children:[(0,r.jsx)("button",{className:"btn-secondary",style:{width:"100%",marginBottom:"12px"},onClick:()=>ek(!ew),children:ew?"▲ Hide Bot Info":"▼ Show Bot Info"}),ew&&(0,r.jsxs)(r.Fragment,{children:[X.players.map((e,a)=>a!==B&&e&&e.hand&&0!==e.hand.length&&!e.eliminated?(0,r.jsxs)("div",{className:"ls-zone",style:{borderColor:"rgba(232,30,99,0.12)",background:"rgba(232,30,99,0.04)"},children:[(0,r.jsxs)("p",{className:"ls-zone-label",children:[(0,r.jsxs)("span",{children:[e.username,"'s Hand (",e.hand.length,")"]}),(0,r.jsxs)("span",{className:"ls-badge red",children:["Sum: ",R(e.hand)]})]}),(0,r.jsx)("div",{style:{display:"flex",justifyContent:"center",minHeight:"calc(var(--card-h) * 1.1)",marginTop:"4px",overflow:"hidden",alignItems:"center"},children:e.hand.map((t,n)=>{let s=n-(e.hand.length-1)/2,i=4*Math.abs(s);return(0,r.jsx)("div",{style:{transform:`rotate(${5*s}deg) translateY(${i}px)`,marginLeft:0===n?"0":"var(--card-overlap)",zIndex:n,position:"relative",transition:"transform 0.2s"},children:aT(`bot-hand-card-${a}-${t.rank}${t.suit}-${n}`,t,()=>{},!1,!1)},`bot-hand-${a}-${t.rank}${t.suit}-${n}`)})})]},`bot-hand-${a}`):null),aW&&eh&&(eh.observation?.length>0||eh.decision?.length>0)&&(0,r.jsxs)("div",{className:"ls-reasoning-panel",children:[(0,r.jsxs)("div",{className:"ls-reasoning-obs",children:[(0,r.jsxs)("p",{className:"ls-reasoning-label",style:{color:"#7B8FFF"},children:[(0,r.jsx)("span",{children:"👁"})," What ",X.players[eh.botIndex??1]?.username||"Bot"," Understood"]}),eh.observation&&eh.observation.length>0?eh.observation.map((e,a)=>(0,r.jsx)("p",{className:"ls-reasoning-line",children:e},a)):(0,r.jsx)("p",{className:"ls-reasoning-line",children:"Studying your plays…"})]}),eh.decision?.length>0&&(0,r.jsxs)("div",{className:"ls-reasoning-dec",children:[(0,r.jsxs)("p",{className:"ls-reasoning-label",style:{color:"#FFC857"},children:[(0,r.jsx)("span",{children:"🧠"})," Why ",X.players[eh.botIndex??1]?.username||"Bot"," Played This"]}),eh.decision.map((e,a)=>(0,r.jsx)("p",{className:"ls-reasoning-line",children:e},a))]})]})]})]})]}),rP&&(0,r.jsx)("div",{className:"ls-overlay",children:(0,r.jsxs)("div",{style:{maxWidth:"800px",width:"100%",textAlign:"center"},children:[(0,r.jsxs)("div",{style:{background:"rgba(255,255,255,0.028)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"28px",padding:"28px 24px",marginBottom:"16px",backdropFilter:"blur(24px)",boxShadow:"0 1px 0 rgba(255,255,255,0.04) inset, 0 24px 48px rgba(0,0,0,0.5)",animation:"cardEntrance 0.5s cubic-bezier(0.16, 1, 0.3, 1) both"},children:[(0,r.jsx)("p",{style:{margin:"0 0 6px",fontFamily:"'Bebas Neue', sans-serif",fontSize:"32px",color:"#FFC857",letterSpacing:"2px"},children:"Round Summary"}),(0,r.jsxs)("p",{style:{color:"#8896A7",fontSize:"14px",margin:0,lineHeight:1.6},children:[(0,r.jsx)("strong",{style:{color:"#F0F4FF"},children:rP.players[rP.declarerId].username})," declared and"," ",(0,r.jsx)("strong",{style:{color:rP.declaredWon?"#4ade80":"#FC8181"},children:rP.declaredWon?"WON":"LOST"}),"!"]})]}),(0,r.jsx)("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:"12px",marginBottom:"14px"},children:rP.players.map((e,a)=>(0,r.jsxs)("div",{style:{background:a===rP.declarerId?"rgba(255,200,87,0.06)":"rgba(255,255,255,0.028)",border:a===rP.declarerId?"1px solid rgba(255,200,87,0.3)":"1px solid rgba(255,255,255,0.07)",borderRadius:"20px",padding:"16px 14px",backdropFilter:"blur(12px)",animation:`cardEntrance 0.5s ${.08*a}s cubic-bezier(0.16, 1, 0.3, 1) both`},children:[(0,r.jsxs)("p",{style:{margin:"0 0 12px",fontWeight:600,color:a===rP.declarerId?"#FFC857":"#F0F4FF",fontSize:"13px",display:"flex",alignItems:"center",gap:"6px"},children:[a===rP.declarerId&&(0,r.jsx)("span",{className:"ls-badge",children:"Declarer"}),a!==rP.declarerId&&(0,r.jsx)("span",{style:{opacity:0},className:"ls-badge",children:"_"}),e.username]}),(0,r.jsx)("div",{style:{display:"flex",justifyContent:"center",minHeight:"calc(var(--card-h) * 1.1)",marginTop:"4px",overflow:"hidden",alignItems:"center",marginBottom:"10px"},children:e.hand.map((t,n)=>{let s=n-(e.hand.length-1)/2,i=4*Math.abs(s);return(0,r.jsx)("div",{style:{transform:`rotate(${5*s}deg) translateY(${i}px)`,marginLeft:0===n?"0":"var(--card-overlap)",zIndex:n,position:"relative"},children:aT(`sum-card-${a}-${n}`,t,()=>{},!1,!1)},`sum-card-wrap-${a}-${n}`)})}),(0,r.jsx)("p",{style:{margin:"12px 0 0",fontFamily:"'Bebas Neue', sans-serif",fontSize:"24px",color:"#FFC857",letterSpacing:"1px"},children:e.sum===1/0?(0,r.jsx)("span",{className:"ls-badge red",children:"Eliminated"}):e.sum})]},a))}),(0,r.jsxs)("div",{style:{background:"rgba(255,255,255,0.028)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"20px",padding:"18px 20px",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"12px"},children:[(0,r.jsxs)("p",{style:{color:"#8896A7",fontSize:"14px",margin:0},children:["Next round in ",(0,r.jsxs)("strong",{style:{color:"#F0F4FF",fontFamily:"'Bebas Neue', sans-serif",fontSize:"18px"},children:[rM,"s"]})]}),(0,r.jsx)("button",{className:"btn-gold",style:{maxWidth:"220px"},onClick:()=>{if(rR.current&&(clearInterval(rR.current),rR.current=null),rE(null),("ai"===el||"play_along"===el&&X&&!X.roomId)&&X&&!X.gameOver){let e=X.players[X.currentPlayer];e&&e.isBot&&setTimeout(()=>a$(X),400)}},children:"Skip & Play Next Round"})]})]})})]})})]})}],10477)},21899,(e,r,a)=>{(window.__NEXT_P=window.__NEXT_P||[]).push(["/",()=>e.r(10477)]),r.hot&&r.hot.dispose(function(){window.__NEXT_P.push(["/"])})}]);