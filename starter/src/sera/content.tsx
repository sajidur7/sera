/**
 * Content — things you read.
 * Text · Heading · Avatar · AvatarGroup · Blockquote · Citation · Code · CodeBlock · Prose ·
 * Kbd · KeyIcon · Thumbnail · Timer · Timestamp · Token · Tag
 */
import * as stylex from "@stylexjs/stylex";
import { useEffect, useState, type ComponentProps, type ReactNode } from "react";
import { color, font, radius } from "./tokens.stylex";
import { Icon, type IconName } from "./icons";
import { CopyButton, IconButton } from "./action";
import type { XStyle } from "./lib";

// #region Text
const tx = stylex.create({
  base: { margin: 0, fontFamily: font.sans, fontSize: 14, lineHeight: 1.55, color: color.fg2 },
  small: { fontSize: 12.5, lineHeight: 1.5 },
  label: { fontFamily: font.mono, fontSize: 10.5, fontWeight: 500, letterSpacing: ".08em", textTransform: "uppercase", color: color.fg4 },
  mono: { fontFamily: font.mono, fontSize: 13 },
  fg: { color: color.fg }, fg2: { color: color.fg2 }, fg3: { color: color.fg3 }, fg4: { color: color.fg4 },
  num: { fontVariantNumeric: "tabular-nums" },
});
export function Text({ size = "body", tone, num, as: As = "p", children, xstyle }: {
  size?: "body" | "small" | "label" | "mono"; tone?: "fg" | "fg2" | "fg3" | "fg4"; num?: boolean;
  as?: "p" | "span" | "div"; children: ReactNode; xstyle?: XStyle;
}) {
  return <As {...stylex.props(tx.base, size !== "body" && tx[size], tone && tx[tone], num && tx.num, xstyle)}>{children}</As>;
}
// #endregion

// #region Heading
const hd = stylex.create({
  base: { margin: 0, fontFamily: font.sans, fontWeight: 600, color: color.fg, textWrap: "balance" },
  display: { fontSize: 44, lineHeight: 1, letterSpacing: "-.045em" },
  h1: { fontSize: 30, lineHeight: 1.1, letterSpacing: "-.035em" },
  h2: { fontSize: 22, lineHeight: 1.2, letterSpacing: "-.025em" },
  h3: { fontSize: 17, lineHeight: 1.3, letterSpacing: "-.015em" },
});
export function Heading({ level = "h2", children, xstyle }: { level?: "display" | "h1" | "h2" | "h3"; children: ReactNode; xstyle?: XStyle }) {
  const Tag = level === "display" ? "h1" : level;
  return <Tag {...stylex.props(hd.base, hd[level], xstyle)}>{children}</Tag>;
}
// #endregion

// #region Avatar
const tints = { c1: color.c1, c2: color.c2, c3: color.c3, c4: color.c4, c5: color.c5, c6: color.c6, c7: color.c7 } as const;
export type Tint = keyof typeof tints;
const av = stylex.create({
  base: {
    position: "relative", flex: "none", display: "inline-grid", placeItems: "center", borderRadius: "50%",
    fontFamily: font.sans, fontWeight: 600, letterSpacing: "-.01em", boxShadow: `inset 0 0 0 1px ${color.line2}`,
  },
  tint: (t: string) => ({ backgroundColor: `color-mix(in srgb, ${t} 22%, ${color.raised})`, color: `color-mix(in srgb, ${t} 62%, ${color.fg})` }),
  size: (s: number) => ({ width: s, height: s, fontSize: s * 0.36 }),
  square: { borderRadius: "28%" },
  ring: { boxShadow: `0 0 0 2px ${color.panel}` },
  status: { position: "absolute", right: -1, bottom: -1, width: "30%", height: "30%", minWidth: 8, minHeight: 8, borderRadius: "50%", boxShadow: `0 0 0 2px ${color.panel}` },
  online: { backgroundColor: color.ok }, away: { backgroundColor: color.warn }, offline: { backgroundColor: color.fg4 },
  group: { display: "inline-flex", alignItems: "center" },
  overlap: { marginLeft: -8 },
});
const sizes = { xs: 20, sm: 26, md: 32, lg: 40, xl: 52, xxl: 72 } as const;
const initials = (n: string) => n.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
export type AvatarProps = { name: string; size?: keyof typeof sizes; tint?: Tint; square?: boolean; icon?: IconName; status?: "online" | "away" | "offline"; xstyle?: XStyle };

export function Avatar({ name, size = "md", tint = "c7", square, icon, status, xstyle }: AvatarProps) {
  const px = sizes[size];
  return (
    <span title={name} {...stylex.props(av.base, av.tint(tints[tint]), av.size(px), square && av.square, xstyle)}>
      {icon ? <Icon name={icon} size={Math.round(px * 0.45)} /> : initials(name)}
      {status && <span {...stylex.props(av.status, av[status])} />}
    </span>
  );
}
/** Overlapping avatars that end in a “+N” count. */
export function AvatarGroup({ people, size = "sm", max = 4 }: { people: { name: string; tint?: Tint }[]; size?: keyof typeof sizes; max?: number }) {
  const shown = people.slice(0, max), more = people.length - shown.length;
  return (
    <span {...stylex.props(av.group)}>
      {shown.map((p, i) => <Avatar key={p.name} name={p.name} tint={p.tint} size={size} xstyle={[av.ring, i > 0 && av.overlap]} />)}
      {more > 0 && <span {...stylex.props(av.base, av.tint(color.c7), av.size(sizes[size]), av.ring, av.overlap)}>+{more}</span>}
    </span>
  );
}
// #endregion

// #region Blockquote
const bq = stylex.create({
  root: { margin: 0, paddingBlock: 4, paddingLeft: 16, borderLeftWidth: 2, borderLeftStyle: "solid", borderLeftColor: color.accent, color: color.fg2, fontSize: 15, maxWidth: "52ch" },
  cite: { display: "block", marginTop: 8, fontSize: 12.5, color: color.fg4 },
});
export function Blockquote({ children, cite }: { children: ReactNode; cite?: ReactNode }) {
  return <blockquote {...stylex.props(bq.root)}>{children}{cite && <footer {...stylex.props(bq.cite)}>— {cite}</footer>}</blockquote>;
}
// #endregion

// #region Citation
const ct = stylex.create({
  pill: { display: "inline-flex", alignItems: "center", gap: 5, height: 20, paddingLeft: 4, paddingRight: 6, borderRadius: radius.sm, backgroundColor: color.sunken, boxShadow: `inset 0 0 0 1px ${color.line}`, fontSize: 11.5, color: color.fg3, verticalAlign: 1, textDecoration: "none" },
  idx: (t: string) => ({ width: 12, height: 12, borderRadius: 3, display: "grid", placeItems: "center", fontSize: 8, fontWeight: 700, color: "#fff", backgroundColor: t }),
});
export function Citation({ index, source, href, tint = "c1" }: { index: number | string; source: ReactNode; href?: string; tint?: Tint }) {
  return <a href={href} {...stylex.props(ct.pill)}><span {...stylex.props(ct.idx(tints[tint]))}>{index}</span>{source}</a>;
}
// #endregion

// #region Code
const cd = stylex.create({
  inline: { fontFamily: font.mono, fontSize: 12.5, paddingBlock: 2, paddingInline: 6, borderRadius: radius.sm, backgroundColor: color.sunken, boxShadow: `inset 0 0 0 1px ${color.line}`, color: color.fg2, overflowWrap: "anywhere" },
});
export const Code = ({ children }: { children: ReactNode }) => <code {...stylex.props(cd.inline)}>{children}</code>;
// #endregion

// #region CodeBlock
const cb = stylex.create({
  root: { width: "100%", borderRadius: radius.xl, backgroundColor: color.sunken, boxShadow: `inset 0 0 0 1px ${color.line}`, overflow: "hidden" },
  head: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, paddingBlock: 4, paddingLeft: 14, paddingRight: 4, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.line, fontFamily: font.mono, fontSize: 12, color: color.fg3 },
  pre: { margin: 0, paddingBlock: 14, paddingInline: 16, overflowX: "auto", fontFamily: font.mono, fontSize: 12.5, lineHeight: 1.7, color: color.fg2 },
  ln: { display: "inline-block", width: 24, color: color.fg4, userSelect: "none" },
});
export function CodeBlock({ code, filename, lineNumbers = true }: { code: string; filename?: string; lineNumbers?: boolean }) {
  return (
    <div {...stylex.props(cb.root)}>
      <div {...stylex.props(cb.head)}><span>{filename ?? "code"}</span><CopyButton value={code} size="xs" /></div>
      <pre {...stylex.props(cb.pre)}>{code.split("\n").map((l, i) => <div key={i}>{lineNumbers && <span {...stylex.props(cb.ln)}>{i + 1}</span>}{l}</div>)}</pre>
    </div>
  );
}
// #endregion

// #region Prose
const pr = stylex.create({ root: { maxWidth: "62ch", fontSize: 14, lineHeight: 1.65, color: color.fg2 } });
/** Wrap rendered markdown (from your markdown library) to get Sera rhythm and measure. */
export const Prose = ({ children }: { children: ReactNode }) => <div {...stylex.props(pr.root)}>{children}</div>;
// #endregion

// #region Kbd
const kb = stylex.create({
  key: { display: "inline-grid", placeItems: "center", minWidth: 20, height: 20, paddingInline: 5, borderRadius: radius.sm, backgroundColor: color.raised, boxShadow: `inset 0 0 0 1px ${color.line2}, 0 1px 0 ${color.line2}`, fontFamily: font.mono, fontSize: 11, fontWeight: 500, color: color.fg3 },
  row: { display: "inline-flex", gap: 3, alignItems: "center" },
});
export const Kbd = ({ children }: { children: ReactNode }) => <kbd {...stylex.props(kb.key)}>{children}</kbd>;
// #endregion

// #region KeyIcon
const keyIcons = { cmd: "cmd", shift: "shift", opt: "opt", ctrl: "ctrl", enter: "enter", back: "back", tab: "tab", caps: "caps", space: "space" } as const;
export type KeyName = keyof typeof keyIcons;
/** A shortcut: modifier names render as icons, everything else as text. <Keys keys={["cmd", "K"]} /> */
export function Keys({ keys }: { keys: (KeyName | string)[] }) {
  return (
    <span {...stylex.props(kb.row)}>
      {keys.map((k) => <Kbd key={k}>{k in keyIcons ? <Icon name={keyIcons[k as KeyName]} size={11} /> : k}</Kbd>)}
    </span>
  );
}
// #endregion

// #region Thumbnail
const th = stylex.create({
  root: { position: "relative", overflow: "hidden", borderRadius: radius.lg, backgroundColor: color.sunken, boxShadow: `inset 0 0 0 1px ${color.line2}`, display: "grid", placeItems: "center", color: color.fg3 },
  img: { width: "100%", height: "100%", objectFit: "cover" },
  x: { position: "absolute", top: 4, right: 4 },
});
export function Thumbnail({ src, size = 96, icon = "file", onRemove }: { src?: string; size?: number; icon?: IconName; onRemove?: () => void }) {
  return (
    <div style={{ width: size, height: size }} {...stylex.props(th.root)}>
      {src ? <img src={src} alt="" {...stylex.props(th.img)} /> : <Icon name={icon} size={24} />}
      {onRemove && <span {...stylex.props(th.x)}><IconButton icon="x" label="Remove" size="xs" variant="secondary" onClick={onRemove} /></span>}
    </div>
  );
}
// #endregion

// #region Timer
const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
/** Live mm:ss counter. `countdown` counts to zero and stops. */
export function Timer({ start = 0, countdown, paused }: { start?: number; countdown?: boolean; paused?: boolean }) {
  const [s, setS] = useState(start);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setS((v) => (countdown ? Math.max(0, v - 1) : v + 1)), 1000);
    return () => clearInterval(t);
  }, [paused, countdown]);
  return <span {...stylex.props(tx.num)}>{fmt(s)}</span>;
}
// #endregion

// #region Timestamp
const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
export function relativeTime(d: Date, now = new Date()) {
  const s = Math.round((d.getTime() - now.getTime()) / 1000);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];
  for (const [u, n] of units) if (Math.abs(s) >= n) return rtf.format(Math.round(s / n), u);
  return "just now";
}
/** Relative time in text, exact time on hover. */
export function Timestamp({ date }: { date: Date }) {
  return <time dateTime={date.toISOString()} title={date.toLocaleString()} {...stylex.props(tx.base, tx.small, tx.fg3)}>{relativeTime(date)}</time>;
}
// #endregion

// #region Token
const tk = stylex.create({ root: { display: "inline-flex", alignItems: "center", gap: 6, height: 26, paddingLeft: 4, paddingRight: 8, borderRadius: radius.sm, backgroundColor: color.raised, boxShadow: `inset 0 0 0 1px ${color.line2}`, fontSize: 12.5, whiteSpace: "nowrap", color: color.fg } });
/** A person, account or object as a compact inline pill. */
export function Token({ lead, children }: { lead?: ReactNode; children: ReactNode }) {
  return <span {...stylex.props(tk.root)}>{lead}{children}</span>;
}
// #endregion

// #region Tag
const tg = stylex.create({
  base: { display: "inline-flex", alignItems: "center", gap: 5, height: 22, paddingInline: 8, borderRadius: radius.pill, fontFamily: font.sans, fontSize: 12, fontWeight: 500, whiteSpace: "nowrap" },
  tint: (t: string) => ({ backgroundColor: `color-mix(in srgb, ${t} 14%, ${color.surface})`, boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${t} 32%, ${color.surface})`, color: `color-mix(in srgb, ${t} 70%, ${color.fg})` }),
  line: { backgroundColor: "transparent", boxShadow: `inset 0 0 0 1px ${color.line2}`, color: color.fg2 },
  lg: { height: 26, paddingInline: 10, fontSize: 12.5 },
  x: { display: "grid", placeItems: "center", width: 14, height: 14, padding: 0, marginRight: -3, borderWidth: 0, borderRadius: 3, backgroundColor: "transparent", color: "inherit", opacity: { default: 0.7, ":hover": 1 }, cursor: "pointer" },
});
const tagTints = { violet: color.c1, blue: color.c2, sky: color.c3, sand: color.c4, coral: color.c5, mint: color.c6, neutral: color.c7 } as const;
export type TagTone = keyof typeof tagTints | "line";
export function Tag({ tone = "neutral", size = "md", onRemove, children, ...rest }: ComponentProps<"span"> & { tone?: TagTone; size?: "md" | "lg"; onRemove?: () => void }) {
  return (
    <span {...rest} {...stylex.props(tg.base, tone === "line" ? tg.line : tg.tint(tagTints[tone]), size === "lg" && tg.lg)}>
      {children}
      {onRemove && <button type="button" aria-label="Remove" onClick={onRemove} {...stylex.props(tg.x)}><Icon name="x" size={10} /></button>}
    </span>
  );
}
// #endregion
