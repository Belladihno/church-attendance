import { Users, ClipboardCheck, HeartHandshake, BellRing, ArrowUp, ArrowDown } from 'lucide-react';
import type { ReportsOverview } from '../../api/reports';

function Delta({ value }: { value: number }) {
  const up = value >= 0;
  return (
    <span className={`text-xs flex items-center font-medium ${up ? 'text-brand-green' : 'text-brand-red'}`}>
      {up ? <ArrowUp size={13} /> : <ArrowDown size={13} />}
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}

export function KpiCards({ data }: { data: ReportsOverview }) {
  const onTrack = data.attendanceRate >= 80;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-bg-card rounded-xl p-6 shadow-card flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Average Sunday attendance</span>
          <div className="w-8 h-8 rounded-lg bg-bg-base flex items-center justify-center text-brand-purple">
            <Users size={18} />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-[28px] leading-8 font-bold text-text-primary tabular-nums">{Math.round(data.avgAttendance)}</span>
            <Delta value={data.avgDeltaPct} />
          </div>
          <p className="text-xs text-text-secondary mt-1">Over previous {data.sundayCount} consecutive Sundays</p>
        </div>
      </div>

      <div className="bg-bg-card rounded-xl p-6 shadow-card flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Overall attendance rate</span>
          <div className="w-8 h-8 rounded-lg bg-bg-base flex items-center justify-center text-brand-purple">
            <ClipboardCheck size={18} />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-[28px] leading-8 font-bold text-text-primary tabular-nums">{data.attendanceRate.toFixed(1)}%</span>
            <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${onTrack ? 'bg-present-bg text-present' : 'bg-pending-bg text-pending'}`}>
              {onTrack ? 'On track' : 'Needs push'}
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1">Based on {data.totalMembers} active member registry</p>
        </div>
      </div>

      <div className="bg-bg-card rounded-xl p-6 shadow-card flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">{data.sundayCount}-Sunday participation</span>
          <div className="w-8 h-8 rounded-lg bg-bg-base flex items-center justify-center text-brand-purple">
            <HeartHandshake size={18} />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-[28px] leading-8 font-bold text-brand-purple tabular-nums">{data.participation.toFixed(1)}%</span>
          </div>
          <p className="text-xs text-text-secondary mt-1">Active members present at least once in window</p>
        </div>
      </div>

      <div className="bg-bg-card rounded-xl p-6 shadow-card flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Consecutive absence alert</span>
          <div className="w-8 h-8 rounded-lg bg-absent-bg flex items-center justify-center text-brand-red">
            <BellRing size={18} />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-[28px] leading-8 font-bold text-brand-red tabular-nums">{data.absence.total}</span>
            <span className="text-[13px] text-text-secondary">members</span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-[11px]">
            <span className="text-pending bg-pending-bg px-1.5 py-0.5 rounded">{data.absence.twoOnly} abs (2 wks)</span>
            <span className="text-absent bg-absent-bg px-1.5 py-0.5 rounded font-bold">{data.absence.threePlus} abs (3+ wks)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
