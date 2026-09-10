import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { DashboardOverview } from '../../api/dashboard';
import { Avatar } from '../ui/Avatar';

export function FollowUpsPanel({ data, followUps }: { data: DashboardOverview; followUps?: any[] }) {
  const overdue = data.followUpRequired.twoWeeks + data.followUpRequired.threeOrMore;

  return (
    <div className="lg:col-span-5 bg-bg-card p-6 rounded-xl shadow-card flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-semibold text-text-primary">Follow-ups needing attention</h2>
          <p className="text-xs text-text-secondary">Priority pastoral follow-up queue</p>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-pending-bg text-pending text-[11px] font-semibold">{overdue} overdue</span>
      </div>

      <div className="flex flex-col gap-3">
        {!followUps || followUps.length === 0 ? (
          <div className="p-4 text-center text-sm text-text-secondary bg-[#F6F1FF] rounded-lg">No follow-ups requiring attention — all members in good standing</div>
        ) : (
          followUps.slice(0, 4).map((m: any) => (
            <div key={m.id} className="p-3 rounded-lg bg-[#F6F1FF] flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Avatar firstName={m.firstName} lastName={m.lastName} size={32} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-text-primary truncate">{m.firstName} {m.lastName}</div>
                  <div className="text-xs text-text-secondary truncate">{m.department || 'Member'} • {m.churchRole || 'Member'}</div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-absent-bg text-absent text-[11px] shrink-0">Absent 2+ Sundays</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-text-secondary/60">Last attended: {m.dateJoined ? new Date(m.dateJoined).toLocaleDateString() : '-'}</span>
                <Link to="/follow-ups" className="h-7 px-3 rounded-md bg-brand-purple text-white text-xs flex items-center gap-1">Contact</Link>
              </div>
            </div>
          ))
        )}
      </div>

      <Link to="/follow-ups" className="mt-4 w-full py-2 px-3 rounded-lg text-brand-purple hover:bg-[#F6F1FF] text-sm font-semibold flex items-center justify-center gap-1">
        View all {overdue} follow-up cases <ArrowRight size={16} />
      </Link>
    </div>
  );
}
