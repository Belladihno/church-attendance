import { Search, X } from 'lucide-react';

export type MemberChip = 'all' | 'workers' | 'CHOIR' | 'USHERING' | 'care';

export function MobileMemberChips({
  search,
  onSearch,
  chip,
  onChip,
  counts,
}: {
  search: string;
  onSearch: (v: string) => void;
  chip: MemberChip;
  onChip: (c: MemberChip) => void;
  counts: { all: number; workers: number; choir: number; ushers: number; care: number };
}) {
  const chips: { key: MemberChip; label: string }[] = [
    { key: 'all', label: `All ${counts.all}` },
    { key: 'workers', label: `Workers ${counts.workers}` },
    { key: 'CHOIR', label: `Choir ${counts.choir}` },
    { key: 'USHERING', label: `Ushers ${counts.ushers}` },
    { key: 'care', label: `Needs Care ${counts.care}` },
  ];

  return (
    <div className="flex flex-col gap-2.5">
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-secondary/50">
          <Search size={19} />
        </div>
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search name, phone number, or unit..."
          className="w-full h-11 pl-10 pr-10 rounded-xl bg-white border border-border text-text-primary placeholder:text-text-secondary/50 text-[14px] focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15 shadow-card"
        />
        {search && (
          <button
            aria-label="Clear search"
            onClick={() => onSearch('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary/50 hover:text-text-primary"
          >
            <X size={17} />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
        {chips.map((c) => {
          const active = chip === c.key;
          return (
            <button
              key={c.key}
              onClick={() => onChip(c.key)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all shadow-sm ${
                active ? 'bg-brand-purple text-white' : 'bg-white border border-border text-text-secondary'
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
