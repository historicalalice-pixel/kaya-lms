"use client";

import { useCallback, useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { createClient } from "@/lib/supabase/client";
import type {
  DashboardLayout,
  DashboardLayoutItem,
  WidgetSize,
} from "@/lib/dashboard/dashboard-types";
import {
  loadDashboardLayout,
  saveDashboardLayout,
  resetDashboardLayout,
} from "@/lib/dashboard/dashboard-storage";
import { buildDefaultLayout } from "@/lib/dashboard/default-layout";
import { getWidgetDefinition } from "@/lib/dashboard/widget-registry";
import { getWidgetWidth, getWidgetHeight } from "@/lib/dashboard/size-maps";
import EditDashboardToolbar from "./EditDashboardToolbar";
import AddWidgetPanel from "./AddWidgetPanel";
import DashboardGrid from "./DashboardGrid";

// =====================================================
// Стилі
// =====================================================

const wrap: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const empty: CSSProperties = {
  padding: "32px 20px",
  textAlign: "center",
  background: "rgba(20,16,22,0.55)",
  border: "1px dashed rgba(201,169,110,0.28)",
  borderRadius: 14,
  color: "rgba(176,166,151,0.82)",
  fontSize: "0.82rem",
};

const errorBox: CSSProperties = {
  padding: "10px 14px",
  background: "rgba(220,80,60,0.10)",
  border: "1px solid rgba(220,80,60,0.32)",
  borderRadius: 10,
  color: "rgba(244,150,138,0.96)",
  fontSize: "0.74rem",
};

// =====================================================
// Хелпер: додати новий віджет у draft
// =====================================================

function addWidgetToDraft(
  draft: DashboardLayoutItem[],
  widgetId: string
): DashboardLayoutItem[] {
  const definition = getWidgetDefinition(widgetId);
  if (!definition) return draft;

  // Якщо віджет уже існує в draft (як прихований) — просто показати його
  const existing = draft.find((i) => i.widgetId === widgetId);
  if (existing) {
    return draft.map((i) => (i.id === existing.id ? { ...i, visible: true } : i));
  }

  // Інакше створити новий екземпляр
  const newItem: DashboardLayoutItem = {
    id: `${widgetId}-${Date.now()}`,
    widgetId,
    visible: true,
    size: definition.defaultSize,
    x: 0,
    y: Number.MAX_SAFE_INTEGER, // в кінець
    w: getWidgetWidth(definition.defaultSize, "desktop"),
    h: getWidgetHeight(definition.defaultSize),
  };
  return [...draft, newItem];
}

// =====================================================
// Компонент
// =====================================================

export default function TeacherDashboardBuilder() {
  console.log("[Builder] rendered");
  const [persistedLayout, setPersistedLayout] = useState<DashboardLayout | null>(null);
  const [draftItems, setDraftItems] = useState<DashboardLayoutItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [teacherId, setTeacherId] = useState<string | null>(null);

  // -----------------------------------------------------
  // Завантаження поточного користувача + layout
  // -----------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        if (!cancelled) {
          setIsLoading(false);
          setErrorMsg("Не вдалося визначити користувача");
        }
        return;
      }

      const layout = await loadDashboardLayout(user.id);

      if (!cancelled) {
        setTeacherId(user.id);
        setPersistedLayout(layout);
        setDraftItems(layout.items);
        setIsLoading(false);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  // -----------------------------------------------------
  // Дії edit-режиму
  // -----------------------------------------------------

  const enterEdit = useCallback(() => {
    if (persistedLayout) {
      setDraftItems(persistedLayout.items);
    }
    setIsEditing(true);
    setErrorMsg(null);
  }, [persistedLayout]);

  const cancelEdit = useCallback(() => {
    if (persistedLayout) {
      setDraftItems(persistedLayout.items);
    }
    setIsEditing(false);
    setIsAddPanelOpen(false);
    setErrorMsg(null);
  }, [persistedLayout]);

  const handleSave = useCallback(async () => {
    if (!teacherId) return;
    setIsSaving(true);
    setErrorMsg(null);

    const newLayout: DashboardLayout = {
      version: persistedLayout?.version ?? 1,
      items: draftItems,
    };

    const result = await saveDashboardLayout(teacherId, newLayout);

    setIsSaving(false);
    if (!result.ok) {
      setErrorMsg("Не вдалося зберегти: " + result.error);
      return;
    }

    setPersistedLayout(newLayout);
    setIsEditing(false);
    setIsAddPanelOpen(false);
  }, [teacherId, draftItems, persistedLayout]);

  const handleReset = useCallback(async () => {
    if (!teacherId) return;
    setIsSaving(true);
    setErrorMsg(null);

    const result = await resetDashboardLayout(teacherId);
    if (!result.ok) {
      setIsSaving(false);
      setErrorMsg("Не вдалося скинути: " + result.error);
      return;
    }

    const fresh = buildDefaultLayout();
    setPersistedLayout(fresh);
    setDraftItems(fresh.items);
    setIsSaving(false);
    setIsEditing(false);
    setIsAddPanelOpen(false);
  }, [teacherId]);

  // -----------------------------------------------------
  // Дії над окремими віджетами (тільки в draft)
  // -----------------------------------------------------

  const handleHide = useCallback((id: string) => {
    setDraftItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, visible: false } : i))
    );
  }, []);

  const handleChangeSize = useCallback((id: string, size: WidgetSize) => {
    setDraftItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              size,
              w: getWidgetWidth(size, "desktop"),
              h: getWidgetHeight(size),
            }
          : i
      )
    );
  }, []);

  const handleAdd = useCallback((widgetId: string) => {
    setDraftItems((prev) => addWidgetToDraft(prev, widgetId));
    setIsAddPanelOpen(false);
  }, []);

  // -----------------------------------------------------
  // Render
  // -----------------------------------------------------

  if (isLoading) {
    return <div style={empty}>Завантаження дашборду...</div>;
  }

  // Те, що ми зараз показуємо: у edit-режимі — draft, інакше — persisted
  const itemsToRender = isEditing ? draftItems : persistedLayout?.items ?? [];
  const hasVisible = itemsToRender.some((i) => i.visible);

  return (
    <div style={wrap}>
      <EditDashboardToolbar
        isEditing={isEditing}
        isSaving={isSaving}
        onEnterEdit={enterEdit}
        onAddWidget={() => setIsAddPanelOpen(true)}
        onSave={handleSave}
        onCancel={cancelEdit}
        onReset={handleReset}
      />

      {errorMsg ? <div style={errorBox}>{errorMsg}</div> : null}

      {hasVisible ? (
        <DashboardGrid
          items={itemsToRender}
          isEditing={isEditing}
          onHide={handleHide}
          onChangeSize={handleChangeSize}
        />
      ) : (
        <div style={empty}>
          Усі блоки приховано. Натисніть «Додати блок» або «Скинути до стандартного».
        </div>
      )}

      <AddWidgetPanel
        open={isAddPanelOpen}
        draftItems={draftItems}
        onClose={() => setIsAddPanelOpen(false)}
        onAdd={handleAdd}
      />
    </div>
  );
}