"use client";

import type { CSSProperties } from "react";

// =====================================================
// Стилі
// =====================================================

const wrap: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "12px 16px",
  background: "rgba(20,16,22,0.55)",
  border: "1px solid rgba(201,169,110,0.18)",
  borderRadius: 14,
};

const wrapEditing: CSSProperties = {
  ...wrap,
  border: "1px dashed rgba(201,169,110,0.42)",
  background: "rgba(28,22,30,0.65)",
};

const leftGroup: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const rightGroup: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
};

const label: CSSProperties = {
  fontSize: "0.78rem",
  color: "rgba(229,223,212,0.84)",
  letterSpacing: "0.02em",
};

const hint: CSSProperties = {
  fontSize: "0.7rem",
  color: "rgba(176,166,151,0.72)",
};

const baseBtn: CSSProperties = {
  fontSize: "0.74rem",
  padding: "7px 14px",
  borderRadius: 9,
  border: "1px solid rgba(201,169,110,0.28)",
  background: "rgba(201,169,110,0.06)",
  color: "rgba(229,223,212,0.92)",
  cursor: "pointer",
};

const primaryBtn: CSSProperties = {
  ...baseBtn,
  border: "1px solid rgba(201,169,110,0.55)",
  background: "rgba(201,169,110,0.18)",
  color: "rgba(230,202,148,0.96)",
};

const dangerBtn: CSSProperties = {
  ...baseBtn,
  border: "1px solid rgba(220,80,60,0.32)",
  background: "rgba(220,80,60,0.10)",
  color: "rgba(244,150,138,0.94)",
};

// =====================================================
// Пропси
// =====================================================

type Props = {
  isEditing: boolean;
  isSaving: boolean;
  onEnterEdit: () => void;
  onAddWidget: () => void;
  onSave: () => void;
  onCancel: () => void;
  onReset: () => void;
};

// =====================================================
// Компонент
// =====================================================

export default function EditDashboardToolbar({
  isEditing,
  isSaving,
  onEnterEdit,
  onAddWidget,
  onSave,
  onCancel,
  onReset,
}: Props) {
  if (!isEditing) {
    return (
      <div style={wrap}>
        <div style={leftGroup}>
          <span style={label}>Дашборд</span>
          <span style={hint}>Налаштовуйте блоки під свої задачі</span>
        </div>
        <div style={rightGroup}>
          <button type="button" style={primaryBtn} onClick={onEnterEdit}>
            Налаштувати дашборд
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={wrapEditing}>
      <div style={leftGroup}>
        <span style={label}>Режим редагування</span>
        <span style={hint}>Додавайте, змінюйте розмір і ховайте блоки</span>
      </div>
      <div style={rightGroup}>
        <button type="button" style={baseBtn} onClick={onAddWidget}>
          Додати блок
        </button>
        <button type="button" style={baseBtn} onClick={onReset}>
          Скинути до стандартного
        </button>
        <button type="button" style={baseBtn} onClick={onCancel} disabled={isSaving}>
          Скасувати
        </button>
        <button type="button" style={primaryBtn} onClick={onSave} disabled={isSaving}>
          {isSaving ? "Зберігаю..." : "Зберегти"}
        </button>
      </div>
    </div>
  );
}