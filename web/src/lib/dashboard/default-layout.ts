import type { DashboardLayoutItem, TeacherDashboardLayout } from "./dashboard-types";
import { makeWidgetInstanceId, normalizeLayout } from "./layout-utils";
import { DESKTOP_WIDTH_BY_SIZE } from "./size-maps";
import { widgetRegistry } from "./widget-registry";

export function buildDefaultLayout(): TeacherDashboardLayout {
  const items: DashboardLayoutItem[] = widgetRegistry
    .filter((widget) => widget.defaultVisible !== false)
    .map((widget, index) => ({
      id: makeWidgetInstanceId(widget.id),
      widgetId: widget.id,
      visible: true,
      size: widget.defaultSize,
      x: 0,
      y: 0,
      w: DESKTOP_WIDTH_BY_SIZE[widget.defaultSize],
      h: 4,
      order: index,
    }));

  return normalizeLayout({ version: 1, items });
}
