/**
 * Data & charts — SVG that reads colour tokens, so both themes just work.
 * Stat · StatRow · Delta · Legend · LineChart · BarChart · DonutChart · Sparkline · BarList · BreakdownBar ·
 * Gauge · Heatmap · PillBarChart · ValueChart · UsageMeter · FunnelChart · ScatterChart · BulletChart ·
 * ComboChart · RadarChart
 */
import * as stylex from "@stylexjs/stylex";
import { useId, useState, type ReactNode } from "react";
import { color, font, radius, shadow } from "./tokens.stylex";
import { Icon, type IconName } from "./icons";
import type { XStyle } from "./lib";

export const palette = { c1: color.c1, c2: color.c2, c3: color.c3, c4: color.c4, c5: color.c5, c6: color.c6, c7: color.c7, accent: color.accent, ok: color.ok, bad: color.bad } as const;
export type Series = keyof typeof palette;
const k = (v: number) => (Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(Math.abs(v) >= 10000 ? 0 : 1).replace(/\.0$/, "")}k` : String(Math.round(v)));
const nice = (m: number) => { const p = 10 ** Math.floor(Math.log10(m || 1)); const n = m / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p; };
const r1 = (n: number) => Math.round(n * 10) / 10;
function smooth(pts: [number, number][], t = 0.17) {
  let d = `M${r1(pts[0][0])},${r1(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    d += ` C${r1(p1[0] + (p2[0] - p0[0]) * t)},${r1(p1[1] + (p2[1] - p0[1]) * t)} ${r1(p2[0] - (p3[0] - p1[0]) * t)},${r1(p2[1] - (p3[1] - p1[1]) * t)} ${r1(p2[0])},${r1(p2[1])}`;
  }
  return d;
}
const ax = stylex.create({ svg: { display: "block", width: "100%", height: "auto", overflow: "visible", fontFamily: font.sans, fontSize: 10.5 }, label: { fill: color.fg4 } });
function Axes({ w, h, pl, pr, pt, pb, max, min = 0, ticks = 4, pre = "" }: { w: number; h: number; pl: number; pr: number; pt: number; pb: number; max: number; min?: number; ticks?: number; pre?: string }) {
  return <>{Array.from({ length: ticks + 1 }, (_, i) => {
    const y = pt + ((h - pt - pb) * i) / ticks, v = max - ((max - min) * i) / ticks;
    return <g key={i}><line x1={pl} x2={w - pr} y1={y} y2={y} style={{ stroke: color.line2, strokeDasharray: i === ticks ? "0" : "2 4" }} />{pl > 10 && <text x={pl - 8} y={y + 3.5} textAnchor="end" {...stylex.props(ax.label)}>{pre + k(v)}</text>}</g>;
  })}</>;
}
const Hatch = ({ id, c }: { id: string; c: string }) => <pattern id={id} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5" style={{ stroke: c, strokeWidth: 1.6, opacity: 0.32 }} /></pattern>;

// #region Stat
const st = stylex.create({
  stat: { display: "flex", flexDirection: "column", gap: 6, minWidth: 0 },
  lab: { display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: color.fg3 },
  val: { fontSize: 28, lineHeight: 1.1, fontWeight: 600, letterSpacing: "-.03em", fontVariantNumeric: "tabular-nums", color: color.fg },
  unit: { fontSize: 15, color: color.fg4, fontWeight: 500, letterSpacing: 0 },
  row: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  sub: { fontSize: 12.5, color: color.fg3 },
  strip: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(180px, 100%), 1fr))", width: "100%", borderRadius: radius.xl, backgroundColor: color.surface, boxShadow: `inset 0 0 0 1px ${color.line}, ${shadow.card}`, overflow: "hidden" },
  cell: { paddingBlock: 16, paddingInline: 18, boxShadow: `-1px 0 0 ${color.line}` },
  delta: { display: "inline-flex", alignItems: "center", gap: 3, height: 20, paddingInline: 6, borderRadius: radius.sm, fontSize: 12, fontWeight: 600, fontVariantNumeric: "tabular-nums" },
  up: { backgroundColor: color.okSoft, color: color.ok }, down: { backgroundColor: color.badSoft, color: color.bad }, flat: { backgroundColor: color.sunken, color: color.fg3 },
});
export function Delta({ value, suffix = "%" }: { value: number; suffix?: string }) {
  return <span {...stylex.props(st.delta, value > 0 ? st.up : value < 0 ? st.down : st.flat)}>{value !== 0 && <Icon name={value > 0 ? "arrow-up" : "arrow-down"} size={11} />}{Math.abs(value)}{suffix}</span>;
}
export function Stat({ label, icon, value, unit, delta, sub, trend }: { label: ReactNode; icon?: IconName; value: ReactNode; unit?: ReactNode; delta?: number; sub?: ReactNode; trend?: ReactNode }) {
  return (
    <div {...stylex.props(st.stat)}>
      <span {...stylex.props(st.lab)}>{icon && <Icon name={icon} size={14} />}{label}</span>
      <div {...stylex.props(st.row)}><span {...stylex.props(st.val)}>{value}{unit && <span {...stylex.props(st.unit)}> {unit}</span>}</span>{delta !== undefined && <Delta value={delta} />}{trend}</div>
      {sub && <span {...stylex.props(st.sub)}>{sub}</span>}
    </div>
  );
}
/** Stats in one surface with hairline dividers — the KPI strip. */
export function StatRow({ children }: { children: ReactNode[] }) {
  return <div {...stylex.props(st.strip)}>{children.map((c, i) => <div key={i} {...stylex.props(st.cell)}>{c}</div>)}</div>;
}
// #endregion

// #region Legend
const lg = stylex.create({ row: { display: "flex", flexWrap: "wrap", gap: "6px 14px", fontSize: 12.5, color: color.fg3 }, item: { display: "inline-flex", alignItems: "center", gap: 6 }, sw: (c: string) => ({ width: 8, height: 8, borderRadius: 2, backgroundColor: c }), v: { color: color.fg, fontWeight: 500, fontVariantNumeric: "tabular-nums" } });
export function Legend({ items }: { items: { label: ReactNode; color: Series | "free"; value?: ReactNode }[] }) {
  return <div {...stylex.props(lg.row)}>{items.map((i, n) => <span key={n} {...stylex.props(lg.item)}><span {...stylex.props(lg.sw(i.color === "free" ? color.line3 : palette[i.color]))} />{i.label}{i.value && <span {...stylex.props(lg.v)}>{i.value}</span>}</span>)}</div>;
}
// #endregion

// #region LineChart
export function LineChart({ series, labels, width = 640, height = 230, pre = "", area = true, step }: {
  series: { data: number[]; color?: Series; dashed?: boolean }[]; labels?: string[]; width?: number; height?: number; pre?: string; area?: boolean; step?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const w = width, h = height, pl = 36, pr = 10, pt = 12, pb = labels ? 26 : 8;
  const max = nice(Math.max(...series.flatMap((s) => s.data)) * 1.05), n = series[0].data.length;
  const X = (i: number) => pl + ((w - pl - pr) * i) / (n - 1), Y = (v: number) => pt + (h - pt - pb) * (1 - v / max);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Line chart" {...stylex.props(ax.svg)}>
      <defs>{series.map((s, j) => <g key={j}><Hatch id={`${id}h${j}`} c={palette[s.color ?? "c1"]} /><linearGradient id={`${id}g${j}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={{ stopColor: palette[s.color ?? "c1"], stopOpacity: 0.22 }} /><stop offset="1" style={{ stopColor: palette[s.color ?? "c1"], stopOpacity: 0 }} /></linearGradient></g>)}</defs>
      <Axes w={w} h={h} pl={pl} pr={pr} pt={pt} pb={pb} max={max} pre={pre} />
      {series.map((s, j) => {
        const c = palette[s.color ?? "c1"], pts = s.data.map((v, i) => [X(i), Y(v)] as [number, number]);
        const d = step ? pts.map((p, i) => `${i ? "L" : "M"}${r1(p[0])},${r1(p[1])}`).join(" ") : smooth(pts);
        const fill = `${d} L${X(n - 1)},${h - pb} L${pl},${h - pb} Z`, last = pts[pts.length - 1];
        return (
          <g key={j}>
            {area && j === 0 && <><path d={fill} style={{ fill: `url(#${id}g${j})` }} /><path d={fill} style={{ fill: `url(#${id}h${j})` }} /></>}
            <path d={d} style={{ fill: "none", stroke: c, strokeWidth: 2, strokeLinecap: "round", strokeDasharray: s.dashed ? "4 5" : undefined }} />
            {j === 0 && <><circle cx={last[0]} cy={last[1]} r={7} style={{ fill: c, opacity: 0.18 }} /><circle cx={last[0]} cy={last[1]} r={3.6} style={{ fill: color.surface, stroke: c, strokeWidth: 2 }} /></>}
          </g>
        );
      })}
      {labels?.map((l, i) => i % Math.ceil(n / 8) === 0 && <text key={i} x={X(i)} y={h - 6} textAnchor={i === 0 ? "start" : "middle"} {...stylex.props(ax.label)}>{l}</text>)}
    </svg>
  );
}
// #endregion

// #region BarChart
export function BarChart({ data, series, labels, highlight, stacked, width = 640, height = 230, pre = "" }: {
  data?: number[]; series?: { data: number[]; color: Series }[]; labels?: string[]; highlight?: number; stacked?: boolean; width?: number; height?: number; pre?: string;
}) {
  const S = series ?? [{ data: data ?? [], color: "c7" as Series }];
  const w = width, h = height, pl = 36, pr = 6, pt = 14, pb = labels ? 26 : 8, n = S[0].data.length;
  const sums = S[0].data.map((_, i) => (stacked ? S.reduce((a, s) => a + s.data[i], 0) : Math.max(...S.map((s) => s.data[i]))));
  const max = nice(Math.max(...sums) * 1.05), Y = (v: number) => ((h - pt - pb) * v) / max, slot = (w - pl - pr) / n, gap = slot * 0.4;
  const bw = stacked ? slot - gap : (slot - gap) / S.length;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Bar chart" {...stylex.props(ax.svg)}>
      <Axes w={w} h={h} pl={pl} pr={pr} pt={pt} pb={pb} max={max} pre={pre} />
      {S[0].data.map((_, i) => {
        let acc = 0;
        return <g key={i}>{S.map((s, j) => {
          const v = s.data[i], bh = Math.max(2, Y(v)), x = pl + slot * i + gap / 2 + (stacked ? 0 : bw * j), y = h - pb - bh - (stacked ? Y(acc) : 0); acc += v;
          const c = highlight !== undefined && S.length === 1 ? (i === highlight ? color.accent : color.c7) : palette[s.color];
          return <rect key={j} x={x} y={y} width={bw} height={bh} rx={stacked && j < S.length - 1 ? 0 : Math.min(5, bw / 2)} style={{ fill: c }} />;
        })}{highlight === i && S.length === 1 && <text x={pl + slot * i + slot / 2} y={h - pb - Y(S[0].data[i]) - 8} textAnchor="middle" style={{ fill: color.fg, fontWeight: 600 }}>{pre + k(S[0].data[i])}</text>}</g>;
      })}
      {labels?.map((l, i) => <text key={i} x={pl + slot * i + slot / 2} y={h - 6} textAnchor="middle" {...stylex.props(ax.label)}>{l}</text>)}
    </svg>
  );
}
// #endregion

// #region DonutChart
export function DonutChart({ data, size = 180, thickness = 18, label, sub }: { data: { value: number; color: Series }[]; size?: number; thickness?: number; label?: ReactNode; sub?: ReactNode }) {
  const r = (size - thickness) / 2 - 2, c = 2 * Math.PI * r, tot = data.reduce((a, d) => a + d.value, 0), gap = ((thickness + 4) / c) * 100;
  let acc = 0;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} role="img" aria-label="Donut chart" {...stylex.props(ax.svg)} style={{ width: size, maxWidth: "100%" }}>
      <circle cx={size / 2} cy={size / 2} r={r} style={{ fill: "none", stroke: color.sunken, strokeWidth: thickness }} />
      {data.map((d, i) => { const len = (d.value / tot) * 100, L = Math.max(0.1, len - gap), off = -acc - gap / 2; acc += len;
        return <circle key={i} cx={size / 2} cy={size / 2} r={r} pathLength={100} transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ fill: "none", stroke: palette[d.color], strokeWidth: thickness, strokeLinecap: "round", strokeDasharray: `${L} ${100 - L}`, strokeDashoffset: off }} />; })}
      {label && <text x="50%" y={size / 2 + (sub ? 2 : 7)} textAnchor="middle" style={{ fill: color.fg, fontSize: size / 7.5, fontWeight: 600 }}>{label}</text>}
      {sub && <text x="50%" y={size / 2 + size / 9} textAnchor="middle" {...stylex.props(ax.label)}>{sub}</text>}
    </svg>
  );
}
// #endregion

// #region Sparkline
export function Sparkline({ data, color: c = "c1", width = 120, height = 34, area = true }: { data: number[]; color?: Series; width?: number; height?: number; area?: boolean }) {
  const id = useId().replace(/:/g, ""), mx = Math.max(...data), mn = Math.min(...data);
  const pts = data.map((v, i) => [2 + ((width - 6) * i) / (data.length - 1), 3 + (height - 6) * (1 - (v - mn) / (mx - mn || 1))] as [number, number]);
  const d = smooth(pts, 0.14), last = pts[pts.length - 1], col = palette[c];
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      {area && <><defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={{ stopColor: col, stopOpacity: 0.28 }} /><stop offset="1" style={{ stopColor: col, stopOpacity: 0 }} /></linearGradient></defs><path d={`${d} L${last[0]},${height} L2,${height} Z`} style={{ fill: `url(#${id})` }} /></>}
      <path d={d} style={{ fill: "none", stroke: col, strokeWidth: 1.7, strokeLinecap: "round" }} /><circle cx={last[0]} cy={last[1]} r={2.4} style={{ fill: col }} />
    </svg>
  );
}
// #endregion

// #region BarList
const bl = stylex.create({
  list: { display: "flex", flexDirection: "column", gap: 6, width: "100%" },
  row: { display: "flex", alignItems: "center", gap: 10, fontSize: 13 },
  trk: { position: "relative", flexGrow: 1, minWidth: 0, height: 30 },
  fill: { position: "absolute", top: 0, bottom: 0, left: 0, borderRadius: radius.md, backgroundColor: color.sunken, boxShadow: `inset 0 0 0 1px ${color.line}` },
  lead: { backgroundColor: color.accentSoft, boxShadow: `inset 2px 0 0 ${color.accent}` },
  w: (p: number) => ({ width: `${p}%` }),
  nm: { position: "absolute", left: 10, top: 0, bottom: 0, display: "flex", alignItems: "center", gap: 8, color: color.fg2, whiteSpace: "nowrap" },
  v: { minWidth: 56, textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 500, color: color.fg },
});
export function BarList({ rows, pre = "" }: { rows: { label: ReactNode; value: number; icon?: IconName }[]; pre?: string }) {
  const mx = Math.max(...rows.map((r) => r.value));
  return <div {...stylex.props(bl.list)}>{rows.map((r, i) => <div key={i} {...stylex.props(bl.row)}><div {...stylex.props(bl.trk)}><span {...stylex.props(bl.fill, i === 0 && bl.lead, bl.w(Math.max(6, (r.value / mx) * 100)))} /><span {...stylex.props(bl.nm)}>{r.icon && <Icon name={r.icon} size={14} />}{r.label}</span></div><span {...stylex.props(bl.v)}>{pre}{r.value.toLocaleString()}</span></div>)}</div>;
}
// #endregion

// #region BreakdownBar
const mt = stylex.create({
  bar: { display: "flex", gap: 3, height: 30, padding: 3, borderRadius: radius.lg, backgroundColor: color.sunken, boxShadow: `inset 0 0 0 1px ${color.line}`, width: "100%" },
  thin: { height: 12, padding: 2, borderRadius: radius.sm },
  seg: { minWidth: 4, borderRadius: 6 },
  thinSeg: { borderRadius: 3 },
  grow: (g: number, c: string) => ({ flexGrow: g, backgroundColor: c }),
  free: { backgroundImage: `radial-gradient(${color.line3} 1px, transparent 1.3px)`, backgroundSize: "6px 6px", backgroundColor: "transparent" },
});
export type Part = { label: string; value: number; color: Series | "free"; display?: string };
/** One bar split into parts. Use color: "free" for a dotted remainder. */
export function BreakdownBar({ parts, thin }: { parts: Part[]; thin?: boolean }) {
  return <div role="img" aria-label={parts.map((p) => `${p.label} ${p.display ?? p.value}`).join(", ")} {...stylex.props(mt.bar, thin && mt.thin)}>{parts.map((p) => <span key={p.label} title={p.label} {...stylex.props(mt.seg, thin && mt.thinSeg, mt.grow(p.value, p.color === "free" ? "transparent" : palette[p.color]), p.color === "free" && mt.free)} />)}</div>;
}
// #endregion

// #region UsageMeter
const um = stylex.create({ head: { display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10, fontSize: 13.5 }, title: { fontWeight: 600, color: color.fg }, n: { fontVariantNumeric: "tabular-nums", color: color.fg3, fontSize: 12.5 }, b: { color: color.fg, fontWeight: 600 }, foot: { marginTop: 10 } });
/** A context-window style meter: coloured parts, dotted free space, a legend. */
export function UsageMeter({ title, used, total, parts }: { title: ReactNode; used: string; total: string; parts: Part[] }) {
  return (
    <div>
      <div {...stylex.props(um.head)}><span {...stylex.props(um.title)}>{title}</span><span {...stylex.props(um.n)}><span {...stylex.props(um.b)}>{used}</span> / {total}</span></div>
      <BreakdownBar parts={parts} />
      <div {...stylex.props(um.foot)}><Legend items={parts.map((p) => ({ label: p.label, color: p.color, value: p.display }))} /></div>
    </div>
  );
}
// #endregion

// #region Gauge
export function Gauge({ value, size = 220, ticks = 32, label, sub }: { value: number; size?: number; ticks?: number; label?: ReactNode; sub?: ReactNode }) {
  const cx = size / 2, cy = size * 0.56, a1 = size * 0.32, a2 = size * 0.44;
  return (
    <svg viewBox={`0 0 ${size} ${size * 0.86}`} width={size} role="img" aria-label={`Gauge ${value}%`} {...stylex.props(ax.svg)} style={{ width: size, maxWidth: "100%" }}>
      {Array.from({ length: ticks }, (_, i) => { const t = i / (ticks - 1), a = ((-210 + 240 * t) * Math.PI) / 180, on = t <= value / 100 + 1e-9;
        return <line key={i} x1={cx + a1 * Math.cos(a)} y1={cy + a1 * Math.sin(a)} x2={cx + a2 * Math.cos(a)} y2={cy + a2 * Math.sin(a)} style={{ stroke: on ? `color-mix(in srgb, ${color.c2}, ${color.c1} ${Math.round(t * 100)}%)` : color.line2, strokeWidth: size / 48, strokeLinecap: "round" }} />; })}
      <text x={cx} y={cy + 6} textAnchor="middle" style={{ fill: color.fg, fontSize: size / 6.2, fontWeight: 600 }}>{label ?? `${value}%`}</text>
      {sub && <text x={cx} y={cy + size / 7} textAnchor="middle" {...stylex.props(ax.label)}>{sub}</text>}
    </svg>
  );
}
// #endregion

// #region Heatmap
const hm = stylex.create({ grid: { display: "grid", gap: 3, width: "100%" }, cols: (n: number) => ({ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }), cell: { aspectRatio: "1", borderRadius: 4 }, lvl: (p: number) => ({ backgroundColor: p ? `color-mix(in srgb, ${color.accent} ${p}%, ${color.sunken})` : color.sunken }) });
/** values: rows × cols numbers from 0 to 1. */
export function Heatmap({ values }: { values: number[][] }) {
  const steps = [0, 22, 45, 70, 100];
  return <div role="img" aria-label="Heatmap" {...stylex.props(hm.grid, hm.cols(values[0]?.length ?? 1))}>{values.flatMap((row, r) => row.map((v, c) => <span key={`${r}-${c}`} title={`${Math.round(v * 100)}%`} {...stylex.props(hm.cell, hm.lvl(steps[Math.round(Math.max(0, Math.min(1, v)) * 4)]))} />))}</div>;
}
// #endregion

// #region PillBarChart
export function PillBarChart({ data, labels, highlight, width = 560, height = 200, pre = "" }: { data: number[]; labels?: string[]; highlight?: number; width?: number; height?: number; pre?: string }) {
  const n = data.length, pb = labels ? 24 : 4, mx = Math.max(...data) * 1.12, slot = width / n, bw = Math.min(26, slot * 0.62), full = height - pb - 26;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Pill bar chart" {...stylex.props(ax.svg)}>
      {data.map((v, i) => { const x = slot * i + (slot - bw) / 2, bh = Math.max(bw, (full * v) / mx), y = height - pb - bh, on = i === highlight;
        return <g key={i}>
          <rect x={x} y={26} width={bw} height={full} rx={bw / 2} style={{ fill: color.sunken, stroke: color.line, strokeDasharray: "2 3" }} />
          <rect x={x} y={y} width={bw} height={bh} rx={bw / 2} style={{ fill: on ? color.inv : color.raised2, stroke: on ? "none" : color.line2 }} />
          {on && <><rect x={x + bw / 2 - 24} y={y - 30} width={48} height={22} rx={6} style={{ fill: color.accent }} /><text x={x + bw / 2} y={y - 15} textAnchor="middle" style={{ fill: color.onAccent, fontWeight: 600, fontSize: 11 }}>{pre + k(v)}</text></>}
          {labels && <text x={x + bw / 2} y={height - 6} textAnchor="middle" style={{ fill: on ? color.fg : color.fg4 }}>{labels[i]}</text>}
        </g>; })}
    </svg>
  );
}
// #endregion

// #region ValueChart
/** Area line with a crosshair that follows the pointer; reports the hovered value. */
export function ValueChart({ data, labels, pre = "", width = 560, height = 170, onHover }: { data: number[]; labels?: string[]; pre?: string; width?: number; height?: number; onHover?: (v: number, i: number) => void }) {
  const id = useId().replace(/:/g, "");
  const [hi, setHi] = useState(Math.round(data.length * 0.68));
  const mx = Math.max(...data) * 1.1, mn = Math.min(...data) * 0.85, X = (i: number) => 6 + ((width - 12) * i) / (data.length - 1), Y = (v: number) => 8 + (height - 30) * (1 - (v - mn) / (mx - mn));
  const d = smooth(data.map((v, i) => [X(i), Y(v)] as [number, number])), base = `${d} L${X(data.length - 1)},${height - 22} L6,${height - 22} Z`;
  const bx = Math.min(width - 80, Math.max(0, X(hi) - 40)), by = Math.max(0, Y(data[hi]) - 36);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Value chart" {...stylex.props(ax.svg)}
      onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); const i = Math.max(0, Math.min(data.length - 1, Math.round((((e.clientX - r.left) / r.width) * width - 6) / (width - 12) * (data.length - 1)))); setHi(i); onHover?.(data[i], i); }}>
      <defs><Hatch id={`${id}h`} c={color.c1} /><linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={{ stopColor: color.c1, stopOpacity: 0.25 }} /><stop offset="1" style={{ stopColor: color.c1, stopOpacity: 0 }} /></linearGradient></defs>
      <path d={base} style={{ fill: `url(#${id}g)` }} /><path d={base} style={{ fill: `url(#${id}h)` }} />
      <path d={d} style={{ fill: "none", stroke: color.c1, strokeWidth: 2 }} />
      <line x1={X(hi)} x2={X(hi)} y1={0} y2={height - 22} style={{ stroke: color.line3, strokeDasharray: "3 3" }} />
      <circle cx={X(hi)} cy={Y(data[hi])} r={4.5} style={{ fill: color.surface, stroke: color.c1, strokeWidth: 2.2 }} />
      <g transform={`translate(${bx},${by})`}><rect width={80} height={24} rx={6} style={{ fill: color.inv }} /><text x={40} y={16} textAnchor="middle" style={{ fill: color.onInv, fontWeight: 600, fontSize: 11.5 }}>{pre + data[hi].toLocaleString()}</text></g>
      {labels?.map((l, i) => l && <text key={i} x={X(i)} y={height - 5} textAnchor={i === 0 ? "start" : "middle"} {...stylex.props(ax.label)}>{l}</text>)}
    </svg>
  );
}
// #endregion

// #region FunnelChart
export function FunnelChart({ steps, width = 600, rowHeight = 40 }: { steps: { label: string; value: number }[]; width?: number; rowHeight?: number }) {
  const gap = 22, h = steps.length * (rowHeight + gap) - gap, mx = steps[0].value;
  return (
    <svg viewBox={`0 0 ${width} ${h}`} role="img" aria-label="Funnel" {...stylex.props(ax.svg)}>
      {steps.map((s, i) => { const bw = Math.max(60, ((width - 200) * s.value) / mx), x = 150 + (width - 200 - bw) / 2, y = i * (rowHeight + gap);
        return <g key={s.label}>
          <text x={0} y={y + rowHeight / 2 + 4} style={{ fill: color.fg2, fontSize: 12.5 }}>{s.label}</text>
          <rect x={x} y={y} width={bw} height={rowHeight} rx={8} style={{ fill: color.c1, opacity: 1 - i * 0.16 }} />
          <text x={width} y={y + rowHeight / 2 + 4} textAnchor="end" style={{ fill: color.fg, fontWeight: 600, fontSize: 12.5 }}>{k(s.value)}</text>
          {i < steps.length - 1 && <text x={150 + (width - 200) / 2} y={y + rowHeight + gap / 2 + 4} textAnchor="middle" {...stylex.props(ax.label)}>↓ {Math.round((steps[i + 1].value / s.value) * 100)}%</text>}
        </g>; })}
    </svg>
  );
}
// #endregion

// #region ScatterChart
export function ScatterChart({ points, width = 600, height = 260 }: { points: { x: number; y: number; size?: number; color?: Series }[]; width?: number; height?: number }) {
  const pl = 34, pb = 24, pt = 10, pr = 10;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Scatter plot" {...stylex.props(ax.svg)}>
      <Axes w={width} h={height} pl={pl} pr={pr} pt={pt} pb={pb} max={100} />
      {[0, 25, 50, 75, 100].map((v) => <text key={v} x={pl + ((width - pl - pr) * v) / 100} y={height - 6} textAnchor="middle" {...stylex.props(ax.label)}>{v}</text>)}
      {points.map((p, i) => { const c = palette[p.color ?? "c1"]; return <circle key={i} cx={pl + ((width - pl - pr) * p.x) / 100} cy={pt + (height - pt - pb) * (1 - p.y / 100)} r={p.size ?? 5} style={{ fill: c, fillOpacity: 0.55, stroke: c }} />; })}
    </svg>
  );
}
// #endregion

// #region BulletChart
const bu = stylex.create({
  row: { display: "grid", gridTemplateColumns: "110px 1fr 56px", gap: 12, alignItems: "center", fontSize: 13 },
  rows: { display: "flex", flexDirection: "column", gap: 16, width: "100%" },
  label: { color: color.fg2 },
  track: { position: "relative", height: 22, borderRadius: 6, overflow: "hidden", backgroundColor: color.sunken, boxShadow: `inset 0 0 0 1px ${color.line}` },
  band: { position: "absolute", top: 0, bottom: 0, left: 0, backgroundColor: `color-mix(in srgb, ${color.fg} 7%, transparent)` },
  bar: { position: "absolute", left: 0, top: 7, height: 8, borderRadius: 4 },
  target: { position: "absolute", top: 3, bottom: 3, width: 2, borderRadius: 2, backgroundColor: color.fg },
  w: (p: number) => ({ width: `${p}%` }), at: (p: number) => ({ left: `${p}%` }), c: (c: string) => ({ backgroundColor: c }),
  v: { textAlign: "right", fontWeight: 600, fontVariantNumeric: "tabular-nums", color: color.fg },
});
/** Progress toward a target over poor / fair bands (percent values). */
export function BulletChart({ rows }: { rows: { label: string; value: number; target: number; bands?: [number, number] }[] }) {
  return (
    <div {...stylex.props(bu.rows)}>
      {rows.map((r) => (
        <div key={r.label} {...stylex.props(bu.row)}>
          <span {...stylex.props(bu.label)}>{r.label}</span>
          <div {...stylex.props(bu.track)}>
            {(r.bands ?? [50, 75]).map((b) => <span key={b} {...stylex.props(bu.band, bu.w(b))} />)}
            <span {...stylex.props(bu.bar, bu.w(r.value), bu.c(r.value >= r.target ? color.ok : color.accent))} />
            <span {...stylex.props(bu.target, bu.at(r.target))} />
          </div>
          <span {...stylex.props(bu.v)}>{r.value}%</span>
        </div>
      ))}
    </div>
  );
}
// #endregion

// #region ComboChart
export function ComboChart({ bars, line, labels, unit = "", width = 640, height = 240 }: { bars: number[]; line: number[]; labels?: string[]; unit?: string; width?: number; height?: number }) {
  const pl = 36, pr = 36, pt = 12, pb = 26, n = bars.length, bm = nice(Math.max(...bars) * 1.1), lm = nice(Math.max(...line) * 1.1), slot = (width - pl - pr) / n, bw = slot * 0.5;
  const pts = line.map((v, i) => [pl + slot * i + slot / 2, pt + (height - pt - pb) * (1 - v / lm)] as [number, number]);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Combo chart" {...stylex.props(ax.svg)}>
      <Axes w={width} h={height} pl={pl} pr={pr} pt={pt} pb={pb} max={bm} />
      {bars.map((v, i) => { const bh = ((height - pt - pb) * v) / bm; return <rect key={i} x={pl + slot * i + (slot - bw) / 2} y={height - pb - bh} width={bw} height={bh} rx={5} style={{ fill: color.c7 }} />; })}
      <path d={smooth(pts)} style={{ fill: "none", stroke: color.c1, strokeWidth: 2.2 }} />
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={3.2} style={{ fill: color.surface, stroke: color.c1, strokeWidth: 2 }} />)}
      {[0, 1, 2, 3, 4].map((i) => <text key={i} x={width - pr + 8} y={pt + ((height - pt - pb) * i) / 4 + 3.5} {...stylex.props(ax.label)}>{k(lm - (lm * i) / 4)}{unit}</text>)}
      {labels?.map((l, i) => <text key={i} x={pl + slot * i + slot / 2} y={height - 6} textAnchor="middle" {...stylex.props(ax.label)}>{l}</text>)}
    </svg>
  );
}
// #endregion

// #region RadarChart
export function RadarChart({ axes, series, size = 280 }: { axes: string[]; series: { data: number[]; color: Series }[]; size?: number }) {
  const c = size / 2, R = size * 0.36, n = axes.length, pt = (i: number, v: number) => { const a = -Math.PI / 2 + (2 * Math.PI * i) / n; return [c + R * v * Math.cos(a), c + R * v * Math.sin(a)]; };
  const poly = (vals: number[]) => vals.map((v, i) => pt(i, v).map(r1).join(",")).join(" ");
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} role="img" aria-label="Radar chart" {...stylex.props(ax.svg)} style={{ width: size, maxWidth: "100%" }}>
      {[0.25, 0.5, 0.75, 1].map((l) => <polygon key={l} points={poly(axes.map(() => l))} style={{ fill: "none", stroke: color.line2, strokeDasharray: l < 1 ? "2 4" : undefined }} />)}
      {axes.map((a, i) => { const p = pt(i, 1), q = pt(i, 1.17); return <g key={a}><line x1={c} y1={c} x2={p[0]} y2={p[1]} style={{ stroke: color.line }} /><text x={q[0]} y={q[1] + 4} textAnchor="middle" {...stylex.props(ax.label)}>{a}</text></g>; })}
      {series.map((s, j) => <polygon key={j} points={poly(s.data)} style={{ fill: palette[s.color], fillOpacity: 0.18, stroke: palette[s.color], strokeWidth: 1.8, strokeLinejoin: "round" }} />)}
    </svg>
  );
}
// #endregion
export type { XStyle };
