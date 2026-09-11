import { Search } from 'lucide-react';

export type FirstTimerFilters = {
  search: string;
  service: string;
  gender: string;
};

export function Toolbar({
  filters,
  onChange,
  monthLabel,
}: {
  filters: FirstTimerFilters;
  onChange: (f: FirstTimerFilters) => void;
  monthLabel: string;
}) {
  const set = (patch: Partial<FirstTimerFilters>) => onChange({ ...filters, ...patch });
  const selectCls =
    'h-10 px-3 pr-8 rounded-lg bg-bg-base text-text-primary text-[13px] appearance-none cursor-pointer focus:bg-bg-card focus:outline-none focus:ring-2 focus:ring-brand-purple/20 border border-transparent focus:border-brand-purple';

  return (
    <div className="p-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1">
        <div className="relative w-full max-w-md">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary/50" />
          <input
            value={filters.search}
            onChange={(e) => set({ search: e.target.value })}
            placeholder="Search visitor by name, phone number, invited by..."
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-bg-base text-sm text-text-primary placeholder:text-text-secondary/50 focus:bg-bg-card focus:outline-none focus:ring-2 focus:ring-brand-purple/20"
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[13px] font-medium text-text-primary bg-bg-base px-3 py-2 rounded-lg">{monthLabel}</span>
        <div className="relative">
          <select value={filters.service} onChange={(e) => set({ service: e.target.value })} className={selectCls}>
            <option value="">All Services</option>
            <option value="SUNDAY_SERVICE">Main Service</option>
            <option value="SUNDAY_SCHOOL">Sunday School</option>
          </select>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none text-xs">▾</span>
        </div>
        <div className="relative">
          <select value={filters.gender} onChange={(e) => set({ gender: e.target.value })} className={selectCls}>
            <option value="">All Genders</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none text-xs">▾</span>
        </div>
      </div>
    </div>
  );
}
