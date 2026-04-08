"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AddWidgetPanel } from "./AddWidgetPanel";
import { DashboardGrid } from "./DashboardGrid";
import { EditDashboardToolbar } from "./EditDashboardToolbar";
import type { TeacherDashboardLayout, WidgetSize } from "@/lib/dashboard/dashboard-types";
import { widgetRegistry, widgetRegistryMap } from "@/lib/dashboard/widget-registry";
import { buildDefaultLayout } from "@/lib/dashboard/default-layout";
import { fetchTeacherDashboardLayout, resetTeacherDashboardLayout, saveTeacherDashboardLayout } from "@/lib/dashboard/dashboard-storage";
import { makeWidgetInstanceId, moveItem, normalizeLayout, setItemVisibility, updateItemSize } from "@/lib/dashboard/layout-utils";
import { DESKTOP_WIDTH_BY_SIZE } from "@/lib/dashboard/size-maps";

export function TeacherDashboardBuilder() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [persistedLayout, setPersistedLayout] = useState<TeacherDashboardLayout | null>(null);
  const [draftLayout, setDraftLayout] = useState<TeacherDashboardLayout | null>(null);

  const [editMode, setEditMode] = useState(false);
  const [addPanelOpen, setAddPanelOpen] = useState(false);

  const loadLayout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { layout } = await fetchTeacherDashboardLayout();
      const ready = layout ? normalizeLayout(layout) : buildDefaultLayout();
      setPersistedLayout(ready);
      setDraftLayout(ready);
    } catch (loadError) {
      const fallback = buildDefaultLayout();
      setPersistedLayout(fallback);
      setDraftLayout(fallback);
      setError(loadError instanceof Error ? loadError.message : "Помилка завантаження дашборду");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLayout();
  }, [loadLayout]);

  const activeLayout = editMode ? draftLayout : persistedLayout;

  const hiddenWidgets = useMemo(() => {
    const current = activeLayout?.items ?? [];
    const visibleWidgetIds = new Set(current.filter((item) => item.visible).map((item) => item.widgetId));
    return widgetRegistry.filter((widget) => !visibleWidgetIds.has(widget.id));
  }, [activeLayout]);

  const enterEdit = () => {
    if (!persistedLayout) return;
    setDraftLayout(structuredClone(persistedLayout));
    setEditMode(true);
  };

  const cancelEdit = () => {
    setDraftLayout(persistedLayout ? structuredClone(persistedLayout) : null);
    setAddPanelOpen(false);
    setEditMode(false);
  };

  const saveEdit = async () => {
    if (!draftLayout) return;
    setSaving(true);
    setError(null);
    try {
      const normalized = normalizeLayout(draftLayout);
      await saveTeacherDashboardLayout(normalized);
      setPersistedLayout(normalized);
      setDraftLayout(structuredClone(normalized));
      setEditMode(false);
      setAddPanelOpen(false);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Помилка збереження");
    } finally {
      setSaving(false);
    }
  };

  const resetToDefault = async () => {
    const fresh = buildDefaultLayout();
    if (!editMode) {
      setSaving(true);
      try {
        await resetTeacherDashboardLayout();
        await saveTeacherDashboardLayout(fresh);
        setPersistedLayout(fresh);
        setDraftLayout(structuredClone(fresh));
      } finally {
        setSaving(false);
      }
      return;
    }

    setDraftLayout(fresh);
  };

  const updateDraft = (updater: (prev: TeacherDashboardLayout) => TeacherDashboardLayout) => {
    setDraftLayout((prev) => {
      if (!prev) return prev;
      return updater(prev);
    });
  };

  const addWidget = (widgetId: string) => {
    if (!editMode) return;
    const definition = widgetRegistryMap.get(widgetId);
    if (!definition) return;

    updateDraft((prev) => {
      const nextItems = [
        ...prev.items,
        {
          id: makeWidgetInstanceId(widgetId),
          widgetId,
          visible: true,
          size: definition.defaultSize,
          x: 0,
          y: 0,
          w: DESKTOP_WIDTH_BY_SIZE[definition.defaultSize],
          h: 4,
          order: prev.items.length,
        },
      ];
      return normalizeLayout({ version: 1, items: nextItems });
    });
  };

  const visibleItemsCount = activeLayout?.items.filter((item) => item.visible).length ?? 0;

  if (loading || !activeLayout) {
    return <div className="rounded-2xl border border-[rgba(201,169,110,0.2)] bg-[rgba(16,14,14,0.9)] p-6 text-[rgba(235,226,210,0.86)]">Завантаження дашборду...</div>;
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[rgba(201,169,110,0.2)] bg-[rgba(16,14,14,0.92)] p-4">
        <div>
          <h2 className="font-serif text-2xl text-[rgba(245,239,230,0.96)]">Конструктор дашборду</h2>
          <p className="text-sm text-[rgba(194,181,156,0.84)]">Персональне компонування блоків для викладача</p>
        </div>

        <EditDashboardToolbar
          editMode={editMode}
          saving={saving}
          onStartEdit={enterEdit}
          onSave={() => void saveEdit()}
          onCancel={cancelEdit}
          onReset={() => void resetToDefault()}
          onOpenAddPanel={() => setAddPanelOpen(true)}
        />
      </div>

      {error ? <p className="rounded-xl border border-[rgba(220,80,60,0.3)] bg-[rgba(53,22,20,0.7)] px-3 py-2 text-sm text-[rgba(247,173,165,0.95)]">{error}</p> : null}

      <AddWidgetPanel
        open={editMode && addPanelOpen}
        widgets={hiddenWidgets}
        onAdd={(widgetId) => addWidget(widgetId)}
        onClose={() => setAddPanelOpen(false)}
      />

      {visibleItemsCount === 0 ? (
        <div className="rounded-2xl border border-dashed border-[rgba(201,169,110,0.28)] bg-[rgba(16,14,14,0.9)] p-8 text-center">
          <p className="text-[rgba(236,228,212,0.9)]">У дашборді немає видимих блоків.</p>
          <div className="mt-4 flex justify-center gap-2">
            {editMode ? <button onClick={() => setAddPanelOpen(true)} className="rounded-lg border border-[rgba(201,169,110,0.35)] px-4 py-2 text-sm text-[rgba(238,224,195,0.96)]">Додати блок</button> : null}
            <button onClick={() => void resetToDefault()} className="rounded-lg border border-[rgba(220,80,60,0.32)] px-4 py-2 text-sm text-[rgba(245,171,160,0.92)]">Скинути до стандартного</button>
          </div>
        </div>
      ) : (
        <DashboardGrid
          editMode={editMode}
          items={activeLayout.items}
          widgets={widgetRegistryMap}
          onMove={(draggedId, targetId) => {
            if (!editMode) return;
            updateDraft((prev) => moveItem(prev, draggedId, targetId));
          }}
          onHide={(id) => {
            if (!editMode) return;
            updateDraft((prev) => setItemVisibility(prev, id, false));
          }}
          onResize={(id, size) => {
            if (!editMode) return;
            updateDraft((prev) => updateItemSize(prev, id, size as WidgetSize));
          }}
        />
      )}
    </section>
  );
}
