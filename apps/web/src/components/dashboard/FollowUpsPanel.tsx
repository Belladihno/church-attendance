import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import type { DashboardOverview } from '../../api/dashboard';
import { Avatar } from '../ui/Avatar';

export function FollowUpsPanel({ data, followUps }: { data: DashboardOverview; followUps?: any[] }) {
  const overdue = data.followUpRequired.twoWeeks + data.followUpRequired.threeOrMore;
  const urgent = data.followUpRequired.threeOrMore;

  return (
    <div className="lg:col-span-5 bg-bg-card p-6 rounded-xl shadow-card flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-semibold text-text-primary md:text-base text-[16px]">Priority Pastoral Care</h2>
          <p className="text-xs text-text-secondary hidden md:block">Priority pastoral follow-up queue</p>
        </div>
        {urgent > 0 ? (
          <span className="px-2.5 py-0.5 rounded-full bg-absent-bg text-brand-red text-[11px] md:text-[11px] text-[12px] font-semibold">
            {urgent} Urgent
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full bg-pending-bg text-pending text-[11px] font-semibold">{overdue} overdue</span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {!followUps || followUps.length === 0 ? (
          <div className="p-4 text-center text-sm text-text-secondary bg-[#F6F1FF] rounded-lg">No follow-ups requiring attention — all members in good standing</div>
        ) : (
          followUps.slice(0, 4).map((m: any, idx: number) => (
            <div
              key={m.id}
              className={`${idx >= 2 ? 'hidden md:flex' : 'flex'} p-3 rounded-xl md:rounded-lg bg-white md:bg-[#F6F1FF] border border-border/70 md:border-0 shadow-card md:shadow-none flex-col gap-2`}
            >
              <div className="flex items-center gap-3">
                <Avatar firstName={m.firstName} lastName={m.lastName} size={idx >= 2 ? 32 : 40} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-text-primary truncate">{m.firstName} {m.lastName}</div>
                  <div className="text-xs text-brand-red md:text-text-secondary font-medium md:font-normal truncate">
                    Absent 2+ Sundays
                  </div>
                  <div className="text-[11px] text-text-secondary truncate hidden md:block">{m.department || 'Member'} • {m.churchRole || 'Member'}</div>
                </div>
                {/* Mobile tel call */}
                {m.phone && (
                  <a
                    href={`tel:${m.phone}`}
                    className="md:hidden shrink-0 h-9 px-3.5 rounded-xl bg-brand-purple text-white text-[13px] font-semibold flex items-center gap-1.5 active:bg-[#221469]"
                  >
                    <Phone size={15} />
                    <span>Call</span>
                  </a>
                )}
                <span className="px-2 py-0.5 rounded-md bg-absent-bg text-absent text-[11px] shrink-0 hidden md:inline">Absent 2+ Sundays</span>
              </div>
              <div className="hidden md:flex items-center justify-between pt-1">
                <span className="text-xs text-text-secondary/60">Last attended: {m.dateJoined ? new Date(m.dateJoined).toLocaleDateString() : '-'}</span>
                <Link to="/follow-ups" className="h-7 px-3 rounded-md bg-brand-purple text-white text-xs flex items-center gap-1">Contact</Link>
              </div>
            </div>
          ))
        )}
      </div>

      <Link
        to="/follow-ups"
        className="mt-4 w-full py-2.5 md:py-2 px-3 rounded-xl md:rounded-lg border border-border/70 md:border-0 text-brand-purple hover:bg-[#F6F1FF] text-[13px] md:text-sm font-semibold flex items-center justify-center gap-1.5 md:gap-1"
      >
        View all {overdue} follow-up cases <ArrowRight size={16} />
      </Link>
    </div>
  );
}
