export function EditDashboardToolbar({
  editMode,
  onStartEdit,
  onSave,
  onCancel,
  onReset,
  onOpenAddPanel,
  saving,
}: {
  editMode: boolean;
  saving: boolean;
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onReset: () => void;
  onOpenAddPanel: () => void;
}) {
  if (!editMode) {
    return (
      <button onClick={onStartEdit} className="rounded-xl border border-[rgba(201,169,110,0.35)] px-4 py-2 text-sm text-[rgba(238,224,195,0.96)] hover:bg-[rgba(201,169,110,0.1)]">
        Налаштувати дашборд
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button onClick={onOpenAddPanel} className="rounded-xl border border-[rgba(201,169,110,0.35)] px-4 py-2 text-sm text-[rgba(238,224,195,0.96)]">Додати блок</button>
      <button onClick={onSave} disabled={saving} className="rounded-xl border border-[rgba(89,160,106,0.42)] px-4 py-2 text-sm text-[rgba(174,238,188,0.96)] disabled:opacity-60">{saving ? "Збереження..." : "Зберегти"}</button>
      <button onClick={onCancel} className="rounded-xl border border-[rgba(201,169,110,0.22)] px-4 py-2 text-sm text-[rgba(233,225,210,0.86)]">Скасувати</button>
      <button onClick={onReset} className="rounded-xl border border-[rgba(220,80,60,0.32)] px-4 py-2 text-sm text-[rgba(245,171,160,0.92)]">Скинути до стандартного</button>
    </div>
  );
}
