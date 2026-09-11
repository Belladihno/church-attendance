import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ArrowUpDown } from 'lucide-react';
import type { DeptRow } from '../../api/reports';
import { Badge } from '../ui/Badge';
import { departmentLabel } from '../members/labels';

function rating(rate: number | null): { label: string; variant: 'active' | 'pending' | 'present' } {
  if (rate === null) return { label: 'No data', variant: 'pending' };
  if (rate >= 95) return { label: 'Exemplary', variant: 'present' };
  if (rate >= 92) return { label: 'Excellent', variant: 'present' };
  if (rate >= 80) return { label: 'High', variant: 'active' };
  return { label: 'Needs Attention', variant: 'pending' };
}

function barColor(rate: number | null): string {
  if (rate === null) return 'bg-border';
  if (rate >= 93) return 'bg-brand-green';
  if (rate >= 85) return 'bg-brand-purple';
  return 'bg-brand-red';
}

export function DeptTable({ departments }: { departments: DeptRow[] }) {
  const [asc, setAsc] = useState(false);
  const rows = [...departments].sort((a, b) =>
    asc ? (a.rate ?? -1) - (b.rate ?? -1) : (b.rate ?? -1) - (a.rate ?? -1),
  );

  return (
    <div className="bg-bg-card rounded-xl p-6 shadow-card flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
        <div>
          <h2 className="font-semibold text-text-primary">Department Attendance Consistency Ranking</h2>
          <p className="text-xs text-text-secondary">Sunday Service regularity across active ministry units</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary">Benchmark target: 85%</span>
          <button
            onClick={() => setAsc(!asc)}
            className="h-8 px-3 rounded-lg bg-bg-base hover:bg-border/60 text-brand-purple font-semibold text-xs flex items-center gap-1"
          >
            Sort by rating <ArrowUpDown size={13} />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="bg-bg-base/60 text-text-secondary text-xs font-medium">
              <th className="py-3 px-4 rounded-l-lg">Department Name</th>
              <th className="py-3 px-4 text-center">Enrolled Members</th>
              <th className="py-3 px-4">Attendance Rate</th>
              <th className="py-3 px-4">Consistency Rating</th>
              <th className="py-3 px-4 text-right rounded-r-lg">Roster</th>
            </tr>
          </thead>
          <tbody className="text-text-primary">
            {rows.map((d, idx) => {
              const r = rating(d.rate);
              return (
                <tr key={d.department} className={`hover:bg-bg-base/40 ${idx % 2 === 1 ? 'bg-[#F9FAFB]' : 'bg-bg-card'}`}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#EAE7F8] text-brand-purple flex items-center justify-center font-bold text-xs shrink-0">
                        {departmentLabel(d.department).split(' ').map((w) => w[0]).slice(0, 2).join('')}
                      </div>
                      <span className="font-semibold">{departmentLabel(d.department)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center tabular-nums font-medium">{d.enrolled}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <span className="font-bold w-14 tabular-nums">{d.rate === null ? '—' : `${d.rate.toFixed(1)}%`}</span>
                      <div className="w-24 bg-bg-base rounded-full h-1.5 overflow-hidden">
                        <div className={`h-full rounded-full ${barColor(d.rate)}`} style={{ width: `${Math.min(100, d.rate ?? 0)}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={r.variant}>{r.label}</Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      to={`/members?department=${d.department}`}
                      title="View department roster"
                      className="p-1.5 rounded inline-block text-text-secondary hover:text-brand-purple hover:bg-bg-base"
                    >
                      <Eye size={17} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
