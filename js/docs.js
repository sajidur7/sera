/* Overview, guides and foundations. */
(function(){
'use strict';
const T=window.T, I=T.I, H=T.H;
const head=(eb,t,d)=>`<header class="ph"><div class="eyebrow">${eb}</div><h1>${t}</h1><p>${d}</p></header>`;
const sec=(n,t,d,body)=>`<section class="demo"><div class="demo-h"><span class="demo-n">${n}</span><h3>${t}</h3>${d?`<p>${d}</p>`:''}</div>${body}</section>`;
const plainStage=(body,c='')=>`<div class="stage"><div class="stage-body plain ${c}" style="padding:28px">${body}</div></div>`;
const cb=(file,src)=>`<div class="codeblock"><header><span>${file}</span>${H.copy(src.replace(/<[^>]+>/g,''),'ghost xs')}</header><pre>${H.esc(src)}</pre></div>`;

/* ---------------- Get started ---------------- */
T.reg('Get started',[
{s:'overview',n:'Overview',render(){
  const comps=T.groups.filter(g=>g.kind==='c'), total=comps.reduce((a,g)=>a+g.pages.length,0), scrN=T.groups.filter(g=>g.kind==='screen').reduce((a,g)=>a+g.pages.length,0);
  const go=[['installation','download','Installation','Create an app or add Sera to yours.'],['components','grid','Components',`${total} components in ${comps.length} groups, each with StyleX source.`],['screens','web','Screens',`${scrN} product screens built only from Sera.`],['themes','palette','Themes','Dark and light, five accent presets.']];
  return `<header class="ph"><h1 class="ph-logo">${T.logo(52)}</h1><div class="pmeta">React + StyleX · source you own</div></header>
  <p class="lede">A calm, exact design system for product UI. Every component is React + StyleX source you own — copy it in, or start a new app with one script. Dark and light come from the same tokens.</p>
  <div class="row wrap" style="gap:8px;margin-bottom:34px">${H.btn('Get started','primary','','arrow-right','onclick="location.hash=\'installation\'"')}${H.btn('Browse components','','','','onclick="location.hash=\'components\'"')}</div>
  <div class="grid2" style="grid-template-columns:repeat(auto-fit,minmax(min(230px,100%),1fr))">${go.map(g=>`<a class="card click" href="#${g[0]}" style="padding:18px"><span class="bmark" style="background:var(--raised-2);color:var(--fg)">${I(g[1],16)}</span><b style="display:block;margin-top:16px;font-weight:600">${g[2]}</b><span class="t-small">${g[3]}</span></a>`).join('')}</div>
  <section class="ov-sec"><div class="ov-h"><h2>Foundations</h2><span class="rule"></span></div><div class="tiles">${T.groups.find(x=>x.name==='Foundations').pages.map(p=>`<a class="tile" href="#${p.s}"><div class="tile-prev"><div style="transform:translate(-50%,-50%) scale(.9);width:100%">${p.tile}</div></div><div class="tile-name">${p.n}</div></a>`).join('')}</div></section>`;
}},
{s:'installation',n:'Installation',render(){
  const F=T.files||{}, f=(n)=>F[n]||'';
  const cbf=(file,src,lang)=>`<div class="codeblock src"><header><span>${file}</span>${H.copy(src,'ghost xs')}</header><pre>${T.hlJS(src)}</pre></div>`;
  return head('Get started','Installation','Sera is React + StyleX source you own, like a component kit you copy in — no package to install from a registry. Both paths below were built and run from a clean folder.')+
  sec('A','Create a new app','Fastest. One script writes a Vite + React 19 + StyleX project with every component. Works on macOS, Windows and Linux (Node 20+).',
   `<div class="card pad row wrap" style="gap:14px;align-items:center;margin-bottom:12px"><span class="bmark" style="background:var(--accent)">${I('term',16)}</span><div class="grow"><b>create-sera.mjs</b><div class="t-small">One file · writes 26 files · React 19 · Vite 7 · StyleX 0.19 · TypeScript</div></div><a class="btn" href="create-sera.mjs" target="_blank" rel="noopener">${I('ext',16)}<span>Open file</span></a><button class="btn primary" data-copy-installer>${I('copy',16)}<span>Copy script</span></button></div>`+
   cbf('terminal',`// 1. paste the copied script into a file named create-sera.mjs, then:\nnode create-sera.mjs my-app\ncd my-app\nnpm install\nnpm run dev      // http://localhost:5173`)+
   `<p class="t-small" style="margin-top:10px">Already have a Vite + React app? <code class="code">node create-sera.mjs --only-src</code> writes just <code class="code">src/sera/</code>, then do steps 1–3 below.</p>`)+
  sec('B','Add to an existing Vite + React app','Four steps.',
   `<div class="vstack" style="gap:14px">
   <div class="demo-h" style="margin:0"><span class="demo-n">1</span><h3>Install StyleX</h3></div>${cbf('terminal','npm i @stylexjs/stylex\nnpm i -D @stylexjs/unplugin')}
   <div class="demo-h" style="margin:0"><span class="demo-n">2</span><h3>Add the plugin</h3><p>StyleX goes before React.</p></div>${cbf('vite.config.ts',f('vite.config.ts'))}
   <div class="demo-h" style="margin:0"><span class="demo-n">3</span><h3>Target modern browsers</h3><p>Keeps <code class="code">light-dark()</code> intact instead of polyfilling it. Add to package.json.</p></div>${cbf('package.json',`"browserslist": ["chrome >= 123", "edge >= 123", "safari >= 17.5", "firefox >= 120"]`)}
   <div class="demo-h" style="margin:0"><span class="demo-n">4</span><h3>Copy the files and import the base</h3><p>Put the folder at <code class="code">src/sera/</code>, then import the base stylesheet once.</p></div>${cbf('src/main.tsx',`import "./sera/global.css";  // base + gives StyleX a CSS file to append to\nimport { Button } from "./sera";`)}
   </div>`)+
  sec('C','Dev styles','In dev, StyleX serves its CSS from a virtual file. Add these two lines to index.html (the starter already has them).',cbf('index.html',`<link rel="stylesheet" href="/virtual:stylex.css" />\n<script type="module">import("virtual:stylex:runtime");</script>`))+
  sec('D','Theme and accent','',cbf('App.tsx',`import { ThemeToggle, Theme } from "./sera";\n\n<ThemeToggle />                      // light · dark · auto, remembered\n<Theme preset="ember"><App /></Theme>  // violet · ember · moss · ocean · graphite`))+
  sec('E','Files in src/sera','',`<div class="list">${Object.keys(F).filter(n=>/\.(tsx?|css)$/.test(n)&&!n.includes('/')&&n!=='vite.config.ts').map((n,i)=>`<div class="li" style="min-height:44px">${I('file',16)}<b class="grow mono" style="font-size:13px;font-weight:400">${n}</b><span class="t-small">${F[n].split('\n').length} lines</span>${H.copy(F[n],'ghost xs')}</div>`).join('')}</div>`)+
  `<section class="props"><h2>Two traps we hit, already handled</h2><div class="vstack"><div class="alert warn">${I('alert',18)}<div><b>No CSS file → no styles in production</b><p>The StyleX plugin appends its rules to a CSS file Vite emits. Importing global.css guarantees there is one.</p></div></div><div class="alert warn">${I('alert',18)}<div><b>Colours turn transparent</b><p>Without the browserslist targets, the build polyfills light-dark() with variables that never get set. Keep step 3.</p></div></div></div></section>`;
}},
{s:'agents',n:'AI agents',render(){
  const rules=[['Use tokens, never hex','Colours come from --fg, --surface, --accent and friends. A raw hex breaks the light theme.'],
  ['One primary per view','.btn.primary is the inverse pill. Use it once; everything else is secondary or ghost.'],
  ['Accent is a signal','Violet marks selection, focus and the single most important number. Not decoration.'],
  ['Small radii','Controls 8px, cards 12px, dialogs 14px. Only switches, badges and progress tracks are fully round.'],
  ['Dashed means structure','Dashed rules separate sections and timelines. Solid lines separate rows.'],
  ['Rows are level','Cards in a row stretch to the same height; push footers down with margin-top:auto.'],
  ['Compose, don’t restyle','Use component props first (variant, size, tone). Add one-off styles through the xstyle prop with stylex.create — never inline hex.'],
  ['Import from the barrel','import { Button } from "./sera" — the files are owned by the app, so edit them in place instead of wrapping.'],
  ['Keys as icons','Command, Shift, Option, Enter and Delete are drawn as icons, never typed as symbols or words.']];
  return head('Get started','AI agents','Rules an agent should follow when it builds with Sera. Paste them into your agent instructions.')+
  `<div class="list">${rules.map((r,i)=>`<div class="li"><span class="demo-n" style="width:22px">${String(i+1).padStart(2,'0')}</span><div class="grow"><b>${r[0]}</b><small style="white-space:normal">${r[1]}</small></div></div>`).join('')}</div>`+
  `<div style="margin-top:22px">${cb('AGENTS.md','# Sera rules\n'+rules.map((r,i)=>`${i+1}. ${r[0]} — ${r[1]}`).join('\n'))}</div>`;
}},
],'doc','Get started');

/* ---------------- Foundations ---------------- */
const TOK={
 Ground:[['bg','#0c0c0f','#f1f1f4'],['panel','#111114','#f8f8fa'],['surface','#17171b','#ffffff'],['raised','#1e1e23','#ffffff'],['sunken','#0f0f12','#e9e9ee'],['well','#141418','#f4f4f7']],
 Ink:[['fg','#efeff3','#121216'],['fg-2','#b8b8c2','#43434d'],['fg-3','#8a8a95','#6b6b77'],['fg-4','#5b5b66','#a0a0ab'],['inv','#f3f3f6','#141418'],['on-inv','#0c0c0f','#fafafa']],
 Signal:[['accent','#a988ee','#7e4fc4'],['ok','#4fd07d','#1d9a52'],['warn','#eab452','#b7791f'],['bad','#f0615a','#d4443d'],['info','#6ea2ff','#3568d8']],
 Categorical:[['c1','#a988ee','#7e4fc4'],['c2','#6d8cff','#4a68ee'],['c3','#9cc4ff','#7fb0f3'],['c4','#f0c46b','#dba23c'],['c5','#ef7d70','#df6457'],['c6','#6fd6aa','#38b688']],
};
const swatch=t=>`<div class="swatch-card"><div class="sw" style="background:var(--${t[0]})"></div><div class="sm"><b>--${t[0]}</b><code>${t[1]} · ${t[2]}</code></div></div>`;
T.reg('Foundations',[
{s:'color',n:'Color',tile:`<div class="row" style="gap:6px;justify-content:center">${['bg','surface','raised','fg','accent','ok','warn','bad'].map(c=>`<span style="width:34px;height:64px;border-radius:12px;background:var(--${c});box-shadow:inset 0 0 0 1px var(--line-2)"></span>`).join('')}</div>`,
 render(){ return head('Foundations','Color','Near-black grounds stepped by a few percent, four steps of ink, one violet accent and four signals. Values shown as dark · light.')+
  Object.entries(TOK).map(([g,ts],i)=>sec(String(i+1).padStart(2,'0'),g,{Ground:'Each step is one layer up. Never skip two.',Ink:'Body text is fg-2; fg is for things you act on.',Signal:'Soft fills are 14% of the signal over the surface.',Categorical:'For charts and tags, in this order.'}[g],`<div class="swgrid">${ts.map(swatch).join('')}</div>`)).join('')+
  sec('05','Soft tags','Every categorical colour has a soft tag built with color-mix, readable in both themes.',plainStage(`<div class="row wrap" style="gap:8px">${['violet','blue','sky','sand','coral','mint',''].map(c=>H.tag(c||'neutral',c)).join('')}</div>`));
 }},
{s:'typography',n:'Typography',tile:`<div style="text-align:center"><div class="t-display">Aa</div><div class="t-label" style="margin-top:8px">Inter · JetBrains Mono</div></div>`,
 render(){ const rows=[['t-display','Display','44 / 1.0 / 600 / −4.5%'],['t-h1','Heading 1','30 / 1.1 / 600 / −3.5%'],['t-h2','Heading 2','22 / 1.2 / 600 / −2.5%'],['t-h3','Heading 3','17 / 1.3 / 600 / −1.5%'],['t-body','Body — the quick brown fox jumps over the lazy dog.','14 / 1.55 / 400'],['t-small','Small — supporting text and captions.','12.5 / 1.5 / 400'],['t-label','Label · mono caps','10.5 / mono / 500 / +8%']];
  return head('Foundations','Typography','Inter for everything you read, JetBrains Mono for labels, numbers in code and keys. Tight tracking on big sizes; tabular figures on data.')+
  sec('01','Scale','',`<div class="list">${rows.map(r=>`<div class="li" style="align-items:baseline;gap:20px;flex-wrap:wrap"><span class="${r[0]} grow" style="min-width:min(260px,100%)">${r[1]}</span><code class="code">${r[2]}</code></div>`).join('')}</div>`)+
  sec('02','Families','',`<div class="grid2" style="grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr))">${H.card('',`<div class="t-label">Sans</div><div style="font-size:54px;font-weight:600;letter-spacing:-.04em;margin:8px 0">Inter</div><div class="t-muted">400 · 500 · 600 · 700</div>`)}${H.card('',`<div class="t-label">Mono</div><div class="mono" style="font-size:44px;margin:12px 0">JetBrains</div><div class="t-muted">400 · 500</div>`)}</div>`)+
  sec('03','Numbers','Tabular figures keep columns still while values change.',plainStage(`<div class="statrow">${[['Revenue','$48,210',8],['Deals won','1,184',3],['Churn','1.9%',-2]].map(s=>`<div class="stat"><span class="lab">${s[0]}</span><span class="val">${s[1]}</span>${H.delta(s[2])}</div>`).join('')}</div>`));
 }},
{s:'spacing',n:'Spacing & Radius',tile:`<div class="row" style="gap:8px;align-items:flex-end;justify-content:center">${[6,8,12,16,22,28].map(r=>`<span style="width:40px;height:40px;border-radius:${r}px;background:var(--raised);box-shadow:inset 0 0 0 1px var(--line-3)"></span>`).join('')}</div>`,
 render(){ const sp=[2,4,6,8,10,12,14,16,20,24,32,40,56];
  return head('Foundations','Spacing & Radius','A 2px-based spacing scale and seven radii. Controls are pills; surfaces get rounder as they get bigger.')+
  sec('01','Spacing','',`<div class="list">${sp.map(s=>`<div class="li" style="min-height:40px;gap:16px"><code class="code" style="width:52px;text-align:center">${s}</code><span style="height:10px;width:${s*4}px;border-radius:3px;background:var(--accent)"></span></div>`).join('')}</div>`)+
  sec('02','Radius','',plainStage(`<div class="row wrap" style="gap:16px;justify-content:center">${[['xs',6],['sm',8],['md',12],['lg',16],['xl',22],['2xl',28],['pill',999]].map(r=>`<div class="vstack" style="align-items:center;gap:8px"><span style="width:72px;height:72px;border-radius:${r[1]}px;background:var(--raised);box-shadow:inset 0 0 0 1px var(--line-3)"></span><code class="code">--r-${r[0]}</code></div>`).join('')}</div>`))+
  sec('03','Nesting','Inner radius = outer radius − padding. Bezel 22 with 4 padding holds an 18 surface.',plainStage(`<div class="bezel" style="width:min(380px,100%)"><div class="bz-h">Outer 22 · padding 4</div><div class="bz-b">Inner 18</div></div>`));
 }},
{s:'elevation',n:'Elevation',tile:`<div style="position:relative;width:240px;height:110px">${['sunken','panel','surface','raised'].map((c,i)=>`<span style="position:absolute;left:${i*30}px;top:${i*14}px;width:120px;height:66px;border-radius:10px;background:var(--${c});box-shadow:inset 0 0 0 1px var(--line-2),var(--shadow-card)"></span>`).join('')}</div>`,
 render(){ const lv=[['sunken','Wells, tracks, inputs','inset line'],['panel','Stages, the rail, app chrome','inset line'],['surface','Cards and tables','hairline, no shadow'],['raised','Buttons, menus, dialogs','lift highlight'],['pop','Floating layers','ring + deep drop']];
  return head('Foundations','Elevation','Five layers. Cards and tables stay flat on a hairline; only floating layers cast a shadow, and only buttons get the bevel.')+
  sec('01','Layers','',plainStage(`<div class="grid3" style="grid-template-columns:repeat(auto-fit,minmax(min(160px,100%),1fr));width:100%">${lv.map(l=>`<div style="height:130px;border-radius:12px;padding:14px;display:flex;flex-direction:column;justify-content:flex-end;background:var(--${l[0]==='pop'?'raised':l[0]});box-shadow:${l[0]==='pop'?'var(--shadow-pop)':l[0]==='surface'?'inset 0 0 0 1px var(--line),var(--shadow-card)':l[0]==='raised'?'inset 0 0 0 1px var(--line-2),var(--lift)':'inset 0 0 0 1px var(--line)'}"><b>${l[0]}</b><span class="t-small">${l[1]}</span></div>`).join('')}</div>`))+
  sec('02','Bevel','Buttons are the one raised thing: a dark outer ring and a 1px top highlight, so they read as pressable. Segments, chips and cards stay flat.',plainStage(`<div class="row wrap" style="gap:10px;justify-content:center">${H.btn('Secondary')}${H.btn('Primary','primary')}${H.btn('Accent','accent')}${H.seg(['Day','Week','Month'],1)}</div>`));
 }},
{s:'motion',n:'Motion & Sound',tile:`<div class="row" style="gap:14px;justify-content:center">${H.pix('drive','lg')}${H.pix('orbit','lg accent')}${H.pix('scan','lg')}</div>`,
 render(){ return head('Foundations','Motion & Sound','One spring for things you touch, one ease for things that move on their own. A soft click, off by default, for people who like to hear it.')+
  sec('01','Curves','',`<div class="tablewrap"><table class="ptable"><thead><tr><th>Token</th><th>Value</th><th>Use</th></tr></thead><tbody><tr><td>--spring</td><td><code>cubic-bezier(.34,1.56,.64,1)</code></td><td>Press, pop-in, switches, toasts</td></tr><tr><td>--ease</td><td><code>cubic-bezier(.2,.7,.2,1)</code></td><td>Drawers, progress, scroll</td></tr><tr><td>--dur</td><td><code>.18s</code></td><td>Colour and border changes</td></tr><tr><td>press</td><td><code>scale(.95)</code></td><td>Every button and segment</td></tr></tbody></table></div>`)+
  sec('02','Try the spring','Press and hold.',plainStage(`<div class="row wrap" style="gap:10px;justify-content:center">${H.btn('Press me','primary lg')}${H.btn('And me','lg')}${H.sw(true)}${H.chk('Check',true)}</div>`))+
  sec('03','Loaders','Pixel grids are the signature loader: nine squares, four patterns.',plainStage(`<div class="row wrap" style="gap:28px;justify-content:center">${['drive','orbit','scan','dots'].map(v=>`<div class="vstack" style="align-items:center;gap:10px">${H.pix(v,'lg')}<code class="code">${v}</code></div>`).join('')}</div>`))+
  sec('04','Sound','Turn on the click with the speaker switch at the bottom of the left rail, then press anything.',plainStage(`<div class="row wrap" style="gap:10px;justify-content:center;align-items:center">${I('vol',18)}<span class="t-muted">Short triangle tick · 70ms · −21dB</span></div>`));
 }},
{s:'themes',n:'Themes',tile:`<div class="row" style="gap:8px;justify-content:center">${T.presets.map(p=>`<span style="width:30px;height:64px;border-radius:8px;background:${p[2]}"></span>`).join('')}</div>`,
 render(){ const sample=`<div class="card pad vstack" style="gap:12px;width:100%"><div class="row"><span class="t-small grow">Win rate · 30 days</span>${H.tag('Insight','violet pill')}</div><div class="row" style="justify-content:space-between;align-items:flex-end"><div class="stat"><span class="val">34%</span>${H.delta(6)}</div>${T.ch.spark({d:T.ch.series(18,20,6,.8,4),w:150,h:44})}</div>${H.bar(64)}<div class="row">${H.sw(true,'accent')}${H.chk('Notify',true)}<span class="grow"></span>${H.btn('Open','accent sm','','arrow-right')}</div></div>`;
  return head('Foundations','Themes','One attribute re-keys the accent across every component, chart and focus ring, in dark and light. Pick one — the whole site follows, and it’s remembered.')+
  sec('01','Presets','',`<div class="grid3" style="grid-template-columns:repeat(auto-fit,minmax(min(170px,100%),1fr))">${T.presets.map(p=>`<button class="preset-card" data-preset-btn="${p[0]}" aria-pressed="${T.preset()===p[0]}"><span style="height:56px;border-radius:10px;background:linear-gradient(135deg,${p[2]},color-mix(in srgb,${p[2]} 40%,#000))"></span><span class="row"><b class="grow">${p[1]}</b><code class="code" style="font-size:11px">${p[0]}</code></span></button>`).join('')}</div>`)+
  sec('02','Live sample','Every piece below reads --accent.',`<div class="stage"><div class="stage-body plain" style="padding:28px"><div style="width:min(420px,100%)">${sample}</div></div></div>`)+
  sec('03','Use it','',cb('theme.js',`document.documentElement.dataset.preset = 'ember'; // violet · ember · moss · ocean · graphite\nT.setPreset('ocean');                              // same, and remembered`));
 }},
{s:'iconography',n:'Iconography',tile:`<div class="row wrap" style="gap:14px;justify-content:center;width:220px;margin:auto">${['home','search','bell','user','chart','flow','calendar','mail','bot','zap'].map(n=>I(n,22)).join('')}</div>`,
 render(){ return head('Foundations','Iconography',`${Object.keys(T.icons).length} line icons on a 24px grid with a 1.8 stroke and round joins. Click one to copy its name.`)+
  `<div class="rail-search" style="max-width:320px;margin:22px 0 14px">${I('search',14)}<input data-filter="#iconhost" placeholder="Filter icons"></div><div id="iconhost" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:8px">${Object.keys(T.icons).map(n=>`<button data-item data-copy-icon="${n}" title="Copy SVG" aria-label="Copy ${n} icon as SVG" class="card" style="height:92px;border:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:var(--fg-2)">${I(n,22)}<span class="mono" style="font-size:11px;color:var(--fg-4)">${n}</span></button>`).join('')}</div>`;
 }},
],'doc','Foundations');

T.reg('Library',[{s:'components',n:'All components',wide:true,render(){
  const comps=T.groups.filter(g=>g.kind==='c');
  return `<section class="lib-hero"><h1>Browse the library</h1><p>Every component, with copy-ready React + StyleX source for every variant and state.</p><div class="row" style="gap:8px">${H.btn('Install','primary','','','onclick="location.hash=\'installation\'"')}${H.btn('Themes','','palette','','onclick="location.hash=\'themes\'"')}</div></section>
  ${comps.map(g=>`<section class="ov-sec"><div class="ov-h"><h2>${g.name}</h2><span class="rule"></span><span class="cnt">${g.pages.length}</span></div><div class="tiles">${g.pages.map(T.tile).join('')}</div></section>`).join('')}`;
}}],'doc','Components');
T.reg('All screens',[{s:'screens',n:'All screens',wide:true,render(){
  const gs=T.groups.filter(g=>g.kind==='screen'), n=gs.reduce((a,g)=>a+g.pages.length,0);
  return `<section class="lib-hero"><h1>Screens</h1><p>${n} product screens across ${gs.length} kinds of app, built only from Sera parts. Open one to see it full size.</p></section>
  ${gs.map(g=>`<section class="ov-sec"><div class="ov-h"><h2>${g.name}</h2><span class="rule"></span><span class="cnt">${g.pages.length}</span></div><div class="tiles">${g.pages.map(T.tile).join('')}</div></section>`).join('')}`;
}}],'doc','Screens');
})();
