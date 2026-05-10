"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type {
  DashboardLayoutItem,
  GridBreakpoint,
  WidgetSize,
} from "@/lib/dashboard/dashboard-types";
import { GRID_COLS, getWidgetWidth } from "@/lib/dashboard/size-maps";
import DashboardWidgetShell from "./DashboardWidgetShell";

// =====================================================
// Хук для визначення поточного брейкпоінта
// (НЕ використовуємо Tailwind responsive класи — тільки matchMedia,
// як прийнято в проєкті KAYA, щоб уникнути проблем з SSR/Vercel)
// =====================================================

function useBreakpoint(): GridBreakpoint {
  const [bp, setBp] = useState<GridBreakpoint>("desktop");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const tabletQuery = window.matchMedia("(min-width: 768px)");

    const update = () => {
      if (desktopQuery.matches) setBp("desktop");
      else if (tabletQuery.matches) setBp("tablet");
      else setBp("mobile");
    };

    update();
    desktopQuery.addEventListener("change", update);
    tabletQuery.addEventListener("change", update);

    return () => {
      desktopQuery.removeEventListener("change", update);
      tabletQuery.removeEventListener("change", update);
    };
  }, []);

  return bp;
}

// =====================================================
// Стилі
// =====================================================

const grid = (totalCols: number): CSSProperties => ({
  display: "grid",
  gridTemplateColumns: `repeat(${totalCols}, minmax(0, 1fr))`,
  gap: 14,
});

// =====================================================
// Пропси
// =====================================================

type Props = {
  items: DashboardLayoutItem[];
  isEditing: boolean;
  onHide: (id: string) => void;
  onChangeSize: (id: string, size: WidgetSize) => void;
};

// =====================================================
// Компонент
// =====================================================

export default function DashboardGrid({ items, isEditing, onHide, onChangeSize }: Props) {
  const breakpoint = useBreakpoint();
  const totalCols = GRID_COLS[breakpoint];

  const visibleItems = items.filter((i) => i.visible);

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <div style={grid(totalCols)}>
      {visibleItems.map((item) => {
        const span = getWidgetWidth(item.size, breakpoint);
        return (
          <div key={item.id} style={{ gridColumn: `span ${span} / span ${span}` }}>
            <DashboardWidgetShell
              item={item}
              isEditing={isEditing}
              onHide={onHide}
              onChangeSize={onChangeSize}
            />
          </div>
        );
      })}
    </div>
  );
}