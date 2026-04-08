import { createClient } from "@/lib/supabase/client";
import type { DashboardLayout } from "./dashboard-types";
import { buildDefaultLayout, isValidLayout, LAYOUT_VERSION } from "./default-layout";

// =====================================================
// Назва таблиці у Supabase
// =====================================================

const TABLE = "teacher_dashboard_preferences";

// =====================================================
// Завантажити layout поточного вчителя
// =====================================================

/**
 * Повертає збережений layout вчителя.
 * Якщо запису ще немає або він пошкоджений — повертає дефолтний layout
 * (без запису в БД — запис створиться при першому збереженні).
 */
export async function loadDashboardLayout(teacherId: string): Promise<DashboardLayout> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from(TABLE)
    .select("layout_json")
    .eq("teacher_id", teacherId)
    .maybeSingle();

  if (error) {
    console.error("[dashboard-storage] loadDashboardLayout error:", error.message);
    return buildDefaultLayout();
  }

  if (!data || !data.layout_json) {
    return buildDefaultLayout();
  }

  if (!isValidLayout(data.layout_json)) {
    console.warn("[dashboard-storage] invalid layout in DB, falling back to default");
    return buildDefaultLayout();
  }

  return data.layout_json;
}

// =====================================================
// Зберегти layout поточного вчителя
// =====================================================

/**
 * Створює запис, якщо його не було, або оновлює існуючий.
 * Використовує upsert по teacher_id (бо teacher_id має unique constraint).
 */
export async function saveDashboardLayout(
  teacherId: string,
  layout: DashboardLayout
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = createClient();

  // Гарантуємо, що версія завжди актуальна
  const payload: DashboardLayout = {
    version: LAYOUT_VERSION,
    items: layout.items,
  };

  const { error } = await supabase
    .from(TABLE)
    .upsert(
      {
        teacher_id: teacherId,
        layout_json: payload,
      },
      { onConflict: "teacher_id" }
    );

  if (error) {
    console.error("[dashboard-storage] saveDashboardLayout error:", error.message);
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

// =====================================================
// Скинути layout до дефолтного
// =====================================================

/**
 * Видаляє запис вчителя з таблиці. При наступному завантаженні
 * loadDashboardLayout поверне свіжий дефолтний layout.
 */
export async function resetDashboardLayout(
  teacherId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = createClient();

  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("teacher_id", teacherId);

  if (error) {
    console.error("[dashboard-storage] resetDashboardLayout error:", error.message);
    return { ok: false, error: error.message };
  }

  return { ok: true };
}