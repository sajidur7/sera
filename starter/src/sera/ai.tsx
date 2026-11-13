/**
 * AI — pieces for assistants and agents.
 * ThinkingLine · ThinkingTrace · StreamingText · PromptBar · ToolChip · ApprovalCard · RecommendationCard ·
 * ContextCard · InsightCard · DiffTable · TaskList · ParameterCard · FollowUps · PromptComposer · ContextChunk ·
 * InsightPager · TaskRows · Flowchart · FineTuneCard · SelectionActions · AgentScreen
 */
import * as stylex from "@stylexjs/stylex";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { color, font, motion, radius, shadow } from "./tokens.stylex";
import { Icon, type IconName } from "./icons";
import { Button, DropdownMenu, IconButton, MenuItem, MenuLabel } from "./action";
import { Avatar, Tag, type Tint } from "./content";
import { PixelLoader, Progress, SegmentMeter, StatusPill } from "./feedback";
import { RadioGroup, SliderBar } from "./forms";
import { Attachment } from "./chat";
import { useControllable, type XStyle } from "./lib";

const shimmer = stylex.keyframes({ from: { backgroundPosition: "100% 0" }, to: { backgroundPosition: "-100% 0" } });
const blink = stylex.keyframes({ "0%, 100%": { opacity: 0.2 }, "50%": { opacity: 1 } });

// #region ThinkingLine
const th = stylex.create({
  line: { display: "inline-flex", alignItems: "center", gap: 10, fontSize: 14, color: color.fg2 },
  shimmer: { backgroundImage: `linear-gradient(90deg, ${color.fg3} 0%, ${color.fg} 45%, ${color.fg3} 90%)`, backgroundSize: "250% 100%", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", animationName: shimmer, animationDuration: "2.2s", animationIterationCount: "infinite", animationTimingFunction: "linear" },
  t: { fontFamily: font.mono, fontSize: 12.5, color: color.fg4, fontVariantNumeric: "tabular-nums" },
});
/** Loader + shimmering status + elapsed time. Pass `live` to count the seconds up for as long as it is mounted. */
export function ThinkingLine({ children, seconds, live, pattern = "drive" }: { children: ReactNode; seconds?: number; live?: boolean; pattern?: "drive" | "orbit" | "scan" | "dots" | "churn" }) {
  const [elapsed, setElapsed] = useState(seconds ?? 0);
  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => setElapsed((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, [live]);
  const shown = live ? elapsed : seconds;
  return <span role="status" {...stylex.props(th.line)}><PixelLoader pattern={pattern} /><span {...stylex.props(th.shimmer)}>{children}</span>{shown != null && <span {...stylex.props(th.t)}>{shown}s</span>}</span>;
}
// #endregion

// #region ThinkingTrace
const tt = stylex.create({
  sum: { display: "inline-flex", alignItems: "center", gap: 8, padding: 0, borderWidth: 0, backgroundColor: "transparent", color: color.fg2, fontFamily: font.sans, fontSize: 14, cursor: "pointer" },
  car: { display: "inline-flex", color: color.fg4, transitionProperty: "transform", transitionDuration: ".25s" }, flip: { transform: "rotate(180deg)" },
  list: { listStyle: "none", marginTop: 10, marginBottom: 0, marginLeft: 7, paddingLeft: 16, borderLeftWidth: 1, borderLeftStyle: "dashed", borderLeftColor: color.line3, display: "flex", flexDirection: "column", gap: 9 },
  step: { display: "flex", alignItems: "center", flexWrap: "wrap", columnGap: 9, rowGap: 4, fontSize: 13.5, color: color.fg },
  ic: { color: color.fg3, display: "inline-flex" },
  detail: { flexBasis: "100%", marginLeft: 23, fontSize: 13, lineHeight: 1.5, color: color.fg3 },
});
export type TraceStep = { icon: IconName; text: ReactNode; detail?: ReactNode };
/** What the model did, step by step. Give a step a `detail` for reasoning, search results or a code edit. */
export function ThinkingTrace({ summary, steps, defaultOpen = true }: { summary: ReactNode; steps: TraceStep[]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} {...stylex.props(tt.sum)}><span {...stylex.props(tt.car, open && tt.flip)}><Icon name="chev-down" size={14} /></span>{summary}</button>
      {open && <ol {...stylex.props(tt.list)}>{steps.map((s, i) => <li key={i} {...stylex.props(tt.step)}><span {...stylex.props(tt.ic)}><Icon name={s.icon} size={14} /></span>{s.text}{s.detail && <span {...stylex.props(tt.detail)}>{s.detail}</span>}</li>)}</ol>}
    </div>
  );
}
// #endregion

// #region StreamingText
const sx = stylex.create({ p: { margin: 0, maxWidth: "62ch", fontSize: 14, lineHeight: 1.65, color: color.fg2 }, caret: { display: "inline-block", width: 7, height: "1em", marginLeft: 2, verticalAlign: -2, borderRadius: 2, backgroundColor: color.accent, animationName: blink, animationDuration: "1s", animationIterationCount: "infinite" } });
/** Reveals text word by word. Pass the full string; it restarts when `text` changes. */
export function StreamingText({ text, speed = 38, onDone }: { text: string; speed?: number; onDone?: () => void }) {
  const words = text.split(/(\s+)/);
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    const t = setInterval(() => setN((v) => { if (v >= words.length) { clearInterval(t); onDone?.(); return v; } return v + 1; }), speed);
    return () => clearInterval(t);
  }, [text]); // eslint-disable-line react-hooks/exhaustive-deps
  return <p aria-live="polite" {...stylex.props(sx.p)}>{words.slice(0, n).join("")}{n < words.length && <span {...stylex.props(sx.caret)} />}</p>;
}
// #endregion

// #region PromptBar
const pb = stylex.create({
  pill: { display: "flex", alignItems: "center", gap: 8, width: "min(320px, 100%)", height: 44, paddingLeft: 16, paddingRight: 6, borderWidth: 0, borderRadius: radius.lg, backgroundColor: color.raised, boxShadow: `inset 0 0 0 1px ${color.line2}`, color: color.fg4, fontFamily: font.sans, fontSize: 14, cursor: "text", textAlign: "left" },
  grow: { flexGrow: 1 },
});
/** A pill that opens into the full composer. Render your ChatComposer as `children`. */
export function PromptBar({ label = "Ask…", icon = "bot", shortcut, children }: { label?: string; icon?: IconName; shortcut?: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  if (open) return <>{children}</>;
  return <button type="button" onClick={() => setOpen(true)} {...stylex.props(pb.pill)}><Icon name={icon} /><span {...stylex.props(pb.grow)}>{label}</span>{shortcut}</button>;
}
// #endregion

// #region ToolChip
/** A file or tool the agent touched. Alias of chat Attachment for AI surfaces. */
export const ToolChip = Attachment;
// #endregion

// #region ApprovalCard
const ap = stylex.create({
  card: { width: "min(460px, 100%)", borderRadius: radius.xl, backgroundColor: color.surface, boxShadow: `inset 0 0 0 1px ${color.line}, ${shadow.card}` },
  body: { display: "flex", flexDirection: "column", gap: 14, padding: 16 },
  kicker: { display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: color.fg3 },
  q: { fontSize: 15, fontWeight: 600, color: color.fg },
  foot: { display: "flex", alignItems: "center", gap: 8, paddingBlock: 12, paddingInline: 14, borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: color.line },
  step: { marginRight: "auto", fontSize: 12.5, color: color.fg3 },
});
/** The assistant pauses and asks; options are radios. */
export function ApprovalCard({ question, options, step, total, onSkip, onContinue }: {
  question: ReactNode; options: { value: string; label: ReactNode; description?: ReactNode }[]; step?: number; total?: number; onSkip?: () => void; onContinue: (value: string) => void;
}) {
  const [v, setV] = useState(options[0]?.value ?? "");
  return (
    <div {...stylex.props(ap.card)}>
      <div {...stylex.props(ap.body)}><span {...stylex.props(ap.kicker)}><Icon name="bot" size={15} />Needs your decision</span><span {...stylex.props(ap.q)}>{question}</span><RadioGroup label="Options" options={options} value={v} onChange={setV} /></div>
      <div {...stylex.props(ap.foot)}>{step && total && <span {...stylex.props(ap.step)}>{step} of {total}</span>}<Button size="sm" variant="ghost" onClick={onSkip}>Skip</Button><Button size="sm" variant="primary" iconEnd="arrow-right" onClick={() => onContinue(v)}>Continue</Button></div>
    </div>
  );
}
// #endregion

// #region RecommendationCard
const rc = stylex.create({
  ticks: { display: "flex", gap: 3, alignItems: "flex-end" },
  tick: (h: number) => ({ width: 4, height: h, borderRadius: 2, backgroundColor: color.line2 }),
  on: { backgroundColor: color.ok },
  head: { display: "flex", alignItems: "center", gap: 8 },
  grow: { flexGrow: 1 },
  title: { fontSize: 15.5, fontWeight: 600, color: color.fg },
  body: { margin: 0, fontSize: 13.5, color: color.fg3 },
  pct: { fontSize: 12.5, fontWeight: 600, fontVariantNumeric: "tabular-nums", color: color.fg },
  alts: { display: "flex", flexDirection: "column", gap: 4 },
  alt: { display: "flex", alignItems: "center", gap: 10, width: "100%", minHeight: 38, paddingInline: 10, borderWidth: 0, borderRadius: radius.md, backgroundColor: { default: color.well, ":hover": color.hover }, boxShadow: `inset 0 0 0 1px ${color.line}`, color: color.fg, fontFamily: font.sans, fontSize: 13.5, textAlign: "left", cursor: "pointer" },
  altTitle: { flexGrow: 1, minWidth: 0 },
  left: { marginRight: "auto" },
});
export function Confidence({ level }: { level: 1 | 2 | 3 | 4 }) {
  return <span aria-label={`Confidence ${level} of 4`} {...stylex.props(rc.ticks)}>{[8, 11, 14, 17].map((h, i) => <span key={h} {...stylex.props(rc.tick(h), i < level && rc.on)} />)}</span>;
}
export type Alternative = { title: ReactNode; score: number };
/** A suggested next step. Pass `score` (0–100) for a confidence meter, and `alternatives` so people can swap the suggestion. */
export function RecommendationCard({ kicker = "Next step", title, children, confidence, score, alternatives, onPick, actions }: {
  kicker?: string; title: ReactNode; children: ReactNode; confidence?: 1 | 2 | 3 | 4; score?: number; alternatives?: Alternative[]; onPick?: (index: number) => void; actions: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div {...stylex.props(ap.card)}>
      <div {...stylex.props(ap.body)}>
        <div {...stylex.props(rc.head)}>
          <Tag tone="violet">{kicker}</Tag><span {...stylex.props(rc.grow)} />
          {score != null ? <><SegmentMeter value={score} tone="ok" width={84} /><span {...stylex.props(rc.pct)}>{score}%</span></>
            : confidence ? <><Confidence level={confidence} /><span {...stylex.props(ap.step)}>{["Low", "Fair", "High", "Very high"][confidence - 1]}</span></> : null}
        </div>
        <span {...stylex.props(rc.title)}>{title}</span><p {...stylex.props(rc.body)}>{children}</p>
        {open && alternatives && (
          <div {...stylex.props(rc.alts)}>
            {alternatives.map((a, i) => (
              <button key={i} type="button" onClick={() => { onPick?.(i); setOpen(false); }} {...stylex.props(rc.alt)}>
                <span {...stylex.props(rc.altTitle)}>{a.title}</span><SegmentMeter value={a.score} segments={9} width={44} /><span {...stylex.props(rc.pct)}>{a.score}%</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div {...stylex.props(ap.foot)}>
        {alternatives?.length ? <Button size="sm" variant="ghost" icon="chevs" aria-expanded={open} onClick={() => setOpen(!open)} xstyle={rc.left}>Alternatives</Button> : <span {...stylex.props(rc.grow)} />}
        {actions}
      </div>
    </div>
  );
}
// #endregion

// #region ContextCard
const cx = stylex.create({ card: { display: "flex", alignItems: "center", gap: 10, padding: 12, borderRadius: radius.lg, backgroundColor: color.surface, boxShadow: `inset 0 0 0 1px ${color.line}` }, t: { display: "block", fontWeight: 500, color: color.fg }, s: { display: "block", fontSize: 12.5, color: color.fg3 } });
/** One thing the assistant is looking at. */
export function ContextCard({ icon, title, subtitle, tint = "c2", onRemove }: { icon: IconName; title: ReactNode; subtitle?: ReactNode; tint?: Tint; onRemove?: () => void }) {
  return (
    <div {...stylex.props(cx.card)}>
      <Avatar name={String(title)} icon={icon} tint={tint} size="sm" square />
      <div style={{ flexGrow: 1, minWidth: 0 }}><span {...stylex.props(cx.t)}>{title}</span>{subtitle && <span {...stylex.props(cx.s)}>{subtitle}</span>}</div>
      {onRemove && <IconButton icon="x" label="Remove from context" size="xs" onClick={onRemove} />}
    </div>
  );
}
// #endregion

// #region InsightCard
/** One number, one trend, one sentence about why. Compose with Stat + Sparkline from charts.tsx. */
export function InsightCard({ label, stat, trend, children, action }: { label: ReactNode; stat: ReactNode; trend?: ReactNode; children: ReactNode; action?: ReactNode }) {
  return (
    <div {...stylex.props(ap.card)}>
      <div {...stylex.props(ap.body)}>
        <div {...stylex.props(rc.head)}><span {...stylex.props(ap.kicker)}>{label}</span><span {...stylex.props(rc.grow)} /><Tag tone="violet">Insight</Tag></div>
        <div {...stylex.props(rc.head)}><span {...stylex.props(rc.grow)}>{stat}</span>{trend}</div>
        <p {...stylex.props(rc.body)}>{children}</p>{action}
      </div>
    </div>
  );
}
// #endregion

// #region DiffTable
const df = stylex.create({
  head: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingBlock: 12, paddingInline: 14, fontWeight: 500, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.line, color: color.fg },
  sub: { color: color.fg4, fontWeight: 400, fontSize: 12.5 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13.5 },
  th: { textAlign: "left", paddingBlock: 10, paddingInline: 14, color: color.fg3, fontWeight: 400, fontSize: 12.5, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.line },
  td: { height: 42, paddingInline: 14, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.line, cursor: "pointer" },
  rm: { backgroundColor: color.badSoft, color: color.bad },
  add: { backgroundColor: color.okSoft, color: color.ok },
  off: { backgroundColor: "transparent", color: color.fg3 },
  strike: { textDecorationLine: "line-through" },
  box: { width: 18, height: 18, borderRadius: 5, display: "grid", placeItems: "center", marginLeft: "auto", color: "#fff" },
  boxRm: { backgroundColor: color.bad }, boxAdd: { backgroundColor: color.ok }, boxOff: { boxShadow: `inset 0 0 0 1px ${color.line3}` },
  foot: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingBlock: 10, paddingRight: 12, paddingLeft: 14, fontSize: 12.5, color: color.fg3 },
  btns: { display: "flex", gap: 6 },
});
export type Change = { id: string; label: ReactNode; from: ReactNode; to: ReactNode };
/** Proposed changes as red/green row pairs. Click a pair to leave it out. */
export function DiffTable({ title, changes, onApply, onDiscard, xstyle }: { title: ReactNode; changes: Change[]; onApply: (ids: string[]) => void; onDiscard?: () => void; xstyle?: XStyle }) {
  const [off, setOff] = useState<string[]>([]);
  const toggle = (id: string) => setOff((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]));
  const kept = changes.filter((c) => !off.includes(c.id));
  return (
    <div {...stylex.props(ap.card, xstyle)} style={{ width: "100%", maxWidth: 560, overflow: "hidden" }}>
      <div {...stylex.props(df.head)}>{title}<span {...stylex.props(df.sub)}>{kept.length} of {changes.length} selected</span></div>
      <table {...stylex.props(df.table)}>
        <thead><tr><th {...stylex.props(df.th)}>Item</th><th {...stylex.props(df.th)}>Value</th><th {...stylex.props(df.th)} /></tr></thead>
        <tbody>{changes.flatMap((c) => { const o = off.includes(c.id); return [
          <tr key={`${c.id}-a`} onClick={() => toggle(c.id)}><td {...stylex.props(df.td, o ? df.off : df.rm)}>{c.label}</td><td {...stylex.props(df.td, o ? df.off : df.rm, !o && df.strike)}>{c.from}</td><td {...stylex.props(df.td, o ? df.off : df.rm)}><span {...stylex.props(df.box, o ? df.boxOff : df.boxRm)}>{!o && <Icon name="minus" size={12} />}</span></td></tr>,
          <tr key={`${c.id}-b`} onClick={() => toggle(c.id)}><td {...stylex.props(df.td, o ? df.off : df.add)}>{c.label}</td><td {...stylex.props(df.td, o ? df.off : df.add)}>{c.to}</td><td {...stylex.props(df.td, o ? df.off : df.add)}><span {...stylex.props(df.box, o ? df.boxOff : df.boxAdd)}>{!o && <Icon name="plus" size={12} />}</span></td></tr>,
        ]; })}</tbody>
      </table>
      <div {...stylex.props(df.foot)}><span>Nothing changes until you apply</span><span {...stylex.props(df.btns)}><Button size="sm" variant="ghost" onClick={onDiscard}>Discard</Button><Button size="sm" variant="primary" onClick={() => onApply(kept.map((c) => c.id))}>Apply {kept.length}</Button></span></div>
    </div>
  );
}
// #endregion

// #region TaskList
const tl = stylex.create({
  list: { display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 480 },
  cap: { display: "flex", alignItems: "center", gap: 12, minHeight: 46, paddingLeft: 8, paddingRight: 10, borderRadius: radius.lg, backgroundColor: color.surface, boxShadow: `inset 0 0 0 1px ${color.line2}, ${shadow.card}` },
  disc: { width: 28, height: 28, flex: "none", borderRadius: "50%", display: "grid", placeItems: "center", fontSize: 11.5, fontWeight: 600, backgroundColor: color.sunken, boxShadow: `inset 0 0 0 1px ${color.line2}`, color: color.fg3 },
  done: { backgroundColor: color.ok, color: "#06200f", boxShadow: "none" },
  run: { backgroundColor: "transparent", boxShadow: `inset 0 0 0 1.5px ${color.accent}`, color: color.accent },
  fail: { backgroundColor: color.badSoft, color: color.bad, boxShadow: "none" },
  label: { flexGrow: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500, color: color.fg },
  meta: { fontSize: 13, color: color.fg3, whiteSpace: "nowrap" },
});
export type Task = { label: ReactNode; state: "waiting" | "running" | "done" | "failed"; meta?: ReactNode };
/** Agent steps as capsules: numbered → running → done. */
export function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <ol {...stylex.props(tl.list)} style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {tasks.map((t, i) => (
        <li key={i} {...stylex.props(tl.cap)}>
          <span {...stylex.props(tl.disc, t.state === "done" && tl.done, t.state === "running" && tl.run, t.state === "failed" && tl.fail)}>
            {t.state === "done" ? <Icon name="check" size={14} /> : t.state === "running" ? <PixelLoader pattern="orbit" size={3} accent /> : t.state === "failed" ? <Icon name="x" size={14} /> : i + 1}
          </span>
          <span {...stylex.props(tl.label)}>{t.label}</span>
          {t.state === "done" && !t.meta ? <StatusPill tone="ok">Done</StatusPill> : <span {...stylex.props(tl.meta)}>{t.meta ?? (t.state === "running" ? "Running" : "Waiting")}</span>}
        </li>
      ))}
    </ol>
  );
}
// #endregion

// #region ParameterCard
const pc = stylex.create({ head: { display: "flex", alignItems: "center", justifyContent: "space-between", paddingBlock: 12, paddingInline: 16, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.line, fontWeight: 600, color: color.fg }, body: { display: "flex", flexDirection: "column", gap: 10, padding: 16 } });
/** A card of tuning controls — put SliderBar, Switch and SegmentedControl rows inside. */
export function ParameterCard({ title, badge, children }: { title: ReactNode; badge?: ReactNode; children: ReactNode }) {
  return <div {...stylex.props(ap.card)} style={{ width: "min(380px, 100%)" }}><div {...stylex.props(pc.head)}>{title}{badge}</div><div {...stylex.props(pc.body)}>{children}</div></div>;
}
// #endregion

// #region FollowUps
const fu = stylex.create({
  list: { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6 },
  q: { display: "inline-flex", alignItems: "center", gap: 8, minHeight: 32, paddingBlock: 6, paddingInline: 12, borderWidth: 0, borderRadius: radius.pill, backgroundColor: { default: "transparent", ":hover": color.hover }, boxShadow: `inset 0 0 0 1px ${color.line2}`, color: { default: color.fg2, ":hover": color.fg }, fontFamily: font.sans, fontSize: 13.5, textAlign: "left", cursor: "pointer" },
  ic: { display: "inline-flex", color: color.fg4 },
});
/** Questions to ask next. Show it once StreamingText calls `onDone`. */
export function FollowUps({ questions, onPick }: { questions: string[]; onPick: (question: string) => void }) {
  return (
    <div role="group" aria-label="Follow-up questions" {...stylex.props(fu.list)}>
      {questions.map((q) => <button key={q} type="button" onClick={() => onPick(q)} {...stylex.props(fu.q)}><span {...stylex.props(fu.ic)}><Icon name="arrow-right" size={13} /></span>{q}</button>)}
    </div>
  );
}
// #endregion

// #region PromptComposer
const wave = stylex.keyframes({ "0%, 100%": { transform: "scaleY(.3)" }, "50%": { transform: "scaleY(1)" } });
const cp = stylex.create({
  box: { width: "100%", maxWidth: 600, padding: 8, borderRadius: radius.xxl, backgroundColor: color.surface, boxShadow: { default: `inset 0 0 0 1px ${color.line2}, ${shadow.card}`, ":focus-within": `inset 0 0 0 1px ${color.line3}, 0 0 0 4px ${color.accentSoft}, ${shadow.card}` } },
  area: { display: "block", width: "100%", minHeight: 44, maxHeight: 180, resize: "none", borderWidth: 0, backgroundColor: "transparent", outline: "none", paddingBlock: 8, paddingInline: 10, fontFamily: font.sans, fontSize: 15, lineHeight: 1.5, color: color.fg },
  row: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6 },
  grow: { flexGrow: 1 },
  listening: { display: "flex", alignItems: "center", gap: 10, paddingBlock: 6, paddingInline: 10, fontSize: 12.5, color: color.fg3 },
  bars: { display: "inline-flex", alignItems: "center", gap: 2, height: 18 },
  bar: (delay: string) => ({ width: 2, height: 18, borderRadius: 1, backgroundColor: color.accent, animationName: wave, animationDuration: ".9s", animationIterationCount: "infinite", animationDelay: delay }),
});
export type PromptSource = { id: string; label: string; icon: IconName; count?: string };
export type PromptCommand = { id: string; label: string; hint?: string; icon?: IconName };
/** The full composer: @ adds a source, / runs a command, with a model picker and dictation. Enter sends, Shift+Enter breaks the line. */
export function PromptComposer({ value, onChange, onSend, sources = [], commands = [], models = [], model, onModelChange, listening, onDictate, placeholder = "Ask anything" }: {
  value?: string; onChange?: (value: string) => void; onSend: (value: string) => void; sources?: PromptSource[]; commands?: PromptCommand[];
  models?: string[]; model?: string; onModelChange?: (model: string) => void; listening?: boolean; onDictate?: () => void; placeholder?: string;
}) {
  const [text, setText] = useControllable(value, "", onChange);
  const insert = (s: string) => setText(`${text.replace(/[@/]$/, "")}${s} `);
  const ready = text.trim().length > 0;
  const current = model ?? models[0];
  return (
    <div {...stylex.props(cp.box)}>
      {listening && <div role="status" {...stylex.props(cp.listening)}><span aria-hidden {...stylex.props(cp.bars)}>{Array.from({ length: 18 }, (_, i) => <span key={i} {...stylex.props(cp.bar(`${(i % 6) * -0.15}s`))} />)}</span>Listening</div>}
      <textarea rows={2} aria-label="Prompt" placeholder={placeholder} value={text} onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && ready) { e.preventDefault(); onSend(text); } }} {...stylex.props(cp.area)} />
      <div {...stylex.props(cp.row)}>
        {sources.length > 0 && (
          <DropdownMenu trigger={<Button size="sm" variant="ghost" icon="at">Sources</Button>}>
            <MenuLabel>Add a source</MenuLabel>
            {sources.map((s) => <MenuItem key={s.id} icon={s.icon} shortcut={s.count} onSelect={() => insert(`@${s.label}`)}>{s.label}</MenuItem>)}
          </DropdownMenu>
        )}
        {commands.length > 0 && (
          <DropdownMenu trigger={<Button size="sm" variant="ghost" icon="term">Commands</Button>}>
            <MenuLabel>Run a command</MenuLabel>
            {commands.map((c) => <MenuItem key={c.id} icon={c.icon} shortcut={c.hint} onSelect={() => insert(`/${c.id}`)}>{c.label}</MenuItem>)}
          </DropdownMenu>
        )}
        <span {...stylex.props(cp.grow)} />
        {models.length > 0 && (
          <DropdownMenu align="end" trigger={<Button size="sm" variant="ghost" icon="cpu" iconEnd="chev-down">{current}</Button>}>
            <MenuLabel>Model</MenuLabel>
            {models.map((m) => <MenuItem key={m} checked={m === current} onSelect={() => onModelChange?.(m)}>{m}</MenuItem>)}
          </DropdownMenu>
        )}
        {onDictate && <IconButton icon="mic" label={listening ? "Stop dictating" : "Dictate"} size="sm" variant={listening ? "accent" : "ghost"} aria-pressed={listening} onClick={onDictate} />}
        <IconButton icon="arrow-up" label="Send" size="sm" variant={ready ? "primary" : "ghost"} disabled={!ready} onClick={() => onSend(text)} />
      </div>
    </div>
  );
}
// #endregion

// #region ContextChunk
const ck = stylex.create({
  card: { display: "flex", flexDirection: "column", gap: 10, padding: 12, borderRadius: radius.lg, backgroundColor: color.surface, boxShadow: `inset 0 0 0 1px ${color.line}` },
  head: { display: "flex", alignItems: "center", gap: 8, minWidth: 0, color: color.fg3 },
  file: { fontFamily: font.mono, fontSize: 12.5, fontWeight: 500, color: color.fg, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  lines: { fontFamily: font.mono, fontSize: 11.5, color: color.fg4, whiteSpace: "nowrap" },
  grow: { flexGrow: 1 },
  pct: { fontSize: 12, color: color.fg3, fontVariantNumeric: "tabular-nums" },
  text: { margin: 0, fontSize: 13.5, lineHeight: 1.55, color: color.fg2 },
  foot: { display: "flex", alignItems: "center", gap: 8 },
});
/** One retrieved chunk: the file and lines it came from, how well it matched, and the text. Wrap the matched words in <mark>. */
export function ContextChunk({ file, lines, score, children, pinned, onPin, footer }: { file: string; lines?: string; score?: number; children: ReactNode; pinned?: boolean; onPin?: () => void; footer?: ReactNode }) {
  return (
    <article {...stylex.props(ck.card)}>
      <header {...stylex.props(ck.head)}>
        <Icon name="file" size={14} /><span {...stylex.props(ck.file)}>{file}</span>{lines && <span {...stylex.props(ck.lines)}>{lines}</span>}<span {...stylex.props(ck.grow)} />
        {score != null && <><SegmentMeter value={score} segments={9} tone="accent" width={40} /><span {...stylex.props(ck.pct)}>{score}%</span></>}
      </header>
      <p {...stylex.props(ck.text)}>{children}</p>
      {(footer || onPin) && <footer {...stylex.props(ck.foot)}>{footer}<span {...stylex.props(ck.grow)} />{onPin && <Button size="xs" variant="ghost" icon="pin" aria-pressed={pinned} onClick={onPin}>{pinned ? "Pinned" : "Pin"}</Button>}</footer>}
    </article>
  );
}
// #endregion

// #region InsightPager
const ip = stylex.create({
  head: { display: "flex", alignItems: "center", gap: 8, paddingBlock: 10, paddingLeft: 16, paddingRight: 10, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.line, fontWeight: 600, color: color.fg },
  count: { marginLeft: "auto", fontSize: 12.5, fontWeight: 400, color: color.fg3, fontVariantNumeric: "tabular-nums" },
  row: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 },
  label: { display: "block", fontSize: 12.5, color: color.fg3 },
  value: { display: "block", marginTop: 6, fontSize: 28, lineHeight: 1.1, fontWeight: 600, letterSpacing: "-.03em", fontVariantNumeric: "tabular-nums", color: color.fg },
  dots: { display: "flex", justifyContent: "center", gap: 5 },
  dot: { width: 5, height: 5, borderRadius: 1, backgroundColor: color.line3 },
  dotOn: { backgroundColor: color.fg },
});
export type Insight = { label: ReactNode; value: ReactNode; delta?: ReactNode; chart?: ReactNode; body: ReactNode };
/** Several insights in one card, one at a time. Put a ValueChart in `chart` so the number can be scrubbed. */
export function InsightPager({ title = "Insights", insights, index, onIndexChange }: { title?: ReactNode; insights: Insight[]; index?: number; onIndexChange?: (index: number) => void }) {
  const [i, setI] = useControllable(index, 0, onIndexChange);
  const n = insights.length, cur = insights[Math.min(i, n - 1)];
  const go = (d: number) => setI((i + d + n) % n);
  if (!cur) return null;
  return (
    <div {...stylex.props(ap.card)}>
      <div {...stylex.props(ip.head)}>
        <Icon name="zap" size={14} />{title}<span {...stylex.props(ip.count)}>{i + 1} of {n}</span>
        <IconButton icon="chev-left" label="Previous insight" size="xs" onClick={() => go(-1)} /><IconButton icon="chev-right" label="Next insight" size="xs" onClick={() => go(1)} />
      </div>
      <div aria-live="polite" {...stylex.props(ap.body)}>
        <div {...stylex.props(ip.row)}><div><span {...stylex.props(ip.label)}>{cur.label}</span><span {...stylex.props(ip.value)}>{cur.value}</span></div>{cur.delta}</div>
        {cur.chart}<p {...stylex.props(rc.body)}>{cur.body}</p>
        <div aria-hidden {...stylex.props(ip.dots)}>{insights.map((_, k) => <span key={k} {...stylex.props(ip.dot, k === i && ip.dotOn)} />)}</div>
      </div>
    </div>
  );
}
// #endregion

// #region TaskRows
const tk = stylex.create({
  list: { width: "100%", maxWidth: 520, margin: 0, padding: 0, listStyle: "none", overflow: "hidden", borderRadius: radius.xl, backgroundColor: color.surface, boxShadow: `inset 0 0 0 1px ${color.line}, ${shadow.card}` },
  item: { borderTopWidth: { default: 1, ":first-child": 0 }, borderTopStyle: "solid", borderTopColor: color.line },
  head: { display: "flex", alignItems: "center", gap: 12, minHeight: 56, paddingBlock: 10, paddingInline: 14, backgroundColor: { default: "transparent", ":hover": color.hover }, fontSize: 13.5, color: color.fg, cursor: "pointer" },
  ic: { width: 22, height: 22, flex: "none", display: "grid", placeItems: "center", color: color.fg4 },
  ok: { color: color.ok }, bad: { color: color.bad }, run: { color: color.accent },
  main: { flexGrow: 1, minWidth: 0 },
  title: { display: "block", fontWeight: 500 },
  detail: { display: "block", fontSize: 12.5, color: color.fg3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  bar: { width: 96, flex: "none" },
  car: { display: "inline-flex", color: color.fg4, transitionProperty: "transform", transitionDuration: ".25s" }, flip: { transform: "rotate(180deg)" },
  log: { margin: 0, paddingTop: 2, paddingBottom: 12, paddingLeft: 48, paddingRight: 14, fontFamily: font.mono, fontSize: 12, lineHeight: 1.7, color: color.fg3, whiteSpace: "pre-wrap" },
});
export type TaskRow = { id: string; title: ReactNode; state: "queued" | "running" | "done" | "failed"; detail?: ReactNode; progress?: number; log?: string[] };
/** Live task status as rows: what is running, what failed and what finished, with the log one click away. */
export function TaskRows({ tasks, onRetry }: { tasks: TaskRow[]; onRetry?: (id: string) => void }) {
  const [open, setOpen] = useState<string[]>([]);
  const toggle = (id: string) => setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]));
  return (
    <ul {...stylex.props(tk.list)}>
      {tasks.map((t) => {
        const isOpen = open.includes(t.id);
        return (
          <li key={t.id} {...stylex.props(tk.item)}>
            <div role="button" tabIndex={0} aria-expanded={isOpen} onClick={() => toggle(t.id)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(t.id); } }} {...stylex.props(tk.head)}>
              <span {...stylex.props(tk.ic, t.state === "done" && tk.ok, t.state === "failed" && tk.bad, t.state === "running" && tk.run)}>
                {t.state === "running" ? <PixelLoader pattern="orbit" size={3} accent /> : <Icon name={t.state === "done" ? "check-c" : t.state === "failed" ? "x-c" : "dashed"} size={18} />}
              </span>
              <span {...stylex.props(tk.main)}><span {...stylex.props(tk.title)}>{t.title}</span>{t.detail && <span {...stylex.props(tk.detail)}>{t.detail}</span>}</span>
              {t.state === "running" && <span {...stylex.props(tk.bar)}><Progress value={t.progress} label="Progress" /></span>}
              {t.state === "failed" && onRetry && <Button size="xs" icon="refresh" onClick={(e) => { e.stopPropagation(); onRetry(t.id); }}>Retry</Button>}
              {t.state === "done" && <StatusPill tone="ok">Done</StatusPill>}
              {t.log && <span {...stylex.props(tk.car, isOpen && tk.flip)}><Icon name="chev-down" size={14} /></span>}
            </div>
            {isOpen && t.log && <pre {...stylex.props(tk.log)}>{t.log.join("\n")}</pre>}
          </li>
        );
      })}
    </ul>
  );
}
// #endregion

// #region Flowchart
const fc = stylex.create({
  canvas: { display: "flex", justifyContent: "center", width: "100%", paddingBlock: 28, paddingInline: 20, overflowX: "auto", borderRadius: radius.xl, backgroundColor: color.well, backgroundImage: `radial-gradient(${color.line2} 1px, transparent 1.2px)`, backgroundSize: "16px 16px", boxShadow: `inset 0 0 0 1px ${color.line}` },
  col: { display: "flex", flexDirection: "column", alignItems: "center", minWidth: 0 },
  link: { position: "relative", width: 1.5, height: 26, flex: "none", backgroundColor: color.line3 },
  label: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", height: 18, paddingInline: 7, display: "grid", placeItems: "center", borderRadius: radius.pill, backgroundColor: color.raised, boxShadow: `inset 0 0 0 1px ${color.line2}`, fontSize: 11, fontWeight: 500, color: color.fg2 },
  split: { position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 20, alignItems: "start" },
  rail: { position: "absolute", top: 0, left: "calc(25% - 5px)", right: "calc(25% - 5px)", height: 1.5, backgroundColor: color.line3 },
  node: { display: "flex", alignItems: "center", gap: 10, width: "min(260px, 100%)", minHeight: 54, paddingBlock: 9, paddingInline: 10, borderWidth: 0, borderRadius: radius.lg, backgroundColor: color.surface, boxShadow: { default: `inset 0 0 0 1px ${color.line2}, ${shadow.card}`, ":hover": `inset 0 0 0 1px ${color.line3}, ${shadow.card}` }, color: color.fg, fontFamily: font.sans, textAlign: "left", cursor: "pointer" },
  on: { boxShadow: `inset 0 0 0 1.5px ${color.accent}, 0 0 0 4px ${color.accentSoft}` },
  ic: (tint: string) => ({ width: 28, height: 28, flex: "none", display: "grid", placeItems: "center", borderRadius: radius.md, color: tint, backgroundColor: `color-mix(in srgb, ${tint} 16%, transparent)` }),
  kind: { display: "block", fontFamily: font.mono, fontSize: 10.5, letterSpacing: ".06em", textTransform: "uppercase", color: color.fg4 },
  title: { display: "block", fontSize: 13.5, fontWeight: 500 },
  detail: { display: "block", fontSize: 12.5, color: color.fg3 },
  add: { width: 26, height: 26, display: "grid", placeItems: "center", borderWidth: 0, borderRadius: radius.pill, backgroundColor: { default: color.raised, ":hover": color.raised2 }, boxShadow: `inset 0 0 0 1px ${color.line2}`, color: color.fg2, cursor: "pointer" },
});
const kinds = {
  trigger: { label: "Trigger", tint: color.c1, icon: "zap" },
  condition: { label: "Condition", tint: color.c4, icon: "split" },
  action: { label: "Action", tint: color.c2, icon: "play" },
} as const;
export type FlowStep = { id: string; kind: keyof typeof kinds; title: ReactNode; detail?: ReactNode; icon?: IconName; yes?: FlowStep[]; no?: FlowStep[] };
/** A workflow as steps on a dotted canvas. A condition splits into Yes and No branches; `onAdd` puts a + at the end of each branch. */
export function Flowchart({ steps, selected, onSelect, onAdd }: { steps: FlowStep[]; selected?: string; onSelect?: (id: string) => void; onAdd?: (afterId: string) => void }) {
  const column = (list: FlowStep[], label?: string): ReactNode => {
    const last = list[list.length - 1];
    return (
      <div {...stylex.props(fc.col)}>
        {list.map((s, i) => {
          const k = kinds[s.kind];
          return (
            <div key={s.id} {...stylex.props(fc.col)}>
              {(i > 0 || label) && <span {...stylex.props(fc.link)}>{i === 0 && label && <span {...stylex.props(fc.label)}>{label}</span>}</span>}
              <button type="button" aria-pressed={selected === s.id} onClick={() => onSelect?.(s.id)} {...stylex.props(fc.node, selected === s.id && fc.on)}>
                <span {...stylex.props(fc.ic(k.tint))}><Icon name={s.icon ?? k.icon} size={15} /></span>
                <span><span {...stylex.props(fc.kind)}>{k.label}</span><span {...stylex.props(fc.title)}>{s.title}</span>{s.detail && <span {...stylex.props(fc.detail)}>{s.detail}</span>}</span>
              </button>
              {s.kind === "condition" && (s.yes || s.no) && (
                <>
                  <span {...stylex.props(fc.link)} />
                  <div {...stylex.props(fc.split)}><span {...stylex.props(fc.rail)} />{column(s.yes ?? [], "Yes")}{column(s.no ?? [], "No")}</div>
                </>
              )}
            </div>
          );
        })}
        {onAdd && last && last.kind !== "condition" && (
          <>
            <span {...stylex.props(fc.link)} />
            <button type="button" aria-label="Add a step" onClick={() => onAdd(last.id)} {...stylex.props(fc.add)}><Icon name="plus" size={14} /></button>
          </>
        )}
      </div>
    );
  };
  return <div {...stylex.props(fc.canvas)}>{column(steps)}</div>;
}
// #endregion

// #region FineTuneCard
const ft = stylex.create({
  body: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))", gap: 14, padding: 16 },
  stage: { minHeight: 190, display: "grid", placeItems: "center", overflow: "hidden", borderRadius: radius.lg, backgroundColor: color.sunken, backgroundImage: `radial-gradient(${color.line2} 1px, transparent 1.2px)`, backgroundSize: "14px 14px", boxShadow: `inset 0 0 0 1px ${color.line}` },
  controls: { display: "flex", flexDirection: "column", gap: 8 },
  tools: { display: "flex", alignItems: "center", gap: 4 },
});
export type TuneProperty<K extends string = string> = { key: K; label: string; min: number; max: number; step?: number; unit?: string };
/** An inspector: sliders on one side, the thing they change on the other. `preview` is called with the current values. */
export function FineTuneCard<K extends string>({ title = "Fine-tune", properties, values, onChange, preview, actions }: {
  title?: ReactNode; properties: TuneProperty<K>[]; values: Record<K, number>; onChange: (values: Record<K, number>) => void; preview: (values: Record<K, number>) => ReactNode; actions?: ReactNode;
}) {
  return (
    <div {...stylex.props(ap.card)} style={{ width: "min(560px, 100%)" }}>
      <div {...stylex.props(pc.head)}>{title}<span {...stylex.props(ft.tools)}>{actions}</span></div>
      <div {...stylex.props(ft.body)}>
        <div {...stylex.props(ft.stage)}>{preview(values)}</div>
        <div {...stylex.props(ft.controls)}>
          {properties.map((p) => <SliderBar key={p.key} label={p.label} unit={p.unit} min={p.min} max={p.max} step={p.step} value={values[p.key]} onChange={(v) => onChange({ ...values, [p.key]: v } as Record<K, number>)} />)}
        </div>
      </div>
    </div>
  );
}
// #endregion

// #region SelectionActions
const sa = stylex.create({
  host: { position: "relative" },
  bar: (x: number, y: number) => ({ position: "absolute", left: x, top: y, zIndex: 5, display: "flex", gap: 2, padding: 4, borderRadius: radius.lg, backgroundColor: color.raised, boxShadow: shadow.pop, whiteSpace: "nowrap" }),
});
export type SelectionAction = { id: string; label: string; icon?: IconName };
/** Wrap any text. Selecting part of it shows a small bar of actions just above the selection; Esc dismisses it. */
export function SelectionActions({ actions, onAction, children }: { actions: SelectionAction[]; onAction: (id: string, text: string, range: Range) => void; children: ReactNode }) {
  const host = useRef<HTMLDivElement>(null);
  const [sel, setSel] = useState<{ x: number; y: number; text: string; range: Range } | null>(null);
  const read = () => {
    const s = window.getSelection(), el = host.current;
    if (!s || !el || s.isCollapsed || !s.rangeCount || !el.contains(s.anchorNode)) { setSel(null); return; }
    const range = s.getRangeAt(0), r = range.getBoundingClientRect(), b = el.getBoundingClientRect();
    setSel({ x: Math.max(0, r.left - b.left), y: r.top - b.top - 44, text: s.toString(), range });
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSel(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return (
    <div ref={host} onMouseUp={read} onKeyUp={read} onTouchEnd={read} {...stylex.props(sa.host)}>
      {children}
      {sel && (
        <div role="toolbar" aria-label="Selection actions" onMouseDown={(e) => e.preventDefault()} {...stylex.props(sa.bar(sel.x, sel.y))}>
          {actions.map((a) => <Button key={a.id} size="sm" variant="ghost" icon={a.icon} onClick={() => { onAction(a.id, sel.text, sel.range); setSel(null); }}>{a.label}</Button>)}
        </div>
      )}
    </div>
  );
}
// #endregion

// #region AgentScreen
const ag = stylex.create({
  frame: { width: "100%", maxWidth: 720, overflow: "hidden", borderRadius: radius.xl, backgroundColor: color.surface, boxShadow: `inset 0 0 0 1px ${color.line2}, ${shadow.card}` },
  bar: { display: "flex", alignItems: "center", gap: 10, minHeight: 44, paddingInline: 12, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.line },
  url: { display: "inline-flex", alignItems: "center", gap: 6, minWidth: 0, height: 26, paddingInline: 10, borderRadius: radius.pill, backgroundColor: color.sunken, fontFamily: font.mono, fontSize: 12, color: color.fg3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  grow: { flexGrow: 1 },
  body: { display: "grid", gridTemplateColumns: { default: "minmax(0, 1fr) 200px", "@media (max-width: 640px)": "minmax(0, 1fr)" } },
  view: { position: "relative", minHeight: 240, padding: 16, backgroundColor: color.well },
  cursor: (x: number, y: number) => ({ position: "absolute", left: `${x}%`, top: `${y}%`, zIndex: 3, display: "flex", alignItems: "flex-start", gap: 2, color: color.accent, pointerEvents: "none", transitionProperty: "left, top", transitionDuration: ".7s", transitionTimingFunction: motion.ease }),
  who: { marginTop: 12, height: 18, paddingInline: 6, display: "grid", placeItems: "center", borderRadius: radius.sm, backgroundColor: color.accent, color: color.onAccent, fontSize: 11, fontWeight: 600 },
  steps: { margin: 0, padding: 12, listStyle: "none", display: "flex", flexDirection: "column", gap: 4, borderLeftWidth: 1, borderLeftStyle: "solid", borderLeftColor: color.line },
  step: { display: "flex", alignItems: "center", gap: 8, minHeight: 30, paddingInline: 8, borderRadius: radius.md, fontSize: 13, color: color.fg3 },
  stepDone: { color: color.fg2 },
  stepOn: { backgroundColor: color.hover, color: color.fg },
  foot: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, paddingBlock: 10, paddingInline: 12, borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: color.line },
  hint: { fontSize: 12.5, color: color.fg3 },
});
/** A window onto what the agent is doing: its screen, its cursor and its steps, with two ways to step in. `cursor` is in percent of the view. */
export function AgentScreen({ url, agent = "Agent", steps, current, cursor, controlled, recording, onTakeOver, onRecord, children }: {
  url: string; agent?: string; steps: ReactNode[]; current: number; cursor?: { x: number; y: number }; controlled?: boolean; recording?: boolean; onTakeOver?: () => void; onRecord?: () => void; children: ReactNode;
}) {
  return (
    <div {...stylex.props(ag.frame)}>
      <div {...stylex.props(ag.bar)}>
        <span {...stylex.props(ag.url)}><Icon name="lock" size={12} />{url}</span><span {...stylex.props(ag.grow)} />
        {recording ? <StatusPill tone="bad" live>Recording your steps</StatusPill> : controlled ? <StatusPill>You are in control</StatusPill> : <StatusPill tone="accent" live>{agent} is working</StatusPill>}
      </div>
      <div {...stylex.props(ag.body)}>
        <div {...stylex.props(ag.view)}>
          {children}
          {cursor && !controlled && !recording && (
            <span aria-hidden {...stylex.props(ag.cursor(cursor.x, cursor.y))}>
              <svg width="16" height="18" viewBox="0 0 16 18" fill="currentColor"><path d="M1 1l13 7-6 1.6L5.5 16z" /></svg><span {...stylex.props(ag.who)}>{agent}</span>
            </span>
          )}
        </div>
        <ol {...stylex.props(ag.steps)}>
          {steps.map((s, i) => <li key={i} aria-current={i === current ? "step" : undefined} {...stylex.props(ag.step, i < current && ag.stepDone, i === current && ag.stepOn)}><Icon name={i < current ? "check" : i === current ? "arrow-right" : "dashed"} size={14} />{s}</li>)}
        </ol>
      </div>
      <div {...stylex.props(ag.foot)}>
        {onTakeOver && <Button size="sm" icon="move" onClick={onTakeOver}>{controlled ? "Hand back" : "Take over"}</Button>}
        {onRecord && <Button size="sm" variant="ghost" icon="circle" aria-pressed={recording} onClick={onRecord}>{recording ? "Stop teaching" : "Teach a task"}</Button>}
        <span {...stylex.props(ag.grow)} /><span {...stylex.props(ag.hint)}>Step {Math.min(current + 1, steps.length)} of {steps.length}</span>
      </div>
    </div>
  );
}
// #endregion
