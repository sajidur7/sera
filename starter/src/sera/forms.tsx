/**
 * Form controls.
 * Field · Input · InputGroup · NumberInput · TextArea · Checkbox · Radio · RadioGroup · Switch · Slider · SliderBar ·
 * Select · Combobox · ComplexSelect · Typeahead · Tokenizer · FilterChip · Calendar · DateInput · DateRangeInput ·
 * DateTimeInput · TimeInput · FileInput · OTPInput · Rating · ColorPicker · Transfer · Cascader · InlineEdit ·
 * RichTextEditor · ListRow · SettingRow
 */
import * as stylex from "@stylexjs/stylex";
import { useId, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { color, font, motion, radius, shadow } from "./tokens.stylex";
import { Icon, type IconName } from "./icons";
import { Button, IconButton, MenuItem, MenuLabel, ToggleButton, Toolbar, ToolbarSeparator } from "./action";
import { Tag, type TagTone } from "./content";
import { Popover, usePopover } from "./overlay";
import { useControllable, type XStyle } from "./lib";

const ring = `inset 0 0 0 1px ${color.accent}, 0 0 0 4px ${color.accentSoft}`;
const s = stylex.create({
  well: {
    width: "100%", minWidth: 0, height: 36, paddingInline: 12, borderWidth: 0, borderRadius: radius.md, backgroundColor: color.well, color: color.fg,
    fontFamily: font.sans, fontSize: 13.5, outline: "none",
    boxShadow: { default: `inset 0 0 0 1px ${color.line2}`, ":hover": `inset 0 0 0 1px ${color.line3}`, ":focus": ring },
    transitionProperty: "box-shadow", transitionDuration: motion.fast,
    "::placeholder": { color: color.fg4 },
    ":disabled": { opacity: 0.5 },
  },
  sm: { height: 32, fontSize: 13 },
  invalid: { boxShadow: `inset 0 0 0 1px ${color.bad}, 0 0 0 4px ${color.badSoft}` },
  row: { display: "flex", alignItems: "center", gap: 8 },
  grow: { flexGrow: 1, minWidth: 0 },
  muted: { color: color.fg3 },
  faint: { color: color.fg4 },
});

// #region Field
const fd = stylex.create({
  root: { display: "flex", flexDirection: "column", gap: 7, minWidth: 0, width: "100%" },
  label: { display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: color.fg },
  req: { color: color.bad }, opt: { color: color.fg4, fontWeight: 400 },
  hint: { fontSize: 12.5, color: color.fg3 },
  error: { display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: color.bad },
});
/** Label, control, hint and error with a 7px rhythm. The label wraps the control, so clicks focus it. */
export function Field({ label, hint, error, required, optional, children }: { label: ReactNode; hint?: ReactNode; error?: ReactNode; required?: boolean; optional?: boolean; children: ReactNode }) {
  return (
    <label {...stylex.props(fd.root)}>
      <span {...stylex.props(fd.label)}>{label}{required && <span {...stylex.props(fd.req)}>*</span>}{optional && <span {...stylex.props(fd.opt)}>optional</span>}</span>
      {children}
      {error ? <span {...stylex.props(fd.error)}><Icon name="alert" size={13} />{error}</span> : hint && <span {...stylex.props(fd.hint)}>{hint}</span>}
    </label>
  );
}
// #endregion

// #region Input
export function Input({ size = "md", invalid, xstyle, ...rest }: Omit<ComponentProps<"input">, "size"> & { size?: "sm" | "md"; invalid?: boolean; xstyle?: XStyle }) {
  return <input aria-invalid={invalid} {...rest} {...stylex.props(s.well, size === "sm" && s.sm, invalid && s.invalid, xstyle)} />;
}
// #endregion

// #region InputGroup
const ig = stylex.create({
  root: {
    display: "flex", alignItems: "center", gap: 8, minHeight: 36, paddingLeft: 12, paddingRight: 6, borderRadius: radius.md, backgroundColor: color.well, color: color.fg4,
    boxShadow: { default: `inset 0 0 0 1px ${color.line2}`, ":focus-within": ring }, transitionProperty: "box-shadow", transitionDuration: motion.fast,
  },
  wrap: { flexWrap: "wrap", paddingBlock: 5, paddingLeft: 8 },
  input: { flexGrow: 1, minWidth: 0, height: 30, borderWidth: 0, backgroundColor: "transparent", outline: "none", fontFamily: font.sans, fontSize: 14, color: color.fg, "::placeholder": { color: color.fg4 } },
  addon: { display: "inline-flex", alignItems: "center", height: 28, paddingInline: 9, borderRadius: radius.sm, backgroundColor: color.sunken, color: color.fg3, fontSize: 12.5, boxShadow: `inset 0 0 0 1px ${color.line}`, whiteSpace: "nowrap" },
});
/** An input with an icon, addons or a trailing button in the same well. */
export function InputGroup({ icon, start, end, xstyle, ...rest }: ComponentProps<"input"> & { icon?: IconName; start?: ReactNode; end?: ReactNode; xstyle?: XStyle }) {
  return (
    <div {...stylex.props(ig.root, xstyle)}>
      {icon && <Icon name={icon} />}{start}<input {...rest} {...stylex.props(ig.input)} />{end}
    </div>
  );
}
export const Addon = ({ children }: { children: ReactNode }) => <span {...stylex.props(ig.addon)}>{children}</span>;
// #endregion

// #region NumberInput
const nm = stylex.create({
  root: { display: "inline-flex", alignItems: "center", height: 36, width: 140, borderRadius: radius.md, backgroundColor: color.well, boxShadow: `inset 0 0 0 1px ${color.line2}`, overflow: "hidden" },
  input: { flexGrow: 1, minWidth: 0, height: "100%", borderWidth: 0, backgroundColor: "transparent", textAlign: "center", outline: "none", fontVariantNumeric: "tabular-nums", color: color.fg },
  step: { width: 36, height: "100%", borderWidth: 0, backgroundColor: { default: "transparent", ":hover": color.hover }, color: color.fg3, cursor: "pointer", display: "grid", placeItems: "center" },
});
export function NumberInput({ value, defaultValue = 0, onChange, min = -Infinity, max = Infinity, step = 1, label }: { value?: number; defaultValue?: number; onChange?: (v: number) => void; min?: number; max?: number; step?: number; label: string }) {
  const [v, setV] = useControllable(value, defaultValue, onChange);
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  return (
    <div {...stylex.props(nm.root)}>
      <button type="button" aria-label="Decrease" onClick={() => setV(clamp(v - step))} {...stylex.props(nm.step)}><Icon name="minus" size={14} /></button>
      <input aria-label={label} inputMode="decimal" value={v} onChange={(e) => !Number.isNaN(+e.target.value) && setV(clamp(+e.target.value))} {...stylex.props(nm.input)} />
      <button type="button" aria-label="Increase" onClick={() => setV(clamp(v + step))} {...stylex.props(nm.step)}><Icon name="plus" size={14} /></button>
    </div>
  );
}
// #endregion

// #region TextArea
const ta = stylex.create({ area: { height: "auto", minHeight: 96, paddingBlock: 11, resize: "vertical", lineHeight: 1.5 }, count: { fontSize: 12.5, color: color.fg3, textAlign: "right" } });
export function TextArea({ maxLength, xstyle, ...rest }: ComponentProps<"textarea"> & { xstyle?: XStyle }) {
  const [n, setN] = useState(String(rest.defaultValue ?? rest.value ?? "").length);
  return (
    <>
      <textarea maxLength={maxLength} {...rest} onChange={(e) => { setN(e.target.value.length); rest.onChange?.(e); }} {...stylex.props(s.well, ta.area, xstyle)} />
      {maxLength && <span {...stylex.props(ta.count)}>{n} / {maxLength}</span>}
    </>
  );
}
// #endregion

// #region Checkbox
const ck = stylex.create({
  row: { display: "inline-flex", alignItems: "flex-start", gap: 10, cursor: "pointer", fontSize: 13.5, color: color.fg2, userSelect: "none", borderWidth: 0, backgroundColor: "transparent", padding: 0, textAlign: "left", fontFamily: font.sans },
  box: { flex: "none", width: 18, height: 18, marginTop: 1, borderRadius: radius.sm, display: "grid", placeItems: "center", backgroundColor: color.well, boxShadow: `inset 0 0 0 1px ${color.line3}`, color: color.onAccent, transitionProperty: "background-color, transform", transitionDuration: ".25s", transitionTimingFunction: motion.spring },
  on: { backgroundColor: color.accent, boxShadow: "none" },
  label: { color: color.fg },
  sub: { display: "block", color: color.fg3, fontSize: 12.5 },
  dot: { flex: "none", width: 18, height: 18, marginTop: 1, borderRadius: "50%", display: "grid", placeItems: "center", backgroundColor: color.well, boxShadow: `inset 0 0 0 1px ${color.line3}` },
  inner: { width: 8, height: 8, borderRadius: "50%", backgroundColor: color.onAccent },
});
export type CheckedState = boolean | "mixed";
export function Checkbox({ checked, defaultChecked = false, onChange, label, description }: { checked?: CheckedState; defaultChecked?: CheckedState; onChange?: (v: boolean) => void; label?: ReactNode; description?: ReactNode }) {
  const [v, setV] = useControllable<CheckedState>(checked, defaultChecked, (x) => onChange?.(x === true));
  return (
    <button type="button" role="checkbox" aria-checked={v} onClick={() => setV(v !== true)} {...stylex.props(ck.row)}>
      <span {...stylex.props(ck.box, v !== false && ck.on)}>{v === "mixed" ? <Icon name="minus" size={12} /> : v && <Icon name="check" size={12} />}</span>
      {label && <span><span {...stylex.props(ck.label)}>{label}</span>{description && <span {...stylex.props(ck.sub)}>{description}</span>}</span>}
    </button>
  );
}
// #endregion

// #region RadioGroup
export function Radio({ checked, onSelect, label, description }: { checked: boolean; onSelect: () => void; label: ReactNode; description?: ReactNode }) {
  return (
    <button type="button" role="radio" aria-checked={checked} onClick={onSelect} {...stylex.props(ck.row)}>
      <span {...stylex.props(ck.dot, checked && ck.on)}>{checked && <span {...stylex.props(ck.inner)} />}</span>
      <span><span {...stylex.props(ck.label)}>{label}</span>{description && <span {...stylex.props(ck.sub)}>{description}</span>}</span>
    </button>
  );
}
const rg = stylex.create({ col: { display: "flex", flexDirection: "column", gap: 12 } });
export function RadioGroup({ options, value, defaultValue, onChange, label }: { options: { value: string; label: ReactNode; description?: ReactNode }[]; value?: string; defaultValue?: string; onChange?: (v: string) => void; label: string }) {
  const [v, setV] = useControllable(value, defaultValue ?? options[0]?.value ?? "", onChange);
  return <div role="radiogroup" aria-label={label} {...stylex.props(rg.col)}>{options.map((o) => <Radio key={o.value} checked={v === o.value} onSelect={() => setV(o.value)} label={o.label} description={o.description} />)}</div>;
}
// #endregion

// #region Switch
const sw = stylex.create({
  track: { position: "relative", flex: "none", width: 40, height: 24, padding: 0, borderWidth: 0, borderRadius: radius.pill, backgroundColor: color.sunken, boxShadow: `inset 0 0 0 1px ${color.line2}`, cursor: "pointer", transitionProperty: "background-color", transitionDuration: ".2s" },
  on: { backgroundColor: color.inv, boxShadow: "none" },
  accentOn: { backgroundColor: color.accent },
  knob: { position: "absolute", top: 3, left: 3, width: 18, height: 18, borderRadius: "50%", backgroundColor: color.fg3, boxShadow: "0 1px 2px rgba(0,0,0,.35)", transitionProperty: "transform, background-color", transitionDuration: ".35s", transitionTimingFunction: motion.spring },
  knobOn: { transform: "translateX(16px)", backgroundColor: color.onInv },
  knobAccent: { backgroundColor: "#fff" },
  sm: { width: 32, height: 20 }, knobSm: { width: 14, height: 14 }, knobSmOn: { transform: "translateX(12px)" },
});
export function Switch({ checked, defaultChecked = false, onChange, size = "md", accent, label }: { checked?: boolean; defaultChecked?: boolean; onChange?: (v: boolean) => void; size?: "sm" | "md"; accent?: boolean; label: string }) {
  const [on, setOn] = useControllable(checked, defaultChecked, onChange);
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => setOn(!on)} {...stylex.props(sw.track, size === "sm" && sw.sm, on && (accent ? sw.accentOn : sw.on))}>
      <span {...stylex.props(sw.knob, size === "sm" && sw.knobSm, on && sw.knobOn, on && size === "sm" && sw.knobSmOn, on && accent && sw.knobAccent)} />
    </button>
  );
}
// #endregion

// #region Slider
const sl = stylex.create({
  range: { width: "100%", accentColor: color.accent, height: 24, cursor: "pointer" },
  bar: { position: "relative", height: 40, borderRadius: radius.md, backgroundColor: color.sunken, boxShadow: `inset 0 0 0 1px ${color.line}`, overflow: "hidden", userSelect: "none" },
  fill: { position: "absolute", top: 0, bottom: 0, left: 0, backgroundColor: color.raised2, boxShadow: `inset -1px 0 0 ${color.line3}` },
  w: (v: number) => ({ width: `${v}%` }),
  lab: { position: "absolute", top: 0, bottom: 0, left: 12, display: "flex", alignItems: "center", fontSize: 13.5, color: color.fg2, pointerEvents: "none" },
  val: { position: "absolute", top: 0, bottom: 0, right: 12, display: "flex", alignItems: "center", fontSize: 13.5, color: color.fg, fontVariantNumeric: "tabular-nums", pointerEvents: "none" },
  input: { position: "absolute", inset: 0, width: "100%", height: "100%", margin: 0, opacity: 0, cursor: "ew-resize" },
});
/** Native range with the accent track. */
export function Slider({ value, defaultValue = 50, onChange, min = 0, max = 100, step = 1, label }: { value?: number; defaultValue?: number; onChange?: (v: number) => void; min?: number; max?: number; step?: number; label: string }) {
  const [v, setV] = useControllable(value, defaultValue, onChange);
  return <input type="range" aria-label={label} min={min} max={max} step={step} value={v} onChange={(e) => setV(+e.target.value)} {...stylex.props(sl.range)} />;
}
/** Label-inside bar slider: drag anywhere on the bar. */
export function SliderBar({ value, defaultValue = 40, onChange, min = 0, max = 100, step = 1, label, unit = "" }: { value?: number; defaultValue?: number; onChange?: (v: number) => void; min?: number; max?: number; step?: number; label: string; unit?: string }) {
  const [v, setV] = useControllable(value, defaultValue, onChange);
  return (
    <div {...stylex.props(sl.bar)}>
      <span {...stylex.props(sl.fill, sl.w(((v - min) / (max - min)) * 100))} />
      <span {...stylex.props(sl.lab)}>{label}</span><span {...stylex.props(sl.val)}>{v}{unit}</span>
      <input type="range" aria-label={label} min={min} max={max} step={step} value={v} onChange={(e) => setV(+e.target.value)} {...stylex.props(sl.input)} />
    </div>
  );
}
// #endregion

// #region Select
const se = stylex.create({
  trigger: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, textAlign: "left", cursor: "pointer" },
  list: { padding: 6, minWidth: "100%", width: 240, maxHeight: 300, overflowY: "auto" },
  full: { display: "block", width: "100%" },
});
export type Option = { value: string; label: string; description?: string; lead?: ReactNode; group?: string };
function OptionList({ options, value, onPick }: { options: Option[]; value?: string | string[]; onPick: (v: string) => void }) {
  const groups = [...new Set(options.map((o) => o.group ?? ""))];
  const on = (v: string) => (Array.isArray(value) ? value.includes(v) : value === v);
  return (
    <>{groups.map((g) => (
      <div key={g}>{g && <MenuLabel>{g}</MenuLabel>}
        {options.filter((o) => (o.group ?? "") === g).map((o) => (
          <MenuItem key={o.value} checked={on(o.value)} onSelect={() => onPick(o.value)}>
            <span {...stylex.props(s.row)}>{o.lead}<span><span>{o.label}</span>{o.description && <span {...stylex.props(fd.hint)}><br />{o.description}</span>}</span></span>
          </MenuItem>
        ))}
      </div>
    ))}</>
  );
}
function SelectPanel({ options, value, onPick }: { options: Option[]; value?: string; onPick: (v: string) => void }) {
  const { close } = usePopover();
  return <div role="listbox" {...stylex.props(se.list)}><OptionList options={options} value={value} onPick={(v) => { onPick(v); close(); }} /></div>;
}
export function Select({ options, value, defaultValue, onChange, placeholder = "Select…", label }: { options: Option[]; value?: string; defaultValue?: string; onChange?: (v: string) => void; placeholder?: string; label?: string }) {
  const [v, setV] = useControllable<string | undefined>(value, defaultValue, (x) => x && onChange?.(x));
  const cur = options.find((o) => o.value === v);
  return (
    <span {...stylex.props(se.full)}>
      <Popover xstyle={se.full} trigger={<button type="button" aria-label={label} {...stylex.props(s.well, se.trigger)}><span {...stylex.props(!cur && s.faint)}>{cur?.label ?? placeholder}</span><Icon name="chevs" size={14} /></button>}>
        <SelectPanel options={options} value={v} onPick={setV} />
      </Popover>
    </span>
  );
}
// #endregion

// #region Combobox
const cbx = stylex.create({ panel: { padding: 6, width: 280 }, search: { paddingBottom: 6 }, empty: { padding: 10, color: color.fg4, fontSize: 13 } });
/** Type to filter. `multiple` keeps picks as removable tags. */
export function Combobox({ options, value, onChange, placeholder = "Search…", multiple }: { options: Option[]; value: string | string[]; onChange: (v: string | string[]) => void; placeholder?: string; multiple?: boolean }) {
  const [q, setQ] = useState("");
  const list = options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase()));
  const picked = Array.isArray(value) ? value : value ? [value] : [];
  const pick = (v: string) => onChange(multiple ? (picked.includes(v) ? picked.filter((x) => x !== v) : [...picked, v]) : v);
  const trigger = multiple
    ? <div {...stylex.props(ig.root, ig.wrap)}>{picked.map((p) => <Tag key={p} tone="violet" onRemove={() => pick(p)}>{options.find((o) => o.value === p)?.label}</Tag>)}<span {...stylex.props(s.faint)}>{picked.length ? "" : placeholder}</span></div>
    : <button type="button" {...stylex.props(s.well, se.trigger)}><span>{options.find((o) => o.value === value)?.label ?? placeholder}</span><Icon name="chevs" size={14} /></button>;
  return (
    <Popover trigger={trigger}>
      <div {...stylex.props(cbx.panel)}>
        <div {...stylex.props(cbx.search)}><InputGroup icon="search" autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} /></div>
        <OptionList options={list} value={picked} onPick={pick} />
        {list.length === 0 && <div {...stylex.props(cbx.empty)}>No matches</div>}
      </div>
    </Popover>
  );
}
// #endregion

// #region ComplexSelect
/** Rich options: pass `lead` (an Avatar), `description` and `group` on each option. */
export function ComplexSelect(props: { options: Option[]; value?: string; onChange?: (v: string) => void; placeholder?: string }) {
  return <Select {...props} />;
}
// #endregion

// #region Typeahead
const ty = stylex.create({ wrap: { position: "relative", width: "100%" }, list: { position: "absolute", left: 0, right: 0, top: "calc(100% + 6px)", zIndex: 30, padding: 6, borderRadius: radius.xl, backgroundColor: color.raised, boxShadow: shadow.pop }, hit: { color: color.fg, fontWeight: 600 } });
export function Typeahead({ suggestions, onPick, icon = "search", placeholder }: { suggestions: string[]; onPick: (v: string) => void; icon?: IconName; placeholder?: string }) {
  const [q, setQ] = useState("");
  const hits = q ? suggestions.filter((x) => x.toLowerCase().startsWith(q.toLowerCase())).slice(0, 6) : [];
  return (
    <div {...stylex.props(ty.wrap)}>
      <InputGroup icon={icon} value={q} placeholder={placeholder} onChange={(e) => setQ(e.target.value)} />
      {hits.length > 0 && (
        <div role="listbox" {...stylex.props(ty.list)}>
          {hits.map((h) => <MenuItem key={h} onSelect={() => { onPick(h); setQ(h); }}><span {...stylex.props(ty.hit)}>{h.slice(0, q.length)}</span>{h.slice(q.length)}</MenuItem>)}
        </div>
      )}
    </div>
  );
}
// #endregion

// #region Tokenizer
const tones: TagTone[] = ["line"];
/** Enter adds a tag, Backspace on an empty field removes the last one. */
export function Tokenizer({ value, onChange, placeholder = "Add…", tone = "line" }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string; tone?: TagTone }) {
  const [q, setQ] = useState("");
  void tones;
  return (
    <div {...stylex.props(ig.root, ig.wrap)}>
      {value.map((t) => <Tag key={t} tone={tone} onRemove={() => onChange(value.filter((x) => x !== t))}>{t}</Tag>)}
      <input value={q} placeholder={placeholder} onChange={(e) => setQ(e.target.value)} {...stylex.props(ig.input)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && q.trim()) { e.preventDefault(); if (!value.includes(q.trim())) onChange([...value, q.trim()]); setQ(""); }
          if (e.key === "Backspace" && !q && value.length) onChange(value.slice(0, -1));
        }} />
    </div>
  );
}
// #endregion

// #region FilterChip
const fc = stylex.create({
  chip: { display: "inline-flex", alignItems: "center", gap: 6, height: 30, paddingLeft: 10, paddingRight: 4, borderWidth: 0, borderRadius: radius.md, backgroundColor: color.raised, boxShadow: `inset 0 0 0 1px ${color.line2}`, fontFamily: font.sans, fontSize: 13, color: color.fg3, whiteSpace: "nowrap" },
  value: { color: color.fg, fontWeight: 500 },
  add: { paddingRight: 10, cursor: "pointer" },
});
/** One condition of a power-search query: field, operator, value. */
export function FilterChip({ field, op = "is", value, onRemove }: { field: string; op?: string; value: ReactNode; onRemove?: () => void }) {
  return (
    <span {...stylex.props(fc.chip)}>
      {field}<span {...stylex.props(s.faint)}>{op}</span><span {...stylex.props(fc.value)}>{value}</span>
      {onRemove ? <IconButton icon="x" label={`Remove ${field}`} size="xs" onClick={onRemove} /> : <Icon name="chev-down" size={12} />}
    </span>
  );
}
export function AddFilterButton({ onClick }: { onClick?: () => void }) {
  return <button type="button" onClick={onClick} {...stylex.props(fc.chip, fc.add)}><Icon name="plus" size={13} />Filter</button>;
}
// #endregion

// #region Calendar
const cal = stylex.create({
  root: { width: 280, padding: 12, borderRadius: radius.xl, backgroundColor: color.surface, boxShadow: `inset 0 0 0 1px ${color.line}, ${shadow.card}` },
  head: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, fontWeight: 600, color: color.fg },
  grid: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, textAlign: "center" },
  dow: { fontFamily: font.mono, fontSize: 10.5, fontWeight: 500, color: color.fg4, paddingBlock: 6 },
  day: { aspectRatio: "1", borderWidth: 0, borderRadius: "50%", backgroundColor: { default: "transparent", ":hover": color.hover }, color: color.fg2, fontSize: 13, fontVariantNumeric: "tabular-nums", cursor: "pointer", fontFamily: font.sans },
  out: { color: color.fg4 },
  today: { boxShadow: `inset 0 0 0 1px ${color.line3}` },
  sel: { backgroundColor: color.inv, color: color.onInv },
  inRange: { backgroundColor: color.accentSoft, borderRadius: 0, color: color.fg },
});
const same = (a?: Date, b?: Date) => !!a && !!b && a.toDateString() === b.toDateString();
export type DateRange = { from?: Date; to?: Date };
/** Month grid. Pass `range` + `onRangeChange` for range picking, or `value` + `onChange` for one day. */
export function Calendar({ value, onChange, range, onRangeChange, initialMonth }: { value?: Date; onChange?: (d: Date) => void; range?: DateRange; onRangeChange?: (r: DateRange) => void; initialMonth?: Date }) {
  const [month, setMonth] = useState(() => { const d = initialMonth ?? value ?? range?.from ?? new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const first = (month.getDay() + 6) % 7; // Monday first
  const days = Array.from({ length: 42 }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i - first + 1));
  const today = new Date();
  const pick = (d: Date) => {
    if (onRangeChange) { if (!range?.from || range.to) onRangeChange({ from: d }); else onRangeChange(d < range.from ? { from: d, to: range.from } : { from: range.from, to: d }); }
    else onChange?.(d);
  };
  return (
    <div {...stylex.props(cal.root)}>
      <div {...stylex.props(cal.head)}>
        <IconButton icon="chev-left" label="Previous month" size="sm" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} />
        <span>{month.toLocaleString("en", { month: "long", year: "numeric" })}</span>
        <IconButton icon="chev-right" label="Next month" size="sm" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} />
      </div>
      <div role="grid" {...stylex.props(cal.grid)}>
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => <span key={d} {...stylex.props(cal.dow)}>{d}</span>)}
        {days.map((d) => {
          const sel = same(d, value) || same(d, range?.from) || same(d, range?.to);
          const inR = !!range?.from && !!range?.to && d > range.from && d < range.to;
          return <button key={d.toISOString()} type="button" aria-selected={sel} onClick={() => pick(d)}
            {...stylex.props(cal.day, d.getMonth() !== month.getMonth() && cal.out, same(d, today) && cal.today, inR && cal.inRange, sel && cal.sel)}>{d.getDate()}</button>;
        })}
      </div>
    </div>
  );
}
// #endregion

// #region DateInput
const fmtDate = (d?: Date) => (d ? d.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" }) : "");
function CalendarPanel({ value, onChange }: { value?: Date; onChange: (d: Date) => void }) {
  const { close } = usePopover();
  return <Calendar value={value} onChange={(d) => { onChange(d); close(); }} />;
}
export function DateInput({ value, onChange, placeholder = "Pick a date" }: { value?: Date; onChange: (d: Date) => void; placeholder?: string }) {
  return (
    <Popover trigger={<button type="button" {...stylex.props(s.well, se.trigger)}><Icon name="calendar" /><span {...stylex.props(s.grow, !value && s.faint)}>{fmtDate(value) || placeholder}</span><Icon name="chev-down" size={14} /></button>}>
      <CalendarPanel value={value} onChange={onChange} />
    </Popover>
  );
}
// #endregion

// #region DateRangeInput
const dri = stylex.create({ panel: { display: "flex", gap: 10, padding: 10, flexWrap: "wrap" }, presets: { display: "flex", flexDirection: "column", width: 130 } });
export function DateRangeInput({ value, onChange }: { value: DateRange; onChange: (r: DateRange) => void }) {
  const ago = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return d; };
  const presets: [string, DateRange][] = [["Today", { from: ago(0), to: ago(0) }], ["Last 7 days", { from: ago(7), to: ago(0) }], ["Last 30 days", { from: ago(30), to: ago(0) }]];
  return (
    <Popover trigger={<button type="button" {...stylex.props(s.well, se.trigger)}><Icon name="calendar" /><span {...stylex.props(s.grow)}>{fmtDate(value.from) || "Start"} → {fmtDate(value.to) || "End"}</span></button>}>
      <div {...stylex.props(dri.panel)}>
        <div {...stylex.props(dri.presets)}>{presets.map(([l, r]) => <MenuItem key={l} onSelect={() => onChange(r)}>{l}</MenuItem>)}</div>
        <Calendar range={value} onRangeChange={onChange} />
      </div>
    </Popover>
  );
}
// #endregion

// #region DateTimeInput
export function DateTimeInput({ value, onChange, timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone }: { value: Date; onChange: (d: Date) => void; timeZone?: string }) {
  const hhmm = `${String(value.getHours()).padStart(2, "0")}:${String(value.getMinutes()).padStart(2, "0")}`;
  return (
    <div>
      <div {...stylex.props(s.row)}>
        <span {...stylex.props(s.grow)}><DateInput value={value} onChange={(d) => { const n = new Date(d); n.setHours(value.getHours(), value.getMinutes()); onChange(n); }} /></span>
        <TimeInput value={hhmm} onChange={(t) => { const [h, m] = t.split(":").map(Number); const n = new Date(value); n.setHours(h, m); onChange(n); }} />
      </div>
      <span {...stylex.props(fd.hint)}>{timeZone}</span>
    </div>
  );
}
// #endregion

// #region TimeInput
const ti = stylex.create({ root: { width: 130 } });
export function TimeInput({ value, onChange, step = 900 }: { value: string; onChange: (v: string) => void; step?: number }) {
  return <InputGroup icon="clock" type="time" step={step} value={value} onChange={(e) => onChange(e.target.value)} xstyle={ti.root} aria-label="Time" />;
}
// #endregion

// #region FileInput
const fi = stylex.create({
  drop: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: 26, borderRadius: radius.xl, borderWidth: 1.5, borderStyle: "dashed", borderColor: color.line3, backgroundColor: color.well, textAlign: "center", color: color.fg3, fontSize: 13.5, cursor: "pointer", transitionProperty: "border-color, background-color", transitionDuration: motion.fast },
  over: { borderColor: color.accent, backgroundColor: color.accentSoft },
  strong: { color: color.fg, fontWeight: 500 },
  hidden: { display: "none" },
});
export function FileInput({ onFiles, accept, multiple = true, hint }: { onFiles: (f: File[]) => void; accept?: string; multiple?: boolean; hint?: ReactNode }) {
  const [over, setOver] = useState(false);
  const id = useId();
  return (
    <label htmlFor={id} {...stylex.props(fi.drop, over && fi.over)}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); onFiles([...e.dataTransfer.files]); }}>
      <Icon name="upload" size={22} />
      <span><span {...stylex.props(fi.strong)}>Drop files</span> or click to browse</span>
      {hint && <span {...stylex.props(fd.hint)}>{hint}</span>}
      <input id={id} type="file" accept={accept} multiple={multiple} onChange={(e) => onFiles([...(e.target.files ?? [])])} {...stylex.props(fi.hidden)} />
    </label>
  );
}
// #endregion

// #region OTPInput
const otp = stylex.create({
  row: { display: "flex", gap: 8, alignItems: "center" },
  cell: { width: 46, height: 54, paddingInline: 0, textAlign: "center", fontFamily: font.mono, fontSize: 20, fontWeight: 600 },
  dash: { color: color.fg4 },
});
export function OTPInput({ length = 6, onComplete }: { length?: number; onComplete?: (code: string) => void }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const [vals, setVals] = useState<string[]>(Array(length).fill(""));
  const set = (i: number, v: string) => {
    const next = [...vals]; next[i] = v.slice(-1); setVals(next);
    if (v && i < length - 1) refs.current[i + 1]?.focus();
    if (next.every(Boolean)) onComplete?.(next.join(""));
  };
  return (
    <div {...stylex.props(otp.row)}>
      {vals.map((v, i) => (
        <span key={i} {...stylex.props(otp.row)}>
          {i === length / 2 && <span {...stylex.props(otp.dash)}>–</span>}
          <input ref={(el) => { refs.current[i] = el; }} inputMode="numeric" aria-label={`Digit ${i + 1}`} value={v}
            onChange={(e) => set(i, e.target.value)} onKeyDown={(e) => e.key === "Backspace" && !v && i > 0 && refs.current[i - 1]?.focus()}
            {...stylex.props(s.well, otp.cell)} />
        </span>
      ))}
    </div>
  );
}
// #endregion

// #region Rating
const rt = stylex.create({
  row: { display: "inline-flex", gap: 2 },
  star: { padding: 2, borderWidth: 0, backgroundColor: "transparent", color: color.line3, cursor: "pointer", transform: { default: null, ":hover": "scale(1.15)" }, transitionProperty: "transform, color", transitionDuration: ".25s", transitionTimingFunction: motion.spring },
  on: { color: color.c4 },
});
export function Rating({ value, defaultValue = 0, onChange, max = 5 }: { value?: number; defaultValue?: number; onChange?: (v: number) => void; max?: number }) {
  const [v, setV] = useControllable(value, defaultValue, onChange);
  return (
    <div role="radiogroup" aria-label="Rating" {...stylex.props(rt.row)}>
      {Array.from({ length: max }, (_, i) => (
        <button key={i} type="button" role="radio" aria-checked={v === i + 1} aria-label={`${i + 1} stars`} onClick={() => setV(i + 1)} {...stylex.props(rt.star, i < v && rt.on)}>
          <Icon name="star" size={22} fill="currentColor" />
        </button>
      ))}
    </div>
  );
}
// #endregion

// #region ColorPicker
const cp = stylex.create({
  root: { display: "flex", flexDirection: "column", gap: 12, width: 260 },
  swatches: { display: "flex", gap: 8, flexWrap: "wrap" },
  sw: { width: 28, height: 28, borderRadius: "50%", borderWidth: 0, cursor: "pointer", boxShadow: "inset 0 0 0 1px rgba(0,0,0,.15)", transform: { default: null, ":hover": "scale(1.1)" }, transitionProperty: "transform", transitionDuration: ".25s", transitionTimingFunction: motion.spring },
  on: { boxShadow: `0 0 0 2px ${color.surface}, 0 0 0 4px ${color.fg}` },
  bg: (c: string) => ({ backgroundColor: c }),
  native: { width: 28, height: 28, padding: 0, borderWidth: 0, backgroundColor: "transparent", cursor: "pointer" },
  hex: { fontFamily: font.mono, fontSize: 13 },
});
export function ColorPicker({ value, onChange, swatches = ["#a988ee", "#6d8cff", "#6fd6aa", "#f0c46b", "#ef7d70", "#efeff3"] }: { value: string; onChange: (hex: string) => void; swatches?: string[] }) {
  return (
    <div {...stylex.props(cp.root)}>
      <div {...stylex.props(cp.swatches)}>
        {swatches.map((c) => <button key={c} type="button" aria-label={c} aria-pressed={c === value} onClick={() => onChange(c)} {...stylex.props(cp.sw, cp.bg(c), c === value && cp.on)} />)}
        <input type="color" aria-label="Custom colour" value={value} onChange={(e) => onChange(e.target.value)} {...stylex.props(cp.native)} />
      </div>
      <InputGroup start={<span {...stylex.props(cp.sw, cp.bg(value))} style={{ width: 18, height: 18, borderRadius: 6 }} />} value={value} onChange={(e) => onChange(e.target.value)} xstyle={cp.hex} aria-label="Hex" />
    </div>
  );
}
// #endregion

// #region Transfer
const tr = stylex.create({
  root: { display: "flex", alignItems: "center", gap: 10 },
  list: { flexGrow: 1, minWidth: 0, borderRadius: radius.xl, backgroundColor: color.surface, boxShadow: `inset 0 0 0 1px ${color.line}` },
  head: { display: "flex", justifyContent: "space-between", paddingBlock: 10, paddingInline: 14, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.line, fontSize: 13, fontWeight: 600 },
  items: { display: "flex", flexDirection: "column", gap: 10, paddingBlock: 10, paddingInline: 14, minHeight: 150 },
  arrows: { display: "flex", flexDirection: "column", gap: 6 },
});
export function Transfer({ left, right, onChange, titles = ["Available", "Selected"] }: { left: string[]; right: string[]; onChange: (l: string[], r: string[]) => void; titles?: [string, string] }) {
  const [sel, setSel] = useState<string[]>([]);
  const move = (from: string[], to: string[], dir: ">" | "<") => {
    const m = from.filter((x) => sel.includes(x)); const f = from.filter((x) => !sel.includes(x));
    if (dir === ">") onChange(f, [...to, ...m]); else onChange([...to, ...m], f); setSel([]);
  };
  const List = ({ title, items }: { title: string; items: string[] }) => (
    <div {...stylex.props(tr.list)}>
      <div {...stylex.props(tr.head)}>{title}<span>{items.length}</span></div>
      <div {...stylex.props(tr.items)}>{items.map((x) => <Checkbox key={x} label={x} checked={sel.includes(x)} onChange={(v) => setSel(v ? [...sel, x] : sel.filter((y) => y !== x))} />)}</div>
    </div>
  );
  return (
    <div {...stylex.props(tr.root)}>
      <List title={titles[0]} items={left} />
      <div {...stylex.props(tr.arrows)}><IconButton icon="chev-right" label="Move right" variant="secondary" size="sm" onClick={() => move(left, right, ">")} /><IconButton icon="chev-left" label="Move left" variant="secondary" size="sm" onClick={() => move(right, left, "<")} /></div>
      <List title={titles[1]} items={right} />
    </div>
  );
}
// #endregion

// #region Cascader
const cs = stylex.create({ cols: { display: "flex" }, col: { width: 170, padding: 6 }, sep: { borderLeftWidth: 1, borderLeftStyle: "solid", borderLeftColor: color.line }, on: { backgroundColor: color.hover, color: color.fg } });
export type CascadeNode = { label: string; children?: CascadeNode[] };
export function Cascader({ tree, value, onChange }: { tree: CascadeNode[]; value: string[]; onChange: (path: string[]) => void }) {
  const cols: CascadeNode[][] = [tree];
  value.forEach((v, i) => { const n = cols[i]?.find((x) => x.label === v); if (n?.children) cols.push(n.children); });
  return (
    <div {...stylex.props(cs.cols)}>
      {cols.map((col, i) => (
        <div key={i} {...stylex.props(cs.col, i > 0 && cs.sep)}>
          {col.map((n) => (
            <MenuItem key={n.label} shortcut={n.children ? <Icon name="chev-right" size={13} /> : undefined} checked={!n.children && value[i] === n.label ? true : undefined}
              onSelect={() => onChange([...value.slice(0, i), n.label])}>
              <span {...stylex.props(value[i] === n.label && cs.on)}>{n.label}</span>
            </MenuItem>
          ))}
        </div>
      ))}
    </div>
  );
}
// #endregion

// #region InlineEdit
const ie = stylex.create({ text: { cursor: "text", borderRadius: radius.sm, paddingBlock: 2, paddingInline: 6, marginInline: -6, backgroundColor: { default: "transparent", ":hover": color.hover }, borderWidth: 0, color: "inherit", fontFamily: "inherit", fontSize: "inherit", fontWeight: "inherit", textAlign: "left" } });
/** Click to edit. Enter saves, Esc cancels. */
export function InlineEdit({ value, onSave }: { value: string; onSave: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  if (!editing) return <button type="button" onClick={() => { setDraft(value); setEditing(true); }} {...stylex.props(ie.text)}>{value}</button>;
  return <Input size="sm" autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={() => { onSave(draft || value); setEditing(false); }}
    onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); if (e.key === "Escape") { setDraft(value); setEditing(false); } }} />;
}
// #endregion

// #region RichTextEditor
const rte = stylex.create({
  root: { width: "100%", borderRadius: radius.lg, backgroundColor: color.well, boxShadow: `inset 0 0 0 1px ${color.line2}`, overflow: "hidden" },
  bar: { padding: 6, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.line },
  ed: { paddingBlock: 12, paddingInline: 14, minHeight: 120, outline: "none", fontSize: 14, lineHeight: 1.6, color: color.fg },
});
/** Lightweight editor on contenteditable. For production docs, swap the body for TipTap/Lexical and keep the chrome. */
export function RichTextEditor({ initialHTML = "", onChange }: { initialHTML?: string; onChange?: (html: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const cmd = (c: string) => { document.execCommand(c); ref.current?.focus(); };
  const btn = (icon: IconName, c: string, label: string) => <ToggleButton key={c} size="sm" icon={icon} aria-label={label} onMouseDown={(e) => { e.preventDefault(); cmd(c); }} />;
  return (
    <div {...stylex.props(rte.root)}>
      <div {...stylex.props(rte.bar)}><Toolbar>{btn("bold", "bold", "Bold")}{btn("italic", "italic", "Italic")}{btn("under", "underline", "Underline")}<ToolbarSeparator />{btn("list", "insertUnorderedList", "List")}</Toolbar></div>
      <div ref={ref} contentEditable suppressContentEditableWarning dangerouslySetInnerHTML={{ __html: initialHTML }} onInput={() => onChange?.(ref.current?.innerHTML ?? "")} {...stylex.props(rte.ed)} />
    </div>
  );
}
// #endregion

// #region ListRow
const lr = stylex.create({
  row: { display: "flex", alignItems: "center", gap: 12, minHeight: 56, paddingBlock: 12, paddingInline: 14, borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: color.line, color: color.fg2 },
  first: { borderTopWidth: 0 },
  title: { display: "block", fontWeight: 500, color: color.fg },
  sub: { display: "block", fontSize: 12.5, color: color.fg3 },
  wrap: { flexWrap: "wrap" },
});
/** A list row with a leading slot, two lines of text and a trailing control. */
export function ListRow({ lead, title, description, trailing, first }: { lead?: ReactNode; title: ReactNode; description?: ReactNode; trailing?: ReactNode; first?: boolean }) {
  return (
    <div {...stylex.props(lr.row, first && lr.first)}>
      {lead}<div {...stylex.props(s.grow)}><span {...stylex.props(lr.title)}>{title}</span>{description && <span {...stylex.props(lr.sub)}>{description}</span>}</div>{trailing}
    </div>
  );
}
// #endregion

// #region SettingRow
/** Declarative settings row: what it is, what it does, and the control — on one level line. */
export function SettingRow({ title, description, control, first }: { title: ReactNode; description?: ReactNode; control: ReactNode; first?: boolean }) {
  return <ListRow first={first} title={title} description={description} trailing={control} />;
}
// #endregion

export { Button };
