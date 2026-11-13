/**
 * Sera tokens — every colour is written once as light-dark(light, dark).
 * The theme follows `color-scheme` on <html>, so switching is one attribute and never flashes.
 *
 *   import { color, radius, font, motion, shadow } from "./tokens.stylex";
 */
import * as stylex from "@stylexjs/stylex";

const ld = (light: string, dark: string) => `light-dark(${light}, ${dark})`;

export const color = stylex.defineVars({
  // grounds, back to front
  bg: ld("#f1f1f4", "#171719"),
  panel: ld("#f8f8fa", "#1c1c1f"),
  surface: ld("#ffffff", "#1e1e21"),
  raised: ld("#ffffff", "#252528"),
  raised2: ld("#f6f6f8", "#2c2c30"),
  sunken: ld("#e9e9ee", "#131315"),
  well: ld("#f4f4f7", "#1b1b1e"),
  segOn: ld("#ffffff", "#303034"),
  hover: ld("rgba(14,14,24,.045)", "rgba(255,255,255,.05)"),
  scrim: ld("rgba(18,18,24,.38)", "rgba(4,4,6,.62)"),
  // lines
  line: ld("rgba(14,14,26,.08)", "rgba(255,255,255,.07)"),
  line2: ld("rgba(14,14,26,.13)", "rgba(255,255,255,.11)"),
  line3: ld("rgba(14,14,26,.24)", "rgba(255,255,255,.2)"),
  // ink
  fg: ld("#121216", "#f2f3f5"),
  fg2: ld("#43434d", "#c3c5cc"),
  fg3: ld("#6b6b77", "#8d9099"),
  fg4: ld("#a0a0ab", "#62656e"),
  inv: ld("#141418", "#f2f3f5"),
  inv2: ld("#26262c", "#ffffff"),
  onInv: ld("#fafafa", "#17181b"),
  // accent + signals
  accent: ld("#7e4fc4", "#a988ee"),
  accent2: ld("#6a3db0", "#9070dd"),
  accentSoft: ld("rgba(126,79,196,.1)", "rgba(169,136,238,.15)"),
  accentLine: ld("rgba(126,79,196,.35)", "rgba(169,136,238,.42)"),
  onAccent: ld("#ffffff", "#150a26"),
  ok: ld("#1d9a52", "#4fd07d"),
  okSoft: ld("rgba(29,154,82,.1)", "rgba(79,208,125,.14)"),
  warn: ld("#b7791f", "#eab452"),
  warnSoft: ld("rgba(183,121,31,.12)", "rgba(234,180,82,.14)"),
  bad: ld("#d4443d", "#f0615a"),
  badSoft: ld("rgba(212,68,61,.09)", "rgba(240,97,90,.14)"),
  info: ld("#3568d8", "#6ea2ff"),
  infoSoft: ld("rgba(53,104,216,.09)", "rgba(110,162,255,.14)"),
  // categorical
  c1: ld("#7e4fc4", "#a988ee"),
  c2: ld("#4a68ee", "#6d8cff"),
  c3: ld("#7fb0f3", "#9cc4ff"),
  c4: ld("#dba23c", "#f0c46b"),
  c5: ld("#df6457", "#ef7d70"),
  c6: ld("#38b688", "#6fd6aa"),
  c7: ld("#b9b9c2", "#5c5c68"),
});

export const radius = stylex.defineVars({
  xs: "4px", sm: "6px", md: "8px", lg: "10px", xl: "14px", xxl: "16px", pill: "999px",
});

export const font = stylex.defineVars({
  sans: '"Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
});

export const motion = stylex.defineVars({
  spring: "cubic-bezier(.34,1.56,.64,1)",
  ease: "cubic-bezier(.2,.7,.2,1)",
  fast: ".18s",
});

export const shadow = stylex.defineVars({
  // tactile bevel: dark outer ring + inner top highlight
  bevel: ld("0 0 0 1px rgba(14,14,26,.12), 0 1px 2px rgba(14,14,26,.08), inset 0 1px 0 rgba(255,255,255,.9)", "0 0 0 1px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.1), inset 0 0 0 1px rgba(255,255,255,.06)"),
  bevelFill: ld("0 1px 2px rgba(14,14,26,.18), 0 0 0 1px rgba(14,14,26,.25), inset 0 1px 0 rgba(255,255,255,.28), inset 0 -6px 12px rgba(0,0,0,.1)", "0 2px 4px rgba(0,0,0,.3), 0 0 0 1px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.28), inset 0 0 0 1px rgba(255,255,255,.12), inset 0 -6px 12px rgba(0,0,0,.14)"),
  bevelInv: ld("0 1px 2px rgba(14,14,26,.2), 0 0 0 1px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.16)", "0 2px 4px rgba(0,0,0,.3), 0 0 0 1px rgba(0,0,0,.5), inset 0 -6px 12px rgba(0,0,0,.08)"),
  lift: ld("0 1px 0 rgba(255,255,255,.9) inset, 0 1px 2px rgba(14,14,26,.08)", "0 1px 0 rgba(255,255,255,.04) inset, 0 1px 2px rgba(0,0,0,.45)"),
  card: ld("0 1px 2px rgba(14,14,26,.05), 0 10px 28px -18px rgba(14,14,26,.28)", "0 1px 2px rgba(0,0,0,.25)"),
  pop: ld("0 0 0 1px rgba(14,14,26,.13), 0 18px 40px -16px rgba(14,14,26,.3), 0 2px 6px rgba(14,14,26,.08)", "0 0 0 1px rgba(255,255,255,.11), 0 18px 44px -14px rgba(0,0,0,.85), 0 2px 6px rgba(0,0,0,.35)"),
});
