import { Link } from 'react-router-dom';
import { TriangleAlert, Send } from 'lucide-react';
import type { FlaggedRow } from '../../api/reports';
import { Avatar } from '../ui/Avatar';
import { departmentLabel } from '../members/labels';

function StreakBadge({ streak }: { streak: number }) {
  const critical = streak >= 3;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold ${
        critical ? 'bg-absent-bg text-brand-red' : 'bg-pending-bg text-pending'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${critical ? 'bg-brand-red' : 'bg-pending'}`} />
      {streak} Sundays ({critical ? 'Critical' : 'Warning'})
    </span>
  );
}

export function DiagnosticTable({
  flagged,
  onAssignBatch,
  assigning,
}: {
  flagged: FlaggedRow[];
  onAssignBatch: () => void;
  assigning: boolean;
}) {
  const pendingTickets = flagged.filter((f) => !f.hasOpenTicket).length;

  return (
    <div className="bg-bg-card rounded-xl p-6 shadow-card flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-absent-bg text-brand-red flex items-center justify-center">
            <TriangleAlert size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-text-primary">Chronic Absence Diagnostic (2+ Consecutive Sundays)</h2>
            <p className="text-xs text-text-secondary">Automated pastoral intervention triggers for active members</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] px-3 py-1 rounded-full bg-absent-bg text-brand-red font-bold">
            {flagged.length} Flagged Total
          </span>
          <button
            onClick={onAssignBatch}
            disabled={assigning || pendingTickets === 0}
            className="h-8 px-3 rounded-lg bg-brand-purple hover:bg-[#221469] text-white font-semibold text-[13px] flex items-center gap-1.5 disabled:opacity-40"
          >
            <Send size={15} />
            <span>{assigning ? 'Assigning...' : pendingTickets === 0 ? 'All Assigned' : `Assign Batch (${pendingTickets})`}</span>
          </button>
        </div>
      </div>
      {flagged.length === 0 ? (
        <p className="text-sm text-text-secondary text-center py-8">No members currently flagged. Healthy fellowship.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="bg-bg-base/60 text-text-secondary text-xs font-medium">
                <th className="py-3 px-4 rounded-l-lg">Flagged Member</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Consecutive Absence</th>
                <th className="py-3 px-4">Care Record</th>
                <th className="py-3 px-4">Assigned Minister</th>
                <th className="py-3 px-4 text-right rounded-r-lg">Follow-up</th>
              </tr>
            </thead>
            <tbody className="text-text-primary">
              {flagged.map((f, idx) => {
                const [first, ...rest] = f.name.split(' ');
                return (
                  <tr key={f.memberId} className={`hover:bg-bg-base/40 ${idx % 2 === 1 ? 'bg-[#F9FAFB]' : 'bg-bg-card'}`}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar firstName={first} lastName={rest.join(' ')} size={32} />
                        <div>
                          <div className="font-semibold block">{f.name}</div>
                          <div className="text-xs text-text-secondary tabular-nums">{f.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-text-secondary">{departmentLabel(f.department)}</td>
                    <td className="py-3 px-4"><StreakBadge streak={f.streak} /></td>
                    <td className="py-3 px-4 text-text-secondary max-w-[220px] truncate" title={f.reason ?? ''}>
                      {f.reason ?? 'No record yet'}
                    </td>
                    <td className="py-3 px-4">
                      {f.assignedTo ? (
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-brand-purple" />
                          <span className="font-medium">{f.assignedTo}</span>
                        </span>
                      ) : (
                        <span className="text-text-secondary/60">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to="/follow-ups"
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-contacted-bg text-contacted hover:bg-contacted-bg/70 font-semibold text-xs"
                      >
                        Open Follow-up
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {flagged.length > 0 && (
        <div className="pt-4 text-xs text-text-secondary">
          Showing all {flagged.length} chronic absence diagnostic cases
        </div>
      )}
    </div>
  );
}
