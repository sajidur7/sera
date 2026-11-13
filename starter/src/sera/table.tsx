/**
 * Table & list.
 * DataTable · Table (primitives) · SelectionToolbar · List · MetadataList · OverflowList · TreeList · Timeline
 */
import * as stylex from "@stylexjs/stylex";
import { useMemo, useState, type ReactNode } from "react";
import { color, font, radius, shadow } from "./tokens.stylex";
import { Icon, type IconName } from "./icons";
import { Button, IconButton } from "./action";
import { Popover } from "./overlay";
import { Checkbox } from "./forms";
import type { XStyle } from "./lib";

// #region Table
const tb = stylex.create({
  wrap: { width: "100%", overflow: "auto", borderRadius: radius.xl, backgroundColor: color.surface, boxShadow: `inset 0 0 0 1px ${color.line}, ${shadow.card}` },
  table: { width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 13.5, color: color.fg2 },
  th: { position: "sticky", top: 0, zIndex: 1, height: 40, paddingInline: 14, textAlign: "left", whiteSpace: "nowrap", fontWeight: 500, fontSize: 12.5, color: color.fg3, backgroundColor: color.well, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.line },
  td: { height: 52, paddingInline: 14, whiteSpace: "nowrap", borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.line },
  tr: { backgroundColor: { default: "transparent", ":hover": color.hover } },
  selected: { backgroundColor: color.accentSoft },
  num: { textAlign: "right", fontVariantNumeric: "tabular-nums" },
  dense: { height: 40 },
});
/** Table primitives, for when you want full control of the markup. */
export const TableWrap = ({ children, xstyle }: { children: ReactNode; xstyle?: XStyle }) => <div {...stylex.props(tb.wrap, xstyle)}><table {...stylex.props(tb.table)}>{children}</table></div>;
export const Th = ({ children, numeric, width }: { children?: ReactNode; numeric?: boolean; width?: number }) => <th style={{ width }} {...stylex.props(tb.th, numeric && tb.num)}>{children}</th>;
export const Td = ({ children, numeric, dense }: { children?: ReactNode; numeric?: boolean; dense?: boolean }) => <td {...stylex.props(tb.td, numeric && tb.num, dense && tb.dense)}>{children}</td>;
export const Tr = ({ children, selected }: { children: ReactNode; selected?: boolean }) => <tr aria-selected={selected} {...stylex.props(tb.tr, selected && tb.selected)}>{children}</tr>;
// #endregion

// #region DataTable
const dt = stylex.create({
  sort: { display: "inline-flex", alignItems: "center", gap: 4, padding: 0, borderWidth: 0, backgroundColor: "transparent", color: "inherit", fontFamily: "inherit", fontSize: "inherit", fontWeight: "inherit", cursor: "pointer" },
  host: { position: "relative" },
});
export type Column<T> = { key: keyof T & string; header: ReactNode; numeric?: boolean; sortable?: boolean; width?: number; render?: (row: T) => ReactNode };
/** Sortable, selectable table. Pass `selectionActions` to show the floating toolbar while rows are ticked. */
export function DataTable<T extends { id: string }>({ columns, rows, selectable, selectionActions, dense }: {
  columns: Column<T>[]; rows: T[]; selectable?: boolean; selectionActions?: (ids: string[], clear: () => void) => ReactNode; dense?: boolean;
}) {
  const [sel, setSel] = useState<string[]>([]);
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);
  const sorted = useMemo(() => !sort ? rows : [...rows].sort((a, b) => {
    const x = a[sort.key as keyof T], y = b[sort.key as keyof T];
    return (x > y ? 1 : x < y ? -1 : 0) * sort.dir;
  }), [rows, sort]);
  const all = sel.length === rows.length && rows.length > 0;
  return (
    <div {...stylex.props(dt.host)}>
      <TableWrap>
        <thead><tr>
          {selectable && <Th width={44}><Checkbox checked={all ? true : sel.length ? "mixed" : false} onChange={(v) => setSel(v ? rows.map((r) => r.id) : [])} /></Th>}
          {columns.map((c) => (
            <Th key={c.key} numeric={c.numeric} width={c.width}>
              {c.sortable ? <button type="button" {...stylex.props(dt.sort)} onClick={() => setSort((s) => ({ key: c.key, dir: s?.key === c.key && s.dir === 1 ? -1 : 1 }))}>
                {c.header}<Icon name={sort?.key === c.key ? (sort.dir === 1 ? "arrow-up" : "arrow-down") : "chevs"} size={12} /></button> : c.header}
            </Th>
          ))}
        </tr></thead>
        <tbody>
          {sorted.map((r) => (
            <Tr key={r.id} selected={sel.includes(r.id)}>
              {selectable && <Td dense={dense}><Checkbox checked={sel.includes(r.id)} onChange={(v) => setSel(v ? [...sel, r.id] : sel.filter((x) => x !== r.id))} /></Td>}
              {columns.map((c) => <Td key={c.key} numeric={c.numeric} dense={dense}>{c.render ? c.render(r) : String(r[c.key] ?? "")}</Td>)}
            </Tr>
          ))}
        </tbody>
      </TableWrap>
      {selectable && sel.length > 0 && selectionActions && <SelectionToolbar count={sel.length} onClear={() => setSel([])} floating>{selectionActions(sel, () => setSel([]))}</SelectionToolbar>}
    </div>
  );
}
// #endregion

// #region SelectionToolbar
const sb = stylex.create({
  bar: { display: "inline-flex", alignItems: "center", gap: 6, paddingBlock: 5, paddingLeft: 14, paddingRight: 5, borderRadius: radius.lg, backgroundColor: color.inv, color: color.onInv, boxShadow: shadow.pop, fontSize: 13 },
  floating: { position: "absolute", left: "50%", bottom: 16, transform: "translateX(-50%)", zIndex: 5 },
  sep: { width: 1, height: 18, backgroundColor: `color-mix(in srgb, ${color.onInv} 22%, transparent)` },
});
/** Inverse bar for bulk actions. Use Button variant="ghost" inside; it inherits the inverse ink. */
export function SelectionToolbar({ count, onClear, children, floating }: { count: number; onClear: () => void; children: ReactNode; floating?: boolean }) {
  return (
    <div role="toolbar" aria-label="Selection" {...stylex.props(sb.bar, floating && sb.floating)}>
      <b>{count}</b>&nbsp;selected<span {...stylex.props(sb.sep)} />{children}<span {...stylex.props(sb.sep)} />
      <IconButton icon="x" label="Clear selection" size="sm" onClick={onClear} />
    </div>
  );
}
// #endregion

// #region List
const ls = stylex.create({ root: { display: "flex", flexDirection: "column", width: "100%", borderRadius: radius.xl, backgroundColor: color.surface, boxShadow: `inset 0 0 0 1px ${color.line}` } });
/** A surface for ListRow children (see forms.tsx). */
export const List = ({ children, xstyle }: { children: ReactNode; xstyle?: XStyle }) => <div role="list" {...stylex.props(ls.root, xstyle)}>{children}</div>;
// #endregion

// #region MetadataList
const md = stylex.create({
  dl: { display: "grid", gridTemplateColumns: "minmax(110px, auto) 1fr", width: "100%", margin: 0, fontSize: 13.5 },
  dt: { paddingBlock: 10, paddingRight: 16, color: color.fg3, borderBottomWidth: 1, borderBottomStyle: "dashed", borderBottomColor: color.line2 },
  dd: { margin: 0, paddingBlock: 10, display: "flex", alignItems: "center", gap: 8, minWidth: 0, overflowWrap: "anywhere", color: color.fg, borderBottomWidth: 1, borderBottomStyle: "dashed", borderBottomColor: color.line2 },
});
export function MetadataList({ items }: { items: [ReactNode, ReactNode][] }) {
  return <dl {...stylex.props(md.dl)}>{items.map(([k, v], i) => <div key={i} style={{ display: "contents" }}><dt {...stylex.props(md.dt)}>{k}</dt><dd {...stylex.props(md.dd)}>{v}</dd></div>)}</dl>;
}
// #endregion

// #region OverflowList
const of = stylex.create({ row: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }, more: { padding: 10, display: "flex", gap: 6, flexWrap: "wrap", maxWidth: 240 } });
/** Shows `max` items and folds the rest into a “+N” popover. */
export function OverflowList({ items, max = 3 }: { items: ReactNode[]; max?: number }) {
  const rest = items.slice(max);
  return (
    <div {...stylex.props(of.row)}>
      {items.slice(0, max)}
      {rest.length > 0 && <Popover trigger={<Button size="xs" variant="outline">+{rest.length}</Button>}><div {...stylex.props(of.more)}>{rest}</div></Popover>}
    </div>
  );
}
// #endregion

// #region TreeList
const tr = stylex.create({
  node: { display: "flex", alignItems: "center", gap: 6, height: 30, width: "100%", paddingRight: 8, borderWidth: 0, borderRadius: radius.md, backgroundColor: { default: "transparent", ":hover": color.hover }, color: color.fg2, fontFamily: font.sans, fontSize: 13.5, textAlign: "left", cursor: "pointer" },
  sel: { backgroundColor: color.raised, color: color.fg, boxShadow: `inset 0 0 0 1px ${color.line}` },
  car: { color: color.fg4, display: "inline-flex", transitionProperty: "transform", transitionDuration: ".25s" },
  open: { transform: "rotate(90deg)" },
  spacer: { width: 14 },
  kids: { paddingLeft: 18, marginLeft: 13, borderLeftWidth: 1, borderLeftStyle: "dashed", borderLeftColor: color.line2 },
  grow: { flexGrow: 1 },
  meta: { fontSize: 12, color: color.fg4 },
});
export type TreeNode = { id: string; label: string; icon?: IconName; meta?: ReactNode; children?: TreeNode[] };
export function TreeList({ nodes, selected, onSelect, defaultOpen = [] }: { nodes: TreeNode[]; selected?: string; onSelect?: (id: string) => void; defaultOpen?: string[] }) {
  const [open, setOpen] = useState<string[]>(defaultOpen);
  const render = (n: TreeNode): ReactNode => {
    const isOpen = open.includes(n.id);
    return (
      <div key={n.id} role="treeitem" aria-expanded={n.children ? isOpen : undefined}>
        <button type="button" onClick={() => { onSelect?.(n.id); if (n.children) setOpen(isOpen ? open.filter((x) => x !== n.id) : [...open, n.id]); }} {...stylex.props(tr.node, selected === n.id && tr.sel)}>
          {n.children ? <span {...stylex.props(tr.car, isOpen && tr.open)}><Icon name="chev-right" size={14} /></span> : <span {...stylex.props(tr.spacer)} />}
          <Icon name={n.icon ?? (n.children ? "folder" : "file")} /><span {...stylex.props(tr.grow)}>{n.label}</span>{n.meta && <span {...stylex.props(tr.meta)}>{n.meta}</span>}
        </button>
        {n.children && isOpen && <div role="group" {...stylex.props(tr.kids)}>{n.children.map(render)}</div>}
      </div>
    );
  };
  return <div role="tree">{nodes.map(render)}</div>;
}
// #endregion

// #region Timeline
const tl = stylex.create({
  ev: { position: "relative", display: "grid", gridTemplateColumns: "28px 1fr", gap: 12, paddingBottom: 18 },
  line: { position: "absolute", left: 13.5, top: 30, bottom: 2, borderLeftWidth: 1, borderLeftStyle: "dashed", borderLeftColor: color.line3 },
  mk: { width: 28, height: 28, borderRadius: "50%", display: "grid", placeItems: "center", backgroundColor: color.raised, boxShadow: `inset 0 0 0 1px ${color.line2}`, color: color.fg3 },
  head: { display: "flex", gap: 8, alignItems: "baseline" },
  title: { flexGrow: 1, fontWeight: 500, color: color.fg },
  time: { fontSize: 12, color: color.fg4 },
  body: { marginTop: 2, marginBottom: 0, color: color.fg3, fontSize: 13 },
});
export function Timeline({ events }: { events: { icon: IconName; title: ReactNode; body?: ReactNode; time: ReactNode }[] }) {
  return (
    <div>
      {events.map((e, i) => (
        <div key={i} {...stylex.props(tl.ev)}>
          {i < events.length - 1 && <span {...stylex.props(tl.line)} />}
          <span {...stylex.props(tl.mk)}><Icon name={e.icon} size={14} /></span>
          <div><div {...stylex.props(tl.head)}><span {...stylex.props(tl.title)}>{e.title}</span><time {...stylex.props(tl.time)}>{e.time}</time></div>{e.body && <p {...stylex.props(tl.body)}>{e.body}</p>}</div>
        </div>
      ))}
    </div>
  );
}
// #endregion
