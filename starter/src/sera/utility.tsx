/**
 * Utility.
 * VisuallyHidden · Theme (useTheme, ThemeToggle) · hooks · LinkProvider
 */
import * as stylex from "@stylexjs/stylex";
import { createContext, useContext, useEffect, useState, type ComponentProps, type ReactNode } from "react";
import { SegmentedControl } from "./action";
import { presets, type Preset } from "./themes";

// #region VisuallyHidden
const vh = stylex.create({ sr: { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap", borderWidth: 0 } });
/** Text for screen readers that takes no space on screen. */
export const VisuallyHidden = ({ children }: { children: ReactNode }) => <span {...stylex.props(vh.sr)}>{children}</span>;
// #endregion

// #region Theme
export type Mode = "light" | "dark" | "system";
/** Reads and sets the colour mode on <html data-theme>, remembered in localStorage. */
export function useTheme(key = "sera-theme") {
  const [mode, setMode] = useState<Mode>(() => { try { return (localStorage.getItem(key) as Mode) || "system"; } catch { return "system"; } });
  useEffect(() => {
    const root = document.documentElement;
    if (mode === "system") root.removeAttribute("data-theme"); else root.dataset.theme = mode;
    try { localStorage.setItem(key, mode); } catch { /* storage blocked */ }
  }, [mode, key]);
  return [mode, setMode] as const;
}
export function ThemeToggle() {
  const [mode, setMode] = useTheme();
  return <SegmentedControl size="sm" value={mode} onChange={(v) => setMode(v as Mode)} options={[{ value: "light", label: "Light", icon: "sun" }, { value: "dark", label: "Dark", icon: "moon" }, { value: "system", label: "Auto" }]} />;
}
/** Re-keys the accent for everything inside. <Theme preset="ember">…</Theme> */
export function Theme({ preset, children }: { preset: Preset; children: ReactNode }) {
  return <div {...stylex.props(presets[preset])} style={{ display: "contents" }}>{children}</div>;
}
// #endregion

// #region hooks
/** Close something when Escape is pressed. */
export function useEscape(active: boolean, fn: () => void) {
  useEffect(() => {
    if (!active) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && fn();
    addEventListener("keydown", k); return () => removeEventListener("keydown", k);
  }, [active, fn]);
}
/** True when the media query matches. useMedia("(max-width: 860px)") */
export function useMedia(query: string) {
  const [m, setM] = useState(() => typeof matchMedia !== "undefined" && matchMedia(query).matches);
  useEffect(() => { const q = matchMedia(query); const f = () => setM(q.matches); q.addEventListener("change", f); return () => q.removeEventListener("change", f); }, [query]);
  return m;
}
/** Global ⌘K / Ctrl-K shortcut. */
export function useHotkey(key: string, fn: () => void) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === key.toLowerCase()) { e.preventDefault(); fn(); } };
    addEventListener("keydown", k); return () => removeEventListener("keydown", k);
  }, [key, fn]);
}
// #endregion

// #region LinkProvider
type LinkComp = (p: ComponentProps<"a">) => ReactNode;
const LinkCtx = createContext<LinkComp>((p) => <a {...p} />);
/** Tell Sera which link component your router uses. Nav items and crumbs render through it. */
export const LinkProvider = ({ component, children }: { component: LinkComp; children: ReactNode }) => <LinkCtx.Provider value={component}>{children}</LinkCtx.Provider>;
export function useLink() { return useContext(LinkCtx); }
// #endregion
