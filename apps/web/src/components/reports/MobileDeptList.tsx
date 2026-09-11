import { Link } from 'react-router-dom';
import type { DeptRow } from '../../api/reports';
import { departmentLabel } from '../members/labels';

function badgeCls(rate: number | null): string {
  if (rate === null) return 'bg-bg-base text-text-secondary';
  if (rate >= 93) return 'bg-present-bg text-brand-green';
  if (rate >= 85) return 'bg-[#EAE7F8] text-brand-purple';
  return 'bg-pending-bg text-pending';
}

function barCls(rate: number | null): string {
  if (rate === null) return 'bg-border';
  if (rate >= 93) return 'bg-brand-green';
  if (rate >= 85) return 'bg-brand-purple';
  return 'bg-pending';
}

function initials(name: string): string {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

export function MobileDeptList({ departments }: { departments: DeptRow[] }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-text-primary">Department Consistency</h2>
          <p className="text-xs text-text-secondary">Benchmark target 85.0%</p>
        </div>
        <span className="text-[11px] px-2 py-0.5 bg-[#EAE7F8] text-brand-purple rounded-full font-semibold">Top Ranked</span>
      </div>
      <div className="flex flex-col gap-3 pt-1">
        {departments.map((d) => {
          const name = departmentLabel(d.department);
          return (
            <Link
              key={d.department}
              to={`/members?department=${d.department}`}
              className="flex flex-col gap-1.5 p-2 rounded-lg bg-bg-base/60 active:bg-bg-base"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[#EAE7F8] text-brand-purple flex items-center justify-center text-[12px] font-bold shrink-0">
                    {initials(name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] text-text-primary truncate leading-tight font-semibold">{name}</p>
                    <p className="text-[11px] text-text-secondary tabular-nums">{d.enrolled} registered</p>
                  </div>
                </div>
                <span className={`text-[11px] px-1.5 py-0.5 rounded font-semibold tabular-nums shrink-0 ${badgeCls(d.rate)}`}>
                  {d.rate === null ? '—' : `${d.rate.toFixed(1)}%`}
                </span>
              </div>
              <div className="w-full h-1.5 bg-bg-base rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${barCls(d.rate)}`} style={{ width: `${Math.min(100, d.rate ?? 0)}%` }} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
