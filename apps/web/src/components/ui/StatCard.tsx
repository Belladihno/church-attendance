import type { ReactNode } from 'react';

export function StatCard({ label, value, sub, icon }: { label: string; value: string | number; sub?: string; icon?: ReactNode }) {
  return (
    <div className="bg-bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-secondary">{label}</span>
        {icon && <span className="p-1.5 rounded-lg bg-bg-base text-text-secondary">{icon}</span>}
      </div>
      <div className="mt-3">
        <span className="text-2xl font-bold text-brand-purple tabular-nums">{value}</span>
        {sub && <div className="text-xs text-text-secondary mt-1">{sub}</div>}
      </div>
    </div>
  );
}
