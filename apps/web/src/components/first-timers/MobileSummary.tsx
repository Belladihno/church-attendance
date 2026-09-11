import { TrendingUp } from 'lucide-react';
import type { FirstTimerKpis } from './KpiCards';

function MiniMetric({
  label,
  value,
  sub,
  valueColor,
  subColor,
}: {
  label: string;
  value: number;
  sub: string;
  valueColor: string;
  subColor: string;
}) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-card border border-border/40 flex flex-col items-center text-center">
      <span className="text-[11px] text-text-secondary font-medium uppercase tracking-wide">{label}</span>
      <span className="text-[24px] font-bold mt-1 leading-none tabular-nums" style={{ color: valueColor }}>{value}</span>
      <span className="text-[11px] mt-1 font-medium" style={{ color: subColor }}>{sub}</span>
    </div>
  );
}

export function MobileSummary({ kpis, total }: { kpis: FirstTimerKpis; total: number }) {
  const conversionPct = total > 0 ? Math.round((kpis.converted / total) * 100) : null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-text-primary leading-tight tracking-tight">First Timers</h1>
          <p className="text-[13px] text-text-secondary mt-0.5">Harvest care &amp; visitor retention</p>
        </div>
        {conversionPct !== null && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-present-bg text-brand-green text-[12px] font-semibold shrink-0">
            <TrendingUp size={15} />
            <span>{conversionPct}% Converted</span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        <MiniMetric label="This Month" value={kpis.thisMonth} sub="Visitors" valueColor="#0F0A2E" subColor="#2D1B8B" />
        <MiniMetric label="Pending Care" value={kpis.pending} sub="Awaiting call" valueColor="#B45309" subColor="#B45309" />
        <MiniMetric label="Harvested" value={kpis.converted} sub="Converted" valueColor="#1A7A1A" subColor="#1A7A1A" />
      </div>
    </div>
  );
}
