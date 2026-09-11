import { Search } from 'lucide-react';
import type { FollowUpTab } from './FilterBar';
import { departmentLabel } from '../members/labels';

const TABS: { key: FollowUpTab; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'CONTACTED', label: 'Contacted' },
  { key: 'RESOLVED', label: 'Resolved' },
  { key: 'CLOSED', label: 'Closed' },
];

export function MobileTabs({
  tab,
  counts,
  onTab,
  search,
  onSearch,
  units,
  unit,
  onUnit,
}: {
  tab: FollowUpTab;
  counts: Record<FollowUpTab, number>;
  onTab: (t: FollowUpTab) => void;
  search: string;
  onSearch: (v: string) => void;
  units: string[];
  unit: string;
  onUnit: (u: string) => void;
}) {
  const unitLabel = (u: string) => (u === 'FIRST_TIMERS' ? 'First timers' : departmentLabel(u));

  return (
    <div className="flex flex-col gap-2.5">
      <div className="bg-bg-base/70 p-1 rounded-2xl flex items-center gap-1 border border-border/40 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {TABS.map((t) => {
          const isActive = t.key === tab;
          return (
            <button
              key={t.key}
              onClick={() => onTab(t.key)}
              className={`flex-1 py-1.5 px-2 rounded-xl text-[13px] flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
                isActive ? 'bg-white text-brand-purple font-semibold shadow-sm' : 'text-text-secondary font-medium'
              }`}
            >
              <span>{t.label}</span>
              <span className="px-1.5 rounded-full text-[11px] font-bold bg-bg-base text-text-secondary tabular-nums">{counts[t.key]}</span>
            </button>
          );
        })}
      </div>
      <div className="relative w-full">
        <Search size={18} className="absolute left-3.5 top-2.5 text-text-secondary/50" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search by name, phone or unit..."
          className="w-full h-10 pl-10 pr-3 text-[13px] bg-white text-text-primary rounded-xl border border-border/70 shadow-card placeholder:text-text-secondary/50 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
        />
      </div>
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[12px]" style={{ scrollbarWidth: 'none' }}>
        <button
          onClick={() => onUnit('all')}
          className={`px-3 py-1 rounded-full font-medium whitespace-nowrap shrink-0 ${
            unit === 'all' ? 'bg-brand-purple text-white' : 'bg-white text-text-secondary border border-border/60'
          }`}
        >
          All units
        </button>
        {units.map((u) => (
          <button
            key={u}
            onClick={() => onUnit(u)}
            className={`px-3 py-1 rounded-full whitespace-nowrap shrink-0 ${
              unit === u
                ? 'bg-brand-purple text-white font-medium'
                : 'bg-white text-text-secondary border border-border/60'
            }`}
          >
            {unitLabel(u)}
          </button>
        ))}
      </div>
    </div>
  );
}
