/* Sera charts: small SVG builders that read colours from tokens, so both themes just work. */
(function(){
'use strict';
const T=window.T; let uid=0;
const ch=T.ch={};
const k=v=>Math.abs(v)>=1000?(v/1000).toFixed(Math.abs(v)>=10000?0:1).replace(/\.0$/,'')+'k':String(Math.round(v));
ch.k=k;
const niceMax=m=>{ const p=Math.pow(10,Math.floor(Math.log10(m||1))); const n=m/p; return (n<=1?1:n<=2?2:n<=2.5?2.5:n<=5?5:10)*p; };
const f=n=>Math.round(n*10)/10;
function smooth(pts,t=.17){
  let d=`M${f(pts[0][0])},${f(pts[0][1])}`;
  for(let i=0;i<pts.length-1;i++){
    const p0=pts[i-1]||pts[i],p1=pts[i],p2=pts[i+1],p3=pts[i+2]||p2;
    d+=` C${f(p1[0]+(p2[0]-p0[0])*t)},${f(p1[1]+(p2[1]-p0[1])*t)} ${f(p2[0]-(p3[0]-p1[0])*t)},${f(p2[1]-(p3[1]-p1[1])*t)} ${f(p2[0])},${f(p2[1])}`;
  }
  return d;
}
ch.series=(n,base,vol,trend=0,s=3)=>{ T.rnd(s); let v=base; return Array.from({length:n},()=>{ v+=(T.rnd()-.5)*vol+trend; return Math.max(base*.15,Math.round(v)); }); };
const hatch=(id,c,op=.32)=>`<pattern id="${id}" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5" style="stroke:var(--${c});stroke-width:1.6;opacity:${op}"/></pattern>`;
const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
ch.months=months;

function axes(o,w,h,pl,pr,pt,pb,max,min){
  let g=''; const n=o.ticks||4;
  for(let i=0;i<=n;i++){ const y=pt+(h-pt-pb)*i/n, v=max-(max-min)*i/n;
    g+=`<line x1="${pl}" x2="${w-pr}" y1="${f(y)}" y2="${f(y)}" style="stroke:var(--line-2);stroke-dasharray:${i===n?'0':'2 4'}"/>`;
    if(pl>10) g+=`<text x="${pl-8}" y="${f(y+3.5)}" text-anchor="end">${(o.pre||'')+k(v)}</text>`; }
  return g;
}
ch.line=(o={})=>{
  const w=o.w||640,h=o.h||230,pl=o.pl??36,pr=o.pr??10,pt=12,pb=o.labels?26:8, id='g'+(++uid);
  const all=o.series.flatMap(s=>s.d), max=o.max||niceMax(Math.max(...all)*1.05), min=o.min??0;
  const n=o.series[0].d.length, X=i=>pl+(w-pl-pr)*i/(n-1), Y=v=>pt+(h-pt-pb)*(1-(v-min)/(max-min));
  let defs='', body='';
  o.series.forEach((s,j)=>{
    const pts=s.d.map((v,i)=>[X(i),Y(v)]); const d=o.step?pts.map((p,i)=>(i?'L':'M')+f(p[0])+','+f(p[1])).join(' '):smooth(pts);
    if(s.area!==false&&(o.area||s.area)){ defs+=hatch(id+j,s.c||'c1')+`<linearGradient id="${id}f${j}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--${s.c||'c1'});stop-opacity:.22"/><stop offset="1" style="stop-color:var(--${s.c||'c1'});stop-opacity:0"/></linearGradient>`;
      const a=`${d} L${f(X(n-1))},${h-pb} L${pl},${h-pb} Z`;
      body+=`<path d="${a}" style="fill:url(#${id}f${j})"/><path d="${a}" style="fill:url(#${id}${j})"/>`; }
    body+=`<path d="${d}" style="fill:none;stroke:var(--${s.c||'c1'});stroke-width:${s.w||2};stroke-linecap:round;stroke-linejoin:round${s.dash?';stroke-dasharray:4 5':''}"/>`;
    if(o.dot!==false&&j===0){ const p=pts[pts.length-1]; body+=`<circle cx="${f(p[0])}" cy="${f(p[1])}" r="7" style="fill:var(--${s.c||'c1'});opacity:.18"/><circle cx="${f(p[0])}" cy="${f(p[1])}" r="3.6" style="fill:var(--surface);stroke:var(--${s.c||'c1'});stroke-width:2"/>`; }
  });
  let lab=''; if(o.labels){ const every=Math.ceil(n/(o.maxLabels||8)); o.labels.forEach((l,i)=>{ if(i%every===0||i===n-1&&o.lastLabel) lab+=`<text x="${f(X(i))}" y="${h-6}" text-anchor="${i===0?'start':i===n-1?'end':'middle'}">${l}</text>`; }); }
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="${o.aria||'Line chart'}"><defs>${defs}</defs>${axes(o,w,h,pl,pr,pt,pb,max,min)}${body}${lab}</svg>`;
};
ch.bar=(o={})=>{
  const w=o.w||640,h=o.h||230,pl=o.pl??36,pr=6,pt=12,pb=o.labels?26:8;
  const S=o.series||[{d:o.d,c:o.c||'c7'}], n=S[0].d.length, stacked=o.stacked;
  const sums=S[0].d.map((_,i)=>stacked?S.reduce((a,s)=>a+s.d[i],0):Math.max(...S.map(s=>s.d[i])));
  const max=o.max||niceMax(Math.max(...sums)*1.05), Y=v=>(h-pt-pb)*v/max;
  const slot=(w-pl-pr)/n, gw=slot*(o.gap??.42), bw=stacked?slot-gw:(slot-gw)/S.length;
  let body='';
  for(let i=0;i<n;i++){ let acc=0;
    S.forEach((s,j)=>{ const v=s.d[i], bh=Math.max(2,Y(v)); const x=pl+slot*i+gw/2+(stacked?0:bw*j); const y=h-pb-bh-(stacked?Y(acc):0);
      const c=o.hi!=null&&!stacked&&S.length===1?(i===o.hi?'accent':'c7'):s.c;
      const r=stacked?(j===S.length-1?Math.min(6,bw/2):0):Math.min(o.r??6,bw/2);
      body+= stacked&&j<S.length-1?`<rect x="${f(x)}" y="${f(y)}" width="${f(bw)}" height="${f(bh)}" style="fill:var(--${s.c})"/>`
        :`<rect x="${f(x)}" y="${f(y)}" width="${f(bw)}" height="${f(bh+(stacked&&j>0?0:0))}" rx="${f(r)}" style="fill:var(--${c})"/>`;
      if(stacked&&j===0) body+=`<rect x="${f(x)}" y="${f(h-pb-Math.min(bh,8))}" width="${f(bw)}" height="${f(Math.min(bh,8))}" style="fill:var(--${s.c})"/>`;
      acc+=v; });
    if(o.hi===i&&S.length===1){ const x=pl+slot*i+slot/2, y=h-pb-Y(S[0].d[i])-10; body+=`<text x="${f(x)}" y="${f(y)}" text-anchor="middle" style="fill:var(--fg);font-weight:600">${(o.pre||'')+k(S[0].d[i])}</text>`; }
  }
  let lab=''; if(o.labels){ const every=Math.ceil(n/(o.maxLabels||12)); o.labels.forEach((l,i)=>{ if(i%every===0) lab+=`<text x="${f(pl+slot*i+slot/2)}" y="${h-6}" text-anchor="middle">${l}</text>`; }); }
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="${o.aria||'Bar chart'}">${axes(o,w,h,pl,pr,pt,pb,max,0)}${body}${lab}</svg>`;
};
ch.donut=(o={})=>{
  const s=o.size||180, th=o.th||18, r=(s-th)/2-2, c=2*Math.PI*r, tot=o.data.reduce((a,d)=>a+d.v,0); const gap=(th*(o.round===false?.25:1)+4)/c*100;
  let acc=0, seg='';
  o.data.forEach(d=>{ const len=d.v/tot*100; const L=Math.max(.1,len-gap);
    seg+=`<circle cx="${s/2}" cy="${s/2}" r="${f(r)}" pathLength="100" style="fill:none;stroke:var(--${d.c});stroke-width:${th};stroke-linecap:${o.round===false?'butt':'round'};stroke-dasharray:${f(L)} ${f(100-L)};stroke-dashoffset:${f(-acc-gap/2)}" transform="rotate(-90 ${s/2} ${s/2})"/>`; acc+=len; });
  return `<svg class="chart" viewBox="0 0 ${s} ${s}" style="width:${s}px;max-width:100%" role="img" aria-label="Donut chart"><circle cx="${s/2}" cy="${s/2}" r="${f(r)}" style="fill:none;stroke:var(--sunken);stroke-width:${th}"/>${seg}${o.label?`<text x="50%" y="${s/2+(o.sub?2:7)}" text-anchor="middle" style="fill:var(--fg);font-size:${s/7.5}px;font-weight:600;letter-spacing:-.02em">${o.label}</text>`:''}${o.sub?`<text x="50%" y="${s/2+s/9}" text-anchor="middle" style="font-size:${Math.max(10,s/16)}px">${o.sub}</text>`:''}</svg>`;
};
ch.spark=(o={})=>{
  const w=o.w||120,h=o.h||34,d=o.d,mx=Math.max(...d),mn=Math.min(...d),id='s'+(++uid);
  const pts=d.map((v,i)=>[2+(w-6)*i/(d.length-1),3+(h-6)*(1-(v-mn)/((mx-mn)||1))]); const p=smooth(pts,.14); const c=o.c||'c1';
  const last=pts[pts.length-1];
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" style="width:${w}px;height:${h}px" aria-hidden="true">${o.area!==false?`<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--${c});stop-opacity:.28"/><stop offset="1" style="stop-color:var(--${c});stop-opacity:0"/></linearGradient></defs><path d="${p} L${f(last[0])},${h} L2,${h} Z" style="fill:url(#${id})"/>`:''}<path d="${p}" style="fill:none;stroke:var(--${c});stroke-width:1.7;stroke-linecap:round"/><circle cx="${f(last[0])}" cy="${f(last[1])}" r="2.4" style="fill:var(--${c})"/></svg>`;
};
ch.gauge=(o={})=>{
  const s=o.size||220, n=o.n||32, v=o.v??64, cx=s/2, cy=s*.56, r1=s*.32, r2=s*.44; let t='';
  for(let i=0;i<n;i++){ const a=(-210+240*i/(n-1))*Math.PI/180, on=i/(n-1)<=v/100+1e-9;
    const col=on?(o.c?`var(--${o.c})`:`color-mix(in srgb,var(--c2),var(--c1) ${Math.round(i/(n-1)*100)}%)`):'var(--line-2)';
    t+=`<line x1="${f(cx+r1*Math.cos(a))}" y1="${f(cy+r1*Math.sin(a))}" x2="${f(cx+r2*Math.cos(a))}" y2="${f(cy+r2*Math.sin(a))}" style="stroke:${col};stroke-width:${s/48};stroke-linecap:round"/>`; }
  return `<svg class="chart" viewBox="0 0 ${s} ${s*.86}" style="width:${s}px;max-width:100%" role="img" aria-label="Gauge ${v}%">${t}<text x="${cx}" y="${f(cy+6)}" text-anchor="middle" style="fill:var(--fg);font-size:${s/6.2}px;font-weight:600;letter-spacing:-.03em">${o.label??v+'%'}</text><text x="${cx}" y="${f(cy+s/7)}" text-anchor="middle" style="font-size:${Math.max(10.5,s/18)}px">${o.sub||''}</text></svg>`;
};
ch.heat=(o={})=>{
  const rows=o.rows||7, cols=o.cols||24; T.rnd(o.seed||11); let c='';
  for(let r=0;r<rows;r++) for(let i=0;i<cols;i++){ const base=Math.sin((i/cols)*Math.PI)*.75+(r<5?.2:-.15); const v=Math.max(0,Math.min(1,base+(T.rnd()-.5)*.55)); const lv=Math.round(v*4);
    c+=`<i title="${lv*25}%" style="background:${lv?`color-mix(in srgb,var(--${o.c||'accent'}) ${[0,22,45,70,100][lv]}%,var(--sunken))`:'var(--sunken)'}"></i>`; }
  return `<div class="hm" style="grid-template-columns:repeat(${cols},minmax(0,1fr));width:100%">${c}</div>`;
};
ch.pill=(o={})=>{
  const d=o.d, n=d.length, w=o.w||560, h=o.h||200, pb=o.labels?24:4, mx=o.max||Math.max(...d)*1.12, slot=w/n, bw=Math.min(o.bw||26,slot*.62); let b='';
  d.forEach((v,i)=>{ const x=slot*i+(slot-bw)/2, full=h-pb-26, bh=Math.max(bw,full*v/mx), y=h-pb-bh; const on=i===o.hi;
    b+=`<rect x="${f(x)}" y="26" width="${f(bw)}" height="${f(full)}" rx="${bw/2}" style="fill:var(--sunken);stroke:var(--line);stroke-dasharray:2 3"/>`;
    b+=`<rect x="${f(x)}" y="${f(y)}" width="${f(bw)}" height="${f(bh)}" rx="${bw/2}" style="fill:var(--${on?'inv':(o.c||'raised-2')});${on?'':'stroke:var(--line-2)'}"/>`;
    if(on){ b+=`<rect x="${f(x+bw/2-24)}" y="${f(y-30)}" width="48" height="22" rx="11" style="fill:var(--accent)"/><text x="${f(x+bw/2)}" y="${f(y-15)}" text-anchor="middle" style="fill:var(--on-accent);font-weight:600;font-size:11px">${(o.pre||'')+k(v)}</text>`; }
    if(o.labels) b+=`<text x="${f(x+bw/2)}" y="${h-6}" text-anchor="middle" style="${on?'fill:var(--fg)':''}">${o.labels[i]}</text>`; });
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="Pill bar chart">${b}</svg>`;
};
ch.value=(o={})=>{
  const d=o.d, w=o.w||560, h=o.h||170, id='v'+(++uid), mx=Math.max(...d)*1.1, mn=Math.min(...d)*.85;
  const X=i=>6+(w-12)*i/(d.length-1), Y=v=>8+(h-30)*(1-(v-mn)/(mx-mn)); const pts=d.map((v,i)=>[X(i),Y(v)]); const p=smooth(pts); const hi=o.hi??Math.round(d.length*.68);
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" data-hydrate="value" data-d="${d.join(',')}" data-pre="${o.pre||''}" data-labels="${(o.labels||[]).join(',')}" role="img" aria-label="Value chart" style="touch-action:pan-y">
  <defs>${hatch(id,'c1',.4)}<linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--c1);stop-opacity:.25"/><stop offset="1" style="stop-color:var(--c1);stop-opacity:0"/></linearGradient></defs>
  <path d="${p} L${f(X(d.length-1))},${h-22} L6,${h-22} Z" style="fill:url(#${id}g)"/><path d="${p} L${f(X(d.length-1))},${h-22} L6,${h-22} Z" style="fill:url(#${id})"/>
  <path d="${p}" style="fill:none;stroke:var(--c1);stroke-width:2;stroke-linecap:round"/>
  <line class="vg" x1="${f(X(hi))}" x2="${f(X(hi))}" y1="0" y2="${h-22}" style="stroke:var(--line-3);stroke-dasharray:3 3"/>
  <circle class="vd" cx="${f(X(hi))}" cy="${f(Y(d[hi]))}" r="4.5" style="fill:var(--surface);stroke:var(--c1);stroke-width:2.2"/>
  <g class="vb" transform="translate(${f(Math.min(w-80,Math.max(0,X(hi)-40)))},${f(Math.max(0,Y(d[hi])-36))})"><rect width="80" height="24" rx="12" style="fill:var(--inv)"/><text x="40" y="16" text-anchor="middle" style="fill:var(--on-inv);font-weight:600;font-size:11.5px">${(o.pre||'')+d[hi].toLocaleString()}</text></g>
  ${(o.labels||[]).map((l,i)=>i%Math.ceil(d.length/7)===0?`<text x="${f(X(i))}" y="${h-5}" text-anchor="${i===0?'start':'middle'}">${l}</text>`:'').join('')}</svg>`;
};
T.hyd.value=svg=>{
  const d=svg.dataset.d.split(',').map(Number), pre=svg.dataset.pre; const vb=svg.viewBox.baseVal, w=vb.width, h=vb.height; const mx=Math.max(...d)*1.1, mn=Math.min(...d)*.85;
  const X=i=>6+(w-12)*i/(d.length-1), Y=v=>8+(h-30)*(1-(v-mn)/(mx-mn));
  svg.addEventListener('pointermove',e=>{ const r=svg.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width*w; const i=Math.max(0,Math.min(d.length-1,Math.round((x-6)/(w-12)*(d.length-1))));
    svg.querySelector('.vg').setAttribute('x1',X(i)); svg.querySelector('.vg').setAttribute('x2',X(i)); const c=svg.querySelector('.vd'); c.setAttribute('cx',X(i)); c.setAttribute('cy',Y(d[i]));
    svg.querySelector('.vb').setAttribute('transform',`translate(${Math.min(w-80,Math.max(0,X(i)-40))},${Math.max(0,Y(d[i])-36)})`); svg.querySelector('.vb text').textContent=pre+d[i].toLocaleString();
    const out=svg.closest('.stage-body,.card')&&svg.closest('.stage-body,.card').querySelector('[data-vout]'); if(out) out.textContent=pre+d[i].toLocaleString(); });
};
ch.funnel=(o={})=>{
  const d=o.d, w=o.w||600, rh=o.rh||40, gap=22, h=d.length*(rh+gap)-gap, mx=d[0].v; let b='';
  d.forEach((s,i)=>{ const bw=Math.max(60,(w-200)*s.v/mx), x=150+(w-200-bw)/2, y=i*(rh+gap);
    b+=`<text x="0" y="${y+rh/2+4}" style="fill:var(--fg-2);font-size:12.5px">${s.l}</text>`;
    b+=`<rect x="${f(x)}" y="${y}" width="${f(bw)}" height="${rh}" rx="12" style="fill:var(--${i===0?'c1':'c1'});opacity:${1-i*.17}"/>`;
    b+=`<text x="${w}" y="${y+rh/2+4}" text-anchor="end" style="fill:var(--fg);font-weight:600;font-size:12.5px">${k(s.v)}</text>`;
    if(i<d.length-1){ const pc=Math.round(d[i+1].v/s.v*100); b+=`<text x="${150+(w-200)/2}" y="${y+rh+gap/2+4}" text-anchor="middle" style="font-size:11px">↓ ${pc}%</text>`; } });
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="Funnel">${b}</svg>`;
};
ch.scatter=(o={})=>{
  const w=o.w||600,h=o.h||260,pl=34,pb=24,pt=10,pr=10; T.rnd(o.seed||5); let b='';
  const groups=o.groups||[{c:'c1',cx:.65,cy:.62,n:26},{c:'c2',cx:.3,cy:.32,n:22},{c:'c4',cx:.75,cy:.25,n:10}];
  groups.forEach(g=>{ for(let i=0;i<g.n;i++){ const x=Math.min(.98,Math.max(.02,g.cx+(T.rnd()-.5)*.42)), y=Math.min(.98,Math.max(.03,g.cy+(T.rnd()-.5)*.42)), r=3+T.rnd()*6;
    b+=`<circle cx="${f(pl+(w-pl-pr)*x)}" cy="${f(pt+(h-pt-pb)*(1-y))}" r="${f(r)}" style="fill:var(--${g.c});fill-opacity:.55;stroke:var(--${g.c})"/>`; } });
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="Scatter plot">${axes({ticks:4},w,h,pl,pr,pt,pb,100,0)}${[0,25,50,75,100].map(v=>`<text x="${f(pl+(w-pl-pr)*v/100)}" y="${h-6}" text-anchor="middle">${v}</text>`).join('')}${b}</svg>`;
};
ch.combo=(o={})=>{
  const w=o.w||640,h=o.h||240,pl=36,pr=36,pt=12,pb=26, bars=o.bars, line=o.line, n=bars.length, bm=niceMax(Math.max(...bars)*1.1), lm=niceMax(Math.max(...line)*1.1);
  const slot=(w-pl-pr)/n, bw=slot*.5; let b='';
  bars.forEach((v,i)=>{ const bh=(h-pt-pb)*v/bm; b+=`<rect x="${f(pl+slot*i+(slot-bw)/2)}" y="${f(h-pb-bh)}" width="${f(bw)}" height="${f(bh)}" rx="5" style="fill:var(--c7)"/>`; });
  const pts=line.map((v,i)=>[pl+slot*i+slot/2,pt+(h-pt-pb)*(1-v/lm)]);
  b+=`<path d="${smooth(pts)}" style="fill:none;stroke:var(--c1);stroke-width:2.2"/>`+pts.map(p=>`<circle cx="${f(p[0])}" cy="${f(p[1])}" r="3.2" style="fill:var(--surface);stroke:var(--c1);stroke-width:2"/>`).join('');
  let r=''; for(let i=0;i<=4;i++) r+=`<text x="${w-pr+8}" y="${f(pt+(h-pt-pb)*i/4+3.5)}">${k(lm-lm*i/4)}${o.unit||''}</text>`;
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="Combo chart">${axes({ticks:4},w,h,pl,pr,pt,pb,bm,0)}${b}${r}${(o.labels||[]).map((l,i)=>`<text x="${f(pl+slot*i+slot/2)}" y="${h-6}" text-anchor="middle">${l}</text>`).join('')}</svg>`;
};
ch.radar=(o={})=>{
  const s=o.size||280, cx=s/2, cy=s/2, R=s*.36, ax=o.axes, n=ax.length; const pt=(i,v)=>{ const a=-Math.PI/2+2*Math.PI*i/n; return [cx+R*v*Math.cos(a),cy+R*v*Math.sin(a)]; };
  let g=''; [.25,.5,.75,1].forEach(l=>{ g+=`<polygon points="${ax.map((_,i)=>pt(i,l).map(f).join(',')).join(' ')}" style="fill:none;stroke:var(--line-2);${l<1?'stroke-dasharray:2 4':''}"/>`; });
  ax.forEach((a,i)=>{ const p=pt(i,1), q=pt(i,1.17); g+=`<line x1="${cx}" y1="${cy}" x2="${f(p[0])}" y2="${f(p[1])}" style="stroke:var(--line)"/><text x="${f(q[0])}" y="${f(q[1]+4)}" text-anchor="middle">${a}</text>`; });
  o.series.forEach(se=>{ g+=`<polygon points="${se.d.map((v,i)=>pt(i,v).map(f).join(',')).join(' ')}" style="fill:var(--${se.c});fill-opacity:.18;stroke:var(--${se.c});stroke-width:1.8;stroke-linejoin:round"/>`+se.d.map((v,i)=>{const p=pt(i,v);return `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="2.6" style="fill:var(--${se.c})"/>`}).join(''); });
  return `<svg class="chart" viewBox="0 0 ${s} ${s}" style="width:${s}px;max-width:100%" role="img" aria-label="Radar chart">${g}</svg>`;
};
/* html charts */
ch.barlist=(rows,pre='')=>{ const mx=Math.max(...rows.map(r=>r[1])); return `<div class="barlist">${rows.map(r=>`<div class="row"><div class="trk"><span class="fill" style="width:${Math.max(6,r[1]/mx*100)}%"></span><span class="nm">${r[2]?T.I(r[2],14)+'&nbsp; ':''}${r[0]}</span></div><span class="v">${pre}${r[1].toLocaleString()}</span></div>`).join('')}</div>`; };
ch.meter=(parts,c='')=>`<div class="meter ${c}">${parts.map(p=>`<i class="${p.c==='free'?'free':''}" style="flex-grow:${p.v};${p.c==='free'?'':`background:var(--${p.c})`}" title="${p.l||''}"></i>`).join('')}</div>`;
ch.legend=(parts,vals=true)=>`<div class="legend">${parts.map(p=>`<span><i style="background:var(--${p.c==='free'?'line-3':p.c})"></i>${p.l}${vals&&p.t?` <b>${p.t}</b>`:''}</span>`).join('')}</div>`;
ch.bullet=(rows)=>`<div class="vstack" style="gap:16px;width:100%">${rows.map(r=>`<div style="display:grid;grid-template-columns:110px 1fr 56px;gap:12px;align-items:center;font-size:13px"><span style="color:var(--fg-2)">${r.l}</span>
  <div style="position:relative;height:22px;border-radius:7px;overflow:hidden;background:var(--sunken);box-shadow:inset 0 0 0 1px var(--line)"><span style="position:absolute;inset:0 auto 0 0;width:${r.b[1]}%;background:color-mix(in srgb,var(--fg) 7%,transparent)"></span><span style="position:absolute;inset:0 auto 0 0;width:${r.b[0]}%;background:color-mix(in srgb,var(--fg) 7%,transparent)"></span>
  <span style="position:absolute;left:0;top:7px;height:8px;width:${r.v}%;border-radius:4px;background:${r.v>=r.t?'var(--ok)':'var(--accent)'}"></span><span style="position:absolute;top:3px;bottom:3px;left:${r.t}%;width:2px;border-radius:2px;background:var(--fg)"></span></div>
  <b class="num" style="text-align:right;font-weight:600">${r.v}%</b></div>`).join('')}</div>`;
})();
