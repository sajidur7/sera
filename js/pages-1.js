/* Action · Chat · AI */
(function(){
'use strict';
const T=window.T, I=T.I, H=T.H;
const menuItems=[['Edit','edit','⌘E'],['Duplicate','copy','⌘D'],['Share','link'],'-',['Archive','archive'],['Delete','trash','⌫','danger']];
const pop=(items,c='')=>`<div class="pop ${c}" role="menu">${H.menu(items)}</div>`;
const anchorMenu=(trigger,items,c='')=>`<div class="anchor">${trigger}<div class="pop ${c}" role="menu" hidden>${H.menu(items)}</div></div>`;

T.reg('Action',[
{s:'button',n:'Button',c:'.btn  .primary  .accent  .ghost  .outline  .danger',d:'Buttons with an 8px radius and a springy press. Primary is the inverse fill — one per view. Accent is for the single most important action in a flow.',
 demos:[
  {t:'Playground',d:'Change the controls on the right.',k:[{id:'variant',l:'Variant',t:'seg',o:['primary','accent','secondary','ghost','outline','danger'],v:'primary'},{id:'size',l:'Size',t:'seg',o:['sm','md','lg'],v:'md'},{id:'icon',l:'Leading icon',t:'sw',v:true},{id:'loading',l:'Loading',t:'sw',v:false},{id:'disabled',l:'Disabled',t:'sw',v:false}],
   h:s=>`<button class="btn ${s.variant==='secondary'?'':s.variant} ${s.size==='md'?'':s.size}" ${s.disabled?'disabled':''}>${s.loading?'<span class="spin" style="border-top-color:currentColor"></span>':s.icon?I('plus',s.size==='lg'?18:s.size==='sm'?14:16):''}<span>${s.loading?'Saving…':'New deal'}</span></button>`},
  {t:'Variants',h:`${H.btn('Primary','primary')}${H.btn('Accent','accent')}${H.btn('Secondary')}${H.btn('Outline','outline')}${H.btn('Ghost','ghost')}${H.btn('Delete','danger')}${H.btn('Delete','danger solid')}`},
  {t:'Sizes',h:`${H.btn('Small','sm')}${H.btn('Medium')}${H.btn('Large','lg')}${H.btn('','xs icon','plus')}${H.btn('Extra small','xs')}`},
  {t:'With icons',d:'Leading icons name the action; trailing icons say where it goes.',h:`${H.btn('Import','','upload')}${H.btn('Continue','primary','','arrow-right')}${H.btn('Open in new tab','ghost','','ext')}${H.btn('Filters','','filter','chev-down')}`},
  {t:'Full width & blocks',c:'col-flow',h:`<div class="vstack" style="width:min(340px,100%)">${H.btn('Continue with email','primary lg block','mail')}${H.btn('Continue with SSO','lg block','key')}</div>`},
 ],
 p:'.btn|class|—|Base pill, 36px tall;.primary|modifier|—|Inverse fill — one per view;.accent|modifier|—|Violet fill for the key action in a flow;.ghost · .outline|modifier|—|Low-emphasis;.danger · .danger.solid|modifier|—|Soft or solid red;.sm · .xs · .lg|size|md|30 / 24 / 44px;.icon|modifier|—|Square icon-only;disabled|attribute|false|Fades to 42% and ignores pointer'},
{s:'icon-button',n:'Icon Button',c:'.btn.icon',d:'Square or round buttons for a single icon. Always give them a label and a tooltip.',
 demos:[
  {t:'Variants',h:`${H.ib('plus','primary','Add')}${H.ib('edit','','Edit')}${H.ib('copy','outline','Copy')}${H.ib('more','ghost','More')}${H.ib('trash','danger','Delete')}${H.ib('bolt','accent','Run')}`},
  {t:'Sizes & shape',d:'Add .sq for a rounded square.',h:`${H.ib('search','xs','XS')}${H.ib('search','sm','Small')}${H.ib('search','','Medium')}${H.ib('search','lg','Large')}<span class="vdiv"></span>${H.ib('grid','sq','Grid')}${H.ib('list','sq sm','List')}`},
  {t:'Tooltips',d:'Hover or focus each one.',h:`<div class="toolbar">${['bold','italic','under','link','quote','code'].map(i=>H.ib(i,'ghost sm',i[0].toUpperCase()+i.slice(1))).join('')}</div>`},
 ],p:'aria-label|string|—|Required; also shown as the tooltip;data-tip|string|—|Tooltip text;.sq|modifier|—|Rounded square instead of a circle'},
{s:'button-group',n:'Button Group',c:'.bgroup',d:'Joined buttons that act on the same object. Use a split button when one action is the default.',
 demos:[
  {t:'Joined',h:`<div class="bgroup">${H.btn('Day','ghost')}${H.btn('Week','ghost')}${H.btn('Month','ghost')}</div><div class="bgroup">${H.ib('chev-left','ghost','Previous')}${H.btn('Today','ghost')}${H.ib('chev-right','ghost','Next')}</div>`},
  {t:'Split button',h:`<div class="anchor"><div class="bgroup" style="background:var(--inv)"><button class="btn primary">${I('send',16)}<span>Send now</span></button><button class="btn primary icon" data-pop aria-label="More send options" style="border-left:1px solid color-mix(in srgb,var(--on-inv) 18%,transparent)">${I('chev-down',16)}</button></div><div class="pop right" hidden>${H.menu([['Schedule send','clock'],['Send as test','mail'],['Save as draft','file']])}</div></div>`},
 ],p:'.bgroup|class|—|Wraps .btn children;children|.btn|—|Separated by 1px rules'},
{s:'link',n:'Link',c:'.lnk  .muted  .accent  .arrow',d:'Underlined text links with a soft underline that firms up on hover.',
 demos:[
  {t:'In text',c:'left',h:`<p class="md" style="margin:0">Read the <a class="lnk" href="#installation">installation guide</a>, browse the <a class="lnk accent" href="#color">colour tokens</a>, or check the <a class="lnk muted" href="#overview">changelog</a>.</p>`},
  {t:'Standalone',h:`<a class="lnk arrow" href="#overview">View all deals ${I('arrow-right',14)}</a><a class="lnk arrow accent" href="#overview">Open report ${I('arrow-ur',14)}</a><a class="lnk arrow muted" href="#overview">${I('arrow-left',14)} Back</a>`},
 ],p:'.lnk|class|—|Underlined link;.muted · .accent|modifier|—|Colour;.arrow|modifier|—|No underline, icon aligned'},
{s:'toggle-button',n:'Toggle Button',c:'[data-press]  aria-pressed',d:'A button that stays on. State is aria-pressed, so assistive tech reads it.',
 demos:[
  {t:'Formatting',h:`<div class="toolbar">${['bold','italic','under'].map((i,k)=>`<button class="btn icon ghost sm" data-press aria-pressed="${k===0}" aria-label="${i}">${I(i,14)}</button>`).join('')}</div>`},
  {t:'Chips',d:'Toggle chips filter a list.',h:['Open','Won','Lost','Stalled'].map((x,k)=>`<button class="chip" data-press aria-pressed="${k<2}"><span class="dot" style="background:var(--c${[2,6,5,4][k]})"></span>${x}</button>`).join('')},
  {t:'With label',h:`<button class="btn" data-press aria-pressed="true">${I('star',16)}<span>Starred</span></button><button class="btn" data-press aria-pressed="false">${I('bell',16)}<span>Watch</span></button>`},
 ],p:'data-press|attribute|—|Makes the button toggle;aria-pressed|true · false|false|Current state'},
{s:'segmented-control',n:'Segmented Control',c:'.seg  .sm  .full  .sq',d:'A sunken pill holding two to five options. The selected one lifts out.',
 demos:[
  {t:'Playground',k:[{id:'size',l:'Size',t:'seg',o:['sm','md'],v:'md'},{id:'full',l:'Full width',t:'sw',v:false},{id:'square',l:'Square',t:'sw',v:false}],
   h:s=>H.seg(['Overview','Activity','Files','Notes'],0,`${s.size==='sm'?'sm':''} ${s.full?'full':''} ${s.square?'sq':''}`)},
  {t:'With icons',h:`<div class="seg"><button aria-pressed="true">${I('grid',14)}Board</button><button aria-pressed="false">${I('list',14)}List</button><button aria-pressed="false">${I('calendar',14)}Calendar</button></div><div class="seg"><button aria-pressed="true" aria-label="Light">${I('sun',14)}</button><button aria-pressed="false" aria-label="Dark">${I('moon',14)}</button></div>`},
  {t:'With counts',h:`<div class="seg"><button aria-pressed="true">All <span class="badge muted">48</span></button><button aria-pressed="false">Mine <span class="badge muted">12</span></button><button aria-pressed="false">Flagged <span class="badge">3</span></button></div>`},
 ],p:'.seg|class|—|Container, role=group;button[aria-pressed]|true · false|first|Selected segment;.sm|size|—|24px segments;.full|modifier|—|Stretch to container;.sq|modifier|—|12px radius instead of pill'},
{s:'toolbar',n:'Toolbar',c:'.toolbar',d:'A raised strip of related actions. Separate groups with a vertical rule.',
 demos:[
  {t:'Editor',h:`<div class="toolbar">${H.ib('undo','ghost sm','Undo')}<span class="vr"></span>${['bold','italic','under'].map(i=>`<button class="btn icon ghost sm" data-press aria-pressed="false" aria-label="${i}">${I(i,14)}</button>`).join('')}<span class="vr"></span>${H.ib('list','ghost sm','List')}${H.ib('quote','ghost sm','Quote')}${H.ib('code','ghost sm','Code')}<span class="vr"></span>${H.btn('Comment','ghost sm','msg')}</div>`},
  {t:'Floating',d:'Appears over a selection.',h:`<div class="vstack" style="align-items:center"><div class="toolbar" style="border-radius:var(--r-pill)">${H.btn('Ask AI','ghost sm','bot')}<span class="vr"></span>${H.ib('bold','ghost sm','Bold')}${H.ib('link','ghost sm','Link')}${H.ib('msg','ghost sm','Comment')}</div><p class="md" style="margin:0">Pipeline grew <mark style="background:var(--accent-soft);color:var(--fg);border-radius:4px;padding:0 3px">18% quarter over quarter</mark>, led by mid-market.</p></div>`},
 ],p:'.toolbar|class|—|Raised container;.vr|class|—|Vertical separator'},
{s:'dropdown-menu',n:'Dropdown Menu',c:'.anchor  .pop  .mi',d:'A list of actions that opens from a trigger. Items show icons, shortcuts and a danger tone.',
 demos:[
  {t:'Open',c:'tall',h:pop(['#Deal',...menuItems])},
  {t:'Trigger',d:'Click the button; click outside or press Esc to close.',c:'tall',h:anchorMenu(H.btn('Actions','','','chev-down','data-pop'),menuItems)},
  {t:'Checkable',c:'tall',h:`<div class="pop" role="menu"><div class="mlabel">Columns</div>${['Owner','Stage','Value','Close date','Source'].map((x,k)=>`<button class="mi" role="menuitemcheckbox" aria-checked="${k<3}"><span>${x}</span><span class="end">${I('check',14,'chk')}</span></button>`).join('')}</div>`},
 ],p:'.anchor|class|—|Positions the menu;[data-pop]|attribute|—|Toggles the sibling .pop;.pop.right · .up|modifier|—|Alignment;.mi.danger|modifier|—|Destructive item;role=menuitemcheckbox|attribute|—|Checkable item'},
{s:'context-menu',n:'Context Menu',c:'[data-ctx]',d:'The same menu, opened with a right-click (or long press) at the pointer.',
 demos:[
  {t:'Right-click the area',c:'tall',h:`<div data-hydrate="ctx" style="position:relative;width:100%;max-width:520px;height:240px;border-radius:var(--r-xl);border:1.5px dashed var(--line-3);display:grid;place-items:center;color:var(--fg-3);user-select:none">Right-click anywhere here<div class="pop" role="menu" hidden style="position:absolute">${H.menu([['Open','ext'],['Rename','edit','F2'],['Move to…','folder'],'-',['Copy link','link','⌘L'],['Delete','trash','⌫','danger']])}</div></div>`},
 ],p:'data-hydrate="ctx"|attribute|—|Opens the inner .pop at the pointer'},
{s:'more-menu',n:'More Menu',c:'.btn.icon + .pop',d:'An overflow trigger that hides secondary actions behind three dots.',
 demos:[
  {t:'In a row',c:'tall left',h:`<div class="list" style="max-width:460px">${[0,1,2].map(i=>`<div class="li">${H.av(i)}<div class="grow"><b>${T.people[i][0]}</b><small>${['Account executive','Solutions engineer','Customer success'][i]}</small></div>${anchorMenu(H.ib('more','ghost sm','More','data-pop'),[['View profile','user'],['Message','msg'],'-',['Remove','trash','','danger']],'right')}</div>`).join('')}</div>`},
  {t:'Vertical dots',c:'tall',h:anchorMenu(H.ib('more-v','','More','data-pop'),[['Pin','pin'],['Export','download'],['Settings','sliders']])},
 ],p:'icon|more · more-v|more|Horizontal or vertical dots'},
{s:'copy-button',n:'Copy Button',c:'[data-copy]',d:'Copies a value and confirms with a tick for a second.',
 demos:[
  {t:'Inline',h:`<div class="ig" style="width:min(380px,100%)">${I('key',16)}<input value="tsr_live_8f2c…a91e" readonly>${H.copy('tsr_live_8f2ca91e')}</div>`},
  {t:'With label',h:`<button class="btn sm" data-copy="npm i sera">${I('copy',14)}<span>Copy command</span></button><code class="code">npm i sera</code>`},
 ],p:'data-copy|string|—|Text written to the clipboard'},
]);
T.hyd.ctx=el=>{ const p=el.querySelector('.pop'); el.addEventListener('contextmenu',e=>{ e.preventDefault(); const r=el.getBoundingClientRect(); p.hidden=false; const x=Math.min(e.clientX-r.left,r.width-p.offsetWidth-6), y=Math.min(e.clientY-r.top,r.height-p.offsetHeight-6); p.style.left=Math.max(6,x)+'px'; p.style.top=Math.max(6,y)+'px'; }); document.addEventListener('click',e=>{ if(!p.contains(e.target)) p.hidden=true; }); };

/* ---------------- Chat ---------------- */
const uMsg=t=>`<div class="msg-u">${t}</div>`;
const acts=`<div class="msg-acts">${H.ib('copy','ghost xs','Copy')}${H.ib('thumb','ghost xs','Good')}<button class="btn icon ghost xs" aria-label="Bad" data-tip="Bad"><span style="transform:rotate(180deg);display:flex">${I('thumb',14)}</span></button>${H.ib('refresh','ghost xs','Retry')}<span class="sep"></span><span style="font-size:12px">Ledger · 4.1s</span></div>`;
const aMsg=(t,extra='')=>`<div class="msg-a">${extra}<p>${t}</p>${acts}</div>`;
const composer=(ph='Ask about any deal, person or number…')=>`<div class="promptbar" style="max-width:none"><textarea rows="1" placeholder="${ph}" aria-label="Message"></textarea><div class="pb-row">${H.ib('plus','ghost sm','Attach')}${H.ib('at','ghost sm','Mention')}<button class="chip" style="height:28px">${I('cpu',14)}Ledger 2 ${I('chev-down',12)}</button><span class="grow"></span><button class="btn icon ghost sm send" aria-label="Send">${I('mic',16)}</button></div></div>`;
const toolRow=(i,txt,code,state='done')=>`<div class="tr">${state==='run'?H.pix('drive'):state==='fail'?I('x-c',16):I(i,16)}<span>${txt}</span>${code?`<code>${code}</code>`:''}${state==='done'?`<span style="margin-left:auto;color:var(--ok)">${I('check',14)}</span>`:''}</div>`;
T.reg('Chat',[
{s:'chat-layout',n:'Chat Layout',c:'.chat-panel',d:'A header with tabs, a scrolling thread and a composer pinned to the bottom.',
 demos:[{t:'Panel',c:'stretch',h:`<div class="chat-panel" style="max-width:none"><div class="cph">${H.seg(['Chat','Activity','Files'],0,'sm')}<span class="grow"></span>${H.ib('plus','ghost sm','New chat')}${H.ib('max','ghost sm','Expand')}</div><div class="cpb" style="min-height:280px"><div class="chat" style="max-width:none">${uMsg('Which deals over $40k are at risk this month?')}${aMsg('Three. <b>Halden Freight</b> has had no reply in 12 days, <b>Mira Labs</b> pushed their close date twice, and <b>Oakline</b> lost their champion last week.')}</div></div><div style="padding:10px;border-top:1px solid var(--line)">${composer()}</div></div>`}],
 p:'.chat-panel|class|—|Header, body and footer;.cph · .cpb|class|—|Header and body slots'},
{s:'chat-message',n:'Chat Message',c:'.msg-u  .msg-a',d:'People get a raised bubble on the right; the assistant writes on the page with quiet actions underneath.',
 demos:[{t:'Exchange',c:'col-flow',h:`<div class="chat">${uMsg('Draft a follow-up for Halden Freight.')}${aMsg('Here’s a short one that references their freight-volume question from the last call and proposes two times next week.')}</div>`},
  {t:'Long user message',c:'col-flow',h:`<div class="chat">${uMsg('Summarise every note from the Oakline account since August, then tell me who we should talk to now that Priya has left — keep it to five bullets.')}</div>`}],
 p:'.msg-u|class|—|Right-aligned bubble;.msg-a|class|—|Assistant block;.msg-acts|class|—|Copy, rate, retry'},
{s:'chat-parts',n:'Chat Parts',c:'.filechip  .codeblock  .cite',d:'The pieces that go inside a message: attachments, citations, code and inline references.',
 demos:[{t:'Attachments',h:`<span class="filechip">${I('file',14)}q3-forecast.xlsx</span><span class="filechip">${I('image',14)}pipeline.png</span><span class="filechip">${I('link',14)}halden.com/pricing</span>`},
  {t:'Citations',c:'left',h:`<p class="md" style="margin:0">Halden’s fleet grew to 1,400 trucks this year <a class="cite" href="#citation"><i style="background:var(--c2)">H</i>halden.com</a> and they opened a Rotterdam hub <a class="cite" href="#citation"><i style="background:var(--c5)">R</i>reuters</a>.</p>`},
  {t:'Code',c:'stretch',h:`<div class="codeblock"><header><span>score.sql</span>${H.copy('select * from deals')}</header><pre><span class="ln">1</span>select name, value, stage
<span class="ln">2</span>from deals
<span class="ln">3</span>where risk_score &gt; 0.7
<span class="ln">4</span>order by value desc;</pre></div>`}],
 p:'.filechip|class|—|Attachment chip;.cite|class|—|Inline source;.codeblock|class|—|Header with copy + pre'},
{s:'chat-message-metadata',n:'Chat Message Metadata',c:'.msg-acts',d:'Model, timing and token cost under an answer, plus feedback.',
 demos:[{t:'Footer',h:`<div class="msg-acts" style="gap:8px;font-size:12px;flex-wrap:wrap">${H.tag('Ledger 2','line')}<span>${I('clock',12)}</span><span>4.1s</span><span class="sep"></span><span class="mono">1,284 tokens</span><span class="sep"></span><span>$0.004</span><span class="sep"></span>${H.ib('thumb','ghost xs','Good')}${H.ib('copy','ghost xs','Copy')}</div>`},
  {t:'Header',h:`<div class="row" style="gap:10px">${T.logo(24)}<b>Ledger</b><span class="t-small">today 09:41</span>${H.tag('Edited','line')}</div>`}],
 p:'.msg-acts|class|—|Row of metadata and actions'},
{s:'chat-system-message',n:'Chat System Message',c:'.msg-sys',d:'Centred, quiet lines for events that are not from anyone.',
 demos:[{t:'Events',c:'col-flow',h:`<div class="chat" style="align-items:center"><span class="msg-sys">Maya joined the thread</span><span class="msg-sys">${I('layers',12)} Context compacted · 42k → 8k</span><span class="msg-sys" style="color:var(--warn)">${I('alert',12)} Rate limit reached, retrying in 20s</span></div>`}],
 p:'.msg-sys|class|—|Centred line with dashed rules'},
{s:'chat-tool-calls',n:'Chat Tool Calls',c:'.toolc',d:'What the assistant did, step by step. Running steps show the pixel loader; done steps get a tick.',
 demos:[{t:'Steps',c:'col-flow',h:`<div class="toolc">${toolRow('search','Searched deals','risk &gt; 0.7')}${toolRow('db','Read 14 activity logs','')}${toolRow('globe','Fetched','halden.com/news')}${toolRow('','Writing summary','', 'run')}</div>`},
  {t:'Failed step',c:'col-flow',h:`<div class="toolc" style="color:var(--bad)">${toolRow('','Couldn’t reach','crm.oakline.io','fail')}</div><div class="toolc">${toolRow('refresh','Retried with cached data','')}</div>`}],
 p:'.toolc|class|—|Step list;.tr|class|—|One step: icon, text, code, state'},
{s:'chat-composer',n:'Chat Composer',c:'.promptbar  .promptpill',d:'A box that grows with what you type. The mic turns into a send arrow once there is text.',
 demos:[{t:'Box',c:'stretch',d:'Type to see the send button change.',h:composer()},
  {t:'Pill that opens',d:'Click the pill.',c:'col-flow',h:`<div class="promptpill" data-expand>${I('bot',16)}<span class="grow">Ask Ledger…</span>${H.kbd(I('cmd',11),'K')}</div><div class="promptbar" hidden><textarea rows="2" placeholder="What do you want to know?"></textarea><div class="pb-row">${H.ib('clip','ghost sm','Attach')}<span class="grow"></span>${H.btn('Close','ghost sm','','','data-collapse')}<button class="btn icon ghost sm send" aria-label="Send">${I('mic',16)}</button></div></div>`},
  {t:'With context',c:'stretch',h:`<div class="promptbar" style="max-width:none"><div class="row wrap" style="padding:4px 4px 0;gap:6px"><span class="filechip">${I('building',14)}Halden Freight <button class="btn icon ghost xs" aria-label="Remove" style="width:18px;height:18px">${I('x',10)}</button></span><span class="filechip">${I('file',14)}call-notes.md</span></div><textarea rows="1" placeholder="Ask about this account…"></textarea><div class="pb-row">${H.ib('plus','ghost sm','Attach')}<span class="hint">${T.keys('⇧⏎')} for a new line</span><span class="grow"></span><button class="btn icon ghost sm send" aria-label="Send">${I('mic',16)}</button></div></div>`}],
 p:'.promptbar|class|—|Growing box;.promptpill|class|—|Collapsed pill;data-expand · data-collapse|attribute|—|Switch between them;.send|class|—|Mic → arrow when there is text'},
],'c');

/* ---------------- AI ---------------- */
T.reg('AI',[
{s:'thinking',n:'Thinking & Loaders',c:'.pix  .think  .shimmer-text',d:'Pixel-grid loaders, a shimmering status line and an expandable trace of what the model looked at.',
 demos:[{t:'Status lines',c:'col-flow left',h:`<span class="loader-line">${H.pix('drive')}<span class="shimmer-text">Thinking</span><span class="t">4s</span></span><span class="loader-line">${H.pix('orbit','accent')}<span class="shimmer-text">Reading 14 notes</span></span><span class="loader-line">${H.pix('scan')}<span class="shimmer-text">Comparing forecasts</span><span class="t">12s</span></span>`},
  {t:'Trace',c:'left',h:`<details class="think" open style="max-width:100%"><summary>${I('chev-down',14,'car')}Thought for 8s</summary><ol style="min-width:0"><li>${I('search',14)}Searched <span class="tag line">deals where stage = negotiation</span></li><li>${I('file',14)}Read <span class="tag line">oakline-renewal.md</span></li><li>${I('chart',14)}Compared Q3 and Q4 win rates</li><li>${I('check-c',14)}Found 3 deals at risk</li></ol></details>`},
  {t:'Loader patterns',h:['drive','orbit','scan','dots'].map(v=>H.pix(v,'lg')).join('')}],
 p:'.pix|drive · orbit · scan · dots|drive|Nine-square loader;.pix.lg · .accent|modifier|—|Size and colour;.think|details|—|Collapsible trace;.shimmer-text|class|—|Animated status text'},
{s:'streaming-text',n:'Streaming Text',c:'[data-stream]',d:'Text that arrives word by word with a caret. Sources sit underneath once it finishes.',
 demos:[{t:'Stream',c:'col-flow left',h:`<p class="md" data-stream style="margin:0;min-height:5em">Oakline’s renewal is at risk because their sponsor left in October and usage dropped 31% since. The fastest path is a check-in with their new VP of Operations, who joined from a team that already uses us.</p><div class="row wrap" style="gap:6px"><a class="cite" href="#citation"><i style="background:var(--c1)">1</i>usage report</a><a class="cite" href="#citation"><i style="background:var(--c2)">2</i>linkedin.com</a>${H.btn('Replay','ghost xs','refresh','','data-restream')}</div>`}],
 p:'data-stream|attribute|—|Streams the element’s text;data-speed|ms|38|Delay per word;data-restream|attribute|—|Replays streams in the stage'},
{s:'prompt-bar',n:'Prompt Bar',c:'.promptbar',d:'The main AI input. Opens from a pill, mentions sources with @ and switches model inline.',
 demos:[{t:'With sources menu',c:'tall',h:`<div class="anchor" style="width:100%;max-width:560px;display:block"><div class="promptbar" style="max-width:none"><textarea rows="2" aria-label="Prompt">Compare Q3 and Q4 win rates for @</textarea><div class="pb-row"><button class="btn ghost sm" data-pop>${I('at',14)}<span>Sources</span></button>${H.ib('clip','ghost sm','Attach')}<span class="grow"></span><button class="btn icon primary sm send" aria-label="Send">${I('arrow-up',16)}</button></div></div><div class="pop up" hidden style="width:280px"><div class="mlabel">Add a source</div>${H.menu([['Deals','box','248'],['People','users','1.2k'],['Notes','file','590'],['Web','globe']])}</div></div>`},
  {t:'Pill',d:'Click to open.',c:'col-flow',h:`<div class="promptpill" data-expand>${I('search',16)}<span class="grow">Ask or search…</span>${H.kbd('/')}</div><div class="promptbar" hidden><textarea rows="2" placeholder="Ask anything about your pipeline"></textarea><div class="pb-row"><span class="grow"></span>${H.btn('Cancel','ghost sm','','','data-collapse')}<button class="btn icon ghost sm send" aria-label="Send">${I('mic',16)}</button></div></div>`}],
 p:'.promptbar|class|—|The input;[data-pop]|attribute|—|Opens the sources menu above'},
{s:'tool-chips',n:'Tool Chips',c:'.filechip',d:'Compact chips for files touched and tools used, with line counts in green and red.',
 demos:[{t:'Files',h:`<span class="filechip">${I('file',13)}forecast.ts <span class="add">+13</span><span class="del">−41</span></span><span class="filechip">${I('file',13)}deals.sql <span class="add">+4</span></span><span class="filechip">${I('file',13)}README.md <span class="del">−2</span></span>`},
  {t:'Tools',h:`<span class="filechip">${I('search',13)}search_deals</span><span class="filechip">${I('globe',13)}web_fetch</span><span class="filechip">${I('mail',13)}draft_email</span><span class="filechip" style="color:var(--fg-3)">+3 more</span>`}],
 p:'.filechip|class|—|Mono chip;.add · .del|class|—|Coloured counts'},
{s:'approval-card',n:'Approval Card',c:'.card  [role=radiogroup]',d:'The assistant pauses and asks. Options are radios; the footer says how many questions are left.',
 demos:[{t:'Question',h:`<div class="card" style="width:min(460px,100%)"><div class="card-b vstack" style="gap:14px"><div class="row">${I('bot',16)}<span class="t-small">Ledger needs a decision</span></div><b style="font-size:15px">Who should own the Oakline renewal?</b><div class="vstack" role="radiogroup" style="gap:12px">${H.rad('Maya Okafor',true,'Current AE · 6 meetings')}${H.rad('Leo Brandt',false,'Solutions · knows the new VP')}${H.rad('Leave unassigned')}</div></div><div class="card-f"><span class="t-small" style="margin-right:auto">1 of 3</span>${H.btn('Skip','ghost sm')}${H.btn('Continue','primary sm','','arrow-right')}</div></div>`},
  {t:'Permission',h:`<div class="card" style="width:min(460px,100%)"><div class="card-b vstack" style="gap:10px"><div class="row">${I('shield',16)}<b>Send 12 emails?</b></div><p class="t-muted" style="margin:0;font-size:13.5px">Ledger wants to send follow-ups to everyone who went quiet this week.</p><div class="row wrap" style="gap:6px">${H.avs(5,'xs',7)}</div></div><div class="card-f">${H.btn('Review first','ghost sm')}${H.btn('Deny','sm')}${H.btn('Allow','primary sm')}</div></div>`}],
 p:'role=radiogroup|attribute|—|Groups the options;.card-f|class|—|Footer with progress and actions'},
{s:'recommendation-card',n:'Recommendation Card',c:'.card  .ticks.conf',d:'A suggested next step with how sure the model is and why.',
 demos:[{t:'Card',h:`<div class="card" style="width:min(440px,100%)"><div class="card-b vstack" style="gap:12px"><div class="row"><span class="tag violet">Next step</span><span class="grow"></span><span class="ticks conf" aria-label="High confidence"><i class="on"></i><i class="on"></i><i class="on"></i><i></i></span><span class="t-small">High</span></div><b style="font-size:15.5px">Book a call with Oakline’s new VP before Friday</b><p class="t-muted" style="margin:0;font-size:13.5px">Usage dropped 31% after the sponsor left. Accounts that re-engaged within two weeks renewed 3× more often.</p></div><div class="card-f">${H.btn('Dismiss','ghost sm')}${H.btn('Draft email','primary sm','mail')}</div></div>`}],
 p:'.ticks.conf|class|—|Four rising bars; .on fills one'},
{s:'context-cards',n:'Context Cards',c:'.card.pad',d:'Small cards showing what the assistant is looking at right now.',
 demos:[{t:'Set',c:'stretch',h:`<div class="grid3" style="grid-template-columns:repeat(auto-fit,minmax(min(180px,100%),1fr))">${[['building','Halden Freight','Account · $84k ARR','c2'],['user','Priya Shah','Champion · left Oct 3','c5'],['file','renewal-plan.md','Doc · edited 2d ago','c6']].map(c=>`<div class="card pad vstack" style="gap:10px"><span class="av sq sm" style="--t:var(--${c[3]})">${I(c[0],14)}</span><div><b style="font-weight:500">${c[1]}</b><div class="t-small">${c[2]}</div></div></div>`).join('')}</div>`}],
 p:'.card.pad|class|—|18px padding card'},
{s:'insight-card',n:'Insight Card',c:'.card  .stat',d:'One number, one trend line and one sentence about why it moved.',
 demos:[{t:'Insight',h:`<div class="card" style="width:min(360px,100%)"><div class="card-b vstack" style="gap:12px"><div class="row"><span class="t-small">Win rate · 30 days</span><span class="grow"></span>${H.tag('Insight','violet pill')}</div><div class="row" style="align-items:flex-end;justify-content:space-between"><div class="stat"><span class="val">34%</span>${H.delta(6)}</div>${T.ch.spark({d:T.ch.series(18,20,6,.8,4),c:'c1',w:140,h:44})}</div><p class="t-muted" style="margin:0;font-size:13.5px">Up after reps started sending recaps within an hour of demos.</p><a class="lnk arrow accent" href="#insight-card">Why? ${I('arrow-right',14)}</a></div></div>`}],
 p:'.card|class|—|Container;T.ch.spark()|function|—|Inline trend'},
{s:'diff-table',n:'Diff Table',c:'.diff',d:'Proposed changes as rows. Red rows are removed, green are added; click a row to leave it out.',
 demos:[{t:'Proposed changes',d:'Click rows to toggle.',h:`<div class="diff"><div class="dh">Update deal stages <small><span data-diffn>4</span> changes</small></div><table><thead><tr><th>Deal</th><th>Stage</th><th></th></tr></thead><tbody>
  <tr class="rm"><td>Halden Freight</td><td class="s">Negotiation</td><td><span class="cb">${I('minus',12)}</span></td></tr><tr class="add"><td>Halden Freight</td><td>Stalled</td><td><span class="cb">${I('plus',12)}</span></td></tr>
  <tr class="rm"><td>Mira Labs</td><td class="s">Proposal</td><td><span class="cb">${I('minus',12)}</span></td></tr><tr class="add"><td>Mira Labs</td><td>Negotiation</td><td><span class="cb">${I('plus',12)}</span></td></tr></tbody></table>
  <div class="df"><span>Nothing changes until you apply</span><div class="row">${H.btn('Discard','ghost sm')}${H.btn('Apply','primary sm')}</div></div></div>`}],
 p:'.diff|class|—|Container;tr.rm · tr.add|class|—|Removed / added;tr.off|class|—|Excluded by the user'},
{s:'task-list',n:'Task List',c:'.capsules  .capsule',d:'Agent steps as capsules: numbered when waiting, outlined while running, green when done.',
 demos:[{t:'Capsules',c:'col-flow',h:`<div class="capsules">${[['done','Pull open deals','Completed'],['done','Score risk','Completed'],['run','Draft follow-ups','Running'],['','Send for review','Waiting']].map((s,k)=>`<div class="capsule"><span class="disc ${s[0]}">${s[0]==='done'?I('check',14):s[0]==='run'?H.pix('orbit','accent'):k+1}</span><b>${s[1]}</b>${s[2]==='Completed'?H.spill('Done','ok'):s[2]==='Running'?`<span class="cm" data-timer="14">00:14</span>`:`<span class="cm">${s[2]}</span>`}</div>`).join('')}</div>`},
  {t:'Checklist',c:'left',h:`<div class="vstack" style="gap:12px">${H.chk('Import contacts',true)}${H.chk('Connect inbox',true)}${H.chk('Invite your team',false,'2 of 5 invited')}${H.chk('Create first pipeline')}</div>`}],
 p:'.capsule|class|—|One step;.disc.done · .run · .fail|modifier|—|Step state'},
{s:'parameter-card',n:'Parameter Card',c:'.card  .slidebar',d:'Tuning controls for a model or an automation, using Sera’s slider bars.',
 demos:[{t:'Model settings',h:`<div class="card" style="width:min(380px,100%)"><div class="card-h"><h4>Model</h4>${H.tag('Ledger 2','line')}</div><div class="card-b vstack" style="gap:10px">${[['Temperature',40,'%'],['Max length',62,'%'],['Top p',90,'%']].map(r=>`<div class="slidebar" style="--v:${r[1]}%"><span class="fill"></span><span class="lab">${r[0]}</span><span class="val">${r[1]}${r[2]}</span><input type="range" value="${r[1]}" min="0" max="100" data-u="${r[2]}" aria-label="${r[0]}"></div>`).join('')}<div class="knob"><span>Web access</span>${H.sw(true)}</div><div class="knob"><span>Tone</span>${H.seg(['Plain','Warm','Brief'],0,'sm')}</div></div></div>`}],
 p:'.slidebar|class|—|Label-inside slider;input[type=range]|attribute|—|Drives the fill'},
]);
})();
