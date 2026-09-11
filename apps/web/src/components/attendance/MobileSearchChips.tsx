import { Search, X } from 'lucide-react';
import { DEPARTMENT_LABELS } from '../members/labels';

export function MobileSearchChips({
  search,
  onSearch,
  department,
  onDepartmentChange,
  counts,
  total,
}: {
  search: string;
  onSearch: (v: string) => void;
  department: string;
  onDepartmentChange: (v: string) => void;
  counts: Record<string, number>;
  total: number;
}) {
  const depts = Object.keys(DEPARTMENT_LABELS).filter((d) => d !== 'NONE');

  const chip = (value: string, label: string) => {
    const active = department === value;
    return (
      <button
        key={value || 'all'}
        onClick={() => onDepartmentChange(value)}
        className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] transition-all ${
          active
            ? 'font-semibold bg-brand-purple text-white'
            : 'font-medium bg-white text-text-secondary border border-border/80'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="sticky top-16 z-20 -mx-4 px-4 py-2 bg-bg-base/95 backdrop-blur-md flex flex-col gap-2">
      <div className="relative w-full">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/50" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search members by name or phone..."
          className="w-full pl-10 pr-9 h-10 bg-white border border-border/80 rounded-full text-[13px] text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple shadow-card"
        />
        {search && (
          <button
            onClick={() => onSearch('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary/60 hover:text-text-secondary"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
        {chip('', `All (${total})`)}
        {depts.map((d) => chip(d, `${DEPARTMENT_LABELS[d]} (${counts[d] ?? 0})`))}
      </div>
    </div>
  );
}
