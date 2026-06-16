import type { ReactNode } from "react";

export function SpecBadge({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="bg-surface2 border border-border rounded-none px-3 py-2.5 flex flex-col gap-1.5 min-w-0">
      <div className="flex items-center gap-1.5 text-muted">
        <span className="shrink-0 opacity-75">{icon}</span>
        <span className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.09em] leading-none truncate">{label}</span>
      </div>
      <div className="font-mono text-[0.6875rem] sm:text-[0.75rem] font-medium text-ink leading-tight truncate" title={value}>
        {value}
      </div>
    </div>
  );
}
