import type { DashboardLayout, DashboardLayoutItem } from "./dashboard-types";
import { WIDGET_REGISTRY } from "./widget-registry";
import { GRID_COLS, getWidgetWidth, getWidgetHeight } from "./size-maps";

// =====================================================
// Поточна версія схеми layout
// (інкрементувати, якщо колись зміниться структура DashboardLayoutItem)
// =====================================================

export const LAYOUT_VERSION = 1;

// =====================================================
// Згенерувати дефолтний layout для нового вчителя
// =====================================================

/**
 * Бере всі віджети з registry, у яких defaultVisible !== false,
 * і розкладає їх у desktop-grid (12 cols) рядок за рядком.
 * react-grid-layout сам адаптує позиції під tablet/mobile у runtime.
 */
export function buildDefaultLayout(): DashboardLayout {
  const desktopCols = GRID_COLS.desktop;
  const items: DashboardLayoutItem[] = [];

  let cursorX = 0;
  let cursorY = 0;
  let rowMaxHeight = 0;

  for (const widget of WIDGET_REGISTRY) {
    if (widget.defaultVisible === false) continue;

    const w = getWidgetWidth(widget.defaultSize, "desktop");
    const h = getWidgetHeight(widget.defaultSize);

    // Якщо віджет не вміщається у поточний рядок — переходимо на новий
    if (cursorX + w > desktopCols) {
      cursorX = 0;
      cursorY += rowMaxHeight;
      rowMaxHeight = 0;
    }

    items.push({
      id: `${widget.id}-1`,
      widgetId: widget.id,
      visible: true,
      size: widget.defaultSize,
      x: cursorX,
      y: cursorY,
      w,
      h,
    });

    cursorX += w;
    if (h > rowMaxHeight) rowMaxHeight = h;

    // Дійшли до кінця рядка — переносимо курсор на новий рядок
    if (cursorX >= desktopCols) {
      cursorX = 0;
      cursorY += rowMaxHeight;
      rowMaxHeight = 0;
    }
  }

  return {
    version: LAYOUT_VERSION,
    items,
  };
}

// =====================================================
// Створити порожній layout (для повного скидання)
// =====================================================

export function buildEmptyLayout(): DashboardLayout {
  return {
    version: LAYOUT_VERSION,
    items: [],
  };
}

// =====================================================
// Перевірка валідності layout (на випадок старих/пошкоджених даних із БД)
// =====================================================

export function isValidLayout(value: unknown): value is DashboardLayout {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  if (typeof obj.version !== "number") return false;
  if (!Array.isArray(obj.items)) return false;
  return true;
}