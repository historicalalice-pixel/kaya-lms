"use client";

import type { CSSProperties } from "react";
import { WIDGET_REGISTRY } from "@/lib/dashboard/widget-registry";
import type { DashboardLayoutItem } from "@/lib/dashboard/dashboard-types";

// =====================================================
// Стилі
// =====================================================

const overlay: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(8,6,8,0.72)",
  backdropFilter: "blur(4px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  zIndex: 100,
};

const modal: CSSProperties = {
  width: "100%",
  maxWidth: 640,
  maxHeight: "85vh",
  background: "rgba(20,16,22,0.96)",
  border: "1px solid rgba(201,169,110,0.32)",
  borderRadius: 16,
  padding: 22,
  display: "flex",
  flexDirection: "column",
  gap: 14,
  boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
  overflow: "hidden",
};

const headerRow: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
};

const title: CSSProperties = {
  fontSize: "1rem",
  fontWeight: 500,
  color: "rgba(230,202,148,0.96)",
  letterSpacing: "0.02em",
  margin: 0,
};

const closeBtn: CSSProperties = {
  fontSize: "0.74rem",
  padding: "6px 12px",
  borderRadius: 8,
  border: "1px solid rgba(201,169,110,0.28)",
  background: "rgba(201,169,110,0.06)",
  color: "rgba(229,223,212,0.86)",
  cursor: "pointer",
};

const list: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  overflowY: "auto",
  paddingRight: 4,
};

const card: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 12,
  padding: "12px 14px",
  background: "rgba(28,22,30,0.65)",
  border: "1px solid rgba(201,169,110,0.16)",
  borderRadius: 11,
};

const cardTitle: CSSProperties = {
  fontSize: "0.82rem",
  fontWeight: 500,
  color: "rgba(229,223,212,0.92)",
  margin: 0,
};

const cardDesc: CSSProperties = {
  fontSize: "0.7rem",
  color: "rgba(176,166,151,0.74)",
  marginTop: 4,
  lineHeight: 1.45,
};

const addBtn: CSSProperties = {
  fontSize: "0.72rem",
  padding: "6px 12px",
  borderRadius: 8,
  border: "1px solid rgba(201,169,110,0.45)",
  background: "rgba(201,169,110,0.16)",
  color: "rgba(230,202,148,0.96)",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const addBtnDisabled: CSSProperties = {
  ...addBtn,
  opacity: 0.45,
  cursor: "not-allowed",
};

// =====================================================
// Пропси
// =====================================================

type Props = {
  open: boolean;
  draftItems: DashboardLayoutItem[];
  onClose: () => void;
  onAdd: (widgetId: string) => void;
};

// =====================================================
// Компонент
// =====================================================

export default function AddWidgetPanel({ open, draftItems, onClose, onAdd }: Props) {
  if (!open) return null;

  const visibleWidgetIds = new Set(
    draftItems.filter((i) => i.visible).map((i) => i.widgetId)
  );

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <div style={headerRow}>
          <h2 style={title}>Додати блок</h2>
          <button type="button" style={closeBtn} onClick={onClose}>
            Закрити
          </button>
        </div>

        <div style={list}>
          {WIDGET_REGISTRY.map((widget) => {
            const alreadyVisible = visibleWidgetIds.has(widget.id);
            return (
              <div key={widget.id} style={card}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={cardTitle}>{widget.title}</p>
                  <p style={cardDesc}>{widget.description}</p>
                </div>
                <button
                  type="button"
                  style={alreadyVisible ? addBtnDisabled : addBtn}
                  disabled={alreadyVisible}
                  onClick={() => onAdd(widget.id)}
                >
                  {alreadyVisible ? "Уже доданий" : "Додати"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}