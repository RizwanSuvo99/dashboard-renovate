'use client';
export function DividerWidget({ config }: { config: Record<string, unknown> }) {
  const c = config as { label?: string };
  if (c.label) {
    return (
      <div className="flex items-center gap-3 py-2 text-2xs uppercase tracking-wider text-fg-subtle">
        <span className="h-px flex-1 bg-border" />
        <span>{c.label}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
    );
  }
  return <hr className="border-border" />;
}
