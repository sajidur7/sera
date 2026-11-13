/**
 * Accent presets. Apply one to any subtree:
 *   <div {...stylex.props(presets.ember)}>…</div>
 * or use <Theme preset="ember"> from utility.tsx.
 */
import * as stylex from "@stylexjs/stylex";
import { color } from "./tokens.stylex";

const ld = (light: string, dark: string) => `light-dark(${light}, ${dark})`;
const accent = (l: string, d: string, l2: string, d2: string, onL: string, onD: string) => ({
  accent: ld(l, d), accent2: ld(l2, d2), c1: ld(l, d), onAccent: ld(onL, onD),
  accentSoft: `color-mix(in srgb, ${ld(l, d)} 14%, transparent)`,
  accentLine: `color-mix(in srgb, ${ld(l, d)} 42%, transparent)`,
});

const violet = stylex.createTheme(color, accent("#7e4fc4", "#a988ee", "#6a3db0", "#9070dd", "#ffffff", "#150a26"));
const ember = stylex.createTheme(color, accent("#d4622f", "#f2915f", "#b9501f", "#e47c47", "#ffffff", "#2a1206"));
const moss = stylex.createTheme(color, accent("#3f8f2a", "#93d36b", "#2f7a1e", "#7fc055", "#ffffff", "#0f2408"));
const ocean = stylex.createTheme(color, accent("#2272c3", "#66b6ec", "#1a5fa6", "#4fa3dd", "#ffffff", "#04192b"));
const graphite = stylex.createTheme(color, accent("#2a2a30", "#e6e6ea", "#000000", "#ffffff", "#ffffff", "#0c0c0f"));

export const presets = { violet, ember, moss, ocean, graphite };
export type Preset = keyof typeof presets;
