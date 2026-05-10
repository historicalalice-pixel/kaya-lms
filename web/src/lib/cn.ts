/**
 * Tiny class-name joiner. Accepts anything (so callers can use
 * `cond && "class"` even when `cond` is ReactNode-typed) and keeps
 * only non-empty strings.
 */
export function cn(...classes: unknown[]): string {
  return classes
    .filter((c): c is string => typeof c === "string" && c.length > 0)
    .join(" ");
}
