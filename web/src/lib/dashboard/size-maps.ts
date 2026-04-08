import type { WidgetSize, GridBreakpoint } from "./dashboard-types";

// =====================================================
// Кількість колонок у grid для кожного брейкпоінта
// =====================================================

export const GRID_COLS: Record<GridBreakpoint, number> = {
  desktop: 12,
  tablet: 6,
  mobile: 1,
};

// =====================================================
// Брейкпоінти у пікселях (для react-grid-layout та matchMedia)
// =====================================================

export const GRID_BREAKPOINTS: Record<GridBreakpoint, number> = {
  desktop: 1280,
  tablet: 768,
  mobile: 0,
};

// =====================================================
// Мапінг розмірів віджета у ширину (cols) для кожного брейкпоінта
// =====================================================

const SIZE_TO_COLS: Record<GridBreakpoint, Record<WidgetSize, number>> = {
  desktop: {
    small: 3,
    medium: 6,
    wide: 9,
    full: 12,
  },
  tablet: {
    small: 3,
    medium: 6,
    wide: 6,
    full: 6,
  },
  mobile: {
    small: 1,
    medium: 1,
    wide: 1,
    full: 1,
  },
};

// =====================================================
// Висота за замовчуванням (у grid-рядках) для кожного розміру
// =====================================================

const SIZE_TO_HEIGHT: Record<WidgetSize, number> = {
  small: 4,
  medium: 4,
  wide: 4,
  full: 5,
};

// =====================================================
// Публічні утиліти
// =====================================================

/** Отримати ширину віджета (у cols) для конкретного брейкпоінта */
export function getWidgetWidth(size: WidgetSize, breakpoint: GridBreakpoint): number {
  return SIZE_TO_COLS[breakpoint][size];
}

/** Отримати висоту віджета (у grid-рядках) */
export function getWidgetHeight(size: WidgetSize): number {
  return SIZE_TO_HEIGHT[size];
}

/** Перелік усіх можливих розмірів — для UI вибору */
export const ALL_SIZES: WidgetSize[] = ["small", "medium", "wide", "full"];

/** Людські назви розмірів (українською) для UI */
export const SIZE_LABELS: Record<WidgetSize, string> = {
  small: "Малий",
  medium: "Середній",
  wide: "Широкий",
  full: "На всю ширину",
};