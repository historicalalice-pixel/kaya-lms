import type { ReactNode } from "react";
import type { DashboardLayoutItem, WidgetSize } from "@/lib/dashboard/dashboard-types";

const sizeLabels: Record<WidgetSize, string> = {
  small: "S",
  medium: "M",
  wide: "W",
  full: "F",
};

export function DashboardWidgetShell({
  title,
  item,
  editMode,
  children,
  onHide,
  onResize,
}: {
  title: string;
  item: DashboardLayoutItem;
  editMode: boolean;
  children: ReactNode;
  onHide: () => void;
  onResize: (size: WidgetSize) => void;
}) {
  return (
    <article className={`h-full rounded-2xl border border-[rgba(201,169,110,0.22)] bg-[rgba(14,12,12,0.9)] shadow-[0_14px_36px_rgba(0,0,0,0.24)] ${editMode ? "ring-1 ring-[rgba(201,169,110,0.24)]" : ""}`}>
      {editMode && (
        <header className="flex items-center justify-between border-b border-[rgba(201,169,110,0.14)] px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="cursor-grab rounded-md border border-[rgba(201,169,110,0.24)] px-2 py-1 text-[10px] tracking-[0.2em] text-[rgba(220,204,176,0.82)]">↕ DRAG</span>
            <p className="text-xs text-[rgba(235,226,210,0.86)]">{title}</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              aria-label="Розмір віджета"
              value={item.size}
              onChange={(event) => onResize(event.target.value as WidgetSize)}
              className="rounded-md border border-[rgba(201,169,110,0.24)] bg-[rgba(23,19,17,0.94)] px-2 py-1 text-xs text-[rgba(233,225,210,0.9)]"
            >
              {Object.entries(sizeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <button onClick={onHide} className="rounded-md border border-[rgba(220,80,60,0.38)] px-2 py-1 text-xs text-[rgba(245,171,160,0.92)]">Сховати</button>
          </div>
        </header>
      )}
      <div className="h-full p-3">{children}</div>
    </article>
  );
}
