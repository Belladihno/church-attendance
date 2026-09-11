import { Users, ClipboardCheck, HeartHandshake, BellRing, ArrowUp, ArrowDown } from 'lucide-react';
import type { ReportsOverview } from '../../api/reports';

function MiniCard({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-card flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-text-secondary">{label}</span>
        {icon}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function MobileKpiGrid({ data }: { data: ReportsOverview }) {
  const onTrack = data.attendanceRate >= 80;
  const deltaUp = data.avgDeltaPct >= 0;

  return (
    <div className="grid grid-cols-2 gap-3">
      <MiniCard label="Avg Sunday" icon={<Users size={17} className="text-brand-purple" />}>
        <div className="text-[24px] font-bold text-text-primary tracking-tight tabular-nums leading-none">
          {Math.round(data.avgAttendance)}
        </div>
        <div className={`flex items-center gap-0.5 mt-1 text-[12px] font-medium ${deltaUp ? 'text-brand-green' : 'text-brand-red'}`}>
          {deltaUp ? <ArrowUp size={13} /> : <ArrowDown size={13} />}
          <span>{Math.abs(data.avgDeltaPct).toFixed(1)}% trend</span>
        </div>
      </MiniCard>
      <MiniCard label="Attendance Rate" icon={<ClipboardCheck size={17} className="text-brand-green" />}>
        <div className="text-[24px] font-bold text-text-primary tracking-tight tabular-nums leading-none">
          {data.attendanceRate.toFixed(1)}%
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
          <span className="text-[12px] text-brand-green font-medium">{onTrack ? 'On track (>80%)' : 'Below 80%'}</span>
        </div>
      </MiniCard>
      <MiniCard label="Participation" icon={<HeartHandshake size={17} className="text-brand-purple" />}>
        <div className="text-[24px] font-bold text-text-primary tracking-tight tabular-nums leading-none">
          {data.participation.toFixed(1)}%
        </div>
        <div className="text-[12px] text-text-secondary mt-1">{data.sundayCount}-Sunday window</div>
      </MiniCard>
      <MiniCard label="Chronic Absences" icon={<BellRing size={17} className="text-brand-red" />}>
        <div className="text-[24px] font-bold text-brand-red tracking-tight tabular-nums leading-none">
          {data.absence.total}
        </div>
        <div className="text-[12px] text-brand-red mt-1 font-medium">Care action req.</div>
      </MiniCard>
    </div>
  );
}
