import { Link } from 'react-router-dom';
import { TriangleAlert, ArrowRight, HeartHandshake } from 'lucide-react';
import type { FlaggedRow } from '../../api/reports';
import { departmentLabel } from '../members/labels';

function initials(name: string): string {
  const parts = name.split(' ').filter(Boolean);
  return `${(parts[0]?.[0] || '').toUpperCase()}${(parts[parts.length - 1]?.[0] || '').toUpperCase()}`;
}

export function MobileAbsenceCards({ flagged }: { flagged: FlaggedRow[] }) {
  const top = flagged.slice(0, 4);

  return (
    <div className="bg-white rounded-xl p-4 shadow-card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TriangleAlert size={19} className="text-brand-red" />
          <h2 className="font-semibold text-text-primary">Chronic Absence Alerts</h2>
        </div>
        <span className="text-[11px] px-2 py-0.5 bg-absent-bg text-brand-red font-semibold rounded-full tabular-nums">
          {flagged.length} Flagged
        </span>
      </div>
      <p className="text-xs text-text-secondary -mt-1">Members missing 2+ consecutive services needing pastoral intervention</p>
      {top.length === 0 ? (
        <p className="text-[13px] text-text-secondary text-center py-4">No chronic absences. Healthy fellowship.</p>
      ) : (
        <div className="flex flex-col gap-2.5 pt-1">
          {top.map((f) => (
            <div key={f.memberId} className="p-3 rounded-lg bg-bg-base/60 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#EAE7F8] text-brand-purple flex items-center justify-center text-[12px] font-bold shrink-0">
                    {initials(f.name)}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[13px] text-text-primary font-semibold truncate block">{f.name}</span>
                    <p className="text-[11px] text-text-secondary truncate">{departmentLabel(f.department)}</p>
                  </div>
                </div>
                <span className="text-[11px] px-1.5 py-0.5 bg-absent-bg text-brand-red font-semibold rounded shrink-0 tabular-nums">
                  Absent {f.streak} Sun
                </span>
              </div>
              <div className="flex items-center justify-between text-[12px] text-text-secondary pt-0.5">
                <span className="truncate">{f.reason ?? 'No record yet'}</span>
                <Link
                  to="/follow-ups"
                  className="h-7 px-3 bg-brand-purple text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 active:bg-[#221469] shrink-0 ml-2"
                >
                  <HeartHandshake size={13} />
                  Follow-up
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      {flagged.length > 4 && (
        <Link
          to="/follow-ups"
          className="w-full py-2.5 mt-1 bg-bg-base hover:bg-border/40 text-brand-purple rounded-lg text-[13px] font-semibold flex items-center justify-center gap-1.5"
        >
          <span>View all {flagged.length} chronic absence cases</span>
          <ArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}
