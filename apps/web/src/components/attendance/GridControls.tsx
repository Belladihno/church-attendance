const DEPARTMENTS = ['NONE','CHOIR','USHERING','CHILDREN_MINISTRY','YOUTH_MINISTRY','PRAYER_TEAM','TECHNICAL','WELFARE','PROTOCOL','WORKERS_IN_TRAINING'] as const;

type Props = {
  monthLabel: string;
  onPrev: () => void;
  onNext: () => void;
  search: string;
  onSearch: (v: string) => void;
  department: string;
  onDepartmentChange: (v: string) => void;
  onBulkPresent: () => void;
  onSave: () => void;
  pending: number;
  saving: boolean;
};

export function GridControls({ monthLabel, onPrev, onNext, search, onSearch, department, onDepartmentChange, onBulkPresent, onSave, pending, saving }: Props) {
  return (
    <div className="bg-bg-card rounded-xl p-4 shadow-card flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center bg-[#F6F1FF] rounded-lg p-1">
          <button onClick={onPrev} className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-text-primary rounded hover:bg-bg-card" aria-label="Previous month">‹</button>
          <span className="px-3 text-sm font-semibold text-text-primary min-w-[120px] text-center">{monthLabel}</span>
          <button onClick={onNext} className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-text-primary rounded hover:bg-bg-card" aria-label="Next month">›</button>
        </div>

        <div className="relative">
          <select
            value={department}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="h-10 pl-3 pr-8 rounded-lg bg-[#F6F1FF] text-sm text-text-primary focus:outline-none cursor-pointer appearance-none"
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">▾</span>
        </div>

        <div className="relative min-w-[240px] flex-1 sm:flex-initial">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary/50">⌕</span>
          <input
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#F6F1FF] text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:bg-bg-card"
            placeholder="Filter members in grid..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={onBulkPresent} className="h-10 px-3 rounded-lg bg-[#F6F1FF] hover:bg-[#EAE7F8] text-text-secondary hover:text-brand-purple text-sm font-semibold flex items-center gap-2">
          Bulk Mark All Present
        </button>
        <button className="h-10 px-3 rounded-lg bg-[#F6F1FF] text-text-secondary text-sm font-semibold flex items-center gap-2">
          Export
        </button>
        <button onClick={onSave} disabled={pending === 0 || saving} className="h-10 px-4 rounded-lg bg-brand-purple hover:bg-[#221469] text-white text-sm font-semibold shadow-sm flex items-center gap-2 disabled:opacity-50">
          Save Changes
          {pending > 0 && <span className="ml-1 px-2 py-0.5 rounded-full bg-white text-brand-purple text-xs">{pending} pending</span>}
        </button>
      </div>
    </div>
  );
}
