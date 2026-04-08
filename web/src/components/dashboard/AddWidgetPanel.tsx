import type { DashboardWidgetDefinition } from "@/lib/dashboard/dashboard-types";

export function AddWidgetPanel({
  open,
  widgets,
  onAdd,
  onClose,
}: {
  open: boolean;
  widgets: DashboardWidgetDefinition[];
  onAdd: (widgetId: string) => void;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <aside className="rounded-2xl border border-[rgba(201,169,110,0.2)] bg-[rgba(16,14,14,0.96)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-serif text-xl text-[rgba(245,239,230,0.96)]">Додати блок</h3>
        <button onClick={onClose} className="text-sm text-[rgba(201,169,110,0.86)]">Закрити</button>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {widgets.map((widget) => (
          <button
            key={widget.id}
            onClick={() => onAdd(widget.id)}
            className="rounded-xl border border-[rgba(201,169,110,0.16)] bg-[rgba(23,19,17,0.72)] p-3 text-left hover:border-[rgba(201,169,110,0.36)]"
          >
            <p className="text-sm text-[rgba(240,232,217,0.94)]">{widget.title}</p>
            <p className="mt-1 text-xs text-[rgba(186,173,149,0.82)]">{widget.description}</p>
          </button>
        ))}
      </div>
    </aside>
  );
}
