/** Small helpers shared by every Sera component. */
import { useCallback, useState } from "react";
import type { StyleXStyles } from "@stylexjs/stylex";

/** Every component takes `xstyle` so callers can add StyleX styles on top. */
export type XStyle = StyleXStyles;

/** A value that can be controlled (value + onChange) or left to the component (defaultValue). */
export function useControllable<T>(value: T | undefined, fallback: T, onChange?: (v: T) => void) {
  const [inner, setInner] = useState<T>(fallback);
  const current = value === undefined ? inner : value;
  const set = useCallback((v: T) => { if (value === undefined) setInner(v); onChange?.(v); }, [value, onChange]);
  return [current, set] as const;
}
