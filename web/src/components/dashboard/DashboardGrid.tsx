import { useMemo, useState } from "react";
import type { DashboardLayoutItem, DashboardWidgetDefinition } from "@/lib/dashboard/dashboard-types";
import { widthForSize } from "@/lib/dashboard/size-maps";
import { DashboardWidgetShell } from "./DashboardWidgetShell";

function useColumns() {
  if (typeof window === "undefined") return 12;
  if (window.innerWidth < 768) return 1;
  if (window.innerWidth < 1280) return 6;
  return 12;
}

export function DashboardGrid({
  editMode,
  items,
  widgets,
  onMove,
  onHide,
  onResize,
}: {
  editMode: boolean;
  items: DashboardLayoutItem[];
  widgets: Map<string, DashboardWidgetDefinition>;
  onMove: (draggedId: string, targetId: string) => void;
  onHide: (id: string) => void;
  onResize: (id: string, size: DashboardLayoutItem["size"]) => void;
}) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const columns = useColumns();

  const visibleItems = useMemo(
    () => [...items].filter((item) => item.visible).sort((a, b) => a.order - b.order),
    [items],
  );

  const spanClass = (cols: number, span: number) => {
    if (cols === 1) return "col-span-1";
    const map6: Record<number, string> = { 1: "md:col-span-1", 2: "md:col-span-2", 3: "md:col-span-3", 4: "md:col-span-4", 5: "md:col-span-5", 6: "md:col-span-6" };
    const map12: Record<number, string> = {
      1: "xl:col-span-1",
      2: "xl:col-span-2",
      3: "xl:col-span-3",
      4: "xl:col-span-4",
      5: "xl:col-span-5",
      6: "xl:col-span-6",
      7: "xl:col-span-7",
      8: "xl:col-span-8",
      9: "xl:col-span-9",
      10: "xl:col-span-10",
      11: "xl:col-span-11",
      12: "xl:col-span-12",
    };
    return `${map6[Math.min(span, 6)] ?? "md:col-span-6"} ${map12[Math.min(span, 12)] ?? "xl:col-span-12"}`;
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-6 xl:grid-cols-12">
      {visibleItems.map((item) => {
        const widget = widgets.get(item.widgetId);
        if (!widget) return null;
        const WidgetComponent = widget.component;
        const span = widthForSize(item.size, columns);

        return (
          <div
            key={item.id}
            draggable={editMode}
            onDragStart={() => setDraggingId(item.id)}
            onDragOver={(event) => {
              if (!editMode) return;
              event.preventDefault();
            }}
            onDrop={() => {
              if (!editMode || !draggingId || draggingId === item.id) return;
              onMove(draggingId, item.id);
              setDraggingId(null);
            }}
            className={spanClass(columns, span)}
          >
            <DashboardWidgetShell
              title={widget.title}
              item={item}
              editMode={editMode}
              onHide={() => onHide(item.id)}
              onResize={(size) => onResize(item.id, size)}
            >
              <WidgetComponent />
            </DashboardWidgetShell>
          </div>
        );
      })}
    </div>
  );
}
