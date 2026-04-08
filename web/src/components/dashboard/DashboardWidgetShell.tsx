"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import type { DashboardLayoutItem, WidgetSize } from "@/lib/dashboard/dashboard-types";
import { getWidgetDefinition } from "@/lib/dashboard/widget-registry";
import { ALL_SIZES, SIZE_LABELS } from "@/lib/dashboard/size-maps";

// =====================================================
// Стилі (відповідають загальному стилю KAYA)
// =====================================================

const shell: CSSProperties = {
  background: "rgba(20,16,22,0.55)",
  border: "1px solid rgba(201,169,110,0.18)",
  borderRadius: 14,
  padding: 18,
  display: "flex",
  flexDirection: "column",
  gap: 10,
  height: "100%",
  boxShadow: "inset 0 0 24px rgba(201,169,110,0.04)",
};

const shellEditing: CSSProperties = {
  ...shell,
  border: "1px dashed rgba(201,169,110,0.42)",
  background: "rgba(28,22,30,0.65)",
};

const headerRow: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 10,
  paddingBottom: 8,
  borderBottom: "1px solid rgba(201,169,110,0.12)",
};

const title: CSSProperties = {
  fontSize: "0.85rem",
  fontWeight: 500,
  letterSpacing: "0.02em",
  color: "rgba(230,202,148,0.94)",
  margin: 0,
};

const actionsRow: CSSProperties = {
  display: "flex",
  gap: 6,
  alignItems: "center",
  flexWrap: "wrap",
};

const smallBtn: CSSProperties = {
  fontSize: "0.68rem",
  padding: "4px 9px",
  borderRadius: 8,
  border: "1px solid rgba(201,169,110,0.28)",
  background: "rgba(201,169,110,0.06)",
  color: "rgba(229,223,212,0.86)",
  cursor: "pointer",
};

const dangerBtn: CSSProperties = {
  ...smallBtn,
  border: "1px solid rgba(220,80,60,0.32)",
  background: "rgba(220,80,60,0.10)",
  color: "rgba(244,150,138,0.94)",
};

// =====================================================
// Пропси
// =====================================================

type Props = {
  item: DashboardLayoutItem;
  isEditing: boolean;
  onHide: (id: string) => void;
  onChangeSize: (id: string, size: WidgetSize) => void;
};

// =====================================================
// Компонент
// =====================================================

export default function DashboardWidgetShell({ item, isEditing, onHide, onChangeSize }: Props) {
  const [showSizeMenu, setShowSizeMenu] = useState(false);

  const definition = getWidgetDefinition(item.widgetId);

  if (!definition) {
    return (
      <div style={shell}>
        <p style={{ fontSize: "0.75rem", color: "rgba(244,150,138,0.9)" }}>
          Невідомий блок: {item.widgetId}
        </p>
      </div>
    );
  }

  const WidgetComponent = definition.component;

  return (
    <div style={isEditing ? shellEditing : shell}>
      <div style={headerRow}>
        <h3 style={title}>{definition.title}</h3>

        {isEditing ? (
          <div style={actionsRow}>
            <button
              type="button"
              style={smallBtn}
              onClick={() => setShowSizeMenu((v) => !v)}
            >
              {SIZE_LABELS[item.size]} ▾
            </button>
            <button
              type="button"
              style={dangerBtn}
              onClick={() => onHide(item.id)}
            >
              Сховати
            </button>
          </div>
        ) : null}
      </div>

      {isEditing && showSizeMenu ? (
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            padding: "6px 0",
          }}
        >
          {ALL_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              style={{
                ...smallBtn,
                ...(size === item.size
                  ? {
                      background: "rgba(201,169,110,0.18)",
                      borderColor: "rgba(201,169,110,0.5)",
                    }
                  : {}),
              }}
              onClick={() => {
                onChangeSize(item.id, size);
                setShowSizeMenu(false);
              }}
            >
              {SIZE_LABELS[size]}
            </button>
          ))}
        </div>
      ) : null}

      <div style={{ flex: 1, minHeight: 0 }}>
        <WidgetComponent instanceId={item.id} />
      </div>
    </div>
  );
}