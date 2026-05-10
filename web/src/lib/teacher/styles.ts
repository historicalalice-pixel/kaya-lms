import type { CSSProperties } from "react";
import type { Tone } from "@/lib/types/teacher";

/**
 * Inline-style tokens used across teacher cabinet sections.
 *
 * These are intentionally kept as CSSProperties (not Tailwind classes) for now
 * to minimise diff during the section-split refactor. Migrating to Tailwind
 * happens incrementally per-section as we move them out of teacher/page.tsx.
 */

export const PAGE_MAX_WIDTH = 1680;

export const panel: CSSProperties = {
  borderRadius: 26,
  border: "1px solid rgba(201,169,110,0.20)",
  background:
    "linear-gradient(180deg, rgba(22,18,16,0.98) 0%, rgba(13,11,12,0.97) 100%)",
  boxShadow:
    "0 18px 40px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.04)",
};

export const inset: CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(201,169,110,0.16)",
  background: "rgba(23,19,17,0.72)",
};

export const sectionTitle: CSSProperties = {
  fontSize: "0.68rem",
  textTransform: "uppercase",
  letterSpacing: "0.22em",
  color: "rgba(162,141,96,0.78)",
};

export const button: CSSProperties = {
  minHeight: 38,
  borderRadius: 12,
  border: "1px solid rgba(201,169,110,0.18)",
  background: "rgba(255,255,255,0.02)",
  color: "rgba(223,217,207,0.82)",
  padding: "0 14px",
  fontSize: "0.72rem",
  letterSpacing: "0.10em",
  textTransform: "uppercase",
};

export const inputStyle: CSSProperties = {
  minHeight: 40,
  borderRadius: 12,
  border: "1px solid rgba(201,169,110,0.22)",
  background: "rgba(11,10,11,0.72)",
  color: "rgba(235,230,223,0.90)",
  padding: "0 14px",
  fontSize: "0.80rem",
};

export const navItemButton: CSSProperties = {
  width: "100%",
  textAlign: "left",
  justifyContent: "flex-start",
  minHeight: 52,
  padding: "8px 12px",
  borderRadius: 14,
  border: "1px solid rgba(201,169,110,0.16)",
  background: "rgba(18,15,14,0.60)",
  color: "rgba(231,225,216,0.90)",
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

export const navItemNote: CSSProperties = {
  fontSize: "0.68rem",
  color: "rgba(175,165,149,0.74)",
  lineHeight: 1.35,
};

const chipBase: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  borderRadius: 999,
  padding: "4px 10px",
  fontSize: "0.62rem",
  letterSpacing: "0.10em",
  textTransform: "uppercase",
};

const tones: Record<Tone, { bg: string; border: string; color: string }> = {
  gold: {
    bg: "rgba(201,169,110,0.10)",
    border: "1px solid rgba(201,169,110,0.22)",
    color: "rgba(230,202,148,0.95)",
  },
  green: {
    bg: "rgba(52,168,83,0.12)",
    border: "1px solid rgba(52,168,83,0.24)",
    color: "rgba(129,221,155,0.95)",
  },
  blue: {
    bg: "rgba(52,130,200,0.12)",
    border: "1px solid rgba(52,130,200,0.24)",
    color: "rgba(144,200,255,0.95)",
  },
  red: {
    bg: "rgba(220,80,60,0.12)",
    border: "1px solid rgba(220,80,60,0.24)",
    color: "rgba(244,150,138,0.96)",
  },
  gray: {
    bg: "rgba(150,145,136,0.12)",
    border: "1px solid rgba(150,145,136,0.22)",
    color: "rgba(206,202,195,0.90)",
  },
};

export function chip(tone: Tone): CSSProperties {
  return {
    ...chipBase,
    background: tones[tone].bg,
    border: tones[tone].border,
    color: tones[tone].color,
  };
}

export const table: CSSProperties = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: "0 10px",
};

export const th: CSSProperties = {
  textAlign: "left",
  padding: "0 12px",
  fontSize: "0.66rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "rgba(165,145,103,0.78)",
  fontWeight: 500,
};

export const row: CSSProperties = {
  background: "rgba(23,19,17,0.72)",
};

export const td: CSSProperties = {
  padding: "14px 12px",
  fontSize: "0.78rem",
  lineHeight: 1.45,
  color: "rgba(217,210,198,0.82)",
  verticalAlign: "top",
};
