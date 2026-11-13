/* slug → [StyleX regions to show, imports, usage JSX]. Sources come from js/sources.js (generated from sera-ui). */
(function(){
const U = window.T.use = {};
const u = (slug, regions, imports, jsx) => { U[slug] = { regions: regions.split(' '), imports, jsx }; };

/* Action */
u('button','Button','Button',`<Button variant="primary" icon="plus">New deal</Button>
<Button variant="accent">Run workflow</Button>
<Button>Secondary</Button>
<Button variant="ghost" iconEnd="ext">Open in new tab</Button>
<Button variant="danger" size="sm">Delete</Button>
<Button variant="primary" loading>Saving…</Button>`);
u('icon-button','IconButton Tooltip','IconButton',`<IconButton icon="plus" label="Add" variant="primary" />
<IconButton icon="edit" label="Edit" variant="secondary" />
<IconButton icon="more" label="More" size="sm" />`);
u('button-group','ButtonGroup','Button, ButtonGroup, IconButton',`<ButtonGroup>
  <IconButton icon="chev-left" label="Previous" />
  <Button variant="ghost">Today</Button>
  <IconButton icon="chev-right" label="Next" />
</ButtonGroup>`);
u('link','Link','Link',`<Link href="/docs">Read the guide</Link>
<Link href="/report" tone="accent" arrow="arrow-ur">Open report</Link>`);
u('toggle-button','ToggleButton','ToggleButton',`<ToggleButton icon="bold" aria-label="Bold" />
<ToggleButton icon="star" defaultPressed>Starred</ToggleButton>`);
u('segmented-control','SegmentedControl','SegmentedControl',`const [view, setView] = useState("board");

<SegmentedControl
  value={view}
  onChange={setView}
  options={[
    { value: "board", label: "Board", icon: "grid" },
    { value: "list", label: "List", icon: "list" },
  ]}
/>`);
u('toolbar','Toolbar','Toolbar, ToolbarSeparator, IconButton, ToggleButton',`<Toolbar>
  <IconButton icon="undo" label="Undo" size="sm" />
  <ToolbarSeparator />
  <ToggleButton icon="bold" aria-label="Bold" size="sm" />
  <ToggleButton icon="italic" aria-label="Italic" size="sm" />
</Toolbar>`);
u('dropdown-menu','DropdownMenu Popover','DropdownMenu, MenuItem, MenuSeparator, MenuLabel, Button',`<DropdownMenu trigger={<Button iconEnd="chev-down">Actions</Button>}>
  <MenuLabel>Deal</MenuLabel>
  <MenuItem icon="edit" shortcut="⌘E" onSelect={edit}>Edit</MenuItem>
  <MenuItem icon="copy" onSelect={duplicate}>Duplicate</MenuItem>
  <MenuSeparator />
  <MenuItem icon="trash" danger onSelect={remove}>Delete</MenuItem>
</DropdownMenu>`);
u('context-menu','ContextMenu','ContextMenu, MenuItem',`<ContextMenu menu={<>
  <MenuItem icon="ext">Open</MenuItem>
  <MenuItem icon="trash" danger>Delete</MenuItem>
</>}>
  <div className="drop-area">Right-click here</div>
</ContextMenu>`);
u('more-menu','MoreMenu','MoreMenu, MenuItem',`<MoreMenu>
  <MenuItem icon="user">View profile</MenuItem>
  <MenuItem icon="trash" danger>Remove</MenuItem>
</MoreMenu>`);
u('copy-button','CopyButton','CopyButton',`<CopyButton value="tsr_live_8f2ca91e" />
<CopyButton value="npm i sera" label="Copy command" />`);

/* Chat */
u('chat-layout','ChatLayout','ChatLayout, ChatHeaderTabs, ChatComposer, ChatMessage, IconButton',`<ChatLayout
  header={<ChatHeaderTabs tabs={["Chat", "Activity"]} actions={<IconButton icon="plus" label="New chat" size="sm" />} />}
  composer={<ChatComposer onSend={send} />}
>
  {messages.map((m) => <ChatMessage key={m.id} role={m.role}>{m.text}</ChatMessage>)}
</ChatLayout>`);
u('chat-message','ChatMessage','ChatMessage, MessageActions',`<ChatMessage role="user">Draft a follow-up for Halden.</ChatMessage>
<ChatMessage role="assistant" actions={<MessageActions text={answer} meta="Lumen · 4.1s" />}>
  {answer}
</ChatMessage>`);
u('chat-parts','Attachment CodeBlock Citation','Attachment, CodeBlock, Citation',`<Attachment icon="file" name="q3-forecast.xlsx" />
<Citation index={1} source="halden.com" href="https://halden.com" />
<CodeBlock filename="score.sql" code={sql} />`);
u('chat-message-metadata','MessageMeta','MessageMeta',`<MessageMeta model="Lumen 2" seconds={4.1} tokens={1284} cost="$0.004" />`);
u('chat-system-message','SystemMessage','SystemMessage',`<SystemMessage>Maya joined the thread</SystemMessage>
<SystemMessage icon="alert" tone="warn">Rate limit reached, retrying in 20s</SystemMessage>`);
u('chat-tool-calls','ToolCalls','ToolCalls',`<ToolCalls calls={[
  { icon: "search", label: "Searched deals", arg: "risk > 0.7", state: "done" },
  { icon: "globe", label: "Fetched", arg: "halden.com/news", state: "done" },
  { icon: "file", label: "Writing summary", state: "running" },
]} />`);
u('chat-composer','ChatComposer','ChatComposer, ModelPicker, Attachment',`<ChatComposer
  onSend={(text) => send(text)}
  placeholder="Press Fn to talk or type your request…"
  mode={<><Icon name="msg" size={13} /> Text to notes</>}
  modeEnd={<ModelPicker value="Lumen 2" />}
/>`);

/* AI */
u('thinking','ThinkingLine ThinkingTrace Spinner','ThinkingLine, ThinkingTrace, PixelLoader',`<ThinkingLine seconds={4}>Thinking</ThinkingLine>
<ThinkingTrace summary="Thought for 8s" steps={[
  { icon: "search", text: "Searched open deals" },
  { icon: "file", text: "Read oakline-renewal.md" },
]} />
<PixelLoader pattern="orbit" accent />`);
u('streaming-text','StreamingText Citation','StreamingText, Citation',`<StreamingText text={answer} onDone={() => setDone(true)} />
{done && <Citation index={1} source="usage report" />}`);
u('prompt-bar','PromptBar ChatComposer','PromptBar, ChatComposer, Keys',`<PromptBar label="Ask Lumen…" shortcut={<Keys keys={["cmd", "K"]} />}>
  <ChatComposer onSend={ask} />
</PromptBar>`);
u('tool-chips','ToolChip Attachment','ToolChip',`<ToolChip name="forecast.ts" added={13} removed={41} />
<ToolChip icon="globe" name="web_fetch" />`);
u('approval-card','ApprovalCard RadioGroup','ApprovalCard',`<ApprovalCard
  question="Who should own the Oakline renewal?"
  step={1} total={3}
  options={[
    { value: "maya", label: "Maya Okafor", description: "Current AE" },
    { value: "leo", label: "Leo Brandt", description: "Knows the new VP" },
  ]}
  onContinue={(owner) => assign(owner)}
/>`);
u('recommendation-card','RecommendationCard','RecommendationCard, Button',`<RecommendationCard
  title="Book a call with Oakline’s new VP"
  confidence={3}
  actions={<><Button size="sm" variant="ghost">Dismiss</Button><Button size="sm" variant="primary" icon="mail">Draft email</Button></>}
>
  Usage dropped 31% after the sponsor left.
</RecommendationCard>`);
u('context-cards','ContextCard','ContextCard, Grid',`<Grid minWidth={180}>
  <ContextCard icon="building" title="Halden Freight" subtitle="$84k ARR" />
  <ContextCard icon="user" title="Priya Shah" subtitle="Champion · left Oct 3" tint="c5" />
</Grid>`);
u('insight-card','InsightCard Stat Sparkline','InsightCard, Stat, Sparkline',`<InsightCard
  label="Win rate · 30 days"
  stat={<Stat label="" value="34%" delta={6} />}
  trend={<Sparkline data={winRate} width={140} height={44} />}
>
  Up after reps started sending recaps within an hour of demos.
</InsightCard>`);
u('diff-table','DiffTable','DiffTable',`<DiffTable
  title="Update deal stages"
  changes={[
    { id: "h", label: "Halden Freight", from: "Negotiation", to: "Stalled" },
    { id: "m", label: "Mira Labs", from: "Proposal", to: "Negotiation" },
  ]}
  onApply={(ids) => apply(ids)}
/>`);
u('task-list','TaskList','TaskList',`<TaskList tasks={[
  { label: "Pull open deals", state: "done" },
  { label: "Draft follow-ups", state: "running", meta: <Timer start={14} /> },
  { label: "Send for review", state: "waiting" },
]} />`);
u('parameter-card','ParameterCard Slider','ParameterCard, SliderBar, Switch, SegmentedControl, Tag',`<ParameterCard title="Model" badge={<Tag tone="line">Lumen 2</Tag>}>
  <SliderBar label="Temperature" defaultValue={40} unit="%" />
  <SliderBar label="Top p" defaultValue={90} unit="%" />
  <Switch label="Web access" defaultChecked />
</ParameterCard>`);

/* Container */
u('card','Card','Card, Button, MoreMenu',`<Card
  title="Renewal plan"
  actions={<MoreMenu>…</MoreMenu>}
  footer={<><Button variant="ghost" size="sm">Cancel</Button><Button variant="primary" size="sm">Save</Button></>}
>
  Three touchpoints before the contract ends.
</Card>`);
u('bezel','Bezel','Bezel, Stat, Sparkline',`<Bezel label="Revenue" end="Last 30 days">
  <Stat label="MRR" value="$48,210" delta={8} />
  <Sparkline data={mrr} width={320} height={56} />
</Bezel>`);
u('clickable-card','ClickableCard','ClickableCard',`<ClickableCard href="/workflows">
  <Icon name="flow" size={18} />
  <b>Workflows</b>
  <Text size="small">Automate follow-ups</Text>
</ClickableCard>`);
u('selectable-card','SelectableCard','SelectableCard, Grid',`const [plan, setPlan] = useState("team");

<div role="radiogroup">
  <Grid minWidth={180}>
    {plans.map((p) => (
      <SelectableCard key={p.id} selected={plan === p.id} onSelect={() => setPlan(p.id)}>
        {p.name} · {p.price}
      </SelectableCard>
    ))}
  </Grid>
</div>`);
u('collapsible','Collapsible','Collapsible, Checkbox',`<Collapsible title="Advanced filters" defaultOpen>
  <Checkbox label="Only deals I own" defaultChecked />
</Collapsible>`);
u('accordion','Accordion Collapsible','Accordion',`<Accordion single items={[
  { title: "How is a deal scored?", content: "From reply speed, stakeholders and usage." },
  { title: "Can I change stages?", content: "Yes — every pipeline has its own." },
]} />`);
u('carousel','Carousel','Carousel, Card',`<Carousel caption="5 events">
  {events.map((e) => <Card key={e.id} padded>{e.title}</Card>)}
</Carousel>`);

/* Content */
u('text','Text','Text',`<Text>Body copy in fg-2.</Text>
<Text size="small" tone="fg3">Updated 2m ago</Text>
<Text size="label">Label · mono caps</Text>`);
u('heading','Heading','Heading',`<Heading level="display">Display</Heading>
<Heading level="h1">Page title</Heading>
<Heading level="h3">Card title</Heading>`);
u('avatar','Avatar','Avatar',`<Avatar name="Maya Okafor" tint="c1" />
<Avatar name="Halden" icon="building" tint="c2" square size="lg" />`);
u('avatar-parts','Avatar','Avatar',`<Avatar name="Maya Okafor" status="online" size="lg" />
<Avatar name="Leo Brandt" status="away" />`);
u('avatar-group','Avatar','AvatarGroup',`<AvatarGroup max={4} people={[
  { name: "Maya Okafor", tint: "c1" },
  { name: "Leo Brandt", tint: "c2" },
  { name: "Sana Iqbal", tint: "c6" },
  { name: "Theo Marsh" }, { name: "Ines Duarte" },
]} />`);
u('blockquote','Blockquote','Blockquote',`<Blockquote cite="Ines Duarte, Head of Sales">
  We closed the quarter two weeks early.
</Blockquote>`);
u('citation','Citation','Citation',`Win rates rose to 34% <Citation index={1} source="Q3 report" href="/reports/q3" />`);
u('code','Code','Code',`Run <Code>lumen sync --deals</Code> to refresh.`);
u('code-block','CodeBlock','CodeBlock',`<CodeBlock filename="webhook.ts" code={source} />`);
u('markdown','Prose','Prose',`import Markdown from "react-markdown";

<Prose><Markdown>{summary}</Markdown></Prose>`);
u('icon','Icon','Icon',`import { color } from "./sera/tokens.stylex";

<Icon name="bell" />
<span style={{ color: color.ok }}><Icon name="check-c" size={20} /></span>`);
u('kbd','Kbd KeyIcon','Kbd, Keys',`<Kbd>Esc</Kbd>
<Keys keys={["G", "D"]} />`);
u('kbd-icons','KeyIcon','Keys',`<Keys keys={["cmd", "K"]} />
<Keys keys={["cmd", "shift", "P"]} />
<Keys keys={["opt", "enter"]} />`);
u('thumbnail','Thumbnail','Thumbnail',`<Thumbnail src={url} size={96} onRemove={() => remove(id)} />
<Thumbnail icon="file" />`);
u('timer','Timer','Timer',`<Timer />                      {/* counts up */}
<Timer start={300} countdown />  {/* 05:00 → 00:00 */}`);
u('timestamp','Timestamp','Timestamp',`<Timestamp date={new Date(deal.updatedAt)} />`);
u('token','Token','Token, Avatar',`<Token lead={<Avatar name="Maya Okafor" size="xs" tint="c1" />}>Maya Okafor</Token>`);
u('tag','Tag','Tag',`<Tag tone="violet">Negotiation</Tag>
<Tag tone="mint" size="lg">Won</Tag>
<Tag tone="line" onRemove={remove}>EMEA</Tag>`);

/* Feedback */
u('badge','Badge','Badge',`<Badge count={3} />
<Badge count={12} tone="muted" />
<Badge count={140} tone="bad" />`);
u('status-dot','StatusDot','StatusDot, StatusPill',`<StatusDot tone="ok" live />
<StatusPill tone="warn">Degraded</StatusPill>
<StatusPill tone="ok" live>Live</StatusPill>`);
u('banner','Banner','Banner, Button',`<Banner tone="accent" action={<Button size="xs" variant="primary">Try it</Button>} onDismiss={close}>
  Lumen can now draft follow-ups for you.
</Banner>`);
u('alert','Alert','Alert, InlineMessage',`<Alert tone="warn" title="Missing owner">
  6 deals have no owner and won’t appear in forecasts.
</Alert>
<InlineMessage tone="ok">Saved</InlineMessage>`);
u('info-tip','InfoTip','InfoTip',`Weighted forecast <InfoTip>Value × stage probability</InfoTip>`);
u('progress-bar','Progress SegmentMeter','Progress, SegmentedProgress, SegmentMeter',`<SegmentMeter value={72} />
<Progress value={62} label="Importing contacts" />
<Progress />                 {/* indeterminate */}
<SegmentedProgress steps={8} done={5} />`);
u('skeleton','Skeleton','Skeleton',`<Skeleton width="42%" height={11} />
<Skeleton width="100%" height={60} radius={10} />`);
u('spinner','Spinner','Spinner, PixelLoader',`<Spinner />
<PixelLoader pattern="drive" />`);
u('toast','Toast','ToastProvider, useToast',`// once, near the root
<ToastProvider><App /></ToastProvider>

// anywhere below
const toast = useToast();
toast({ title: "Deal saved", body: "Moved to Negotiation" });`);
u('toast-static','Toast','Toast',`<Toast title="Deal saved" body="Halden Freight moved to Negotiation" />
<Toast tone="bad" title="Couldn’t send" body="Gmail is disconnected." />`);
u('empty-state','EmptyState','EmptyState, Button',`<EmptyState
  icon="inbox"
  title="No deals in this view"
  actions={<Button variant="primary" size="sm" icon="plus">New deal</Button>}
>
  Try removing a filter, or create a deal.
</EmptyState>`);
u('status-pages','StatusPage','StatusPage',`<StatusPage kind={404} onHome={() => navigate("/")} />
<StatusPage kind="maintenance" />`);

/* Forms */
u('field','Field','Field, Input',`<Field label="Work email" required hint="We’ll send a sign-in link here.">
  <Input type="email" placeholder="you@company.com" />
</Field>
<Field label="Work email" error="Add the domain, like halden.com">
  <Input invalid defaultValue="maya@halden" />
</Field>`);
u('text-input','Input InputGroup','Input, InputGroup, Keys',`<Input placeholder="Company name" />
<Input size="sm" invalid />
<InputGroup icon="search" placeholder="Search deals" end={<Keys keys={["/"]} />} />`);
u('number-input','NumberInput InputGroup','NumberInput, InputGroup, Addon',`<NumberInput label="Seats" defaultValue={3} min={0} max={20} />
<InputGroup start={<Addon>$</Addon>} defaultValue="84,000" end={<Addon>USD</Addon>} />`);
u('text-area','TextArea','TextArea, Field',`<Field label="Notes">
  <TextArea maxLength={280} defaultValue="Spoke with Ines…" />
</Field>`);
u('input-group','InputGroup','InputGroup, Addon, Button',`<InputGroup start={<Addon>https://</Addon>} defaultValue="halden" end={<Addon>.lumen.app</Addon>} />
<InputGroup icon="mail" placeholder="Invite by email" end={<Button size="sm" variant="primary">Invite</Button>} />`);
u('checkbox','Checkbox','Checkbox',`<Checkbox label="Email me a weekly summary" description="Every Monday at 08:00" defaultChecked />
<Checkbox checked="mixed" label="Some selected" />`);
u('indicators','ListRow Switch','List, ListRow, Switch',`<List>
  <ListRow first lead={<Icon name="mail" />} title="Email" description="Deal updates" trailing={<Switch label="Email" defaultChecked />} />
  <ListRow lead={<Icon name="bell" />} title="Push" trailing={<Switch label="Push" />} />
</List>`);
u('declarative-items','SettingRow','List, SettingRow, Switch, SegmentedControl',`<List>
  <SettingRow first title="Two-factor sign-in" description="Ask for a code on new devices" control={<Switch label="2FA" defaultChecked />} />
  <SettingRow title="Currency" control={<SegmentedControl size="sm" options={["USD", "EUR", "GBP"]} />} />
</List>`);
u('radio-list','RadioGroup','RadioGroup',`<RadioGroup label="Assignment" defaultValue="me" options={[
  { value: "me", label: "Assign to me" },
  { value: "rr", label: "Round robin", description: "Spread across the team" },
]} />`);
u('switch','Switch','Switch',`<Switch label="Auto-assign new leads" defaultChecked />
<Switch label="Beta features" accent size="sm" />`);
u('slider','Slider','Slider, SliderBar',`<Slider label="Probability" defaultValue={60} />
<SliderBar label="Bounce" defaultValue={40} />`);
u('selector','Select','Select',`<Select label="Stage" defaultValue="negotiation" options={[
  { value: "lead", label: "Lead" },
  { value: "proposal", label: "Proposal" },
  { value: "negotiation", label: "Negotiation" },
]} />`);
u('combobox','Combobox','Combobox',`const [owner, setOwner] = useState("maya");
<Combobox options={people} value={owner} onChange={(v) => setOwner(v as string)} />

const [segments, setSegments] = useState(["ent"]);
<Combobox multiple options={segmentOptions} value={segments} onChange={(v) => setSegments(v as string[])} />`);
u('complex-selector','ComplexSelect Select','ComplexSelect, Avatar',`<ComplexSelect options={[
  { value: "maya", label: "Maya Okafor", description: "AE · EMEA", group: "People", lead: <Avatar name="Maya Okafor" size="sm" /> },
  { value: "ent", label: "Enterprise sales", description: "8 people", group: "Teams" },
]} />`);
u('typeahead','Typeahead','Typeahead',`<Typeahead icon="building" placeholder="Company" suggestions={companies} onPick={setCompany} />`);
u('tokenizer','Tokenizer','Tokenizer',`const [emails, setEmails] = useState(["maya@halden.com"]);
<Tokenizer value={emails} onChange={setEmails} placeholder="name@company.com" />`);
u('power-search','FilterChip','InputGroup, FilterChip, AddFilterButton',`<InputGroup icon="search" placeholder="Search deals" />
<FilterChip field="Stage" value="Negotiation" onRemove={() => drop("stage")} />
<FilterChip field="Value" op=">" value="$40k" onRemove={() => drop("value")} />
<AddFilterButton onClick={openFilterMenu} />`);
u('calendar','Calendar','Calendar',`const [day, setDay] = useState(new Date());
<Calendar value={day} onChange={setDay} />

const [range, setRange] = useState<DateRange>({});
<Calendar range={range} onRangeChange={setRange} />`);
u('date-input','DateInput Calendar','DateInput',`const [date, setDate] = useState<Date>();
<DateInput value={date} onChange={setDate} />`);
u('date-range-input','DateRangeInput','DateRangeInput',`const [range, setRange] = useState<DateRange>({});
<DateRangeInput value={range} onChange={setRange} />`);
u('date-time-input','DateTimeInput','DateTimeInput',`const [at, setAt] = useState(new Date());
<DateTimeInput value={at} onChange={setAt} />`);
u('time-input','TimeInput','TimeInput, SegmentedControl',`const [time, setTime] = useState("09:30");
<TimeInput value={time} onChange={setTime} />`);
u('file-input','FileInput','FileInput, Progress',`<FileInput accept=".csv,.xlsx" hint="CSV, XLSX up to 20 MB" onFiles={(files) => upload(files)} />`);
u('otp-input','OTPInput','OTPInput',`<OTPInput length={6} onComplete={(code) => verify(code)} />`);
u('rating','Rating','Rating',`<Rating defaultValue={4} onChange={setScore} />`);
u('color-picker','ColorPicker','ColorPicker',`const [hex, setHex] = useState("#a988ee");
<ColorPicker value={hex} onChange={setHex} />`);
u('transfer','Transfer','Transfer',`const [hidden, setHidden] = useState(["Owner", "Source"]);
const [shown, setShown] = useState(["Name", "Stage", "Value"]);
<Transfer left={hidden} right={shown} onChange={(l, r) => { setHidden(l); setShown(r); }} titles={["Available", "Shown"]} />`);
u('cascader','Cascader','Cascader',`const [path, setPath] = useState(["Europe", "Netherlands", "Rotterdam"]);
<Cascader tree={regions} value={path} onChange={setPath} />`);
u('inline-edit','InlineEdit','InlineEdit',`<InlineEdit value={deal.name} onSave={(name) => rename(deal.id, name)} />`);
u('rich-text-editor','RichTextEditor','RichTextEditor',`<RichTextEditor initialHTML="<p><b>Call recap</b> — Halden</p>" onChange={setHtml} />`);

/* Layout */
u('app-shell','AppShell','AppShell, SideNav, NavItem, Button',`<AppShell
  sidebar={<SideNav><NavItem icon="home" label="Home" current /><NavItem icon="box" label="Deals" count={48} /></SideNav>}
  title="Deals"
  actions={<Button variant="primary" size="sm" icon="plus">New deal</Button>}
>
  {page}
</AppShell>`);
u('layout','Grid Stack','Grid',`<Grid columns={3} gap={12}>
  <div style={{ gridColumn: "span 2" }}>{main}</div>
  <aside>{inspector}</aside>
</Grid>`);
u('page-header','PageHeader Breadcrumbs Tabs','PageHeader, Breadcrumbs, Tabs, Button',`<PageHeader
  breadcrumbs={<Breadcrumbs items={[{ label: "Deals", href: "/deals" }, { label: "Halden Freight" }]} />}
  title="Halden Freight"
  meta="$84,000 · Negotiation · closes Dec 18"
  actions={<Button variant="primary" size="sm" icon="check">Mark won</Button>}
  tabs={<Tabs tabs={[{ id: "o", label: "Overview" }, { id: "a", label: "Activity" }]} />}
/>`);
u('stack','Stack','Stack, HStack',`<Stack gap={12}>
  <HStack gap={8}>{buttons}</HStack>
  {content}
</Stack>`);
u('grid','Grid','Grid',`<Grid columns={3} gap={10}>{cards}</Grid>
<Grid minWidth={220}>{cards}</Grid>  {/* wraps responsively */}`);
u('section','Section','Section, Button',`<Section title="Open deals" end={48}>{list}</Section>
<Section title="Activity" end={<Button variant="ghost" size="xs" iconEnd="arrow-right">View all</Button>}>{feed}</Section>`);
u('form-layout','FormLayout','FormLayout, Input, Select, Button',`<FormLayout
  rows={[
    { label: "Workspace name", hint: "Shown in emails", control: <Input defaultValue="Halden" /> },
    { label: "Time zone", control: <Select options={zones} /> },
  ]}
  footer={<Button variant="primary" size="sm">Save</Button>}
/>`);
u('divider','Divider','Divider',`<Divider />
<Divider dashed />
<Divider label="or continue with" />
<Divider vertical />`);
u('aspect-ratio','AspectRatio','AspectRatio',`<AspectRatio ratio={16 / 9}><img src={cover} alt="" /></AspectRatio>`);
u('scrollable-area','ScrollArea','ScrollArea',`<ScrollArea height={220}>{rows}</ScrollArea>`);
u('resize-handle','SplitPane','SplitPane',`<SplitPane initial={320} start={<InboxList />} end={<ReadingPane />} />`);
u('resizable','Resizable','Resizable',`<Resizable>Drag the corner.</Resizable>`);
u('layout-parts','Panel','Panel, SegmentedControl, Button',`<Panel
  title="Header"
  toolbar={<SegmentedControl size="sm" options={["All", "Mine"]} />}
  footer={<Button variant="primary" size="sm">Done</Button>}
>
  {body}
</Panel>`);
u('sticky','Sticky','StickyHeader',`<div style={{ height: 240, overflow: "auto" }}>
  <StickyHeader>Today</StickyHeader>
  {todayRows}
  <StickyHeader>Yesterday</StickyHeader>
  {yesterdayRows}
</div>`);

/* Navigation */
u('side-nav','SideNav','SideNav, NavItem, NavGroup, WorkspaceSwitcher, BrandMark',`<SideNav>
  <WorkspaceSwitcher logo={<BrandMark icon="layers" />} name="Lumen" handle="@halden" />
  <NavItem icon="home" label="Home" />
  <NavItem icon="box" label="Deals" count={48} current />
  <NavGroup label="Pipelines">
    <NavItem dot="#a988ee" label="Enterprise" />
  </NavGroup>
</SideNav>`);
u('top-nav','TopNav','TopNav, IconButton, Avatar',`<TopNav
  brand={<Logo />}
  current="Deals"
  links={[{ label: "Home", href: "/" }, { label: "Deals", href: "/deals" }]}
  end={<><IconButton icon="bell" label="Notifications" /><Avatar name="Maya Okafor" size="sm" /></>}
/>`);
u('mega-menu','MegaMenu','MegaMenu',`<MegaMenu label="Product" items={[
  { icon: "box", title: "Pipeline", description: "Every deal in one board", href: "/pipeline" },
  { icon: "bot", title: "Assistant", description: "Ask about any account", href: "/assistant" },
]} />`);
u('mobile-nav','MobileTabBar','MobileTabBar',`<MobileTabBar
  current={tab}
  onChange={setTab}
  action={{ icon: "plus", label: "New deal", onClick: create }}
  tabs={[
    { id: "home", icon: "home", label: "Home" }, { id: "deals", icon: "box", label: "Deals" },
    { id: "inbox", icon: "inbox", label: "Inbox" }, { id: "me", icon: "user", label: "Me" },
  ]}
/>`);
u('breadcrumbs','Breadcrumbs','Breadcrumbs',`<Breadcrumbs items={[
  { label: "Deals", href: "/deals" },
  { label: "Enterprise", href: "/deals/enterprise" },
  { label: "Halden Freight" },
]} />`);
u('tabs','Tabs','Tabs',`<Tabs tabs={[
  { id: "overview", label: "Overview", content: <Overview /> },
  { id: "activity", label: "Activity", count: 12, content: <Activity /> },
]} />`);
u('tab-menu','TabMenu Tabs','TabMenu',`<TabMenu value={tab} onChange={setTab} visible={4} tabs={[
  { id: "all", label: "All", count: 248 }, { id: "open", label: "Open", count: 48 },
  { id: "won", label: "Won" }, { id: "lost", label: "Lost" },
  { id: "stalled", label: "Stalled" }, { id: "archived", label: "Archived" },
]} />`);
u('nav-parts','SideNav','WorkspaceSwitcher, NavItem, NavGroup',`<WorkspaceSwitcher name="Halden" handle="@halden · Team plan" />
<NavGroup label="Inbox">
  <NavItem icon="inbox" label="Inbox" count={8} current />
</NavGroup>`);
u('pagination','Pagination','Pagination',`const [page, setPage] = useState(2);
<Pagination page={page} total={12} onChange={setPage} />`);
u('stepper','Stepper','Stepper',`<Stepper steps={["Account", "Import", "Invite", "Pipeline"]} current={2} />`);
u('outline','Outline','Outline',`<Outline current="stages" items={[
  { id: "overview", label: "Overview" },
  { id: "stages", label: "Stages" },
  { id: "probabilities", label: "Probabilities", level: 2 },
]} />`);
u('filter-menu','FilterMenu','FilterMenu',`const [stages, setStages] = useState(["Proposal"]);
<FilterMenu label="Stage" options={["Lead", "Proposal", "Negotiation", "Won"]} value={stages} onChange={setStages} />`);

/* Overlay */
u('dialog','Dialog','Dialog, Button, Field, Input',`const [open, setOpen] = useState(false);

<Button variant="primary" onClick={() => setOpen(true)}>New deal</Button>
<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="New deal"
  description="It’ll appear in the Enterprise pipeline."
  footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button variant="primary">Create</Button></>}
>
  <Field label="Company"><Input /></Field>
</Dialog>`);
u('dialog-parts','useConfirm Dialog','useConfirm',`const { confirm, dialog } = useConfirm();

async function rename() {
  if (await confirm({ title: "Rename pipeline?", confirm: "Rename" })) save();
}

return <>{dialog}<Button onClick={rename}>Rename</Button></>;`);
u('alert-dialog','AlertDialog','AlertDialog',`<AlertDialog
  open={open}
  title="Delete “Partners”?"
  description="14 deals will move to Enterprise. This can’t be undone."
  onCancel={() => setOpen(false)}
  onConfirm={remove}
/>`);
u('drawer','Drawer','Drawer, MetadataList, Button',`<Drawer open={open} onClose={close} title="Halden Freight"
  footer={<Button variant="primary" size="sm">Mark won</Button>}>
  <MetadataList items={[["Stage", "Negotiation"], ["Value", "$84,000"]]} />
</Drawer>`);
u('bottom-sheet','BottomSheet','BottomSheet',`<BottomSheet open={open} onClose={close}>
  <Heading level="h3">Share report</Heading>
  …
</BottomSheet>`);
u('popover','Popover','Popover, SegmentedControl, Button',`<Popover padded trigger={<Button icon="bell">Set reminder</Button>}>
  <SegmentedControl options={["1 hour", "Tomorrow", "Next week"]} size="sm" />
</Popover>`);
u('hover-card','HoverCard','HoverCard, Avatar, Link',`<HoverCard trigger={<Link href="/people/maya">Maya Okafor</Link>}>
  <Avatar name="Maya Okafor" status="online" size="lg" />
  Account executive · EMEA
</HoverCard>`);
u('tooltip','Tooltip','Tooltip, Button',`<Tooltip label="Export CSV"><Button icon="download" /></Tooltip>
<Tooltip label="Copy code" side="bottom">…</Tooltip>  {/* near a clipped top edge */}`);
u('command-palette','CommandPalette','CommandPalette',`// mounts once; opens with ⌘K / Ctrl-K
<CommandPalette commands={[
  { id: "new", label: "New deal", icon: "plus", shortcut: "N", group: "Suggestions", run: create },
  { id: "halden", label: "Halden Freight", icon: "building", group: "Deals", run: () => open("halden") },
]} />`);
u('command-menu','CommandPalette','CommandMenu',`<CommandMenu commands={commands} placeholder="Search people and teams" />`);
u('lightbox','Lightbox','Lightbox, Thumbnail',`const [i, setI] = useState<number | null>(null);
{images.map((src, n) => <button key={src} onClick={() => setI(n)}><Thumbnail src={src} /></button>)}
<Lightbox images={images} index={i} onIndex={setI} onClose={() => setI(null)} />`);
u('overlay','Overlay','Overlay, ThinkingLine',`<Overlay active={recalculating} content={<ThinkingLine>Recalculating forecast</ThinkingLine>}>
  <ForecastCard />
</Overlay>`);
u('popconfirm','Popconfirm','Popconfirm, Button',`<Popconfirm
  trigger={<Button icon="archive">Archive deal</Button>}
  message="Archive Halden Freight? You can restore it later."
  confirmLabel="Archive"
  onConfirm={archive}
/>`);
u('coachmark','Coachmark','Coachmark',`<Coachmark title="Meet the assistant" step={1} total={3} onNext={next} onSkip={end}>
  Ask about any deal, person or number in plain words.
</Coachmark>`);

/* Table & list */
u('table','DataTable SelectionToolbar','DataTable, Tag, Button, type Column',`const columns: Column<Deal>[] = [
  { key: "name", header: "Company", sortable: true },
  { key: "stage", header: "Stage", render: (d) => <Tag tone="violet">{d.stage}</Tag> },
  { key: "value", header: "Value", numeric: true, sortable: true, render: (d) => \`$\${d.value.toLocaleString()}\` },
];

<DataTable
  columns={columns}
  rows={deals}
  selectable
  selectionActions={(ids, clear) => <Button variant="ghost" size="sm" icon="archive" onClick={() => { archive(ids); clear(); }}>Archive</Button>}
/>`);
u('table-primitives','Table','TableWrap, Th, Td, Tr',`<TableWrap>
  <thead><tr><Th>Rep</Th><Th numeric>Deals</Th></tr></thead>
  <tbody>{reps.map((r) => <Tr key={r.id}><Td>{r.name}</Td><Td numeric>{r.deals}</Td></Tr>)}</tbody>
</TableWrap>`);
u('table-selection-toolbar','SelectionToolbar','SelectionToolbar, Button',`<SelectionToolbar count={3} onClear={clear}>
  <Button variant="ghost" size="sm" icon="user">Assign</Button>
  <Button variant="ghost" size="sm" icon="archive">Archive</Button>
</SelectionToolbar>`);
u('list','List ListRow','List, ListRow, Avatar, Tag',`<List>
  {people.map((p, i) => (
    <ListRow key={p.id} first={i === 0}
      lead={<Avatar name={p.name} status="online" />}
      title={p.name} description={p.company}
      trailing={<Tag tone="mint">Champion</Tag>} />
  ))}
</List>`);
u('metadata-list','MetadataList','MetadataList, Tag',`<MetadataList items={[
  ["Stage", <Tag tone="violet">Negotiation</Tag>],
  ["Value", "$84,000"],
  ["Created", "Sep 14, 2026"],
]} />`);
u('overflow-list','OverflowList','OverflowList, Tag',`<OverflowList max={3} items={tags.map((t) => <Tag key={t}>{t}</Tag>)} />`);
u('tree-list','TreeList','TreeList',`<TreeList defaultOpen={["ent"]} selected={sel} onSelect={setSel} nodes={[
  { id: "ent", label: "Enterprise", meta: 3, children: [
    { id: "halden", label: "Halden Freight", icon: "building" },
  ] },
]} />`);
u('timeline','Timeline','Timeline',`<Timeline events={[
  { icon: "mail", title: "Email from Ines", body: "“Pricing for 400 seats?”", time: "2h" },
  { icon: "phone", title: "Call with Halden", body: "32 min", time: "Yesterday" },
]} />`);

/* Data & charts */
u('stat','Stat','StatRow, Stat',`<StatRow>{[
  <Stat key="p" icon="dollar" label="Pipeline" value="$1.24M" delta={12} sub="48 open deals" />,
  <Stat key="w" label="Win rate" value="34%" delta={6} />,
  <Stat key="c" label="Cycle" value="41" unit="days" delta={-9} />,
]}</StatRow>`);
u('stat-options','Stat Sparkline Progress','Stat, Sparkline, Progress',`<Stat label="Won · 30d" value="$212k" delta={8} trend={<Sparkline data={won} width={90} height={34} />} />
<Stat label="Toward target" value="68%" unit="of $300k" sub={<Progress value={68} />} />`);
u('line-chart','LineChart Legend','LineChart, Legend',`<Legend items={[{ label: "2026", color: "c1", value: "$612k" }, { label: "2025", color: "c3" }]} />
<LineChart
  pre="$"
  labels={months}
  series={[{ data: thisYear }, { data: lastYear, color: "c3", dashed: true }]}
/>`);
u('bar-chart','BarChart','BarChart',`<BarChart data={revenue} labels={months} highlight={9} pre="$" />
<BarChart stacked labels={months} series={[{ data: newBiz, color: "c1" }, { data: expansion, color: "c2" }]} />`);
u('donut-chart','DonutChart','DonutChart',`<DonutChart label="$1.24M" sub="pipeline" data={[
  { value: 42, color: "c1" }, { value: 26, color: "c2" }, { value: 18, color: "c3" }, { value: 14, color: "c4" },
]} />`);
u('sparkline','Sparkline','Sparkline',`<Sparkline data={[3, 5, 4, 7, 6, 9]} color="c6" width={130} height={40} />`);
u('bar-list','BarList','BarList',`<BarList rows={[
  { label: "Website", value: 412, icon: "globe" },
  { label: "Referrals", value: 268, icon: "users" },
]} />`);
u('breakdown-bar','BreakdownBar Legend','BreakdownBar, Legend',`const parts = [
  { label: "Enterprise", value: 42, color: "c1" }, { label: "SMB", value: 18, color: "c3" },
] as const;
<BreakdownBar thin parts={[...parts]} />
<Legend items={parts.map((p) => ({ label: p.label, color: p.color, value: \`\${p.value}%\` }))} />`);
u('gauge-chart','Gauge','Gauge',`<Gauge value={64} sub="quota attained" />`);
u('heatmap','Heatmap','Heatmap',`<Heatmap values={activityByDayAndHour /* 7 × 24, values 0–1 */} />`);
u('pill-bar-chart','PillBarChart','PillBarChart',`<PillBarChart data={[32, 48, 40, 62, 74, 56, 38]} labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]} highlight={4} />`);
u('value-chart','ValueChart','ValueChart, Stat',`const [v, setV] = useState(48210);
<Stat label="MRR" value={\`$\${v.toLocaleString()}\`} />
<ValueChart data={mrr} pre="$" onHover={setV} />`);
u('usage-meter','UsageMeter BreakdownBar','UsageMeter',`<UsageMeter title="Context window" used="74k" total="200k" parts={[
  { label: "Messages", value: 22, color: "c1", display: "44k" },
  { label: "Files", value: 9, color: "c2", display: "18k" },
  { label: "Free", value: 63, color: "free", display: "126k" },
]} />`);
u('funnel-chart','FunnelChart','FunnelChart',`<FunnelChart steps={[
  { label: "Leads", value: 4200 }, { label: "Qualified", value: 1680 }, { label: "Won", value: 112 },
]} />`);
u('scatter-chart','ScatterChart','ScatterChart',`<ScatterChart points={deals.map((d) => ({ x: d.speed, y: d.size, size: d.seats / 20, color: "c1" }))} />`);
u('bullet-chart','BulletChart','BulletChart',`<BulletChart rows={[
  { label: "Maya Okafor", value: 92, target: 80 },
  { label: "Leo Brandt", value: 71, target: 80 },
]} />`);
u('combo-chart','ComboChart','ComboChart',`<ComboChart bars={dealsClosed} line={winRate} labels={months} unit="%" />`);
u('radar-chart','RadarChart','RadarChart',`<RadarChart
  axes={["Prospecting", "Discovery", "Demo", "Negotiation", "Closing", "Follow-up"]}
  series={[{ data: maya, color: "c1" }, { data: leo, color: "c2" }]}
/>`);

/* Utility */
u('visually-hidden','VisuallyHidden','VisuallyHidden, Button',`<Button icon="trash"><VisuallyHidden>Delete deal</VisuallyHidden></Button>`);
u('theme','Theme','ThemeToggle, Theme, useTheme',`<ThemeToggle />                       {/* light · dark · auto */}
<Theme preset="ember"><App /></Theme>   {/* re-key the accent */}
const [mode, setMode] = useTheme();`);
u('hooks','hooks','useEscape, useMedia, useHotkey, useControllable',`useHotkey("k", () => setPaletteOpen(true));
const narrow = useMedia("(max-width: 860px)");
useEscape(open, () => setOpen(false));`);
u('link-provider','LinkProvider','LinkProvider',`import { Link } from "react-router";

<LinkProvider component={({ href = "/", ...p }) => <Link to={href} {...p} />}>
  <App />
</LinkProvider>`);
})();
