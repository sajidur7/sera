/**
 * Containers — surfaces that hold other things.
 * Card · Bezel · ClickableCard · SelectableCard · Collapsible · Accordion · Carousel
 */
import * as stylex from "@stylexjs/stylex";
import { useRef, useState, type ComponentProps, type ReactNode } from "react";
import { color, font, motion, radius, shadow } from "./tokens.stylex";
import { Icon } from "./icons";
import { IconButton } from "./action";
import { useControllable, type XStyle } from "./lib";

// #region Card
const cd = stylex.create({
  root: { minWidth: 0, display: "flex", flexDirection: "column", borderRadius: radius.xl, backgroundColor: color.surface, boxShadow: `inset 0 0 0 1px ${color.line}, ${shadow.card}`, color: color.fg },
  pad: { padding: 18 },
  head: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, paddingBlock: 12, paddingInline: 16, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.line },
  title: { margin: 0, fontSize: 14, fontWeight: 600 },
  sub: { color: color.fg3, fontWeight: 400, marginLeft: 6 },
  body: { padding: 16, flexGrow: 1, minHeight: 0 },
  foot: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, marginTop: "auto", paddingBlock: 12, paddingInline: 14, borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: color.line },
});
/** Default surface. Use title/actions/footer for slots, or `padded` for plain content. */
export function Card({ title, subtitle, actions, footer, padded, children, xstyle }: {
  title?: ReactNode; subtitle?: ReactNode; actions?: ReactNode; footer?: ReactNode; padded?: boolean; children?: ReactNode; xstyle?: XStyle;
}) {
  const slots = title || actions || footer;
  return (
    <section {...stylex.props(cd.root, padded && !slots && cd.pad, xstyle)}>
      {(title || actions) && <header {...stylex.props(cd.head)}><h3 {...stylex.props(cd.title)}>{title}{subtitle && <span {...stylex.props(cd.sub)}>· {subtitle}</span>}</h3>{actions}</header>}
      {slots ? <div {...stylex.props(cd.body)}>{children}</div> : children}
      {footer && <footer {...stylex.props(cd.foot)}>{footer}</footer>}
    </section>
  );
}
// #endregion

// #region Bezel
const bz = stylex.create({
  root: { minWidth: 0, padding: 4, borderRadius: radius.xl, backgroundColor: color.sunken, boxShadow: `inset 0 0 0 1px ${color.line}` },
  head: { display: "flex", alignItems: "center", gap: 8, paddingTop: 6, paddingBottom: 8, paddingInline: 10, fontFamily: font.mono, fontSize: 10.5, fontWeight: 500, letterSpacing: ".07em", textTransform: "uppercase", color: color.fg3 },
  end: { marginLeft: "auto", fontFamily: font.sans, fontSize: 12, letterSpacing: 0, textTransform: "none" },
  inner: { padding: 14, borderRadius: 9, backgroundColor: color.surface, boxShadow: `inset 0 0 0 1px ${color.line}, ${shadow.card}` },
  foot: { display: "flex", alignItems: "center", gap: 8, paddingTop: 8, paddingBottom: 4, paddingInline: 6 },
});
/** A sunken frame with a mono caption around one surface. */
export function Bezel({ label, end, footer, children, xstyle }: { label: ReactNode; end?: ReactNode; footer?: ReactNode; children: ReactNode; xstyle?: XStyle }) {
  return (
    <div {...stylex.props(bz.root, xstyle)}>
      <div {...stylex.props(bz.head)}>{label}{end && <span {...stylex.props(bz.end)}>{end}</span>}</div>
      <div {...stylex.props(bz.inner)}>{children}</div>
      {footer && <div {...stylex.props(bz.foot)}>{footer}</div>}
    </div>
  );
}
// #endregion

// #region ClickableCard
const cc = stylex.create({
  root: {
    display: "block", padding: 18, textDecoration: "none", color: color.fg, borderRadius: radius.xl, backgroundColor: color.surface,
    boxShadow: { default: `inset 0 0 0 1px ${color.line}, ${shadow.card}`, ":hover": `inset 0 0 0 1px ${color.line3}, ${shadow.card}` },
    transform: { default: null, ":hover": "translateY(-2px)" },
    transitionProperty: "box-shadow, transform", transitionDuration: ".3s", transitionTimingFunction: motion.spring,
    outline: { default: "none", ":focus-visible": `2px solid ${color.accent}` }, outlineOffset: 2,
  },
});
/** The whole card is the link. */
export function ClickableCard({ xstyle, ...rest }: ComponentProps<"a"> & { xstyle?: XStyle }) {
  return <a {...rest} {...stylex.props(cc.root, xstyle)} />;
}
// #endregion

// #region SelectableCard
const sc = stylex.create({
  root: {
    position: "relative", display: "block", width: "100%", padding: 18, borderWidth: 0, textAlign: "left", cursor: "pointer",
    borderRadius: radius.xl, backgroundColor: color.surface, color: color.fg, fontFamily: font.sans,
    boxShadow: `inset 0 0 0 1px ${color.line}, ${shadow.card}`, transitionProperty: "box-shadow", transitionDuration: motion.fast,
  },
  on: { boxShadow: `inset 0 0 0 1.5px ${color.accent}, 0 0 0 4px ${color.accentSoft}` },
  tick: { position: "absolute", top: 12, right: 12, width: 18, height: 18, borderRadius: "50%", display: "grid", placeItems: "center", boxShadow: `inset 0 0 0 1px ${color.line3}`, color: color.onAccent },
  tickOn: { backgroundColor: color.accent, boxShadow: "none" },
});
/** Acts like a radio (role="radio") or checkbox (multiple). Group radios with role="radiogroup". */
export function SelectableCard({ selected, onSelect, multiple, children, xstyle }: { selected: boolean; onSelect: () => void; multiple?: boolean; children: ReactNode; xstyle?: XStyle }) {
  return (
    <button type="button" role={multiple ? "checkbox" : "radio"} aria-checked={selected} onClick={onSelect} {...stylex.props(sc.root, selected && sc.on, xstyle)}>
      <span {...stylex.props(sc.tick, selected && sc.tickOn)}>{selected && <Icon name="check" size={11} />}</span>
      {children}
    </button>
  );
}
// #endregion

// #region Collapsible
const cl = stylex.create({
  trigger: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, width: "100%", paddingBlock: 14, paddingInline: 16, borderWidth: 0, backgroundColor: "transparent", color: color.fg, fontFamily: font.sans, fontSize: 14, fontWeight: 500, textAlign: "left", cursor: "pointer" },
  chev: { color: color.fg3, transitionProperty: "transform", transitionDuration: ".3s", transitionTimingFunction: motion.spring, display: "inline-flex" },
  open: { transform: "rotate(45deg)" },
  flip: { transform: "rotate(180deg)" },
  body: { paddingTop: 0, paddingBottom: 16, paddingInline: 16, color: color.fg3, fontSize: 13.5 },
});
export function Collapsible({ title, open, defaultOpen = false, onOpenChange, children, icon = "chev" }: {
  title: ReactNode; open?: boolean; defaultOpen?: boolean; onOpenChange?: (o: boolean) => void; children: ReactNode; icon?: "chev" | "plus";
}) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  return (
    <div>
      <button type="button" aria-expanded={isOpen} onClick={() => setOpen(!isOpen)} {...stylex.props(cl.trigger)}>
        {title}<span {...stylex.props(cl.chev, isOpen && (icon === "plus" ? cl.open : cl.flip))}><Icon name={icon === "plus" ? "plus" : "chev-down"} /></span>
      </button>
      {isOpen && <div {...stylex.props(cl.body)}>{children}</div>}
    </div>
  );
}
// #endregion

// #region Accordion
const ac = stylex.create({
  root: { width: "100%", borderRadius: radius.xl, backgroundColor: color.surface, boxShadow: `inset 0 0 0 1px ${color.line}` },
  item: { borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: color.line },
  first: { borderTopWidth: 0 },
});
/** A stack of collapsibles. `single` keeps one open at a time. */
export function Accordion({ items, single = true, defaultOpen = 0 }: { items: { title: ReactNode; content: ReactNode }[]; single?: boolean; defaultOpen?: number }) {
  const [open, setOpen] = useState<number[]>(defaultOpen >= 0 ? [defaultOpen] : []);
  const toggle = (i: number, o: boolean) => setOpen((cur) => (o ? (single ? [i] : [...cur, i]) : cur.filter((x) => x !== i)));
  return (
    <div {...stylex.props(ac.root)}>
      {items.map((it, i) => (
        <div key={i} {...stylex.props(ac.item, i === 0 && ac.first)}>
          <Collapsible icon="plus" title={it.title} open={open.includes(i)} onOpenChange={(o) => toggle(i, o)}>{it.content}</Collapsible>
        </div>
      ))}
    </div>
  );
}
// #endregion

// #region Carousel
const cr = stylex.create({
  track: { display: "flex", gap: 12, overflowX: "auto", scrollSnapType: "x mandatory", scrollbarWidth: "none", padding: 6, margin: -6 },
  slide: { flex: "none", scrollSnapAlign: "start" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, color: color.fg3, fontSize: 12.5 },
  btns: { display: "flex", gap: 6 },
});
export function Carousel({ children, caption }: { children: ReactNode[]; caption?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const go = (d: number) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <div>
      <div ref={ref} {...stylex.props(cr.track)}>{children.map((c, i) => <div key={i} {...stylex.props(cr.slide)}>{c}</div>)}</div>
      <div {...stylex.props(cr.nav)}><span>{caption}</span><div {...stylex.props(cr.btns)}><IconButton icon="chev-left" label="Previous" variant="secondary" size="sm" onClick={() => go(-1)} /><IconButton icon="chev-right" label="Next" variant="secondary" size="sm" onClick={() => go(1)} /></div></div>
    </div>
  );
}
// #endregion
