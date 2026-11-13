/**
 * Action — things you press.
 * Button · IconButton · ButtonGroup · Link · ToggleButton · SegmentedControl · Toolbar ·
 * DropdownMenu · MenuItem · ContextMenu · MoreMenu · CopyButton · Tooltip
 */
import * as stylex from "@stylexjs/stylex";
import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { color, font, motion, radius, shadow } from "./tokens.stylex";
import { Icon, type IconName } from "./icons";
import { useControllable, type XStyle } from "./lib";
import { Popover } from "./overlay";

// #region Button
const press = stylex.keyframes({ from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } });
const btn = stylex.create({
  base: {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, flexShrink: 0,
    height: 32, paddingInline: 12, borderWidth: 0, borderRadius: radius.md, cursor: "pointer",
    fontFamily: font.sans, fontSize: 13.5, fontWeight: 500, lineHeight: 1, whiteSpace: "nowrap", textDecoration: "none",
    transitionProperty: "transform, background-color, box-shadow, color", transitionDuration: motion.fast,
    transitionTimingFunction: motion.spring,
    transform: { default: null, ":active": "scale(.96)" },
    outline: { default: "none", ":focus-visible": `2px solid ${color.accent}` }, outlineOffset: 2,
    ":disabled": { opacity: 0.42, pointerEvents: "none" },
  },
  primary: { backgroundColor: { default: color.inv, ":hover": color.inv2 }, color: color.onInv, boxShadow: shadow.bevelInv },
  accent: { backgroundColor: { default: color.accent, ":hover": color.accent2 }, color: color.onAccent, boxShadow: shadow.bevelFill },
  secondary: {
    backgroundColor: { default: color.raised, ":hover": color.raised2 }, color: color.fg,
    boxShadow: shadow.bevel,
  },
  outline: { backgroundColor: { default: "transparent", ":hover": color.hover }, color: color.fg, boxShadow: `inset 0 0 0 1px ${color.line2}` },
  ghost: { backgroundColor: { default: "transparent", ":hover": color.hover }, color: { default: color.fg2, ":hover": color.fg } },
  danger: { backgroundColor: { default: color.badSoft, ":hover": color.bad }, color: { default: color.bad, ":hover": "#fff" } },
  xs: { height: 24, paddingInline: 8, fontSize: 12, gap: 5, borderRadius: radius.sm },
  sm: { height: 28, paddingInline: 10, fontSize: 13, gap: 6, borderRadius: 7 },
  lg: { height: 40, paddingInline: 18, fontSize: 14.5, borderRadius: radius.lg },
  block: { width: "100%" },
  spin: { width: 14, height: 14, borderRadius: "50%", borderWidth: 2, borderStyle: "solid", borderColor: "currentColor", borderTopColor: "transparent", animationName: press, animationDuration: ".7s", animationIterationCount: "infinite", animationTimingFunction: "linear" },
});
export type ButtonVariant = "primary" | "accent" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "xs" | "sm" | "md" | "lg";
export type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant; size?: ButtonSize; icon?: IconName; iconEnd?: IconName;
  loading?: boolean; block?: boolean; xstyle?: XStyle;
};
const iconSize = (s: ButtonSize) => (s === "lg" ? 18 : s === "md" ? 16 : 14);

export function Button({ variant = "secondary", size = "md", icon, iconEnd, loading, block, xstyle, children, disabled, ...rest }: ButtonProps) {
  return (
    <button {...rest} disabled={disabled || loading}
      {...stylex.props(btn.base, btn[variant], size !== "md" && btn[size], block && btn.block, xstyle)}>
      {loading ? <span {...stylex.props(btn.spin)} /> : icon && <Icon name={icon} size={iconSize(size)} />}
      {children}
      {iconEnd && <Icon name={iconEnd} size={iconSize(size) - 2} />}
    </button>
  );
}
// #endregion

// #region IconButton
const ib = stylex.create({
  square: { width: 32, paddingInline: 0 },
  xs: { width: 24 }, sm: { width: 28 }, lg: { width: 40 },
});
export type IconButtonProps = Omit<ButtonProps, "icon" | "iconEnd" | "children"> & { icon: IconName; label: string };

/** Icon-only button. `label` is read by screen readers and shown as a tooltip. */
export function IconButton({ icon, label, variant = "ghost", size = "md", xstyle, ...rest }: IconButtonProps) {
  return (
    <Tooltip label={label}>
      <Button {...rest} aria-label={label} variant={variant} size={size} icon={icon}
        xstyle={[ib.square, size !== "md" && ib[size], xstyle]} />
    </Tooltip>
  );
}
// #endregion

// #region ButtonGroup
const bg = stylex.create({
  root: { display: "inline-flex", borderRadius: radius.md, backgroundColor: color.raised, boxShadow: `inset 0 0 0 1px ${color.line2}, ${shadow.lift}`, overflow: "hidden" },
});
/** Joins buttons that act on the same thing. Children should use variant="ghost". */
export function ButtonGroup({ children, xstyle }: { children: ReactNode; xstyle?: XStyle }) {
  return <div role="group" {...stylex.props(bg.root, xstyle)}>{children}</div>;
}
// #endregion

// #region Link
const ln = stylex.create({
  base: {
    color: color.fg, textDecorationLine: "underline", textUnderlineOffset: 3,
    textDecorationColor: { default: color.line3, ":hover": color.fg },
    transitionProperty: "text-decoration-color", transitionDuration: motion.fast,
  },
  muted: { color: color.fg3 },
  accent: { color: color.accent, textDecorationColor: { default: color.accentLine, ":hover": color.accent } },
  arrow: { display: "inline-flex", alignItems: "center", gap: 4, textDecorationLine: "none" },
});
export function Link({ tone, arrow, children, xstyle, ...rest }: ComponentProps<"a"> & { tone?: "muted" | "accent"; arrow?: IconName; xstyle?: XStyle }) {
  return (
    <a {...rest} {...stylex.props(ln.base, tone && ln[tone], arrow && ln.arrow, xstyle)}>
      {children}{arrow && <Icon name={arrow} size={14} />}
    </a>
  );
}
// #endregion

// #region ToggleButton
const tg = stylex.create({
  on: { backgroundColor: color.accentSoft, color: color.accent, boxShadow: `inset 0 0 0 1px ${color.accentLine}` },
});
export function ToggleButton({ pressed, defaultPressed = false, onPressedChange, ...rest }:
  Omit<ButtonProps, "onChange"> & { pressed?: boolean; defaultPressed?: boolean; onPressedChange?: (v: boolean) => void }) {
  const [on, setOn] = useControllable(pressed, defaultPressed, onPressedChange);
  return <Button variant="ghost" {...rest} aria-pressed={on} onClick={() => setOn(!on)} xstyle={[on && tg.on, rest.xstyle]} />;
}
// #endregion

// #region SegmentedControl
const sg = stylex.create({
  root: { display: "inline-flex", gap: 0, padding: 2, borderRadius: radius.pill, backgroundColor: color.sunken, boxShadow: `inset 0 0 0 1px ${color.line2}`, maxWidth: "100%", overflowX: "auto" },
  full: { display: "flex", width: "100%" },
  item: {
    flex: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
    height: 24, paddingInline: 11, borderWidth: 0, borderRadius: radius.pill, backgroundColor: "transparent",
    color: { default: color.fg3, ":hover": color.fg }, fontFamily: font.sans, fontSize: 12.5, fontWeight: 500, cursor: "pointer",
    transitionProperty: "background-color, color, transform", transitionDuration: motion.fast,
    transform: { default: null, ":active": "scale(.95)" },
  },
  grow: { flexGrow: 1 },
  sm: { height: 21, paddingInline: 9, fontSize: 12 },
  on: { backgroundColor: color.segOn, color: color.fg, boxShadow: `inset 0 0 0 1px ${color.line2}` },
});
export type SegmentOption = string | { value: string; label: ReactNode; icon?: IconName };
export function SegmentedControl({ options, value, defaultValue, onChange, size = "md", full, xstyle }: {
  options: SegmentOption[]; value?: string; defaultValue?: string; onChange?: (v: string) => void;
  size?: "sm" | "md"; full?: boolean; xstyle?: XStyle;
}) {
  const opts = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  const [cur, setCur] = useControllable(value, defaultValue ?? opts[0]?.value ?? "", onChange);
  return (
    <div role="radiogroup" {...stylex.props(sg.root, full && sg.full, xstyle)}>
      {opts.map((o) => (
        <button key={o.value} type="button" role="radio" aria-checked={cur === o.value} onClick={() => setCur(o.value)}
          {...stylex.props(sg.item, size === "sm" && sg.sm, full && sg.grow, cur === o.value && sg.on)}>
          {"icon" in o && o.icon && <Icon name={o.icon} size={14} />}{o.label}
        </button>
      ))}
    </div>
  );
}
// #endregion

// #region Toolbar
const tb = stylex.create({
  root: { display: "inline-flex", alignItems: "center", gap: 2, padding: 3, borderRadius: radius.lg, backgroundColor: color.raised, boxShadow: `inset 0 0 0 1px ${color.line2}, ${shadow.card}` },
  sep: { width: 1, height: 18, marginInline: 4, backgroundColor: color.line2 },
});
export function Toolbar({ children, xstyle }: { children: ReactNode; xstyle?: XStyle }) {
  return <div role="toolbar" {...stylex.props(tb.root, xstyle)}>{children}</div>;
}
export function ToolbarSeparator() { return <span role="separator" {...stylex.props(tb.sep)} />; }
// #endregion

// #region DropdownMenu
const mn = stylex.create({
  list: { display: "flex", flexDirection: "column", padding: 6, minWidth: 220 },
  item: {
    display: "flex", alignItems: "center", gap: 10, width: "100%", minHeight: 32, paddingBlock: 6, paddingInline: 10,
    borderWidth: 0, borderRadius: 7, backgroundColor: { default: "transparent", ":hover": color.hover },
    color: { default: color.fg2, ":hover": color.fg }, fontFamily: font.sans, fontSize: 13.5, textAlign: "left", cursor: "pointer",
  },
  danger: { color: { default: color.bad, ":hover": color.bad } },
  end: { marginLeft: "auto", display: "inline-flex", gap: 4, alignItems: "center", color: color.fg4, fontFamily: font.mono, fontSize: 11.5 },
  icon: { color: color.fg3, display: "inline-flex" },
  sep: { height: 1, marginBlock: 5, marginInline: 6, backgroundColor: color.line },
  label: { paddingTop: 8, paddingBottom: 4, paddingInline: 10, fontFamily: font.mono, fontSize: 10.5, fontWeight: 500, letterSpacing: ".07em", textTransform: "uppercase", color: color.fg4 },
  check: { color: color.accent },
});
export function MenuItem({ icon, shortcut, danger, checked, children, onSelect }: {
  icon?: IconName; shortcut?: ReactNode; danger?: boolean; checked?: boolean; children: ReactNode; onSelect?: () => void;
}) {
  return (
    <button type="button" role={checked === undefined ? "menuitem" : "menuitemcheckbox"} aria-checked={checked}
      onClick={onSelect} {...stylex.props(mn.item, danger && mn.danger)}>
      {icon && <span {...stylex.props(mn.icon, danger && mn.danger)}><Icon name={icon} /></span>}
      <span>{children}</span>
      {(shortcut || checked) && <span {...stylex.props(mn.end, checked && mn.check)}>{checked ? <Icon name="check" size={14} /> : shortcut}</span>}
    </button>
  );
}
export const MenuSeparator = () => <div role="separator" {...stylex.props(mn.sep)} />;
export const MenuLabel = ({ children }: { children: ReactNode }) => <div {...stylex.props(mn.label)}>{children}</div>;
export function MenuList({ children }: { children: ReactNode }) { return <div role="menu" {...stylex.props(mn.list)}>{children}</div>; }

/** A menu that opens from any trigger. Closes on select, outside click and Esc. */
export function DropdownMenu({ trigger, children, align = "start" }: { trigger: ReactNode; children: ReactNode; align?: "start" | "end" }) {
  return (
    <Popover trigger={trigger} align={align} closeOnClick>
      <MenuList>{children}</MenuList>
    </Popover>
  );
}
// #endregion

// #region ContextMenu
const cm = stylex.create({ area: { position: "relative" }, menu: { position: "fixed", zIndex: 50, borderRadius: radius.xl, backgroundColor: color.raised, boxShadow: shadow.pop } });
/** Right-click (or long press) inside `children` to open the menu at the pointer. */
export function ContextMenu({ menu, children, xstyle }: { menu: ReactNode; children: ReactNode; xstyle?: XStyle }) {
  const [at, setAt] = useState<{ x: number; y: number } | null>(null);
  useEffect(() => {
    if (!at) return;
    const close = () => setAt(null);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && close();
    addEventListener("click", close); addEventListener("keydown", esc);
    return () => { removeEventListener("click", close); removeEventListener("keydown", esc); };
  }, [at]);
  return (
    <div onContextMenu={(e) => { e.preventDefault(); setAt({ x: e.clientX, y: e.clientY }); }} {...stylex.props(cm.area, xstyle)}>
      {children}
      {at && <div style={{ left: at.x, top: at.y }} {...stylex.props(cm.menu)}><MenuList>{menu}</MenuList></div>}
    </div>
  );
}
// #endregion

// #region MoreMenu
export function MoreMenu({ children, vertical, label = "More" }: { children: ReactNode; vertical?: boolean; label?: string }) {
  return <DropdownMenu align="end" trigger={<IconButton icon={vertical ? "more-v" : "more"} label={label} size="sm" />}>{children}</DropdownMenu>;
}
// #endregion

// #region CopyButton
export function CopyButton({ value, label, size = "sm", variant = "ghost" }: { value: string; label?: string; size?: ButtonSize; variant?: ButtonVariant }) {
  const [done, setDone] = useState(false);
  const t = useRef<number>(0);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); } catch { /* clipboard blocked */ }
    setDone(true); clearTimeout(t.current); t.current = window.setTimeout(() => setDone(false), 1200);
  };
  if (label) return <Button size={size} variant={variant} icon={done ? "check" : "copy"} onClick={copy}>{done ? "Copied" : label}</Button>;
  return <IconButton size={size} variant={variant} icon={done ? "check" : "copy"} label={done ? "Copied" : "Copy"} onClick={copy} />;
}
// #endregion

// #region Tooltip
const tt = stylex.create({
  wrap: { position: "relative", display: "inline-flex" },
  tip: {
    position: "absolute", left: "50%", bottom: "calc(100% + 8px)", transform: "translateX(-50%)", zIndex: 60,
    paddingBlock: 6, paddingInline: 9, borderRadius: radius.sm, backgroundColor: color.inv, color: color.onInv,
    fontFamily: font.sans, fontSize: 12, fontWeight: 500, whiteSpace: "nowrap", pointerEvents: "none",
  },
  below: { bottom: "auto", top: "calc(100% + 8px)" },
});
/** Inverse label on hover and focus. Use `side="bottom"` near the top edge of a clipped container. */
export function Tooltip({ label, side = "top", children }: { label: ReactNode; side?: "top" | "bottom"; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <span {...stylex.props(tt.wrap)} onPointerEnter={() => setOpen(true)} onPointerLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}>
      {children}
      {open && <span role="tooltip" {...stylex.props(tt.tip, side === "bottom" && tt.below)}>{label}</span>}
    </span>
  );
}
// #endregion
