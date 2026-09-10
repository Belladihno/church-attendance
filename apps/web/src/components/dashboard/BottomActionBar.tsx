import { Link } from 'react-router-dom';
import type { DashboardOverview } from '../../api/dashboard';

export function BottomActionBar({ data, todayStr }: { data: DashboardOverview; todayStr: string }) {
  return (
    <div className="bg-bg-card p-6 rounded-xl shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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
  );
}
