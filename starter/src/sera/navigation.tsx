/**
 * Navigation.
 * SideNav · NavItem · NavGroup · WorkspaceSwitcher · TopNav · MegaMenu · MobileTabBar · Breadcrumbs · Tabs ·
 * TabMenu · Pagination · Stepper · Outline · FilterMenu
 */
import * as stylex from "@stylexjs/stylex";
import { useState, type ReactNode } from "react";
import { color, font, motion, radius, shadow } from "./tokens.stylex";
import { Icon, type IconName } from "./icons";
import { Button, IconButton, MenuItem, MenuSeparator } from "./action";
import { Badge } from "./feedback";
import { InputGroup } from "./forms";
import { Popover } from "./overlay";
import { useControllable, type XStyle } from "./lib";

// #region SideNav
const sn = stylex.create({
  nav: { display: "flex", flexDirection: "column", gap: 1, width: "100%" },
  item: {
    display: "flex", alignItems: "center", gap: 10, height: 34, paddingInline: 10, borderWidth: 0, borderRadius: radius.md, width: "100%",
    backgroundColor: { default: "transparent", ":hover": color.hover }, color: { default: color.fg3, ":hover": color.fg },
    fontFamily: font.sans, fontSize: 13.5, textDecoration: "none", textAlign: "left", cursor: "pointer",
  },
  on: { backgroundColor: color.raised, color: color.fg, boxShadow: `inset 0 0 0 1px ${color.line2}` },
  icOn: { color: color.accent, display: "inline-flex" },
  end: { marginLeft: "auto", fontFamily: font.mono, fontSize: 11, color: color.fg4 },
  label: { paddingTop: 14, paddingBottom: 6, paddingInline: 10, fontFamily: font.mono, fontSize: 10.5, fontWeight: 500, letterSpacing: ".08em", textTransform: "uppercase", color: color.fg4 },
  dot: (c: string) => ({ width: 8, height: 8, borderRadius: 3, marginInline: 4, backgroundColor: c }),
  ws: { display: "flex", alignItems: "center", gap: 10, width: "100%", paddingBlock: 6, paddingInline: 6, borderWidth: 0, borderRadius: radius.md, backgroundColor: { default: "transparent", ":hover": color.hover }, color: color.fg, textAlign: "left", cursor: "pointer", fontFamily: font.sans },
  wsName: { display: "block", fontWeight: 600, fontSize: 13.5, lineHeight: 1.25 },
  wsSub: { display: "block", fontSize: 12, lineHeight: 1.3, color: color.fg3 },
  wsChev: { color: color.fg4, display: "inline-flex" },
  mark: { width: 30, height: 30, flex: "none", display: "grid", placeItems: "center", borderRadius: radius.md, color: "#fff", boxShadow: "inset 0 -1px 0 rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.22)" },
  markBg: (c: string) => ({ backgroundColor: c }),
  grow: { flexGrow: 1, minWidth: 0 },
});
export function SideNav({ children, xstyle }: { children: ReactNode; xstyle?: XStyle }) {
  return <nav {...stylex.props(sn.nav, xstyle)}>{children}</nav>;
}
export function NavItem({ icon, dot, label, count, current, href, onClick }: { icon?: IconName; dot?: string; label: ReactNode; count?: ReactNode; current?: boolean; href?: string; onClick?: () => void }) {
  return (
    <a href={href} onClick={onClick} aria-current={current ? "page" : undefined} {...stylex.props(sn.item, current && sn.on)}>
      {icon && <span {...stylex.props(current && sn.icOn)} style={{ display: "inline-flex" }}><Icon name={icon} /></span>}
      {dot && <span {...stylex.props(sn.dot(dot))} />}
      <span>{label}</span>{count != null && <span {...stylex.props(sn.end)}>{count}</span>}
    </a>
  );
}
export const NavGroup = ({ label, children }: { label: ReactNode; children: ReactNode }) => <><div {...stylex.props(sn.label)}>{label}</div>{children}</>;
/** Solid brand square with a white glyph — the workspace logo. */
export function BrandMark({ icon = "grid", tint = color.accent }: { icon?: IconName; tint?: string }) {
  return <span {...stylex.props(sn.mark, sn.markBg(tint))}><Icon name={icon} size={16} /></span>;
}
/** Flat workspace switcher: brand mark, name, handle. No container — it sits on the rail. */
export function WorkspaceSwitcher({ logo, name, handle, onClick }: { logo?: ReactNode; name: string; handle?: string; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} {...stylex.props(sn.ws)}>
      {logo ?? <BrandMark />}
      <span {...stylex.props(sn.grow)}><span {...stylex.props(sn.wsName)}>{name}</span>{handle && <span {...stylex.props(sn.wsSub)}>{handle}</span>}</span>
      <span {...stylex.props(sn.wsChev)}><Icon name="chevs" size={14} /></span>
    </button>
  );
}
// #endregion

// #region TopNav
const tn = stylex.create({
  bar: { display: "flex", alignItems: "center", gap: 14, width: "100%", height: 56, paddingLeft: 16, paddingRight: 10, borderRadius: radius.xl, backgroundColor: color.surface, boxShadow: `inset 0 0 0 1px ${color.line}, ${shadow.card}`, minWidth: 0 },
  links: { display: "flex", gap: 2, minWidth: 0, overflowX: "auto", scrollbarWidth: "none" },
  link: { display: "inline-flex", alignItems: "center", gap: 4, height: 32, paddingInline: 12, borderRadius: radius.md, textDecoration: "none", whiteSpace: "nowrap", fontSize: 13.5, color: { default: color.fg3, ":hover": color.fg }, backgroundColor: { default: "transparent", ":hover": color.hover } },
  on: { color: color.fg, backgroundColor: color.sunken, boxShadow: `inset 0 0 0 1px ${color.line}` },
  grow: { flexGrow: 1 },
});
export function TopNav({ brand, links, current, end }: { brand: ReactNode; links: { label: string; href: string }[]; current?: string; end?: ReactNode }) {
  return (
    <header {...stylex.props(tn.bar)}>
      {brand}
      <nav {...stylex.props(tn.links)}>{links.map((l) => <a key={l.href} href={l.href} aria-current={l.label === current ? "page" : undefined} {...stylex.props(tn.link, l.label === current && tn.on)}>{l.label}</a>)}</nav>
      <span {...stylex.props(tn.grow)} />{end}
    </header>
  );
}
// #endregion

// #region MegaMenu
const mm = stylex.create({
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 4, padding: 10, width: "min(660px, 92vw)" },
  item: { display: "flex", alignItems: "flex-start", gap: 10, padding: 10, borderRadius: radius.md, textDecoration: "none", backgroundColor: { default: "transparent", ":hover": color.hover } },
  ic: { width: 28, height: 28, flex: "none", display: "grid", placeItems: "center", borderRadius: radius.md, backgroundColor: color.accentSoft, color: color.accent },
  t: { display: "block", fontWeight: 500, color: color.fg, fontSize: 13.5 },
  d: { display: "block", fontSize: 12.5, color: color.fg3 },
  trigger: { display: "inline-flex", alignItems: "center", gap: 4, height: 32, paddingInline: 12, borderWidth: 0, borderRadius: radius.md, backgroundColor: { default: "transparent", ":hover": color.hover }, color: color.fg, fontFamily: font.sans, fontSize: 13.5, cursor: "pointer" },
});
export function MegaMenu({ label, items }: { label: string; items: { icon: IconName; title: string; description: string; href: string }[] }) {
  return (
    <Popover trigger={<button type="button" {...stylex.props(mm.trigger)}>{label}<Icon name="chev-down" size={12} /></button>}>
      <div {...stylex.props(mm.grid)}>{items.map((i) => <a key={i.title} href={i.href} {...stylex.props(mm.item)}><span {...stylex.props(mm.ic)}><Icon name={i.icon} size={14} /></span><span><span {...stylex.props(mm.t)}>{i.title}</span><span {...stylex.props(mm.d)}>{i.description}</span></span></a>)}</div>
    </Popover>
  );
}
// #endregion

// #region MobileTabBar
const mt = stylex.create({
  bar: { display: "flex", justifyContent: "space-around", alignItems: "center", paddingTop: 10, paddingBottom: "calc(10px + env(safe-area-inset-bottom, 0px))", paddingInline: 8, backgroundColor: color.panel, borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: color.line },
  tab: { display: "flex", flexDirection: "column", alignItems: "center", gap: 3, borderWidth: 0, backgroundColor: "transparent", color: color.fg4, fontSize: 10.5, fontFamily: font.sans, cursor: "pointer" },
  on: { color: color.fg },
  fab: { marginTop: -24 },
});
export function MobileTabBar({ tabs, current, onChange, action }: { tabs: { id: string; icon: IconName; label: string }[]; current: string; onChange: (id: string) => void; action?: { icon: IconName; label: string; onClick: () => void } }) {
  const half = Math.ceil(tabs.length / 2);
  const tab = (t: (typeof tabs)[number]) => <button key={t.id} type="button" aria-current={t.id === current ? "page" : undefined} onClick={() => onChange(t.id)} {...stylex.props(mt.tab, t.id === current && mt.on)}><Icon name={t.icon} size={20} />{t.label}</button>;
  return (
    <nav {...stylex.props(mt.bar)}>
      {tabs.slice(0, half).map(tab)}
      {action && <span {...stylex.props(mt.fab)}><IconButton icon={action.icon} label={action.label} variant="primary" size="lg" onClick={action.onClick} /></span>}
      {tabs.slice(half).map(tab)}
    </nav>
  );
}
// #endregion

// #region Breadcrumbs
const bc = stylex.create({
  row: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", fontSize: 13.5, color: color.fg3 },
  a: { color: { default: color.fg3, ":hover": color.fg }, textDecoration: "none" },
  cur: { color: color.fg, fontWeight: 500 },
  sep: { color: color.fg4, display: "inline-flex" },
});
export function Breadcrumbs({ items }: { items: { label: ReactNode; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" {...stylex.props(bc.row)}>
      {items.map((it, i) => (
        <span key={i} {...stylex.props(bc.row)}>
          {i > 0 && <span {...stylex.props(bc.sep)}><Icon name="chev-right" size={13} /></span>}
          {i === items.length - 1 ? <span aria-current="page" {...stylex.props(bc.cur)}>{it.label}</span> : <a href={it.href} {...stylex.props(bc.a)}>{it.label}</a>}
        </span>
      ))}
    </nav>
  );
}
// #endregion

// #region Tabs
const tb = stylex.create({
  list: { display: "flex", gap: 20, width: "100%", overflowX: "auto", scrollbarWidth: "none", borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.line },
  tab: { position: "relative", display: "inline-flex", alignItems: "center", gap: 6, height: 40, padding: 0, borderWidth: 0, backgroundColor: "transparent", color: { default: color.fg3, ":hover": color.fg }, fontFamily: font.sans, fontSize: 13.5, fontWeight: 500, whiteSpace: "nowrap", cursor: "pointer" },
  on: { color: color.fg, boxShadow: `inset 0 -2px 0 ${color.fg}` },
  panel: { paddingTop: 16 },
});
export type TabItem = { id: string; label: ReactNode; count?: number; content?: ReactNode };
export function Tabs({ tabs, value, defaultValue, onChange, end }: { tabs: TabItem[]; value?: string; defaultValue?: string; onChange?: (id: string) => void; end?: ReactNode }) {
  const [cur, setCur] = useControllable(value, defaultValue ?? tabs[0]?.id ?? "", onChange);
  const active = tabs.find((t) => t.id === cur);
  return (
    <div>
      <div role="tablist" {...stylex.props(tb.list)}>
        {tabs.map((t) => <button key={t.id} type="button" role="tab" aria-selected={t.id === cur} onClick={() => setCur(t.id)} {...stylex.props(tb.tab, t.id === cur && tb.on)}>{t.label}{t.count != null && <Badge count={t.count} tone="muted" />}</button>)}
        {end}
      </div>
      {active?.content && <div role="tabpanel" {...stylex.props(tb.panel)}>{active.content}</div>}
    </div>
  );
}
// #endregion

// #region TabMenu
/** Tabs that fold the overflow into a “More” menu. */
export function TabMenu({ tabs, visible = 4, value, onChange }: { tabs: TabItem[]; visible?: number; value: string; onChange: (id: string) => void }) {
  const rest = tabs.slice(visible);
  return (
    <Tabs tabs={tabs.slice(0, visible)} value={value} onChange={onChange}
      end={rest.length > 0 && <span style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}><Popover align="end" closeOnClick trigger={<Button variant="ghost" size="sm" iconEnd="chev-down">More</Button>}><div style={{ padding: 6 }}>{rest.map((t) => <MenuItem key={t.id} onSelect={() => onChange(t.id)}>{t.label}</MenuItem>)}</div></Popover></span>} />
  );
}
// #endregion

// #region Pagination
const pg = stylex.create({
  row: { display: "flex", alignItems: "center", gap: 3 },
  n: { minWidth: 32, height: 32, paddingInline: 6, borderWidth: 0, borderRadius: radius.md, backgroundColor: { default: "transparent", ":hover": color.hover }, color: { default: color.fg3, ":hover": color.fg }, fontFamily: font.sans, fontVariantNumeric: "tabular-nums", cursor: "pointer" },
  on: { backgroundColor: color.raised, color: color.fg, boxShadow: `inset 0 0 0 1px ${color.line2}` },
  gap: { color: color.fg4, paddingInline: 4 },
});
const pages = (cur: number, total: number) => {
  const set = new Set([1, total, cur - 1, cur, cur + 1].filter((p) => p >= 1 && p <= total));
  const out: (number | "…")[] = []; let prev = 0;
  [...set].sort((a, b) => a - b).forEach((p) => { if (p - prev > 1) out.push("…"); out.push(p); prev = p; });
  return out;
};
export function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  return (
    <nav aria-label="Pagination" {...stylex.props(pg.row)}>
      <IconButton icon="chev-left" label="Previous page" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)} />
      {pages(page, total).map((p, i) => p === "…" ? <span key={`g${i}`} {...stylex.props(pg.gap)}>…</span> :
        <button key={p} type="button" aria-current={p === page ? "page" : undefined} onClick={() => onChange(p)} {...stylex.props(pg.n, p === page && pg.on)}>{p}</button>)}
      <IconButton icon="chev-right" label="Next page" size="sm" disabled={page >= total} onClick={() => onChange(page + 1)} />
    </nav>
  );
}
// #endregion

// #region Stepper
const sr = stylex.create({
  row: { display: "flex", alignItems: "center", gap: 10, width: "100%", flexWrap: "wrap" },
  step: { display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: color.fg3, whiteSpace: "nowrap" },
  cur: { color: color.fg },
  n: { width: 24, height: 24, flex: "none", borderRadius: "50%", display: "grid", placeItems: "center", fontSize: 11.5, fontWeight: 600, backgroundColor: color.sunken, boxShadow: `inset 0 0 0 1px ${color.line2}` },
  nDone: { backgroundColor: color.inv, color: color.onInv, boxShadow: "none" },
  nCur: { boxShadow: `inset 0 0 0 1.5px ${color.accent}`, color: color.accent, backgroundColor: color.accentSoft },
  line: { flexGrow: 1, minWidth: 16, borderTopWidth: 1, borderTopStyle: "dashed", borderTopColor: color.line3 },
  lineDone: { borderTopStyle: "solid", borderTopColor: color.fg3 },
});
export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol {...stylex.props(sr.row)} style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {steps.map((s, i) => (
        <li key={s} {...stylex.props(sr.row)} style={{ width: i < steps.length - 1 ? undefined : "auto", flex: i < steps.length - 1 ? 1 : "none" }}>
          <span aria-current={i === current ? "step" : undefined} {...stylex.props(sr.step, i === current && sr.cur)}>
            <span {...stylex.props(sr.n, i < current && sr.nDone, i === current && sr.nCur)}>{i < current ? <Icon name="check" size={12} /> : i + 1}</span>{s}
          </span>
          {i < steps.length - 1 && <span {...stylex.props(sr.line, i < current && sr.lineDone)} />}
        </li>
      ))}
    </ol>
  );
}
// #endregion

// #region Outline
const ol = stylex.create({
  root: { display: "flex", flexDirection: "column", gap: 2, borderLeftWidth: 1, borderLeftStyle: "solid", borderLeftColor: color.line, fontSize: 13 },
  a: { paddingBlock: 4, paddingInline: 12, marginLeft: -1, borderLeftWidth: 1, borderLeftStyle: "solid", borderLeftColor: "transparent", color: { default: color.fg3, ":hover": color.fg }, textDecoration: "none", transitionProperty: "color", transitionDuration: motion.fast },
  nested: { paddingLeft: 24 },
  on: { color: color.fg, borderLeftColor: color.fg },
});
export function Outline({ items, current }: { items: { id: string; label: string; level?: 1 | 2 }[]; current?: string }) {
  return <nav aria-label="On this page" {...stylex.props(ol.root)}>{items.map((i) => <a key={i.id} href={`#${i.id}`} aria-current={i.id === current ? "true" : undefined} {...stylex.props(ol.a, i.level === 2 && ol.nested, i.id === current && ol.on)}>{i.label}</a>)}</nav>;
}
// #endregion

// #region FilterMenu
const fm = stylex.create({ panel: { width: 260, padding: 6 }, search: { padding: 4 }, foot: { display: "flex", justifyContent: "space-between", padding: 4 } });
export function FilterMenu({ label = "Filter", options, value, onChange }: { label?: string; options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  const [q, setQ] = useState("");
  return (
    <Popover trigger={<Button icon="filter">{label}{value.length > 0 && <Badge count={value.length} />}</Button>}>
      <div {...stylex.props(fm.panel)}>
        <div {...stylex.props(fm.search)}><InputGroup icon="search" placeholder={`Filter ${label.toLowerCase()}`} value={q} onChange={(e) => setQ(e.target.value)} /></div>
        {options.filter((o) => o.toLowerCase().includes(q.toLowerCase())).map((o) => <MenuItem key={o} checked={value.includes(o)} onSelect={() => onChange(value.includes(o) ? value.filter((x) => x !== o) : [...value, o])}>{o}</MenuItem>)}
        <MenuSeparator />
        <div {...stylex.props(fm.foot)}><Button size="xs" variant="ghost" onClick={() => onChange([])}>Clear</Button></div>
      </div>
    </Popover>
  );
}
// #endregion
