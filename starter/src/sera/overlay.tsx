/**
 * Overlay — layers above the page.
 * Popover · Dialog · AlertDialog · Drawer · BottomSheet · HoverCard · CommandPalette · Lightbox ·
 * Overlay · Popconfirm · Coachmark · useConfirm
 */
import * as stylex from "@stylexjs/stylex";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { color, font, motion, radius, shadow } from "./tokens.stylex";
import { Icon, type IconName } from "./icons";
import { Button, IconButton, MenuItem, MenuLabel } from "./action";
import { Kbd } from "./content";
import type { XStyle } from "./lib";

const fadeIn = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const popIn = stylex.keyframes({ from: { opacity: 0, transform: "scale(.96) translateY(-4px)" }, to: { opacity: 1, transform: "none" } });
const slideIn = stylex.keyframes({ from: { opacity: 0, transform: "translateX(24px)" }, to: { opacity: 1, transform: "none" } });
const riseIn = stylex.keyframes({ from: { opacity: 0, transform: "translateY(32px)" }, to: { opacity: 1, transform: "none" } });

// #region Popover
const pv = stylex.create({
  anchor: { position: "relative", display: "inline-flex" },
  panel: {
    position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 40, minWidth: 200,
    borderRadius: radius.xl, backgroundColor: color.raised, boxShadow: shadow.pop, color: color.fg,
    animationName: popIn, animationDuration: ".2s", animationTimingFunction: motion.spring, transformOrigin: "top left",
  },
  end: { left: "auto", right: 0, transformOrigin: "top right" },
  up: { top: "auto", bottom: "calc(100% + 8px)" },
  pad: { padding: 14 },
});
type PopoverCtx = { close: () => void };
const PopCtx = createContext<PopoverCtx>({ close: () => {} });
/** Call inside popover content to close it, e.g. from a Save button. */
export const usePopover = () => useContext(PopCtx);

export function Popover({ trigger, children, align = "start", side = "bottom", padded, closeOnClick, xstyle }: {
  trigger: ReactNode; children: ReactNode; align?: "start" | "end"; side?: "bottom" | "top";
  padded?: boolean; closeOnClick?: boolean; xstyle?: XStyle;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!open) return;
    const out = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", out); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("pointerdown", out); document.removeEventListener("keydown", esc); };
  }, [open]);
  return (
    <span ref={ref} {...stylex.props(pv.anchor)}>
      <span onClick={() => setOpen((o) => !o)} aria-expanded={open} style={{ display: "contents" }}>{trigger}</span>
      {open && (
        <PopCtx.Provider value={{ close: () => setOpen(false) }}>
          <div onClick={closeOnClick ? () => setOpen(false) : undefined}
            {...stylex.props(pv.panel, align === "end" && pv.end, side === "top" && pv.up, padded && pv.pad, xstyle)}>
            {children}
          </div>
        </PopCtx.Provider>
      )}
    </span>
  );
}
// #endregion

// #region Dialog
const dl = stylex.create({
  scrim: { position: "fixed", inset: 0, zIndex: 80, display: "grid", placeItems: "center", padding: 20, backgroundColor: color.scrim, animationName: fadeIn, animationDuration: ".2s" },
  box: { width: "min(440px, 100%)", borderRadius: radius.xxl, backgroundColor: color.raised, boxShadow: shadow.pop, overflow: "hidden", animationName: popIn, animationDuration: ".3s", animationTimingFunction: motion.spring },
  head: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, paddingTop: 18, paddingBottom: 4, paddingInline: 20 },
  title: { margin: 0, fontSize: 16.5, fontWeight: 600, letterSpacing: "-.01em", color: color.fg },
  desc: { marginTop: 4, marginBottom: 0, color: color.fg3, fontSize: 13.5 },
  body: { paddingBlock: 14, paddingInline: 20 },
  foot: { display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 12, paddingBottom: 16, paddingInline: 16 },
});
function useEsc(on: boolean, fn: () => void) {
  useEffect(() => {
    if (!on) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && fn();
    addEventListener("keydown", k); return () => removeEventListener("keydown", k);
  }, [on, fn]);
}
export function Dialog({ open, onClose, title, description, children, footer, dismissable = true, xstyle }: {
  open: boolean; onClose: () => void; title?: ReactNode; description?: ReactNode; children?: ReactNode;
  footer?: ReactNode; dismissable?: boolean; xstyle?: XStyle;
}) {
  useEsc(open && dismissable, onClose);
  if (!open) return null;
  return createPortal(
    <div {...stylex.props(dl.scrim)} onPointerDown={(e) => dismissable && e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" {...stylex.props(dl.box, xstyle)}>
        {(title || dismissable) && (
          <div {...stylex.props(dl.head)}>
            <div>{title && <h2 {...stylex.props(dl.title)}>{title}</h2>}{description && <p {...stylex.props(dl.desc)}>{description}</p>}</div>
            {dismissable && <IconButton icon="x" label="Close" size="sm" onClick={onClose} />}
          </div>
        )}
        {children && <div {...stylex.props(dl.body)}>{children}</div>}
        {footer && <div {...stylex.props(dl.foot)}>{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
// #endregion

// #region useConfirm
/** Imperative confirm: `const ok = await confirm({ title, confirm: "Delete" })`. Render {dialog} once. */
export function useConfirm() {
  const [req, setReq] = useState<null | { title: string; body?: string; confirm?: string; danger?: boolean; done: (v: boolean) => void }>(null);
  const confirm = (o: { title: string; body?: string; confirm?: string; danger?: boolean }) => new Promise<boolean>((done) => setReq({ ...o, done }));
  const end = (v: boolean) => { req?.done(v); setReq(null); };
  const dialog = (
    <Dialog open={!!req} onClose={() => end(false)} title={req?.title} description={req?.body}
      footer={<><Button variant="ghost" onClick={() => end(false)}>Cancel</Button><Button variant={req?.danger ? "danger" : "primary"} onClick={() => end(true)}>{req?.confirm ?? "OK"}</Button></>} />
  );
  return { confirm, dialog };
}
// #endregion

// #region AlertDialog
/** Blocking confirmation for destructive actions — the scrim and Esc do not dismiss it. */
export function AlertDialog({ open, title, description, confirmLabel = "Delete", onConfirm, onCancel }: {
  open: boolean; title: ReactNode; description?: ReactNode; confirmLabel?: string; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <Dialog open={open} onClose={onCancel} dismissable={false} title={title} description={description}
      footer={<><Button onClick={onCancel}>Cancel</Button><Button variant="danger" onClick={onConfirm}>{confirmLabel}</Button></>} />
  );
}
// #endregion

// #region Drawer
const dr = stylex.create({
  scrim: { position: "fixed", inset: 0, zIndex: 80, display: "flex", justifyContent: "flex-end", padding: 10, backgroundColor: color.scrim, animationName: fadeIn, animationDuration: ".2s" },
  panel: { width: "min(380px, 100%)", height: "100%", display: "flex", flexDirection: "column", borderRadius: radius.xl, backgroundColor: color.raised, boxShadow: shadow.pop, animationName: slideIn, animationDuration: ".35s", animationTimingFunction: motion.spring },
  head: { display: "flex", alignItems: "center", gap: 8, paddingBlock: 12, paddingInline: 16, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.line },
  title: { flexGrow: 1, fontWeight: 600 },
  body: { flexGrow: 1, overflowY: "auto", padding: 16 },
  foot: { display: "flex", justifyContent: "flex-end", gap: 8, padding: 12, borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: color.line },
});
export function Drawer({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: ReactNode; children: ReactNode; footer?: ReactNode }) {
  useEsc(open, onClose);
  if (!open) return null;
  return createPortal(
    <div {...stylex.props(dr.scrim)} onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside role="dialog" aria-modal="true" {...stylex.props(dr.panel)}>
        <div {...stylex.props(dr.head)}><span {...stylex.props(dr.title)}>{title}</span><IconButton icon="x" label="Close" size="sm" onClick={onClose} /></div>
        <div {...stylex.props(dr.body)}>{children}</div>
        {footer && <div {...stylex.props(dr.foot)}>{footer}</div>}
      </aside>
    </div>,
    document.body,
  );
}
// #endregion

// #region BottomSheet
const bs = stylex.create({
  scrim: { position: "fixed", inset: 0, zIndex: 80, display: "flex", alignItems: "flex-end", backgroundColor: color.scrim, animationName: fadeIn, animationDuration: ".2s" },
  sheet: { width: "100%", maxHeight: "85vh", overflowY: "auto", paddingTop: 10, paddingBottom: 22, paddingInline: 20, borderTopLeftRadius: radius.xxl, borderTopRightRadius: radius.xxl, backgroundColor: color.raised, boxShadow: shadow.pop, animationName: riseIn, animationDuration: ".4s", animationTimingFunction: motion.spring },
  grab: { width: 38, height: 5, borderRadius: radius.pill, backgroundColor: color.line3, marginTop: 0, marginBottom: 14, marginInline: "auto" },
});
export function BottomSheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  useEsc(open, onClose);
  if (!open) return null;
  return createPortal(
    <div {...stylex.props(bs.scrim)} onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" {...stylex.props(bs.sheet)}><div {...stylex.props(bs.grab)} />{children}</div>
    </div>,
    document.body,
  );
}
// #endregion

// #region HoverCard
const hc = stylex.create({
  wrap: { position: "relative", display: "inline-block" },
  card: { position: "absolute", left: 0, top: "calc(100% + 8px)", zIndex: 40, width: 260, padding: 14, borderRadius: radius.xl, backgroundColor: color.raised, boxShadow: shadow.pop, animationName: popIn, animationDuration: ".2s" },
});
export function HoverCard({ trigger, children }: { trigger: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const t = useRef(0);
  const show = () => { clearTimeout(t.current); t.current = window.setTimeout(() => setOpen(true), 250); };
  const hide = () => { clearTimeout(t.current); t.current = window.setTimeout(() => setOpen(false), 120); };
  return (
    <span {...stylex.props(hc.wrap)} onPointerEnter={show} onPointerLeave={hide} onFocus={show} onBlur={hide}>
      {trigger}{open && <span {...stylex.props(hc.card)}>{children}</span>}
    </span>
  );
}
// #endregion

// #region CommandPalette
const ck = stylex.create({
  box: { width: "min(560px, 100%)", borderRadius: radius.xxl, backgroundColor: color.raised, boxShadow: shadow.pop, overflow: "hidden" },
  q: { display: "flex", alignItems: "center", gap: 10, height: 52, paddingInline: 16, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.line, color: color.fg3 },
  input: { flexGrow: 1, minWidth: 0, borderWidth: 0, backgroundColor: "transparent", outline: "none", fontFamily: font.sans, fontSize: 15, color: color.fg },
  res: { padding: 6, maxHeight: 320, overflowY: "auto" },
  empty: { padding: 16, color: color.fg4, fontSize: 13.5 },
  scrim: { position: "fixed", inset: 0, zIndex: 80, display: "flex", justifyContent: "center", paddingTop: "12vh", paddingInline: 16, backgroundColor: color.scrim, animationName: fadeIn, animationDuration: ".15s" },
});
export type Command = { id: string; label: string; group?: string; icon?: IconName; shortcut?: string; run: () => void };
/** Inline command menu. Wrap in <CommandPalette> for the ⌘K overlay. */
export function CommandMenu({ commands, placeholder = "Type a command or search…", onRun }: { commands: Command[]; placeholder?: string; onRun?: () => void }) {
  const [q, setQ] = useState("");
  const list = commands.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()));
  const groups = [...new Set(list.map((c) => c.group ?? ""))];
  return (
    <div {...stylex.props(ck.box)}>
      <div {...stylex.props(ck.q)}><Icon name="search" size={18} /><input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} {...stylex.props(ck.input)} /><Kbd>Esc</Kbd></div>
      <div {...stylex.props(ck.res)}>
        {groups.map((g) => (
          <div key={g}>{g && <MenuLabel>{g}</MenuLabel>}
            {list.filter((c) => (c.group ?? "") === g).map((c) => <MenuItem key={c.id} icon={c.icon} shortcut={c.shortcut} onSelect={() => { c.run(); onRun?.(); }}>{c.label}</MenuItem>)}
          </div>
        ))}
        {list.length === 0 && <div {...stylex.props(ck.empty)}>No results for “{q}”</div>}
      </div>
    </div>
  );
}
/** ⌘K / Ctrl-K palette over the page. */
export function CommandPalette({ commands }: { commands: Command[] }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); }
      if (e.key === "Escape") setOpen(false);
    };
    addEventListener("keydown", k); return () => removeEventListener("keydown", k);
  }, []);
  if (!open) return null;
  return createPortal(
    <div {...stylex.props(ck.scrim)} onPointerDown={(e) => e.target === e.currentTarget && setOpen(false)}>
      <CommandMenu commands={commands} onRun={() => setOpen(false)} />
    </div>,
    document.body,
  );
}
// #endregion

// #region Lightbox
const lb = stylex.create({
  scrim: { position: "fixed", inset: 0, zIndex: 90, display: "grid", placeItems: "center", padding: 24, backgroundColor: "rgba(6,6,8,.82)", animationName: fadeIn, animationDuration: ".2s" },
  img: { maxWidth: "min(1000px, 100%)", maxHeight: "78vh", borderRadius: radius.xl, boxShadow: shadow.pop },
  bar: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 14, color: "#fff", fontSize: 13 },
});
export function Lightbox({ images, index, onIndex, onClose }: { images: string[]; index: number | null; onIndex: (i: number) => void; onClose: () => void }) {
  useEsc(index !== null, onClose);
  if (index === null) return null;
  return createPortal(
    <div {...stylex.props(lb.scrim)} onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <div>
        <img src={images[index]} alt="" {...stylex.props(lb.img)} />
        <div {...stylex.props(lb.bar)}>
          <IconButton icon="chev-left" label="Previous" variant="secondary" size="sm" onClick={() => onIndex((index - 1 + images.length) % images.length)} />
          <span>{index + 1} / {images.length}</span>
          <IconButton icon="chev-right" label="Next" variant="secondary" size="sm" onClick={() => onIndex((index + 1) % images.length)} />
          <IconButton icon="x" label="Close" variant="secondary" size="sm" onClick={onClose} />
        </div>
      </div>
    </div>,
    document.body,
  );
}
// #endregion

// #region Overlay
const ov = stylex.create({
  host: { position: "relative" },
  layer: { position: "absolute", inset: 0, zIndex: 5, display: "grid", placeItems: "center", borderRadius: "inherit", backgroundColor: color.scrim, color: "#fff", animationName: fadeIn, animationDuration: ".2s" },
});
/** Blocks its parent region (not the page) while `active`. */
export function Overlay({ active, children, content, xstyle }: { active: boolean; children: ReactNode; content?: ReactNode; xstyle?: XStyle }) {
  return <div {...stylex.props(ov.host, xstyle)}>{children}{active && <div {...stylex.props(ov.layer)}>{content}</div>}</div>;
}
// #endregion

// #region Popconfirm
const pc = stylex.create({ row: { display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13.5, width: 230 }, foot: { display: "flex", justifyContent: "flex-end", gap: 6, marginTop: 12 } });
function PopconfirmBody({ message, confirmLabel, onConfirm }: { message: ReactNode; confirmLabel: string; onConfirm: () => void }) {
  const { close } = usePopover();
  return (
    <>
      <div {...stylex.props(pc.row)}><Icon name="alert" />{message}</div>
      <div {...stylex.props(pc.foot)}><Button size="xs" variant="ghost" onClick={close}>No</Button><Button size="xs" variant="primary" onClick={() => { onConfirm(); close(); }}>{confirmLabel}</Button></div>
    </>
  );
}
export function Popconfirm({ trigger, message, confirmLabel = "Yes", onConfirm }: { trigger: ReactNode; message: ReactNode; confirmLabel?: string; onConfirm: () => void }) {
  return <Popover trigger={trigger} padded><PopconfirmBody message={message} confirmLabel={confirmLabel} onConfirm={onConfirm} /></Popover>;
}
// #endregion

// #region Coachmark
const co = stylex.create({
  box: { position: "relative", width: 260, padding: 14, borderRadius: radius.xl, backgroundColor: color.inv, color: color.onInv, boxShadow: shadow.pop },
  arrow: { position: "absolute", top: -6, left: 24, width: 12, height: 12, backgroundColor: color.inv, transform: "rotate(45deg)", borderRadius: 2 },
  title: { fontWeight: 600 },
  text: { marginTop: 4, marginBottom: 12, fontSize: 13, opacity: 0.75 },
  foot: { display: "flex", alignItems: "center", gap: 6 },
  step: { flexGrow: 1, fontSize: 12, opacity: 0.6 },
});
export function Coachmark({ title, children, step, total, onNext, onSkip }: { title: ReactNode; children: ReactNode; step: number; total: number; onNext: () => void; onSkip: () => void }) {
  return (
    <div role="dialog" {...stylex.props(co.box)}>
      <span {...stylex.props(co.arrow)} />
      <div {...stylex.props(co.title)}>{title}</div>
      <div {...stylex.props(co.text)}>{children}</div>
      <div {...stylex.props(co.foot)}><span {...stylex.props(co.step)}>{step} of {total}</span><Button size="xs" variant="ghost" onClick={onSkip}>Skip</Button><Button size="xs" variant="secondary" onClick={onNext}>Next</Button></div>
    </div>
  );
}
// #endregion
