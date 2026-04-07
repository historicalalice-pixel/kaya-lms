import type { DashboardLayoutItem, TeacherDashboardLayout, WidgetSize } from "./dashboard-types";
import { DESKTOP_WIDTH_BY_SIZE, GRID_COLUMNS, widthForSize } from "./size-maps";

export function makeWidgetInstanceId(widgetId: string) {
  return `${widgetId}-${Math.random().toString(36).slice(2, 8)}`;
}

function packItems(items: DashboardLayoutItem[], columns: number): DashboardLayoutItem[] {
  let cursorX = 0;
  let cursorY = 0;
  let rowHeight = 0;

  return items.map((item, index) => {
    const width = widthForSize(item.size, columns);
    const height = item.h > 0 ? item.h : 4;

    if (cursorX + width > columns) {
      cursorX = 0;
      cursorY += rowHeight;
      rowHeight = 0;
    }

    const packed: DashboardLayoutItem = {
      ...item,
      x: cursorX,
      y: cursorY,
      w: width,
      h: height,
      order: index,
    };

    cursorX += width;
    rowHeight = Math.max(rowHeight, height);
    return packed;
  });
}

export function normalizeLayout(layout: TeacherDashboardLayout): TeacherDashboardLayout {
  const sorted = [...layout.items].sort((a, b) => a.order - b.order);
  return {
    version: 1,
    items: packItems(sorted, GRID_COLUMNS.desktop),
  };
}

export function moveItem(layout: TeacherDashboardLayout, draggedId: string, targetId: string): TeacherDashboardLayout {
  const items = [...layout.items].sort((a, b) => a.order - b.order);
  const draggedIndex = items.findIndex((item) => item.id === draggedId);
  const targetIndex = items.findIndex((item) => item.id === targetId);
  if (draggedIndex < 0 || targetIndex < 0 || draggedIndex === targetIndex) return layout;

  const [dragged] = items.splice(draggedIndex, 1);
  items.splice(targetIndex, 0, dragged);

  return normalizeLayout({ version: 1, items });
}

export function updateItemSize(layout: TeacherDashboardLayout, itemId: string, size: WidgetSize): TeacherDashboardLayout {
  const items = layout.items.map((item) =>
    item.id === itemId
      ? {
          ...item,
          size,
          w: DESKTOP_WIDTH_BY_SIZE[size],
        }
      : item,
  );
  return normalizeLayout({ version: 1, items });
}

export function setItemVisibility(layout: TeacherDashboardLayout, itemId: string, visible: boolean): TeacherDashboardLayout {
  const items = layout.items.map((item) => (item.id === itemId ? { ...item, visible } : item));
  return normalizeLayout({ version: 1, items });
}
