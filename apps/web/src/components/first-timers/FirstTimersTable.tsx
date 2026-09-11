import { Eye, ChevronLeft, ChevronRight, MoveRight } from 'lucide-react';
import type { FirstTimer } from '../../api/firstTimers';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { statusLabel, serviceLabel, formatVisitDate } from './labels';

function StagePills({ status }: { status: FirstTimer['followUpStatus'] }) {
  const stage = status === 'CONVERTED' ? 3 : status === 'CONTACTED' ? 2 : status === 'PENDING' ? 1 : 0;
  const pill = (n: number, label: string) => {
    const done = stage >= n;
    const current = stage === n;
    return (
      <span
        key={label}
        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
          status === 'CLOSED'
            ? 'bg-bg-base text-text-secondary/50'
            : done
              ? current && status !== 'CONVERTED'
                ? 'bg-[#EAE7F8] text-brand-purple'
                : 'bg-present-bg text-present'
              : 'bg-bg-base text-text-secondary/50'
        }`}
      >
        {done && status !== 'CLOSED' ? `✓ ${label}` : label}
      </span>
    );
  };
  return <div className="flex items-center gap-1.5">{[pill(1, 'Contact'), pill(2, 'Follow-up'), pill(3, 'Member')]}</div>;
}

function statusVariant(s: FirstTimer['followUpStatus']): 'pending' | 'contacted' | 'active' | 'excused' {
  if (s === 'PENDING') return 'pending';
  if (s === 'CONTACTED') return 'contacted';
  if (s === 'CONVERTED') return 'active';
  return 'excused';
}

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

type Props = {
  visitors: FirstTimer[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  onPageChange: (p: number) => void;
  onOpen: (v: FirstTimer) => void;
  onConvert: (v: FirstTimer) => void;
};

export function FirstTimersTable({ visitors, total, page, totalPages, limit, onPageChange, onOpen, onConvert }: Props) {
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(total, page * limit);

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-bg-base/60 text-text-secondary text-xs font-medium">
              <th className="py-3 px-4">Visitor</th>
              <th className="py-3 px-4">Service Attended</th>
              <th className="py-3 px-4">Contact &amp; Residence</th>
              <th className="py-3 px-4">Invited By</th>
              <th className="py-3 px-4">Assimilation Stage</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-[13px] text-text-primary">
            {visitors.map((v, idx) => (
              <tr
                key={v.id}
                onClick={() => onOpen(v)}
                className={`hover:bg-bg-base/40 transition-colors cursor-pointer ${idx % 2 === 1 ? 'bg-[#F9FAFB]' : 'bg-bg-card'}`}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <Avatar firstName={v.firstName} lastName={v.lastName} size={40} />
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-sm truncate">{v.firstName} {v.lastName}</span>
                      <span className="text-xs text-text-secondary capitalize">{v.gender.toLowerCase()}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className="font-semibold">{formatVisitDate(v.dateAttended)}</span>
                    <span className="text-xs text-text-secondary">{serviceLabel(v.serviceAttended)}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className="tabular-nums font-medium">{v.phone}</span>
                    <span className="text-xs text-text-secondary truncate max-w-[150px]">{v.address || '—'}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-purple" />
                    <span>{v.invitedBy || 'Walk-in'}</span>
                  </span>
                </td>
                <td className="py-3 px-4"><StagePills status={v.followUpStatus} /></td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <Badge variant={statusVariant(v.followUpStatus)}>{statusLabel(v.followUpStatus)}</Badge>
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => onOpen(v)} title="View dossier" className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-base">
                      <Eye size={17} />
                    </button>
                    {(v.followUpStatus === 'PENDING' || v.followUpStatus === 'CONTACTED') && (
                      <button
                        onClick={() => onConvert(v)}
                        title="Convert to member"
                        className="h-7 px-2 rounded-lg bg-brand-purple text-white font-semibold text-[11px] hover:bg-[#221469] flex items-center gap-1"
                      >
                        <span>Convert</span>
                        <MoveRight size={13} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-bg-base/30 rounded-b-xl">
        <span className="text-[13px] text-text-secondary">
          Showing <span className="font-semibold text-text-primary">{from}</span> to{' '}
          <span className="font-semibold text-text-primary">{to}</span> of{' '}
          <span className="font-semibold text-text-primary">{total}</span> first-timers registered
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
                  className={`w-8 h-8 rounded-lg text-[13px] ${n === page ? 'bg-brand-purple text-white font-semibold' : 'bg-bg-card hover:bg-bg-base text-text-primary'}`}
                >
                  {n}
                </button>
              ),
            )}
          </div>
          <button
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="h-8 px-3 rounded-lg bg-bg-card hover:bg-bg-base text-text-primary disabled:opacity-40 text-[13px] flex items-center gap-1"
          >
            <span>Next</span>
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
