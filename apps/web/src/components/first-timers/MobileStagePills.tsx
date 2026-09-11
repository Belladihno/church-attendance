import { Search } from 'lucide-react';
import type { PipelineTab, TabCounts } from './PipelineTabs';

const PILLS: { key: PipelineTab; label: (c: TabCounts) => string }[] = [
  { key: 'ALL', label: (c) => `All ${c.ALL}` },
  { key: 'PENDING', label: (c) => `Pending ${c.PENDING}` },
  { key: 'CONTACTED', label: (c) => `In Follow-up ${c.CONTACTED}` },
  { key: 'CONVERTED', label: (c) => `Converted ${c.CONVERTED}` },
  { key: 'CLOSED', label: (c) => `Archived ${c.CLOSED}` },
];

export function MobileStagePills({
  active,
  counts,
  onChange,
  search,
  onSearch,
}: {
  active: PipelineTab;
  counts: TabCounts;
  onChange: (t: PipelineTab) => void;
  search: string;
  onSearch: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="relative flex items-center bg-white rounded-xl shadow-card border border-border/40 px-3.5 py-2.5 gap-2.5">
        <Search size={19} className="text-text-secondary/50 shrink-0" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search visitor name or inviter..."
          className="w-full bg-transparent text-[14px] text-text-primary placeholder:text-text-secondary/50 outline-none"
        />
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {PILLS.map((p) => {
          const isActive = p.key === active;
          return (
            <button
              key={p.key}
              onClick={() => onChange(p.key)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] shadow-sm transition-all ${
                isActive
                  ? 'bg-brand-purple text-white font-medium'
                  : 'bg-white text-text-secondary font-medium border border-border/50'
              }`}
            >
              {p.label(counts)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
