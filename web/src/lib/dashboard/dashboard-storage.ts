import type { TeacherDashboardLayout } from "./dashboard-types";

type DashboardPreferenceResponse = {
  layout: TeacherDashboardLayout | null;
};

export async function fetchTeacherDashboardLayout() {
  const response = await fetch("/api/teacher/dashboard", { cache: "no-store" });
  if (!response.ok) throw new Error("Не вдалося завантажити налаштування дашборду");
  return (await response.json()) as DashboardPreferenceResponse;
}

export async function saveTeacherDashboardLayout(layout: TeacherDashboardLayout) {
  const response = await fetch("/api/teacher/dashboard", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ layout }),
  });

  if (!response.ok) throw new Error("Не вдалося зберегти налаштування дашборду");
}

export async function resetTeacherDashboardLayout() {
  const response = await fetch("/api/teacher/dashboard", { method: "DELETE" });
  if (!response.ok) throw new Error("Не вдалося скинути налаштування дашборду");
}
