import { Link } from 'react-router-dom';
import { Eye, Pencil, UserCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Member } from '../../api/members';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { departmentLabel, churchRoleLabel } from './labels';

export function AttendanceRateCell({ rate, loading }: { rate: number | null; loading: boolean }) {
  if (loading) return <span className="text-xs text-text-secondary/50">—</span>;
  if (rate === null) return <span className="text-xs text-text-secondary/50">No records</span>;
  const color = rate >= 80 ? '#1A7A1A' : rate >= 60 ? '#B45309' : '#CC0000';
  const bar = rate >= 80 ? 'bg-brand-green' : rate >= 60 ? 'bg-pending' : 'bg-brand-red';
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-bg-base overflow-hidden">
        <div className={`h-full rounded-full ${bar}`} style={{ width: `${Math.min(100, rate)}%` }} />
      </div>
      <span className="text-xs font-semibold tabular-nums" style={{ color }}>
        {Math.round(rate)}%{rate < 60 ? ' Warning' : ''}
      </span>
    </div>
  );
}

type Props = {
  members: Member[];
  rates: Record<string, number | null>;
  ratesLoading: boolean;
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (p: number) => void;
};

function pageNumbers(page: number, totalPages: number): (number | '…')[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const set = new Set<number>([1, 2, page - 1, page, page + 1, totalPages - 1, totalPages]);
  const nums = [...set].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  for (let i = 0; i < nums.length; i++) {
    out.push(nums[i]);
    if (i < nums.length - 1 && nums[i + 1] - nums[i] > 1) out.push('…');
  }
  return out;
}

export function MembersTable({ members, rates, ratesLoading, page, totalPages, total, limit, onPageChange }: Props) {
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(total, page * limit);

  return (
    <div className="bg-bg-card rounded-xl shadow-card overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-base/60 text-text-secondary text-xs font-medium">
              <th className="py-3 px-4">Member</th>
              <th className="py-3 px-4">Contact Info</th>
              <th className="py-3 px-4">Ministry Unit</th>
              <th className="py-3 px-4">Church Role</th>
              <th className="py-3 px-4">Attendance Rate</th>
              <th className="py-3 px-4">Joined Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 text-[13px] text-text-primary">
            {members.map((m, idx) => (
              <tr key={m.id} className={`hover:bg-bg-base/40 transition-colors ${idx % 2 === 1 ? 'bg-[#F9FAFB]' : 'bg-bg-card'}`}>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <Avatar firstName={m.firstName} lastName={m.lastName} size={36} />
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-sm text-text-primary truncate">{m.firstName} {m.lastName}</span>
                      <span className="text-xs text-text-secondary truncate max-w-[180px]">{m.address || m.gender}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className="tabular-nums font-medium">{m.phone}</span>
                    <span className="text-text-secondary/60 text-xs capitalize">{m.gender.toLowerCase()}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Badge variant="active" className="whitespace-nowrap">{departmentLabel(m.department)}</Badge>
                </td>
                <td className="py-3 px-4">
                  <Badge variant={m.churchRole === 'MEMBER' ? 'excused' : 'contacted'} className="whitespace-nowrap">
                    {churchRoleLabel(m.churchRole)}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <AttendanceRateCell rate={rates[m.id] ?? null} loading={ratesLoading} />
                </td>
                <td className="py-3 px-4 tabular-nums text-text-secondary whitespace-nowrap">
                  {new Date(m.dateJoined).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <Badge variant={m.status === 'ACTIVE' ? 'active' : 'excused'}>
                    {m.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <Link to="/attendance" title="Log Attendance" className="p-1.5 rounded hover:bg-bg-base text-text-secondary hover:text-brand-purple">
                      <UserCheck size={17} />
                    </Link>
                    <Link to={`/members/${m.id}`} title="View Profile" className="p-1.5 rounded hover:bg-bg-base text-text-secondary hover:text-text-primary">
                      <Eye size={17} />
                    </Link>
                    <Link to={`/members/${m.id}/edit`} title="Edit" className="p-1.5 rounded hover:bg-bg-base text-text-secondary hover:text-text-primary">
                      <Pencil size={16} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-bg-card flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/40">
        <span className="text-[13px] text-text-secondary">
          Showing <span className="font-semibold text-text-primary">{from}</span> to{' '}
          <span className="font-semibold text-text-primary">{to}</span> of{' '}
          <span className="font-semibold text-text-primary">{total}</span> members
        </span>
        <div className="flex items-center gap-1">
          <button
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="h-8 px-3 rounded-lg bg-bg-base text-text-secondary hover:bg-border/60 disabled:opacity-40 text-[13px] flex items-center gap-1"
          >
            <ChevronLeft size={15} />
            <span>Previous</span>
          </button>
          <div className="flex items-center gap-1 px-1">
            {pageNumbers(page, Math.max(1, totalPages)).map((n, i) =>
              n === '…' ? (
                <span key={`e${i}`} className="text-text-secondary/50 px-1">...</span>
              ) : (
                <button
                  key={n}
                  onClick={() => onPageChange(n)}
                  className={`w-8 h-8 rounded-lg text-[13px] transition-colors ${
                    n === page ? 'bg-brand-purple text-white font-semibold' : 'bg-bg-base hover:bg-border/60 text-text-primary'
                  }`}
                >
                  {n}
                </button>
              ),
            )}
          </div>
          <button
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="h-8 px-3 rounded-lg bg-bg-base text-text-secondary hover:bg-border/60 disabled:opacity-40 text-[13px] flex items-center gap-1"
          >
            <span>Next</span>
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
