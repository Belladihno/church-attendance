import { Search } from 'lucide-react';
import { REASON_LABELS, type ReasonCategory } from './labels';

export type FollowUpTab = 'ALL' | 'PENDING' | 'CONTACTED' | 'RESOLVED' | 'CLOSED';

export type FollowUpFilters = {
  search: string;
  reason: ReasonCategory | '';
  assignedTo: string;
};

const TABS: { key: FollowUpTab; label: string }[] = [
  { key: 'ALL', label: 'All follow-ups' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'CONTACTED', label: 'Contacted' },
  { key: 'RESOLVED', label: 'Resolved' },
  { key: 'CLOSED', label: 'Closed' },
];

const tabBadge: Record<FollowUpTab, string> = {
  ALL: 'bg-white/20 text-white',
  PENDING: 'bg-pending-bg text-pending',
  CONTACTED: 'bg-contacted-bg text-contacted',
  RESOLVED: 'bg-present-bg text-present',
  CLOSED: 'bg-bg-base text-text-secondary/60',
};

export function FilterBar({
  tab,
  counts,
  onTab,
  filters,
  onFilters,
  assignees,
  shown,
}: {
  tab: FollowUpTab;
  counts: Record<FollowUpTab, number>;
  onTab: (t: FollowUpTab) => void;
  filters: FollowUpFilters;
  onFilters: (f: FollowUpFilters) => void;
  assignees: string[];
  shown: number;
}) {
  const set = (patch: Partial<FollowUpFilters>) => onFilters({ ...filters, ...patch });
  const selectCls =
    'h-9 px-3 pr-8 rounded-lg bg-bg-base text-text-primary text-[13px] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple/20 border border-transparent w-full';

  return (
    <div className="bg-bg-card rounded-xl shadow-card p-4 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
          {TABS.map((t) => {
            const isActive = t.key === tab;
            return (
              <button
                key={t.key}
                onClick={() => onTab(t.key)}
                className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${
                  isActive ? 'bg-brand-purple text-white font-semibold' : 'bg-bg-base text-text-secondary hover:text-text-primary'
                }`}
              >
                <span>{t.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] ${isActive && t.key === 'ALL' ? tabBadge.ALL : tabBadge[t.key]}`}>
                  {counts[t.key]}
                </span>
              </button>
            );
          })}
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-xs text-text-secondary whitespace-nowrap">
          <span>Auto-sync checks every Sunday 2:00 PM</span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 pt-2 border-t border-border/40">
        <div className="flex-1 flex items-center gap-3 flex-wrap">
          <div className="relative min-w-[220px] flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary/50" />
            <input
              value={filters.search}
              onChange={(e) => set({ search: e.target.value })}
              placeholder="Search by name, phone, reason..."
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-bg-base text-[13px] placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-brand-purple/20"
            />
          </div>
          <div className="relative min-w-[180px]">
            <select value={filters.reason} onChange={(e) => set({ reason: e.target.value as ReasonCategory | '' })} className={selectCls}>
              <option value="">All reasons</option>
              {(Object.keys(REASON_LABELS) as ReasonCategory[]).map((r) => (
                <option key={r} value={r}>{REASON_LABELS[r]}</option>
              ))}
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none text-xs">▾</span>
          </div>
          <div className="relative min-w-[160px]">
            <select value={filters.assignedTo} onChange={(e) => set({ assignedTo: e.target.value })} className={selectCls}>
              <option value="">All staff</option>
              {assignees.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none text-xs">▾</span>
          </div>
        </div>
        <div className="text-xs text-text-secondary/60 whitespace-nowrap">Displaying {shown} care records</div>
      </div>
    </div>
  );
}
