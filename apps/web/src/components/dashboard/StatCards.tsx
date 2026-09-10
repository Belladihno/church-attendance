import { Users, CheckCircle, UserX, Hand, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import type { DashboardOverview } from '../../api/dashboard';

export function StatCards({ data }: { data: DashboardOverview }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-bg-card p-6 rounded-xl shadow-card flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-secondary">Total members</span>
          <span className="p-1.5 rounded-lg bg-[#F6F1FF] text-text-secondary"><Users size={18} /></span>
        </div>
        <div className="mt-4 flex flex-col gap-1">
          <span className="text-[28px] font-bold text-brand-purple tabular-nums">{data.totalMembers}</span>
          <div className="text-xs font-semibold text-text-secondary">Active on roll</div>
        </div>
      </div>

      <div className="bg-bg-card p-6 rounded-xl shadow-card flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-secondary">Present today</span>
          <span className="p-1.5 rounded-lg bg-present-bg text-brand-green"><CheckCircle size={18} /></span>
        </div>
        <div className="mt-4 flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <span className="text-[28px] font-bold text-text-primary tabular-nums">{data.presentToday}</span>
            <span className="text-xs text-text-secondary">/ {data.totalMembers}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-green">
            <TrendingUp size={14} />Attendance rate {data.attendanceRate}% (↑ {data.trend.delta.toFixed(1)}%)
          </div>
        </div>
      </div>

      <div className="bg-bg-card p-6 rounded-xl shadow-card flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-secondary">Absent today</span>
          <span className="p-1.5 rounded-lg bg-absent-bg text-brand-red"><UserX size={18} /></span>
        </div>
        <div className="mt-4 flex flex-col gap-1">
          <span className="text-[28px] font-bold text-text-primary tabular-nums">{data.absentToday}</span>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-pending">
            <AlertTriangle size={14} />{data.followUpRequired.twoWeeks} require follow-up
          </div>
        </div>
      </div>

      <div className="bg-bg-card p-6 rounded-xl shadow-card flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-secondary">First timers</span>
          <span className="p-1.5 rounded-lg bg-contacted-bg text-contacted"><Hand size={18} /></span>
        </div>
        <div className="mt-4 flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <span className="text-[28px] font-bold text-brand-purple tabular-nums">{data.firstTimersThisMonth}</span>
            <span className="text-xs text-text-secondary">this month</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-pending">
            <Clock size={14} />{data.followUpRequired.threeOrMore} pending follow-up
          </div>
        </div>
      </div>
    </div>
  );
}
