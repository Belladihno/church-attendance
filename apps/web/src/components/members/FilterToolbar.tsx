import { Search, X } from 'lucide-react';
import { DEPARTMENT_LABELS, CHURCH_ROLE_LABELS } from './labels';

export type MemberFilters = {
  search: string;
  department: string;
  churchRole: string;
  status: string;
  gender: string;
};

type Props = {
  filters: MemberFilters;
  onChange: (f: MemberFilters) => void;
  shown: number;
  total: number;
  active: number;
};

const DEPARTMENTS = Object.keys(DEPARTMENT_LABELS).filter((d) => d !== 'NONE');
const ROLES = Object.keys(CHURCH_ROLE_LABELS);

export function FilterToolbar({ filters, onChange, shown, total, active }: Props) {
  const set = (patch: Partial<MemberFilters>) => onChange({ ...filters, ...patch });
  const hasActive =
    filters.search || filters.department || filters.churchRole || filters.status || filters.gender;

  const selectCls =
    'h-10 px-3 pr-8 rounded-lg bg-bg-base text-text-primary text-[13px] appearance-none cursor-pointer focus:bg-bg-card focus:outline-none focus:ring-2 focus:ring-brand-purple/20 min-w-[130px] border border-transparent focus:border-brand-purple';

  return (
    <div className="bg-bg-card rounded-xl p-4 shadow-card flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary/50" />
          <input
            value={filters.search}
            onChange={(e) => set({ search: e.target.value })}
            placeholder="Search members by name, phone, residential district..."
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-bg-base text-sm text-text-primary placeholder:text-text-secondary/50 focus:bg-bg-card focus:outline-none focus:ring-2 focus:ring-brand-purple/20"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <select value={filters.department} onChange={(e) => set({ department: e.target.value })} className={selectCls}>
              <option value="">All Departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{DEPARTMENT_LABELS[d]}</option>
              ))}
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none text-xs">▾</span>
          </div>
          <div className="relative">
            <select value={filters.churchRole} onChange={(e) => set({ churchRole: e.target.value })} className={selectCls}>
              <option value="">All Roles</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>{CHURCH_ROLE_LABELS[r]}</option>
              ))}
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none text-xs">▾</span>
          </div>
          <div className="relative">
            <select value={filters.status} onChange={(e) => set({ status: e.target.value })} className={selectCls}>
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
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
          <button
            onClick={() => onChange({ search: '', department: '', churchRole: '', status: '', gender: '' })}
            disabled={!hasActive}
            title="Reset filters"
            className="h-10 px-3 rounded-lg bg-bg-base hover:bg-border/60 text-text-secondary text-[13px] flex items-center gap-1 transition-colors disabled:opacity-40"
          >
            <X size={15} />
            <span>Clear</span>
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-border/40">
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <span>
            Showing <strong className="text-text-primary">{shown}</strong> of{' '}
            <strong className="text-text-primary">{total}</strong> registered members
          </span>
          <span className="w-1 h-1 rounded-full bg-text-secondary/40" />
          <span className="text-brand-green font-medium">{active} currently in good standing</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-text-secondary/60 text-xs">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-green" /> &gt;80% Regular</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-pending" /> 60-79% Review</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-red" /> &lt;60% At-risk</span>
        </div>
      </div>
    </div>
  );
}
