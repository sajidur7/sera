/**
 * Feedback & status.
 * Badge · StatusDot · StatusPill · Banner · Alert · InlineMessage · InfoTip · Progress · SegmentedProgress ·
 * SegmentMeter · Skeleton · Spinner · PixelLoader · Toast · ToastProvider · useToast · EmptyState · StatusPage
 */
import * as stylex from "@stylexjs/stylex";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { color, font, motion, radius, shadow } from "./tokens.stylex";
import { Icon, type IconName } from "./icons";
import { Button, IconButton, Tooltip } from "./action";
import { Heading, Text } from "./content";
import type { XStyle } from "./lib";

type Tone = "neutral" | "accent" | "ok" | "warn" | "bad" | "info";
const toneFg = { neutral: color.fg3, accent: color.accent, ok: color.ok, warn: color.warn, bad: color.bad, info: color.info } as const;
const toneBg = { neutral: color.raised, accent: color.accentSoft, ok: color.okSoft, warn: color.warnSoft, bad: color.badSoft, info: color.infoSoft } as const;
const toneIcon: Record<Tone, IconName> = { neutral: "info", accent: "zap", ok: "check-c", warn: "alert", bad: "x-c", info: "info" };
const pulse = stylex.keyframes({ "0%": { boxShadow: "0 0 0 0 currentColor" }, "70%": { boxShadow: "0 0 0 6px transparent" }, "100%": { boxShadow: "0 0 0 0 transparent" } });
const spin = stylex.keyframes({ to: { transform: "rotate(360deg)" } });
const shimmer = stylex.keyframes({ from: { backgroundPosition: "100% 0" }, to: { backgroundPosition: "-100% 0" } });
const blink = stylex.keyframes({ "0%, 100%": { opacity: 0.16 }, "40%": { opacity: 1 } });
const toastIn = stylex.keyframes({ from: { opacity: 0, transform: "translateY(12px) scale(.96)" }, to: { opacity: 1, transform: "none" } });
const sweep = stylex.keyframes({ from: { left: "-35%" }, to: { left: "100%" } });

const f = stylex.create({
  fg: (c: string) => ({ color: c }),
  bg: (c: string) => ({ backgroundColor: c }),
});

// #region Badge
const bd = stylex.create({
  root: { display: "inline-grid", placeItems: "center", minWidth: 18, height: 18, paddingInline: 5, borderRadius: radius.pill, backgroundColor: color.accent, color: color.onAccent, fontFamily: font.sans, fontSize: 10.5, fontWeight: 600, fontVariantNumeric: "tabular-nums" },
  muted: { backgroundColor: color.sunken, color: color.fg3, boxShadow: `inset 0 0 0 1px ${color.line}` },
  bad: { backgroundColor: color.bad, color: "#fff" },
});
export function Badge({ count, max = 99, tone = "accent" }: { count: number; max?: number; tone?: "accent" | "muted" | "bad" }) {
  return <span {...stylex.props(bd.root, tone !== "accent" && bd[tone])}>{count > max ? `${max}+` : count}</span>;
}
// #endregion

// #region StatusDot
const sd = stylex.create({
  dot: { display: "inline-block", width: 8, height: 8, borderRadius: "50%", flex: "none" },
  live: { animationName: pulse, animationDuration: "1.8s", animationIterationCount: "infinite" },
  pill: { display: "inline-flex", alignItems: "center", gap: 7, height: 26, paddingLeft: 9, paddingRight: 10, borderRadius: radius.md, fontSize: 12.5, fontWeight: 500, whiteSpace: "nowrap" },
  plain: { boxShadow: `inset 0 0 0 1px ${color.line2}`, color: color.fg },
});
export function StatusDot({ tone = "neutral", live }: { tone?: Tone; live?: boolean }) {
  return <span {...stylex.props(sd.dot, f.bg(tone === "neutral" ? color.fg4 : toneFg[tone]), f.fg(toneFg[tone]), live && sd.live)} />;
}
export function StatusPill({ tone = "neutral", live, children }: { tone?: Tone; live?: boolean; children: ReactNode }) {
  return (
    <span {...stylex.props(sd.pill, tone === "neutral" ? sd.plain : [f.bg(toneBg[tone]), f.fg(toneFg[tone])])}>
      <StatusDot tone={tone} live={live} />{children}
    </span>
  );
}
// #endregion

// #region Banner
const bn = stylex.create({
  root: { display: "flex", alignItems: "center", gap: 12, width: "100%", paddingBlock: 10, paddingLeft: 16, paddingRight: 10, borderRadius: radius.lg, fontSize: 13.5, color: color.fg },
  neutral: { backgroundColor: color.raised, boxShadow: `inset 0 0 0 1px ${color.line2}` },
  grow: { flexGrow: 1, minWidth: 0 },
});
export function Banner({ tone = "neutral", icon, children, action, onDismiss }: { tone?: Tone; icon?: IconName; children: ReactNode; action?: ReactNode; onDismiss?: () => void }) {
  return (
    <div role="status" {...stylex.props(bn.root, tone === "neutral" ? bn.neutral : f.bg(toneBg[tone]))}>
      <span {...stylex.props(f.fg(toneFg[tone]))}><Icon name={icon ?? toneIcon[tone]} /></span>
      <span {...stylex.props(bn.grow)}>{children}</span>
      {action}{onDismiss && <IconButton icon="x" label="Dismiss" size="xs" onClick={onDismiss} />}
    </div>
  );
}
// #endregion

// #region Alert
const al = stylex.create({
  root: { display: "flex", gap: 12, width: "100%", paddingBlock: 14, paddingInline: 16, borderRadius: radius.lg, backgroundColor: color.raised, boxShadow: `inset 0 0 0 1px ${color.line2}` },
  title: { display: "block", fontWeight: 600, marginBottom: 2, color: color.fg },
  body: { margin: 0, color: color.fg3, fontSize: 13.5 },
  ic: { marginTop: 2 },
  inline: { display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13 },
});
export function Alert({ tone = "info", title, children }: { tone?: Tone; title: ReactNode; children?: ReactNode }) {
  return (
    <div role={tone === "bad" ? "alert" : "status"} {...stylex.props(al.root)}>
      <span {...stylex.props(al.ic, f.fg(toneFg[tone]))}><Icon name={toneIcon[tone]} size={18} /></span>
      <div><b {...stylex.props(al.title)}>{title}</b>{children && <p {...stylex.props(al.body)}>{children}</p>}</div>
    </div>
  );
}
export function InlineMessage({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return <span {...stylex.props(al.inline, f.fg(toneFg[tone]))}><Icon name={toneIcon[tone]} size={14} />{children}</span>;
}
// #endregion

// #region InfoTip
const it = stylex.create({ root: { display: "inline-flex", color: { default: color.fg4, ":hover": color.fg2 }, cursor: "help" } });
export function InfoTip({ children }: { children: ReactNode }) {
  return <Tooltip label={children}><span tabIndex={0} {...stylex.props(it.root)}><Icon name="info" size={14} /></span></Tooltip>;
}
// #endregion

// #region Progress
const pg = stylex.create({
  track: { position: "relative", width: "100%", height: 8, borderRadius: radius.pill, backgroundColor: color.sunken, boxShadow: `inset 0 0 0 1px ${color.line}`, overflow: "hidden" },
  fill: { position: "absolute", top: 0, bottom: 0, left: 0, borderRadius: "inherit", transitionProperty: "width", transitionDuration: ".5s", transitionTimingFunction: motion.ease },
  w: (v: number) => ({ width: `${v}%` }),
  indet: { width: "35%", animationName: sweep, animationDuration: "1.4s", animationIterationCount: "infinite", animationTimingFunction: motion.ease },
  segs: { display: "flex", gap: 3, width: "100%" },
  seg: { flexGrow: 1, height: 8, borderRadius: 3, backgroundColor: color.sunken, boxShadow: `inset 0 0 0 1px ${color.line}` },
  segOn: { boxShadow: "none" },
});
const fillTone = { accent: color.accent, inv: color.inv, ok: color.ok, warn: color.warn, bad: color.bad } as const;
export function Progress({ value, tone = "accent", label }: { value?: number; tone?: keyof typeof fillTone; label?: string }) {
  const indeterminate = value === undefined;
  return (
    <div role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} {...stylex.props(pg.track)}>
      <span {...stylex.props(pg.fill, f.bg(fillTone[tone]), indeterminate ? pg.indet : pg.w(Math.max(0, Math.min(100, value))))} />
    </div>
  );
}
export function SegmentedProgress({ steps, done, tone = "accent" }: { steps: number; done: number; tone?: keyof typeof fillTone }) {
  return <div {...stylex.props(pg.segs)}>{Array.from({ length: steps }, (_, i) => <span key={i} {...stylex.props(pg.seg, i < done && [pg.segOn, f.bg(fillTone[tone])])} />)}</div>;
}
// #endregion

// #region SegmentMeter
const sm = stylex.create({
  root: { display: "inline-flex", alignItems: "center", gap: 2, height: 14, paddingInline: 2, borderRadius: 3, backgroundColor: `color-mix(in srgb, ${color.fg} 8%, transparent)` },
  w: (w: number) => ({ width: w }),
  seg: { flexGrow: 1, height: 10, minWidth: 1, borderRadius: 1, backgroundColor: color.line2 },
});
/** A meter of small segments. tone="auto" runs red → amber → green across the filled part. */
export function SegmentMeter({ value, segments = 17, tone = "auto", width = 100 }: { value: number; segments?: number; tone?: "auto" | "ok" | "warn" | "bad" | "accent"; width?: number }) {
  const filled = Math.round((value / 100) * segments), red = Math.floor(filled / 3), amber = Math.ceil(filled / 3);
  const c = (i: number) => (tone === "auto" ? (i < red ? color.bad : i < red + amber ? color.warn : color.ok) : fillTone[tone]);
  return <span role="meter" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} {...stylex.props(sm.root, sm.w(width))}>{Array.from({ length: segments }, (_, i) => <span key={i} {...stylex.props(sm.seg, i < filled && f.bg(c(i)))} />)}</span>;
}
// #endregion

// #region Skeleton
const sk = stylex.create({
  root: { display: "block", borderRadius: radius.md, backgroundImage: `linear-gradient(90deg, ${color.sunken} 0%, ${color.raised2} 40%, ${color.sunken} 80%)`, backgroundSize: "300% 100%", animationName: shimmer, animationDuration: "1.6s", animationIterationCount: "infinite", animationTimingFunction: "linear" },
  size: (w: string, h: number, r: number) => ({ width: w, height: h, borderRadius: r }),
});
export function Skeleton({ width = "100%", height = 12, radius: r = 6 }: { width?: string; height?: number; radius?: number }) {
  return <span aria-hidden="true" {...stylex.props(sk.root, sk.size(width, height, r))} />;
}
// #endregion

// #region Spinner
const sp = stylex.create({
  ring: { display: "inline-block", borderRadius: "50%", borderStyle: "solid", borderColor: color.line2, borderTopColor: color.fg, animationName: spin, animationDuration: ".7s", animationIterationCount: "infinite", animationTimingFunction: "linear" },
  size: (s: number) => ({ width: s, height: s, borderWidth: s > 20 ? 2.5 : 2 }),
  pix: { display: "inline-grid", gridTemplateColumns: "repeat(3, 1fr)" },
  pixSize: (s: number) => ({ gap: s / 2, width: s * 4, height: s * 4 }),
  cell: { borderRadius: 1.5, opacity: 0.16, animationName: blink, animationDuration: "1.2s", animationIterationCount: "infinite" },
  delay: (d: number) => ({ animationDelay: `${d}s` }),
  off: { opacity: 0.1, animationName: "none" },
});
export function Spinner({ size = 16 }: { size?: number }) {
  return <span role="status" aria-label="Loading" {...stylex.props(sp.ring, sp.size(size))} />;
}
const patterns = {
  drive: [0, 0.12, 0.24, 0.12, 0.24, 0.36, 0.24, 0.36, 0.48],
  orbit: [0, 0.15, 0.3, 1.05, -1, 0.45, 0.9, 0.75, 0.6],
  scan: [0, 0, 0, 0.2, 0.2, 0.2, 0.4, 0.4, 0.4],
  dots: [0, 0.3, 0.6, 0.3, 0, 0.6, 0.6, 0.3, 0],
  churn: [0.5, 0.1, 0.7, 0.3, 0, 0.6, 0.2, 0.8, 0.4],
} as const;
/** Sera’s signature loader: nine squares, five patterns. */
export function PixelLoader({ pattern = "drive", size = 4, accent }: { pattern?: keyof typeof patterns; size?: number; accent?: boolean }) {
  return (
    <span role="status" aria-label="Loading" {...stylex.props(sp.pix, sp.pixSize(size))}>
      {patterns[pattern].map((d, i) => <span key={i} {...stylex.props(sp.cell, f.bg(accent ? color.accent : color.fg), d >= 0 ? sp.delay(d) : sp.off)} />)}
    </span>
  );
}
// #endregion

// #region Toast
const ts = stylex.create({
  stack: { position: "fixed", right: 16, bottom: 16, zIndex: 100, display: "flex", flexDirection: "column", gap: 8, width: "min(340px, calc(100vw - 32px))" },
  toast: { display: "flex", alignItems: "flex-start", gap: 10, paddingBlock: 12, paddingLeft: 14, paddingRight: 10, borderRadius: radius.lg, backgroundColor: color.raised, boxShadow: shadow.pop, fontSize: 13.5, color: color.fg, animationName: toastIn, animationDuration: ".4s", animationTimingFunction: motion.spring },
  grow: { flexGrow: 1, minWidth: 0 },
  title: { display: "block", fontWeight: 600 },
  body: { marginTop: 1, marginBottom: 0, color: color.fg3, fontSize: 13 },
});
export type ToastData = { id?: number; title: ReactNode; body?: ReactNode; tone?: Tone; action?: ReactNode };
/** The toast surface on its own (static use and docs). */
export function Toast({ title, body, tone = "ok", action, onDismiss }: ToastData & { onDismiss?: () => void }) {
  return (
    <div role="status" {...stylex.props(ts.toast)}>
      <span {...stylex.props(f.fg(toneFg[tone]))}><Icon name={toneIcon[tone]} size={18} /></span>
      <div {...stylex.props(ts.grow)}><b {...stylex.props(ts.title)}>{title}</b>{body && <p {...stylex.props(ts.body)}>{body}</p>}</div>
      {action}{onDismiss && <IconButton icon="x" label="Dismiss" size="xs" onClick={onDismiss} />}
    </div>
  );
}
const ToastCtx = createContext<(t: ToastData) => void>(() => {});
/** const toast = useToast(); toast({ title: "Saved" }) — needs <ToastProvider> above. */
export const useToast = () => useContext(ToastCtx);
export function ToastProvider({ children, duration = 3200 }: { children: ReactNode; duration?: number }) {
  const [list, setList] = useState<(ToastData & { id: number })[]>([]);
  const push = useCallback((t: ToastData) => {
    const id = Date.now() + Math.random();
    setList((l) => [...l.slice(-2), { ...t, id }]);
    setTimeout(() => setList((l) => l.filter((x) => x.id !== id)), duration);
  }, [duration]);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      {createPortal(<div {...stylex.props(ts.stack)}>{list.map((t) => <Toast key={t.id} {...t} onDismiss={() => setList((l) => l.filter((x) => x.id !== t.id))} />)}</div>, document.body)}
    </ToastCtx.Provider>
  );
}
// #endregion

// #region EmptyState
const em = stylex.create({
  root: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 10, maxWidth: 360, padding: 12, marginInline: "auto" },
  glyph: { width: 48, height: 48, borderRadius: radius.lg, display: "grid", placeItems: "center", backgroundColor: color.raised, boxShadow: `inset 0 0 0 1px ${color.line2}`, color: color.fg2, marginBottom: 4 },
  actions: { display: "flex", gap: 8, marginTop: 6 },
  code: { fontFamily: font.mono, fontSize: 12, color: color.fg4 },
});
export function EmptyState({ icon = "inbox", title, children, actions }: { icon?: IconName; title: ReactNode; children?: ReactNode; actions?: ReactNode }) {
  return (
    <div {...stylex.props(em.root)}>
      <span {...stylex.props(em.glyph)}><Icon name={icon} size={22} /></span>
      <Heading level="h3">{title}</Heading>
      {children && <Text tone="fg3">{children}</Text>}
      {actions && <div {...stylex.props(em.actions)}>{actions}</div>}
    </div>
  );
}
// #endregion

// #region StatusPage
const pages = {
  404: { icon: "compass", title: "Page not found", body: "The link may be old, or the page was moved." },
  500: { icon: "alert", title: "Something broke", body: "We’ve been told. Try again in a moment." },
  maintenance: { icon: "clock", title: "Back soon", body: "We’re doing scheduled maintenance." },
} as const;
export function StatusPage({ kind, onHome }: { kind: keyof typeof pages; onHome?: () => void }) {
  const p = pages[kind];
  return (
    <EmptyState icon={p.icon} title={<><span {...stylex.props(em.code)}>{kind === "maintenance" ? "" : kind} </span>{p.title}</>}
      actions={<Button size="sm" iconEnd="arrow-right" onClick={onHome}>Go home</Button>}>{p.body}</EmptyState>
  );
}
// #endregion
export type { Tone };
