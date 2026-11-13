/* AI-native set: seven new components, richer demos for six existing ones, and the small behaviours they need.
   New: Task Rows · Flowchart · Fine-tune Card · Selection Actions · Agent Screen (AI) · Records Table · Filter Table (Table & List). */
(function(){
'use strict';
const T=window.T, I=T.I, H=T.H, ch=T.ch, $$=(s,r=document)=>[...r.querySelectorAll(s)];
const use=(slug,regions,imports,jsx)=>{ T.use[slug]={regions:regions.split(' '),imports,jsx}; };
/* put pages into an existing group, right after a given page, so the rail and the pager keep their order */
const addTo=(group,after,pages)=>{ const g=T.groups.find(x=>x.name===group); pages.forEach(p=>{ p.kind='c'; p.group=group; const a=T.by[after]; g.pages.splice(a?g.pages.indexOf(a)+1:g.pages.length,0,p); T.pages.splice(a?T.pages.indexOf(a)+1:T.pages.length,0,p); T.by[p.s]=p; after=p.s; }); };
const still=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const tone=v=>v>=70?'g':v>=40?'a':'r';
const meter=(v,n=9,w=44,t)=>H.meter(v,n,t||tone(v),w);
const ev=(el,type='input')=>el.dispatchEvent(new Event(type,{bubbles:true}));
/* FLIP: remember where things were, change the DOM, then glide each one from its old place */
const flip=(els,mutate)=>{ const first=new Map(els.map(e=>[e,e.getBoundingClientRect()])); mutate(); if(still()) return;
  els.forEach(e=>{ if(e.hidden) return; const a=first.get(e), b=e.getBoundingClientRect(), dy=a.top-b.top;
    if(!a.height) e.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:280,easing:'cubic-bezier(.2,.7,.2,1)'});
    else if(dy) e.animate([{transform:`translateY(${dy}px)`},{transform:'none'}],{duration:420,easing:'cubic-bezier(.2,.7,.2,1)'}); }); };

/* =====================================================================  upgrades to existing AI components */

/* ---- Thinking & Loaders: live elapsed time, a fifth pattern, a trace with reasoning, search and code steps */
const th=T.by['thinking'];
th.d='Pixel-grid loaders with a live elapsed time, a shimmering status line, and an expandable trace of the steps, reasoning, searches and code edits behind an answer.';
th.demos[0]={t:'Status lines',c:'col-flow left',d:'The seconds count up while the work runs.',
 h:[['drive','','Thinking',4],['churn','accent','Reading 14 notes',9],['scan','','Comparing forecasts',12]].map(r=>`<span class="loader-line">${H.pix(r[0],r[1])}<span class="shimmer-text">${r[2]}</span><span class="t num" data-secs="${r[3]}" data-from="${r[3]}">${r[3]}s</span></span>`).join(''),
 jsx:`<ThinkingLine live>Thinking</ThinkingLine>
<ThinkingLine live seconds={9} pattern="churn">Reading 14 notes</ThinkingLine>
<ThinkingLine seconds={12} pattern="scan">Comparing forecasts</ThinkingLine>`};
th.demos[1]={t:'Trace',c:'left',d:'Open it to see what the model planned, searched, read and changed.',
 h:`<details class="think" open style="max-width:100%"><summary>${I('chev-down',14,'car')}Worked for 21s</summary><ol style="min-width:0">
 <li>${I('compass',14)}Planned 3 steps<p class="think-sub">Find the negotiation deals that lost their champion, then compare usage before and after.</p></li>
 <li>${I('search',14)}Searched <span class="tag line">deals where stage = negotiation</span><span class="think-n">18 results</span></li>
 <li>${I('file',14)}Read <span class="tag line">oakline-renewal.md</span></li>
 <li>${I('code',14)}Edited <span class="filechip">${I('file',13)}forecast.ts <span class="add">+13</span><span class="del">−41</span></span></li>
 <li>${I('check-c',14)}Found 3 deals at risk</li></ol></details>`,
 jsx:`<ThinkingTrace
  summary="Worked for 21s"
  steps={[
    { icon: "compass", text: "Planned 3 steps", detail: "Find the negotiation deals that lost their champion, then compare usage before and after." },
    { icon: "search", text: <>Searched <Tag tone="line">deals where stage = negotiation</Tag></> },
    { icon: "file", text: <>Read <Tag tone="line">oakline-renewal.md</Tag></> },
    { icon: "code", text: <>Edited <ToolChip name="forecast.ts" added={13} removed={41} /></> },
    { icon: "check-c", text: "Found 3 deals at risk" },
  ]}
/>`};
th.demos[2]={t:'Loader patterns',h:['drive','orbit','scan','dots','churn'].map(v=>`<div class="vstack" style="align-items:center;gap:10px">${H.pix(v,'lg')}<code class="code">${v}</code></div>`).join(''),
 jsx:`<PixelLoader pattern="drive" size={7} />
<PixelLoader pattern="orbit" size={7} />
<PixelLoader pattern="scan" size={7} />
<PixelLoader pattern="dots" size={7} />
<PixelLoader pattern="churn" size={7} />`};
use('thinking','ThinkingLine ThinkingTrace Spinner','ThinkingLine, ThinkingTrace, PixelLoader, Tag, ToolChip',th.demos[0].jsx+'\n\n'+th.demos[1].jsx+'\n\n<PixelLoader pattern="churn" accent />');
th.p='.pix|drive · orbit · scan · dots · churn|drive|Nine-square loader;.pix.lg · .accent|modifier|—|Size and colour;data-secs|seconds|—|Elapsed time that counts up;.think|details|—|Collapsible trace;.think-sub|class|—|Reasoning under a step;.shimmer-text|class|—|Animated status text';

/* ---- Streaming Text: follow-up questions once the answer has landed */
const FOLLOW=[['Who is the new VP?','Ines Duarte joined Oakline as VP of Operations on October 21. She ran the same rollout at Kestrel AI, where her team was one of our most active accounts.'],
 ['What changed in usage?','Weekly active seats fell from 214 to 148 after October 3. Exports dropped the most, down 44%, which usually means the reporting workflow lost its owner.'],
 ['Draft a check-in email','Here is a short draft: “Hi Ines, congratulations on the new role. I look after Oakline here and would like 20 minutes on Thursday to hear what your team needs from us this quarter.”']];
const stx=T.by['streaming-text'];
stx.d='Text that arrives word by word with a caret. Sources and follow-up questions appear once it finishes.';
stx.demos[0]={t:'Stream',c:'col-flow left',d:'Pick a follow-up to stream the next answer.',
 h:`<div class="vstack" data-hydrate="followups" style="gap:12px;width:100%;max-width:580px"><p class="md" data-stream style="margin:0;min-height:5em">Oakline’s renewal is at risk because their sponsor left in October and usage dropped 31% since. The fastest path is a check-in with their new VP of Operations, who joined from a team that already uses us.</p>
 <div class="row wrap" style="gap:6px"><a class="cite" href="#citation"><i style="background:var(--c1)">1</i>usage report</a><a class="cite" href="#citation"><i style="background:var(--c2)">2</i>linkedin.com</a>${H.btn('Replay','ghost xs','refresh','','data-restream')}</div>
 <div class="followups" hidden>${FOLLOW.map((q,k)=>`<button class="followup" data-ask="${k}">${I('arrow-right',13)}<span>${q[0]}</span></button>`).join('')}</div></div>`,
 jsx:`const [done, setDone] = useState(false);

<StreamingText text={answer} onDone={() => setDone(true)} />
{done && (
  <FollowUps
    questions={["Who is the new VP?", "What changed in usage?", "Draft a check-in email"]}
    onPick={(q) => { setDone(false); ask(q); }}
  />
)}`};
stx.p='data-stream|attribute|—|Streams the element’s text;data-speed|ms|38|Delay per word;data-restream|attribute|—|Replays streams in the stage;.followups · .followup|class|—|Questions shown when the stream ends';
use('streaming-text','StreamingText FollowUps','StreamingText, FollowUps',stx.demos[0].jsx);
T.hyd.followups=el=>{ if(el._h) return; el._h=1; const p=el.querySelector('[data-stream]'), box=el.querySelector('.followups');
  const watch=()=>{ box.hidden=true; clearInterval(el._w); el._w=setInterval(()=>{ if(!el.isConnected) return clearInterval(el._w); if(!p.querySelector('.caret')&&p.textContent.length>=(p.dataset.full||'').length){ clearInterval(el._w); box.hidden=false; } },160); };
  el.addEventListener('click',e=>{ const b=e.target.closest('[data-ask]'); if(b){ p.dataset.full=FOLLOW[+b.dataset.ask][1]; T.hydrate(el); watch(); } else if(e.target.closest('[data-restream]')) setTimeout(watch,0); });
  watch(); };

/* ---- Prompt Bar: the full composer */
const model=(n,h,on)=>`<button class="mi" role="option" aria-checked="${on}"><span class="grow" style="min-width:0"><span style="display:block">${n}</span><span class="hint" style="display:block">${h}</span></span><span class="end">${I('check',14,'chk')}</span></button>`;
const pbar=T.by['prompt-bar'];
pbar.d='The main AI input. Mentions sources with @, runs commands with /, switches model inline and takes dictation.';
pbar.demos.unshift({t:'Composer',c:'tall',d:'Type @ for sources or / for commands, pick a model, or press the mic.',
 h:`<div class="promptbar composer" style="max-width:600px" data-composer>
 <div class="dictate" hidden><span class="dwave" aria-hidden="true">${'<i></i>'.repeat(18)}</span><span>Listening</span><span class="mono num" data-timer="0">00:00</span></div>
 <textarea rows="2" aria-label="Prompt" placeholder="Ask about your pipeline. @ adds a source, / runs a command."></textarea>
 <div class="pb-row">
  <span class="anchor"><button class="btn ghost sm" data-pop data-menu="src">${I('at',14)}<span>Sources</span></button><div class="pop up" hidden style="width:250px"><div class="mlabel">Add a source</div>${[['Deals','box','248'],['People','users','1.2k'],['Notes','file','590'],['Web','globe','']].map(s=>`<button class="mi" role="menuitem" data-insert="@${s[0]} ">${I(s[1],16)}<span>${s[0]}</span>${s[2]?`<span class="end">${s[2]}</span>`:''}</button>`).join('')}</div></span>
  <span class="anchor"><button class="btn ghost sm" data-pop data-menu="cmd">${I('term',14)}<span>Commands</span></button><div class="pop up" hidden style="width:270px"><div class="mlabel">Run a command</div>${[['summarize','Summarize this account','file'],['forecast','Forecast the quarter','trend'],['draft','Draft a follow-up','mail'],['compare','Compare two periods','split']].map(s=>`<button class="mi" role="menuitem" data-insert="/${s[0]} ">${I(s[2],16)}<span>${s[1]}</span><span class="end">/${s[0]}</span></button>`).join('')}</div></span>
  ${H.ib('clip','ghost sm','Attach')}<span class="grow"></span>
  <span class="anchor"><button class="btn ghost sm" data-pop>${I('cpu',14)}<span>Ledger 2</span>${I('chev-down',12)}</button><div class="pop up right" hidden style="width:240px"><div class="mlabel">Model</div>${model('Ledger 2','Best for analysis',true)}${model('Ledger 2 Fast','Quick answers',false)}${model('Ledger 1','Older and cheaper',false)}</div></span>
  <button class="btn icon ghost sm" aria-label="Dictate" aria-pressed="false" data-tip="Dictate" data-dictate>${I('mic',16)}</button>
  <button class="btn icon ghost sm csend" aria-label="Send" disabled data-toast="Prompt sent">${I('arrow-up',16)}</button>
 </div></div>`,
 jsx:`const [model, setModel] = useState("Ledger 2");
const [listening, setListening] = useState(false);

<PromptComposer
  placeholder="Ask about your pipeline. @ adds a source, / runs a command."
  sources={[
    { id: "deals", label: "Deals", icon: "box", count: "248" },
    { id: "people", label: "People", icon: "users", count: "1.2k" },
  ]}
  commands={[
    { id: "summarize", label: "Summarize this account", icon: "file", hint: "/summarize" },
    { id: "forecast", label: "Forecast the quarter", icon: "trend", hint: "/forecast" },
  ]}
  models={["Ledger 2", "Ledger 2 Fast", "Ledger 1"]}
  model={model}
  onModelChange={setModel}
  listening={listening}
  onDictate={() => setListening(!listening)}
  onSend={(text) => ask(text, model)}
/>`});
pbar.p='.promptbar|class|—|The input;[data-pop]|attribute|—|Opens the menu above its button;[data-insert]|text|—|Menu item that writes into the prompt;[data-dictate]|attribute|—|Starts and stops dictation;.dictate|class|—|Listening strip with a waveform and timer';
use('prompt-bar','PromptComposer PromptBar','PromptComposer, PromptBar',pbar.demos[0].jsx);

/* ---- Recommendation Card: a confidence meter, Accept, and alternatives to swap in */
const altInner=(t,s)=>`<span class="grow">${t}</span>${meter(s)}<span class="num t-small">${s}%</span>`;
const scoreInner=s=>`${meter(s,17,84,'g')}<b class="num">${s}%</b><span class="t-small">confident</span>`;
const rec=T.by['recommendation-card'];
rec.c='.card.rec  .segmeter';
rec.d='A suggested next step with how sure the model is, the evidence behind it, and other options one click away.';
T.rec=(o={})=>`<div class="card rec" style="${o.style||'width:min(460px,100%)'}"><div class="card-b vstack" style="gap:12px">
 <div class="row"><span class="tag violet">Next step</span><span class="grow"></span><span class="row" style="gap:8px" data-recscore data-v="82">${scoreInner(82)}</span></div>
 <b style="font-size:15.5px" data-rectitle>Book a call with Oakline’s new VP before Friday</b>
 <p class="t-muted" style="margin:0;font-size:13.5px">Usage dropped 31% after the sponsor left.${o.compact?'':' Accounts that re-engaged within two weeks renewed 3× more often.'}</p>
 ${o.compact?'':`<div class="row wrap" style="gap:6px"><a class="cite" href="#citation"><i style="background:var(--c1)">1</i>usage report</a><a class="cite" href="#citation"><i style="background:var(--c2)">2</i>14 similar accounts</a></div>`}
 <div class="rec-alts" hidden>${[['Send the renewal deck first',64],['Offer a 60-day extension',41]].map(a=>`<button class="rec-alt" data-alt="${a[0]}" data-score="${a[1]}">${altInner(a[0],a[1])}</button>`).join('')}</div>
 </div><div class="card-f"><button class="btn ghost sm" data-alts aria-expanded="false" style="margin-right:auto">${I('chevs',14)}<span>Alternatives</span></button>${H.btn('Dismiss','ghost sm')}<button class="btn primary sm" data-accept>${I('check',14)}<span>Accept</span></button></div></div>`;
rec.demos[0]={t:'Card',d:'Accept it, or open the alternatives and swap one in.',h:T.rec(),
 jsx:`<RecommendationCard
  title="Book a call with Oakline’s new VP before Friday"
  score={82}
  alternatives={[
    { title: "Send the renewal deck first", score: 64 },
    { title: "Offer a 60-day extension", score: 41 },
  ]}
  onPick={(i) => swap(i)}
  actions={<>
    <Button size="sm" variant="ghost" onClick={dismiss}>Dismiss</Button>
    <Button size="sm" variant="primary" icon="check" onClick={accept}>Accept</Button>
  </>}
>
  Usage dropped 31% after the sponsor left. Accounts that re-engaged within two weeks renewed 3× more often.
</RecommendationCard>`};
rec.p='.segmeter|class|—|Confidence as filled segments;[data-alts]|attribute|—|Shows the alternatives;.rec-alt|class|—|One alternative; click to swap it in;[data-accept]|attribute|—|Marks the card accepted';
use('recommendation-card','RecommendationCard','RecommendationCard, Button',rec.demos[0].jsx);

/* ---- Context Cards: retrieved chunks tied to their source */
const ctx=T.by['context-cards'];
ctx.c='.chunk  .card.pad';
ctx.d='What the assistant is working from: retrieved chunks with the file and lines they came from, or small cards for the records in view.';
ctx.demos.unshift({t:'Retrieved chunks',c:'stretch',d:'Each chunk names its file and lines, shows how well it matched, and can be pinned.',
 h:`<div class="chunks">${[['oakline-renewal.md','L12–28',92,'Their sponsor, Priya Shah, <mark>left on October 3</mark>. Since then weekly active seats fell from 214 to 148.'],['usage-q4.csv','rows 40–61',78,'Oakline · seats_active <mark>−31%</mark> · exports −44% · last admin sign-in Oct 29'],['call-notes.md','L3–9',61,'The new VP of Operations joined from Kestrel AI, <mark>where the team already uses us</mark>.']].map((c,k)=>`<article class="chunk"><header>${I('file',14)}<b>${c[0]}</b><span class="chunk-l">${c[1]}</span><span class="grow"></span>${meter(c[2],9,40,'x')}<span class="num t-small">${c[2]}%</span></header><p>${c[3]}</p><footer><span class="cite"><i style="background:var(--c${k+1})">${k+1}</i>cited in the answer</span><span class="grow"></span><button class="btn ghost xs" data-press aria-pressed="${k===0}">${I('pin',13)}<span>Pin</span></button></footer></article>`).join('')}</div>`,
 jsx:`<ContextChunk file="oakline-renewal.md" lines="L12–28" score={92} pinned onPin={togglePin}
  footer={<Citation index={1} source="cited in the answer" />}>
  Their sponsor, Priya Shah, <mark>left on October 3</mark>. Since then weekly active seats fell from 214 to 148.
</ContextChunk>`});
ctx.p='.chunk|class|—|One retrieved chunk;.chunk-l|class|—|Line or row range;mark|element|—|The matched words;[data-press]|attribute|—|Pin toggle;.card.pad|class|—|18px padding card';
use('context-cards','ContextChunk ContextCard','ContextChunk, ContextCard, Citation',ctx.demos[0].jsx);

/* ---- Insight Card: several insights in one card, each with a chart you can scrub */
const INS=[{l:'Monthly recurring revenue',pre:'$',d:ch.series(30,40000,3200,320,12),delta:8,t:'Up after reps started sending recaps within an hour of demos.'},
 {l:'Average deal size',pre:'$',d:ch.series(30,18000,1800,90,7),delta:4,t:'Enterprise deals grew while mid-market stayed flat.'},
 {l:'Pipeline created',pre:'$',d:ch.series(30,90000,14000,-600,21),delta:-6,t:'Fewer new deals since outbound paused on October 14.'}];
const insightHTML=(k,w=400,h=150)=>{ const x=INS[k], last=x.d[x.d.length-1];
  return `<div class="card-h"><h4 class="row" style="gap:7px">${I('zap',14)}Insights</h4><span class="row" style="gap:4px"><span class="t-small num" style="margin-right:4px">${k+1} of ${INS.length}</span>${H.ib('chev-left','ghost xs','Previous','data-ins="-1"')}${H.ib('chev-right','ghost xs','Next','data-ins="1"')}</span></div>
  <div class="card-b vstack ins-page" style="gap:12px"><div class="row" style="justify-content:space-between;align-items:flex-end"><div class="stat"><span class="lab">${x.l}</span><span class="val" data-vout>${x.pre}${last.toLocaleString()}</span></div>${H.delta(x.delta)}</div>${ch.value({d:x.d,pre:x.pre,h,w,hi:x.d.length-1})}<p class="t-muted" style="margin:0;font-size:13.5px">${x.t}</p><div class="ins-dots" aria-hidden="true">${INS.map((_,j)=>`<i class="${j===k?'on':''}"></i>`).join('')}</div></div>`; };
T.insights=(style='width:min(440px,100%)',w=400,h=150)=>`<div class="card insights" data-hydrate="insights" data-w="${w}" data-h="${h}" style="${style}">${insightHTML(0,w,h)}</div>`;
T.hyd.insights=el=>{ if(el._h) return; el._h=1; let k=0;
  el.addEventListener('click',e=>{ const b=e.target.closest('[data-ins]'); if(!b) return; k=(k+ +b.dataset.ins+INS.length)%INS.length; el.innerHTML=insightHTML(k,+el.dataset.w||400,+el.dataset.h||150); T.hydrate(el); }); };
const ins=T.by['insight-card'];
ins.c='.card.insights  .stat';
ins.d='A number, its trend and a sentence about why it moved. Several insights page inside one card, and each chart can be scrubbed.';
ins.demos.unshift({t:'Paged insights',d:'Step through with the arrows. Hover the chart to read any day.',h:T.insights(),
 jsx:`const [mrr, setMrr] = useState(48210);

<InsightPager
  insights={[
    {
      label: "Monthly recurring revenue",
      value: \`$\${mrr.toLocaleString()}\`,
      delta: <Delta value={8} />,
      chart: <ValueChart data={mrrByDay} pre="$" height={150} onHover={setMrr} />,
      body: "Up after reps started sending recaps within an hour of demos.",
    },
    { label: "Average deal size", value: "$18,400", body: "Enterprise deals grew while mid-market stayed flat." },
  ]}
/>`});
ins.p='.card.insights|class|—|Paged container;[data-ins]|-1 · 1|—|Previous and next;[data-vout]|attribute|—|Number the chart writes into;.ins-dots|class|—|Page marks;T.ch.value()|function|—|Chart you can scrub';
use('insight-card','InsightPager InsightCard','InsightPager, InsightCard, ValueChart, Delta',ins.demos[0].jsx);

/* =====================================================================  new AI components */

/* ---- Task Rows */
const TASKS=()=>[
 {t:'Pull open deals',s:'done',m:'248 deals · 4s',log:['GET /deals?stage=open','248 rows in 0.8s']},
 {t:'Score renewal risk',s:'done',m:'248 of 248 scored · 11s',log:['model ledger-2 · batch 50','3 deals above 0.7 risk']},
 {t:'Draft follow-ups',s:'run',n:38,of:120,u:'emails',log:['template renewal-checkin','skipping 4 contacts with no email']},
 {t:'Sync replies from Gmail',s:'fail',m:'Sign-in expired after 22 threads',retry:{n:22,of:60,u:'threads'},log:['POST /gmail/sync','401 invalid_grant: token expired']},
 {t:'Send for review',s:'wait',m:'Starts when the drafts are ready',of:12,u:'reviewers notified',log:['waiting on: Draft follow-ups']}];
const trow=(x,i,open)=>{ const ic=x.s==='run'?H.pix('orbit','accent'):I(x.s==='done'?'check-c':x.s==='fail'?'x-c':'dashed',18);
  const meta=x.s==='run'?`<span data-tn>${x.n}</span> of ${x.of} ${x.u}`:x.m;
  const end=x.s==='run'?`<span class="bar" style="width:96px;flex:none"><i data-tb style="width:${x.n/x.of*100}%"></i></span>`:x.s==='fail'?`<button class="btn xs" data-tretry="${i}">${I('refresh',12)}<span>Retry</span></button>`:x.s==='done'?H.spill('Done','ok'):`<span class="t-small">Queued</span>`;
  return `<div class="trow ${x.s}" data-i="${i}"><div class="trow-h" role="button" tabindex="0" aria-expanded="${open}"><span class="trow-ic">${ic}</span><span class="grow"><b>${x.t}</b><small>${meta}</small></span>${end}${I('chev-down',14,'car')}</div><pre class="trow-log" ${open?'':'hidden'}>${x.log.join('\n')}</pre></div>`; };
T.taskRows=(style='width:min(520px,100%)',title='Nightly pipeline review')=>{ const ts=TASKS(); return `<div class="card trows-card" data-hydrate="taskrows" style="${style}"><div class="card-h"><h4>${title}</h4><span class="row" style="gap:8px"><span class="t-small num" data-tsum>${ts.filter(x=>x.s==='done').length} of ${ts.length} done</span><button class="btn ghost xs" data-trun>${I('refresh',12)}<span>Run again</span></button></span></div><div class="trows">${ts.map((x,i)=>trow(x,i,false)).join('')}</div></div>`; };
T.hyd.taskrows=el=>{ if(el._h) return; el._h=1; let tasks=TASKS(); const open=new Set(), list=el.querySelector('.trows');
  const draw=()=>{ list.innerHTML=tasks.map((x,i)=>trow(x,i,open.has(i))).join(''); el.querySelector('[data-tsum]').textContent=`${tasks.filter(x=>x.s==='done').length} of ${tasks.length} done`; };
  el._t=setInterval(()=>{ if(!el.isConnected) return clearInterval(el._t);
    const r=tasks.find(x=>x.s==='run');
    if(!r){ const w=tasks.find(x=>x.s==='wait'); if(w){ w.s='run'; w.n=w.n||0; draw(); } return; }
    r.n=Math.min(r.of,r.n+Math.max(1,Math.round(r.of/40)));
    if(r.n>=r.of){ r.s='done'; r.m=`${r.of} of ${r.of} ${r.u}`; return draw(); }
    const row=list.querySelector(`.trow[data-i="${tasks.indexOf(r)}"]`); if(row){ row.querySelector('[data-tn]').textContent=r.n; row.querySelector('[data-tb]').style.width=(r.n/r.of*100)+'%'; } },420);
  el.addEventListener('click',e=>{ const b=e.target.closest('[data-tretry]');
    if(b){ const x=tasks[+b.dataset.tretry]; Object.assign(x,x.retry,{s:tasks.some(y=>y.s==='run')?'wait':'run',m:'Queued to retry'}); return draw(); }
    if(e.target.closest('[data-trun]')){ tasks=TASKS(); open.clear(); return draw(); }
    const h=e.target.closest('.trow-h'); if(h){ const i=+h.parentElement.dataset.i; open.has(i)?open.delete(i):open.add(i); h.setAttribute('aria-expanded',open.has(i)); h.nextElementSibling.hidden=!open.has(i); } }); };

/* ---- Flowchart */
const KIND={trigger:['Trigger','c1'],cond:['Condition','c4'],act:['Action','c2']};
const fnode=(k,icon,title,sub,on,cls='')=>`<button class="fnode ${cls}" aria-pressed="${!!on}"><span class="av sm sq" style="--t:var(--${KIND[k][1]})">${I(icon,14)}</span><span class="grow"><small>${KIND[k][0]}</small><b>${title}</b><span>${sub}</span></span></button>`;
const fadd=`<span class="flink short"></span><button class="fadd" data-fadd aria-label="Add a step" data-tip="Add a step">${I('plus',14)}</button>`;
const FADD=[['clock','Wait 2 days','Then continue'],['mail','Email the champion','Template · Renewal check-in'],['flag','Flag for review','Notify the manager']];
T.flow=()=>`<div class="flow" data-flow><div class="fcol">
 ${fnode('trigger','zap','When a deal goes quiet','No reply for 7 days',true)}<span class="flink"></span>
 ${fnode('cond','split','If the value is over $50k','Deal value · greater than · 50,000')}<span class="flink"></span>
 <div class="fsplit">
  <div class="fcol"><span class="flink"><em>Yes</em></span>${fnode('act','msg','Alert the owner in Slack','#deals-at-risk')}<span class="flink"></span>${fnode('act','check-c','Create a task','Call within 2 days')}${fadd}</div>
  <div class="fcol"><span class="flink"><em>No</em></span>${fnode('act','mail','Send a nudge email','Template · Checking in')}${fadd}</div>
 </div></div></div>`;

/* ---- Fine-tune Card */
const TUNE=[['w','Width',80,240,160,'px'],['h','Height',48,160,96,'px'],['r','Radius',0,48,16,'px'],['o','Opacity',20,100,100,'%']];
T.tune=()=>`<div class="card tune" data-tune style="width:min(580px,100%)"><div class="card-h"><h4>Fine-tune</h4><span class="row" style="gap:4px"><button class="btn ghost xs" data-tune-set="softer">Softer</button><button class="btn ghost xs" data-tune-set="compact">Compact</button><button class="btn icon ghost xs" data-tune-set="reset" aria-label="Reset" data-tip="Reset">${I('undo',13)}</button></span></div>
 <div class="tune-b"><div class="tune-prev"><div class="tune-box" style="width:160px;height:96px;border-radius:16px;opacity:1"><span class="mono" data-tune-out>160 × 96</span></div></div>
 <div class="vstack" style="gap:8px">${TUNE.map(p=>`<div class="slidebar" style="--v:${(p[4]-p[2])/(p[3]-p[2])*100}%"><span class="fill"></span><span class="lab">${p[1]}</span><span class="val">${p[4]}${p[5]}</span><input type="range" min="${p[2]}" max="${p[3]}" value="${p[4]}" data-u="${p[5]}" data-prop="${p[0]}" aria-label="${p[1]}"></div>`).join('')}</div></div></div>`;
const tuneSync=c=>{ const v={}; $$('input[type=range]',c).forEach(i=>v[i.dataset.prop]=+i.value); const b=c.querySelector('.tune-box'); b.style.width=v.w+'px'; b.style.height=v.h+'px'; b.style.borderRadius=v.r+'px'; b.style.opacity=v.o/100; c.querySelector('[data-tune-out]').textContent=`${v.w} × ${v.h}`; };

/* ---- Selection Actions */
const SENT=[
 {base:'Usage have dropped by 31% since October, so we should talk about what your team actually need.',grammar:'Usage has dropped by 31% since October, so we should talk about what your team actually needs.',improve:'Usage is down 31% since October, so I would like to understand what your team needs now.',shorten:'Usage is down 31% since October. Let’s talk about what you need.',formal:'Usage has declined by 31% since October, and I would welcome a discussion of your team’s current needs.',explain:'Gives the evidence, a 31% drop, and proposes a conversation. It has two agreement errors: “have” and “need”.'},
 {base:'I wanted to quickly reach out and touch base regarding the renewal that is coming up for your team next month.',improve:'Your team’s renewal is coming up next month and I would like to make it easy.',shorten:'Your renewal is next month.',formal:'I am writing about your team’s renewal, which is due next month.',explain:'Gives the reason for writing: the renewal next month. It takes a while to get there.'},
 {base:'Are you free for 20 minutes on Thursday?',improve:'Could you spare 20 minutes on Thursday to walk through it?',shorten:'Free for 20 minutes Thursday?',formal:'Would you be available for a 20-minute call on Thursday?',explain:'The ask: one short, specific meeting.'}];
T.selact=()=>`<div class="card selact" data-hydrate="selact" style="width:min(580px,100%)"><div class="card-b selact-b">
 <p class="selact-p">${SENT.map((s,i)=>`<span data-sent="${i}" tabindex="0">${s.base}</span>`).join(' ')}</p>
 <div class="selact-bar" role="toolbar" aria-label="Rewrite the selected sentence">${[['explain','Explain','info'],['improve','Improve','zap'],['shorten','Shorten','minus'],['formal','More formal','type'],['grammar','Fix grammar','check']].map(a=>`<button class="btn ghost sm" data-act="${a[0]}">${I(a[2],14)}<span>${a[1]}</span></button>`).join('')}</div>
 <div class="selact-note" hidden></div></div>
 <div class="card-f"><span class="t-small" style="margin-right:auto">Select or click a sentence, then pick an action</span><button class="btn ghost sm" data-selundo disabled>${I('undo',14)}<span>Undo</span></button></div></div>`;
T.hyd.selact=el=>{ if(el._h) return; el._h=1; const p=el.querySelector('.selact-p'), bar=el.querySelector('.selact-bar'), note=el.querySelector('.selact-note'), undo=el.querySelector('[data-selundo]'), host=bar.parentElement; let cur=0; const hist=[];
  const sent=i=>p.querySelector(`[data-sent="${i}"]`);
  const place=()=>{ const s=sent(cur); $$('[data-sent]',p).forEach(x=>x.classList.toggle('on',x===s)); const r=s.getClientRects()[0], b=host.getBoundingClientRect(); if(!r||!host.offsetWidth) return; const sc=b.width/host.offsetWidth||1;
    bar.style.left=Math.max(8,Math.min((r.left-b.left)/sc,host.offsetWidth-bar.offsetWidth-8))+'px'; bar.style.top=Math.max(6,(r.top-b.top)/sc-bar.offsetHeight-8)+'px'; };
  const say=(icon,text)=>{ note.hidden=false; note.innerHTML=`${I(icon,14)}<span>${text}</span>`; };
  const pick=i=>{ if(i===cur) return; cur=i; note.hidden=true; place(); };
  const fromSel=()=>{ const s=getSelection(), n=s&&s.anchorNode&&(s.anchorNode.nodeType===1?s.anchorNode:s.anchorNode.parentElement), x=n&&n.closest('[data-sent]'); if(x&&p.contains(x)) pick(+x.dataset.sent); };
  ['mouseup','keyup','touchend'].forEach(t=>p.addEventListener(t,fromSel)); p.addEventListener('focusin',e=>{ const x=e.target.closest('[data-sent]'); if(x) pick(+x.dataset.sent); });
  bar.addEventListener('mousedown',e=>e.preventDefault());
  bar.addEventListener('click',e=>{ const b=e.target.closest('[data-act]'); if(!b) return; const a=b.dataset.act, s=sent(cur), d=SENT[cur];
    if(a==='explain') return say('info',d.explain);
    const out=d[a]; if(!out||out===s.textContent) return say('check-c',a==='grammar'?'No grammar problems in this sentence.':'This sentence already reads that way.');
    note.hidden=true; hist.push([cur,s.textContent]); undo.disabled=false; s.classList.add('busy');
    setTimeout(()=>{ s.textContent=out; s.classList.remove('busy'); s.classList.add('changed'); place(); },still()?0:520); });
  undo.addEventListener('click',()=>{ const h=hist.pop(); if(!h) return; const s=sent(h[0]); s.textContent=h[1]; if(!hist.some(x=>x[0]===h[0])) s.classList.remove('changed'); undo.disabled=!hist.length; cur=h[0]; note.hidden=true; place(); });
  requestAnimationFrame(place); if('ResizeObserver' in window) new ResizeObserver(place).observe(host); };

/* ---- Agent Screen */
const AS=['Open the Oakline deal','Move the stage to Stalled','Set the next step','Log the activity'];
const asSteps=()=>AS.map((s,i)=>`<li class="${i?'':'on'}">${I(i?'dashed':'arrow-right',14)}<span>${s}</span></li>`).join('');
T.agentScreen=()=>`<div class="agentscr" data-hydrate="agentscreen">
 <header><span class="as-url">${I('lock',12)}<span>app.lumen.example/deals/oakline</span></span><span class="grow"></span><span class="row" style="gap:10px;flex:none"><span class="spill accent" data-as-status><span class="sdot accent pulse" style="color:var(--accent)"></span>Ledger is working</span><span class="mono num t-small" data-timer="42">00:42</span></span></header>
 <div class="as-body"><div class="as-view">
   <div class="as-page"><div class="row" style="gap:10px"><span class="av sq" style="--t:var(--c4)">O</span><div class="grow"><b data-as="0" data-label="the deal title">Oakline · Renewal</b><div class="t-small">$60,000 · closes Nov 28</div></div></div>
   <dl class="as-fields"><div><dt>Stage</dt><dd><span class="tag violet" data-as="1" data-label="Stage">Negotiation</span></dd></div><div><dt>Owner</dt><dd>Maya Okafor</dd></div><div><dt>Next step</dt><dd><span class="as-next" data-as="2" data-label="Next step">None yet</span></dd></div></dl>
   <button class="btn sm" data-as="3" data-label="Log activity">${I('edit',14)}<span>Log activity</span></button></div>
   <span class="as-cursor" aria-hidden="true"><svg width="16" height="18" viewBox="0 0 16 18"><path d="M1 1l13 7-6 1.6L5.5 16z" style="fill:var(--accent);stroke:var(--surface);stroke-width:1.2;stroke-linejoin:round"/></svg><em>Ledger</em></span></div>
  <ol class="as-steps">${asSteps()}</ol></div>
 <footer><button class="btn sm" data-as-take>${I('move',14)}<span>Take over</span></button><button class="btn ghost sm" data-as-rec aria-pressed="false">${I('circle',14)}<span>Teach a task</span></button><span class="grow"></span><span class="t-small num" data-as-hint>Step 1 of ${AS.length}</span></footer></div>`;
T.hyd.agentscreen=el=>{ if(el._h) return; el._h=1; const view=el.querySelector('.as-view'), cur=el.querySelector('.as-cursor'), list=el.querySelector('.as-steps'), hint=el.querySelector('[data-as-hint]'), stat=el.querySelector('[data-as-status]'), take=el.querySelector('[data-as-take]'), recb=el.querySelector('[data-as-rec]');
  const tg=i=>view.querySelector(`[data-as="${i}"]`); let k=0, mode='agent', n=0;
  const reset=()=>{ const s=tg(1); s.className='tag violet'; s.textContent='Negotiation'; const x=tg(2); x.textContent='None yet'; x.classList.remove('set'); tg(3).innerHTML=`${I('edit',14)}<span>Log activity</span>`; };
  const apply=i=>{ if(i===1){ const s=tg(1); s.className='tag sand'; s.textContent='Stalled'; } if(i===2){ const x=tg(2); x.textContent='Call the new VP · Thu'; x.classList.add('set'); } if(i===3) tg(3).innerHTML=`${I('check',14)}<span>Logged</span>`; };
  const marks=()=>$$('li',list).forEach((s,j)=>{ s.className=j===k?'on':j<k?'done':''; s.querySelector('.ic').outerHTML=I(j<k?'check':j===k?'arrow-right':'dashed',14); });
  const go=()=>{ const t=tg(k), a=t.getBoundingClientRect(), b=view.getBoundingClientRect(); if(!b.width) return; cur.style.left=((a.left-b.left+Math.min(a.width*.6,a.width-8))/b.width*100)+'%'; cur.style.top=((a.top-b.top+a.height*.55)/b.height*100)+'%'; marks(); hint.textContent=`Step ${k+1} of ${AS.length}`;
    clearTimeout(el._c); el._c=setTimeout(()=>{ if(mode!=='agent'||!el.isConnected) return; t.classList.add('hit'); setTimeout(()=>t.classList.remove('hit'),520); apply(k); },850); };
  const status=()=>{ el.dataset.mode=mode; stat.className='spill '+(mode==='agent'?'accent':mode==='rec'?'bad':''); stat.innerHTML=mode==='agent'?`<span class="sdot accent pulse" style="color:var(--accent)"></span>Ledger is working`:mode==='rec'?`<span class="sdot bad pulse" style="color:var(--bad)"></span>Recording your steps`:`<span class="sdot"></span>You are in control`;
    take.querySelector('span').textContent=mode==='user'?'Hand back':'Take over'; recb.setAttribute('aria-pressed',mode==='rec'); recb.querySelector('span').textContent=mode==='rec'?'Stop teaching':'Teach a task'; };
  el._t=setInterval(()=>{ if(!el.isConnected) return clearInterval(el._t); if(mode!=='agent') return; k=(k+1)%AS.length; if(!k) reset(); go(); },2300);
  el.addEventListener('click',e=>{
    if(e.target.closest('[data-as-take]')){ mode=mode==='user'?'agent':'user'; if(mode==='agent'){ list.innerHTML=asSteps(); go(); } status(); return; }
    if(e.target.closest('[data-as-rec]')){ mode=mode==='rec'?'agent':'rec'; n=0; list.innerHTML=mode==='rec'?`<li class="hint">Click things on the page and each click is saved as a step.</li>`:asSteps(); if(mode==='agent') go(); else hint.textContent='0 steps recorded'; status(); return; }
    const t=e.target.closest('[data-as]'); if(t&&mode==='rec'){ if(!n) list.innerHTML=''; n++; list.insertAdjacentHTML('beforeend',`<li class="done">${I('check',14)}<span>Clicked ${t.dataset.label}</span></li>`); hint.textContent=`${n} step${n>1?'s':''} recorded`; } });
  requestAnimationFrame(go); };

addTo('AI','task-list',[
{s:'task-rows',n:'Task Rows',c:'.trow  .trows',d:'Live task status as rows: what is running, what failed and what finished, each with its progress and a log one click away.',
 demos:[{t:'Live run',d:'Watch the run advance. Open a row for its log, or retry the failed one.',h:T.taskRows()}],
 p:'.trow|class|—|One task;.trow.run · .done · .fail · .wait|modifier|—|State;.trow-h|role=button|—|Row header; opens the log;.trow-log|pre|—|Log lines;[data-tretry]|attribute|—|Retry a failed task;[data-trun]|attribute|—|Start the run again'},
]);
addTo('AI','parameter-card',[
{s:'flowchart',n:'Flowchart',c:'.flow  .fnode  .fsplit',d:'A workflow on a dotted canvas: a trigger, a condition that splits into Yes and No, and the actions under each branch.',
 demos:[{t:'Workflow',c:'stretch',d:'Click a step to select it. The + at the end of a branch adds another step.',h:T.flow()}],
 p:'.flow|class|—|Dotted canvas;.fnode|button|—|A step; aria-pressed marks the selected one;.flink|class|—|Connector; put an <em> inside for a branch label;.fsplit|class|—|Two branches side by side;[data-fadd]|attribute|—|Adds a step to its branch'},
{s:'fine-tune-card',n:'Fine-tune Card',c:'.tune  .slidebar',d:'An inspector for adjusting what the model made: sliders on one side, the result on the other, and shortcuts for common nudges.',
 demos:[{t:'Inspector',d:'Drag a bar, or try Softer and Compact.',h:T.tune()}],
 p:'[data-tune]|attribute|—|Container;input[data-prop]|w · h · r · o|—|Property each slider drives;.tune-box|class|—|The element being tuned;[data-tune-set]|softer · compact · reset|—|Preset shortcuts'},
{s:'selection-actions',n:'Selection Actions',c:'.selact  .selact-bar',d:'Highlight a passage and ask the assistant to explain it, improve it, shorten it, change its tone or fix the grammar.',
 demos:[{t:'Rewrite a sentence',d:'Select or click a sentence. The first one has two grammar slips to fix.',h:T.selact()}],
 p:'.selact|class|—|Container;[data-sent]|index|—|A selectable passage;.selact-bar|role=toolbar|—|Floats above the selection;[data-act]|explain · improve · shorten · formal · grammar|—|What to do with it;[data-selundo]|attribute|—|Undo the last rewrite'},
{s:'agent-screen',n:'Agent Screen',c:'.agentscr',d:'A window onto what the agent is doing: its screen, its cursor and its steps, with a way to take over or to teach it a new task.',
 demos:[{t:'Watching a run',c:'stretch',d:'Take over to pause it, or press Teach a task and click around the page.',h:T.agentScreen()}],
 p:'.agentscr|class|—|Frame;.as-view|class|—|The agent’s screen;[data-as]|index|—|Something the agent can click;.as-cursor|class|—|The agent’s pointer;.as-steps|ol|—|Step list;[data-as-take]|attribute|—|Take over and hand back;[data-as-rec]|attribute|—|Record your clicks as steps'},
]);

use('task-rows','TaskRows','TaskRows',`<TaskRows
  onRetry={(id) => retry(id)}
  tasks={[
    { id: "pull", title: "Pull open deals", state: "done", detail: "248 deals · 4s", log: ["GET /deals?stage=open", "248 rows in 0.8s"] },
    { id: "draft", title: "Draft follow-ups", state: "running", detail: "38 of 120 emails", progress: 32 },
    { id: "sync", title: "Sync replies from Gmail", state: "failed", detail: "Sign-in expired after 22 threads", log: ["401 invalid_grant: token expired"] },
    { id: "review", title: "Send for review", state: "queued", detail: "Starts when the drafts are ready" },
  ]}
/>`);
use('flowchart','Flowchart','Flowchart',`const [selected, setSelected] = useState("quiet");

<Flowchart
  selected={selected}
  onSelect={setSelected}
  onAdd={(afterId) => addStepAfter(afterId)}
  steps={[
    { id: "quiet", kind: "trigger", title: "When a deal goes quiet", detail: "No reply for 7 days" },
    {
      id: "value", kind: "condition", title: "If the value is over $50k", detail: "Deal value · greater than · 50,000",
      yes: [
        { id: "slack", kind: "action", icon: "msg", title: "Alert the owner in Slack", detail: "#deals-at-risk" },
        { id: "task", kind: "action", icon: "check-c", title: "Create a task", detail: "Call within 2 days" },
      ],
      no: [{ id: "nudge", kind: "action", icon: "mail", title: "Send a nudge email", detail: "Template · Checking in" }],
    },
  ]}
/>`);
use('fine-tune-card','FineTuneCard','FineTuneCard, Button',`const [v, setV] = useState({ w: 160, h: 96, r: 16, o: 100 });

<FineTuneCard
  values={v}
  onChange={setV}
  properties={[
    { key: "w", label: "Width", min: 80, max: 240, unit: "px" },
    { key: "h", label: "Height", min: 48, max: 160, unit: "px" },
    { key: "r", label: "Radius", min: 0, max: 48, unit: "px" },
    { key: "o", label: "Opacity", min: 20, max: 100, unit: "%" },
  ]}
  preview={(p) => <div style={{ width: p.w, height: p.h, borderRadius: p.r, opacity: p.o / 100 }} />}
  actions={<Button size="xs" variant="ghost" onClick={() => setV({ ...v, r: 36, o: 86 })}>Softer</Button>}
/>`);
use('selection-actions','SelectionActions','SelectionActions',`<SelectionActions
  actions={[
    { id: "explain", label: "Explain", icon: "info" },
    { id: "improve", label: "Improve", icon: "zap" },
    { id: "shorten", label: "Shorten", icon: "minus" },
    { id: "grammar", label: "Fix grammar", icon: "check" },
  ]}
  onAction={(id, text, range) => rewrite(id, text).then((out) => replace(range, out))}
>
  <p>Usage have dropped by 31% since October, so we should talk about what your team actually need.</p>
</SelectionActions>`);
use('agent-screen','AgentScreen','AgentScreen',`<AgentScreen
  url="app.lumen.example/deals/oakline"
  agent="Ledger"
  steps={["Open the Oakline deal", "Move the stage to Stalled", "Set the next step", "Log the activity"]}
  current={step}
  cursor={cursor}                // { x, y } in percent of the view
  controlled={controlled}
  recording={recording}
  onTakeOver={() => setControlled(!controlled)}
  onRecord={() => setRecording(!recording)}
>
  <DealPage />
</AgentScreen>`);

/* =====================================================================  new Table & List components */
const REC=[['Maya Okafor','Halden Freight',[['Champion','violet'],['Enterprise','blue']],86,2,84000,1],['Leo Brandt','Mira Labs',[['Buyer','sand']],72,5,52000,2],['Priya Shah','Oakline',[['Left company','coral']],18,41,60000,5],['Ruth Adeyemi','Kestrel AI',[['Legal','sky'],['Enterprise','blue']],55,9,128000,3],['Omar Haddad','Brightwater',[['Champion','violet']],64,3,31000,6],['Ines Duarte','Cobalt Bank',[['Finance','mint']],33,22,210000,4],['Kai Nakamura','Northfield Co',[['Trial','']],47,12,18000,2]];
const sortTh=(l,type,cls='',on)=>`<th class="${cls}" ${on?`aria-sort="${on}"`:''}><button class="sort" data-type="${type}">${l}${I(on==='descending'?'arrow-down':on==='ascending'?'arrow-up':'chevs',12)}</button></th>`;
const recRow=(r,compact)=>{ const ini=r[0].split(' ').map(x=>x[0]).join(''), mail=r[0].toLowerCase().replace(' ','.')+'@example.com', lab=r[3]>=70?'Strong':r[3]>=40?'Warm':'Cold';
  return `<tr data-item><td data-v="${r[0]}"><div class="who"><span class="av sm" style="--t:var(--c${r[6]})">${ini}</span><div><b>${r[0]}</b><small>${mail}</small></div></div></td><td>${r[1]}</td>${compact?'':`<td><span class="row" style="gap:4px">${r[2].map(t=>H.tag(t[0],t[1])).join('')}</span></td>`}<td data-v="${r[3]}"><span class="row" style="gap:8px">${meter(r[3])}<span>${lab}</span></span></td>${compact?'':`<td data-v="${r[4]}">${r[4]}d ago</td>`}<td class="r" data-v="${r[5]}">$${r[5].toLocaleString()}</td></tr>`; };
/* o.compact drops Tags and Last contact so the grid fits a narrow column */
T.records=(n=7,o={})=>`<div class="tblwrap" data-sorttable style="${o.style||''}"><table class="tbl"><thead><tr>${sortTh('Person','text')}${sortTh('Company','text')}${o.compact?'':'<th>Tags</th>'}${sortTh('Relationship','num','','descending')}${o.compact?'':sortTh('Last contact','num')}${sortTh('Value','num','r')}</tr></thead><tbody>${[...REC].sort((a,b)=>b[3]-a[3]).slice(0,n).map(r=>recRow(r,o.compact)).join('')}</tbody></table></div>`;

const FT=[['Draft Q4 forecast','Finance · due Fri','Running',1],['Clean up stale deals','Sales ops · due today','Running',2],['Review renewal emails','12 drafts waiting','Review',3],['Approve discount for Mira Labs','Above 15%','Review',4],['Check Oakline risk score','Flagged by Ledger','Review',5],['Connect the Gmail inbox','Sign-in expired','Blocked',6],['Import October contacts','1,204 rows','Done',1],['Tag enterprise accounts','48 accounts','Done',2]];
const ftTone={Running:'accent',Review:'warn',Blocked:'bad',Done:'ok'};
T.filterTable=(style='width:min(560px,100%)')=>`<div class="card ftable" data-ftable style="${style}"><div class="ft-chips"><button class="chip" aria-pressed="true" data-f="all">All <b>${FT.length}</b></button>${Object.keys(ftTone).map(s=>`<button class="chip" aria-pressed="false" data-f="${s}"><span class="sdot ${ftTone[s]}"></span>${s} <b>${FT.filter(r=>r[2]===s).length}</b></button>`).join('')}</div>
 <div class="ft-rows">${FT.map(r=>`<div class="ft-row" data-status="${r[2]}"><span class="grow"><b>${r[0]}</b><small>${r[1]}</small></span>${H.av(r[3],'xs')}${H.spill(r[2],ftTone[r[2]])}</div>`).join('')}</div>
 <div class="ft-foot" data-ft-count>${FT.length} of ${FT.length} tasks</div></div>`;

addTo('Table & List','table-selection-toolbar',[
{s:'records-table',n:'Records Table',c:'.tbl  [data-sorttable]',d:'A CRM-style grid: who they are, where they work, how they are tagged and how strong the relationship is. Click a header to sort.',
 demos:[{t:'People',c:'bleed',d:'Sort by any column. The rows glide to their new places.',h:`<div style="width:100%;padding:0 12px 12px">${T.records()}</div>`}],
 p:'[data-sorttable]|attribute|—|Makes the headers sort;th button.sort|data-type text · num|text|Sortable header;th[aria-sort]|ascending · descending|—|Current order;td[data-v]|value|—|Sort value when it differs from the text;.segmeter|class|—|Relationship strength'},
{s:'filter-table',n:'Filter Table',c:'.ftable  .chip',d:'A task list with status chips on top. Picking a chip narrows the list live, and the counts stay in view.',
 demos:[{t:'Tasks by status',d:'Pick a status. The matching rows glide up to fill the list.',h:T.filterTable()}],
 p:'[data-ftable]|attribute|—|Container;.chip[data-f]|status · all|all|Filter chip; aria-pressed marks the active one;.ft-row[data-status]|status|—|A row;[data-ft-count]|attribute|—|Shown and total count'},
]);
use('records-table','RecordsTable','RecordsTable',`<RecordsTable
  onOpen={(id) => openPerson(id)}
  rows={[
    { id: "maya", name: "Maya Okafor", email: "maya.okafor@example.com", tint: "c1", company: "Halden Freight",
      tags: [{ label: "Champion", tone: "violet" }, { label: "Enterprise", tone: "blue" }], strength: 86, lastContactDays: 2, value: 84000 },
    { id: "priya", name: "Priya Shah", email: "priya.shah@example.com", tint: "c5", company: "Oakline",
      tags: [{ label: "Left company", tone: "coral" }], strength: 18, lastContactDays: 41, value: 60000 },
  ]}
/>`);
use('filter-table','FilterTable','FilterTable, Avatar',`<FilterTable
  statuses={[
    { value: "Running", tone: "accent" },
    { value: "Review", tone: "warn" },
    { value: "Blocked", tone: "bad" },
    { value: "Done", tone: "ok" },
  ]}
  rows={[
    { id: "forecast", title: "Draft Q4 forecast", detail: "Finance · due Fri", status: "Running", end: <Avatar name="Maya Okafor" size="xs" /> },
    { id: "emails", title: "Review renewal emails", detail: "12 drafts waiting", status: "Review" },
    { id: "gmail", title: "Connect the Gmail inbox", detail: "Sign-in expired", status: "Blocked" },
  ]}
/>`);

/* =====================================================================  stat tiles: each number gets the picture that suits it */
/* 30 daily totals in $k, weekends quiet, summing to exactly 212 so the bars agree with the headline */
const WON=(()=>{ T.rnd(41); const raw=Array.from({length:30},(_,i)=>{ const wd=(4+i)%7; return (wd===0||wd===6?.2:1)*(3+T.rnd()*9); }), k=212/raw.reduce((a,b)=>a+b,0), d=raw.map(v=>Math.round(v*k*10)/10); d[29]=Math.round((d[29]+212-d.reduce((a,b)=>a+b,0))*10)/10; return d; })();
const wonDay=i=>new Date(2026,9,15+i).toLocaleDateString('en-US',{month:'short',day:'numeric'});
const wonBest=WON.indexOf(Math.max(...WON));
const sdelta=(v,good=v>0)=>`<span class="delta ${good?'up':'down'}">${I(v>0?'arrow-up':'arrow-down',11)}${Math.abs(v)}%</span>`;
const stile=o=>`<div class="stile"><div class="stile-h"><span class="stile-l">${I(o.icon,13)}${o.label}</span><span class="stile-p">${o.period}</span></div><div class="stile-v"><span class="val" data-sv>${o.value}</span>${o.delta}</div><div class="stile-viz">${o.viz}</div><div class="stile-c" data-sc>${o.cap}</div></div>`;
T.statTiles=()=>{ const max=Math.max(...WON), at=v=>(v-30)/30*100;
  return `<div class="stiles" data-hydrate="stattiles">`+
  stile({icon:'layers',label:'Pipeline',period:'Q4',value:'$1.24M',delta:sdelta(12),cap:'<b>83%</b> of the $1.5M quota',
    viz:`<div class="sseg" role="img" aria-label="83% of quota">${Array.from({length:24},(_,i)=>`<i class="${i<20?'on':''}" style="animation-delay:${i*14}ms"></i>`).join('')}</div>`})+
  stile({icon:'dollar',label:'Won',period:'30 days',value:'$212k',delta:sdelta(8),cap:`Best day <b>$${WON[wonBest]}k</b> · ${wonDay(wonBest)}`,
    viz:`<div class="sbars" role="img" aria-label="Won per day, last 30 days">${WON.map((v,i)=>`<i class="${i===wonBest?'hi':''}" style="height:${Math.max(6,v/max*100).toFixed(1)}%;animation-delay:${i*12}ms"></i>`).join('')}</div>`})+
  stile({icon:'target',label:'Win rate',period:'30 days',value:'34%',delta:sdelta(6),cap:'<b>112</b> won of 329 closed',
    viz:`<div class="sdots" role="img" aria-label="34 of 100">${Array.from({length:100},(_,i)=>`<i class="${i<34?'on':''}"${i<34?` style="animation-delay:${i*9}ms"`:''}></i>`).join('')}</div>`})+
  stile({icon:'clock',label:'Avg cycle',period:'vs last quarter',value:'41 days',delta:sdelta(-9,true),cap:'<b>4 days</b> faster than last quarter',
    viz:`<div class="srange" role="img" aria-label="41 days now, 45 last quarter"><span>30d</span><div class="sr-track"><span class="sr-span" style="left:${at(41)}%;width:${at(45)-at(41)}%"></span><i class="was" style="left:${at(45)}%" title="Last quarter · 45 days"></i><i class="now" style="left:${at(41)}%" title="Now · 41 days"></i></div><span>60d</span></div>`})+`</div>`; };
/* move across the daily bars to read one day; leaving puts the 30-day total back */
T.hyd.stattiles=el=>{ if(el._h) return; el._h=1; const bars=el.querySelector('.sbars'); if(!bars) return; const tile=bars.closest('.stile'), val=tile.querySelector('[data-sv]'), cap=tile.querySelector('[data-sc]'), v0=val.textContent, c0=cap.innerHTML, bs=[...bars.children];
  bars.addEventListener('pointermove',e=>{ const r=bars.getBoundingClientRect(), i=Math.max(0,Math.min(bs.length-1,Math.floor((e.clientX-r.left)/r.width*bs.length))); bars.classList.add('scrub'); bs.forEach((b,j)=>b.classList.toggle('cur',j===i)); val.textContent='$'+WON[i]+'k'; cap.innerHTML=`<b>${wonDay(i)}</b> · day ${i+1} of 30`; });
  bars.addEventListener('pointerleave',()=>{ bars.classList.remove('scrub'); bs.forEach(b=>b.classList.remove('cur')); val.textContent=v0; cap.innerHTML=c0; }); };
/* a small picture for any KPI: a percentage fills segments to that share; anything else gets twelve bars whose last step follows the delta */
T.kviz=(value,seed,d)=>{ const s=String(value), m=s.match(/^(\d+(?:\.\d+)?)%$/);
  if(m){ const n=12, f=Math.max(+m[1]>0?1:0,Math.round(Math.min(100,+m[1])/100*n)); return `<span class="sseg mini" role="img" aria-label="${s}">${Array.from({length:n},(_,i)=>`<i class="${i<f?'on':''}"></i>`).join('')}</span>`; }
  let h=7; for(const ch of String(seed)) h=(h*31+ch.charCodeAt(0))%2147483647; const rnd=()=>(h=(h*48271)%2147483647)/2147483647;
  let v=.55; const b=Array.from({length:12},()=>(v=Math.max(.2,Math.min(.95,v+(rnd()-.5)*.3)))); if(d) b[11]=Math.max(.15,Math.min(1,b[10]*(1+Math.max(-.4,Math.min(.4,d/40)))));
  return `<span class="sbars mini" aria-hidden="true">${b.map((x,i)=>`<i class="${i===11?'hi':''}" style="height:${Math.round(x*100)}%"></i>`).join('')}</span>`; };
T.statTile=o=>`<div class="stile side ${o.c||''}" style="${o.style||''}"><div class="stile-h"><span class="stile-l">${o.icon?I(o.icon,13):''}${o.label}</span>${o.period?`<span class="stile-p">${o.period}</span>`:''}</div><div class="stile-v"><span class="val">${o.value}</span>${o.tail||''}<span class="grow"></span>${o.viz===false?'':T.kviz(o.value,o.label,o.d)}</div><div class="stile-c">${o.sub||'&nbsp;'}</div></div>`;
const stat=T.by['stat'];
stat.c='.stiles  .stile  .stat  .delta';
stat.d='A label, a big tabular number and its change. In a tile, each number also gets the picture that suits it: progress to a target, bars by day, a share as lit squares, or now against before.';
stat.demos.unshift({t:'Tiles',c:'stretch',d:'Move across the daily bars under Won to read a single day.',h:T.statTiles(),
 jsx:`const [day, setDay] = useState<number | null>(null);

<StatTiles>
  <StatTile icon="layers" label="Pipeline" period="Q4" value="$1.24M" delta={12} note="83% of the $1.5M quota">
    <TargetSegments value={83} />
  </StatTile>
  <StatTile icon="dollar" label="Won" period="30 days" delta={8}
    value={day === null ? "$212k" : \`$\${won[day]}k\`}
    note={day === null ? "Best day $13.9k · Oct 16" : dates[day]}>
    <MiniBars data={won} highlight={best} onHover={setDay} />
  </StatTile>
  <StatTile icon="target" label="Win rate" period="30 days" value="34%" delta={6} note="112 won of 329 closed">
    <DotMatrix value={34} />
  </StatTile>
  <StatTile icon="clock" label="Avg cycle" period="vs last quarter" value="41 days" delta={-9} invert note="4 days faster than last quarter">
    <RangeTrack min={30} max={60} now={41} was={45} unit="d" />
  </StatTile>
</StatTiles>`});
stat.demos.splice(1,0,{t:'Compact tiles',c:'stretch',d:'The same anatomy at the height of a plain stat: the picture sits beside the number. Every dashboard screen uses these.',
 h:`<div class="grid3" style="grid-template-columns:repeat(auto-fit,minmax(min(210px,100%),1fr));width:100%">${[{icon:'dollar',label:'Total revenue',value:'$911,704',d:16.5,sub:'<b>40%</b> above industry avg.'},{icon:'target',label:'SLA met',value:'94%',d:3,sub:'Target 90%'},{icon:'inbox',label:'Orders',value:'39,646',d:-11.2,sub:'Consider A/B testing'}].map(i=>T.statTile({...i,c:'card',tail:H.delta(i.d)})).join('')}</div>`,
 jsx:`<StatTile compact icon="dollar" label="Total revenue" value="$911,704" delta={16.5} note="40% above industry avg.">
  <MiniBars data={revenueByWeek} highlight={11} />
</StatTile>
<StatTile compact icon="target" label="SLA met" value="94%" delta={3} note="Target 90%">
  <TargetSegments value={94} segments={12} />
</StatTile>`});
stat.p='.stiles|class|—|Strip of tiles; wraps when narrow;.stile|class|—|One tile;.sseg|class|—|Segments toward a target;.sbars|class|—|Bars by period; move across to read one;.sdots|class|—|A share as lit squares;.srange|class|—|Now against before on a scale;.stile.side|modifier|—|Compact: picture beside the number;.sseg.mini · .sbars.mini|modifier|—|Small pictures for compact tiles;.stat|class|—|Plain stack;.delta.up · .down · .flat|class|—|Change; green is the good direction';
use('stat','StatTile Stat','StatTiles, StatTile, TargetSegments, MiniBars, DotMatrix, RangeTrack, StatRow, Stat',stat.demos[0].jsx);

/* =====================================================================  behaviours */
setInterval(()=>$$('[data-secs]').forEach(el=>{ let s=(+el.dataset.secs||0)+1; if(s>59) s=+el.dataset.from||0; el.dataset.secs=s; el.textContent=s+'s'; }),1000);
document.addEventListener('click',e=>{
  const t=e.target; let el;
  /* composer */
  if(el=t.closest('[data-insert]')){ const c=el.closest('[data-composer]'), ta=c.querySelector('textarea'); ta.value=ta.value.replace(/[@/]$/,'')+el.dataset.insert; el.closest('.pop').hidden=true; ta.focus(); ev(ta); return; }
  if(el=t.closest('[data-dictate]')){ const c=el.closest('[data-composer]'), d=c.querySelector('.dictate'), ta=c.querySelector('textarea'), on=d.hidden; d.hidden=!on; el.setAttribute('aria-pressed',on); el.classList.toggle('accent',on); el.classList.toggle('ghost',!on);
    if(on){ const tm=d.querySelector('[data-timer]'); tm.dataset.timer=0; tm.textContent='00:00'; } else { ta.value=(ta.value?ta.value.replace(/\s*$/,' '):'')+'Which deals went quiet this week?'; ev(ta); ta.focus(); } return; }
  if(el=t.closest('.csend')){ const ta=el.closest('[data-composer]').querySelector('textarea'); ta.value=''; ev(ta); return; }
  /* recommendation */
  if(el=t.closest('[data-alts]')){ const box=el.closest('.rec').querySelector('.rec-alts'); box.hidden=!box.hidden; el.setAttribute('aria-expanded',!box.hidden); return; }
  if(el=t.closest('.rec-alt')){ const c=el.closest('.rec'), title=c.querySelector('[data-rectitle]'), sc=c.querySelector('[data-recscore]'), old=[title.textContent,sc.dataset.v];
    title.textContent=el.dataset.alt; sc.dataset.v=el.dataset.score; sc.innerHTML=scoreInner(+el.dataset.score); el.dataset.alt=old[0]; el.dataset.score=old[1]; el.innerHTML=altInner(old[0],+old[1]);
    c.querySelector('.rec-alts').hidden=true; c.querySelector('[data-alts]').setAttribute('aria-expanded','false'); const a=c.querySelector('[data-accept]'); c.classList.remove('accepted'); a.classList.add('primary'); a.querySelector('span').textContent='Accept'; return; }
  if(el=t.closest('[data-accept]')){ const on=el.closest('.rec').classList.toggle('accepted'); el.classList.toggle('primary',!on); el.querySelector('span').textContent=on?'Accepted':'Accept'; return; }
  /* flowchart */
  if(el=t.closest('.fnode')){ $$('.fnode',el.closest('[data-flow]')).forEach(n=>n.setAttribute('aria-pressed',n===el)); return; }
  if(el=t.closest('[data-fadd]')){ const n=+(el.dataset.n||0), x=FADD[n%FADD.length]; el.previousElementSibling.insertAdjacentHTML('beforebegin',`<span class="flink"></span>${fnode('act',x[0],x[1],x[2],false,'new')}`); el.dataset.n=n+1; if(n+1>=FADD.length) el.disabled=true; return; }
  /* fine-tune */
  if(el=t.closest('[data-tune-set]')){ const c=el.closest('[data-tune]'), P={softer:{r:36,o:86},compact:{w:128,h:64},reset:{w:160,h:96,r:16,o:100}}[el.dataset.tuneSet]; Object.entries(P).forEach(([k,v])=>{ const i=c.querySelector(`input[data-prop="${k}"]`); i.value=v; ev(i); }); return; }
  /* records table: sort */
  if(el=t.closest('[data-sorttable] th button.sort')){ const th=el.closest('th'), tbl=el.closest('table'), k=[...th.parentElement.children].indexOf(th), dir=th.getAttribute('aria-sort')==='ascending'?'descending':'ascending', num=el.dataset.type==='num';
    $$('th',tbl).forEach(x=>{ x.removeAttribute('aria-sort'); const ic=x.querySelector('.sort .ic'); if(ic) ic.outerHTML=I('chevs',12); });
    th.setAttribute('aria-sort',dir); el.querySelector('.ic').outerHTML=I(dir==='ascending'?'arrow-up':'arrow-down',12);
    const body=tbl.tBodies[0], rows=[...body.rows], val=r=>{ const c=r.cells[k], v=c.dataset.v??c.textContent.trim(); return num?+v:v.toLowerCase(); };
    flip(rows,()=>rows.sort((a,b)=>(val(a)>val(b)?1:val(a)<val(b)?-1:0)*(dir==='ascending'?1:-1)).forEach(r=>body.appendChild(r))); return; }
  /* filter table */
  if(el=t.closest('[data-ftable] .chip[data-f]')){ const host=el.closest('[data-ftable]'), f=el.dataset.f, rows=$$('.ft-row',host); $$('.chip[data-f]',host).forEach(c=>c.setAttribute('aria-pressed',c===el));
    flip(rows,()=>rows.forEach(r=>r.hidden=f!=='all'&&r.dataset.status!==f)); host.querySelector('[data-ft-count]').textContent=`${rows.filter(r=>!r.hidden).length} of ${rows.length} tasks`; return; }
});
document.addEventListener('input',e=>{
  const t=e.target; if(!t.closest) return;
  const c=t.closest('[data-composer]');
  if(c&&t.tagName==='TEXTAREA'){ const v=t.value, s=c.querySelector('.csend'), has=!!v.trim(); s.disabled=!has; s.classList.toggle('primary',has); s.classList.toggle('ghost',!has);
    const open=k=>{ const p=c.querySelector(`[data-menu="${k}"]`).parentElement.querySelector('.pop'); $$('.anchor>.pop',c).forEach(x=>x.hidden=x!==p); };
    if(v.endsWith('@')) open('src'); else if(v==='/') open('cmd'); return; }
  const tn=t.closest('[data-tune]'); if(tn&&t.type==='range') tuneSync(tn);
});
document.addEventListener('keydown',e=>{ const t=e.target; if((e.key==='Enter'||e.key===' ')&&t.matches&&t.matches('.trow-h')){ e.preventDefault(); t.click(); } });
})();
