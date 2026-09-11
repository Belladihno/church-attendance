import { Link } from 'react-router-dom';
import { ClipboardCheck } from 'lucide-react';
import type { DashboardOverview } from '../../api/dashboard';

export function BottomActionBar({ data, todayStr }: { data: DashboardOverview; todayStr: string }) {
  return (
    <>
      {/* Mobile hero attendance card */}
      <section className="md:hidden bg-white rounded-2xl p-5 shadow-card border border-border/70">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple">
              <ClipboardCheck size={20} />
            </div>
            <div>
              <div className="text-[14px] font-semibold text-text-primary">Current Attendance</div>
              <div className="text-[12px] text-text-secondary">{data.presentToday} checked-in of {data.totalMembers} total</div>
            </div>
          </div>
          <span className="text-[22px] font-bold text-brand-purple tracking-tight tabular-nums">{data.attendanceRate}%</span>
        </div>
        <div className="w-full h-2 bg-bg-base rounded-full overflow-hidden">
          <div className="h-full bg-brand-purple rounded-full transition-all duration-500" style={{ width: `${Math.min(100, data.attendanceRate)}%` }} />
        </div>
        <Link
          to="/attendance"
          className="mt-4 w-full h-10 rounded-xl bg-brand-purple text-white text-sm font-semibold flex items-center justify-center active:bg-[#221469]"
        >
          Mark Roll
        </Link>
      </section>

      {/* Desktop action strip */}
      <div className="hidden md:flex bg-bg-card p-6 rounded-xl shadow-card flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-[#EAE7F8] text-brand-purple flex items-center justify-center shrink-0">✓</div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-text-primary">Today's Sunday Service session ({todayStr}) is open for marking</span>
              <span className="px-2 py-0.5 rounded-md bg-present-bg text-brand-green text-[11px] font-semibold">Active Session</span>
            </div>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-text-secondary">
              <span>{data.presentToday} / {data.totalMembers} recorded ({data.absentToday} remaining)</span>
              <span>•</span>
              <div className="w-32 bg-[#EAE5FF] rounded-full h-1.5 overflow-hidden"><div className="bg-brand-purple h-1.5 rounded-full" style={{ width: `${data.attendanceRate}%` }} /></div>
            </div>
          </div>
        </div>
        <Link to="/attendance" className="w-full sm:w-auto h-10 px-6 rounded-lg bg-brand-purple hover:bg-[#221469] text-white text-sm font-semibold shadow-sm flex items-center justify-center gap-2">
          Open attendance grid
        </Link>
      </div>
    </>
  );
}
