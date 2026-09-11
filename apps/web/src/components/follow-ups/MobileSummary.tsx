import { AlertTriangle, CheckCircle } from 'lucide-react';

export function MobileSummary({
  active,
  pending,
  contacted,
  twoOnly,
  threePlus,
}: {
  active: number;
  pending: number;
  contacted: number;
  twoOnly: number;
  threePlus: number;
}) {
  const rate = active > 0 ? Math.round((contacted / active) * 100) : 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1 pt-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-purple">Shepherd ministry</span>
        <h1 className="text-[24px] leading-7 font-bold text-text-primary tracking-tight">Pastoral care &amp; follow-ups</h1>
        <p className="text-[13px] text-text-secondary">Absence intervention &amp; visitor assimilation</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-border/60 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-medium text-text-secondary">Needing care</span>
            <div className="w-7 h-7 rounded-full bg-absent-bg flex items-center justify-center">
              <AlertTriangle size={15} className="text-brand-red" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[28px] font-bold text-brand-purple leading-none tracking-tight tabular-nums">{active}</span>
              <span className="text-[12px] text-text-secondary">members</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-absent-bg text-brand-red text-[10px] font-semibold tabular-nums">{twoOnly} • 2 wks</span>
              <span className="px-2 py-0.5 rounded-full bg-pending-bg text-pending text-[10px] font-semibold tabular-nums">{threePlus} • 3+ wks</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-border/60 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-medium text-text-secondary">Contact rate</span>
            <div className="w-7 h-7 rounded-full bg-present-bg flex items-center justify-center">
              <CheckCircle size={15} className="text-brand-green" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[28px] font-bold text-text-primary leading-none tracking-tight tabular-nums">{rate}%</span>
            </div>
            <div className="text-[11px] text-text-secondary mt-1">{contacted} of {active} contacted</div>
            <div className="w-full bg-bg-base rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-brand-green h-1.5 rounded-full" style={{ width: `${rate}%` }} />
            </div>
          </div>
        </div>
      </div>
      <div className="text-xs text-text-secondary/70">
        {pending} awaiting first contact
      </div>
    </div>
  );
}
