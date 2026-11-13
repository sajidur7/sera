/* Table & List · Data & Charts · Utility */
(function(){
'use strict';
const T=window.T, I=T.I, H=T.H, ch=T.ch;
const stageTag={Lead:'',Qualified:'sky',Proposal:'blue',Negotiation:'violet',Won:'mint',Lost:'coral',Stalled:'sand'};
T.deals=[['Halden Freight','halden.com',84000,'Negotiation',0,'Dec 18',.72],['Mira Labs','mira.io',52000,'Proposal',1,'Dec 04',.41],['Oakline','oakline.co',40000,'Stalled',2,'Nov 29',.81],['Brightwater','brightwater.org',126000,'Qualified',3,'Jan 22',.22],['Northfield Co','northfield.co',18500,'Won',4,'Nov 08',.05],['Kestrel AI','kestrel.ai',67000,'Negotiation',5,'Dec 11',.33],['Pallas Group','pallas.com',31000,'Lead',6,'Feb 03',.18]];
T.dealsTable=(n=6,sel=true,spark=false)=>`<table class="tbl"><thead><tr>${sel?`<th style="width:44px">${H.chk('')}</th>`:''}<th><button class="sort">Company ${I('chevs',12)}</button></th><th>Stage</th><th>Owner</th><th class="r"><button class="sort">Value ${I('arrow-down',12)}</button></th>${spark?'<th>Activity</th>':''}<th>Risk</th><th>Close</th></tr></thead><tbody>${T.deals.slice(0,n).map((d,k)=>`<tr aria-selected="false">${sel?`<td>${H.chk('')}</td>`:''}<td><div class="who"><span class="av sm sq" style="--t:var(--c${k%6+1})">${d[0][0]}</span><div><b>${d[0]}</b><small>${d[1]}</small></div></div></td><td>${H.tag(d[3],stageTag[d[3]])}</td><td><span class="row" style="gap:8px">${H.av(d[4],'xs')}${T.people[d[4]][0].split(' ')[0]}</span></td><td class="r" style="color:var(--fg);font-weight:500">$${d[2].toLocaleString()}</td>${spark?`<td>${ch.spark({d:ch.series(14,20,8,k%2?.6:-.4,k+3),w:90,h:26,c:k%2?'c6':'c5',area:false})}</td>`:''}<td><span class="row" style="gap:8px"><span class="segbar" style="width:54px">${[0,1,2,3].map(j=>`<i class="${j<Math.round(d[6]*4)?'on':''}" style="${j<Math.round(d[6]*4)?`background:var(--${d[6]>.6?'bad':d[6]>.3?'warn':'ok'})`:''}"></i>`).join('')}</span><span class="num t-small">${d[6].toFixed(2)}</span></span></td><td class="num">${d[5]}</td></tr>`).join('')}</tbody></table>`;
const selbar=`<div class="selbar" data-selbar hidden style="position:absolute;left:50%;bottom:16px;transform:translateX(-50%);z-index:4"><b data-selcount>0</b>&nbsp;selected<span class="vr"></span>${H.btn('Assign','sm','user')}${H.btn('Move','sm','arrow-right')}${H.btn('Archive','sm','archive')}<span class="vr"></span>${H.ib('x','sm','Clear')}</div>`;
const leg=(parts)=>ch.legend(parts);

T.reg('Table & List',[
{s:'table',n:'Data Table',c:'.tbl  .tblwrap',d:'Sortable headers, row selection with a floating toolbar, avatars, stage tags and a risk meter. Tick a few rows.',
 demos:[{t:'Deals',c:'bleed',h:`<div style="position:relative;width:100%;padding:0 12px 12px"><div class="tblwrap">${T.dealsTable(6,true,true)}</div>${selbar}</div>`}],
 p:'.tbl|class|—|Table;.tblwrap|class|—|Rounded scroll container;thead [role=checkbox]|attribute|—|Select all (mixed when partial);tr[aria-selected]|attribute|—|Selected row;.r|class|—|Right-aligned number'},
{s:'table-primitives',n:'Table',c:'.tbl',d:'The plain table: header on a well, 52px rows, hover highlight, numbers right-aligned.',
 demos:[{t:'Plain',c:'bleed',h:`<div style="width:100%;padding:0 12px 12px"><div class="tblwrap"><table class="tbl"><thead><tr><th class="idx">#</th><th>Rep</th><th class="r">Deals</th><th class="r">Won</th><th class="r">Quota</th></tr></thead><tbody>${T.people.slice(0,5).map((p,k)=>`<tr><td class="idx">${String(k+1).padStart(2,'0')}</td><td><span class="row" style="gap:10px">${H.av(k,'sm')}${p[0]}</span></td><td class="r">${[14,11,9,8,6][k]}</td><td class="r">$${[412,368,290,214,180][k]}k</td><td class="r" style="width:160px"><span class="row" style="gap:8px">${H.bar([92,81,64,48,40][k],k?'':'ok')}<span class="num t-small">${[92,81,64,48,40][k]}%</span></span></td></tr>`).join('')}</tbody></table></div></div>`}],
 p:'.tbl th · td|element|—|40px head, 52px rows;.idx|class|—|Index column'},
{s:'table-selection-toolbar',n:'Table Selection Toolbar',c:'.selbar',d:'An inverse pill that floats over the table while rows are selected.',
 demos:[{t:'Toolbar',h:`<div class="selbar"><b>3</b>&nbsp;selected<span class="vr"></span>${H.btn('Assign','sm','user')}${H.btn('Move','sm','arrow-right')}${H.btn('Archive','sm','archive')}<span class="vr"></span>${H.ib('x','sm','Clear')}</div>`}],
 p:'.selbar|class|—|Floating pill;[data-selcount] · [data-selbar]|attribute|—|Wired to table selection'},
{s:'list',n:'List',c:'.list  .li',d:'Rows on a surface, divided by hairlines, with a lead, two lines of text and a trailing slot.',
 demos:[{t:'People',c:'stretch',h:`<div class="list" style="max-width:520px;margin:auto">${T.people.slice(0,4).map((p,k)=>`<div class="li btnlike">${H.av(k,'',k<2?'on':'off')}<div class="grow"><b>${p[0]}</b><small>${['Halden Freight','Mira Labs','Oakline','Brightwater'][k]} · ${['3 open deals','1 open deal','Renewal due','New lead'][k]}</small></div>${[H.tag('Champion','mint'),H.tag('Buyer','blue'),H.tag('At risk','coral'),H.tag('New','violet')][k]}${I('chev-right',16)}</div>`).join('')}</div>`}],
 p:'.list|class|—|Container;.li|class|—|Row;.btnlike|modifier|—|Hover state'},
{s:'metadata-list',n:'Metadata List',c:'dl.meta',d:'Label and value pairs on dashed rules, for detail panels.',
 demos:[{t:'Details',c:'stretch',h:`<dl class="meta" style="max-width:460px;margin:auto">${[['Stage',H.tag('Negotiation','violet')],['Value','<b>$84,000</b>'],['Owner',`${H.av(0,'xs')} Maya Okafor`],['Source',H.tag('Inbound','line')],['Created','Sep 14, 2026'],['Domain',`<a class="lnk" href="#metadata-list">halden.com</a>`]].map(r=>`<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join('')}</dl>`}],
 p:'dl.meta|class|—|Two-column grid;dt · dd|element|—|Label, value'},
{s:'overflow-list',n:'Overflow List',c:'.row + .anchor',d:'Shows what fits and folds the rest into a “+3” menu.',
 demos:[{t:'Tags',c:'tall',h:`<div class="row" style="gap:6px">${H.tag('Enterprise','violet')}${H.tag('EMEA','blue')}${H.tag('Logistics','sand')}<div class="anchor"><button class="tag line" data-pop style="border:0;cursor:pointer">+3</button><div class="pop pad" hidden style="min-width:0"><div class="row wrap" style="gap:6px;width:200px">${H.tag('Renewal','mint')}${H.tag('Q4','sky')}${H.tag('Priority','coral')}</div></div></div></div>`},
  {t:'Avatars',h:`<div class="row">${H.avs(4,'sm',9)}<span class="t-small">13 people</span></div>`}],
 p:'—|composition|—|Visible items + .pop for the rest'},
{s:'tree-list',n:'Tree List',c:'.tree  .node  .kids',d:'Nested rows with chevrons and dashed guides. Click a folder to open it.',
 demos:[{t:'Folders',c:'left',h:`<div class="tree" style="width:280px">${[['Enterprise',['Halden Freight','Brightwater','Kestrel AI'],true],['Mid-market',['Mira Labs','Oakline'],false],['Partners',['Pallas Group'],false]].map(g=>`<button class="node" aria-expanded="${g[2]}">${I('chev-right',14,'car')}${I('folder',16)}<span class="grow">${g[0]}</span><span class="t-small">${g[1].length}</span></button><div class="kids" ${g[2]?'':'hidden'}>${g[1].map(x=>`<button class="node">${I('building',15)}<span>${x}</span></button>`).join('')}</div>`).join('')}</div>`}],
 p:'.node[aria-expanded]|attribute|—|Toggle;.kids|class|—|Children with dashed guide'},
{s:'timeline',n:'Timeline',c:'.tl  .ev  .mk',d:'Events joined by a dashed line, newest first.',
 demos:[{t:'Activity',c:'left',h:`<div class="tl" style="max-width:420px">${[['mail','Email from Ines Duarte','“Can you send pricing for 400 seats?”','2h'],['phone','Call with Halden','32 min · recorded','Yesterday'],['arrow-right','Stage → Negotiation','by Maya Okafor','Nov 10'],['plus','Deal created','Inbound from the website','Sep 14']].map(e=>`<div class="ev"><span class="mk">${I(e[0],14)}</span><div><div class="row"><b class="grow">${e[1]}</b><time>${e[3]}</time></div><p>${e[2]}</p></div></div>`).join('')}</div>`}],
 p:'.tl|class|—|Container;.ev|class|—|Event;.mk|class|—|Marker'},
]);

const ser=ch.series(12,40,14,2.4,5), ser2=ch.series(12,30,12,1.2,8);
T.reg('Data & Charts',[
{s:'stat',n:'Stat',c:'.stat  .statrow  .delta',d:'A label, a big tabular number and a delta. Rows of stats share hairline dividers.',
 demos:[{t:'Row',c:'stretch',h:`<div class="statrow">${[['Pipeline','$1.24M',12],['Won · 30d','$212k',8],['Win rate','34%',6],['Cycle','41 days',-9]].map(s=>`<div class="stat"><span class="lab">${s[0]}</span><span class="val">${s[1]}</span>${H.delta(s[2])}</div>`).join('')}</div>`},
  {t:'Single',h:`<div class="card pad" style="width:240px"><div class="stat"><span class="lab">${I('dollar',14)}Revenue</span><span class="val">$48,210<small> /mo</small></span><span class="row" style="gap:6px">${H.delta(8)}<span class="t-small">vs last month</span></span></div></div>`}],
 p:'.stat|class|—|Stack;.val small|element|—|Unit;.delta.up · .down · .flat|class|—|Change'},
{s:'stat-options',n:'Stat Variants & Options',c:'.stat',d:'Trend beside or below, with a sparkline, a progress bar or a target.',
 demos:[{t:'Variants',c:'stretch',h:`<div class="grid3" style="grid-template-columns:repeat(auto-fit,minmax(min(200px,100%),1fr))">
  <div class="card pad"><div class="stat"><span class="lab">Trend beside</span><div class="row" style="justify-content:space-between;align-items:flex-end;flex-wrap:wrap"><span class="val">$212k</span>${ch.spark({d:ser,w:90,h:34})}</div>${H.delta(8)}</div></div>
  <div class="card pad"><div class="stat"><span class="lab">Toward target</span><span class="val">68%<small> of $300k</small></span>${H.bar(68)}</div></div>
  <div class="card pad"><div class="stat"><span class="lab">Compact</span><span class="row" style="gap:8px"><span class="val" style="font-size:22px">1,184</span>${H.delta(-3)}</span><span class="t-small">contacts touched</span></div></div></div>`}],
 p:'trend|side · below|side|Where the sparkline sits'},
{s:'line-chart',n:'Line & Area Chart',c:'T.ch.line()',d:'Smooth lines with a hatched area under the main series. The last point is marked.',
 demos:[{t:'Playground',c:'stretch',k:[{id:'area',l:'Area fill',t:'sw',v:true},{id:'two',l:'Compare',t:'sw',v:true},{id:'step',l:'Stepped',t:'sw',v:false}],
   h:s=>`<div class="vstack" style="width:100%">${leg([{c:'c1',l:'This year',t:'$612k'},...(s.two?[{c:'c3',l:'Last year',t:'$498k'}]:[])])}${ch.line({series:[{d:ser,c:'c1',area:s.area},...(s.two?[{d:ser2,c:'c3',dash:true,area:false}]:[])],labels:ch.months,pre:'$',step:s.step})}</div>`,
   code:s=>`T.ch.line({\n  series: [\n    { d: thisYear, c: 'c1', area: ${s.area} },${s.two?`\n    { d: lastYear, c: 'c3', dash: true },`:''}\n  ],\n  labels: T.ch.months, pre: '$'${s.step?', step: true':''}\n});`}],
 p:'series|{ d, c, area, dash }[]|—|Data and colour token;labels|string[]|—|X axis;step|boolean|false|Stepped line;pre|string|—|Value prefix'},
{s:'bar-chart',n:'Bar Chart',c:'T.ch.bar()',d:'Rounded bars. One series can highlight a single bar in violet with its value on top.',
 demos:[{t:'Playground',c:'stretch',k:[{id:'mode',l:'Mode',t:'seg',o:['single','grouped','stacked'],v:'single'}],
   h:s=>`<div class="vstack" style="width:100%">${s.mode==='single'?'':leg([{c:'c1',l:'New'},{c:'c2',l:'Expansion'},{c:'c3',l:'Renewal'}])}${s.mode==='single'?ch.bar({d:ser,labels:ch.months,hi:9,pre:'$'}):ch.bar({series:[{d:ch.series(12,20,8,1,2),c:'c1'},{d:ch.series(12,14,6,.5,4),c:'c2'},{d:ch.series(12,10,6,.3,6),c:'c3'}],labels:ch.months,stacked:s.mode==='stacked',gap:s.mode==='grouped'?.3:.42})}</div>`,
   code:s=>s.mode==='single'?`T.ch.bar({ d: revenue, labels: T.ch.months, hi: 9, pre: '$' });`:`T.ch.bar({\n  series: [{ d: newBiz, c: 'c1' }, { d: expansion, c: 'c2' }, { d: renewal, c: 'c3' }],\n  labels: T.ch.months${s.mode==='stacked'?', stacked: true':''}\n});`}],
 p:'d · series|number[] · {d,c}[]|—|Data;hi|index|—|Highlighted bar;stacked|boolean|false|Stack series'},
{s:'donut-chart',n:'Donut Chart',c:'T.ch.donut()',d:'Round-capped segments with gaps and the total in the middle.',
 demos:[{t:'Donut',h:`${ch.donut({data:[{v:42,c:'c1'},{v:26,c:'c2'},{v:18,c:'c3'},{v:14,c:'c4'}],label:'$1.24M',sub:'pipeline'})}<div class="vstack" style="gap:8px">${[['c1','Enterprise','42%'],['c2','Mid-market','26%'],['c3','SMB','18%'],['c4','Partners','14%']].map(r=>`<span class="row" style="font-size:13px;gap:10px"><i style="width:8px;height:8px;border-radius:2px;background:var(--${r[0]})"></i><span class="grow" style="min-width:100px;color:var(--fg-2)">${r[1]}</span><b class="num">${r[2]}</b></span>`).join('')}</div>`,
   code:`T.ch.donut({\n  data: [{ v: 42, c: 'c1' }, { v: 26, c: 'c2' }, { v: 18, c: 'c3' }, { v: 14, c: 'c4' }],\n  label: '$1.24M', sub: 'pipeline'\n});`}],
 p:'data|{ v, c }[]|—|Segments;label · sub|string|—|Centre text;size · th|number|180 · 18|Diameter, thickness'},
{s:'sparkline',n:'Sparkline',c:'T.ch.spark()',d:'Tiny trend lines for tables and stat cards.',
 demos:[{t:'Sparklines',h:['c1','c6','c5','c2'].map((c,k)=>ch.spark({d:ch.series(16,20,8,[1,.6,-.8,.2][k],k+2),c,w:130,h:40,area:k<2})).join(''),code:`T.ch.spark({ d: values, c: 'c6', w: 130, h: 40 });`}],
 p:'d|number[]|—|Values;c|token|c1|Colour;area|boolean|true|Fill under'},
{s:'bar-list',n:'Bar List',c:'T.ch.barlist()',d:'Ranked rows where the bar is the row background. The leader gets the accent.',
 demos:[{t:'Sources',c:'stretch',h:`<div style="max-width:520px;margin:auto">${ch.barlist([['Website',412,'globe'],['Referrals',268,'users'],['Outbound',190,'send'],['Events',96,'calendar'],['Partners',54,'flow']])}</div>`,code:`T.ch.barlist([['Website', 412, 'globe'], ['Referrals', 268, 'users'], …]);`}],
 p:'rows|[label, value, icon?][]|—|Sorted rows'},
{s:'breakdown-bar',n:'Breakdown Bar',c:'.meter',d:'One bar split into parts, with a legend underneath.',
 demos:[{t:'Breakdown',c:'col-flow stretch',h:(()=>{const p=[{c:'c1',v:42,l:'Enterprise',t:'42%'},{c:'c2',v:26,l:'Mid-market',t:'26%'},{c:'c3',v:18,l:'SMB',t:'18%'},{c:'c4',v:14,l:'Partners',t:'14%'}];return `<div style="max-width:560px;width:100%;margin:auto" class="vstack">${ch.meter(p,'thin')}${leg(p)}</div>`})(),code:`T.ch.meter(parts, 'thin') + T.ch.legend(parts);`}],
 p:'.meter.thin|class|—|12px bar;parts|{ c, v, l, t }[]|—|Segments'},
{s:'gauge-chart',n:'Gauge',c:'T.ch.gauge()',d:'A segmented arc of ticks that fills from blue to violet.',
 demos:[{t:'Playground',k:[{id:'v',l:'Value',t:'range',min:0,max:100,v:64,u:'%'}],h:s=>ch.gauge({v:s.v,sub:'quota attained'}),code:s=>`T.ch.gauge({ v: ${s.v}, sub: 'quota attained' });`}],
 p:'v|0–100|—|Value;n|number|32|Tick count;c|token|—|Single colour instead of the blend'},
{s:'heatmap',n:'Heatmap',c:'T.ch.heat()',d:'Rounded squares in five steps of the accent. Hours across, days down.',
 demos:[{t:'Activity by hour',c:'col-flow stretch',h:`<div style="display:grid;grid-template-columns:28px 1fr;gap:6px;width:100%"><div class="vstack" style="gap:3px;justify-content:space-around;font-size:10.5px;color:var(--fg-4)">${['Mon','','Wed','','Fri','','Sun'].map(d=>`<span>${d}</span>`).join('')}</div>${ch.heat({rows:7,cols:24})}</div><div class="row" style="justify-content:flex-end;gap:4px;font-size:11px;color:var(--fg-4)">Less${[0,22,45,70,100].map(p=>`<i style="width:12px;height:12px;border-radius:3px;background:${p?`color-mix(in srgb,var(--accent) ${p}%,var(--sunken))`:'var(--sunken)'}"></i>`).join('')}More</div>`,code:`T.ch.heat({ rows: 7, cols: 24 });`}],
 p:'rows · cols|number|7 · 24|Grid size;c|token|accent|Colour'},
{s:'pill-bar-chart',n:'Pill Bar Chart',c:'T.ch.pill()',d:'Capsules filling dashed tracks. The chosen period is inverse with a violet value tag.',
 demos:[{t:'Weekly',c:'stretch',h:ch.pill({d:[32,48,40,62,74,56,38],labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],hi:4}),code:`T.ch.pill({ d: [32, 48, 40, 62, 74, 56, 38], labels: days, hi: 4 });`}],
 p:'d|number[]|—|Values;hi|index|—|Highlighted pill;labels|string[]|—|Under each pill'},
{s:'value-chart',n:'Value Chart',c:'T.ch.value()',d:'An area line with a crosshair that follows the pointer and a value tag on the point.',
 demos:[{t:'Hover the chart',c:'stretch',h:`<div class="vstack" style="width:100%"><div class="row" style="justify-content:space-between"><div class="stat"><span class="lab">MRR</span><span class="val" data-vout>$48,210</span></div>${H.seg(['1M','3M','1Y'],2,'sm')}</div>${ch.value({d:ch.series(30,40000,3200,320,12),pre:'$',labels:Array.from({length:30},(_,i)=>i%5===0?`W${i+1}`:'')})}</div>`,code:`T.ch.value({ d: mrr, pre: '$', labels: weeks });`}],
 p:'d|number[]|—|Values;pre|string|—|Prefix;hi|index|68%|Initial point'},
{s:'usage-meter',n:'Usage Meter',c:'T.ch.meter()',d:'A context-style meter: coloured parts, a dotted remainder and chips that explain each part.',
 demos:[{t:'Context',c:'col-flow stretch',h:(()=>{const p=[{c:'c1',v:22,l:'Messages',t:'44k'},{c:'c2',v:9,l:'Files',t:'18k'},{c:'c4',v:6,l:'Tools',t:'12k'},{c:'free',v:63,l:'Free',t:'126k'}];return `<div class="card pad vstack" style="max-width:520px;width:100%;margin:auto;gap:12px"><div class="row"><b class="grow">Context window</b><span class="num t-small"><b style="color:var(--fg)">74k</b> / 200k</span></div>${ch.meter(p)}<div class="row wrap" style="gap:6px">${p.map(x=>`<span class="chip" style="height:26px;font-size:12px"><span class="dot" style="background:var(--${x.c==='free'?'line-3':x.c})"></span>${x.l}<b class="num" style="color:var(--fg);font-weight:500">${x.t}</b></span>`).join('')}</div></div>`})(),code:`T.ch.meter([{ c: 'c1', v: 22 }, { c: 'c2', v: 9 }, { c: 'c4', v: 6 }, { c: 'free', v: 63 }]);`}],
 p:'parts|{ c, v, l }[]|—|Use c: "free" for the dotted remainder'},
{s:'funnel-chart',n:'Funnel',c:'T.ch.funnel()',d:'Centred stages that narrow, with the step conversion between them.',
 demos:[{t:'Pipeline',c:'stretch',h:ch.funnel({d:[{l:'Leads',v:4200},{l:'Qualified',v:1680},{l:'Proposal',v:620},{l:'Negotiation',v:248},{l:'Won',v:112}]}),code:`T.ch.funnel({ d: [{ l: 'Leads', v: 4200 }, { l: 'Qualified', v: 1680 }, …] });`}],
 p:'d|{ l, v }[]|—|Stages, largest first'},
{s:'scatter-chart',n:'Scatter',c:'T.ch.scatter()',d:'Translucent dots sized by a third value, grouped by colour.',
 demos:[{t:'Deals by size and speed',c:'col-flow stretch',h:`${leg([{c:'c1',l:'Enterprise'},{c:'c2',l:'Mid-market'},{c:'c4',l:'SMB'}])}${ch.scatter()}`,code:`T.ch.scatter({ groups: [{ c: 'c1', cx: .65, cy: .62, n: 26 }, …] });`}],
 p:'groups|{ c, cx, cy, n }[]|—|Clusters'},
{s:'combo-chart',n:'Combo',c:'T.ch.combo()',d:'Bars for volume and a line for rate, each with its own axis.',
 demos:[{t:'Deals and win rate',c:'col-flow stretch',h:`${leg([{c:'c7',l:'Deals closed'},{c:'c1',l:'Win rate'}])}${ch.combo({bars:ch.series(8,30,12,2,3),line:[22,25,24,28,31,30,33,34],labels:['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov'],unit:'%'})}`,code:`T.ch.combo({ bars: deals, line: winRate, labels, unit: '%' });`}],
 p:'bars · line|number[]|—|Two series;unit|string|—|Right axis suffix'},
{s:'radar-chart',n:'Radar',c:'T.ch.radar()',d:'Two profiles on a dashed spider grid.',
 demos:[{t:'Rep skills',h:`${ch.radar({axes:['Prospecting','Discovery','Demo','Negotiation','Closing','Follow-up'],series:[{d:[.9,.7,.8,.6,.75,.95],c:'c1'},{d:[.5,.85,.6,.8,.55,.6],c:'c2'}]})}${leg([{c:'c1',l:'Maya'},{c:'c2',l:'Leo'}])}`,code:`T.ch.radar({ axes, series: [{ d: maya, c: 'c1' }, { d: leo, c: 'c2' }] });`}],
 p:'axes|string[]|—|Spokes;series|{ d, c }[]|—|Values 0–1'},
]);

T.reg('Utility',[
{s:'visually-hidden',n:'Visually Hidden',c:'.sr',d:'Text for screen readers that takes no space on screen.',
 demos:[{t:'Icon button with hidden label',h:`<button class="btn icon">${I('trash',16)}<span class="sr">Delete deal</span></button><span class="t-small">The button reads “Delete deal”.</span>`}],
 p:'.sr|class|—|Clip to 1px'},
{s:'theme',n:'Theme',c:'[data-theme]',d:'Dark first, with light. Leave it unset to follow the system, or force one on the root.',
 demos:[{t:'Switch the whole page',h:`<div class="seg" role="group" data-theme-seg>${[['dark','moon','Dark'],['light','sun','Light']].map(x=>`<button data-v="${x[0]}" aria-pressed="${T.theme()===x[0]}">${I(x[1],14)}${x[2]}</button>`).join('')}</div>${['bg','surface','raised','fg','accent'].map(c=>`<span style="width:30px;height:30px;border-radius:9px;background:var(--${c});box-shadow:inset 0 0 0 1px var(--line-2)" title="--${c}"></span>`).join('')}`,code:`T.setTheme('light'); // writes data-theme on <html>`}],
 p:'data-theme|dark · light|system|On <html>;T.setTheme()|function|—|Sets and remembers'},
{s:'hooks',n:'Hooks',c:'useEscape useMedia useHotkey useControllable',d:'Small hooks the components use, exported for your own code.',
 demos:[{t:'Hooks',c:'stretch',h:`<div class="tablewrap" style="width:100%"><table class="ptable"><thead><tr><th>Hook</th><th>Does</th></tr></thead><tbody>${[['useControllable(value, fallback, onChange)','Lets a component be controlled or uncontrolled'],['useTheme()','Reads and sets light · dark · system on html'],['useHotkey(key, fn)','Command or Ctrl + key shortcut'],['useMedia(query)','True while a media query matches'],['useEscape(active, fn)','Runs fn on Escape'],['usePopover()','close() from inside popover content'],['useToast()','Push a toast (needs ToastProvider)'],['useConfirm()','Promise-based confirm dialog']].map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('')}</tbody></table></div>`}]},
{s:'link-provider',n:'Link Provider',c:'T.link',d:'Tell Sera how your router builds links, so nav items and crumbs use it.',
 demos:[{t:'Router links',h:`<div class="crumbs"><a href="#overview">Home</a>${I('chev-right',13)}<a href="#table">Deals</a>${I('chev-right',13)}<b>Halden Freight</b></div>`,code:`T.link = (to, label) =>\n  \`<a href="\${router.href(to)}" data-router>\${label}</a>\`;`}],
 p:'T.link|(to, label) => string|hash links|Link builder'},
]);
})();
