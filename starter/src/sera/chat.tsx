/**
 * Chat.
 * ChatLayout · ChatMessage · MessageActions · Attachment · MessageMeta · SystemMessage · ToolCalls · ChatComposer
 */
import * as stylex from "@stylexjs/stylex";
import { useRef, useState, type ReactNode } from "react";
import { color, font, motion, radius, shadow } from "./tokens.stylex";
import { Icon, type IconName } from "./icons";
import { Button, IconButton, SegmentedControl } from "./action";
import { PixelLoader } from "./feedback";
import type { XStyle } from "./lib";

// #region ChatLayout
const cl = stylex.create({
  root: { display: "flex", flexDirection: "column", minHeight: 0, height: "100%", borderRadius: radius.xl, backgroundColor: color.surface, boxShadow: `inset 0 0 0 1px ${color.line}, ${shadow.card}`, overflow: "hidden" },
  head: { display: "flex", alignItems: "center", gap: 6, paddingBlock: 8, paddingInline: 10, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.line },
  grow: { flexGrow: 1 },
  thread: { flexGrow: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16, padding: 16 },
  foot: { padding: 10, borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: color.line },
});
export function ChatLayout({ header, children, composer, xstyle }: { header?: ReactNode; children: ReactNode; composer: ReactNode; xstyle?: XStyle }) {
  return (
    <section {...stylex.props(cl.root, xstyle)}>
      {header && <header {...stylex.props(cl.head)}>{header}</header>}
      <div role="log" aria-live="polite" {...stylex.props(cl.thread)}>{children}</div>
      <div {...stylex.props(cl.foot)}>{composer}</div>
    </section>
  );
}
export const ChatHeaderTabs = ({ tabs, actions }: { tabs: string[]; actions?: ReactNode }) => <><SegmentedControl options={tabs} size="sm" /><span {...stylex.props(cl.grow)} />{actions}</>;
// #endregion

// #region ChatMessage
const cm = stylex.create({
  user: { alignSelf: "flex-end", maxWidth: "80%", paddingBlock: 10, paddingInline: 14, borderTopLeftRadius: 12, borderTopRightRadius: 12, borderBottomLeftRadius: 12, borderBottomRightRadius: 4, backgroundColor: color.raised, boxShadow: `inset 0 0 0 1px ${color.line2}`, fontSize: 14, color: color.fg },
  bot: { display: "flex", flexDirection: "column", gap: 8, maxWidth: "92%", fontSize: 14, lineHeight: 1.6, color: color.fg },
  acts: { display: "flex", alignItems: "center", gap: 2, color: color.fg4, fontSize: 12 },
  sep: { width: 1, height: 14, marginInline: 6, backgroundColor: color.line2 },
});
export function ChatMessage({ role, children, actions }: { role: "user" | "assistant"; children: ReactNode; actions?: ReactNode }) {
  if (role === "user") return <div {...stylex.props(cm.user)}>{children}</div>;
  return <div {...stylex.props(cm.bot)}>{children}{actions}</div>;
}
/** Copy · rate · retry under an assistant message, then the meta text. */
export function MessageActions({ text, meta, onRetry, onRate }: { text: string; meta?: ReactNode; onRetry?: () => void; onRate?: (good: boolean) => void }) {
  return (
    <div {...stylex.props(cm.acts)}>
      <IconButton icon="copy" label="Copy" size="xs" onClick={() => navigator.clipboard?.writeText(text)} />
      <IconButton icon="thumb" label="Good answer" size="xs" onClick={() => onRate?.(true)} />
      <IconButton icon="refresh" label="Retry" size="xs" onClick={onRetry} />
      {meta && <><span {...stylex.props(cm.sep)} /><span>{meta}</span></>}
    </div>
  );
}
// #endregion

// #region Attachment
const at = stylex.create({
  chip: { display: "inline-flex", alignItems: "center", gap: 6, height: 28, paddingInline: 9, borderRadius: radius.md, backgroundColor: color.sunken, boxShadow: `inset 0 0 0 1px ${color.line}`, fontFamily: font.mono, fontSize: 12, color: color.fg },
  add: { color: color.ok }, del: { color: color.bad },
});
/** Mono chip for a file, link or tool, with optional +/− line counts. */
export function Attachment({ icon = "file", name, added, removed, onRemove }: { icon?: IconName; name: string; added?: number; removed?: number; onRemove?: () => void }) {
  return (
    <span {...stylex.props(at.chip)}>
      <Icon name={icon} size={13} />{name}
      {added != null && <span {...stylex.props(at.add)}>+{added}</span>}{removed != null && <span {...stylex.props(at.del)}>−{removed}</span>}
      {onRemove && <IconButton icon="x" label={`Remove ${name}`} size="xs" onClick={onRemove} />}
    </span>
  );
}
// #endregion

// #region MessageMeta
const mm = stylex.create({ row: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", fontSize: 12, color: color.fg4 }, mono: { fontFamily: font.mono }, sep: { width: 1, height: 12, backgroundColor: color.line2 } });
export function MessageMeta({ model, seconds, tokens, cost }: { model: string; seconds?: number; tokens?: number; cost?: string }) {
  const parts = [model, seconds != null && `${seconds.toFixed(1)}s`, tokens != null && `${tokens.toLocaleString()} tokens`, cost].filter(Boolean) as string[];
  return <div {...stylex.props(mm.row)}>{parts.map((p, i) => <span key={p} {...stylex.props(mm.row)}>{i > 0 && <span {...stylex.props(mm.sep)} />}<span {...stylex.props(p.includes("tokens") && mm.mono)}>{p}</span></span>)}</div>;
}
// #endregion

// #region SystemMessage
const sy = stylex.create({ row: { alignSelf: "center", display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12.5, color: color.fg4 }, rule: { width: 40, borderTopWidth: 1, borderTopStyle: "dashed", borderTopColor: color.line3 }, warn: { color: color.warn } });
export function SystemMessage({ icon, tone, children }: { icon?: IconName; tone?: "warn"; children: ReactNode }) {
  return <div role="status" {...stylex.props(sy.row, tone === "warn" && sy.warn)}><span {...stylex.props(sy.rule)} />{icon && <Icon name={icon} size={12} />}{children}<span {...stylex.props(sy.rule)} /></div>;
}
// #endregion

// #region ToolCalls
const tc = stylex.create({
  list: { display: "flex", flexDirection: "column", gap: 6, width: "100%", maxWidth: 440, fontSize: 13.5 },
  row: { display: "flex", alignItems: "center", gap: 10, color: color.fg },
  ic: { color: color.fg3, display: "inline-flex" },
  code: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingBlock: 3, paddingInline: 8, borderRadius: radius.sm, backgroundColor: color.sunken, boxShadow: `inset 0 0 0 1px ${color.line}`, fontFamily: font.mono, fontSize: 12, color: color.fg3 },
  done: { marginLeft: "auto", color: color.ok, display: "inline-flex" },
  fail: { color: color.bad },
});
export type ToolCall = { icon: IconName; label: string; arg?: string; state: "running" | "done" | "failed" };
export function ToolCalls({ calls }: { calls: ToolCall[] }) {
  return (
    <div {...stylex.props(tc.list)}>
      {calls.map((c, i) => (
        <div key={i} {...stylex.props(tc.row, c.state === "failed" && tc.fail)}>
          {c.state === "running" ? <PixelLoader /> : <span {...stylex.props(tc.ic, c.state === "failed" && tc.fail)}><Icon name={c.state === "failed" ? "x-c" : c.icon} /></span>}
          <span>{c.label}</span>{c.arg && <code {...stylex.props(tc.code)}>{c.arg}</code>}
          {c.state === "done" && <span {...stylex.props(tc.done)}><Icon name="check" size={14} /></span>}
        </div>
      ))}
    </div>
  );
}
// #endregion

// #region ChatComposer
const cc = stylex.create({
  tray: { width: "100%", borderRadius: radius.xxl, backgroundColor: color.sunken, boxShadow: `inset 0 0 0 1px ${color.line}`, padding: 4 },
  trayHead: { display: "flex", alignItems: "center", gap: 6, paddingTop: 4, paddingBottom: 6, paddingInline: 10, fontSize: 12, color: color.fg3 },
  box: {
    width: "100%", borderRadius: radius.xl, backgroundColor: color.surface, padding: 8,
    boxShadow: { default: `inset 0 0 0 1px ${color.line2}, ${shadow.card}`, ":focus-within": `inset 0 0 0 1px ${color.line3}, 0 0 0 4px ${color.accentSoft}` },
    transitionProperty: "box-shadow", transitionDuration: motion.fast,
  },
  ta: { display: "block", width: "100%", minHeight: 44, maxHeight: 180, resize: "none", borderWidth: 0, backgroundColor: "transparent", outline: "none", paddingBlock: 8, paddingInline: 10, fontFamily: font.sans, fontSize: 15, lineHeight: 1.5, color: color.fg, "::placeholder": { color: color.fg4 } },
  row: { display: "flex", alignItems: "center", gap: 6 },
  grow: { flexGrow: 1 },
  chips: { display: "flex", flexWrap: "wrap", gap: 6, paddingTop: 4, paddingInline: 4 },
});
/**
 * The message box. Grows with text; the mic becomes a send arrow once there is text.
 * `mode` adds the tray above the box (e.g. “Text to notes” on the left, a model picker on the right).
 */
export function ChatComposer({ onSend, placeholder = "Ask anything…", attachments, tools, mode, modeEnd, hint }: {
  onSend: (text: string) => void; placeholder?: string; attachments?: ReactNode; tools?: ReactNode; mode?: ReactNode; modeEnd?: ReactNode; hint?: ReactNode;
}) {
  const [text, setText] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  const send = () => { if (!text.trim()) return; onSend(text.trim()); setText(""); if (ref.current) ref.current.style.height = "auto"; };
  const box = (
    <div {...stylex.props(cc.box)}>
      {attachments && <div {...stylex.props(cc.chips)}>{attachments}</div>}
      <textarea ref={ref} rows={1} value={text} placeholder={placeholder} aria-label="Message" {...stylex.props(cc.ta)}
        onChange={(e) => { setText(e.target.value); e.target.style.height = "auto"; e.target.style.height = `${Math.min(180, e.target.scrollHeight)}px`; }}
        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} />
      <div {...stylex.props(cc.row)}>
        {tools ?? <IconButton icon="plus" label="Attach" size="sm" />}
        {hint}
        <span {...stylex.props(cc.grow)} />
        {text.trim() ? <IconButton icon="arrow-up" label="Send" variant="primary" size="sm" onClick={send} /> : <IconButton icon="mic" label="Dictate" size="sm" />}
      </div>
    </div>
  );
  if (!mode && !modeEnd) return box;
  return <div {...stylex.props(cc.tray)}><div {...stylex.props(cc.trayHead)}>{mode}<span {...stylex.props(cc.grow)} />{modeEnd}</div>{box}</div>;
}
export const ModelPicker = ({ value }: { value: string }) => <Button size="xs" variant="ghost" iconEnd="chev-down">{value}</Button>;
// #endregion
