import { Users, CheckCircle, UserX, Hand, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import type { DashboardOverview } from '../../api/dashboard';

function MobileMetric({
  label,
  value,
  sub,
  subColor,
}: {
  label: string;
  value: string;
  sub: React.ReactNode;
  subColor?: string;
}) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-card border border-border/70 flex flex-col justify-between min-h-[104px]">
      <span className="text-[13px] font-medium text-text-secondary">{label}</span>
      <div className="mt-2">
        <div className="text-[24px] font-bold text-[#2D1B8B] tracking-tight leading-none tabular-nums">{value}</div>
        <p className="text-[12px] font-medium mt-1.5 flex items-center gap-1" style={{ color: subColor ?? '#1A7A1A' }}>
          {sub}
        </p>
      </div>
    </div>
  );
}

export function StatCards({ data, newThisMonth = 0 }: { data: DashboardOverview; newThisMonth?: number }) {
  const overdue = data.followUpRequired.twoWeeks + data.followUpRequired.threeOrMore;

  return (
    <>
      {/* Mobile 2x2 metrics */}
      <div className="md:hidden grid grid-cols-2 gap-3.5">
        <MobileMetric
          label="Total Members"
          value={String(data.totalMembers)}
          sub={<><TrendingUp size={14} /><span>+{newThisMonth} this month</span></>}
        />
        <MobileMetric
          label="Attendance Rate"
          value={`${data.attendanceRate}%`}
          sub={<><TrendingUp size={14} /><span>+{data.trend.delta.toFixed(1)}% trend</span></>}
        />
        <MobileMetric
          label="Absentees"
          value={String(data.absentToday)}
          sub={<><span className="w-1.5 h-1.5 rounded-full bg-brand-red" /><span>Absent today</span></>}
          subColor="#CC0000"
        />
        <MobileMetric
          label="Care Due"
          value={String(overdue)}
          sub={<span>{data.followUpRequired.threeOrMore} urgent cases</span>}
          subColor="#B45309"
        />
      </div>

      {/* Desktop cards */}
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
    </>
  );
}
