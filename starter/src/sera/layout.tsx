/**
 * Layout — structure for pages and panels.
 * AppShell · PageHeader · Stack · Grid · Section · FormLayout · Divider · AspectRatio · ScrollArea ·
 * SplitPane · Resizable · Panel (header/toolbar/body/footer) · Sticky
 */
import * as stylex from "@stylexjs/stylex";
import { useRef, useState, type ReactNode } from "react";
import { color, font, radius, shadow } from "./tokens.stylex";
import { Heading, Text } from "./content";
import type { XStyle } from "./lib";


// #region AppShell
const sh = stylex.create({
  root: { display: "grid", gridTemplateColumns: "232px minmax(0, 1fr)", gap: 8, minHeight: "100dvh", padding: 8, backgroundColor: color.bg, color: color.fg },
  side: { display: "flex", flexDirection: "column", gap: 14, paddingBlock: 8, paddingInline: 4, minHeight: 0 },
  main: { display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0, borderRadius: radius.xl, backgroundColor: color.panel, boxShadow: `inset 0 0 0 1px ${color.line}`, overflow: "hidden" },
  head: { display: "flex", alignItems: "center", gap: 10, height: 56, flex: "none", paddingLeft: 18, paddingRight: 14, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.line },
  title: { fontSize: 15, fontWeight: 600 },
  grow: { flexGrow: 1 },
  body: { flexGrow: 1, minHeight: 0, overflow: "auto", paddingBlock: 22, paddingInline: 24, display: "flex", flexDirection: "column", gap: 16 },
  flush: { padding: 0 },
  mobile: { "@media (max-width: 860px)": { gridTemplateColumns: "minmax(0, 1fr)" } },
  hideMobile: { "@media (max-width: 860px)": { display: "none" } },
});
/** Quiet rail + floating main panel, 8px from the edges. */
export function AppShell({ sidebar, title, actions, children, flush }: { sidebar: ReactNode; title?: ReactNode; actions?: ReactNode; children: ReactNode; flush?: boolean }) {
  return (
    <div {...stylex.props(sh.root, sh.mobile)}>
      <aside {...stylex.props(sh.side, sh.hideMobile)}>{sidebar}</aside>
      <main {...stylex.props(sh.main)}>
        {(title || actions) && <header {...stylex.props(sh.head)}><span {...stylex.props(sh.title)}>{title}</span><span {...stylex.props(sh.grow)} />{actions}</header>}
        <div {...stylex.props(sh.body, flush && sh.flush)}>{children}</div>
      </main>
    </div>
  );
}
// #endregion

// #region PageHeader
const ph = stylex.create({
  root: { display: "flex", flexDirection: "column", gap: 10 },
  row: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" },
  text: { flexGrow: 1, minWidth: 0 },
  actions: { display: "flex", gap: 8, alignItems: "center" },
});
export function PageHeader({ breadcrumbs, lead, title, meta, actions, tabs }: { breadcrumbs?: ReactNode; lead?: ReactNode; title: ReactNode; meta?: ReactNode; actions?: ReactNode; tabs?: ReactNode }) {
  return (
    <div {...stylex.props(ph.root)}>
      {breadcrumbs}
      <div {...stylex.props(ph.row)}>
        {lead}<div {...stylex.props(ph.text)}><Heading level="h2">{title}</Heading>{meta && <Text size="small" tone="fg3">{meta}</Text>}</div>
        {actions && <div {...stylex.props(ph.actions)}>{actions}</div>}
      </div>
      {tabs}
    </div>
  );
}
// #endregion

// #region Stack
const st = stylex.create({
  base: { display: "flex", minWidth: 0 },
  dir: (d: "row" | "column") => ({ flexDirection: d }),
  gap: (g: number) => ({ gap: g }),
  align: (a: string) => ({ alignItems: a }),
  justify: (j: string) => ({ justifyContent: j }),
  wrap: { flexWrap: "wrap" },
});
export function Stack({ direction = "column", gap = 10, align = "stretch", justify = "flex-start", wrap, children, xstyle }: {
  direction?: "row" | "column"; gap?: number; align?: string; justify?: string; wrap?: boolean; children: ReactNode; xstyle?: XStyle;
}) {
  return <div {...stylex.props(st.base, st.dir(direction), st.gap(gap), st.align(align), st.justify(justify), wrap && st.wrap, xstyle)}>{children}</div>;
}
export const HStack = (p: Omit<Parameters<typeof Stack>[0], "direction">) => <Stack align="center" {...p} direction="row" />;
// #endregion

// #region Grid
const gr = stylex.create({
  base: { display: "grid", minWidth: 0 },
  cols: (n: number, min: number, gap: number) => ({ gridTemplateColumns: min ? `repeat(auto-fit, minmax(min(${min}px, 100%), 1fr))` : `repeat(${n}, minmax(0, 1fr))`, gap }),
});
/** Fixed columns, or `minWidth` for columns that wrap responsively. */
export function Grid({ columns = 3, minWidth = 0, gap = 12, children, xstyle }: { columns?: number; minWidth?: number; gap?: number; children: ReactNode; xstyle?: XStyle }) {
  return <div {...stylex.props(gr.base, gr.cols(columns, minWidth, gap), xstyle)}>{children}</div>;
}
// #endregion

// #region Section
const sc = stylex.create({
  head: { display: "flex", alignItems: "center", gap: 12, marginBottom: 12 },
  title: { margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: "-.01em", color: color.fg, whiteSpace: "nowrap" },
  sub: { color: color.fg3, fontWeight: 400, marginLeft: 6, fontSize: 13 },
  rule: { flexGrow: 1, borderTopWidth: 1, borderTopStyle: "dashed", borderTopColor: color.line2 },
  count: { fontFamily: font.mono, fontSize: 11, color: color.fg4 },
});
/** Title + dashed rule to the edge + a count or action. */
export function Section({ title, subtitle, end, children }: { title: ReactNode; subtitle?: ReactNode; end?: ReactNode; children: ReactNode }) {
  return (
    <section>
      <div {...stylex.props(sc.head)}><h2 {...stylex.props(sc.title)}>{title}{subtitle && <span {...stylex.props(sc.sub)}>· {subtitle}</span>}</h2><span {...stylex.props(sc.rule)} />{typeof end === "number" ? <span {...stylex.props(sc.count)}>{end}</span> : end}</div>
      {children}
    </section>
  );
}
// #endregion

// #region FormLayout
const fl = stylex.create({
  root: { borderRadius: radius.xl, backgroundColor: color.surface, boxShadow: `inset 0 0 0 1px ${color.line}, ${shadow.card}` },
  row: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))", gap: "8px 24px", paddingBlock: 16, paddingInline: 18 },
  sep: { borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: color.line },
  label: { fontSize: 13, fontWeight: 500, color: color.fg },
  hint: { fontSize: 12.5, color: color.fg3 },
  foot: { display: "flex", justifyContent: "flex-end", gap: 8, paddingBlock: 12, paddingInline: 14, borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: color.line },
});
/** Label + description on the left, control on the right; stacks when narrow. */
export function FormLayout({ rows, footer }: { rows: { label: ReactNode; hint?: ReactNode; control: ReactNode }[]; footer?: ReactNode }) {
  return (
    <div {...stylex.props(fl.root)}>
      {rows.map((r, i) => <div key={i} {...stylex.props(fl.row, i > 0 && fl.sep)}><div><div {...stylex.props(fl.label)}>{r.label}</div>{r.hint && <div {...stylex.props(fl.hint)}>{r.hint}</div>}</div>{r.control}</div>)}
      {footer && <div {...stylex.props(fl.foot)}>{footer}</div>}
    </div>
  );
}
// #endregion

// #region Divider
const dv = stylex.create({
  h: { width: "100%", height: 0, margin: 0, borderWidth: 0, borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: color.line },
  dashed: { borderTopStyle: "dashed", borderTopColor: color.line2 },
  v: { width: 1, alignSelf: "stretch", backgroundColor: color.line2 },
  label: { display: "flex", alignItems: "center", gap: 12, width: "100%", fontFamily: font.mono, fontSize: 10.5, fontWeight: 500, letterSpacing: ".08em", textTransform: "uppercase", color: color.fg4 },
  line: { flexGrow: 1, borderTopWidth: 1, borderTopStyle: "dashed", borderTopColor: color.line2 },
});
export function Divider({ dashed, vertical, label }: { dashed?: boolean; vertical?: boolean; label?: ReactNode }) {
  if (vertical) return <span role="separator" aria-orientation="vertical" {...stylex.props(dv.v)} />;
  if (label) return <div role="separator" {...stylex.props(dv.label)}><span {...stylex.props(dv.line)} />{label}<span {...stylex.props(dv.line)} /></div>;
  return <hr {...stylex.props(dv.h, dashed && dv.dashed)} />;
}
// #endregion

// #region AspectRatio
const ar = stylex.create({ root: { position: "relative", width: "100%", overflow: "hidden" }, r: (r: number) => ({ aspectRatio: String(r) }) });
export const AspectRatio = ({ ratio = 16 / 9, children }: { ratio?: number; children: ReactNode }) => <div {...stylex.props(ar.root, ar.r(ratio))}>{children}</div>;
// #endregion

// #region ScrollArea
const sa = stylex.create({
  root: { overflowY: "auto", scrollbarWidth: "thin", maskImage: "linear-gradient(transparent, #000 22px, #000 calc(100% - 22px), transparent)" },
  h: (h: number) => ({ maxHeight: h }),
});
/** Scrolls with soft fades where content continues. */
export const ScrollArea = ({ height, children }: { height: number; children: ReactNode }) => <div {...stylex.props(sa.root, sa.h(height))}>{children}</div>;
// #endregion

// #region SplitPane
const sp = stylex.create({
  root: { display: "flex", width: "100%", height: "100%", minHeight: 200, borderRadius: radius.xl, overflow: "hidden", backgroundColor: color.surface, boxShadow: `inset 0 0 0 1px ${color.line}` },
  pane: { minWidth: 80, overflow: "auto" },
  w: (px: number) => ({ flexBasis: px, flexGrow: 0, flexShrink: 0 }),
  rest: { flexGrow: 1 },
  handle: { flex: "none", width: 9, cursor: "col-resize", display: "grid", placeItems: "center", backgroundColor: color.well, borderInlineWidth: 1, borderInlineStyle: "solid", borderInlineColor: color.line, touchAction: "none" },
  grip: { width: 3, height: 28, borderRadius: 9, backgroundColor: { default: color.line3, ":hover": color.accent } },
});
/** Two panes with a draggable handle. */
export function SplitPane({ start, end, initial = 280, min = 120 }: { start: ReactNode; end: ReactNode; initial?: number; min?: number }) {
  const [w, setW] = useState(initial);
  const ref = useRef<HTMLDivElement>(null);
  const drag = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const mv = (ev: PointerEvent) => setW(Math.min(r.width - min, Math.max(min, ev.clientX - r.left)));
    const up = () => { removeEventListener("pointermove", mv); removeEventListener("pointerup", up); };
    addEventListener("pointermove", mv); addEventListener("pointerup", up); e.preventDefault();
  };
  return (
    <div ref={ref} {...stylex.props(sp.root)}>
      <div {...stylex.props(sp.pane, sp.w(w))}>{start}</div>
      <div role="separator" aria-orientation="vertical" aria-valuenow={Math.round(w)} onPointerDown={drag} {...stylex.props(sp.handle)}><span {...stylex.props(sp.grip)} /></div>
      <div {...stylex.props(sp.pane, sp.rest)}>{end}</div>
    </div>
  );
}
// #endregion

// #region Resizable
const rz = stylex.create({ root: { resize: "both", overflow: "auto", minWidth: 180, minHeight: 100, maxWidth: "100%", padding: 18, borderRadius: radius.xl, backgroundColor: color.surface, boxShadow: `inset 0 0 0 1px ${color.line}` } });
export const Resizable = ({ children, xstyle }: { children: ReactNode; xstyle?: XStyle }) => <div {...stylex.props(rz.root, xstyle)}>{children}</div>;
// #endregion

// #region Panel
const pn = stylex.create({
  root: { display: "flex", flexDirection: "column", minHeight: 0, borderRadius: radius.xl, backgroundColor: color.surface, boxShadow: `inset 0 0 0 1px ${color.line}`, overflow: "hidden" },
  head: { display: "flex", alignItems: "center", gap: 8, height: 52, paddingInline: 14, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.line, fontWeight: 600, flex: "none" },
  bar: { display: "flex", alignItems: "center", gap: 8, height: 44, paddingInline: 10, backgroundColor: color.well, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.line, flex: "none" },
  body: { flexGrow: 1, minHeight: 0, overflow: "auto", padding: 14 },
  foot: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, paddingBlock: 12, paddingInline: 14, flex: "none", borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: color.line },
});
/** Header, optional toolbar, scrolling body and footer — the parts every panel is made from. */
export function Panel({ title, toolbar, footer, children, xstyle }: { title?: ReactNode; toolbar?: ReactNode; footer?: ReactNode; children: ReactNode; xstyle?: XStyle }) {
  return (
    <section {...stylex.props(pn.root, xstyle)}>
      {title && <header {...stylex.props(pn.head)}>{title}</header>}
      {toolbar && <div {...stylex.props(pn.bar)}>{toolbar}</div>}
      <div {...stylex.props(pn.body)}>{children}</div>
      {footer && <footer {...stylex.props(pn.foot)}>{footer}</footer>}
    </section>
  );
}
// #endregion

// #region Sticky
const sy = stylex.create({
  root: { position: "sticky", top: 0, zIndex: 2, paddingBlock: 8, paddingInline: 14, backgroundColor: `color-mix(in srgb, ${color.surface} 82%, transparent)`, backdropFilter: "blur(8px)", borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.line, fontFamily: font.mono, fontSize: 10.5, fontWeight: 500, letterSpacing: ".08em", textTransform: "uppercase", color: color.fg4 },
  top: (t: number) => ({ top: t }),
});
/** A header that stays put while its scroll container moves. */
export const StickyHeader = ({ children, top = 0 }: { children: ReactNode; top?: number }) => <div {...stylex.props(sy.root, sy.top(top))}>{children}</div>;
// #endregion
