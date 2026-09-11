export function MobileMetricStrip({
  total,
  recorded,
  present,
  absent,
  excused,
}: {
  total: number;
  recorded: number;
  present: number;
  absent: number;
  excused: number;
}) {
  const pct = total > 0 ? Math.round((recorded / total) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl p-3.5 shadow-card border border-border/70 flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-text-primary">Attendance Progress</span>
          <span className="text-[12px] font-medium text-text-secondary">· {recorded} of {total} recorded</span>
        </div>
        <span className="text-[13px] font-bold text-brand-purple bg-[#EAE7F8] px-2 py-0.5 rounded-full tabular-nums">{pct}%</span>
      </div>
      <div className="w-full h-1.5 bg-bg-base rounded-full overflow-hidden flex">
        <div className="bg-brand-purple h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <div className="grid grid-cols-3 divide-x divide-border/70 pt-1">
        <div className="flex flex-col items-center justify-center text-center py-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Present</span>
          </div>
          <span className="text-[18px] font-bold text-text-primary tracking-tight mt-0.5 tabular-nums">{present}</span>
        </div>
        <div className="flex flex-col items-center justify-center text-center py-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Absent</span>
          </div>
          <span className="text-[18px] font-bold text-text-primary tracking-tight mt-0.5 tabular-nums">{absent}</span>
        </div>
        <div className="flex flex-col items-center justify-center text-center py-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Excused</span>
          </div>
          <span className="text-[18px] font-bold text-text-primary tracking-tight mt-0.5 tabular-nums">{excused}</span>
        </div>
      </div>
    </div>
  );
}
