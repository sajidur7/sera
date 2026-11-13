/**
 * AI — pieces for assistants and agents.
 * ThinkingLine · ThinkingTrace · StreamingText · PromptBar · ToolChip · ApprovalCard · RecommendationCard ·
 * ContextCard · InsightCard · DiffTable · TaskList · ParameterCard
 */
import * as stylex from "@stylexjs/stylex";
import { useEffect, useState, type ReactNode } from "react";
import { color, font, radius, shadow } from "./tokens.stylex";
import { Icon, type IconName } from "./icons";
import { Button, IconButton } from "./action";
import { Avatar, Tag, type Tint } from "./content";
import { PixelLoader, StatusPill } from "./feedback";
import { RadioGroup } from "./forms";
import { Attachment } from "./chat";
import type { XStyle } from "./lib";

const shimmer = stylex.keyframes({ from: { backgroundPosition: "100% 0" }, to: { backgroundPosition: "-100% 0" } });
const blink = stylex.keyframes({ "0%, 100%": { opacity: 0.2 }, "50%": { opacity: 1 } });

// #region ThinkingLine
const th = stylex.create({
  line: { display: "inline-flex", alignItems: "center", gap: 10, fontSize: 14, color: color.fg2 },
  shimmer: { backgroundImage: `linear-gradient(90deg, ${color.fg3} 0%, ${color.fg} 45%, ${color.fg3} 90%)`, backgroundSize: "250% 100%", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", animationName: shimmer, animationDuration: "2.2s", animationIterationCount: "infinite", animationTimingFunction: "linear" },
  t: { fontFamily: font.mono, fontSize: 12.5, color: color.fg4 },
});
/** Loader + shimmering status + elapsed time. */
export function ThinkingLine({ children, seconds, pattern = "drive" }: { children: ReactNode; seconds?: number; pattern?: "drive" | "orbit" | "scan" | "dots" }) {
  return <span role="status" {...stylex.props(th.line)}><PixelLoader pattern={pattern} /><span {...stylex.props(th.shimmer)}>{children}</span>{seconds != null && <span {...stylex.props(th.t)}>{seconds}s</span>}</span>;
}
// #endregion

// #region ThinkingTrace
const tt = stylex.create({
  sum: { display: "inline-flex", alignItems: "center", gap: 8, padding: 0, borderWidth: 0, backgroundColor: "transparent", color: color.fg2, fontFamily: font.sans, fontSize: 14, cursor: "pointer" },
  car: { display: "inline-flex", color: color.fg4, transitionProperty: "transform", transitionDuration: ".25s" }, flip: { transform: "rotate(180deg)" },
  list: { listStyle: "none", marginTop: 10, marginBottom: 0, marginLeft: 7, paddingLeft: 16, borderLeftWidth: 1, borderLeftStyle: "dashed", borderLeftColor: color.line3, display: "flex", flexDirection: "column", gap: 9 },
  step: { display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, color: color.fg },
  ic: { color: color.fg3, display: "inline-flex" },
});
export function ThinkingTrace({ summary, steps, defaultOpen = true }: { summary: ReactNode; steps: { icon: IconName; text: ReactNode }[]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} {...stylex.props(tt.sum)}><span {...stylex.props(tt.car, open && tt.flip)}><Icon name="chev-down" size={14} /></span>{summary}</button>
      {open && <ol {...stylex.props(tt.list)}>{steps.map((s, i) => <li key={i} {...stylex.props(tt.step)}><span {...stylex.props(tt.ic)}><Icon name={s.icon} size={14} /></span>{s.text}</li>)}</ol>}
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
});
export function Confidence({ level }: { level: 1 | 2 | 3 | 4 }) {
  return <span aria-label={`Confidence ${level} of 4`} {...stylex.props(rc.ticks)}>{[8, 11, 14, 17].map((h, i) => <span key={h} {...stylex.props(rc.tick(h), i < level && rc.on)} />)}</span>;
}
export function RecommendationCard({ kicker = "Next step", title, children, confidence, actions }: { kicker?: string; title: ReactNode; children: ReactNode; confidence: 1 | 2 | 3 | 4; actions: ReactNode }) {
  return (
    <div {...stylex.props(ap.card)}>
      <div {...stylex.props(ap.body)}>
        <div {...stylex.props(rc.head)}><Tag tone="violet">{kicker}</Tag><span {...stylex.props(rc.grow)} /><Confidence level={confidence} /><span {...stylex.props(ap.step)}>{["Low", "Fair", "High", "Very high"][confidence - 1]}</span></div>
        <span {...stylex.props(rc.title)}>{title}</span><p {...stylex.props(rc.body)}>{children}</p>
      </div>
      <div {...stylex.props(ap.foot)}><span {...stylex.props(rc.grow)} />{actions}</div>
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
