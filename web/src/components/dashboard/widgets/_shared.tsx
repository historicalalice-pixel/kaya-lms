export function WidgetPlaceholder({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="h-full rounded-2xl border border-[rgba(201,169,110,0.20)] bg-[rgba(20,17,16,0.92)] p-4">
      <h4 className="font-serif text-lg text-[rgba(245,239,230,0.96)]">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-[rgba(224,216,205,0.78)]">
        {lines.map((line) => (
          <li key={line} className="rounded-lg border border-[rgba(201,169,110,0.16)] bg-[rgba(11,10,11,0.62)] px-3 py-2">{line}</li>
        ))}
      </ul>
    </div>
  );
}
